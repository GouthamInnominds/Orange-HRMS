/**
 * QKG-15 Historical & Multi-Plugin TIA Replay Benchmark Gate (Phase 4D / Check #26)
 *
 * Formal Definitions:
 *   - Mapping Tier (test-to-target evidence strength):
 *       TIER_1_CONFIRMED_STATIC : @covers, MODIFIED_TEST_FILE, PHPUNIT_API_INTEGRATION,
 *                                 PHPUNIT_API_UNIT_CALL, PHPUNIT_SUT_CALL,
 *                                 ENDPOINT_INTEGRATION_ASSERT, PLAYWRIGHT_AST_NETWORK,
 *                                 CYPRESS_API_ASSERT, CYPRESS_PAGE_GOTO, JEST_IMPORT_TRACE
 *       TIER_2_PROBABLE_STATIC  : AST_METHOD_CALL, VUE_AST_HTTP, PLAYWRIGHT_GOTO, PLAYWRIGHT_TAG,
 *                                 CYPRESS_TAG
 *       TIER_3_POTENTIAL_HEURISTIC : TEST_NAME_HEURISTIC, COLLABORATOR_MOCK_HINT / POTENTIAL_COVERS,
 *                                 deep multi-hop heuristics (isolated in advisoryTests)
 *       TIER_4_BASELINE_BACKLOG : BASELINE_MANIFEST projections (strictly excluded from TIA)
 *
 *   - "Tier 1-2 Recall" = |found in candidateTests AND in expectedTier12Tests| / |expectedTier12Tests|
 *     (tests whether TIAEngine recovers Tier 1-2 tests across all impact channels without
 *      leaking Tier 3 heuristics or Tier 4 baseline projections into candidateTests).
 *
 * Usage:
 *   node qkg_engine/run_tia_benchmark.js --offline
 *   node qkg_engine/run_tia_benchmark.js --live [--uri bolt://localhost:7687]
 */

const fs = require('fs');
const path = require('path');
const neo4j = require('neo4j-driver');
const { extractWorkspaceSnapshot } = require('./ingest_pipeline');
const { buildManifestFromExtractedData } = require('./snapshot_manifest');
const { TIAEngine } = require('./tia_engine');

const DEFAULT_BENCHMARK_PATH = path.join(__dirname, 'validation', 'golden_pr_benchmark.json');
const DEFAULT_OUTPUT_PATH = path.join(__dirname, 'output', 'tia_benchmark_report.json');

function toNum(v, fallback = 0) {
  if (v === null || v === undefined) return fallback;
  return typeof v.toNumber === 'function' ? v.toNumber() : Number(v);
}

/**
 * Indexes a canonical manifest and answers TIAEngine Cypher queries faithfully
 * for fast deterministic offline CI replay without Neo4j.
 */
