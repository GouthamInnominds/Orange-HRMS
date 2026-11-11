/**
 * OrangeHRM QKG: v2.2 India Payroll Extension Ingestion & Multi-Version Graph Manager
 *
 * Syncs Neo4j cleanly with OrangeHRM_Payroll_Extension_v2.2:
 *  - Release v1.0 (OrangeHRM Baseline v1.0, main branch, 6,893 baseline tests)
 *  - Release v2.2-india-payroll (OrangeHRM v2.2 India Payroll Extension, v2-main / feature/v2.1-payroll-module)
 *  - Cleans stale v2.0.0-payroll / v2.1 Payroll artifacts while preserving v1.0 baseline nodes
 *  - Ingests 15 tables, 15 entities, 48 PHP classes, 28 REST endpoints, 12 Vue components,
 *    9 UI pages, 12 User Stories (US_PAY_001..012), 12 Functional Requirements (FR_PAY_001..012),
 *    16 Business Rules (BR_PAY_001..016), 9 Features, 7 Workflows, 6 cross-module links,
 *    and the 41 executed Payroll tests across 10 suites.
 */

const fs = require('fs');
const path = require('path');
const neo4j = require('../node_modules/neo4j-driver');
const { ingestPayrollTests, RELEASE_ID } = require('./ingest_payroll_tests_to_neo4j');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const EXT_DIR = path.resolve(__dirname, '../../OrangeHRM_Payroll_Extension_v2.2');

