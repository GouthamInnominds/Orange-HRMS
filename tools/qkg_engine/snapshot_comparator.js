/**
 * QKG Structural & Quality Snapshot Comparison Engine (Phase 4B)
 *
 * Implements strictly separated comparison modes over canonical snapshot manifests
 * and runtime quality observations:
 *   - `structural`: entity/relationship diffs (signature vs body changes, removed/added
 *     endpoints/UI/DB/tests) + upstream business & test impact explanation.
 *   - `quality`: execution pass-rate, Clover coverage, test-mapping & flake-health deltas
 *     strictly gated by commit/framework/suite compatibility (UNAVAILABLE when incompatible
 *     or missing, never conflated as 0 or a false regression).
 */

const { REPOS } = require('./qkg_config');
const { loadManifest } = require('./snapshot_manifest');

const CLASS_LIKE_TYPES = new Set(['Class', 'Interface', 'Trait']);
const UI_TYPES = new Set(['UIComponent', 'UIPage']);
const DB_TYPES = new Set(['DatabaseTable', 'DatabaseEntity', 'DatabaseColumn', 'SchemaMigration']);
const BIZ_TYPES = new Set([
  'BusinessDomain',
  'BusinessWorkflow',
  'Feature',
  'RequirementGroup',
  'Requirement',
  'BusinessRule',
  'Persona',
  'UserStory',
  'Document'
]);
const TEST_DEF_TYPES = new Set(['TestSuite', 'TestCase']);

const DEPENDENCY_RELS = new Set([
  'CALLS',
  'EXTENDS',
  'IMPLEMENTS',
  'USES_TRAIT',
  'INJECTED_WITH',
  'LISTENS_TO',
  'DISPATCHES'
]);
const API_HANDLER_RELS = new Set(['EXPOSES', 'HANDLED_BY']);
const UI_RELS = new Set(['RENDERS', 'CALLS_ENDPOINT', 'EXTENDS_MENU', 'DECLARED_IN']);
const DB_RELS = new Set([
  'IS_ENTITY',
  'MAPS_TO',
  'FK_REFERENCES',
  'READS_TABLE',
  'WRITES_TABLE',
  'HAS_COLUMN',
  'MAPS_TO_COLUMN',
  'ACCESSES_COLUMN',
  'MODIFIES_TABLE',
  'MODIFIES_COLUMN'
]);
const TEST_MAP_RELS = new Set([
  'HAS_TEST_SUITE',
  'CONTAINS_TEST',
  'TESTS',
  'POTENTIAL_COVERS',
  'EXECUTES_AGAINST',
  'TESTS_COMPONENT',
  'NAVIGATES_PAGE',
  'PLANNED_VERIFICATION',
  'PLANNED_ENDPOINT_COVERAGE',
  'VERIFIES',
  'VERIFIES_STORY',
  'VALIDATES_RULE'
]);

function bucketEntityCategory(entityType) {
  if (CLASS_LIKE_TYPES.has(entityType)) return 'classes_interfaces_traits';
  if (entityType === 'Method') return 'methods';
  if (entityType === 'ApiEndpoint') return 'api_endpoints';
  if (UI_TYPES.has(entityType)) return 'ui_components_and_pages';
  if (DB_TYPES.has(entityType)) return 'database_mappings';
  if (BIZ_TYPES.has(entityType)) return 'business_traceability';
  if (TEST_DEF_TYPES.has(entityType)) return 'test_definitions';
  return 'other_entities';
}

function bucketRelCategory(relType) {
  if (DEPENDENCY_RELS.has(relType)) return 'dependency_edges';
  if (API_HANDLER_RELS.has(relType)) return 'api_handler_edges';
  if (UI_RELS.has(relType)) return 'ui_edges';
  if (DB_RELS.has(relType)) return 'database_edges';
  if (TEST_MAP_RELS.has(relType)) return 'test_mapping_edges';
  return 'other_edges';
}

function emptyBucket() {
  return { added: [], removed: [], modified: [] };
}

function summarizeEntity(e) {
  return {
    entity_type: e.entity_type,
    canonical_id: e.canonical_id,
    plugin: e.plugin || null,
    module: e.module || null,
    source_file: e.source_file || null,
    source_repo: e.source_repo || REPOS.APP,
    signature_hash: e.signature_hash || null,
    content_fingerprint: e.content_fingerprint || null
  };
}

function summarizeRel(r) {
  return {
    canonical_key: r.canonical_key,
    source_type: r.source_type,
    source_id: r.source_id,
    rel_type: r.rel_type,
    target_type: r.target_type,
    target_id: r.target_id,
    evidence_type: r.evidence_type || null,
    provenance_class: r.provenance_class || 'STRUCTURAL',
    edge_fingerprint: r.edge_fingerprint || null
  };
}

function buildGraphIndexes(manifest) {
  const entByKey = new Map();
  const rels = manifest?.relationships || [];
  const incomingByTarget = new Map();
  const outgoingBySource = new Map();

  for (const e of manifest?.entities || []) {
    entByKey.set(`${e.entity_type}::${e.canonical_id}`, e);
  }
  for (const r of rels) {
    const srcKey = `${r.source_type}::${r.source_id}`;
    const dstKey = `${r.target_type}::${r.target_id}`;
    if (!outgoingBySource.has(srcKey)) outgoingBySource.set(srcKey, []);
    outgoingBySource.get(srcKey).push(r);
    if (!incomingByTarget.has(dstKey)) incomingByTarget.set(dstKey, []);
    incomingByTarget.get(dstKey).push(r);
  }

  return { entByKey, incomingByTarget, outgoingBySource };
}

