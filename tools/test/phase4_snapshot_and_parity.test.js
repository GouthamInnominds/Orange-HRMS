const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

const PhpAstExtractor = require('../qkg_engine/php_ast_extractor');
const {
  buildManifestFromExtractedData,
  writeManifestArtifact,
  loadManifest
} = require('../qkg_engine/snapshot_manifest');
const { compareSnapshots, compareStructural, compareQuality } = require('../qkg_engine/snapshot_comparator');
const { verifyParity } = require('../qkg_engine/parity_verifier');
const { runTiaBenchmark } = require('../qkg_engine/run_tia_benchmark');
const { extractWorkspaceSnapshot } = require('../qkg_engine/ingest_pipeline');

function makeFixtureExtracted({
  methods = ['save', 'delete'],
  bodySuffix = 'return 1;',
  includeExtraCall = true,
  className = 'EmpService',
  sourceFile = 'orange_hrm/src/plugins/orangehrmPimPlugin/Service/EmpService.php',
  qaTestIds = ['orangehrm-qa-automation::tests/api/pim/emp.spec.ts::Emp API > creates employee']
} = {}) {
  const fqcn = `OrangeHRM\\Pim\\Service\\${className}`;
  const methodObjs = methods.map((mName) => {
    const sig = `${fqcn}::${mName}`;
    return {
      name: mName,
      signature: sig,
      class_fqcn: fqcn,
      visibility: 'public',
      is_static: false,
      return_type: 'array',
      return_type_fqcn: null,
      source_file: sourceFile,
      signature_hash: require('crypto').createHash('sha256').update(`${sig}|public|false|array`).digest('hex'),
      body_hash: require('crypto').createHash('sha256').update(`${mName}:${bodySuffix}`).digest('hex'),
      content_fingerprint: require('crypto').createHash('sha256').update(`${sig}|${bodySuffix}`).digest('hex')
    };
  });

  const callEdges = [];
  if (includeExtraCall && methods.includes('save') && methods.includes('delete')) {
    callEdges.push({
      callerSignature: `${fqcn}::save`,
      calleeSignature: `${fqcn}::delete`,
      call_type: 'THIS_METHOD',
      confidence: 0.9,
      evidence_type: 'AST_METHOD_CALL'
    });
  }

  return {
    pluginNames: ['orangehrmPimPlugin'],
    prodParsedFiles: [
      {
        file: sourceFile,
        classes: [
          {
            fqcn,
            name: className,
            namespace: 'OrangeHRM\\Pim\\Service',
            extends_fqcn: 'OrangeHRM\\Core\\Service\\BaseService',
            implements: [],
            trait_fqcns: [],
            source_file: sourceFile,
            content_fingerprint: require('crypto').createHash('sha256').update(`${fqcn}:${methods.join(',')}`).digest('hex'),
            methods: methodObjs
          }
        ],
        interfaces: [],
        traits: []
      }
    ],
    callEdges,
    apiEndpoints: [
      {
        endpoint_id: 'POST /api/v2/pim/emp',
        http_method: 'POST',
        path: '/api/v2/pim/emp',
        route_name: 'apiv2_pim_emp_create',
        plugin: 'orangehrmPimPlugin',
        handler_class: className,
        handler_fqcn: fqcn,
        handler_method: methods[0] || 'save',
        endpoint_kind: 'REST_API',
        auth_required: true,
        source_file: 'orange_hrm/src/plugins/orangehrmPimPlugin/config/routes.yaml'
      }
    ],
    frontend: { components: [], pages: [] },
    schemaData: { tables: [], entities: [], fkEdges: [] },
    doctrineAccess: { tableAccessEdges: [] },
    dbColumnData: { columns: [], columnAccessEdges: [], migrations: [] },
    symfonyData: { diEdges: [], events: [], listenEdges: [], dispatchEdges: [], menuEdges: [] },
    baselineSpecs: {
      domains: [{ domain_id: 'DOM_PIM', name: 'PIM', plugin: 'orangehrmPimPlugin' }],
      workflows: [{ workflow_id: 'WF_PIM', name: 'Employee Lifecycle', domain_id: 'DOM_PIM', plugin: 'orangehrmPimPlugin' }],
      features: [{ feature_id: 'FT_PIM_EMP', name: 'Employee Management', workflow_id: 'WF_PIM', plugin: 'orangehrmPimPlugin' }],
      requirementGroups: [],
      requirements: [{ requirement_id: 'FR_PIM_001', title: 'Create Employee', feature_id: 'FT_PIM_001' }],
      businessRules: [],
      personas: [],
      userStories: [{ story_id: 'US_PIM_001', title: 'Create Employee Record', feature_id: 'FT_PIM_EMP', requirement_id: 'FR_PIM_001' }]
    },
    storyTargets: {
      endpointLinks: [
        { story_id: 'US_PIM_001', feature_id: 'FT_PIM_EMP', endpoint_id: 'POST /api/v2/pim/emp', raw_target: 'POST /api/v2/pim/emp' }
      ],
      uiLinks: []
    },
    documents: [],
    testLinkData: {
      suites: [],
      testCases: [
        {
          canonical_id: `orange-hrms::OrangeHRM\\Tests\\Pim\\${className}Test::testSave`,
          testcase_id: `${className}Test::testSave`,
          name: 'testSave',
          class_fqcn: `OrangeHRM\\Tests\\Pim\\${className}Test`,
          class_name: `${className}Test`,
          method_name: 'testSave',
          plugin: 'orangehrmPimPlugin',
          module: 'pim',
          suite: `${className}Test`,
          file: `orange_hrm/src/plugins/orangehrmPimPlugin/test/Service/${className}Test.php`,
          framework: 'PHPUnit',
          test_level: 'Unit',
          origin: 'AST_PHPUNIT'
        }
      ],
      testsEdges: methods.includes('save')
        ? [
            {
              canonical_id: `orange-hrms::OrangeHRM\\Tests\\Pim\\${className}Test::testSave`,
              target_method_signature: `${fqcn}::save`,
              tier: 1,
              confidence: 0.95,
              evidence_type: 'PHPUNIT_SUT_CALL',
              mapping_source: 'TEST_LINKER'
            }
          ]
        : [],
      potentialCoversEdges: [],
      executesAgainstEdges: [],
      uiComponentEdges: []
    },
    qaData: {
      suites: qaTestIds.length > 0 ? [{ suite_id: 's1', name: 'AST_PLAYWRIGHT::tests/api/pim/emp.spec.ts::Emp API', plugin: 'orangehrmPimPlugin', framework: 'Playwright', origin: 'AST_PLAYWRIGHT', repo: 'orangehrm-qa-automation', test_count: qaTestIds.length }] : [],
      testCases: qaTestIds.map((id) => ({
        canonical_id: id,
        testcase_id: id,
        title: 'Emp API > creates employee',
        short_title: 'creates employee',
        suite: 'Emp API',
        file: 'tests/api/pim/emp.spec.ts',
        framework: 'Playwright',
        origin: 'AST_PLAYWRIGHT',
        repo: 'orangehrm-qa-automation',
        plugin: 'orangehrmPimPlugin',
        covers_endpoints: ['POST /api/v2/pim/emp'],
        navigates_routes: [],
        covers_components: [],
        verifies_stories: ['US_PIM_001'],
        verifies_requirements: ['FR_PIM_001'],
        validates_rules: [],
        _suiteNodeName: 'AST_PLAYWRIGHT::tests/api/pim/emp.spec.ts::Emp API'
      })),
      qaCommit: 'abc999'
    }
  };
}

