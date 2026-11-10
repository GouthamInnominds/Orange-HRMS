const path = require('path');
const dotenv = require('dotenv');
const neo4j = require('../node_modules/neo4j-driver');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'admin123';

async function testLiveQueries() {
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  try {
    console.log('================================================================');
    console.log('   LIVE NEO4J CYPHER QUERIES: QUALITY ENGINEERING INTELLIGENCE');
    console.log('================================================================\n');

    console.log('1. End-to-End Traceability Query:');
    console.log('   (Requirement) <-> (Feature) <-> (ApiEndpoint) <-> (Class) <-> (TestCase)\n');

    const traceQuery = `
      MATCH (r:Requirement { requirement_id: 'FR_PIM_001' })<-[:HAS_REQUIREMENT]-(rg:RequirementGroup)<-[:HAS_REQUIREMENT_GROUP]-(f:Feature)-[:EXPOSES]->(e:ApiEndpoint)-[:HANDLED_BY]->(c:Class)
      MATCH (tc:TestCase)-[:VERIFIES]->(r)
      RETURN r.title as Requirement,
             f.name as Feature,
             count(DISTINCT e) as Endpoints,
             c.name as HandlerClass,
             count(DISTINCT tc) as VerifiedTests
    `;
    const traceRes = await session.run(traceQuery);
    for (const record of traceRes.records) {
      console.log('Trace Result:', {
        Requirement: record.get('Requirement'),
        Feature: record.get('Feature'),
        Endpoints: record.get('Endpoints').toNumber(),
        HandlerClass: record.get('HandlerClass'),
        VerifiedTests: record.get('VerifiedTests').toNumber()
      });
    }

    console.log('\n2. Test Impact Analysis (TIA) Graph Traversal:');
    console.log('   Simulating change in EmployeeAPI::getOne -> Finding affected business context\n');

    const tiaQuery = `
      MATCH (c:Class { name: 'EmployeeAPI' })-[:DECLARES]->(m:Method { name: 'getOne' })
      MATCH (e:ApiEndpoint)-[:HANDLED_BY]->(c)
      MATCH (f:Feature)-[:EXPOSES]->(e)
      MATCH (f)-[:HAS_REQUIREMENT_GROUP]->()-[:HAS_REQUIREMENT]->(r:Requirement)
      MATCH (w:BusinessWorkflow)-[:DECOMPOSES_TO]->(f)
      RETURN m.name as ChangedMethod,
             c.name as Class,
             count(DISTINCT e) as AffectedEndpoints,
             f.name as AffectedFeature,
             w.name as AffectedWorkflow,
             collect(DISTINCT r.requirement_id) as AffectedRequirements
    `;
    const tiaRes = await session.run(tiaQuery);
    for (const record of tiaRes.records) {
      console.log('TIA Traversal Result:', {
        ChangedMethod: record.get('ChangedMethod'),
        Class: record.get('Class'),
        AffectedEndpoints: record.get('AffectedEndpoints').toNumber(),
        AffectedFeature: record.get('AffectedFeature'),
        AffectedWorkflow: record.get('AffectedWorkflow'),
        AffectedRequirements: record.get('AffectedRequirements')
      });
    }

    console.log('\n3. ORM Entity to Database Table Mapping:');
    const ormQuery = `
      MATCH (de:DatabaseEntity)-[:MAPS_TO]->(dt:DatabaseTable)
      RETURN de.name as Entity, dt.name as Table LIMIT 5
    `;
    const ormRes = await session.run(ormQuery);
    for (const record of ormRes.records) {
      console.log(`  Entity: ${record.get('Entity')} -> Table: ${record.get('Table')}`);
    }

    console.log('\n================================================================\n');
  } finally {
    await session.close();
    await driver.close();
  }
}

testLiveQueries().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});