function createManifestBackedQueryRunner(manifest) {
  const entitiesByType = new Map();
  const outgoing = new Map();
  const incoming = new Map();

  for (const ent of manifest.entities || []) {
    if (!entitiesByType.has(ent.entity_type)) entitiesByType.set(ent.entity_type, []);
    entitiesByType.get(ent.entity_type).push(ent);
  }
  const entByKey = new Map(
    (manifest.entities || []).map((e) => [`${e.entity_type}::${e.canonical_id}`, e])
  );

  for (const rel of manifest.relationships || []) {
    const srcK = `${rel.source_type}::${rel.source_id}`;
    const dstK = `${rel.target_type}::${rel.target_id}`;
    if (!outgoing.has(srcK)) outgoing.set(srcK, []);
    outgoing.get(srcK).push(rel);
    if (!incoming.has(dstK)) incoming.set(dstK, []);
    incoming.get(dstK).push(rel);
  }

  const getEnt = (type, id) => entByKey.get(`${type}::${id}`) || null;
  const out = (type, id, relTypes = null) => {
    const arr = outgoing.get(`${type}::${id}`) || [];
    return relTypes ? arr.filter((r) => relTypes.includes(r.rel_type)) : arr;
  };
  const inc = (type, id, relTypes = null) => {
    const arr = incoming.get(`${type}::${id}`) || [];
    return relTypes ? arr.filter((r) => relTypes.includes(r.rel_type)) : arr;
  };

  const phpTypes = [
    ...(entitiesByType.get('Class') || []),
    ...(entitiesByType.get('Interface') || []),
    ...(entitiesByType.get('Trait') || [])
  ];
  const phpByFile = new Map();
  for (const c of phpTypes) {
    if (!c.source_file) continue;
    if (!phpByFile.has(c.source_file)) phpByFile.set(c.source_file, []);
    phpByFile.get(c.source_file).push(c);
  }

  const uiComps = entitiesByType.get('UIComponent') || [];
  const uiPages = entitiesByType.get('UIPage') || [];
  const endpoints = entitiesByType.get('ApiEndpoint') || [];
  const testCases = entitiesByType.get('TestCase') || [];
  const migrations = entitiesByType.get('SchemaMigration') || [];

  const notBaseline = (tc) => (tc?.properties?.origin || 'AST_DEV_SUITE') !== 'BASELINE_MANIFEST';

  const toTestHitFields = (tc) => ({
    canonicalId: tc.canonical_id,
    id: tc.properties?.testcase_id || tc.canonical_id,
    name: tc.properties?.name || tc.canonical_id,
    suite: tc.properties?.suite || null,
    testLevel: tc.properties?.test_level || tc.properties?.level || 'Unit',
    framework: tc.properties?.framework || 'PHPUnit',
    testFile: tc.properties?.file || tc.source_file || null
  });

  return async function manifestQueryRunner(cypher, params = {}) {
    const files = params.files || [];

    if (cypher.includes('FROM s') || (cypher.includes('MATCH (s:GraphSnapshot)') && cypher.includes('RETURN s.snapshot_id'))) {
      return [{
        snapshotId: manifest.snapshot_id || 'offline-manifest',
        appCommit: manifest.app_commit || 'local-working-tree',
        branch: manifest.app_branch || 'v2-main',
        status: 'PUBLISHED',
        publishedAt: manifest.published_at || new Date().toISOString(),
        startedAt: manifest.created_at || new Date().toISOString()
      }];
    }

    if (cypher.includes('MATCH (c:Class|Interface|Trait { source_file: file })') && cypher.includes('methodCount')) {
      const rows = [];
      for (const file of files) {
        for (const c of phpByFile.get(file) || []) {
          const methods = out(c.entity_type, c.canonical_id, ['DECLARES']).filter((r) => r.target_type === 'Method');
          rows.push({
            file,
            fqcn: c.canonical_id,
            name: c.properties?.name || c.canonical_id,
            label: c.entity_type,
            plugin: c.plugin,
            methodCount: methods.length
          });
        }
      }
      return rows;
    }

    if (cypher.includes('OPTIONAL MATCH (ui:UIComponent { file: file })') && cypher.includes('uiList')) {
      const rows = [];
      for (const file of files) {
        const uiList = uiComps
          .filter((u) => u.source_file === file || u.properties?.file === file)
          .map((u) => ({ id: u.canonical_id, name: u.properties?.name || u.canonical_id, plugin: u.plugin }));
        const pgList = uiPages
          .filter((p) => p.properties?.source_file === file || p.properties?.target_file === file)
          .map((p) => ({ id: p.canonical_id, name: p.properties?.component_name || p.canonical_id, plugin: p.plugin }));
        if (uiList.length > 0 || pgList.length > 0) {
          rows.push({ file, uiList, pgList });
        }
      }
      return rows;
    }

    if (cypher.includes('MATCH (ep:ApiEndpoint { source_file: file })') && cypher.includes('ep.route_name')) {
      const rows = [];
      for (const file of files) {
        for (const ep of endpoints.filter((e) => e.source_file === file || e.properties?.source_file === file)) {
          rows.push({
            file,
            endpointId: ep.canonical_id,
            name: ep.properties?.route_name || ep.canonical_id,
            plugin: ep.plugin,
            path: ep.properties?.path || ''
          });
        }
      }
      return rows;
    }

    if (cypher.includes('MATCH (tc:TestCase { file: file })') && cypher.includes('testCount')) {
      const rows = [];
      for (const file of files) {
        const count = testCases.filter((tc) => notBaseline(tc) && (tc.source_file === file || tc.properties?.file === file)).length;
        if (count > 0) rows.push({ file, testCount: count });
      }
      return rows;
    }

    // Channel 1A: MODIFIED_TEST_FILE
    if (cypher.includes('MATCH (tc:TestCase { file: file })') && cypher.includes('triggerFile')) {
      const rows = [];
      for (const file of files) {
        for (const tc of testCases) {
          if (notBaseline(tc) && (tc.source_file === file || tc.properties?.file === file)) {
            rows.push({ triggerFile: file, ...toTestHitFields(tc) });
          }
        }
      }
      return rows;
    }

    // Channel 1B: DIRECT_METHOD
    if (cypher.includes('<-[r:TESTS|POTENTIAL_COVERS]-(tc:TestCase)') && cypher.includes('type(r) AS relType')) {
      const rows = [];
      for (const file of files) {
        for (const c of phpByFile.get(file) || []) {
          for (const decl of out(c.entity_type, c.canonical_id, ['DECLARES'])) {
            if (decl.target_type !== 'Method') continue;
            for (const r of inc('Method', decl.target_id, ['TESTS', 'POTENTIAL_COVERS'])) {
              const tc = getEnt('TestCase', r.source_id);
              if (!tc || !notBaseline(tc)) continue;
              rows.push({
                triggerFile: file,
                classFqcn: c.canonical_id,
                targetMethod: decl.target_id,
                ...toTestHitFields(tc),
                relType: r.rel_type,
                confidence: r.properties?.confidence ?? 0.85,
                evidenceType: r.evidence_type
              });
            }
          }
        }
      }
      return rows;
    }

    // Channel 2: TRANSITIVE_CALL_CHAIN (CALLS*1..3 upstream)
    if (cypher.includes('CALLS*1..3')) {
      const rows = [];
      for (const file of files) {
        for (const c of phpByFile.get(file) || []) {
          for (const decl of out(c.entity_type, c.canonical_id, ['DECLARES'])) {
            if (decl.target_type !== 'Method') continue;
            const targetSig = decl.target_id;
            const queue = [{ sig: targetSig, hop: 0 }];
            const visited = new Set([targetSig]);
            while (queue.length > 0 && rows.length < 250) {
              const cur = queue.shift();
              if (cur.hop >= 3) continue;
              for (const callRel of inc('Method', cur.sig, ['CALLS'])) {
                const callerSig = callRel.source_id;
                if (callerSig === targetSig) continue;
                const nextHop = cur.hop + 1;
                const callerDecl = inc('Method', callerSig, ['DECLARES'])[0];
                for (const tRel of inc('Method', callerSig, ['TESTS', 'POTENTIAL_COVERS'])) {
                  const tc = getEnt('TestCase', tRel.source_id);
                  if (!tc || !notBaseline(tc)) continue;
                  rows.push({
                    triggerFile: file,
                    changedMethod: targetSig,
                    viaMethod: callerSig,
                    callerClassFqcn: callerDecl?.source_id || null,
                    hopCount: nextHop,
                    ...toTestHitFields(tc),
                    confidence: tRel.properties?.confidence ?? 0.8,
                    evidenceType: tRel.evidence_type
                  });
                }
                if (!visited.has(callerSig)) {
                  visited.add(callerSig);
                  queue.push({ sig: callerSig, hop: nextHop });
                }
              }
            }
          }
        }
      }
      return rows.slice(0, 250);
    }

    // Channel 3A: STRUCTURAL_INHERITANCE
    if (cypher.includes('EXTENDS|IMPLEMENTS|USES_TRAIT*1..2')) {
      const noisyBases = new Set(params.noisyBases || []);
      const rows = [];
      for (const file of files) {
        for (const c of phpByFile.get(file) || []) {
          const relatedList = [];
          const q = [{ type: c.entity_type, id: c.canonical_id, hop: 0 }];
          const seenDesc = new Set([c.canonical_id]);
          while (q.length > 0) {
            const cur = q.shift();
            if (cur.hop >= 2) continue;
            for (const r of inc(cur.type, cur.id, ['EXTENDS', 'IMPLEMENTS', 'USES_TRAIT'])) {
              if (!seenDesc.has(r.source_id) && ['Class', 'Interface', 'Trait'].includes(r.source_type)) {
                seenDesc.add(r.source_id);
                relatedList.push({ type: r.source_type, id: r.source_id, direction: 'DESCENDANT' });
                q.push({ type: r.source_type, id: r.source_id, hop: cur.hop + 1 });
              }
            }
          }
          for (const r of out(c.entity_type, c.canonical_id, ['EXTENDS', 'USES_TRAIT'])) {
            if (['Class', 'Interface', 'Trait'].includes(r.target_type) && !noisyBases.has(r.target_id)) {
              relatedList.push({ type: r.target_type, id: r.target_id, direction: 'ANCESTOR' });
            }
            if (r.rel_type === 'EXTENDS' && r.target_type === 'Class' && !noisyBases.has(r.target_id)) {
              for (const sr of inc('Class', r.target_id, ['EXTENDS'])) {
                if (sr.source_type === 'Class' && sr.source_id !== c.canonical_id) {
                  relatedList.push({ type: 'Class', id: sr.source_id, direction: 'SIBLING' });
                }
              }
            }
          }
          for (const relNode of relatedList) {
            for (const decl of out(relNode.type, relNode.id, ['DECLARES'])) {
              if (decl.target_type !== 'Method') continue;
              for (const tr of inc('Method', decl.target_id, ['TESTS', 'POTENTIAL_COVERS'])) {
                const tc = getEnt('TestCase', tr.source_id);
                if (!tc || !notBaseline(tc)) continue;
                rows.push({
                  triggerFile: file,
                  relatedFqcn: relNode.id,
                  direction: relNode.direction,
                  targetMethod: decl.target_id,
                  ...toTestHitFields(tc),
                  confidence: tr.properties?.confidence ?? 0.75,
                  evidenceType: tr.evidence_type
                });
              }
            }
          }
        }
      }
      return rows.slice(0, 250);
    }

    // Channel 3B: Endpoint contracts + Symfony Events
    if (cypher.includes("'ENDPOINT_CONTRACT' AS channel") && cypher.includes("'SYMFONY_EVENT_DISPATCH' AS channel")) {
      const rows = [];
      for (const file of files) {
        for (const c of (phpByFile.get(file) || []).filter((x) => x.entity_type === 'Class')) {
          for (const exRel of out('Class', c.canonical_id, ['EXPOSES'])) {
            const ep = getEnt('ApiEndpoint', exRel.target_id);
            if (!ep) continue;
            for (const r of inc('ApiEndpoint', ep.canonical_id, ['EXECUTES_AGAINST'])) {
              const tc = getEnt('TestCase', r.source_id);
              if (!tc || !notBaseline(tc)) continue;
              rows.push({
                ...toTestHitFields(tc),
                testLevel: tc.properties?.test_level || tc.properties?.level || 'API',
                channel: 'ENDPOINT_CONTRACT',
                viaTarget: ep.properties?.path || ep.canonical_id,
                confidence: r.properties?.confidence ?? 0.9,
                evidenceType: r.evidence_type
              });
            }
          }
          for (const dispRel of out('Class', c.canonical_id, ['DISPATCHES'])) {
            for (const lisRel of inc('Event', dispRel.target_id, ['LISTENS_TO'])) {
              for (const decl of out('Class', lisRel.source_id, ['DECLARES'])) {
                if (decl.target_type !== 'Method') continue;
                for (const r of inc('Method', decl.target_id, ['TESTS'])) {
                  const tc = getEnt('TestCase', r.source_id);
                  if (!tc || !notBaseline(tc)) continue;
                  rows.push({
                    ...toTestHitFields(tc),
                    testLevel: tc.properties?.test_level || tc.properties?.level || 'Unit',
                    channel: 'SYMFONY_EVENT_DISPATCH',
                    viaTarget: dispRel.target_id,
                    confidence: r.properties?.confidence ?? 0.85,
                    evidenceType: r.evidence_type
                  });
                }
              }
            }
          }
        }
      }
      return rows;
    }

    // Channel 4: DB_TABLE_COUPLING
    if (cypher.includes('WRITES_TABLE|READS_TABLE]->(dt:DatabaseTable)')) {
      const rows = [];
      for (const file of files) {
        for (const c of (phpByFile.get(file) || []).filter((x) => x.entity_type === 'Class')) {
          for (const decl of out('Class', c.canonical_id, ['DECLARES'])) {
            if (decl.target_type !== 'Method') continue;
            for (const tRel of out('Method', decl.target_id, ['WRITES_TABLE', 'READS_TABLE'])) {
              for (const oRel of inc('DatabaseTable', tRel.target_id, ['WRITES_TABLE', 'READS_TABLE'])) {
                const otherDecl = inc('Method', oRel.source_id, ['DECLARES'])[0];
                if (!otherDecl || otherDecl.source_id === c.canonical_id) continue;
                for (const tr of inc('Method', oRel.source_id, ['TESTS'])) {
                  const tc = getEnt('TestCase', tr.source_id);
                  if (!tc || !notBaseline(tc)) continue;
                  rows.push({
                    tableName: tRel.target_id,
                    otherClassFqcn: otherDecl.source_id,
                    targetMethod: oRel.source_id,
                    ...toTestHitFields(tc),
                    confidence: tr.properties?.confidence ?? 0.8,
                    evidenceType: tr.evidence_type
                  });
                }
              }
            }
          }
        }
      }
      return rows.slice(0, 200);
    }

    // Channel 4C: DB_COLUMN_OR_MIGRATION (shared DatabaseColumn)
    if (cypher.includes('ACCESSES_COLUMN]->(dc:DatabaseColumn)')) {
      const rows = [];
      for (const file of files) {
        for (const c of (phpByFile.get(file) || []).filter((x) => x.entity_type === 'Class')) {
          for (const decl of out('Class', c.canonical_id, ['DECLARES'])) {
            if (decl.target_type !== 'Method') continue;
            for (const cRel of out('Method', decl.target_id, ['ACCESSES_COLUMN'])) {
              for (const oRel of inc('DatabaseColumn', cRel.target_id, ['ACCESSES_COLUMN'])) {
                const otherDecl = inc('Method', oRel.source_id, ['DECLARES'])[0];
                if (!otherDecl || otherDecl.source_id === c.canonical_id) continue;
                for (const tr of inc('Method', oRel.source_id, ['TESTS'])) {
                  const tc = getEnt('TestCase', tr.source_id);
                  if (!tc || !notBaseline(tc)) continue;
                  rows.push({
                    columnId: cRel.target_id,
                    otherClassFqcn: otherDecl.source_id,
                    targetMethod: oRel.source_id,
                    ...toTestHitFields(tc),
                    confidence: tr.properties?.confidence ?? 0.8,
                    evidenceType: tr.evidence_type
                  });
                }
              }
            }
          }
        }
      }
      return rows.slice(0, 200);
    }

    // Channel 4D: SchemaMigration nodes & test mapping
    if (cypher.includes('MATCH (sm:SchemaMigration { file: file })') && cypher.includes('RETURN file, sm.migration_id')) {
      const rows = [];
      for (const file of files) {
        for (const sm of migrations.filter((m) => m.source_file === file || m.properties?.file === file)) {
          rows.push({
            file,
            migrationId: sm.canonical_id,
            version: sm.properties?.version || sm.canonical_id,
            plugin: sm.plugin
          });
        }
      }
      return rows;
    }

    if (cypher.includes('MODIFIES_TABLE|MODIFIES_COLUMN]->(dbNode)')) {
      const rows = [];
      for (const file of files) {
        for (const sm of migrations.filter((m) => m.source_file === file || m.properties?.file === file)) {
          for (const mRel of out('SchemaMigration', sm.canonical_id, ['MODIFIES_TABLE', 'MODIFIES_COLUMN'])) {
            for (const acc of inc(mRel.target_type, mRel.target_id, ['READS_TABLE', 'WRITES_TABLE', 'ACCESSES_COLUMN'])) {
              const clsDecl = inc('Method', acc.source_id, ['DECLARES'])[0];
              for (const tr of inc('Method', acc.source_id, ['TESTS'])) {
                const tc = getEnt('TestCase', tr.source_id);
                if (!tc || !notBaseline(tc)) continue;
                rows.push({
                  dbTarget: mRel.target_id,
                  targetClass: clsDecl?.source_id || null,
                  ...toTestHitFields(tc),
                  confidence: tr.properties?.confidence ?? 0.85,
                  evidenceType: tr.evidence_type
                });
              }
            }
          }
        }
      }
      return rows.slice(0, 200);
    }

    // Channel 4B: Modified routes.yaml
    if (cypher.includes('MATCH (ep:ApiEndpoint { source_file: file })<-[r:EXECUTES_AGAINST]-(tc:TestCase)')) {
      const rows = [];
      for (const file of files) {
        for (const ep of endpoints.filter((e) => e.source_file === file || e.properties?.source_file === file)) {
          for (const r of inc('ApiEndpoint', ep.canonical_id, ['EXECUTES_AGAINST'])) {
            const tc = getEnt('TestCase', r.source_id);
            if (!tc || !notBaseline(tc)) continue;
            rows.push({
              path: ep.properties?.path || '',
              httpMethod: ep.properties?.http_method || 'GET',
              ...toTestHitFields(tc),
              testLevel: tc.properties?.test_level || tc.properties?.level || 'API',
              confidence: r.properties?.confidence ?? 0.9,
              evidenceType: r.evidence_type
            });
          }
        }
      }
      return rows;
    }

    // Channel 5: UI Components
    if (cypher.includes('MATCH (ui:UIComponent { file: file })') && cypher.includes("'UI_COMPONENT' AS channel")) {
      const rows = [];
      for (const file of files) {
        for (const ui of uiComps.filter((u) => u.source_file === file || u.properties?.file === file)) {
          for (const r of inc('UIComponent', ui.canonical_id, ['TESTS_COMPONENT'])) {
            const tc = getEnt('TestCase', r.source_id);
            if (!tc || !notBaseline(tc)) continue;
            rows.push({
              ...toTestHitFields(tc),
              channel: 'UI_COMPONENT',
              viaTarget: ui.properties?.name || ui.canonical_id,
              confidence: r.properties?.confidence ?? 0.9,
              evidenceType: r.evidence_type
            });
          }
          for (const pRel of inc('UIComponent', ui.canonical_id, ['RENDERS'])) {
            for (const r of inc('UIPage', pRel.source_id, ['NAVIGATES_PAGE'])) {
              const tc = getEnt('TestCase', r.source_id);
              if (!tc || !notBaseline(tc)) continue;
              rows.push({
                ...toTestHitFields(tc),
                channel: 'UI_COMPONENT',
                viaTarget: pRel.source_id,
                confidence: r.properties?.confidence ?? 0.85,
                evidenceType: r.evidence_type
              });
            }
          }
          for (const cRel of out('UIComponent', ui.canonical_id, ['CALLS_ENDPOINT'])) {
            const ep = getEnt('ApiEndpoint', cRel.target_id);
            for (const r of inc('ApiEndpoint', cRel.target_id, ['EXECUTES_AGAINST'])) {
              const tc = getEnt('TestCase', r.source_id);
              if (!tc || !notBaseline(tc)) continue;
              rows.push({
                ...toTestHitFields(tc),
                channel: 'ENDPOINT_CONTRACT',
                viaTarget: ep?.properties?.path || cRel.target_id,
                confidence: r.properties?.confidence ?? 0.85,
                evidenceType: r.evidence_type
              });
            }
          }
        }
      }
      return rows;
    }

    return [];
  };
}

