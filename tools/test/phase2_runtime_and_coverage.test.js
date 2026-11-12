const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

const {
  parseJunitXml,
  parseJestJson,
  parsePlaywrightJson,
  sanitizeErrorSnippet
} = require('../qkg_engine/execution_history_ingestion');
const {
  parseCloverXml,
  aggregateMethodCoverage
} = require('../qkg_engine/coverage_ingestion');
const neo4jService = require('../qe_app/services/neo4j_service');
const { MetricsService } = require('../qe_app/services/metrics_service');
const { QkgMcpServer } = require('../qkg_mcp/server_core');
const { TestService } = require('../qe_app/services/test_service');

test('parsePlaywrightJson builds nested suiteStack fullTitle, tracks retries and interrupted/cancelled status', () => {
  const pw = parsePlaywrightJson({
    suites: [{
      title: 'Employee Profile',
      file: 'tests/pim/profile.spec.ts',
      suites: [{
        title: 'Contact Details',
        specs: [
          {
            title: 'updates work email after retry',
            tests: [{
              results: [
                { status: 'failed', duration: 120, error: { message: 'token=secret123456 timeout' } },
                { status: 'passed', duration: 95 }
              ]
            }]
          },
          {
            title: 'aborted when worker interrupted',
            tests: [{
              results: [{ status: 'interrupted', duration: 15 }]
            }]
          }
        ]
      }]
    }]
  });

  assert.equal(pw.executions.length, 2);
  assert.equal(
    pw.executions[0].rawName,
    'Employee Profile > Contact Details > updates work email after retry'
  );
  assert.equal(pw.executions[0].status, 'PASSED');
  assert.equal(pw.executions[0].flaky, true);
  assert.equal(pw.executions[0].retried, true);
  assert.equal(pw.executions[0].retryCount, 1);
  assert.equal(pw.executions[1].status, 'CANCELLED');
  assert.ok(sanitizeErrorSnippet('token=secret123456').includes('[REDACTED]'));
});

test('parseJestJson maps assertionResults to canonical AST_JEST IDs and handles passed/failed/skipped/todo', () => {
  const repoTestFile = path.resolve(
    __dirname,
    '../../orange_hrm/src/client/src/core/util/helper/__tests__/datefns.spec.ts'
  );

  const parsed = parseJestJson({
    success: false,
    testResults: [{
      name: repoTestFile,
      assertionResults: [
        {
          ancestorTitles: ['core > util > datefns'],
          title: 'format::HH:mm',
          fullName: 'core > util > datefns format::HH:mm',
          status: 'passed',
          duration: 7
        },
        {
          ancestorTitles: ['core > util > datefns'],
          title: 'parseDate handles invalid input',
          status: 'failed',
          duration: 14,
          failureMessages: ['Error: bearer=tok987654321 expected null']
        },
        {
          ancestorTitles: [],
          title: 'pending spec',
          status: 'pending',
          duration: 0
        }
      ]
    }]
  });

  assert.equal(parsed.framework, 'jest');
  assert.equal(parsed.executions.length, 3);
  assert.equal(
    parsed.executions[0].canonicalId,
    'orange-hrms::orange_hrm/src/client/src/core/util/helper/__tests__/datefns.spec.ts::format::HH:mm'
  );
  assert.equal(parsed.executions[0].status, 'PASSED');
  assert.equal(parsed.executions[1].status, 'FAILED');
  assert.ok(parsed.executions[1].errorMessage.includes('[REDACTED]'));
  assert.equal(parsed.executions[2].status, 'SKIPPED');
});

