/**
 * Execution History Ingestion Engine (PHPUnit/Cypress JUnit XML + Jest JSON + Playwright JSON)
 *
 * Parses CI/local/QE-Workbench test execution reports idempotently into immutable
 * TestRun and TestExecution nodes linked to AST/QA TestCase nodes.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
try {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
} catch (_) {}

const neo4j = require('neo4j-driver');
const { WORKSPACE_ROOT, REPOS, toRepoRelPath, buildCanonicalTestId } = require('./qkg_config');

function parseAttrs(attrStr) {
  const attrs = {};
  const re = /([A-Za-z_][A-Za-z0-9_:-]*)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(attrStr)) !== null) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

function sanitizeErrorSnippet(raw) {
  if (!raw) return null;
  return String(raw)
    .replace(/(api[_-]?key|password|token|secret|bearer)\s*[:=]\s*\S+/gi, '$1=[REDACTED]')
    .slice(0, 400);
}

/**
 * Parses PHPUnit / Jest / Cypress JUnit XML into normalized TestExecution records.
 */
function parseJunitXml(xmlText, options = {}) {
  const sha256 = crypto.createHash('sha256').update(xmlText).digest('hex');
  const executions = [];
  const hintFramework = options.framework ? String(options.framework).toLowerCase() : null;

  const parseTestcaseTag = (attrString, inner, inheritedFile = null) => {
    const attrs = parseAttrs(attrString);
    const rawFile = (attrs.file || inheritedFile) ? toRepoRelPath(attrs.file || inheritedFile) : null;
    const isJsSpec = Boolean(rawFile && /\.(?:spec|cy)\.(?:ts|js)$/i.test(rawFile)) || hintFramework === 'jest' || hintFramework === 'cypress';
    const rawName = String(attrs.name || '').trim();
    const baseMethod = rawName.split(/\s+with data set/)[0].trim();
    const durationMs = Math.round(Number(attrs.time || 0) * 1000);

    let status = 'PASSED';
    let errorMessage = null;
    if (/<failure\b/i.test(inner)) {
      status = 'FAILED';
      const msgM = inner.match(/<failure((?:[^>"']|"[^"]*"|'[^']*')*)(?:\/>|>([\s\S]*?)<\/failure>)/i);
      errorMessage = sanitizeErrorSnippet(msgM ? (parseAttrs(msgM[1]).message || msgM[2]) : 'Assertion failed');
    } else if (/<error\b/i.test(inner)) {
      status = 'ERROR';
      const msgM = inner.match(/<error((?:[^>"']|"[^"]*"|'[^']*')*)(?:\/>|>([\s\S]*?)<\/error>)/i);
      errorMessage = sanitizeErrorSnippet(msgM ? (parseAttrs(msgM[1]).message || msgM[2]) : 'Test error');
    } else if (/<skipped\b/i.test(inner)) {
      status = 'SKIPPED';
    }

    if (isJsSpec) {
      const framework = hintFramework || (rawFile && /\.cy\./i.test(rawFile) ? 'cypress' : 'jest');
      const repo = options.repo || (framework === 'cypress' ? REPOS.QA : REPOS.APP);
      let normalizedFile = rawFile;
      if (framework === 'cypress' && normalizedFile && normalizedFile.startsWith('e2e/')) {
        normalizedFile = `cypress/${normalizedFile}`;
      }
      const suitePrefix = String(attrs.classname || '')
        .replace(/^\s+|\s+$/g, '')
        .replace(/\s*>\s*/g, ' > ');
      const effectiveMember = (framework === 'cypress' && suitePrefix && !baseMethod.startsWith(suitePrefix))
        ? `${suitePrefix} > ${baseMethod}`
        : baseMethod;
      const canonicalId = normalizedFile && effectiveMember
        ? buildCanonicalTestId(repo, normalizedFile, effectiveMember)
        : null;
      executions.push({
        execKey: `${normalizedFile || attrs.classname || framework}::${effectiveMember || rawName}`,
        canonicalId,
        classFqcn: null,
        file: normalizedFile,
        methodName: effectiveMember,
        shortTitle: baseMethod,
        rawName: effectiveMember || rawName,
        status,
        flaky: false,
        retried: false,
        retryCount: 0,
        durationMs,
        errorMessage,
        framework
      });
    } else {
      const classname = (attrs.classname || '').replace(/\./g, '\\').replace(/^\\+/, '');
      const canonicalId = classname && baseMethod
        ? buildCanonicalTestId(options.repo || REPOS.APP, classname, baseMethod)
        : null;

      executions.push({
        execKey: `${classname}::${rawName}`,
        canonicalId,
        classFqcn: classname || null,
        file: rawFile,
        methodName: baseMethod,
        rawName,
        status,
        flaky: false,
        retried: false,
        retryCount: 0,
        durationMs,
        errorMessage,
        framework: hintFramework || 'phpunit'
      });
    }
  };

  // Match innermost <testsuite> blocks first so suite-level `file` propagates cleanly to <testcase>
  const matchedRanges = [];
  const suiteRegex = /<testsuite\s+((?:[^>"']|"[^"]*"|'[^']*')*)>((?:(?!<testsuite\b)[\s\S])*?)<\/testsuite>/g;
  let sm;
  while ((sm = suiteRegex.exec(xmlText)) !== null) {
    matchedRanges.push([sm.index, sm.index + sm[0].length]);
    const suiteAttrs = parseAttrs(sm[1]);
    const suiteBody = sm[2];
    const tcRegex = /<testcase\s+((?:[^>"']|"[^"]*"|'[^']*')*?)(?:\/>|>([\s\S]*?)<\/testcase>)/g;
    let m;
    while ((m = tcRegex.exec(suiteBody)) !== null) {
      parseTestcaseTag(m[1], m[2] || '', suiteAttrs.file || null);
    }
  }

  // Also scan any <testcase> outside already-processed innermost <testsuite> blocks
  const globalTcRegex = /<testcase\s+((?:[^>"']|"[^"]*"|'[^']*')*?)(?:\/>|>([\s\S]*?)<\/testcase>)/g;
  let gm;
  while ((gm = globalTcRegex.exec(xmlText)) !== null) {
    const inside = matchedRanges.some(([s, e]) => gm.index >= s && gm.index < e);
    if (!inside) {
      parseTestcaseTag(gm[1], gm[2] || '', null);
    }
  }

  return {
    artifactSha256: sha256,
    source: 'JUNIT_XML',
    framework: hintFramework || (executions[0]?.framework || 'phpunit'),
    executedAt: options.executedAt || new Date().toISOString(),
    executions
  };
}

/**
 * Parses Jest `--json` output into TestExecution records aligned with TestLinker AST_JEST canonical_ids.
 */
function parseJestJson(jsonInput, options = {}) {
  const rawText = typeof jsonInput === 'string' ? jsonInput : JSON.stringify(jsonInput);
  const sha256 = crypto.createHash('sha256').update(rawText).digest('hex');
  const data = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;

  const executions = [];
  for (const suiteRes of data.testResults || []) {
    const relFile = toRepoRelPath(suiteRes.name || '') || String(suiteRes.name || '').replace(/\\/g, '/');
    const assertions = suiteRes.assertionResults || [];
    for (const ar of assertions) {
      const shortTitle = String(ar.title || 'jest-test').trim();
      const fullTitle = ar.fullName || [...(ar.ancestorTitles || []), shortTitle].filter(Boolean).join(' > ');
      const rawStatus = String(ar.status || 'skipped').toLowerCase();
      const status = rawStatus === 'passed'
        ? 'PASSED'
        : (rawStatus === 'failed' ? 'FAILED' : 'SKIPPED');
      const retryCount = Math.max(0, Number(ar.invocations || 1) - 1);
      const failureMsg = Array.isArray(ar.failureMessages) && ar.failureMessages.length > 0
        ? sanitizeErrorSnippet(ar.failureMessages.join('\n'))
        : null;

      executions.push({
        execKey: `${relFile}::${fullTitle}`,
        canonicalId: buildCanonicalTestId(options.repo || REPOS.APP, relFile, shortTitle),
        classFqcn: null,
        file: relFile,
        methodName: shortTitle,
        rawName: fullTitle,
        status,
        flaky: false,
        retried: retryCount > 0,
        retryCount,
        durationMs: Math.round(Number(ar.duration || 0)),
        errorMessage: failureMsg,
        framework: 'jest'
      });
    }
  }

  return {
    artifactSha256: sha256,
    source: 'JEST_JSON',
    framework: 'jest',
    executedAt: options.executedAt || (data.startTime ? new Date(data.startTime).toISOString() : new Date().toISOString()),
    executions
  };
}

/**
 * Parses Playwright JSON report recursively using suiteStack so full titles match @orangehrm/qkg-extractor canonical_ids.
 */
function parsePlaywrightJson(jsonInput, options = {}) {
  const rawText = typeof jsonInput === 'string' ? jsonInput : JSON.stringify(jsonInput);
  const sha256 = crypto.createHash('sha256').update(rawText).digest('hex');
  const data = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;

  const executions = [];
  const walkSuite = (suite, suiteStack = [], inheritedFile = '') => {
    if (!suite) return;
    const nextStack = suite.title && !/\.(?:spec|test)\.(?:ts|js)$/i.test(suite.title)
      ? [...suiteStack, suite.title]
      : suiteStack;
    const currentFile = (suite.file || inheritedFile || '').replace(/\\/g, '/');

    for (const spec of suite.specs || []) {
      const file = (spec.file || currentFile || '').replace(/\\/g, '/');
      const shortTitle = spec.title || 'playwright-spec';
      const fullTitle = [...nextStack, shortTitle].filter(Boolean).join(' > ');

      for (const testItem of spec.tests || []) {
        const results = testItem.results || [];
        const last = results[results.length - 1] || {};
        const hadRetryFailure = results.length > 1 && results.slice(0, -1).some((r) => r.status !== 'passed');
        const retryCount = Math.max(0, results.length - 1);
        const rawStatus = String(last.status || 'skipped').toLowerCase();
        const status = rawStatus === 'passed'
          ? 'PASSED'
          : (rawStatus === 'skipped'
              ? 'SKIPPED'
              : (rawStatus === 'interrupted' || rawStatus === 'cancelled' ? 'CANCELLED' : 'FAILED'));
        const durationMs = Number(last.duration || 0);
        const errorMessage = last.error?.message ? sanitizeErrorSnippet(last.error.message) : null;

        executions.push({
          execKey: `${file}::${fullTitle}`,
          canonicalId: buildCanonicalTestId(REPOS.QA, file, fullTitle),
          classFqcn: null,
          file,
          methodName: fullTitle,
          rawName: fullTitle,
          status,
          flaky: status === 'PASSED' && hadRetryFailure,
          retried: retryCount > 0,
          retryCount,
          durationMs,
          errorMessage,
          framework: 'playwright'
        });
      }
    }
    for (const child of suite.suites || []) walkSuite(child, nextStack, currentFile);
  };

  for (const s of data.suites || []) walkSuite(s, [], '');

  return {
    artifactSha256: sha256,
    source: 'PLAYWRIGHT_JSON',
    framework: 'playwright',
    executedAt: options.executedAt || data.stats?.startTime || new Date().toISOString(),
    executions
  };
}

async function ingestExecutionHistory({
  reportPath = null,
  reportContent = null,
  format = 'junit',
  source = null,
  framework = null,
  suiteScope = 'all',
  environment = process.env.CI_ENVIRONMENT || 'local',
  ciRunId = 'local-run',
  appCommit = 'local-working-tree',
  qaCommit = null,
  snapshotId = null,
  executedAt = null,
  uri = process.env.NEO4J_URI || 'bolt://localhost:7687',
  user = process.env.NEO4J_USER || 'neo4j',
  password = process.env.NEO4J_PASSWORD || 'admin123',
  database = process.env.NEO4J_DATABASE || 'neo4j'
}) {
  const raw = reportContent !== null ? reportContent : fs.readFileSync(reportPath, 'utf8');
  const fmt = String(format || 'junit').toLowerCase();
  const parsed = fmt.includes('playwright')
    ? parsePlaywrightJson(raw, { executedAt })
    : (fmt.includes('jest') && !fmt.includes('junit')
        ? parseJestJson(raw, { executedAt })
        : parseJunitXml(raw, { framework, executedAt }));

  const resolvedFramework = String(framework || parsed.framework || 'unknown').toLowerCase();
  const resolvedSource = source || (process.env.GITHUB_ACTIONS ? 'CI_GITHUB_ACTIONS' : parsed.source);
  const runId = `${ciRunId}-${resolvedFramework}-${parsed.artifactSha256.slice(0, 12)}`;
  const passed = parsed.executions.filter((e) => e.status === 'PASSED').length;
  const failed = parsed.executions.filter((e) => e.status === 'FAILED' || e.status === 'ERROR').length;
  const skipped = parsed.executions.filter((e) => e.status === 'SKIPPED').length;
  const cancelled = parsed.executions.filter((e) => e.status === 'CANCELLED').length;
  const flakyCount = parsed.executions.filter((e) => e.flaky).length;
  const totalDurationMs = parsed.executions.reduce((acc, e) => acc + (e.durationMs || 0), 0);

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session({ database });

  try {
    await session.run('CREATE CONSTRAINT qkg_test_run_id IF NOT EXISTS FOR (n:TestRun) REQUIRE n.run_id IS UNIQUE');
    await session.run('CREATE CONSTRAINT qkg_test_exec_id IF NOT EXISTS FOR (n:TestExecution) REQUIRE n.exec_id IS UNIQUE');

    const snapRes = await session.run(`
      MERGE (tr:TestRun { run_id: $runId })
      SET tr.ci_run_id = $ciRunId,
          tr.artifact_sha256 = $sha256,
          tr.source = $source,
          tr.framework = $framework,
          tr.suite_scope = $suiteScope,
          tr.environment = $environment,
          tr.app_commit = $appCommit,
          tr.qa_commit = $qaCommit,
          tr.total = $total,
          tr.passed = $passed,
          tr.failed = $failed,
          tr.skipped = $skipped,
          tr.cancelled = $cancelled,
          tr.flaky = $flakyCount,
          tr.duration_ms = $totalDurationMs,
          tr.executed_at = $executedAt,
          tr.ingested_at = $nowIso
      WITH tr
      OPTIONAL MATCH (s:GraphSnapshot)
      WHERE ($snapshotId IS NOT NULL AND s.snapshot_id = $snapshotId)
         OR ($snapshotId IS NULL AND (s.status = 'PUBLISHED' OR s.app_commit = $appCommit))
      WITH tr, s ORDER BY CASE WHEN s.snapshot_id = $snapshotId THEN 0 WHEN s.app_commit = $appCommit THEN 1 ELSE 2 END, coalesce(s.published_at, s.started_at) DESC LIMIT 1
      FOREACH (_ IN CASE WHEN s IS NOT NULL THEN [1] ELSE [] END |
        SET tr.snapshot_id = s.snapshot_id
        MERGE (tr)-[:EXECUTED_AGAINST_SNAPSHOT]->(s)
      )
      RETURN s.snapshot_id AS resolvedSnapshotId
    `, {
      runId,
      ciRunId,
      sha256: parsed.artifactSha256,
      source: resolvedSource,
      framework: resolvedFramework,
      suiteScope,
      environment,
      appCommit,
      qaCommit: qaCommit || appCommit,
      total: parsed.executions.length,
      passed,
      failed,
      skipped,
      cancelled,
      flakyCount,
      totalDurationMs,
      executedAt: parsed.executedAt,
      nowIso: new Date().toISOString(),
      snapshotId
    });
    const resolvedSnapshotId = snapRes.records[0]?.get('resolvedSnapshotId') || snapshotId;

    const rows = parsed.executions.map((e, idx) => ({
      execId: `${runId}::${e.execKey}::${idx}`,
      canonicalId: e.canonicalId,
      classFqcn: e.classFqcn,
      file: e.file || null,
      methodName: e.methodName,
      shortTitle: e.shortTitle || e.methodName,
      rawName: e.rawName,
      status: e.status,
      flaky: Boolean(e.flaky),
      retried: Boolean(e.retried),
      retryCount: Number(e.retryCount || 0),
      durationMs: Number(e.durationMs || 0),
      errorMessage: e.errorMessage,
      framework: e.framework || resolvedFramework
    }));

    let linkedCount = 0;
    for (let i = 0; i < rows.length; i += 400) {
      const batch = rows.slice(i, i + 400);
      const res = await session.run(`
        UNWIND $batch AS r
        MATCH (tr:TestRun { run_id: $runId })
        MERGE (te:TestExecution { exec_id: r.execId })
        SET te.status = r.status,
            te.flaky = r.flaky,
            te.retried = r.retried,
            te.retry_count = r.retryCount,
            te.duration_ms = r.durationMs,
            te.testcase_id = coalesce(r.canonicalId, r.rawName),
            te.raw_name = r.rawName,
            te.framework = r.framework,
            te.error_message = r.errorMessage,
            te.executed_at = $executedAt,
            te.app_commit = $appCommit,
            te.snapshot_id = $snapshotId
        MERGE (tr)-[:HAS_EXECUTION]->(te)
        WITH te, r
        OPTIONAL MATCH (tcExact:TestCase { canonical_id: r.canonicalId })
        OPTIONAL MATCH (tcPhp:TestCase)
        WHERE tcExact IS NULL AND r.classFqcn IS NOT NULL AND tcPhp.class_fqcn = r.classFqcn AND tcPhp.method_name = r.methodName
        OPTIONAL MATCH (tcFile:TestCase)
        WHERE tcExact IS NULL AND tcPhp IS NULL AND r.file IS NOT NULL AND tcFile.file = r.file
          AND (tcFile.method_name = r.methodName OR tcFile.method_name = r.rawName OR tcFile.name = r.rawName OR tcFile.short_title = r.shortTitle OR tcFile.title = r.methodName)
        WITH te, coalesce(tcExact, tcPhp, tcFile) AS tc
        FOREACH (_ IN CASE WHEN tc IS NOT NULL THEN [1] ELSE [] END |
          MERGE (te)-[:EXECUTED_TEST]->(tc)
        )
        RETURN count(tc) AS linked
      `, {
        batch,
        runId,
        executedAt: parsed.executedAt,
        appCommit,
        snapshotId: resolvedSnapshotId
      });
      linkedCount += res.records[0]?.get('linked').toNumber() || 0;
    }

    const unmatchedExecutions = Math.max(0, parsed.executions.length - linkedCount);

    return {
      runId,
      artifactSha256: parsed.artifactSha256,
      source: resolvedSource,
      framework: resolvedFramework,
      suiteScope,
      snapshotId: resolvedSnapshotId,
      total: parsed.executions.length,
      passed,
      failed,
      skipped,
      cancelled,
      flakyCount,
      durationMs: totalDurationMs,
      linkedTestCases: linkedCount,
      unmatchedExecutions
    };
  } finally {
    await session.close();
    await driver.close();
  }
}

if (require.main === module) {
  const format = process.argv[2] || 'junit';
  const reportPath = process.argv[3];
  const ciRunId = process.argv[4] || `cli-${Date.now()}`;
  const appCommit = process.argv[5] || 'local-working-tree';
  const suiteScope = process.argv[6] || 'all';
  if (!reportPath) {
    console.error('Usage: node qkg_engine/execution_history_ingestion.js <junit|jest|playwright|cypress> <reportFile> [ciRunId] [appCommit] [suiteScope]');
    process.exit(1);
  }
  ingestExecutionHistory({ reportPath: path.resolve(WORKSPACE_ROOT, reportPath), format, ciRunId, appCommit, suiteScope })
    .then((res) => console.log('Execution history ingested:', JSON.stringify(res)))
    .catch((err) => {
      console.error('Execution history ingestion failed:', err);
      process.exit(1);
    });
}

module.exports = {
  parseJunitXml,
  parseJestJson,
  parsePlaywrightJson,
  sanitizeErrorSnippet,
  ingestExecutionHistory
};
