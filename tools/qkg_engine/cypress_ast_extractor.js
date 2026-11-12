/**
 * Cypress AST Extractor (Workstream 2 / QKG-02)
 *
 * Uses the TypeScript Compiler API to parse genuine Cypress `.cy.js`/`.cy.ts` specs,
 * resolving file-scoped URL constants (`const empStatusAPI = '/api/v2/...'`),
 * `cy.request(...)`, scoped `cy.intercept(...).as('alias')` + `cy.wait('@alias')`,
 * `cy.visit(...)` / `cy.loginTo(..., route)`, and rejecting `expect(true)` stubs.
 */

const fs = require('fs');
const path = require('path');
const { REPOS, buildCanonicalTestId } = require('./qkg_config');
const {
  ts,
  parseDocTags,
  normalizeSlashes,
  getCalleeName,
  resolveStringExpression,
  isAssertionStubBody,
  extractLeadingCommentsText,
  mergeDocTags,
  findEnclosingStatement,
  inferPluginFromQaSpec
} = require('../qkg_qa_extractor');

const HTTP_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']);

function normalizeCypressUrlPath(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  let cleaned = rawUrl.trim();
  if (/^https?:\/\//i.test(cleaned)) {
    try {
      cleaned = new URL(cleaned).pathname;
    } catch (_) {
      // Keep raw string when templated URL cannot be parsed
    }
  }
  cleaned = cleaned.replace(/^\*\*\/?/, '/');
  cleaned = cleaned.split('?')[0];
  // Strip trailing glob directly glued to segment ('/employment-statuses*' -> '/employment-statuses')
  // while preserving '/employment-statuses/*' as resource wildcard
  cleaned = cleaned.replace(/([^/])\*+$/g, '$1');
  if (!cleaned.startsWith('/')) {
    cleaned = '/' + cleaned;
  }
  return cleaned;
}

function parseCypressNetworkCall(callNode, stringEnv) {
  const callee = getCalleeName(callNode.expression);
  const args = callNode.arguments || [];
  if (callee !== 'cy.request' && callee !== 'cy.intercept') return null;

  if (args.length === 0) return null;
  const first = args[0];

  if (ts.isObjectLiteralExpression(first)) {
    let method = 'GET';
    let rawUrl = null;
    for (const prop of first.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const key = getCalleeName(prop.name);
      if (key === 'method') {
        const m = resolveStringExpression(prop.initializer, stringEnv);
        if (m) method = m.toUpperCase();
      } else if (key === 'url') {
        rawUrl = resolveStringExpression(prop.initializer, stringEnv);
      }
    }
    const normPath = normalizeCypressUrlPath(rawUrl);
    return normPath ? `${method} ${normPath}` : null;
  }

  const firstStr = resolveStringExpression(first, stringEnv);
  if (firstStr && HTTP_METHODS.has(firstStr.toUpperCase()) && args.length >= 2) {
    const secondStr = resolveStringExpression(args[1], stringEnv);
    const normPath = normalizeCypressUrlPath(secondStr);
    return normPath ? `${firstStr.toUpperCase()} ${normPath}` : null;
  }

  if (firstStr) {
    const normPath = normalizeCypressUrlPath(firstStr);
    return normPath ? `GET ${normPath}` : null;
  }
  return null;
}

