const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const GlobalSpecExtractor = require('../qkg_engine/spec_extractor');
const { resolveRequirementAlias, normalizeParamPath } = GlobalSpecExtractor;
const {
  NODE_CONTRACTS,
  RELATIONSHIP_CONTRACTS,
  validateSchemaContract
} = require('../qkg_engine/schema_contract');
const neo4jService = require('../qe_app/services/neo4j_service');
const { MetricsService } = require('../qe_app/services/metrics_service');

test('GlobalSpecExtractor resolves requirement aliases, parameterized endpoints, UI aliases, and reports genuine misses without fabrication', () => {
  const validReqs = new Set(['FR_ADM_001', 'FR_ADM_002', 'FR_PIM_002', 'FR_LEV_003']);

  assert.equal(resolveRequirementAlias('FR_ADM_JOB_TITLE', validReqs), 'FR_ADM_001');
  assert.equal(resolveRequirementAlias('FR_AUTH_PASSWORD_POLICY', validReqs), 'FR_ADM_002');
  assert.equal(resolveRequirementAlias('FR_PIM_JOB_DETAILS_EXTRA', validReqs), 'FR_PIM_002');
  assert.equal(resolveRequirementAlias('FR_UNKNOWN_MODULE_999', validReqs), 'FR_UNKNOWN_MODULE_999');
  assert.equal(resolveRequirementAlias('', validReqs), null);

  assert.equal(normalizeParamPath('GET /api/v2/pim/employees/{empNumber}/salary-components/{id}'), 'GET /api/v2/pim/employees/{param}/salary-components/{param}');

  const extractor = new GlobalSpecExtractor(path.resolve(__dirname, '..', '..', 'OrangeHRM_Baseline_v1.0'));
  const specs = extractor.extractAllSpecifications();
  assert.ok(specs.userStories.length >= 25, 'Baseline user stories loaded');

  const resolved = extractor.resolveStoryTargets(
    [
      {
        story_id: 'US_TST_001',
        domain_id: 'DOMAIN_PIM',
        feature_id: 'FEAT_PIM_EMPLOYEE_MASTER',
        target_endpoints: [
          'GET /api/v2/pim/employees/{id}',
          'PUT /api/v2/pim/employees/{id}/contact-details',
          'POST /api/v2/nonexistent/fabricated-route'
        ],
        target_ui_components: ['EmployeeSalary.vue', 'MissingFakeWidget.vue']
      }
    ],
    [{ domain_id: 'DOMAIN_PIM', plugin: 'orangehrmPimPlugin' }],
    [
      { endpoint_id: 'GET /api/v2/pim/employees/{empNumber}' },
      { endpoint_id: 'PUT /api/v2/pim/employee/{empNumber}/contact-details' }
    ],
    [
      { component_id: 'VUE_PIM_SAVESALARYCOMPONENT', plugin: 'orangehrmPimPlugin', name: 'SaveSalaryComponent', file: 'src/SaveSalaryComponent.vue' }
    ]
  );

  assert.deepEqual(
    resolved.endpointLinks.map((l) => l.endpoint_id),
    [
      'GET /api/v2/pim/employees/{empNumber}',
      'PUT /api/v2/pim/employee/{empNumber}/contact-details'
    ]
  );
  assert.deepEqual(resolved.uiLinks.map((l) => l.component_id), ['VUE_PIM_SAVESALARYCOMPONENT']);
  assert.equal(resolved.missingTargets.length, 2, 'Unresolved endpoints & UI components must be logged cleanly instead of fabricated');
  assert.ok(resolved.missingTargets.some((m) => m.raw_target === 'POST /api/v2/nonexistent/fabricated-route'));
  assert.ok(resolved.missingTargets.some((m) => m.raw_target === 'MissingFakeWidget.vue'));
});