describe('Phase 4A: Deterministic Snapshot Manifests & Fingerprinting', () => {
  it('produces identical structural_digest regardless of input ordering, timestamps, snapshot IDs, or whitespace/comments', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'qkg-p4a-'));
    try {
      const f1 = path.join(tmpDir, 'A.php');
      const f2 = path.join(tmpDir, 'B.php');
      fs.writeFileSync(f1, `<?php
namespace OrangeHRM\\Sample;
class Alpha {
  public function run(int $x): int {
    return $x + 1;
  }
}
`);
      // Same AST logic, extra comments, blank lines, formatting shift
      fs.writeFileSync(f2, `<?php
namespace OrangeHRM\\Sample;

/**
 * Added documentation comment should not alter structural AST hashes.
 */
class Alpha {

  public function run(int $x) : int
  {
    // inline comment
    return $x + 1;
  }

}
`);
      const p1 = new PhpAstExtractor().parseFile(f1);
      const p2 = new PhpAstExtractor().parseFile(f2);
      assert.equal(p1.classes[0].methods[0].signature_hash, p2.classes[0].methods[0].signature_hash);
      assert.equal(p1.classes[0].methods[0].body_hash, p2.classes[0].methods[0].body_hash);
      assert.equal(p1.classes[0].content_fingerprint, p2.classes[0].content_fingerprint);

      const base = makeFixtureExtracted({ methods: ['alpha', 'beta', 'gamma'] });
      const reversed = makeFixtureExtracted({ methods: ['alpha', 'beta', 'gamma'] });
      reversed.prodParsedFiles[0].classes[0].methods.reverse();
      reversed.baselineSpecs.features.reverse();

      const m1 = buildManifestFromExtractedData(base, {
        snapshot_id: 'snap-001',
        created_at: '2026-01-01T00:00:00Z',
        published_at: '2026-01-01T00:01:00Z',
        app_commit: 'c1'
      });
      const m2 = buildManifestFromExtractedData(reversed, {
        snapshot_id: 'snap-999',
        created_at: '2026-12-31T23:59:59Z',
        published_at: '2026-12-31T23:59:59Z',
        app_commit: 'c1'
      });

      assert.equal(m1.structural_digest, m2.structural_digest);
      assert.ok(m1.structural_digest && m1.structural_digest.length === 64);

      const artifactPath = writeManifestArtifact(m1, tmpDir);
      const loaded = loadManifest('snap-001', tmpDir);
      assert.equal(loaded.structural_digest, m1.structural_digest);
      assert.ok(fs.existsSync(artifactPath));
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('catches the unchanged aggregate count trap when 10 methods are removed and 10 different methods are added', () => {
    const oldMethods = Array.from({ length: 10 }, (_, i) => `oldMethod${i}`);
    const newMethods = Array.from({ length: 10 }, (_, i) => `newMethod${i}`);
    const snapA = buildManifestFromExtractedData(makeFixtureExtracted({ methods: oldMethods }), { snapshot_id: 'snap-a' });
    const snapB = buildManifestFromExtractedData(makeFixtureExtracted({ methods: newMethods }), { snapshot_id: 'snap-b' });

    assert.equal(snapA.counts.entities_by_type.Method, snapB.counts.entities_by_type.Method);
    assert.notEqual(snapA.structural_digest, snapB.structural_digest);

    const structural = compareStructural(snapA, snapB);
    assert.equal(structural.header.digest_changed, true);
    assert.equal(structural.entity_deltas.methods.added.length, 10);
    assert.equal(structural.entity_deltas.methods.removed.length, 10);
  });
});

