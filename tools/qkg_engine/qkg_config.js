/**
 * Central QKG Configuration, Identity Builders & Path Normalizers
 * Enforces:
 *  - All 23 plugins included for source AST, endpoints, UI, DB, docs & user stories
 *  - All 22 PHPUnit suites (4,908 baseline + 18 Payroll = 4,926 tests) + 6 core Jest specs ingested via code AST
 *  - Synthetic Payroll QA manifest tests (E2E-*, UI-*, manifest-only TC_PAY_*) excluded cleanly
 *  - Repo-relative normalized file paths across PHP, Vue/TS, YAML and Tests
 */

const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
try {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
} catch (_) {
  // dotenv is optional when callers pass explicit environment variables
}

const WORKSPACE_ROOT = path.resolve(__dirname, '..', '..');
const ORANGE_HRM_ROOT = path.join(WORKSPACE_ROOT, 'orange_hrm');
const PLUGINS_DIR = path.join(ORANGE_HRM_ROOT, 'src', 'plugins');
const LIB_DIR = path.join(ORANGE_HRM_ROOT, 'src', 'lib');
const CLIENT_SRC_DIR = path.join(ORANGE_HRM_ROOT, 'src', 'client', 'src');
const BASELINE_DIR = path.join(WORKSPACE_ROOT, 'OrangeHRM_Baseline_v1.0');
const PAYROLL_EXT_DIR = path.join(WORKSPACE_ROOT, 'OrangeHRM_Payroll_Extension_v2.2');
const QA_REPO_DIR = process.env.QKG_QA_REPO_DIR ? path.resolve(process.env.QKG_QA_REPO_DIR) : null;
const SNAPSHOT_RETENTION_LIMIT = parseInt(process.env.QKG_SNAPSHOT_RETENTION || '20', 10);

function getQaGitMetadata() {
  if (!QA_REPO_DIR || !fs.existsSync(QA_REPO_DIR)) {
    return { qaRepoConfigured: false, qaCommit: 'not_configured', qaBranch: null };
  }
  try {
    const qaCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: QA_REPO_DIR, encoding: 'utf8' }).trim();
    const qaBranch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: QA_REPO_DIR, encoding: 'utf8' }).trim();
    return { qaRepoConfigured: true, qaCommit, qaBranch };
  } catch (_) {
    return { qaRepoConfigured: true, qaCommit: 'local-working-tree', qaBranch: 'unknown' };
  }
}

const REPOS = {
  APP: 'orange-hrms',
  QA: 'orangehrm-qa-automation'
};

// All 23 plugins are parsed for source AST, routes, Vue/TS, DB entities, and PHPUnit dev tests
const INCLUDED_TEST_SUITES_SCOPE = 'ALL_22_PHPUNIT_SUITES';
const EXCLUDED_MANIFEST_FILES = [
  'payroll_all_executed_tests.json',
  'payroll_unit_integration_tests.json'
];
const EXCLUDED_SYNTHETIC_PREFIXES = ['TC_PAY_', 'E2E-', 'UI-'];

// Guard against 1,559-1,869 baseline Requirement VERIFIES fan-out in selective TIA
const BASELINE_REQUIREMENT_FANOUT_GUARD = true;

function toRepoRelPath(absOrRelPath) {
  if (!absOrRelPath) return null;
  let norm = String(absOrRelPath).replace(/\\/g, '/').trim();
  const rootNorm = WORKSPACE_ROOT.replace(/\\/g, '/').replace(/\/+$/, '');
  const qaRootNorm = QA_REPO_DIR ? QA_REPO_DIR.replace(/\\/g, '/').replace(/\/+$/, '') : null;

  if (qaRootNorm && norm.toLowerCase().startsWith(qaRootNorm.toLowerCase() + '/')) {
    norm = norm.slice(qaRootNorm.length + 1);
    return norm.replace(/^\.\//, '');
  }
  if (norm.toLowerCase().startsWith(rootNorm.toLowerCase() + '/')) {
    norm = norm.slice(rootNorm.length + 1);
  }
  norm = norm.replace(/^\.\//, '');

  if (norm.startsWith('src/')) {
    norm = 'orange_hrm/' + norm;
  } else if (norm.startsWith('client/')) {
    norm = 'orange_hrm/src/' + norm;
  }
  return norm;
}

function buildCanonicalTestId(repo, fqcnOrFile, memberName) {
  const cleanRepo = repo || REPOS.APP;
  const cleanTarget = String(fqcnOrFile || '').replace(/\\/g, '\\').replace(/^\\+/, '');
  const cleanMember = String(memberName || '').trim();
  return `${cleanRepo}::${cleanTarget}::${cleanMember}`;
}

function extractPluginFromPath(relPath) {
  const norm = toRepoRelPath(relPath) || '';
  const phpMatch = norm.match(/orange_hrm\/src\/plugins\/(orangehrm[A-Za-z0-9]+Plugin)\//);
  if (phpMatch) return phpMatch[1];

  const clientMatch = norm.match(/orange_hrm\/src\/client\/src\/(orangehrm[A-Za-z0-9]+Plugin|core)\//);
  if (clientMatch) return clientMatch[1];

  if (norm.startsWith('orange_hrm/src/client/src/') && /^orange_hrm\/src\/client\/src\/[^/]+\.(ts|js|vue)$/.test(norm)) {
    return 'core';
  }
  if (norm.startsWith('orange_hrm/src/lib/')) {
    return 'orangehrmCorePlugin';
  }
  return null;
}

module.exports = {
  WORKSPACE_ROOT,
  ORANGE_HRM_ROOT,
  PLUGINS_DIR,
  LIB_DIR,
  CLIENT_SRC_DIR,
  BASELINE_DIR,
  PAYROLL_EXT_DIR,
  QA_REPO_DIR,
  SNAPSHOT_RETENTION_LIMIT,
  REPOS,
  INCLUDED_TEST_SUITES_SCOPE,
  EXCLUDED_MANIFEST_FILES,
  EXCLUDED_SYNTHETIC_PREFIXES,
  BASELINE_REQUIREMENT_FANOUT_GUARD,
  toRepoRelPath,
  buildCanonicalTestId,
  extractPluginFromPath,
  getQaGitMetadata
};