test('Schema contract defines mandatory provenance props, separated edge types, and detects violations', async () => {
  assert.ok(NODE_CONTRACTS.UIComponent.requiredProps.includes('snapshot_id'));
  assert.ok(NODE_CONTRACTS.TestSuite.requiredProps.includes('snapshot_id'));
  assert.ok(NODE_CONTRACTS.GraphSnapshot.requiredProps.includes('qa_commit'));
  assert.deepEqual(RELATIONSHIP_CONTRACTS.EXPOSES.allowedPairs, [['Class', 'ApiEndpoint']]);
  assert.deepEqual(RELATIONSHIP_CONTRACTS.INCLUDES_ENDPOINT.allowedPairs, [['Feature', 'ApiEndpoint']]);
  assert.deepEqual(RELATIONSHIP_CONTRACTS.HAS_EXECUTION.allowedPairs, [['TestRun', 'TestExecution']]);
  assert.deepEqual(RELATIONSHIP_CONTRACTS.EXECUTED_TEST.allowedPairs, [['TestExecution', 'TestCase']]);
  assert.deepEqual(RELATIONSHIP_CONTRACTS.EXECUTED_AGAINST_SNAPSHOT.allowedPairs, [['TestRun', 'GraphSnapshot']]);
  assert.ok(RELATIONSHIP_CONTRACTS.PLANNED_VERIFICATION);
  assert.ok(RELATIONSHIP_CONTRACTS.PLANNED_ENDPOINT_COVERAGE);

  const cleanSession = {
    async run() {
      return {
        records: [{ get: (k) => (k === 'total' ? 10 : 0) }]
      };
    }
  };
  const cleanResult = await validateSchemaContract(cleanSession);
  assert.equal(cleanResult.passed, true);
  assert.equal(cleanResult.violations.length, 0);

  const dirtySession = {
    async run(cypher) {
      if (cypher.includes('Feature)-[r:EXPOSES]->(:ApiEndpoint') || cypher.includes('Feature)-[r:EXPOSES]->(e:ApiEndpoint')) {
        return { records: [{ get: () => 4 }] };
      }
      if (cypher.includes('CONTAINS_EXECUTION|EXECUTED_IN')) {
        return { records: [{ get: () => 2 }] };
      }
      if (cypher.includes("origin: 'BASELINE_MANIFEST'")) {
        return { records: [{ get: () => 7 }] };
      }
      return { records: [{ get: (k) => (k === 'total' ? 5 : 0) }] };
    }
  };
  const dirtyResult = await validateSchemaContract(dirtySession);
  assert.equal(dirtyResult.passed, false);
  assert.ok(dirtyResult.violations.some((v) => v.kind === 'BANNED_EDGE_OVERLOAD'));
  assert.ok(dirtyResult.violations.some((v) => v.kind === 'LEGACY_EXECUTION_EDGE'));
  assert.ok(dirtyResult.violations.some((v) => v.kind === 'BASELINE_POLLUTION'));
});

test('Execution history & metrics_service enforce canonical HAS_EXECUTION/EXECUTED_TEST schema and null unmeasured coverage', async () => {
  const execSource = fs.readFileSync(
    path.resolve(__dirname, '../qkg_engine/execution_history_ingestion.js'),
    'utf8'
  );
  assert.ok(execSource.includes('HAS_EXECUTION'), 'Must use TestRun-[:HAS_EXECUTION]->TestExecution');
  assert.ok(execSource.includes('EXECUTED_TEST'), 'Must use TestExecution-[:EXECUTED_TEST]->TestCase');
  assert.ok(execSource.includes('EXECUTED_AGAINST_SNAPSHOT'), 'Must link TestRun-[:EXECUTED_AGAINST_SNAPSHOT]->GraphSnapshot');
  assert.ok(!execSource.includes('CONTAINS_EXECUTION'), 'Deprecated CONTAINS_EXECUTION must not exist');
  assert.ok(!execSource.includes('EXECUTED_IN'), 'Deprecated EXECUTED_IN must not exist');

  const origGetLatest = neo4jService.getLatestSnapshot;
  const origRunQuery = neo4jService.runQuery;
  try {
    neo4jService.getLatestSnapshot = async () => ({
      snapshotId: 'snap-123',
      appCommit: 'abc12345def6',
      qaCommit: 'qa123456',
      branch: 'v2-main',
      schemaVersion: '2.2',
      publishedAt: '2026-11-11T00:00:00Z'
    });
    neo4jService.runQuery = async (cypher) => {
      if (cypher.includes('AS codeTests')) {
        return [{ codeTests: 2998, baselineTests: 4112 }];
      }
      if (cypher.includes('AS apiTests')) {
        return [{ apiTests: 300, uiTests: 150, dbTests: 400, funcTests: 200, unitTests: 1948 }];
      }
      if (cypher.includes('AS codeTestCount')) {
        return [{ plugin: 'orangehrmPayrollPlugin', codeTestCount: 18, classCount: 44, linesCovered: 0, linesTotal: 0 }];
      }
      if (cypher.includes('FROM') || cypher.includes('MATCH (tr:TestRun)')) {
        return [];
      }
      if (cypher.includes('MATCH (cr:CoverageRun)')) {
        return [];
      }
      if (cypher.includes('AS totalRequirements')) {
        return [{ totalRequirements: 42, coveredByCodeTests: 20, coveredByPlannedBacklog: 10 }];
      }
      return [];
    };

    const metrics = await new MetricsService().getExecutiveQualityMetrics();
    assert.equal(metrics.status, 'CONNECTED');
    assert.equal(metrics.overview.qkgPlatformVersion, '2.1.0');
    assert.equal(metrics.overview.passRate, 'N/A');
    assert.equal(metrics.overview.qualityGateStatus, 'NO_CI_RUN');
    assert.equal(metrics.overview.lineCoveragePercent, null);
    assert.equal(metrics.overview.coverageStatus, 'NOT_INGESTED_YET');
    assert.equal(metrics.overview.totalVerifiedTests, 2998);
    assert.equal(metrics.overview.baselineBacklogTests, 4112);
    assert.equal(metrics.modules[0].coverage, null);
    assert.equal(metrics.modules[0].coverageMeasured, false);
    assert.equal(metrics.traceability.coveredRequirements, 20);
    assert.equal(metrics.traceability.plannedBacklogRequirements, 10);
  } finally {
    neo4jService.getLatestSnapshot = origGetLatest;
    neo4jService.runQuery = origRunQuery;
  }
});
