const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

const PhpAstExtractor = require('../qkg_engine/php_ast_extractor');
const SchemaFkExtractor = require('../qkg_engine/schema_fk_extractor');
const DoctrineAccessExtractor = require('../qkg_engine/doctrine_access_extractor');
const SymfonyExtractor = require('../qkg_engine/symfony_extractor');
const { parseCloverXml, aggregateMethodCoverage } = require('../qkg_engine/coverage_ingestion');
const { parseJunitXml, parsePlaywrightJson, sanitizeErrorSnippet } = require('../qkg_engine/execution_history_ingestion');
const { PLUGINS_DIR } = require('../qkg_engine/qkg_config');

test('DoctrineAccessExtractor & SymfonyExtractor capture ClaimSettlementAdapter and MenuConfigurator couplings', async () => {
  const extractor = new PhpAstExtractor();
  const SymbolResolver = require('../qkg_engine/symbol_resolver');
  const entityClaimLink = extractor.parseFile(path.join(PLUGINS_DIR, 'orangehrmPayrollPlugin/entity/PayrollClaimLink.php'));
  const entityClaimReq = extractor.parseFile(path.join(PLUGINS_DIR, 'orangehrmClaimPlugin/entity/ClaimRequest.php'));
  const runDaoParsed = extractor.parseFile(path.join(PLUGINS_DIR, 'orangehrmPayrollPlugin/Dao/PayrollRunDao.php'));
  const adapterParsed = extractor.parseFile(path.join(PLUGINS_DIR, 'orangehrmPayrollPlugin/Service/ClaimSettlementAdapter.php'));
  const prodParsedFiles = [entityClaimLink, entityClaimReq, runDaoParsed, adapterParsed];

  const schemaData = await new SchemaFkExtractor().extractAll({ prodParsedFiles, connectMariaDb: false });
  assert.ok(schemaData.entities.some((e) => e.table_name === 'ohrm_payroll_claim_link'));
  assert.ok(schemaData.fkEdges.some((fk) => fk.from_table === 'ohrm_payroll_claim_link' && fk.to_table === 'ohrm_claim_request'));

  const symbolResolver = new SymbolResolver(prodParsedFiles);
  const accessData = new DoctrineAccessExtractor().extractAll({
    prodParsedFiles,
    knownTables: schemaData.tables.map((t) => t.name),
    symbolResolver
  });

  const writesClaimReq = accessData.tableAccessEdges.find(
    (e) =>
      e.method_signature === 'OrangeHRM\\Payroll\\Service\\ClaimSettlementAdapter::markBatchReconciledPaid' &&
      e.table_name === 'ohrm_claim_request' &&
      e.relation === 'WRITES_TABLE'
  );
  assert.ok(writesClaimReq, 'ClaimSettlementAdapter::markBatchReconciledPaid must emit WRITES_TABLE ohrm_claim_request');

  const buzzSubParsed = extractor.parseFile(path.join(PLUGINS_DIR, 'orangehrmDashboardPlugin/Subscriber/BuzzModuleStatusChangeSubscriber.php'));
  const payCfgParsed = extractor.parseFile(path.join(PLUGINS_DIR, 'orangehrmPayrollPlugin/config/PayrollPluginConfiguration.php'));
  const symData = new SymfonyExtractor().extractAll({
    prodParsedFiles: [...prodParsedFiles, buzzSubParsed, payCfgParsed],
    uiPages: []
  });
  assert.ok(symData.diEdges.length > 0, 'DI edges extracted');
  assert.ok(symData.events.length > 0, 'Symfony events extracted');
  assert.ok(symData.listenEdges.length > 0, 'Event subscriber listeners extracted');
});

test('Clover coverage parser aggregates line hits per method and returns null pct when statements=0', () => {
  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<coverage generated="1731312000">
  <project timestamp="1731312000">
    <file name="/workspace/orange_hrm/src/plugins/orangehrmPayrollPlugin/Util/Money.php">
      <line num="10" type="method" name="roundNearestTenRupees" count="4"/>
      <line num="12" type="stmt" count="4"/>
      <line num="13" type="stmt" count="0"/>
    </file>
    <metrics statements="2" coveredstatements="1"/>
  </project>
</coverage>`;
  const parsed = parseCloverXml(sampleXml);
  assert.equal(parsed.files[0].file, 'orange_hrm/src/plugins/orangehrmPayrollPlugin/Util/Money.php');
  assert.equal(parsed.linesCovered, 1);
  assert.equal(parsed.linesValid, 2);

  const obs = aggregateMethodCoverage(parsed.files[0], [
    { signature: 'Money::roundNearestTenRupees()', name: 'roundNearestTenRupees', line_start: 10, line_end: 15 },
    { signature: 'Money::markerInterface()', name: 'markerInterface', line_start: 20, line_end: 22 }
  ]);
  assert.equal(obs.length, 1);
  assert.equal(obs[0].lineCoveragePct, 50);

  // Zero statements but nonzero method hit must return null pct instead of 100% or 0%
  const obsNull = aggregateMethodCoverage(
    { lines: [{ num: 20, type: 'method', name: 'emptyFn', count: 1 }] },
    [{ signature: 'Foo::emptyFn()', name: 'emptyFn', line_start: 20, line_end: 21 }]
  );
  assert.equal(obsNull[0].lineCoveragePct, null);
});

test('Execution history parsers handle PHPUnit JUnit data sets and Playwright retries + secret redaction', () => {
  const junit = `<?xml version="1.0"?>
<testsuite tests="2">
  <testcase classname="OrangeHRM.Tests.Payroll.Util.MoneyTest" name="testRounding with data set #0" time="0.012"/>
  <testcase classname="OrangeHRM.Tests.Payroll.Util.MoneyTest" name="testFail" time="0.005">
    <failure message="api_key=sk-1234567890abcdef failed assertion"/>
  </testcase>
</testsuite>`;
  const parsedJ = parseJunitXml(junit);
  assert.equal(parsedJ.executions.length, 2);
  assert.equal(parsedJ.executions[0].canonicalId, 'orange-hrms::OrangeHRM\\Tests\\Payroll\\Util\\MoneyTest::testRounding');
  assert.equal(parsedJ.executions[0].status, 'PASSED');
  assert.equal(parsedJ.executions[1].status, 'FAILED');
  assert.ok(parsedJ.executions[1].errorMessage.includes('[REDACTED]'));

  const pw = parsePlaywrightJson({
    suites: [{
      file: 'tests/payroll.spec.ts',
      specs: [{
        title: 'should verify slip',
        tests: [{ results: [{ status: 'failed', duration: 200 }, { status: 'passed', duration: 150 }] }]
      }]
    }]
  });
  assert.equal(pw.executions[0].status, 'PASSED');
  assert.equal(pw.executions[0].flaky, true);
  assert.ok(sanitizeErrorSnippet('token=abc123456').includes('[REDACTED]'));
});
