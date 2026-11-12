/**
 * QKG Incremental vs. Clean Full-Rebuild Parity Verifier (Phase 4C / Check #25)
 *
 * Verifies LogicalDiff(Graph_Incremental, Graph_FullClean) === 0 across
 * canonical entity and relationship manifests (excluding volatile metadata
 * such as timestamps, snapshot IDs, and Neo4j internal node IDs).
 */

const neo4j = require('neo4j-driver');
const {
  buildManifestFromNeo4j,
  buildManifestFromExtractedData,
  loadManifest
} = require('./snapshot_manifest');
const { compareStructural } = require('./snapshot_comparator');

function flattenEntityDeltas(entityDeltas = {}) {
  const added = [];
  const removed = [];
  const modified = [];
  for (const bucket of Object.values(entityDeltas)) {
    if (!bucket) continue;
    added.push(...(bucket.added || []));
    removed.push(...(bucket.removed || []));
    modified.push(...(bucket.modified || []));
  }
  return { added, removed, modified };
}

function flattenRelDeltas(relDeltas = {}) {
  const added = [];
  const removed = [];
  const modified = [];
  for (const bucket of Object.values(relDeltas)) {
    if (!bucket) continue;
    added.push(...(bucket.added || []));
    removed.push(...(bucket.removed || []));
    modified.push(...(bucket.modified || []));
  }
  return { added, removed, modified };
}

/**
 * Compares Incremental manifest (B1) against Full Clean Rebuild manifest (B2).
 * Notice compareStructural(B2, B1):
 *   - bucket.removed = missing in B1 (present in Full Clean B2, missing in Incremental B1)
 *   - bucket.added   = stale in B1 (absent in Full Clean B2, left behind in Incremental B1)
 *   - bucket.modified = content_fingerprint / edge_fingerprint mismatch
 */
function verifyParity(incrementalManifest, fullCleanManifest, options = {}) {
  const inc = typeof incrementalManifest === 'string'
    ? loadManifest(incrementalManifest, options.snapshotsDir)
    : incrementalManifest;
  const clean = typeof fullCleanManifest === 'string'
    ? loadManifest(fullCleanManifest, options.snapshotsDir)
    : fullCleanManifest;

  if (!inc || !clean) {
    return {
      parity_passed: false,
      digest_match: false,
      logical_diff_count: -1,
      error: !inc ? 'MISSING_INCREMENTAL_MANIFEST' : 'MISSING_FULL_CLEAN_MANIFEST'
    };
  }

  const diff = compareStructural(clean, inc);
  if (diff.status !== 'AVAILABLE') {
    return {
      parity_passed: false,
      digest_match: false,
      logical_diff_count: -1,
      error: diff.reason || 'COMPARISON_UNAVAILABLE'
    };
  }

  const ent = flattenEntityDeltas(diff.entity_deltas);
  const rel = flattenRelDeltas(diff.relationship_deltas);

  const logicalDiffCount =
    diff.counts.added_entities +
    diff.counts.removed_entities +
    diff.counts.modified_entities +
    diff.counts.added_relationships +
    diff.counts.removed_relationships +
    diff.counts.modified_relationships;

  const digestMatch = Boolean(
    inc.structural_digest &&
    clean.structural_digest &&
    inc.structural_digest === clean.structural_digest
  );

  const versionMatch = Boolean(
    diff.header.schema_version_match &&
    diff.header.extractor_version_match
  );

  // Validate explicit deleted/renamed expectations if caller provides them
  const expectationErrors = [];
  if (Array.isArray(options.expectedRemovedIds) && options.expectedRemovedIds.length > 0) {
    const incIds = new Set((inc.entities || []).map((e) => e.canonical_id));
    const cleanIds = new Set((clean.entities || []).map((e) => e.canonical_id));
    for (const rid of options.expectedRemovedIds) {
      if (incIds.has(rid)) expectationErrors.push(`STALE_ENTITY_NOT_REMOVED_BY_INCREMENTAL: ${rid}`);
      if (cleanIds.has(rid)) expectationErrors.push(`ENTITY_STILL_IN_CLEAN_REBUILD: ${rid}`);
    }
  }
  if (Array.isArray(options.expectedRemovedRelKeys) && options.expectedRemovedRelKeys.length > 0) {
    const incRelKeys = new Set((inc.relationships || []).map((r) => r.canonical_key));
    const cleanRelKeys = new Set((clean.relationships || []).map((r) => r.canonical_key));
    for (const rk of options.expectedRemovedRelKeys) {
      if (incRelKeys.has(rk)) expectationErrors.push(`STALE_REL_NOT_REMOVED_BY_INCREMENTAL: ${rk}`);
      if (cleanRelKeys.has(rk)) expectationErrors.push(`REL_STILL_IN_CLEAN_REBUILD: ${rk}`);
    }
  }
  if (Array.isArray(options.expectedAddedIds) && options.expectedAddedIds.length > 0) {
    const incIds = new Set((inc.entities || []).map((e) => e.canonical_id));
    const cleanIds = new Set((clean.entities || []).map((e) => e.canonical_id));
    for (const aid of options.expectedAddedIds) {
      if (!incIds.has(aid)) expectationErrors.push(`MISSING_ADDED_IN_INCREMENTAL: ${aid}`);
      if (!cleanIds.has(aid)) expectationErrors.push(`MISSING_ADDED_IN_CLEAN_REBUILD: ${aid}`);
    }
  }

  const parityPassed =
    digestMatch &&
    logicalDiffCount === 0 &&
    versionMatch &&
    expectationErrors.length === 0;

  return {
    parity_passed: parityPassed,
    digest_match: digestMatch,
    version_match: versionMatch,
    logical_diff_count: logicalDiffCount,
    expectation_errors: expectationErrors,
    header: {
      incremental_snapshot: inc.snapshot_id,
      clean_snapshot: clean.snapshot_id,
      app_commit_incremental: inc.app_commit,
      app_commit_clean: clean.app_commit,
      structural_digest_incremental: inc.structural_digest,
      structural_digest_clean: clean.structural_digest
    },
    counts: {
      total_entities_incremental: inc.counts?.total_entities ?? (inc.entities || []).length,
      total_entities_clean: clean.counts?.total_entities ?? (clean.entities || []).length,
      total_relationships_incremental: inc.counts?.total_relationships ?? (inc.relationships || []).length,
      total_relationships_clean: clean.counts?.total_relationships ?? (clean.relationships || []).length,
      missing_entities_in_incremental: ent.removed.length,
      stale_entities_in_incremental: ent.added.length,
      fingerprint_mismatched_entities: ent.modified.length,
      missing_relationships_in_incremental: rel.removed.length,
      stale_relationships_in_incremental: rel.added.length,
      fingerprint_mismatched_relationships: rel.modified.length
    },
    diffs: {
      missing_entities: ent.removed.slice(0, 100),
      stale_entities: ent.added.slice(0, 100),
      fingerprint_mismatches: ent.modified.slice(0, 100),
      missing_relationships: rel.removed.slice(0, 100),
      stale_relationships: rel.added.slice(0, 100),
      edge_fingerprint_mismatches: rel.modified.slice(0, 100)
    }
  };
}

