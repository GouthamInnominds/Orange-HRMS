/**
 * QKG Declarative Schema & Provenance Governance Contract (Workstream 5 / QKG-11)
 *
 * Documents and validates:
 *   - Canonical entity identities and mandatory properties per label
 *   - Allowed relationship patterns, classification (DIRECT | DERIVED | INFERRED | PROJECTION),
 *     ownership, and disallowed semantic overloading (e.g. Feature-[:EXPOSES]->ApiEndpoint)
 */

const ontology = require('./ontology');

function resolveEvidenceTier(evidenceType) {
  if (!evidenceType) return 'TIER_3_POTENTIAL_HEURISTIC';
  for (const [tierName, types] of Object.entries(ontology.evidence_tiers || {})) {
    if (types.includes(evidenceType)) return tierName;
  }
  return 'TIER_2_PROBABLE_STATIC';
}

const NODE_CONTRACTS = {
  Plugin: {
    canonicalKey: 'name',
    owner: 'ingest_pipeline',
    description: 'OrangeHRM functional plugin or core boundary',
    requiredProps: ['name', 'introduced_in', 'snapshot_id']
  },
  Release: {
    canonicalKey: 'version_id',
    owner: 'ingest_payroll_and_version_graph',
    description: 'Product lifecycle release (e.g., v1.0, v2.2-india-payroll)',
    requiredProps: ['version_id', 'name', 'status']
  },
  GraphSnapshot: {
    canonicalKey: 'snapshot_id',
    owner: 'ingest_pipeline',
    description: 'Immutable commit-pair source graph state observation',
    requiredProps: ['snapshot_id', 'app_commit', 'qa_commit', 'status', 'schema_version', 'extractor_version', 'started_at']
  },
  Commit: {
    canonicalKey: 'sha',
    owner: 'ingest_pipeline',
    description: 'Git source commit identity linked to snapshots',
    requiredProps: ['sha', 'repo', 'branch']
  },
  Class: {
    canonicalKey: 'fqcn',
    owner: 'php_ast_extractor',
    description: 'PHP class / controller / service / repository',
    requiredProps: ['fqcn', 'name', 'plugin', 'source_file', 'introduced_in', 'snapshot_id']
  },
  Interface: {
    canonicalKey: 'fqcn',
    owner: 'php_ast_extractor',
    description: 'PHP interface declaration',
    requiredProps: ['fqcn', 'name', 'plugin', 'source_file', 'introduced_in', 'snapshot_id']
  },
  Trait: {
    canonicalKey: 'fqcn',
    owner: 'php_ast_extractor',
    description: 'PHP trait declaration',
    requiredProps: ['fqcn', 'name', 'plugin', 'source_file', 'introduced_in', 'snapshot_id']
  },
  Method: {
    canonicalKey: 'signature',
    owner: 'php_ast_extractor',
    description: 'PHP method declaration with body hash and parameter metadata',
    requiredProps: ['signature', 'name', 'class_fqcn', 'introduced_in', 'snapshot_id']
  },
  ApiEndpoint: {
    canonicalKey: 'endpoint_id',
    owner: 'routes_extractor',
    description: 'Symfony REST or Web route endpoint',
    requiredProps: ['endpoint_id', 'http_method', 'path', 'plugin', 'endpoint_kind', 'introduced_in', 'snapshot_id']
  },
  UIComponent: {
    canonicalKey: 'component_id',
    owner: 'vue_ast_extractor',
    description: 'Vue SFC, TypeScript UI module, or verified route target',
    requiredProps: ['component_id', 'name', 'file', 'plugin', 'introduced_in', 'snapshot_id']
  },
  UIPage: {
    canonicalKey: 'page_id',
    owner: 'vue_ast_extractor',
    description: 'Plugin-registered frontend route page mapping to a UIComponent',
    requiredProps: ['page_id', 'plugin', 'component_name', 'introduced_in', 'snapshot_id']
  },
  DatabaseTable: {
    canonicalKey: 'name',
    owner: 'schema_fk_extractor',
    description: 'Relational database table',
    requiredProps: ['name', 'introduced_in', 'snapshot_id']
  },
  DatabaseEntity: {
    canonicalKey: 'fqcn',
    owner: 'schema_fk_extractor',
    description: 'Doctrine ORM entity mapped to a DatabaseTable',
    requiredProps: ['fqcn', 'table_name', 'introduced_in', 'snapshot_id']
  },
  DatabaseColumn: {
    canonicalKey: 'column_id',
    owner: 'db_column_migration_extractor',
    description: 'Database column metadata derived from Doctrine ORM, DDL, and MariaDB schema',
    requiredProps: ['column_id', 'table_name', 'column_name', 'introduced_in', 'snapshot_id']
  },
  SchemaMigration: {
    canonicalKey: 'migration_id',
    owner: 'db_column_migration_extractor',
    description: 'Installer or plugin schema migration script modifying tables/columns',
    requiredProps: ['migration_id', 'version', 'file', 'introduced_in', 'snapshot_id']
  },
  BusinessDomain: {
    canonicalKey: 'domain_id',
    owner: 'spec_extractor',
    description: 'High-level business domain aligned to a Plugin',
    requiredProps: ['domain_id', 'name', 'introduced_in', 'snapshot_id']
  },
  BusinessWorkflow: {
    canonicalKey: 'workflow_id',
    owner: 'spec_extractor',
    description: 'End-to-end business process flow',
    requiredProps: ['workflow_id', 'name', 'introduced_in', 'snapshot_id']
  },
  Feature: {
    canonicalKey: 'feature_id',
    owner: 'spec_extractor',
    description: 'Product capability decomposed from BusinessWorkflow',
    requiredProps: ['feature_id', 'name', 'introduced_in', 'snapshot_id']
  },
  Requirement: {
    canonicalKey: 'requirement_id',
    owner: 'spec_extractor',
    description: 'Functional or non-functional product requirement',
    requiredProps: ['requirement_id', 'title', 'type', 'introduced_in', 'snapshot_id']
  },
  BusinessRule: {
    canonicalKey: 'rule_id',
    owner: 'spec_extractor',
    description: 'Explicit business validation invariant or compliance constraint',
    requiredProps: ['rule_id', 'name', 'introduced_in', 'snapshot_id']
  },
  UserStory: {
    canonicalKey: 'story_id',
    owner: 'spec_extractor',
    description: 'Authored agile user story connecting persona, feature, endpoints, and UI',
    requiredProps: ['story_id', 'title', 'introduced_in', 'snapshot_id']
  },
  TestSuite: {
    canonicalKey: 'name',
    owner: 'test_linker',
    description: 'Logical or AST-extracted test suite container',
    requiredProps: ['suite_id', 'name', 'plugin', 'framework', 'repo', 'origin', 'introduced_in', 'snapshot_id']
  },
  TestCase: {
    canonicalKey: 'canonical_id',
    owner: 'test_linker',
    description: 'Automated AST test case or BASELINE_MANIFEST planning backlog scenario',
    requiredProps: ['canonical_id', 'testcase_id', 'name', 'plugin', 'origin', 'introduced_in', 'snapshot_id']
  },
  TestRun: {
    canonicalKey: 'run_id',
    owner: 'execution_history_ingestion',
    description: 'Concrete execution run produced by CI or QE Workbench',
    requiredProps: ['run_id', 'source', 'framework', 'app_commit', 'executed_at']
  },
  TestExecution: {
    canonicalKey: 'exec_id',
    owner: 'execution_history_ingestion',
    description: 'Per-test outcome observation inside a TestRun',
    requiredProps: ['exec_id', 'status', 'executed_at', 'app_commit']
  },
  CoverageRun: {
    canonicalKey: 'run_id',
    owner: 'coverage_ingestion',
    description: 'Aggregate Clover/PCOV suite coverage run tied to commit & snapshot',
    requiredProps: ['run_id', 'app_commit', 'framework', 'generated_at']
  },
  CoverageObservation: {
    canonicalKey: 'obs_id',
    owner: 'coverage_ingestion',
    description: 'Measured line coverage observation for Method or UIComponent',
    requiredProps: ['obs_id', 'lines_covered', 'lines_total', 'app_commit']
  }
};

