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

const {
  MUTATION_CYPHER_RE: _UNUSED_RE
} = (() => ({ MUTATION_CYPHER_RE: /\b(CREATE|MERGE|DELETE|DETACH|SET|REMOVE|DROP|FOREACH)\b/i }))();
const {
  SENSITIVE_KEY_RE,
  SENSITIVE_VALUE_RE,
  sanitizePayload
} = require('../qkg_engine/security_guard');
const { QeIntelligenceService } = require('../qe_app/services/qe_intelligence_service');

const MUTATION_CYPHER_RE = /\b(CREATE|MERGE|DELETE|DETACH|SET|REMOVE|DROP|FOREACH)\b/i;

/**
 * Standardized 8-Tool MCP Contract (Phase 5A - P5-02), identical in schema & semantics
 * to REST `/api/v2/qe/*` and the QE Workbench Intelligence Facade.
 */
function getToolDefinitions() {
  return [
    {
      name: 'get_code_impact',
      description: 'Analyze direct and transitive code, API, UI, DB, and cross-plugin structural impact for changed files or git refs.',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          changed_files: { type: 'array', items: { type: 'string' }, description: 'Repository file paths to analyze' },
          files: { type: 'array', items: { type: 'string' }, description: 'Alias for changed_files' },
          base_ref: { type: 'string' },
          head_ref: { type: 'string' },
          plugin: { type: 'string' },
          max_hops: { type: 'number' },
          limit: { type: 'number' }
        }
      }
    },
    {
      name: 'get_business_impact',
      description: 'Trace impacted Business Workflows, User Stories, Requirements, and untested requirement backlog gaps.',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          changed_files: { type: 'array', items: { type: 'string' } },
          files: { type: 'array', items: { type: 'string' } },
          requirement_id: { type: 'string' },
          story_id: { type: 'string' },
          plugin: { type: 'string' }
        }
      }
    },
    {
      name: 'get_impacted_tests',
      description: 'Select prioritized Tier 1 & Tier 2 regression tests with graph evidence paths, isolating Tier 3 heuristic and Tier 4 planned backlog.',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          changed_files: { type: 'array', items: { type: 'string' } },
          files: { type: 'array', items: { type: 'string' } },
          base_ref: { type: 'string' },
          head_ref: { type: 'string' },
          include_advisory: { type: 'boolean' }
        }
      }
    },
    {
      name: 'get_test_health',
      description: 'Retrieve test suite pass rates, recent TestRun failures, flaky tests, and stale/never-executed TestCases.',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          plugin: { type: 'string' },
          module: { type: 'string' },
          suite_scope: { type: 'string' },
          limit: { type: 'number' }
        }
      }
    },
    {
      name: 'get_coverage_gaps',
      description: 'List unmapped ApiEndpoints, UIComponents, Methods, Requirements, and low-coverage areas without fabricating missing telemetry.',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          plugin: { type: 'string', description: 'Optional plugin filter e.g. orangehrmPayrollPlugin' },
          module: { type: 'string' },
          limit: { type: 'number', description: 'Max items per category (default 25)' }
        }
      }
    },
    {
      name: 'get_module_quality',
      description: 'Get full plugin/module architecture, automated vs QA spec mapping, quality scorecard, and cross-module blast radius.',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          plugin: { type: 'string' },
          module: { type: 'string' },
          max_hops: { type: 'number' },
          limit: { type: 'number' }
        }
      }
    },
    {
      name: 'compare_snapshots',
      description: 'Compare two QKG snapshots using separate structural vs quality modes; incompatible/missing runs report UNAVAILABLE/INCOMPATIBLE.',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          snapshot_a: { type: 'string' },
          snapshot_b: { type: 'string' },
          mode: { type: 'string', enum: ['structural', 'quality', 'both'] }
        }
      }
    },
    {
      name: 'explain_test_selection',
      description: 'Explain explicit inclusion paths/confidence and explicit exclusion/quarantine rationale for a TestCase across changed files.',
      readOnlyHint: true,
      inputSchema: {
        type: 'object',
        properties: {
          test_id: { type: 'string' },
          testId: { type: 'string' },
          canonical_id: { type: 'string' },
          changed_files: { type: 'array', items: { type: 'string' } },
          files: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  ];
}

class QkgMcpServer {
  /**
   * @param {Object} options Optional { queryRunner, qaCommit, intelligenceService, snapshotsDir }
   */
  constructor(options = {}) {
    this.qaCommit = options.qaCommit || process.env.QA_COMMIT || 'unconfigured';
    this.currentCommit = options.currentCommit;
    if (options.queryRunner) {
      this.externalRunner = options.queryRunner;
      this.driver = null;
    } else {
      const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
      const user = process.env.NEO4J_READONLY_USER || process.env.NEO4J_USER || 'neo4j';
      const password = process.env.NEO4J_READONLY_PASSWORD || process.env.NEO4J_PASSWORD || 'admin123';
      this.database = process.env.NEO4J_DATABASE || 'neo4j';
      this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password), { connectionTimeout: 5000 });
    }
    this.tiaEngine = new TIAEngine((cypher, params) => this.runReadOnlyQuery(cypher, params));
    this.intelligence = options.intelligenceService || new QeIntelligenceService({
      queryRunner: (cypher, params) => this.runReadOnlyQuery(cypher, params),
      snapshotsDir: options.snapshotsDir
    });
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
    const facadeOpts = {
      ...args,
      currentCommit: args.currentCommit !== undefined ? args.currentCommit : this.currentCommit
    };

    const withQaOverride = (res) => {
      if (this.qaCommit && this.qaCommit !== 'unconfigured' && (!res.qaCommit || res.qaCommit === 'not_configured')) {
        return { ...res, qaCommit: this.qaCommit };
      }
      return res;
    };

    // Standardized 8 Phase 5A Capabilities (P5-02)
    if (name === 'get_code_impact') {
      return withQaOverride(await this.intelligence.getCodeImpact(facadeOpts));
    }
    if (name === 'get_business_impact') {
      return withQaOverride(await this.intelligence.getBusinessImpact(facadeOpts));
    }
    if (name === 'get_impacted_tests') {
      return withQaOverride(await this.intelligence.getImpactedTests(facadeOpts));
    }
    if (name === 'get_test_health') {
      return withQaOverride(await this.intelligence.getTestHealth(facadeOpts));
    }
    if (name === 'get_module_quality') {
      return withQaOverride(await this.intelligence.getModuleQuality({
        ...facadeOpts,
        plugin: args.plugin || args.module
      }));
    }
    if (name === 'compare_snapshots') {
      return withQaOverride(await this.intelligence.compareSnapshots(facadeOpts));
    }
    if (name === 'explain_test_selection') {
      const testId = String(args.test_id || args.testId || args.canonical_id || '');
      const files = Array.isArray(args.files) ? args.files : (Array.isArray(args.changed_files) ? args.changed_files : []);
      const exp = await this.intelligence.explainTestSelection({
        ...facadeOpts,
        test_id: testId,
        changed_files: files
      });
      const firstMatch = exp.data?.inclusionExplanations?.[0] || null;
      return withQaOverride(sanitizePayload({
        ...exp,
        data: {
          ...(exp.data || {}),
          selected: Boolean(exp.data?.selected),
          test: firstMatch,
          testId,
          reason: exp.data?.exclusionReason || firstMatch?.reasons?.[0] || null,
          baselineFanoutGuardActive: BASELINE_REQUIREMENT_FANOUT_GUARD
        }
      }));
    }

    if (name === 'get_coverage_gaps') {
      const plugin = args.plugin || args.module || null;
      const limit = Math.max(1, Math.min(100, parseInt(args.limit || 25, 10)));
      const gapRes = await this.intelligence.getCoverageGaps({ ...facadeOpts, plugin, limit });
      if (gapRes.analysisStatus === 'UNAVAILABLE') {
        return withQaOverride({ ...gapRes, data: { error: 'Graph unavailable' } });
      }
      let lowCovMethods = [];
      try {
        lowCovMethods = await this.runReadOnlyQuery(`
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
        `, { plugin, limit: neo4j.int(limit) });
      } catch (_) {
        lowCovMethods = [];
      }
      return withQaOverride(sanitizePayload({
        ...gapRes,
        data: {
          ...gapRes.data,
          pluginFilter: plugin,
          untestedRestEndpoints: (gapRes.data?.uncoveredEndpoints || []).filter((e) => !e.endpointKind || e.endpointKind === 'REST_API'),
          untestedUiComponents: gapRes.data?.uncoveredUiComponents || [],
          lowLineCoverageMethods: lowCovMethods
        }
      }));
    }

    // Legacy & Governance Companion Aliases (preserve full backwards compatibility)
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

    if (name === 'get_snapshot_status') {
      return withQaOverride(await this.intelligence.getSnapshotStatus(facadeOpts));
    }
    if (name === 'get_release_readiness') {
      return withQaOverride(await this.intelligence.getReleaseReadiness(facadeOpts));
    }
    if (name === 'explain_entity') {
      return withQaOverride(await this.intelligence.explainEntity(facadeOpts));
    }
    if (name === 'run_safe_cypher') {
      return withQaOverride(await this.intelligence.runSafeCypher(facadeOpts));
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
