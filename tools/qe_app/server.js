const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const neo4jService = require('./services/neo4j_service');
const mariadbService = require('./services/mariadb_service');
const githubService = require('./services/github_service');
const tiaService = require('./services/tia_service');
const testService = require('./services/test_service');
const metricsService = require('./services/metrics_service');
const agentOrchestrator = require('./services/agent_orchestrator');
const qeIntelligenceService = require('./services/qe_intelligence_service');
const artifactGovernanceService = require('./services/artifact_governance_service');
const snapshotManifest = require('../qkg_engine/snapshot_manifest');
const { sanitizePayload } = require('../qkg_engine/security_guard');

const app = express();
const PORT = process.env.QE_APP_PORT || 4500;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create logs directory
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

function auditLog(action, details = {}) {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    action,
    details: sanitizePayload(details)
  }) + '\n';
  fs.appendFileSync(path.join(logDir, 'audit.log'), line, 'utf8');
}

// ==========================================
// REST API - DETERMINISTIC QUALITY SERVICES
// ==========================================

// 1. Quality Metrics & Telemetry Runs
app.get('/api/v2/quality/metrics', async (req, res) => {
  res.json(await metricsService.getExecutiveQualityMetrics());
});

app.get('/api/v2/quality/coverage', async (req, res) => {
  const limit = parseInt(req.query.limit || '10', 10);
  res.json({ runs: await testService.getCoverageRuns(limit) });
});

app.get('/api/v2/quality/runs', async (req, res) => {
  const limit = parseInt(req.query.limit || '10', 10);
  res.json({ runs: await testService.getTestRuns(limit) });
});

// 2. Knowledge Graph
app.get('/api/v2/graph/overview', async (req, res) => {
  const version = req.query.version || null;
  const data = await neo4jService.getGraphOverview(version);
  res.json(data);
});

app.get('/api/v2/graph/visual', async (req, res) => {
  const limit = parseInt(req.query.limit || '80', 10);
  const data = await neo4jService.getGraphVisualData(limit);
  res.json(data);
});

