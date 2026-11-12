/**
 * Graph-Driven Multi-Channel Test Impact Analysis (TIA) Engine
 *
 * Implements bounded 5-channel Neo4j Cypher impact traversal across:
 *   1. DIRECT_METHOD & MODIFIED_TEST_FILE
 *   2. TRANSITIVE_CALL_CHAIN (CALLS*1..3 upstream callers)
 *   3. STRUCTURAL_INHERITANCE & SYMFONY_EVENTS (EXTENDS/IMPLEMENTS/USES_TRAIT, DISPATCHES->LISTENS_TO)
 *   4. ENDPOINT_CONTRACT & DB_TABLE_COUPLING (ApiEndpoint, READS_TABLE/WRITES_TABLE)
 *   5. UI_COMPONENT (UIComponent, CALLS_ENDPOINT)
 *
 * Enforces BASELINE_REQUIREMENT_FANOUT_GUARD (never pulls BASELINE_MANIFEST :VERIFIES
 * backlog tests into selective code regression) and 4-state health reporting:
 *   SUCCESS | PARTIAL | STALE | UNAVAILABLE
 */

const { execFileSync } = require('child_process');
const neo4j = require('neo4j-driver');
const {
  WORKSPACE_ROOT,
  BASELINE_REQUIREMENT_FANOUT_GUARD,
  toRepoRelPath,
  extractPluginFromPath
} = require('./qkg_config');
const { resolveEvidenceTier } = require('./schema_contract');

const NOISY_BASE_FQCNS = [
  'OrangeHRM\\Core\\Api\\V2\\Endpoint',
  'OrangeHRM\\Core\\Dao\\BaseDao',
  'OrangeHRM\\Core\\Service\\BaseService',
  'OrangeHRM\\Core\\Controller\\AbstractController',
  'OrangeHRM\\Core\\Controller\\AbstractVueController'
];

const CHANNEL_PRIORITY = {
  MODIFIED_TEST_FILE: 1,
  DIRECT_METHOD: 2,
  ENDPOINT_CONTRACT: 3,
  UI_COMPONENT: 4,
  STRUCTURAL_INHERITANCE: 5,
  SYMFONY_EVENT_DISPATCH: 6,
  TRANSITIVE_CALL_CHAIN: 7,
  DB_TABLE_COUPLING: 8,
  DB_COLUMN_OR_MIGRATION: 8
};

function classifyHitEvidenceTier(hit, channel) {
  if (hit && hit.relType === 'POTENTIAL_COVERS') {
    return 'TIER_3_POTENTIAL_HEURISTIC';
  }
  if (channel === 'MODIFIED_TEST_FILE' || hit?.evidenceType === 'DIRECT_TEST_FILE_MODIFIED') {
    return 'TIER_1_CONFIRMED_STATIC';
  }
  const ev = hit?.evidenceType || '';
  if (ev === 'PHPUNIT_API_INTEGRATION' || ev === 'PHPUNIT_API_UNIT_CALL' || ev === 'ENDPOINT_INTEGRATION_ASSERT') {
    return 'TIER_1_CONFIRMED_STATIC';
  }
  if (ev === 'VUE_AST_HTTP') {
    return 'TIER_2_PROBABLE_STATIC';
  }
  return resolveEvidenceTier(ev);
}

const TEST_ESTIMATE_SEC = {
  Unit: 1,
  API: 3,
  Integration: 4,
  UI: 8,
  E2E: 12
};

function toNum(v, fallback = 0) {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'object' && typeof v.toNumber === 'function') return v.toNumber();
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function getCurrentGitHead(repoDir = WORKSPACE_ROOT) {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: repoDir,
      encoding: 'utf8',
      timeout: 5000
    }).trim();
  } catch (_) {
    return null;
  }
}

/**
 * Classifies repository paths into canonical buckets using normalized forward-slash paths.
 */
function classifyChangedFiles(files = []) {
  const unique = [...new Set((files || []).map((f) => toRepoRelPath(f)).filter(Boolean))];
  const result = {
    all: unique,
    phpSourceFiles: [],
    testFiles: [],
    uiFiles: [],
    routeFiles: [],
    sqlFiles: [],
    migrationFiles: [],
    otherFiles: []
  };

  for (const file of unique) {
    const lower = file.toLowerCase();
    if (
      (lower.includes('/test/') && lower.endsWith('test.php')) ||
      /\.(?:spec|cy)\.(?:ts|tsx|js|jsx)$/i.test(lower)
    ) {
      result.testFiles.push(file);
    } else if (lower.endsWith('/config/routes.yaml') || lower.endsWith('routes.yaml')) {
      result.routeFiles.push(file);
    } else if (lower.endsWith('/migration.php') || (lower.includes('/installer/migration/') && lower.endsWith('.php'))) {
      result.migrationFiles.push(file);
    } else if (lower.endsWith('.php') && (file.startsWith('orange_hrm/src/plugins/') || file.startsWith('orange_hrm/src/lib/'))) {
      result.phpSourceFiles.push(file);
    } else if (
      file.startsWith('orange_hrm/src/client/src/') &&
      (lower.endsWith('.vue') || lower.endsWith('.ts') || lower.endsWith('.js')) &&
      !lower.endsWith('.d.ts')
    ) {
      result.uiFiles.push(file);
    } else if (lower.endsWith('.sql')) {
      result.sqlFiles.push(file);
      result.migrationFiles.push(file);
    } else {
      result.otherFiles.push(file);
    }
  }
  return result;
}

function computeRiskScore(metrics) {
  const weights = {
    methodImpact: 0.25,
    requirementImpact: 0.30,
    dependentClasses: 0.20,
    historicalFailures: 0.15,
    coverageGap: 0.10
  };
  const rawScore =
    (metrics.affectedMethods * 4 * weights.methodImpact) +
    (metrics.affectedRequirements * 12 * weights.requirementImpact) +
    (metrics.dependentClasses * 5 * weights.dependentClasses) +
    (metrics.historicalFailures * 15 * weights.historicalFailures) +
    (metrics.coverageGap * 100 * weights.coverageGap);

  const normalized = Math.min(100, Math.max(0, Math.round(rawScore)));
  let gateStatus = 'GREEN';
  let recommendation = 'Low risk change. Run selected regression tests.';

  if (normalized >= 70) {
    gateStatus = 'RED';
    recommendation = 'High risk cross-module or low-coverage change. Full impacted regression + backlog authoring review required.';
  } else if (normalized >= 30) {
    gateStatus = 'AMBER';
    recommendation = 'Elevated risk. Execute all impacted graph-selected tests and address identified test coverage gaps.';
  }

  return { score: normalized, gateStatus, recommendation };
}

class TIAEngine {
  /**
   * @param {Function|null} queryRunner Optional async (cypher, params) => Array<Object>
   */
  constructor(queryRunner = null) {
    this.queryRunner = queryRunner;
  }

