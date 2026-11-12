/**
 * Read-Only QKG MCP Server Core
 *
 * Exposes read-only Quality Knowledge Graph tools with:
 *   - Strict read-only enforcement (blocks mutations / arbitrary writes)
 *   - Recursive PII & secret sanitization
 *   - Mandatory metadata envelope: { graphSnapshotId, appCommit, qaCommit, analysisStatus, data }
 */

const { execFileSync } = require('child_process');
const neo4j = require('neo4j-driver');
const { TIAEngine } = require('../qkg_engine/tia_engine');
const { WORKSPACE_ROOT, BASELINE_REQUIREMENT_FANOUT_GUARD } = require('../qkg_engine/qkg_config');

const SENSITIVE_KEY_RE = /^(password|passwd|api_?key|secret|token|access_?token|refresh_?token|private_?key|aadhaar|pan_?num|bank_?account|ifsc|salary|email|phone|ssn|authorization)$/i;
const SENSITIVE_VALUE_RE = /\b(sk-[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9]{12,}|Bearer\s+[A-Za-z0-9._-]{12,})\b/g;
const MUTATION_CYPHER_RE = /\b(CREATE|MERGE|DELETE|DETACH|SET|REMOVE|DROP|FOREACH)\b/i;

function sanitizePayload(value, seen = new WeakSet()) {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') {
    return value.replace(SENSITIVE_VALUE_RE, '[REDACTED_SECRET]');
  }
  if (typeof value !== 'object') return value;
  if (seen.has(value)) return '[Circular]';
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => sanitizePayload(item, seen));
  }

  if (neo4j.isInt(value)) return value.toNumber();

  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (SENSITIVE_KEY_RE.test(k)) {
      out[k] = '[REDACTED]';
    } else {
      out[k] = sanitizePayload(v, seen);
    }
  }
  return out;
}

function getToolDefinitions() {
  return [
    {
      name: 'tia_analyze_files',
      description: 'Run graph-driven 5-channel Test Impact Analysis on changed files with health state (SUCCESS/PARTIAL/STALE/UNAVAILABLE).',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          files: { type: 'array', items: { type: 'string' }, description: 'Repository file paths to analyze' },
          baseRef: { type: 'string' },
          headRef: { type: 'string' }
        },
        required: ['files']
      }
    },
    {
      name: 'get_regression_suite',
      description: 'Get prioritized selective regression test suite and identified automation coverage gaps for files or PR.',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          files: { type: 'array', items: { type: 'string' } },
          priority: { type: 'string', enum: ['P1', 'P2', 'ALL'] }
        },
        required: ['files']
      }
    },
    {
      name: 'get_coverage_gaps',
      description: 'List Classes, REST ApiEndpoints, and UIComponents with zero linked automated tests or low measured line coverage.',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          plugin: { type: 'string', description: 'Optional plugin filter e.g. orangehrmPayrollPlugin' },
          limit: { type: 'number', description: 'Max items per category (default 25)' }
        }
      }
    },
    {
      name: 'get_stale_tests',
      description: 'Identify tests flagged NEEDS_UPDATE from changed files or recent FAILED/ERROR TestExecutions.',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          files: { type: 'array', items: { type: 'string' }, description: 'Optional changed files filter' }
        }
      }
    },
    {
      name: 'get_module_coverage',
      description: 'Get per-plugin test counts and latest measured Clover CoverageObservation percentages.',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          plugin: { type: 'string', description: 'Optional single plugin filter' }
        }
      }
    },
    {
      name: 'explain_test_selection',
      description: 'Explain the exact graph path, channel, evidence type, and confidence linking changed files to a testId.',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          testId: { type: 'string' },
          files: { type: 'array', items: { type: 'string' } }
        },
        required: ['testId', 'files']
      }
    },
    {
      name: 'get_cross_module_impact',
      description: 'Inspect hop-bounded (maxHops 1..3) cross-plugin CALLS, DI/Inheritance, Symfony events, shared DB table/column couplings, and UI->API links for a plugin.',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          plugin: { type: 'string' },
          maxHops: { type: 'number', description: 'Hop limit (1..3, default 3)' },
          limit: { type: 'number' }
        },
        required: ['plugin']
      }
    }
  ];
}