describe('Phase 4B: Separated Structural vs Quality compare_snapshots', () => {
  it('separates structural vs quality deltas, computes business/test impact, and returns UNAVAILABLE for incompatible/missing quality runs', () => {
    const mA = buildManifestFromExtractedData(
      makeFixtureExtracted({ methods: ['save', 'legacyHelper'], bodySuffix: 'v1' }),
      { snapshot_id: 'cmp-a', app_commit: 'aaa111' }
    );
    const mB = buildManifestFromExtractedData(
      makeFixtureExtracted({ methods: ['save', 'newEndpointHelper'], bodySuffix: 'v2' }),
      { snapshot_id: 'cmp-b', app_commit: 'bbb222' }
    );

    const structOnly = compareSnapshots(mA, mB, { mode: 'structural' });
    assert.equal(structOnly.quality, undefined);
    assert.equal(structOnly.structural.status, 'AVAILABLE');
    assert.equal(structOnly.structural.entity_deltas.methods.modified.length, 1);
    assert.equal(structOnly.structural.entity_deltas.methods.modified[0].change_kind, 'body_only_changed');
    assert.ok(structOnly.structural.impact_explanation.affected_stories.some((s) => s.story_id === 'US_PIM_001'));
    assert.ok(structOnly.structural.impact_explanation.affected_tests.some((t) => t.canonical_id.includes('EmpServiceTest::testSave')));
    assert.ok(structOnly.structural.impact_explanation.newly_uncovered_functionality.some((u) => u.canonical_id.endsWith('::newEndpointHelper')));

    // Quality guardrails: missing quality observations must report UNAVAILABLE (never 0)
    const missingQuality = compareSnapshots(mA, mB, { mode: 'quality' });
    assert.equal(missingQuality.structural, undefined);
    assert.equal(missingQuality.quality.status, 'UNAVAILABLE');
    assert.equal(missingQuality.quality.comparable, false);
    assert.equal(missingQuality.quality.coverage_delta, null);
    assert.equal(missingQuality.quality.execution_pass_rate_delta, null);

    // Incompatible framework / suite scope must report UNAVAILABLE
    const incompQuality = compareQuality(
      {
        status: 'AVAILABLE',
        app_commit: 'aaa111',
        test_runs: [{ run_id: 'r1', framework: 'Playwright', suite_scope: 'smoke', status: 'COMPLETED' }],
        executions: [{ run_id: 'r1', framework: 'Playwright', suite: 'smoke', testcase_id: 't1', status: 'PASSED' }],
        coverage_runs: [],
        coverage_observations: []
      },
      {
        status: 'AVAILABLE',
        app_commit: 'bbb222',
        test_runs: [{ run_id: 'r2', framework: 'Cypress', suite_scope: 'regression', status: 'COMPLETED' }],
        executions: [{ run_id: 'r2', framework: 'Cypress', suite: 'regression', testcase_id: 't2', status: 'PASSED' }],
        coverage_runs: [],
        coverage_observations: []
      }
    );
    assert.equal(incompQuality.status, 'UNAVAILABLE');
    assert.equal(incompQuality.reason, 'INCOMPATIBLE_SUITE_SCOPE_OR_FRAMEWORK');

    // Comparable quality pair reports exact pass rate, coverage drop, new failure, and flake delta
    const validQuality = compareQuality(
      {
        status: 'AVAILABLE',
        app_commit: 'aaa111',
        test_runs: [{ run_id: 'r1', framework: 'PHPUnit', suite_scope: 'unit', status: 'COMPLETED' }],
        executions: [
          { run_id: 'r1', framework: 'PHPUnit', suite: 'unit', testcase_id: 't1', status: 'PASSED', flaky: false, retry_count: 0 },
          { run_id: 'r1', framework: 'PHPUnit', suite: 'unit', testcase_id: 't2', status: 'PASSED', flaky: false, retry_count: 0 }
        ],
        coverage_runs: [{ run_id: 'c1', framework: 'PHPUnit', status: 'COMPLETED' }],
        coverage_observations: [{ run_id: 'c1', framework: 'PHPUnit', target_id: 'EmpService::save', lines_covered: 18, lines_total: 20 }]
      },
      {
        status: 'AVAILABLE',
        app_commit: 'bbb222',
        test_runs: [{ run_id: 'r2', framework: 'PHPUnit', suite_scope: 'unit', status: 'COMPLETED' }],
        executions: [
          { run_id: 'r2', framework: 'PHPUnit', suite: 'unit', testcase_id: 't1', status: 'PASSED', flaky: false, retry_count: 0 },
          { run_id: 'r2', framework: 'PHPUnit', suite: 'unit', testcase_id: 't2', status: 'FAILED', flaky: true, retry_count: 1 }
        ],
        coverage_runs: [{ run_id: 'c2', framework: 'PHPUnit', status: 'COMPLETED' }],
        coverage_observations: [{ run_id: 'c2', framework: 'PHPUnit', target_id: 'EmpService::save', lines_covered: 14, lines_total: 20 }]
      },
      { manifestA: mA, manifestB: mB }
    );
    assert.equal(validQuality.status, 'AVAILABLE');
    assert.equal(validQuality.execution_pass_rate_delta.pass_rate_before_pct, 100);
    assert.equal(validQuality.execution_pass_rate_delta.pass_rate_after_pct, 50);
    assert.equal(validQuality.execution_pass_rate_delta.delta_pct, -50);
    assert.equal(validQuality.execution_pass_rate_delta.new_failing_tests.length, 1);
    assert.equal(validQuality.test_health_changes.newly_flaky_tests.length, 1);
    assert.equal(validQuality.coverage_delta.delta_pct, -20);
    assert.equal(validQuality.newly_introduced_regression_risks.length, 2);
  });
});

