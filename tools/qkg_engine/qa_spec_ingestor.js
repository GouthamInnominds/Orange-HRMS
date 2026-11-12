/**
 * External QA Spec Ingestor (Workstream 2 / QKG-02)
 *
 * Collects Playwright (`AST_PLAYWRIGHT`) and genuine Cypress (`AST_CYPRESS`) specs
 * from `QKG_QA_REPO_DIR` (`orangehrm-qa-automation`, falling back to legacy functional/cypress
 * only when the standalone QA repo lacks integration specs) and persists them cleanly to Neo4j
 * with canonical `TestSuite`, `TestCase`, `EXECUTES_AGAINST`, `NAVIGATES_PAGE`,
 * `TESTS_COMPONENT`, `VERIFIES_STORY`, `VERIFIES`, and `VALIDATES_RULE` edges.
 */

const fs = require('fs');
const path = require('path');
const {
  QA_REPO_DIR,
  ORANGE_HRM_ROOT,
  REPOS,
  getQaGitMetadata
} = require('./qkg_config');
const { extractQaSpecDirectory, extractQaSpecSource } = require('../qkg_qa_extractor');
const { extractCypressSpecDirectory, extractCypressSpecSource } = require('./cypress_ast_extractor');

function normalizeRouteToken(rawPath) {
  if (!rawPath) return '';
  return String(rawPath)
    .split('?')[0]
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/?web\/index\.php/i, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

function normalizeEndpointComparable(endpointStr) {
  if (!endpointStr) return null;
  const trimmed = String(endpointStr).trim();
  const spaceIdx = trimmed.indexOf(' ');
  const method = spaceIdx === -1 ? 'GET' : trimmed.slice(0, spaceIdx).toUpperCase();
  const rawPath = spaceIdx === -1 ? trimmed : trimmed.slice(spaceIdx + 1).trim();
  const cleanPath = ('/' + normalizeRouteToken(rawPath))
    .replace(/\/\{[^}]+\}/g, '/{param}')
    .replace(/\/\*$/g, '/{param}')
    .replace(/\/\d+(?=\/|$)/g, '/{param}')
    .replace(/\/+$/, '') || '/';
  return { method, cleanPath, key: `${method} ${cleanPath}` };
}

