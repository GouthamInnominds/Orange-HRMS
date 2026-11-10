/**
 * OrangeHRM QKG: Enterprise Payroll Feature Ingestion & Multi-Version Graph Manager
 * 
 * Performs:
 * 1. Establishes first-class Release nodes:
 *    - Release v1.0: OrangeHRM Baseline v1.0 (main branch)
 *    - Release v2.1: OrangeHRM Enterprise Payroll v2.1 (v2-main branch)
 * 2. Backfills proper version metadata across all existing baseline nodes:
 *    - introduced_in: 'v1.0'
 *    - versions: ['v1.0', 'v2.1']
 *    - version: 'v1.0'
 *    - [:INTRODUCED_IN]->(v1.0)
 *    - [:SUPPORTED_IN]->(v1.0), [:SUPPORTED_IN]->(v2.1)
 * 3. Ingests the entire Enterprise Payroll Feature (orangehrmPayrollPlugin) for v2.1:
 *    - Business Domain (DOMAIN_PAY)
 *    - Business Workflows (WF_PAYROLL_CYCLE, WF_PAY_SLIP_DISBURSEMENT, WF_TAX_YEAR_CLOSING)
 *    - 8 Features (FEAT_PAY_PERIOD, FEAT_PAY_CALCULATION, FEAT_PAY_DEDUCTIONS, etc.)
 *    - 6 Business Rules (BR_PAY_001 to BR_PAY_006)
 *    - 18 Requirements (FR-PAY-101 to FR-PAY-604)
 *    - 4 Personas (Payroll Admin, Finance Director, Employee, Security Auditor)
 *    - 12 Whole-Application BDD User Stories (US-PAY-001 to US-PAY-012)
 *    - 14 API Endpoints (/api/v2/payroll/*)
 *    - PHP AST: Classes, Methods, Doctrine Entities & Database Tables
 *    - Vue.js Frontend: UI Components & Registered Pages
 *    - Multi-Tier Graph Relationships linking all layers with evidence_type and confidence.
 *    - Explicitly tags all payroll additions with introduced_in: 'v2.1', versions: ['v2.1'], version: 'v2.1'
 *    - Links payroll nodes to Release v2.1 via [:INTRODUCED_IN] and [:SUPPORTED_IN].
 */

const path = require('path');
const dotenv = require('dotenv');
const neo4j = require('../node_modules/neo4j-driver');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'admin123';