  async _exec(cypher, params = {}) {
    if (this.queryRunner) {
      return await this.queryRunner(cypher, params);
    }
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'admin123';
    const database = process.env.NEO4J_DATABASE || 'neo4j';
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), { connectionTimeout: 5000 });
    const session = driver.session({ database });
    try {
      const res = await session.run(cypher, params);
      return res.records.map((rec) => {
        const obj = {};
        for (const k of rec.keys) {
          const val = rec.get(k);
          obj[k] = val && typeof val === 'object' && val.properties ? val.properties : val;
        }
        return obj;
      });
    } finally {
      await session.close();
      await driver.close();
    }
  }

  async inspectSnapshotHealth(options = {}) {
    try {
      const rows = await this._exec(`
        MATCH (s:GraphSnapshot)
        WHERE s.status IN ['PUBLISHED', 'STAGING', 'STALE']
        RETURN s.snapshot_id AS snapshotId,
               s.app_commit AS appCommit,
               s.branch AS branch,
               s.status AS status,
               s.published_at AS publishedAt,
               s.started_at AS startedAt
        ORDER BY CASE s.status WHEN 'PUBLISHED' THEN 0 WHEN 'STAGING' THEN 1 ELSE 2 END,
                 coalesce(s.published_at, s.started_at) DESC
        LIMIT 1
      `);
      if (!rows || rows.length === 0) {
        return {
          available: false,
          stale: true,
          reason: 'NO_GRAPH_SNAPSHOT_PUBLISHED',
          snapshot: null
        };
      }
      const snap = rows[0];
      const currentCommit = options.currentCommit !== undefined
        ? options.currentCommit
        : (options.skipStalenessCheck ? snap.appCommit : getCurrentGitHead());

      const isExplicitStale = snap.status === 'STALE';
      const commitMismatch = Boolean(
        !options.skipStalenessCheck &&
        currentCommit &&
        snap.appCommit &&
        snap.appCommit !== 'local-working-tree' &&
        currentCommit !== snap.appCommit
      );

      return {
        available: true,
        stale: isExplicitStale || commitMismatch,
        reason: isExplicitStale ? 'SNAPSHOT_MARKED_STALE' : (commitMismatch ? 'COMMIT_MISMATCH' : null),
        currentCommit,
        snapshot: snap
      };
    } catch (err) {
      return {
        available: false,
        stale: true,
        reason: `NEO4J_UNAVAILABLE: ${err.message}`,
        snapshot: null
      };
    }
  }

  /**
   * Performs multi-channel Test Impact Analysis on a list of repository files.
   */
  async analyzeFiles(files = [], context = {}) {
    const classified = classifyChangedFiles(files);
    const health = await this.inspectSnapshotHealth(context);

    if (!health.available) {
      return {
        analysisStatus: 'UNAVAILABLE',
        failClosed: true,
        error: health.reason,
        timestamp: new Date().toISOString(),
        prContext: context.title || 'Graph-Driven TIA (Unavailable)',
        snapshotMetadata: null,
        baselineFanoutGuardActive: BASELINE_REQUIREMENT_FANOUT_GUARD,
        analyzedFiles: classified.all,
        analysisCompleteness: {
          mappedFiles: 0,
          unmappedCodeFiles: classified.phpSourceFiles.length + classified.uiFiles.length + classified.routeFiles.length,
          mappedPercent: 0,
          channelsActive: []
        },
        missingMappings: [
          ...classified.phpSourceFiles,
          ...classified.uiFiles,
          ...classified.routeFiles
        ].map((f) => ({ file: f, reason: 'GRAPH_UNAVAILABLE' })),
        affectedComponents: [],
        affectedRequirements: [],
        candidateTests: [],
        impactedRegressionTests: [],
        newTestGenerationBacklog: [],
        riskAssessment: {
          score: 100,
          gateStatus: 'RED',
          recommendation: `Quality Knowledge Graph is unavailable (${health.reason}). Refuse silent fallback; restore Neo4j snapshot before merging.`,
          metrics: { affectedMethods: 0, affectedRequirements: 0, dependentClasses: 0, historicalFailures: 0, coverageGap: 1 }
        },
        summary: {
          totalFiles: classified.all.length,
          totalRequirementsImpacted: 0,
          candidateTestsCount: 0,
          totalEstimatedRuntimeSec: 0
        }
      };
    }

    // 1. Mapped nodes & missingMappings check
    const mappedFilesSet = new Set();
    const affectedComponents = [];
    const componentSeen = new Set();

    if (classified.phpSourceFiles.length > 0) {
      const phpMapped = await this._exec(`
        UNWIND $files AS file
        MATCH (c:Class|Interface|Trait { source_file: file })
        OPTIONAL MATCH (c)-[:DECLARES]->(m:Method)
        RETURN file, c.fqcn AS fqcn, c.name AS name, labels(c)[0] AS label,
               c.plugin AS plugin, count(DISTINCT m) AS methodCount
      `, { files: classified.phpSourceFiles });
      for (const row of phpMapped) {
        mappedFilesSet.add(row.file);
        if (!componentSeen.has(row.fqcn)) {
          componentSeen.add(row.fqcn);
          affectedComponents.push({
            file: row.file,
            fqcn: row.fqcn,
            type: row.label,
            name: row.name,
            plugin: row.plugin,
            methodCount: toNum(row.methodCount)
          });
        }
      }
    }

    if (classified.uiFiles.length > 0) {
      const uiMapped = await this._exec(`
        UNWIND $files AS file
        OPTIONAL MATCH (ui:UIComponent { file: file })
        OPTIONAL MATCH (pg:UIPage) WHERE pg.source_file = file OR pg.target_file = file
        WITH file, collect(DISTINCT ui) AS uis, collect(DISTINCT pg) AS pgs
        WHERE size(uis) > 0 OR size(pgs) > 0
        RETURN file,
               [u IN uis | { id: u.component_id, name: u.name, plugin: u.plugin }] AS uiList,
               [p IN pgs | { id: p.page_id, name: p.component_name, plugin: p.plugin }] AS pgList
      `, { files: classified.uiFiles });
      for (const row of uiMapped) {
        mappedFilesSet.add(row.file);
        for (const u of row.uiList || []) {
          if (!componentSeen.has(u.id)) {
            componentSeen.add(u.id);
            affectedComponents.push({
              file: row.file,
              fqcn: u.id,
              type: 'UIComponent',
              name: u.name,
              plugin: u.plugin
            });
          }
        }
        for (const p of row.pgList || []) {
          if (!componentSeen.has(p.id)) {
            componentSeen.add(p.id);
            affectedComponents.push({
              file: row.file,
              fqcn: p.id,
              type: 'UIPage',
              name: p.name,
              plugin: p.plugin
            });
          }
        }
      }
    }

    if (classified.routeFiles.length > 0) {
      const routeMapped = await this._exec(`
        UNWIND $files AS file
        MATCH (ep:ApiEndpoint { source_file: file })
        RETURN file, ep.endpoint_id AS endpointId, ep.route_name AS name, ep.plugin AS plugin, ep.path AS path
      `, { files: classified.routeFiles });
      for (const row of routeMapped) {
        mappedFilesSet.add(row.file);
        if (!componentSeen.has(row.endpointId)) {
          componentSeen.add(row.endpointId);
          affectedComponents.push({
            file: row.file,
            fqcn: row.endpointId,
            type: 'ApiEndpoint',
            name: `${row.name} (${row.path})`,
            plugin: row.plugin
          });
        }
      }
    }

    if (classified.testFiles.length > 0) {
      const testMapped = await this._exec(`
        UNWIND $files AS file
        MATCH (tc:TestCase { file: file })
        WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
        RETURN DISTINCT file, count(tc) AS testCount
      `, { files: classified.testFiles });
      for (const row of testMapped) {
        mappedFilesSet.add(row.file);
      }
    }

    // Track missing mappings ONLY for actionable PHP classes, Vue components/index.ts, routes.yaml, and test files
    // (Skip migration scripts / config boilerplate helper .ts/.php outside classes unless expected)
    const expectedMappedFiles = [
      ...classified.phpSourceFiles.filter((f) => !f.includes('/migration/')),
      ...classified.uiFiles.filter((f) => f.endsWith('.vue') || f.endsWith('/index.ts')),
      ...classified.routeFiles,
      ...classified.testFiles
    ];
    const missingMappings = expectedMappedFiles
      .filter((f) => !mappedFilesSet.has(f))
      .map((f) => ({ file: f, reason: 'NO_GRAPH_NODE_FOR_FILE' }));

    // Helper to merge candidate test hits into primary (Tier 1/2) or advisory (Tier 3) buckets
    const testMap = new Map();
    const advisoryMap = new Map();
    const channelsActive = new Set();
    const dependentClassesSet = new Set();

    const addCandidateHit = (hit, channel, reasonText, via = null, isDirect = false) => {
      const key = hit.canonicalId || hit.id;
      if (!key) return;
      channelsActive.add(channel);

      const evidenceTier = classifyHitEvidenceTier(hit, channel);
      const targetMap = evidenceTier === 'TIER_3_POTENTIAL_HEURISTIC' ? advisoryMap : testMap;

      const level = hit.testLevel || 'Unit';
      const estSec = TEST_ESTIMATE_SEC[level] || 2;
      const existing = targetMap.get(key);
      if (!existing) {
        targetMap.set(key, {
          id: hit.id || key,
          canonicalId: hit.canonicalId || key,
          name: hit.name,
          suite: hit.suite,
          testLevel: level,
          framework: hit.framework || 'PHPUnit',
          file: hit.testFile || null,
          impactChannel: channel,
          impactChannels: [channel],
          evidenceTier,
          priority: evidenceTier === 'TIER_3_POTENTIAL_HEURISTIC'
            ? 'P3'
            : ((isDirect || channel === 'ENDPOINT_CONTRACT' || channel === 'UI_COMPONENT') ? 'P1' : 'P2'),
          estSec,
          needsUpdateReview: isDirect && evidenceTier !== 'TIER_3_POTENTIAL_HEURISTIC',
          statusHint: evidenceTier === 'TIER_3_POTENTIAL_HEURISTIC'
            ? 'ADVISORY_REVIEW'
            : (isDirect ? 'NEEDS_UPDATE' : 'REGRESSION_CANDIDATE'),
          confidence: Number(hit.confidence || 0.8),
          evidenceTypes: hit.evidenceType ? [hit.evidenceType] : [],
          reasons: [reasonText],
          viaTargets: via ? [via] : []
        });
      } else {
        if (!existing.impactChannels.includes(channel)) {
          existing.impactChannels.push(channel);
          if ((CHANNEL_PRIORITY[channel] || 99) < (CHANNEL_PRIORITY[existing.impactChannel] || 99)) {
            existing.impactChannel = channel;
          }
        }
        if (evidenceTier === 'TIER_1_CONFIRMED_STATIC') {
          existing.evidenceTier = 'TIER_1_CONFIRMED_STATIC';
        }
        if (isDirect && evidenceTier !== 'TIER_3_POTENTIAL_HEURISTIC') {
          existing.priority = 'P1';
          existing.needsUpdateReview = true;
          existing.statusHint = 'NEEDS_UPDATE';
        }
        if (hit.confidence && Number(hit.confidence) > existing.confidence) {
          existing.confidence = Number(hit.confidence);
        }
        if (hit.evidenceType && !existing.evidenceTypes.includes(hit.evidenceType)) {
          existing.evidenceTypes.push(hit.evidenceType);
        }
        if (reasonText && !existing.reasons.includes(reasonText)) {
          existing.reasons.push(reasonText);
        }
        if (via && !existing.viaTargets.includes(via)) {
          existing.viaTargets.push(via);
        }
      }
    };

    // CHANNEL 1A: Direct modified test files
    if (classified.testFiles.length > 0) {
      const rows = await this._exec(`
        UNWIND $files AS file
        MATCH (tc:TestCase { file: file })
        WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
        RETURN DISTINCT file AS triggerFile,
               tc.canonical_id AS canonicalId,
               coalesce(tc.testcase_id, tc.canonical_id) AS id,
               tc.name AS name,
               tc.suite AS suite,
               coalesce(tc.test_level, tc.level, 'Unit') AS testLevel,
               tc.framework AS framework,
               tc.file AS testFile
      `, { files: classified.testFiles });
      for (const r of rows) {
        addCandidateHit(
          { ...r, confidence: 1.0, evidenceType: 'DIRECT_TEST_FILE_MODIFIED' },
          'MODIFIED_TEST_FILE',
          `Test file directly modified: ${r.triggerFile}`,
          r.triggerFile,
          true
        );
      }
    }

    // CHANNELS 1B, 2, 3, 4 on PHP source files
    if (classified.phpSourceFiles.length > 0) {
      // 1B: Direct Method -> TESTS | POTENTIAL_COVERS
      const directRows = await this._exec(`
        UNWIND $files AS file
        MATCH (c:Class|Interface|Trait { source_file: file })-[:DECLARES]->(m:Method)<-[r:TESTS|POTENTIAL_COVERS]-(tc:TestCase)
        WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
        RETURN DISTINCT file AS triggerFile, c.fqcn AS classFqcn, m.signature AS targetMethod,
               tc.canonical_id AS canonicalId, coalesce(tc.testcase_id, tc.canonical_id) AS id,
               tc.name AS name, tc.suite AS suite, coalesce(tc.test_level, tc.level, 'Unit') AS testLevel,
               tc.framework AS framework, tc.file AS testFile,
               type(r) AS relType, r.confidence AS confidence, r.evidence_type AS evidenceType
      `, { files: classified.phpSourceFiles });
      for (const r of directRows) {
        addCandidateHit(
          r,
          'DIRECT_METHOD',
          `${r.relType} direct method ${r.targetMethod}`,
          r.targetMethod,
          true
        );
      }

      // 2: Transitive Call Chain (CALLS*1..3 from upstream callers -> changed method)
      const callRows = await this._exec(`
        UNWIND $files AS file
        MATCH (c:Class|Interface|Trait { source_file: file })-[:DECLARES]->(m:Method)
        MATCH p = (caller:Method)-[:CALLS*1..3]->(m)
        WHERE caller.signature <> m.signature
        OPTIONAL MATCH (callerClass:Class|Interface|Trait)-[:DECLARES]->(caller)
        MATCH (caller)<-[r:TESTS|POTENTIAL_COVERS]-(tc:TestCase)
        WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
        RETURN DISTINCT file AS triggerFile, m.signature AS changedMethod, caller.signature AS viaMethod,
               callerClass.fqcn AS callerClassFqcn, length(p) AS hopCount,
               tc.canonical_id AS canonicalId, coalesce(tc.testcase_id, tc.canonical_id) AS id,
               tc.name AS name, tc.suite AS suite, coalesce(tc.test_level, tc.level, 'Unit') AS testLevel,
               tc.framework AS framework, tc.file AS testFile,
               r.confidence AS confidence, r.evidence_type AS evidenceType
        LIMIT 250
      `, { files: classified.phpSourceFiles });
      for (const r of callRows) {
        if (r.callerClassFqcn) dependentClassesSet.add(r.callerClassFqcn);
        addCandidateHit(
          r,
          'TRANSITIVE_CALL_CHAIN',
          `Transitive caller (${toNum(r.hopCount)} hop): ${r.viaMethod} -> ${r.changedMethod}`,
          r.viaMethod,
          false
        );
      }

      // 3A: Structural Inheritance / Trait users (descendants + domain ancestors)
      const inheritRows = await this._exec(`
        UNWIND $files AS file
        MATCH (c:Class|Interface|Trait { source_file: file })
        CALL {
          WITH c
          MATCH (rel:Class|Interface|Trait)-[:EXTENDS|IMPLEMENTS|USES_TRAIT*1..2]->(c)
          RETURN rel AS related, 'DESCENDANT' AS direction
          UNION
          WITH c
          MATCH (c)-[:EXTENDS|USES_TRAIT]->(par:Class|Interface|Trait)
          WHERE NOT par.fqcn IN $noisyBases
          RETURN par AS related, 'ANCESTOR' AS direction
          UNION
          WITH c
          MATCH (c)-[:EXTENDS]->(par:Class)<-[:EXTENDS]-(sib:Class)
          WHERE NOT par.fqcn IN $noisyBases AND sib.fqcn <> c.fqcn
          RETURN sib AS related, 'SIBLING' AS direction
        }
        MATCH (related)-[:DECLARES]->(rm:Method)<-[r:TESTS|POTENTIAL_COVERS]-(tc:TestCase)
        WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
        RETURN DISTINCT file AS triggerFile, related.fqcn AS relatedFqcn, direction,
               rm.signature AS targetMethod,
               tc.canonical_id AS canonicalId, coalesce(tc.testcase_id, tc.canonical_id) AS id,
               tc.name AS name, tc.suite AS suite, coalesce(tc.test_level, tc.level, 'Unit') AS testLevel,
               tc.framework AS framework, tc.file AS testFile,
               r.confidence AS confidence, r.evidence_type AS evidenceType
        LIMIT 250
      `, { files: classified.phpSourceFiles, noisyBases: NOISY_BASE_FQCNS });
      for (const r of inheritRows) {
        if (r.relatedFqcn) dependentClassesSet.add(r.relatedFqcn);
        addCandidateHit(
          r,
          'STRUCTURAL_INHERITANCE',
          `Structural ${r.direction} (${r.relatedFqcn}) -> ${r.targetMethod}`,
          r.relatedFqcn,
          false
        );
      }

      // 3B: Symfony Events (DISPATCHES -> LISTENS_TO) & Endpoint Contracts (EXPOSES -> EXECUTES_AGAINST)
      const eventAndEpRows = await this._exec(`
        UNWIND $files AS file
        MATCH (c:Class { source_file: file })
        CALL {
          WITH c
          MATCH (c)-[:EXPOSES]->(ep:ApiEndpoint)<-[r:EXECUTES_AGAINST]-(tc:TestCase)
          WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
          RETURN 'ENDPOINT_CONTRACT' AS channel, ep.path AS viaTarget, tc, r.confidence AS conf, r.evidence_type AS ev
          UNION
          WITH c
          MATCH (c)-[:DISPATCHES]->(evNode:Event)<-[:LISTENS_TO]-(listener:Class)-[:DECLARES]->(:Method)<-[r:TESTS]-(tc:TestCase)
          WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
          RETURN 'SYMFONY_EVENT_DISPATCH' AS channel, evNode.event_id AS viaTarget, tc, r.confidence AS conf, r.evidence_type AS ev
        }
        RETURN DISTINCT tc.canonical_id AS canonicalId, coalesce(tc.testcase_id, tc.canonical_id) AS id,
               tc.name AS name, tc.suite AS suite, coalesce(tc.test_level, tc.level, 'API') AS testLevel,
               tc.framework AS framework, tc.file AS testFile,
               channel, viaTarget, conf AS confidence, ev AS evidenceType
      `, { files: classified.phpSourceFiles });
      for (const r of eventAndEpRows) {
        addCandidateHit(
          r,
          r.channel,
          `${r.channel === 'ENDPOINT_CONTRACT' ? 'Endpoint contract' : 'Symfony event'} (${r.viaTarget})`,
          r.viaTarget,
          r.channel === 'ENDPOINT_CONTRACT'
        );
      }

      // 4: Shared Database Table Access (WRITES_TABLE <-> READS_TABLE|WRITES_TABLE across modules)
      const dbRows = await this._exec(`
        UNWIND $files AS file
        MATCH (c:Class { source_file: file })-[:DECLARES]->(m:Method)-[:WRITES_TABLE|READS_TABLE]->(dt:DatabaseTable)
        MATCH (dt)<-[:WRITES_TABLE|READS_TABLE]-(otherM:Method)<-[:DECLARES]-(otherC:Class)
        WHERE otherC.fqcn <> c.fqcn
        MATCH (otherM)<-[r:TESTS]-(tc:TestCase)
        WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
        RETURN DISTINCT dt.name AS tableName, otherC.fqcn AS otherClassFqcn, otherM.signature AS targetMethod,
               tc.canonical_id AS canonicalId, coalesce(tc.testcase_id, tc.canonical_id) AS id,
               tc.name AS name, tc.suite AS suite, coalesce(tc.test_level, tc.level, 'Unit') AS testLevel,
               tc.framework AS framework, tc.file AS testFile,
               r.confidence AS confidence, r.evidence_type AS evidenceType
        LIMIT 200
      `, { files: classified.phpSourceFiles });
      for (const r of dbRows) {
        if (r.otherClassFqcn) dependentClassesSet.add(r.otherClassFqcn);
        addCandidateHit(
          r,
          'DB_TABLE_COUPLING',
          `Shared table coupling on ${r.tableName} (${r.otherClassFqcn})`,
          r.tableName,
          false
        );
      }

      // 4C: Shared Database Column Coupling (ACCESSES_COLUMN <-> ACCESSES_COLUMN)
      const colRows = await this._exec(`
        UNWIND $files AS file
        MATCH (c:Class { source_file: file })-[:DECLARES]->(m:Method)-[:ACCESSES_COLUMN]->(dc:DatabaseColumn)
        MATCH (dc)<-[:ACCESSES_COLUMN]-(otherM:Method)<-[:DECLARES]-(otherC:Class)
        WHERE otherC.fqcn <> c.fqcn
        MATCH (otherM)<-[r:TESTS]-(tc:TestCase)
        WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
        RETURN DISTINCT dc.column_id AS columnId, otherC.fqcn AS otherClassFqcn, otherM.signature AS targetMethod,
               tc.canonical_id AS canonicalId, coalesce(tc.testcase_id, tc.canonical_id) AS id,
               tc.name AS name, tc.suite AS suite, coalesce(tc.test_level, tc.level, 'Unit') AS testLevel,
               tc.framework AS framework, tc.file AS testFile,
               r.confidence AS confidence, r.evidence_type AS evidenceType
        LIMIT 200
      `, { files: classified.phpSourceFiles });
      for (const r of colRows) {
        if (r.otherClassFqcn) dependentClassesSet.add(r.otherClassFqcn);
        addCandidateHit(
          r,
          'DB_COLUMN_OR_MIGRATION',
          `Shared column coupling on ${r.columnId} (${r.otherClassFqcn})`,
          r.columnId,
          false
        );
      }
    }

    // CHANNEL 4D: Modified SchemaMigration / SQL DDL -> MODIFIES_TABLE|MODIFIES_COLUMN -> Tests
    if (classified.migrationFiles.length > 0) {
      const migMapped = await this._exec(`
        UNWIND $files AS file
        MATCH (sm:SchemaMigration { file: file })
        RETURN file, sm.migration_id AS migrationId, sm.version AS version, sm.plugin AS plugin
      `, { files: classified.migrationFiles });
      for (const row of migMapped) {
        mappedFilesSet.add(row.file);
        if (!componentSeen.has(row.migrationId)) {
          componentSeen.add(row.migrationId);
          affectedComponents.push({
            file: row.file,
            fqcn: row.migrationId,
            type: 'SchemaMigration',
            name: row.version,
            plugin: row.plugin
          });
        }
      }

      const migTestRows = await this._exec(`
        UNWIND $files AS file
        MATCH (sm:SchemaMigration { file: file })-[:MODIFIES_TABLE|MODIFIES_COLUMN]->(dbNode)
        MATCH (dbNode)<-[:READS_TABLE|WRITES_TABLE|ACCESSES_COLUMN]-(m:Method)<-[:DECLARES]-(c:Class)
        MATCH (m)<-[r:TESTS]-(tc:TestCase)
        WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
        RETURN DISTINCT coalesce(dbNode.column_id, dbNode.name) AS dbTarget, c.fqcn AS targetClass,
               tc.canonical_id AS canonicalId, coalesce(tc.testcase_id, tc.canonical_id) AS id,
               tc.name AS name, tc.suite AS suite, coalesce(tc.test_level, tc.level, 'Unit') AS testLevel,
               tc.framework AS framework, tc.file AS testFile,
               r.confidence AS confidence, r.evidence_type AS evidenceType
        LIMIT 200
      `, { files: classified.migrationFiles });
      for (const r of migTestRows) {
        if (r.targetClass) dependentClassesSet.add(r.targetClass);
        addCandidateHit(
          r,
          'DB_COLUMN_OR_MIGRATION',
          `Schema migration touches ${r.dbTarget} (${r.targetClass})`,
          r.dbTarget,
          false
        );
      }
    }

    // CHANNEL 4B: Modified routes.yaml -> ApiEndpoint -> EXECUTES_AGAINST
    if (classified.routeFiles.length > 0) {
      const routeTestRows = await this._exec(`
        UNWIND $files AS file
        MATCH (ep:ApiEndpoint { source_file: file })<-[r:EXECUTES_AGAINST]-(tc:TestCase)
        WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
        RETURN DISTINCT ep.path AS path, ep.http_method AS httpMethod,
               tc.canonical_id AS canonicalId, coalesce(tc.testcase_id, tc.canonical_id) AS id,
               tc.name AS name, tc.suite AS suite, coalesce(tc.test_level, tc.level, 'API') AS testLevel,
               tc.framework AS framework, tc.file AS testFile,
               r.confidence AS confidence, r.evidence_type AS evidenceType
      `, { files: classified.routeFiles });
      for (const r of routeTestRows) {
        addCandidateHit(
          r,
          'ENDPOINT_CONTRACT',
          `Route config change impacts ${r.httpMethod} ${r.path}`,
          r.path,
          true
        );
      }
    }

    // CHANNEL 5: Frontend UI Components -> TESTS_COMPONENT + CALLS_ENDPOINT -> backend endpoint tests
    if (classified.uiFiles.length > 0) {
      const uiTestRows = await this._exec(`
        UNWIND $files AS file
        MATCH (ui:UIComponent { file: file })
        CALL {
          WITH ui
          MATCH (ui)<-[r:TESTS_COMPONENT]-(tc:TestCase)
          WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
          RETURN 'UI_COMPONENT' AS channel, ui.name AS viaTarget, tc, r.confidence AS conf, r.evidence_type AS ev
          UNION
          WITH ui
          MATCH (ui)<-[:RENDERS]-(pg:UIPage)<-[r:NAVIGATES_PAGE]-(tc:TestCase)
          WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
          RETURN 'UI_COMPONENT' AS channel, pg.page_id AS viaTarget, tc, r.confidence AS conf, r.evidence_type AS ev
          UNION
          WITH ui
          MATCH (ui)-[:CALLS_ENDPOINT]->(ep:ApiEndpoint)<-[r:EXECUTES_AGAINST]-(tc:TestCase)
          WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
          RETURN 'ENDPOINT_CONTRACT' AS channel, ep.path AS viaTarget, tc, r.confidence AS conf, r.evidence_type AS ev
        }
        RETURN DISTINCT tc.canonical_id AS canonicalId, coalesce(tc.testcase_id, tc.canonical_id) AS id,
               tc.name AS name, tc.suite AS suite, coalesce(tc.test_level, tc.level, 'Unit') AS testLevel,
               tc.framework AS framework, tc.file AS testFile,
               channel, viaTarget, conf AS confidence, ev AS evidenceType
      `, { files: classified.uiFiles });
      for (const r of uiTestRows) {
        addCandidateHit(
          r,
          r.channel,
          `${r.channel === 'UI_COMPONENT' ? 'UI component test' : 'UI calls backend endpoint'}: ${r.viaTarget}`,
          r.viaTarget,
          true
        );
      }
    }

    // Affected Requirements (Strictly specification traceability, NEVER pulling BASELINE_MANIFEST TestCases)
    const affectedRequirements = [];
    const reqSeen = new Set();
    if (affectedComponents.length > 0) {
      const plugins = [...new Set(affectedComponents.map((c) => c.plugin).filter(Boolean))];
      const classFqcns = affectedComponents
        .filter((c) => ['Class', 'Interface', 'Trait'].includes(c.type))
        .map((c) => c.fqcn);
      const endpointIds = affectedComponents.filter((c) => c.type === 'ApiEndpoint').map((c) => c.fqcn);
      const uiComponentIds = affectedComponents.filter((c) => c.type === 'UIComponent').map((c) => c.fqcn);

      const reqRows = await this._exec(`
        MATCH (req:Requirement)
        WHERE (
          size($endpointIds) > 0 AND EXISTS {
            MATCH (us:UserStory)-[:EXECUTES_VIA]->(ep:ApiEndpoint)
            WHERE ep.endpoint_id IN $endpointIds AND (us)-[:REALIZES]->(req)
          }
        ) OR (
          size($classFqcns) > 0 AND EXISTS {
            MATCH (c:Class)-[:EXPOSES]->(ep:ApiEndpoint)<-[:EXECUTES_VIA]-(us:UserStory)-[:REALIZES]->(req)
            WHERE c.fqcn IN $classFqcns
          }
        ) OR (
          size($uiComponentIds) > 0 AND EXISTS {
            MATCH (ui:UIComponent)<-[:IMPLEMENTED_BY]-(us:UserStory)-[:REALIZES]->(req)
            WHERE ui.component_id IN $uiComponentIds
          }
        ) OR (
          'orangehrmPayrollPlugin' IN $plugins AND req.requirement_id STARTS WITH 'FR_PAY_'
        ) OR EXISTS {
          MATCH (p:Plugin)-[:CONTAINS]->(:BusinessDomain)-[:CONTAINS]->(:BusinessWorkflow)-[:DECOMPOSES_TO]->(:Feature)-[:HAS_REQUIREMENT_GROUP]->(:RequirementGroup)-[:HAS_REQUIREMENT]->(req)
          WHERE p.name IN $plugins
        }
        RETURN DISTINCT req.requirement_id AS id, coalesce(req.title, req.requirement_id) AS title,
               coalesce(req.priority, 'HIGH') AS criticality
        ORDER BY id
        LIMIT 30
      `, { plugins, classFqcns, endpointIds, uiComponentIds });
      for (const r of reqRows) {
        if (!reqSeen.has(r.id)) {
          reqSeen.add(r.id);
          affectedRequirements.push(r);
        }
      }
    }

    // New Test Generation Backlog (Changed Classes, Endpoints, or UIComponents with ZERO automated tests)
    const newTestGenerationBacklog = [];
    if (classified.phpSourceFiles.length > 0) {
      const uncoveredClasses = await this._exec(`
        UNWIND $files AS file
        MATCH (c:Class { source_file: file })
        WHERE NOT (c.name ENDS WITH 'Model' OR c.name ENDS WITH 'Exception' OR c.name ENDS WITH 'SearchFilterParams')
          AND EXISTS { MATCH (c)-[:DECLARES]->(:Method) }
          AND NOT EXISTS {
            MATCH (c)-[:DECLARES]->(:Method)<-[:TESTS]-(tc:TestCase)
            WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
          }
          AND NOT EXISTS {
            MATCH (c)-[:EXPOSES]->(:ApiEndpoint)<-[:EXECUTES_AGAINST]-(tc2:TestCase)
            WHERE coalesce(tc2.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
          }
        RETURN DISTINCT c.fqcn AS targetId, c.name AS name, c.source_file AS targetFile, c.plugin AS plugin
      `, { files: classified.phpSourceFiles });
      for (const row of uncoveredClasses) {
        newTestGenerationBacklog.push({
          targetType: 'Class',
          targetId: row.targetId,
          targetFile: row.targetFile,
          plugin: row.plugin,
          gapReason: 'NO_AUTOMATED_TESTS',
          suggestedTestLayer: String(row.targetFile || '').includes('/Api/') ? 'API' : 'Unit'
        });
      }

      const uncoveredEndpoints = await this._exec(`
        UNWIND $files AS file
        MATCH (c:Class { source_file: file })-[:EXPOSES]->(ep:ApiEndpoint { endpoint_kind: 'REST_API' })
        WHERE NOT EXISTS {
          MATCH (ep)<-[:EXECUTES_AGAINST]-(tc:TestCase)
          WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
        }
        RETURN DISTINCT ep.endpoint_id AS targetId, ep.http_method + ' ' + ep.path AS name,
               c.source_file AS targetFile, ep.plugin AS plugin
      `, { files: classified.phpSourceFiles });
      for (const row of uncoveredEndpoints) {
        newTestGenerationBacklog.push({
          targetType: 'ApiEndpoint',
          targetId: row.targetId,
          targetName: row.name,
          targetFile: row.targetFile,
          plugin: row.plugin,
          gapReason: 'NO_AUTOMATED_API_CONTRACT_TESTS',
          suggestedTestLayer: 'API'
        });
      }
    }

    if (classified.uiFiles.length > 0) {
      const uncoveredUi = await this._exec(`
        UNWIND $files AS file
        MATCH (ui:UIComponent { file: file })
        WHERE NOT EXISTS {
          MATCH (ui)<-[:TESTS_COMPONENT]-(tc:TestCase)
          WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
        }
        RETURN DISTINCT ui.component_id AS targetId, ui.name AS name, ui.file AS targetFile, ui.plugin AS plugin
      `, { files: classified.uiFiles });
      for (const row of uncoveredUi) {
        newTestGenerationBacklog.push({
          targetType: 'UIComponent',
          targetId: row.targetId,
          targetName: row.name,
          targetFile: row.targetFile,
          plugin: row.plugin,
          gapReason: 'NO_UI_PLAYWRIGHT_OR_JEST_TESTS',
          suggestedTestLayer: 'UI'
        });
      }
    }

    // Pull historical failures count from latest TestRun if present
    let historicalFailures = 0;
    try {
      const failRows = await this._exec(`
        MATCH (te:TestExecution)
        WHERE te.testcase_id IN $ids AND te.status IN ['FAILED', 'ERROR']
        RETURN count(DISTINCT te.testcase_id) AS failedCount
      `, { ids: Array.from(testMap.values()).map((t) => t.id).slice(0, 500) });
      historicalFailures = toNum(failRows[0]?.failedCount, 0);
    } catch (_) {
      historicalFailures = 0;
    }

    const impactedRegressionTests = Array.from(testMap.values()).sort((a, b) => {
      const pa = CHANNEL_PRIORITY[a.impactChannel] || 99;
      const pb = CHANNEL_PRIORITY[b.impactChannel] || 99;
      if (pa !== pb) return pa - pb;
      return b.confidence - a.confidence;
    });

    const advisoryTests = Array.from(advisoryMap.values())
      .filter((t) => !testMap.has(t.canonicalId || t.id))
      .sort((a, b) => b.confidence - a.confidence);

    const evidenceTierSummary = {
      tier1ConfirmedCount: impactedRegressionTests.filter((t) => t.evidenceTier === 'TIER_1_CONFIRMED_STATIC').length,
      tier2ProbableCount: impactedRegressionTests.filter((t) => t.evidenceTier === 'TIER_2_PROBABLE_STATIC').length,
      tier3AdvisoryCount: advisoryTests.length,
      tier4PlannedExcluded: true
    };

    // Coverage gap heuristic grounded in real untested targets vs total affected components
    const affectedMethodsTotal = affectedComponents.reduce((acc, c) => acc + (c.methodCount || 1), 0);
    const gapDenominator = Math.max(1, affectedComponents.length + newTestGenerationBacklog.length);
    const coverageGap = Number((newTestGenerationBacklog.length / gapDenominator).toFixed(2));

    const riskMetrics = {
      affectedMethods: affectedMethodsTotal,
      affectedRequirements: affectedRequirements.length,
      dependentClasses: dependentClassesSet.size + affectedComponents.length,
      historicalFailures,
      coverageGap
    };
    const risk = computeRiskScore(riskMetrics);

    let analysisStatus = 'SUCCESS';
    if (health.stale) analysisStatus = 'STALE';
    else if (missingMappings.length > 0) analysisStatus = 'PARTIAL';

    const totalExpected = expectedMappedFiles.length;
    const mappedCount = totalExpected - missingMappings.length;

    return {
      analysisStatus,
      stalenessReason: health.stale ? health.reason : null,
      timestamp: new Date().toISOString(),
      prContext: context.title || 'Graph-Driven Multi-Channel TIA',
      snapshotMetadata: health.snapshot,
      baselineFanoutGuardActive: BASELINE_REQUIREMENT_FANOUT_GUARD,
      analyzedFiles: classified.all,
      analysisCompleteness: {
        mappedFiles: mappedCount,
        expectedCodeFiles: totalExpected,
        unmappedCodeFiles: missingMappings.length,
        mappedPercent: totalExpected > 0 ? Number(((mappedCount / totalExpected) * 100).toFixed(1)) : 100,
        channelsActive: Array.from(channelsActive)
      },
      missingMappings,
      affectedComponents,
      affectedRequirements,
      candidateTests: impactedRegressionTests,
      impactedRegressionTests,
      advisoryTests,
      evidenceTierSummary,
      newTestGenerationBacklog,
      riskAssessment: {
        ...risk,
        metrics: riskMetrics
      },
      summary: {
        totalFiles: classified.all.length,
        totalRequirementsImpacted: affectedRequirements.length,
        candidateTestsCount: impactedRegressionTests.length,
        advisoryTestsCount: advisoryTests.length,
        backlogGapsCount: newTestGenerationBacklog.length,
        totalEstimatedRuntimeSec: impactedRegressionTests.reduce((acc, t) => acc + (t.estSec || 2), 0)
      }
    };
  }

  /**
   * Hop-bounded (maxHops 1..3) typed cross-plugin impact traversal (QKG-07).
   * Traverses CODE_CALL, DI_INJECTION, INHERITANCE, SYMFONY_EVENT, SHARED_DB_TABLE,
   * SHARED_DB_COLUMN, and UI_TO_API channels while isolating noisy Core base classes.
   */
  async analyzeCrossPluginImpact(plugin, { maxHops = 3, limit = 50 } = {}) {
    const sourcePlugin = String(plugin || '').trim();
    const boundedHops = Math.max(1, Math.min(3, parseInt(maxHops || 3, 10)));
    const rowLimit = Math.max(1, Math.min(200, parseInt(limit || 50, 10)));
    const fetchLimit = neo4j.int(Math.max(rowLimit * 6, 400));

    const [codeEdges, diAndInhEdges, eventEdges, tableEdges, colEdges, uiApiEdges] = await Promise.all([
      this._exec(`
        MATCH (c1:Class)-[:DECLARES]->(m1:Method)-[r:CALLS]->(m2:Method)<-[:DECLARES]-(c2:Class)
        WHERE coalesce(c1.plugin, '') <> '' AND coalesce(c2.plugin, '') <> ''
          AND c1.plugin <> c2.plugin AND NOT c2.fqcn IN $noisyBases
        RETURN DISTINCT c1.plugin AS fromPlugin, c2.plugin AS toPlugin,
               m1.signature AS fromMethod, m2.signature AS toMethod, r.call_type AS callType
        LIMIT $limit
      `, { noisyBases: NOISY_BASE_FQCNS, limit: fetchLimit }),
      this._exec(`
        MATCH (c1:Class)-[r:INJECTED_WITH|EXTENDS|IMPLEMENTS]->(c2:Class|Interface)
        WHERE coalesce(c1.plugin, '') <> '' AND coalesce(c2.plugin, '') <> ''
          AND c1.plugin <> c2.plugin AND NOT c2.fqcn IN $noisyBases
        RETURN DISTINCT c1.plugin AS fromPlugin, c2.plugin AS toPlugin,
               CASE type(r) WHEN 'INJECTED_WITH' THEN 'DI_INJECTION' ELSE 'INHERITANCE' END AS channel,
               c1.fqcn AS fromClass, c2.fqcn AS toClass, type(r) AS relType
        LIMIT $limit
      `, { noisyBases: NOISY_BASE_FQCNS, limit: fetchLimit }),
      this._exec(`
        MATCH (c1:Class)-[:DISPATCHES]->(ev:Event)<-[:LISTENS_TO]-(c2:Class)
        WHERE coalesce(c1.plugin, '') <> '' AND coalesce(c2.plugin, '') <> '' AND c1.plugin <> c2.plugin
        RETURN DISTINCT c1.plugin AS fromPlugin, c2.plugin AS toPlugin,
               ev.event_id AS eventId, c1.fqcn AS publisherClass, c2.fqcn AS subscriberClass
        LIMIT $limit
      `, { limit: fetchLimit }),
      this._exec(`
        MATCH (c1:Class)-[:DECLARES]->(:Method)-[r1:READS_TABLE|WRITES_TABLE]->(dt:DatabaseTable)<-[r2:READS_TABLE|WRITES_TABLE]-(:Method)<-[:DECLARES]-(c2:Class)
        WHERE coalesce(c1.plugin, '') <> '' AND coalesce(c2.plugin, '') <> '' AND c1.plugin <> c2.plugin
        RETURN DISTINCT c1.plugin AS fromPlugin, c2.plugin AS toPlugin,
               dt.name AS tableName, type(r1) AS accessType, c2.fqcn AS otherClass
        LIMIT $limit
      `, { limit: fetchLimit }),
      this._exec(`
        MATCH (c1:Class)-[:DECLARES]->(:Method)-[r1:ACCESSES_COLUMN]->(dc:DatabaseColumn)<-[r2:ACCESSES_COLUMN]-(:Method)<-[:DECLARES]-(c2:Class)
        WHERE coalesce(c1.plugin, '') <> '' AND coalesce(c2.plugin, '') <> '' AND c1.plugin <> c2.plugin
        RETURN DISTINCT c1.plugin AS fromPlugin, c2.plugin AS toPlugin,
               dc.column_id AS columnId, c2.fqcn AS otherClass
        LIMIT $limit
      `, { limit: fetchLimit }),
      this._exec(`
        MATCH (ui:UIComponent)-[:CALLS_ENDPOINT]->(ep:ApiEndpoint)-[:HANDLED_BY]->(c2:Class)
        WHERE coalesce(ui.plugin, '') <> '' AND coalesce(c2.plugin, '') <> '' AND ui.plugin <> c2.plugin
        RETURN DISTINCT c2.plugin AS fromPlugin, ui.plugin AS toPlugin,
               ep.endpoint_id AS endpointId, ui.component_id AS consumerUi
        LIMIT $limit
      `, { limit: fetchLimit })
    ]);

    const adj = new Map();
    const recordAdj = (fromP, toP, channel, viaLabel) => {
      if (!fromP || !toP || fromP === toP) return;
      if (!adj.has(fromP)) adj.set(fromP, new Map());
      const targets = adj.get(fromP);
      if (!targets.has(toP)) targets.set(toP, { channels: new Set(), samples: [] });
      const entry = targets.get(toP);
      entry.channels.add(channel);
      if (viaLabel && entry.samples.length < 5 && !entry.samples.includes(viaLabel)) {
        entry.samples.push(viaLabel);
      }
    };

    for (const r of codeEdges) recordAdj(r.fromPlugin, r.toPlugin, 'CODE_CALL', r.toMethod || r.fromMethod);
    for (const r of diAndInhEdges) recordAdj(r.fromPlugin, r.toPlugin, r.channel || 'INHERITANCE', r.toClass);
    for (const r of eventEdges) recordAdj(r.fromPlugin, r.toPlugin, 'SYMFONY_EVENT', r.eventId);
    for (const r of tableEdges) recordAdj(r.fromPlugin, r.toPlugin, 'SHARED_DB_TABLE', r.tableName);
    for (const r of colEdges) recordAdj(r.fromPlugin, r.toPlugin, 'SHARED_DB_COLUMN', r.columnId);
    for (const r of uiApiEdges) recordAdj(r.fromPlugin, r.toPlugin, 'UI_TO_API', r.endpointId);

    // Bounded BFS (1..boundedHops) from sourcePlugin
    const visited = new Map();
    if (sourcePlugin) visited.set(sourcePlugin, 0);
    const queue = sourcePlugin ? [{ plugin: sourcePlugin, hop: 0, path: [sourcePlugin], hopsDetail: [] }] : [];
    const directDependencies = [];
    const transitiveDependencies = [];

    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr.hop >= boundedHops) continue;
      const neighbors = adj.get(curr.plugin);
      if (!neighbors) continue;

      for (const [nextPlugin, meta] of neighbors.entries()) {
        if (curr.path.includes(nextPlugin)) continue;
        const nextHop = curr.hop + 1;
        const prevBest = visited.get(nextPlugin);
        if (prevBest !== undefined && prevBest <= nextHop) continue;
        visited.set(nextPlugin, nextHop);

        const nextHopsDetail = [
          ...curr.hopsDetail,
          {
            fromPlugin: curr.plugin,
            toPlugin: nextPlugin,
            channels: [...meta.channels],
            sampleVia: meta.samples
          }
        ];
        const nextPath = [...curr.path, nextPlugin];
        const depRecord = {
          targetPlugin: nextPlugin,
          hop: nextHop,
          path: nextPath,
          channels: [...new Set(nextHopsDetail.flatMap((h) => h.channels))],
          hopsDetail: nextHopsDetail
        };

        if (nextHop === 1) directDependencies.push(depRecord);
        else transitiveDependencies.push(depRecord);

        queue.push({ plugin: nextPlugin, hop: nextHop, path: nextPath, hopsDetail: nextHopsDetail });
      }
    }

    const matchSrc = (row) => !sourcePlugin || row.fromPlugin === sourcePlugin;
    return {
      plugin: sourcePlugin,
      maxHops: boundedHops,
      directDependencies: directDependencies.slice(0, rowLimit),
      transitiveDependencies: transitiveDependencies.slice(0, rowLimit),
      outboundCrossModuleCalls: codeEdges.filter(matchSrc).slice(0, rowLimit).map((r) => ({
        fromMethod: r.fromMethod,
        toMethod: r.toMethod,
        targetPlugin: r.toPlugin,
        callType: r.callType
      })),
      diAndInheritanceDependencies: diAndInhEdges.filter(matchSrc).slice(0, rowLimit),
      eventCouplings: eventEdges.filter(matchSrc).slice(0, rowLimit),
      sharedTableCouplings: tableEdges.filter(matchSrc).slice(0, rowLimit).map((r) => ({
        tableName: r.tableName,
        accessType: r.accessType,
        sharedWithPlugin: r.toPlugin,
        otherClass: r.otherClass
      })),
      sharedColumnCouplings: colEdges.filter(matchSrc).slice(0, rowLimit).map((r) => ({
        columnId: r.columnId,
        sharedWithPlugin: r.toPlugin,
        otherClass: r.otherClass
      })),
      uiApiCouplings: uiApiEdges.filter((r) => !sourcePlugin || r.fromPlugin === sourcePlugin || r.toPlugin === sourcePlugin).slice(0, rowLimit),
      summary: {
        directPluginCount: directDependencies.length,
        transitivePluginCount: transitiveDependencies.length,
        maxHopsEvaluated: boundedHops
      }
    };
  }
}

module.exports = {
  TIAEngine,
  classifyChangedFiles,
  computeRiskScore,
  NOISY_BASE_FQCNS,
  CHANNEL_PRIORITY
};