app.post('/api/v2/graph/query', async (req, res) => {
  const { cypher } = req.body;
  if (!cypher) return res.status(400).json({ error: 'Cypher query string is required' });

  auditLog('CYPHER_STUDIO_QUERY', { query: cypher });
  try {
    const data = await neo4jService.runCustomCypher(cypher);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/v2/graph/module/:name', async (req, res) => {
  const data = await neo4jService.getModuleArchitecture(req.params.name);
  res.json(data);
});

app.get('/api/v2/graph/compare', async (req, res) => {
  const src = req.query.source || 'v1.0';
  const tgt = req.query.target || 'v2.2-india-payroll';
  const data = await neo4jService.compareGraphBaselines(src, tgt);
  res.json(data);
});

app.get('/api/v2/graph/cross-module/:plugin', async (req, res) => {
  try {
    const maxHops = Number(req.query.maxHops || 3);
    const limit = Number(req.query.limit || 50);
    const data = await tiaService.engine.analyzeCrossPluginImpact(req.params.plugin, { maxHops, limit });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Database & Drift Studio
app.get('/api/v2/database/overview', async (req, res) => {
  const db = req.query.database || 'orangehrm_mysql';
  const data = await mariadbService.getDatabaseOverview(db);
  res.json(data);
});

app.get('/api/v2/database/drift', async (req, res) => {
  const data = await mariadbService.compareTableSchemas();
  res.json(data);
});

app.get('/api/v2/database/table/:table', async (req, res) => {
  const db = req.query.database || 'orangehrm_mysql';
  const data = await mariadbService.getTableSchema(db, req.params.table);
  res.json(data);
});

app.get('/api/v2/database/rows/:table', async (req, res) => {
  const db = req.query.database || 'orangehrm_mysql';
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '20', 10);
  try {
    const data = await mariadbService.getTableRows(req.params.table, db, page, limit);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/v2/database/query', async (req, res) => {
  const { sql, database } = req.body;
  if (!sql) return res.status(400).json({ error: 'SQL string is required' });

  auditLog('SQL_STUDIO_QUERY', { sql, database });
  try {
    const data = await mariadbService.executeReadOnlySql(sql, database);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Test Intelligence & Full Catalogue
app.get('/api/v2/tests/catalogue', async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '50', 10);
  const moduleFilter = req.query.module || '';
  const layerFilter = req.query.layer || '';
  const search = req.query.search || '';
  const includeBaseline = req.query.includeBaseline === 'true';

  const data = await metricsService.getTestCatalogue(page, limit, moduleFilter, layerFilter, search, includeBaseline);
  res.json(data);
});

// 5. GitHub & PR Analysis
app.get('/api/v2/github/status', (req, res) => {
  res.json(githubService.getRepositoryStatus());
});

app.get('/api/v2/github/commits', (req, res) => {
  const limit = parseInt(req.query.limit || '10', 10);
  res.json(githubService.getRecentCommits(limit));
});

app.get('/api/v2/github/pull-requests', (req, res) => {
  res.json(githubService.listPullRequests());
});

app.get('/api/v2/github/pull-requests/:id/analysis', async (req, res) => {
  auditLog('PR_ANALYSIS_REQUEST', { prId: req.params.id });
  const data = await tiaService.analyzePullRequest(req.params.id);
  res.json(data);
});

// 6. TIA & Test Planning
app.post('/api/v2/tia/analyze', async (req, res) => {
  const files = req.body.files || [];
  auditLog('TIA_ANALYZE_FILES', { count: files.length });
  const data = await tiaService.analyzeFiles(files);
  res.json(data);
});

app.post('/api/v2/tests/plan', async (req, res) => {
  const plan = await testService.createTestPlan(
    req.body.scope || 'targeted',
    req.body.tests || [],
    { files: req.body.files || [] }
  );
  auditLog('TEST_PLAN_CREATED', { planId: plan.planId });
  res.json(plan);
});

app.post('/api/v2/tests/approve', (req, res) => {
  const { planId, approvalToken } = req.body;
  try {
    const result = testService.approvePlan(planId, approvalToken);
    auditLog('TEST_PLAN_APPROVED', { planId });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/v2/tests/execute', (req, res) => {
  const { planId } = req.body;
  try {
    const result = testService.enqueueExecution(planId);
    auditLog('TEST_EXECUTION_ENQUEUED', { planId, jobId: result.jobId });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/v2/tests/executions/:id', (req, res) => {
  res.json(testService.getJobStatus(req.params.id));
});

// 7. Agentic Chat
app.post('/api/v2/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  auditLog('AGENTIC_CHAT_PROMPT', { messageLength: message.length });

  try {
    const result = await agentOrchestrator.processChat(message, history || []);
    res.json(result);
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 8. Server-Sent Events (SSE) Bus
app.get('/api/v2/events/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const unsubscribe = testService.subscribe((event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  req.on('close', () => {
    unsubscribe();
  });
});

// 9. Unified QE Intelligence Facade & Standardized 8-Tool REST Contract (Phase 5A/5B)
const CANONICAL_QE_DISPATCH = {
  get_code_impact: (args) => qeIntelligenceService.getCodeImpact(args),
  get_business_impact: (args) => qeIntelligenceService.getBusinessImpact(args),
  get_impacted_tests: (args) => qeIntelligenceService.getImpactedTests(args),
  get_test_health: (args) => qeIntelligenceService.getTestHealth(args),
  get_coverage_gaps: (args) => qeIntelligenceService.getCoverageGaps(args),
  get_module_quality: (args) => qeIntelligenceService.getModuleQuality(args),
  compare_snapshots: (args) => qeIntelligenceService.compareSnapshots(args),
  explain_test_selection: (args) => qeIntelligenceService.explainTestSelection(args)
};

// Extended Context Retrieval & Governance Dispatchers (Phase 1 / ARCH-02)
const EXTENDED_QE_DISPATCH = {
  ...CANONICAL_QE_DISPATCH,
  get_release_readiness: () => qeIntelligenceService.getReleaseReadiness(),
  get_test_generation_context: (args) => qeIntelligenceService.getTestGenerationContext(args),
  get_business_context: (args) => qeIntelligenceService.getBusinessContext(args),
  get_code_context: (args) => qeIntelligenceService.getCodeContext(args),
  get_api_ui_context: (args) => qeIntelligenceService.getApiUiContext(args),
  get_existing_tests: (args) => qeIntelligenceService.getExistingTests(args),
  propose_test_artifact: (args) => artifactGovernanceService.proposeArtifact(args),
  list_review_queue: (args) => artifactGovernanceService.listReviewQueue(args),
  get_test_artifact: (args) => artifactGovernanceService.getArtifact(args.artifact_id || args.id),
  update_artifact_status: (args) => artifactGovernanceService.updateArtifactStatus(
    args.artifact_id || args.id,
    args.status,
    { actor: args.actor, comment: args.comment }
  )
};

app.all('/api/v2/qe/:tool', async (req, res) => {
  const handler = EXTENDED_QE_DISPATCH[req.params.tool];
  if (!handler) {
    return res.status(404).json({ error: `Unknown QE capability '${req.params.tool}'` });
  }
  const args = { ...(req.query || {}), ...(req.body || {}) };
  auditLog('QE_FACADE_CALL', { tool: req.params.tool });
  try {
    const result = await handler(args);
    res.json(result);
  } catch (err) {
    res.status(500).json({ analysisStatus: 'FAILED', error: err.message });
  }
});

// Dedicated REST endpoints for Review Queue & Context
app.get('/api/v2/artifacts/review-queue', async (req, res) => {
  try {
    const list = await artifactGovernanceService.listReviewQueue(req.query);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v2/artifacts/propose', async (req, res) => {
  try {
    const result = await artifactGovernanceService.proposeArtifact(req.body);
    res.status(result.is_duplicate ? 409 : 201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/v2/artifacts/:id/status', async (req, res) => {
  try {
    const result = await artifactGovernanceService.updateArtifactStatus(
      req.params.id,
      req.body.status,
      { actor: req.body.actor, comment: req.body.comment }
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/v2/context/test-generation', async (req, res) => {
  try {
    const result = await qeIntelligenceService.getTestGenerationContext(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ analysisStatus: 'FAILED', error: err.message });
  }
});

app.get('/api/v2/intelligence/status', async (req, res) => {
  res.json(await qeIntelligenceService.getSnapshotStatus(req.query || {}));
});

app.get('/api/v2/intelligence/overview', async (req, res) => {
  res.json(await qeIntelligenceService.getQualityOverview(req.query || {}));
});

app.get('/api/v2/intelligence/manifests', (req, res) => {
  res.json({ manifests: snapshotManifest.listManifestFiles() });
});

app.all('/api/v2/intelligence/compare', async (req, res) => {
  const args = { ...(req.query || {}), ...(req.body || {}) };
  res.json(await qeIntelligenceService.compareSnapshots(args));
});

app.get('/api/v2/intelligence/benchmark', async (req, res) => {
  const statusEnv = await qeIntelligenceService.getSnapshotStatus(req.query || {});
  const benchPath = path.resolve(__dirname, '../qkg_engine/output/tia_benchmark_report.json');
  let fullReport = null;
  if (fs.existsSync(benchPath)) {
    try {
      fullReport = JSON.parse(fs.readFileSync(benchPath, 'utf8'));
    } catch (_) {
      fullReport = null;
    }
  }
  res.json({
    ...statusEnv,
    data: {
      ...(statusEnv.data || {}),
      fullReport
    }
  });
});

app.all('/api/v2/intelligence/entity', async (req, res) => {
  const args = { ...(req.query || {}), ...(req.body || {}) };
  res.json(await qeIntelligenceService.explainEntity(args));
});

app.get('/api/v2/intelligence/release-readiness', async (req, res) => {
  res.json(await qeIntelligenceService.getReleaseReadiness(req.query || {}));
});

app.get('/api/v2/intelligence/gaps', async (req, res) => {
  res.json(await qeIntelligenceService.listTestGaps(req.query || {}));
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', async () => {
    const metrics = await metricsService.getExecutiveQualityMetrics().catch(() => null);
    const totalTests = metrics?.overview?.totalVerifiedTests ?? 'N/A';
    console.log(`================================================================`);
    console.log(`QE Intelligence Platform Online at http://127.0.0.1:${PORT}`);
    console.log(`Live Neo4j Status: ${metrics?.status || 'UNKNOWN'} | Code-Linked Tests: ${totalTests}`);
    console.log(`================================================================`);
  });
}

module.exports = app;
module.exports.CANONICAL_QE_DISPATCH = CANONICAL_QE_DISPATCH;
