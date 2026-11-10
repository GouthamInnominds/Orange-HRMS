const neo4j = require('neo4j-driver');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const payrollTests = require('./output/payroll_test_suite.json');

async function run() {
  const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
  const user = process.env.NEO4J_USER || 'neo4j';
  const password = process.env.NEO4J_PASSWORD || 'admin123';
  const database = process.env.NEO4J_DATABASE || 'neo4j';

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session({ database });

  console.log(`Connected to Neo4j. Ingesting ${payrollTests.length} Payroll Test Cases...`);

  try {
    // 1. Create or ensure Test Suites exist
    const suites = [...new Set(payrollTests.map(t => t.suite))];
    for (const suiteName of suites) {
      await session.run(`
        MERGE (s:TestSuite {name: $suiteName})
        ON CREATE SET s.version = 'v2.0.0-payroll', s.module = 'Payroll', s.createdAt = datetime()
        WITH s
        MATCH (m:Module {name: 'payroll'})
        MERGE (m)-[:HAS_TEST_SUITE]->(s)
      `, { suiteName });
    }
    console.log(`Ingested ${suites.length} Payroll Test Suites.`);

    // 2. Ingest Test Cases in batches of 25
    for (let i = 0; i < payrollTests.length; i += 25) {
      const batch = payrollTests.slice(i, i + 25);
      await session.run(`
        UNWIND $batch AS t
        MERGE (tc:TestCase {id: t.id})
        SET tc.name = t.name,
            tc.layer = t.layer,
            tc.priority = t.priority,
            tc.status = t.status,
            tc.durationMs = t.durationMs,
            tc.version = 'v2.0.0-payroll',
            tc.module = 'Payroll'
        WITH tc, t
        MATCH (s:TestSuite {name: t.suite})
        MERGE (s)-[:CONTAINS_TEST]->(tc)
      `, { batch });
    }
    console.log(`Ingested all ${payrollTests.length} TestCase nodes into Neo4j under v2.0.0-payroll.`);

    // 3. Link Test Cases to User Stories
    await session.run(`
      MATCH (tc:TestCase) WHERE tc.suite = 'TS_Payroll_Calculation_Unit'
      MATCH (us:UserStory {key: 'US-PAY-001'})
      MERGE (us)-[:VERIFIED_BY]->(tc)
    `);

    await session.run(`
      MATCH (tc:TestCase) WHERE tc.suite = 'TS_Payroll_Calculation_Unit' AND tc.name CONTAINS 'EPF'
      MATCH (us:UserStory {key: 'US-PAY-002'})
      MERGE (us)-[:VERIFIED_BY]->(tc)
    `);

    await session.run(`
      MATCH (tc:TestCase) WHERE tc.suite = 'TS_Payroll_Lifecycle_Security'
      MATCH (us:UserStory {key: 'US-PAY-003'})
      MERGE (us)-[:VERIFIED_BY]->(tc)
    `);

    await session.run(`
      MATCH (tc:TestCase) WHERE tc.name CONTAINS 'my-salary-slips' OR tc.name CONTAINS 'Print Slip'
      MATCH (us:UserStory {key: 'US-PAY-004'})
      MERGE (us)-[:VERIFIED_BY]->(tc)
    `);

    console.log(`Linked TestCases to User Stories (US-PAY-001 through US-PAY-004).`);

    // 4. Verify count
    const res = await session.run(`
      MATCH (tc:TestCase {module: 'Payroll'})
      RETURN count(tc) AS count
    `);
    console.log(`Verification: Total Payroll TestCase nodes in Neo4j = ${res.records[0].get('count')}`);

  } catch (e) {
    console.error('Neo4j ingestion error:', e);
  } finally {
    await session.close();
    await driver.close();
  }
}

run();
