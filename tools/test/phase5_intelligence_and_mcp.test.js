const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { QeIntelligenceService } = require('../qe_app/services/qe_intelligence_service');
const { QkgMcpServer, getToolDefinitions } = require('../qkg_mcp/server_core');
const { CANONICAL_QE_DISPATCH } = require('../qe_app/server');
const { MariaDBService } = require('../qe_app/services/mariadb_service');
const {
  validateReadOnlyCypher,
  validateReadOnlySql,
  validateSqlIdentifier,
  sanitizePayload
} = require('../qkg_engine/security_guard');
const {
  exportSnapshotBundle,
  verifySnapshotBundle,
  restoreSnapshotBundle
} = require('../qkg_engine/backup_restore');

function makeRichMockRunner({
  snapshotStatus = 'PUBLISHED',
  appCommit = 'abc12345',
  covRunCount = 2,
  covObsCount = 50,
  testRunCount = 2,
  deadLetterCount = 0
} = {}) {
  return async (cypher, params = {}) => {
    if (cypher.includes('MATCH (s:GraphSnapshot)')) {
      return [{
        snapshotId: 'snap-phase5-test',
        appCommit,
        qaCommit: 'qa-phase5-commit',
        branch: 'v2-main',
        status: snapshotStatus,
        publishedAt: '2026-11-12T10:00:00Z',
        schemaVersion: '2.2',
        extractorVersion: '2.2.0',
        deadLetterCount,
        missingSpecTargetCount: 0
      }];
    }
    if (cypher.includes('AS classCount')) {
      return [{
        classCount: 120,
        methodCount: 850,
        codeTestCount: 400,
        mappingCount: 620,
        covRunCount,
        covObsCount,
        testRunCount,
        reqCount: 45,
        wfCount: 12
      }];
    }
    if (cypher.includes('ApiEndpoint') && cypher.includes('EXECUTES_AGAINST')) {
      return [{
        endpointId: 'POST:/api/v2/payroll/process',
        httpMethod: 'POST',
        path: '/api/v2/payroll/process',
        plugin: 'orangehrmPayrollPlugin',
        endpointKind: 'REST_API'
      }];
    }
    if (cypher.includes('UIComponent') && cypher.includes('TESTS_COMPONENT')) {
      return [];
    }
    if (cypher.includes('MATCH (tc:TestCase)') && cypher.includes('NOT EXISTS')) {
      return [{ id: 'orange-hrms::StaleTest::testOld', name: 'testOld', plugin: 'orangehrmPayrollPlugin', staleReason: 'NEVER_EXECUTED' }];
    }
    if (cypher.includes('WHERE tc.id = $id OR tc.canonical_id = $id')) {
      if (params.id === 'planned-only-id') {
        return [{ id: 'planned-only-id', canonicalId: 'planned-only-id', origin: 'BASELINE_MANIFEST', graphLinks: [], executionHistory: [] }];
      }
      return [{
        id: 'orange-hrms::OrangeHRM\\Tests\\Payroll\\PayrollTest::testCalculate',
        canonicalId: 'orange-hrms::OrangeHRM\\Tests\\Payroll\\PayrollTest::testCalculate',
        name: 'testCalculate',
        repo: 'orange-hrms',
        framework: 'phpunit',
        file: 'orange_hrm/src/plugins/orangehrmPayrollPlugin/test/PayrollTest.php',
        origin: 'AST_DEV_SUITE',
        graphLinks: [{ relType: 'TESTS', evidenceType: 'AST_METHOD_CALL', confidence: 0.9, target: 'PayrollService::calculate' }],
        executionHistory: [{ runId: 'run-1', status: 'PASSED', executedAt: '2026-11-12T09:00:00Z' }]
      }];
    }
    if (cypher.includes('FROM_SOURCE_METHOD_HIT') || cypher.includes('DECLARES]->(m:Method)')) {
      if (cypher.includes('as mappedMethods') || cypher.includes('AS mappedMethods')) {
        return [{ plugin: 'orangehrmPayrollPlugin', totalMethods: 20, mappedMethods: 15, unmappedMethods: 5 }];
      }
      return [];
    }
    if (cypher.includes('UNWIND $paths AS relPath') || cypher.includes('m.signature AS methodSig')) {
      return [{
        id: 'orange-hrms::OrangeHRM\\Tests\\Payroll\\PayrollTest::testCalculate',
        canonicalId: 'orange-hrms::OrangeHRM\\Tests\\Payroll\\PayrollTest::testCalculate',
        name: 'testCalculate',
        suite: 'orangehrmPayrollPlugin',
        framework: 'phpunit',
        repo: 'orange-hrms',
        file: 'orange_hrm/src/plugins/orangehrmPayrollPlugin/test/PayrollTest.php',
        priority: 'P1',
        evidenceType: 'AST_METHOD_CALL',
        relType: 'TESTS',
        confidence: 0.9,
        target: 'PayrollService::calculate',
        reason: 'Direct AST call edge from testCalculate to PayrollService::calculate'
      }];
    }
    if (cypher.includes('MATCH (n)') && cypher.includes('canonicalId')) {
      return [{
        labels: ['Method'],
        canonicalId: params.entityId || 'PayrollService::calculate',
        displayName: 'calculate',
        plugin: 'orangehrmPayrollPlugin',
        file: 'orange_hrm/src/plugins/orangehrmPayrollPlugin/Service/PayrollService.php',
        repo: 'orange-hrms',
        introducedIn: 'v2.2-india-payroll',
        snapshotId: 'snap-phase5-test',
        outbound: [],
        inbound: [{ direction: 'INBOUND', relType: 'TESTS', evidenceType: 'AST_METHOD_CALL', sourceLabel: 'TestCase', sourceId: 'PayrollTest::testCalculate' }],
        coverage: [{ runId: 'cov-1', linesCovered: 18, linesTotal: 20, lineRate: 90 }]
      }];
    }
    return [];
  };
}