function routeMatchesUiPage(rawRoute, uiPage) {
  const cleanRoute = normalizeRouteToken(rawRoute);
  if (!cleanRoute) return false;
  const parts = cleanRoute.split('/').filter(Boolean);
  const lastSeg = (parts[parts.length - 1] || '').replace(/^view/i, '');
  const routeAction = lastSeg.replace(/[^a-z0-9]/gi, '').toLowerCase();
  if (routeAction.length < 3) return false;

  const pageId = String(uiPage.page_id || '').toLowerCase();
  const pageNorm = pageId.replace(/[^a-z0-9]/g, '');
  const compNorm = String(uiPage.component_name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // Exact action token or view -> -list normalization
  if (pageNorm === routeAction || compNorm === routeAction) return true;
  if (`${routeAction}list` === pageNorm || `${routeAction.replace(/s$/, '')}list` === pageNorm) return true;

  // Handle saveEmploymentStatus -> employmentstatussave or list fallback without cross-matching edit/add to save
  const isSave = routeAction.startsWith('save');
  const isEdit = routeAction.startsWith('edit');
  const isDefine = routeAction.startsWith('define');
  const stripped = routeAction.replace(/^(save|edit|add|view|define)/, '');
  const singular = stripped.replace(/ies$/, 'y').replace(/s$/, '');

  if (isSave && (pageNorm === `${stripped}save` || pageNorm === `${singular}save` || pageNorm === `${stripped}add`)) return true;
  if (isEdit && (pageNorm === `${stripped}edit` || pageNorm === `${singular}edit`)) return true;
  if (isDefine && pageNorm.includes(stripped)) return true;
  if (!isSave && !isEdit && stripped.length >= 4 && (pageNorm === `${stripped}list` || pageNorm === `${singular}list`)) return true;

  return pageNorm === stripped || pageNorm === singular;
}

function collectQaSpecs({ qaRepoDir = QA_REPO_DIR, qaCommit = null, files = null } = {}) {
  const resolvedQaDir = qaRepoDir ? path.resolve(qaRepoDir) : null;
  const effectiveCommit = qaCommit || getQaGitMetadata().qaCommit || 'local';
  const specsMap = new Map();

  const addSpec = (spec) => {
    if (!spec || !spec.canonical_id) return;
    specsMap.set(spec.canonical_id, spec);
  };

  if (resolvedQaDir && fs.existsSync(resolvedQaDir)) {
    if (Array.isArray(files)) {
      for (const relFile of files) {
        const cleanRel = String(relFile).replace(/\\/g, '/').replace(/^\/+/, '');
        const abs = path.join(resolvedQaDir, cleanRel);
        if (!fs.existsSync(abs)) continue;
        const code = fs.readFileSync(abs, 'utf8');
        if (/\.spec\.(ts|tsx|js|jsx)$/i.test(cleanRel)) {
          extractQaSpecSource(code, cleanRel, { repo: REPOS.QA, qaCommit: effectiveCommit }).forEach(addSpec);
        } else if (/\.cy\.(ts|tsx|js|jsx)$/i.test(cleanRel) && !cleanRel.includes('/suites/')) {
          extractCypressSpecSource(code, cleanRel, { repo: REPOS.QA, qaCommit: effectiveCommit }).forEach(addSpec);
        }
      }
    } else {
      extractQaSpecDirectory(resolvedQaDir, { repo: REPOS.QA, qaCommit: effectiveCommit }).forEach(addSpec);
      const qaCypressDir = path.join(resolvedQaDir, 'cypress', 'e2e', 'integration');
      if (fs.existsSync(qaCypressDir)) {
        extractCypressSpecDirectory(qaCypressDir, {
          repo: REPOS.QA,
          qaCommit: effectiveCommit,
          relativeRoot: resolvedQaDir
        }).forEach(addSpec);
      }
    }
  }

  // Fallback only if QA_REPO_DIR did not provide Cypress integration specs
  const hasCypress = [...specsMap.values()].some((t) => t.origin === 'AST_CYPRESS');
  if (!hasCypress && !Array.isArray(files)) {
    const legacyCyDir = path.join(ORANGE_HRM_ROOT, 'src', 'test', 'functional', 'cypress', 'e2e', 'integration');
    if (fs.existsSync(legacyCyDir)) {
      extractCypressSpecDirectory(legacyCyDir, {
        repo: REPOS.APP,
        qaCommit: effectiveCommit,
        relativeRoot: path.dirname(ORANGE_HRM_ROOT)
      }).forEach(addSpec);
    }
  }

  const testCases = [...specsMap.values()];

  // Build TestSuites grouped by (suite + file + origin)
  const suitesMap = new Map();
  for (const tc of testCases) {
    const suiteKey = `${tc.origin}::${tc.file}::${tc.suite}`;
    if (!suitesMap.has(suiteKey)) {
      suitesMap.set(suiteKey, {
        suite_id: `suite::${tc.repo}::${tc.file}`,
        name: suiteKey,
        plugin: tc.plugin || 'orangehrmCorePlugin',
        module: (tc.plugin || 'orangehrmCorePlugin').replace(/^orangehrm/, '').replace(/Plugin$/, '').toLowerCase(),
        framework: tc.framework,
        repo: tc.repo,
        origin: tc.origin,
        test_count: 0
      });
    }
    suitesMap.get(suiteKey).test_count += 1;
    tc._suiteNodeName = suiteKey;
  }

  return {
    testCases,
    suites: [...suitesMap.values()],
    qaCommit: effectiveCommit
  };
}

async function persistQaSpecsToNeo4j(session, qaData, { snapshotId, qaCommit, apiEndpoints = null, uiPages = null } = {}) {
  const { testCases = [], suites = [] } = qaData || {};
  if (testCases.length === 0) return { suites: 0, testCases: 0, apiLinks: 0, pageLinks: 0 };

  // Resolve endpoints & pages from parameters or Neo4j
  let knownEndpoints = apiEndpoints;
  if (!knownEndpoints) {
    const epRes = await session.run('MATCH (e:ApiEndpoint) RETURN e.endpoint_id AS endpoint_id, e.http_method AS http_method, e.path AS path, e.plugin AS plugin');
    knownEndpoints = epRes.records.map((r) => ({
      endpoint_id: r.get('endpoint_id'),
      http_method: r.get('http_method'),
      path: r.get('path'),
      plugin: r.get('plugin')
    }));
  }

  let knownPages = uiPages;
  if (!knownPages) {
    const pgRes = await session.run('MATCH (p:UIPage) RETURN p.page_id AS page_id, p.plugin AS plugin, p.component_name AS component_name');
    knownPages = pgRes.records.map((r) => ({
      page_id: r.get('page_id'),
      plugin: r.get('plugin'),
      component_name: r.get('component_name')
    }));
  }

  const epByExactId = new Map();
  const epByNormKey = new Map();
  for (const ep of knownEndpoints) {
    epByExactId.set(ep.endpoint_id, ep.endpoint_id);
    const comp = normalizeEndpointComparable(ep.endpoint_id);
    if (comp) epByNormKey.set(comp.key, ep.endpoint_id);
  }

  const pagesByPlugin = new Map();
  for (const pg of knownPages) {
    const plug = pg.plugin || 'orangehrmCorePlugin';
    if (!pagesByPlugin.has(plug)) pagesByPlugin.set(plug, []);
    pagesByPlugin.get(plug).push(pg);
  }

  // Upsert TestSuites
  await session.run(`
    UNWIND $batch AS ts
    MERGE (s:TestSuite { name: ts.name })
    SET s.suite_id = ts.suite_id,
        s.plugin = ts.plugin,
        s.module = ts.module,
        s.framework = ts.framework,
        s.repo = ts.repo,
        s.origin = ts.origin,
        s.test_count = ts.test_count,
        s.introduced_in = 'v1.0',
        s.snapshot_id = $snapshotId
    WITH s, ts
    OPTIONAL MATCH (p:Plugin { name: ts.plugin })
    FOREACH (_ IN CASE WHEN p IS NOT NULL THEN [1] ELSE [] END | MERGE (p)-[:HAS_TEST_SUITE]->(s))
  `, { batch: suites, snapshotId });

  // Upsert TestCases + edges payload preparation
  const epEdges = [];
  const pageEdges = [];
  const compEdges = [];
  const storyEdges = [];
  const reqEdges = [];
  const ruleEdges = [];

  for (const tc of testCases) {
    const isCypress = tc.origin === 'AST_CYPRESS';
    const apiEvidence = isCypress ? 'CYPRESS_API_ASSERT' : 'PLAYWRIGHT_AST_NETWORK';
    const pageEvidence = isCypress ? 'CYPRESS_PAGE_GOTO' : 'PLAYWRIGHT_GOTO';

    for (const rawEp of tc.covers_endpoints || []) {
      const comp = normalizeEndpointComparable(rawEp);
      let resolvedId = null;
      if (comp && epByExactId.has(`${comp.method} ${comp.cleanPath}`)) {
        resolvedId = `${comp.method} ${comp.cleanPath}`;
      } else if (comp && epByNormKey.has(comp.key)) {
        resolvedId = epByNormKey.get(comp.key);
      } else if (rawEp && epByExactId.has(rawEp)) {
        resolvedId = rawEp;
      }
      if (resolvedId) {
        epEdges.push({
          canonical_id: tc.canonical_id,
          endpoint_id: resolvedId,
          http_method: comp ? comp.method : 'GET',
          evidence_type: apiEvidence,
          confidence: 0.90
        });
      }
    }

    for (const rt of tc.navigates_routes || []) {
      const pluginPages = pagesByPlugin.get(tc.plugin) || [];
      const candidatePool = pluginPages.length > 0 ? pluginPages : knownPages;
      for (const pg of candidatePool) {
        if (routeMatchesUiPage(rt, pg)) {
          pageEdges.push({
            canonical_id: tc.canonical_id,
            page_id: pg.page_id,
            route: rt,
            evidence_type: pageEvidence,
            confidence: 0.85
          });
        }
      }
    }

    for (const comp of tc.covers_components || []) {
      compEdges.push({ canonical_id: tc.canonical_id, comp, evidence_type: 'PLAYWRIGHT_TAG', confidence: 0.85 });
    }
    for (const st of tc.verifies_stories || []) {
      storyEdges.push({ canonical_id: tc.canonical_id, story_id: st, evidence_type: 'PLAYWRIGHT_TAG', confidence: 0.90 });
    }
    for (const req of tc.verifies_requirements || []) {
      reqEdges.push({ canonical_id: tc.canonical_id, requirement_id: req, evidence_type: 'PLAYWRIGHT_TAG', confidence: 0.90 });
    }
    for (const rule of tc.validates_rules || []) {
      ruleEdges.push({ canonical_id: tc.canonical_id, rule_id: rule, evidence_type: 'PLAYWRIGHT_TAG', confidence: 0.90 });
    }
  }

  await session.run(`
    UNWIND $batch AS tc
    MERGE (n:TestCase { canonical_id: tc.canonical_id })
    SET n.testcase_id = tc.testcase_id,
        n.name = tc.title,
        n.short_title = tc.short_title,
        n.method_name = tc.short_title,
        n.plugin = tc.plugin,
        n.module = toLower(replace(replace(tc.plugin, 'orangehrm', ''), 'Plugin', '')),
        n.suite = tc.suite,
        n.file = tc.file,
        n.line_start = tc.line_start,
        n.line_end = tc.line_end,
        n.framework = tc.framework,
        n.test_level = CASE WHEN tc.file CONTAINS '/api/' THEN 'API' ELSE 'E2E' END,
        n.level = CASE WHEN tc.file CONTAINS '/api/' THEN 'API' ELSE 'E2E' END,
        n.automation_status = 'Automated',
        n.skipped = coalesce(tc.skipped, false),
        n.origin = tc.origin,
        n.repo = tc.repo,
        n.qa_commit = coalesce($qaCommit, tc.qa_commit),
        n.introduced_in = 'v1.0',
        n.snapshot_id = $snapshotId
    WITH n, tc
    MATCH (s:TestSuite { name: tc._suiteNodeName })
    MERGE (s)-[:CONTAINS_TEST]->(n)
  `, { batch: testCases, snapshotId, qaCommit });

  if (epEdges.length > 0) {
    await session.run(`
      UNWIND $batch AS e
      MATCH (tc:TestCase { canonical_id: e.canonical_id })
      MATCH (ep:ApiEndpoint { endpoint_id: e.endpoint_id })
      MERGE (tc)-[r:EXECUTES_AGAINST]->(ep)
      SET r.http_method = e.http_method,
          r.evidence_type = e.evidence_type,
          r.confidence = e.confidence,
          r.snapshot_id = $snapshotId
    `, { batch: epEdges, snapshotId });
  }

  if (pageEdges.length > 0) {
    await session.run(`
      UNWIND $batch AS e
      MATCH (tc:TestCase { canonical_id: e.canonical_id })
      MATCH (pg:UIPage { page_id: e.page_id })
      MERGE (tc)-[r:NAVIGATES_PAGE]->(pg)
      SET r.route = e.route,
          r.evidence_type = e.evidence_type,
          r.confidence = e.confidence,
          r.snapshot_id = $snapshotId
    `, { batch: pageEdges, snapshotId });
  }

  if (compEdges.length > 0) {
    await session.run(`
      UNWIND $batch AS e
      MATCH (tc:TestCase { canonical_id: e.canonical_id })
      MATCH (ui:UIComponent)
      WHERE ui.component_id = e.comp
         OR ui.name = replace(e.comp, '.vue', '')
         OR ui.file ENDS WITH ('/' + e.comp)
      MERGE (tc)-[r:TESTS_COMPONENT]->(ui)
      SET r.evidence_type = e.evidence_type,
          r.confidence = e.confidence,
          r.snapshot_id = $snapshotId
    `, { batch: compEdges, snapshotId });
  }

  if (storyEdges.length > 0) {
    await session.run(`
      UNWIND $batch AS e
      MATCH (tc:TestCase { canonical_id: e.canonical_id })
      MATCH (us:UserStory { story_id: e.story_id })
      MERGE (tc)-[r:VERIFIES_STORY]->(us)
      SET r.evidence_type = e.evidence_type, r.confidence = e.confidence, r.snapshot_id = $snapshotId
    `, { batch: storyEdges, snapshotId });
  }

  if (reqEdges.length > 0) {
    await session.run(`
      UNWIND $batch AS e
      MATCH (tc:TestCase { canonical_id: e.canonical_id })
      MATCH (req:Requirement { requirement_id: e.requirement_id })
      MERGE (tc)-[r:VERIFIES]->(req)
      SET r.evidence_type = e.evidence_type, r.confidence = e.confidence, r.snapshot_id = $snapshotId
    `, { batch: reqEdges, snapshotId });
  }

  if (ruleEdges.length > 0) {
    await session.run(`
      UNWIND $batch AS e
      MATCH (tc:TestCase { canonical_id: e.canonical_id })
      MATCH (br:BusinessRule { rule_id: e.rule_id })
      MERGE (tc)-[r:VALIDATES_RULE]->(br)
      SET r.evidence_type = e.evidence_type, r.confidence = e.confidence, r.snapshot_id = $snapshotId
    `, { batch: ruleEdges, snapshotId });
  }

  return {
    suites: suites.length,
    testCases: testCases.length,
    apiLinks: epEdges.length,
    pageLinks: pageEdges.length
  };
}

module.exports = {
  collectQaSpecs,
  persistQaSpecsToNeo4j,
  normalizeEndpointComparable,
  routeMatchesUiPage
};