test('parseJunitXml distinguishes PHPUnit data sets vs Jest/Cypress file-scoped testcases', () => {
  const phpJunit = `<?xml version="1.0"?>
  <testsuite name="Payroll" tests="2">
    <testcase name="testCalculateGross with data set #1" class="OrangeHRM\\Tests\\Payroll\\Service\\PayrollCalculatorTest" classname="OrangeHRM.Tests.Payroll.Service.PayrollCalculatorTest" time="0.014"/>
    <testcase name="testNetPay" classname="OrangeHRM.Tests.Payroll.Service.PayrollCalculatorTest" time="0.020"/>
  </testsuite>`;
  const parsedPhp = parseJunitXml(phpJunit, { framework: 'phpunit' });
  assert.equal(parsedPhp.executions.length, 2);
  assert.equal(
    parsedPhp.executions[0].canonicalId,
    'orange-hrms::OrangeHRM\\Tests\\Payroll\\Service\\PayrollCalculatorTest::testCalculateGross'
  );

  const jestJunit = `<?xml version="1.0"?>
  <testsuite name="datefns" file="orange_hrm/src/client/src/core/util/helper/__tests__/datefns.spec.ts" tests="1">
    <testcase classname="core > util > datefns" name="format::HH:mm" time="0.005"/>
  </testsuite>`;
  const parsedJest = parseJunitXml(jestJunit, { framework: 'jest' });
  assert.equal(parsedJest.executions.length, 1);
  assert.ok(parsedJest.executions[0].file.endsWith('datefns.spec.ts'));
  assert.equal(parsedJest.executions[0].status, 'PASSED');

  const cypressJunit = `<?xml version="1.0"?>
  <testsuite name="Employment Status API" file="cypress/e2e/integration/api/admin/empStatus_API.cy.js" tests="1">
    <testcase classname="Employment Status API" name="gets all employment statuses" time="0.410"/>
  </testsuite>`;
  const parsedCypress = parseJunitXml(cypressJunit, { framework: 'cypress' });
  assert.equal(parsedCypress.executions.length, 1);
  assert.equal(
    parsedCypress.executions[0].canonicalId,
    'orangehrm-qa-automation::cypress/e2e/integration/api/admin/empStatus_API.cy.js::Employment Status API > gets all employment statuses'
  );
  assert.equal(parsedCypress.executions[0].methodName, 'Employment Status API > gets all employment statuses');
});

test('parseCloverXml supports Jest Clover path attribute & project metrics without NaN on zero-line targets', () => {
  const jestFileAbs = path.resolve(
    __dirname,
    '../../orange_hrm/src/client/src/core/util/helper/datefns.ts'
  );
  const jestClover = `<?xml version="1.0" encoding="UTF-8"?>
<coverage generated="1794400000000" clover="3.2.0">
  <project timestamp="1794400000000" name="All files">
    <metrics statements="50" coveredstatements="40" conditionals="10" coveredconditionals="5" methods="6" coveredmethods="5" elements="66" coveredelements="50" complexity="0" loc="50" ncloc="50" packages="1" files="2" classes="2"/>
    <file name="datefns.ts" path="${jestFileAbs}">
      <metrics statements="20" coveredstatements="18" conditionals="4" coveredconditionals="3" methods="4" coveredmethods="4"/>
      <line num="1" count="5" type="stmt"/>
      <line num="2" count="5" type="stmt"/>
      <line num="3" count="0" type="stmt"/>
    </file>
    <file name="empty.ts" path="orange_hrm/src/client/src/core/util/helper/empty.ts">
      <metrics statements="0" coveredstatements="0" conditionals="0" coveredconditionals="0" methods="0" coveredmethods="0"/>
    </file>
  </project>
</coverage>`;

  const parsed = parseCloverXml(jestClover, { framework: 'jest' });
  assert.equal(parsed.framework, 'jest');
  assert.equal(parsed.linesValid, 50);
  assert.equal(parsed.linesCovered, 40);
  assert.equal(parsed.files.length, 2);
  assert.equal(
    parsed.files[0].file,
    'orange_hrm/src/client/src/core/util/helper/datefns.ts'
  );
  assert.equal(parsed.files[0].linesValid, 20);
  assert.equal(parsed.files[0].linesCovered, 18);
  assert.equal(parsed.files[1].lineCoveragePct, null);

  const methodAgg = aggregateMethodCoverage(
    {
      relPath: 'orange_hrm/src/plugins/orangehrmPayrollPlugin/Service/TestService.php',
      linesCovered: 0,
      linesTotal: 0,
      lineHits: new Map()
    },
    [{ signature: 'TestService::noop', start_line: 10, end_line: 20 }]
  );
  assert.equal(methodAgg.length, 0);
});

