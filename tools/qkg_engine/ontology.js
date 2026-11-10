/**
 * OrangeHRM Quality Knowledge Graph (QKG) Ontology Specification
 * Version: 2.0.0
 * Graph Schema Version: 2.0
 */

module.exports = {
  meta: {
    platform_version: 'QKG v2.0.0',
    schema_version: '2.0',
    parser_version: '2.0.0',
    baseline_id: 'ORANGEHRM_BASELINE_v1.0'
  },

  node_labels: {
    BusinessDomain: 'BusinessDomain',
    BusinessWorkflow: 'BusinessWorkflow',
    Feature: 'Feature',
    RequirementGroup: 'RequirementGroup',
    Requirement: 'Requirement',
    BusinessRule: 'BusinessRule',
    ApiEndpoint: 'ApiEndpoint',
    Plugin: 'Plugin',
    Class: 'Class',
    Interface: 'Interface',
    Trait: 'Trait',
    Method: 'Method',
    DatabaseEntity: 'DatabaseEntity',
    DatabaseTable: 'DatabaseTable',
    TestCase: 'TestCase',
    TestExecution: 'TestExecution',
    Commit: 'Commit'
  },

  relationships: {
    // Requirements & Business Hierarchy
    CONTAINS: 'CONTAINS',                     // (:BusinessDomain)-[:CONTAINS]->(:BusinessWorkflow)
    DECOMPOSES_TO: 'DECOMPOSES_TO',           // (:BusinessWorkflow)-[:DECOMPOSES_TO]->(:Feature)
    HAS_REQUIREMENT_GROUP: 'HAS_REQUIREMENT_GROUP', // (:Feature)-[:HAS_REQUIREMENT_GROUP]->(:RequirementGroup)
    HAS_REQUIREMENT: 'HAS_REQUIREMENT',       // (:RequirementGroup)-[:HAS_REQUIREMENT]->(:Requirement)
    GOVERNED_BY: 'GOVERNED_BY',               // (:Requirement)-[:GOVERNED_BY]->(:BusinessRule)

    // Code & Architecture
    EXPOSES: 'EXPOSES',                       // (:Feature)-[:EXPOSES]->(:ApiEndpoint)
    HANDLED_BY: 'HANDLED_BY',                 // (:ApiEndpoint)-[:HANDLED_BY]->(:Class)
    DECLARES: 'DECLARES',                     // (:Class)-[:DECLARES]->(:Method)
    DEPENDS_ON: 'DEPENDS_ON',                 // (:Class)-[:DEPENDS_ON]->(:Class)
    IMPLEMENTS: 'IMPLEMENTS',                 // (:Class)-[:IMPLEMENTS]->(:Interface)
    EXTENDS: 'EXTENDS',                       // (:Class)-[:EXTENDS]->(:Class)
    USES_TRAIT: 'USES_TRAIT',                 // (:Class)-[:USES_TRAIT]->(:Trait)
    CALLS: 'CALLS',                           // (:Method)-[:CALLS]->(:Method)
    READS: 'READS',                           // (:Method)-[:READS]->(:DatabaseEntity)
    WRITES: 'WRITES',                         // (:Method)-[:WRITES]->(:DatabaseEntity)
    MAPS_TO: 'MAPS_TO',                       // (:DatabaseEntity)-[:MAPS_TO]->(:DatabaseTable)

    // Quality Engineering & Tests
    VERIFIES: 'VERIFIES',                     // (:TestCase)-[:VERIFIES]->(:Requirement)
    TESTS_WORKFLOW: 'TESTS_WORKFLOW',         // (:TestCase)-[:TESTS_WORKFLOW]->(:BusinessWorkflow)
    EXECUTES_AGAINST: 'EXECUTES_AGAINST',     // (:TestCase)-[:EXECUTES_AGAINST]->(:ApiEndpoint)
    TESTS: 'TESTS',                           // (:TestCase)-[:TESTS]->(:Method)
    VALIDATES_RULE: 'VALIDATES_RULE',         // (:TestCase)-[:VALIDATES_RULE]->(:BusinessRule)
    HAS_EXECUTION: 'HAS_EXECUTION'            // (:TestCase)-[:HAS_EXECUTION]->(:TestExecution)
  },

  evidence_types: {
    AST: 'AST',
    CONFIG: 'CONFIG',
    SPEC: 'SPEC',
    RTM: 'RTM',
    ORM_METADATA: 'ORM_METADATA',
    INFERRED: 'INFERRED'
  }
};