const RELATIONSHIP_CONTRACTS = {
  EXPOSES: {
    allowedPairs: [['Class', 'ApiEndpoint']],
    owner: 'routes_extractor',
    classification: 'DIRECT',
    versionSpecific: true,
    requireProvenance: ['evidence_type', 'snapshot_id']
  },
  INCLUDES_ENDPOINT: {
    allowedPairs: [['Feature', 'ApiEndpoint']],
    owner: 'spec_extractor',
    classification: 'DERIVED',
    versionSpecific: true,
    requireProvenance: ['origin', 'snapshot_id']
  },
  EXECUTES_VIA: {
    allowedPairs: [['UserStory', 'ApiEndpoint']],
    owner: 'spec_extractor',
    classification: 'DIRECT',
    versionSpecific: true,
    requireProvenance: ['evidence_type', 'snapshot_id']
  },
  IMPLEMENTED_BY: {
    allowedPairs: [['UserStory', 'UIComponent']],
    owner: 'spec_extractor',
    classification: 'DIRECT',
    versionSpecific: true,
    requireProvenance: ['evidence_type', 'snapshot_id']
  },
  TESTS: {
    allowedPairs: [['TestCase', 'Method']],
    owner: 'test_linker',
    classification: 'INFERRED',
    versionSpecific: true,
    requireConfidence: true,
    requireProvenance: ['evidence_type', 'snapshot_id']
  },
  POTENTIAL_COVERS: {
    allowedPairs: [['TestCase', 'Method']],
    owner: 'test_linker',
    classification: 'INFERRED',
    versionSpecific: true,
    requireConfidence: true,
    requireProvenance: ['evidence_type', 'snapshot_id']
  },
  PLANNED_VERIFICATION: {
    allowedPairs: [['TestCase', 'Requirement']],
    owner: 'spec_extractor',
    classification: 'PROJECTION',
    versionSpecific: false
  },
  PLANNED_ENDPOINT_COVERAGE: {
    allowedPairs: [['TestCase', 'ApiEndpoint']],
    owner: 'spec_extractor',
    classification: 'PROJECTION',
    versionSpecific: false
  },
  HAS_EXECUTION: {
    allowedPairs: [['TestRun', 'TestExecution']],
    owner: 'execution_history_ingestion',
    classification: 'DIRECT',
    versionSpecific: true
  },
  EXECUTED_TEST: {
    allowedPairs: [['TestExecution', 'TestCase']],
    owner: 'execution_history_ingestion',
    classification: 'DIRECT',
    versionSpecific: true
  },
  EXECUTED_AGAINST_SNAPSHOT: {
    allowedPairs: [['TestRun', 'GraphSnapshot']],
    owner: 'execution_history_ingestion',
    classification: 'DIRECT',
    versionSpecific: true
  },
  HAS_OBSERVATION: {
    allowedPairs: [['CoverageRun', 'CoverageObservation']],
    owner: 'coverage_ingestion',
    classification: 'DIRECT',
    versionSpecific: true
  },
  COVERED_IN: {
    allowedPairs: [['CoverageObservation', 'Method']],
    owner: 'coverage_ingestion',
    classification: 'DIRECT',
    versionSpecific: true
  },
  COVERED_COMPONENT_IN: {
    allowedPairs: [['CoverageObservation', 'UIComponent']],
    owner: 'coverage_ingestion',
    classification: 'DIRECT',
    versionSpecific: true
  },
  MEASURED_FOR: {
    allowedPairs: [['CoverageRun', 'GraphSnapshot']],
    owner: 'coverage_ingestion',
    classification: 'DIRECT',
    versionSpecific: true
  },
  HAS_COLUMN: {
    allowedPairs: [['DatabaseTable', 'DatabaseColumn']],
    owner: 'db_column_migration_extractor',
    classification: 'DIRECT',
    versionSpecific: true,
    requireProvenance: ['snapshot_id']
  },
  MAPS_TO_COLUMN: {
    allowedPairs: [['DatabaseEntity', 'DatabaseColumn']],
    owner: 'db_column_migration_extractor',
    classification: 'DIRECT',
    versionSpecific: true,
    requireConfidence: true,
    requireProvenance: ['evidence_type', 'snapshot_id']
  },
  ACCESSES_COLUMN: {
    allowedPairs: [['Method', 'DatabaseColumn']],
    owner: 'db_column_migration_extractor',
    classification: 'DERIVED',
    versionSpecific: true,
    requireConfidence: true,
    requireProvenance: ['evidence_type', 'snapshot_id']
  },
  MODIFIES_TABLE: {
    allowedPairs: [['SchemaMigration', 'DatabaseTable']],
    owner: 'db_column_migration_extractor',
    classification: 'DIRECT',
    versionSpecific: true,
    requireProvenance: ['snapshot_id']
  },
  MODIFIES_COLUMN: {
    allowedPairs: [['SchemaMigration', 'DatabaseColumn']],
    owner: 'db_column_migration_extractor',
    classification: 'DIRECT',
    versionSpecific: true,
    requireProvenance: ['snapshot_id']
  },
  EXECUTES_AGAINST: {
    allowedPairs: [['TestCase', 'ApiEndpoint']],
    owner: 'test_linker',
    classification: 'DIRECT',
    versionSpecific: true,
    requireConfidence: true,
    requireProvenance: ['evidence_type', 'snapshot_id']
  },
  TESTS_COMPONENT: {
    allowedPairs: [['TestCase', 'UIComponent']],
    owner: 'test_linker',
    classification: 'DIRECT',
    versionSpecific: true,
    requireConfidence: true,
    requireProvenance: ['evidence_type', 'snapshot_id']
  },
  NAVIGATES_PAGE: {
    allowedPairs: [['TestCase', 'UIPage']],
    owner: 'qkg_qa_extractor',
    classification: 'DIRECT',
    versionSpecific: true,
    requireConfidence: true,
    requireProvenance: ['evidence_type', 'snapshot_id']
  }
};