/**
 * Walks structural + traceability edges around changed artifacts to explain
 * which endpoints, business features/stories, and tests are impacted.
 */
function buildStructuralImpactExplanation(manifestA, manifestB, rawEntityChanges) {
  const idxB = buildGraphIndexes(manifestB);
  const idxA = buildGraphIndexes(manifestA);

  const affectedPlugins = new Set();
  const affectedEndpoints = new Map();
  const affectedUi = new Map();
  const affectedTables = new Set();
  const affectedFeatures = new Map();
  const affectedStories = new Map();
  const affectedRequirements = new Map();
  const affectedTests = new Map();
  const plannedBacklogImpacts = new Map();
  const newlyUncovered = [];

  const getEntity = (type, id) => {
    const k = `${type}::${id}`;
    return idxB.entByKey.get(k) || idxA.entByKey.get(k) || null;
  };
  const getIncoming = (type, id) => [
    ...(idxB.incomingByTarget.get(`${type}::${id}`) || []),
    ...(idxA.incomingByTarget.get(`${type}::${id}`) || [])
  ];
  const getOutgoing = (type, id) => [
    ...(idxB.outgoingBySource.get(`${type}::${id}`) || []),
    ...(idxA.outgoingBySource.get(`${type}::${id}`) || [])
  ];

  const recordTestHit = (testId, reason, originManifest) => {
    const tcEnt = getEntity('TestCase', testId);
    const origin = tcEnt?.properties?.origin || null;
    if (origin === 'BASELINE_MANIFEST') {
      if (!plannedBacklogImpacts.has(testId)) {
        plannedBacklogImpacts.set(testId, {
          canonical_id: testId,
          name: tcEnt?.properties?.name || testId,
          suite: tcEnt?.properties?.suite || null,
          reason
        });
      }
      return;
    }
    if (!affectedTests.has(testId)) {
      affectedTests.set(testId, {
        canonical_id: testId,
        name: tcEnt?.properties?.name || testId,
        plugin: tcEnt?.plugin || null,
        framework: tcEnt?.properties?.framework || null,
        file: tcEnt?.source_file || null,
        reasons: [reason],
        observed_in: originManifest
      });
    } else {
      const existing = affectedTests.get(testId);
      if (!existing.reasons.includes(reason)) existing.reasons.push(reason);
    }
  };

  const traceUpstreamFromMethod = (methodSig, baseReason, maxDepth = 3) => {
    const queue = [{ type: 'Method', id: methodSig, depth: 0, reason: baseReason }];
    const visited = new Set([`Method::${methodSig}`]);

    while (queue.length > 0) {
      const cur = queue.shift();
      for (const rel of getIncoming(cur.type, cur.id)) {
        const srcKey = `${rel.source_type}::${rel.source_id}`;
        if (rel.rel_type === 'TESTS' && rel.source_type === 'TestCase') {
          recordTestHit(rel.source_id, `${cur.reason} <-[TESTS (${rel.evidence_type || 'STATIC'})]- ${cur.id}`, 'snapshot');
        } else if (rel.rel_type === 'CALLS' && rel.source_type === 'Method' && cur.depth < maxDepth) {
          if (!visited.has(srcKey)) {
            visited.add(srcKey);
            queue.push({
              type: 'Method',
              id: rel.source_id,
              depth: cur.depth + 1,
              reason: `${cur.reason} <-[CALLS]- ${rel.source_id}`
            });
          }
        } else if (rel.rel_type === 'DECLARES' && rel.source_type === 'Class') {
          traceEndpointAndStoriesForClass(rel.source_id, cur.reason);
        }
      }
    }
  };

  const traceEndpointAndStoriesForClass = (classFqcn, reason) => {
    for (const rel of getOutgoing('Class', classFqcn)) {
      if (rel.rel_type === 'EXPOSES' && rel.target_type === 'ApiEndpoint') {
        traceEndpoint(rel.target_id, `${reason} -> ${rel.target_id}`);
      }
    }
  };

  const traceEndpoint = (endpointId, reason) => {
    const epEnt = getEntity('ApiEndpoint', endpointId);
    if (!affectedEndpoints.has(endpointId)) {
      affectedEndpoints.set(endpointId, {
        endpoint_id: endpointId,
        plugin: epEnt?.plugin || null,
        handler_fqcn: epEnt?.properties?.handler_fqcn || null,
        reason
      });
    }
    for (const rel of getIncoming('ApiEndpoint', endpointId)) {
      if (rel.rel_type === 'EXECUTES_AGAINST' && rel.source_type === 'TestCase') {
        recordTestHit(rel.source_id, `${reason} <-[EXECUTES_AGAINST]- ${rel.source_id}`, 'snapshot');
      } else if (rel.rel_type === 'EXECUTES_VIA' && rel.source_type === 'UserStory') {
        recordStory(rel.source_id, `${reason} <-[EXECUTES_VIA]- ${rel.source_id}`);
      } else if (rel.rel_type === 'INCLUDES_ENDPOINT' && rel.source_type === 'Feature') {
        const fEnt = getEntity('Feature', rel.source_id);
        affectedFeatures.set(rel.source_id, { feature_id: rel.source_id, name: fEnt?.properties?.name || rel.source_id });
      } else if (rel.rel_type === 'CALLS_ENDPOINT' && rel.source_type === 'UIComponent') {
        traceUi(rel.source_id, `${reason} <-[CALLS_ENDPOINT]- ${rel.source_id}`);
      }
    }
  };

  const traceUi = (compId, reason) => {
    const uiEnt = getEntity('UIComponent', compId);
    if (!affectedUi.has(compId)) {
      affectedUi.set(compId, { component_id: compId, name: uiEnt?.properties?.name || compId, plugin: uiEnt?.plugin || null });
    }
    for (const rel of getIncoming('UIComponent', compId)) {
      if (rel.rel_type === 'TESTS_COMPONENT' && rel.source_type === 'TestCase') {
        recordTestHit(rel.source_id, `${reason} <-[TESTS_COMPONENT]- ${rel.source_id}`, 'snapshot');
      } else if (rel.rel_type === 'IMPLEMENTED_BY' && rel.source_type === 'UserStory') {
        recordStory(rel.source_id, `${reason} <-[IMPLEMENTED_BY]- ${rel.source_id}`);
      } else if (rel.rel_type === 'RENDERS' && rel.source_type === 'UIPage') {
        for (const pRel of getIncoming('UIPage', rel.source_id)) {
          if (pRel.rel_type === 'NAVIGATES_PAGE' && pRel.source_type === 'TestCase') {
            recordTestHit(pRel.source_id, `${reason} <-[NAVIGATES_PAGE]- ${rel.source_id}`, 'snapshot');
          }
        }
      }
    }
  };

  const recordStory = (storyId, reason) => {
    const stEnt = getEntity('UserStory', storyId);
    if (!affectedStories.has(storyId)) {
      affectedStories.set(storyId, {
        story_id: storyId,
        title: stEnt?.properties?.title || storyId,
        feature_id: stEnt?.properties?.feature_id || null,
        requirement_id: stEnt?.properties?.requirement_id || null,
        reason
      });
    }
    for (const rel of getOutgoing('UserStory', storyId)) {
      if (rel.rel_type === 'BELONGS_TO' && rel.target_type === 'Feature') {
        const fEnt = getEntity('Feature', rel.target_id);
        affectedFeatures.set(rel.target_id, { feature_id: rel.target_id, name: fEnt?.properties?.name || rel.target_id });
      } else if (rel.rel_type === 'REALIZES' && rel.target_type === 'Requirement') {
        const rEnt = getEntity('Requirement', rel.target_id);
        affectedRequirements.set(rel.target_id, { requirement_id: rel.target_id, title: rEnt?.properties?.title || rel.target_id });
      }
    }
    for (const rel of getIncoming('UserStory', storyId)) {
      if (rel.rel_type === 'VERIFIES_STORY' && rel.source_type === 'TestCase') {
        recordTestHit(rel.source_id, `${reason} <-[VERIFIES_STORY]- ${rel.source_id}`, 'snapshot');
      }
    }
  };

  const changedItems = [
    ...rawEntityChanges.added.map((e) => ({ op: 'ADDED', item: e })),
    ...rawEntityChanges.removed.map((e) => ({ op: 'REMOVED', item: e })),
    ...rawEntityChanges.modified.map((m) => ({ op: 'MODIFIED', item: m.after, change_kind: m.change_kind }))
  ];

  for (const { op, item } of changedItems) {
    if (item.plugin) affectedPlugins.add(item.plugin);
    if (item.entity_type === 'Method') {
      traceUpstreamFromMethod(item.canonical_id, `${op} Method ${item.canonical_id}`);
      if (op !== 'REMOVED') {
        const incomingInB = idxB.incomingByTarget.get(`Method::${item.canonical_id}`) || [];
        const hasAutomatedTest = incomingInB.some((r) => r.rel_type === 'TESTS');
        if (!hasAutomatedTest && item.properties?.visibility === 'public') {
          newlyUncovered.push({
            entity_type: 'Method',
            canonical_id: item.canonical_id,
            plugin: item.plugin || null,
            change_op: op
          });
        }
      }
    } else if (item.entity_type === 'Class' || item.entity_type === 'Interface' || item.entity_type === 'Trait') {
      traceEndpointAndStoriesForClass(item.canonical_id, `${op} ${item.entity_type} ${item.canonical_id}`);
    } else if (item.entity_type === 'ApiEndpoint') {
      traceEndpoint(item.canonical_id, `${op} ApiEndpoint ${item.canonical_id}`);
      if (op !== 'REMOVED') {
        const incomingInB = idxB.incomingByTarget.get(`ApiEndpoint::${item.canonical_id}`) || [];
        const hasTest = incomingInB.some((r) => r.rel_type === 'EXECUTES_AGAINST');
        if (!hasTest) {
          newlyUncovered.push({
            entity_type: 'ApiEndpoint',
            canonical_id: item.canonical_id,
            plugin: item.plugin || null,
            change_op: op
          });
        }
      }
    } else if (item.entity_type === 'UIComponent') {
      traceUi(item.canonical_id, `${op} UIComponent ${item.canonical_id}`);
      if (op !== 'REMOVED' && item.properties?.type !== 'TypeScriptModule') {
        const incomingInB = idxB.incomingByTarget.get(`UIComponent::${item.canonical_id}`) || [];
        const hasTest = incomingInB.some((r) => r.rel_type === 'TESTS_COMPONENT');
        if (!hasTest) {
          newlyUncovered.push({
            entity_type: 'UIComponent',
            canonical_id: item.canonical_id,
            plugin: item.plugin || null,
            change_op: op
          });
        }
      }
    } else if (item.entity_type === 'DatabaseTable') {
      affectedTables.add(item.canonical_id);
      for (const rel of getIncoming('DatabaseTable', item.canonical_id)) {
        if ((rel.rel_type === 'READS_TABLE' || rel.rel_type === 'WRITES_TABLE') && rel.source_type === 'Method') {
          traceUpstreamFromMethod(rel.source_id, `${op} Table ${item.canonical_id} <-[${rel.rel_type}]- ${rel.source_id}`, 2);
        }
      }
    } else if (item.entity_type === 'DatabaseColumn') {
      if (item.properties?.table_name) affectedTables.add(item.properties.table_name);
      for (const rel of getIncoming('DatabaseColumn', item.canonical_id)) {
        if (rel.rel_type === 'ACCESSES_COLUMN' && rel.source_type === 'Method') {
          traceUpstreamFromMethod(rel.source_id, `${op} Column ${item.canonical_id} <-[ACCESSES_COLUMN]- ${rel.source_id}`, 2);
        }
      }
    } else if (item.entity_type === 'UserStory') {
      recordStory(item.canonical_id, `${op} UserStory ${item.canonical_id}`);
    } else if (item.entity_type === 'TestCase') {
      recordTestHit(item.canonical_id, `${op} TestCase ${item.canonical_id}`, op === 'REMOVED' ? 'snapshotA' : 'snapshotB');
    }
  }

  const pluginsArr = [...affectedPlugins].sort();
  const epArr = [...affectedEndpoints.values()];
  const storiesArr = [...affectedStories.values()];
  const testsArr = [...affectedTests.values()];

  const narrativeParts = [];
  if (changedItems.length === 0) {
    narrativeParts.push('No structural changes detected between the two snapshots.');
  } else {
    narrativeParts.push(
      `Detected ${rawEntityChanges.added.length} added, ${rawEntityChanges.removed.length} removed, and ${rawEntityChanges.modified.length} modified structural entities across ${pluginsArr.length || 1} plugin(s) (${pluginsArr.join(', ') || 'core'}).`
    );
    if (epArr.length > 0) {
      narrativeParts.push(`Impacted ${epArr.length} API endpoint(s): ${epArr.slice(0, 5).map((e) => e.endpoint_id).join(', ')}.`);
    }
    if (storiesArr.length > 0) {
      narrativeParts.push(`Affected ${storiesArr.length} business user story/stories and ${affectedFeatures.size} feature(s).`);
    }
    if (testsArr.length > 0) {
      narrativeParts.push(`Identified ${testsArr.length} impacted automated test(s) for verification.`);
    }
    if (newlyUncovered.length > 0) {
      narrativeParts.push(`Warning: ${newlyUncovered.length} newly added/modified public target(s) lack direct automated test links.`);
    }
  }

  return {
    affected_plugins: pluginsArr,
    affected_endpoints: epArr,
    affected_ui_components: [...affectedUi.values()],
    affected_tables: [...affectedTables].sort(),
    affected_features: [...affectedFeatures.values()],
    affected_stories: storiesArr,
    affected_requirements: [...affectedRequirements.values()],
    affected_tests: testsArr,
    planned_backlog_impacts: [...plannedBacklogImpacts.values()],
    newly_uncovered_functionality: newlyUncovered,
    summary_narrative: narrativeParts.join(' ')
  };
}