async function main() {
  const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
  const user = process.env.NEO4J_USER || 'neo4j';
  const password = process.env.NEO4J_PASSWORD || 'admin123';
  const database = process.env.NEO4J_DATABASE || 'neo4j';

  console.log('========================================================================');
  console.log('  ORANGEHRM QKG: v2.2 INDIA PAYROLL INGESTION & VERSION RECONCILIATION');
  console.log(`  Target Neo4j: ${uri} | Release: ${RELEASE_ID}`);
  console.log('========================================================================\n');

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session({ database });

  try {
    console.log('[Step 1/7] Applying Neo4j constraints & indexes...');
    const constraints = [
      'CREATE CONSTRAINT IF NOT EXISTS FOR (rel:Release) REQUIRE rel.version_id IS UNIQUE',
      'CREATE INDEX IF NOT EXISTS FOR (n:UserStory) ON (n.version)',
      'CREATE INDEX IF NOT EXISTS FOR (n:Feature) ON (n.version)',
      'CREATE INDEX IF NOT EXISTS FOR (n:Class) ON (n.version)',
      'CREATE INDEX IF NOT EXISTS FOR (n:ApiEndpoint) ON (n.version)',
      'CREATE INDEX IF NOT EXISTS FOR (n:TestCase) ON (n.version)'
    ];
    for (const cypher of constraints) {
      try { await session.run(cypher); } catch (_) {}
    }

    console.log('[Step 2/7] Purging stale v2.0.0-payroll / v2.1 Payroll nodes cleanly (preserving v1.0)...');
    const cleanQueries = [
      `MATCH (r:Release) WHERE r.version_id IN ['v2.1', 'v2.0.0-payroll', $releaseId] DETACH DELETE r`,
      `MATCH (n) WHERE coalesce(n.introduced_in, '') IN ['v2.1', 'v2.0.0-payroll', $releaseId]
          OR coalesce(n.version, '') IN ['v2.1', 'v2.0.0-payroll', $releaseId]
          OR coalesce(n.plugin, '') = 'orangehrmPayrollPlugin'
          OR coalesce(n.domain_id, '') STARTS WITH 'DOMAIN_PAY'
          OR coalesce(n.feature_id, '') STARTS WITH 'FEAT_PAY_'
          OR coalesce(n.requirement_id, '') STARTS WITH 'FR_PAY_'
          OR coalesce(n.requirement_id, '') STARTS WITH 'FR-PAY-'
          OR coalesce(n.rule_id, '') STARTS WITH 'BR_PAY_'
          OR coalesce(n.workflow_id, '') STARTS WITH 'WF_PAY'
          OR coalesce(n.story_id, '') STARTS WITH 'US_PAY_'
          OR coalesce(n.story_id, '') STARTS WITH 'US-PAY-'
          OR coalesce(n.persona_id, '') STARTS WITH 'PERSONA_PAY'
          OR (n:Plugin AND n.name = 'orangehrmPayrollPlugin')
          OR (n:TestSuite AND coalesce(n.module, '') = 'Payroll')
          OR (n:TestCase AND coalesce(n.module, '') = 'Payroll')
          OR (n:DatabaseTable AND (n.name STARTS WITH 'ohrm_payroll_' OR n.name IN ['ohrm_pay_period', 'ohrm_salary_slip']))
          OR (n:DatabaseEntity AND coalesce(n.source_file, '') CONTAINS 'orangehrmPayrollPlugin')
          OR (n:Class AND coalesce(n.fqcn, '') STARTS WITH 'OrangeHRM\\\\Payroll\\\\')
          OR (n:RequirementGroup AND coalesce(n.group_id, '') STARTS WITH 'RG_PAY_')
       DETACH DELETE n`
    ];
    for (const q of cleanQueries) {
      await session.run(q, { releaseId: RELEASE_ID });
    }

    console.log('[Step 3/7] Upserting Release nodes v1.0 -> v2.2-india-payroll & backfilling v1.0...');
    await session.run(`
      MERGE (v1:Release { version_id: 'v1.0' })
      SET v1.name = 'OrangeHRM Baseline v1.0',
          v1.branch = 'main',
          v1.release_date = '2026-11-04',
          v1.status = 'Baseline Production',
          v1.description = 'Original baseline across 22 plugins and 6,893 tests'

      CREATE (v22:Release {
        version_id: $releaseId,
        name: 'OrangeHRM v2.2 India Payroll Extension',
        branch: 'v2-main',
        release_date: '2026-11-11',
        status: 'Verified Release Candidate',
        description: 'India FY 2026-27 INR Payroll extension (15 tables, 28 REST endpoints, 6-module integration, 41 executed tests)'
      })

      MERGE (v1)-[:EVOLVED_TO { transition_type: 'MINOR_FEATURE_RELEASE', date: '2026-11-11' }]->(v22)
    `, { releaseId: RELEASE_ID });

    const backfillRes = await session.run(`
      MATCH (n)
      WHERE NOT n:Release
      SET n.version = 'v1.0',
          n.introduced_in = 'v1.0',
          n.versions = ['v1.0', $releaseId]
      WITH n
      MATCH (v1:Release { version_id: 'v1.0' })
      MATCH (v22:Release { version_id: $releaseId })
      MERGE (n)-[:INTRODUCED_IN]->(v1)
      MERGE (n)-[:SUPPORTED_IN]->(v22)
      RETURN count(n) AS updatedCount
    `, { releaseId: RELEASE_ID });
    console.log(`✓ Re-linked ${backfillRes.records[0].get('updatedCount').toNumber()} baseline v1.0 nodes to SUPPORTED_IN -> ${RELEASE_ID}.`);

    console.log('[Step 4/7] Ingesting Domain, Workflows, Features, Rules, Requirements, Personas & Stories...');
    await session.run(`
      MATCH (v22:Release { version_id: $releaseId })
      CREATE (p:Plugin {
        name: 'orangehrmPayrollPlugin',
        module_id: 19,
        display_name: 'Payroll (India INR)',
        plugin: 'orangehrmPayrollPlugin',
        version: $releaseId,
        introduced_in: $releaseId,
        versions: [$releaseId]
      })
      CREATE (d:BusinessDomain {
        domain_id: 'DOMAIN_PAYROLL',
        name: 'India Payroll & Statutory Disbursement',
        plugin: 'orangehrmPayrollPlugin',
        version: $releaseId,
        introduced_in: $releaseId,
        versions: [$releaseId]
      })
      CREATE (p)-[:CONTAINS]->(d)
      CREATE (p)-[:INTRODUCED_IN]->(v22), (p)-[:SUPPORTED_IN]->(v22)
      CREATE (d)-[:INTRODUCED_IN]->(v22), (d)-[:SUPPORTED_IN]->(v22)
      WITH p
      UNWIND ['orangehrmAdminPlugin', 'orangehrmPimPlugin', 'orangehrmLeavePlugin', 'orangehrmAttendancePlugin', 'orangehrmTimePlugin', 'orangehrmClaimPlugin'] AS depPlugin
      MATCH (target:Plugin { name: depPlugin })
      MERGE (p)-[:INTEGRATES_WITH { contract: 'ReadOnlyDomainAndDisbursement' }]->(target)
    `, { releaseId: RELEASE_ID });

    const workflows = [
      { id: 'WF_PAYROLL_CONFIG', name: 'India Jurisdiction, FY 2026-27 Slab & LWP Config Workflow' },
      { id: 'WF_PAYROLL_PERIOD', name: 'Monthly INR Pay Period Calendar & Overlap Validation' },
      { id: 'WF_PAYROLL_PROFILE', name: 'PIM Statutory Profile, Tax Regime & Masked Bank Management' },
      { id: 'WF_PAYROLL_RUN', name: 'Batch Snapshot, Cross-Module Intake, Statutory Engine & Override' },
      { id: 'WF_PAYROLL_APPROVAL', name: 'Maker-Checker Submit, Reject/Approve, Lock & Reverse Governance' },
      { id: 'WF_PAYROLL_DISBURSEMENT', name: 'NEFT Bank CSV Guard, Export & UTR Claim Settlement' },
      { id: 'WF_PAYROLL_ESS', name: 'ESS & PIM Self-Service INR Payslip Preview & IDOR Enforcement' }
    ];
    await session.run(`
      MATCH (d:BusinessDomain { domain_id: 'DOMAIN_PAYROLL' })
      MATCH (v22:Release { version_id: $releaseId })
      UNWIND $workflows AS w
      CREATE (wf:BusinessWorkflow {
        workflow_id: w.id,
        name: w.name,
        type: 'IndiaPayrollExtension',
        plugin: 'orangehrmPayrollPlugin',
        version: $releaseId,
        introduced_in: $releaseId,
        versions: [$releaseId]
      })
      CREATE (d)-[:CONTAINS]->(wf)
      CREATE (wf)-[:INTRODUCED_IN]->(v22), (wf)-[:SUPPORTED_IN]->(v22)
    `, { workflows, releaseId: RELEASE_ID });

    const features = [
      { id: 'FEAT_PAY_CONFIG', name: 'India Jurisdiction, Slabs & LWP Policy Config', wf: 'WF_PAYROLL_CONFIG' },
      { id: 'FEAT_PAY_PERIOD', name: 'India Monthly INR Pay Periods', wf: 'WF_PAYROLL_PERIOD' },
      { id: 'FEAT_PAY_SNAPSHOT', name: 'PIM Statutory Profile & Run Snapshot Isolation', wf: 'WF_PAYROLL_PROFILE' },
      { id: 'FEAT_PAY_CROSS', name: 'Cross-Module Leave LWP, Time OT & Claim Reservation', wf: 'WF_PAYROLL_RUN' },
      { id: 'FEAT_PAY_ENGINE', name: 'Indian Statutory Engine (EPF, ESIC, PT, FY26-27 TDS)', wf: 'WF_PAYROLL_RUN' },
      { id: 'FEAT_PAY_ADJUSTMENT', name: 'Audited Manual Overrides & Append-Only Audit Log', wf: 'WF_PAYROLL_RUN' },
      { id: 'FEAT_PAY_WF', name: 'Maker-Checker SoD Workflow & Locking', wf: 'WF_PAYROLL_APPROVAL' },
      { id: 'FEAT_PAY_PAYMENT', name: 'NEFT CSV Export Guard & Bank UTR Claim Settlement', wf: 'WF_PAYROLL_DISBURSEMENT' },
      { id: 'FEAT_PAY_SLIPS', name: 'Published INR HTML Payslips & ESS BOLA Protection', wf: 'WF_PAYROLL_ESS' }
    ];
    await session.run(`
      MATCH (v22:Release { version_id: $releaseId })
      UNWIND $features AS f
      CREATE (feat:Feature {
        feature_id: f.id,
        name: f.name,
        plugin: 'orangehrmPayrollPlugin',
        version: $releaseId,
        introduced_in: $releaseId,
        versions: [$releaseId]
      })
      CREATE (feat)-[:INTRODUCED_IN]->(v22), (feat)-[:SUPPORTED_IN]->(v22)
      WITH feat, f
      MATCH (wf:BusinessWorkflow { workflow_id: f.wf })
      MERGE (wf)-[:DECOMPOSES_TO]->(feat)
    `, { features, releaseId: RELEASE_ID });

    const personas = [
      { id: 'PERSONA_PAYROLL_MAKER', role: 'Admin', name: 'Payroll Maker / HR Operations Admin (Role 1)' },
      { id: 'PERSONA_PAYROLL_APPROVER', role: 'PayrollApprover', name: 'Finance Checker / Payroll Approver (Role 8)' },
      { id: 'PERSONA_ESS', role: 'ESS', name: 'Employee Self-Service User (Role 2)' }
    ];
    await session.run(`
      MATCH (v22:Release { version_id: $releaseId })
      UNWIND $personas AS p
      CREATE (per:Persona {
        persona_id: p.id,
        role: p.role,
        name: p.name,
        plugin: 'orangehrmPayrollPlugin',
        version: $releaseId,
        introduced_in: $releaseId,
        versions: [$releaseId]
      })
      CREATE (per)-[:INTRODUCED_IN]->(v22), (per)-[:SUPPORTED_IN]->(v22)
    `, { personas, releaseId: RELEASE_ID });

    const requirements = [
      { id: 'FR_PAY_001', title: 'India Config, Tax Brackets & Leave Policy', feat: 'FEAT_PAY_CONFIG' },
      { id: 'FR_PAY_002', title: 'Pay Period Management & Overlap Check', feat: 'FEAT_PAY_PERIOD' },
      { id: 'FR_PAY_003', title: 'PIM Statutory Profile & Masked Bank Exposure', feat: 'FEAT_PAY_SNAPSHOT' },
      { id: 'FR_PAY_004', title: 'Idempotent Runs & Frozen Snapshots', feat: 'FEAT_PAY_SNAPSHOT' },
      { id: 'FR_PAY_005', title: 'Leave LWP Intake & Divisors', feat: 'FEAT_PAY_CROSS' },
      { id: 'FR_PAY_006', title: 'Time/Attendance Intake & Overtime Ceiling', feat: 'FEAT_PAY_CROSS' },
      { id: 'FR_PAY_007', title: 'Indian Statutory & TDS Calculation', feat: 'FEAT_PAY_ENGINE' },
      { id: 'FR_PAY_008', title: 'Claim Reservation & Anti-Double-Payout', feat: 'FEAT_PAY_CROSS' },
      { id: 'FR_PAY_009', title: 'Audited Adjustments Before Submit', feat: 'FEAT_PAY_ADJUSTMENT' },
      { id: 'FR_PAY_010', title: 'Maker-Checker SoD & Publication', feat: 'FEAT_PAY_WF' },
      { id: 'FR_PAY_011', title: 'NEFT CSV Export Guard & UTR Settlement', feat: 'FEAT_PAY_PAYMENT' },
      { id: 'FR_PAY_012', title: 'ESS Self-Service & Download', feat: 'FEAT_PAY_SLIPS' }
    ];
    await session.run(`
      MATCH (v22:Release { version_id: $releaseId })
      UNWIND $requirements AS r
      CREATE (req:Requirement {
        requirement_id: r.id,
        title: r.title,
        type: 'FR',
        status: 'Verified',
        priority: 'Critical',
        plugin: 'orangehrmPayrollPlugin',
        version: $releaseId,
        introduced_in: $releaseId,
        versions: [$releaseId]
      })
      CREATE (req)-[:INTRODUCED_IN]->(v22), (req)-[:SUPPORTED_IN]->(v22)
      WITH req, r
      MATCH (feat:Feature { feature_id: r.feat })
      MERGE (feat)-[:HAS_REQUIREMENT]->(req)
    `, { requirements, releaseId: RELEASE_ID });

    const rules = [
      { id: 'BR_PAY_001', name: 'Single Jurisdiction & INR Currency Enforcement' },
      { id: 'BR_PAY_002', name: 'Pay Period Date Non-Overlap' },
      { id: 'BR_PAY_003', name: 'Idempotent Run Creation' },
      { id: 'BR_PAY_004', name: 'Immutable PIM Snapshot per Run' },
      { id: 'BR_PAY_005', name: 'Explicit Leave LWP Policy & Divisor Modes' },
      { id: 'BR_PAY_006', name: 'Attendance vs Timesheet Non-Double-Counting' },
      { id: 'BR_PAY_007', name: 'Overtime Eligibility Ceiling (Rs 50,000)' },
      { id: 'BR_PAY_008', name: 'Single-Run Claim Reservation Lock (uq_active_claim_lock)' },
      { id: 'BR_PAY_009', name: 'EPF/EPS Calculation & Rs 15,000 Ceiling' },
      { id: 'BR_PAY_010', name: 'ESIC Applicability Ceiling (Rs 21,000) & Claim Exclusion' },
      { id: 'BR_PAY_011', name: 'State Professional Tax & Maharashtra February Rs 300 Slab' },
      { id: 'BR_PAY_012', name: 'TDS u/s 115BAC vs Old Regime, Sec 87A 12L Rebate & Sec 288B' },
      { id: 'BR_PAY_013', name: 'Maker-Checker Separation of Duties (HTTP 403 SoD)' },
      { id: 'BR_PAY_014', name: 'Immutability After Submission & Locking' },
      { id: 'BR_PAY_015', name: 'Bank Validation Before NEFT Export & UTR Claim PAID' },
      { id: 'BR_PAY_016', name: 'Bank Account Masking & ESS Slip BOLA Isolation' }
    ];
    await session.run(`
      MATCH (v22:Release { version_id: $releaseId })
      UNWIND $rules AS br
      CREATE (node:BusinessRule {
        rule_id: br.id,
        name: br.name,
        plugin: 'orangehrmPayrollPlugin',
        version: $releaseId,
        introduced_in: $releaseId,
        versions: [$releaseId]
      })
      CREATE (node)-[:INTRODUCED_IN]->(v22), (node)-[:SUPPORTED_IN]->(v22)
    `, { rules, releaseId: RELEASE_ID });

    const stories = JSON.parse(fs.readFileSync(path.join(EXT_DIR, '01_Business_Requirements/user_stories.json'), 'utf8'));
    await session.run(`
      MATCH (v22:Release { version_id: $releaseId })
      UNWIND $stories AS s
      CREATE (us:UserStory {
        story_id: s.story_id,
        key: s.story_id,
        title: s.title,
        statement: s.statement,
        feature_id: s.feature_id,
        domain_id: s.domain_id,
        workflow_id: s.workflow_id,
        requirement_id: s.requirement_id,
        plugin: 'orangehrmPayrollPlugin',
        version: $releaseId,
        introduced_in: $releaseId,
        versions: [$releaseId]
      })
      CREATE (us)-[:INTRODUCED_IN]->(v22), (us)-[:SUPPORTED_IN]->(v22)
      WITH us, s
      MATCH (feat:Feature { feature_id: s.feature_id })
      MATCH (wf:BusinessWorkflow { workflow_id: s.workflow_id })
      MATCH (req:Requirement { requirement_id: s.requirement_id })
      MATCH (per:Persona { persona_id: s.persona_id })
      MERGE (us)-[:BELONGS_TO]->(feat)
      MERGE (us)-[:SUPPORTS_WORKFLOW]->(wf)
      MERGE (us)-[:REALIZES]->(req)
      MERGE (per)-[:EXECUTES]->(us)
      WITH us, req, s
      UNWIND s.rule_ids AS brid
      MATCH (br:BusinessRule { rule_id: brid })
      MERGE (us)-[:GOVERNED_BY]->(br)
      MERGE (req)-[:GOVERNED_BY]->(br)
    `, { stories, releaseId: RELEASE_ID });

    console.log('[Step 5/7] Ingesting 15 Tables, 15 Entities, 48 PHP Classes, 28 API Endpoints & 12 Vue Components...');
    const tablesEntities = [
      { table: 'ohrm_pay_period', entity: 'PayrollPayPeriod' },
      { table: 'ohrm_payroll_config', entity: 'PayrollConfig' },
      { table: 'ohrm_payroll_statutory_rule', entity: 'PayrollStatutoryRule' },
      { table: 'ohrm_payroll_tax_bracket', entity: 'PayrollTaxBracket' },
      { table: 'ohrm_payroll_leave_policy', entity: 'PayrollLeavePolicy' },
      { table: 'ohrm_payroll_emp_profile', entity: 'EmployeePayrollProfile' },
      { table: 'ohrm_payroll_run', entity: 'PayrollRun' },
      { table: 'ohrm_payroll_emp_snapshot', entity: 'PayrollEmployeeSnapshot' },
      { table: 'ohrm_payroll_record', entity: 'PayrollRecord' },
      { table: 'ohrm_payroll_item', entity: 'PayrollItem' },
      { table: 'ohrm_payroll_payment_batch', entity: 'PayrollPaymentBatch' },
      { table: 'ohrm_payroll_claim_link', entity: 'PayrollClaimLink' },
      { table: 'ohrm_payroll_approval', entity: 'PayrollApproval' },
      { table: 'ohrm_salary_slip', entity: 'SalarySlip' },
      { table: 'ohrm_payroll_audit_event', entity: 'PayrollAuditEvent' }
    ];
    await session.run(`
      MATCH (p:Plugin { name: 'orangehrmPayrollPlugin' })
      MATCH (v22:Release { version_id: $releaseId })
      UNWIND $tablesEntities AS te
      CREATE (tbl:DatabaseTable {
        name: te.table,
        plugin: 'orangehrmPayrollPlugin',
        version: $releaseId,
        introduced_in: $releaseId,
        versions: [$releaseId]
      })
      CREATE (ent:DatabaseEntity {
        name: te.entity,
        fqcn: 'OrangeHRM\\\\Entity\\\\' + te.entity,
        source_file: 'orange_hrm/src/plugins/orangehrmPayrollPlugin/entity/' + te.entity + '.php',
        plugin: 'orangehrmPayrollPlugin',
        version: $releaseId,
        introduced_in: $releaseId,
        versions: [$releaseId]
      })
      CREATE (ent)-[:MAPS_TO]->(tbl)
      CREATE (p)-[:DECLARES]->(ent)
      CREATE (tbl)-[:INTRODUCED_IN]->(v22), (tbl)-[:SUPPORTED_IN]->(v22)
      CREATE (ent)-[:INTRODUCED_IN]->(v22), (ent)-[:SUPPORTED_IN]->(v22)
    `, { tablesEntities, releaseId: RELEASE_ID });

    const classes = [
      // 22 API classes
      ...'EmployeePayslipsAPI,EmployeeStatutoryProfileAPI,PayPeriodAPI,PayrollAdjustmentAPI,PayrollAuditAPI,PayrollConfigAPI,PayrollLeavePolicyAPI,PayrollPaymentBatchAPI,PayrollPaymentExportAPI,PayrollPaymentReconcileAPI,PayrollRecordAPI,PayrollRunAPI,PayrollRunApproveAPI,PayrollRunCalculateAPI,PayrollRunLockAPI,PayrollRunRejectAPI,PayrollRunReverseAPI,PayrollRunSubmitAPI,PayrollStatutoryRuleAPI,PayrollTaxBracketAPI,SalarySlipAPI,SalarySlipDocumentAPI'
        .split(',').map((name) => ({ name, fqcn: `OrangeHRM\\Payroll\\Api\\${name}`, kind: 'API' })),
      // 11 Web Controllers
      ...'BasePayrollController,PayrollModuleController,PayPeriodsController,PayrollProcessingController,PayrollPaymentsController,PayrollAuditController,PayrollConfigurationController,EmployeePayslipsController,EmployeeStatutoryProfileController,MySalarySlipsController,SalarySlipDownloadController'
        .split(',').map((name) => ({ name, fqcn: `OrangeHRM\\Payroll\\Controller\\${name}`, kind: 'Controller' })),
      // 12 Services & Adapters + OvertimePolicyService
      ...'PayrollApplicationService,PayrollCalculationService,PayrollConfigService,PayrollEmployeeSnapshotService,PayrollPaymentService,PayrollSlipService,PayrollWorkflowService,IndianStatutoryCalculator,LeavePayrollAdapter,TimeAttendancePayrollAdapter,ClaimSettlementAdapter,OvertimePolicyService'
        .split(',').map((name) => ({ name, fqcn: `OrangeHRM\\Payroll\\Service\\${name}`, kind: 'Service' })),
      // 3 DAOs
      ...'PayrollConfigDao,PayrollPeriodDao,PayrollRunDao'
        .split(',').map((name) => ({ name, fqcn: `OrangeHRM\\Payroll\\Dao\\${name}`, kind: 'Dao' }))
    ];
    await session.run(`
      MATCH (p:Plugin { name: 'orangehrmPayrollPlugin' })
      MATCH (v22:Release { version_id: $releaseId })
      UNWIND $classes AS c
      CREATE (cls:Class {
        name: c.name,
        fqcn: c.fqcn,
        kind: c.kind,
        plugin: 'orangehrmPayrollPlugin',
        version: $releaseId,
        introduced_in: $releaseId,
        versions: [$releaseId]
      })
      CREATE (p)-[:DECLARES]->(cls)
      CREATE (cls)-[:INTRODUCED_IN]->(v22), (cls)-[:SUPPORTED_IN]->(v22)
    `, { classes, releaseId: RELEASE_ID });

    const endpoints = [
      { id: 'apiv2_payroll_pay_periods', methods: 'GET, POST, DELETE', path: '/api/v2/payroll/pay-periods', cls: 'PayPeriodAPI', feat: 'FEAT_PAY_PERIOD' },
      { id: 'apiv2_payroll_pay_period', methods: 'GET, PUT', path: '/api/v2/payroll/pay-periods/{id}', cls: 'PayPeriodAPI', feat: 'FEAT_PAY_PERIOD' },
      { id: 'apiv2_payroll_runs', methods: 'GET, POST', path: '/api/v2/payroll/runs', cls: 'PayrollRunAPI', feat: 'FEAT_PAY_SNAPSHOT' },
      { id: 'apiv2_payroll_run', methods: 'GET, PUT', path: '/api/v2/payroll/runs/{id}', cls: 'PayrollRunAPI', feat: 'FEAT_PAY_SNAPSHOT' },
      { id: 'apiv2_payroll_run_calculate', methods: 'POST', path: '/api/v2/payroll/runs/{runId}/calculate', cls: 'PayrollRunCalculateAPI', feat: 'FEAT_PAY_ENGINE' },
      { id: 'apiv2_payroll_run_submit', methods: 'POST', path: '/api/v2/payroll/runs/{runId}/submit', cls: 'PayrollRunSubmitAPI', feat: 'FEAT_PAY_WF' },
      { id: 'apiv2_payroll_run_approve', methods: 'POST', path: '/api/v2/payroll/runs/{runId}/approve', cls: 'PayrollRunApproveAPI', feat: 'FEAT_PAY_WF' },
      { id: 'apiv2_payroll_run_reject', methods: 'POST', path: '/api/v2/payroll/runs/{runId}/reject', cls: 'PayrollRunRejectAPI', feat: 'FEAT_PAY_WF' },
      { id: 'apiv2_payroll_run_lock', methods: 'POST', path: '/api/v2/payroll/runs/{runId}/lock', cls: 'PayrollRunLockAPI', feat: 'FEAT_PAY_WF' },
      { id: 'apiv2_payroll_run_reverse', methods: 'POST', path: '/api/v2/payroll/runs/{runId}/reverse', cls: 'PayrollRunReverseAPI', feat: 'FEAT_PAY_WF' },
      { id: 'apiv2_payroll_run_records', methods: 'GET', path: '/api/v2/payroll/runs/{runId}/records', cls: 'PayrollRecordAPI', feat: 'FEAT_PAY_ENGINE' },
      { id: 'apiv2_payroll_record', methods: 'GET', path: '/api/v2/payroll/records/{id}', cls: 'PayrollRecordAPI', feat: 'FEAT_PAY_ENGINE' },
      { id: 'apiv2_payroll_record_adjustment', methods: 'GET, PUT', path: '/api/v2/payroll/records/{id}/adjustment', cls: 'PayrollAdjustmentAPI', feat: 'FEAT_PAY_ADJUSTMENT' },
      { id: 'apiv2_payroll_config', methods: 'GET, PUT', path: '/api/v2/payroll/config', cls: 'PayrollConfigAPI', feat: 'FEAT_PAY_CONFIG' },
      { id: 'apiv2_payroll_tax_brackets', methods: 'GET', path: '/api/v2/payroll/tax-brackets', cls: 'PayrollTaxBracketAPI', feat: 'FEAT_PAY_CONFIG' },
      { id: 'apiv2_payroll_tax_bracket', methods: 'PUT', path: '/api/v2/payroll/tax-brackets/{id}', cls: 'PayrollTaxBracketAPI', feat: 'FEAT_PAY_CONFIG' },
      { id: 'apiv2_payroll_statutory_rules', methods: 'GET', path: '/api/v2/payroll/statutory-rules', cls: 'PayrollStatutoryRuleAPI', feat: 'FEAT_PAY_CONFIG' },
      { id: 'apiv2_payroll_leave_policies', methods: 'GET', path: '/api/v2/payroll/leave-policies', cls: 'PayrollLeavePolicyAPI', feat: 'FEAT_PAY_CONFIG' },
      { id: 'apiv2_payroll_leave_policy', methods: 'PUT', path: '/api/v2/payroll/leave-policies/{id}', cls: 'PayrollLeavePolicyAPI', feat: 'FEAT_PAY_CONFIG' },
      { id: 'apiv2_payroll_payment_batches', methods: 'GET, POST', path: '/api/v2/payroll/payment-batches', cls: 'PayrollPaymentBatchAPI', feat: 'FEAT_PAY_PAYMENT' },
      { id: 'apiv2_payroll_payment_batch', methods: 'GET', path: '/api/v2/payroll/payment-batches/{id}', cls: 'PayrollPaymentBatchAPI', feat: 'FEAT_PAY_PAYMENT' },
      { id: 'apiv2_payroll_payment_batch_export', methods: 'POST', path: '/api/v2/payroll/payment-batches/{batchId}/export', cls: 'PayrollPaymentExportAPI', feat: 'FEAT_PAY_PAYMENT' },
      { id: 'apiv2_payroll_payment_batch_reconcile', methods: 'POST', path: '/api/v2/payroll/payment-batches/{batchId}/reconcile', cls: 'PayrollPaymentReconcileAPI', feat: 'FEAT_PAY_PAYMENT' },
      { id: 'apiv2_payroll_my_slips', methods: 'GET', path: '/api/v2/payroll/my-salary-slips', cls: 'SalarySlipAPI', feat: 'FEAT_PAY_SLIPS' },
      { id: 'apiv2_payroll_slip_document', methods: 'GET', path: '/api/v2/payroll/slips/{id}', cls: 'SalarySlipDocumentAPI', feat: 'FEAT_PAY_SLIPS' },
      { id: 'apiv2_payroll_employee_payslips', methods: 'GET', path: '/api/v2/payroll/employees/{empNumber}/payslips', cls: 'EmployeePayslipsAPI', feat: 'FEAT_PAY_SLIPS' },
      { id: 'apiv2_payroll_employee_statutory_profile', methods: 'GET, PUT', path: '/api/v2/payroll/employees/{empNumber}/statutory-profile', cls: 'EmployeeStatutoryProfileAPI', feat: 'FEAT_PAY_SNAPSHOT' },
      { id: 'apiv2_payroll_audit_events', methods: 'GET', path: '/api/v2/payroll/audit-events', cls: 'PayrollAuditAPI', feat: 'FEAT_PAY_ADJUSTMENT' }
    ];
    await session.run(`
      MATCH (p:Plugin { name: 'orangehrmPayrollPlugin' })
      MATCH (v22:Release { version_id: $releaseId })
      UNWIND $endpoints AS e
      CREATE (ep:ApiEndpoint {
        endpoint_id: e.id,
        http_method: e.methods,
        path: e.path,
        route_name: e.id,
        handler_class: 'OrangeHRM\\\\Payroll\\\\Api\\\\' + e.cls,
        plugin: 'orangehrmPayrollPlugin',
        version: $releaseId,
        introduced_in: $releaseId,
        versions: [$releaseId]
      })
      CREATE (p)-[:EXPOSES]->(ep)
      CREATE (ep)-[:INTRODUCED_IN]->(v22), (ep)-[:SUPPORTED_IN]->(v22)
      WITH ep, e
      MATCH (cls:Class { fqcn: 'OrangeHRM\\\\Payroll\\\\Api\\\\' + e.cls })
      MATCH (feat:Feature { feature_id: e.feat })
      MERGE (ep)-[:HANDLED_BY]->(cls)
      MERGE (feat)-[:EXPOSES]->(ep)
    `, { endpoints, releaseId: RELEASE_ID });

    const uiItems = [
      { comp: 'PayPeriods', page: 'pay-periods', feat: 'FEAT_PAY_PERIOD', file: 'pages/payPeriods/PayPeriods.vue' },
      { comp: 'PayrollProcessing', page: 'payroll-processing', feat: 'FEAT_PAY_ENGINE', file: 'pages/processing/PayrollProcessing.vue' },
      { comp: 'PayrollPayments', page: 'payroll-payments', feat: 'FEAT_PAY_PAYMENT', file: 'pages/payments/PayrollPayments.vue' },
      { comp: 'PayrollAuditTrail', page: 'payroll-audit-trail', feat: 'FEAT_PAY_ADJUSTMENT', file: 'pages/audit/PayrollAuditTrail.vue' },
      { comp: 'PayrollConfiguration', page: 'payroll-configuration', feat: 'FEAT_PAY_CONFIG', file: 'pages/config/PayrollConfiguration.vue' },
      { comp: 'EmployeePayslips', page: 'pim-employee-payslips', feat: 'FEAT_PAY_SLIPS', file: 'pages/pim/EmployeePayslips.vue' },
      { comp: 'EmployeeStatutoryProfile', page: 'pim-employee-statutory-profile', feat: 'FEAT_PAY_SNAPSHOT', file: 'pages/pim/EmployeeStatutoryProfile.vue' },
      { comp: 'MySalarySlips', page: 'my-salary-slips', feat: 'FEAT_PAY_SLIPS', file: 'pages/slips/MySalarySlips.vue' },
      { comp: 'PayPeriodModal', page: 'pay-periods', feat: 'FEAT_PAY_PERIOD', file: 'components/PayPeriodModal.vue' },
      { comp: 'PayrollStatusBadge', page: 'payroll-processing', feat: 'FEAT_PAY_WF', file: 'components/PayrollStatusBadge.vue' },
      { comp: 'PayslipPreviewModal', page: 'my-salary-slips', feat: 'FEAT_PAY_SLIPS', file: 'components/PayslipPreviewModal.vue' },
      { comp: 'RecordAdjustmentModal', page: 'payroll-processing', feat: 'FEAT_PAY_ADJUSTMENT', file: 'components/RecordAdjustmentModal.vue' }
    ];
    await session.run(`
      MATCH (p:Plugin { name: 'orangehrmPayrollPlugin' })
      MATCH (v22:Release { version_id: $releaseId })
      UNWIND $uiItems AS u
      CREATE (uic:UIComponent {
        component_id: 'VUE_PAY_' + toUpper(u.comp),
        name: u.comp,
        file: 'orange_hrm/src/client/src/orangehrmPayrollPlugin/' + u.file,
        type: 'VueComponent',
        plugin: 'orangehrmPayrollPlugin',
        version: $releaseId,
        introduced_in: $releaseId,
        versions: [$releaseId]
      })
      CREATE (uic)-[:DECLARED_IN]->(p)
      CREATE (uic)-[:INTRODUCED_IN]->(v22), (uic)-[:SUPPORTED_IN]->(v22)
      WITH uic, u, v22
      MERGE (pg:UIPage { page_id: u.page })
      SET pg.title = u.page,
          pg.plugin = 'orangehrmPayrollPlugin',
          pg.version = $releaseId,
          pg.introduced_in = $releaseId,
          pg.versions = [$releaseId]
      MERGE (pg)-[:RENDERS]->(uic)
      MERGE (pg)-[:INTRODUCED_IN]->(v22)
      MERGE (pg)-[:SUPPORTED_IN]->(v22)
      WITH uic, u
      MATCH (us:UserStory { feature_id: u.feat })
      MERGE (us)-[:IMPLEMENTED_BY]->(uic)
    `, { uiItems, releaseId: RELEASE_ID });

    console.log('[Step 6/7] Ingesting 41 Real Executed Payroll Tests across 10 Suites...');
    const testStats = await ingestPayrollTests(session, RELEASE_ID);
    console.log(`✓ Synced ${testStats.suitesCount} suites and ${testStats.testCasesCount} real executed tests.`);

    console.log('[Step 7/7] Running Final Neo4j Multi-Version Audit...');
    const v1Cnt = (await session.run(`MATCH (v1:Release { version_id: 'v1.0' })<-[:SUPPORTED_IN]-(n) RETURN count(n) AS c`)).records[0].get('c').toNumber();
    const v22Cnt = (await session.run(`MATCH (v22:Release { version_id: $releaseId })<-[:SUPPORTED_IN]-(n) RETURN count(n) AS c`, { releaseId: RELEASE_ID })).records[0].get('c').toNumber();
    const deltaRes = await session.run(`MATCH (v22:Release { version_id: $releaseId })<-[:INTRODUCED_IN]-(n) RETURN labels(n)[0] AS lbl, count(n) AS cnt ORDER BY cnt DESC`, { releaseId: RELEASE_ID });

    console.log('\n========================================================================');
    console.log('  NEO4J MULTI-VERSION AUDIT COMPLETE');
    console.log(`  v1.0 Baseline Elements           : ${v1Cnt}`);
    console.log(`  ${RELEASE_ID} Total Elements : ${v22Cnt}`);
    console.log('  Newly Introduced v2.2 Payroll Nodes:');
    deltaRes.records.forEach((r) => console.log(`   - ${r.get('lbl').padEnd(18)}: +${r.get('cnt').toNumber()}`));
    console.log('========================================================================\n');
  } finally {
    await session.close();
    await driver.close();
  }
}

main().catch((err) => {
  console.error('Neo4j ingestion failed:', err);
  process.exit(1);
});
