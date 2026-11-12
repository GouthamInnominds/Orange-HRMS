/**
 * Unit & Integration Tests: MCP Server, Context Retrieval, and Test Artifact Governance (Phase 1)
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');

const { McpServer, MCP_TOOLS } = require('../mcp_server');
const { QeIntelligenceService } = require('../qe_app/services/qe_intelligence_service');
const { TestArtifactGovernanceService } = require('../qe_app/services/artifact_governance_service');

const TEST_STORE_PATH = path.resolve(__dirname, '../output/test_proposed_artifacts.json');

function makeMockContextRunner() {
  return async (cypher, params = {}) => {
    if (cypher.includes('MATCH (s:GraphSnapshot)')) {
      return [{
        snapshotId: 'snap-phase1-test',
        appCommit: 'f2d134b1c554',
        qaCommit: 'qa-mock-commit',
        branch: 'v2-main',
        status: 'PUBLISHED',
        publishedAt: '2026-11-12T10:00:00Z',
        schemaVersion: '2.2',
        extractorVersion: '2.2.0',
        deadLetterCount: 0,
        missingSpecTargetCount: 0
      }];
    }
    if (cypher.includes('AS classCount')) {
      return [{
        classCount: 120,
        methodCount: 850,
        codeTestCount: 400,
        mappingCount: 620,
        covRunCount: 2,
        covObsCount: 50,
        testRunCount: 2,
        reqCount: 45,
        wfCount: 12
      }];
    }
    if (cypher.includes('MATCH (w:BusinessWorkflow)')) {
      if (params.workflowId || params.workflow_id) {
        return [{
          workflowId: 'WF_PAYROLL_RUN',
          workflowName: 'Batch Snapshot, Cross-Module Intake, Statutory Engine & Override',
          workflowType: 'IndiaPayrollExtension',
          domainId: 'DOMAIN_PAYROLL',
          domainName: 'India Payroll & Statutory Disbursement',
          features: [
            { feature_id: 'FEAT_PAY_ENGINE', name: 'Indian Statutory Engine (EPF, ESIC, PT, FY26-27 TDS)' },
            { feature_id: 'FEAT_PAY_ADJUSTMENT', name: 'Audited Manual Overrides & Append-Only Audit Log' }
          ],
          requirements: [
            { requirement_id: 'FR_PAY_007', title: 'Indian Statutory & TDS Calculation', priority: 'Critical', status: 'Verified' }
          ],
          businessRules: [
            { rule_id: 'BR_PAY_009', name: 'EPF/EPS Calculation & Rs 15,000 Ceiling', description: '12% EE EPF with optional 15k cap and 8.33% EPS / 3.67% EPF split.' },
            { rule_id: 'BR_PAY_010', name: 'ESIC Applicability Ceiling (Rs 21,000)', description: 'ESIC 0.75%/3.25% ceil rupee when gross <= 21k.' },
            { rule_id: 'BR_PAY_012', name: 'TDS u/s 115BAC vs Old Regime', description: 'FY 2026-27 slabs, Sec 87A rebate and Sec 288B rounding.' }
          ],
          personas: [
            { persona_id: 'ROLE_PAYROLL_ADMIN', name: 'Payroll Administrator', role: 'Admin' }
          ]
        }];
      }
      return [
        { workflowId: 'WF_PAYROLL_RUN', name: 'Batch Snapshot, Cross-Module Intake, Statutory Engine & Override', type: 'IndiaPayrollExtension', domainName: 'India Payroll' },
        { workflowId: 'WF_PAYROLL_CONFIG', name: 'India Jurisdiction, FY 2026-27 Slab & LWP Config Workflow', type: 'IndiaPayrollExtension', domainName: 'India Payroll' }
      ];
    }
    if (cypher.includes('MATCH (br:BusinessRule)')) {
      return [{
        ruleId: 'BR_PAY_009',
        name: 'EPF/EPS Calculation & Rs 15,000 Ceiling',
        description: '12% EE EPF with optional 15k cap and 8.33% EPS / 3.67% EPF split.',
        requirements: [{ requirement_id: 'FR_PAY_007', title: 'Indian Statutory & TDS Calculation' }],
        features: [{ feature_id: 'FEAT_PAY_ENGINE', name: 'Indian Statutory Engine' }],
        workflows: [{ workflow_id: 'WF_PAYROLL_RUN', name: 'Batch Snapshot' }]
      }];
    }
    if (cypher.includes('MATCH (m:Method)')) {
      return [{
        methodId: 'SalaryCalculator::calculateMonthlySalary',
        name: 'calculateMonthlySalary',
        filePath: 'src/Service/SalaryCalculator.php',
        className: 'SalaryCalculator',
        callers: [{ method_id: 'PayrollRunService::execute', file: 'src/Service/PayrollRunService.php' }],
        callees: [{ method_id: 'StatutoryEngine::computeEpf', file: 'src/Service/StatutoryEngine.php' }],
        accessedColumns: [{ column: 'gross_salary', table: 'hs_hr_payroll_salary_record', mode: 'READ' }],
        endpoints: [{ route: '/api/v2/payroll/calculate', method: 'POST' }]
      }];
    }
    if (cypher.includes('MATCH (ep:ApiEndpoint)')) {
      return [{
        endpointId: 'ep_post_payroll_calculate',
        urlPattern: '/api/v2/payroll/calculate',
        httpMethod: 'POST',
        routeName: 'apiv2_payroll_calculate',
        handlers: [{ method_id: 'PayrollController::calculate', file: 'src/Controller/PayrollController.php' }],
        components: [{ component_id: 'VUE_PAYROLL_RUN_FORM', name: 'PayrollRunForm.vue' }],
        pages: [{ page_id: 'PAGE_PAYROLL_RUN', route_pattern: '/payroll/run' }]
      }];
    }
    if (cypher.includes('MATCH (tc:TestCase)')) {
      return [
        { testId: 'IndianStatutoryCalculatorTest::testEpfCapToggleSplitsEpsAndDiffCorrectly', name: 'testEpfCapToggleSplitsEpsAndDiffCorrectly', type: 'UNIT', framework: 'PHPUnit', filePath: 'test/IndianStatutoryCalculatorTest.php', targetRequirement: 'FR_PAY_007' },
        { testId: 'IndianStatutoryCalculatorTest::testEsicCeilingBoundaryAndClaimExclusion', name: 'testEsicCeilingBoundaryAndClaimExclusion', type: 'UNIT', framework: 'PHPUnit', filePath: 'test/IndianStatutoryCalculatorTest.php', targetRequirement: 'FR_PAY_007' }
      ];
    }
    return [];
  };
}

test.describe('TestArtifactGovernanceService', () => {
  let govService;

  test.beforeEach(() => {
    if (fs.existsSync(TEST_STORE_PATH)) {
      fs.unlinkSync(TEST_STORE_PATH);
    }
    govService = new TestArtifactGovernanceService(TEST_STORE_PATH);
  });

  test.afterEach(() => {
    if (fs.existsSync(TEST_STORE_PATH)) {
      fs.unlinkSync(TEST_STORE_PATH);
    }
  });

  test('proposes a new test artifact and computes deterministic signature', async () => {
    const res = await govService.proposeArtifact({
      workflow_id: 'WF_PAYROLL_RUN',
      rule_id: 'BR_PAY_009',
      scenario_title: 'Verify 12% EPF deduction when basic salary exceeds 15,000 INR',
      test_tier: 'E2E_PLAYWRIGHT',
      assertions: [
        'EPF employee deduction should be capped at 1,800 INR',
        'EPS employer contribution should be 1,250 INR'
      ],
      synthetic_data_fixture: 'PayrollEmployeeFactory::createStandardSalaried()'
    });

    assert.equal(res.is_duplicate, false);
    assert.match(res.artifact_id, /^PROP-PAYROLL_RUN-[A-F0-9]{8}$/);
    assert.equal(res.status, 'PROPOSED');
    assert.equal(res.artifact.synthetic_data_fixture, 'PayrollEmployeeFactory::createStandardSalaried()');
    assert.equal(res.artifact.assertions.length, 2);
    assert.equal(res.artifact.provenance.proposed_by, 'AI_AGENT');
  });

  test('deduplicates identical test scenario proposals', async () => {
    const payload = {
      workflow_id: 'WF_PAYROLL_RUN',
      rule_id: 'BR_PAY_010',
      scenario_title: 'Verify ESIC deduction when gross salary <= 21,000 INR',
      test_tier: 'E2E_PLAYWRIGHT',
      assertions: ['ESIC employee deduction should be 0.75% of gross']
    };

    const first = await govService.proposeArtifact(payload);
    assert.equal(first.is_duplicate, false);

    const second = await govService.proposeArtifact(payload);
    assert.equal(second.is_duplicate, true);
    assert.equal(second.artifact_id, first.artifact_id);
    assert.match(second.message, /Identical scenario already proposed/);
  });

  test('updates artifact lifecycle status through review queue', async () => {
    const res = await govService.proposeArtifact({
      workflow_id: 'WF_PAYROLL_CONFIG',
      scenario_title: 'Verify fiscal year 2026-27 tax slab configuration',
      assertions: ['New tax regime slabs should be loaded']
    });

    const artifactId = res.artifact_id;

    // Transition to IN_REVIEW
    const inReview = await govService.updateArtifactStatus(artifactId, 'IN_REVIEW', {
      actor: 'QA_LEAD',
      comment: 'Reviewing business assertions'
    });
    assert.equal(inReview.current_status, 'IN_REVIEW');

    // Transition to APPROVED
    const approved = await govService.updateArtifactStatus(artifactId, 'APPROVED', {
      actor: 'QA_LEAD',
      comment: 'Approved for Playwright script authoring'
    });
    assert.equal(approved.current_status, 'APPROVED');

    // Fetch and verify audit history
    const item = await govService.getArtifact(artifactId);
    assert.equal(item.status, 'APPROVED');
    assert.equal(item.approved_by, 'QA_LEAD');
    assert.equal(item.review_history.length, 3);
  });

  test('rejects invalid lifecycle status transitions', async () => {
    const res = await govService.proposeArtifact({
      workflow_id: 'WF_PAYROLL_RUN',
      scenario_title: 'Test boundary',
      assertions: ['Assertion 1']
    });

    await assert.rejects(
      async () => {
        await govService.updateArtifactStatus(res.artifact_id, 'SUPER_APPROVED');
      },
      /Invalid lifecycle status 'SUPER_APPROVED'/
    );
  });
});

test.describe('McpServer JSON-RPC Protocol', () => {
  let mcp;

  test.beforeEach(() => {
    mcp = new McpServer();
  });

  test.afterEach(() => {
    if (mcp) mcp.close();
  });

  test('handles initialize method returning 2024-11-05 protocol and tool capabilities', async () => {
    const req = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { clientInfo: { name: 'cursor', version: '1.0' } }
    };
    const res = await mcp.handleMessage(req);
    assert.equal(res.id, 1);
    assert.equal(res.result.protocolVersion, '2024-11-05');
    assert.equal(res.result.serverInfo.name, 'qkg-intelligence-mcp');
    assert.ok(res.result.capabilities.tools);
  });

  test('handles tools/list returning all 18 canonical tools', async () => {
    const req = { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} };
    const res = await mcp.handleMessage(req);
    assert.equal(res.id, 2);
    const names = res.result.tools.map((t) => t.name);
    assert.ok(names.includes('get_test_generation_context'));
    assert.ok(names.includes('get_business_context'));
    assert.ok(names.includes('get_code_context'));
    assert.ok(names.includes('propose_test_artifact'));
    assert.ok(names.includes('get_code_impact'));
    assert.ok(names.includes('get_release_readiness'));
    assert.equal(res.result.tools.length, 18);
  });

  test('handles tools/call for propose_test_artifact', async () => {
    const req = {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'propose_test_artifact',
        arguments: {
          workflow_id: 'WF_PAYROLL_RUN',
          scenario_title: 'Test salary slip generation over MCP',
          assertions: ['Status should be GENERATED']
        }
      }
    };
    const res = await mcp.handleMessage(req);
    assert.equal(res.id, 3);
    assert.equal(res.result.content[0].type, 'text');
    const parsed = JSON.parse(res.result.content[0].text);
    assert.ok(parsed.artifact_id);
    assert.equal(parsed.status, 'PROPOSED');
  });

  test('handles tools/call with unknown tool returning error', async () => {
    const req = {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: { name: 'non_existent_tool', arguments: {} }
    };
    const res = await mcp.handleMessage(req);
    assert.equal(res.id, 4);
    assert.ok(res.error);
    assert.match(res.error.message, /Unknown tool 'non_existent_tool'/);
  });
});

test.describe('QeIntelligenceService Context Retrieval', () => {
  let isolatedQe;

  test.beforeEach(() => {
    isolatedQe = new QeIntelligenceService({ queryRunner: makeMockContextRunner() });
  });

  test('retrieves business context for Indian Payroll', async () => {
    const res = await isolatedQe.getBusinessContext({ workflow_id: 'WF_PAYROLL_RUN' });
    assert.equal(res.analysisStatus, 'SUCCESS');
    assert.equal(res.data.workflow.workflow_id, 'WF_PAYROLL_RUN');
    assert.equal(res.data.businessRules.length, 3);
    assert.equal(res.data.businessRules[0].rule_id, 'BR_PAY_009');
  });

  test('retrieves code context with callers, callees, and accessed columns', async () => {
    const res = await isolatedQe.getCodeContext({ method_id: 'SalaryCalculator::calculateMonthlySalary' });
    assert.equal(res.analysisStatus, 'SUCCESS');
    assert.equal(res.data.method.method_id, 'SalaryCalculator::calculateMonthlySalary');
    assert.equal(res.data.callers.length, 1);
    assert.equal(res.data.callees.length, 1);
    assert.equal(res.data.accessed_columns.length, 1);
  });

  test('retrieves consolidated test generation context without PII', async () => {
    const res = await isolatedQe.getTestGenerationContext({ workflow_id: 'WF_PAYROLL_RUN' });
    assert.equal(res.analysisStatus, 'SUCCESS');
    assert.equal(res.data.workflow.workflow_id, 'WF_PAYROLL_RUN');
    assert.equal(res.data.business_rules.length, 3);
    assert.ok(Array.isArray(res.data.synthetic_data_recommendations));
    assert.ok(res.data.synthetic_data_recommendations.length >= 3);
    // Verify no production PII in fixture recommendations
    res.data.synthetic_data_recommendations.forEach((rec) => {
      assert.match(rec.factory, /Factory::create/);
    });
  });
});
