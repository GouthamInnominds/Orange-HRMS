/**
 * OrangeHRM QKG PIM Vertical Slice Milestone Runner
 * Coordinates AST parsing, Route extraction, Specification mapping,
 * Cypher generation, Neo4j ingestion, and simulated Test Impact Analysis (TIA).
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const PhpAstExtractor = require('./php_ast_extractor');
const RoutesExtractor = require('./routes_extractor');
const SpecExtractor = require('./spec_extractor');
const CypherGenerator = require('./cypher_generator');
const TiaEngine = require('./tia_engine');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const workspaceRoot = path.resolve(__dirname, '..', '..');
const pimDir = path.join(workspaceRoot, 'orange_hrm', 'src', 'plugins', 'orangehrmPimPlugin');
const baselineDir = path.join(workspaceRoot, 'OrangeHRM_Baseline_v1.0');
const outputDir = path.join(__dirname, 'output');

async function runPimVerticalSlice() {
  console.log('================================================================');
  console.log('   ORANGEHRM QKG VERSION 2: PIM VERTICAL SLICE MILESTONE');
  console.log('   Platform: QKG v2.0.0 | Schema: 2.0 | Parser: 2.0.0');
  console.log('================================================================\n');

  // Step 1: AST Extraction
  console.log('[Step 1/5] Extracting PHP AST for PIM plugin via php-parser...');
  const extractor = new PhpAstExtractor();
  const phpFiles = [];

  function collectPhpFiles(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'test') {
        collectPhpFiles(full);
      } else if (entry.name.endsWith('.php')) {
        phpFiles.push(full);
      }
    }
  }

  collectPhpFiles(path.join(pimDir, 'Api'));
  collectPhpFiles(path.join(pimDir, 'Service'));
  collectPhpFiles(path.join(pimDir, 'Dao'));
  collectPhpFiles(path.join(pimDir, 'entity'));

  const astClasses = [];
  const astEntities = [];
  for (const f of phpFiles) {
    const rel = path.relative(workspaceRoot, f);
    const parsed = extractor.parseFile(f, rel);
    if (parsed) {
      astClasses.push(...parsed.classes);
      astEntities.push(...parsed.entities);
    }
  }
  console.log(`✓ Parsed ${phpFiles.length} PHP source files.`);
  console.log(`✓ Discovered ${astClasses.length} Classes/Interfaces/Traits.`);
  console.log(`✓ Extracted ${astClasses.reduce((acc, c) => acc + c.methods.length, 0)} Methods.`);
  console.log(`✓ Identified ${astEntities.length} Doctrine Entities with Table mappings.`);

  // Step 2: Route Extraction
  console.log('\n[Step 2/5] Extracting API Routes from PIM routes.yaml...');
  const routesFile = path.join(pimDir, 'config', 'routes.yaml');
  const endpoints = RoutesExtractor.parseRoutesFile(routesFile, 'orangehrmPimPlugin');
  console.log(`✓ Extracted ${endpoints.length} discrete API Endpoints (GET, POST, PUT, DELETE).`);

  // Step 3: Specifications and Tests Extraction
  console.log('\n[Step 3/5] Extracting Specifications and Multi-Tier Test Suite...');
  const specExtractor = new SpecExtractor(baselineDir);
  const specData = specExtractor.extractPimSpecifications();
  const testData = specExtractor.extractPimTestCases();
  console.log(`✓ Extracted ${specData.features.length} Features and ${specData.requirements.length} Requirements.`);
  console.log(`✓ Mapped ${testData.functional.length} Functional, ${testData.api.length} API, and ${testData.unit.length} Unit Tests.`);

  // Step 4: Cypher Generation
  console.log('\n[Step 4/5] Generating Idempotent Cypher Ingestion Script...');
  const cypherGen = new CypherGenerator();
  const statements = cypherGen.generatePimCypher(specData, endpoints, { classes: astClasses }, testData);
  const cypherPath = path.join(outputDir, 'qkg_pim_baseline.cypher');
  cypherGen.exportToCypherFile(statements, cypherPath);
  console.log(`✓ Generated ${statements.length} idempotent Cypher transactional statements.`);
  console.log(`✓ Standalone Cypher script saved to: ${cypherPath}`);

  // Step 5: Test Impact Analysis (TIA) Simulation
  console.log('\n[Step 5/5] Executing Simulated Code Change Impact Analysis...');
  const tia = new TiaEngine({
    astData: { classes: astClasses },
    endpoints: endpoints,
    specData: specData,
    testData: testData
  });

  const tiaResult = tia.analyzeMethodChange('OrangeHRM\\Pim\\Api\\EmployeeAPI::getOne');

  console.log('\n--- TIA IMPACT RESULTS ---');
  console.log(`Changed Method:      ${tiaResult.changed_artifact.signature}`);
  console.log(`Source File:         ${tiaResult.changed_artifact.source_file} (Lines: ${tiaResult.changed_artifact.line_range})`);
  console.log(`Affected Workflows:  ${tiaResult.business_impact.workflows.map(w => w.name).join(', ')}`);
  console.log(`Affected Features:   ${tiaResult.business_impact.features.map(f => f.name).join(', ')}`);
  console.log(`Affected Req IDs:    ${tiaResult.business_impact.requirements.map(r => r.id).join(', ')}`);
  console.log(`Affected Endpoints:  ${tiaResult.affected_endpoints.map(e => e.id).join(', ')}`);
  console.log(`\nRecommended Regression Test Suite (${tiaResult.metrics.total_regression_candidates} Total Impacted):`);
  console.log('Unit Tests:');
  tiaResult.regression_recommendations.unit_tests.forEach(t => console.log(`  - [${t.id}] ${t.name} (${t.file})`));
  console.log('API Tests:');
  tiaResult.regression_recommendations.api_tests.forEach(t => console.log(`  - [${t.id}] ${t.endpoint} [Priority: ${t.priority}]`));
  console.log('Functional Tests:');
  tiaResult.regression_recommendations.functional_tests.forEach(t => console.log(`  - [${t.id}] ${t.name} [Priority: ${t.priority}]`));
  console.log(`Confidence Score:    ${tiaResult.metrics.confidence_score * 100}% (${tiaResult.metrics.evidence_chain})`);
  console.log('------------------------------------------------------\n');

  // Save TIA report as JSON
  const reportPath = path.join(outputDir, 'tia_simulation_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(tiaResult, null, 2));
  console.log(`✓ TIA Report saved to: ${reportPath}`);

  console.log('\n================================================================');
  console.log('   PIM VERTICAL SLICE MILESTONE COMPLETED WITH 100% SUCCESS');
  console.log('================================================================\n');
}

runPimVerticalSlice().catch(err => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});
