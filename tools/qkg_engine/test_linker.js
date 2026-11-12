/**
 * Method-Level Developer Test Linker (Phase 2.1)
 *
 * Scans ALL 22 PHPUnit suites (orange_hrm/src/plugins/ * /test/** /*.php)
 * plus Core Jest specs (orange_hrm/src/client/src/** /__tests__/*.spec.{ts,js})
 * using PHP AST + SymbolResolver (zero hardcoded Payroll QA manifest nodes).
 *
 * Implements 4-tier evidence resolution per test method:
 *  - Tier 1 (1.0): @covers Class::method / @coversDefaultClass
 *  - Tier 2 (0.85-0.9): setUp SUT instantiation, partial mock (onlyMethods),
 *                       API Endpoint integration mock/assert, or Reflection private calls
 *  - Tier 3 (0.7-0.8): Direct SUT instantiations & static/instance production method calls
 *  - Tier 4 (0.25-0.3): POTENTIAL_COVERS from collaborator mocks & testXxx naming heuristic
 *    (Auto-upgrade rule: confirmed Tier 1-3 TESTS suppresses/deletes POTENTIAL_COVERS)
 *
 * Also builds EXECUTES_AGAINST edges from *APITest.php -> RoutesExtractor ApiEndpoints.
 */

const fs = require('fs');
const path = require('path');
const {
  PLUGINS_DIR,
  CLIENT_SRC_DIR,
  BASELINE_DIR,
  PAYROLL_EXT_DIR,
  REPOS,
  toRepoRelPath,
  buildCanonicalTestId,
  extractPluginFromPath
} = require('./qkg_config');

const PLUGIN_SUITE_MAP = {
  orangehrmAdminPlugin: 'Admin',
  orangehrmAttendancePlugin: 'Attendance',
  orangehrmAuthenticationPlugin: 'Authentication',
  orangehrmBuzzPlugin: 'Buzz',
  orangehrmClaimPlugin: 'Claim',
  orangehrmCoreOAuthPlugin: 'CoreOAuth',
  orangehrmCorePlugin: 'Core',
  orangehrmCorporateBrandingPlugin: 'CorporateBranding',
  orangehrmCorporateDirectoryPlugin: 'CorporateDirectory',
  orangehrmDashboardPlugin: 'Dashboard',
  orangehrmHelpPlugin: 'Help',
  orangehrmI18NPlugin: 'I18N',
  orangehrmLDAPAuthenticationPlugin: 'LDAP',
  orangehrmLeavePlugin: 'Leave',
  orangehrmMaintenancePlugin: 'Maintenance',
  orangehrmMobilePlugin: 'Mobile',
  orangehrmOpenidAuthenticationPlugin: 'OpenId',
  orangehrmPayrollPlugin: 'Payroll',
  orangehrmPerformancePlugin: 'Performance',
  orangehrmPimPlugin: 'Pim',
  orangehrmRecruitmentPlugin: 'Recruitment',
  orangehrmTimePlugin: 'Time'
};

const API_METHOD_TO_HTTP = {
  getAll: 'GET',
  getOne: 'GET',
  create: 'POST',
  update: 'PUT',
  delete: 'DELETE'
};

const MOCK_FRAMEWORK_METHODS = new Set([
  'expects', 'method', 'will', 'willReturn', 'willReturnMap', 'willReturnCallback',
  'willThrowException', 'with', 'withConsecutive', 'disableOriginalConstructor',
  'onlyMethods', 'addMethods', 'getMock', 'getMockBuilder', 'createMock',
  'createPartialMock', 'any', 'once', 'exactly', 'atLeastOnce', 'never',
  'returnValue', 'returnValueMap', 'returnCallback', 'throwException',
  'expectException', 'expectExceptionMessage', 'expectNotImplementedException'
]);

function walkFiles(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walkFiles(full, predicate, out);
    } else if (ent.isFile() && predicate(ent.name, full)) {
      out.push(full);
    }
  }
  return out;
}