/**
 * Pure structural delta between two manifests (independent of runtime quality runs).
 */
function compareStructural(manifestA, manifestB) {
  if (!manifestA || !manifestB) {
    return {
      status: 'UNAVAILABLE',
      reason: 'MISSING_SNAPSHOT_MANIFEST'
    };
  }

  const entMapA = new Map((manifestA.entities || []).map((e) => [`${e.entity_type}::${e.canonical_id}`, e]));
  const entMapB = new Map((manifestB.entities || []).map((e) => [`${e.entity_type}::${e.canonical_id}`, e]));

  const entityDeltas = {
    classes_interfaces_traits: emptyBucket(),
    methods: emptyBucket(),
    api_endpoints: emptyBucket(),
    ui_components_and_pages: emptyBucket(),
    database_mappings: emptyBucket(),
    business_traceability: emptyBucket(),
    test_definitions: emptyBucket(),
    other_entities: emptyBucket()
  };

  const rawAdded = [];
  const rawRemoved = [];
  const rawModified = [];

  for (const [k, entB] of entMapB.entries()) {
    const bucket = entityDeltas[bucketEntityCategory(entB.entity_type)];
    if (!entMapA.has(k)) {
      rawAdded.push(entB);
      bucket.added.push(summarizeEntity(entB));
    } else {
      const entA = entMapA.get(k);
      if (entA.content_fingerprint !== entB.content_fingerprint) {
        let changeKind = 'property_changed';
        if (entB.entity_type === 'Method') {
          changeKind = entA.signature_hash !== entB.signature_hash
            ? 'signature_changed'
            : 'body_only_changed';
        }
        rawModified.push({ before: entA, after: entB, change_kind: changeKind });
        bucket.modified.push({
          ...summarizeEntity(entB),
          change_kind: changeKind,
          previous_signature_hash: entA.signature_hash || null,
          previous_content_fingerprint: entA.content_fingerprint || null
        });
      }
    }
  }

  for (const [k, entA] of entMapA.entries()) {
    if (!entMapB.has(k)) {
      rawRemoved.push(entA);
      entityDeltas[bucketEntityCategory(entA.entity_type)].removed.push(summarizeEntity(entA));
    }
  }

  const relMapA = new Map((manifestA.relationships || []).map((r) => [r.canonical_key, r]));
  const relMapB = new Map((manifestB.relationships || []).map((r) => [r.canonical_key, r]));

  const relDeltas = {
    dependency_edges: emptyBucket(),
    api_handler_edges: emptyBucket(),
    ui_edges: emptyBucket(),
    database_edges: emptyBucket(),
    test_mapping_edges: emptyBucket(),
    other_edges: emptyBucket()
  };

  let addedRels = 0;
  let removedRels = 0;
  let modifiedRels = 0;

  for (const [k, rB] of relMapB.entries()) {
    const bucket = relDeltas[bucketRelCategory(rB.rel_type)];
    if (!relMapA.has(k)) {
      addedRels++;
      bucket.added.push(summarizeRel(rB));
    } else {
      const rA = relMapA.get(k);
      if (rA.edge_fingerprint !== rB.edge_fingerprint) {
        modifiedRels++;
        bucket.modified.push({
          ...summarizeRel(rB),
          previous_edge_fingerprint: rA.edge_fingerprint
        });
      }
    }
  }

  for (const [k, rA] of relMapA.entries()) {
    if (!relMapB.has(k)) {
      removedRels++;
      relDeltas[bucketRelCategory(rA.rel_type)].removed.push(summarizeRel(rA));
    }
  }

  const impactExplanation = buildStructuralImpactExplanation(manifestA, manifestB, {
    added: rawAdded,
    removed: rawRemoved,
    modified: rawModified
  });

  return {
    status: 'AVAILABLE',
    header: {
      snapshot_a: manifestA.snapshot_id || null,
      snapshot_b: manifestB.snapshot_id || null,
      app_commit_a: manifestA.app_commit || null,
      app_commit_b: manifestB.app_commit || null,
      qa_commit_a: manifestA.qa_commit || null,
      qa_commit_b: manifestB.qa_commit || null,
      structural_digest_a: manifestA.structural_digest,
      structural_digest_b: manifestB.structural_digest,
      digest_changed: manifestA.structural_digest !== manifestB.structural_digest,
      schema_version_match: manifestA.schema_version === manifestB.schema_version,
      extractor_version_match: manifestA.extractor_version === manifestB.extractor_version
    },
    counts: {
      added_entities: rawAdded.length,
      removed_entities: rawRemoved.length,
      modified_entities: rawModified.length,
      added_relationships: addedRels,
      removed_relationships: removedRels,
      modified_relationships: modifiedRels
    },
    entity_deltas: entityDeltas,
    relationship_deltas: relDeltas,
    impact_explanation: impactExplanation
  };
}

