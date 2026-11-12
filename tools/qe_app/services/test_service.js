const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const neo4j = require('neo4j-driver');
const neo4jService = require('./neo4j_service');
const tiaService = require('./tia_service');
const { getGitMetadata } = require('../../qkg_engine/qkg_config');
const { ingestExecutionHistory } = require('../../qkg_engine/execution_history_ingestion');

const WORKSPACE_ROOT = path.resolve(__dirname, '../../../');
const QE_ARTIFACT_DIR = path.resolve(WORKSPACE_ROOT, 'tools/qkg_engine/artifacts/qe_exec');
const SAFE_SUITE_REGEX = /^[A-Za-z0-9_-]+$/;
const SAFE_FILTER_REGEX = /^[A-Za-z0-9_:\\\\-]+$/;
const SAFE_SPEC_REGEX = /^[A-Za-z0-9_./-]+\.spec\.(ts|js)$/;

class TestService {
  constructor() {
    this.plans = new Map();
    this.jobs = new Map();
    this.listeners = new Set();
  }

  async createTestPlan(scope = 'targeted', tests = [], options = {}) {
    let selectedTests = Array.isArray(tests) ? tests : [];

    if (selectedTests.length === 0 && Array.isArray(options.files) && options.files.length > 0) {
      const tia = await tiaService.analyzeFiles(options.files);
      selectedTests = tia.candidateTests || [];
    }

    if (selectedTests.length === 0) {
      try {
        const rows = await neo4jService.runQuery(`
          MATCH (tc:TestCase)
          WHERE coalesce(tc.origin, 'AST_DEV_SUITE') IN ['AST_PHPUNIT', 'AST_JEST']
          RETURN coalesce(tc.testcase_id, tc.canonical_id) AS id,
                 tc.canonical_id AS canonicalId,
                 tc.name AS name,
                 tc.suite AS suite,
                 tc.framework AS framework,
                 tc.file AS file,
                 coalesce(tc.test_level, tc.level, 'Unit') AS testLevel
          ORDER BY CASE tc.plugin WHEN 'orangehrmPayrollPlugin' THEN 0 ELSE 1 END, tc.suite, tc.name
          LIMIT 10
        `);
        selectedTests = rows.map((r) => ({
          ...r,
          estSec: r.testLevel === 'API' ? 3 : 1
        }));
      } catch (_) {
        selectedTests = [];
      }
    }

    const planId = 'plan-' + crypto.randomBytes(4).toString('hex');
    const approvalToken = 'appr-' + crypto.randomBytes(8).toString('hex');
    const plan = {
      planId,
      scope,
      createdAt: new Date().toISOString(),
      tests: selectedTests,
      requiresApproval: true,
      approvalToken,
      approved: false
    };

    this.plans.set(planId, plan);
    return plan;
  }

  approvePlan(planId, approvalToken) {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`Plan ${planId} not found`);