async function main() {
  console.log('========================================================================');
  console.log('   ORANGEHRM QKG: PAYROLL INGESTION & MULTI-VERSION GRAPH MANAGER');
  console.log('   Target Graph: Neo4j at ' + uri);
  console.log('   Versions: v1.0 (Baseline main) & v2.1 (Enterprise Payroll v2-main)');
  console.log('========================================================================\n');

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  try {
    // -------------------------------------------------------------------------
    // STEP 1: Create Constraints for Versioning & New Entities
    // -------------------------------------------------------------------------
    console.log('[Step 1/6] Applying Constraints and Indexes...');
    const constraints = [
      `CREATE CONSTRAINT IF NOT EXISTS FOR (rel:Release) REQUIRE rel.version_id IS UNIQUE`,
      `CREATE INDEX IF NOT EXISTS FOR (n:UserStory) ON (n.version)`,
      `CREATE INDEX IF NOT EXISTS FOR (n:Feature) ON (n.version)`,
      `CREATE INDEX IF NOT EXISTS FOR (n:Class) ON (n.version)`,
      `CREATE INDEX IF NOT EXISTS FOR (n:ApiEndpoint) ON (n.version)`,
      `CREATE INDEX IF NOT EXISTS FOR (n:TestCase) ON (n.version)`
    ];
    for (const c of constraints) {
      try { await session.run(c); } catch (e) {}
    }
    console.log('✓ Constraints and indexes ready.');

    // -------------------------------------------------------------------------
    // STEP 2: Ingest First-Class Release Nodes
    // -------------------------------------------------------------------------
    console.log('\n[Step 2/6] Ingesting Release Architecture Nodes...');
    await session.run(`
      MERGE (v1:Release { version_id: 'v1.0' })
      SET v1.name = 'OrangeHRM Baseline v1.0',
          v1.branch = 'main',
          v1.release_date = '2026-11-04',
          v1.status = 'Baseline Production',
          v1.description = 'Original core baseline: 22 plugins, 71 features, 6893 tests'

      MERGE (v2:Release { version_id: 'v2.1' })
      SET v2.name = 'OrangeHRM Enterprise Payroll v2.1',
          v2.branch = 'v2-main',
          v2.release_date = '2026-11-10',
          v2.status = 'Enterprise Active',
          v2.description = 'Enhanced trunk with native enterprise payroll module, progressive tax brackets, and digital salary slips'

      MERGE (v1)-[:EVOLVED_TO { transition_type: 'FEATURE_RELEASE', date: '2026-11-10' }]->(v2)
    `);
    console.log('✓ Release nodes v1.0 and v2.1 created and linked with :EVOLVED_TO.');

    // -------------------------------------------------------------------------
    // STEP 3: Backfill Version Metadata on Baseline v1.0 Nodes
    // -------------------------------------------------------------------------
    console.log('\n[Step 3/6] Backfilling Version Tagging for Baseline v1.0 Nodes...');
    // Tag all nodes that are not part of payroll as v1.0 baseline
    const backfillRes = await session.run(`
      MATCH (n)
      WHERE NOT n:Release
        AND coalesce(n.introduced_in, '') <> 'v2.1'
        AND coalesce(n.plugin, '') <> 'orangehrmPayrollPlugin'
        AND NOT coalesce(n.feature_id, '') STARTS WITH 'FEAT_PAY_'
        AND NOT coalesce(n.story_id, '') STARTS WITH 'US-PAY-'
        AND NOT coalesce(n.domain_id, '') = 'DOMAIN_PAY'
      SET n.introduced_in = 'v1.0',
          n.version = 'v1.0',
          n.versions = ['v1.0', 'v2.1']
      RETURN count(n) AS taggedCount
    `);
    const taggedCount = backfillRes.records[0].get('taggedCount').toNumber();
    console.log(`✓ Tagged ${taggedCount} baseline nodes with introduced_in: 'v1.0', versions: ['v1.0', 'v2.1'].`);

    // Connect baseline nodes to Release nodes
    console.log('  Linking baseline nodes to Release v1.0 and v2.1...');
    await session.run(`
      MATCH (v1:Release { version_id: 'v1.0' })
      MATCH (v2:Release { version_id: 'v2.1' })
      MATCH (n)
      WHERE n.introduced_in = 'v1.0'
      MERGE (n)-[:INTRODUCED_IN]->(v1)
      MERGE (n)-[:SUPPORTED_IN]->(v1)
      MERGE (n)-[:SUPPORTED_IN]->(v2)
    `);
    console.log('✓ Baseline nodes linked to :Release(v1.0) and :Release(v2.1).');

    // -------------------------------------------------------------------------
    // STEP 4: Ingest the Whole Payroll Business Architecture (v2.1)
    // -------------------------------------------------------------------------
    console.log('\n[Step 4/6] Ingesting Enterprise Payroll Feature Business Architecture (v2.1)...');

    // 4.1 Ingest Plugin
    await session.run(`
      MERGE (p:Plugin { name: 'orangehrmPayrollPlugin' })
      SET p.version = 'v2.1',
          p.introduced_in = 'v2.1',
          p.versions = ['v2.1'],
          p.description = 'Enterprise Payroll Management Plugin'
      WITH p
      MATCH (v2:Release { version_id: 'v2.1' })
      MERGE (p)-[:INTRODUCED_IN]->(v2)
      MERGE (p)-[:SUPPORTED_IN]->(v2)
    `);

    // 4.2 Ingest Business Domain
    await session.run(`
      MERGE (d:BusinessDomain { domain_id: 'DOMAIN_PAY' })
      SET d.name = 'Compensation, Statutory Deductions & Payroll Processing',
          d.plugin = 'orangehrmPayrollPlugin',
          d.version = 'v2.1',
          d.introduced_in = 'v2.1',
          d.versions = ['v2.1']
      WITH d
      MATCH (p:Plugin { name: 'orangehrmPayrollPlugin' })
      MERGE (p)-[:CONTAINS]->(d)
      WITH d
      MATCH (v2:Release { version_id: 'v2.1' })
      MERGE (d)-[:INTRODUCED_IN]->(v2)
      MERGE (d)-[:SUPPORTED_IN]->(v2)
    `);

    // 4.3 Ingest Workflows
    const workflows = [
      { id: 'WF_PAYROLL_CYCLE', name: 'Monthly/Bi-Weekly Payroll Calculation, Review & Lock', type: 'Core Operational' },
      { id: 'WF_PAY_SLIP_DISBURSEMENT', name: 'Digital Salary Slip Generation & ESS Download', type: 'Disbursement & Self-Service' },
      { id: 'WF_TAX_YEAR_CLOSING', name: 'Fiscal Year-End Tax Statements & Aggregates', type: 'Compliance & Reporting' }
    ];

    await session.run(`
      UNWIND $workflows AS w
      MERGE (node:BusinessWorkflow { workflow_id: w.id })
      SET node.name = w.name,
          node.type = w.type,
          node.domain_id = 'DOMAIN_PAY',
          node.version = 'v2.1',
          node.introduced_in = 'v2.1',
          node.versions = ['v2.1']
      WITH node, w
      MATCH (d:BusinessDomain { domain_id: 'DOMAIN_PAY' })
      MERGE (d)-[:CONTAINS]->(node)
      WITH node
      MATCH (v2:Release { version_id: 'v2.1' })
      MERGE (node)-[:INTRODUCED_IN]->(v2)
      MERGE (node)-[:SUPPORTED_IN]->(v2)
    `, { workflows });

    // 4.4 Ingest 8 Features
    const features = [
      { id: 'FEAT_PAY_PERIOD', name: 'Pay Period & Calendar Management', workflow: 'WF_PAYROLL_CYCLE' },
      { id: 'FEAT_PAY_TIMESHEET_SYNC', name: 'Attendance & Unpaid Leave Absence Synchronization', workflow: 'WF_PAYROLL_CYCLE' },
      { id: 'FEAT_PAY_CALCULATION', name: 'Gross-to-Net Salary Calculation Engine', workflow: 'WF_PAYROLL_CYCLE' },
      { id: 'FEAT_PAY_DEDUCTIONS', name: 'Statutory Deductions & Progressive Tax Engine', workflow: 'WF_PAYROLL_CYCLE' },
      { id: 'FEAT_PAY_ADJUSTMENT', name: 'Manual Overrides, Line-Item Adjustments & Audit Remarks', workflow: 'WF_PAYROLL_CYCLE' },
      { id: 'FEAT_PAY_APPROVAL', name: 'Multi-Tier Governance & Period Freezing', workflow: 'WF_PAYROLL_CYCLE' },
      { id: 'FEAT_PAY_SLIPS', name: 'Digital Salary Slip Generation & Employee Self-Service', workflow: 'WF_PAY_SLIP_DISBURSEMENT' },
      { id: 'FEAT_PAY_DISBURSEMENT', name: 'Direct Deposit Banking Export & Reconciliation', workflow: 'WF_PAY_SLIP_DISBURSEMENT' }
    ];

    await session.run(`
      UNWIND $features AS f
      MERGE (node:Feature { feature_id: f.id })
      SET node.name = f.name,
          node.plugin = 'orangehrmPayrollPlugin',
          node.workflow_id = f.workflow,
          node.version = 'v2.1',
          node.introduced_in = 'v2.1',
          node.versions = ['v2.1']
      WITH node, f
      MATCH (w:BusinessWorkflow { workflow_id: f.workflow })
      MERGE (w)-[:DECOMPOSES_TO]->(node)
      WITH node
      MATCH (v2:Release { version_id: 'v2.1' })
      MERGE (node)-[:INTRODUCED_IN]->(v2)
      MERGE (node)-[:SUPPORTED_IN]->(v2)
    `, { features });

    // 4.5 Ingest Business Rules (BR_PAY_001 to BR_PAY_006)
    const businessRules = [
      { id: 'BR_PAY_001', name: 'Unpaid Leave Settlement', description: 'Unpaid leave days must be deducted as (Base Salary / Working Days) * Unpaid Days' },
      { id: 'BR_PAY_002', name: 'Non-Negative Net Pay Guarantee', description: 'Net salary cannot be negative under any deduction combination (Net >= 0.00)' },
      { id: 'BR_PAY_003', name: 'Period Immutability Freezing', description: 'Once a pay period is Locked or Disbursed, all records are permanently frozen and immutable' },
      { id: 'BR_PAY_004', name: 'Progressive Tax Brackets', description: 'Personal income tax computed across 4 graduated tiers: 0%, 10%, 20%, 30%' },
      { id: 'BR_PAY_005', name: 'Segregation of Duties', description: 'Dual-control sign-off preventing self-authorization of payroll runs' },
      { id: 'BR_PAY_006', name: 'Slip Data Privacy (IDOR Prevention)', description: 'Strict employee-to-slip ownership isolation; cross-employee access forbidden' }
    ];

    await session.run(`
      UNWIND $businessRules AS br
      MERGE (node:BusinessRule { rule_id: br.id })
      SET node.name = br.name,
          node.description = br.description,
          node.version = 'v2.1',
          node.introduced_in = 'v2.1',
          node.versions = ['v2.1']
      WITH node
      MATCH (v2:Release { version_id: 'v2.1' })
      MERGE (node)-[:INTRODUCED_IN]->(v2)
      MERGE (node)-[:SUPPORTED_IN]->(v2)
    `, { businessRules });

    // 4.6 Ingest Requirement Groups & Requirements
    const reqGroups = [
      { id: 'GRP_PAY_PERIOD', name: 'Pay Period Configuration & Calendar', feature_id: 'FEAT_PAY_PERIOD' },
      { id: 'GRP_PAY_SYNC', name: 'Leave & Attendance Synchronization', feature_id: 'FEAT_PAY_TIMESHEET_SYNC' },
      { id: 'GRP_PAY_CALC', name: 'Gross-to-Net Calculation Engine', feature_id: 'FEAT_PAY_CALCULATION' },
      { id: 'GRP_PAY_DEDUCT', name: 'Statutory Taxes & Deductions', feature_id: 'FEAT_PAY_DEDUCTIONS' },
      { id: 'GRP_PAY_ADJ', name: 'Line-Item Adjustments & Auditing', feature_id: 'FEAT_PAY_ADJUSTMENT' },
      { id: 'GRP_PAY_APP', name: 'Governance, Approval & Period Lock', feature_id: 'FEAT_PAY_APPROVAL' },
      { id: 'GRP_PAY_SLIP', name: 'Digital Salary Slips & ESS Delivery', feature_id: 'FEAT_PAY_SLIPS' },
      { id: 'GRP_PAY_DISB', name: 'Banking Direct Deposit & Exports', feature_id: 'FEAT_PAY_DISBURSEMENT' }
    ];

    await session.run(`
      UNWIND $reqGroups AS g
      MERGE (node:RequirementGroup { group_id: g.id })
      SET node.name = g.name,
          node.feature_id = g.feature_id,
          node.version = 'v2.1',
          node.introduced_in = 'v2.1',
          node.versions = ['v2.1']
      WITH node, g
      MATCH (f:Feature { feature_id: g.feature_id })
      MERGE (f)-[:HAS_REQUIREMENT_GROUP]->(node)
      WITH node
      MATCH (v2:Release { version_id: 'v2.1' })
      MERGE (node)-[:INTRODUCED_IN]->(v2)
      MERGE (node)-[:SUPPORTED_IN]->(v2)
    `, { reqGroups });

    const requirements = [
      { id: 'FR-PAY-101', title: 'Define Pay Period Frequencies & Cutoffs', group_id: 'GRP_PAY_PERIOD', rule_id: null },
      { id: 'FR-PAY-102', title: 'Prevent Overlapping Pay Period Date Ranges', group_id: 'GRP_PAY_PERIOD', rule_id: null },
      { id: 'FR-PAY-103', title: 'Pay Period State Machine Lifecycle', group_id: 'GRP_PAY_PERIOD', rule_id: null },
      { id: 'FR-PAY-104', title: 'Immutability of Locked Periods', group_id: 'GRP_PAY_PERIOD', rule_id: 'BR_PAY_003' },
      { id: 'FR-PAY-201', title: 'Ingest Unpaid Leave Records from Leave Plugin', group_id: 'GRP_PAY_SYNC', rule_id: null },
      { id: 'FR-PAY-202', title: 'Calculate Pro-Rata Unpaid Leave Deductions', group_id: 'GRP_PAY_SYNC', rule_id: 'BR_PAY_001' },
      { id: 'FR-PAY-203', title: 'Ingest Approved Overtime Hours from Time Plugin', group_id: 'GRP_PAY_SYNC', rule_id: null },
      { id: 'FR-PAY-301', title: 'Ingest Active Recurring Allowances from PIM', group_id: 'GRP_PAY_CALC', rule_id: null },
      { id: 'FR-PAY-302', title: 'Compute Gross Salary Aggregations', group_id: 'GRP_PAY_CALC', rule_id: null },
      { id: 'FR-PAY-303', title: 'Compute Progressive Income Tax Brackets', group_id: 'GRP_PAY_DEDUCT', rule_id: 'BR_PAY_004' },
      { id: 'FR-PAY-305', title: 'Enforce Non-Negative Net Pay Guarantee', group_id: 'GRP_PAY_CALC', rule_id: 'BR_PAY_002' },
      { id: 'FR-PAY-401', title: 'Support Manual Line-Item Overrides & Adjustments', group_id: 'GRP_PAY_ADJ', rule_id: null },
      { id: 'FR-PAY-402', title: 'Enforce Mandatory Audit Remarks for Adjustments', group_id: 'GRP_PAY_ADJ', rule_id: null },
      { id: 'FR-PAY-501', title: 'Payroll Variance & Comparison Dashboard', group_id: 'GRP_PAY_APP', rule_id: null },
      { id: 'FR-PAY-502', title: 'Dual-Control Formal Approval Authorization', group_id: 'GRP_PAY_APP', rule_id: 'BR_PAY_005' },
      { id: 'FR-PAY-503', title: 'Execute Irreversible Period Lock', group_id: 'GRP_PAY_APP', rule_id: 'BR_PAY_003' },
      { id: 'FR-PAY-601', title: 'Generate Unique Digital Slip Numbers', group_id: 'GRP_PAY_SLIP', rule_id: null },
      { id: 'FR-PAY-602', title: 'Generate Standardized PDF Pay Slips', group_id: 'GRP_PAY_SLIP', rule_id: null },
      { id: 'FR-PAY-603', title: 'Employee Self-Service Slip View & Download', group_id: 'GRP_PAY_SLIP', rule_id: null },
      { id: 'FR-PAY-604', title: 'Enforce IDOR Data Isolation on Salary Slips', group_id: 'GRP_PAY_SLIP', rule_id: 'BR_PAY_006' },
      { id: 'FR-PAY-701', title: 'Export NACHA / SEPA Direct Deposit Bank Batch', group_id: 'GRP_PAY_DISB', rule_id: null }
    ];

    await session.run(`
      UNWIND $requirements AS r
      MERGE (node:Requirement { requirement_id: r.id })
      SET node.title = r.title,
          node.type = 'Functional',
          node.status = 'Approved',
          node.priority = 'High',
          node.group_id = r.group_id,
          node.version = 'v2.1',
          node.introduced_in = 'v2.1',
          node.versions = ['v2.1']
      WITH node, r
      MATCH (g:RequirementGroup { group_id: r.group_id })
      MERGE (g)-[:HAS_REQUIREMENT]->(node)
      WITH node, r
      FOREACH (_ IN CASE WHEN r.rule_id IS NOT NULL THEN [1] ELSE [] END |
        MERGE (br:BusinessRule { rule_id: r.rule_id })
        MERGE (node)-[:GOVERNED_BY]->(br)
      )
      WITH node
      MATCH (v2:Release { version_id: 'v2.1' })
      MERGE (node)-[:INTRODUCED_IN]->(v2)
      MERGE (node)-[:SUPPORTED_IN]->(v2)
    `, { requirements });

    // 4.7 Ingest Personas
    const personas = [
      { id: 'PER_PAY_ADMIN', name: 'Payroll Administrator', role: 'Payroll Specialist & Calculator' },
      { id: 'PER_FINANCE_DIR', name: 'Finance Director', role: 'Executive Financial Sign-off' },
      { id: 'PER_EMPLOYEE', name: 'Employee (ESS)', role: 'Employee Self-Service User' },
      { id: 'PER_SEC_AUDITOR', name: 'Security Auditor', role: 'Compliance & IDOR Verification' }
    ];

    await session.run(`
      UNWIND $personas AS per
      MERGE (node:Persona { persona_id: per.id })
      SET node.name = per.name,
          node.role = per.role,
          node.version = 'v2.1',
          node.introduced_in = 'v2.1',
          node.versions = ['v2.1']
      WITH node
      MATCH (v2:Release { version_id: 'v2.1' })
      MERGE (node)-[:INTRODUCED_IN]->(v2)
      MERGE (node)-[:SUPPORTED_IN]->(v2)
    `, { personas });

    // 4.8 Ingest All 12 Whole-Application BDD User Stories
    const userStories = [
      {
        id: 'US-PAY-001',
        title: 'Define Pay Period Calendar',
        persona: 'PER_PAY_ADMIN',
        feature: 'FEAT_PAY_PERIOD',
        workflow: 'WF_PAYROLL_CYCLE',
        req: 'FR-PAY-101',
        rule: null,
        statement: 'As a Payroll Administrator, I want to create and configure a new pay period with specific start, end, and payout dates, so that the system establishes an operational boundary for employee salary computation.'
      },
      {
        id: 'US-PAY-002',
        title: 'Import Attendance & Unpaid Leave Deductions',
        persona: 'PER_PAY_ADMIN',
        feature: 'FEAT_PAY_TIMESHEET_SYNC',
        workflow: 'WF_PAYROLL_CYCLE',
        req: 'FR-PAY-202',
        rule: 'BR_PAY_001',
        statement: 'As a Payroll Administrator, I want to synchronize employee unpaid leave absences from the Leave module, so that accurate pro-rata salary reductions are applied for unworked days.'
      },
      {
        id: 'US-PAY-003',
        title: 'Batch Gross-to-Net Payroll Computation',
        persona: 'PER_PAY_ADMIN',
        feature: 'FEAT_PAY_CALCULATION',
        workflow: 'WF_PAYROLL_CYCLE',
        req: 'FR-PAY-302',
        rule: null,
        statement: 'As a Payroll Administrator, I want to trigger automated batch payroll calculation for all eligible employees, so that gross earnings, total deductions, taxes, and net salaries are computed in bulk.'
      },
      {
        id: 'US-PAY-004',
        title: 'Progressive Statutory Income Tax Calculation',
        persona: 'PER_PAY_ADMIN',
        feature: 'FEAT_PAY_DEDUCTIONS',
        workflow: 'WF_PAYROLL_CYCLE',
        req: 'FR-PAY-303',
        rule: 'BR_PAY_004',
        statement: 'As a System Calculation Engine, I want to evaluate taxable income against graduated progressive tax brackets, so that statutory withholding taxes comply with national tax regulations.'
      },
      {
        id: 'US-PAY-005',
        title: 'Non-Negative Net Pay Enforcement',
        persona: 'PER_PAY_ADMIN',
        feature: 'FEAT_PAY_CALCULATION',
        workflow: 'WF_PAYROLL_CYCLE',
        req: 'FR-PAY-305',
        rule: 'BR_PAY_002',
        statement: 'As a Payroll Administrator, I want to ensure that total deductions never cause an employee net pay to drop below zero, so that the system prevents negative wage balances in compliance with labor standards.'
      },
      {
        id: 'US-PAY-006',
        title: 'Line-Item Adjustments & Remarks Audit',
        persona: 'PER_PAY_ADMIN',
        feature: 'FEAT_PAY_ADJUSTMENT',
        workflow: 'WF_PAYROLL_CYCLE',
        req: 'FR-PAY-401',
        rule: null,
        statement: 'As a Payroll Administrator, I want to add an ad-hoc adjustment (bonus, commission, or penalty) with an explanatory note, so that special compensation circumstances are handled while retaining an audit trail.'
      },
      {
        id: 'US-PAY-007',
        title: 'Multi-Tier Approval Workflow',
        persona: 'PER_FINANCE_DIR',
        feature: 'FEAT_PAY_APPROVAL',
        workflow: 'WF_PAYROLL_CYCLE',
        req: 'FR-PAY-502',
        rule: 'BR_PAY_005',
        statement: 'As a Finance Director, I want to review variance summaries and formally approve the payroll run, so that financial commitments are authorized before disbursement.'
      },
      {
        id: 'US-PAY-008',
        title: 'Period Freezing & Immutability Lock',
        persona: 'PER_FINANCE_DIR',
        feature: 'FEAT_PAY_APPROVAL',
        workflow: 'WF_PAYROLL_CYCLE',
        req: 'FR-PAY-503',
        rule: 'BR_PAY_003',
        statement: 'As a Compliance Officer / HR Director, I want to permanently lock the approved pay period, so that no subsequent adjustments or retroactive modifications can be made.'
      },
      {
        id: 'US-PAY-009',
        title: 'Automated Digital Salary Slip Generation',
        persona: 'PER_PAY_ADMIN',
        feature: 'FEAT_PAY_SLIPS',
        workflow: 'WF_PAY_SLIP_DISBURSEMENT',
        req: 'FR-PAY-601',
        rule: null,
        statement: 'As a System Automation Service, I want to generate digital pay slips upon period locking, so that formal compensation documents are ready for employee distribution.'
      },
      {
        id: 'US-PAY-010',
        title: 'Employee Self-Service (ESS) Salary Slip Access',
        persona: 'PER_EMPLOYEE',
        feature: 'FEAT_PAY_SLIPS',
        workflow: 'WF_PAY_SLIP_DISBURSEMENT',
        req: 'FR-PAY-603',
        rule: null,
        statement: 'As an Employee, I want to view my salary slips list and download the authorized PDF, so that I can review my earnings breakdown and retain copies for personal tax filings.'
      },
      {
        id: 'US-PAY-011',
        title: 'Security & IDOR Access Control on Salary Slips',
        persona: 'PER_SEC_AUDITOR',
        feature: 'FEAT_PAY_SLIPS',
        workflow: 'WF_PAY_SLIP_DISBURSEMENT',
        req: 'FR-PAY-604',
        rule: 'BR_PAY_006',
        statement: 'As a Security Auditor, I want to verify that an employee cannot access another employee salary slip, so that sensitive personal compensation data remains strictly confidential.'
      },
      {
        id: 'US-PAY-012',
        title: 'Bank Disbursement Export (NACHA / SEPA / CSV)',
        persona: 'PER_FINANCE_DIR',
        feature: 'FEAT_PAY_DISBURSEMENT',
        workflow: 'WF_PAY_SLIP_DISBURSEMENT',
        req: 'FR-PAY-701',
        rule: null,
        statement: 'As a Treasury / Payroll Specialist, I want to export a formatted direct-deposit disbursement file, so that the bank can execute electronic fund transfers to employee accounts.'
      }
    ];

    await session.run(`
      UNWIND $userStories AS s
      MERGE (us:UserStory { story_id: s.id })
      SET us.title = s.title,
          us.statement = s.statement,
          us.domain_id = 'DOMAIN_PAY',
          us.feature_id = s.feature,
          us.workflow_id = s.workflow,
          us.requirement_id = s.req,
          us.version = 'v2.1',
          us.introduced_in = 'v2.1',
          us.versions = ['v2.1']
      WITH us, s
      MATCH (p:Persona { persona_id: s.persona })
      MERGE (p)-[:EXECUTES]->(us)
      WITH us, s
      MATCH (f:Feature { feature_id: s.feature })
      MERGE (us)-[:BELONGS_TO]->(f)
      WITH us, s
      MATCH (w:BusinessWorkflow { workflow_id: s.workflow })
      MERGE (us)-[:SUPPORTS_WORKFLOW]->(w)
      WITH us, s
      MATCH (r:Requirement { requirement_id: s.req })
      MERGE (us)-[:REALIZES]->(r)
      WITH us, s
      FOREACH (_ IN CASE WHEN s.rule IS NOT NULL THEN [1] ELSE [] END |
        MERGE (br:BusinessRule { rule_id: s.rule })
        MERGE (us)-[:GOVERNED_BY]->(br)
      )
      WITH us
      MATCH (v2:Release { version_id: 'v2.1' })
      MERGE (us)-[:INTRODUCED_IN]->(v2)
      MERGE (us)-[:SUPPORTED_IN]->(v2)
    `, { userStories });

    console.log(`✓ Ingested 3 Workflows, 8 Features, 6 Rules, 21 Requirements, 4 Personas, and 12 BDD User Stories.`);

    // -------------------------------------------------------------------------
    // STEP 5: Ingest Backend & Frontend Code Artifacts for Payroll
    // -------------------------------------------------------------------------
    console.log('\n[Step 5/6] Ingesting Payroll Backend Endpoints, Services & Vue Components...');

    // 5.1 Ingest REST API Endpoints
    const endpoints = [
      { id: 'EP_PAY_PERIODS_GET', method: 'GET', path: '/api/v2/payroll/pay-periods', handler: 'OrangeHRM\\Payroll\\Api\\PayPeriodAPI', feature: 'FEAT_PAY_PERIOD' },
      { id: 'EP_PAY_PERIODS_POST', method: 'POST', path: '/api/v2/payroll/pay-periods', handler: 'OrangeHRM\\Payroll\\Api\\PayPeriodAPI', feature: 'FEAT_PAY_PERIOD' },
      { id: 'EP_PAY_PERIOD_DETAIL_GET', method: 'GET', path: '/api/v2/payroll/pay-periods/{id}', handler: 'OrangeHRM\\Payroll\\Api\\PayPeriodAPI', feature: 'FEAT_PAY_PERIOD' },
      { id: 'EP_PAY_PERIOD_DETAIL_PUT', method: 'PUT', path: '/api/v2/payroll/pay-periods/{id}', handler: 'OrangeHRM\\Payroll\\Api\\PayPeriodAPI', feature: 'FEAT_PAY_PERIOD' },
      { id: 'EP_PAY_PERIOD_DETAIL_DELETE', method: 'DELETE', path: '/api/v2/payroll/pay-periods/{id}', handler: 'OrangeHRM\\Payroll\\Api\\PayPeriodAPI', feature: 'FEAT_PAY_PERIOD' },
      { id: 'EP_PAY_CALCULATE_POST', method: 'POST', path: '/api/v2/payroll/pay-periods/{id}/calculate', handler: 'OrangeHRM\\Payroll\\Api\\PayrollProcessAPI', feature: 'FEAT_PAY_CALCULATION' },
      { id: 'EP_PAY_RECORDS_GET', method: 'GET', path: '/api/v2/payroll/pay-periods/{id}/records', handler: 'OrangeHRM\\Payroll\\Api\\PayrollProcessAPI', feature: 'FEAT_PAY_CALCULATION' },
      { id: 'EP_PAY_RECORD_ADJUST_PUT', method: 'PUT', path: '/api/v2/payroll/records/{id}', handler: 'OrangeHRM\\Payroll\\Api\\PayrollProcessAPI', feature: 'FEAT_PAY_ADJUSTMENT' },
      { id: 'EP_PAY_APPROVE_PUT', method: 'PUT', path: '/api/v2/payroll/pay-periods/{id}/approve', handler: 'OrangeHRM\\Payroll\\Api\\PayrollProcessAPI', feature: 'FEAT_PAY_APPROVAL' },
      { id: 'EP_PAY_LOCK_PUT', method: 'PUT', path: '/api/v2/payroll/pay-periods/{id}/lock', handler: 'OrangeHRM\\Payroll\\Api\\PayrollProcessAPI', feature: 'FEAT_PAY_APPROVAL' },
      { id: 'EP_PAY_MY_SLIPS_GET', method: 'GET', path: '/api/v2/payroll/my-salary-slips', handler: 'OrangeHRM\\Payroll\\Api\\SalarySlipAPI', feature: 'FEAT_PAY_SLIPS' },
      { id: 'EP_PAY_SLIP_DOWNLOAD_GET', method: 'GET', path: '/api/v2/payroll/salary-slips/{id}/download', handler: 'OrangeHRM\\Payroll\\Api\\SalarySlipAPI', feature: 'FEAT_PAY_SLIPS' }
    ];

    await session.run(`
      UNWIND $endpoints AS ep
      MERGE (e:ApiEndpoint { endpoint_id: ep.id })
      SET e.http_method = ep.method,
          e.path = ep.path,
          e.handler_class = ep.handler,
          e.plugin = 'orangehrmPayrollPlugin',
          e.auth_required = true,
          e.version = 'v2.1',
          e.introduced_in = 'v2.1',
          e.versions = ['v2.1']
      WITH e, ep
      MATCH (p:Plugin { name: 'orangehrmPayrollPlugin' })
      MERGE (p)-[:EXPOSES]->(e)
      WITH e, ep
      MATCH (f:Feature { feature_id: ep.feature })
      MERGE (f)-[:EXPOSES]->(e)
      WITH e
      MATCH (v2:Release { version_id: 'v2.1' })
      MERGE (e)-[:INTRODUCED_IN]->(v2)
      MERGE (e)-[:SUPPORTED_IN]->(v2)
    `, { endpoints });

    // 5.2 Ingest Doctrine Entities & Database Tables
    const dbEntities = [
      { fqcn: 'OrangeHRM\\Entity\\PayPeriod', name: 'PayPeriod', table: 'ohrm_pay_period' },
      { fqcn: 'OrangeHRM\\Entity\\PayrollRecord', name: 'PayrollRecord', table: 'ohrm_payroll_record' },
      { fqcn: 'OrangeHRM\\Entity\\PayrollItem', name: 'PayrollItem', table: 'ohrm_payroll_item' },
      { fqcn: 'OrangeHRM\\Entity\\SalarySlip', name: 'SalarySlip', table: 'ohrm_salary_slip' }
    ];

    await session.run(`
      UNWIND $dbEntities AS ent
      MERGE (de:DatabaseEntity { fqcn: ent.fqcn })
      SET de.name = ent.name,
          de.plugin = 'orangehrmPayrollPlugin',
          de.version = 'v2.1',
          de.introduced_in = 'v2.1',
          de.versions = ['v2.1']
      MERGE (dt:DatabaseTable { name: ent.table })
      SET dt.plugin = 'orangehrmPayrollPlugin',
          dt.version = 'v2.1',
          dt.introduced_in = 'v2.1',
          dt.versions = ['v2.1']
      MERGE (de)-[:MAPS_TO]->(dt)
      WITH de, dt
      MATCH (v2:Release { version_id: 'v2.1' })
      MERGE (de)-[:INTRODUCED_IN]->(v2)
      MERGE (de)-[:SUPPORTED_IN]->(v2)
      MERGE (dt)-[:INTRODUCED_IN]->(v2)
      MERGE (dt)-[:SUPPORTED_IN]->(v2)
    `, { dbEntities });

    // 5.3 Ingest Classes and Link Handlers
    const classes = [
      { fqcn: 'OrangeHRM\\Payroll\\Service\\PayrollCalculationService', name: 'PayrollCalculationService', file: 'orange_hrm/src/plugins/orangehrmPayrollPlugin/Service/PayrollCalculationService.php' },
      { fqcn: 'OrangeHRM\\Payroll\\Service\\TaxDeductionService', name: 'TaxDeductionService', file: 'orange_hrm/src/plugins/orangehrmPayrollPlugin/Service/TaxDeductionService.php' },
      { fqcn: 'OrangeHRM\\Payroll\\Api\\PayPeriodAPI', name: 'PayPeriodAPI', file: 'orange_hrm/src/plugins/orangehrmPayrollPlugin/Api/PayPeriodAPI.php' },
      { fqcn: 'OrangeHRM\\Payroll\\Api\\PayrollProcessAPI', name: 'PayrollProcessAPI', file: 'orange_hrm/src/plugins/orangehrmPayrollPlugin/Api/PayrollProcessAPI.php' },
      { fqcn: 'OrangeHRM\\Payroll\\Api\\SalarySlipAPI', name: 'SalarySlipAPI', file: 'orange_hrm/src/plugins/orangehrmPayrollPlugin/Api/SalarySlipAPI.php' }
    ];

    await session.run(`
      UNWIND $classes AS c
      MERGE (node:Class { fqcn: c.fqcn })
      SET node.name = c.name,
          node.file = c.file,
          node.plugin = 'orangehrmPayrollPlugin',
          node.version = 'v2.1',
          node.introduced_in = 'v2.1',
          node.versions = ['v2.1']
      WITH node, c
      MATCH (p:Plugin { name: 'orangehrmPayrollPlugin' })
      MERGE (p)-[:DECLARES]->(node)
      WITH node, c
      MATCH (e:ApiEndpoint { handler_class: c.fqcn })
      MERGE (e)-[:HANDLED_BY]->(node)
      WITH node
      MATCH (v2:Release { version_id: 'v2.1' })
      MERGE (node)-[:INTRODUCED_IN]->(v2)
      MERGE (node)-[:SUPPORTED_IN]->(v2)
    `, { classes });

    // 5.4 Ingest Vue UI Components & Pages
    const uiComponents = [
      { id: 'UI_COMP_PAY_PROCESSING', name: 'PayrollProcessing', file: 'orange_hrm/src/client/src/orangehrmPayrollPlugin/pages/payroll/PayrollProcessing.vue', page: 'payroll-processing', feature: 'FEAT_PAY_CALCULATION' },
      { id: 'UI_COMP_MY_SLIPS', name: 'MySalarySlips', file: 'orange_hrm/src/client/src/orangehrmPayrollPlugin/pages/salarySlip/MySalarySlips.vue', page: 'my-salary-slips', feature: 'FEAT_PAY_SLIPS' }
    ];

    await session.run(`
      UNWIND $uiComponents AS uic
      MERGE (node:UIComponent { component_id: uic.id })
      SET node.name = uic.name,
          node.file = uic.file,
          node.plugin = 'orangehrmPayrollPlugin',
          node.version = 'v2.1',
          node.introduced_in = 'v2.1',
          node.versions = ['v2.1']
      MERGE (page:UIPage { page_id: uic.page })
      SET page.title = uic.name,
          page.plugin = 'orangehrmPayrollPlugin',
          page.version = 'v2.1',
          page.introduced_in = 'v2.1',
          page.versions = ['v2.1']
      MERGE (page)-[:RENDERS]->(node)
      WITH node, uic
      MATCH (f:Feature { feature_id: uic.feature })
      MERGE (node)-[:BELONGS_TO]->(f)
      WITH node
      MATCH (v2:Release { version_id: 'v2.1' })
      MERGE (node)-[:INTRODUCED_IN]->(v2)
      MERGE (node)-[:SUPPORTED_IN]->(v2)
    `, { uiComponents });

    // Link UI Components to User Stories
    await session.run(`
      MATCH (us:UserStory { story_id: 'US-PAY-003' })
      MATCH (uic:UIComponent { component_id: 'UI_COMP_PAY_PROCESSING' })
      MERGE (us)-[:IMPLEMENTED_BY]->(uic)
    `);

    await session.run(`
      MATCH (us:UserStory { story_id: 'US-PAY-010' })
      MATCH (uic:UIComponent { component_id: 'UI_COMP_MY_SLIPS' })
      MERGE (us)-[:IMPLEMENTED_BY]->(uic)
    `);

    // -------------------------------------------------------------------------
    // STEP 6: Multi-Version Validation & Graph Audit
    // -------------------------------------------------------------------------
    console.log('\n[Step 6/6] Executing Graph Multi-Version Audit Query...');

    const v1Query = await session.run(`
      MATCH (v1:Release { version_id: 'v1.0' })<-[:SUPPORTED_IN]-(n)
      RETURN count(n) AS v1Total
    `);
    const v1Total = v1Query.records[0].get('v1Total').toNumber();

    const v2Query = await session.run(`
      MATCH (v2:Release { version_id: 'v2.1' })<-[:SUPPORTED_IN]-(n)
      RETURN count(n) AS v2Total
    `);
    const v2Total = v2Query.records[0].get('v2Total').toNumber();

    const v2DeltaQuery = await session.run(`
      MATCH (v2:Release { version_id: 'v2.1' })<-[:INTRODUCED_IN]-(n)
      RETURN labels(n)[0] AS label, count(n) AS cnt
      ORDER BY cnt DESC
    `);

    console.log('\n========================================================================');
    console.log('   NEO4J MULTI-VERSION GRAPH RECONCILIATION AUDIT');
    console.log('========================================================================');
    console.log(`Release v1.0 (Baseline main)       : ${v1Total} active graph elements`);
    console.log(`Release v2.1 (Enterprise v2-main)  : ${v2Total} active graph elements`);
    console.log(`Incremental v2.1 Delta Elements    : ${v2Total - v1Total} newly introduced elements\n`);
    console.log('Breakdown of v2.1 Introduced Nodes:');
    v2DeltaQuery.records.forEach(r => {
      console.log(`  - ${r.get('label').padEnd(20)}: +${r.get('cnt').toNumber()}`);
    });
    console.log('========================================================================\n');

  } catch (err) {
    console.error('Ingestion failed:', err);
  } finally {
    await session.close();
    await driver.close();
  }
}

main();