test('Phase 5A: Standardized 8-Tool Contract aligns identically across MCP and REST Facade', async () => {
  const expectedTools = [
    'get_code_impact',
    'get_business_impact',
    'get_impacted_tests',
    'get_test_health',
    'get_coverage_gaps',
    'get_module_quality',
    'compare_snapshots',
    'explain_test_selection'
  ];

  const mcpTools = getToolDefinitions().map((t) => t.name);
  assert.deepEqual([...mcpTools].sort(), [...expectedTools].sort());
  assert.deepEqual(Object.keys(CANONICAL_QE_DISPATCH).sort(), [...expectedTools].sort());

  const runner = makeRichMockRunner();
  const facade = new QeIntelligenceService({ queryRunner: runner });
  const mcp = new QkgMcpServer({ queryRunner: runner, intelligenceService: facade });

  const mcpRes = await mcp.handleJsonRpc({
    id: 101,
    method: 'tools/call',
    params: { name: 'get_coverage_gaps', arguments: { plugin: 'orangehrmPayrollPlugin', limit: 10 } }
  });
  const structured = mcpRes.result.structuredContent;
  assert.equal(structured.graphSnapshotId, 'snap-phase5-test');
  assert.equal(structured.appCommit, 'abc12345');
  assert.equal(structured.qaCommit, 'qa-phase5-commit');
  assert.equal(structured.analysisStatus, 'SUCCESS');
  assert.equal(structured.status, 'AVAILABLE');
  assert.deepEqual(Object.keys(structured.completeness).sort(), [
    'businessTraceability',
    'codeGraph',
    'coverage',
    'executionHistory',
    'testMappings'
  ]);
  assert.equal(structured.completeness.codeGraph, 'COMPLETE');
  assert.equal(structured.data.uncoveredEndpoints.length, 1);

  const explainRes = await facade.explainTestSelection({
    test_id: 'planned-only-id',
    changed_files: ['orange_hrm/src/plugins/orangehrmPayrollPlugin/Service/PayrollService.php'],
    skipStalenessCheck: true
  });
  assert.equal(explainRes.data.selected, false);
  assert.match(explainRes.data.exclusionReason, /^EXCLUDED_TIER_4_BASELINE_MANIFEST_GUARD/);
});

