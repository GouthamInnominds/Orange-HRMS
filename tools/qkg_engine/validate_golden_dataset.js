/**
 * Golden Dataset Validation Suite (22 Active Phase 1-2 Checks: #1-#16, #17-#22)
 *
 * Runs against a Neo4j instance (typically staging bolt://localhost:7688 before
 * promotion to production bolt://localhost:7687) and verifies data integrity,
 * symbol resolution accuracy, test boundary compliance, runtime quality history, and TIA readiness.
 */

const path = require('path');
try {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
} catch (_) {
  // Optional dotenv
}

const neo4j = require('neo4j-driver');
const { validateSchemaContract } = require('./schema_contract');
const { verifyExtractedVsLiveNeo4j } = require('./parity_verifier');

function toNum(v) {
  if (v === null || v === undefined) return 0;
  return typeof v.toNumber === 'function' ? v.toNumber() : Number(v);
}

async function runCheck(session, id, name, cypher, params, evaluate) {
  try {
    const res = await session.run(cypher, params || {});
    const outcome = evaluate(res.records);
    return {
      id,
      name,
      passed: Boolean(outcome.passed),
      detail: outcome.detail
    };
  } catch (err) {
    return {
      id,
      name,
      passed: false,
      detail: `Cypher error: ${err.message}`
    };
  }
}

