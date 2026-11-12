/**
 * Unified QKG Ingestion Pipeline (All 23 Plugins, Staging-First with Snapshot Swap)
 *
 * Usage:
 *   node qkg_engine/ingest_pipeline.js --staging --clean
 *   node qkg_engine/ingest_pipeline.js --promote     (runs --staging --clean, validates 16/16, then promotes to 7687 and validates 16/16)
 *   node qkg_engine/ingest_pipeline.js --uri bolt://localhost:7688 --clean
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
try {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
} catch (_) {
  // Optional dotenv
}

const neo4j = require('neo4j-driver');
const {
  WORKSPACE_ROOT,
  ORANGE_HRM_ROOT,
  PLUGINS_DIR,
  LIB_DIR,
  CLIENT_SRC_DIR,
  BASELINE_DIR,
  PAYROLL_EXT_DIR,
  SNAPSHOT_RETENTION_LIMIT,
  REPOS,
  toRepoRelPath,
  extractPluginFromPath,
  getQaGitMetadata
} = require('./qkg_config');

const PhpAstExtractor = require('./php_ast_extractor');
const SymbolResolver = require('./symbol_resolver');
const RoutesExtractor = require('./routes_extractor');
const VueAstExtractor = require('./vue_ast_extractor');
const TestLinker = require('./test_linker');
const SchemaFkExtractor = require('./schema_fk_extractor');
const {
  buildManifestFromExtractedData,
  buildCompactNeo4jManifestHeader,
  writeManifestArtifact,
  loadManifest
} = require('./snapshot_manifest');
const DoctrineAccessExtractor = require('./doctrine_access_extractor');
const DbColumnMigrationExtractor = require('./db_column_migration_extractor');
const { collectQaSpecs, persistQaSpecsToNeo4j } = require('./qa_spec_ingestor');
const SymfonyExtractor = require('./symfony_extractor');
const GlobalSpecExtractor = require('./spec_extractor');
const { resolveRequirementAlias, normalizeParamPath } = GlobalSpecExtractor;
const { ingestPayrollSpecsAndVersioning } = require('./ingest_payroll_and_version_graph');
const { validateGoldenDataset } = require('./validate_golden_dataset');
const ontology = require('./ontology');

function walkFiles(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'vendor' || ent.name === 'node_modules' || ent.name === 'test') continue;
      walkFiles(full, predicate, out);
    } else if (ent.isFile() && predicate(ent.name, full)) {
      out.push(full);
    }
  }
  return out;
}

function getGitMetadata() {
  try {
    const appCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: WORKSPACE_ROOT, encoding: 'utf8' }).trim();
    const branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: WORKSPACE_ROOT, encoding: 'utf8' }).trim();
    return { appCommit, branch };
  } catch (_) {
    return { appCommit: 'local-working-tree', branch: 'v2-main' };
  }
}

async function runBatched(session, rows, batchSize, cypher, extraParams = {}) {
  if (!rows || rows.length === 0) return;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    await session.run(cypher, { ...extraParams, batch });
  }
}

async function applySchemaConstraints(session) {
  const statements = [
    'CREATE CONSTRAINT qkg_plugin_name IF NOT EXISTS FOR (n:Plugin) REQUIRE n.name IS UNIQUE',
    'CREATE CONSTRAINT qkg_release_id IF NOT EXISTS FOR (n:Release) REQUIRE n.version_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_snapshot_id IF NOT EXISTS FOR (n:GraphSnapshot) REQUIRE n.snapshot_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_commit_sha IF NOT EXISTS FOR (n:Commit) REQUIRE n.sha IS UNIQUE',
    'CREATE CONSTRAINT qkg_domain_id IF NOT EXISTS FOR (n:BusinessDomain) REQUIRE n.domain_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_wf_id IF NOT EXISTS FOR (n:BusinessWorkflow) REQUIRE n.workflow_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_feature_id IF NOT EXISTS FOR (n:Feature) REQUIRE n.feature_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_reqgrp_id IF NOT EXISTS FOR (n:RequirementGroup) REQUIRE n.group_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_req_id IF NOT EXISTS FOR (n:Requirement) REQUIRE n.requirement_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_rule_id IF NOT EXISTS FOR (n:BusinessRule) REQUIRE n.rule_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_persona_id IF NOT EXISTS FOR (n:Persona) REQUIRE n.persona_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_story_id IF NOT EXISTS FOR (n:UserStory) REQUIRE n.story_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_class_fqcn IF NOT EXISTS FOR (n:Class) REQUIRE n.fqcn IS UNIQUE',
    'CREATE CONSTRAINT qkg_iface_fqcn IF NOT EXISTS FOR (n:Interface) REQUIRE n.fqcn IS UNIQUE',
    'CREATE CONSTRAINT qkg_trait_fqcn IF NOT EXISTS FOR (n:Trait) REQUIRE n.fqcn IS UNIQUE',
    'CREATE CONSTRAINT qkg_method_sig IF NOT EXISTS FOR (n:Method) REQUIRE n.signature IS UNIQUE',
    'CREATE CONSTRAINT qkg_endpoint_id IF NOT EXISTS FOR (n:ApiEndpoint) REQUIRE n.endpoint_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_uicomp_id IF NOT EXISTS FOR (n:UIComponent) REQUIRE n.component_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_uipage_id IF NOT EXISTS FOR (n:UIPage) REQUIRE n.page_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_entity_fqcn IF NOT EXISTS FOR (n:DatabaseEntity) REQUIRE n.fqcn IS UNIQUE',
    'CREATE CONSTRAINT qkg_table_name IF NOT EXISTS FOR (n:DatabaseTable) REQUIRE n.name IS UNIQUE',
    'CREATE CONSTRAINT qkg_col_id IF NOT EXISTS FOR (n:DatabaseColumn) REQUIRE n.column_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_migration_id IF NOT EXISTS FOR (n:SchemaMigration) REQUIRE n.migration_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_suite_name IF NOT EXISTS FOR (n:TestSuite) REQUIRE n.name IS UNIQUE',
    'CREATE CONSTRAINT qkg_tc_id IF NOT EXISTS FOR (n:TestCase) REQUIRE n.testcase_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_tc_canonical IF NOT EXISTS FOR (n:TestCase) REQUIRE n.canonical_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_event_id IF NOT EXISTS FOR (n:Event) REQUIRE n.event_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_doc_id IF NOT EXISTS FOR (n:Document) REQUIRE n.doc_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_covrun_id IF NOT EXISTS FOR (n:CoverageRun) REQUIRE n.run_id IS UNIQUE',
    'CREATE CONSTRAINT qkg_testrun_id IF NOT EXISTS FOR (n:TestRun) REQUIRE n.run_id IS UNIQUE',
    'CREATE INDEX idx_class_src IF NOT EXISTS FOR (n:Class) ON (n.source_file)',
    'CREATE INDEX idx_iface_src IF NOT EXISTS FOR (n:Interface) ON (n.source_file)',
    'CREATE INDEX idx_trait_src IF NOT EXISTS FOR (n:Trait) ON (n.source_file)',
    'CREATE INDEX idx_method_cls IF NOT EXISTS FOR (n:Method) ON (n.class_fqcn)',
    'CREATE INDEX idx_col_table IF NOT EXISTS FOR (n:DatabaseColumn) ON (n.table_name)',
    'CREATE INDEX idx_uicomp_file IF NOT EXISTS FOR (n:UIComponent) ON (n.file)',
    'CREATE INDEX idx_tc_file IF NOT EXISTS FOR (n:TestCase) ON (n.file)',
    'CREATE INDEX idx_tc_plugin IF NOT EXISTS FOR (n:TestCase) ON (n.plugin)'
  ];

  // Drop old ambiguous constraints without IF NOT EXISTS property collisions if needed
  try {
    const existing = await session.run('SHOW CONSTRAINTS');
    for (const rec of existing.records) {
      const name = rec.get('name');
      const labels = rec.get('labelsOrTypes') || [];
      const props = rec.get('properties') || [];
      // Drop legacy Trait.name / Interface.name uniqueness constraints that blocked same short-names in different namespaces
      if ((labels.includes('Interface') || labels.includes('Trait')) && props.includes('name')) {
        await session.run(`DROP CONSTRAINT ${name} IF EXISTS`);
      }
    }
  } catch (_) {
    // Ignore SHOW CONSTRAINTS permission differences
  }

  for (const stmt of statements) {
    try {
      await session.run(stmt);
    } catch (err) {
      if (!String(err.message).includes('already exists') && !String(err.message).includes('equivalent')) {
        console.warn(`Constraint warning (${stmt}): ${err.message}`);
      }
    }
  }
}

async function extractWorkspaceSnapshot({ connectMariaDb = true } = {}) {
  const deadLetters = [];
  const phpExtractor = new PhpAstExtractor();
  const prodParsedFiles = [];

  const pluginNames = fs.existsSync(PLUGINS_DIR) ? fs.readdirSync(PLUGINS_DIR).sort() : [];
  for (const pName of pluginNames) {
    for (const absFile of walkFiles(path.join(PLUGINS_DIR, pName), (n) => n.endsWith('.php'))) {
      try {
        const parsed = phpExtractor.parseFile(absFile, toRepoRelPath(absFile));
        if (parsed) prodParsedFiles.push(parsed);
      } catch (err) {
        deadLetters.push({ stage: 'php_ast', file: toRepoRelPath(absFile), error: err.message });
      }
    }
  }
  for (const absFile of walkFiles(LIB_DIR, (n) => n.endsWith('.php'))) {
    try {
      const parsed = phpExtractor.parseFile(absFile, toRepoRelPath(absFile));
      if (parsed) prodParsedFiles.push(parsed);
    } catch (err) {
      deadLetters.push({ stage: 'php_ast_lib', file: toRepoRelPath(absFile), error: err.message });
    }
  }

  const symbolResolver = new SymbolResolver(prodParsedFiles);
  const { resolvedEdges: callEdges, diagnostics: callDiagnostics } = symbolResolver.resolveAllCalls();

  const apiEndpoints = [];
  for (const pName of pluginNames) {
    const routesFile = path.join(PLUGINS_DIR, pName, 'config', 'routes.yaml');
    if (fs.existsSync(routesFile)) {
      apiEndpoints.push(...RoutesExtractor.parseRoutesFile(routesFile, pName));
    }
  }

  const frontend = new VueAstExtractor(CLIENT_SRC_DIR).extractAll();
  const schemaData = await new SchemaFkExtractor().extractAll({ prodParsedFiles, connectMariaDb });
  const doctrineAccess = new DoctrineAccessExtractor().extractAll({
    prodParsedFiles,
    knownTables: schemaData.tables.map((t) => t.name),
    symbolResolver
  });
  const dbColumnData = await new DbColumnMigrationExtractor().extractAll({
    prodParsedFiles,
    fkEdges: schemaData.fkEdges,
    callEdges,
    connectMariaDb
  });
  const symfonyData = new SymfonyExtractor().extractAll({
    prodParsedFiles,
    uiPages: frontend.pages
  });

  const testLinkData = new TestLinker({
    phpExtractor,
    prodResolver: symbolResolver,
    prodParsedFiles,
    apiEndpoints,
    frontendItems: frontend.components
  }).linkAll();
  const qaData = collectQaSpecs();

  const baselineExtractor = new GlobalSpecExtractor(BASELINE_DIR);
  const baselineSpecs = baselineExtractor.extractAllSpecifications();
  const baselineSuitesMap = baselineExtractor.loadAllTestSuites();
  const storyTargets = baselineExtractor.resolveStoryTargets(
    baselineSpecs.userStories,
    baselineSpecs.domains,
    apiEndpoints,
    frontend.components
  );

  // Markdown documentation inventory across Baseline v1.0 & Payroll v2.2
  const documents = [];
  for (const [dirRoot, ver] of [[BASELINE_DIR, 'v1.0'], [PAYROLL_EXT_DIR, 'v2.2-india-payroll']]) {
    if (!fs.existsSync(dirRoot)) continue;
    const walkDocs = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name);
        if (e.isDirectory()) walkDocs(f);
        else if (e.isFile() && e.name.endsWith('.md')) {
          const rel = toRepoRelPath(f);
          documents.push({
            doc_id: rel,
            title: e.name.replace(/\.md$/, '').replace(/_/g, ' '),
            file: rel,
            version: ver,
            introduced_in: ver,
            plugin: ver.includes('payroll') ? 'orangehrmPayrollPlugin' : 'orangehrmCorePlugin'
          });
        }
      }
    };
    walkDocs(dirRoot);
  }

  return {
    pluginNames,
    prodParsedFiles,
    callEdges,
    callDiagnostics,
    apiEndpoints,
    frontend,
    schemaData,
    doctrineAccess,
    dbColumnData,
    symfonyData,
    testLinkData,
    qaData,
    baselineSpecs,
    baselineSuitesMap,
    storyTargets,
    documents,
    deadLetters
  };
}

function normalizeUiUrl(urlRaw) {
  if (!urlRaw) return null;
  let u = String(urlRaw).split('?')[0].trim();
  if (!u.startsWith('/')) u = '/' + u;
  return u;
}

async function runFullIngestion({
  uri = process.env.NEO4J_URI || 'bolt://localhost:7688',
  user = process.env.NEO4J_USER || 'neo4j',
  password = process.env.NEO4J_PASSWORD || 'admin123',
  database = process.env.NEO4J_DATABASE || 'neo4j',
  clean = false,
  connectMariaDb = true
} = {}) {
  const startedAtMs = Date.now();
  const { appCommit, branch } = getGitMetadata();
  const { qaRepoConfigured, qaCommit } = getQaGitMetadata();
  const snapshotId = `snap-${Date.now()}-${appCommit.slice(0, 8)}`;
  const nowIso = new Date().toISOString();

  console.log(`\n========================================================================`);
  console.log(`  ORANGEHRM QKG UNIFIED PIPELINE | URI: ${uri}`);
  console.log(`  Snapshot: ${snapshotId} | AppCommit: ${appCommit.slice(0, 12)} (${branch}) | QACommit: ${qaCommit}`);
  console.log(`========================================================================`);

  console.log('[1/8] Extracting PHP AST, Routes, Vue UI, Tests, DB FKs & Symfony metadata...');
  const data = await extractWorkspaceSnapshot({ connectMariaDb });
  console.log(`  -> PHP files: ${data.prodParsedFiles.length}, CALLS: ${data.callEdges.length}, Routes: ${data.apiEndpoints.length}, UI: ${data.frontend.components.length}/${data.frontend.pages.length}`);
  console.log(`  -> Tests: PHPUnit=${data.testLinkData.diagnostics.phpTestCases}, Jest=${data.testLinkData.diagnostics.jestTestCases}, QA=${data.qaData.testCases.length}, TESTS=${data.testLinkData.testsEdges.length}, API=${data.testLinkData.executesAgainstEdges.length}`);
  console.log(`  -> DB Tables: ${data.schemaData.tables.length}, Columns: ${data.dbColumnData.columns.length}, ColAccess: ${data.dbColumnData.columnAccessEdges.length}, Migrations: ${data.dbColumnData.migrations.length}, FKs: ${data.schemaData.fkEdges.length}`);
  if (data.deadLetters.length > 0 || data.storyTargets.missingTargets.length > 0) {
    console.log(`  -> Telemetry: deadLetters=${data.deadLetters.length}, unresolvedStoryTargets=${data.storyTargets.missingTargets.length}`);
  }

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session({ database });

  try {
    console.log('[2/8] Applying Neo4j constraints & indexes...');
    await applySchemaConstraints(session);

    let preservedExecLinks = [];
    let preservedMethodCovLinks = [];
    let preservedUiCovLinks = [];

    if (clean) {
      console.log('[3/8] Cleaning current structural/spec entities cleanly (preserving runtime & snapshot history)...');
      const execRes = await session.run(`
        MATCH (te:TestExecution)-[r:EXECUTED_TEST]->(tc:TestCase)
        RETURN te.exec_id AS execId, tc.testcase_id AS testId, properties(r) AS props
      `);
      const mCovRes = await session.run(`
        MATCH (o:CoverageObservation)-[r:COVERED_IN]->(m:Method)
        RETURN o.obs_id AS obsId, m.signature AS signature, properties(r) AS props
      `);
      const uCovRes = await session.run(`
        MATCH (o:CoverageObservation)-[r:COVERED_COMPONENT_IN]->(u:UIComponent)
        RETURN o.obs_id AS obsId, u.component_id AS componentId, properties(r) AS props
      `);
      preservedExecLinks = execRes.records.map((r) => ({
        execId: r.get('execId'),
        testId: r.get('testId'),
        props: r.get('props') || {}
      }));
      preservedMethodCovLinks = mCovRes.records.map((r) => ({
        obsId: r.get('obsId'),
        signature: r.get('signature'),
        props: r.get('props') || {}
      }));
      preservedUiCovLinks = uCovRes.records.map((r) => ({
        obsId: r.get('obsId'),
        componentId: r.get('componentId'),
        props: r.get('props') || {}
      }));

      let deleted = 1;
      while (deleted > 0) {
        const delRes = await session.run(`
          MATCH (n)
          WHERE NOT n:CoverageRun AND NOT n:CoverageObservation AND NOT n:TestRun AND NOT n:TestExecution
            AND NOT n:GraphSnapshot AND NOT n:Release AND NOT n:Commit
          WITH n LIMIT 4000
          DETACH DELETE n
          RETURN count(n) AS cnt
        `);
        deleted = delRes.records[0]?.get('cnt').toNumber() || 0;
      }
    }

    // Create STAGING GraphSnapshot + Commit provenance and link PREVIOUS_SNAPSHOT
    await session.run(`
      MERGE (c:Commit { sha: $appCommit })
      ON CREATE SET c.repo = $appRepo, c.branch = $branch, c.first_seen_at = $nowIso
      SET c.last_seen_at = $nowIso
      WITH c
      OPTIONAL MATCH (prev:GraphSnapshot { status: 'PUBLISHED' })
      WITH c, prev ORDER BY coalesce(prev.published_at, prev.started_at) DESC LIMIT 1
      MERGE (s:GraphSnapshot { snapshot_id: $snapshotId })
      SET s.app_commit = $appCommit,
          s.qa_commit = $qaCommit,
          s.qa_repo_configured = $qaRepoConfigured,
          s.branch = $branch,
          s.status = 'STAGING',
          s.schema_version = $schemaVersion,
          s.extractor_version = $extractorVersion,
          s.extraction_status = $extractionStatus,
          s.dead_letter_count = $deadLetterCount,
          s.missing_spec_targets_count = $missingSpecCount,
          s.started_at = $nowIso
      MERGE (s)-[:RECORDED_COMMIT]->(c)
      FOREACH (_ IN CASE WHEN prev IS NOT NULL AND prev.snapshot_id <> $snapshotId THEN [1] ELSE [] END |
        MERGE (s)-[:PREVIOUS_SNAPSHOT]->(prev)
      )
    `, {
      snapshotId,
      appCommit,
      appRepo: REPOS.APP,
      qaCommit,
      qaRepoConfigured,
      branch,
      schemaVersion: ontology.meta.schema_version,
      extractorVersion: '2.1.0',
      extractionStatus: data.deadLetters.length > 0 ? 'PARTIAL' : 'SUCCESS',
      deadLetterCount: data.deadLetters.length,
      missingSpecCount: data.storyTargets.missingTargets.length,
      nowIso
    });

    // Plugins
    const pluginsRows = [...new Set([...data.pluginNames, 'core'])].map((name) => ({
      name,
      introduced_in: name === 'orangehrmPayrollPlugin' ? 'v2.2-india-payroll' : 'v1.0',
      version: name === 'orangehrmPayrollPlugin' ? 'v2.2-india-payroll' : 'v1.0'
    }));
    await runBatched(session, pluginsRows, 100, `
      UNWIND $batch AS p
      MERGE (node:Plugin { name: p.name })
      SET node.introduced_in = p.introduced_in, node.version = p.version, node.snapshot_id = $snapshotId
    `, { snapshotId });

    // Collect Classes, Interfaces, Traits & Methods
    console.log('[4/8] Ingesting Classes, Interfaces, Traits, Methods & Exact CALLS...');
    const classRows = [];
    const ifaceRows = [];
    const traitRows = [];
    const methodRows = [];

    for (const pf of data.prodParsedFiles) {
      const enrichType = (t) => {
        const plugin = extractPluginFromPath(t.source_file) || 'orangehrmCorePlugin';
        const intro = plugin === 'orangehrmPayrollPlugin' ? 'v2.2-india-payroll' : 'v1.0';
        return {
          ...t,
          plugin,
          introduced_in: intro,
          version: intro
        };
      };

      for (const cls of pf.classes || []) {
        const enriched = enrichType(cls);
        classRows.push({
          fqcn: enriched.fqcn,
          name: enriched.name,
          namespace: enriched.namespace || '',
          plugin: enriched.plugin,
          source_file: enriched.source_file,
          extends: enriched.extends_fqcn || enriched.extends || null,
          implements: enriched.implements || [],
          traits: enriched.trait_fqcns || [],
          line_start: enriched.line_start || 0,
          line_end: enriched.line_end || 0,
          content_fingerprint: cls.content_fingerprint || null,
          introduced_in: enriched.introduced_in,
          version: enriched.version
        });
        for (const m of cls.methods || []) {
          methodRows.push({
            signature: m.signature,
            name: m.name,
            class_fqcn: cls.fqcn,
            plugin: enriched.plugin,
            visibility: m.visibility || 'public',
            is_static: !!m.is_static,
            return_type: m.return_type_fqcn || m.return_type || null,
            signature_hash: m.signature_hash || null,
            body_hash: m.body_hash || null,
            content_fingerprint: m.content_fingerprint || null,
            source_file: m.source_file || enriched.source_file,
            line_start: m.line_start || 0,
            line_end: m.line_end || 0,
            introduced_in: enriched.introduced_in
          });
        }
      }

      for (const iface of pf.interfaces || []) {
        const enriched = enrichType(iface);
        ifaceRows.push({
          fqcn: enriched.fqcn,
          name: enriched.name,
          namespace: enriched.namespace || '',
          plugin: enriched.plugin,
          source_file: enriched.source_file,
          extends: enriched.extends || [],
          line_start: enriched.line_start || 0,
          line_end: enriched.line_end || 0,
          content_fingerprint: iface.content_fingerprint || null,
          introduced_in: enriched.introduced_in,
          version: enriched.version
        });
        for (const m of iface.methods || []) {
          methodRows.push({
            signature: m.signature,
            name: m.name,
            class_fqcn: iface.fqcn,
            plugin: enriched.plugin,
            visibility: m.visibility || 'public',
            is_static: !!m.is_static,
            return_type: m.return_type_fqcn || m.return_type || null,
            signature_hash: m.signature_hash || null,
            body_hash: m.body_hash || null,
            content_fingerprint: m.content_fingerprint || null,
            source_file: m.source_file || enriched.source_file,
            line_start: m.line_start || 0,
            line_end: m.line_end || 0,
            introduced_in: enriched.introduced_in
          });
        }
      }

      for (const tr of pf.traits || []) {
        const enriched = enrichType(tr);
        traitRows.push({
          fqcn: enriched.fqcn,
          name: enriched.name,
          namespace: enriched.namespace || '',
          plugin: enriched.plugin,
          source_file: enriched.source_file,
          traits: enriched.trait_fqcns || [],
          line_start: enriched.line_start || 0,
          line_end: enriched.line_end || 0,
          content_fingerprint: tr.content_fingerprint || null,
          introduced_in: enriched.introduced_in,
          version: enriched.version
        });
        for (const m of tr.methods || []) {
          methodRows.push({
            signature: m.signature,
            name: m.name,
            class_fqcn: tr.fqcn,
            plugin: enriched.plugin,
            visibility: m.visibility || 'public',
            is_static: !!m.is_static,
            return_type: m.return_type_fqcn || m.return_type || null,
            signature_hash: m.signature_hash || null,
            body_hash: m.body_hash || null,
            content_fingerprint: m.content_fingerprint || null,
            source_file: m.source_file || enriched.source_file,
            line_start: m.line_start || 0,
            line_end: m.line_end || 0,
            introduced_in: enriched.introduced_in
          });
        }
      }
    }

    await runBatched(session, ifaceRows, 300, `
      UNWIND $batch AS i
      MERGE (n:Interface { fqcn: i.fqcn })
      SET n.name = i.name, n.namespace = i.namespace, n.plugin = i.plugin,
          n.source_file = i.source_file, n.line_start = i.line_start, n.line_end = i.line_end,
          n.content_fingerprint = i.content_fingerprint,
          n.introduced_in = i.introduced_in, n.version = i.version, n.snapshot_id = $snapshotId
      WITH n, i
      MATCH (p:Plugin { name: i.plugin })
      MERGE (p)-[:DECLARES]->(n)
    `, { snapshotId });

    await runBatched(session, traitRows, 300, `
      UNWIND $batch AS t
      MERGE (n:Trait { fqcn: t.fqcn })
      SET n.name = t.name, n.namespace = t.namespace, n.plugin = t.plugin,
          n.source_file = t.source_file, n.line_start = t.line_start, n.line_end = t.line_end,
          n.content_fingerprint = t.content_fingerprint,
          n.introduced_in = t.introduced_in, n.version = t.version, n.snapshot_id = $snapshotId
      WITH n, t
      MATCH (p:Plugin { name: t.plugin })
      MERGE (p)-[:DECLARES]->(n)
    `, { snapshotId });

    await runBatched(session, classRows, 300, `
      UNWIND $batch AS c
      MERGE (n:Class { fqcn: c.fqcn })
      SET n.name = c.name, n.namespace = c.namespace, n.plugin = c.plugin,
          n.source_file = c.source_file, n.extends = c.extends,
          n.implements = c.implements, n.traits = c.traits,
          n.content_fingerprint = c.content_fingerprint,
          n.line_start = c.line_start, n.line_end = c.line_end,
          n.introduced_in = c.introduced_in, n.version = c.version, n.snapshot_id = $snapshotId
      WITH n, c
      MATCH (p:Plugin { name: c.plugin })
      MERGE (p)-[:DECLARES]->(n)
    `, { snapshotId });

    // Hierarchy links: EXTENDS (Class->Class|ExternalClass, Interface->Interface|ExternalInterface), IMPLEMENTS, USES_TRAIT
    const canonicalClassMap = new Map(classRows.map((c) => [c.fqcn.toLowerCase(), c.fqcn]));
    const canonicalIfaceMap = new Map(ifaceRows.map((i) => [i.fqcn.toLowerCase(), i.fqcn]));
    const canonicalTraitMap = new Map(traitRows.map((t) => [t.fqcn.toLowerCase(), t.fqcn]));

    const classExtInternal = [];
    const classExtExternal = [];
    const classImplInternal = [];
    const classImplExternal = [];
    const classTraitInternal = [];
    const classTraitExternal = [];

    for (const c of classRows) {
      if (c.extends) {
        const matchFqcn = canonicalClassMap.get(c.extends.toLowerCase());
        if (matchFqcn) classExtInternal.push({ child: c.fqcn, parent: matchFqcn });
        else classExtExternal.push({ child: c.fqcn, parent: c.extends, name: c.extends.split('\\').pop() });
      }
      for (const ifaceFqcn of c.implements) {
        const matchFqcn = canonicalIfaceMap.get(ifaceFqcn.toLowerCase());
        if (matchFqcn) classImplInternal.push({ child: c.fqcn, parent: matchFqcn });
        else classImplExternal.push({ child: c.fqcn, parent: ifaceFqcn, name: ifaceFqcn.split('\\').pop() });
      }
      for (const trFqcn of c.traits) {
        const matchFqcn = canonicalTraitMap.get(trFqcn.toLowerCase());
        if (matchFqcn) classTraitInternal.push({ child: c.fqcn, parent: matchFqcn });
        else classTraitExternal.push({ child: c.fqcn, parent: trFqcn, name: trFqcn.split('\\').pop() });
      }
    }

    await runBatched(session, classExtInternal, 400, `
      UNWIND $batch AS e
      MATCH (child:Class { fqcn: e.child })
      MATCH (par:Class { fqcn: e.parent })
      MERGE (child)-[:EXTENDS]->(par)
    `);
    await runBatched(session, classExtExternal, 300, `
      UNWIND $batch AS e
      MATCH (child:Class { fqcn: e.child })
      MERGE (par:ExternalClass { fqcn: e.parent })
      SET par.name = e.name
      MERGE (child)-[:EXTENDS]->(par)
    `);
    await runBatched(session, classImplInternal, 400, `
      UNWIND $batch AS e
      MATCH (child:Class { fqcn: e.child })
      MATCH (ifNode:Interface { fqcn: e.parent })
      MERGE (child)-[:IMPLEMENTS]->(ifNode)
    `);
    await runBatched(session, classImplExternal, 300, `
      UNWIND $batch AS e
      MATCH (child:Class { fqcn: e.child })
      MERGE (ifNode:ExternalInterface { fqcn: e.parent })
      SET ifNode.name = e.name
      MERGE (child)-[:IMPLEMENTS]->(ifNode)
    `);
    await runBatched(session, classTraitInternal, 400, `
      UNWIND $batch AS e
      MATCH (child:Class { fqcn: e.child })
      MATCH (trNode:Trait { fqcn: e.parent })
      MERGE (child)-[:USES_TRAIT]->(trNode)
    `);
    await runBatched(session, classTraitExternal, 200, `
      UNWIND $batch AS e
      MATCH (child:Class { fqcn: e.child })
      MERGE (trNode:ExternalTrait { fqcn: e.parent })
      SET trNode.name = e.name
      MERGE (child)-[:USES_TRAIT]->(trNode)
    `);

    const ifaceExtInternal = [];
    const ifaceExtExternal = [];
    for (const i of ifaceRows) {
      for (const parFqcn of i.extends) {
        const matchFqcn = canonicalIfaceMap.get(parFqcn.toLowerCase());
        if (matchFqcn) ifaceExtInternal.push({ child: i.fqcn, parent: matchFqcn });
        else ifaceExtExternal.push({ child: i.fqcn, parent: parFqcn, name: parFqcn.split('\\').pop() });
      }
    }
    await runBatched(session, ifaceExtInternal, 300, `
      UNWIND $batch AS e
      MATCH (child:Interface { fqcn: e.child })
      MATCH (par:Interface { fqcn: e.parent })
      MERGE (child)-[:EXTENDS]->(par)
    `);
    await runBatched(session, ifaceExtExternal, 200, `
      UNWIND $batch AS e
      MATCH (child:Interface { fqcn: e.child })
      MERGE (par:ExternalInterface { fqcn: e.parent })
      SET par.name = e.name
      MERGE (child)-[:EXTENDS]->(par)
    `);

    const traitExtInternal = [];
    const traitExtExternal = [];
    for (const t of traitRows) {
      for (const trFqcn of t.traits) {
        const matchFqcn = canonicalTraitMap.get(trFqcn.toLowerCase());
        if (matchFqcn) traitExtInternal.push({ child: t.fqcn, parent: matchFqcn });
        else traitExtExternal.push({ child: t.fqcn, parent: trFqcn, name: trFqcn.split('\\').pop() });
      }
    }
    await runBatched(session, traitExtInternal, 300, `
      UNWIND $batch AS e
      MATCH (child:Trait { fqcn: e.child })
      MATCH (par:Trait { fqcn: e.parent })
      MERGE (child)-[:USES_TRAIT]->(par)
    `);
    await runBatched(session, traitExtExternal, 200, `
      UNWIND $batch AS e
      MATCH (child:Trait { fqcn: e.child })
      MERGE (par:ExternalTrait { fqcn: e.parent })
      SET par.name = e.name
      MERGE (child)-[:USES_TRAIT]->(par)
    `);

    await runBatched(session, methodRows, 500, `
      UNWIND $batch AS m
      MERGE (node:Method { signature: m.signature })
      SET node.name = m.name, node.class_fqcn = m.class_fqcn, node.plugin = m.plugin,
          node.visibility = m.visibility, node.is_static = m.is_static,
          node.return_type = m.return_type, node.source_file = m.source_file,
          node.signature_hash = m.signature_hash,
          node.body_hash = m.body_hash,
          node.content_fingerprint = m.content_fingerprint,
          node.line_start = m.line_start, node.line_end = m.line_end,
          node.introduced_in = m.introduced_in, node.snapshot_id = $snapshotId
      WITH node, m
      OPTIONAL MATCH (c:Class { fqcn: m.class_fqcn })
      OPTIONAL MATCH (i:Interface { fqcn: m.class_fqcn })
      OPTIONAL MATCH (t:Trait { fqcn: m.class_fqcn })
      FOREACH (_ IN CASE WHEN c IS NOT NULL THEN [1] ELSE [] END | MERGE (c)-[:DECLARES]->(node))
      FOREACH (_ IN CASE WHEN i IS NOT NULL THEN [1] ELSE [] END | MERGE (i)-[:DECLARES]->(node))
      FOREACH (_ IN CASE WHEN t IS NOT NULL THEN [1] ELSE [] END | MERGE (t)-[:DECLARES]->(node))
    `, { snapshotId });

    // Exact-signature Two-Pass CALLS edges
    await runBatched(session, data.callEdges, 800, `
      UNWIND $batch AS e
      MATCH (caller:Method { signature: e.callerSignature })
      MATCH (callee:Method { signature: e.calleeSignature })
      MERGE (caller)-[r:CALLS]->(callee)
      SET r.call_type = e.call_type,
          r.confidence = e.confidence,
          r.evidence_type = e.evidence_type,
          r.mapping_source = 'TWO_PASS_SYMBOL_RESOLVER',
          r.snapshot_id = $snapshotId,
          r.commit_sha = $appCommit
    `, { snapshotId, appCommit });

    // 5. Routes & UI Components
    console.log('[5/8] Ingesting ApiEndpoints (HANDLED_BY), UIComponents & UIPages...');
    await runBatched(session, data.apiEndpoints, 300, `
      UNWIND $batch AS ep
      MERGE (node:ApiEndpoint { endpoint_id: ep.endpoint_id })
      SET node.http_method = ep.http_method,
          node.path = ep.path,
          node.route_name = ep.route_name,
          node.plugin = ep.plugin,
          node.handler_class = ep.handler_class,
          node.handler_fqcn = ep.handler_fqcn,
          node.handler_method = ep.handler_method,
          node.endpoint_kind = ep.endpoint_kind,
          node.auth_required = ep.auth_required,
          node.source_file = ep.source_file,
          node.content_fingerprint = ep.content_fingerprint,
          node.introduced_in = CASE WHEN ep.plugin = 'orangehrmPayrollPlugin' THEN 'v2.2-india-payroll' ELSE 'v1.0' END,
          node.snapshot_id = $snapshotId
      WITH node, ep
      MATCH (c:Class { fqcn: ep.handler_fqcn })
      MERGE (c)-[r:EXPOSES]->(node)
      MERGE (node)-[hb:HANDLED_BY]->(c)
      SET hb.evidence_type = 'SYMFONY_ROUTE_YAML', hb.confidence = 1.0, hb.snapshot_id = $snapshotId
    `, { snapshotId });

    await runBatched(session, data.frontend.components, 300, `
      UNWIND $batch AS ui
      MERGE (node:UIComponent { component_id: ui.component_id })
      SET node.name = ui.name,
          node.file = ui.file,
          node.plugin = ui.plugin,
          node.type = ui.type,
          node.inputs = ui.inputs,
          node.child_components = ui.child_components,
          node.content_fingerprint = ui.content_fingerprint,
          node.line_count = ui.line_count,
          node.introduced_in = CASE WHEN ui.plugin = 'orangehrmPayrollPlugin' THEN 'v2.2-india-payroll' ELSE 'v1.0' END,
          node.snapshot_id = $snapshotId
      WITH node, ui
      OPTIONAL MATCH (p:Plugin { name: ui.plugin })
      FOREACH (_ IN CASE WHEN p IS NOT NULL THEN [1] ELSE [] END | MERGE (node)-[:DECLARED_IN]->(p))
    `, { snapshotId });

    await runBatched(session, data.frontend.pages, 200, `
      UNWIND $batch AS pg
      MERGE (node:UIPage { page_id: pg.page_id })
      SET node.plugin = pg.plugin,
          node.component_name = pg.component_name,
          node.component_relative_path = pg.component_relative_path,
          node.target_file = pg.target_file,
          node.source_file = pg.source_file,
          node.introduced_in = CASE WHEN pg.plugin = 'orangehrmPayrollPlugin' THEN 'v2.2-india-payroll' ELSE 'v1.0' END,
          node.snapshot_id = $snapshotId
      WITH node, pg
      OPTIONAL MATCH (uiByFile:UIComponent { file: pg.target_file })
      OPTIONAL MATCH (uiByName:UIComponent { plugin: pg.plugin, name: pg.component_name })
      WITH node, pg, coalesce(uiByFile, uiByName) AS resolvedUi
      FOREACH (_ IN CASE WHEN resolvedUi IS NOT NULL THEN [1] ELSE [] END |
        MERGE (node)-[:RENDERS]->(resolvedUi)
      )
      FOREACH (_ IN CASE WHEN resolvedUi IS NULL AND pg.target_file IS NOT NULL THEN [1] ELSE [] END |
        MERGE (targetUi:UIComponent { component_id: pg.target_file })
        SET targetUi.name = pg.component_name,
            targetUi.file = pg.target_file,
            targetUi.plugin = pg.plugin,
            targetUi.type = 'RouteTarget',
            targetUi.component_kind = 'ROUTE_TARGET',
            targetUi.introduced_in = CASE WHEN pg.plugin = 'orangehrmPayrollPlugin' THEN 'v2.2-india-payroll' ELSE 'v1.0' END,
            targetUi.snapshot_id = $snapshotId
        MERGE (node)-[:RENDERS]->(targetUi)
        FOREACH (pName IN CASE WHEN pg.plugin IS NOT NULL THEN [pg.plugin] ELSE [] END |
          MERGE (p:Plugin { name: pName })
          MERGE (targetUi)-[:DECLARED_IN]->(p)
        )
      )
    `, { snapshotId });

    // UI -> UI & UI -> ApiEndpoint edges
    const uiApiLinks = [];
    for (const ui of data.frontend.components) {
      for (const apiPathRaw of ui.api_calls || []) {
        const normPath = normalizeUiUrl(apiPathRaw);
        if (normPath) uiApiLinks.push({ component_id: ui.component_id, normPath });
      }
    }
    await runBatched(session, uiApiLinks, 300, `
      UNWIND $batch AS l
      MATCH (ui:UIComponent { component_id: l.component_id })
      MATCH (ep:ApiEndpoint)
      WHERE ep.path = l.normPath OR (l.normPath CONTAINS '{*}' AND ep.path STARTS WITH split(l.normPath, '{*}')[0])
      MERGE (ui)-[:CALLS_ENDPOINT { evidence_type: 'VUE_AST_HTTP', confidence: 0.85 }]->(ep)
    `);

    // 6. Database Schema, FKs, Doctrine Read/Write & Symfony DI/Events/Menus
    console.log('[6/8] Ingesting DB Tables, Entities, FKs, Data-Access & Symfony DI/Events/Menus...');
    await runBatched(session, data.schemaData.tables, 200, `
      UNWIND $batch AS t
      MERGE (dt:DatabaseTable { name: t.name })
      SET dt.source = coalesce(dt.source, t.source),
          dt.plugin = coalesce(t.plugin, dt.plugin),
          dt.introduced_in = CASE WHEN t.name STARTS WITH 'ohrm_payroll' OR t.name = 'ohrm_salary_slip' THEN 'v2.2-india-payroll' ELSE 'v1.0' END,
          dt.snapshot_id = $snapshotId
    `, { snapshotId });

    await runBatched(session, data.schemaData.entities, 200, `
      UNWIND $batch AS e
      MERGE (de:DatabaseEntity { fqcn: e.class_fqcn })
      SET de.name = e.entity_name,
          de.table_name = coalesce(e.table_name, 'unmapped'),
          de.source_file = e.source_file,
          de.plugin = e.plugin,
          de.introduced_in = CASE WHEN e.plugin = 'orangehrmPayrollPlugin' THEN 'v2.2-india-payroll' ELSE 'v1.0' END,
          de.snapshot_id = $snapshotId
      WITH de, e
      MATCH (c:Class { fqcn: e.class_fqcn })
      MERGE (c)-[:IS_ENTITY]->(de)
      FOREACH (_ IN CASE WHEN e.table_name IS NOT NULL THEN [1] ELSE [] END |
        MERGE (dt:DatabaseTable { name: e.table_name })
        ON CREATE SET dt.introduced_in = CASE WHEN e.table_name STARTS WITH 'ohrm_payroll' OR e.table_name = 'ohrm_salary_slip' THEN 'v2.2-india-payroll' ELSE 'v1.0' END,
                      dt.snapshot_id = $snapshotId
        MERGE (de)-[:MAPS_TO]->(dt)
      )
      WITH de, e
      OPTIONAL MATCH (p:Plugin { name: e.plugin })
      FOREACH (_ IN CASE WHEN p IS NOT NULL THEN [1] ELSE [] END | MERGE (p)-[:DECLARES]->(de))
    `, { snapshotId });

    await runBatched(session, data.schemaData.fkEdges, 200, `
      UNWIND $batch AS fk
      MATCH (src:DatabaseTable { name: fk.from_table })
      MATCH (dst:DatabaseTable { name: fk.to_table })
      MERGE (src)-[r:FK_REFERENCES { column: fk.from_column, ref_column: fk.to_column }]->(dst)
      SET r.constraint_name = fk.constraint_name,
          r.evidence_type = fk.evidence_type,
          r.confidence = fk.confidence,
          r.snapshot_id = $snapshotId
    `, { snapshotId });

    const readsRows = data.doctrineAccess.tableAccessEdges.filter((e) => e.relation === 'READS_TABLE');
    const writesRows = data.doctrineAccess.tableAccessEdges.filter((e) => e.relation === 'WRITES_TABLE');
    await runBatched(session, readsRows, 400, `
      UNWIND $batch AS a
      MATCH (m:Method { signature: a.method_signature })
      MATCH (dt:DatabaseTable { name: a.table_name })
      MERGE (m)-[r:READS_TABLE]->(dt)
      SET r.evidence_type = a.evidence_type, r.confidence = a.confidence, r.snapshot_id = $snapshotId
    `, { snapshotId });
    await runBatched(session, writesRows, 400, `
      UNWIND $batch AS a
      MATCH (m:Method { signature: a.method_signature })
      MATCH (dt:DatabaseTable { name: a.table_name })
      MERGE (m)-[r:WRITES_TABLE]->(dt)
      SET r.evidence_type = a.evidence_type, r.confidence = a.confidence, r.snapshot_id = $snapshotId
    `, { snapshotId });

    // DatabaseColumn, Entity->Column Maps, Prioritized Method->Column Access & SchemaMigrations (QKG-08)
    await runBatched(session, data.dbColumnData.columns, 400, `
      UNWIND $batch AS col
      MERGE (dc:DatabaseColumn { column_id: col.column_id })
      SET dc.table_name = col.table_name,
          dc.column_name = col.column_name,
          dc.data_type = col.data_type,
          dc.nullable = col.nullable,
          dc.is_pk = col.is_pk,
          dc.is_fk = col.is_fk,
          dc.source = col.source,
          dc.observed_sources = coalesce(col.observed_sources, [col.source]),
          dc.mariadb_verified = coalesce(col.mariadb_verified, false),
          dc.mariadb_data_type = col.mariadb_data_type,
          dc.mariadb_nullable = col.mariadb_nullable,
          dc.mariadb_is_pk = coalesce(col.mariadb_is_pk, false),
          dc.mariadb_is_fk = coalesce(col.mariadb_is_fk, false),
          dc.mariadb_observed_at = col.mariadb_observed_at,
          dc.schema_drift_flags = coalesce(col.schema_drift_flags, []),
          dc.plugin = coalesce(col.plugin, dc.plugin),
          dc.introduced_in = CASE WHEN col.table_name STARTS WITH 'ohrm_payroll' OR col.table_name = 'ohrm_salary_slip' THEN 'v2.2-india-payroll' ELSE 'v1.0' END,
          dc.snapshot_id = $snapshotId
      WITH dc, col
      MERGE (dt:DatabaseTable { name: col.table_name })
      ON CREATE SET dt.introduced_in = CASE WHEN col.table_name STARTS WITH 'ohrm_payroll' OR col.table_name = 'ohrm_salary_slip' THEN 'v2.2-india-payroll' ELSE 'v1.0' END,
                    dt.snapshot_id = $snapshotId
      MERGE (dt)-[r:HAS_COLUMN]->(dc)
      SET r.snapshot_id = $snapshotId
    `, { snapshotId });

    await runBatched(session, data.dbColumnData.entityColumnMaps, 400, `
      UNWIND $batch AS m
      MATCH (de:DatabaseEntity { fqcn: m.entity_fqcn })
      MATCH (dc:DatabaseColumn { column_id: m.column_id })
      MERGE (de)-[r:MAPS_TO_COLUMN { property_name: m.property_name }]->(dc)
      SET r.evidence_type = m.evidence_type,
          r.confidence = m.confidence,
          r.snapshot_id = $snapshotId
    `, { snapshotId });

    await runBatched(session, data.dbColumnData.columnAccessEdges, 500, `
      UNWIND $batch AS a
      MATCH (m:Method { signature: a.method_signature })
      MATCH (dc:DatabaseColumn { column_id: a.column_id })
      MERGE (m)-[r:ACCESSES_COLUMN { access_mode: a.access_mode }]->(dc)
      SET r.evidence_type = a.evidence_type,
          r.confidence = a.confidence,
          r.priority = a.priority,
          r.snapshot_id = $snapshotId
    `, { snapshotId });

    await runBatched(session, data.dbColumnData.migrations, 100, `
      UNWIND $batch AS mig
      MERGE (sm:SchemaMigration { migration_id: mig.migration_id })
      SET sm.version = mig.version,
          sm.file = mig.file,
          sm.migration_kind = mig.migration_kind,
          sm.plugin = mig.plugin,
          sm.affected_tables = mig.affected_tables,
          sm.affected_columns = mig.affected_columns,
          sm.introduced_in = mig.introduced_in,
          sm.snapshot_id = $snapshotId
      WITH sm, mig
      FOREACH (tbl IN mig.affected_tables |
        MERGE (dt:DatabaseTable { name: tbl })
        ON CREATE SET dt.introduced_in = CASE WHEN tbl STARTS WITH 'ohrm_payroll' OR tbl = 'ohrm_salary_slip' THEN 'v2.2-india-payroll' ELSE 'v1.0' END,
                      dt.snapshot_id = $snapshotId
        MERGE (sm)-[mt:MODIFIES_TABLE]->(dt)
        SET mt.evidence_type = coalesce(mig.evidence_type, 'MIGRATION_AST'),
            mt.confidence = coalesce(mig.confidence, 0.9),
            mt.snapshot_id = $snapshotId
      )
      FOREACH (colId IN mig.affected_columns |
        FOREACH (_ IN CASE WHEN colId CONTAINS '.' THEN [1] ELSE [] END |
          MERGE (dc:DatabaseColumn { column_id: colId })
          ON CREATE SET dc.table_name = split(colId, '.')[0],
                        dc.column_name = split(colId, '.')[1],
                        dc.introduced_in = mig.introduced_in,
                        dc.snapshot_id = $snapshotId
          MERGE (sm)-[mc:MODIFIES_COLUMN]->(dc)
          SET mc.evidence_type = coalesce(mig.evidence_type, 'MIGRATION_AST'),
              mc.confidence = coalesce(mig.confidence, 0.9),
              mc.snapshot_id = $snapshotId
        )
      )
    `, { snapshotId });

    await runBatched(session, data.symfonyData.diEdges, 300, `
      UNWIND $batch AS di
      MATCH (a:Class { fqcn: di.from_class_fqcn })
      MATCH (b:Class { fqcn: di.to_class_fqcn })
      MERGE (a)-[r:INJECTED_WITH]->(b)
      SET r.service_key = di.service_key, r.evidence_type = di.evidence_type, r.confidence = di.confidence, r.snapshot_id = $snapshotId
    `, { snapshotId });

    await runBatched(session, data.symfonyData.events, 100, `
      UNWIND $batch AS ev
      MERGE (n:Event { event_id: ev.event_id })
      SET n.name = ev.name, n.category = ev.category, n.snapshot_id = $snapshotId
    `, { snapshotId });
    await runBatched(session, data.symfonyData.listenEdges, 200, `
      UNWIND $batch AS l
      MATCH (c:Class { fqcn: l.class_fqcn })
      MATCH (e:Event { event_id: l.event_name })
      MERGE (c)-[r:LISTENS_TO]->(e)
      SET r.handler_method = l.handler_method, r.evidence_type = l.evidence_type, r.confidence = l.confidence
    `);
    await runBatched(session, data.symfonyData.dispatchEdges, 200, `
      UNWIND $batch AS d
      MATCH (c:Class { fqcn: d.class_fqcn })
      MATCH (e:Event { event_id: d.event_name })
      MERGE (c)-[r:DISPATCHES]->(e)
      SET r.evidence_type = d.evidence_type, r.confidence = d.confidence
    `);
    await runBatched(session, data.symfonyData.menuEdges, 300, `
      UNWIND $batch AS m
      MATCH (c:Class { fqcn: m.class_fqcn })
      MATCH (p:UIPage { page_id: m.page_id })
      MERGE (c)-[r:EXTENDS_MENU]->(p)
      SET r.menu_titles = m.menu_titles, r.evidence_type = m.evidence_type, r.confidence = m.confidence
    `);

    // 7. Specifications, Docs & Tests (Baseline + All 22 PHPUnit Suites + 6 Core Jest Specs)
    console.log('[7/8] Ingesting Baseline/Payroll Specs, Docs, AST PHPUnit/Jest Tests & Links...');
    await runBatched(session, data.baselineSpecs.domains, 100, `
      UNWIND $batch AS d
      MERGE (n:BusinessDomain { domain_id: d.domain_id })
      SET n.name = d.name, n.plugin = d.plugin, n.introduced_in = 'v1.0', n.version = 'v1.0', n.snapshot_id = $snapshotId
      WITH n, d
      OPTIONAL MATCH (p:Plugin { name: d.plugin })
      FOREACH (_ IN CASE WHEN p IS NOT NULL THEN [1] ELSE [] END | MERGE (p)-[:CONTAINS]->(n))
    `, { snapshotId });
    await runBatched(session, data.baselineSpecs.workflows, 100, `
      UNWIND $batch AS w
      MERGE (n:BusinessWorkflow { workflow_id: w.workflow_id })
      SET n.name = w.name, n.type = w.type, n.introduced_in = 'v1.0', n.version = 'v1.0', n.snapshot_id = $snapshotId
      WITH n, w
      OPTIONAL MATCH (d:BusinessDomain { domain_id: w.domain_id })
      FOREACH (_ IN CASE WHEN d IS NOT NULL THEN [1] ELSE [] END | MERGE (d)-[:CONTAINS]->(n))
    `, { snapshotId });
    await runBatched(session, data.baselineSpecs.features, 100, `
      UNWIND $batch AS f
      MERGE (n:Feature { feature_id: f.feature_id })
      SET n.name = f.name, n.introduced_in = 'v1.0', n.version = 'v1.0', n.snapshot_id = $snapshotId
      WITH n, f
      OPTIONAL MATCH (w:BusinessWorkflow { workflow_id: f.workflow_id })
      FOREACH (_ IN CASE WHEN w IS NOT NULL THEN [1] ELSE [] END | MERGE (w)-[:DECOMPOSES_TO]->(n))
    `, { snapshotId });
    await runBatched(session, data.baselineSpecs.requirementGroups, 100, `
      UNWIND $batch AS g
      MERGE (n:RequirementGroup { group_id: g.group_id })
      SET n.name = g.name, n.introduced_in = 'v1.0', n.version = 'v1.0', n.snapshot_id = $snapshotId
      WITH n, g
      OPTIONAL MATCH (f:Feature { feature_id: g.feature_id })
      FOREACH (_ IN CASE WHEN f IS NOT NULL THEN [1] ELSE [] END | MERGE (f)-[:HAS_REQUIREMENT_GROUP]->(n))
    `, { snapshotId });
    await runBatched(session, data.baselineSpecs.requirements, 100, `
      UNWIND $batch AS r
      MERGE (n:Requirement { requirement_id: r.requirement_id })
      SET n.title = r.title, n.type = r.type, n.status = r.status, n.priority = r.priority,
          n.introduced_in = 'v1.0', n.version = 'v1.0', n.snapshot_id = $snapshotId
      WITH n, r
      OPTIONAL MATCH (g:RequirementGroup { group_id: r.group_id })
      FOREACH (_ IN CASE WHEN g IS NOT NULL THEN [1] ELSE [] END | MERGE (g)-[:HAS_REQUIREMENT]->(n))
    `, { snapshotId });
    await runBatched(session, data.baselineSpecs.businessRules, 100, `
      UNWIND $batch AS b
      MERGE (n:BusinessRule { rule_id: b.rule_id })
      SET n.name = b.name, n.description = b.description, n.introduced_in = 'v1.0', n.version = 'v1.0', n.snapshot_id = $snapshotId
      WITH n, b
      OPTIONAL MATCH (r:Requirement { requirement_id: b.requirement_id })
      FOREACH (_ IN CASE WHEN r IS NOT NULL THEN [1] ELSE [] END | MERGE (r)-[:GOVERNED_BY]->(n))
    `, { snapshotId });
    await runBatched(session, data.baselineSpecs.personas, 100, `
      UNWIND $batch AS p
      MERGE (n:Persona { persona_id: p.persona_id })
      SET n.name = p.name, n.role = p.role, n.introduced_in = 'v1.0', n.version = 'v1.0', n.snapshot_id = $snapshotId
    `, { snapshotId });
    await runBatched(session, data.baselineSpecs.userStories, 100, `
      UNWIND $batch AS s
      MERGE (n:UserStory { story_id: s.story_id })
      SET n.title = s.title, n.statement = s.statement, n.requirement_id = s.requirement_id,
          n.feature_id = s.feature_id, n.domain_id = s.domain_id, n.workflow_id = s.workflow_id,
          n.introduced_in = 'v1.0', n.version = 'v1.0', n.snapshot_id = $snapshotId
      WITH n, s
      OPTIONAL MATCH (p:Persona { persona_id: s.persona_id })
      OPTIONAL MATCH (f:Feature { feature_id: s.feature_id })
      OPTIONAL MATCH (w:BusinessWorkflow { workflow_id: s.workflow_id })
      OPTIONAL MATCH (r:Requirement { requirement_id: s.requirement_id })
      FOREACH (_ IN CASE WHEN p IS NOT NULL THEN [1] ELSE [] END | MERGE (p)-[:EXECUTES]->(n))
      FOREACH (_ IN CASE WHEN f IS NOT NULL THEN [1] ELSE [] END | MERGE (n)-[:BELONGS_TO]->(f))
      FOREACH (_ IN CASE WHEN w IS NOT NULL THEN [1] ELSE [] END | MERGE (n)-[:SUPPORTS_WORKFLOW]->(w))
      FOREACH (_ IN CASE WHEN r IS NOT NULL THEN [1] ELSE [] END | MERGE (n)-[:REALIZES]->(r))
      FOREACH (rid IN coalesce(s.rule_ids, []) |
        FOREACH (_ IN CASE WHEN rid STARTS WITH 'BR_' THEN [1] ELSE [] END |
          MERGE (br:BusinessRule { rule_id: rid })
          ON CREATE SET br.name = rid, br.introduced_in = coalesce(s.introduced_in, 'v1.0'), br.snapshot_id = $snapshotId
          MERGE (n)-[:GOVERNED_BY]->(br)
        )
        FOREACH (_ IN CASE WHEN rid STARTS WITH 'NFR_' OR rid STARTS WITH 'FR_' THEN [1] ELSE [] END |
          MERGE (req:Requirement { requirement_id: rid })
          ON CREATE SET req.title = rid, req.type = CASE WHEN rid STARTS WITH 'NFR_' THEN 'Non-Functional' ELSE 'Functional' END, req.introduced_in = coalesce(s.introduced_in, 'v1.0'), req.snapshot_id = $snapshotId
          MERGE (n)-[:REALIZES]->(req)
        )
      )
    `, { snapshotId });

    // Non-Payroll UserStory -> ApiEndpoint (EXECUTES_VIA) & Feature -> ApiEndpoint (INCLUDES_ENDPOINT)
    await runBatched(session, data.storyTargets.endpointLinks, 200, `
      UNWIND $batch AS l
      MATCH (us:UserStory { story_id: l.story_id })
      MATCH (ep:ApiEndpoint { endpoint_id: l.endpoint_id })
      MERGE (us)-[r:EXECUTES_VIA]->(ep)
      SET r.origin = 'SPEC_AUTHORED', r.evidence_type = 'SPEC_STORY_ENDPOINT',
          r.raw_target = l.raw_target, r.snapshot_id = $snapshotId, r.commit_sha = $appCommit
      WITH ep, l
      OPTIONAL MATCH (f:Feature { feature_id: l.feature_id })
      FOREACH (_ IN CASE WHEN f IS NOT NULL THEN [1] ELSE [] END |
        MERGE (f)-[fe:INCLUDES_ENDPOINT]->(ep)
        SET fe.origin = 'SPEC_DERIVED', fe.snapshot_id = $snapshotId
      )
    `, { snapshotId, appCommit });

    // Non-Payroll UserStory -> UIComponent (IMPLEMENTED_BY)
    await runBatched(session, data.storyTargets.uiLinks, 200, `
      UNWIND $batch AS l
      MATCH (us:UserStory { story_id: l.story_id })
      MATCH (ui:UIComponent { component_id: l.component_id })
      MERGE (us)-[r:IMPLEMENTED_BY]->(ui)
      SET r.origin = 'SPEC_AUTHORED', r.evidence_type = 'SPEC_STORY_UI',
          r.raw_target = l.raw_target, r.snapshot_id = $snapshotId, r.commit_sha = $appCommit
    `, { snapshotId, appCommit });

    // Docs
    await runBatched(session, data.documents, 100, `
      UNWIND $batch AS d
      MERGE (n:Document { doc_id: d.doc_id })
      SET n.title = d.title, n.file = d.file, n.version = d.version, n.introduced_in = d.introduced_in, n.plugin = d.plugin, n.snapshot_id = $snapshotId
      WITH n, d
      OPTIONAL MATCH (p:Plugin { name: d.plugin })
      FOREACH (_ IN CASE WHEN p IS NOT NULL THEN [1] ELSE [] END | MERGE (n)-[:DOCUMENTS]->(p))
    `, { snapshotId });

    // Non-unit Baseline v1.0 manifest backlog suites (isolated via PLANNED_VERIFICATION / PLANNED_ENDPOINT_COVERAGE!)
    const validReqSet = new Set(data.baselineSpecs.requirements.map((r) => r.requirement_id));
    const epByNorm = new Map();
    for (const ep of data.apiEndpoints) {
      epByNorm.set(normalizeParamPath(ep.endpoint_id), ep.endpoint_id);
    }

    const nonUnitBaselineRows = [];
    for (const [suiteKey, rows] of Object.entries(data.baselineSuitesMap)) {
      if (suiteKey === 'unit_tests') continue;
      for (const tc of rows) {
        if (!tc.testcase_id) continue;
        if (tc.testcase_id.startsWith('TC_PAY_') || tc.testcase_id.startsWith('E2E-') || tc.testcase_id.startsWith('UI-')) continue;
        const resolvedReqs = [...new Set(
          (tc.requirement_ids || [])
            .map((rid) => resolveRequirementAlias(rid, validReqSet))
            .filter((rid) => rid && validReqSet.has(rid))
        )];
        let resolvedEndpointId = null;
        if (tc.endpoint) {
          const norm = normalizeParamPath(tc.endpoint);
          if (epByNorm.has(norm)) resolvedEndpointId = epByNorm.get(norm);
        }
        nonUnitBaselineRows.push({
          testcase_id: tc.testcase_id,
          canonical_id: `baseline-v1::${suiteKey}::${tc.testcase_id}`,
          name: tc.testcase_name || tc.name || tc.testcase_id,
          level: tc.test_level || 'E2E',
          suite: suiteKey,
          plugin: tc.plugin || 'orangehrmCorePlugin',
          requirement_ids: resolvedReqs,
          endpoint_id: resolvedEndpointId,
          origin: 'BASELINE_MANIFEST'
        });
      }
    }
    await runBatched(session, nonUnitBaselineRows, 500, `
      UNWIND $batch AS tc
      MERGE (s:TestSuite { name: tc.suite })
      SET s.suite_id = 'baseline::' + tc.suite,
          s.origin = 'BASELINE_MANIFEST',
          s.plugin = tc.plugin,
          s.module = tc.plugin,
          s.repo = $appRepo,
          s.framework = 'baseline_manifest',
          s.introduced_in = 'v1.0',
          s.snapshot_id = $snapshotId
      MERGE (n:TestCase { canonical_id: tc.canonical_id })
      SET n.testcase_id = tc.testcase_id,
          n.name = tc.name,
          n.test_level = tc.level,
          n.suite = tc.suite,
          n.plugin = tc.plugin,
          n.origin = 'BASELINE_MANIFEST',
          n.introduced_in = 'v1.0',
          n.snapshot_id = $snapshotId
      MERGE (s)-[:CONTAINS_TEST]->(n)
      FOREACH (_ IN CASE WHEN tc.endpoint_id IS NOT NULL THEN [1] ELSE [] END |
        MERGE (ep:ApiEndpoint { endpoint_id: tc.endpoint_id })
        MERGE (n)-[pe:PLANNED_ENDPOINT_COVERAGE]->(ep)
        SET pe.origin = 'BASELINE_MANIFEST', pe.snapshot_id = $snapshotId
      )
      WITH n, tc
      UNWIND (CASE WHEN size(tc.requirement_ids) > 0 THEN tc.requirement_ids ELSE [null] END) AS rid
      WITH n, rid WHERE rid IS NOT NULL
      MATCH (r:Requirement { requirement_id: rid })
      MERGE (n)-[pv:PLANNED_VERIFICATION]->(r)
      SET pv.origin = 'BASELINE_MANIFEST', pv.snapshot_id = $snapshotId
    `, { snapshotId, appRepo: REPOS.APP });

    await session.run(`
      MATCH (s:TestSuite { origin: 'BASELINE_MANIFEST' })
      WHERE s.plugin IS NOT NULL
      MATCH (p:Plugin { name: s.plugin })
      MERGE (p)-[:HAS_TEST_SUITE]->(s)
    `);

    // AST-Parsed Developer PHPUnit & Core Jest Suites + TestCases (All 22 PHPUnit suites + Core Jest)
    await runBatched(session, data.testLinkData.suites, 100, `
      UNWIND $batch AS ts
      MERGE (s:TestSuite { name: ts.name })
      SET s.suite_id = ts.suite_id,
          s.plugin = ts.plugin,
          s.module = ts.module,
          s.framework = ts.framework,
          s.repo = ts.repo,
          s.test_count = ts.test_count,
          s.origin = 'AST_DEV_SUITE',
          s.introduced_in = CASE WHEN ts.plugin = 'orangehrmPayrollPlugin' THEN 'v2.2-india-payroll' ELSE 'v1.0' END,
          s.snapshot_id = $snapshotId
      WITH s, ts
      OPTIONAL MATCH (p:Plugin { name: ts.plugin })
      FOREACH (_ IN CASE WHEN p IS NOT NULL THEN [1] ELSE [] END | MERGE (p)-[:HAS_TEST_SUITE]->(s))
    `, { snapshotId });

    await runBatched(session, data.testLinkData.testCases, 400, `
      UNWIND $batch AS tc
      MERGE (n:TestCase { canonical_id: tc.canonical_id })
      SET n.testcase_id = tc.testcase_id,
          n.legacy_ids = tc.legacy_ids,
          n.name = tc.name,
          n.class_fqcn = tc.class_fqcn,
          n.class = tc.class_name,
          n.method_name = tc.method_name,
          n.plugin = tc.plugin,
          n.module = tc.module,
          n.suite = tc.suite,
          n.file = tc.file,
          n.line_start = tc.line_start,
          n.line_end = tc.line_end,
          n.framework = tc.framework,
          n.test_level = tc.test_level,
          n.level = tc.test_level,
          n.automation_status = 'Automated',
          n.origin = tc.origin,
          n.repo = coalesce(tc.repo, $appRepo),
          n.introduced_in = CASE WHEN tc.plugin = 'orangehrmPayrollPlugin' THEN 'v2.2-india-payroll' ELSE 'v1.0' END,
          n.snapshot_id = $snapshotId
      WITH n, tc
      MATCH (s:TestSuite { name: tc.suite })
      MERGE (s)-[:CONTAINS_TEST]->(n)
    `, { snapshotId, appRepo: REPOS.APP });

    await runBatched(session, data.testLinkData.testsEdges, 600, `
      UNWIND $batch AS e
      MATCH (tc:TestCase { canonical_id: e.canonical_id })
      MATCH (m:Method { signature: e.target_method_signature })
      MERGE (tc)-[r:TESTS]->(m)
      SET r.tier = e.tier, r.confidence = e.confidence, r.evidence_type = e.evidence_type,
          r.mapping_source = e.mapping_source, r.snapshot_id = $snapshotId, r.commit_sha = $appCommit
    `, { snapshotId, appCommit });

    await runBatched(session, data.testLinkData.potentialCoversEdges, 500, `
      UNWIND $batch AS e
      MATCH (tc:TestCase { canonical_id: e.canonical_id })
      MATCH (m:Method { signature: e.target_method_signature })
      WHERE NOT (tc)-[:TESTS]->(m)
      MERGE (tc)-[r:POTENTIAL_COVERS]->(m)
      SET r.tier = 4, r.confidence = e.confidence, r.evidence_type = e.evidence_type,
          r.mapping_source = e.mapping_source, r.snapshot_id = $snapshotId
    `, { snapshotId });

    // Upgrade rule: ensure ZERO POTENTIAL_COVERS coexist with confirmed TESTS
    await session.run(`
      MATCH (tc:TestCase)-[:TESTS]->(m:Method)
      MATCH (tc)-[p:POTENTIAL_COVERS]->(m)
      DELETE p
    `);

    await runBatched(session, data.testLinkData.executesAgainstEdges, 300, `
      UNWIND $batch AS e
      MATCH (tc:TestCase { canonical_id: e.canonical_id })
      MATCH (ep:ApiEndpoint { endpoint_id: e.endpoint_id })
      MERGE (tc)-[r:EXECUTES_AGAINST]->(ep)
      SET r.http_method = e.http_method, r.confidence = e.confidence,
          r.evidence_type = e.evidence_type, r.snapshot_id = $snapshotId, r.commit_sha = $appCommit
    `, { snapshotId, appCommit });

    await runBatched(session, data.testLinkData.uiComponentEdges, 300, `
      UNWIND $batch AS e
      MATCH (tc:TestCase { canonical_id: e.canonical_id })
      MATCH (ui:UIComponent { component_id: e.target_component_id })
      MERGE (tc)-[r:TESTS_COMPONENT]->(ui)
      SET r.confidence = e.confidence, r.evidence_type = e.evidence_type, r.snapshot_id = $snapshotId
    `, { snapshotId });

    // External Playwright (AST_PLAYWRIGHT) & Genuine Cypress (AST_CYPRESS) Specs from QKG_QA_REPO_DIR
    await persistQaSpecsToNeo4j(session, data.qaData, {
      snapshotId,
      qaCommit,
      apiEndpoints: data.apiEndpoints,
      uiPages: data.frontend.pages
    });

    // Derived Non-Payroll Code-AST Story & Requirement Traceability (bounded, zero Cartesian fanout)
    await session.run(`
      MATCH (tc:TestCase)-[:EXECUTES_AGAINST]->(ep:ApiEndpoint)<-[:EXECUTES_VIA]-(us:UserStory)
      WHERE coalesce(tc.origin, '') <> 'BASELINE_MANIFEST'
        AND coalesce(tc.plugin, '') <> 'orangehrmPayrollPlugin'
        AND coalesce(us.introduced_in, 'v1.0') = 'v1.0'
      MERGE (tc)-[r:VERIFIES_STORY]->(us)
      ON CREATE SET r.evidence_type = 'DERIVED_API_ENDPOINT', r.confidence = 0.90, r.snapshot_id = $snapshotId
      WITH tc, us
      MATCH (us)-[:REALIZES]->(req:Requirement)
      MERGE (tc)-[vr:VERIFIES]->(req)
      ON CREATE SET vr.evidence_type = 'DERIVED_API_ENDPOINT', vr.confidence = 0.90, vr.snapshot_id = $snapshotId
    `, { snapshotId });

    await session.run(`
      MATCH (tc:TestCase)-[tr:TESTS]->(:Method)<-[:DECLARES]-(c:Class)<-[:HANDLED_BY]-(ep:ApiEndpoint)<-[:EXECUTES_VIA]-(us:UserStory)
      WHERE coalesce(tc.origin, '') <> 'BASELINE_MANIFEST'
        AND coalesce(tc.plugin, '') <> 'orangehrmPayrollPlugin'
        AND coalesce(us.introduced_in, 'v1.0') = 'v1.0'
        AND coalesce(tr.confidence, 0) >= 0.65
      MERGE (tc)-[r:VERIFIES_STORY]->(us)
      ON CREATE SET r.evidence_type = 'DERIVED_HANDLER_METHOD', r.confidence = 0.80, r.snapshot_id = $snapshotId
      WITH tc, us
      MATCH (us)-[:REALIZES]->(req:Requirement)
      MERGE (tc)-[vr:VERIFIES]->(req)
      ON CREATE SET vr.evidence_type = 'DERIVED_HANDLER_METHOD', vr.confidence = 0.80, vr.snapshot_id = $snapshotId
    `, { snapshotId });

    await session.run(`
      MATCH (tc:TestCase)-[:TESTS_COMPONENT]->(ui:UIComponent)<-[:IMPLEMENTED_BY]-(us:UserStory)
      WHERE coalesce(tc.origin, '') <> 'BASELINE_MANIFEST'
        AND coalesce(tc.plugin, '') <> 'orangehrmPayrollPlugin'
        AND coalesce(us.introduced_in, 'v1.0') = 'v1.0'
      MERGE (tc)-[r:VERIFIES_STORY]->(us)
      ON CREATE SET r.evidence_type = 'DERIVED_UI_COMPONENT', r.confidence = 0.85, r.snapshot_id = $snapshotId
      WITH tc, us
      MATCH (us)-[:REALIZES]->(req:Requirement)
      MERGE (tc)-[vr:VERIFIES]->(req)
      ON CREATE SET vr.evidence_type = 'DERIVED_UI_COMPONENT', vr.confidence = 0.85, vr.snapshot_id = $snapshotId
    `, { snapshotId });

    // 8. Payroll v2.2 Specs, Story Traceability, Synthetic Purge & Snapshot Publish
    console.log('[8/8] Linking Payroll v2.2 Specs, Releases & Publishing GraphSnapshot...');
    await ingestPayrollSpecsAndVersioning(session, {
      snapshotId,
      commitSha: appCommit,
      apiEndpoints: data.apiEndpoints,
      testCases: data.testLinkData.testCases
    });

    if (preservedExecLinks.length > 0) {
      await runBatched(session, preservedExecLinks, 500, `
        UNWIND $batch AS row
        MATCH (te:TestExecution { exec_id: row.execId }), (tc:TestCase { testcase_id: row.testId })
        MERGE (te)-[r:EXECUTED_TEST]->(tc)
        SET r += row.props
      `);
    }
    if (preservedMethodCovLinks.length > 0) {
      await runBatched(session, preservedMethodCovLinks, 500, `
        UNWIND $batch AS row
        MATCH (o:CoverageObservation { obs_id: row.obsId }), (m:Method { signature: row.signature })
        MERGE (o)-[r:COVERED_IN]->(m)
        SET r += row.props
      `);
    }
    if (preservedUiCovLinks.length > 0) {
      await runBatched(session, preservedUiCovLinks, 500, `
        UNWIND $batch AS row
        MATCH (o:CoverageObservation { obs_id: row.obsId }), (u:UIComponent { component_id: row.componentId })
        MERGE (o)-[r:COVERED_COMPONENT_IN]->(u)
        SET r += row.props
      `);
    }

    await session.run(`
      MATCH (prev:GraphSnapshot)
      WHERE prev.snapshot_id <> $snapshotId
      SET prev.status = CASE WHEN prev.status = 'PUBLISHED' THEN 'SUPERSEDED' ELSE prev.status END,
          prev.qa_commit = coalesce(prev.qa_commit, 'legacy-pre-v2.1'),
          prev.extractor_version = coalesce(prev.extractor_version, 'pre-2.1'),
          prev.schema_version = coalesce(prev.schema_version, '2.1'),
          prev.started_at = coalesce(prev.started_at, prev.published_at, $nowIso)
    `, { snapshotId, nowIso });

    // Enforce bounded GraphSnapshot retention window
    await session.run(`
      MATCH (old:GraphSnapshot { status: 'SUPERSEDED' })
      WITH old ORDER BY coalesce(old.published_at, old.started_at) DESC
      SKIP $retain
      DETACH DELETE old
    `, { retain: neo4j.int(Math.max(1, SNAPSHOT_RETENTION_LIMIT - 1)) });

    // Persist compact structural manifest + operational telemetry + JSON artifact
    const ingestionDurationMs = Date.now() - startedAtMs;
    const structuralManifest = {
      snapshot_id: snapshotId,
      app_commit: appCommit,
      qa_commit: qaCommit,
      branch,
      schema_version: ontology.meta.schema_version,
      extractor_version: '2.1.0',
      counts: {
        php_files: data.prodParsedFiles.length,
        classes: data.prodParsedFiles.reduce((a, f) => a + (f.classes?.length || 0), 0),
        calls: data.callEdges.length,
        endpoints: data.apiEndpoints.length,
        ui_components: data.frontend.components.length,
        ui_pages: data.frontend.pages.length,
        tables: data.schemaData.tables.length,
        columns: data.dbColumnData.columns.length,
        column_access_edges: data.dbColumnData.columnAccessEdges.length,
        migrations: data.dbColumnData.migrations.length,
        code_tests: data.testLinkData.testCases.length,
        qa_tests: data.qaData.testCases.length,
        baseline_scenarios: nonUnitBaselineRows.length,
        story_endpoint_links: data.storyTargets.endpointLinks.length,
        story_ui_links: data.storyTargets.uiLinks.length,
        missing_spec_targets: data.storyTargets.missingTargets.length,
        dead_letters: data.deadLetters.length
      },
      mariadb_reconciliation: data.dbColumnData.diagnostics?.mariaDbStatus?.reconciliation || {
        status: data.dbColumnData.diagnostics?.mariaDbStatus?.status || 'UNAVAILABLE',
        reason: data.dbColumnData.diagnostics?.mariaDbStatus?.reason || null
      },
      duration_ms: ingestionDurationMs
    };

    const logsDir = path.join(__dirname, 'logs');
    const snapshotsDir = path.join(__dirname, 'snapshots');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    if (!fs.existsSync(snapshotsDir)) fs.mkdirSync(snapshotsDir, { recursive: true });
    if (data.deadLetters.length > 0) {
      fs.writeFileSync(path.join(logsDir, `dead_letter_${snapshotId}.json`), JSON.stringify(data.deadLetters, null, 2));
    }
    if (data.storyTargets.missingTargets.length > 0) {
      fs.writeFileSync(path.join(logsDir, `missing_spec_targets_${snapshotId}.json`), JSON.stringify(data.storyTargets.missingTargets, null, 2));
    }
    const prevSnapRes = await session.run(`
      MATCH (s:GraphSnapshot { snapshot_id: $snapshotId })-[:PREVIOUS_SNAPSHOT]->(prev:GraphSnapshot)
      RETURN prev.snapshot_id AS prevId LIMIT 1
    `, { snapshotId });
    const prevSnapshotId = prevSnapRes.records[0]?.get('prevId') || null;
    const parentManifest = prevSnapshotId ? loadManifest(prevSnapshotId, snapshotsDir) : null;
    const fullManifest = buildManifestFromExtractedData(data, {
      snapshot_id: snapshotId,
      parent_snapshot_id: prevSnapshotId,
      app_commit: appCommit,
      app_branch: branch,
      qa_commit: qaCommit,
      extractor_version: '2.2.0',
      schema_version: ontology.meta.schema_version,
      created_at: nowIso,
      published_at: new Date().toISOString()
    }, { parentManifest });
    writeManifestArtifact(fullManifest, snapshotsDir);
    const manifestHeader = buildCompactNeo4jManifestHeader(fullManifest);
    structuralManifest.structural_digest = manifestHeader.structural_digest;
    structuralManifest.manifest_file = manifestHeader.manifest_file;
    structuralManifest.parent_snapshot_id = prevSnapshotId;
    structuralManifest.delta_from_parent = manifestHeader.delta_from_parent;
    await session.run(`
      MATCH (s:GraphSnapshot { snapshot_id: $snapshotId })
      SET s.structural_digest = $structuralDigest,
          s.manifest_file = $manifestFile,
          s.parent_snapshot_id = $parentSnapshotId
    `, {
      snapshotId,
      structuralDigest: manifestHeader.structural_digest,
      manifestFile: manifestHeader.manifest_file,
      parentSnapshotId: prevSnapshotId
    });
    fs.writeFileSync(path.join(snapshotsDir, `${snapshotId}.json`), JSON.stringify(structuralManifest, null, 2));

    await session.run(`
      MATCH (s:GraphSnapshot { snapshot_id: $snapshotId })
      SET s.status = 'PUBLISHED',
          s.published_at = $publishedAt,
          s.ingestion_duration_ms = $durationMs,
          s.structural_manifest_json = $manifestJson
    `, {
      snapshotId,
      publishedAt: new Date().toISOString(),
      durationMs: ingestionDurationMs,
      manifestJson: JSON.stringify(structuralManifest)
    });

    console.log(`✓ Snapshot ${snapshotId} PUBLISHED cleanly on ${uri} (${ingestionDurationMs} ms).`);
    return { uri, snapshotId, appCommit, qaCommit, durationMs: ingestionDurationMs };
  } finally {
    await session.close();
    await driver.close();
  }
}

async function runCli() {
  const args = process.argv.slice(2);
  const uriFlagIdx = args.indexOf('--uri');
  const clean = args.includes('--clean');
  const promote = args.includes('--promote');
  const noDb = args.includes('--no-mariadb');

  if (promote) {
    const stagingUri = 'bolt://localhost:7688';
    const prodUri = 'bolt://localhost:7687';
    await runFullIngestion({ uri: stagingUri, clean: true, connectMariaDb: !noDb });
    const stageValidation = await validateGoldenDataset({ uri: stagingUri });
    console.log(`\nStaging Validation: ${stageValidation.passed}/${stageValidation.total} passed`);
    for (const c of stageValidation.checks) {
      if (!c.passed) console.log(`[FAIL] #${c.id} ${c.name}:`, c.detail);
    }
    if (stageValidation.failed > 0) {
      console.error('ABORTING PROMOTION: Staging failed Golden Validation. Production 7687 untouched!');
      process.exit(1);
    }
    console.log(`\nStaging passed ${stageValidation.passed}/${stageValidation.total}! Promoting verified build to production (bolt://localhost:7687)...`);
    await runFullIngestion({ uri: prodUri, clean: true, connectMariaDb: !noDb });
    const prodValidation = await validateGoldenDataset({ uri: prodUri });
    console.log(`\nProduction Validation: ${prodValidation.passed}/${prodValidation.total} passed`);
    if (prodValidation.failed > 0) process.exit(1);
    return;
  }

  let targetUri = process.env.NEO4J_URI || 'bolt://localhost:7688';
  if (uriFlagIdx !== -1 && args[uriFlagIdx + 1]) targetUri = args[uriFlagIdx + 1];
  else if (args.includes('--staging')) targetUri = 'bolt://localhost:7688';
  else if (args.includes('--production')) targetUri = 'bolt://localhost:7687';

  await runFullIngestion({ uri: targetUri, clean, connectMariaDb: !noDb });
  const validation = await validateGoldenDataset({ uri: targetUri });
  console.log(`\nValidation (${targetUri}): ${validation.passed}/${validation.total} passed`);
  for (const c of validation.checks) {
    console.log(`[${c.passed ? 'PASS' : 'FAIL'}] #${c.id} ${c.name} -> ${JSON.stringify(c.detail)}`);
  }
  if (validation.failed > 0) process.exit(1);
}

if (require.main === module) {
  runCli().catch((err) => {
    console.error('Pipeline failed:', err);
    process.exit(1);
  });
}

module.exports = {
  extractWorkspaceSnapshot,
  runFullIngestion,
  applySchemaConstraints
};