class TestLinker {
  /**
   * @param {object} params
   * @param {import('./php_ast_extractor')} params.phpExtractor
   * @param {import('./symbol_resolver')} params.prodResolver - SymbolResolver seeded with production files
   * @param {Array<object>} [params.prodParsedFiles]
   * @param {Array<object>} [params.apiEndpoints] - Output from RoutesExtractor
   * @param {Array<object>} [params.frontendItems] - Output from VueAstExtractor.extractAll().components
   */
  constructor({ phpExtractor, prodResolver, prodParsedFiles = [], apiEndpoints = [], frontendItems = [] }) {
    this.phpExtractor = phpExtractor;
    this.prodResolver = prodResolver;
    this.prodParsedFiles = prodParsedFiles;
    this.apiEndpoints = apiEndpoints;
    this.frontendItems = frontendItems;

    this.endpointsByHandlerFqcn = new Map();
    for (const ep of apiEndpoints) {
      if (!ep.handler_fqcn) continue;
      if (!this.endpointsByHandlerFqcn.has(ep.handler_fqcn)) {
        this.endpointsByHandlerFqcn.set(ep.handler_fqcn, []);
      }
      this.endpointsByHandlerFqcn.get(ep.handler_fqcn).push(ep);
    }

    this.frontendByFile = new Map();
    for (const item of frontendItems) {
      if (item.file) this.frontendByFile.set(item.file, item);
    }
  }

  _loadBaselineUnitLookup() {
    const lookup = new Map();
    const unitJsonPath = path.join(BASELINE_DIR, '04_Test_Strategy', 'unit_tests.json');
    if (!fs.existsSync(unitJsonPath)) return lookup;
    const rows = JSON.parse(fs.readFileSync(unitJsonPath, 'utf8'));
    for (const row of rows) {
      const rel = toRepoRelPath(row.test_file);
      if (!rel || !row.method_name) continue;
      lookup.set(`${rel}::${row.method_name}`, row);
    }
    return lookup;
  }

  _loadPayrollUnitMetadataLookup() {
    // Strictly used as traceability metadata lookup (story_ids/rule_ids/requirement_ids/legacy_ids)
    // for AST-parsed Payroll PHPUnit methods on disk; NEVER creates manifest-only nodes.
    const lookup = new Map();
    const payJsonPath = path.join(PAYROLL_EXT_DIR, '04_Test_Strategy', 'payroll_unit_integration_tests.json');
    if (!fs.existsSync(payJsonPath)) return lookup;
    const rows = JSON.parse(fs.readFileSync(payJsonPath, 'utf8'));
    for (const row of rows) {
      if (row.name) lookup.set(row.name.trim(), row);
    }
    return lookup;
  }

  _isProductionMethod(methodObj) {
    if (!methodObj || !methodObj.signature) return false;
    const src = methodObj.source_file || '';
    if (src.includes('/test/') || methodObj.class_fqcn.startsWith('OrangeHRM\\Tests\\')) {
      return false;
    }
    return this.prodResolver.methodBySignature.has(methodObj.signature);
  }

  _isProductionClass(fqcn) {
    if (!fqcn || fqcn.startsWith('OrangeHRM\\Tests\\')) return false;
    const cls = this.prodResolver.typeByFqcn.get(fqcn);
    if (!cls) return false;
    const src = cls.source_file || '';
    return !src.includes('/test/');
  }

  _pluginToModule(pluginName) {
    if (pluginName === 'core') return 'Core';
    return PLUGIN_SUITE_MAP[pluginName] || pluginName.replace(/^orangehrm|Plugin$/g, '');
  }

  _suitePriorityScore(tier, currentMap, key) {
    const existing = currentMap.get(key);
    return existing ? existing.confidence : -1;
  }

  _recordConfirmedEdge(confirmedMap, targetSig, payload) {
    if (!targetSig) return;
    if (payload.confidence > this._suitePriorityScore(payload.tier, confirmedMap, targetSig)) {
      confirmedMap.set(targetSig, {
        target_method_signature: targetSig,
        tier: payload.tier,
        confidence: payload.confidence,
        evidence_type: payload.evidence_type,
        mapping_source: payload.mapping_source || 'AST_TEST_LINKER'
      });
    }
  }