function unavailableQuality(reason, extra = {}) {
  return {
    status: 'UNAVAILABLE',
    comparable: false,
    reason,
    test_mapping_changes: extra.test_mapping_changes || null,
    coverage_delta: null,
    execution_pass_rate_delta: null,
    test_health_changes: null,
    newly_introduced_regression_risks: [],
    ...extra
  };
}

function indexCompletedExecutions(obs = {}, scopeFilter = null) {
  const completedRuns = (obs.test_runs || []).filter((r) =>
    String(r.status || 'COMPLETED').toUpperCase() === 'COMPLETED'
  );
  const completedRunIds = new Set(completedRuns.map((r) => r.run_id));
  const execs = (obs.executions || []).filter((ex) => {
    if (ex.run_id && completedRunIds.size > 0 && !completedRunIds.has(ex.run_id)) return false;
    if (scopeFilter?.framework && ex.framework && ex.framework !== scopeFilter.framework) return false;
    if (scopeFilter?.suiteScope && ex.suite && ex.suite !== scopeFilter.suiteScope) return false;
    return true;
  });

  const scopes = new Set();
  for (const r of completedRuns) {
    const fw = r.framework || 'UNKNOWN';
    const sc = r.suite_scope || r.suite || 'ALL';
    if (scopeFilter?.framework && fw !== scopeFilter.framework) continue;
    if (scopeFilter?.suiteScope && sc !== scopeFilter.suiteScope) continue;
    scopes.add(`${fw}::${sc}`);
  }
  for (const ex of execs) {
    scopes.add(`${ex.framework || 'UNKNOWN'}::${ex.suite || 'ALL'}`);
  }

  return { completedRuns, execs, scopes };
}