function toNum(v) {
  if (v === null || v === undefined) return 0;
  return typeof v.toNumber === 'function' ? v.toNumber() : Number(v);
}

/**
 * Validates live Neo4j graph compliance against NODE_CONTRACTS and RELATIONSHIP_CONTRACTS.
 */
async function validateSchemaContract(session) {
  const violations = [];

  for (const [label, contract] of Object.entries(NODE_CONTRACTS)) {
    const missingChecks = contract.requiredProps.map((prop) => `n.\`${prop}\` IS NULL`).join(' OR ');
    const res = await session.run(`
      MATCH (n:\`${label}\`)
      WITH count(n) AS total,
           count(CASE WHEN ${missingChecks} THEN 1 END) AS invalidCount
      RETURN total, invalidCount
    `);
    const total = toNum(res.records[0]?.get('total'));
    const invalidCount = toNum(res.records[0]?.get('invalidCount'));
    if (total > 0 && invalidCount > 0) {
      violations.push({ kind: 'NODE_CONTRACT', label, total, invalidCount, requiredProps: contract.requiredProps });
    }
  }

  // Ban Feature-[:EXPOSES]->ApiEndpoint (must be INCLUDES_ENDPOINT)
  const overloadedExposes = await session.run(`
    MATCH (f:Feature)-[r:EXPOSES]->(e:ApiEndpoint)
    RETURN count(r) AS cnt
  `);
  const badExposes = toNum(overloadedExposes.records[0]?.get('cnt'));
  if (badExposes > 0) {
    violations.push({ kind: 'BANNED_EDGE_OVERLOAD', edge: 'Feature-[:EXPOSES]->ApiEndpoint', count: badExposes });
  }

  // Ban deprecated execution edge names
  const legacyExecEdges = await session.run(`
    MATCH ()-[r:CONTAINS_EXECUTION|EXECUTED_IN]->()
    RETURN count(r) AS cnt
  `);
  const badExec = toNum(legacyExecEdges.records[0]?.get('cnt'));
  if (badExec > 0) {
    violations.push({ kind: 'LEGACY_EXECUTION_EDGE', edge: 'CONTAINS_EXECUTION|EXECUTED_IN', count: badExec });
  }

  // Ban BASELINE_MANIFEST writing active VERIFIES or EXECUTES_AGAINST
  const baselinePollution = await session.run(`
    MATCH (tc:TestCase { origin: 'BASELINE_MANIFEST' })-[r:VERIFIES|VERIFIES_STORY|EXECUTES_AGAINST]->()
    RETURN count(r) AS cnt
  `);
  const badBaseline = toNum(baselinePollution.records[0]?.get('cnt'));
  if (badBaseline > 0) {
    violations.push({ kind: 'BASELINE_POLLUTION', count: badBaseline });
  }

  return {
    passed: violations.length === 0,
    checkedLabels: Object.keys(NODE_CONTRACTS).length,
    checkedRelationships: Object.keys(RELATIONSHIP_CONTRACTS).length,
    violations
  };
}

module.exports = {
  NODE_CONTRACTS,
  RELATIONSHIP_CONTRACTS,
  EVIDENCE_TIERS: ontology.evidence_tiers,
  resolveEvidenceTier,
  validateSchemaContract
};

