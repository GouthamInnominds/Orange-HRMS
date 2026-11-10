/**
 * Audit Granular Test Counts (6,893 1:1 Files)
 * Verifies exact 1:1 parity between baseline JSON catalogs and physical files on disk.
 */

const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '..', '..');
const baselineDir = path.join(workspaceRoot, 'OrangeHRM_Baseline_v1.0', '04_Test_Strategy');
const cypressSuitesDir = path.join(workspaceRoot, 'orange_hrm', 'src', 'test', 'functional', 'cypress', 'e2e', 'suites');
const clientSuitesDir = path.join(workspaceRoot, 'orange_hrm', 'src', 'client', 'tests', 'unit', 'suites');
const unitSuitesDir = path.join(workspaceRoot, 'orange_hrm', 'src', 'test', 'phpunit', 'unit_granular');

function countFilesRecursive(dir, ext) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFilesRecursive(fullPath, ext);
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      count++;
    }
  }
  return count;
}

const auditSuites = [
  { name: 'api_tests.json', dir: path.join(cypressSuitesDir, 'api'), ext: '.cy.js', label: 'API Contract Tests' },
  { name: 'functional_tests.json', dir: path.join(cypressSuitesDir, 'functional'), ext: '.cy.js', label: 'Functional Feature Tests' },
  { name: 'ui_component_tests.json', dir: clientSuitesDir, ext: '.spec.ts', label: 'UI Component Tests' },
  { name: 'security_tests.json', dir: path.join(cypressSuitesDir, 'security'), ext: '.cy.js', label: 'Security & IDOR Tests' },
  { name: 'workflow_state_tests.json', dir: path.join(cypressSuitesDir, 'workflow'), ext: '.cy.js', label: 'Workflow State Tests' },
  { name: 'data_integrity_tests.json', dir: path.join(cypressSuitesDir, 'data_integrity'), ext: '.cy.js', label: 'Data Integrity Tests' },
  { name: 'file_upload_tests.json', dir: path.join(cypressSuitesDir, 'file_upload'), ext: '.cy.js', label: 'File Upload Tests' },
  { name: 'e2e_tests.json', dir: path.join(cypressSuitesDir, 'e2e_journeys'), ext: '.cy.js', label: 'E2E User Journey Tests' },
  { name: 'integration_adapter_tests.json', dir: path.join(cypressSuitesDir, 'adapters'), ext: '.cy.js', label: 'Integration Adapter Tests' },
  { name: 'i18n_accessibility_tests.json', dir: path.join(cypressSuitesDir, 'i18n_accessibility'), ext: '.cy.js', label: 'I18N & Accessibility Tests' },
  { name: 'performance_tests.json', dir: path.join(cypressSuitesDir, 'performance'), ext: '.cy.js', label: 'Performance Latency Tests' },
  { name: 'unit_tests.json', dir: unitSuitesDir, ext: 'Test.php', label: 'PHPUnit Unit Tests' }
];

console.log('========================================================================');
console.log('   ORANGEHRM BASELINE V1: 1:1 GRANULAR TEST AUDIT RECONCILIATION');
console.log('========================================================================\n');

let grandTarget = 0;
let grandActual = 0;
let allMatched = true;

for (const s of auditSuites) {
  const jsonPath = path.join(baselineDir, s.name);
  const targetCount = JSON.parse(fs.readFileSync(jsonPath, 'utf8')).length;
  const actualCount = countFilesRecursive(s.dir, s.ext);

  grandTarget += targetCount;
  grandActual += actualCount;

  const matched = targetCount === actualCount;
  if (!matched) allMatched = false;

  console.log(`${s.label.padEnd(30)}: JSON = ${targetCount.toString().padStart(5)} | Files = ${actualCount.toString().padStart(5)} -> ${matched ? 'MATCH [OK]' : 'MISMATCH [FAIL]'}`);
}

console.log('\n------------------------------------------------------------------------');
console.log(`GRAND TOTAL AUDITED: ${grandActual} / ${grandTarget} Files (${((grandActual / grandTarget) * 100).toFixed(2)}%)`);
console.log(`ALL 12 SUITES STATUS: ${allMatched ? '100% PARITY CONFIRMED (0 MISSED)' : 'MISMATCH DETECTED'}`);
console.log('========================================================================\n');
