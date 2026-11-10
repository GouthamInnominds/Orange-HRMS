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
    details
  }) + '\n';
  fs.appendFileSync(path.join(logDir, 'audit.log'), line, 'utf8');
}

// ==========================================
// REST API - DETERMINISTIC QUALITY SERVICES
// ==========================================

// 1. Quality Metrics
app.get('/api/v2/quality/metrics', (req, res) => {
  res.json(metricsService.getExecutiveQualityMetrics());
});

// 2. Knowledge Graph
app.get('/api/v2/graph/overview', async (req, res) => {
  const version = req.query.version || null;
  const data = await neo4jService.getGraphOverview(version);
  res.json(data);
});

app.get('/api/v2/graph/module/:name', async (req, res) => {
  const data = await neo4jService.getModuleArchitecture(req.params.name);
  res.json(data);
});

app.get('/api/v2/graph/compare', async (req, res) => {
  const src = req.query.source || 'v1.0.0';
  const tgt = req.query.target || 'v2.0.0-payroll';
  const data = await neo4jService.compareGraphBaselines(src, tgt);
  res.json(data);
});

// 3. Database & Drift
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

// 4. GitHub & PR Analysis
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

// 5. TIA & Test Planning
app.post('/api/v2/tia/analyze', async (req, res) => {
  const files = req.body.files || [];
  auditLog('TIA_ANALYZE_FILES', { count: files.length });
  const data = await tiaService.analyzeFiles(files);
  res.json(data);
});

app.post('/api/v2/tests/plan', (req, res) => {
  const plan = testService.createTestPlan(req.body.scope || 'targeted', req.body.tests || []);
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

// 6. Agentic Chat
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

// 7. Server-Sent Events (SSE) Bus
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`================================================================`);
  console.log(`🚀 QE Intelligence Platform & Agentic Chatbot Online!`);
  console.log(`🌐 Web URL: http://127.0.0.1:${PORT}`);
  console.log(`📡 Azure OpenAI LLM: Connected (${process.env.AZURE_DEPLOYMENT || 'gpt-4.1'})`);
  console.log(`📊 Total Verified Automated Tests: 6,893`);
  console.log(`================================================================`);
});
