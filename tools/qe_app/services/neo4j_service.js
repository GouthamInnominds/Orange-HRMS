const neo4j = require('neo4j-driver');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { validateReadOnlyCypher, sanitizePayload } = require('../../qkg_engine/security_guard');

function normalizeValue(val) {
  if (val === null || val === undefined) return val;
  if (neo4j.isInt(val)) return val.toNumber();
  if (Array.isArray(val)) return val.map(normalizeValue);
  if (typeof val === 'object') {
    if (val.properties && (val.labels || val.type)) {
      return normalizeValue(val.properties);
    }
    const out = {};
    for (const [k, v] of Object.entries(val)) {
      out[k] = normalizeValue(v);
    }
    return out;
  }
  return val;
}

class Neo4jService {
  constructor(options = {}) {
    const uri = options.uri || process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = options.user || process.env.NEO4J_USER || 'neo4j';
    const password = options.password || process.env.NEO4J_PASSWORD || 'admin123';
    this.database = options.database || process.env.NEO4J_DATABASE || 'neo4j';

    this.driver = options.driver || neo4j.driver(uri, neo4j.auth.basic(user, password), {
      maxConnectionPoolSize: 20,
      connectionTimeout: 5000
    });

    const roUser = options.readOnlyUser || process.env.NEO4J_READONLY_USER;
    const roPassword = options.readOnlyPassword || process.env.NEO4J_READONLY_PASSWORD;
    this.readOnlyDriver = (roUser && roPassword && !options.driver)
      ? neo4j.driver(uri, neo4j.auth.basic(roUser, roPassword), {
          maxConnectionPoolSize: 20,
          connectionTimeout: 5000
        })
      : this.driver;
  }

  async runQuery(cypher, params = {}, accessMode = neo4j.session.READ) {
    const activeDriver = accessMode === neo4j.session.READ ? (this.readOnlyDriver || this.driver) : this.driver;
    const session = activeDriver.session({ database: this.database, defaultAccessMode: accessMode });
    try {
      const result = await session.run(cypher, params);
      return result.records.map((record) => {
        const obj = {};
        record.keys.forEach((k) => {
          obj[k] = normalizeValue(record.get(k));
        });
        return obj;
      });
    } finally {
      await session.close();
    }
  }

  async runReadOnlyQuery(cypher, params = {}, maxLimit = 200) {
    const checked = validateReadOnlyCypher(cypher, maxLimit);
    return await this.runQuery(checked.query, params, neo4j.session.READ);
  }

  async runCustomCypher(cypher) {
    const checked = validateReadOnlyCypher(cypher, 100);
    const startTime = Date.now();
    const rows = await this.runQuery(checked.query, {}, neo4j.session.READ);
    const executionTimeMs = Date.now() - startTime;
    const records = sanitizePayload(rows);
    return {
      query: checked.query,
      limitApplied: checked.limitApplied,
      executionTimeMs,
      count: records.length,
      records
    };
  }

  async getLatestSnapshot() {
    const rows = await this.runQuery(`
      MATCH (s:GraphSnapshot)
      WHERE s.status IN ['PUBLISHED', 'STAGING', 'STALE']
      RETURN s.snapshot_id AS snapshotId,
             s.app_commit AS appCommit,
             s.qa_commit AS qaCommit,
             s.branch AS branch,
             s.status AS status,
             s.schema_version AS schemaVersion,
             s.extractor_version AS extractorVersion,
             s.published_at AS publishedAt,
             s.started_at AS startedAt
      ORDER BY CASE s.status WHEN 'PUBLISHED' THEN 0 WHEN 'STAGING' THEN 1 ELSE 2 END,
               coalesce(s.published_at, s.started_at) DESC
      LIMIT 1
    `);
    return rows[0] || null;
  }

  async getGraphOverview(version = null) {
    try {
      const versionFilter = version ? 'WHERE n.version = $version OR n.introduced_in = $version' : '';
      const params = version ? { version } : {};

      const [nodeCountRes, relCountRes, versionsRes, snapshot] = await Promise.all([
        this.runQuery(
          `MATCH (n) ${versionFilter} RETURN labels(n)[0] AS label, count(n) AS count ORDER BY count DESC`,
          params
        ),
        this.runQuery(
          `MATCH ()-[r]->() RETURN type(r) AS relType, count(r) AS count ORDER BY count DESC`,
          {}
        ),
        this.runQuery(
          `MATCH (n) WHERE n.introduced_in IS NOT NULL OR n.version IS NOT NULL
           RETURN DISTINCT coalesce(n.introduced_in, n.version) AS version ORDER BY version`,
          {}
        ),
        this.getLatestSnapshot()
      ]);

      const totalNodes = nodeCountRes.reduce((acc, r) => acc + (Number(r.count) || 0), 0);
      const totalRels = relCountRes.reduce((acc, r) => acc + (Number(r.count) || 0), 0);

      return {
        status: 'CONNECTED',
        snapshot,
        totalNodes,
        totalRelationships: totalRels,
        labels: nodeCountRes,
        relationships: relCountRes,
        availableVersions: versionsRes.map((v) => v.version)
      };
    } catch (err) {
      return {
        status: 'DEGRADED',
        error: err.message,
        snapshot: null,
        totalNodes: 0,
        totalRelationships: 0,
        availableVersions: [],
        labels: [],
        relationships: []
      };
    }
  }