test('MetricsService & QkgMcpServer separate coverage dimensions, prevent double-counting, and compute rolling flake rate', async () => {
  const origGetLatest = neo4jService.getLatestSnapshot;
  const origRunQuery = neo4jService.runQuery;
  try {
    neo4jService.getLatestSnapshot = async () => ({
      snapshotId: 'snap-p2-test',
      appCommit: 'abc1234',
      qaCommit: 'def5678',
      branch: 'v2-main',
      schemaVersion: '2.2',
      publishedAt: '2026-11-11T12:00:00Z'
    });

    neo4jService.runQuery = async (cypher) => {
      if (cypher.includes('AS codeTests')) {
        return [{ codeTests: 3000, baselineTests: 4100 }];
      }
      if (cypher.includes('AS apiTests')) {
        return [{ apiTests: 300, uiTests: 200, dbTests: 400, funcTests: 150, unitTests: 1950 }];
      }
      if (cypher.includes('AS mappedEndpoints') || cypher.includes('AS mappingSummary')) {
        return [{ totalMethods: 600, mappedMethods: 300, totalEndpoints: 200, mappedEndpoints: 100, totalUiComponents: 200, mappedUiComponents: 50 }];
      }
      if (cypher.includes('AS codeTestCount')) {
        return [
          { plugin: 'orangehrmCorePlugin', codeTestCount: 400, classCount: 250, totalMethods: 500, mappedMethods: 200, linesCovered: 252, linesTotal: 311 },
          { plugin: 'orangehrmPayrollPlugin', codeTestCount: 18, classCount: 44, totalMethods: 120, mappedMethods: 18, linesCovered: 0, linesTotal: 0 }
        ];
      }
      if (cypher.includes('MATCH (tr:TestRun)') && !cypher.includes('HAS_EXECUTION')) {
        return [
          { runId: 'tr-php-1', framework: 'phpunit', suiteScope: 'payroll_core', passed: 374, failed: 0, skipped: 0, cancelled: 0, total: 374, flaky: 0, executedAt: '2026-11-11T12:05:00Z' },
          { runId: 'tr-jest-1', framework: 'jest', suiteScope: 'client_core', passed: 450, failed: 4, skipped: 0, cancelled: 0, total: 454, flaky: 2, executedAt: '2026-11-11T12:06:00Z' }
        ];
      }
      if (cypher.includes('AS flakyTestCount')) {
        return [{ distinctExecutedTests: 100, totalRecentExecs: 120, flakyTestCount: 5 }];
      }
      if (cypher.includes('MATCH (cr:CoverageRun)')) {
        return [
          {
            runId: 'cr-jest-latest',
            framework: 'jest',
            suiteScope: 'client_core',
            linesCovered: 252,
            linesValid: 311,
            lineRate: 0.8103,
            generatedAt: '2026-11-11T12:07:00Z',
            backendCovered: 0,
            backendTotal: 0,
            frontendCovered: 252,
            frontendTotal: 311
          }
        ];
      }
      if (cypher.includes('AS totalRequirements')) {
        return [{ totalRequirements: 42, coveredByCodeTests: 22, coveredByPlannedBacklog: 12 }];
      }
      return [];
    };

    const metrics = await new MetricsService().getExecutiveQualityMetrics();
    assert.equal(metrics.overview.flakyTestCount, 5);
    assert.equal(metrics.overview.flakyRate, '5.0%');
    assert.equal(metrics.overview.lineCoveragePercent, 81);
    assert.equal(metrics.overview.mappingCoveragePercent, 45);
    assert.ok(metrics.coverageDimensions);
    assert.equal(metrics.coverageDimensions.mapping.overallMappingPct, 45);
    assert.equal(metrics.coverageDimensions.runtime.lineCoveragePct, 81);
    assert.equal(metrics.coverageDimensions.requirementTraceability.codeCoveragePct, 52.4);

    // Core has measured FE lines (252/311 = 81.0%), Payroll is unmeasured (null)
    const coreMod = metrics.modules.find((m) => m.module === 'Core');
    const payMod = metrics.modules.find((m) => m.module === 'Payroll');
    assert.equal(coreMod.coverage, 81);
    assert.equal(coreMod.coverageMeasured, true);
    assert.equal(payMod.coverage, null);
    assert.equal(payMod.coverageMeasured, false);

    // Verify MCP get_module_coverage separates mapping vs runtime and sets null when unmeasured
    const mcp = new QkgMcpServer({
      queryRunner: async (cypher) => {
        if (cypher.includes('MATCH (p:Plugin)')) {
          return [
            {
              plugin: 'orangehrmCorePlugin',
              automatedTests: 400,
              totalMethods: 100,
              mappedMethods: 75,
              linesCovered: 252,
              linesTotal: 311
            },
            {
              plugin: 'orangehrmPayrollPlugin',
              automatedTests: 18,
              totalMethods: 80,
              mappedMethods: 18,
              linesCovered: 0,
              linesTotal: 0
            }
          ];
        }
        return [{ snapshotId: 'snap-p2-test', appCommit: 'abc1234', qaCommit: 'def5678', schemaVersion: '2.2' }];
      },
      qaCommit: 'def5678',
      currentCommit: 'abc1234'
    });

    const rpc = await mcp.handleJsonRpc({
      id: 1,
      method: 'tools/call',
      params: { name: 'get_module_coverage', arguments: {} }
    });
    const body = JSON.parse(rpc.result.content[0].text);
    const mcpCore = body.data.modules.find((m) => m.plugin === 'orangehrmCorePlugin');
    const mcpPay = body.data.modules.find((m) => m.plugin === 'orangehrmPayrollPlugin');
    assert.equal(mcpCore.mappingCoveragePct, 75);
    assert.equal(mcpCore.lineCoveragePct, 81.03);
    assert.equal(mcpCore.coverageStatus, 'MEASURED');
    assert.equal(mcpPay.mappingCoveragePct, 22.5);
    assert.equal(mcpPay.lineCoveragePct, null);
    assert.equal(mcpPay.coverageStatus, 'NOT_INGESTED_YET');
  } finally {
    neo4jService.getLatestSnapshot = origGetLatest;
    neo4jService.runQuery = origRunQuery;
  }
});

test('TestService._buildAllowlistedCommand attaches report flags for auto-ingestion', () => {
  const svc = new TestService();
  const phpCmd = svc._buildAllowlistedCommand(
    {
      framework: 'phpunit',
      file: 'orange_hrm/src/plugins/orangehrmPayrollPlugin/test/Entity/PayGradeTest.php',
      name: 'PayGradeTest::testGetName'
    },
    'tools/qkg_engine/artifacts/qe_exec/phpunit.xml'
  );
  assert.equal(phpCmd.framework, 'phpunit');
  assert.ok(phpCmd.args.includes('--log-junit'));
  assert.ok(phpCmd.args.some((a) => a.includes('phpunit.xml')));

  const jestCmd = svc._buildAllowlistedCommand(
    {
      framework: 'jest',
      file: 'orange_hrm/src/client/src/core/util/helper/__tests__/datefns.spec.ts',
      name: 'format::HH:mm'
    },
    'tools/qkg_engine/artifacts/qe_exec/jest.json'
  );
  assert.equal(jestCmd.framework, 'jest');
  assert.ok(jestCmd.args.includes('--json'));
  assert.ok(jestCmd.args.includes('--outputFile'));
  assert.ok(jestCmd.args.some((a) => a.includes('jest.json')));
});