/**
 * Queries two live Neo4j instances (e.g., incremental Staging vs clean rebuild Prod/Sandbox)
 * and verifies zero logical graph drift.
 */
async function verifyLiveNeo4jParity({
  incrementalUri = process.env.NEO4J_STAGING_URI || 'bolt://localhost:7688',
  cleanUri = process.env.NEO4J_URI || 'bolt://localhost:7687',
  user = process.env.NEO4J_USER || 'neo4j',
  password = process.env.NEO4J_PASSWORD || 'admin123',
  database = process.env.NEO4J_DATABASE || 'neo4j',
  metadata = {}
} = {}) {
  const incDriver = neo4j.driver(incrementalUri, neo4j.auth.basic(user, password), { connectionTimeout: 5000 });
  const cleanDriver = neo4j.driver(cleanUri, neo4j.auth.basic(user, password), { connectionTimeout: 5000 });
  const incSession = incDriver.session({ database });
  const cleanSession = cleanDriver.session({ database });

  try {
    const [incManifest, cleanManifest] = await Promise.all([
      buildManifestFromNeo4j(incSession, { snapshot_id: 'live-incremental', ...metadata }, { skipQualityQuery: true }),
      buildManifestFromNeo4j(cleanSession, { snapshot_id: 'live-clean', ...metadata }, { skipQualityQuery: true })
    ]);
    return verifyParity(incManifest, cleanManifest);
  } finally {
    await incSession.close();
    await cleanSession.close();
    await incDriver.close();
    await cleanDriver.close();
  }
}

/**
 * Verifies an in-memory extraction against a live Neo4j session (single-graph Check #25).
 */
async function verifyExtractedVsLiveNeo4j(extractedData, sessionOrRunner, metadata = {}) {
  const [fromExtracted, fromNeo4j] = await Promise.all([
    Promise.resolve(buildManifestFromExtractedData(extractedData, metadata)),
    buildManifestFromNeo4j(sessionOrRunner, metadata, { skipQualityQuery: true })
  ]);
  return verifyParity(fromNeo4j, fromExtracted);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const cleanIdx = args.indexOf('--clean-uri');
  const incIdx = args.indexOf('--inc-uri');
  const cleanUri = cleanIdx !== -1 ? args[cleanIdx + 1] : undefined;
  const incrementalUri = incIdx !== -1 ? args[incIdx + 1] : undefined;
  verifyLiveNeo4jParity({ cleanUri, incrementalUri })
    .then((res) => {
      console.log(`Parity Check: passed=${res.parity_passed} | digest_match=${res.digest_match} | logical_diff=${res.logical_diff_count}`);
      if (!res.parity_passed) process.exit(1);
    })
    .catch((err) => {
      console.error('[FATAL] Parity verification failed:', err);
      process.exit(1);
    });
}

module.exports = {
  verifyParity,
  verifyLiveNeo4jParity,
  verifyExtractedVsLiveNeo4j
};
