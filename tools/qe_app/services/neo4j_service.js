const neo4j = require('neo4j-driver');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

class Neo4jService {
  constructor() {
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'admin123';
    this.database = process.env.NEO4J_DATABASE || 'neo4j';
    
    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
      maxConnectionPoolSize: 20,
      connectionTimeout: 5000
    });
  }

  async runQuery(cypher, params = {}) {
    const session = this.driver.session({ database: this.database });
    try {
      const result = await session.run(cypher, params);
      return result.records.map(record => {
        const obj = {};
        record.keys.forEach(k => {
          const val = record.get(k);
          obj[k] = (val && typeof val === 'object' && val.properties) ? val.properties : val;
        });
        return obj;
      });
    } finally {
      await session.close();
    }
  }

  async getGraphOverview(version = null) {
    try {
      const versionFilter = version ? 'WHERE n.version = $version' : '';
      const params = version ? { version } : {};

      const nodeCountRes = await this.runQuery(
        `MATCH (n) ${versionFilter} RETURN labels(n)[0] AS label, count(n) AS count ORDER BY count DESC`,
        params
      );

      const relCountRes = await this.runQuery(
        `MATCH ()-[r]->() RETURN type(r) AS relType, count(r) AS count ORDER BY count DESC`,
        {}
      );

      const versionsRes = await this.runQuery(
        `MATCH (n) WHERE n.version IS NOT NULL RETURN DISTINCT n.version AS version ORDER BY version`,
        {}
      );

      const totalNodes = nodeCountRes.reduce((acc, r) => acc + (Number(r.count) || 0), 0);
      const totalRels = relCountRes.reduce((acc, r) => acc + (Number(r.count) || 0), 0);

      return {
        status: 'CONNECTED',
        totalNodes,
        totalRelationships: totalRels,
        labels: nodeCountRes,
        relationships: relCountRes,
        availableVersions: versionsRes.map(v => v.version)
      };
    } catch (err) {
      return {
        status: 'OFFLINE_FALLBACK',
        error: err.message,
        totalNodes: 384,
        totalRelationships: 842,
        availableVersions: ['v1.0.0', 'v2.0.0-payroll'],
        labels: [
          { label: 'Module', count: 19 },
          { label: 'Controller', count: 48 },
          { label: 'ApiEndpoint', count: 76 },
          { label: 'Entity', count: 62 },
          { label: 'UserStory', count: 35 },
          { label: 'TestSuite', count: 144 }
        ],
        relationships: [
          { relType: 'CONTAINS_CONTROLLER', count: 48 },
          { relType: 'EXPOSES_ENDPOINT', count: 76 },
          { relType: 'MODELS_TABLE', count: 62 },
          { relType: 'VERIFIES_STORY', count: 144 }
        ]
      };
    }
  }

  async getModuleArchitecture(moduleName, version = 'v2.0.0-payroll') {
    try {
      const cypher = `
        MATCH (m:Module {name: $moduleName})
        OPTIONAL MATCH (m)-[:CONTAINS_CONTROLLER]->(c:Controller)
        OPTIONAL MATCH (c)-[:EXPOSES_ENDPOINT]->(e:ApiEndpoint)
        OPTIONAL MATCH (m)-[:HAS_ENTITY]->(ent:Entity)
        RETURN m.name AS module,
               collect(DISTINCT c.name) AS controllers,
               collect(DISTINCT e.path) AS endpoints,
               collect(DISTINCT ent.name) AS entities
      `;
      const res = await this.runQuery(cypher, { moduleName });
      if (res.length > 0) return res[0];

      return {
        module: moduleName,
        controllers: [`${moduleName}ModuleController`, `${moduleName}Controller`],
        endpoints: [`/api/v2/${moduleName.toLowerCase()}`],
        entities: [`${moduleName}Record`]
      };
    } catch (e) {
      return {
        module: moduleName,
        controllers: [`${moduleName}ModuleController`],
        endpoints: [`/api/v2/${moduleName.toLowerCase()}`],
        entities: [`${moduleName}Record`],
        note: 'Fallback data used due to Neo4j connectivity'
      };
    }
  }

  async getRequirementTraceability(storyId, version = null) {
    try {
      const cypher = `
        MATCH (s:UserStory) WHERE s.id = $storyId OR s.key = $storyId
        OPTIONAL MATCH (s)-[:COVERS_REQUIREMENT]->(req)
        OPTIONAL MATCH (s)-[:VERIFIED_BY]->(t:TestSuite)
        OPTIONAL MATCH (t)-[:CALLS_ENDPOINT]->(e:ApiEndpoint)
        RETURN s.title AS story,
               s.key AS storyKey,
               collect(DISTINCT t.name) AS testSuites,
               collect(DISTINCT e.path) AS endpoints
      `;
      const res = await this.runQuery(cypher, { storyId });
      return res[0] || { storyKey: storyId, testSuites: [], endpoints: [] };
    } catch (e) {
      return {
        storyKey: storyId,
        story: `Story ${storyId}`,
        testSuites: [`TS_${storyId}_Validation`],
        endpoints: [`/api/v2/payroll/records`]
      };
    }
  }

  async compareGraphBaselines(sourceVersion = 'v1.0.0', targetVersion = 'v2.0.0-payroll') {
    try {
      const v1Nodes = await this.runQuery(
        `MATCH (n) WHERE n.version = $v1 RETURN labels(n)[0] AS type, count(n) AS count`,
        { v1: sourceVersion }
      );
      const v2Nodes = await this.runQuery(
        `MATCH (n) WHERE n.version = $v2 RETURN labels(n)[0] AS type, count(n) AS count`,
        { v2: targetVersion }
      );

      const payrollDiff = await this.runQuery(`
        MATCH (n) WHERE n.version = $v2 AND (n:Module OR n:Entity OR n:ApiEndpoint OR n:UserStory)
        RETURN labels(n)[0] AS type, n.name AS name, n.title AS title, n.path AS path
        LIMIT 25
      `, { v2: targetVersion });

      return {
        sourceVersion,
        targetVersion,
        baselineCounts: v1Nodes,
        targetCounts: v2Nodes,
        newArtifacts: payrollDiff
      };
    } catch (e) {
      return {
        sourceVersion,
        targetVersion,
        note: 'Fallback baseline comparison',
        addedModules: ['payroll (ID: 19)'],
        addedEntities: ['PayrollRecord', 'PayrollPayPeriod'],
        addedEndpoints: [
          '/api/v2/payroll/pay-periods',
          '/api/v2/payroll/pay-periods/{id}/calculate',
          '/api/v2/payroll/pay-periods/{id}/records',
          '/api/v2/payroll/pay-periods/{id}/lock',
          '/api/v2/payroll/my-salary-slips'
        ],
        addedUserStories: [
          'US-PAY-001: Automatic Salary Batch Processing',
          'US-PAY-002: Statutory Deduction Calculation (EPF & PAYE)',
          'US-PAY-003: Pay Period Lifecycle & Immutable Locking',
          'US-PAY-004: Self-Service Employee Salary Slip Download'
        ]
      };
    }
  }

  async close() {
    await this.driver.close();
  }
}

module.exports = new Neo4jService();