describe('Phase 4C: Incremental vs Clean Rebuild Parity Verifier', () => {
  it('achieves LogicalDiff == 0 across deletion, rename, moved file, removed call edge, and removed QA test, while catching deliberate stale leaks', () => {
    // Target commit B state after: method 'delete' deleted, class renamed EmpService->EmployeeManager,
    // file moved, CALLS edge removed, and QA test removed.
    const cleanDataB = makeFixtureExtracted({
      methods: ['save'],
      includeExtraCall: false,
      className: 'EmployeeManager',
      sourceFile: 'orange_hrm/src/plugins/orangehrmPimPlugin/Service/Moved/EmployeeManager.php',
      qaTestIds: []
    });
    const cleanManifestB = buildManifestFromExtractedData(cleanDataB, {
      snapshot_id: 'clean-B',
      app_commit: 'commit-b'
    });

    // Properly synced incremental manifest B1 from A -> B has identical logical state (different snapshot_id/timestamps)
    const incManifestB1 = buildManifestFromExtractedData(cleanDataB, {
      snapshot_id: 'inc-B1',
      app_commit: 'commit-b',
      created_at: '2026-11-12T10:00:00Z'
    });

    const passParity = verifyParity(incManifestB1, cleanManifestB, {
      expectedRemovedIds: [
        'OrangeHRM\\Pim\\Service\\EmpService',
        'OrangeHRM\\Pim\\Service\\EmpService::delete',
        'orangehrm-qa-automation::tests/api/pim/emp.spec.ts::Emp API > creates employee'
      ],
      expectedRemovedRelKeys: [
        'Method:OrangeHRM\\Pim\\Service\\EmpService::save|CALLS[THIS_METHOD]|Method:OrangeHRM\\Pim\\Service\\EmpService::delete'
      ],
      expectedAddedIds: [
        'OrangeHRM\\Pim\\Service\\EmployeeManager',
        'OrangeHRM\\Pim\\Service\\EmployeeManager::save'
      ]
    });
    assert.equal(passParity.parity_passed, true);
    assert.equal(passParity.digest_match, true);
    assert.equal(passParity.logical_diff_count, 0);

    // Simulate a buggy incremental sync that forgot to prune the old deleted method and stale CALLS edge
    const buggyInc = JSON.parse(JSON.stringify(incManifestB1));
    const oldManifestA = buildManifestFromExtractedData(makeFixtureExtracted(), { snapshot_id: 'old-a' });
    const staleMethod = oldManifestA.entities.find((e) => e.canonical_id === 'OrangeHRM\\Pim\\Service\\EmpService::delete');
    const staleEdge = oldManifestA.relationships.find((r) => r.rel_type === 'CALLS');
    buggyInc.entities.push(staleMethod);
    buggyInc.relationships.push(staleEdge);
    buggyInc.structural_digest = 'stale-digest-mismatch';

    const failParity = verifyParity(buggyInc, cleanManifestB, {
      expectedRemovedIds: ['OrangeHRM\\Pim\\Service\\EmpService::delete'],
      expectedRemovedRelKeys: [staleEdge.canonical_key]
    });
    assert.equal(failParity.parity_passed, false);
    assert.equal(failParity.counts.stale_entities_in_incremental, 1);
    assert.equal(failParity.counts.stale_relationships_in_incremental, 1);
    assert.equal(failParity.expectation_errors.length, 2);
  });
});

