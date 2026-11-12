/**
 * Payroll v2.2 Domain Specifications, User Stories, Versioning & Code-Traceability Linker
 *
 * Keeps Payroll specs (Domain, Workflows, Features, FR_PAY_001..012, BR_PAY_001..016,
 * Personas, US_PAY_001..012, Docs) and Release nodes intact across the graph, linking
 * them ONLY to verified AST-extracted ApiEndpoints, UIComponents/UIPages, and the 18
 * real AST-parsed PHPUnit unit/component tests (never fake Classes, typoed UI paths,
 * or synthetic E2E/UI/TC_PAY_* QA manifest nodes).
 */

const fs = require('fs');
const path = require('path');
const { PAYROLL_EXT_DIR } = require('./qkg_config');

const RELEASE_V1_ID = 'v1.0';
const RELEASE_V2_ID = 'v2.2-india-payroll';

const PAYROLL_DOMAIN = {
  domain_id: 'DOMAIN_PAYROLL',
  name: 'India Payroll & Statutory Disbursement',
  plugin: 'orangehrmPayrollPlugin'
};

const PAYROLL_WORKFLOWS = [
  { workflow_id: 'WF_PAYROLL_CONFIG', name: 'India Jurisdiction, FY 2026-27 Slab & LWP Config Workflow', type: 'IndiaPayrollExtension', features: ['FEAT_PAY_CONFIG'] },
  { workflow_id: 'WF_PAYROLL_PERIOD', name: 'Monthly INR Pay Period Calendar & Overlap Validation', type: 'IndiaPayrollExtension', features: ['FEAT_PAY_PERIOD'] },
  { workflow_id: 'WF_PAYROLL_PROFILE', name: 'PIM Statutory Profile, Tax Regime & Masked Bank Management', type: 'IndiaPayrollExtension', features: ['FEAT_PAY_SNAPSHOT'] },
  { workflow_id: 'WF_PAYROLL_RUN', name: 'Batch Snapshot, Cross-Module Intake, Statutory Engine & Override', type: 'IndiaPayrollExtension', features: ['FEAT_PAY_CROSS', 'FEAT_PAY_ENGINE', 'FEAT_PAY_ADJUSTMENT'] },
  { workflow_id: 'WF_PAYROLL_APPROVAL', name: 'Maker-Checker Submit, Reject/Approve, Lock & Reverse Governance', type: 'IndiaPayrollExtension', features: ['FEAT_PAY_WF'] },
  { workflow_id: 'WF_PAYROLL_DISBURSEMENT', name: 'NEFT Bank CSV Guard, Export & UTR Claim Settlement', type: 'IndiaPayrollExtension', features: ['FEAT_PAY_PAYMENT'] },
  { workflow_id: 'WF_PAYROLL_ESS', name: 'ESS & PIM Self-Service INR Payslip Preview & IDOR Enforcement', type: 'IndiaPayrollExtension', features: ['FEAT_PAY_SLIPS'] }
];

const PAYROLL_FEATURES = [
  { feature_id: 'FEAT_PAY_CONFIG', name: 'India Jurisdiction, Slabs & LWP Policy Config', pathPrefixes: ['/api/v2/payroll/config', '/api/v2/payroll/tax-brackets', '/api/v2/payroll/statutory-rules', '/api/v2/payroll/leave-policies'] },
  { feature_id: 'FEAT_PAY_PERIOD', name: 'India Monthly INR Pay Periods', pathPrefixes: ['/api/v2/payroll/pay-periods'] },
  { feature_id: 'FEAT_PAY_SNAPSHOT', name: 'PIM Statutory Profile & Run Snapshot Isolation', pathPrefixes: ['/api/v2/payroll/employees/{empNumber}/statutory-profile', '/statutory-profile'] },
  { feature_id: 'FEAT_PAY_CROSS', name: 'Cross-Module Leave LWP, Time OT & Claim Reservation', pathPrefixes: ['/calculate', '/leave-policies'] },
  { feature_id: 'FEAT_PAY_ENGINE', name: 'Indian Statutory Engine (EPF, ESIC, PT, FY26-27 TDS)', pathPrefixes: ['/api/v2/payroll/runs', '/api/v2/payroll/records'] },
  { feature_id: 'FEAT_PAY_ADJUSTMENT', name: 'Audited Manual Overrides & Append-Only Audit Log', pathPrefixes: ['/adjustment', '/api/v2/payroll/audit-events'] },
  { feature_id: 'FEAT_PAY_WF', name: 'Maker-Checker SoD Workflow & Locking', pathPrefixes: ['/submit', '/reject', '/approve', '/lock', '/reverse'] },
  { feature_id: 'FEAT_PAY_PAYMENT', name: 'NEFT CSV Export Guard & Bank UTR Claim Settlement', pathPrefixes: ['/api/v2/payroll/payment-batches'] },
  { feature_id: 'FEAT_PAY_SLIPS', name: 'Published INR HTML Payslips & ESS BOLA Protection', pathPrefixes: ['/api/v2/payroll/my-salary-slips', '/api/v2/payroll/slips', '/payroll/slips', '/payslips'] }
];