function percentile(values, p) {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return Number(sorted[idx].toFixed(2));
}

function evaluateScenario(scenario, run1, run2, latencyMs) {
  const expectedTier12 = scenario.expectedTier12Tests || [];
  const expectedTier3 = scenario.expectedTier3AdvisoryTests || [];
  const acceptablePlugins = new Set(scenario.acceptablePlugins || []);
  const forbidden = new Set(scenario.forbiddenTests || []);

  const candidates = run1.impactedRegressionTests || [];
  const advisories = run1.advisoryTests || [];

  const candIds = new Set(candidates.map((t) => t.canonicalId || t.id));
  const advIds = new Set(advisories.map((t) => t.canonicalId || t.id));

  // Determinism check: identical ordered candidate + advisory IDs + channels between run1 and run2
  const sig1 = JSON.stringify({
    status: run1.analysisStatus,
    candidates: (run1.impactedRegressionTests || []).map((t) => `${t.canonicalId}|${t.impactChannel}|${t.evidenceTier}`),
    advisories: (run1.advisoryTests || []).map((t) => `${t.canonicalId}|${t.impactChannel}`)
  });
  const sig2 = JSON.stringify({
    status: run2.analysisStatus,
    candidates: (run2.impactedRegressionTests || []).map((t) => `${t.canonicalId}|${t.impactChannel}|${t.evidenceTier}`),
    advisories: (run2.advisoryTests || []).map((t) => `${t.canonicalId}|${t.impactChannel}`)
  });
  const deterministic = sig1 === sig2;

  // Explanation completeness check: every candidate test must have channel, tier, confidence, >=1 reason
  const unexplainedTests = candidates.filter((t) =>
    !t.impactChannel ||
    !t.evidenceTier ||
    !Array.isArray(t.reasons) ||
    t.reasons.length === 0
  );
  const explanationCompleteness = candidates.length === 0
    ? 1
    : Number(((candidates.length - unexplainedTests.length) / candidates.length).toFixed(4));

  // Recall on expected Tier 1-2 tests
  const matchedExpected = expectedTier12.filter((id) => candIds.has(id));
  const missedExpected = expectedTier12.filter((id) => !candIds.has(id));
  const tier12Recall = expectedTier12.length === 0
    ? 1
    : Number((matchedExpected.length / expectedTier12.length).toFixed(4));
  const falseNegativeRate = Number((1 - tier12Recall).toFixed(4));

  // Tier 3 advisory recall & leak guard
  const tier3Leaks = candidates.filter(
    (t) => t.evidenceTier === 'TIER_3_POTENTIAL_HEURISTIC' || expectedTier3.includes(t.canonicalId || t.id)
  );
  const tier4Leaks = candidates.filter(
    (t) => String(t.canonicalId || t.id || '').startsWith('baseline-v1::')
  );
  const matchedTier3 = expectedTier3.filter((id) => advIds.has(id));
  const tier3AdvisoryRecall = expectedTier3.length === 0
    ? null
    : Number((matchedTier3.length / expectedTier3.length).toFixed(4));

  // Precision check:
  // A candidate test is a false positive if:
  //   - scenario explicitly forbids it, OR
  //   - it is a Tier 3 / Tier 4 leak, OR
  //   - expectedTier12 is empty (e.g. non-code README change) yet a candidate fired, OR
  //   - acceptablePlugins is non-empty AND test's inferred plugin/suite is outside acceptablePlugins and not in expectedTier12Tests
  let falsePositives = [];
  for (const t of candidates) {
    const tid = t.canonicalId || t.id;
    const isForbidden = forbidden.has(tid);
    const isLeak = tier3Leaks.includes(t) || tier4Leaks.includes(t);
    const nonCodeFalseAlarm = expectedTier12.length === 0 && acceptablePlugins.size === 0;
    let outOfScopePlugin = false;
    if (!expectedTier12.includes(tid) && acceptablePlugins.size > 0) {
      const matchedPlugin = [...acceptablePlugins].some((pl) => {
        const shortMod = pl.replace(/^orangehrm/i, '').replace(/Plugin$/i, '').toLowerCase();
        const f = String(t.file || '').toLowerCase();
        const s = String(t.suite || '').toLowerCase();
        return f.includes(`/${pl.toLowerCase()}/`) || f.includes(`/${shortMod}/`) || s.includes(`\\${shortMod}\\`) || (pl === 'core' && f.includes('/src/client/src/core/'));
      });
      if (!matchedPlugin) outOfScopePlugin = true;
    }
    if (isForbidden || isLeak || nonCodeFalseAlarm || outOfScopePlugin) {
      falsePositives.push({ id: tid, file: t.file, channel: t.impactChannel, reason: isForbidden ? 'FORBIDDEN' : (isLeak ? 'TIER_LEAK' : (nonCodeFalseAlarm ? 'NON_CODE_FALSE_POSITIVE' : 'OUT_OF_SCOPE_PLUGIN')) });
    }
  }
  const precision = candidates.length === 0
    ? (expectedTier12.length === 0 ? 1 : 0)
    : Number(((candidates.length - falsePositives.length) / candidates.length).toFixed(4));

  return {
    id: scenario.id,
    title: scenario.title,
    category: scenario.category,
    plugin: scenario.plugin,
    change_type: scenario.change_type,
    git_commit: scenario.git_commit || null,
    analysis_status: run1.analysisStatus,
    latency_ms: Number(latencyMs.toFixed(2)),
    deterministic,
    explanation_completeness: explanationCompleteness,
    expected_tier12_count: expectedTier12.length,
    matched_tier12_count: matchedExpected.length,
    missed_expected_tests: missedExpected,
    candidate_count: candidates.length,
    advisory_count: advisories.length,
    tier_1_2_recall: tier12Recall,
    false_negative_rate: falseNegativeRate,
    precision,
    false_positives: falsePositives,
    tier3_advisory_recall: tier3AdvisoryRecall,
    tier3_leaks: tier3Leaks.length,
    tier4_leaks: tier4Leaks.length,
    passed: deterministic &&
      explanationCompleteness === 1 &&
      tier3Leaks.length === 0 &&
      tier4Leaks.length === 0 &&
      (expectedTier12.length === 0 ? candidates.length === 0 : tier12Recall >= 0.85) &&
      falsePositives.length === 0
  };
}

