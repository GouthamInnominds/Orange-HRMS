const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PhpAstExtractor = require('../qkg_engine/php_ast_extractor');
const SymbolResolver = require('../qkg_engine/symbol_resolver');

test('SymbolResolver resolves fluent : self return types and prevents cross-module validate() collisions', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'qkg-sym-'));
  try {
    const f1 = path.join(tmpDir, 'PayrollService.php');
    fs.writeFileSync(f1, `<?php
namespace OrangeHRM\\Payroll\\Service;
class MoneyHelper {
  public static function of(string $amt): self { return new self(); }
  public function roundNearestTen(): self { return $this; }
}
class PayrollService {
  public function calculate(): void {
    $this->validate();
    MoneyHelper::of('100')->roundNearestTen();
  }
  public function validate(): void {}
}
`);
    const f2 = path.join(tmpDir, 'LeaveService.php');
    fs.writeFileSync(f2, `<?php
namespace OrangeHRM\\Leave\\Service;
class LeaveService {
  public function validate(): void {}
}
`);
    const f3 = path.join(tmpDir, 'ChildApi.php');
    fs.writeFileSync(f3, `<?php
namespace OrangeHRM\\Admin\\Api;
use OrangeHRM\\Payroll\\Service\\PayrollService;
class ChildApi extends PayrollService {
  public function run(): void { $this->calculate(); }
}
`);

    const extractor = new PhpAstExtractor();
    const parsed = [
      extractor.parseFile(f1, 'orange_hrm/src/plugins/orangehrmPayrollPlugin/Service/PayrollService.php'),
      extractor.parseFile(f2, 'orange_hrm/src/plugins/orangehrmLeavePlugin/Service/LeaveService.php'),
      extractor.parseFile(f3, 'orange_hrm/src/plugins/orangehrmAdminPlugin/Api/ChildApi.php')
    ];

    const moneyCls = parsed[0].classes.find((c) => c.name === 'MoneyHelper');
    const ofMethod = moneyCls.methods.find((m) => m.name === 'of');
    assert.equal(ofMethod.return_type_fqcn, 'OrangeHRM\\Payroll\\Service\\MoneyHelper');

    const resolver = new SymbolResolver(parsed);
    const { resolvedEdges: edges } = resolver.resolveAllCalls();

    const payrollToLeaveValidate = edges.find(
      (e) =>
        e.callerSignature === 'OrangeHRM\\Payroll\\Service\\PayrollService::calculate' &&
        e.calleeSignature === 'OrangeHRM\\Leave\\Service\\LeaveService::validate'
    );
    assert.equal(payrollToLeaveValidate, undefined, 'PayrollService::calculate must NOT link to LeaveService::validate');

    const payrollToSelfValidate = edges.find(
      (e) =>
        e.callerSignature === 'OrangeHRM\\Payroll\\Service\\PayrollService::calculate' &&
        e.calleeSignature === 'OrangeHRM\\Payroll\\Service\\PayrollService::validate'
    );
    assert.ok(payrollToSelfValidate, 'PayrollService::calculate must link to own PayrollService::validate');

    const fluentCall = edges.find(
      (e) =>
        e.callerSignature === 'OrangeHRM\\Payroll\\Service\\PayrollService::calculate' &&
        e.calleeSignature === 'OrangeHRM\\Payroll\\Service\\MoneyHelper::roundNearestTen'
    );
    assert.ok(fluentCall, 'Fluent chain MoneyHelper::of()->roundNearestTen() must resolve via self return_type_fqcn');

    const inheritedCall = edges.find(
      (e) =>
        e.callerSignature === 'OrangeHRM\\Admin\\Api\\ChildApi::run' &&
        e.calleeSignature === 'OrangeHRM\\Payroll\\Service\\PayrollService::calculate'
    );
    assert.ok(inheritedCall, '$this->calculate() on ChildApi must resolve up EXTENDS hierarchy');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('PhpAstExtractor resolves PHP use imports case-insensitively (EndPoint -> Endpoint)', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'qkg-ci-'));
  try {
    const file = path.join(tmpDir, 'NationalityAPI.php');
    fs.writeFileSync(file, `<?php
namespace OrangeHRM\\Admin\\Api;
use OrangeHRM\\Core\\Api\\V2\\Endpoint;
class NationalityAPI extends EndPoint {}
`);
    const extractor = new PhpAstExtractor();
    const parsed = extractor.parseFile(file, 'orange_hrm/src/plugins/orangehrmAdminPlugin/Api/NationalityAPI.php');
    assert.equal(parsed.classes[0].extends_fqcn, 'OrangeHRM\\Core\\Api\\V2\\Endpoint');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
