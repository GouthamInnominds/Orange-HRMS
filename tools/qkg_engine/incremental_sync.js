/**
 * OrangeHRM QKG Incremental Git Diff Sync & PR Blast-Radius Engine
 *
 * Updates modified/added/deleted PHP, Vue, Routes, and Test files incrementally
 * (using canonical orange_hrm/ paths, DECLARES, and ExternalClass isolation) and
 * executes multi-channel TIA via shared TIAEngine without full-wipe.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
try {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
} catch (_) {}

const neo4j = require('neo4j-driver');
const PhpAstExtractor = require('./php_ast_extractor');
const RoutesExtractor = require('./routes_extractor');
const VueAstExtractor = require('./vue_ast_extractor');
const { collectQaSpecs, persistQaSpecsToNeo4j } = require('./qa_spec_ingestor');
const { TIAEngine } = require('./tia_engine');
const {
  WORKSPACE_ROOT,
  CLIENT_SRC_DIR,
  QA_REPO_DIR,
  REPOS,
  toRepoRelPath,
  extractPluginFromPath,
  getQaGitMetadata
} = require('./qkg_config');
const ontology = require('./ontology');

const outputDir = path.join(__dirname, 'output');

function getGitDiffInRepo(repoDir, baseRef = 'HEAD~1', headRef = 'HEAD', pathNormalizer = (p) => String(p || '').replace(/\\/g, '/')) {
  const changes = { added: [], modified: [], deleted: [] };
  if (!repoDir || !fs.existsSync(repoDir)) return changes;
  try {
    const output = execFileSync('git', ['diff', '--name-status', baseRef, headRef], {
      cwd: repoDir,
      encoding: 'utf8'
    });
    for (const line of output.trim().split('\n').filter(Boolean)) {
      const parts = line.split('\t');
      const status = parts[0].trim()[0];
      const file = pathNormalizer(parts[1].trim());
      if (status === 'A') changes.added.push(file);
      else if (status === 'M') changes.modified.push(file);
      else if (status === 'D') changes.deleted.push(file);
      else if (status === 'R') {
        changes.deleted.push(file);
        if (parts[2]) changes.added.push(pathNormalizer(parts[2].trim()));
      }
    }
    return changes;
  } catch (_) {
    try {
      const porcelain = execFileSync('git', ['status', '--porcelain'], {
        cwd: repoDir,
        encoding: 'utf8'
      });
      for (const line of porcelain.trim().split('\n').filter(Boolean)) {
        const code = line.substring(0, 2).trim();
        const file = pathNormalizer(line.substring(3).trim());
        if (code === 'A' || code === '??') changes.added.push(file);
        else if (code === 'M') changes.modified.push(file);
        else if (code === 'D') changes.deleted.push(file);
      }
    } catch (_) {}
    return changes;
  }
}

function getGitDiffFiles(baseRef = 'HEAD~1', headRef = 'HEAD') {
  return getGitDiffInRepo(WORKSPACE_ROOT, baseRef, headRef, toRepoRelPath);
}

function buildMarkdownReport(report) {
  const tia = report.tia || {};
  const tests = tia.impactedRegressionTests || [];
  const gaps = tia.newTestGenerationBacklog || [];

  let md = `## QKG Incremental Sync & Multi-Channel TIA Report\n\n`;
  md += `**Commit Range:** \`${report.base_ref}\` -> \`${report.head_ref}\`  \n`;
  md += `**Analysis Status:** \`${tia.analysisStatus || 'UNKNOWN'}\` | **Risk Gate:** \`${tia.riskAssessment?.gateStatus || 'UNKNOWN'}\` (${tia.riskAssessment?.score ?? 0}/100)  \n`;
  md += `**Graph Snapshot:** \`${tia.snapshotMetadata?.snapshotId || 'N/A'}\` (${report.graph_totals.total_nodes} Nodes, ${report.graph_totals.total_relationships} Relationships)  \n\n`;

  md += `### 1. Diff Summary & Graph Delta\n`;
  md += `- Changed files: **${report.diff_summary.total_files_changed}** (+${report.diff_summary.added} / ~${report.diff_summary.modified} / -${report.diff_summary.deleted})\n`;
  md += `- Graph updates: ${report.delta_ingestion.classes_updated} classes, ${report.delta_ingestion.methods_updated} methods, ${report.delta_ingestion.endpoints_updated} endpoints, ${report.delta_ingestion.ui_components_updated} UI components, ${report.delta_ingestion.nodes_deleted} deleted\n\n`;

  md += `### 2. Multi-Channel Impacted Regression Tests (${tests.length})\n`;
  if (tests.length > 0) {
    md += `| Test ID | Suite | Channel | Status Hint | Reason |\n| :--- | :--- | :--- | :--- | :--- |\n`;
    for (const t of tests.slice(0, 20)) {
      md += `| \`${t.id}\` | \`${t.suite}\` | ${t.impactChannel} | ${t.statusHint} | ${(t.reasons || []).slice(0, 2).join('; ')} |\n`;
    }
  } else {
    md += `_No automated regression tests directly impacted._\n`;
  }

  md += `\n### 3. New Test Generation Backlog (${gaps.length} Untested Gaps)\n`;
  if (gaps.length > 0) {
    for (const g of gaps.slice(0, 15)) {
      md += `- **${g.targetType}** \`${g.targetName || g.targetId}\` (${g.plugin || 'core'}) -> Needs **${g.suggestedTestLayer}** tests (\`${g.gapReason}\`)\n`;
    }
  } else {
    md += `_All impacted code/endpoint/UI artifacts already have linked automated tests._\n`;
  }

  return md;
}

async function runIncrementalSync(baseRef = 'HEAD~1', headRef = 'HEAD', options = {}) {
  const uri = options.uri || process.env.NEO4J_URI || 'bolt://localhost:7687';
  const user = options.user || process.env.NEO4J_USER || 'neo4j';
  const password = options.password || process.env.NEO4J_PASSWORD || 'admin123';
  const database = options.database || process.env.NEO4J_DATABASE || 'neo4j';
  const simulateOnly = Boolean(options.simulateOnly);

  const diff = getGitDiffFiles(baseRef, headRef);
  const qaBase = options.qaBase || process.env.QA_BASE_REF || null;
  const qaHead = options.qaHead || process.env.QA_HEAD_REF || 'HEAD';
  const qaDiff = (QA_REPO_DIR && fs.existsSync(QA_REPO_DIR))
    ? (qaBase
      ? getGitDiffInRepo(QA_REPO_DIR, qaBase, qaHead)
      : getGitDiffInRepo(QA_REPO_DIR, '__working_tree__', 'HEAD'))
    : { added: [], modified: [], deleted: [] };
  const changedQaSpecs = [...new Set([...qaDiff.added, ...qaDiff.modified])].filter(
    (f) => /\.(?:spec|cy)\.(?:ts|tsx|js|jsx)$/i.test(f) && !f.includes('/suites/')
  );
  const deletedQaSpecs = qaDiff.deleted.filter((f) => /\.(?:spec|cy)\.(?:ts|tsx|js|jsx)$/i.test(f));

  const allChangedFiles = [...new Set([...diff.added, ...diff.modified, ...diff.deleted, ...changedQaSpecs, ...deletedQaSpecs])];
  const backendPhp = [...diff.added, ...diff.modified].filter(
    (f) => f.endsWith('.php') && (f.startsWith('orange_hrm/src/plugins/') || f.startsWith('orange_hrm/src/lib/')) && !f.includes('/test/')
  );
  const routesYaml = [...diff.added, ...diff.modified].filter((f) => f.endsWith('routes.yaml'));
  const frontendVue = [...diff.added, ...diff.modified].filter(
    (f) => f.startsWith('orange_hrm/src/client/src/') && (f.endsWith('.vue') || f.endsWith('.ts')) && !f.endsWith('.d.ts') && !f.endsWith('.spec.ts')
  );

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session({ database });
  const runSessionQuery = async (cypher, params = {}) => {
    const res = await session.run(cypher, params);
    return res.records.map((rec) => {
      const obj = {};
      rec.keys.forEach((k) => {
        const val = rec.get(k);
        obj[k] = val && typeof val === 'object' && val.properties ? val.properties : val;
      });
      return obj;
    });
  };

  const deltaStats = {
    classes_updated: 0,
    methods_updated: 0,
    endpoints_updated: 0,
    ui_components_updated: 0,
    qa_tests_updated: 0,
    nodes_deleted: 0
  };

  try {
    if (!simulateOnly) {
      let currentHead = 'local-working-tree';
      let branch = 'v2-main';
      try {
        currentHead = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: WORKSPACE_ROOT, encoding: 'utf8' }).trim();
        branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: WORKSPACE_ROOT, encoding: 'utf8' }).trim();
      } catch (_) {}
      const { qaCommit, qaRepoConfigured } = getQaGitMetadata();
      const syncSnapshotId = `snap-inc-${Date.now()}-${currentHead.slice(0, 8)}`;

      // Commit mismatch guard against last PUBLISHED snapshot
      if (!options.allowCommitMismatch && baseRef && !baseRef.includes('HEAD')) {
        const latestRes = await session.run(`
          MATCH (s:GraphSnapshot { status: 'PUBLISHED' })
          RETURN s.app_commit AS appCommit
          ORDER BY coalesce(s.published_at, s.started_at) DESC LIMIT 1
        `);
        const snapCommit = latestRes.records[0]?.get('appCommit');
        if (snapCommit && snapCommit !== 'local-working-tree') {
          let resolvedBase = baseRef;
          try {
            resolvedBase = execFileSync('git', ['rev-parse', baseRef], { cwd: WORKSPACE_ROOT, encoding: 'utf8' }).trim();
          } catch (_) {}
          if (resolvedBase && snapCommit !== resolvedBase) {
            throw new Error(`CommitMismatch: baseRef ${baseRef} (${resolvedBase}) differs from published GraphSnapshot app_commit (${snapCommit}). Pass allowCommitMismatch or run full --clean rebuild.`);
          }
        }
      }

      for (const dFile of diff.deleted) {
        if (dFile.endsWith('.php')) {
          const delRes = await session.run(`
            MATCH (c:Class|Interface|Trait { source_file: $f })
            OPTIONAL MATCH (c)-[:DECLARES]->(m:Method)
            DETACH DELETE c, m
            RETURN count(DISTINCT c) AS cnt
          `, { f: dFile });
          deltaStats.nodes_deleted += delRes.records[0]?.get('cnt').toNumber() || 0;
        } else if (dFile.endsWith('.vue')) {
          const delRes = await session.run(`
            MATCH (ui:UIComponent { file: $f })
            DETACH DELETE ui
            RETURN count(ui) AS cnt
          `, { f: dFile });
          deltaStats.nodes_deleted += delRes.records[0]?.get('cnt').toNumber() || 0;
        }
      }

      if (backendPhp.length > 0) {
        const phpExtractor = new PhpAstExtractor();
        for (const pFile of backendPhp) {
          const full = path.join(WORKSPACE_ROOT, pFile);
          if (!fs.existsSync(full)) continue;
          const parsed = phpExtractor.parseFile(full, pFile);
          if (!parsed) continue;
          const plugin = extractPluginFromPath(pFile) || 'orangehrmCorePlugin';
          for (const cls of [...parsed.classes, ...parsed.interfaces, ...parsed.traits]) {
            const label = parsed.classes.includes(cls) ? 'Class' : (parsed.interfaces.includes(cls) ? 'Interface' : 'Trait');
            await session.run(`
              MERGE (c:${label} { fqcn: $fqcn })
              SET c.name = $name, c.namespace = $ns, c.source_file = $file, c.plugin = $plugin,
                  c.introduced_in = coalesce(c.introduced_in, CASE WHEN $plugin = 'orangehrmPayrollPlugin' THEN 'v2.2-india-payroll' ELSE 'v1.0' END),
                  c.snapshot_id = $syncSnapshotId,
                  c.updated_at = timestamp()
              WITH c
              OPTIONAL MATCH (p:Plugin { name: $plugin })
              FOREACH (_ IN CASE WHEN p IS NOT NULL THEN [1] ELSE [] END | MERGE (p)-[:DECLARES]->(c))
            `, { fqcn: cls.fqcn, name: cls.name, ns: cls.namespace || '', file: cls.source_file, plugin, syncSnapshotId });
            deltaStats.classes_updated++;

            for (const m of cls.methods || []) {
              await session.run(`
                MERGE (node:Method { signature: $sig })
                SET node.name = $mname, node.class_fqcn = $fqcn, node.source_file = $file,
                    node.plugin = $plugin,
                    node.introduced_in = coalesce(node.introduced_in, CASE WHEN $plugin = 'orangehrmPayrollPlugin' THEN 'v2.2-india-payroll' ELSE 'v1.0' END),
                    node.snapshot_id = $syncSnapshotId,
                    node.updated_at = timestamp()
                WITH node
                MATCH (c:${label} { fqcn: $fqcn })
                MERGE (c)-[:DECLARES]->(node)
              `, { sig: m.signature, mname: m.name, fqcn: cls.fqcn, file: m.source_file || cls.source_file, plugin, syncSnapshotId });
              deltaStats.methods_updated++;
            }
          }
        }
      }

      if (frontendVue.length > 0) {
        const vueExtractor = new VueAstExtractor(CLIENT_SRC_DIR);
        for (const vFile of frontendVue) {
          const full = path.join(WORKSPACE_ROOT, vFile);
          if (!fs.existsSync(full) || !vFile.endsWith('.vue')) continue;
          const comp = vueExtractor._parseVueFile(full);
          if (!comp) continue;
          await session.run(`
            MERGE (ui:UIComponent { component_id: $cid })
            SET ui.name = $name, ui.type = $type, ui.file = $file, ui.plugin = $plugin,
                ui.inputs = $inputs,
                ui.introduced_in = coalesce(ui.introduced_in, CASE WHEN $plugin = 'orangehrmPayrollPlugin' THEN 'v2.2-india-payroll' ELSE 'v1.0' END),
                ui.snapshot_id = $syncSnapshotId,
                ui.updated_at = timestamp()
          `, { cid: comp.component_id, name: comp.name, type: comp.type, file: comp.file, plugin: comp.plugin, inputs: comp.inputs, syncSnapshotId });
          deltaStats.ui_components_updated++;
        }
      }

      if (routesYaml.length > 0) {
        for (const rFile of routesYaml) {
          const full = path.join(WORKSPACE_ROOT, rFile);
          if (!fs.existsSync(full)) continue;
          const plugin = extractPluginFromPath(rFile) || 'orangehrmCorePlugin';
          const endpoints = RoutesExtractor.parseRoutesFile(full, plugin);
          for (const ep of endpoints) {
            await session.run(`
              MERGE (e:ApiEndpoint { endpoint_id: $eid })
              SET e.http_method = $m, e.path = $p, e.route_name = $rn, e.plugin = $pl,
                  e.handler_class = $hc, e.handler_fqcn = $hf, e.source_file = $sf,
                  e.endpoint_kind = $ek,
                  e.introduced_in = coalesce(e.introduced_in, CASE WHEN $pl = 'orangehrmPayrollPlugin' THEN 'v2.2-india-payroll' ELSE 'v1.0' END),
                  e.snapshot_id = $syncSnapshotId,
                  e.updated_at = timestamp()
              WITH e
              OPTIONAL MATCH (c:Class { fqcn: $hf })
              FOREACH (_ IN CASE WHEN c IS NOT NULL THEN [1] ELSE [] END |
                MERGE (c)-[:EXPOSES { evidence_type: 'SYMFONY_ROUTE_YAML', snapshot_id: $syncSnapshotId }]->(e)
                MERGE (e)-[:HANDLED_BY { evidence_type: 'SYMFONY_ROUTE_YAML', confidence: 1.0, snapshot_id: $syncSnapshotId }]->(c)
              )
            `, {
              eid: ep.endpoint_id, m: ep.http_method, p: ep.path, rn: ep.route_name,
              pl: ep.plugin, hc: ep.handler_class, hf: ep.handler_fqcn, sf: ep.source_file,
              ek: ep.endpoint_kind || 'REST_API', syncSnapshotId
            });
            deltaStats.endpoints_updated++;
          }
        }
      }

      // Sync deleted/modified/added QA repo specs (`--qa-base`..`--qa-head`)
      for (const dqFile of [...deletedQaSpecs, ...changedQaSpecs]) {
        const delQaRes = await session.run(`
          MATCH (tc:TestCase { file: $f, repo: $qaRepo })
          DETACH DELETE tc
          RETURN count(tc) AS cnt
        `, { f: dqFile, qaRepo: REPOS.QA });
        if (deletedQaSpecs.includes(dqFile)) {
          deltaStats.nodes_deleted += delQaRes.records[0]?.get('cnt').toNumber() || 0;
        }
      }
      if (changedQaSpecs.length > 0) {
        const qaData = collectQaSpecs({ qaRepoDir: QA_REPO_DIR, qaCommit, files: changedQaSpecs });
        const qaRes = await persistQaSpecsToNeo4j(session, qaData, { snapshotId: syncSnapshotId, qaCommit });
        deltaStats.qa_tests_updated += qaRes.testCases;
      }

      // Publish immutable incremental GraphSnapshot linked to PREVIOUS_SNAPSHOT + Commit
      const nowIso = new Date().toISOString();
      await session.run(`
        MERGE (c:Commit { sha: $head })
        ON CREATE SET c.repo = $appRepo, c.branch = $branch, c.first_seen_at = $nowIso
        SET c.last_seen_at = $nowIso
        WITH c
        OPTIONAL MATCH (prev:GraphSnapshot { status: 'PUBLISHED' })
        WHERE prev.snapshot_id <> $syncSnapshotId
        WITH c, prev ORDER BY coalesce(prev.published_at, prev.started_at) DESC LIMIT 1
        FOREACH (_ IN CASE WHEN prev IS NOT NULL THEN [1] ELSE [] END |
          SET prev.status = 'SUPERSEDED'
        )
        MERGE (s:GraphSnapshot { snapshot_id: $syncSnapshotId })
        SET s.app_commit = $head,
            s.qa_commit = $qaCommit,
            s.qa_repo_configured = $qaRepoConfigured,
            s.branch = $branch,
            s.status = 'PUBLISHED',
            s.sync_mode = 'INCREMENTAL',
            s.schema_version = $schemaVersion,
            s.extractor_version = '2.1.0',
            s.started_at = $nowIso,
            s.published_at = $nowIso
        MERGE (s)-[:RECORDED_COMMIT]->(c)
        FOREACH (_ IN CASE WHEN prev IS NOT NULL THEN [1] ELSE [] END |
          MERGE (s)-[:PREVIOUS_SNAPSHOT]->(prev)
        )
      `, {
        syncSnapshotId,
        head: currentHead,
        appRepo: REPOS.APP,
        qaCommit,
        qaRepoConfigured,
        branch,
        schemaVersion: ontology.meta.schema_version,
        nowIso
      });
    }

    const tiaEngine = new TIAEngine(runSessionQuery);
    const tia = await tiaEngine.analyzeFiles(allChangedFiles, {
      title: `Git Diff ${baseRef}..${headRef}`,
      skipStalenessCheck: simulateOnly
    });

    const totalsRes = await session.run('MATCH (n) RETURN count(n) AS nodes');
    const relsRes = await session.run('MATCH ()-[r]->() RETURN count(r) AS rels');
    const totalNodes = totalsRes.records[0]?.get('nodes').toNumber() || 0;
    const totalRels = relsRes.records[0]?.get('rels').toNumber() || 0;

    const report = {
      sync_timestamp: new Date().toISOString(),
      base_ref: baseRef,
      head_ref: headRef,
      simulate_only: simulateOnly,
      diff_summary: {
        total_files_changed: allChangedFiles.length,
        added: diff.added.length,
        modified: diff.modified.length,
        deleted: diff.deleted.length
      },
      delta_ingestion: deltaStats,
      graph_totals: { total_nodes: totalNodes, total_relationships: totalRels },
      tia
    };

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'incremental_sync_report.json'), JSON.stringify(report, null, 2));
    fs.writeFileSync(path.join(outputDir, 'incremental_sync_report.md'), buildMarkdownReport(report));

    return report;
  } finally {
    await session.close();
    await driver.close();
  }
}

if (require.main === module) {
  const rawArgs = process.argv.slice(2);
  const simulateOnly = rawArgs.includes('--simulate');
  const qaBaseIdx = rawArgs.indexOf('--qa-base');
  const qaHeadIdx = rawArgs.indexOf('--qa-head');
  const qaBase = qaBaseIdx !== -1 ? rawArgs[qaBaseIdx + 1] : undefined;
  const qaHead = qaHeadIdx !== -1 ? rawArgs[qaHeadIdx + 1] : undefined;

  const positional = [];
  for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i] === '--qa-base' || rawArgs[i] === '--qa-head') {
      i++;
      continue;
    }
    if (rawArgs[i].startsWith('--')) continue;
    positional.push(rawArgs[i]);
  }
  const baseArg = positional[0] || process.env.BASE_REF || 'HEAD~1';
  const headArg = positional[1] || process.env.HEAD_REF || 'HEAD';

  runIncrementalSync(baseArg, headArg, { simulateOnly, qaBase, qaHead })
    .then((report) => {
      console.log(`Incremental Sync (${report.base_ref}..${report.head_ref}) Status=${report.tia.analysisStatus} | Candidates=${report.tia.summary.candidateTestsCount} | Gaps=${report.tia.summary.backlogGapsCount}`);
    })
    .catch((err) => {
      console.error('[FATAL]', err);
      process.exit(1);
    });
}

module.exports = { runIncrementalSync, getGitDiffFiles, buildMarkdownReport };