/**
 * Executes all QKG-15 scenarios through TIAEngine and computes aggregate + per-category metrics.
 */
async function runTiaBenchmark({
  mode = 'offline',
  benchmarkPath = DEFAULT_BENCHMARK_PATH,
  outputPath = DEFAULT_OUTPUT_PATH,
  uri = process.env.NEO4J_URI || 'bolt://localhost:7687',
  user = process.env.NEO4J_USER || 'neo4j',
  password = process.env.NEO4J_PASSWORD || 'admin123',
  database = process.env.NEO4J_DATABASE || 'neo4j',
  manifest = null,
  queryRunner = null,
  writeReport = true
} = {}) {
  const benchmark = JSON.parse(fs.readFileSync(benchmarkPath, 'utf8'));
  const scenarios = benchmark.scenarios || [];
  const thresholds = benchmark.thresholds || {};

  let engine;
  let driver = null;
  let session = null;

  if (queryRunner) {
    engine = new TIAEngine(queryRunner);
  } else if (mode === 'live') {
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password), { connectionTimeout: 5000 });
    session = driver.session({ database });
    engine = new TIAEngine(async (cypher, params) => {
      const res = await session.run(cypher, params);
      return (res.records || []).map((rec) => {
        const obj = {};
        for (const k of rec.keys || []) {
          const val = rec.get(k);
          obj[k] = val && typeof val === 'object' && val.properties ? val.properties : val;
        }
        return obj;
      });
    });
  } else {
    let activeManifest = manifest;
    if (!activeManifest) {
      const data = await extractWorkspaceSnapshot({ connectMariaDb: false });
      activeManifest = buildManifestFromExtractedData(data, {
        snapshot_id: 'qkg15-offline-baseline',
        app_commit: 'local-working-tree'
      });
    }
    engine = new TIAEngine(createManifestBackedQueryRunner(activeManifest));
  }

  const results = [];
  try {
    for (const sc of scenarios) {
      const t0 = performance.now();
      const run1 = await engine.analyzeFiles(sc.changedFiles, {
        title: `${sc.id}: ${sc.title}`,
        skipStalenessCheck: true
      });
      const t1 = performance.now();
      const run2 = await engine.analyzeFiles(sc.changedFiles, {
        title: `${sc.id}: ${sc.title}`,
        skipStalenessCheck: true
      });
      results.push(evaluateScenario(sc, run1, run2, t1 - t0));
    }
  } finally {
    if (session) await session.close();
    if (driver) await driver.close();
  }

  // Aggregate metrics (weighted micro-average for recall + category breakdown)
  const totalExpected = results.reduce((acc, r) => acc + r.expected_tier12_count, 0);
  const totalMatched = results.reduce((acc, r) => acc + r.matched_tier12_count, 0);
  const totalCandidates = results.reduce((acc, r) => acc + r.candidate_count, 0);
  const totalFalsePositives = results.reduce((acc, r) => acc + r.false_positives.length, 0);
  const tier12Recall = totalExpected > 0 ? Number((totalMatched / totalExpected).toFixed(4)) : 1;
  const falseNegativeRate = Number((1 - tier12Recall).toFixed(4));
  const precision = totalCandidates > 0
    ? Number(((totalCandidates - totalFalsePositives) / totalCandidates).toFixed(4))
    : (results.every((r) => r.expected_tier12_count === 0) ? 1 : 0);
  const determinismRate = Number((results.filter((r) => r.deterministic).length / Math.max(1, results.length)).toFixed(4));
  const explanationCompleteness = Number(
    (results.reduce((a, r) => a + r.explanation_completeness, 0) / Math.max(1, results.length)).toFixed(4)
  );
  const tier3Leaks = results.reduce((a, r) => a + r.tier3_leaks, 0);
  const tier4Leaks = results.reduce((a, r) => a + r.tier4_leaks, 0);
  const latencies = results.map((r) => r.latency_ms);

  // Per-category breakdown (review requirement)
  const byCategory = {};
  for (const r of results) {
    if (!byCategory[r.category]) byCategory[r.category] = [];
    byCategory[r.category].push(r);
  }
  const categorySummary = {};
  for (const [cat, items] of Object.entries(byCategory)) {
    const exp = items.reduce((a, x) => a + x.expected_tier12_count, 0);
    const mat = items.reduce((a, x) => a + x.matched_tier12_count, 0);
    const cands = items.reduce((a, x) => a + x.candidate_count, 0);
    const fps = items.reduce((a, x) => a + x.false_positives.length, 0);
    const rec = exp > 0 ? Number((mat / exp).toFixed(4)) : 1;
    const prec = cands > 0 ? Number(((cands - fps) / cands).toFixed(4)) : 1;
    categorySummary[cat] = {
      sample_size: items.length,
      scenarios_passed: items.filter((x) => x.passed).length,
      expected_tier12_tests: exp,
      matched_tier12_tests: mat,
      tier_1_2_recall: rec,
      false_negative_rate: Number((1 - rec).toFixed(4)),
      precision: prec,
      determinism_rate: Number((items.filter((x) => x.deterministic).length / items.length).toFixed(4)),
      explanation_completeness: Number((items.reduce((a, x) => a + x.explanation_completeness, 0) / items.length).toFixed(4)),
      latency_p50_ms: percentile(items.map((x) => x.latency_ms), 50),
      latency_p95_ms: percentile(items.map((x) => x.latency_ms), 95)
    };
  }

  const gatePassed =
    results.length >= (thresholds.min_scenarios || 18) &&
    tier12Recall >= (thresholds.min_tier_1_2_recall ?? 0.9) &&
    falseNegativeRate <= (thresholds.max_false_negative_rate ?? 0.1) &&
    precision >= (thresholds.min_precision ?? 0.85) &&
    determinismRate >= (thresholds.min_determinism_rate ?? 1.0) &&
    explanationCompleteness >= (thresholds.min_explanation_completeness ?? 1.0) &&
    tier3Leaks <= (thresholds.max_tier3_leaks ?? 0) &&
    tier4Leaks <= (thresholds.max_tier4_leaks ?? 0);

  const report = {
    benchmark_id: benchmark.benchmark_id,
    benchmark_version: benchmark.benchmark_version,
    mode,
    executed_at: new Date().toISOString(),
    definition_of_tier_1_2_recall: 'Fraction of independently curated TIER_1_CONFIRMED_STATIC + TIER_2_PROBABLE_STATIC expected tests selected inside candidateTests across all impact channels, excluding TIER_3 heuristics and TIER_4 baseline projections.',
    gate_passed: gatePassed,
    thresholds,
    aggregate: {
      total_scenarios: results.length,
      scenarios_passed: results.filter((r) => r.passed).length,
      expected_tier12_tests: totalExpected,
      matched_tier12_tests: totalMatched,
      total_candidate_tests: totalCandidates,
      false_positive_count: totalFalsePositives,
      tier_1_2_recall: tier12Recall,
      false_negative_rate: falseNegativeRate,
      precision,
      determinism_rate: determinismRate,
      explanation_completeness: explanationCompleteness,
      tier3_leaks: tier3Leaks,
      tier4_leaks: tier4Leaks,
      latency_p50_ms: percentile(latencies, 50),
      latency_p95_ms: percentile(latencies, 95)
    },
    by_category: categorySummary,
    scenarios: results
  };

  if (writeReport && outputPath) {
    const outDir = path.dirname(outputPath);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
  }

  return report;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const mode = args.includes('--live') ? 'live' : 'offline';
  const uriIdx = args.indexOf('--uri');
  const uri = uriIdx !== -1 ? args[uriIdx + 1] : undefined;

  runTiaBenchmark({ mode, uri })
    .then((report) => {
      const a = report.aggregate;
      console.log(`=== ${report.benchmark_id} TIA Replay Benchmark (${report.mode}) | Gate=${report.gate_passed ? 'PASS' : 'FAIL'} ===`);
      console.log(`Scenarios: ${a.scenarios_passed}/${a.total_scenarios} | Recall(T1-T2): ${a.tier_1_2_recall} | Precision: ${a.precision} | FNR: ${a.false_negative_rate} | Determinism: ${a.determinism_rate} | Explain: ${a.explanation_completeness} | p50=${a.latency_p50_ms}ms p95=${a.latency_p95_ms}ms`);
      console.log('Per-Category Summary:');
      for (const [cat, stats] of Object.entries(report.by_category)) {
        console.log(`  - ${cat} (n=${stats.sample_size}): recall=${stats.tier_1_2_recall}, prec=${stats.precision}, fnr=${stats.false_negative_rate}, p95=${stats.latency_p95_ms}ms`);
      }
      for (const s of report.scenarios) {
        if (!s.passed) {
          console.log(`  [FAIL] ${s.id}: missed=${JSON.stringify(s.missed_expected_tests)} fp=${JSON.stringify(s.false_positives)} t3Leaks=${s.tier3_leaks}`);
        }
      }
      if (!report.gate_passed) process.exit(1);
    })
    .catch((err) => {
      console.error('[FATAL] TIA benchmark failed:', err);
      process.exit(1);
    });
}

module.exports = {
  createManifestBackedQueryRunner,
  runTiaBenchmark,
  evaluateScenario
};