function normalizePassFail(status) {
  const up = String(status || '').toUpperCase();
  if (up === 'PASS' || up === 'PASSED') return 'PASS';
  if (up === 'FAIL' || up === 'FAILED' || up === 'ERROR') return 'FAIL';
  return 'OTHER';
}

function indexCoverageObservations(obs = {}, scopeFilter = null) {
  const completedCovRuns = (obs.coverage_runs || []).filter((c) =>
    String(c.status || 'COMPLETED').toUpperCase() === 'COMPLETED'
  );
  const runIds = new Set(completedCovRuns.map((c) => c.run_id));
  const covObs = (obs.coverage_observations || []).filter((o) => {
    if (o.run_id && runIds.size > 0 && !runIds.has(o.run_id)) return false;
    if (scopeFilter?.framework && o.framework && o.framework !== scopeFilter.framework) return false;
    return Number(o.lines_total || 0) > 0;
  });
  return { completedCovRuns, covObs };
}

/**
 * Pure runtime quality comparison between two observation payloads.
 * Strictly requires completed runs and compatible commit/framework/suite scopes.
 * Missing or incompatible data returns status='UNAVAILABLE', NEVER 0 or false regression.
 */
function compareQuality(qualityObsA, qualityObsB, options = {}) {
  if (!qualityObsA || !qualityObsB) {
    return unavailableQuality('MISSING_QUALITY_OBSERVATIONS');
  }
  if (qualityObsA.status === 'UNAVAILABLE' || qualityObsB.status === 'UNAVAILABLE') {
    return unavailableQuality('MISSING_QUALITY_OBSERVATIONS', {
      details: {
        a_reason: qualityObsA.reason || null,
        b_reason: qualityObsB.reason || null
      }
    });
  }

  if (options.requireCommitIdentity && (!qualityObsA.app_commit || !qualityObsB.app_commit)) {
    return unavailableQuality('MISSING_SOURCE_COMMIT_IDENTITY');
  }
  if (options.requireSameCommit && qualityObsA.app_commit !== qualityObsB.app_commit) {
    return unavailableQuality('INCOMPATIBLE_SOURCE_COMMITS', {
      details: { app_commit_a: qualityObsA.app_commit, app_commit_b: qualityObsB.app_commit }
    });
  }

  const scopeFilter = {
    framework: options.framework || null,
    suiteScope: options.suiteScope || null
  };

  const execIdxA = indexCompletedExecutions(qualityObsA, scopeFilter);
  const execIdxB = indexCompletedExecutions(qualityObsB, scopeFilter);
  const covIdxA = indexCoverageObservations(qualityObsA, scopeFilter);
  const covIdxB = indexCoverageObservations(qualityObsB, scopeFilter);

  const hasAnyCompletedExecA = execIdxA.completedRuns.length > 0 || execIdxA.execs.length > 0;
  const hasAnyCompletedExecB = execIdxB.completedRuns.length > 0 || execIdxB.execs.length > 0;
  const hasAnyCovA = covIdxA.completedCovRuns.length > 0 || covIdxA.covObs.length > 0;
  const hasAnyCovB = covIdxB.completedCovRuns.length > 0 || covIdxB.covObs.length > 0;

  if (!hasAnyCompletedExecA && !hasAnyCovA) {
    return unavailableQuality('NO_COMPLETED_OBSERVATIONS_IN_SNAPSHOT_A');
  }
  if (!hasAnyCompletedExecB && !hasAnyCovB) {
    return unavailableQuality('NO_COMPLETED_OBSERVATIONS_IN_SNAPSHOT_B');
  }

  // Test-mapping changes (structural test-to-target mappings if manifests supplied)
  let testMappingChanges = null;
  if (options.manifestA && options.manifestB) {
    const mapA = new Set(
      (options.manifestA.relationships || [])
        .filter((r) => ['TESTS', 'EXECUTES_AGAINST', 'TESTS_COMPONENT'].includes(r.rel_type))
        .map((r) => r.source_id)
    );
    const mapB = new Set(
      (options.manifestB.relationships || [])
        .filter((r) => ['TESTS', 'EXECUTES_AGAINST', 'TESTS_COMPONENT'].includes(r.rel_type))
        .map((r) => r.source_id)
    );
    testMappingChanges = {
      newly_mapped_tests: [...mapB].filter((id) => !mapA.has(id)).sort(),
      newly_unmapped_tests: [...mapA].filter((id) => !mapB.has(id)).sort()
    };
  }

  // Execution pass rate & health comparison
  let executionPassRateDelta = null;
  let testHealthChanges = null;
  const regressions = [];

  if (hasAnyCompletedExecA && hasAnyCompletedExecB) {
    const commonScopes = [...execIdxA.scopes].filter((s) => execIdxB.scopes.has(s));
    if (execIdxA.scopes.size > 0 && execIdxB.scopes.size > 0 && commonScopes.length === 0) {
      return unavailableQuality('INCOMPATIBLE_SUITE_SCOPE_OR_FRAMEWORK', {
        details: {
          scopes_a: [...execIdxA.scopes].sort(),
          scopes_b: [...execIdxB.scopes].sort()
        },
        test_mapping_changes: testMappingChanges
      });
    }

    const commonSet = new Set(commonScopes);
    const matchesCommon = (ex) => {
      if (commonSet.size === 0) return true;
      const fw = ex.framework || 'UNKNOWN';
      const sc = ex.suite || 'ALL';
      return commonSet.has(`${fw}::${sc}`) || commonSet.has(`${fw}::ALL`);
    };

    const filtA = execIdxA.execs.filter(matchesCommon);
    const filtB = execIdxB.execs.filter(matchesCommon);

    if (filtA.length > 0 && filtB.length > 0) {
      const byTestA = new Map();
      const byTestB = new Map();
      for (const ex of filtA) {
        if (!ex.testcase_id) continue;
        byTestA.set(ex.testcase_id, ex);
      }
      for (const ex of filtB) {
        if (!ex.testcase_id) continue;
        byTestB.set(ex.testcase_id, ex);
      }

      const passedA = filtA.filter((e) => normalizePassFail(e.status) === 'PASS').length;
      const passedB = filtB.filter((e) => normalizePassFail(e.status) === 'PASS').length;
      const rateA = Number(((passedA / filtA.length) * 100).toFixed(2));
      const rateB = Number(((passedB / filtB.length) * 100).toFixed(2));

      const newFailing = [];
      const fixedTests = [];
      const newlyFlaky = [];

      for (const [tid, exB] of byTestB.entries()) {
        const stB = normalizePassFail(exB.status);
        const exA = byTestA.get(tid);
        const stA = exA ? normalizePassFail(exA.status) : null;
        if (stB === 'FAIL' && (!stA || stA === 'PASS')) {
          newFailing.push({ testcase_id: tid, previous_status: stA || 'NEW_TEST', current_status: stB });
          regressions.push({
            type: 'NEW_FAILING_TEST',
            severity: 'HIGH',
            target: tid,
            message: `${tid} transitioned from ${stA || 'UNOBSERVED'} to FAIL.`
          });
        } else if (stB === 'PASS' && stA === 'FAIL') {
          fixedTests.push(tid);
        }
        if ((exB.flaky || exB.retry_count > 0) && !(exA?.flaky || (exA?.retry_count || 0) > 0)) {
          newlyFlaky.push(tid);
        }
      }

      executionPassRateDelta = {
        comparable_scopes: commonScopes.sort(),
        executions_before: filtA.length,
        executions_after: filtB.length,
        pass_rate_before_pct: rateA,
        pass_rate_after_pct: rateB,
        delta_pct: Number((rateB - rateA).toFixed(2)),
        new_failing_tests: newFailing,
        fixed_tests: fixedTests.sort()
      };

      const flakeA = Number(((filtA.filter((e) => e.flaky || e.retry_count > 0).length / filtA.length) * 100).toFixed(2));
      const flakeB = Number(((filtB.filter((e) => e.flaky || e.retry_count > 0).length / filtB.length) * 100).toFixed(2));

      testHealthChanges = {
        flake_rate_before_pct: flakeA,
        flake_rate_after_pct: flakeB,
        flake_delta_pct: Number((flakeB - flakeA).toFixed(2)),
        newly_flaky_tests: newlyFlaky.sort()
      };
    }
  } else if ((hasAnyCompletedExecA && !hasAnyCompletedExecB) || (!hasAnyCompletedExecA && hasAnyCompletedExecB)) {
    // Only one snapshot has execution observations -> do not fabricate 0 or regression
    executionPassRateDelta = null;
    testHealthChanges = null;
  }

  // Coverage delta comparison (strictly requires comparable completed coverage runs on both sides)
  let coverageDelta = null;
  if (hasAnyCovA && hasAnyCovB) {
    const fwA = new Set(covIdxA.completedCovRuns.map((r) => r.framework).filter(Boolean));
    const fwB = new Set(covIdxB.completedCovRuns.map((r) => r.framework).filter(Boolean));
    const fwOverlap = fwA.size === 0 || fwB.size === 0 || [...fwA].some((f) => fwB.has(f));

    if (!fwOverlap) {
      return unavailableQuality('INCOMPATIBLE_COVERAGE_FRAMEWORK', {
        details: { frameworks_a: [...fwA], frameworks_b: [...fwB] },
        test_mapping_changes: testMappingChanges
      });
    }

    const byTargetA = new Map();
    const byTargetB = new Map();
    let coveredA = 0;
    let totalA = 0;
    let coveredB = 0;
    let totalB = 0;

    for (const o of covIdxA.covObs) {
      const tid = o.target_id;
      if (tid) byTargetA.set(tid, o);
      coveredA += Number(o.lines_covered || 0);
      totalA += Number(o.lines_total || 0);
    }
    for (const o of covIdxB.covObs) {
      const tid = o.target_id;
      if (tid) byTargetB.set(tid, o);
      coveredB += Number(o.lines_covered || 0);
      totalB += Number(o.lines_total || 0);
    }

    if (totalA > 0 && totalB > 0) {
      const pctA = Number(((coveredA / totalA) * 100).toFixed(2));
      const pctB = Number(((coveredB / totalB) * 100).toFixed(2));
      const increasedTargets = [];
      const decreasedTargets = [];

      for (const [tid, oB] of byTargetB.entries()) {
        const oA = byTargetA.get(tid);
        if (!oA) continue;
        const pA = Number(((oA.lines_covered / oA.lines_total) * 100).toFixed(2));
        const pB = Number(((oB.lines_covered / oB.lines_total) * 100).toFixed(2));
        const diff = Number((pB - pA).toFixed(2));
        if (diff > 0) increasedTargets.push({ target_id: tid, before_pct: pA, after_pct: pB, delta_pct: diff });
        else if (diff < 0) {
          decreasedTargets.push({ target_id: tid, before_pct: pA, after_pct: pB, delta_pct: diff });
          if (diff <= -2) {
            regressions.push({
              type: 'COVERAGE_DROP',
              severity: 'MEDIUM',
              target: tid,
              message: `Line coverage on ${tid} dropped from ${pA}% to ${pB}% (${diff}%).`
            });
          }
        }
      }

      coverageDelta = {
        lines_covered_before: coveredA,
        lines_total_before: totalA,
        pct_before: pctA,
        lines_covered_after: coveredB,
        lines_total_after: totalB,
        pct_after: pctB,
        delta_pct: Number((pctB - pctA).toFixed(2)),
        increased_targets: increasedTargets,
        decreased_targets: decreasedTargets
      };
    }
  }

  if (!executionPassRateDelta && !coverageDelta) {
    return unavailableQuality('NO_COMPATIBLE_QUALITY_PAIR', {
      test_mapping_changes: testMappingChanges
    });
  }

  return {
    status: 'AVAILABLE',
    comparable: true,
    reason: null,
    compatibility: {
      app_commit_a: qualityObsA.app_commit || null,
      app_commit_b: qualityObsB.app_commit || null
    },
    test_mapping_changes: testMappingChanges,
    coverage_delta: coverageDelta,
    execution_pass_rate_delta: executionPassRateDelta,
    test_health_changes: testHealthChanges,
    newly_introduced_regression_risks: regressions
  };
}

