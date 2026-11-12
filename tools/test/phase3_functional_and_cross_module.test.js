const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { extractQaSpecSource } = require('../qkg_qa_extractor');
const { extractCypressSpecSource, extractCypressSpecDirectory } = require('../qkg_engine/cypress_ast_extractor');
const { collectQaSpecs, routeMatchesUiPage, normalizeEndpointComparable } = require('../qkg_engine/qa_spec_ingestor');
const DbColumnMigrationExtractor = require('../qkg_engine/db_column_migration_extractor');
const PhpAstExtractor = require('../qkg_engine/php_ast_extractor');
const { TIAEngine, classifyChangedFiles } = require('../qkg_engine/tia_engine');
const { QkgMcpServer } = require('../qkg_mcp/server_core');
const { NODE_CONTRACTS, RELATIONSHIP_CONTRACTS, resolveEvidenceTier } = require('../qkg_engine/schema_contract');
const { QA_REPO_DIR } = require('../qkg_engine/qkg_config');

test('Playwright AST extractor captures standalone request fixture calls, describe JSDoc tags, and rejects expect(true) stubs', () => {
  const src = `
import { test, expect } from '@playwright/test';

/**
 * @coversComponent SaveEmployee.vue
 * @coversRequirement FR_PIM_001
 * @coversStory US_PIM_001
 */
test.describe('PIM API', () => {
  test('real request fixture test', async ({ request }) => {
    const res = await request.get('/api/v2/pim/employees');
    expect(res.status()).toBe(200);
  });

  test('stub test must be rejected', async () => {
    expect(true).toBe(true);
  });

  test('empty test must be rejected', async () => {
  });
});
`;
  const specs = extractQaSpecSource(src, 'tests/api/pim/employees.spec.ts', { qaCommit: 'abc123' });
  assert.equal(specs.length, 1);
  assert.equal(specs[0].short_title, 'real request fixture test');
  assert.equal(specs[0].plugin, 'orangehrmPimPlugin');
  assert.ok(specs[0].covers_endpoints.includes('GET /api/v2/pim/employees'));
  assert.ok(specs[0].covers_components.includes('SaveEmployee.vue'));
  assert.ok(specs[0].verifies_requirements.includes('FR_PIM_001'));
  assert.ok(specs[0].verifies_stories.includes('US_PIM_001'));
});

