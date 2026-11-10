const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '..');
const testcasesOutputDir = path.join(workspaceRoot, 'testcases_output');
const testStrategyDir = path.join(workspaceRoot, 'OrangeHRM_Baseline_v1.0', '04_Test_Strategy');

// Helper to escape CSV cell
function escapeCsv(cell) {
  if (cell === null || cell === undefined) return '""';
  const str = String(cell);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Helper to parse CSV safely
function parseCsv(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const cells = [];
    let inQuotes = false;
    let currentCell = '';
    
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cells.push(currentCell.trim());
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    cells.push(currentCell.trim());
    if (cells.length >= 7) {
      rows.push({
        feature: cells[0] || 'General',
        testcase_id: cells[1] || `TC_${i}`,
        testcase_name: cells[2] || '',
        test_objective: cells[3] || '',
        test_steps: cells[4] ? cells[4].split('|').map(s => s.trim()) : [],
        expected_results: [cells[5] || ''],
        priority: cells[6] || 'Medium',
        test_type: [cells[7] || 'Functional'],
        test_level: 'Component/Feature',
        quality_attributes: ['FunctionalCorrectness'],
        automation_status: 'Automated',
        execution_status: 'Ready'
      });
    }
  }
  return rows;
}

// Convert JSON tests array to standard CSV string
function jsonToCsv(tests) {
  const header = ['Feature name', 'Testcase ID', 'Testcase Name', 'Testcase Objective', 'Steps', 'Expected Result', 'priority', 'Testcase Type'];
  const rows = [header.map(escapeCsv).join(',')];

  for (const t of tests) {
    const feat = t.feature || t.feature_id || t.workflow_name || t.journey_name || t.owasp_category || t.plugin || t.component_category || 'General';
    const id = t.testcase_id || '';
    const name = t.testcase_name || t.route_name || t.method_name || '';
    const obj = t.test_objective || (t.target_interface ? `Target: ${JSON.stringify(t.target_interface)}` : '');
    const steps = (t.test_steps && Array.isArray(t.test_steps)) ? t.test_steps.join(' | ') : (t.test_file ? `File: ${t.test_file}::${t.method_name}` : '');
    const exp = (t.expected_results && Array.isArray(t.expected_results)) ? t.expected_results.join('; ') : (t.expected_status ? `HTTP ${t.expected_status}` : 'Pass');
    const prio = t.priority || 'Medium';
    const type = (t.test_type && Array.isArray(t.test_type)) ? t.test_type.join('/') : (t.test_level || 'Functional');

    rows.push([
      escapeCsv(feat),
      escapeCsv(id),
      escapeCsv(name),
      escapeCsv(obj),
      escapeCsv(steps),
      escapeCsv(exp),
      escapeCsv(prio),
      escapeCsv(type)
    ].join(','));
  }

  return rows.join('\r\n');
}

console.log('--- Step 1: Processing original CSVs from testcases_output ---');
const originalCsvs = fs.readdirSync(testcasesOutputDir).filter(f => f.endsWith('.csv'));

for (const csvFile of originalCsvs) {
  const rawCsv = fs.readFileSync(path.join(testcasesOutputDir, csvFile), 'utf8');
  const parsedJson = parseCsv(rawCsv);
  const jsonName = csvFile.replace('.csv', '.json');

  // Write JSON to testcases_output and to 04_Test_Strategy
  fs.writeFileSync(path.join(testcasesOutputDir, jsonName), JSON.stringify(parsedJson, null, 2));
  fs.writeFileSync(path.join(testStrategyDir, jsonName), JSON.stringify(parsedJson, null, 2));

  // Copy CSV to 04_Test_Strategy
  fs.writeFileSync(path.join(testStrategyDir, csvFile), rawCsv);
  console.log(`Synced ${csvFile} <-> ${jsonName} in both directories (${parsedJson.length} tests).`);
}

console.log('\n--- Step 2: Generating CSV mirrors for all test suite JSONs ---');
const jsonFiles = fs.readdirSync(testStrategyDir).filter(f => f.endsWith('.json') && !originalCsvs.map(c => c.replace('.csv', '.json')).includes(f));

for (const jFile of jsonFiles) {
  const jsonPath = path.join(testStrategyDir, jFile);
  const tests = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const csvName = jFile.replace('.json', '.csv');
  
  if (Array.isArray(tests)) {
    const csvContent = jsonToCsv(tests);
    // Write CSV in testStrategyDir
    fs.writeFileSync(path.join(testStrategyDir, csvName), csvContent);
    // Also copy both JSON and CSV to testcasesOutputDir
    fs.writeFileSync(path.join(testcasesOutputDir, csvName), csvContent);
    fs.writeFileSync(path.join(testcasesOutputDir, jFile), JSON.stringify(tests, null, 2));
    console.log(`Generated and synced ${csvName} (${tests.length} tests).`);
  }
}

console.log('\nAll testcases synchronized in both JSON and CSV formats across:');
console.log('1. C:\\Users\\parav\\Workspace\\Orange HRMS\\OrangeHRM_Baseline_v1.0\\04_Test_Strategy');
console.log('2. C:\\Users\\parav\\Workspace\\Orange HRMS\\testcases_output');