const PAYROLL_REQUIREMENTS = [
  { requirement_id: 'FR_PAY_001', feature_id: 'FEAT_PAY_CONFIG', title: 'India Config, Tax Brackets & Leave Policy', priority: 'Critical', status: 'Verified', type: 'FR', rule_ids: ['BR_PAY_001', 'BR_PAY_005', 'BR_PAY_012'] },
  { requirement_id: 'FR_PAY_002', feature_id: 'FEAT_PAY_PERIOD', title: 'Pay Period Management & Overlap Check', priority: 'Critical', status: 'Verified', type: 'FR', rule_ids: ['BR_PAY_001', 'BR_PAY_002'] },
  { requirement_id: 'FR_PAY_003', feature_id: 'FEAT_PAY_SNAPSHOT', title: 'PIM Statutory Profile & Masked Bank Exposure', priority: 'Critical', status: 'Verified', type: 'FR', rule_ids: ['BR_PAY_004', 'BR_PAY_016'] },
  { requirement_id: 'FR_PAY_004', feature_id: 'FEAT_PAY_SNAPSHOT', title: 'Idempotent Runs & Frozen Snapshots', priority: 'Critical', status: 'Verified', type: 'FR', rule_ids: ['BR_PAY_001', 'BR_PAY_003', 'BR_PAY_004'] },
  { requirement_id: 'FR_PAY_005', feature_id: 'FEAT_PAY_CROSS', title: 'Leave LWP Intake & Divisors', priority: 'Critical', status: 'Verified', type: 'FR', rule_ids: ['BR_PAY_005'] },
  { requirement_id: 'FR_PAY_006', feature_id: 'FEAT_PAY_CROSS', title: 'Time/Attendance Intake & Overtime Ceiling', priority: 'Critical', status: 'Verified', type: 'FR', rule_ids: ['BR_PAY_006', 'BR_PAY_007'] },
  { requirement_id: 'FR_PAY_007', feature_id: 'FEAT_PAY_ENGINE', title: 'Indian Statutory & TDS Calculation', priority: 'Critical', status: 'Verified', type: 'FR', rule_ids: ['BR_PAY_009', 'BR_PAY_010', 'BR_PAY_011', 'BR_PAY_012'] },
  { requirement_id: 'FR_PAY_008', feature_id: 'FEAT_PAY_CROSS', title: 'Claim Reservation & Anti-Double-Payout', priority: 'Critical', status: 'Verified', type: 'FR', rule_ids: ['BR_PAY_008', 'BR_PAY_010'] },
  { requirement_id: 'FR_PAY_009', feature_id: 'FEAT_PAY_ADJUSTMENT', title: 'Audited Adjustments Before Submit', priority: 'Critical', status: 'Verified', type: 'FR', rule_ids: ['BR_PAY_014'] },
  { requirement_id: 'FR_PAY_010', feature_id: 'FEAT_PAY_WF', title: 'Maker-Checker SoD & Publication', priority: 'Critical', status: 'Verified', type: 'FR', rule_ids: ['BR_PAY_013', 'BR_PAY_014'] },
  { requirement_id: 'FR_PAY_011', feature_id: 'FEAT_PAY_PAYMENT', title: 'NEFT CSV Export Guard & UTR Settlement', priority: 'Critical', status: 'Verified', type: 'FR', rule_ids: ['BR_PAY_008', 'BR_PAY_015'] },
  { requirement_id: 'FR_PAY_012', feature_id: 'FEAT_PAY_SLIPS', title: 'ESS Self-Service & Download', priority: 'Critical', status: 'Verified', type: 'FR', rule_ids: ['BR_PAY_016'] }
];

