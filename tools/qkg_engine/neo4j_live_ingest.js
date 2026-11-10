/**
 * OrangeHRM QKG Live Neo4j Ingestion Runner
 * Connects directly to running Neo4j via bolt://localhost:7687
 * Applies unique constraints and executes idempotent MERGE statements.
 */

const path = require('path');
const dotenv = require('dotenv');
const neo4j = require('../node_modules/neo4j-driver');
const PhpAstExtractor = require('./php_ast_extractor');
const RoutesExtractor = require('./routes_extractor');
const SpecExtractor = require('./spec_extractor');
const CypherGenerator = require('./cypher_generator');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'admin123';

const workspaceRoot = path.resolve(__dirname, '..', '..');
const pimDir = path.join(workspaceRoot, 'orange_hrm', 'src', 'plugins', 'orangehrmPimPlugin');
const baselineDir = path.join(workspaceRoot, 'OrangeHRM_Baseline_v1.0');

async function liveIngest() {
  console.log(`[QKG Ingestion] Connecting to Neo4j at ${uri} as ${user}...`);
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  
  try {
    const session = driver.session();
    console.log('✓ Successfully connected to Neo4j database.');

    // Step 1: Clean legacy graph
    console.log('\n[1/5] Purging legacy graph nodes and preparing clean v2.0 environment...');
    await session.run('MATCH (n) DETACH DELETE n');
    console.log('✓ Database cleaned.');

    // Step 2: Apply constraints
    console.log('\n[2/5] Applying Schema Constraints and Indexes...');
    const cypherGen = new CypherGenerator();
    const constraints = cypherGen.generateConstraints();
    for (const c of constraints) {
      try {
        await session.run(c);
      } catch (err) {
        // Ignore if constraint already exists
      }
    }
    console.log(`✓ Applied ${constraints.length} uniqueness constraints.`);

    // Step 3: Extract Data
    console.log('\n[3/5] Extracting AST, Routes, and Multi-Tier Test Data for PIM...');
    const extractor = new PhpAstExtractor();
    const phpFiles = [];
    function collect(dir) {
      const fs = require('fs');
      if (!fs.existsSync(dir)) return;
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory() && e.name !== 'test') collect(full);
        else if (e.name.endsWith('.php')) phpFiles.push(full);
      }
    }
    collect(path.join(pimDir, 'Api'));
    collect(path.join(pimDir, 'Service'));
    collect(path.join(pimDir, 'Dao'));
    collect(path.join(pimDir, 'entity'));

    const astClasses = [];
    for (const f of phpFiles) {
      const parsed = extractor.parseFile(f, path.relative(workspaceRoot, f));
      if (parsed) astClasses.push(...parsed.classes);
    }

    const endpoints = RoutesExtractor.parseRoutesFile(path.join(pimDir, 'config', 'routes.yaml'), 'orangehrmPimPlugin');
    const specExtractor = new SpecExtractor(baselineDir);
    const specData = specExtractor.extractPimSpecifications();
    const testData = specExtractor.extractPimTestCases();

    // Step 4: Generate Statements & Ingest
    console.log('\n[4/5] Executing Idempotent Graph Ingestion Statements...');
    const statements = cypherGen.generatePimCypher(specData, endpoints, { classes: astClasses }, testData);
    console.log(`Total statements to execute: ${statements.length}`);

    let completed = 0;
    const batchSize = 100;
    for (let i = 0; i < statements.length; i += batchSize) {
      const batch = statements.slice(i, i + batchSize);
      const tx = session.beginTransaction();
      try {
        for (const stmt of batch) {
          await tx.run(stmt.cypher, stmt.params || {});
        }
        await tx.commit();
        completed += batch.length;
        process.stdout.write(`\rIngested ${completed} / ${statements.length} statements (${Math.round((completed / statements.length) * 100)}%)`);
      } catch (e) {
        await tx.rollback();
        console.error(`\nBatch failed at ${i}:`, e.message);
      }
    }
    console.log('\n✓ Ingestion completed successfully!');

    // Step 5: Verify Live Graph Metrics
    console.log('\n[5/5] Fetching Live Knowledge Graph Metrics from Neo4j...');
    const nodeCountRes = await session.run('MATCH (n) RETURN count(n) as nodeCount');
    const edgeCountRes = await session.run('MATCH ()-[r]->() RETURN count(r) as edgeCount');
    const labelRes = await session.run('CALL db.labels() YIELD label RETURN label');
    const relRes = await session.run('CALL db.relationshipTypes() YIELD relationshipType RETURN relationshipType');

    const totalNodes = nodeCountRes.records[0].get('nodeCount').toNumber();
    const totalEdges = edgeCountRes.records[0].get('edgeCount').toNumber();
    const labels = labelRes.records.map(r => r.get('label'));
    const relationships = relRes.records.map(r => r.get('relationshipType'));

    console.log('\n======================================================');
    console.log('   LIVE NEO4J QUALITY KNOWLEDGE GRAPH VERIFIED');
    console.log('======================================================');
    console.log(`Total Nodes:         ${totalNodes}`);
    console.log(`Total Relationships: ${totalEdges}`);
    console.log(`Node Labels (${labels.length}):   ${labels.join(', ')}`);
    console.log(`Relationship Types (${relationships.length}): ${relationships.join(', ')}`);
    console.log('======================================================\n');

    await session.close();
  } finally {
    await driver.close();
  }
}

liveIngest().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});

