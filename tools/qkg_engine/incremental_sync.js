/**
 * OrangeHRM QKG Incremental Git Diff Sync Engine
 * Reads git diff between base commit/branch and target commit/HEAD,
 * parses only the modified/added/deleted files (PHP AST, Vue AST, Routes, Specs, Tests),
 * and updates Neo4j incrementally without purging historical baseline snapshots.
 * Generates a detailed Ingestion Delta Audit Report in JSON & Markdown.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv');
const neo4j = require('../node_modules/neo4j-driver');
const PhpAstExtractor = require('./php_ast_extractor');
const RoutesExtractor = require('./routes_extractor');
const VueAstExtractor = require('./vue_ast_extractor');
const GlobalSpecExtractor = require('./spec_extractor');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'admin123';

const workspaceRoot = path.resolve(__dirname, '..', '..');
const outputDir = path.join(__dirname, 'output');

// Parse CLI flags: --base <commit|branch> --head <commit|branch>
function getGitDiffFiles(baseRef = 'HEAD~1', headRef = 'HEAD') {
  try {
    const cmd = `git diff --name-status ${baseRef} ${headRef}`;
    const output = execSync(cmd, { cwd: workspaceRoot, encoding: 'utf8' });
    const lines = output.trim().split('\n').filter(Boolean);
    const changes = {
      added: [],
      modified: [],
      deleted: []
    };

    for (const line of lines) {
      const parts = line.split('\t');
      const status = parts[0].trim()[0]; // A, M, D, R
      const file = parts[1].trim();

      if (status === 'A') changes.added.push(file);
      else if (status === 'M') changes.modified.push(file);
      else if (status === 'D') changes.deleted.push(file);
      else if (status === 'R') {
        changes.deleted.push(file);
        if (parts[2]) changes.added.push(parts[2].trim());
      }
    }
    return changes;
  } catch (err) {
    console.warn(`[WARN] git diff failed with ${baseRef}..${headRef}, falling back to uncommitted diff`);
    const output = execSync('git status --porcelain', { cwd: workspaceRoot, encoding: 'utf8' });
    const changes = { added: [], modified: [], deleted: [] };
    for (const line of output.trim().split('\n').filter(Boolean)) {
      const code = line.substring(0, 2).trim();
      const file = line.substring(3).trim();
      if (code === 'A' || code === '??') changes.added.push(file);
      else if (code === 'M') changes.modified.push(file);
      else if (code === 'D') changes.deleted.push(file);
    }
    return changes;
  }
}

async function runIncrementalSync(baseRef, headRef) {
  console.log('========================================================================');
  console.log('      ORANGEHRM QKG: INCREMENTAL GIT DIFF SYNC ENGINE');
  console.log(`      Base Ref: ${baseRef || 'HEAD~1'} | Head Ref: ${headRef || 'HEAD'}`);
  console.log('========================================================================\n');

  const diff = getGitDiffFiles(baseRef, headRef);
  const allChangedFiles = [...diff.added, ...diff.modified, ...diff.deleted];
  console.log(`Discovered ${allChangedFiles.length} changed files across commits:`);
  console.log(`  - Added:    ${diff.added.length}`);
  console.log(`  - Modified: ${diff.modified.length}`);
  console.log(`  - Deleted:  ${diff.deleted.length}\n`);

  // Classify changed files
  const classified = {
    backendPhp: allChangedFiles.filter(f => f.startsWith('orange_hrm/src/plugins') && f.endsWith('.php') && !f.includes('/test/')),
    routesYaml: allChangedFiles.filter(f => f.endsWith('routes.yaml')),
    frontendVue: allChangedFiles.filter(f => f.startsWith('orange_hrm/src/client') && (f.endsWith('.vue') || f.endsWith('.ts')) && !f.endsWith('.d.ts')),
    specDocs: allChangedFiles.filter(f => f.startsWith('OrangeHRM_Baseline') && (f.endsWith('.md') || f.endsWith('.json')) && !f.includes('04_Test_Strategy')),
    testSuites: allChangedFiles.filter(f => f.includes('04_Test_Strategy') && (f.endsWith('.json') || f.endsWith('.csv')))
  };

  console.log('Classification of Changed Files:');
  console.log(`  - Backend PHP Files:       ${classified.backendPhp.length}`);
  console.log(`  - Route Configs:           ${classified.routesYaml.length}`);
  console.log(`  - Frontend Vue/TS Files:   ${classified.frontendVue.length}`);
  console.log(`  - Spec & Requirement Docs: ${classified.specDocs.length}`);
  console.log(`  - Test Strategy Suites:    ${classified.testSuites.length}\n`);

  if (allChangedFiles.length === 0) {
    console.log('No relevant file changes detected. Knowledge Graph is up to date.');
    return;
  }

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  const deltaStats = {
    classes_updated: 0,
    methods_updated: 0,
    endpoints_updated: 0,
    ui_components_updated: 0,
    relationships_created: 0,
    nodes_deleted: 0
  };

  try {
    // 1. Handle Deletions: Clean up nodes for removed files
    for (const dFile of diff.deleted) {
      if (dFile.endsWith('.php')) {
        const delRes = await session.run(`
          MATCH (c:Class { source_file: $f })
          OPTIONAL MATCH (c)-[:DECLARES]->(m:Method)
          DETACH DELETE c, m
          RETURN count(c) as delCount
        `, { f: dFile });
        deltaStats.nodes_deleted += delRes.records[0].get('delCount').toNumber();
      } else if (dFile.endsWith('.vue')) {
        const delRes = await session.run(`
          MATCH (uic:UIComponent { file: $f })
          DETACH DELETE uic
          RETURN count(uic) as delCount
        `, { f: dFile });
        deltaStats.nodes_deleted += delRes.records[0].get('delCount').toNumber();
      }
    }

    // 2. Incremental Backend PHP AST Parsing
    const phpFilesToParse = [...diff.added, ...diff.modified].filter(f => classified.backendPhp.includes(f));
    if (phpFilesToParse.length > 0) {
      console.log(`[Incremental] Parsing ${phpFilesToParse.length} modified/added PHP files...`);
      const phpExtractor = new PhpAstExtractor();
      for (const pFile of phpFilesToParse) {
        const full = path.join(workspaceRoot, pFile);
        if (!fs.existsSync(full)) continue;
        const parsed = phpExtractor.parseFile(full, pFile);
        if (parsed) {
          for (const cls of parsed.classes) {
            // Update Class
            await session.run(`
              MERGE (c:Class { fqcn: $fqcn })
              ON CREATE SET c.name = $name, c.namespace = $ns, c.source_file = $file, c.extends = $ext
              ON MATCH SET c.name = $name, c.namespace = $ns, c.source_file = $file, c.extends = $ext, c.updated_at = timestamp()
            `, { fqcn: cls.fqcn, name: cls.name, ns: cls.namespace, file: cls.source_file, ext: cls.extends });
            deltaStats.classes_updated++;

            // Update Methods
            for (const m of cls.methods) {
              await session.run(`
                MERGE (node:Method { signature: $sig })
                ON CREATE SET node.name = $mname, node.class_fqcn = $fqcn, node.source_file = $file
                ON MATCH SET node.name = $mname, node.updated_at = timestamp()
                WITH node
                MATCH (c:Class { fqcn: $fqcn })
                MERGE (c)-[:DECLARES]->(node)
              `, { sig: m.signature, mname: m.name, fqcn: cls.fqcn, file: cls.source_file });
              deltaStats.methods_updated++;
            }
          }
        }
      }
    }

    // 3. Incremental Frontend Vue & TypeScript AST Parsing
    const vueFilesToParse = [...diff.added, ...diff.modified].filter(f => classified.frontendVue.includes(f));
    if (vueFilesToParse.length > 0) {
      console.log(`[Incremental] Parsing ${vueFilesToParse.length} modified/added Vue/TS files...`);
      const vueExtractor = new VueAstExtractor(path.join(workspaceRoot, 'orange_hrm', 'src', 'client', 'src'));
      for (const vFile of vueFilesToParse) {
        const full = path.join(workspaceRoot, vFile);
        if (!fs.existsSync(full)) continue;
        const comp = vFile.endsWith('.vue') ? vueExtractor._parseVueFile(full) : vueExtractor._parseTsFile(full);
        if (comp) {
          await session.run(`
            MERGE (uic:UIComponent { component_id: $cid })
            ON CREATE SET uic.name = $name, uic.type = $type, uic.file = $file, uic.plugin = $plugin, uic.inputs = $inputs
            ON MATCH SET uic.name = $name, uic.file = $file, uic.inputs = $inputs, uic.updated_at = timestamp()
          `, { cid: comp.component_id, name: comp.name, type: comp.type, file: comp.file, plugin: comp.plugin, inputs: comp.inputs });
          deltaStats.ui_components_updated++;

          // Link calls endpoint
          for (const url of comp.api_calls) {
            await session.run(`
              MATCH (uic:UIComponent { component_id: $cid })
              MATCH (e:ApiEndpoint) WHERE e.path = $url OR e.path CONTAINS $url
              MERGE (uic)-[r:CALLS_ENDPOINT]->(e)
              ON CREATE SET r.evidence_type = 'AST', r.confidence = 1.0
            `, { cid: comp.component_id, url: url });
            deltaStats.relationships_created++;
          }
        }
      }
    }

    // 4. Incremental Route Parsing
    const routesToParse = [...diff.added, ...diff.modified].filter(f => classified.routesYaml.includes(f));
    if (routesToParse.length > 0) {
      console.log(`[Incremental] Parsing ${routesToParse.length} route files...`);
      for (const rFile of routesToParse) {
        const full = path.join(workspaceRoot, rFile);
        const parts = rFile.split('/');
        const plugin = parts[parts.indexOf('plugins') + 1];
        const endpoints = RoutesExtractor.parseRoutesFile(full, plugin);
        for (const ep of endpoints) {
          await session.run(`
            MERGE (e:ApiEndpoint { endpoint_id: $eid })
            ON CREATE SET e.http_method = $m, e.path = $p, e.route_name = $rn, e.plugin = $pl, e.handler_class = $h
            ON MATCH SET e.http_method = $m, e.path = $p, e.route_name = $rn, e.handler_class = $h, e.updated_at = timestamp()
          `, { eid: ep.endpoint_id, m: ep.http_method, p: ep.path, rn: ep.route_name, pl: ep.plugin, h: ep.handler_class });
          deltaStats.endpoints_updated++;
        }
      }
    }

    // 5. Test Impact Analysis (TIA) Traversal for modified methods & components
    console.log('\n[Incremental TIA] Computing Blast Radius for modified code artifacts...');
    const impactedRequirements = new Set();
    const impactedStories = new Set();
    const recommendedTests = [];

    // Check impacted methods
    for (const pFile of phpFilesToParse) {
      const res = await session.run(`
        MATCH (c:Class { source_file: $f })-[:DECLARES]->(m:Method)
        OPTIONAL MATCH (e:ApiEndpoint)-[:HANDLED_BY]->(c)
        OPTIONAL MATCH (f:Feature)-[:EXPOSES]->(e)
        OPTIONAL MATCH (us:UserStory)-[:BELONGS_TO]->(f)
        OPTIONAL MATCH (tc:TestCase)-[:TESTS]->(m)
        OPTIONAL MATCH (tcApi:TestCase)-[:EXECUTES_AGAINST]->(e)
        RETURN collect(DISTINCT us.story_id) as stories,
               collect(DISTINCT tc.testcase_id) as unitTests,
               collect(DISTINCT tcApi.testcase_id) as apiTests
      `, { f: pFile });
      if (res.records.length > 0) {
        const row = res.records[0];
        row.get('stories').forEach(s => impactedStories.add(s));
        row.get('unitTests').forEach(t => recommendedTests.push({ id: t, type: 'Unit' }));
        row.get('apiTests').forEach(t => recommendedTests.push({ id: t, type: 'API' }));
      }
    }

    // Check impacted UI components
    for (const vFile of vueFilesToParse) {
      const res = await session.run(`
        MATCH (uic:UIComponent { file: $f })
        OPTIONAL MATCH (us:UserStory)-[:IMPLEMENTED_BY]->(uic)
        OPTIONAL MATCH (tc:TestCase)-[:TESTS_COMPONENT]->(uic)
        RETURN collect(DISTINCT us.story_id) as stories,
               collect(DISTINCT tc.testcase_id) as uiTests
      `, { f: vFile });
      if (res.records.length > 0) {
        const row = res.records[0];
        row.get('stories').forEach(s => impactedStories.add(s));
        row.get('uiTests').forEach(t => recommendedTests.push({ id: t, type: 'UI' }));
      }
    }

    // Summary of current total graph
    const totalNodesRes = await session.run('MATCH (n) RETURN count(n) as total');
    const totalRelsRes = await session.run('MATCH ()-[r]->() RETURN count(r) as total');
    const currentNodes = totalNodesRes.records[0].get('total').toNumber();
    const currentRels = totalRelsRes.records[0].get('total').toNumber();

    // 6. Generate Ingestion Delta Audit Report
    const report = {
      sync_timestamp: new Date().toISOString(),
      base_ref: baseRef || 'HEAD~1',
      head_ref: headRef || 'HEAD',
      diff_summary: {
        total_files_changed: allChangedFiles.length,
        added: diff.added.length,
        modified: diff.modified.length,
        deleted: diff.deleted.length
      },
      delta_ingestion: deltaStats,
      graph_totals: {
        total_nodes: currentNodes,
        total_relationships: currentRels
      },
      test_impact_analysis: {
        affected_user_stories: Array.from(impactedStories),
        recommended_regression_tests_count: recommendedTests.length,
        sample_tests: recommendedTests.slice(0, 10)
      }
    };

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const reportJsonPath = path.join(outputDir, 'incremental_sync_report.json');
    const reportMdPath = path.join(outputDir, 'incremental_sync_report.md');

    fs.writeFileSync(reportJsonPath, JSON.stringify(report, null, 2));

    // Markdown Report for GitHub Actions PR Comment
    let md = `## 🚀 QKG Incremental Ingestion & Test Impact Analysis Report\n\n`;
    md += `**Commit Range:** \`${report.base_ref}\` $\\to$ \`${report.head_ref}\`  \n`;
    md += `**Sync Timestamp:** ${report.sync_timestamp}  \n`;
    md += `**Graph Total State:** **${currentNodes} Nodes** | **${currentRels} Relationships**  \n\n`;
    md += `### 1. Diff Ingestion Delta\n\n`;
    md += `| Category | Delta Count |\n| :--- | :---: |\n`;
    md += `| Classes Updated / Added | **${deltaStats.classes_updated}** |\n`;
    md += `| Methods Updated / Added | **${deltaStats.methods_updated}** |\n`;
    md += `| API Endpoints Synced | **${deltaStats.endpoints_updated}** |\n`;
    md += `| UI Components Synced | **${deltaStats.ui_components_updated}** |\n`;
    md += `| Relationships Created | **${deltaStats.relationships_created}** |\n`;
    md += `| Stale Nodes Cleaned | **${deltaStats.nodes_deleted}** |\n\n`;
    md += `### 2. Test Impact Analysis (TIA) Blast Radius\n\n`;
    md += `- **Affected User Stories:** ${report.test_impact_analysis.affected_user_stories.map(s => `\`${s}\``).join(', ') || 'None directly impacted'}\n`;
    md += `- **Recommended Selective Regression Tests:** **${recommendedTests.length} tests**\n\n`;
    if (recommendedTests.length > 0) {
      md += `| Test ID | Level |\n| :--- | :---: |\n`;
      recommendedTests.slice(0, 8).forEach(t => {
        md += `| \`${t.id}\` | ${t.type} |\n`;
      });
      if (recommendedTests.length > 8) {
        md += `| *...and ${recommendedTests.length - 8} more tests* | — |\n`;
      }
    }
    fs.writeFileSync(reportMdPath, md);

    console.log('\n========================================================================');
    console.log('         INCREMENTAL SYNC & TIA ANALYSIS COMPLETE');
    console.log('========================================================================');
    console.log(`Classes Updated:     ${deltaStats.classes_updated}`);
    console.log(`Methods Updated:     ${deltaStats.methods_updated}`);
    console.log(`UI Comps Updated:    ${deltaStats.ui_components_updated}`);
    console.log(`Endpoints Updated:   ${deltaStats.endpoints_updated}`);
    console.log(`Impacted Stories:    ${report.test_impact_analysis.affected_user_stories.length}`);
    console.log(`Selective Tests:     ${recommendedTests.length}`);
    console.log(`Current Graph Size:  ${currentNodes} Nodes | ${currentRels} Relationships`);
    console.log(`✓ Delta Report saved to: ${reportMdPath}\n`);

  } finally {
    await session.close();
    await driver.close();
  }
}

const baseArg = process.argv[2] || process.env.BASE_REF || 'HEAD~1';
const headArg = process.argv[3] || process.env.HEAD_REF || 'HEAD';

runIncrementalSync(baseArg, headArg).catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});