const PAYROLL_RULES = [
  { rule_id: 'BR_PAY_001', name: 'Single Jurisdiction & INR Currency Enforcement', description: 'Every pay period and payroll run operates in jurisdiction IN and currency INR.' },
  { rule_id: 'BR_PAY_002', name: 'Pay Period Date Non-Overlap', description: 'Overlapping [startDate, endDate] intervals in jurisdiction IN are rejected HTTP 400/409.' },
  { rule_id: 'BR_PAY_003', name: 'Idempotent Run Creation', description: 'Duplicate idempotencyKey returns existing PayrollRun without creating duplicate runs.' },
  { rule_id: 'BR_PAY_004', name: 'Immutable PIM Snapshot per Run', description: 'Batch calculation freezes eligibility, salary, tax regime and masked bank into ohrm_payroll_emp_snapshot.' },
  { rule_id: 'BR_PAY_005', name: 'Explicit Leave LWP Policy & Divisor Modes', description: 'Maps Approved/Taken leaves via ohrm_payroll_leave_policy with CALENDAR_DAYS, WORKING_DAYS, or FIXED_30.' },
  { rule_id: 'BR_PAY_006', name: 'Attendance vs Timesheet Non-Double-Counting', description: 'Reads Attendance or Timesheet from one primary mode without summing both sources.' },
  { rule_id: 'BR_PAY_007', name: 'Overtime Eligibility Ceiling (Rs 50,000)', description: 'Overtime applies only when monthly basic salary <= overtime_eligible_max_basic.' },
  { rule_id: 'BR_PAY_008', name: 'Single-Run Claim Reservation Lock (uq_active_claim_lock)', description: 'UNIQUE active_claim_lock prevents double payout across concurrent runs.' },
  { rule_id: 'BR_PAY_009', name: 'EPF/EPS Calculation & Rs 15,000 Ceiling', description: '12% EE EPF with optional 15k cap and 8.33% EPS (1,250 max) / 3.67% EPF split.' },
  { rule_id: 'BR_PAY_010', name: 'ESIC Applicability Ceiling (Rs 21,000) & Claim Exclusion', description: 'ESIC 0.75%/3.25% ceil rupee when gross <= 21k, excluding expense claims.' },
  { rule_id: 'BR_PAY_011', name: 'State Professional Tax & Maharashtra February Rs 300 Slab', description: 'State PT rules including MH February Rs 300 override.' },
  { rule_id: 'BR_PAY_012', name: 'TDS u/s 115BAC vs Old Regime, Sec 87A 12L Rebate & Sec 288B', description: 'FY 2026-27 slabs, Sec 87A <= 12L rebate, Sec 288B Rs 10 rounding + 4% Cess.' },
  { rule_id: 'BR_PAY_013', name: 'Maker-Checker Separation of Duties (HTTP 403 SoD)', description: 'Creator/submitter blocked HTTP 403 from approving or locking own run.' },
  { rule_id: 'BR_PAY_014', name: 'Immutability After Submission & Locking', description: 'Adjustments allowed only in CALCULATED/REJECTED; lock publishes slips atomically.' },
  { rule_id: 'BR_PAY_015', name: 'Bank Validation Before NEFT Export & UTR Claim PAID', description: 'NEFT CSV export blocked 422 if bank/IFSC missing; UTR reconcile settles linked claims PAID.' },
  { rule_id: 'BR_PAY_016', name: 'Bank Account Masking & ESS Slip BOLA Isolation', description: 'Only masked XXXXXX bank numbers exposed; ESS users limited to own PUBLISHED slips.' }
];

const PAYROLL_PERSONAS = [
  { persona_id: 'PERSONA_PAYROLL_MAKER', name: 'Payroll Maker / HR Operations Admin (Role 1)', role: 'Admin' },
  { persona_id: 'PERSONA_PAYROLL_APPROVER', name: 'Finance Checker / Payroll Approver (Role 8)', role: 'PayrollApprover' },
  { persona_id: 'PERSONA_ESS', name: 'Employee Self-Service User (Role 2)', role: 'ESS' }
];