/**
 * Fetches runtime TestRun / TestExecution / CoverageRun / CoverageObservation for a snapshot
 * from Neo4j to feed compareQuality().
 */
async function loadQualityObservationsFromNeo4j(queryRunnerOrSession, { snapshotId = null, appCommit = null } = {}) {
  const runQ = async (cypher, params) => {
    if (typeof queryRunnerOrSession === 'function') return await queryRunnerOrSession(cypher, params);
    const res = await queryRunnerOrSession.run(cypher, params);
    return (res.records || []).map((rec) => {
      const row = {};
      for (const k of rec.keys || []) {
        const val = rec.get(k);
        row[k] = val && typeof val === 'object' && val.properties ? val.properties : val;
      }
      return row;
    });
  };

  let targetCommit = appCommit;
  if (!targetCommit && snapshotId) {
    const snapRows = await runQ(
      'MATCH (s:GraphSnapshot { snapshot_id: $snapshotId }) RETURN s.app_commit AS appCommit LIMIT 1',
      { snapshotId }
    );
    targetCommit = snapRows[0]?.appCommit || null;
  }

  const runRows = await runQ(`
    MATCH (tr:TestRun)
    WHERE ($snapshotId IS NOT NULL AND (tr)-[:EXECUTED_AGAINST_SNAPSHOT]->(:GraphSnapshot { snapshot_id: $snapshotId }))
       OR ($snapshotId IS NULL AND $targetCommit IS NOT NULL AND tr.app_commit = $targetCommit)
       OR ($snapshotId IS NOT NULL AND tr.snapshot_id = $snapshotId)
    RETURN tr.run_id AS run_id, tr.framework AS framework, tr.status AS status,
           tr.suite_scope AS suite_scope, tr.app_commit AS app_commit
  `, { snapshotId, targetCommit });

  const execRows = await runQ(`
    MATCH (tr:TestRun)-[:HAS_EXECUTION]->(te:TestExecution)
    WHERE tr.run_id IN $runIds
    OPTIONAL MATCH (te)-[:EXECUTED_TEST]->(tc:TestCase)
    RETURN tr.run_id AS run_id, tr.framework AS framework, tc.suite AS suite,
           coalesce(tc.canonical_id, tc.testcase_id, te.testcase_id) AS testcase_id,
           te.status AS status, te.flaky AS flaky, te.retry_count AS retry_count
  `, { runIds: runRows.map((r) => r.run_id) });

  const covRunRows = await runQ(`
    MATCH (cr:CoverageRun)
    WHERE ($snapshotId IS NOT NULL AND (cr)-[:MEASURED_FOR]->(:GraphSnapshot { snapshot_id: $snapshotId }))
       OR ($snapshotId IS NULL AND $targetCommit IS NOT NULL AND cr.app_commit = $targetCommit)
       OR ($snapshotId IS NOT NULL AND cr.snapshot_id = $snapshotId)
    RETURN cr.run_id AS run_id, cr.framework AS framework, cr.status AS status, cr.app_commit AS app_commit
  `, { snapshotId, targetCommit });

  const covObsRows = await runQ(`
    MATCH (cr:CoverageRun)-[:HAS_OBSERVATION]->(co:CoverageObservation)
    WHERE cr.run_id IN $covRunIds
    OPTIONAL MATCH (co)-[:COVERED_IN]->(m:Method)
    OPTIONAL MATCH (co)-[:COVERED_COMPONENT_IN]->(u:UIComponent)
    RETURN cr.run_id AS run_id, cr.framework AS framework,
           coalesce(m.signature, u.component_id, co.target_id, co.obs_id) AS target_id,
           co.lines_covered AS lines_covered, co.lines_total AS lines_total
  `, { covRunIds: covRunRows.map((r) => r.run_id) });

  if (runRows.length === 0 && covRunRows.length === 0) {
    return {
      status: 'UNAVAILABLE',
      reason: 'NO_RUNTIME_OBSERVATIONS_RECORDED',
      snapshot_id: snapshotId,
      app_commit: targetCommit,
      test_runs: [],
      executions: [],
      coverage_runs: [],
      coverage_observations: []
    };
  }

  return {
    status: 'AVAILABLE',
    snapshot_id: snapshotId,
    app_commit: targetCommit,
    test_runs: runRows,
    executions: execRows,
    coverage_runs: covRunRows,
    coverage_observations: covObsRows
  };
}