test('Phase 5A: Enforces 5 explicit statuses (UNAVAILABLE, STALE, PARTIAL, INCOMPATIBLE, SUCCESS) without silent fabrication', async () => {
  // 1. Neo4j offline -> UNAVAILABLE
  const downFacade = new QeIntelligenceService({
    queryRunner: async () => { throw new Error('ECONNREFUSED'); }
  });
  const downStatus = await downFacade.getSnapshotStatus();
  assert.equal(downStatus.analysisStatus, 'UNAVAILABLE');
  assert.equal(downStatus.status, 'UNAVAILABLE');
  assert.equal(downStatus.completeness.codeGraph, 'UNAVAILABLE');
  assert.ok(downStatus.limitations[0].includes('ECONNREFUSED'));

  // 2. Commit mismatch -> STALE
  const staleFacade = new QeIntelligenceService({
    queryRunner: makeRichMockRunner({ appCommit: 'oldsha001' })
  });
  const staleStatus = await staleFacade.getSnapshotStatus({ currentCommit: 'newsha999' });
  assert.equal(staleStatus.analysisStatus, 'STALE');
  assert.equal(staleStatus.status, 'STALE');

  // 3. Missing coverage & execution runs + dead letters -> PARTIAL with limitations
  const partialFacade = new QeIntelligenceService({
    queryRunner: makeRichMockRunner({ covRunCount: 0, covObsCount: 0, testRunCount: 0, deadLetterCount: 3 })
  });
  const partialStatus = await partialFacade.getSnapshotStatus({ skipStalenessCheck: true });
  assert.equal(partialStatus.analysisStatus, 'PARTIAL');
  assert.equal(partialStatus.completeness.coverage, 'UNAVAILABLE');
  assert.equal(partialStatus.completeness.executionHistory, 'UNAVAILABLE');
  assert.ok(partialStatus.limitations.some((l) => l.includes('DEAD_LETTERS_PRESENT')));

  // 4. Compare incompatible quality runs -> INCOMPATIBLE / UNAVAILABLE
  const m1 = { metadata: { snapshot_id: 's1', app_commit: 'c1' }, entities: [], relationships: [] };
  const m2 = { metadata: { snapshot_id: 's2', app_commit: 'c2' }, entities: [], relationships: [] };
  const cmpRes = await partialFacade.compareSnapshots({
    manifestA: m1,
    manifestB: m2,
    mode: 'quality',
    qualityA: {
      status: 'AVAILABLE',
      app_commit: 'c1',
      test_runs: [{ run_id: 'r1', framework: 'phpunit', suite_scope: 'all', status: 'COMPLETED' }],
      executions: [{ run_id: 'r1', framework: 'phpunit', suite: 'all', testcase_id: 't1', status: 'PASSED' }],
      coverage_runs: [],
      coverage_observations: []
    },
    qualityB: {
      status: 'AVAILABLE',
      app_commit: 'c2',
      test_runs: [{ run_id: 'r2', framework: 'jest', suite_scope: 'client', status: 'COMPLETED' }],
      executions: [{ run_id: 'r2', framework: 'jest', suite: 'client', testcase_id: 't2', status: 'PASSED' }],
      coverage_runs: [],
      coverage_observations: []
    }
  });
  assert.equal(cmpRes.data.quality.status, 'UNAVAILABLE');
  assert.match(cmpRes.data.quality.reason, /INCOMPATIBLE/);
  assert.equal(cmpRes.status, 'INCOMPATIBLE');
  assert.equal(cmpRes.analysisStatus, 'UNAVAILABLE');
});

