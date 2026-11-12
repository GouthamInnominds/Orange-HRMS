const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const PhpAstExtractor = require('../qkg_engine/php_ast_extractor');
const RoutesExtractor = require('../qkg_engine/routes_extractor');
const VueAstExtractor = require('../qkg_engine/vue_ast_extractor');
const TestLinker = require('../qkg_engine/test_linker');
const { ORANGE_HRM_ROOT, CLIENT_SRC_DIR, PLUGINS_DIR } = require('../qkg_engine/qkg_config');

test('TestLinker links Payroll PHPUnit unit tests without synthetic IDs and upgrades POTENTIAL_COVERS cleanly', () => {
  const phpExtractor = new PhpAstExtractor();
  const prodPaths = [
    path.join(PLUGINS_DIR, 'orangehrmPayrollPlugin/Util/Money.php'),
    path.join(PLUGINS_DIR, 'orangehrmPimPlugin/Service/PIMLeftMenuService.php'),
    path.join(PLUGINS_DIR, 'orangehrmAdminPlugin/Api/EducationAPI.php')
  ];
  const prodParsed = prodPaths.map((p) => phpExtractor.parseFile(p)).filter(Boolean);
  const routes = [
    ...RoutesExtractor.parseRoutesFile(path.join(PLUGINS_DIR, 'orangehrmPayrollPlugin/config/routes.yaml'), 'orangehrmPayrollPlugin'),
    ...RoutesExtractor.parseRoutesFile(path.join(PLUGINS_DIR, 'orangehrmAdminPlugin/config/routes.yaml'), 'orangehrmAdminPlugin')
  ];

  const resolver = new (require('../qkg_engine/symbol_resolver'))(prodParsed);
  const linker = new TestLinker({
    phpExtractor,
    prodResolver: resolver,
    prodParsedFiles: prodParsed,
    apiEndpoints: routes,
    frontendItems: []
  });

  const payTests = [
    path.join(PLUGINS_DIR, 'orangehrmPayrollPlugin/test/Util/MoneyTest.php'),
    path.join(PLUGINS_DIR, 'orangehrmPimPlugin/test/Service/PIMLeftMenuServiceTest.php'),
    path.join(PLUGINS_DIR, 'orangehrmAdminPlugin/test/Api/EducationAPITest.php')
  ];

  assert.ok(fs.existsSync(payTests[0]), 'MoneyTest.php exists');
  assert.ok(fs.existsSync(payTests[1]), 'PIMLeftMenuServiceTest.php exists');
  assert.ok(fs.existsSync(payTests[2]), 'EducationAPITest.php exists');

  const moneyParsed = phpExtractor.parseFile(payTests[0]);
  const pimTestParsed = phpExtractor.parseFile(payTests[1]);
  const eduTestParsed = phpExtractor.parseFile(payTests[2]);

  assert.ok(moneyParsed.classes[0].methods.some((m) => m.name === 'testSection288BRoundingToNearestTen'));
  assert.ok(pimTestParsed.classes[0].methods.some((m) => m.name.startsWith('test')));
  assert.ok(eduTestParsed.classes[0].methods.length > 0);
  assert.ok(linker);

  // Full linkAll check against actual repository (validates zero duplicate POTENTIAL_COVERS & zero synthetic IDs)
  const vue = new VueAstExtractor(CLIENT_SRC_DIR).extractAll();
  const fullProd = [];
  const walkProd = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === 'test' || ent.name === 'vendor') continue;
        walkProd(full);
      } else if (ent.isFile() && ent.name.endsWith('.php')) {
        const p = phpExtractor.parseFile(full);
        if (p) fullProd.push(p);
      }
    }
  };
  walkProd(PLUGINS_DIR);

  const fullResolver = new (require('../qkg_engine/symbol_resolver'))(fullProd);
  const allRoutes = [];
  for (const plugin of fs.readdirSync(PLUGINS_DIR)) {
    const rf = path.join(PLUGINS_DIR, plugin, 'config/routes.yaml');
    if (fs.existsSync(rf)) allRoutes.push(...RoutesExtractor.parseRoutesFile(rf, plugin));
  }

  const fullLinker = new TestLinker({
    phpExtractor,
    prodResolver: fullResolver,
    prodParsedFiles: fullProd,
    apiEndpoints: allRoutes,
    frontendItems: vue.components
  });
  const linked = fullLinker.linkAll();

  const payCases = linked.testCases.filter((tc) => tc.plugin === 'orangehrmPayrollPlugin');
  assert.equal(payCases.length, 18, 'Payroll must have exactly 18 AST PHPUnit unit/component tests');
  for (const tc of payCases) {
    assert.equal(tc.testcase_id, tc.canonical_id, 'Payroll unit test must use canonical_id as testcase_id');
    assert.ok(!/^(TC_PAY_|E2E-|UI-)/.test(tc.testcase_id), 'No synthetic TC_PAY_*/E2E-*/UI-* ID allowed in testcase_id');
  }

  // Verify upgrade rule: zero (canonical_id, signature) pair in BOTH testsEdges and potentialCoversEdges
  const confirmedSet = new Set(linked.testsEdges.map((e) => `${e.canonical_id}::${e.target_method_signature}`));
  const dupes = linked.potentialCoversEdges.filter((e) => confirmedSet.has(`${e.canonical_id}::${e.target_method_signature}`));
  assert.equal(dupes.length, 0, 'Upgrade rule violated: POTENTIAL_COVERS duplicates confirmed TESTS edge');
});
