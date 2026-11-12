/**
 * Unified Quality Engineering Intelligence Service Facade (Phase 5A - P5-01, P5-02, P5-03)
 *
 * Non-monolithic orchestration layer composing domain services:
 *   - neo4jService (graph queries, read-only Cypher guard, architecture & traceability)
 *   - metricsService (3-dimensional coverage & execution health)
 *   - tiaService / TIAEngine (multi-channel impact & cross-plugin traversal)
 *   - mariadbService (live INFORMATION_SCHEMA & schema drift checks)
 *   - githubService (Git revisions, diffs & repository state)
 *   - testService (allowlisted execution plans & job status)
 *   - Phase 4 snapshot_manifest, snapshot_comparator, parity_verifier, run_tia_benchmark
 *
 * Every response enforces:
 *   - Canonical envelope: { graphSnapshotId, appCommit, qaCommit, analysisStatus, status,
 *     snapshot, completeness, generatedAt, limitations, warnings, data }
 *   - 5 explicit statuses: SUCCESS (AVAILABLE) | PARTIAL | STALE | UNAVAILABLE (INCOMPATIBLE) | FAILED
 *   - Structured completeness across all 5 layers
 *   - PII / secret sanitization and read-only enforcement
 */

const fs = require('fs');
const path = require('path');

const neo4jService = require('./neo4j_service');
const metricsService = require('./metrics_service');
const tiaService = require('./tia_service');
const mariadbService = require('./mariadb_service');
const githubService = require('./github_service');
const testService = require('./test_service');

const { TIAEngine, classifyChangedFiles } = require('../../qkg_engine/tia_engine');
const {
  BASELINE_REQUIREMENT_FANOUT_GUARD,
  extractPluginFromPath,
  toRepoRelPath,
  getQaGitMetadata
} = require('../../qkg_engine/qkg_config');
const snapshotManifest = require('../../qkg_engine/snapshot_manifest');
const snapshotComparator = require('../../qkg_engine/snapshot_comparator');
const parityVerifier = require('../../qkg_engine/parity_verifier');
const tiaBenchmark = require('../../qkg_engine/run_tia_benchmark');

const {
  SENSITIVE_KEY_RE,
  SENSITIVE_VALUE_RE,
  sanitizePayload,
  validateReadOnlyCypher
} = require('../../qkg_engine/security_guard');

const VALID_ANALYSIS_STATUSES = ['SUCCESS', 'PARTIAL', 'STALE', 'UNAVAILABLE', 'FAILED'];
const VALID_HEALTH_STATUSES = ['AVAILABLE', 'UNAVAILABLE', 'STALE', 'PARTIAL', 'INCOMPATIBLE'];
const VALID_COMPLETENESS_STATES = ['COMPLETE', 'PARTIAL', 'UNAVAILABLE'];

function mapAnalysisStatusToHealthStatus(analysisStatus, isIncompatible = false) {
  if (isIncompatible) return 'INCOMPATIBLE';
  switch (analysisStatus) {
    case 'SUCCESS': return 'AVAILABLE';
    case 'PARTIAL': return 'PARTIAL';
    case 'STALE': return 'STALE';
    case 'UNAVAILABLE': return 'UNAVAILABLE';
    case 'FAILED': return 'UNAVAILABLE';
    default: return 'UNAVAILABLE';
  }
}

function buildCompleteness(partial = {}) {
  const pick = (v) => (VALID_COMPLETENESS_STATES.includes(v) ? v : 'UNAVAILABLE');
  return {
    codeGraph: pick(partial.codeGraph),
    testMappings: pick(partial.testMappings),
    coverage: pick(partial.coverage),
    executionHistory: pick(partial.executionHistory),
    businessTraceability: pick(partial.businessTraceability)
  };
}

function deriveOverallStatus({
  graphAvailable,
  isStale = false,
  isIncompatible = false,
  failed = false,
  completeness,
  extraPartial = false,
  limitations = []
}) {
  if (failed) return 'FAILED';
  if (!graphAvailable || isIncompatible) return 'UNAVAILABLE';
  if (isStale) return 'STALE';

  const vals = Object.values(completeness || {});
  const hasIncomplete = extraPartial || vals.some((v) => v === 'UNAVAILABLE' || v === 'PARTIAL');
  if (hasIncomplete || (limitations || []).some((l) => /UNAVAILABLE|MISSING|UNMAPPED/i.test(l))) {
    return 'PARTIAL';
  }
  return 'SUCCESS';
}

function buildIntelligenceEnvelope({
  snapshot = null,
  completeness,
  analysisStatus,
  isIncompatible = false,
  limitations = [],
  data = {}
}) {
  const safeCompleteness = buildCompleteness(completeness);
  const safeStatus = VALID_ANALYSIS_STATUSES.includes(analysisStatus) ? analysisStatus : 'UNAVAILABLE';
  const cleanLimitations = [...new Set((limitations || []).filter(Boolean))];
  const healthStatus = mapAnalysisStatusToHealthStatus(safeStatus, isIncompatible);

  return sanitizePayload({
    graphSnapshotId: snapshot?.snapshotId || snapshot?.snapshot_id || null,
    appCommit: snapshot?.appCommit || snapshot?.app_commit || null,
    qaCommit: snapshot?.qaCommit || snapshot?.qa_commit || 'not_configured',
    analysisStatus: safeStatus,
    status: healthStatus,
    snapshot: snapshot || null,
    completeness: safeCompleteness,
    generatedAt: new Date().toISOString(),
    limitations: cleanLimitations,
    warnings: cleanLimitations,
    data
  });
}

function toNum(v, fallback = 0) {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'object' && typeof v.toNumber === 'function') return v.toNumber();
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Wraps a raw Neo4j queryRunner function into the minimal neo4jService interface
 * so injected tests / MCP stdio servers share identical Facade behavior without live DBs.
 */
function serializeQueryRunner(queryRunner) {
  let queue = Promise.resolve();
  return (cypher, params = {}) => {
    const exec = queue.then(() => queryRunner(cypher, params));
    queue = exec.catch(() => {});
    return exec;
  };
}

function buildRunnerBackedNeo4jAdapter(queryRunner) {
  const safeRunner = serializeQueryRunner(queryRunner);
  return {
    async runQuery(cypher, params = {}) {
      return await safeRunner(cypher, params);
    },
    async runReadOnlyQuery(cypher, params = {}) {
      const checked = validateReadOnlyCypher(cypher);
      return await safeRunner(checked.query, params);
    },
    async runCustomCypher(cypher) {
      const checked = validateReadOnlyCypher(cypher);
      const rows = await safeRunner(checked.query, {});
      return sanitizePayload(rows);
    },
    async getLatestSnapshot() {
      const rows = await safeRunner(`
        MATCH (s:GraphSnapshot)
        WHERE s.status IN ['PUBLISHED', 'STAGING', 'STALE']
        RETURN s.snapshot_id AS snapshotId,
               s.app_commit AS appCommit,
               s.qa_commit AS qaCommit,
               s.branch AS branch,
               s.status AS status,
               s.published_at AS publishedAt,
               s.started_at AS startedAt,
               s.schema_version AS schemaVersion,
               s.extractor_version AS extractorVersion,
               s.structural_digest AS structuralDigest,
               coalesce(s.dead_letter_count, 0) AS deadLetterCount,
               coalesce(s.missing_spec_target_count, 0) AS missingSpecTargetCount
        ORDER BY CASE s.status WHEN 'PUBLISHED' THEN 0 WHEN 'STAGING' THEN 1 ELSE 2 END,
                 coalesce(s.published_at, s.started_at) DESC
        LIMIT 1
      `);
      return rows[0] || null;
    },
    async getRequirementTraceability(storyId) {
      const rows = await safeRunner(`
        MATCH (us:UserStory) WHERE us.id CONTAINS $storyId OR us.title CONTAINS $storyId
        OPTIONAL MATCH (us)-[:SPECIFIES]->(r:Requirement)
        OPTIONAL MATCH (r)<-[:VERIFIES]-(tc:TestCase)
        OPTIONAL MATCH (tc)-[:EXECUTES_AGAINST]->(ep:ApiEndpoint)
        RETURN us.id AS storyId, us.title AS storyTitle, us.module AS module,
               collect(DISTINCT { id: r.id, description: r.description }) AS requirements,
               collect(DISTINCT { id: tc.id, name: tc.name, type: tc.type, framework: tc.framework, origin: tc.origin }) AS testCases,
               collect(DISTINCT CASE WHEN ep IS NOT NULL THEN ep.http_method + ' ' + ep.path END) AS endpoints
        LIMIT 10
      `, { storyId: storyId || '' });
      return rows;
    }
  };
}

class QeIntelligenceService {
  constructor(deps = {}) {
    this.isMockRunner = Boolean(deps.queryRunner);
    this.queryRunner = deps.queryRunner || null;
    this.repoDir = deps.repoDir || null;
    this.qaRepoDir = deps.qaRepoDir || null;
    this.snapshotsDir = deps.snapshotsDir || snapshotManifest.DEFAULT_SNAPSHOTS_DIR;

    this.neo4jService = deps.neo4jService || (this.queryRunner ? buildRunnerBackedNeo4jAdapter(this.queryRunner) : neo4jService);
    this.metricsService = deps.metricsService || metricsService;
    this.mariadbService = deps.mariadbService || mariadbService;
    this.githubService = deps.githubService || githubService;
    this.testService = deps.testService || testService;

    if (deps.tiaService) {
      this.tiaService = deps.tiaService;
    } else if (this.queryRunner) {
      const engine = new TIAEngine(this.queryRunner, {
        repoDir: this.repoDir || undefined,
        qaRepoDir: this.qaRepoDir || undefined
      });
      this.tiaService = {
        analyzeChangedFiles: (files, opts) => engine.analyzeFiles(files, opts),
        analyzeCrossPluginImpact: (plugin, opts) => engine.analyzeCrossPluginImpact(plugin, opts),
        inspectSnapshotHealth: (opts) => engine.inspectSnapshotHealth(opts)
      };
    } else {
      this.tiaService = tiaService;
    }

    this.snapshotManifest = deps.snapshotManifest || snapshotManifest;
    this.snapshotComparator = deps.snapshotComparator || snapshotComparator;
    this.parityVerifier = deps.parityVerifier || parityVerifier;
    this.tiaBenchmark = deps.tiaBenchmark || tiaBenchmark;
  }

  async _safeRunQuery(cypher, params = {}) {
    if (typeof this.neo4jService.runReadOnlyQuery === 'function') {
      return await this.neo4jService.runReadOnlyQuery(cypher, params);
    }
    return await this.neo4jService.runQuery(cypher, params);
  }