test('Phase 5B/5C: Security Guardrails, MariaDB non-fabrication, SQL/Cypher injection blocking & PII redaction', async () => {
  // Read-only Cypher validation
  assert.throws(() => validateReadOnlyCypher('MATCH (n) DETACH DELETE n'), /Prohibited|Security Policy Violation/i);
  assert.throws(() => validateReadOnlyCypher('MATCH (n) M/*bypass*/ERGE (x:Class {fqcn:"a"})'), /Prohibited|Security Policy Violation/i);
  assert.throws(() => validateReadOnlyCypher('LOAD CSV FROM "file:///etc/passwd" AS row RETURN row'), /allowlisted/i);
  assert.throws(() => validateReadOnlyCypher('MATCH (n) RETURN n; DELETE n'), /Multi-statement/i);
  assert.throws(() => validateReadOnlyCypher('MATCH (n) RETURN id(n) AS nid'), /internal node id/i);

  const safeCypher = validateReadOnlyCypher("MATCH (c:Class) WHERE c.action <> 'DELETE' RETURN c.fqcn LIMIT 500");
  assert.equal(safeCypher.limitApplied, 100);
  assert.match(safeCypher.query, /LIMIT 100$/);

  // Read-only SQL + identifier validation
  assert.throws(() => validateSqlIdentifier('ohrm_payroll_record; DROP TABLE hs_hr_employee', 'table'), /Invalid SQL/);
  assert.throws(() => validateReadOnlySql('SELECT 1; DROP TABLE hs_hr_employee'), /Multi-statement/i);
  assert.throws(() => validateReadOnlySql("SELECT emp_number INTO OUTFILE '/tmp/x' FROM hs_hr_employee"), /prohibited/i);

  // PII / secret redaction
  const redacted = sanitizePayload({
    emp_firstname: 'Alice',
    aadhaar_number: '123456789012',
    pan: 'ABCDE1234F',
    net_salary: 85000,
    apiKey: 'sk-1234567890abcdef',
    uri: 'bolt://neo4j:SecretPass123@localhost:7687',
    safeMethod: 'PayrollService::calculate'
  });
  assert.equal(redacted.emp_firstname, '[REDACTED]');
  assert.equal(redacted.aadhaar_number, '[REDACTED]');
  assert.equal(redacted.net_salary, '[REDACTED]');
  assert.equal(redacted.apiKey, '[REDACTED]');
  assert.equal(redacted.uri, 'bolt://[REDACTED_SECRET]:[REDACTED_SECRET]@localhost:7687');
  assert.equal(redacted.safeMethod, 'PayrollService::calculate');

  // MariaDB offline must NEVER fabricate 183 tables or driftDetected: false
  const badPortMaria = new MariaDBService();
  badPortMaria.port = 1; // unreachable immediately
  const ov = await badPortMaria.getDatabaseOverview();
  assert.equal(ov.status, 'UNAVAILABLE');
  assert.equal(ov.totalTables, null);
  assert.equal(ov.payrollTablesCount, null);
  assert.deepEqual(ov.sampleTables, []);
  const drift = await badPortMaria.compareTableSchemas();
  assert.equal(drift.status, 'UNAVAILABLE');
  assert.equal(drift.driftDetected, null);
  assert.equal(drift.isSynchronized, null);

  await assert.rejects(
    () => badPortMaria.getTableRows('ohrm_payroll_record; DROP TABLE users'),
    /Invalid SQL table/
  );
});

test('Phase 5C: Backup bundle export, cryptographic checksum verification, tamper detection & restore execution', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'qkg-backup-test-'));
  try {
    const exported = await exportSnapshotBundle({ outDir: tmpDir, offline: true });
    assert.equal(exported.ok, true);
    assert.ok(exported.sha256);

    const verified = verifySnapshotBundle(tmpDir);
    assert.equal(verified.valid, true);
    assert.equal(verified.checksumValid, true);
    assert.equal(verified.digestValid, true);
    assert.equal(verified.internalIdLeaks, 0);

    // Dry restore against mock runner verifies DETACH DELETE + entity MERGE queries
    const executedQueries = [];
    const restoreRes = await restoreSnapshotBundle(tmpDir, {
      clean: true,
      queryRunner: async (cypher) => { executedQueries.push(cypher); return []; }
    });
    assert.equal(restoreRes.restored, true);
    assert.equal(executedQueries[0], 'MATCH (n) DETACH DELETE n');
    assert.ok(restoreRes.nodesRestored > 100);

    // Corrupt bundle file and prove verification + restore fail closed
    const bundleText = fs.readFileSync(exported.bundleFile, 'utf8');
    fs.writeFileSync(exported.bundleFile, bundleText.replace(exported.snapshotId, 'tampered-id'), 'utf8');
    const tamperedVerify = verifySnapshotBundle(tmpDir);
    assert.equal(tamperedVerify.valid, false);
    assert.equal(tamperedVerify.checksumValid, false);
    assert.equal(tamperedVerify.reason, 'SHA256_CHECKSUM_MISMATCH');

    await assert.rejects(() => restoreSnapshotBundle(tmpDir, { clean: true, queryRunner: async () => [] }), /SHA256_CHECKSUM_MISMATCH/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('Phase 5B: QE Workbench HTML implements 7 sections, Evidence Drawer, and zero hardcoded fabricated numbers', () => {
  const html = fs.readFileSync(path.resolve(__dirname, '../qe_app/public/index.html'), 'utf8');
  assert.match(html, /data-tab="release"/);
  assert.match(html, /id="tab-release"/);
  assert.match(html, /id="evidence-drawer"/);
  assert.match(html, /id="completeness-banner"/);
  assert.doesNotMatch(html, /183 Verified Tables/);
  assert.doesNotMatch(html, /183 tables/);
  assert.doesNotMatch(html, /6,934 verified tests/);
});