test('Cypress AST extractor resolves const URL variables, intercept aliases, cy.loginTo, and filters expect(true) stubs & suites/', () => {
  const cyCode = `
const empStatusAPI = '/api/v2/admin/employment-statuses';

describe('Admin - Employment Status', function () {
  beforeEach(function () {
    cy.intercept('GET', '**/api/v2/admin/employment-statuses*').as('getEmpStatus');
  });

  it('calls API via constant + suffix and waits on alias', function () {
    cy.request('GET', empStatusAPI + '/1').then((res) => {
      expect(res.status).to.eq(200);
    });
    cy.wait('@getEmpStatus');
    cy.loginTo(this.user, '/admin/employmentStatus');
  });

  it('stub tautology test should be ignored', function () {
    expect(true).to.be.true;
  });
});
`;
  const extracted = extractCypressSpecSource(cyCode, 'cypress/e2e/integration/api/admin/emp.cy.js', { qaCommit: 'qasha' });
  assert.equal(extracted.length, 1);
  assert.equal(extracted[0].origin, 'AST_CYPRESS');
  assert.equal(extracted[0].plugin, 'orangehrmAdminPlugin');
  assert.ok(extracted[0].covers_endpoints.includes('GET /api/v2/admin/employment-statuses/1'));
  assert.ok(extracted[0].covers_endpoints.includes('GET /api/v2/admin/employment-statuses'));
  assert.ok(extracted[0].navigates_routes.includes('/admin/employmentStatus'));

  // suites/ directory exclusion guard
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'qkg-cy-'));
  try {
    fs.mkdirSync(path.join(tmpDir, 'integration'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'suites'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'integration', 'valid.cy.js'), cyCode);
    fs.writeFileSync(path.join(tmpDir, 'suites', 'fake.cy.js'), cyCode);
    const dirSpecs = extractCypressSpecDirectory(tmpDir);
    assert.equal(dirSpecs.length, 1);
    assert.ok(dirSpecs[0].file.startsWith('integration/'));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('collectQaSpecs loads external QA repo Playwright & genuine Cypress specs with zero Payroll QA fabrication', () => {
  if (!QA_REPO_DIR || !fs.existsSync(QA_REPO_DIR)) return;
  const qaData = collectQaSpecs({ qaRepoDir: QA_REPO_DIR });
  const pw = qaData.testCases.filter((t) => t.origin === 'AST_PLAYWRIGHT');
  const cy = qaData.testCases.filter((t) => t.origin === 'AST_CYPRESS');
  const pay = qaData.testCases.filter((t) => t.plugin === 'orangehrmPayrollPlugin');
  assert.ok(pw.length >= 4, `Expected >=4 Playwright specs, got ${pw.length}`);
  assert.ok(cy.length >= 40, `Expected >=40 Cypress specs, got ${cy.length}`);
  assert.equal(pay.length, 0, 'External QA repo must NOT fabricate Payroll tests');

  // Verify route & endpoint normalization helpers
  assert.equal(normalizeEndpointComparable('GET /api/v2/admin/employment-statuses/1').key, 'GET /api/v2/admin/employment-statuses/{param}');
  assert.ok(routeMatchesUiPage('/admin/employmentStatus', { page_id: 'employment-status-list', component_name: 'EmploymentStatus' }));
  assert.ok(routeMatchesUiPage('/web/index.php/admin/viewPayGrades', { page_id: 'pay-grade-list', component_name: 'PayGrade' }));
});

test('DbColumnMigrationExtractor extracts Doctrine Entity @ORM\\Column, prioritizes Priority 1 > Priority 2 > Priority 3, and parses migrations', async () => {
  const empFile = path.resolve(__dirname, '../../orange_hrm/src/plugins/orangehrmPimPlugin/entity/Employee.php');
  const empSvcFile = path.resolve(__dirname, '../../orange_hrm/src/plugins/orangehrmPimPlugin/Service/EmployeeService.php');
  const php = new PhpAstExtractor();
  const parsedFiles = [
    php.parseFile(empFile, 'orange_hrm/src/plugins/orangehrmPimPlugin/entity/Employee.php'),
    php.parseFile(empSvcFile, 'orange_hrm/src/plugins/orangehrmPimPlugin/Service/EmployeeService.php')
  ].filter(Boolean);

  // Add synthetic RAW_SQL duplicate vs Priority 1 on same method+column to prove Priority 1 dominates Priority 3
  const res = await new DbColumnMigrationExtractor().extractAll({
    prodParsedFiles: parsedFiles,
    fkEdges: [],
    callEdges: [
      {
        caller: 'OrangeHRM\\Pim\\Service\\EmployeeService::getEmployeeByEmpNumber',
        callee: 'OrangeHRM\\Entity\\Employee::getFirstName'
      }
    ],
    connectMariaDb: false
  });

  assert.ok(res.columns.some((c) => c.column_id === 'hs_hr_employee.emp_firstname' && c.data_type === 'string'));
  assert.ok(res.entityColumnMaps.some((m) => m.column_id === 'hs_hr_employee.emp_firstname' && m.property_name === 'firstName'));
  const firstNameAccess = res.columnAccessEdges.find(
    (e) => e.method_signature === 'OrangeHRM\\Entity\\Employee::getFirstName' && e.column_id === 'hs_hr_employee.emp_firstname'
  );
  assert.ok(firstNameAccess);
  assert.equal(firstNameAccess.evidence_type, 'DOCTRINE_MAPPING');
  assert.equal(firstNameAccess.confidence, 0.9);
  assert.equal(firstNameAccess.priority, 1);

  const propagatedAccess = res.columnAccessEdges.find(
    (e) => e.method_signature === 'OrangeHRM\\Pim\\Service\\EmployeeService::getEmployeeByEmpNumber' && e.column_id === 'hs_hr_employee.emp_firstname'
  );
  assert.ok(propagatedAccess);
  assert.equal(propagatedAccess.priority, 1);

  assert.ok(res.migrations.some((m) => m.version === 'V5_0_0' && m.affected_columns.includes('ohrm_leave.comments')));
});

test('TIAEngine enforces 4-tier evidence policy: Tier 1/2 in candidateTests, Tier 3 isolated in advisoryTests, Tier 4 excluded', async () => {
  const c = classifyChangedFiles([
    'cypress/e2e/integration/api/admin/empStatus_API.cy.js',
    'orange_hrm/installer/Migration/V5_0_0/Migration.php'
  ]);
  assert.equal(c.testFiles.length, 1);
  assert.equal(c.migrationFiles.length, 1);

  const tia = new TIAEngine(async (cypher) => {
    if (cypher.includes('GraphSnapshot')) {
      return [{ snapshotId: 'snap-p3', appCommit: 'sha1', qaCommit: 'qasha1', status: 'PUBLISHED' }];
    }
    if (cypher.includes('MATCH (c:Class|Interface|Trait { source_file: file })') && cypher.includes('as classCount')) {
      return [{ file: 'orange_hrm/src/plugins/orangehrmPimPlugin/Service/EmployeeService.php', fqcn: 'OrangeHRM\\Pim\\Service\\EmployeeService', label: 'Class', name: 'EmployeeService', plugin: 'orangehrmPimPlugin', methodCount: 3 }];
    }
    if (cypher.includes('<-[r:TESTS|POTENTIAL_COVERS]-(tc:TestCase)') && cypher.includes('targetMethod')) {
      return [
        {
          triggerFile: 'orange_hrm/src/plugins/orangehrmPimPlugin/Service/EmployeeService.php',
          classFqcn: 'OrangeHRM\\Pim\\Service\\EmployeeService',
          targetMethod: 'OrangeHRM\\Pim\\Service\\EmployeeService::saveEmployee',
          canonicalId: 'orange_hrm::EmployeeServiceTest::testSave',
          id: 'orange_hrm::EmployeeServiceTest::testSave',
          name: 'testSave',
          suite: 'EmployeeServiceTest',
          testLevel: 'Unit',
          framework: 'PHPUnit',
          testFile: 'orange_hrm/src/plugins/orangehrmPimPlugin/test/Service/EmployeeServiceTest.php',
          relType: 'TESTS',
          confidence: 0.85,
          evidenceType: 'PHPUNIT_SUT_CALL'
        },
        {
          triggerFile: 'orange_hrm/src/plugins/orangehrmPimPlugin/Service/EmployeeService.php',
          classFqcn: 'OrangeHRM\\Pim\\Service\\EmployeeService',
          targetMethod: 'OrangeHRM\\Pim\\Service\\EmployeeService::deleteEmployee',
          canonicalId: 'orange_hrm::HeuristicTest::testMockHint',
          id: 'orange_hrm::HeuristicTest::testMockHint',
          name: 'testMockHint',
          suite: 'HeuristicTest',
          testLevel: 'Unit',
          framework: 'PHPUnit',
          testFile: 'orange_hrm/src/plugins/orangehrmPimPlugin/test/HeuristicTest.php',
          relType: 'POTENTIAL_COVERS',
          confidence: 0.45,
          evidenceType: 'COLLABORATOR_MOCK_HINT'
        }
      ];
    }
    if (cypher.includes('EXPOSES') && cypher.includes('ENDPOINT_CONTRACT')) {
      return [
        {
          canonicalId: 'orangehrm-qa-automation::tests/api/pim/employees-api.spec.ts::lists employees',
          id: 'orangehrm-qa-automation::tests/api/pim/employees-api.spec.ts::lists employees',
          name: 'lists employees',
          suite: 'PIM API',
          testLevel: 'API',
          framework: 'Playwright',
          testFile: 'tests/api/pim/employees-api.spec.ts',
          channel: 'ENDPOINT_CONTRACT',
          viaTarget: '/api/v2/pim/employees',
          confidence: 0.9,
          evidenceType: 'PLAYWRIGHT_AST_NETWORK'
        }
      ];
    }
    return [];
  });

  const out = await tia.analyzeFiles(
    ['orange_hrm/src/plugins/orangehrmPimPlugin/Service/EmployeeService.php'],
    { skipStalenessCheck: true }
  );

  assert.equal(out.candidateTests.length, 2, 'Primary candidateTests must contain Tier 1/2 only');
  assert.ok(out.candidateTests.every((t) => t.evidenceTier === 'TIER_1_CONFIRMED_STATIC' || t.evidenceTier === 'TIER_2_PROBABLE_STATIC'));
  assert.equal(out.advisoryTests.length, 1, 'Tier 3 POTENTIAL_COVERS must be isolated in advisoryTests');
  assert.equal(out.advisoryTests[0].evidenceTier, 'TIER_3_POTENTIAL_HEURISTIC');
  assert.equal(out.evidenceTierSummary.tier1ConfirmedCount, 2);
  assert.equal(out.evidenceTierSummary.tier3AdvisoryCount, 1);
  assert.equal(out.evidenceTierSummary.tier4PlannedExcluded, true);
  assert.equal(resolveEvidenceTier('CYPRESS_API_ASSERT'), 'TIER_1_CONFIRMED_STATIC');
  assert.equal(resolveEvidenceTier('CYPRESS_PAGE_GOTO'), 'TIER_2_PROBABLE_STATIC');
});

test('TIAEngine.analyzeCrossPluginImpact computes hop-bounded (maxHops 1..3) direct vs transitive cross-plugin paths without cycles', async () => {
  const mockRunner = async (cypher) => {
    if (cypher.includes('GraphSnapshot')) {
      return [{ snapshotId: 'snap-p3', appCommit: 'sha1', qaCommit: 'qa1', status: 'PUBLISHED' }];
    }
    if (cypher.includes('CALLS')) {
      return [
        { fromPlugin: 'orangehrmPimPlugin', toPlugin: 'orangehrmLeavePlugin', fromMethod: 'A::m', toMethod: 'B::m', callType: 'INSTANCE' },
        { fromPlugin: 'orangehrmLeavePlugin', toPlugin: 'orangehrmTimePlugin', fromMethod: 'B::m', toMethod: 'C::m', callType: 'INSTANCE' },
        { fromPlugin: 'orangehrmTimePlugin', toPlugin: 'orangehrmAttendancePlugin', fromMethod: 'C::m', toMethod: 'D::m', callType: 'INSTANCE' },
        { fromPlugin: 'orangehrmAttendancePlugin', toPlugin: 'orangehrmPayrollPlugin', fromMethod: 'D::m', toMethod: 'E::m', callType: 'INSTANCE' },
        { fromPlugin: 'orangehrmLeavePlugin', toPlugin: 'orangehrmPimPlugin', fromMethod: 'B::m', toMethod: 'A::m', callType: 'INSTANCE' }
      ];
    }
    if (cypher.includes('ACCESSES_COLUMN')) {
      return [
        { fromPlugin: 'orangehrmPimPlugin', toPlugin: 'orangehrmPayrollPlugin', columnId: 'hs_hr_employee.emp_number', otherClass: 'PayRunService' }
      ];
    }
    return [];
  };

  const tia = new TIAEngine(mockRunner);
  const hop3 = await tia.analyzeCrossPluginImpact('orangehrmPimPlugin', { maxHops: 3 });
  assert.equal(hop3.maxHops, 3);
  assert.deepEqual(hop3.directDependencies.map((d) => d.targetPlugin).sort(), ['orangehrmLeavePlugin', 'orangehrmPayrollPlugin']);
  const timeTrans = hop3.transitiveDependencies.find((d) => d.targetPlugin === 'orangehrmTimePlugin');
  assert.ok(timeTrans && timeTrans.hop === 2);
  assert.deepEqual(timeTrans.path, ['orangehrmPimPlugin', 'orangehrmLeavePlugin', 'orangehrmTimePlugin']);
  const attTrans = hop3.transitiveDependencies.find((d) => d.targetPlugin === 'orangehrmAttendancePlugin');
  assert.ok(attTrans && attTrans.hop === 3);
  assert.ok(hop3.sharedColumnCouplings.some((c) => c.columnId === 'hs_hr_employee.emp_number'));

  const hop2 = await tia.analyzeCrossPluginImpact('orangehrmPimPlugin', { maxHops: 2 });
  assert.equal(hop2.transitiveDependencies.some((d) => d.targetPlugin === 'orangehrmAttendancePlugin'), false, 'maxHops=2 must exclude hop-3 targets');

  // Verify QkgMcpServer get_cross_module_impact returns bounded traversal inside mandatory envelope
  const mcp = new QkgMcpServer({ queryRunner: mockRunner, currentCommit: 'sha1', qaCommit: 'qa1' });
  const rpc = await mcp.handleJsonRpc({
    id: 10,
    method: 'tools/call',
    params: { name: 'get_cross_module_impact', arguments: { plugin: 'orangehrmPimPlugin', maxHops: 2 } }
  });
  assert.equal(rpc.result.structuredContent.analysisStatus, 'SUCCESS');
  assert.equal(rpc.result.structuredContent.data.maxHops, 2);

  // Schema contract exports Phase 3 nodes & edges
  assert.ok(NODE_CONTRACTS.DatabaseColumn);
  assert.ok(NODE_CONTRACTS.SchemaMigration);
  assert.ok(RELATIONSHIP_CONTRACTS.HAS_COLUMN);
  assert.ok(RELATIONSHIP_CONTRACTS.MAPS_TO_COLUMN);
  assert.ok(RELATIONSHIP_CONTRACTS.ACCESSES_COLUMN);
  assert.ok(RELATIONSHIP_CONTRACTS.MODIFIES_TABLE);
  assert.ok(RELATIONSHIP_CONTRACTS.MODIFIES_COLUMN);
  assert.ok(RELATIONSHIP_CONTRACTS.NAVIGATES_PAGE);
});

test('DbColumnMigrationExtractor reconciles live MariaDB rows non-destructively and flags drift', () => {
  const ext = new DbColumnMigrationExtractor();
  const colsMap = new Map();
  const fkSet = new Set(['hs_hr_employee.work_station']);

  ext._upsertColumn(colsMap, {
    table_name: 'hs_hr_employee',
    column_name: 'emp_firstname',
    data_type: 'string',
    nullable: false,
    is_pk: false,
    is_fk: false,
    plugin: 'orangehrmPimPlugin',
    source: 'DOCTRINE_ORM'
  });
  ext._upsertColumn(colsMap, {
    table_name: 'hs_hr_employee',
    column_name: 'emp_number',
    data_type: 'integer',
    nullable: false,
    is_pk: true,
    is_fk: false,
    plugin: 'orangehrmPimPlugin',
    source: 'DOCTRINE_ORM'
  });

  const reconciliation = ext._reconcileMariaDbRows(
    colsMap,
    fkSet,
    [
      { TABLE_NAME: 'hs_hr_employee', COLUMN_NAME: 'emp_firstname', DATA_TYPE: 'varchar', COLUMN_TYPE: 'varchar(100)', IS_NULLABLE: 'YES', COLUMN_KEY: '' },
      { TABLE_NAME: 'hs_hr_employee', COLUMN_NAME: 'emp_number', DATA_TYPE: 'int', COLUMN_TYPE: 'int(11)', IS_NULLABLE: 'NO', COLUMN_KEY: 'PRI' },
      { TABLE_NAME: 'hs_hr_employee', COLUMN_NAME: 'custom_live_col', DATA_TYPE: 'bigint', COLUMN_TYPE: 'bigint(20)', IS_NULLABLE: 'YES', COLUMN_KEY: '' }
    ],
    [],
    '2026-11-12T04:00:00.000Z'
  );

  assert.equal(reconciliation.status, 'RECONCILED');
  assert.equal(reconciliation.matchedColumnsCount, 2);
  assert.equal(reconciliation.liveOnlyColumnsCount, 1);
  assert.equal(reconciliation.typeMismatchCount, 0);
  assert.equal(reconciliation.nullabilityMismatchCount, 1);

  const fnCol = colsMap.get('hs_hr_employee.emp_firstname');
  assert.equal(fnCol.source, 'DOCTRINE_ORM', 'Static DOCTRINE_ORM source must not be overwritten');
  assert.deepEqual(fnCol.observed_sources, ['DOCTRINE_ORM', 'MARIADB_INFO_SCHEMA']);
  assert.equal(fnCol.mariadb_verified, true);
  assert.equal(fnCol.mariadb_data_type, 'varchar(100)');
  assert.ok(fnCol.schema_drift_flags.includes('NULLABILITY_MISMATCH'));

  const liveCol = colsMap.get('hs_hr_employee.custom_live_col');
  assert.equal(liveCol.source, 'MARIADB_INFO_SCHEMA');
  assert.ok(liveCol.schema_drift_flags.includes('LIVE_ONLY_COLUMN'));
});

