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

  async runCustomCypher(cypher) {
    // Security check: restrict to read-only clauses
    const clean = cypher.trim();
    if (/^\s*(DELETE|DETACH|CREATE|MERGE|SET|REMOVE|DROP)\b/i.test(clean)) {
      throw new Error('Only read-only MATCH/RETURN Cypher queries are permitted in the interactive console.');
    }

    const session = this.driver.session({ database: this.database });
    const startTime = Date.now();
    try {
      const result = await session.run(clean);
      const executionTimeMs = Date.now() - startTime;
      const records = result.records.map(record => {
        const obj = {};
        record.keys.forEach(k => {
          const val = record.get(k);
          obj[k] = (val && typeof val === 'object' && val.properties) ? val.properties : val;
        });
        return obj;
      });
      return {
        query: clean,
        executionTimeMs,
        count: records.length,
        records
      };
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
        status: 'DEGRADED',
        error: err.message,
        totalNodes: 0,
        totalRelationships: 0,
        availableVersions: ['v1.0', 'v2.2-india-payroll'],
        labels: [],
        relationships: []
      };
    }
  }

  // Generates interactive network data for vis-network using live Neo4j ontology labels
  async getGraphVisualData(limit = 80) {
    try {
      const safeLimit = neo4j.int(Math.max(10, Math.min(200, parseInt(limit, 10) || 80)));
      const cypher = `
        MATCH (n)-[r]->(m)
        WHERE NOT n:Release AND NOT m:Release
          AND (n:Plugin OR n:BusinessDomain OR n:BusinessWorkflow OR n:Feature OR n:Requirement OR n:UserStory OR n:BusinessRule OR n:ApiEndpoint OR n:DatabaseEntity OR n:DatabaseTable OR n:UIComponent OR n:TestSuite)
          AND (m:Plugin OR m:BusinessDomain OR m:BusinessWorkflow OR m:Feature OR m:Requirement OR m:UserStory OR m:BusinessRule OR m:ApiEndpoint OR m:DatabaseEntity OR m:DatabaseTable OR m:UIComponent OR m:TestSuite OR m:TestCase)
          AND (coalesce(n.version, '') STARTS WITH 'v2.2' OR coalesce(m.version, '') STARTS WITH 'v2.2' OR coalesce(n.plugin, '') = 'orangehrmPayrollPlugin')
          AND type(r) IN ['DECLARES', 'EXPOSES', 'MAPS_TO', 'CONTAINS_TEST', 'GOVERNED_BY', 'VERIFIED_BY', 'HAS_FEATURE', 'IMPLEMENTS']
        RETURN id(n) AS srcId, labels(n)[0] AS srcLabel, coalesce(n.name, n.title, n.path, n.story_id, n.requirement_id, n.rule_id, n.testcase_id, labels(n)[0]) AS srcName,
               id(m) AS tgtId, labels(m)[0] AS tgtLabel, coalesce(m.name, m.title, m.path, m.story_id, m.requirement_id, m.rule_id, m.testcase_id, labels(m)[0]) AS tgtName,
               type(r) AS relType, n.version AS nVer, m.version AS mVer
        LIMIT $limit
      `;
      const rows = await this.runQuery(cypher, { limit: safeLimit });

      const nodeMap = new Map();
      const edges = [];

      const colorMap = {
        Plugin: '#38bdf8',
        Class: '#a855f7',
        ApiEndpoint: '#10b981',
        DatabaseEntity: '#f59e0b',
        DatabaseTable: '#eab308',
        UserStory: '#ec4899',
        Requirement: '#f472b6',
        Feature: '#8b5cf6',
        TestSuite: '#6366f1',
        TestCase: '#14b8a6'
      };

      const toNum = (v) => (v && typeof v.toNumber === 'function' ? v.toNumber() : Number(v));

      rows.forEach(r => {
        const sId = toNum(r.srcId);
        const tId = toNum(r.tgtId);
        if (!nodeMap.has(sId)) {
          const isV2 = r.nVer && r.nVer.includes('v2.2');
          nodeMap.set(sId, {
            id: sId,
            label: `${r.srcLabel}\n${String(r.srcName).substring(0, 18)}`,
            group: r.srcLabel,
            color: isV2 ? '#22c55e' : (colorMap[r.srcLabel] || '#64748b'),
            title: `[${r.srcLabel}] ${r.srcName} (${r.nVer || 'v1.0'})`
          });
        }
        if (!nodeMap.has(tId)) {
          const isV2 = r.mVer && r.mVer.includes('v2.2');
          nodeMap.set(tId, {
            id: tId,
            label: `${r.tgtLabel}\n${String(r.tgtName).substring(0, 18)}`,
            group: r.tgtLabel,
            color: isV2 ? '#22c55e' : (colorMap[r.tgtLabel] || '#64748b'),
            title: `[${r.tgtLabel}] ${r.tgtName} (${r.mVer || 'v1.0'})`
          });
        }
        edges.push({
          from: sId,
          to: tId,
          label: r.relType,
          arrows: 'to',
          color: { color: 'rgba(255,255,255,0.2)', highlight: '#38bdf8' }
        });
      });

      return {
        nodes: Array.from(nodeMap.values()),
        edges
      };
    } catch (e) {
      return { nodes: [], edges: [], error: e.message };
    }
  }

  async getModuleArchitecture(moduleName) {
    try {
      const cypher = `
        MATCH (p:Plugin)
        WHERE toLower(p.name) CONTAINS toLower($moduleName)
        OPTIONAL MATCH (p)-[:EXPOSES]->(e:ApiEndpoint)
        OPTIONAL MATCH (p)-[:DECLARES]->(c:Class)
        OPTIONAL MATCH (p)-[:DECLARES]->(ent:DatabaseEntity)
        RETURN p.name AS module,
               collect(DISTINCT c.name) AS controllers,
               collect(DISTINCT e.path) AS endpoints,
               collect(DISTINCT ent.name) AS entities
      `;
      const res = await this.runQuery(cypher, { moduleName });
      if (res.length > 0 && res[0].module) return res[0];

      return { module: moduleName, controllers: [], endpoints: [], entities: [] };
    } catch (e) {
      return { module: moduleName, controllers: [], endpoints: [], entities: [], error: e.message };
    }
  }

  async getRequirementTraceability(storyId) {
    try {
      const cypher = `
        MATCH (s)
        WHERE (s:UserStory AND (s.story_id = $storyId OR s.key = $storyId))
           OR (s:Requirement AND s.requirement_id = $storyId)
        OPTIONAL MATCH (tc:TestCase)-[:VERIFIES_STORY|VERIFIES]->(s)
        OPTIONAL MATCH (ts:TestSuite)-[:CONTAINS_TEST]->(tc)
        OPTIONAL MATCH (s)-[:EXECUTES_VIA]->(ep:ApiEndpoint)
        RETURN coalesce(s.title, '') AS story,
               coalesce(s.story_id, s.requirement_id, $storyId) AS storyKey,
               collect(DISTINCT ts.name) AS testSuites,
               collect(DISTINCT tc.testcase_id) AS testCases,
               collect(DISTINCT ep.path) AS endpoints
      `;
      const res = await this.runQuery(cypher, { storyId });
      return res[0] || { storyKey: storyId, testSuites: [], testCases: [], endpoints: [] };
    } catch (e) {
      return { storyKey: storyId, testSuites: [], testCases: [], endpoints: [], error: e.message };
    }
  }

  async compareGraphBaselines(sourceVersion = 'v1.0', targetVersion = 'v2.2-india-payroll') {
    try {
      const countsRes = await this.runQuery(`
        MATCH (rel:Release { version_id: $targetVersion })<-[:INTRODUCED_IN]-(n)
        RETURN labels(n)[0] AS label, count(n) AS cnt ORDER BY cnt DESC
      `, { targetVersion });

      const artifactsRes = await this.runQuery(`
        MATCH (rel:Release { version_id: $targetVersion })<-[:INTRODUCED_IN]-(n)
        WHERE n:Plugin OR n:DatabaseEntity OR n:ApiEndpoint OR n:UserStory OR n:TestSuite
        RETURN labels(n)[0] AS type,
               coalesce(n.name, n.path, n.story_id) AS name,
               coalesce(n.title, n.http_method, n.fqcn, n.display_name, '') AS detail
        ORDER BY type, name
        LIMIT 40
      `, { targetVersion });

      const countMap = {};
      countsRes.forEach(r => {
        const c = r.cnt && typeof r.cnt.toNumber === 'function' ? r.cnt.toNumber() : Number(r.cnt);
        countMap[r.label] = c;
      });

      return {
        sourceVersion,
        targetVersion,
        summary: {
          addedPlugins: countMap.Plugin || 0,
          addedTables: countMap.DatabaseTable || 0,
          addedEntities: countMap.DatabaseEntity || 0,
          addedClasses: countMap.Class || 0,
          addedEndpoints: countMap.ApiEndpoint || 0,
          addedUserStories: countMap.UserStory || 0,
          addedRequirements: countMap.Requirement || 0,
          addedBusinessRules: countMap.BusinessRule || 0,
          addedTestSuites: countMap.TestSuite || 0,
          addedTestCases: countMap.TestCase || 0
        },
        countsByLabel: countMap,
        addedArtifacts: artifactsRes.map(a => ({
          type: a.type,
          name: a.name,
          detail: a.detail
        }))
      };
    } catch (e) {
      return { sourceVersion, targetVersion, error: e.message, summary: {}, addedArtifacts: [] };
    }
  }

  async close() {
    await this.driver.close();
  }
}

module.exports = new Neo4jService();