  _recordPotentialEdge(potentialMap, targetSig, payload) {
    if (!targetSig) return;
    const existing = potentialMap.get(targetSig);
    if (!existing || payload.confidence > existing.confidence) {
      potentialMap.set(targetSig, {
        target_method_signature: targetSig,
        tier: 4,
        confidence: payload.confidence,
        evidence_type: payload.evidence_type,
        mapping_source: 'AST_TEST_LINKER'
      });
    }
  }

  _extractReflectionCalls(testFileAbs, testCls) {
    // Extracts invokePrivateMethodOnMock(Class::class, $obj, 'method') / invokePrivateMethod(...)
    // and new ReflectionMethod(Class::class, 'method') per method line range.
    const byMethodName = new Map();
    if (!testFileAbs || !fs.existsSync(testFileAbs)) return byMethodName;
    const src = fs.readFileSync(testFileAbs, 'utf8');
    if (!/invokePrivateMethod|ReflectionMethod/.test(src)) return byMethodName;

    const lines = src.split(/\r?\n/);
    const invokeRe = /invokePrivateMethod(?:OnMock)?\s*\(\s*([A-Za-z0-9_\\]+)::class\s*,[^,]+,\s*['"]([A-Za-z0-9_]+)['"]/g;
    const reflRe = /ReflectionMethod\s*\(\s*([A-Za-z0-9_\\]+)::class\s*,\s*['"]([A-Za-z0-9_]+)['"]/g;

    for (const m of testCls.methods || []) {
      const slice = lines.slice(Math.max(0, (m.line_start || 1) - 1), m.line_end || lines.length).join('\n');
      const found = [];
      for (const re of [invokeRe, reflRe]) {
        re.lastIndex = 0;
        let match;
        while ((match = re.exec(slice)) !== null) {
          const shortOrFqcn = match[1].replace(/^\\+/, '');
          const fqcn = (testCls.useMap && testCls.useMap[shortOrFqcn]) ||
            (shortOrFqcn.includes('\\') ? shortOrFqcn : `${testCls.namespace}\\${shortOrFqcn}`);
          found.push({ targetFqcn: fqcn, methodName: match[2] });
        }
      }
      if (found.length) byMethodName.set(m.name, found);
    }
    return byMethodName;
  }

  _collectReachableTestMethods(testCls, entryMethod, maxDepth = 2) {
    const visited = new Set([entryMethod.name]);
    const queue = [{ method: entryMethod, depth: 0 }];
    const collected = [];

    while (queue.length > 0) {
      const { method, depth } = queue.shift();
      collected.push({ method, depth });
      if (depth >= maxDepth) continue;

      for (const call of method.rawCalls || []) {
        if ((call.kind === 'INSTANCE' && call.receiver?.kind === 'THIS') ||
            call.kind === 'SELF' || call.kind === 'STATIC_SELF') {
          const helperName = call.methodName;
          if (!helperName || visited.has(helperName) || helperName.startsWith('test')) continue;
          const helperMethod = (testCls.methods || []).find((m) => m.name === helperName);
          if (helperMethod) {
            visited.add(helperName);
            queue.push({ method: helperMethod, depth: depth + 1 });
          }
        }
      }
    }
    return collected;
  }

  _guessSutClassFqcns(testCls) {
    const candidates = new Set();
    const expectedShort = testCls.name.replace(/Test$/, '');
    // Check useMap & instantiations & partial mocks
    if (testCls.useMap && testCls.useMap[expectedShort]) {
      candidates.add(testCls.useMap[expectedShort]);
    }
    for (const m of testCls.methods || []) {
      for (const inst of m.instantiations || []) {
        if (inst.endsWith('\\' + expectedShort)) candidates.add(inst);
      }
      for (const mk of m.mockTargets || []) {
        if (mk.targetFqcn && mk.targetFqcn.endsWith('\\' + expectedShort)) {
          candidates.add(mk.targetFqcn);
        }
      }
      for (const rc of m.rawCalls || []) {
        if (rc.targetFqcn && rc.targetFqcn.endsWith('\\' + expectedShort)) {
          candidates.add(rc.targetFqcn);
        }
      }
    }
    for (const propFqcn of Object.values(testCls.property_types || {})) {
      if (propFqcn && propFqcn.endsWith('\\' + expectedShort)) candidates.add(propFqcn);
    }
    return candidates;
  }

  _findMatchingEndpoints(apiFqcn, apiMethodName) {
    const endpoints = this.endpointsByHandlerFqcn.get(apiFqcn) || [];
    const expectedHttp = API_METHOD_TO_HTTP[apiMethodName];
    if (!expectedHttp) return [];

    const httpMatches = endpoints.filter((ep) => ep.http_method === expectedHttp);
    if (httpMatches.length === 0) return [];

    if (apiMethodName === 'getAll') {
      const collectionEps = httpMatches.filter((ep) => !/\/\{[^}]+\}$/.test(ep.path));
      return collectionEps.length > 0 ? collectionEps : httpMatches;
    }
    if (apiMethodName === 'getOne') {
      const resourceEps = httpMatches.filter((ep) => /\/\{[^}]+\}$/.test(ep.path));
      return resourceEps.length > 0 ? resourceEps : httpMatches;
    }
    return httpMatches;
  }

  _resolveTestMethodLinks(testCls, testMethod, resolver, reflectionByMethod, sutFqcns) {
    const confirmedMap = new Map();
    const potentialMap = new Map();
    const apiEndpointLinks = [];

    // Helper: set of mocked collaborator classes inside this test
    const collaboratorMockTypes = new Set();
    const partialSutTypes = new Set();
    let expectsNotImplemented = false;

    // Step A — Tier 1: DocBlock @covers / @coversDefaultClass
    const allCovers = [...(testCls.classCovers || []), ...(testMethod.coversTags || [])];
    for (const tag of allCovers) {
      const cleaned = tag.replace(/\(\)\s*$/, '').trim();
      if (cleaned.includes('::')) {
        const [rawCls, rawMeth] = cleaned.split('::');
        const resolvedCls = this._resolveDocClass(rawCls, testCls);
        if (resolvedCls && rawMeth) {
          const targetMethod = this.prodResolver.findMethodInHierarchy(resolvedCls, rawMeth);
          if (this._isProductionMethod(targetMethod)) {
            this._recordConfirmedEdge(confirmedMap, targetMethod.signature, {
              tier: 1,
              confidence: 1.0,
              evidence_type: 'PHPDOC_COVERS'
            });
          }
        }
      } else if (testCls.coversDefaultFqcn) {
        const targetMethod = this.prodResolver.findMethodInHierarchy(testCls.coversDefaultFqcn, cleaned);
        if (this._isProductionMethod(targetMethod)) {
          this._recordConfirmedEdge(confirmedMap, targetMethod.signature, {
            tier: 1,
            confidence: 1.0,
            evidence_type: 'PHPDOC_COVERS_DEFAULT'
          });
        }
      }
    }

    // Step B — Traverse test method + up to 2 local helper methods (and setUp context)
    const reachable = this._collectReachableTestMethods(testCls, testMethod, 2);
    const setUpMethod = (testCls.methods || []).find((m) => m.name === 'setUp');
    if (setUpMethod && testMethod.name !== 'setUp') {
      reachable.push({ method: setUpMethod, depth: 1, isSetup: true });
    }

    for (const { method, isSetup } of reachable) {
      for (const mk of method.mockTargets || []) {
        if (!mk.targetFqcn || !this._isProductionClass(mk.targetFqcn)) continue;
        if (mk.isPartial || sutFqcns.has(mk.targetFqcn)) {
          partialSutTypes.add(mk.targetFqcn);
        } else {
          collaboratorMockTypes.add(mk.targetFqcn);
        }
      }

      // Reflection private method testing (e.g., invokePrivateMethodOnMock)
      const reflCalls = reflectionByMethod.get(method.name) || [];
      for (const rc of reflCalls) {
        const targetMethod = this.prodResolver.findMethodInHierarchy(rc.targetFqcn, rc.methodName);
        if (this._isProductionMethod(targetMethod)) {
          this._recordConfirmedEdge(confirmedMap, targetMethod.signature, {
            tier: 2,
            confidence: 0.85,
            evidence_type: 'PHPUNIT_REFLECTION_CALL'
          });
        }
      }

      for (const rawCall of method.rawCalls || []) {
        if (rawCall.methodName === 'expectNotImplementedException') {
          expectsNotImplemented = true;
        }
        if (MOCK_FRAMEWORK_METHODS.has(rawCall.methodName)) continue;

        if (rawCall.kind === 'API_MOCK' && rawCall.targetFqcn) {
          // Track API SUT class
          partialSutTypes.add(rawCall.targetFqcn);
          continue;
        }

        const resolved = resolver._resolveSingleCall(rawCall, testCls, method, new Set());
        if (resolved && resolved.resolution_status === 'RESOLVED' && this._isProductionMethod(resolved.targetMethod)) {
          const targetMethod = resolved.targetMethod;
          const targetClsFqcn = targetMethod.class_fqcn;
          const isSutTarget =
            sutFqcns.has(targetClsFqcn) ||
            partialSutTypes.has(targetClsFqcn) ||
            Object.values(testCls.property_types || {}).includes(targetClsFqcn);

          if (rawCall.isEndpointAssertion) {
            this._recordConfirmedEdge(confirmedMap, targetMethod.signature, {
              tier: 2,
              confidence: 0.9,
              evidence_type: 'ENDPOINT_INTEGRATION_ASSERT'
            });
            for (const ep of this._findMatchingEndpoints(targetClsFqcn, rawCall.methodName)) {
              apiEndpointLinks.push({
                endpoint_id: ep.endpoint_id,
                http_method: ep.http_method,
                api_class_fqcn: targetClsFqcn,
                confidence: 0.95,
                evidence_type: 'PHPUNIT_API_INTEGRATION'
              });
            }
          } else if (isSutTarget) {
            this._recordConfirmedEdge(confirmedMap, targetMethod.signature, {
              tier: 2,
              confidence: 0.85,
              evidence_type: 'PHPUNIT_SUT_CALL'
            });
            // Non-asserted direct API method invocation (e.g. unit test calling $api->getAll())
            if (!expectsNotImplemented && API_METHOD_TO_HTTP[rawCall.methodName] && this.endpointsByHandlerFqcn.has(targetClsFqcn)) {
              for (const ep of this._findMatchingEndpoints(targetClsFqcn, rawCall.methodName)) {
                apiEndpointLinks.push({
                  endpoint_id: ep.endpoint_id,
                  http_method: ep.http_method,
                  api_class_fqcn: targetClsFqcn,
                  confidence: 0.75,
                  evidence_type: 'PHPUNIT_API_UNIT_CALL'
                });
              }
            }
          } else {
            this._recordConfirmedEdge(confirmedMap, targetMethod.signature, {
              tier: 3,
              confidence: isSetup ? 0.65 : 0.7,
              evidence_type: 'AST_METHOD_CALL'
            });
          }
        }
      }
    }

    // Step C — Tier 4: POTENTIAL_COVERS via naming heuristic & mocked collaborators
    // ONLY when confirmedMap does NOT already contain that target signature!
    const strippedName = testMethod.name.replace(/^test/, '');
    if (strippedName.length > 0 && sutFqcns.size > 0) {
      const candidateMethodName = strippedName.charAt(0).toLowerCase() + strippedName.slice(1);
      for (const sutFqcn of sutFqcns) {
        const targetMethod = this.prodResolver.findMethodInHierarchy(sutFqcn, candidateMethodName);
        if (this._isProductionMethod(targetMethod) && !confirmedMap.has(targetMethod.signature)) {
          this._recordPotentialEdge(potentialMap, targetMethod.signature, {
            confidence: 0.3,
            evidence_type: 'TEST_NAME_HEURISTIC'
          });
        }
      }
    }

    // Collaborator mock hint: check any mocked production class public methods matching test name fragments
    for (const collabFqcn of collaboratorMockTypes) {
      const collabCls = this.prodResolver.typeByFqcn.get(collabFqcn);
      if (!collabCls) continue;
      for (const m of collabCls.methods || []) {
        if (m.visibility !== 'public' || m.name === '__construct') continue;
        if (strippedName.toLowerCase().includes(m.name.toLowerCase()) && !confirmedMap.has(m.signature)) {
          this._recordPotentialEdge(potentialMap, m.signature, {
            confidence: 0.2,
            evidence_type: 'COLLABORATOR_MOCK_HINT'
          });
        }
      }
    }

    // Auto-upgrade check: suppress any POTENTIAL_COVERS already confirmed in Tier 1-3
    let suppressedPotential = 0;
    for (const sig of confirmedMap.keys()) {
      if (potentialMap.delete(sig)) suppressedPotential++;
    }

    // Deduplicate apiEndpointLinks
    const epDedup = new Map();
    for (const link of apiEndpointLinks) {
      const prev = epDedup.get(link.endpoint_id);
      if (!prev || link.confidence > prev.confidence) epDedup.set(link.endpoint_id, link);
    }

    return {
      confirmed: [...confirmedMap.values()],
      potential: [...potentialMap.values()],
      endpoints: [...epDedup.values()],
      suppressedPotential
    };
  }

  _resolveDocClass(rawCls, testCls) {
    if (!rawCls) return null;
    const cleaned = rawCls.replace(/^\\+/, '');
    if (this.prodResolver.typeByFqcn.has(cleaned)) return cleaned;
    if (testCls.useMap && testCls.useMap[cleaned]) return testCls.useMap[cleaned];
    if (testCls.namespace) {
      const sameNs = `${testCls.namespace}\\${cleaned}`;
      if (this.prodResolver.typeByFqcn.has(sameNs)) return sameNs;
    }
    const matches = this.prodResolver.classesByShortName.get(cleaned) || [];
    return matches.length === 1 ? matches[0] : null;
  }

  _extractJestSpecs() {
    const specFiles = walkFiles(
      CLIENT_SRC_DIR,
      (name) => name.endsWith('.spec.ts') || name.endsWith('.spec.js')
    );
    const jestCases = [];
    const uiEdges = [];
    const suiteCount = new Map();

    for (const absFile of specFiles) {
      const relFile = toRepoRelPath(absFile);
      const plugin = extractPluginFromPath(relFile) || 'core';
      // Ensure NO synthetic Payroll Jest specs (though 0 exist on disk)
      const moduleName = this._pluginToModule(plugin);
      const suiteName = `Jest_${moduleName}_Unit_Suite`;
      const src = fs.readFileSync(absFile, 'utf8');

      // Extract relative imports -> resolve to core/helper .ts/.vue files in repo
      const importTargets = [];
      for (const m of src.matchAll(/import\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]/g)) {
        const specDir = path.dirname(absFile);
        const rawImp = m[1];
        if (!rawImp.startsWith('.')) continue;
        for (const ext of ['.ts', '.js', '.vue', '/index.ts']) {
          const candidate = path.resolve(specDir, rawImp + ext);
          if (fs.existsSync(candidate)) {
            importTargets.push(toRepoRelPath(candidate));
            break;
          }
        }
      }

      const baseName = path.basename(absFile).replace(/\.spec\.(ts|js)$/, '');
      const testRe = /\b(?:test|it)\s*\(\s*['"`]([^'"`]+)['"`]/g;
      let match;
      while ((match = testRe.exec(src)) !== null) {
        const caseName = match[1].trim();
        const canonicalId = buildCanonicalTestId(REPOS.APP, relFile, caseName);
        jestCases.push({
          canonical_id: canonicalId,
          testcase_id: canonicalId,
          legacy_ids: [],
          name: `${baseName} > ${caseName}`,
          class_fqcn: relFile,
          class_name: baseName,
          method_name: caseName,
          plugin,
          module: moduleName,
          suite: suiteName,
          file: relFile,
          line_start: src.slice(0, match.index).split(/\r?\n/).length,
          line_end: null,
          framework: 'Jest',
          test_level: 'Unit',
          origin: 'AST_JEST',
          requirement_ids: [],
          story_ids: [],
          rule_ids: []
        });
        suiteCount.set(suiteName, (suiteCount.get(suiteName) || 0) + 1);

        for (const targetRel of importTargets) {
          const fe = this.frontendByFile.get(targetRel);
          if (fe) {
            uiEdges.push({
              canonical_id: canonicalId,
              target_component_id: fe.component_id,
              target_file: targetRel,
              confidence: 0.9,
              evidence_type: 'JEST_IMPORT_TRACE'
            });
          }
        }
      }
    }

    return { specFiles, jestCases, uiEdges, suiteCount };
  }

  linkAll() {
    const baselineUnitLookup = this._loadBaselineUnitLookup();
    const payrollMetaLookup = this._loadPayrollUnitMetadataLookup();

    // Parse all PHP files under plugins/*/test so test base classes & traits resolve properly
    const pluginDirs = fs.existsSync(PLUGINS_DIR) ? fs.readdirSync(PLUGINS_DIR) : [];
    const testParsedFiles = [];
    const testAbsByRel = new Map();

    for (const pluginName of pluginDirs) {
      const testDir = path.join(PLUGINS_DIR, pluginName, 'test');
      const phpFiles = walkFiles(testDir, (name) => name.endsWith('.php'));
      for (const absFile of phpFiles) {
        const relFile = toRepoRelPath(absFile);
        testAbsByRel.set(relFile, absFile);
        const parsed = this.phpExtractor.parseFile(absFile, relFile);
        if (parsed) testParsedFiles.push(parsed);
      }
    }

    // Combined SymbolResolver containing production + test inheritance/helpers
    const SymbolResolver = require('./symbol_resolver');
    const combinedResolver = new SymbolResolver([...this.prodParsedFiles, ...testParsedFiles]);

    const suitesMap = new Map();
    const testCases = [];
    const testsEdges = [];
    const potentialCoversEdges = [];
    const executesAgainstEdges = [];

    let matchedLegacyUnitIds = 0;
    let matchedPayrollMetadata = 0;
    let suppressedPotential = 0;
    let phpTestClassFiles = 0;

    for (const pf of testParsedFiles) {
      const relFile = pf.file;
      if (!relFile.endsWith('Test.php')) continue;
      phpTestClassFiles++;

      const plugin = extractPluginFromPath(relFile) || 'orangehrmCorePlugin';
      const moduleName = this._pluginToModule(plugin);
      const suiteName = `${moduleName}_PHPUnit_Suite`;

      const absFile = testAbsByRel.get(relFile);

      for (const testCls of pf.classes || []) {
        if (testCls.isAbstract) continue;

        const sutFqcns = this._guessSutClassFqcns(testCls);
        const reflectionByMethod = this._extractReflectionCalls(absFile, testCls);

        for (const testMethod of testCls.methods || []) {
          if (testMethod.visibility !== 'public' || !testMethod.name.startsWith('test')) continue;

          const canonicalId = buildCanonicalTestId(REPOS.APP, testCls.fqcn, testMethod.name);
          const displayName = `${testCls.name}::${testMethod.name}`;

          const baselineMatch = baselineUnitLookup.get(`${relFile}::${testMethod.name}`);
          const payrollMatch = plugin === 'orangehrmPayrollPlugin' ? payrollMetaLookup.get(displayName) : null;

          let testcaseId = canonicalId;
          const legacyIds = [];
          let testLevel = 'Unit';
          let reqIds = [];
          let storyIds = [];
          let ruleIds = [];

          if (baselineMatch) {
            testcaseId = baselineMatch.testcase_id;
            legacyIds.push(baselineMatch.testcase_id);
            testLevel = baselineMatch.test_level || 'Unit';
            matchedLegacyUnitIds++;
          } else if (payrollMatch) {
            // IMPORTANT: Payroll testcase_id MUST remain canonicalId (never TC_PAY_*)
            // to guarantee 0 manifest-only TC_PAY_* nodes while preserving legacy traceability
            legacyIds.push(payrollMatch.testcase_id);
            testLevel = payrollMatch.layer && payrollMatch.layer.includes('Integration') ? 'Integration' : (payrollMatch.test_level || 'Unit');
            reqIds = payrollMatch.requirement_ids || [];
            storyIds = payrollMatch.story_ids || [];
            ruleIds = payrollMatch.rule_ids || [];
            matchedPayrollMetadata++;
          }

          testCases.push({
            canonical_id: canonicalId,
            testcase_id: testcaseId,
            legacy_ids: legacyIds,
            name: displayName,
            class_fqcn: testCls.fqcn,
            class_name: testCls.name,
            method_name: testMethod.name,
            plugin,
            module: moduleName,
            suite: suiteName,
            file: relFile,
            line_start: testMethod.line_start,
            line_end: testMethod.line_end,
            framework: 'PHPUnit',
            test_level: testLevel,
            origin: 'AST_PHPUNIT',
            requirement_ids: reqIds,
            story_ids: storyIds,
            rule_ids: ruleIds
          });

          if (!suitesMap.has(suiteName)) {
            suitesMap.set(suiteName, {
              suite_id: suiteName,
              name: suiteName,
              plugin,
              module: moduleName,
              framework: 'PHPUnit',
              repo: REPOS.APP,
              test_count: 0
            });
          }
          suitesMap.get(suiteName).test_count++;

          const resolved = this._resolveTestMethodLinks(
            testCls,
            testMethod,
            combinedResolver,
            reflectionByMethod,
            sutFqcns
          );
          suppressedPotential += resolved.suppressedPotential;

          for (const edge of resolved.confirmed) {
            testsEdges.push({ canonical_id: canonicalId, ...edge });
          }
          for (const edge of resolved.potential) {
            potentialCoversEdges.push({ canonical_id: canonicalId, ...edge });
          }
          for (const epEdge of resolved.endpoints) {
            executesAgainstEdges.push({ canonical_id: canonicalId, ...epEdge });
          }
        }
      }
    }

    const jest = this._extractJestSpecs();
    for (const jc of jest.jestCases) {
      testCases.push(jc);
      if (!suitesMap.has(jc.suite)) {
        suitesMap.set(jc.suite, {
          suite_id: jc.suite,
          name: jc.suite,
          plugin: jc.plugin,
          module: jc.module,
          framework: 'Jest',
          repo: REPOS.APP,
          test_count: 0
        });
      }
      suitesMap.get(jc.suite).test_count++;
    }

    return {
      suites: [...suitesMap.values()],
      testCases,
      testsEdges,
      potentialCoversEdges,
      executesAgainstEdges,
      uiComponentEdges: jest.uiEdges,
      diagnostics: {
        phpTestClassFiles,
        phpTestCases: testCases.length - jest.jestCases.length,
        jestSpecFiles: jest.specFiles.length,
        jestTestCases: jest.jestCases.length,
        matchedLegacyUnitIds,
        matchedPayrollMetadata,
        confirmedTestsEdges: testsEdges.length,
        potentialCoversEdges: potentialCoversEdges.length,
        upgradedSuppressedPotential: suppressedPotential,
        executesAgainstEdges: executesAgainstEdges.length,
        uiComponentEdges: jest.uiEdges.length
      }
    };
  }
}

module.exports = TestLinker;