    const expected = Buffer.from(String(plan.approvalToken || ''), 'utf8');
    const actual = Buffer.from(String(approvalToken || ''), 'utf8');
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
      throw new Error('Invalid approval token');
    }

    plan.approved = true;
    plan.approvedAt = new Date().toISOString();
    return { planId, status: 'APPROVED', message: 'Test plan approved for allowlisted execution.' };
  }

  enqueueExecution(planId, options = {}) {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`Plan ${planId} not found`);
    if (plan.requiresApproval && !plan.approved) {
      throw new Error(`Execution requires approval for plan ${planId}`);
    }

    const jobId = 'job-' + crypto.randomBytes(4).toString('hex');
    const job = {
      jobId,
      planId,
      status: 'QUEUED',
      mode: options.dryRun ? 'DRY_RUN' : 'ALLOWLISTED_EXECUTION',
      progressPercent: 0,
      totalTests: plan.tests.length,
      completedTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      startTime: new Date().toISOString(),
      endTime: null,
      logs: [`Job ${jobId} enqueued for plan ${planId} (${plan.tests.length} tests)`],
      results: []
    };

    this.jobs.set(jobId, job);
    setImmediate(() => this.runAllowlistedWorker(job, plan.tests, options));

    return { jobId, status: 'QUEUED', message: 'Allowlisted test execution enqueued' };
  }

  _buildAllowlistedCommand(test, reportRelPath = null) {
    const fw = String(test.framework || '').toLowerCase();
    const id = String(test.name || test.id || '');
    const suite = String(test.suite || '');
    const file = String(test.file || '').replace(/\\/g, '/');

    if (fw === 'jest' || file.endsWith('.spec.ts') || file.endsWith('.spec.js')) {
      const specRel = file.replace(/^orange_hrm\/src\/client\//, '');
      if (!SAFE_SPEC_REGEX.test(specRel)) return null;
      const args = ['jest', '--runInBand', specRel];
      if (reportRelPath) {
        args.push('--json', '--outputFile', path.resolve(WORKSPACE_ROOT, reportRelPath));
      }
      return {
        runner: 'JEST_CORE',
        framework: 'jest',
        format: 'jest',
        cmd: process.platform === 'win32' ? 'npx.cmd' : 'npx',
        args,
        cwd: path.join(WORKSPACE_ROOT, 'orange_hrm', 'src', 'client')
      };
    }

    // PHPUnit via WSL
    if (id.includes('::') && SAFE_FILTER_REGEX.test(id)) {
      const args = ['php', 'orange_hrm/src/vendor/bin/phpunit', '-c', 'orange_hrm/phpunit.xml', '--filter', id];
      if (reportRelPath) args.push('--log-junit', reportRelPath);
      return {
        runner: 'PHPUNIT_FILTER',
        framework: 'phpunit',
        format: 'junit',
        cmd: 'wsl',
        args,
        cwd: WORKSPACE_ROOT
      };
    }
    if (suite && SAFE_SUITE_REGEX.test(suite)) {
      const args = ['php', 'orange_hrm/src/vendor/bin/phpunit', '-c', 'orange_hrm/phpunit.xml', '--testsuite', suite];
      if (reportRelPath) args.push('--log-junit', reportRelPath);
      return {
        runner: 'PHPUNIT_SUITE',
        framework: 'phpunit',
        format: 'junit',
        cmd: 'wsl',
        args,
        cwd: WORKSPACE_ROOT
      };
    }
    return null;
  }

  _spawnAllowlisted(spec) {
    return new Promise((resolve) => {
      const start = Date.now();
      const child = spawn(spec.cmd, spec.args, { cwd: spec.cwd, shell: false });
      let out = '';
      child.stdout.on('data', (d) => { out += d.toString(); });
      child.stderr.on('data', (d) => { out += d.toString(); });
      child.on('error', (err) => {
        resolve({ exitCode: -1, durationMs: Date.now() - start, output: err.message });
      });
      child.on('close', (code) => {
        resolve({ exitCode: code ?? 1, durationMs: Date.now() - start, output: out });
      });
    });
  }

  async runAllowlistedWorker(job, tests, options = {}) {
    job.status = 'RUNNING';
    job.logs.push(`Starting allowlisted runner for ${tests.length} test item(s)...`);
    this.notify({ type: 'job_started', job });

    const { appCommit } = getGitMetadata();
    if (!options.dryRun && process.env.QE_RUNNER_MODE !== 'DRY_RUN') {
      fs.mkdirSync(QE_ARTIFACT_DIR, { recursive: true });
    }

    for (let idx = 0; idx < tests.length; idx++) {
      const t = tests[idx];
      const ext = String(t.framework || '').toLowerCase() === 'jest' || String(t.file || '').endsWith('.spec.ts') ? 'json' : 'xml';
      const reportRelPath = `tools/qkg_engine/artifacts/qe_exec/${job.jobId}_${idx}.${ext}`;
      const reportAbsPath = path.resolve(WORKSPACE_ROOT, reportRelPath);
      const spec = this._buildAllowlistedCommand(t, reportRelPath);
      if (!spec) {
        job.completedTests++;
        job.skippedTests++;
        job.results.push({
          testId: t.id,
          name: t.name,
          suite: t.suite,
          status: 'SKIPPED_NOT_IN_ALLOWLIST',
          durationMs: 0
        });
        job.logs.push(`[SKIP] ${t.id} - Not mapped to an allowlisted local PHPUnit/Jest runner`);
      } else if (options.dryRun || process.env.QE_RUNNER_MODE === 'DRY_RUN') {
        job.completedTests++;
        job.skippedTests++;
        job.results.push({
          testId: t.id,
          name: t.name,
          suite: t.suite,
          command: `${spec.cmd} ${spec.args.join(' ')}`,
          status: 'DRY_RUN_VERIFIED_COMMAND',
          durationMs: 0
        });
        job.logs.push(`[DRY_RUN] ${t.id} -> ${spec.cmd} ${spec.args.join(' ')}`);
      } else {
        const res = await this._spawnAllowlisted(spec);
        const passed = res.exitCode === 0;
        job.completedTests++;
        if (passed) job.passedTests++;
        else job.failedTests++;

        let ingestionRunId = null;
        if (fs.existsSync(reportAbsPath)) {
          try {
            const ingestRes = await ingestExecutionHistory({
              reportPath: reportAbsPath,
              format: spec.format,
              source: 'QE_WORKBENCH',
              framework: spec.framework,
              suiteScope: t.suite || 'qe_workbench_targeted',
              environment: 'qe-workbench-local',
              ciRunId: `${job.jobId}-${idx}`,
              appCommit
            });
            ingestionRunId = ingestRes.runId;
            job.logs.push(`[INGEST] Recorded TestRun ${ingestionRunId} (${ingestRes.passed} passed, ${ingestRes.failed} failed)`);
          } catch (ingestErr) {
            job.logs.push(`[WARN] Execution report ingestion failed for ${t.id}: ${ingestErr.message}`);
          } finally {
            try { fs.unlinkSync(reportAbsPath); } catch (_) { /* ignore cleanup errors */ }
          }
        }

        job.results.push({
          testId: t.id,
          name: t.name,
          suite: t.suite,
          runner: spec.runner,
          status: passed ? 'PASSED' : 'FAILED',
          exitCode: res.exitCode,
          durationMs: res.durationMs,
          ingestionRunId
        });
        job.logs.push(`[${passed ? 'PASS' : 'FAIL'}] ${t.id} (${res.durationMs}ms, exit=${res.exitCode})`);
      }

      job.progressPercent = tests.length > 0 ? Math.round((job.completedTests / tests.length) * 100) : 100;
      this.notify({ type: 'test_progress', job, currentTest: t });
    }

    job.status = job.failedTests > 0 ? 'FAILED' : 'COMPLETED';
    job.endTime = new Date().toISOString();
    job.progressPercent = 100;
    job.logs.push(`Job finished (${job.status}): ${job.passedTests} passed, ${job.failedTests} failed, ${job.skippedTests} skipped.`);
    this.notify({ type: 'job_completed', job });
  }

  async getCoverageRuns(limit = 10) {
    const safeLimit = neo4j.int(Math.max(1, Math.min(50, parseInt(limit, 10) || 10)));
    return await neo4jService.runQuery(`
      MATCH (cr:CoverageRun)
      RETURN cr.run_id AS runId, cr.ci_run_id AS ciRunId, cr.app_commit AS appCommit,
             cr.framework AS framework, cr.suite_scope AS suiteScope, cr.environment AS environment,
             cr.snapshot_id AS snapshotId, cr.artifact_sha256 AS artifactSha256,
             cr.lines_covered AS linesCovered, cr.lines_valid AS linesValid,
             cr.line_rate AS lineRate, cr.generated_at AS generatedAt
      ORDER BY cr.generated_at DESC
      LIMIT $limit
    `, { limit: safeLimit });
  }

  async getTestRuns(limit = 10) {
    const safeLimit = neo4j.int(Math.max(1, Math.min(50, parseInt(limit, 10) || 10)));
    return await neo4jService.runQuery(`
      MATCH (tr:TestRun)
      RETURN tr.run_id AS runId, tr.app_commit AS appCommit, tr.qa_commit AS qaCommit,
             tr.framework AS framework, tr.suite_scope AS suiteScope, tr.environment AS environment,
             tr.snapshot_id AS snapshotId, tr.source AS source, tr.total AS total, tr.passed AS passed,
             tr.failed AS failed, tr.skipped AS skipped, coalesce(tr.cancelled, 0) AS cancelled,
             coalesce(tr.flaky, 0) AS flaky, tr.duration_ms AS durationMs, tr.executed_at AS executedAt
      ORDER BY tr.executed_at DESC
      LIMIT $limit
    `, { limit: safeLimit });
  }

  getJobStatus(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) return { error: `Job ${jobId} not found`, status: 'NOT_FOUND' };
    return job;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event) {
    for (const cb of this.listeners) {
      try { cb(event); } catch (_) { /* ignore */ }
    }
  }
}

module.exports = new TestService();
module.exports.TestService = TestService;