async function purgeSyntheticPayrollTests(session) {
  await session.run(`
    MATCH (tc:TestCase)
    WHERE coalesce(tc.module, '') = 'Payroll' AND coalesce(tc.origin, '') <> 'AST_PHPUNIT'
       OR tc.testcase_id STARTS WITH 'TC_PAY_'
       OR tc.testcase_id STARTS WITH 'E2E-'
       OR tc.testcase_id STARTS WITH 'UI-'
    DETACH DELETE tc
  `);
  await session.run(`
    MATCH (ts:TestSuite)
    WHERE ts.name IN ['India_Payroll_E2E_Suite', 'Playwright_OXD_UI_Suite']
       OR ts.suite_id IN ['India_Payroll_E2E_Suite', 'Playwright_OXD_UI_Suite']
       OR (coalesce(ts.module, '') = 'Payroll' AND coalesce(ts.origin, '') = 'MANIFEST')
    DETACH DELETE ts
  `);
}

async function ingestPayrollSpecsAndVersioning(session, {
  snapshotId = null,
  commitSha = null,
  apiEndpoints = [],
  testCases = []
} = {}) {
  await purgeSyntheticPayrollTests(session);

  // 1. Releases
  await session.run(`
    MERGE (r1:Release { version_id: $v1 })
    SET r1.name = 'OrangeHRM Baseline v1.0',
        r1.status = 'Baseline Production',
        r1.branch = 'main',
        r1.release_date = '2026-11-04',
        r1.description = 'Baseline across 22 plugins with AST-linked PHPUnit suites and core Jest specs'
    MERGE (r2:Release { version_id: $v2 })
    SET r2.name = 'OrangeHRM v2.2 India Payroll Extension',
        r2.status = 'Verified Release Candidate',
        r2.branch = 'v2-main',
        r2.release_date = '2026-11-11',
        r2.description = 'India FY 2026-27 INR Payroll extension (15 tables, 22 API classes, 18 PHPUnit unit/component tests; API/UI Playwright suite pending QA)'
    MERGE (r1)-[:EVOLVED_TO]->(r2)
  `, { v1: RELEASE_V1_ID, v2: RELEASE_V2_ID });

  // 2. Domain, Workflows, Features, Requirements, Rules, Personas
  await session.run(`
    MERGE (p:Plugin { name: 'orangehrmPayrollPlugin' })
    SET p.version = $v2, p.introduced_in = $v2, p.versions = [$v2], p.snapshot_id = coalesce(p.snapshot_id, $snapshotId)
    MERGE (d:BusinessDomain { domain_id: $domain.domain_id })
    SET d.name = $domain.name, d.plugin = $domain.plugin, d.version = $v2, d.introduced_in = $v2, d.versions = [$v2], d.snapshot_id = $snapshotId
    MERGE (p)-[:CONTAINS]->(d)
  `, { domain: PAYROLL_DOMAIN, v2: RELEASE_V2_ID, snapshotId });

  await session.run(`
    UNWIND $workflows AS wf
    MATCH (d:BusinessDomain { domain_id: 'DOMAIN_PAYROLL' })
    MERGE (w:BusinessWorkflow { workflow_id: wf.workflow_id })
    SET w.name = wf.name, w.type = wf.type, w.plugin = 'orangehrmPayrollPlugin',
        w.version = $v2, w.introduced_in = $v2, w.versions = [$v2], w.snapshot_id = $snapshotId
    MERGE (d)-[:CONTAINS]->(w)
  `, { workflows: PAYROLL_WORKFLOWS, v2: RELEASE_V2_ID, snapshotId });

  await session.run(`
    UNWIND $features AS f
    MERGE (feat:Feature { feature_id: f.feature_id })
    SET feat.name = f.name, feat.plugin = 'orangehrmPayrollPlugin',
        feat.version = $v2, feat.introduced_in = $v2, feat.versions = [$v2], feat.snapshot_id = $snapshotId
    WITH feat, f
    UNWIND $workflows AS wf
    WITH feat, wf WHERE f.feature_id IN wf.features
    MATCH (w:BusinessWorkflow { workflow_id: wf.workflow_id })
    MERGE (w)-[:DECOMPOSES_TO]->(feat)
  `, { features: PAYROLL_FEATURES, workflows: PAYROLL_WORKFLOWS, v2: RELEASE_V2_ID, snapshotId });

  await session.run(`
    UNWIND $rules AS br
    MERGE (r:BusinessRule { rule_id: br.rule_id })
    SET r.name = br.name, r.description = br.description, r.plugin = 'orangehrmPayrollPlugin',
        r.version = $v2, r.introduced_in = $v2, r.versions = [$v2], r.snapshot_id = $snapshotId
  `, { rules: PAYROLL_RULES, v2: RELEASE_V2_ID, snapshotId });

  await session.run(`
    UNWIND $reqs AS req
    MATCH (feat:Feature { feature_id: req.feature_id })
    MERGE (r:Requirement { requirement_id: req.requirement_id })
    SET r.title = req.title, r.type = req.type, r.priority = req.priority, r.status = req.status,
        r.plugin = 'orangehrmPayrollPlugin', r.version = $v2, r.introduced_in = $v2, r.versions = [$v2], r.snapshot_id = $snapshotId
    MERGE (feat)-[:HAS_REQUIREMENT]->(r)
    WITH r, req
    UNWIND req.rule_ids AS ruleId
    MATCH (br:BusinessRule { rule_id: ruleId })
    MERGE (r)-[:GOVERNED_BY]->(br)
  `, { reqs: PAYROLL_REQUIREMENTS, v2: RELEASE_V2_ID, snapshotId });

  await session.run(`
    UNWIND $personas AS ps
    MERGE (p:Persona { persona_id: ps.persona_id })
    SET p.name = ps.name, p.role = ps.role, p.plugin = 'orangehrmPayrollPlugin',
        p.version = $v2, p.introduced_in = $v2, p.versions = [$v2], p.snapshot_id = $snapshotId
  `, { personas: PAYROLL_PERSONAS, v2: RELEASE_V2_ID, snapshotId });

  // 3. UserStories from user_stories.json linked strictly to real AST ApiEndpoints & UIComponents
  const storiesPath = path.join(PAYROLL_EXT_DIR, '01_Business_Requirements', 'user_stories.json');
  const stories = fs.existsSync(storiesPath) ? JSON.parse(fs.readFileSync(storiesPath, 'utf8')) : [];
  if (stories.length > 0) {
    await session.run(`
      UNWIND $stories AS s
      MERGE (us:UserStory { story_id: s.story_id })
      SET us.title = s.title, us.statement = s.statement, us.domain_id = s.domain_id,
          us.feature_id = s.feature_id, us.workflow_id = s.workflow_id, us.requirement_id = s.requirement_id,
          us.plugin = 'orangehrmPayrollPlugin', us.version = $v2, us.introduced_in = $v2, us.versions = [$v2], us.snapshot_id = $snapshotId
      WITH us, s
      MATCH (p:Persona { persona_id: s.persona_id })
      MATCH (f:Feature { feature_id: s.feature_id })
      MATCH (wf:BusinessWorkflow { workflow_id: s.workflow_id })
      MATCH (req:Requirement { requirement_id: s.requirement_id })
      MERGE (p)-[:EXECUTES]->(us)
      MERGE (us)-[:BELONGS_TO]->(f)
      MERGE (us)-[:SUPPORTS_WORKFLOW]->(wf)
      MERGE (us)-[:REALIZES]->(req)
      WITH us, s
      UNWIND s.rule_ids AS rid
      MATCH (br:BusinessRule { rule_id: rid })
      MERGE (us)-[:GOVERNED_BY]->(br)
    `, { stories, v2: RELEASE_V2_ID, snapshotId });

    // Link UserStory -> real RoutesExtractor ApiEndpoint via target_endpoints ("METHOD /path")
    const storyEpLinks = [];
    for (const st of stories) {
      for (const epSpec of st.target_endpoints || []) {
        const [httpMethod, ...rest] = epSpec.trim().split(/\s+/);
        const epPath = rest.join(' ');
        if (httpMethod && epPath) {
          storyEpLinks.push({ story_id: st.story_id, endpoint_id: `${httpMethod}_${epPath}` });
        }
      }
    }
    if (storyEpLinks.length > 0) {
      await session.run(`
        UNWIND $links AS l
        MATCH (us:UserStory { story_id: l.story_id })
        MATCH (ep:ApiEndpoint { endpoint_id: l.endpoint_id })
        MERGE (us)-[r:EXECUTES_VIA]->(ep)
        SET r.evidence_type = 'SPEC_STORY_ENDPOINT', r.confidence = 0.95,
            r.snapshot_id = $snapshotId, r.commit_sha = $commitSha
      `, { links: storyEpLinks, snapshotId, commitSha });
    }

    // Link UserStory -> real VueAstExtractor UIComponent via target_ui_components
    const storyUiLinks = [];
    for (const st of stories) {
      for (const uiFile of st.target_ui_components || []) {
        storyUiLinks.push({
          story_id: st.story_id,
          compName: uiFile.replace(/\.vue$/, '')
        });
      }
    }
    if (storyUiLinks.length > 0) {
      await session.run(`
        UNWIND $links AS l
        MATCH (us:UserStory { story_id: l.story_id })
        MATCH (ui:UIComponent { plugin: 'orangehrmPayrollPlugin', name: l.compName })
        MERGE (us)-[r:IMPLEMENTED_BY]->(ui)
        SET r.evidence_type = 'SPEC_STORY_UI', r.confidence = 0.95,
            r.snapshot_id = $snapshotId, r.commit_sha = $commitSha
      `, { links: storyUiLinks, snapshotId, commitSha });
    }
  }

  // 4. Feature -[:INCLUDES_ENDPOINT]-> real Payroll ApiEndpoints (disambiguated from Class-[:EXPOSES])
  const payEndpoints = apiEndpoints.filter((e) => e.plugin === 'orangehrmPayrollPlugin');
  const featureEpLinks = [];
  for (const ep of payEndpoints) {
    for (const f of PAYROLL_FEATURES) {
      if (f.pathPrefixes.some((pfx) => ep.path.includes(pfx))) {
        featureEpLinks.push({ feature_id: f.feature_id, endpoint_id: ep.endpoint_id });
      }
    }
  }
  if (featureEpLinks.length > 0) {
    await session.run(`
      UNWIND $links AS l
      MATCH (f:Feature { feature_id: l.feature_id })
      MATCH (ep:ApiEndpoint { endpoint_id: l.endpoint_id })
      MERGE (f)-[r:INCLUDES_ENDPOINT]->(ep)
      SET r.origin = 'PAYROLL_SPEC_DERIVED', r.snapshot_id = $snapshotId, r.commit_sha = $commitSha
    `, { links: featureEpLinks, snapshotId, commitSha });
  }

  // Remove any legacy Feature-[:EXPOSES]->ApiEndpoint overload
  await session.run(`MATCH (:Feature)-[r:EXPOSES]->(:ApiEndpoint) DELETE r`);

  // 5. Link AST-parsed Payroll PHPUnit TestCases (only real unit/component tests!) to Requirements, Stories & Rules
  const payTestLinks = testCases
    .filter((tc) => tc.plugin === 'orangehrmPayrollPlugin' && tc.origin === 'AST_PHPUNIT')
    .map((tc) => ({
      canonical_id: tc.canonical_id,
      reqIds: tc.requirement_ids || [],
      storyIds: tc.story_ids || [],
      ruleIds: tc.rule_ids || []
    }));

  if (payTestLinks.length > 0) {
    await session.run(`
      UNWIND $items AS item
      MATCH (tc:TestCase { canonical_id: item.canonical_id })
      FOREACH (rid IN item.reqIds |
        MERGE (r:Requirement { requirement_id: rid })
        ON CREATE SET r.title = rid, r.type = 'Functional', r.introduced_in = $v2, r.snapshot_id = $snapshotId
        MERGE (tc)-[:VERIFIES { evidence_type: 'PHPUNIT_TRACEABILITY', confidence: 0.9 }]->(r)
      )
      FOREACH (sid IN item.storyIds |
        MERGE (us:UserStory { story_id: sid })
        ON CREATE SET us.title = sid, us.introduced_in = $v2, us.snapshot_id = $snapshotId
        MERGE (tc)-[:VERIFIES_STORY { evidence_type: 'PHPUNIT_TRACEABILITY', confidence: 0.9 }]->(us)
      )
      FOREACH (bid IN item.ruleIds |
        MERGE (br:BusinessRule { rule_id: bid })
        ON CREATE SET br.name = bid, br.introduced_in = $v2, br.snapshot_id = $snapshotId
        MERGE (tc)-[:VALIDATES_RULE { evidence_type: 'PHPUNIT_TRACEABILITY', confidence: 0.9 }]->(br)
      )
    `, { items: payTestLinks, snapshotId, v2: RELEASE_V2_ID });
  }

  // 6. Distinct Release Lifecycle Semantics (QKG-05 / WS5):
  //    - INTRODUCED_IN: release where entity originated
  //    - PRESENT_IN:    factual codebase membership in the release build
  //    - SUPPORTED_IN:  explicitly supported release scope (v1.0 entities -> v1.0; v2.2 entities & explicit Payroll dependency contracts -> v2.2)
  await session.run(`
    MATCH (n)-[oldSup:SUPPORTED_IN]->(:Release { version_id: $v2 })
    WHERE coalesce(n.introduced_in, 'v1.0') = 'v1.0'
    DELETE oldSup
  `, { v2: RELEASE_V2_ID });

  await session.run(`
    MATCH (n)
    WHERE (n:Plugin OR n:Class OR n:Method OR n:ApiEndpoint OR n:UIComponent OR n:UIPage OR n:DatabaseTable OR n:DatabaseEntity OR n:Requirement OR n:BusinessDomain OR n:BusinessWorkflow OR n:Feature OR n:BusinessRule OR n:UserStory OR n:Persona)
      AND coalesce(n.introduced_in, 'v1.0') = 'v1.0'
    MATCH (r1:Release { version_id: $v1 })
    MATCH (r2:Release { version_id: $v2 })
    MERGE (n)-[:INTRODUCED_IN]->(r1)
    MERGE (n)-[:PRESENT_IN]->(r1)
    MERGE (n)-[:SUPPORTED_IN]->(r1)
    MERGE (n)-[:PRESENT_IN]->(r2)
    SET n.versions = CASE WHEN n.versions IS NULL THEN [$v1, $v2] WHEN NOT $v2 IN n.versions THEN n.versions + $v2 ELSE n.versions END
  `, { v1: RELEASE_V1_ID, v2: RELEASE_V2_ID });

  await session.run(`
    MATCH (n)
    WHERE coalesce(n.introduced_in, '') = $v2
    MATCH (r2:Release { version_id: $v2 })
    MERGE (n)-[:INTRODUCED_IN]->(r2)
    MERGE (n)-[:PRESENT_IN]->(r2)
    MERGE (n)-[:SUPPORTED_IN]->(r2)
  `, { v2: RELEASE_V2_ID });

  // Explicit cross-module integration support contracts for v2.2-india-payroll
  await session.run(`
    MATCH (pay:Class { plugin: 'orangehrmPayrollPlugin' })-[:DECLARES]->(:Method)-[:CALLS|READS_TABLE|WRITES_TABLE]->(target)
    WHERE (target:Method OR target:DatabaseTable)
      AND coalesce(target.introduced_in, 'v1.0') = 'v1.0'
    MATCH (r2:Release { version_id: $v2 })
    MERGE (target)-[:SUPPORTED_IN { contract_type: 'PAYROLL_CROSS_MODULE_DEPENDENCY' }]->(r2)
  `, { v2: RELEASE_V2_ID });
}

if (require.main === module) {
  console.error('Use tools/qkg_engine/ingest_pipeline.js to execute full QKG ingestion safely with staging validation.');
  process.exit(1);
}

module.exports = {
  RELEASE_V1_ID,
  RELEASE_V2_ID,
  PAYROLL_DOMAIN,
  PAYROLL_WORKFLOWS,
  PAYROLL_FEATURES,
  PAYROLL_REQUIREMENTS,
  PAYROLL_RULES,
  PAYROLL_PERSONAS,
  purgeSyntheticPayrollTests,
  ingestPayrollSpecsAndVersioning
};
