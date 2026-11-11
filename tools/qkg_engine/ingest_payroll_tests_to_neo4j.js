const fs = require('fs');
const path = require('path');
const neo4j = require('../node_modules/neo4j-driver');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const RELEASE_ID = 'v2.2-india-payroll';
const TESTS_JSON_PATH = path.resolve(
  __dirname,
  '../../OrangeHRM_Payroll_Extension_v2.2/04_Test_Strategy/payroll_all_executed_tests.json'
);

async function ingestPayrollTests(session, releaseId = RELEASE_ID) {
  const payrollTests = JSON.parse(fs.readFileSync(TESTS_JSON_PATH, 'utf8'));

  // Clean prior Payroll/stale TestSuite and TestCase nodes cleanly without touching v1.0 core tests
  await session.run(`
    MATCH (tc:TestCase)
    WHERE coalesce(tc.version, '') IN ['v2.0.0-payroll', 'v2.1', $releaseId]
       OR coalesce(tc.introduced_in, '') IN ['v2.0.0-payroll', 'v2.1', $releaseId]
       OR coalesce(tc.module, '') = 'Payroll'
       OR tc.testcase_id STARTS WITH 'TC_PAY_'
       OR tc.testcase_id STARTS WITH 'E2E-'
       OR tc.testcase_id STARTS WITH 'UI-'
    DETACH DELETE tc
  `, { releaseId });

  await session.run(`
    MATCH (ts:TestSuite)
    WHERE coalesce(ts.version, '') IN ['v2.0.0-payroll', 'v2.1', $releaseId]
       OR coalesce(ts.module, '') = 'Payroll'
    DETACH DELETE ts
  `, { releaseId });

  const suites = [...new Set(payrollTests.map((t) => t.suite))];
  await session.run(`
    UNWIND $suites AS suiteName
    MERGE (s:TestSuite { name: suiteName })
    SET s.version = $releaseId,
        s.introduced_in = $releaseId,
        s.versions = [$releaseId],
        s.module = 'Payroll',
        s.updatedAt = datetime()
    WITH s
    MATCH (p:Plugin { name: 'orangehrmPayrollPlugin' })
    MERGE (p)-[:HAS_TEST_SUITE]->(s)
    WITH s
    MATCH (rel:Release { version_id: $releaseId })
    MERGE (s)-[:INTRODUCED_IN]->(rel)
    MERGE (s)-[:SUPPORTED_IN]->(rel)
  `, { suites, releaseId });

  await session.run(`
    UNWIND $tests AS t
    CREATE (tc:TestCase {
      testcase_id: t.testcase_id,
      id: t.id,
      name: t.name,
      objective: t.objective,
      layer: t.layer,
      level: t.test_level,
      priority: t.priority,
      status: t.status,
      execution_status: t.execution_status,
      automation_status: t.automation_status,
      durationMs: t.durationMs,
      runner: t.runner,
      module: 'Payroll',
      plugin: 'orangehrmPayrollPlugin',
      feature_id: t.feature_id,
      version: $releaseId,
      introduced_in: $releaseId,
      versions: [$releaseId]
    })
    WITH tc, t
    MATCH (s:TestSuite { name: t.suite })
    MERGE (s)-[:CONTAINS_TEST]->(tc)
    WITH tc, t
    MATCH (rel:Release { version_id: $releaseId })
    MERGE (tc)-[:INTRODUCED_IN]->(rel)
    MERGE (tc)-[:SUPPORTED_IN]->(rel)
    WITH tc, t
    UNWIND coalesce(t.story_ids, []) AS sid
    MATCH (us:UserStory) WHERE us.story_id = sid OR us.key = sid
    MERGE (tc)-[:VERIFIES_STORY]->(us)
    MERGE (us)-[:VERIFIED_BY]->(tc)
  `, { tests: payrollTests, releaseId });

  await session.run(`
    UNWIND $tests AS t
    MATCH (tc:TestCase { testcase_id: t.testcase_id, version: $releaseId })
    UNWIND coalesce(t.requirement_ids, []) AS rid
    MATCH (req:Requirement { requirement_id: rid })
    MERGE (tc)-[:VERIFIES]->(req)
  `, { tests: payrollTests, releaseId });

  await session.run(`
    UNWIND $tests AS t
    MATCH (tc:TestCase { testcase_id: t.testcase_id, version: $releaseId })
    UNWIND coalesce(t.rule_ids, []) AS brid
    MATCH (br:BusinessRule { rule_id: brid })
    MERGE (tc)-[:VALIDATES_RULE]->(br)
  `, { tests: payrollTests, releaseId });

  const countRes = await session.run(`
    MATCH (tc:TestCase { version: $releaseId })
    RETURN count(tc) AS count
  `, { releaseId });

  return {
    suitesCount: suites.length,
    testCasesCount: countRes.records[0].get('count').toNumber(),
  };
}

async function runStandalone() {
  const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
  const user = process.env.NEO4J_USER || 'neo4j';
  const password = process.env.NEO4J_PASSWORD || 'admin123';
  const database = process.env.NEO4J_DATABASE || 'neo4j';

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session({ database });
  try {
    const res = await ingestPayrollTests(session, RELEASE_ID);
    console.log(`Synced ${res.suitesCount} TestSuites and ${res.testCasesCount} executed Payroll TestCases under ${RELEASE_ID}.`);
  } finally {
    await session.close();
    await driver.close();
  }
}

if (require.main === module) {
  runStandalone().catch((err) => {
    console.error('Neo4j payroll test ingestion error:', err);
    process.exit(1);
  });
}

module.exports = { ingestPayrollTests, RELEASE_ID };