  async getGraphVisualData(limit = 80) {
    try {
      const safeLimit = neo4j.int(Math.max(10, Math.min(200, parseInt(limit, 10) || 80)));
      const rows = await this.runQuery(`
        MATCH (n)-[r]->(m)
        WHERE NOT n:Release AND NOT m:Release AND NOT n:GraphSnapshot AND NOT m:GraphSnapshot
          AND (n:Plugin OR n:BusinessDomain OR n:BusinessWorkflow OR n:Feature OR n:Requirement OR n:UserStory OR n:BusinessRule OR n:ApiEndpoint OR n:DatabaseEntity OR n:DatabaseTable OR n:UIComponent OR n:TestSuite OR n:Class OR n:Method)
          AND (m:Plugin OR m:BusinessDomain OR m:BusinessWorkflow OR m:Feature OR m:Requirement OR m:UserStory OR m:BusinessRule OR m:ApiEndpoint OR m:DatabaseEntity OR m:DatabaseTable OR m:UIComponent OR m:TestSuite OR m:TestCase OR m:Class OR m:Method)
          AND (coalesce(n.introduced_in, n.version, '') STARTS WITH 'v2.2' OR coalesce(m.introduced_in, m.version, '') STARTS WITH 'v2.2' OR coalesce(n.plugin, '') = 'orangehrmPayrollPlugin')
          AND type(r) IN ['DECLARES', 'EXPOSES', 'HANDLED_BY', 'MAPS_TO', 'FK_REFERENCES', 'READS_TABLE', 'WRITES_TABLE', 'CALLS', 'TESTS', 'CONTAINS_TEST', 'GOVERNED_BY', 'REALIZES', 'EXECUTES_VIA']
        RETURN coalesce(n.signature, n.fqcn, n.endpoint_id, n.component_id, n.column_id, n.id, n.story_id, n.requirement_id, n.rule_id, n.testcase_id, labels(n)[0] + ':' + coalesce(n.name, n.path, n.title, 'node')) AS srcId,
               labels(n)[0] AS srcLabel,
               coalesce(n.name, n.title, n.path, n.story_id, n.requirement_id, n.rule_id, n.testcase_id, labels(n)[0]) AS srcName,
               coalesce(m.signature, m.fqcn, m.endpoint_id, m.component_id, m.column_id, m.id, m.story_id, m.requirement_id, m.rule_id, m.testcase_id, labels(m)[0] + ':' + coalesce(m.name, m.path, m.title, 'node')) AS tgtId,
               labels(m)[0] AS tgtLabel,
               coalesce(m.name, m.title, m.path, m.story_id, m.requirement_id, m.rule_id, m.testcase_id, labels(m)[0]) AS tgtName,
               type(r) AS relType, coalesce(n.introduced_in, n.version) AS nVer, coalesce(m.introduced_in, m.version) AS mVer
        LIMIT $limit
      `, { limit: safeLimit });

      const nodeMap = new Map();
      const edges = [];
      const colorMap = {
        Plugin: '#38bdf8',
        Class: '#a855f7',
        Method: '#9333ea',
        ApiEndpoint: '#10b981',
        DatabaseEntity: '#f59e0b',
        DatabaseTable: '#eab308',
        UserStory: '#ec4899',
        Requirement: '#f472b6',
        Feature: '#8b5cf6',
        TestSuite: '#6366f1',
        TestCase: '#14b8a6'
      };

      rows.forEach((r) => {
        const sId = String(r.srcId || `${r.srcLabel}:${r.srcName}`);
        const tId = String(r.tgtId || `${r.tgtLabel}:${r.tgtName}`);
        if (!nodeMap.has(sId)) {
          const isV2 = r.nVer && String(r.nVer).includes('v2.2');
          nodeMap.set(sId, {
            id: sId,
            label: `${r.srcLabel}\n${String(r.srcName).substring(0, 18)}`,
            group: r.srcLabel,
            color: isV2 ? '#22c55e' : (colorMap[r.srcLabel] || '#64748b'),
            title: `[${r.srcLabel}] ${r.srcName} (${r.nVer || 'v1.0'})`
          });
        }
        if (!nodeMap.has(tId)) {
          const isV2 = r.mVer && String(r.mVer).includes('v2.2');
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

      return { nodes: Array.from(nodeMap.values()), edges };
    } catch (e) {
      return { nodes: [], edges: [], error: e.message };
    }
  }

  async getModuleArchitecture(moduleName) {
    try {
      const res = await this.runQuery(`
        MATCH (p:Plugin)
        WHERE toLower(p.name) CONTAINS toLower($moduleName)
        OPTIONAL MATCH (p)-[:DECLARES]->(c:Class)
        OPTIONAL MATCH (c)-[:EXPOSES]->(e:ApiEndpoint)
        OPTIONAL MATCH (p)-[:DECLARES]->(ent:DatabaseEntity)
        OPTIONAL MATCH (p)-[:HAS_TEST_SUITE]->(ts:TestSuite)
        RETURN p.name AS module,
               collect(DISTINCT c.name) AS classes,
               collect(DISTINCT CASE WHEN e IS NOT NULL THEN e.http_method + ' ' + e.path END) AS endpoints,
               collect(DISTINCT ent.name) AS entities,
               collect(DISTINCT ts.name) AS testSuites
      `, { moduleName });

      if (res.length > 0 && res[0].module) {
        const row = res[0];
        return {
          module: row.module,
          controllers: row.classes,
          classes: row.classes,
          endpoints: row.endpoints.filter(Boolean),
          entities: row.entities.filter(Boolean),
          testSuites: row.testSuites.filter(Boolean)
        };
      }
      return { module: moduleName, controllers: [], classes: [], endpoints: [], entities: [], testSuites: [] };
    } catch (e) {
      return { module: moduleName, controllers: [], classes: [], endpoints: [], entities: [], error: e.message };
    }
  }

  async getRequirementTraceability(storyId) {
    try {
      const res = await this.runQuery(`
        MATCH (s)
        WHERE (s:UserStory AND (s.story_id = $storyId OR s.key = $storyId))
           OR (s:Requirement AND s.requirement_id = $storyId)
        OPTIONAL MATCH (s)-[:EXECUTES_VIA]->(ep:ApiEndpoint)
        OPTIONAL MATCH (s)-[:IMPLEMENTED_BY]->(ui:UIComponent)
        OPTIONAL MATCH (tc:TestCase)-[:VERIFIES_STORY|VERIFIES]->(s)
        WITH s, collect(DISTINCT ep.path) AS directEps, collect(DISTINCT ui.file) AS uiFiles,
             collect(DISTINCT CASE WHEN coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST' THEN tc.testcase_id END) AS codeTests,
             collect(DISTINCT CASE WHEN tc.origin = 'BASELINE_MANIFEST' THEN tc.testcase_id END) AS baselineTests,
             collect(DISTINCT CASE WHEN coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST' THEN tc.suite END) AS testSuites
        RETURN coalesce(s.title, '') AS story,
               coalesce(s.story_id, s.requirement_id, $storyId) AS storyKey,
               [x IN testSuites WHERE x IS NOT NULL] AS testSuites,
               [x IN codeTests WHERE x IS NOT NULL] AS testCases,
               [x IN baselineTests WHERE x IS NOT NULL] AS baselineManifestTests,
               [x IN directEps WHERE x IS NOT NULL] AS endpoints,
               [x IN uiFiles WHERE x IS NOT NULL] AS uiComponents
      `, { storyId });
      return res[0] || {
        storyKey: storyId,
        testSuites: [],
        testCases: [],
        baselineManifestTests: [],
        endpoints: [],
        uiComponents: []
      };
    } catch (e) {
      return {
        storyKey: storyId,
        testSuites: [],
        testCases: [],
        baselineManifestTests: [],
        endpoints: [],
        uiComponents: [],
        error: e.message
      };
    }
  }

  async compareGraphBaselines(sourceVersion = 'v1.0', targetVersion = 'v2.2-india-payroll') {
    try {
      const [countsRes, artifactsRes] = await Promise.all([
        this.runQuery(`
          MATCH (rel:Release { version_id: $targetVersion })<-[:INTRODUCED_IN]-(n)
          RETURN labels(n)[0] AS label, count(n) AS cnt ORDER BY cnt DESC
        `, { targetVersion }),
        this.runQuery(`
          MATCH (rel:Release { version_id: $targetVersion })<-[:INTRODUCED_IN]-(n)
          WHERE n:Plugin OR n:DatabaseEntity OR n:ApiEndpoint OR n:UserStory OR n:TestSuite OR n:UIComponent
          RETURN labels(n)[0] AS type,
                 coalesce(n.name, n.path, n.story_id) AS name,
                 coalesce(n.title, n.http_method, n.fqcn, '') AS detail
          ORDER BY type, name
          LIMIT 40
        `, { targetVersion })
      ]);

      const countMap = {};
      countsRes.forEach((r) => {
        countMap[r.label] = Number(r.cnt) || 0;
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
          addedUiComponents: countMap.UIComponent || 0,
          addedUserStories: countMap.UserStory || 0,
          addedRequirements: countMap.Requirement || 0,
          addedBusinessRules: countMap.BusinessRule || 0,
          addedTestSuites: countMap.TestSuite || 0,
          addedTestCases: countMap.TestCase || 0
        },
        countsByLabel: countMap,
        addedArtifacts: artifactsRes
      };
    } catch (e) {
      return { sourceVersion, targetVersion, error: e.message, summary: {}, addedArtifacts: [] };
    }
  }

  async close() {
    if (this.readOnlyDriver && this.readOnlyDriver !== this.driver) {
      await this.readOnlyDriver.close();
    }
    await this.driver.close();
  }
}

module.exports = new Neo4jService();
module.exports.Neo4jService = Neo4jService;
module.exports.normalizeValue = normalizeValue;