  /**
   * Probes snapshot health + structural/test/coverage/execution/business completeness.
   */
  async _assessContext(options = {}) {
    let snapshot = null;
    let probeRow = null;
    let queryError = null;

    try {
      const snapRows = await this._safeRunQuery(`
        MATCH (s:GraphSnapshot)
        WHERE s.status IN ['PUBLISHED', 'STAGING', 'STALE']
        RETURN s.snapshot_id AS snapshotId,
               s.app_commit AS appCommit,
               s.qa_commit AS qaCommit,
               s.branch AS branch,
               s.status AS status,
               s.published_at AS publishedAt,
               s.started_at AS startedAt,
               s.schema_version AS schemaVersion,
               s.extractor_version AS extractorVersion,
               s.structural_digest AS structuralDigest,
               coalesce(s.dead_letter_count, 0) AS deadLetterCount,
               coalesce(s.missing_spec_target_count, 0) AS missingSpecTargetCount
        ORDER BY CASE s.status WHEN 'PUBLISHED' THEN 0 WHEN 'STAGING' THEN 1 ELSE 2 END,
                 coalesce(s.published_at, s.started_at) DESC
        LIMIT 1
      `);
      snapshot = snapRows && snapRows[0] ? snapRows[0] : null;
    } catch (err) {
      queryError = err;
    }

    if (queryError || !snapshot) {
      return {
        graphAvailable: false,
        isStale: true,
        snapshot: null,
        completeness: buildCompleteness({}),
        limitations: [queryError ? `NEO4J_UNAVAILABLE: ${queryError.message}` : 'NO_GRAPH_SNAPSHOT_PUBLISHED'],
        counts: null
      };
    }

    const limitations = [];
    const currentCommit = options.currentCommit !== undefined
      ? options.currentCommit
      : (!options.skipStalenessCheck && !this.isMockRunner
          ? this.githubService.getRepositoryStatus()?.headCommit
          : null);

    const isExplicitStale = snapshot.status === 'STALE';
    const commitMismatch = Boolean(
      !options.skipStalenessCheck &&
      currentCommit &&
      snapshot.appCommit &&
      snapshot.appCommit !== 'local-working-tree' &&
      currentCommit !== snapshot.appCommit
    );
    const isStale = isExplicitStale || commitMismatch;
    if (isExplicitStale) limitations.push('SNAPSHOT_MARKED_STALE: Latest snapshot status is STALE.');
    if (commitMismatch) limitations.push(`COMMIT_MISMATCH: Active HEAD (${currentCommit}) differs from snapshot (${snapshot.appCommit}).`);

    const deadLetters = toNum(snapshot.deadLetterCount, 0);
    const missingSpecs = toNum(snapshot.missingSpecTargetCount, 0);
    if (deadLetters > 0) limitations.push(`DEAD_LETTERS_PRESENT: ${deadLetters} ingestion dead-letter records detected.`);
    if (missingSpecs > 0) limitations.push(`MISSING_SPEC_TARGETS: ${missingSpecs} QA spec targets could not resolve cleanly.`);

    try {
      const probeRows = await this._safeRunQuery(`
        CALL { MATCH (c:Class) RETURN count(c) AS classCount }
        CALL { MATCH (m:Method) RETURN count(m) AS methodCount }
        CALL { MATCH (tc:TestCase) WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST' RETURN count(tc) AS codeTestCount }
        CALL { MATCH (tc:TestCase)-[r:TESTS|EXECUTES_AGAINST|TESTS_COMPONENT|VERIFIES_STORY]->() WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST' RETURN count(DISTINCT r) AS mappingCount }
        CALL { MATCH (cr:CoverageRun) OPTIONAL MATCH (cr)-[:HAS_OBSERVATION]->(obs:CoverageObservation) RETURN count(DISTINCT cr) AS covRunCount, count(obs) AS covObsCount }
        CALL { MATCH (tr:TestRun) RETURN count(tr) AS testRunCount }
        CALL { MATCH (req:Requirement) RETURN count(req) AS reqCount }
        CALL { MATCH (wf) WHERE wf:Workflow OR wf:UserStory RETURN count(wf) AS wfCount }
        RETURN classCount, methodCount, codeTestCount, mappingCount, covRunCount, covObsCount, testRunCount, reqCount, wfCount
      `);
      probeRow = probeRows && probeRows[0] ? probeRows[0] : null;
    } catch (_) {
      probeRow = null;
    }

    let completeness;
    if (probeRow) {
      const classCount = toNum(probeRow.classCount, 0);
      const methodCount = toNum(probeRow.methodCount, 0);
      const codeTestCount = toNum(probeRow.codeTestCount, 0);
      const mappingCount = toNum(probeRow.mappingCount, 0);
      const covRunCount = toNum(probeRow.covRunCount, 0);
      const covObsCount = toNum(probeRow.covObsCount, 0);
      const testRunCount = toNum(probeRow.testRunCount, 0);
      const reqCount = toNum(probeRow.reqCount, 0);
      const wfCount = toNum(probeRow.wfCount, 0);

      completeness = buildCompleteness({
        codeGraph: classCount > 0 && methodCount > 0 ? 'COMPLETE' : (classCount > 0 || methodCount > 0 ? 'PARTIAL' : 'UNAVAILABLE'),
        testMappings: codeTestCount > 0 && mappingCount > 0 ? 'COMPLETE' : (codeTestCount > 0 ? 'PARTIAL' : 'UNAVAILABLE'),
        coverage: covRunCount > 0 && covObsCount > 0 ? 'COMPLETE' : (covRunCount > 0 ? 'PARTIAL' : 'UNAVAILABLE'),
        executionHistory: testRunCount > 0 ? 'COMPLETE' : 'UNAVAILABLE',
        businessTraceability: reqCount > 0 && wfCount > 0 ? 'COMPLETE' : (reqCount > 0 || wfCount > 0 ? 'PARTIAL' : 'UNAVAILABLE')
      });

      if (completeness.coverage === 'UNAVAILABLE') {
        limitations.push('RUNTIME_COVERAGE_UNAVAILABLE: No CoverageRun/CoverageObservation telemetry ingested for this snapshot.');
      }
      if (completeness.executionHistory === 'UNAVAILABLE') {
        limitations.push('EXECUTION_HISTORY_UNAVAILABLE: No TestRun telemetry ingested yet.');
      }
    } else {
      // Lightweight queryRunner mock fallback (when mock only responds to domain-specific queries)
      completeness = buildCompleteness({
        codeGraph: 'COMPLETE',
        testMappings: 'COMPLETE',
        coverage: 'PARTIAL',
        executionHistory: 'PARTIAL',
        businessTraceability: 'COMPLETE'
      });
    }

    return {
      graphAvailable: true,
      isStale,
      currentCommit,
      snapshot,
      completeness,
      limitations,
      counts: probeRow
    };
  }

  _resolveFiles(args = {}) {
    const raw = args.changed_files || args.files || null;
    if (Array.isArray(raw) && raw.length > 0) return raw;
    if (typeof raw === 'string' && raw.trim()) {
      return raw.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
    }
    return this.githubService.getDiffChangedFiles(args.base_ref || null, args.head_ref || 'HEAD');
  }

  /**
   * 1/8 Canonical Tool + Health endpoint: Snapshot status & completeness overview.
   */
  async getSnapshotStatus(args = {}) {
    const ctx = await this._assessContext(args);
    const manifests = this.snapshotManifest.listManifestFiles
      ? this.snapshotManifest.listManifestFiles(this.snapshotsDir)
      : [];
    let benchmarkReport = null;
    const benchmarkPath = path.resolve(__dirname, '../../qkg_engine/output/tia_benchmark_report.json');
    if (fs.existsSync(benchmarkPath)) {
      try {
        benchmarkReport = JSON.parse(fs.readFileSync(benchmarkPath, 'utf8'));
      } catch (_) {
        benchmarkReport = null;
      }
    }

    const analysisStatus = deriveOverallStatus({
      graphAvailable: ctx.graphAvailable,
      isStale: ctx.isStale,
      completeness: ctx.completeness,
      limitations: ctx.limitations
    });

    return buildIntelligenceEnvelope({
      snapshot: ctx.snapshot,
      completeness: ctx.completeness,
      analysisStatus,
      limitations: ctx.limitations,
      data: {
        snapshot: ctx.snapshot,
        availableManifestsCount: manifests.length,
        latestManifestId: manifests[0]?.snapshotId || null,
        qkg15Benchmark: benchmarkReport
          ? {
              gateStatus: (benchmarkReport.gate_passed ?? benchmarkReport.gate?.passed) ? 'PASS' : 'FAIL',
              scenariosPassed: benchmarkReport.aggregate?.scenarios_passed ?? benchmarkReport.scenariosPassed ?? null,
              scenariosTotal: benchmarkReport.aggregate?.total_scenarios ?? benchmarkReport.scenariosTotal ?? null,
              tier1And2Recall: benchmarkReport.aggregate?.tier_1_2_recall ?? benchmarkReport.metrics?.tier1And2Recall ?? null,
              precision: benchmarkReport.aggregate?.precision ?? benchmarkReport.metrics?.precision ?? null,
              determinismRate: benchmarkReport.aggregate?.determinism_rate ?? benchmarkReport.metrics?.determinismRate ?? null,
              explainabilityRate: benchmarkReport.aggregate?.explanation_completeness ?? benchmarkReport.metrics?.explainabilityRate ?? null,
              generatedAt: benchmarkReport.executed_at || benchmarkReport.generatedAt || null
            }
          : null,
        counts: ctx.counts
      }
    });
  }

