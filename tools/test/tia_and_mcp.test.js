const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { TIAEngine, classifyChangedFiles } = require('../qkg_engine/tia_engine');
const { QkgMcpServer, sanitizePayload } = require('../qkg_mcp/server_core');
const { extractQaSpecSource } = require('../qkg_qa_extractor');

test('classifyChangedFiles normalizes Windows slashes and classifies PHP, routes, Vue UI, and tests', () => {
  const c = classifyChangedFiles([
    'orange_hrm\\src\\plugins\\orangehrmPayrollPlugin\\Util\\Money.php',
    'src/plugins/orangehrmClaimPlugin/config/routes.yaml',
    'orange_hrm/src/client/src/orangehrmPayrollPlugin/pages/payroll/PayrollProcessing.vue',
    'orange_hrm/src/plugins/orangehrmPayrollPlugin/test/Util/MoneyTest.php'
  ]);
  assert.equal(c.phpSourceFiles[0], 'orange_hrm/src/plugins/orangehrmPayrollPlugin/Util/Money.php');
  assert.equal(c.routeFiles[0], 'orange_hrm/src/plugins/orangehrmClaimPlugin/config/routes.yaml');
  assert.equal(c.uiFiles[0], 'orange_hrm/src/client/src/orangehrmPayrollPlugin/pages/payroll/PayrollProcessing.vue');
  assert.equal(c.testFiles[0], 'orange_hrm/src/plugins/orangehrmPayrollPlugin/test/Util/MoneyTest.php');
});

test('TIAEngine fails closed with UNAVAILABLE when Neo4j errors and STALE on commit mismatch', async () => {
  const downTia = new TIAEngine(async () => {
    throw new Error('ECONNREFUSED');
  });
  const downRes = await downTia.analyzeFiles(['orange_hrm/src/plugins/orangehrmPayrollPlugin/Util/Money.php']);
  assert.equal(downRes.analysisStatus, 'UNAVAILABLE');
  assert.equal(downRes.failClosed, true);
  assert.equal(downRes.candidateTests.length, 0);

  const staleTia = new TIAEngine(async (cypher) => {
    if (cypher.includes('GraphSnapshot')) {
      return [{ snapshotId: 'snap-1', appCommit: 'oldsha123', branch: 'v2-main', status: 'PUBLISHED' }];
    }
    return [];
  });
  const staleRes = await staleTia.analyzeFiles(
    ['orange_hrm/src/plugins/orangehrmPayrollPlugin/Util/Money.php'],
    { currentCommit: 'newsha999' }
  );
  assert.equal(staleRes.analysisStatus, 'STALE');
  assert.equal(staleRes.stalenessReason, 'COMMIT_MISMATCH');
});

test('TIAEngine queries enforce BASELINE_REQUIREMENT_FANOUT_GUARD on all test channels', () => {
  const src = fs.readFileSync(path.resolve(__dirname, '../qkg_engine/tia_engine.js'), 'utf8');
  const testCaseMatches = [...src.matchAll(/\(tc:TestCase\b[\s\S]{0,220}?\n/g)];
  assert.ok(testCaseMatches.length >= 4);
  for (const m of testCaseMatches) {
    assert.ok(
      src.slice(m.index, m.index + 320).includes("<> 'BASELINE_MANIFEST'"),
      'Every TestCase selection Cypher query must exclude BASELINE_MANIFEST origin'
    );
  }
});

test('QkgMcpServer enforces read-only Cypher guard, PII/secret redaction, and envelope contract', async () => {
  const fakeRunner = async (cypher) => {
    if (cypher.includes('GraphSnapshot')) {
      return [{ snapshotId: 'snap-test', appCommit: 'commit-1', status: 'PUBLISHED' }];
    }
    return [{
      plugin: 'orangehrmPayrollPlugin',
      password: 'plain-password',
      aadhaar: '1234-5678-9012',
      salary: 95000,
      msg: 'Leaked sk-abcdef1234567890abcd and ghp_1234567890abcdef'
    }];
  };
  const mcp = new QkgMcpServer({ queryRunner: fakeRunner, qaCommit: 'qa-commit-1', currentCommit: 'commit-1' });

  await assert.rejects(
    () => mcp.runReadOnlyQuery('MATCH (n) DELETE n'),
    /ReadOnlyViolation/
  );

  const listRes = await mcp.handleJsonRpc({ id: 1, method: 'tools/list' });
  assert.equal(listRes.result.tools.length, 7);

  const callRes = await mcp.handleJsonRpc({
    id: 2,
    method: 'tools/call',
    params: { name: 'get_cross_module_impact', arguments: { plugin: 'orangehrmPayrollPlugin' } }
  });
  const payload = callRes.result.structuredContent;
  assert.equal(payload.graphSnapshotId, 'snap-test');
  assert.equal(payload.appCommit, 'commit-1');
  assert.equal(payload.qaCommit, 'qa-commit-1');
  assert.equal(payload.analysisStatus, 'SUCCESS');

  const sanitized = sanitizePayload({
    api_key: 'xyz',
    nested: { note: 'Bearer abcdefghijklmnop1234' }
  });
  assert.equal(sanitized.api_key, '[REDACTED]');
  assert.equal(sanitized.nested.note, '[REDACTED_SECRET]');
});

test('@orangehrm/qkg-extractor extracts Playwright tags, doc comments, and API/navigation AST calls', () => {
  const sampleSpec = `
/**
 * @coversComponent PayrollProcessing
 * @coversRequirement FR_PAY_008
 */
import { test, expect } from '@playwright/test';

test.describe('Payroll Flow', () => {
  /**
   * @coversEndpoint POST /api/v2/payroll/runs
   * @coversStory US_PAY_008
   */
  test('submits and approves run', { tag: ['@smoke', '@FR_PAY_010'] }, async ({ page }) => {
    await page.goto('/web/index.php/payroll/runs');
    await page.request.post('/api/v2/payroll/runs/1/submit');
  });
});
`;
  const specs = extractQaSpecSource(sampleSpec, 'e2e/payroll/workflow.spec.ts', { qaCommit: 'qa123' });
  assert.equal(specs.length, 1);
  assert.equal(specs[0].canonical_id, 'orangehrm-qa-automation::e2e/payroll/workflow.spec.ts::Payroll Flow > submits and approves run');
  assert.equal(specs[0].qa_commit, 'qa123');
  assert.ok(specs[0].covers_components.includes('PayrollProcessing'));
  assert.ok(specs[0].covers_endpoints.includes('POST /api/v2/payroll/runs'));
  assert.ok(specs[0].covers_endpoints.includes('POST /api/v2/payroll/runs/1/submit'));
  assert.ok(specs[0].navigates_routes.includes('/web/index.php/payroll/runs'));
  assert.ok(specs[0].verifies_requirements.includes('FR_PAY_008'));
  assert.ok(specs[0].verifies_requirements.includes('FR_PAY_010'));
  assert.ok(specs[0].verifies_stories.includes('US_PAY_008'));
});