describe('Phase 4D: QKG-15 Multi-Plugin Benchmark & Live Workspace Determinism', () => {
  it('passes all 21 QKG-15 replay scenarios across 8 categories and produces identical workspace structural_digest across runs', async () => {
    const workspaceRoot = path.resolve(__dirname, '..', '..');
    const data1 = await extractWorkspaceSnapshot({ workspaceRoot, connectMariaDb: false });
    const data2 = await extractWorkspaceSnapshot({ workspaceRoot, connectMariaDb: false });

    const manifest1 = buildManifestFromExtractedData(data1, { snapshot_id: 'ws-run-1', app_commit: 'head' });
    const manifest2 = buildManifestFromExtractedData(data2, { snapshot_id: 'ws-run-2', app_commit: 'head' });
    assert.equal(manifest1.structural_digest, manifest2.structural_digest);

    const report = await runTiaBenchmark({
      mode: 'offline',
      manifest: manifest1,
      writeReport: false
    });

    assert.equal(report.gate_passed, true);
    assert.equal(report.aggregate.total_scenarios, 21);
    assert.equal(report.aggregate.scenarios_passed, 21);
    assert.ok(report.aggregate.tier_1_2_recall >= 0.9);
    assert.ok(report.aggregate.precision >= 0.85);
    assert.ok(report.aggregate.false_negative_rate <= 0.1);
    assert.equal(report.aggregate.determinism_rate, 1);
    assert.equal(report.aggregate.explanation_completeness, 1);
    assert.equal(report.aggregate.tier3_leaks, 0);
    assert.equal(report.aggregate.tier4_leaks, 0);
    assert.ok(Object.keys(report.by_category).length >= 8);
  });
});