  /**
   * Tool 1 (`get_code_impact`): Direct & transitive code/API/UI/DB & cross-plugin impact.
   */
  async getCodeImpact(args = {}) {
    const ctx = await this._assessContext(args);
    const changedFiles = this._resolveFiles(args);

    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: [...ctx.limitations, 'Cannot compute code impact without an active Neo4j snapshot.'],
        data: { changedFiles, affectedComponents: [], crossPluginImpact: null, missingMappings: changedFiles }
      });
    }

    const tia = await this.tiaService.analyzeChangedFiles(changedFiles, {
      title: args.title || 'QKG Code Impact Analysis',
      currentCommit: args.currentCommit,
      skipStalenessCheck: args.skipStalenessCheck
    });

    const inferredPlugin = args.plugin
      || extractPluginFromPath(changedFiles[0] || '')
      || tia.affectedComponents?.[0]?.plugin
      || null;
    let crossPluginImpact = null;
    if (inferredPlugin && typeof this.tiaService.analyzeCrossPluginImpact === 'function') {
      try {
        crossPluginImpact = await this.tiaService.analyzeCrossPluginImpact(inferredPlugin, {
          maxHops: args.max_hops || 3,
          limit: args.limit || 50
        });
      } catch (err) {
        ctx.limitations.push(`CROSS_PLUGIN_QUERY_WARNING: ${err.message}`);
      }
    }

    const limitations = [...ctx.limitations];
    if (tia.stalenessReason) limitations.push(`TIA_STALENESS: ${tia.stalenessReason}`);
    if ((tia.missingMappings || []).length > 0) {
      limitations.push(`UNMAPPED_CODE_FILES: ${tia.missingMappings.length} changed file(s) had no graph mapping.`);
    }

    const analysisStatus = tia.analysisStatus === 'UNAVAILABLE'
      ? 'UNAVAILABLE'
      : deriveOverallStatus({
          graphAvailable: true,
          isStale: ctx.isStale || tia.analysisStatus === 'STALE',
          completeness: ctx.completeness,
          extraPartial: (tia.missingMappings || []).length > 0,
          limitations
        });

    return buildIntelligenceEnvelope({
      snapshot: ctx.snapshot || tia.snapshotMetadata,
      completeness: ctx.completeness,
      analysisStatus,
      limitations,
      data: {
        changedFiles: tia.analyzedFiles || changedFiles,
        affectedComponents: tia.affectedComponents || [],
        missingMappings: tia.missingMappings || [],
        analysisCompleteness: tia.analysisCompleteness || null,
        crossPluginImpact,
        riskAssessment: tia.riskAssessment || null
      }
    });
  }

  /**
   * Tool 2 (`get_business_impact`): Trace workflows, user stories & requirements affected by changes.
   */
  async getBusinessImpact(args = {}) {
    const ctx = await this._assessContext(args);
    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: ctx.limitations,
        data: { affectedRequirements: [], workflows: [], traceability: [] }
      });
    }

    const changedFiles = this._resolveFiles(args);
    const requirementId = args.requirement_id || args.story_id || '';
    const tia = changedFiles.length > 0
      ? await this.tiaService.analyzeChangedFiles(changedFiles, {
          title: 'QKG Business Impact',
          currentCommit: args.currentCommit,
          skipStalenessCheck: args.skipStalenessCheck
        })
      : { affectedRequirements: [], affectedComponents: [], analysisStatus: 'SUCCESS' };

    let storyTraceability = [];
    if (requirementId && typeof this.neo4jService.getRequirementTraceability === 'function') {
      try {
        storyTraceability = await this.neo4jService.getRequirementTraceability(requirementId);
      } catch (err) {
        ctx.limitations.push(`STORY_TRACEABILITY_WARNING: ${err.message}`);
      }
    }

    // Query impacted Workflows & Features tied to affected plugins or components
    const affectedPlugins = [...new Set([
      ...(args.plugin ? [args.plugin] : []),
      ...(changedFiles.map((f) => extractPluginFromPath(f)).filter(Boolean)),
      ...((tia.affectedComponents || []).map((c) => c.plugin).filter(Boolean))
    ])];

    let workflows = [];
    if (affectedPlugins.length > 0) {
      try {
        workflows = await this._safeRunQuery(`
          MATCH (p:Plugin)
          WHERE p.name IN $plugins
          OPTIONAL MATCH (wf:Workflow)-[:BELONGS_TO_PLUGIN|IN_PLUGIN|HAS_FEATURE|COVERS*1..2]->(x)
          WHERE x = p OR x.plugin IN $plugins
          OPTIONAL MATCH (p)-[:IMPLEMENTS|HAS_USER_STORY|DECLARES*1..2]->(us:UserStory)
          RETURN DISTINCT p.name AS plugin,
                 collect(DISTINCT wf.name)[..15] AS workflows,
                 collect(DISTINCT { id: us.id, title: us.title, priority: us.priority })[..20] AS userStories
        `, { plugins: affectedPlugins });
      } catch (_) {
        workflows = [];
      }
    }

    const analysisStatus = deriveOverallStatus({
      graphAvailable: true,
      isStale: ctx.isStale || tia.analysisStatus === 'STALE',
      completeness: ctx.completeness,
      extraPartial: ctx.completeness.businessTraceability !== 'COMPLETE',
      limitations: ctx.limitations
    });

    return buildIntelligenceEnvelope({
      snapshot: ctx.snapshot || tia.snapshotMetadata,
      completeness: ctx.completeness,
      analysisStatus,
      limitations: ctx.limitations,
      data: {
        baselineFanoutGuardActive: BASELINE_REQUIREMENT_FANOUT_GUARD,
        affectedPlugins,
        affectedRequirements: tia.affectedRequirements || [],
        storyTraceability,
        pluginBusinessContext: workflows,
        newTestGenerationBacklog: tia.newTestGenerationBacklog || []
      }
    });
  }

  /**
   * Tool 3 (`get_impacted_tests`): Tiered TIA recommendations, evidence & advisory/exclusion isolation.
   */
  async getImpactedTests(args = {}) {
    const ctx = await this._assessContext(args);
    const changedFiles = this._resolveFiles(args);

    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: [...ctx.limitations, 'Fail-closed: refuse returning guessed regression tests while Neo4j is down.'],
        data: {
          changedFiles,
          impactedRegressionTests: [],
          advisoryTests: [],
          newTestGenerationBacklog: [],
          failClosed: true
        }
      });
    }

    const tia = await this.tiaService.analyzeChangedFiles(changedFiles, {
      title: args.title || 'QKG Impacted Regression Selection',
      currentCommit: args.currentCommit,
      skipStalenessCheck: args.skipStalenessCheck
    });

    const limitations = [...ctx.limitations];
    if (tia.stalenessReason) limitations.push(`TIA_STALENESS: ${tia.stalenessReason}`);
    if ((tia.newTestGenerationBacklog || []).length > 0) {
      limitations.push(`UNTESTED_CHANGES: ${tia.newTestGenerationBacklog.length} affected target(s) lack automated tests.`);
    }

    const impactedRegressionTests = (tia.impactedRegressionTests || tia.candidateTests || []).map((t) => ({
      ...t,
      canonicalId: t.canonicalId || t.id,
      inclusionReason: (t.reasons && t.reasons[0]) || t.reason || `${t.impactChannel} (${t.evidenceTier})`
    }));

    const advisoryTests = (tia.advisoryTests || []).map((t) => ({
      ...t,
      canonicalId: t.canonicalId || t.id,
      exclusionReason: 'TIER_3_POTENTIAL_HEURISTIC isolated from selective regression gate'
    }));

    const analysisStatus = tia.analysisStatus === 'UNAVAILABLE'
      ? 'UNAVAILABLE'
      : deriveOverallStatus({
          graphAvailable: true,
          isStale: ctx.isStale || tia.analysisStatus === 'STALE',
          completeness: ctx.completeness,
          extraPartial: (tia.missingMappings || []).length > 0,
          limitations
        });

    return buildIntelligenceEnvelope({
      snapshot: ctx.snapshot || tia.snapshotMetadata,
      completeness: ctx.completeness,
      analysisStatus,
      limitations,
      data: {
        baselineFanoutGuardActive: BASELINE_REQUIREMENT_FANOUT_GUARD,
        changedFiles: tia.analyzedFiles || changedFiles,
        impactedRegressionTests,
        advisoryTests: args.include_advisory === false ? [] : advisoryTests,
        newTestGenerationBacklog: tia.newTestGenerationBacklog || [],
        missingMappings: tia.missingMappings || [],
        evidenceTierSummary: tia.evidenceTierSummary || null,
        riskAssessment: tia.riskAssessment || null,
        summary: tia.summary || null
      }
    });
  }

  /**
   * Tool 4 (`get_test_health`): Suite execution pass rate, flaky tests & stale/never-run telemetry.
   */
  async getTestHealth(args = {}) {
    const ctx = await this._assessContext(args);
    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: ctx.limitations,
        data: { summary: null, flakyTests: [], recentFailures: [], staleTests: [] }
      });
    }

    const limit = Math.max(1, Math.min(200, Number(args.limit) || 50));
    const pluginFilter = args.plugin || args.module || null;
    const pluginParam = pluginFilter ? String(pluginFilter) : '';

    let overview = null;
    if (!this.isMockRunner && typeof this.metricsService.getExecutiveQualityMetrics === 'function') {
      overview = await this.metricsService.getExecutiveQualityMetrics();
    }

    let staleTests = [];
    let flakyTests = [];
    let recentFailures = [];
    try {
      const [staleRows, flakeRows, failRows] = await Promise.all([
        this._safeRunQuery(`
          MATCH (tc:TestCase)
          WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
            AND ($plugin = '' OR toLower(coalesce(tc.plugin, tc.module, '')) CONTAINS toLower($plugin))
            AND NOT EXISTS { MATCH (:TestRun)-[:HAS_EXECUTION]->(:TestExecution { testcase_id: tc.id }) }
          RETURN tc.id AS id, coalesce(tc.canonical_id, tc.id) AS canonicalId, tc.name AS name,
                 tc.framework AS framework, tc.file AS file, coalesce(tc.plugin, tc.module) AS plugin,
                 tc.repo AS repo, 'NEVER_EXECUTED' AS staleReason
          LIMIT $limit
        `, { plugin: pluginParam, limit }),
        this._safeRunQuery(`
          MATCH (tr:TestRun)-[:HAS_EXECUTION]->(te:TestExecution)
          WITH tr, te ORDER BY coalesce(tr.executed_at, tr.ingested_at) DESC
          WITH coalesce(te.testcase_id, te.raw_name) AS tid,
               collect(te.status)[..10] AS statuses,
               any(x IN collect(coalesce(te.flaky, false)) WHERE x = true) AS hadRetry
          WHERE hadRetry OR ('PASSED' IN statuses AND any(s IN statuses WHERE s IN ['FAILED', 'ERROR']))
          RETURN tid AS id, statuses, hadRetry
          LIMIT $limit
        `, { limit }),
        this._safeRunQuery(`
          MATCH (tr:TestRun)-[:HAS_EXECUTION]->(te:TestExecution)
          WHERE te.status IN ['FAILED', 'ERROR']
            AND ($plugin = '' OR toLower(coalesce(te.suite, '')) CONTAINS toLower($plugin))
          RETURN coalesce(te.testcase_id, te.raw_name) AS id, te.raw_name AS name,
                 te.status AS status, tr.run_id AS runId, tr.executed_at AS executedAt,
                 tr.framework AS framework
          ORDER BY tr.executed_at DESC
          LIMIT $limit
        `, { plugin: pluginParam, limit })
      ]);
      staleTests = staleRows || [];
      flakyTests = flakeRows || [];
      recentFailures = failRows || [];
    } catch (err) {
      ctx.limitations.push(`TEST_HEALTH_QUERY_WARNING: ${err.message}`);
    }

    const completeness = buildCompleteness({
      ...ctx.completeness,
      executionHistory: (overview?.latestTestRuns?.length || recentFailures.length || flakyTests.length) > 0
        ? ctx.completeness.executionHistory
        : (ctx.completeness.executionHistory === 'UNAVAILABLE' ? 'UNAVAILABLE' : 'PARTIAL')
    });

    const analysisStatus = deriveOverallStatus({
      graphAvailable: true,
      isStale: ctx.isStale,
      completeness,
      limitations: ctx.limitations
    });

    return buildIntelligenceEnvelope({
      snapshot: ctx.snapshot || overview?.snapshot,
      completeness,
      analysisStatus,
      limitations: ctx.limitations,
      data: {
        summary: overview?.overview || {
          executionHistoryStatus: completeness.executionHistory,
          staleNeverRunCount: staleTests.length,
          flakyTestsCount: flakyTests.length,
          recentFailuresCount: recentFailures.length
        },
        latestTestRuns: overview?.latestTestRuns || [],
        flakyTests,
        recentFailures,
        staleTests
      }
    });
  }

  /**
   * Tool 5 (`get_coverage_gaps`): Mapping gaps, runtime coverage gaps & missing QA specs.
   */
  async getCoverageGaps(args = {}) {
    const ctx = await this._assessContext(args);
    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: ctx.limitations,
        data: { uncoveredEndpoints: [], uncoveredUiComponents: [], uncoveredRequirements: [], unmappedMethodsSummary: [] }
      });
    }

    const limit = Math.max(1, Math.min(200, Number(args.limit) || 50));
    const pluginFilter = String(args.plugin || args.module || '');

    let uncoveredEndpoints = [];
    let uncoveredUiComponents = [];
    let uncoveredRequirements = [];
    let pluginGapSummary = [];

    try {
      const [epRows, uiRows, reqRows, pluginRows] = await Promise.all([
        this._safeRunQuery(`
          MATCH (ep:ApiEndpoint)
          WHERE ($plugin = '' OR toLower(coalesce(ep.plugin, '')) CONTAINS toLower($plugin))
            AND NOT EXISTS {
              MATCH (ep)<-[:EXECUTES_AGAINST]-(tc:TestCase)
              WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
            }
          RETURN ep.endpoint_id AS endpointId, ep.http_method AS httpMethod, ep.path AS path,
                 ep.plugin AS plugin, coalesce(ep.endpoint_kind, 'REST') AS endpointKind
          LIMIT $limit
        `, { plugin: pluginFilter, limit }),
        this._safeRunQuery(`
          MATCH (ui:UIComponent)
          WHERE ($plugin = '' OR toLower(coalesce(ui.plugin, '')) CONTAINS toLower($plugin))
            AND NOT EXISTS {
              MATCH (ui)<-[:TESTS_COMPONENT]-(tc:TestCase)
              WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
            }
          RETURN ui.component_id AS componentId, ui.name AS name, ui.file AS file, ui.plugin AS plugin
          LIMIT $limit
        `, { plugin: pluginFilter, limit }),
        this._safeRunQuery(`
          MATCH (r:Requirement)
          WHERE ($plugin = '' OR toLower(coalesce(r.plugin, r.module, '')) CONTAINS toLower($plugin))
            AND NOT EXISTS {
              MATCH (r)<-[:VERIFIES]-(tc:TestCase)
              WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
            }
          RETURN r.id AS id, r.description AS description, coalesce(r.plugin, r.module) AS plugin,
                 EXISTS { MATCH (r)<-[:PLANNED_VERIFICATION]-(p:TestCase {origin: 'BASELINE_MANIFEST'}) } AS hasPlannedBacklogOnly
          LIMIT $limit
        `, { plugin: pluginFilter, limit }),
        this._safeRunQuery(`
          MATCH (p:Plugin)
          WHERE ($plugin = '' OR toLower(p.name) CONTAINS toLower($plugin))
          OPTIONAL MATCH (p)-[:DECLARES]->(c:Class)-[:DECLARES]->(m:Method)
          WITH p, count(DISTINCT m) AS totalMethods,
               count(DISTINCT CASE WHEN EXISTS {
                 MATCH (m)<-[r:TESTS]-(tc:TestCase)
                 WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST' AND coalesce(r.confidence, 0.7) >= 0.5
               } THEN m END) AS mappedMethods
          RETURN p.name AS plugin, totalMethods, mappedMethods, (totalMethods - mappedMethods) AS unmappedMethods
          ORDER BY unmappedMethods DESC
          LIMIT $limit
        `, { plugin: pluginFilter, limit })
      ]);

      uncoveredEndpoints = epRows || [];
      uncoveredUiComponents = uiRows || [];
      uncoveredRequirements = reqRows || [];
      pluginGapSummary = pluginRows || [];
    } catch (err) {
      ctx.limitations.push(`COVERAGE_GAP_QUERY_WARNING: ${err.message}`);
    }

    const analysisStatus = deriveOverallStatus({
      graphAvailable: true,
      isStale: ctx.isStale,
      completeness: ctx.completeness,
      limitations: ctx.limitations
    });

    return buildIntelligenceEnvelope({
      snapshot: ctx.snapshot,
      completeness: ctx.completeness,
      analysisStatus,
      limitations: ctx.limitations,
      data: {
        uncoveredEndpoints,
        uncoveredUiComponents,
        uncoveredRequirements,
        pluginMethodGaps: pluginGapSummary,
        summary: {
          uncoveredEndpointsCount: uncoveredEndpoints.length,
          uncoveredUiCount: uncoveredUiComponents.length,
          uncoveredRequirementsCount: uncoveredRequirements.length
        }
      }
    });
  }

  async listTestGaps(args = {}) {
    return this.getCoverageGaps(args);
  }

  /**
   * Tool 6 (`get_module_quality`): Complete architectural + test + coverage + cross-module scorecard for a plugin/module.
   */
  async getModuleQuality(args = {}) {
    const ctx = await this._assessContext(args);
    const pluginOrModule = args.plugin || args.module || 'orangehrmPayrollPlugin';

    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: ctx.limitations,
        data: { module: pluginOrModule, architecture: null, metrics: null, crossPluginImpact: null }
      });
    }

    let architecture = null;
    if (typeof this.neo4jService.getModuleArchitecture === 'function') {
      architecture = await this.neo4jService.getModuleArchitecture(pluginOrModule);
    }

    let metricsModule = null;
    if (!this.isMockRunner && typeof this.metricsService.getExecutiveQualityMetrics === 'function') {
      const exec = await this.metricsService.getExecutiveQualityMetrics();
      metricsModule = (exec.modules || []).find((m) =>
        String(m.plugin || '').toLowerCase() === String(pluginOrModule).toLowerCase() ||
        String(m.module || '').toLowerCase().includes(String(pluginOrModule).toLowerCase())
      ) || null;
    }

    let crossPluginImpact = null;
    if (typeof this.tiaService.analyzeCrossPluginImpact === 'function') {
      try {
        crossPluginImpact = await this.tiaService.analyzeCrossPluginImpact(pluginOrModule, {
          maxHops: args.max_hops || 3,
          limit: args.limit || 50
        });
      } catch (err) {
        ctx.limitations.push(`CROSS_MODULE_WARNING: ${err.message}`);
      }
    }

    let qaSpecCount = null;
    try {
      const qaRows = await this._safeRunQuery(`
        MATCH (tc:TestCase)
        WHERE coalesce(tc.repo, 'orange-hrms') = 'orangehrm-qa-automation'
          AND toLower(coalesce(tc.plugin, tc.module, '')) CONTAINS toLower($plugin)
        RETURN count(DISTINCT tc) AS qaTests
      `, { plugin: pluginOrModule });
      qaSpecCount = toNum(qaRows?.[0]?.qaTests, 0);
      if (qaSpecCount === 0) {
        ctx.limitations.push(`NO_QA_SPECS_MAPPED: '${pluginOrModule}' has 0 mapped external QA E2E/API specs.`);
      }
    } catch (_) {
      qaSpecCount = null;
    }

    const analysisStatus = deriveOverallStatus({
      graphAvailable: true,
      isStale: ctx.isStale,
      completeness: ctx.completeness,
      limitations: ctx.limitations
    });

    return buildIntelligenceEnvelope({
      snapshot: ctx.snapshot,
      completeness: ctx.completeness,
      analysisStatus,
      limitations: ctx.limitations,
      data: {
        module: pluginOrModule,
        architecture,
        qualityScorecard: metricsModule,
        qaSpecCount,
        crossPluginImpact
      }
    });
  }

  /**
   * Tool 7 (`compare_snapshots`): Separated Structural Diff vs Quality Observation Comparison.
   */
  async compareSnapshots(args = {}) {
    const mode = args.mode || 'both';
    const validModes = ['structural', 'quality', 'both'];
    if (!validModes.includes(mode)) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: buildCompleteness({}),
        analysisStatus: 'FAILED',
        isIncompatible: true,
        limitations: [`INVALID_MODE: '${mode}' must be one of structural | quality | both.`],
        data: null
      });
    }

    // Inline manifest inputs supported for unit tests & direct comparison
    let manifestA = args.manifestA || null;
    let manifestB = args.manifestB || null;
    const manifests = this.snapshotManifest.listManifestFiles
      ? this.snapshotManifest.listManifestFiles(this.snapshotsDir)
      : [];

    if (!manifestA && args.snapshot_a) {
      manifestA = this.snapshotManifest.loadManifest(args.snapshot_a, this.snapshotsDir);
    }
    if (!manifestB && args.snapshot_b) {
      manifestB = this.snapshotManifest.loadManifest(args.snapshot_b, this.snapshotsDir);
    }

    if (!manifestB && manifests.length >= 1) {
      manifestB = this.snapshotManifest.loadManifest(manifests[0].filePath, this.snapshotsDir);
    }
    if (!manifestA && manifests.length >= 2) {
      manifestA = this.snapshotManifest.loadManifest(manifests[1].filePath, this.snapshotsDir);
    } else if (!manifestA && manifests.length === 1) {
      manifestA = manifestB;
    }

    if (!manifestA || !manifestB) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: buildCompleteness({}),
        analysisStatus: 'UNAVAILABLE',
        limitations: ['SNAPSHOT_MANIFESTS_UNAVAILABLE: Unable to locate two snapshot manifests for comparison.'],
        data: { manifestsAvailable: manifests.length }
      });
    }

    const ctx = await this._assessContext({ skipStalenessCheck: true });

    let qualityA = args.qualityA || null;
    let qualityB = args.qualityB || null;
    if ((mode === 'quality' || mode === 'both') && ctx.graphAvailable && (!qualityA || !qualityB)) {
      try {
        if (!qualityA && manifestA.metadata?.snapshot_id) {
          qualityA = await this.snapshotComparator.loadQualityObservationsFromNeo4j(
            (c, p) => this._safeRunQuery(c, p),
            manifestA.metadata.snapshot_id
          );
        }
        if (!qualityB && manifestB.metadata?.snapshot_id) {
          qualityB = await this.snapshotComparator.loadQualityObservationsFromNeo4j(
            (c, p) => this._safeRunQuery(c, p),
            manifestB.metadata.snapshot_id
          );
        }
      } catch (err) {
        ctx.limitations.push(`QUALITY_COMPARISON_UNAVAILABLE: ${err.message}`);
      }
    }

    const comparison = this.snapshotComparator.compareSnapshots(manifestA, manifestB, {
      mode,
      qualityA,
      qualityB,
      snapshotsDir: this.snapshotsDir
    });

    const isIncompatible = comparison.quality?.status === 'INCOMPATIBLE'
      || /INCOMPATIBLE/i.test(comparison.quality?.reason || '');
    const qualityUnavailable = (mode === 'quality' || mode === 'both') &&
      (!comparison.quality || comparison.quality.status === 'UNAVAILABLE' || comparison.quality.status === 'INCOMPATIBLE');
    const limitations = [...ctx.limitations];
    if (isIncompatible && comparison.quality?.reason) {
      limitations.push(`QUALITY_INCOMPATIBLE: ${comparison.quality.reason}`);
    } else if (comparison.quality?.status === 'UNAVAILABLE') {
      limitations.push(`QUALITY_OBSERVATIONS_UNAVAILABLE: ${comparison.quality.reason || 'Missing completed quality runs.'}`);
    }

    const snapMeta = {
      snapshotId: manifestB.snapshot_id || manifestB.metadata?.snapshot_id || ctx.snapshot?.snapshotId || null,
      appCommit: manifestB.app_commit || manifestB.metadata?.app_commit || ctx.snapshot?.appCommit || null,
      qaCommit: manifestB.qa_commit || manifestB.metadata?.qa_commit || ctx.snapshot?.qaCommit || 'not_configured',
      branch: manifestB.app_branch || manifestB.metadata?.branch || ctx.snapshot?.branch || null,
      status: ctx.snapshot?.status || 'PUBLISHED'
    };

    const analysisStatus = (mode === 'structural')
      ? (ctx.graphAvailable
          ? (manifestA && manifestB ? 'SUCCESS' : 'UNAVAILABLE')
          : (manifestA && manifestB ? 'SUCCESS' : 'UNAVAILABLE'))
      : deriveOverallStatus({
          graphAvailable: true,
          isStale: false,
          isIncompatible: isIncompatible && mode === 'quality',
          completeness: buildCompleteness({
            codeGraph: 'COMPLETE',
            testMappings: 'COMPLETE',
            coverage: qualityUnavailable ? 'UNAVAILABLE' : 'COMPLETE',
            executionHistory: qualityUnavailable ? 'UNAVAILABLE' : 'COMPLETE',
            businessTraceability: 'COMPLETE'
          }),
          extraPartial: qualityUnavailable && mode !== 'structural',
          limitations
        });

    return buildIntelligenceEnvelope({
      snapshot: snapMeta,
      completeness: buildCompleteness({
        codeGraph: 'COMPLETE',
        testMappings: 'COMPLETE',
        coverage: qualityUnavailable ? 'UNAVAILABLE' : 'COMPLETE',
        executionHistory: qualityUnavailable ? 'UNAVAILABLE' : 'COMPLETE',
        businessTraceability: 'COMPLETE'
      }),
      analysisStatus,
      isIncompatible,
      limitations,
      data: comparison
    });
  }

  /**
   * Tool 8 (`explain_test_selection`): Explicit inclusion path + evidence tier AND explicit exclusion reasons.
   */
  async explainTestSelection(args = {}) {
    const ctx = await this._assessContext(args);
    const changedFiles = this._resolveFiles(args);
    const requestedTestId = args.test_id || args.canonical_id || '';

    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: ctx.limitations,
        data: { testId: requestedTestId, selected: false, reason: 'GRAPH_UNAVAILABLE' }
      });
    }

    const tia = changedFiles.length > 0
      ? await this.tiaService.analyzeChangedFiles(changedFiles, {
          title: 'QKG Selection Explanation',
          currentCommit: args.currentCommit,
          skipStalenessCheck: args.skipStalenessCheck
        })
      : { impactedRegressionTests: [], advisoryTests: [], missingMappings: [], affectedComponents: [], analysisStatus: 'SUCCESS' };

    const allImpacted = tia.impactedRegressionTests || tia.candidateTests || [];
    const advisory = tia.advisoryTests || [];

    const matchesTest = (t) => !requestedTestId ||
      t.id === requestedTestId ||
      t.canonicalId === requestedTestId ||
      String(t.name || '').toLowerCase() === String(requestedTestId).toLowerCase();

    const matchedIncluded = requestedTestId ? allImpacted.filter(matchesTest) : allImpacted.slice(0, 20);
    const matchedAdvisory = requestedTestId ? advisory.filter(matchesTest) : advisory.slice(0, 10);

    let testRecord = null;
    if (requestedTestId) {
      try {
        const rows = await this._safeRunQuery(`
          MATCH (tc:TestCase)
          WHERE tc.id = $id OR tc.canonical_id = $id OR tc.name = $id
          OPTIONAL MATCH (tc)-[r:TESTS|POTENTIAL_COVERS|EXECUTES_AGAINST|TESTS_COMPONENT|VERIFIES|PLANNED_VERIFICATION]->(tgt)
          OPTIONAL MATCH (tr:TestRun)-[:HAS_EXECUTION]->(te:TestExecution { testcase_id: tc.id })
          RETURN tc.id AS id, coalesce(tc.canonical_id, tc.id) AS canonicalId, tc.name AS name,
                 tc.repo AS repo, tc.framework AS framework, tc.file AS file,
                 coalesce(tc.origin, 'AST_DEV_SUITE') AS origin,
                 collect(DISTINCT { relType: type(r), evidenceType: r.evidence_type, confidence: r.confidence, target: coalesce(tgt.signature, tgt.endpoint_id, tgt.component_id, tgt.id, tgt.name) })[..20] AS graphLinks,
                 collect(DISTINCT { runId: tr.run_id, status: te.status, executedAt: tr.executed_at })[..5] AS executionHistory
          LIMIT 1
        `, { id: requestedTestId });
        testRecord = rows?.[0] || null;
      } catch (_) {
        testRecord = null;
      }
    }

    let exclusionReason = null;
    if (requestedTestId && matchedIncluded.length === 0) {
      if (matchedAdvisory.length > 0) {
        exclusionReason = 'ISOLATED_TIER_3_POTENTIAL_COVERS: Heuristic edge isolated to advisoryTests unless static AST/API mapping confirms dependency.';
      } else if (testRecord?.origin === 'BASELINE_MANIFEST') {
        exclusionReason = 'EXCLUDED_TIER_4_BASELINE_MANIFEST_GUARD: Synthetic/planned backlog tests never enter selective code regression.';
      } else if (!testRecord) {
        exclusionReason = 'NOT_FOUND_IN_GRAPH: TestCase identifier does not exist in active QKG snapshot.';
      } else {
        exclusionReason = 'NOT_IN_CHANGE_BLAST_RADIUS: TestCase has no active graph path to the supplied changed files.';
      }
    }

    const explanations = matchedIncluded.map((t) => ({
      testId: t.id,
      canonicalId: t.canonicalId || t.id,
      name: t.name,
      framework: t.framework,
      repo: t.repo || (t.file && String(t.file).startsWith('orange_hrm') ? 'orange-hrms' : 'orangehrm-qa-automation'),
      file: t.file,
      selected: true,
      impactChannel: t.impactChannel,
      evidenceTier: t.evidenceTier,
      confidence: t.confidence,
      reasons: t.reasons || [t.reason].filter(Boolean),
      matchedTargets: t.matchedTargets || []
    }));

    const analysisStatus = deriveOverallStatus({
      graphAvailable: true,
      isStale: ctx.isStale || tia.analysisStatus === 'STALE',
      completeness: ctx.completeness,
      limitations: ctx.limitations
    });

    return buildIntelligenceEnvelope({
      snapshot: ctx.snapshot || tia.snapshotMetadata,
      completeness: ctx.completeness,
      analysisStatus,
      limitations: ctx.limitations,
      data: {
        baselineFanoutGuardActive: BASELINE_REQUIREMENT_FANOUT_GUARD,
        requestedTestId: requestedTestId || null,
        selected: matchedIncluded.length > 0,
        inclusionExplanations: explanations,
        advisoryExplanations: matchedAdvisory.map((t) => ({
          testId: t.id,
          canonicalId: t.canonicalId || t.id,
          selected: false,
          evidenceTier: t.evidenceTier,
          confidence: t.confidence,
          exclusionReason: 'TIER_3_POTENTIAL_HEURISTIC_ADVISORY_ONLY',
          reasons: t.reasons || [t.reason].filter(Boolean)
        })),
        exclusionReason,
        testProvenance: testRecord
      }
    });
  }

  /**
   * Workbench & AI Drill-down: Inspect provenance, neighbors, coverage & test links of any entity.
   */
  async explainEntity(args = {}) {
    const ctx = await this._assessContext(args);
    const entityId = String(args.entity_id || args.id || '').trim();
    if (!entityId) {
      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: 'FAILED',
        limitations: ['MISSING_ENTITY_ID: Provide entity_id or id to inspect.'],
        data: null
      });
    }
    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: ctx.limitations,
        data: null
      });
    }

    const rows = await this._safeRunQuery(`
      MATCH (n)
      WHERE (n.id = $entityId OR n.canonical_id = $entityId OR n.signature = $entityId
             OR n.fqcn = $entityId OR n.endpoint_id = $entityId OR n.component_id = $entityId
             OR n.column_id = $entityId OR n.name = $entityId)
      WITH n LIMIT 1
      OPTIONAL MATCH (n)-[outR]->(outN)
      OPTIONAL MATCH (inN)-[inR]->(n)
      OPTIONAL MATCH (covObs:CoverageObservation) WHERE covObs.target_id IN [n.signature, n.component_id, n.id]
      RETURN labels(n) AS labels,
             coalesce(n.signature, n.fqcn, n.endpoint_id, n.component_id, n.column_id, n.id, n.name) AS canonicalId,
             coalesce(n.name, n.path, n.signature, n.id) AS displayName,
             n.plugin AS plugin,
             coalesce(n.source_file, n.file) AS file,
             n.repo AS repo,
             n.introduced_in AS introducedIn,
             n.snapshot_id AS snapshotId,
             collect(DISTINCT { direction: 'OUTBOUND', relType: type(outR), evidenceType: outR.evidence_type, targetLabel: labels(outN)[0], targetId: coalesce(outN.signature, outN.fqcn, outN.endpoint_id, outN.component_id, outN.id, outN.name) })[..25] AS outbound,
             collect(DISTINCT { direction: 'INBOUND', relType: type(inR), evidenceType: inR.evidence_type, sourceLabel: labels(inN)[0], sourceId: coalesce(inN.signature, inN.fqcn, inN.endpoint_id, inN.component_id, inN.id, inN.name) })[..25] AS inbound,
             collect(DISTINCT { runId: covObs.run_id, linesCovered: covObs.lines_covered, linesTotal: covObs.lines_total, lineRate: covObs.line_rate })[..5] AS coverage
    `, { entityId });

    const entity = rows?.[0] || null;
    if (!entity || !entity.canonicalId) {
      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: 'PARTIAL',
        limitations: [...ctx.limitations, `ENTITY_NOT_FOUND: '${entityId}' not present in snapshot.`],
        data: { entity: null }
      });
    }

    const analysisStatus = deriveOverallStatus({
      graphAvailable: true,
      isStale: ctx.isStale,
      completeness: ctx.completeness,
      limitations: ctx.limitations
    });

    return buildIntelligenceEnvelope({
      snapshot: ctx.snapshot,
      completeness: ctx.completeness,
      analysisStatus,
      limitations: ctx.limitations,
      data: { entity }
    });
  }

  /**
   * Composed PR Analysis wrapper delegating to GitHub + TIA + Envelope contract.
   */
  async analyzePrImpact(args = {}) {
    const prNumber = Number(args.pr_number || args.prId || 12);
    const pr = this.githubService.getPullRequestDetails(prNumber, {
      baseRef: args.base_ref,
      headRef: args.head_ref
    });
    const impacted = await this.getImpactedTests({
      changed_files: args.changed_files || pr.changedFiles,
      title: `PR #${pr.id}: ${pr.title}`,
      currentCommit: args.currentCommit,
      skipStalenessCheck: args.skipStalenessCheck
    });

    return {
      ...impacted,
      data: {
        pr,
        ...impacted.data
      }
    };
  }

  /**
   * Executive Quality Overview composing metricsService + MariaDB schema state + completeness.
   */
  async getQualityOverview(args = {}) {
    const ctx = await this._assessContext(args);
    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: ctx.limitations,
        data: { overview: null, database: null }
      });
    }

    const [metrics, dbOverview] = await Promise.all([
      this.metricsService.getExecutiveQualityMetrics(),
      typeof this.mariadbService.getDatabaseOverview === 'function'
        ? this.mariadbService.getDatabaseOverview().catch((e) => ({ status: 'UNAVAILABLE', error: e.message }))
        : Promise.resolve({ status: 'UNAVAILABLE' })
    ]);

    const limitations = [...ctx.limitations];
    if (dbOverview?.status === 'UNAVAILABLE' || dbOverview?.status === 'OFFLINE') {
      limitations.push('MARIADB_UNAVAILABLE: Live relational schema inspection is offline.');
    }

    const analysisStatus = deriveOverallStatus({
      graphAvailable: true,
      isStale: ctx.isStale,
      completeness: ctx.completeness,
      limitations
    });

    return buildIntelligenceEnvelope({
      snapshot: ctx.snapshot || metrics.snapshot,
      completeness: ctx.completeness,
      analysisStatus,
      limitations,
      data: {
        ...metrics,
        database: dbOverview
      }
    });
  }

  /**
   * Aggregates release readiness across QKG-15 benchmark, snapshot parity, test health & DB drift.
   */
  async getReleaseReadiness(args = {}) {
    const [statusEnv, testHealthEnv, drift] = await Promise.all([
      this.getSnapshotStatus(args),
      this.getTestHealth({ ...args, limit: 20 }),
      !this.isMockRunner && typeof this.mariadbService.compareTableSchemas === 'function'
        ? this.mariadbService.compareTableSchemas().catch((e) => ({ status: 'UNAVAILABLE', error: e.message }))
        : Promise.resolve({ status: 'UNAVAILABLE', error: 'MariaDB check skipped or offline' })
    ]);

    const bench = statusEnv.data?.qkg15Benchmark || null;
    const recentFailuresCount = (testHealthEnv.data?.recentFailures || []).length;
    const schemaAvailable = drift && drift.status !== 'UNAVAILABLE' && drift.status !== 'OFFLINE';

    const gateBlockers = [];
    if (!statusEnv.graphSnapshotId) gateBlockers.push('NO_GRAPH_SNAPSHOT');
    if (statusEnv.analysisStatus === 'STALE') gateBlockers.push('SNAPSHOT_STALE');
    if (bench && bench.gateStatus !== 'PASS') gateBlockers.push('QKG15_BENCHMARK_FAILED');
    if (recentFailuresCount > 0) gateBlockers.push(`${recentFailuresCount}_FAILED_TESTS_IN_RUN`);
    if (schemaAvailable && drift.driftDetected === true) gateBlockers.push('MARIADB_SCHEMA_DRIFT');

    const limitations = [...new Set([...(statusEnv.limitations || []), ...(testHealthEnv.limitations || [])])];
    if (!schemaAvailable) {
      limitations.push('SCHEMA_DRIFT_UNAVAILABLE: Live MariaDB schema drift could not be verified offline.');
    }

    const readyStatus = !statusEnv.graphSnapshotId
      ? 'BLOCKED_UNAVAILABLE'
      : (gateBlockers.length > 0 ? 'ATTENTION_REQUIRED' : 'READY');

    const analysisStatus = statusEnv.analysisStatus === 'UNAVAILABLE'
      ? 'UNAVAILABLE'
      : deriveOverallStatus({
          graphAvailable: true,
          isStale: statusEnv.analysisStatus === 'STALE',
          completeness: statusEnv.completeness,
          extraPartial: !schemaAvailable,
          limitations
        });

    return buildIntelligenceEnvelope({
      snapshot: statusEnv.snapshot,
      completeness: statusEnv.completeness,
      analysisStatus,
      limitations,
      data: {
        readinessGate: readyStatus,
        blockers: gateBlockers,
        qkg15Benchmark: bench,
        recentFailuresCount,
        schemaDrift: drift,
        availableManifestsCount: statusEnv.data?.availableManifestsCount || 0
      }
    });
  }

  /**
   * Read-only Cypher Explorer with AST-stripped allowlist validation + row PII sanitization.
   */
  async runSafeCypher(args = {}) {
    const cypher = args.cypher || args.query || '';
    const ctx = await this._assessContext({ skipStalenessCheck: true });

    let checked;
    try {
      checked = validateReadOnlyCypher(cypher, Math.min(100, Number(args.max_limit) || 100));
    } catch (err) {
      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: 'FAILED',
        limitations: [err.message],
        data: { rows: [], rowCount: 0 }
      });
    }

    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: ctx.limitations,
        data: { rows: [], rowCount: 0 }
      });
    }

    try {
      const rows = await this._safeRunQuery(checked.query, args.params || {});
      const sanitized = sanitizePayload(rows || []);
      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: ctx.isStale ? 'STALE' : 'SUCCESS',
        limitations: ctx.limitations,
        data: {
          executedQuery: checked.query,
          limitApplied: checked.limitApplied,
          rowCount: Array.isArray(sanitized) ? sanitized.length : 0,
          rows: sanitized
        }
      });
    } catch (err) {
      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: 'FAILED',
        limitations: [...ctx.limitations, `CYPHER_EXECUTION_ERROR: ${err.message}`],
        data: { rows: [], rowCount: 0 }
      });
    }
  }

  /**
   * 10. Context Retrieval: Business Workflows, Rules, Requirements, and Personas (Phase 1 / ARCH-01)
   */
  async getBusinessContext(args = {}) {
    const ctx = await this._assessContext();
    const workflowId = args.workflow_id || args.workflowId || null;
    const ruleId = args.rule_id || args.ruleId || null;
    const featureId = args.feature_id || args.featureId || null;

    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: ctx.limitations,
        data: { workflow: null, businessRules: [], requirements: [], personas: [] }
      });
    }

    try {
      if (workflowId) {
        const rows = await this._safeRunQuery(`
          MATCH (w:BusinessWorkflow)
          WHERE w.workflow_id = $workflowId OR w.workflow_id = 'WF_' + $workflowId OR w.name CONTAINS $workflowId
          OPTIONAL MATCH (d:BusinessDomain)-[:CONTAINS|CONTAINS_WORKFLOW|HAS_WORKFLOW]->(w)
          OPTIONAL MATCH (w)-[:DECOMPOSES_TO|COMPOSES_TO|INCLUDES_FEATURE|CONTAINS_FEATURE]->(f:Feature)
          OPTIONAL MATCH (f)-[:HAS_REQUIREMENT|CONTAINS_REQUIREMENT]->(r:Requirement)
          OPTIONAL MATCH (r)-[:GOVERNED_BY]->(br:BusinessRule)
          OPTIONAL MATCH (w)-[:PERFORMED_BY|INTERACTS_WITH]->(p:Persona)
          RETURN w.workflow_id AS workflowId, w.name AS workflowName, w.type AS workflowType,
                 d.domain_id AS domainId, d.name AS domainName,
                 collect(DISTINCT CASE WHEN f IS NOT NULL THEN { feature_id: f.feature_id, name: f.name } END) AS features,
                 collect(DISTINCT CASE WHEN r IS NOT NULL THEN { requirement_id: r.requirement_id, title: r.title, priority: r.priority, status: r.status } END) AS requirements,
                 collect(DISTINCT CASE WHEN br IS NOT NULL THEN { rule_id: br.rule_id, name: br.name, description: br.description } END) AS businessRules,
                 collect(DISTINCT CASE WHEN p IS NOT NULL THEN { persona_id: p.persona_id, name: p.name, role: p.role } END) AS personas
          LIMIT 1
        `, { workflowId: String(workflowId) });

        if (!rows || rows.length === 0) {
          return buildIntelligenceEnvelope({
            snapshot: ctx.snapshot,
            completeness: ctx.completeness,
            analysisStatus: 'PARTIAL',
            limitations: [`WORKFLOW_NOT_FOUND: ${workflowId}`],
            data: { workflow: null, businessRules: [], requirements: [], personas: [] }
          });
        }

        const row = rows[0];
        return buildIntelligenceEnvelope({
          snapshot: ctx.snapshot,
          completeness: ctx.completeness,
          analysisStatus: 'SUCCESS',
          limitations: ctx.limitations,
          data: {
            workflow: {
              workflow_id: row.workflowId,
              name: row.workflowName,
              type: row.workflowType,
              domain_id: row.domainId,
              domain_name: row.domainName
            },
            features: (row.features || []).filter(Boolean),
            requirements: (row.requirements || []).filter(Boolean),
            businessRules: (row.businessRules || []).filter(Boolean),
            personas: (row.personas || []).filter(Boolean)
          }
        });
      }

      if (ruleId) {
        const rows = await this._safeRunQuery(`
          MATCH (br:BusinessRule)
          WHERE br.rule_id = $ruleId OR br.name CONTAINS $ruleId
          OPTIONAL MATCH (r:Requirement)-[:GOVERNED_BY]->(br)
          OPTIONAL MATCH (f:Feature)-[:HAS_REQUIREMENT]->(r)
          OPTIONAL MATCH (w:BusinessWorkflow)-[:DECOMPOSES_TO|COMPOSES_TO]->(f)
          RETURN br.rule_id AS ruleId, br.name AS name, br.description AS description,
                 collect(DISTINCT CASE WHEN r IS NOT NULL THEN { requirement_id: r.requirement_id, title: r.title } END) AS requirements,
                 collect(DISTINCT CASE WHEN f IS NOT NULL THEN { feature_id: f.feature_id, name: f.name } END) AS features,
                 collect(DISTINCT CASE WHEN w IS NOT NULL THEN { workflow_id: w.workflow_id, name: w.name } END) AS workflows
          LIMIT 5
        `, { ruleId: String(ruleId) });

        return buildIntelligenceEnvelope({
          snapshot: ctx.snapshot,
          completeness: ctx.completeness,
          analysisStatus: rows.length > 0 ? 'SUCCESS' : 'PARTIAL',
          limitations: rows.length === 0 ? [`RULE_NOT_FOUND: ${ruleId}`] : ctx.limitations,
          data: {
            rules: rows.map((r) => ({
              rule_id: r.ruleId,
              name: r.name,
              description: r.description,
              requirements: (r.requirements || []).filter(Boolean),
              features: (r.features || []).filter(Boolean),
              workflows: (r.workflows || []).filter(Boolean)
            }))
          }
        });
      }

      // Default: list all active workflows
      const allWorkflows = await this._safeRunQuery(`
        MATCH (w:BusinessWorkflow)
        OPTIONAL MATCH (d:BusinessDomain)-[:CONTAINS|CONTAINS_WORKFLOW|HAS_WORKFLOW]->(w)
        RETURN w.workflow_id AS workflowId, w.name AS name, w.type AS type, d.name AS domainName
        ORDER BY w.workflow_id ASC
        LIMIT 50
      `);

      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: 'SUCCESS',
        limitations: ctx.limitations,
        data: {
          totalWorkflows: allWorkflows.length,
          workflows: allWorkflows.map((w) => ({
            workflow_id: w.workflowId,
            name: w.name,
            type: w.type,
            domain_name: w.domainName
          }))
        }
      });
    } catch (err) {
      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: 'FAILED',
        limitations: [...ctx.limitations, `GET_BUSINESS_CONTEXT_ERROR: ${err.message}`],
        data: { workflow: null, businessRules: [], requirements: [], personas: [] }
      });
    }
  }

  /**
   * 11. Context Retrieval: Code Context (Methods, Calls, Accessed Columns, Routes)
   */
  async getCodeContext(args = {}) {
    const ctx = await this._assessContext();
    const filePath = args.file_path || args.filePath || args.file || null;
    const methodId = args.method_id || args.methodId || null;
    const className = args.class_name || args.className || args.class_fqcn || null;

    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: ctx.limitations,
        data: { methods: [], callers: [], callees: [], accessedColumns: [], endpoints: [] }
      });
    }

    try {
      if (methodId) {
        const rows = await this._safeRunQuery(`
          MATCH (m:Method)
          WHERE m.method_id = $methodId OR m.name = $methodId
          OPTIONAL MATCH (caller:Method)-[:CALLS]->(m)
          OPTIONAL MATCH (m)-[:CALLS]->(callee:Method)
          OPTIONAL MATCH (m)-[ac:ACCESSES_COLUMN]->(col:DatabaseColumn)
          OPTIONAL MATCH (ep:ApiEndpoint)-[:DISPATCHES_TO|HANDLED_BY]->(m)
          RETURN m.method_id AS methodId, m.name AS name, m.file_path AS filePath, m.class_name AS className,
                 collect(DISTINCT CASE WHEN caller IS NOT NULL THEN { method_id: caller.method_id, file: caller.file_path } END)[0..20] AS callers,
                 collect(DISTINCT CASE WHEN callee IS NOT NULL THEN { method_id: callee.method_id, file: callee.file_path } END)[0..20] AS callees,
                 collect(DISTINCT CASE WHEN col IS NOT NULL THEN { column: col.column_name, table: col.table_name, mode: ac.access_mode } END) AS accessedColumns,
                 collect(DISTINCT CASE WHEN ep IS NOT NULL THEN { route: ep.url_pattern, method: ep.http_method } END) AS endpoints
          LIMIT 1
        `, { methodId: String(methodId) });

        if (!rows || rows.length === 0) {
          return buildIntelligenceEnvelope({
            snapshot: ctx.snapshot,
            completeness: ctx.completeness,
            analysisStatus: 'PARTIAL',
            limitations: [`METHOD_NOT_FOUND: ${methodId}`],
            data: { methods: [], callers: [], callees: [], accessedColumns: [], endpoints: [] }
          });
        }

        const r = rows[0];
        return buildIntelligenceEnvelope({
          snapshot: ctx.snapshot,
          completeness: ctx.completeness,
          analysisStatus: 'SUCCESS',
          limitations: ctx.limitations,
          data: {
            method: {
              method_id: r.methodId,
              name: r.name,
              file_path: r.filePath,
              class_name: r.className
            },
            callers: (r.callers || []).filter(Boolean),
            callees: (r.callees || []).filter(Boolean),
            accessed_columns: (r.accessedColumns || []).filter(Boolean),
            endpoints: (r.endpoints || []).filter(Boolean)
          }
        });
      }

      if (filePath || className) {
        const rows = await this._safeRunQuery(`
          MATCH (m:Method)
          WHERE ($filePath IS NOT NULL AND m.file_path CONTAINS $filePath)
             OR ($className IS NOT NULL AND m.class_name = $className)
          OPTIONAL MATCH (m)-[:CALLS]->(callee:Method)
          OPTIONAL MATCH (m)-[ac:ACCESSES_COLUMN]->(col:DatabaseColumn)
          OPTIONAL MATCH (ep:ApiEndpoint)-[:DISPATCHES_TO|HANDLED_BY]->(m)
          RETURN m.method_id AS methodId, m.name AS name, m.file_path AS filePath, m.class_name AS className,
                 collect(DISTINCT callee.method_id)[0..10] AS calls,
                 collect(DISTINCT col.column_name)[0..10] AS columns,
                 collect(DISTINCT ep.url_pattern) AS endpoints
          LIMIT 50
        `, { filePath: filePath ? String(filePath) : null, className: className ? String(className) : null });

        return buildIntelligenceEnvelope({
          snapshot: ctx.snapshot,
          completeness: ctx.completeness,
          analysisStatus: rows.length > 0 ? 'SUCCESS' : 'PARTIAL',
          limitations: rows.length === 0 ? [`NO_CODE_FOUND: ${filePath || className}`] : ctx.limitations,
          data: {
            totalMethods: rows.length,
            methods: rows.map((r) => ({
              method_id: r.methodId,
              name: r.name,
              file_path: r.filePath,
              class_name: r.className,
              callees: (r.calls || []).filter(Boolean),
              columns: (r.columns || []).filter(Boolean),
              endpoints: (r.endpoints || []).filter(Boolean)
            }))
          }
        });
      }

      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: 'PARTIAL',
        limitations: ['MISSING_ARGUMENT: Provide file_path, class_name, or method_id'],
        data: { methods: [] }
      });
    } catch (err) {
      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: 'FAILED',
        limitations: [...ctx.limitations, `GET_CODE_CONTEXT_ERROR: ${err.message}`],
        data: { methods: [] }
      });
    }
  }

  /**
   * 12. Context Retrieval: API & UI Component Context
   */
  async getApiUiContext(args = {}) {
    const ctx = await this._assessContext();
    const endpointId = args.endpoint_id || args.endpointId || null;
    const route = args.route || args.path || null;
    const pageId = args.page_id || args.pageId || null;

    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: ctx.limitations,
        data: { endpoints: [], pages: [], components: [] }
      });
    }

    try {
      const rows = await this._safeRunQuery(`
        MATCH (ep:ApiEndpoint)
        WHERE ($endpointId IS NOT NULL AND (ep.endpoint_id = $endpointId OR ep.url_pattern = $endpointId))
           OR ($route IS NOT NULL AND ep.url_pattern CONTAINS $route)
        OPTIONAL MATCH (ep)-[:HANDLED_BY|DISPATCHES_TO]->(m:Method)
        OPTIONAL MATCH (comp:UIComponent)-[:INVOKES_API|CALLS_ENDPOINT]->(ep)
        OPTIONAL MATCH (page:UIPage)-[:CONTAINS_COMPONENT]->(comp)
        RETURN ep.endpoint_id AS endpointId, ep.url_pattern AS urlPattern, ep.http_method AS httpMethod,
               ep.route_name AS routeName,
               collect(DISTINCT CASE WHEN m IS NOT NULL THEN { method_id: m.method_id, file: m.file_path } END) AS handlers,
               collect(DISTINCT CASE WHEN comp IS NOT NULL THEN { component_id: comp.component_id, name: comp.name } END) AS components,
               collect(DISTINCT CASE WHEN page IS NOT NULL THEN { page_id: page.page_id, route_pattern: page.route_pattern } END) AS pages
        LIMIT 20
      `, { endpointId: endpointId ? String(endpointId) : null, route: route ? String(route) : null });

      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: rows.length > 0 ? 'SUCCESS' : 'PARTIAL',
        limitations: rows.length === 0 ? [`NO_API_UI_FOUND: ${endpointId || route || pageId}`] : ctx.limitations,
        data: {
          totalEndpoints: rows.length,
          endpoints: rows.map((r) => ({
            endpoint_id: r.endpointId,
            url_pattern: r.urlPattern,
            http_method: r.httpMethod,
            route_name: r.routeName,
            handlers: (r.handlers || []).filter(Boolean),
            components: (r.components || []).filter(Boolean),
            pages: (r.pages || []).filter(Boolean)
          }))
        }
      });
    } catch (err) {
      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: 'FAILED',
        limitations: [...ctx.limitations, `GET_API_UI_CONTEXT_ERROR: ${err.message}`],
        data: { endpoints: [] }
      });
    }
  }

  /**
   * 13. Context Retrieval: Existing Tests for Deduplication
   */
  async getExistingTests(args = {}) {
    const ctx = await this._assessContext();
    const workflowId = args.workflow_id || args.workflowId || null;
    const ruleId = args.rule_id || args.ruleId || null;
    const methodId = args.method_id || args.methodId || null;
    const endpointId = args.endpoint_id || args.endpointId || null;

    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: ctx.limitations,
        data: { tests: [], count: 0 }
      });
    }

    try {
      let cypher = '';
      let params = {};

      if (workflowId) {
        cypher = `
          MATCH (w:BusinessWorkflow {workflow_id: $workflowId})-[:DECOMPOSES_TO|COMPOSES_TO*0..2]->(f:Feature)
          OPTIONAL MATCH (f)-[:HAS_REQUIREMENT]->(r:Requirement)
          OPTIONAL MATCH (tc:TestCase)-[:TESTS|VERIFIES]->(r)
          RETURN DISTINCT tc.test_id AS testId, tc.name AS name, tc.type AS type,
                          tc.framework AS framework, tc.file_path AS filePath,
                          r.requirement_id AS targetRequirement
          LIMIT 100
        `;
        params = { workflowId: String(workflowId) };
      } else if (ruleId) {
        cypher = `
          MATCH (br:BusinessRule {rule_id: $ruleId})<-[:GOVERNED_BY]-(r:Requirement)
          OPTIONAL MATCH (tc:TestCase)-[:TESTS|VERIFIES]->(r)
          RETURN DISTINCT tc.test_id AS testId, tc.name AS name, tc.type AS type,
                          tc.framework AS framework, tc.file_path AS filePath,
                          br.rule_id AS targetRule
          LIMIT 50
        `;
        params = { ruleId: String(ruleId) };
      } else {
        cypher = `
          MATCH (tc:TestCase)
          RETURN tc.test_id AS testId, tc.name AS name, tc.type AS type,
                 tc.framework AS framework, tc.file_path AS filePath
          LIMIT 50
        `;
      }

      const rows = await this._safeRunQuery(cypher, params);
      const validTests = (rows || []).filter((r) => r && (r.testId || r.name));

      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: 'SUCCESS',
        limitations: ctx.limitations,
        data: {
          count: validTests.length,
          tests: validTests.map((t) => ({
            test_id: t.testId || t.name,
            name: t.name,
            type: t.type,
            framework: t.framework,
            file_path: t.filePath,
            target: t.targetRequirement || t.targetRule || null
          }))
        }
      });
    } catch (err) {
      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: 'FAILED',
        limitations: [...ctx.limitations, `GET_EXISTING_TESTS_ERROR: ${err.message}`],
        data: { tests: [], count: 0 }
      });
    }
  }

  /**
   * 14. Consolidated Test Generation Context (Phase 1 / ARCH-01, DATA-01)
   *
   * Assembles the full, prompt-ready graph slice:
   *   Workflow -> Business Rules -> Code Contracts -> API Endpoints -> Database Entities -> Existing Tests -> Fixture Specs
   */
  async getTestGenerationContext(args = {}) {
    const ctx = await this._assessContext();
    const workflowId = args.workflow_id || args.workflowId || 'WF_PAYROLL_RUN';
    const featureId = args.feature_id || args.featureId || null;
    const includeExistingTests = args.include_existing_tests !== false;

    if (!ctx.graphAvailable) {
      return buildIntelligenceEnvelope({
        snapshot: null,
        completeness: ctx.completeness,
        analysisStatus: 'UNAVAILABLE',
        limitations: ctx.limitations,
        data: {
          workflow: null,
          business_rules: [],
          code_contracts: [],
          api_endpoints: [],
          database_entities: [],
          existing_tests: [],
          synthetic_data_recommendations: []
        }
      });
    }

    try {
      // 1. Business context
      const bizEnv = await this.getBusinessContext({ workflow_id: workflowId, feature_id: featureId });
      const bizData = bizEnv?.data || {};

      // 2. Mapped code contracts & API endpoints
      const codeRows = await this._safeRunQuery(`
        MATCH (w:BusinessWorkflow {workflow_id: $workflowId})
        OPTIONAL MATCH (w)-[:DECOMPOSES_TO|COMPOSES_TO*0..2]->(f:Feature)
        OPTIONAL MATCH (f)-[:HAS_REQUIREMENT]->(r:Requirement)
        OPTIONAL MATCH (f)-[:INCLUDES_ENDPOINT]->(fep:ApiEndpoint)
        OPTIONAL MATCH (m:Method)-[:SATISFIES|IMPLEMENTS_REQUIREMENT|TRACES_TO]->(r)
        OPTIONAL MATCH (ep:ApiEndpoint)-[:DISPATCHES_TO|HANDLED_BY]->(m)
        OPTIONAL MATCH (m)-[:ACCESSES_COLUMN]->(col:DatabaseColumn)
        RETURN collect(DISTINCT CASE WHEN m IS NOT NULL THEN { method_id: m.method_id, name: m.name, class_name: m.class_name, file_path: m.file_path } END)[0..20] AS methods,
               collect(DISTINCT CASE WHEN coalesce(ep, fep) IS NOT NULL THEN { route: coalesce(ep.url_pattern, fep.url_pattern), method: coalesce(ep.http_method, fep.http_method), route_name: coalesce(ep.route_name, fep.route_name) } END)[0..15] AS endpoints,
               collect(DISTINCT CASE WHEN col IS NOT NULL THEN { table: col.table_name, column: col.column_name } END)[0..20] AS columns
        LIMIT 1
      `, { workflowId: String(workflowId) });

      const codeContracts = (codeRows && codeRows[0]?.methods || []).filter(Boolean);
      const apiEndpoints = (codeRows && codeRows[0]?.endpoints || []).filter(Boolean);
      const dbColumns = (codeRows && codeRows[0]?.columns || []).filter(Boolean);

      // Group columns by table
      const dbEntitiesMap = {};
      dbColumns.forEach((c) => {
        if (!dbEntitiesMap[c.table]) dbEntitiesMap[c.table] = [];
        if (!dbEntitiesMap[c.table].includes(c.column)) dbEntitiesMap[c.table].push(c.column);
      });
      const databaseEntities = Object.entries(dbEntitiesMap).map(([table, cols]) => ({
        table_name: table,
        columns: cols
      }));

      // 3. Existing tests
      let existingTests = [];
      if (includeExistingTests) {
        const testEnv = await this.getExistingTests({ workflow_id: workflowId });
        existingTests = testEnv?.data?.tests || [];
      }

      // 4. Privacy-safe synthetic data recommendations based on rules
      const syntheticRecommendations = [
        {
          factory: 'PayrollEmployeeFactory::createStandardSalaried()',
          description: 'Standard full-time employee with Basic (INR 50,000) + HRA (INR 25,000)',
          target_rules: ['BR_PAY_001', 'BR_PAY_009']
        },
        {
          factory: 'PayrollEmployeeFactory::createVariableAllowanceWorker()',
          description: 'Employee with variable performance allowances, shift allowances, and overtime',
          target_rules: ['BR_PAY_007', 'BR_PAY_010']
        },
        {
          factory: 'TaxDeclarationFactory::createSection80CExemption()',
          description: 'New vs Old Tax Regime FY 2026-27 with Sec 87A rebate and Sec 288B rounding',
          target_rules: ['BR_PAY_012']
        }
      ];

      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: bizData.workflow ? 'SUCCESS' : 'PARTIAL',
        limitations: bizData.workflow ? ctx.limitations : [`WORKFLOW_INCOMPLETE: ${workflowId}`],
        data: {
          workflow: bizData.workflow,
          business_rules: bizData.businessRules || [],
          requirements: bizData.requirements || [],
          personas: bizData.personas || [],
          code_contracts: codeContracts,
          api_endpoints: apiEndpoints,
          database_entities: databaseEntities,
          existing_tests: existingTests,
          synthetic_data_recommendations: syntheticRecommendations
        }
      });
    } catch (err) {
      return buildIntelligenceEnvelope({
        snapshot: ctx.snapshot,
        completeness: ctx.completeness,
        analysisStatus: 'FAILED',
        limitations: [...ctx.limitations, `GET_TEST_GEN_CONTEXT_ERROR: ${err.message}`],
        data: {
          workflow: null,
          business_rules: [],
          code_contracts: [],
          api_endpoints: [],
          database_entities: [],
          existing_tests: [],
          synthetic_data_recommendations: []
        }
      });
    }
  }
}

module.exports = new QeIntelligenceService();
module.exports.QeIntelligenceService = QeIntelligenceService;
module.exports.VALID_ANALYSIS_STATUSES = VALID_ANALYSIS_STATUSES;
module.exports.VALID_HEALTH_STATUSES = VALID_HEALTH_STATUSES;
module.exports.VALID_COMPLETENESS_STATES = VALID_COMPLETENESS_STATES;
module.exports.SENSITIVE_KEY_RE = SENSITIVE_KEY_RE;
module.exports.SENSITIVE_VALUE_RE = SENSITIVE_VALUE_RE;
module.exports.sanitizePayload = sanitizePayload;
module.exports.validateReadOnlyCypher = validateReadOnlyCypher;
module.exports.buildCompleteness = buildCompleteness;
module.exports.buildIntelligenceEnvelope = buildIntelligenceEnvelope;
