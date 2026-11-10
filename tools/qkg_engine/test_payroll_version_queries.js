const path = require('path');
const dotenv = require('dotenv');
const neo4j = require('../node_modules/neo4j-driver');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'admin123';

async function verify() {
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();
  try {
    console.log('1. Release Comparison:');
    const relRes = await session.run(`
      MATCH (r:Release)
      RETURN r.version_id AS ver, r.name AS name, r.branch AS branch, r.status AS status
    `);
    relRes.records.forEach(r => {
      console.log(`   [${r.get('ver')}] ${r.get('name')} (Branch: ${r.get('branch')}, Status: ${r.get('status')})`);
    });

    console.log('\n2. Feature Counts by Version:');
    const fv1 = await session.run(`
      MATCH (r:Release {version_id: 'v1.0'})<-[:SUPPORTED_IN]-(f:Feature)
      RETURN count(f) AS cnt
    `);
    const fv2 = await session.run(`
      MATCH (r:Release {version_id: 'v2.1'})<-[:SUPPORTED_IN]-(f:Feature)
      RETURN count(f) AS cnt
    `);
    const fDelta = await session.run(`
      MATCH (r:Release {version_id: 'v2.1'})<-[:INTRODUCED_IN]-(f:Feature)
      RETURN count(f) AS cnt
    `);
    console.log(`   - Features in v1.0   : ${fv1.records[0].get('cnt').toNumber()}`);
    console.log(`   - Features in v2.1   : ${fv2.records[0].get('cnt').toNumber()}`);
    console.log(`   - New v2.1 Features  : +${fDelta.records[0].get('cnt').toNumber()}`);

    console.log('\n3. Payroll Full Traceability Sample (UserStory -> Feature -> Rule -> Endpoint):');
    const traceRes = await session.run(`
      MATCH (p:Persona)-[:EXECUTES]->(us:UserStory)-[:BELONGS_TO]->(f:Feature)
      WHERE us.story_id STARTS WITH 'US-PAY-'
      OPTIONAL MATCH (us)-[:GOVERNED_BY]->(br:BusinessRule)
      OPTIONAL MATCH (f)-[:EXPOSES]->(ep:ApiEndpoint)
      RETURN us.story_id AS storyId, us.title AS title, p.name AS persona, f.name AS feature, br.rule_id AS ruleId, count(ep) AS endpoints
      LIMIT 6
    `);
    traceRes.records.forEach(r => {
      console.log(`   * ${r.get('storyId')}: ${r.get('title')}`);
      console.log(`     Persona: ${r.get('persona')} | Feature: ${r.get('feature')} | Rule: ${r.get('ruleId') || 'None'} | Endpoints: ${r.get('endpoints')}`);
    });

    console.log('\n4. Verification: Can we query the exact v1.0 baseline snapshot?');
    const snap1 = await session.run(`
      MATCH (n) WHERE 'v1.0' IN n.versions
      RETURN count(n) AS total
    `);
    console.log(`   ✓ v1.0 snapshot node count: ${snap1.records[0].get('total').toNumber()} nodes`);

    console.log('\n5. Verification: Can we query the exact v2.1 enhanced snapshot?');
    const snap2 = await session.run(`
      MATCH (n) WHERE 'v2.1' IN n.versions
      RETURN count(n) AS total
    `);
    console.log(`   ✓ v2.1 snapshot node count: ${snap2.records[0].get('total').toNumber()} nodes`);

  } finally {
    await session.close();
    await driver.close();
  }
}

verify();
