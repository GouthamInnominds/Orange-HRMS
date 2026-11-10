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
    console.log('========================================================================');
    console.log('   FULL-STACK LIVE CYPHER QUERIES: 360-DEGREE QUALITY INTELLIGENCE');
    console.log('========================================================================\n');

    console.log('1. Full 360-Degree Vertical Traceability:');
    console.log('   (Persona) -> (UserStory) -> (UIComponent) -> (ApiEndpoint) -> (Class) -> (Method) -> (TestCase)\n');

    const traceQuery = `
      MATCH (p:Persona { persona_id: 'PERSONA_HR_MANAGER' })-[:EXECUTES]->(us:UserStory { story_id: 'US_PIM_001' })
      MATCH (us)-[:IMPLEMENTED_BY]->(uic:UIComponent)
      MATCH (uic)-[:CALLS_ENDPOINT]->(e:ApiEndpoint)
      MATCH (e)-[:HANDLED_BY]->(c:Class)-[:DECLARES]->(m:Method)
      MATCH (tc:TestCase)-[:VERIFIES_STORY]->(us)
      RETURN p.name as Persona,
             us.title as UserStory,
             uic.name as UIComponent,
             e.http_method + ' ' + e.path as Endpoint,
             c.name as BackendClass,
             m.name as BackendMethod,
             count(DISTINCT tc) as VerifiedTests
      LIMIT 1
    `;
    const traceRes = await session.run(traceQuery);
    for (const record of traceRes.records) {
      console.log('360-Degree Trace Result:', {
        Persona: record.get('Persona'),
        UserStory: record.get('UserStory'),
        UIComponent: record.get('UIComponent'),
        Endpoint: record.get('Endpoint'),
        BackendClass: record.get('BackendClass'),
        BackendMethod: record.get('BackendMethod'),
        VerifiedTests: record.get('VerifiedTests').toNumber()
      });
    }

    console.log('\n2. Frontend Change Impact Analysis:');
    console.log('   Simulating change in Vue component SaveEmployee.vue -> Finding affected stories, endpoints & tests\n');

    const uiTiaQuery = `
      MATCH (uic:UIComponent { name: 'SaveEmployee' })
      OPTIONAL MATCH (pg:UIPage)-[:RENDERS]->(uic)
      OPTIONAL MATCH (us:UserStory)-[:IMPLEMENTED_BY]->(uic)
      OPTIONAL MATCH (uic)-[:CALLS_ENDPOINT]->(e:ApiEndpoint)
      OPTIONAL MATCH (tc:TestCase)-[:VERIFIES_STORY]->(us)
      RETURN uic.name as ChangedComponent,
             uic.file as File,
             collect(DISTINCT pg.page_id) as RenderedPages,
             collect(DISTINCT us.story_id) as AffectedStories,
             collect(DISTINCT e.path) as InvokedEndpoints,
             count(DISTINCT tc) as ImpactedTests
    `;
    const uiTiaRes = await session.run(uiTiaQuery);
    for (const record of uiTiaRes.records) {
      console.log('Frontend TIA Traversal Result:', {
        ChangedComponent: record.get('ChangedComponent'),
        File: record.get('File'),
        RenderedPages: record.get('RenderedPages'),
        AffectedStories: record.get('AffectedStories'),
        InvokedEndpoints: record.get('InvokedEndpoints'),
        ImpactedTests: record.get('ImpactedTests').toNumber()
      });
    }

    console.log('\n3. Database Table to Entity & Method Lineage:');
    const tableQuery = `
      MATCH (dt:DatabaseTable { name: 'ohrm_user' })<-[:MAPS_TO]-(de:DatabaseEntity)
      MATCH (c:Class { fqcn: de.fqcn })-[:DECLARES]->(m:Method)
      RETURN dt.name as Table, de.name as Entity, count(m) as DeclaredMethods
    `;
    const tableRes = await session.run(tableQuery);
    for (const record of tableRes.records) {
      console.log('Table Lineage Result:', {
        Table: record.get('Table'),
        Entity: record.get('Entity'),
        DeclaredMethods: record.get('DeclaredMethods').toNumber()
      });
    }

    console.log('\n========================================================================\n');
  } finally {
    await session.close();
    await driver.close();
  }
}

testLiveQueries().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