function collectScopedInterceptAliases(containerNode, stringEnv) {
  const aliases = new Map();
  if (!containerNode) return aliases;

  const visit = (node) => {
    if (ts.isCallExpression(node)) {
      const callee = getCalleeName(node.expression);
      // Skip recursing into nested describe/it callbacks here — each describe handles its own scope
      if (callee === 'describe' || callee === 'context' || callee === 'it' || callee === 'specify' || callee === 'it.skip' || callee === 'it.only') {
        return;
      }
      if (callee.endsWith('.as') && ts.isPropertyAccessExpression(node.expression)) {
        const innerCall = node.expression.expression;
        if (ts.isCallExpression(innerCall) && getCalleeName(innerCall.expression) === 'cy.intercept') {
          const aliasName = resolveStringExpression(node.arguments[0], stringEnv);
          const endpoint = parseCypressNetworkCall(innerCall, stringEnv);
          if (aliasName && endpoint) {
            aliases.set(`@${aliasName.replace(/^@/, '')}`, endpoint);
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };

  if (ts.isBlock(containerNode)) {
    for (const stmt of containerNode.statements) visit(stmt);
  } else {
    ts.forEachChild(containerNode, visit);
  }
  return aliases;
}

function collectLocalStringConsts(containerNode, parentEnv) {
  const env = new Map(parentEnv);
  if (!containerNode) return env;
  const visit = (node) => {
    if (ts.isCallExpression(node)) {
      const callee = getCalleeName(node.expression);
      if (callee === 'describe' || callee === 'context' || callee === 'it' || callee === 'specify') {
        return;
      }
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      const val = resolveStringExpression(node.initializer, env);
      if (val !== null) env.set(node.name.text, val);
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(containerNode, visit);
  return env;
}

function extractCypressTestSignals(fnNode, stringEnv, aliasMap) {
  const endpoints = [];
  const routes = [];
  const components = [];
  if (!fnNode) return { endpoints, routes, components };

  const localEnv = collectLocalStringConsts(fnNode, stringEnv);

  const visit = (node) => {
    if (ts.isCallExpression(node)) {
      const callee = getCalleeName(node.expression);
      const args = node.arguments || [];

      if (callee === 'cy.request' || callee === 'cy.intercept') {
        const ep = parseCypressNetworkCall(node, localEnv);
        if (ep) endpoints.push(ep);
      } else if (callee === 'cy.wait' && args.length >= 1) {
        const arg0 = args[0];
        if (ts.isArrayLiteralExpression(arg0)) {
          for (const el of arg0.elements) {
            const aliasRef = resolveStringExpression(el, localEnv);
            if (aliasRef && aliasMap.has(aliasRef)) {
              endpoints.push(aliasMap.get(aliasRef));
            }
          }
        } else {
          const aliasRef = resolveStringExpression(arg0, localEnv);
          if (aliasRef && aliasMap.has(aliasRef)) {
            endpoints.push(aliasMap.get(aliasRef));
          }
        }
      } else if (callee === 'cy.visit' && args.length >= 1) {
        const routeStr = resolveStringExpression(args[0], localEnv);
        if (routeStr) routes.push(routeStr.split('?')[0]);
      } else if (callee === 'cy.loginTo' && args.length >= 2) {
        const routeStr = resolveStringExpression(args[1], localEnv);
        if (routeStr) routes.push(routeStr.split('?')[0]);
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(fnNode);
  return {
    endpoints: [...new Set(endpoints)],
    routes: [...new Set(routes)],
    components: [...new Set(components)]
  };
}

/**
 * Parses a Cypress `.cy.js` / `.cy.ts` source file using the TypeScript Compiler API.
 */
function extractCypressSpecSource(code, relFilePath, options = {}) {
  const normFile = normalizeSlashes(relFilePath);
  const repo = options.repo || REPOS.QA;
  const qaCommit = options.qaCommit || 'local';
  const scriptKind = normFile.endsWith('.tsx')
    ? ts.ScriptKind.TSX
    : (normFile.endsWith('.ts')
      ? ts.ScriptKind.TS
      : (normFile.endsWith('.jsx') ? ts.ScriptKind.JSX : ts.ScriptKind.JS));

  const sourceFile = ts.createSourceFile(normFile, code, ts.ScriptTarget.Latest, true, scriptKind);
  const specs = [];

  const fileEnv = collectLocalStringConsts(sourceFile, new Map());
  const fileHeaderTags = sourceFile.statements.length > 0
    ? parseDocTags(extractLeadingCommentsText(sourceFile.statements[0], code))
    : parseDocTags('');

  const walk = (node, suiteStack = [], inheritedTags = fileHeaderTags, env = fileEnv, aliases = new Map()) => {
    if (ts.isCallExpression(node)) {
      const callee = getCalleeName(node.expression);
      const args = node.arguments || [];
      const title = resolveStringExpression(args[0], env);

      if (callee === 'describe' || callee === 'context' || callee === 'describe.only' || callee === 'describe.skip') {
        const nextStack = title ? [...suiteStack, title.trim()] : suiteStack;
        const stmt = findEnclosingStatement(node);
        const describeTags = parseDocTags(extractLeadingCommentsText(stmt, code));
        const mergedTags = mergeDocTags(inheritedTags, describeTags);
        const body = args.find((a) => ts.isArrowFunction(a) || ts.isFunctionExpression(a));
        if (body && body.body) {
          const nextEnv = collectLocalStringConsts(body.body, env);
          const scopedAliases = collectScopedInterceptAliases(body.body, nextEnv);
          const mergedAliases = new Map([...aliases, ...scopedAliases]);
          walk(body.body, nextStack, mergedTags, nextEnv, mergedAliases);
        }
        return;
      }

      if (callee === 'it' || callee === 'specify' || callee === 'it.only' || callee === 'it.skip') {
        const fnArg = args.find((a) => ts.isArrowFunction(a) || ts.isFunctionExpression(a));
        if (isAssertionStubBody(fnArg)) {
          return;
        }
        const stmt = findEnclosingStatement(node);
        const docTags = mergeDocTags(inheritedTags, parseDocTags(extractLeadingCommentsText(stmt, code)));
        const signals = extractCypressTestSignals(fnArg, env, aliases);

        const fullTitle = [...suiteStack, title || 'unnamed_test'].join(' > ');
        const startLc = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
        const endLc = sourceFile.getLineAndCharacterOfPosition(node.getEnd());

        const coversEndpoints = [...new Set([...docTags.endpoints, ...signals.endpoints])];
        specs.push({
          canonical_id: buildCanonicalTestId(repo, normFile, fullTitle),
          testcase_id: buildCanonicalTestId(repo, normFile, fullTitle),
          title: fullTitle,
          short_title: title || 'unnamed_test',
          suite: suiteStack.join(' > ') || path.basename(normFile),
          file: normFile,
          line_start: startLc.line + 1,
          line_end: endLc.line + 1,
          framework: 'Cypress',
          origin: 'AST_CYPRESS',
          repo,
          qa_commit: qaCommit,
          skipped: callee === 'it.skip',
          plugin: inferPluginFromQaSpec({ file: normFile, endpoints: coversEndpoints, routes: signals.routes }),
          tags: [],
          covers_components: [...new Set([...docTags.components, ...signals.components])],
          covers_endpoints: coversEndpoints,
          navigates_routes: signals.routes,
          verifies_requirements: [...new Set(docTags.requirements)],
          verifies_stories: [...new Set(docTags.stories)],
          validates_rules: [...new Set(docTags.rules)]
        });
        return;
      }
    }
    ts.forEachChild(node, (child) => walk(child, suiteStack, inheritedTags, env, aliases));
  };

  walk(sourceFile, [], fileHeaderTags, fileEnv, new Map());
  return specs;
}

/**
 * Recursively discovers and extracts genuine Cypress `.cy.js`/`.cy.ts` files,
 * ignoring synthetic `suites/` directories.
 */
function extractCypressSpecDirectory(rootDir, options = {}) {
  const results = [];
  if (!rootDir || !fs.existsSync(rootDir)) return results;

  const baseForRelative = options.relativeRoot ? path.resolve(options.relativeRoot) : path.resolve(rootDir);

  const walkDir = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === 'suites') continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walkDir(full);
      } else if (ent.isFile() && /\.cy\.(ts|tsx|js|jsx)$/i.test(ent.name)) {
        const rel = normalizeSlashes(path.relative(baseForRelative, full));
        const code = fs.readFileSync(full, 'utf8');
        results.push(...extractCypressSpecSource(code, rel, options));
      }
    }
  };

  walkDir(rootDir);
  return results;
}

if (require.main === module) {
  const targetDir = process.argv[2];
  if (!targetDir) {
    console.error('Usage: node qkg_engine/cypress_ast_extractor.js <cypressDir>');
    process.exit(1);
  }
  const specs = extractCypressSpecDirectory(path.resolve(targetDir));
  console.log(JSON.stringify({ totalSpecs: specs.length, specs }, null, 2));
}

module.exports = {
  extractCypressSpecSource,
  extractCypressSpecDirectory,
  normalizeCypressUrlPath
};