/**
 * Top-level snapshot comparison entry point supporting separated
 * `structural`, `quality`, or `both` comparison modes.
 */
function compareSnapshots(snapshotAOrId, snapshotBOrId, options = {}) {
  const mode = options.mode || 'both';
  const manifestA = typeof snapshotAOrId === 'string'
    ? loadManifest(snapshotAOrId, options.snapshotsDir)
    : snapshotAOrId;
  const manifestB = typeof snapshotBOrId === 'string'
    ? loadManifest(snapshotBOrId, options.snapshotsDir)
    : snapshotBOrId;

  const result = {
    mode,
    snapshot_a: manifestA?.snapshot_id || (typeof snapshotAOrId === 'string' ? snapshotAOrId : null),
    snapshot_b: manifestB?.snapshot_id || (typeof snapshotBOrId === 'string' ? snapshotBOrId : null)
  };

  if (mode === 'structural' || mode === 'both') {
    result.structural = compareStructural(manifestA, manifestB);
  }
  if (mode === 'quality' || mode === 'both') {
    result.quality = compareQuality(options.qualityA || null, options.qualityB || null, {
      ...options,
      manifestA,
      manifestB
    });
  }

  return result;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const modeIdx = args.indexOf('--mode');
  const mode = modeIdx !== -1 ? args[modeIdx + 1] : 'structural';
  const positional = args.filter((a, idx) => !a.startsWith('--') && idx !== modeIdx + 1);
  if (positional.length < 2) {
    console.error('Usage: node qkg_engine/snapshot_comparator.js <snapshotA|pathA> <snapshotB|pathB> [--mode structural|quality|both]');
    process.exit(1);
  }
  const res = compareSnapshots(positional[0], positional[1], { mode });
  console.log(JSON.stringify(res, null, 2));
}

module.exports = {
  compareSnapshots,
  compareStructural,
  compareQuality,
  buildStructuralImpactExplanation,
  loadQualityObservationsFromNeo4j
};
