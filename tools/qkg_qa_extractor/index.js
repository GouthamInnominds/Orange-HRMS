/**
 * @orangehrm/qkg-extractor
 *
 * Uses the TypeScript Compiler API (zero fragile regex parsing of code) to extract
 * external Playwright & TypeScript QA specs into canonical QKG TestCase descriptors.
 */

const fs = require('fs');
const path = require('path');

const CLIENT_NODE_MODULES = path.resolve(__dirname, '../../orange_hrm/src/client/node_modules');
const tsPath = require.resolve('typescript', { paths: [__dirname, CLIENT_NODE_MODULES] });
const ts = require(tsPath);

const { REPOS, buildCanonicalTestId } = require('../qkg_engine/qkg_config');

function normalizeSlashes(p) {
  return String(p || '').replace(/\\/g, '/');
}

function getCalleeName(expr) {
  if (!expr) return '';
  if (ts.isIdentifier(expr)) return expr.text;
  if (ts.isPropertyAccessExpression(expr)) {
    return `${getCalleeName(expr.expression)}.${expr.name.text}`;
  }
  return '';
}

function getStringLiteralValue(node) {
  if (!node) return null;
  if (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  return null;
}

/**
 * Collects top-level / block string variable declarations (e.g. const api = '/api/v2/...').
 */
function collectStringConstants(rootNode) {
  const env = new Map();
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      const val = resolveStringExpression(node.initializer, env);
      if (val !== null) {
        env.set(node.name.text, val);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(rootNode);
  return env;
}

/**
 * Resolves string literals, identifier lookups, concatenations (+), and template literals.
 */
function resolveStringExpression(node, env = new Map()) {
  if (!node) return null;
  const direct = getStringLiteralValue(node);
  if (direct !== null) return direct;
  if (ts.isIdentifier(node) && env.has(node.text)) {
    return env.get(node.text);
  }
  if (ts.isTemplateExpression(node)) {
    let out = node.head.text;
    for (const span of node.templateSpans) {
      const resolved = resolveStringExpression(span.expression, env);
      out += resolved !== null ? resolved : '*';
      out += span.literal.text;
    }
    return out;
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = resolveStringExpression(node.left, env);
    const right = resolveStringExpression(node.right, env);
    if (left !== null && right !== null) return `${left}${right}`;
    if (left !== null) return `${left}*`;
  }
  return null;
}

/**
 * Detects zero-signal assertion stubs like expect(true).toBe(true), expect(true).to.be.true,
 * assert.isTrue(true), or completely empty test bodies.
 */
function isAssertionStubBody(fnNode) {
  if (!fnNode) return true;
  if (fnNode.body && ts.isBlock(fnNode.body) && fnNode.body.statements.length === 0) {
    return true;
  }

  let tautologyCount = 0;
  let realAssertionCount = 0;
  let actionCallCount = 0;

  const isBooleanOrConstExpr = (expr) => {
    if (!expr) return false;
    return expr.kind === ts.SyntaxKind.TrueKeyword || expr.kind === ts.SyntaxKind.FalseKeyword;
  };

  const visit = (node) => {
    if (ts.isCallExpression(node)) {
      const callee = getCalleeName(node.expression);
      if (callee === 'expect') {
        const arg0 = node.arguments[0];
        if (isBooleanOrConstExpr(arg0)) {
          tautologyCount += 1;
        } else {
          realAssertionCount += 1;
        }
      } else if (/\.should$|^assert\./.test(callee)) {
        if (callee === 'assert.isTrue' && isBooleanOrConstExpr(node.arguments[0])) {
          tautologyCount += 1;
        } else {
          realAssertionCount += 1;
        }
      } else if (
        /(?:^|\.)(?:request|intercept|visit|loginTo|goto|click|fill|type|toast|isInvalid|wait|getOXD|getOXDInput|fetch)$/.test(callee) ||
        /(?:^|\.)request\.(?:get|post|put|patch|delete)$/i.test(callee) ||
        /^cy\./.test(callee)
      ) {
        actionCallCount += 1;
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(fnNode);
  if (tautologyCount > 0 && realAssertionCount === 0) return true;
  if (realAssertionCount === 0 && actionCallCount === 0) return true;
  return false;
}

function mergeDocTags(parentTags, childTags) {
  const safeParent = parentTags || {};
  const safeChild = childTags || {};
  return {
    components: [...new Set([...(safeParent.components || []), ...(safeChild.components || [])])],
    endpoints: [...new Set([...(safeParent.endpoints || []), ...(safeChild.endpoints || [])])],
    requirements: [...new Set([...(safeParent.requirements || []), ...(safeChild.requirements || [])])],
    stories: [...new Set([...(safeParent.stories || []), ...(safeChild.stories || [])])],
    rules: [...new Set([...(safeParent.rules || []), ...(safeChild.rules || [])])]
  };
}

function findEnclosingStatement(node) {
  let stmt = node;
  while (stmt && stmt.parent && !ts.isSourceFile(stmt.parent) && !ts.isBlock(stmt.parent)) {
    stmt = stmt.parent;
  }
  return stmt;
}

function parseDocTags(text) {
  const tags = {
    components: [],
    endpoints: [],
    requirements: [],
    stories: [],
    rules: []
  };
  if (!text) return tags;

  const patterns = [
    [/@coversComponent\s+([^\r\n*]+)/g, tags.components],
    [/@coversEndpoint\s+([^\r\n*]+)/g, tags.endpoints],
    [/@coversRequirement\s+([^\r\n*]+)/g, tags.requirements],
    [/@coversStory\s+([^\r\n*]+)/g, tags.stories],
    [/@coversRule\s+([^\r\n*]+)/g, tags.rules]
  ];
  for (const [re, bucket] of patterns) {
    let m;
    while ((m = re.exec(text)) !== null) {
      const clean = m[1].trim().replace(/\*\/$/, '').trim();
      if (clean) bucket.push(clean);
    }
  }
  return tags;
}

function extractLeadingCommentsText(node, sourceText) {
  const ranges = ts.getLeadingCommentRanges(sourceText, node.pos) || [];
  return ranges.map((r) => sourceText.slice(r.pos, r.end)).join('\n');
}

function extractOptionsTags(argNode) {
  const tags = [];
  if (!argNode || !ts.isObjectLiteralExpression(argNode)) return tags;
  for (const prop of argNode.properties) {
    if (ts.isPropertyAssignment(prop) && getCalleeName(prop.name) === 'tag') {
      if (ts.isArrayLiteralExpression(prop.initializer)) {
        for (const el of prop.initializer.elements) {
          const val = getStringLiteralValue(el);
          if (val) tags.push(val);
        }
      } else {
        const single = getStringLiteralValue(prop.initializer);
        if (single) tags.push(single);
      }
    }
  }
  return tags;
}

function extractNetworkAndNavigationCalls(fnNode, stringEnv = new Map()) {
  const endpoints = [];
  const routes = [];
  if (!fnNode) return { endpoints, routes };

  const visit = (node) => {
    if (ts.isCallExpression(node)) {
      const callee = getCalleeName(node.expression);
      const firstStr = resolveStringExpression(node.arguments[0], stringEnv);
      if (firstStr) {
        const reqMatch = callee.match(/(?:^|\.)request\.(get|post|put|patch|delete)$/i);
        if (reqMatch) {
          endpoints.push(`${reqMatch[1].toUpperCase()} ${firstStr}`);
        } else if (callee === 'fetch') {
          endpoints.push(firstStr);
        } else if (callee.endsWith('.goto')) {
          routes.push(firstStr);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(fnNode);
  return {
    endpoints: [...new Set(endpoints)],
    routes: [...new Set(routes)]
  };
}

function inferPluginFromQaSpec({ file, endpoints = [], routes = [], declaredPlugin = null }) {
  if (declaredPlugin) return declaredPlugin;
  const knownSegmentToPlugin = {
    admin: 'orangehrmAdminPlugin',
    attendance: 'orangehrmAttendancePlugin',
    auth: 'orangehrmAuthenticationPlugin',
    authentication: 'orangehrmAuthenticationPlugin',
    buzz: 'orangehrmBuzzPlugin',
    claim: 'orangehrmClaimPlugin',
    core: 'orangehrmCorePlugin',
    dashboard: 'orangehrmDashboardPlugin',
    directory: 'orangehrmCorporateDirectoryPlugin',
    help: 'orangehrmHelpPlugin',
    i18n: 'orangehrmI18NPlugin',
    leave: 'orangehrmLeavePlugin',
    maintenance: 'orangehrmMaintenancePlugin',
    mobile: 'orangehrmMobilePlugin',
    payroll: 'orangehrmPayrollPlugin',
    performance: 'orangehrmPerformancePlugin',
    pim: 'orangehrmPimPlugin',
    recruitment: 'orangehrmRecruitmentPlugin',
    time: 'orangehrmTimePlugin',
    oauth2: 'orangehrmCoreOAuthPlugin',
    ldap: 'orangehrmLDAPAuthenticationPlugin'
  };

  for (const ep of endpoints) {
    const m = String(ep).match(/\/api\/v\d+\/([a-z0-9_-]+)/i) || String(ep).match(/\/(auth)\//i);
    if (m) {
      const hit = knownSegmentToPlugin[m[1].toLowerCase()];
      if (hit) return hit;
    }
  }
  for (const rt of routes) {
    const m = String(rt).match(/^\/*([a-z0-9_-]+)\//i);
    if (m) {
      const hit = knownSegmentToPlugin[m[1].toLowerCase()];
      if (hit) return hit;
    }
  }
  const norm = normalizeSlashes(file).toLowerCase();
  for (const [seg, plugin] of Object.entries(knownSegmentToPlugin)) {
    if (norm.includes(`/${seg}/`)) return plugin;
  }
  return 'orangehrmCorePlugin';
}

/**
 * Extracts Playwright / TypeScript spec metadata via TypeScript Compiler API.
 */
function extractQaSpecSource(code, relFilePath, options = {}) {
  const normFile = normalizeSlashes(relFilePath);
  const repo = options.repo || REPOS.QA;
  const qaCommit = options.qaCommit || 'local';
  const scriptKind = normFile.endsWith('.tsx')
    ? ts.ScriptKind.TSX
    : (normFile.endsWith('.js') ? ts.ScriptKind.JS : ts.ScriptKind.TS);

  const sourceFile = ts.createSourceFile(normFile, code, ts.ScriptTarget.Latest, true, scriptKind);
  const specs = [];
  const stringEnv = collectStringConstants(sourceFile);

  const fileHeaderTags = sourceFile.statements.length > 0
    ? parseDocTags(extractLeadingCommentsText(sourceFile.statements[0], code))
    : parseDocTags('');

  const walk = (node, suiteStack = [], inheritedTags = fileHeaderTags) => {
    if (ts.isCallExpression(node)) {
      const callee = getCalleeName(node.expression);
      const args = node.arguments || [];
      const title = getStringLiteralValue(args[0]);

      if (callee === 'test.describe' || callee === 'describe') {
        const nextStack = title ? [...suiteStack, title] : suiteStack;
        const stmt = findEnclosingStatement(node);
        const describeTags = parseDocTags(extractLeadingCommentsText(stmt, code));
        const mergedTags = mergeDocTags(inheritedTags, describeTags);
        const body = args.find((a) => ts.isArrowFunction(a) || ts.isFunctionExpression(a));
        if (body) walk(body, nextStack, mergedTags);
        return;
      }

      if (callee === 'test' || callee === 'it' || callee === 'test.only' || callee === 'test.skip') {
        const fnArg = args.find((a) => ts.isArrowFunction(a) || ts.isFunctionExpression(a));
        if (isAssertionStubBody(fnArg)) {
          return;
        }
        const optArg = args.length >= 3 && ts.isObjectLiteralExpression(args[1]) ? args[1] : null;
        const playwrightTags = extractOptionsTags(optArg);

        const stmt = findEnclosingStatement(node);
        const docTags = mergeDocTags(inheritedTags, parseDocTags(extractLeadingCommentsText(stmt, code)));
        const bodyCalls = extractNetworkAndNavigationCalls(fnArg, stringEnv);

        const fullTitle = [...suiteStack, title || 'unnamed_test'].join(' > ');
        const startLc = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
        const endLc = sourceFile.getLineAndCharacterOfPosition(node.getEnd());

        const allTags = new Set(playwrightTags);
        const reqIds = [...docTags.requirements];
        for (const t of allTags) {
          if (/^@(?:FR|BR|US|NFR)_[A-Z0-9_]+$/i.test(t)) {
            const clean = t.slice(1);
            if (/^US_/i.test(clean)) docTags.stories.push(clean);
            else if (/^BR_/i.test(clean)) docTags.rules.push(clean);
            else reqIds.push(clean);
          }
        }

        const coversEndpoints = [...new Set([...docTags.endpoints, ...bodyCalls.endpoints])];
        specs.push({
          canonical_id: buildCanonicalTestId(repo, normFile, fullTitle),
          testcase_id: buildCanonicalTestId(repo, normFile, fullTitle),
          title: fullTitle,
          short_title: title || 'unnamed_test',
          suite: suiteStack.join(' > ') || path.basename(normFile),
          file: normFile,
          line_start: startLc.line + 1,
          line_end: endLc.line + 1,
          framework: 'Playwright',
          origin: 'AST_PLAYWRIGHT',
          repo,
          qa_commit: qaCommit,
          skipped: callee === 'test.skip',
          plugin: inferPluginFromQaSpec({ file: normFile, endpoints: coversEndpoints, routes: bodyCalls.routes }),
          tags: Array.from(allTags),
          covers_components: [...new Set(docTags.components)],
          covers_endpoints: coversEndpoints,
          navigates_routes: bodyCalls.routes,
          verifies_requirements: [...new Set(reqIds)],
          verifies_stories: [...new Set(docTags.stories)],
          validates_rules: [...new Set(docTags.rules)]
        });
        return;
      }
    }
    ts.forEachChild(node, (child) => walk(child, suiteStack, inheritedTags));
  };

  walk(sourceFile, [], fileHeaderTags);
  return specs;
}

function extractQaSpecDirectory(rootDir, options = {}) {
  const results = [];
  if (!fs.existsSync(rootDir)) return results;

  const walkDir = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.name === 'node_modules' || ent.name === '.git') continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walkDir(full);
      } else if (ent.isFile() && /\.spec\.(ts|tsx|js|jsx)$/i.test(ent.name)) {
        const rel = normalizeSlashes(path.relative(rootDir, full));
        const code = fs.readFileSync(full, 'utf8');
        results.push(...extractQaSpecSource(code, rel, options));
      }
    }
  };
  walkDir(rootDir);
  return results;
}

if (require.main === module) {
  const targetDir = process.argv[2];
  if (!targetDir) {
    console.error('Usage: node qkg_qa_extractor/index.js <qaSpecsDir>');
    process.exit(1);
  }
  const specs = extractQaSpecDirectory(path.resolve(targetDir));
  console.log(JSON.stringify({ totalSpecs: specs.length, specs }, null, 2));
}

module.exports = {
  ts,
  extractQaSpecSource,
  extractQaSpecDirectory,
  parseDocTags,
  normalizeSlashes,
  getCalleeName,
  getStringLiteralValue,
  collectStringConstants,
  resolveStringExpression,
  isAssertionStubBody,
  extractLeadingCommentsText,
  mergeDocTags,
  findEnclosingStatement,
  inferPluginFromQaSpec
};