async function validateGoldenDataset({
  uri = process.env.NEO4J_URI || 'bolt://localhost:7687',
  user = process.env.NEO4J_USER || 'neo4j',
  password = process.env.NEO4J_PASSWORD || 'admin123',
  database = process.env.NEO4J_DATABASE || 'neo4j'
} = {}) {
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session({ database });

  try {
    const checks = [];

    // 1. Payroll synthetic test purge + 18 AST PHPUnit unit tests + full Payroll code/specs
    checks.push(await runCheck(
      session,
      1,
      'Payroll QA test purge + 18 AST PHPUnit unit tests + specs intact',
      `
      CALL {
        MATCH (tc:TestCase)
        WHERE tc.testcase_id STARTS WITH 'TC_PAY_'
           OR tc.testcase_id STARTS WITH 'E2E-'
           OR tc.testcase_id STARTS WITH 'UI-'
        RETURN count(tc) AS syntheticCount
      }
      CALL {
        MATCH (ts:TestSuite)
        WHERE ts.name IN ['India_Payroll_E2E_Suite', 'Playwright_OXD_UI_Suite']
           OR ts.suite_id IN ['India_Payroll_E2E_Suite', 'Playwright_OXD_UI_Suite']
        RETURN count(ts) AS badSuiteCount
      }
      CALL {
        MATCH (tc:TestCase { plugin: 'orangehrmPayrollPlugin' })
        OPTIONAL MATCH (tc)-[r:TESTS]->(:Method)
        RETURN count(DISTINCT tc) AS payPhpUnitCount, count(r) AS payTestsEdges
      }
      CALL {
        MATCH (us:UserStory) WHERE us.story_id STARTS WITH 'US_PAY_' RETURN count(us) AS usCount
      }
      CALL {
        MATCH (req:Requirement) WHERE req.requirement_id STARTS WITH 'FR_PAY_' RETURN count(req) AS frCount
      }
      CALL {
        MATCH (br:BusinessRule) WHERE br.rule_id STARTS WITH 'BR_PAY_' RETURN count(br) AS brCount
      }
      CALL {
        MATCH (ep:ApiEndpoint { plugin: 'orangehrmPayrollPlugin' }) RETURN count(ep) AS payEpCount
      }
      CALL {
        MATCH (ui:UIComponent { plugin: 'orangehrmPayrollPlugin' }) RETURN count(ui) AS payUiCount
      }
      RETURN syntheticCount, badSuiteCount, payPhpUnitCount, payTestsEdges, usCount, frCount, brCount, payEpCount, payUiCount
      `,
      {},
      (recs) => {
        const r = recs[0];
        const syn = toNum(r.get('syntheticCount'));
        const bsuite = toNum(r.get('badSuiteCount'));
        const payUnit = toNum(r.get('payPhpUnitCount'));
        const payEdges = toNum(r.get('payTestsEdges'));
        const us = toNum(r.get('usCount'));
        const fr = toNum(r.get('frCount'));
        const br = toNum(r.get('brCount'));
        const ep = toNum(r.get('payEpCount'));
        const ui = toNum(r.get('payUiCount'));
        const passed = syn === 0 && bsuite === 0 && payUnit === 18 && payEdges >= 18 && us >= 12 && fr >= 12 && br >= 16 && ep >= 28 && ui >= 12;
        return {
          passed,
          detail: { syn, bsuite, payUnit, payEdges, us, fr, br, ep, ui }
        };
      }
    ));

    // 2. Money::roundNearestTenRupees & IndianStatutoryCalculator TESTS links
    checks.push(await runCheck(
      session,
      2,
      'Money::roundNearestTenRupees & IndianStatutoryCalculator direct TESTS',
      `
      MATCH (m:Method { signature: 'OrangeHRM\\\\Payroll\\\\Util\\\\Money::roundNearestTenRupees' })<-[:TESTS]-(tc:TestCase)
      WITH collect(tc.name) AS moneyTests
      MATCH (m2:Method { class_fqcn: 'OrangeHRM\\\\Payroll\\\\Service\\\\IndianStatutoryCalculator' })<-[:TESTS]-(tc2:TestCase)
      RETURN moneyTests, collect(DISTINCT tc2.name) AS calcTests
      `,
      {},
      (recs) => {
        const r = recs[0];
        const moneyTests = r ? r.get('moneyTests') : [];
        const calcTests = r ? r.get('calcTests') : [];
        return {
          passed: moneyTests.some((n) => n.includes('testSection288BRoundingToNearestTen')) && calcTests.length >= 4,
          detail: { moneyTests, calcTestsCount: calcTests.length }
        };
      }
    ));

    // 3. PIMLeftMenuService -> PIMLeftMenuServiceTest (TC_UNIT_02443..02449)
    checks.push(await runCheck(
      session,
      3,
      'PIMLeftMenuService links to all 7 PIMLeftMenuServiceTest cases',
      `
      MATCH (c:Class { fqcn: 'OrangeHRM\\\\Pim\\\\Service\\\\PIMLeftMenuService' })-[:DECLARES]->(m:Method)<-[:TESTS]-(tc:TestCase)
      RETURN collect(DISTINCT tc.testcase_id) AS testIds
      `,
      {},
      (recs) => {
        const ids = recs[0]?.get('testIds') || [];
        const expected = ['TC_UNIT_02443', 'TC_UNIT_02444', 'TC_UNIT_02445', 'TC_UNIT_02446', 'TC_UNIT_02447', 'TC_UNIT_02448', 'TC_UNIT_02449'];
        const missing = expected.filter((id) => !ids.includes(id));
        return {
          passed: missing.length === 0,
          detail: { foundCount: ids.length, missing }
        };
      }
    ));

    // 4. LeavePayrollAdapter & TimeAttendancePayrollAdapter cross-module CALLS + v1.0 & Payroll tests
    checks.push(await runCheck(
      session,
      4,
      'LeavePayrollAdapter & TimeAttendancePayrollAdapter cross-module CALLS',
      `
      MATCH (c:Class)
      WHERE c.fqcn IN [
        'OrangeHRM\\\\Payroll\\\\Service\\\\LeavePayrollAdapter',
        'OrangeHRM\\\\Payroll\\\\Service\\\\TimeAttendancePayrollAdapter'
      ]
      MATCH (c)-[:DECLARES]->(m:Method)-[:CALLS*1..2]->(callee:Method)<-[:DECLARES]-(targetCls:Class)
      WHERE targetCls.plugin <> 'orangehrmPayrollPlugin'
      WITH count(DISTINCT callee) AS v1Targets, collect(DISTINCT targetCls.plugin) AS targetPlugins
      MATCH (pm:Method)
      WHERE pm.class_fqcn IN [
        'OrangeHRM\\\\Payroll\\\\Service\\\\LeavePayrollAdapter',
        'OrangeHRM\\\\Payroll\\\\Service\\\\TimeAttendancePayrollAdapter'
      ]
      OPTIONAL MATCH (pm)<-[:TESTS]-(ptc:TestCase)
      RETURN v1Targets, targetPlugins, count(DISTINCT ptc) AS payrollUnitTests
      `,
      {},
      (recs) => {
        const r = recs[0];
        const v1Targets = toNum(r?.get('v1Targets'));
        const targetPlugins = r?.get('targetPlugins') || [];
        const payrollUnitTests = toNum(r?.get('payrollUnitTests'));
        return {
          passed: v1Targets >= 2 && payrollUnitTests >= 2,
          detail: { v1Targets, targetPlugins, payrollUnitTests }
        };
      }
    ));

    // 5. ClaimSettlementAdapter <-> ohrm_claim_request <-> ClaimDao/API tests
    checks.push(await runCheck(
      session,
      5,
      'ClaimSettlementAdapter & ohrm_claim_request cross-module DB coupling',
      `
      MATCH (m:Method { class_fqcn: 'OrangeHRM\\\\Payroll\\\\Service\\\\ClaimSettlementAdapter' })-[:READS_TABLE|WRITES_TABLE]->(tbl:DatabaseTable { name: 'ohrm_claim_request' })
      WITH tbl, collect(DISTINCT m.name) AS adapterMethods
      MATCH (v1m:Method)-[:WRITES_TABLE]->(tbl)
      WHERE NOT v1m.class_fqcn STARTS WITH 'OrangeHRM\\\\Payroll'
      OPTIONAL MATCH (v1m)<-[:TESTS|EXECUTES_AGAINST]-(v1tc:TestCase)
      WITH adapterMethods, count(DISTINCT v1m) AS claimWriters, count(DISTINCT v1tc) AS claimTests
      MATCH (ptc:TestCase)-[:TESTS]->(cm:Method { class_fqcn: 'OrangeHRM\\\\Payroll\\\\Service\\\\ClaimSettlementAdapter' })
      RETURN adapterMethods, claimWriters, claimTests, collect(DISTINCT ptc.name) AS adapterTests
      `,
      {},
      (recs) => {
        const r = recs[0];
        const adapterMethods = r?.get('adapterMethods') || [];
        const claimWriters = toNum(r?.get('claimWriters'));
        const adapterTests = r?.get('adapterTests') || [];
        return {
          passed: adapterMethods.length >= 1 && claimWriters >= 1 && adapterTests.some((n) => n.includes('testClaimReservationLockAndReleaseLifecycle')),
          detail: { adapterMethods, claimWriters, claimTests: toNum(r?.get('claimTests')), adapterTests }
        };
      }
    ));

    // 6. Payroll QA gap surfacing: 100% of Payroll REST ApiEndpoints & UI components have 0 QA tests
    checks.push(await runCheck(
      session,
      6,
      'Payroll API endpoints & Vue UI components show 0 QA Playwright tests',
      `
      MATCH (ep:ApiEndpoint { plugin: 'orangehrmPayrollPlugin' })
      WHERE ep.endpoint_kind = 'REST_API'
      OPTIONAL MATCH (ep)<-[ea:EXECUTES_AGAINST|COVERS_ENDPOINT]-(:TestCase)
      WITH count(DISTINCT ep) AS restTotal, count(ea) AS restTested
      MATCH (ui:UIComponent { plugin: 'orangehrmPayrollPlugin' })
      OPTIONAL MATCH (ui)<-[ut:TESTS_COMPONENT]-(:TestCase)
      RETURN restTotal, restTested, count(DISTINCT ui) AS uiTotal, count(ut) AS uiTested
      `,
      {},
      (recs) => {
        const r = recs[0];
        const restTotal = toNum(r.get('restTotal'));
        const restTested = toNum(r.get('restTested'));
        const uiTotal = toNum(r.get('uiTotal'));
        const uiTested = toNum(r.get('uiTested'));
        return {
          passed: restTotal >= 28 && restTested === 0 && uiTotal >= 12 && uiTested === 0,
          detail: { restTotal, restTested, uiTotal, uiTested }
        };
      }
    ));

    // 7. Module breakdown separation: Payroll unit-only vs Claim API+Unit
    checks.push(await runCheck(
      session,
      7,
      'Module isolation: Payroll unit-only vs Claim API & Service tests',
      `
      MATCH (pTc:TestCase { plugin: 'orangehrmPayrollPlugin' })
      OPTIONAL MATCH (pTc)-[pea:EXECUTES_AGAINST]->(:ApiEndpoint)
      WITH count(DISTINCT pTc) AS payrollUnitTests, count(pea) AS payrollApiTests
      MATCH (cTc:TestCase { plugin: 'orangehrmClaimPlugin' })
      OPTIONAL MATCH (cTc)-[cea:EXECUTES_AGAINST]->(:ApiEndpoint)
      RETURN payrollUnitTests, payrollApiTests, count(DISTINCT cTc) AS claimTests, count(cea) AS claimApiTests
      `,
      {},
      (recs) => {
        const r = recs[0];
        const pu = toNum(r.get('payrollUnitTests'));
        const pa = toNum(r.get('payrollApiTests'));
        const ct = toNum(r.get('claimTests'));
        const ca = toNum(r.get('claimApiTests'));
        return {
          passed: pu === 18 && pa === 0 && ct >= 50 && ca >= 10,
          detail: { payrollUnitTests: pu, payrollApiTests: pa, claimTests: ct, claimApiTests: ca }
        };
      }
    ));

    // 8. EmployeeClaimRequestAPI inheritance -> MyClaimRequestAPI
    checks.push(await runCheck(
      session,
      8,
      'Structural EXTENDS: MyClaimRequestAPI extends EmployeeClaimRequestAPI with TESTS',
      `
      MATCH (sub:Class { fqcn: 'OrangeHRM\\\\Claim\\\\Api\\\\MyClaimRequestAPI' })-[:EXTENDS]->(sup:Class { fqcn: 'OrangeHRM\\\\Claim\\\\Api\\\\EmployeeClaimRequestAPI' })
      MATCH (sub)-[:DECLARES]->(m:Method)<-[:TESTS]-(tc:TestCase)
      RETURN count(DISTINCT sub) AS subCount, count(DISTINCT tc) AS testCount
      `,
      {},
      (recs) => {
        const subCount = toNum(recs[0]?.get('subCount'));
        const testCount = toNum(recs[0]?.get('testCount'));
        return {
          passed: subCount === 1 && testCount >= 1,
          detail: { subCount, testCount }
        };
      }
    ));

    // 9. AttendancePunchInRecordOverlapAPI & AttendanceEditPunchInRecordOverlapAPI shared trait/base tests
    checks.push(await runCheck(
      session,
      9,
      'Attendance overlap APIs connected to shared base/traits and APITests',
      `
      MATCH (c:Class)
      WHERE c.fqcn IN [
        'OrangeHRM\\\\Attendance\\\\Api\\\\AttendancePunchInRecordOverlapAPI',
        'OrangeHRM\\\\Attendance\\\\Api\\\\AttendanceEditPunchInRecordOverlapAPI'
      ]
      OPTIONAL MATCH (c)-[:USES_TRAIT|EXTENDS]->(shared)
      OPTIONAL MATCH (c)-[:DECLARES]->(m:Method)<-[:TESTS]-(tc:TestCase)
      RETURN count(DISTINCT c) AS classCount, count(DISTINCT shared) AS sharedParents, count(DISTINCT tc) AS testCount
      `,
      {},
      (recs) => {
        const r = recs[0];
        const classCount = toNum(r.get('classCount'));
        const sharedParents = toNum(r.get('sharedParents'));
        const testCount = toNum(r.get('testCount'));
        return {
          passed: classCount === 2 && sharedParents >= 2 && testCount >= 2,
          detail: { classCount, sharedParents, testCount }
        };
      }
    ));

    // 10. Trait & Interface nodes exist with USES_TRAIT / IMPLEMENTS edges
    checks.push(await runCheck(
      session,
      10,
      'Interface & Trait nodes linked cleanly to concrete users',
      `
      MATCH (t:Trait { fqcn: 'OrangeHRM\\\\Payroll\\\\Api\\\\Traits\\\\PayrollEndpointTrait' })<-[:USES_TRAIT]-(c:Class)
      WITH count(DISTINCT c) AS payTraitUsers
      MATCH (e:Trait { fqcn: 'OrangeHRM\\\\Core\\\\Traits\\\\ORM\\\\EntityManagerHelperTrait' })<-[:USES_TRAIT]-(ec:Class)
      WITH payTraitUsers, count(DISTINCT ec) AS emTraitUsers
      MATCH (iface:Interface)<-[:IMPLEMENTS]-(ic:Class)
      RETURN payTraitUsers, emTraitUsers, count(DISTINCT iface) AS interfacesLinked
      `,
      {},
      (recs) => {
        const r = recs[0];
        const pt = toNum(r?.get('payTraitUsers'));
        const em = toNum(r?.get('emTraitUsers'));
        const il = toNum(r?.get('interfacesLinked'));
        return {
          passed: pt >= 1 && em >= 10 && il >= 15,
          detail: { payTraitUsers: pt, emTraitUsers: em, interfacesLinked: il }
        };
      }
    ));

    // 11. Zero false cross-module validate() CALLS edges
    checks.push(await runCheck(
      session,
      11,
      'Zero false cross-module validate() bare-name CALLS collisions',
      `
      MATCH (caller:Method)-[:CALLS]->(callee:Method { name: 'validate' })
      MATCH (c1:Class)-[:DECLARES]->(caller)
      MATCH (c2:Class)-[:DECLARES]->(callee)
      WHERE c1.plugin <> c2.plugin
        AND NOT (c1)-[:EXTENDS|IMPLEMENTS|USES_TRAIT*1..3]->(c2)
        AND NOT (c1)-[:INJECTED_WITH]->(c2)
        AND c1.plugin IN ['orangehrmLeavePlugin', 'orangehrmClaimPlugin', 'orangehrmAdminPlugin', 'orangehrmPayrollPlugin']
        AND c2.plugin IN ['orangehrmLeavePlugin', 'orangehrmClaimPlugin', 'orangehrmAdminPlugin', 'orangehrmPayrollPlugin']
      RETURN count(*) AS falseValidateCalls, collect(caller.signature + ' -> ' + callee.signature)[..5] AS sample
      `,
      {},
      (recs) => {
        const count = toNum(recs[0]?.get('falseValidateCalls'));
        return {
          passed: count === 0,
          detail: { falseValidateCalls: count, sample: recs[0]?.get('sample') || [] }
        };
      }
    ));

    // 12. Two-pass deterministic CALLS resolution across plugins
    checks.push(await runCheck(
      session,
      12,
      'Two-pass deterministic exact-signature CALLS edges across modules',
      `
      MATCH (caller:Method)-[r:CALLS]->(callee:Method)
      WHERE r.evidence_type = 'AST_CALL_ANALYSIS'
      WITH count(r) AS totalCalls
      MATCH (c1:Class)-[:DECLARES]->(m1:Method)-[:CALLS]->(m2:Method)<-[:DECLARES]-(c2:Class)
      WHERE c1.plugin = 'orangehrmPayrollPlugin' AND c2.plugin <> 'orangehrmPayrollPlugin'
      RETURN totalCalls, count(*) AS crossModulePayrollCalls
      `,
      {},
      (recs) => {
        const totalCalls = toNum(recs[0]?.get('totalCalls'));
        const crossPay = toNum(recs[0]?.get('crossModulePayrollCalls'));
        return {
          passed: totalCalls >= 10000 && crossPay >= 50,
          detail: { totalCalls, crossModulePayrollCalls: crossPay }
        };
      }
    ));

    // 13. Confirmed TESTS suppresses duplicate POTENTIAL_COVERS
    checks.push(await runCheck(
      session,
      13,
      'Zero duplicate POTENTIAL_COVERS where confirmed TESTS exists',
      `
      MATCH (tc:TestCase)-[:TESTS]->(m:Method)
      MATCH (tc)-[p:POTENTIAL_COVERS]->(m)
      RETURN count(p) AS duplicateCount
      `,
      {},
      (recs) => {
        const dup = toNum(recs[0]?.get('duplicateCount'));
        return { passed: dup === 0, detail: { duplicateCount: dup } };
      }
    ));

    // 14. hs_hr_employee multi-plugin FK_REFERENCES / MAPS_TO / READS_TABLE
    checks.push(await runCheck(
      session,
      14,
      'hs_hr_employee coupled across PIM, Leave, Attendance, Claim & Payroll',
      `
      MATCH (empTbl:DatabaseTable { name: 'hs_hr_employee' })
      OPTIONAL MATCH (childTbl:DatabaseTable)-[fk:FK_REFERENCES]->(empTbl)
      OPTIONAL MATCH (m:Method)-[:READS_TABLE|WRITES_TABLE]->(empTbl)
      OPTIONAL MATCH (c:Class)-[:DECLARES]->(m)
      RETURN count(DISTINCT fk) AS inboundFks, collect(DISTINCT c.plugin) AS accessingPlugins
      `,
      {},
      (recs) => {
        const inboundFks = toNum(recs[0]?.get('inboundFks'));
        const plugins = (recs[0]?.get('accessingPlugins') || []).filter(Boolean);
        return {
          passed: inboundFks >= 15 && plugins.length >= 4,
          detail: { inboundFks, accessingPlugins: plugins }
        };
      }
    ));

    // 15. Published GraphSnapshot & zero null source_file classes
    checks.push(await runCheck(
      session,
      15,
      'Published GraphSnapshot exists & 0 classes with null source_file',
      `
      MATCH (s:GraphSnapshot { status: 'PUBLISHED' })
      WITH count(s) AS pubCount, collect(s.snapshot_id)[..3] AS snapshotIds
      RETURN pubCount, snapshotIds,
             COUNT {
               MATCH (c:Class)
               WHERE c.source_file IS NULL OR trim(c.source_file) = ''
             } AS nullSourceClasses
      `,
      {},
      (recs) => {
        const r = recs[0];
        const pubCount = toNum(r.get('pubCount'));
        const nullSourceClasses = toNum(r.get('nullSourceClasses'));
        return {
          passed: pubCount >= 1 && nullSourceClasses === 0,
          detail: { pubCount, snapshotIds: r.get('snapshotIds'), nullSourceClasses }
        };
      }
    ));

    // 16. Normalized paths & 0 unlinked ApiEndpoints & 0 bad UI plugins
    checks.push(await runCheck(
      session,
      16,
      'Canonical orange_hrm/ paths, 0 unlinked ApiEndpoints, 0 bad UI plugin tags',
      `
      RETURN
        COUNT {
          MATCH (ep:ApiEndpoint)
          WHERE NOT (ep)-[:HANDLED_BY]->(:Class)
        } AS unlinkedEndpoints,
        COUNT {
          MATCH (ui:UIComponent)
          WHERE ui.plugin IN ['components.ts', 'main.ts', 'pages.ts']
             OR (ui.file IS NOT NULL AND NOT ui.file STARTS WITH 'orange_hrm/')
        } AS badUiNodes,
        COUNT {
          MATCH (c:Class)
          WHERE c.source_file IS NULL OR c.source_file CONTAINS $backslash OR NOT c.source_file STARTS WITH 'orange_hrm/'
        } AS badClassPaths
      `,
      { backslash: '\\' },
      (recs) => {
        const r = recs[0];
        const unlinkedEndpoints = toNum(r.get('unlinkedEndpoints'));
        const badUiNodes = toNum(r.get('badUiNodes'));
        const badClassPaths = toNum(r.get('badClassPaths'));
        return {
          passed: unlinkedEndpoints === 0 && badUiNodes === 0 && badClassPaths === 0,
          detail: { unlinkedEndpoints, badUiNodes, badClassPaths }
        };
      }
    ));

    // 17. Non-Payroll End-to-End Business Traceability & BASELINE_MANIFEST Isolation
    checks.push(await runCheck(
      session,
      17,
      'Non-Payroll business traceability & BASELINE_MANIFEST isolation (no Cartesian fanout)',
      `
      CALL {
        MATCH (us:UserStory)-[r:EXECUTES_VIA]->(:ApiEndpoint)
        WHERE coalesce(us.introduced_in, 'v1.0') = 'v1.0'
        RETURN count(r) AS storyEpLinks
      }
      CALL {
        MATCH (us:UserStory)-[r:IMPLEMENTED_BY]->(:UIComponent)
        WHERE coalesce(us.introduced_in, 'v1.0') = 'v1.0'
        RETURN count(r) AS storyUiLinks
      }
      CALL {
        MATCH (f:Feature)-[r:INCLUDES_ENDPOINT]->(:ApiEndpoint)
        WHERE coalesce(f.introduced_in, 'v1.0') = 'v1.0'
        RETURN count(r) AS featureIncludesEp
      }
      CALL {
        MATCH (:Feature)-[r:EXPOSES]->(:ApiEndpoint)
        RETURN count(r) AS overloadedExposes
      }
      CALL {
        MATCH (tc:TestCase)-[:VERIFIES_STORY]->(us:UserStory)
        WHERE coalesce(tc.origin, '') <> 'BASELINE_MANIFEST'
          AND coalesce(us.introduced_in, 'v1.0') = 'v1.0'
        WITH tc, count(DISTINCT us) AS storiesForTest
        RETURN sum(storiesForTest) AS derivedStoryLinks, max(storiesForTest) AS maxStoriesPerTest
      }
      CALL {
        MATCH (:TestCase { origin: 'BASELINE_MANIFEST' })-[r:PLANNED_VERIFICATION|PLANNED_ENDPOINT_COVERAGE]->()
        RETURN count(r) AS plannedLinks
      }
      CALL {
        MATCH (:TestCase { origin: 'BASELINE_MANIFEST' })-[r:VERIFIES|VERIFIES_STORY|EXECUTES_AGAINST]->()
        RETURN count(r) AS baselinePolluting
      }
      RETURN storyEpLinks, storyUiLinks, featureIncludesEp, overloadedExposes,
             coalesce(derivedStoryLinks, 0) AS derivedStoryLinks,
             coalesce(maxStoriesPerTest, 0) AS maxStoriesPerTest,
             plannedLinks, baselinePolluting
      `,
      {},
      (recs) => {
        const r = recs[0];
        const storyEpLinks = toNum(r.get('storyEpLinks'));
        const storyUiLinks = toNum(r.get('storyUiLinks'));
        const featureIncludesEp = toNum(r.get('featureIncludesEp'));
        const overloadedExposes = toNum(r.get('overloadedExposes'));
        const derivedStoryLinks = toNum(r.get('derivedStoryLinks'));
        const maxStoriesPerTest = toNum(r.get('maxStoriesPerTest'));
        const plannedLinks = toNum(r.get('plannedLinks'));
        const baselinePolluting = toNum(r.get('baselinePolluting'));
        return {
          passed:
            storyEpLinks >= 30 &&
            storyUiLinks >= 30 &&
            featureIncludesEp >= 25 &&
            overloadedExposes === 0 &&
            derivedStoryLinks >= 5 &&
            maxStoriesPerTest <= 15 &&
            plannedLinks >= 100 &&
            baselinePolluting === 0,
          detail: {
            storyEpLinks,
            storyUiLinks,
            featureIncludesEp,
            overloadedExposes,
            derivedStoryLinks,
            maxStoriesPerTest,
            plannedLinks,
            baselinePolluting
          }
        };
      }
    ));

    // 18. Schema Contract & Release Lifecycle Semantics (PRESENT_IN vs SUPPORTED_IN)
    {
      const contractRes = await validateSchemaContract(session);
      const lifeRes = await session.run(`
        CALL {
          MATCH (n)-[:PRESENT_IN]->(:Release { version_id: 'v2.2-india-payroll' })
          WHERE coalesce(n.introduced_in, 'v1.0') = 'v1.0'
          RETURN count(DISTINCT n) AS v1PresentInV2
        }
        CALL {
          MATCH (n)-[r:SUPPORTED_IN]->(:Release { version_id: 'v2.2-india-payroll' })
          WHERE coalesce(n.introduced_in, 'v1.0') = 'v1.0' AND r.contract_type IS NULL
          RETURN count(r) AS v1BlanketSupportedV2
        }
        CALL {
          MATCH (n)-[r:SUPPORTED_IN { contract_type: 'PAYROLL_CROSS_MODULE_DEPENDENCY' }]->(:Release { version_id: 'v2.2-india-payroll' })
          RETURN count(r) AS crossModuleSupportedV2
        }
        RETURN v1PresentInV2, v1BlanketSupportedV2, crossModuleSupportedV2
      `);
      const lr = lifeRes.records[0];
      const v1PresentInV2 = toNum(lr?.get('v1PresentInV2'));
      const v1BlanketSupportedV2 = toNum(lr?.get('v1BlanketSupportedV2'));
      const crossModuleSupportedV2 = toNum(lr?.get('crossModuleSupportedV2'));
      checks.push({
        id: 18,
        name: 'Schema contract compliance & distinct PRESENT_IN vs SUPPORTED_IN release semantics',
        passed: contractRes.passed && v1PresentInV2 >= 5000 && v1BlanketSupportedV2 === 0 && crossModuleSupportedV2 >= 1,
        detail: {
          contractPassed: contractRes.passed,
          contractViolations: contractRes.violations,
          v1PresentInV2,
          v1BlanketSupportedV2,
          crossModuleSupportedV2
        }
      });
    }

    // 19. Unified Execution History (canonical HAS_EXECUTION / EXECUTED_TEST / EXECUTED_AGAINST_SNAPSHOT)
    checks.push(await runCheck(
      session,
      19,
      'Unified Execution History (no legacy rels, no orphans, linked executions)',
      `
      CALL { MATCH (tr:TestRun) RETURN count(tr) AS testRuns }
      CALL { MATCH (te:TestExecution) RETURN count(te) AS testExecutions }
      CALL { MATCH ()-[r:CONTAINS_EXECUTION|EXECUTED_IN]->() RETURN count(r) AS legacyExecRels }
      CALL {
        MATCH (tr:TestRun)
        WHERE NOT (tr)-[:EXECUTED_AGAINST_SNAPSHOT]->(:GraphSnapshot)
        RETURN count(tr) AS orphanedRuns
      }
      CALL {
        MATCH (te:TestExecution)
        WHERE NOT (:TestRun)-[:HAS_EXECUTION]->(te)
        RETURN count(te) AS orphanedExecutions
      }
      CALL { MATCH (:TestExecution)-[r:EXECUTED_TEST]->(:TestCase) RETURN count(r) AS linkedExecutions }
      RETURN testRuns, testExecutions, legacyExecRels, orphanedRuns, orphanedExecutions, linkedExecutions
      `,
      {},
      (recs) => {
        const r = recs[0];
        const testRuns = toNum(r.get('testRuns'));
        const testExecutions = toNum(r.get('testExecutions'));
        const legacyExecRels = toNum(r.get('legacyExecRels'));
        const orphanedRuns = toNum(r.get('orphanedRuns'));
        const orphanedExecutions = toNum(r.get('orphanedExecutions'));
        const linkedExecutions = toNum(r.get('linkedExecutions'));
        return {
          passed:
            testRuns >= 1 &&
            testExecutions >= 1 &&
            legacyExecRels === 0 &&
            orphanedRuns === 0 &&
            orphanedExecutions === 0 &&
            linkedExecutions > 0,
          detail: {
            testRuns,
            testExecutions,
            legacyExecRels,
            orphanedRuns,
            orphanedExecutions,
            linkedExecutions
          }
        };
      }
    ));

    // 20. Latest-Run Coverage Integrity (no double-counting, no null-pct divide-by-zero corruption)
    checks.push(await runCheck(
      session,
      20,
      'Latest-Run Coverage Integrity (scoped non-double-counted Clover observations)',
      `
      CALL { MATCH (cr:CoverageRun) RETURN count(cr) AS coverageRuns }
      CALL { MATCH (:CoverageRun)-[r:MEASURED_FOR]->(:GraphSnapshot) RETURN count(r) AS measuredForLinks }
      CALL { MATCH (o:CoverageObservation) RETURN count(o) AS observations }
      CALL {
        MATCH (o:CoverageObservation)
        WHERE coalesce(o.lines_total, 0) = 0 AND o.line_coverage_pct IS NOT NULL
        RETURN count(o) AS zeroLineCorruptions
      }
      CALL {
        MATCH (cr:CoverageRun)-[:HAS_OBSERVATION]->(o:CoverageObservation)-[:COVERED_IN|COVERED_COMPONENT_IN]->(target)
        WITH cr, target, count(DISTINCT o) AS obsCount
        WHERE obsCount > 1
        RETURN count(*) AS duplicateObservations
      }
      CALL {
        MATCH (cr:CoverageRun)
        WITH coalesce(cr.framework, 'phpunit') AS fw, coalesce(cr.suite_scope, 'default') AS sc, cr
        ORDER BY coalesce(cr.executed_at, cr.timestamp, '') DESC, cr.run_id DESC
        WITH fw, sc, collect(cr)[0] AS latestCr
        MATCH (latestCr)-[:HAS_OBSERVATION]->(o:CoverageObservation)-[:COVERED_IN|COVERED_COMPONENT_IN]->(target)
        WITH target, max(coalesce(o.lines_covered, 0)) AS cov, max(coalesce(o.lines_total, 0)) AS tot
        WHERE tot > 0
        RETURN sum(cov) AS scopedCovered, sum(tot) AS scopedTotal, count(target) AS coveredTargets
      }
      RETURN coverageRuns, measuredForLinks, observations, zeroLineCorruptions, duplicateObservations,
             coalesce(scopedCovered, 0) AS scopedCovered,
             coalesce(scopedTotal, 0) AS scopedTotal,
             coalesce(coveredTargets, 0) AS coveredTargets
      `,
      {},
      (recs) => {
        const r = recs[0];
        const coverageRuns = toNum(r.get('coverageRuns'));
        const measuredForLinks = toNum(r.get('measuredForLinks'));
        const observations = toNum(r.get('observations'));
        const zeroLineCorruptions = toNum(r.get('zeroLineCorruptions'));
        const duplicateObservations = toNum(r.get('duplicateObservations'));
        const scopedCovered = toNum(r.get('scopedCovered'));
        const scopedTotal = toNum(r.get('scopedTotal'));
        const coveredTargets = toNum(r.get('coveredTargets'));
        const scopedPct = scopedTotal > 0 ? Number(((scopedCovered / scopedTotal) * 100).toFixed(2)) : 0;
        return {
          passed:
            coverageRuns >= 1 &&
            measuredForLinks > 0 &&
            observations >= 1 &&
            zeroLineCorruptions === 0 &&
            duplicateObservations === 0 &&
            coveredTargets >= 1 &&
            scopedPct > 0 &&
            scopedPct <= 100,
          detail: {
            coverageRuns,
            measuredForLinks,
            observations,
            zeroLineCorruptions,
            duplicateObservations,
            coveredTargets,
            scopedCovered,
            scopedTotal,
            scopedPct
          }
        };
      }
    ));

    // 21. GraphSnapshot Retention Chain & Commit Provenance
    checks.push(await runCheck(
      session,
      21,
      'GraphSnapshot retention chain (PREVIOUS_SNAPSHOT) & Commit provenance',
      `
      MATCH (s:GraphSnapshot)
      OPTIONAL MATCH (s)-[:RECORDED_COMMIT]->(c:Commit)
      OPTIONAL MATCH (s)-[p:PREVIOUS_SNAPSHOT]->(:GraphSnapshot)
      RETURN count(DISTINCT s) AS totalSnapshots,
             count(DISTINCT CASE WHEN s.status = 'PUBLISHED' THEN s END) AS publishedCount,
             count(DISTINCT CASE WHEN s.status = 'SUPERSEDED' THEN s END) AS supersededCount,
             count(DISTINCT p) AS prevLinks,
             count(DISTINCT CASE
               WHEN s.status = 'PUBLISHED'
                AND s.structural_manifest_json IS NOT NULL
                AND trim(s.structural_manifest_json) <> ''
                AND s.extractor_version = '2.1.0'
                AND coalesce(s.qa_commit, '') <> ''
                AND c IS NOT NULL
               THEN s END) AS validPublished
      `,
      {},
      (recs) => {
        const r = recs[0];
        const totalSnapshots = toNum(r.get('totalSnapshots'));
        const publishedCount = toNum(r.get('publishedCount'));
        const supersededCount = toNum(r.get('supersededCount'));
        const prevLinks = toNum(r.get('prevLinks'));
        const validPublished = toNum(r.get('validPublished'));
        return {
          passed: totalSnapshots >= 2 && publishedCount === 1 && supersededCount >= 1 && prevLinks >= 1 && validPublished === 1,
          detail: { totalSnapshots, publishedCount, supersededCount, prevLinks, validPublished }
        };
      }
    ));

    // 22. Payroll Non-Fabrication Invariant
    checks.push(await runCheck(
      session,
      22,
      'Payroll non-fabrication invariant (18 AST PHPUnit unit tests only; 0 Playwright/Cypress/Jest)',
      `
      MATCH (tc:TestCase { plugin: 'orangehrmPayrollPlugin' })
      RETURN count(tc) AS totalPayTests,
             count(CASE WHEN tc.origin = 'AST_PHPUNIT' THEN 1 END) AS astPhpUnitTests,
             count(CASE WHEN toLower(coalesce(tc.framework, '')) IN ['playwright', 'cypress', 'jest'] OR tc.origin = 'BASELINE_MANIFEST' OR tc.testcase_id STARTS WITH 'TC_PAY_' THEN 1 END) AS forbiddenQaTests
      `,
      {},
      (recs) => {
        const r = recs[0];
        const totalPayTests = toNum(r.get('totalPayTests'));
        const astPhpUnitTests = toNum(r.get('astPhpUnitTests'));
        const forbiddenQaTests = toNum(r.get('forbiddenQaTests'));
        return {
          passed: totalPayTests === 18 && astPhpUnitTests === 18 && forbiddenQaTests === 0,
          detail: { totalPayTests, astPhpUnitTests, forbiddenQaTests }
        };
      }
    ));

    // 23. QA Repo (Playwright + Genuine Cypress) Hygiene & Provenance
    checks.push(await runCheck(
      session,
      23,
      'External QA repo Playwright (AST_PLAYWRIGHT) & real Cypress (AST_CYPRESS) ingested with 0 suite stubs',
      `
      MATCH (tc:TestCase)
      WHERE tc.origin IN ['AST_PLAYWRIGHT', 'AST_CYPRESS']
      OPTIONAL MATCH (tc)-[ea:EXECUTES_AGAINST]->(:ApiEndpoint)
      OPTIONAL MATCH (tc)-[np:NAVIGATES_PAGE]->(:UIPage)
      RETURN count(DISTINCT CASE WHEN tc.origin = 'AST_PLAYWRIGHT' THEN tc END) AS playwrightTests,
             count(DISTINCT CASE WHEN tc.origin = 'AST_CYPRESS' THEN tc END) AS cypressTests,
             count(DISTINCT CASE WHEN tc.file CONTAINS '/suites/' THEN tc END) AS stubSuiteLeaks,
             count(DISTINCT ea) AS apiLinks,
             count(DISTINCT np) AS pageLinks
      `,
      {},
      (recs) => {
        const r = recs[0];
        const playwrightTests = toNum(r.get('playwrightTests'));
        const cypressTests = toNum(r.get('cypressTests'));
        const stubSuiteLeaks = toNum(r.get('stubSuiteLeaks'));
        const apiLinks = toNum(r.get('apiLinks'));
        const pageLinks = toNum(r.get('pageLinks'));
        return {
          passed: playwrightTests >= 4 && cypressTests >= 40 && stubSuiteLeaks === 0 && apiLinks >= 30 && pageLinks >= 5,
          detail: { playwrightTests, cypressTests, stubSuiteLeaks, apiLinks, pageLinks }
        };
      }
    ));

    // 24. DatabaseColumn, ACCESSES_COLUMN, SchemaMigration & Cross-Plugin Coupling
    checks.push(await runCheck(
      session,
      24,
      'DatabaseColumn ORM/DDL extraction, prioritized ACCESSES_COLUMN, SchemaMigration & PIM cross-plugin reachability',
      `
      CALL {
        MATCH (dc:DatabaseColumn)
        RETURN count(dc) AS colCount
      }
      CALL {
        MATCH (:DatabaseEntity)-[m:MAPS_TO_COLUMN]->(:DatabaseColumn)
        RETURN count(m) AS entityColMaps
      }
      CALL {
        MATCH (:Method)-[ac:ACCESSES_COLUMN]->(:DatabaseColumn)
        RETURN count(ac) AS colAccessEdges,
               count(CASE WHEN ac.evidence_type = 'DOCTRINE_MAPPING' THEN 1 END) AS p1Doctrine,
               count(CASE WHEN ac.evidence_type = 'DQL_QUERYBUILDER' THEN 1 END) AS p2Dql
      }
      CALL {
        MATCH (sm:SchemaMigration)
        OPTIONAL MATCH (sm)-[mt:MODIFIES_TABLE]->(:DatabaseTable)
        OPTIONAL MATCH (sm)-[mc:MODIFIES_COLUMN]->(:DatabaseColumn)
        RETURN count(DISTINCT sm) AS migrationCount, count(DISTINCT mt) AS modTables, count(DISTINCT mc) AS modCols
      }
      CALL {
        MATCH (c1:Class { plugin: 'orangehrmPimPlugin' })-[:DECLARES]->(:Method)-[:CALLS]->(:Method)<-[:DECLARES]-(c2:Class)
        WHERE coalesce(c2.plugin, '') <> '' AND c2.plugin <> 'orangehrmPimPlugin'
        RETURN DISTINCT c2.plugin AS targetPlugin
        UNION
        MATCH (c1:Class { plugin: 'orangehrmPimPlugin' })-[:DECLARES]->(:Method)-[:READS_TABLE|WRITES_TABLE]->(:DatabaseTable)<-[:READS_TABLE|WRITES_TABLE]-(:Method)<-[:DECLARES]-(c2:Class)
        WHERE coalesce(c2.plugin, '') <> '' AND c2.plugin <> 'orangehrmPimPlugin'
        RETURN DISTINCT c2.plugin AS targetPlugin
        UNION
        MATCH (c1:Class { plugin: 'orangehrmPimPlugin' })-[:DECLARES]->(:Method)-[:ACCESSES_COLUMN]->(:DatabaseColumn)<-[:ACCESSES_COLUMN]-(:Method)<-[:DECLARES]-(c2:Class)
        WHERE coalesce(c2.plugin, '') <> '' AND c2.plugin <> 'orangehrmPimPlugin'
        RETURN DISTINCT c2.plugin AS targetPlugin
      }
      RETURN colCount, entityColMaps, colAccessEdges, p1Doctrine, p2Dql, migrationCount, modTables, modCols, count(DISTINCT targetPlugin) AS pimCrossPlugins
      `,
      {},
      (recs) => {
        const r = recs[0];
        const colCount = toNum(r.get('colCount'));
        const entityColMaps = toNum(r.get('entityColMaps'));
        const colAccessEdges = toNum(r.get('colAccessEdges'));
        const p1Doctrine = toNum(r.get('p1Doctrine'));
        const p2Dql = toNum(r.get('p2Dql'));
        const migrationCount = toNum(r.get('migrationCount'));
        const modTables = toNum(r.get('modTables'));
        const modCols = toNum(r.get('modCols'));
        const pimCrossPlugins = toNum(r.get('pimCrossPlugins'));
        return {
          passed: colCount >= 1000 && entityColMaps >= 400 && colAccessEdges >= 1000 && p1Doctrine > 0 && p2Dql > 0 && migrationCount >= 20 && modTables >= 15 && modCols >= 10 && pimCrossPlugins >= 3,
          detail: { colCount, entityColMaps, colAccessEdges, p1Doctrine, p2Dql, migrationCount, modTables, modCols, pimCrossPlugins }
        };
      }
    ));

    // Check 25 (Phase 4C): Canonical Manifest & Structural Parity (Extracted Workspace vs Live Neo4j)
    let check25Passed = false;
    let check25Detail = 'Not evaluated';
    try {
      const { extractWorkspaceSnapshot } = require('./ingest_pipeline');
      const connectMariaDb = process.env.SKIP_MARIADB_RECONCILE !== '1' && process.env.NO_MARIADB !== '1';
      const extracted = await extractWorkspaceSnapshot({ connectMariaDb });
      const parity = await verifyExtractedVsLiveNeo4j(extracted, session, {
        snapshot_id: 'golden-check-25',
        app_commit: 'live'
      });
      check25Passed = parity.parity_passed && parity.logical_diff_count === 0;
      check25Detail = check25Passed
        ? `LogicalDiff=0, digest=${String(parity.header.structural_digest_incremental || '').slice(0, 12)}, entities=${parity.counts.total_entities_incremental}, rels=${parity.counts.total_relationships_incremental}`
        : `LogicalDiff=${parity.logical_diff_count}, missingEnt=${parity.counts?.missing_entities_in_incremental}, staleEnt=${parity.counts?.stale_entities_in_incremental}, fpMismatch=${parity.counts?.fingerprint_mismatched_entities}, missingRel=${parity.counts?.missing_relationships_in_incremental}, staleRel=${parity.counts?.stale_relationships_in_incremental}`;
    } catch (err25) {
      check25Passed = false;
      check25Detail = `Parity verification error: ${err25.message}`;
    }
    checks.push({
      id: 25,
      name: 'Phase 4C: Incremental / Live Neo4j vs Clean Extracted Structural Manifest Parity (LogicalDiff = 0)',
      passed: check25Passed,
      detail: check25Detail
    });

    // Check 26 (Phase 4D): QKG-15 Multi-Plugin Historical TIA Replay Benchmark Gate
    let check26Passed = false;
    let check26Detail = 'Not evaluated';
    try {
      const { runTiaBenchmark } = require('./run_tia_benchmark');
      const sessionQueryRunner = async (cypher, params = {}) => {
        const res = await session.run(cypher, params);
        return (res.records || []).map((rec) => {
          const obj = {};
          for (const k of rec.keys || []) {
            const val = rec.get(k);
            obj[k] = val && typeof val === 'object' && val.properties ? val.properties : val;
          }
          return obj;
        });
      };
      const benchReport = await runTiaBenchmark({
        mode: 'live',
        queryRunner: sessionQueryRunner,
        writeReport: false
      });
      const agg = benchReport.aggregate || {};
      check26Passed = Boolean(benchReport.gate_passed);
      check26Detail = `scenarios=${agg.scenarios_passed}/${agg.total_scenarios}, recall=${agg.tier_1_2_recall}, precision=${agg.precision}, fnr=${agg.false_negative_rate}, determinism=${agg.determinism_rate}, t3Leaks=${agg.tier3_leaks}, t4Leaks=${agg.tier4_leaks}`;
    } catch (err26) {
      check26Passed = false;
      check26Detail = `QKG-15 live replay error: ${err26.message}`;
    }
    checks.push({
      id: 26,
      name: 'Phase 4D: QKG-15 Multi-Plugin Historical TIA Replay Benchmark Gate',
      passed: check26Passed,
      detail: check26Detail
    });

    const passed = checks.filter((c) => c.passed).length;
    const failed = checks.length - passed;
    return {
      uri,
      total: checks.length,
      passed,
      failed,
      checks
    };
  } finally {
    await session.close();
    await driver.close();
  }
}

if (require.main === module) {
  validateGoldenDataset()
    .then((report) => {
      console.log(`=== QKG Golden Validation (${report.uri}): ${report.passed}/${report.total} passed ===`);
      for (const c of report.checks) {
        const icon = c.passed ? 'PASS' : 'FAIL';
        console.log(`[${icon}] #${c.id} ${c.name} -> ${JSON.stringify(c.detail)}`);
      }
      if (report.failed > 0) process.exit(1);
    })
    .catch((err) => {
      console.error('Golden Validation crashed:', err);
      process.exit(1);
    });
}

module.exports = { validateGoldenDataset };