class QkgMcpServer {
  /**
   * @param {Object} options Optional { queryRunner, qaCommit }
   */
  constructor(options = {}) {
    this.qaCommit = options.qaCommit || process.env.QA_COMMIT || 'unconfigured';
    this.currentCommit = options.currentCommit;
    if (options.queryRunner) {
      this.externalRunner = options.queryRunner;
      this.driver = null;
    } else {
      const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
      const user = process.env.NEO4J_USER || 'neo4j';
      const password = process.env.NEO4J_PASSWORD || 'admin123';
      this.database = process.env.NEO4J_DATABASE || 'neo4j';
      this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password), { connectionTimeout: 5000 });
    }
    this.tiaEngine = new TIAEngine((cypher, params) => this.runReadOnlyQuery(cypher, params));
  }

  async runReadOnlyQuery(cypher, params = {}) {
    if (MUTATION_CYPHER_RE.test(cypher)) {
      throw new Error('ReadOnlyViolation: Mutating Cypher statements are strictly prohibited in qkg-mcp.');
    }
    if (this.externalRunner) {
      return await this.externalRunner(cypher, params);
    }
    const session = this.driver.session({ database: this.database, defaultAccessMode: neo4j.session.READ });
    try {
      const res = await session.run(cypher, params);
      return res.records.map((rec) => {
        const obj = {};
        for (const k of rec.keys) {
          obj[k] = sanitizePayload(rec.get(k));
        }
        return obj;
      });
    } finally {
      await session.close();
    }
  }

  async _getEnvelopeBase(overrideStatus = null, snapshotHint = null) {
    if (snapshotHint) {
      return {
        graphSnapshotId: snapshotHint.snapshotId || null,
        appCommit: snapshotHint.appCommit || null,
        qaCommit: this.qaCommit,
        analysisStatus: overrideStatus || 'SUCCESS'
      };
    }
    try {
      const rows = await this.runReadOnlyQuery(`
        MATCH (s:GraphSnapshot)
        WHERE s.status IN ['PUBLISHED', 'STAGING', 'STALE']
        RETURN s.snapshot_id AS snapshotId, s.app_commit AS appCommit, s.qa_commit AS qaCommit, s.status AS status
        ORDER BY CASE s.status WHEN 'PUBLISHED' THEN 0 ELSE 1 END, coalesce(s.published_at, s.started_at) DESC
        LIMIT 1
      `);
      const snap = rows[0] || null;
      let status = overrideStatus || (snap ? (snap.status === 'STALE' ? 'STALE' : 'SUCCESS') : 'UNAVAILABLE');
      if (!overrideStatus && snap?.appCommit) {
        try {
          const head = this.currentCommit !== undefined
            ? this.currentCommit
            : execFileSync('git', ['rev-parse', 'HEAD'], { cwd: WORKSPACE_ROOT, encoding: 'utf8', timeout: 3000 }).trim();
          if (head && snap.appCommit !== 'local-working-tree' && head !== snap.appCommit) status = 'STALE';
        } catch (_) {}
      }
      return {
        graphSnapshotId: snap?.snapshotId || null,
        appCommit: snap?.appCommit || null,
        qaCommit: (this.qaCommit && this.qaCommit !== 'unconfigured') ? this.qaCommit : (snap?.qaCommit || 'not_configured'),
        analysisStatus: status
      };
    } catch (_) {
      return {
        graphSnapshotId: null,
        appCommit: null,
        qaCommit: this.qaCommit,
        analysisStatus: 'UNAVAILABLE'
      };
    }
  }

  async callTool(name, args = {}) {
    if (name === 'tia_analyze_files') {
      const files = Array.isArray(args.files) ? args.files : [];
      const res = await this.tiaEngine.analyzeFiles(files, {
        baseRef: args.baseRef,
        headRef: args.headRef,
        skipStalenessCheck: Boolean(args.skipStalenessCheck)
      });
      const env = await this._getEnvelopeBase(res.analysisStatus, res.snapshotMetadata);
      return sanitizePayload({ ...env, data: res });
    }

    if (name === 'get_regression_suite') {
      const files = Array.isArray(args.files) ? args.files : [];
      const tia = await this.tiaEngine.analyzeFiles(files);
      const priority = args.priority || 'ALL';
      const tests = priority === 'ALL'
        ? tia.impactedRegressionTests
        : tia.impactedRegressionTests.filter((t) => t.priority === priority);
      const env = await this._getEnvelopeBase(tia.analysisStatus, tia.snapshotMetadata);
      return sanitizePayload({
        ...env,
        data: {
          baselineFanoutGuardActive: BASELINE_REQUIREMENT_FANOUT_GUARD,
          totalSelected: tests.length,
          tests,
          advisoryTests: tia.advisoryTests || [],
          evidenceTierSummary: tia.evidenceTierSummary || null,
          newTestGenerationBacklog: tia.newTestGenerationBacklog
        }
      });
    }

    if (name === 'get_coverage_gaps') {
      const plugin = args.plugin || null;
      const limit = Math.max(1, Math.min(100, parseInt(args.limit || 25, 10)));
      const env = await this._getEnvelopeBase();
      if (env.analysisStatus === 'UNAVAILABLE') {
        return { ...env, data: { error: 'Graph unavailable' } };
      }

      const [untestedEndpoints, untestedUi, lowCovMethods] = await Promise.all([
        this.runReadOnlyQuery(`
          MATCH (ep:ApiEndpoint { endpoint_kind: 'REST_API' })
          WHERE ($plugin IS NULL OR ep.plugin = $plugin)
            AND NOT EXISTS {
              MATCH (ep)<-[:EXECUTES_AGAINST]-(tc:TestCase)
              WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
            }
          RETURN ep.endpoint_id AS endpointId, ep.http_method AS httpMethod, ep.path AS path, ep.plugin AS plugin
          ORDER BY plugin, path
          LIMIT $limit
        `, { plugin, limit: neo4j.int(limit) }),
        this.runReadOnlyQuery(`
          MATCH (ui:UIComponent)
          WHERE ($plugin IS NULL OR ui.plugin = $plugin)
            AND NOT EXISTS {
              MATCH (ui)<-[:TESTS_COMPONENT]-(tc:TestCase)
              WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
            }
          RETURN ui.component_id AS componentId, ui.name AS name, ui.file AS file, ui.plugin AS plugin
          ORDER BY plugin, file
          LIMIT $limit
        `, { plugin, limit: neo4j.int(limit) }),
        this.runReadOnlyQuery(`
          CALL {
            MATCH (cr:CoverageRun)
            WITH coalesce(cr.framework, 'phpunit') + '::' + coalesce(cr.suite_scope, 'all') AS bucket, cr
            ORDER BY coalesce(cr.generated_at, cr.ingested_at) DESC
            WITH bucket, collect(cr)[0] AS latestCr
            RETURN collect(latestCr) AS latestCovRuns
          }
          MATCH (c:Class)-[:DECLARES]->(m:Method)
          WHERE ($plugin IS NULL OR c.plugin = $plugin)
            AND EXISTS {
              MATCH (cr:CoverageRun)-[:HAS_OBSERVATION]->(obs:CoverageObservation)-[:COVERED_IN]->(m)
              WHERE cr IN latestCovRuns AND obs.line_coverage_pct IS NOT NULL AND obs.line_coverage_pct < 50
            }
          RETURN c.plugin AS plugin, m.signature AS methodSignature, c.source_file AS sourceFile
          LIMIT $limit
        `, { plugin, limit: neo4j.int(limit) })
      ]);

      return sanitizePayload({
        ...env,
        data: {
          pluginFilter: plugin,
          untestedRestEndpoints: untestedEndpoints,
          untestedUiComponents: untestedUi,
          lowLineCoverageMethods: lowCovMethods
        }
      });
    }

    if (name === 'get_stale_tests') {
      const files = Array.isArray(args.files) ? args.files : [];
      const env = await this._getEnvelopeBase();
      let needsUpdate = [];
      if (files.length > 0) {
        const tia = await this.tiaEngine.analyzeFiles(files);
        needsUpdate = tia.impactedRegressionTests.filter((t) => t.needsUpdateReview);
      }
      const failingExecs = env.analysisStatus !== 'UNAVAILABLE'
        ? await this.runReadOnlyQuery(`
            MATCH (tc:TestCase)<-[:EXECUTED_TEST]-(te:TestExecution)
            WHERE te.status IN ['FAILED', 'ERROR']
            RETURN coalesce(tc.testcase_id, tc.canonical_id) AS testId, tc.suite AS suite,
                   te.status AS status, te.executed_at AS executedAt, te.error_message AS error
            ORDER BY te.executed_at DESC
            LIMIT 50
          `)
        : [];
      return sanitizePayload({
        ...env,
        data: { needsUpdateCandidates: needsUpdate, recentFailures: failingExecs }
      });
    }

    if (name === 'get_module_coverage') {
      const plugin = args.plugin || null;
      const env = await this._getEnvelopeBase();
      if (env.analysisStatus === 'UNAVAILABLE') {
        return { ...env, data: { modules: [] } };
      }
      const rows = await this.runReadOnlyQuery(`
        CALL {
          MATCH (cr:CoverageRun)
          WITH coalesce(cr.framework, 'phpunit') + '::' + coalesce(cr.suite_scope, 'all') AS bucket, cr
          ORDER BY coalesce(cr.generated_at, cr.ingested_at) DESC, coalesce(cr.ingested_at, '') DESC, cr.run_id DESC
          WITH bucket, collect(cr)[0] AS latestCr
          RETURN collect(latestCr) AS latestCovRuns
        }
        MATCH (p:Plugin)
        WHERE ($plugin IS NULL OR p.name = $plugin)
        CALL {
          WITH p
          OPTIONAL MATCH (p)-[:HAS_TEST_SUITE]->(:TestSuite)-[:CONTAINS_TEST]->(tc:TestCase)
          WHERE tc IS NULL OR coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
          RETURN count(DISTINCT tc) AS automatedTests
        }
        CALL {
          WITH p
          OPTIONAL MATCH (p)-[:DECLARES]->(:Class)-[:DECLARES]->(m:Method)
          RETURN count(DISTINCT m) AS totalMethods,
                 count(DISTINCT CASE WHEN EXISTS {
                   MATCH (m)<-[tr:TESTS]-(tc:TestCase)
                   WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
                     AND coalesce(tr.confidence, 0.7) >= 0.5
                 } THEN m END) AS mappedMethods
        }
        CALL {
          WITH p, latestCovRuns
          UNWIND (CASE WHEN size(latestCovRuns) > 0 THEN latestCovRuns ELSE [null] END) AS cr
          OPTIONAL MATCH (cr)-[:HAS_OBSERVATION]->(obsB:CoverageObservation)-[:COVERED_IN]->(mb:Method)<-[:DECLARES]-(:Class { plugin: p.name })
          WITH p, mb, max(coalesce(obsB.lines_covered, 0)) AS mCov, max(coalesce(obsB.lines_total, 0)) AS mTot
          RETURN coalesce(sum(mCov), 0) AS beCov,
                 coalesce(sum(mTot), 0) AS beTot
        }
        CALL {
          WITH p, latestCovRuns
          UNWIND (CASE WHEN size(latestCovRuns) > 0 THEN latestCovRuns ELSE [null] END) AS cr
          OPTIONAL MATCH (cr)-[:HAS_OBSERVATION]->(obsF:CoverageObservation)-[:COVERED_COMPONENT_IN]->(ui:UIComponent { plugin: p.name })
          WITH p, ui, max(coalesce(obsF.lines_covered, 0)) AS fCov, max(coalesce(obsF.lines_total, 0)) AS fTot
          RETURN coalesce(sum(fCov), 0) AS feCov,
                 coalesce(sum(fTot), 0) AS feTot
        }
        RETURN p.name AS plugin,
               automatedTests,
               totalMethods,
               mappedMethods,
               (beCov + feCov) AS linesCovered,
               (beTot + feTot) AS linesTotal
        ORDER BY p.name
      `, { plugin });

      const modules = rows.map((r) => {
        const linesTotal = Number(r.linesTotal || 0);
        const linesCovered = Number(r.linesCovered || 0);
        const totalMethods = Number(r.totalMethods || 0);
        const mappedMethods = Number(r.mappedMethods || 0);
        return {
          plugin: r.plugin,
          automatedTests: Number(r.automatedTests || 0),
          mappingCoveragePct: totalMethods > 0 ? Number(((mappedMethods / totalMethods) * 100).toFixed(2)) : null,
          lineCoveragePct: linesTotal > 0 ? Number(((linesCovered / linesTotal) * 100).toFixed(2)) : null,
          linesCovered,
          linesTotal,
          coverageStatus: linesTotal > 0 ? 'MEASURED' : 'NOT_INGESTED_YET'
        };
      });
      return sanitizePayload({ ...env, data: { modules } });
    }

    if (name === 'explain_test_selection') {
      const files = Array.isArray(args.files) ? args.files : [];
      const testId = String(args.testId || '');
      const tia = await this.tiaEngine.analyzeFiles(files);
      const env = await this._getEnvelopeBase(tia.analysisStatus, tia.snapshotMetadata);
      const match = tia.impactedRegressionTests.find(
        (t) => t.id === testId || t.canonicalId === testId || t.name === testId
      );
      return sanitizePayload({
        ...env,
        data: match
          ? { selected: true, test: match }
          : {
              selected: false,
              testId,
              reason: 'NOT_REACHABLE_FROM_CHANGED_FILES_OR_BLOCKED_BY_BASELINE_FANOUT_GUARD',
              baselineFanoutGuardActive: BASELINE_REQUIREMENT_FANOUT_GUARD
            }
      });
    }

    if (name === 'get_cross_module_impact') {
      const plugin = String(args.plugin || '');
      const limit = Math.max(1, Math.min(100, parseInt(args.limit || 25, 10)));
      const maxHops = Math.max(1, Math.min(3, parseInt(args.maxHops || 3, 10)));
      const env = await this._getEnvelopeBase();
      if (env.analysisStatus === 'UNAVAILABLE') {
        return { ...env, data: {} };
      }

      const impact = await this.tiaEngine.analyzeCrossPluginImpact(plugin, { maxHops, limit });
      return sanitizePayload({
        ...env,
        data: impact
      });
    }

    throw new Error(`Unknown or unauthorized tool: ${name}`);
  }

  async handleJsonRpc(msg) {
    const { id = null, method, params = {} } = msg || {};
    try {
      if (method === 'initialize') {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'orangehrm-qkg-mcp', version: '1.0.0' }
          }
        };
      }
      if (method === 'notifications/initialized') {
        return null;
      }
      if (method === 'tools/list') {
        return { jsonrpc: '2.0', id, result: { tools: getToolDefinitions() } };
      }
      if (method === 'tools/call') {
        const result = await this.callTool(params.name, params.arguments || {});
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            structuredContent: result,
            isError: result.analysisStatus === 'UNAVAILABLE'
          }
        };
      }
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` }
      };
    } catch (err) {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32000, message: err.message }
      };
    }
  }

  async close() {
    if (this.driver) await this.driver.close();
  }
}

module.exports = {
  QkgMcpServer,
  getToolDefinitions,
  sanitizePayload,
  MUTATION_CYPHER_RE
};
