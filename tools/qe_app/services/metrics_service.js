const neo4j = require('neo4j-driver');
const neo4jService = require('./neo4j_service');

function pluginToModuleName(pluginName) {
  if (!pluginName) return 'Core';
  if (pluginName === 'core') return 'Core';
  const m = String(pluginName).match(/^orangehrm(.+)Plugin$/);
  if (!m) return pluginName;
  const raw = m[1];
  if (raw.toLowerCase() === 'pim') return 'PIM';
  if (raw.toLowerCase() === 'ldapauthentication') return 'LDAP';
  return raw;
}

class MetricsService {
  async getExecutiveQualityMetrics() {
    try {
      const [
        snapshot,
        testCounts,
        layerCounts,
        pluginStats,
        runSummary,
        coverageSummary,
        reqSummary,
        mappingSummary,
        flakeSummary
      ] = await Promise.all([
        neo4jService.getLatestSnapshot(),
        neo4jService.runQuery(`
          MATCH (tc:TestCase)
          RETURN count(CASE WHEN coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST' THEN 1 END) AS codeTests,
                 count(CASE WHEN tc.origin = 'BASELINE_MANIFEST' THEN 1 END) AS baselineTests
        `),
        neo4jService.runQuery(`
          MATCH (tc:TestCase)
          WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
          WITH tc,
               EXISTS { MATCH (tc)-[:EXECUTES_AGAINST]->(:ApiEndpoint) } AS hitsApi,
               EXISTS { MATCH (tc)-[:TESTS_COMPONENT]->(:UIComponent) } AS hitsUi,
               EXISTS { MATCH (tc)-[:TESTS]->(:Method)<-[:DECLARES]-(c:Class) WHERE c.fqcn CONTAINS $daoToken } AS hitsDao
          RETURN
            count(CASE WHEN hitsApi THEN 1 END) AS apiTests,
            count(CASE WHEN NOT hitsApi AND hitsUi THEN 1 END) AS uiTests,
            count(CASE WHEN NOT hitsApi AND NOT hitsUi AND hitsDao THEN 1 END) AS dbTests,
            count(CASE WHEN NOT hitsApi AND NOT hitsUi AND NOT hitsDao AND coalesce(tc.test_level, tc.level) IN ['Integration', 'Functional'] THEN 1 END) AS funcTests,
            count(CASE WHEN NOT hitsApi AND NOT hitsUi AND NOT hitsDao AND NOT (coalesce(tc.test_level, tc.level) IN ['Integration', 'Functional']) THEN 1 END) AS unitTests
        `, { daoToken: '\\Dao\\' }),
        neo4jService.runQuery(`
          CALL {
            MATCH (cr:CoverageRun)
            WITH coalesce(cr.framework, 'phpunit') + '::' + coalesce(cr.suite_scope, 'all') AS bucket, cr
            ORDER BY coalesce(cr.generated_at, cr.ingested_at) DESC, coalesce(cr.ingested_at, '') DESC, cr.run_id DESC
            WITH bucket, collect(cr)[0] AS latestCr
            RETURN collect(latestCr) AS latestCovRuns
          }
          MATCH (p:Plugin)
          CALL {
            WITH p
            OPTIONAL MATCH (p)-[:HAS_TEST_SUITE]->(:TestSuite)-[:CONTAINS_TEST]->(tc:TestCase)
            WHERE tc IS NULL OR coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
            RETURN count(DISTINCT tc) AS codeTestCount
          }
          CALL {
            WITH p
            OPTIONAL MATCH (p)-[:DECLARES]->(c:Class)
            OPTIONAL MATCH (c)-[:DECLARES]->(m:Method)
            RETURN count(DISTINCT c) AS classCount,
                   count(DISTINCT m) AS totalMethods,
                   count(DISTINCT CASE WHEN EXISTS {
                     MATCH (m)<-[tr:TESTS]-(tc:TestCase)
                     WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
                       AND coalesce(tr.confidence, 0.7) >= 0.5
                   } THEN m END) AS mappedMethods
          }
          CALL {
            WITH p, latestCovRuns
            UNWIND (CASE WHEN size(latestCovRuns) > 0 THEN latestCovRuns ELSE [null] END) AS cr
            OPTIONAL MATCH (cr)-[:HAS_OBSERVATION]->(obsB:CoverageObservation)-[:COVERED_IN]->(mb:Method)<-[:DECLARES]-(:Class { plugin: p.name })
            WITH p, mb, max(coalesce(obsB.lines_covered, 0)) AS mCov, max(coalesce(obsB.lines_total, 0)) AS mTot
            RETURN coalesce(sum(mCov), 0) AS beCov,
                   coalesce(sum(mTot), 0) AS beTot
          }
          CALL {
            WITH p, latestCovRuns
            UNWIND (CASE WHEN size(latestCovRuns) > 0 THEN latestCovRuns ELSE [null] END) AS cr
            OPTIONAL MATCH (cr)-[:HAS_OBSERVATION]->(obsF:CoverageObservation)-[:COVERED_COMPONENT_IN]->(ui:UIComponent { plugin: p.name })
            WITH p, ui, max(coalesce(obsF.lines_covered, 0)) AS fCov, max(coalesce(obsF.lines_total, 0)) AS fTot
            RETURN coalesce(sum(fCov), 0) AS feCov,
                   coalesce(sum(fTot), 0) AS feTot
          }
          RETURN p.name AS plugin,
                 codeTestCount,
                 classCount,
                 totalMethods,
                 mappedMethods,
                 (beCov + feCov) AS linesCovered,
                 (beTot + feTot) AS linesTotal
          ORDER BY codeTestCount DESC, p.name ASC
        `),
        neo4jService.runQuery(`
          MATCH (tr:TestRun)
          WITH coalesce(tr.framework, 'unknown') + '::' + coalesce(tr.suite_scope, 'all') AS bucket, tr
          ORDER BY coalesce(tr.executed_at, tr.ingested_at) DESC
          WITH bucket, collect(tr)[0] AS latestTr
          RETURN latestTr.run_id AS runId,
                 latestTr.executed_at AS executedAt,
                 latestTr.passed AS passed,
                 latestTr.failed AS failed,
                 latestTr.skipped AS skipped,
                 coalesce(latestTr.cancelled, 0) AS cancelled,
                 coalesce(latestTr.flaky, 0) AS flaky,
                 latestTr.framework AS framework,
                 latestTr.suite_scope AS suiteScope,
                 latestTr.app_commit AS appCommit,
                 latestTr.source AS source
          ORDER BY executedAt DESC
        `),
        neo4jService.runQuery(`
          MATCH (cr:CoverageRun)
          WITH coalesce(cr.framework, 'phpunit') + '::' + coalesce(cr.suite_scope, 'all') AS bucket, cr
          ORDER BY coalesce(cr.generated_at, cr.ingested_at) DESC, coalesce(cr.ingested_at, '') DESC, cr.run_id DESC
          WITH bucket, collect(cr)[0] AS latestCr
          OPTIONAL MATCH (latestCr)-[:HAS_OBSERVATION]->(obs:CoverageObservation)
          WITH latestCr,
               sum(CASE WHEN obs.target_type = 'Method' THEN coalesce(obs.lines_covered, 0) ELSE 0 END) AS backendCovered,
               sum(CASE WHEN obs.target_type = 'Method' THEN coalesce(obs.lines_total, 0) ELSE 0 END) AS backendTotal,
               sum(CASE WHEN obs.target_type = 'UIComponent' THEN coalesce(obs.lines_covered, 0) ELSE 0 END) AS frontendCovered,
               sum(CASE WHEN obs.target_type = 'UIComponent' THEN coalesce(obs.lines_total, 0) ELSE 0 END) AS frontendTotal
          RETURN latestCr.run_id AS runId,
                 latestCr.framework AS framework,
                 latestCr.suite_scope AS suiteScope,
                 latestCr.generated_at AS generatedAt,
                 latestCr.lines_covered AS linesCovered,
                 latestCr.lines_valid AS linesValid,
                 latestCr.line_rate AS lineRate,
                 latestCr.app_commit AS appCommit,
                 backendCovered, backendTotal,
                 frontendCovered, frontendTotal
          ORDER BY generatedAt DESC
        `),
        neo4jService.runQuery(`
          MATCH (r:Requirement)
          RETURN count(DISTINCT r) AS totalRequirements,
                 count(DISTINCT CASE WHEN EXISTS {
                   MATCH (tc:TestCase)-[:VERIFIES]->(r)
                   WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
                 } THEN r END) AS coveredByCodeTests,
                 count(DISTINCT CASE WHEN EXISTS {
                   MATCH (tc:TestCase)-[:PLANNED_VERIFICATION]->(r)
                   WHERE tc.origin = 'BASELINE_MANIFEST'
                 } THEN r END) AS coveredByPlannedBacklog
        `),
        neo4jService.runQuery(`
          CALL {
            MATCH (m:Method)<-[:DECLARES]-(:Class)
            RETURN count(DISTINCT m) AS totalMethods,
                   count(DISTINCT CASE WHEN EXISTS {
                     MATCH (m)<-[r:TESTS]-(tc:TestCase)
                     WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST' AND coalesce(r.confidence, 0.7) >= 0.5
                   } THEN m END) AS mappedMethods
          }
          CALL {
            MATCH (ep:ApiEndpoint)
            RETURN count(DISTINCT ep) AS totalEndpoints,
                   count(DISTINCT CASE WHEN EXISTS {
                     MATCH (ep)<-[:EXECUTES_AGAINST]-(tc:TestCase)
                     WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
                   } THEN ep END) AS mappedEndpoints
          }
          CALL {
            MATCH (ui:UIComponent)
            RETURN count(DISTINCT ui) AS totalUiComponents,
                   count(DISTINCT CASE WHEN EXISTS {
                     MATCH (ui)<-[:TESTS_COMPONENT]-(tc:TestCase)
                     WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
                   } THEN ui END) AS mappedUiComponents
          }
          RETURN totalMethods, mappedMethods, totalEndpoints, mappedEndpoints, totalUiComponents, mappedUiComponents
        `),
        neo4jService.runQuery(`
          MATCH (tr:TestRun)-[:HAS_EXECUTION]->(te:TestExecution)
          WITH tr, te ORDER BY coalesce(tr.executed_at, tr.ingested_at) DESC
          WITH te, coalesce(te.testcase_id, te.raw_name) AS tid
          WITH tid,
               collect(te.status)[..10] AS statuses,
               any(x IN collect(coalesce(te.flaky, false)) WHERE x = true) AS hadRetryFlake,
               count(te) AS execCount
          RETURN count(tid) AS distinctExecutedTests,
                 sum(execCount) AS totalRecentExecs,
                 count(CASE WHEN hadRetryFlake OR ('PASSED' IN statuses AND any(s IN statuses WHERE s IN ['FAILED', 'ERROR'])) THEN 1 END) AS flakyTestCount
        `)
      ]);

      const tcRow = testCounts[0] || {};
      const totalVerifiedTests = Number(tcRow.codeTests || 0);
      const baselineBacklogTests = Number(tcRow.baselineTests || 0);

      const lc = layerCounts[0] || {};
      const layerDefs = [
        { layer: 'Unit / Calculation Tests', count: Number(lc.unitTests || 0) },
        { layer: 'API / Contract Tests', count: Number(lc.apiTests || 0) },
        { layer: 'Functional & Workflow Tests', count: Number(lc.funcTests || 0) },
        { layer: 'Database & Referential Integrity', count: Number(lc.dbTests || 0) },
        { layer: 'UI & Vue Component Validation', count: Number(lc.uiTests || 0) }
      ].map((item) => ({
        ...item,
        percent: totalVerifiedTests > 0 ? Number(((item.count / totalVerifiedTests) * 100).toFixed(1)) : 0
      }));

      const latestRun = runSummary[0] || null;
      const latestCov = coverageSummary[0] || null;

      let passRate = 'N/A';
      let qualityGateStatus = 'NO_CI_RUN';
      if (runSummary.length > 0) {
        const totalPassed = runSummary.reduce((a, r) => a + Number(r.passed || 0), 0);
        const totalFailed = runSummary.reduce((a, r) => a + Number(r.failed || 0), 0);
        const tot = totalPassed + totalFailed;
        passRate = tot > 0 ? `${((totalPassed / tot) * 100).toFixed(1)}%` : '0.0%';
        qualityGateStatus = totalFailed === 0 && tot > 0 ? 'PASS' : 'FAIL';
      }

      const flakeRow = flakeSummary[0] || {};
      const distinctExecutedTests = Number(flakeRow.distinctExecutedTests || 0);
      const flakyTestCount = Number(flakeRow.flakyTestCount || 0);
      const flakyRate = runSummary.length > 0 && distinctExecutedTests > 0
        ? `${((flakyTestCount / distinctExecutedTests) * 100).toFixed(1)}%`
        : 'N/A';

      // Latest-run scoped Runtime Line Coverage across latest (framework, suite_scope) buckets
      const totalCovCovered = coverageSummary.reduce((a, r) => a + Number(r.linesCovered || 0), 0);
      const totalCovValid = coverageSummary.reduce((a, r) => a + Number(r.linesValid || 0), 0);
      const backendCov = coverageSummary.reduce((a, r) => a + Number(r.backendCovered || 0), 0);
      const backendTot = coverageSummary.reduce((a, r) => a + Number(r.backendTotal || 0), 0);
      const frontendCov = coverageSummary.reduce((a, r) => a + Number(r.frontendCovered || 0), 0);
      const frontendTot = coverageSummary.reduce((a, r) => a + Number(r.frontendTotal || 0), 0);
      const lineCoveragePercent = totalCovValid > 0
        ? Number(((totalCovCovered / totalCovValid) * 100).toFixed(1))
        : null;

      const modules = pluginStats
        .filter((r) => Number(r.codeTestCount) > 0 || Number(r.classCount) > 0)
        .map((r) => {
          const lt = Number(r.linesTotal || 0);
          const lcov = Number(r.linesCovered || 0);
          const covPct = lt > 0 ? Number(((lcov / lt) * 100).toFixed(1)) : null;
          const totalMethods = Number(r.totalMethods || 0);
          const mappedMethods = Number(r.mappedMethods || 0);
          return {
            module: pluginToModuleName(r.plugin),
            plugin: r.plugin,
            tests: Number(r.codeTestCount || 0),
            scenarios: Number(r.codeTestCount || 0),
            classes: Number(r.classCount || 0),
            totalMethods,
            mappedMethods,
            mappingCoveragePct: totalMethods > 0 ? Number(((mappedMethods / totalMethods) * 100).toFixed(1)) : null,
            coverage: covPct,
            coverageMeasured: lt > 0,
            linesCovered: lcov,
            linesTotal: lt,
            status: Number(r.codeTestCount || 0) > 0 ? 'ACTIVE' : 'UNCOVERED'
          };
        });

      const reqRow = reqSummary[0] || {};
      const totalRequirements = Number(reqRow.totalRequirements || 0);
      const coveredRequirements = Number(reqRow.coveredByCodeTests || 0);
      const plannedBacklogRequirements = Number(reqRow.coveredByPlannedBacklog || 0);
      const reqCodePct = totalRequirements > 0 ? Number(((coveredRequirements / totalRequirements) * 100).toFixed(1)) : 0;
      const reqPlannedPct = totalRequirements > 0 ? Number(((plannedBacklogRequirements / totalRequirements) * 100).toFixed(1)) : 0;

      const mapRow = mappingSummary[0] || {};
      const totalMethods = Number(mapRow.totalMethods || 0);
      const mappedMethods = Number(mapRow.mappedMethods || 0);
      const totalEndpoints = Number(mapRow.totalEndpoints || 0);
      const mappedEndpoints = Number(mapRow.mappedEndpoints || 0);
      const totalUiComponents = Number(mapRow.totalUiComponents || 0);
      const mappedUiComponents = Number(mapRow.mappedUiComponents || 0);
      const mappingTotal = totalMethods + totalEndpoints + totalUiComponents;
      const mappingCovered = mappedMethods + mappedEndpoints + mappedUiComponents;
      const mappingCoveragePercent = mappingTotal > 0 ? Number(((mappingCovered / mappingTotal) * 100).toFixed(1)) : null;

      return {
        status: 'CONNECTED',
        snapshot,
        overview: {
          applicationBaseline: snapshot ? `${snapshot.branch} (${String(snapshot.appCommit || '').slice(0, 8)})` : 'OrangeHRM QKG',
          qkgPlatformVersion: '2.1.0',
          graphSchemaVersion: snapshot?.schemaVersion || '2.2',
          qualityGateStatus,
          passRate,
          totalVerifiedTests,
          baselineBacklogTests,
          totalLogicalScenarios: totalVerifiedTests + baselineBacklogTests,
          flakyRate,
          flakyTestCount,
          lineCoveragePercent,
          mappingCoveragePercent,
          coverageStatus: totalCovValid > 0 ? 'MEASURED' : 'NOT_INGESTED_YET',
          executionHistoryStatus: runSummary.length > 0 ? 'INGESTED' : 'NO_RUNS_INGESTED',
          lastRunDate: latestRun?.executedAt || snapshot?.publishedAt || null
        },
        coverageDimensions: {
          mapping: {
            totalMethods,
            mappedMethods,
            methodMappingPct: totalMethods > 0 ? Number(((mappedMethods / totalMethods) * 100).toFixed(1)) : null,
            totalEndpoints,
            mappedEndpoints,
            endpointMappingPct: totalEndpoints > 0 ? Number(((mappedEndpoints / totalEndpoints) * 100).toFixed(1)) : null,
            totalUiComponents,
            mappedUiComponents,
            uiMappingPct: totalUiComponents > 0 ? Number(((mappedUiComponents / totalUiComponents) * 100).toFixed(1)) : null,
            overallMappingPct: mappingCoveragePercent
          },
          runtime: {
            status: totalCovValid > 0 ? 'MEASURED' : 'NOT_INGESTED_YET',
            activeRunCount: coverageSummary.length,
            lineCoveragePct: lineCoveragePercent,
            linesCovered: totalCovCovered,
            linesTotal: totalCovValid,
            backendLineCoveragePct: backendTot > 0 ? Number(((backendCov / backendTot) * 100).toFixed(1)) : null,
            frontendLineCoveragePct: frontendTot > 0 ? Number(((frontendCov / frontendTot) * 100).toFixed(1)) : null
          },
          requirementTraceability: {
            totalRequirements,
            coveredByCodeTests: coveredRequirements,
            codeCoveragePct: reqCodePct,
            coveredByPlannedBacklog: plannedBacklogRequirements,
            plannedCoveragePct: reqPlannedPct,
            uncoveredGaps: Math.max(0, totalRequirements - coveredRequirements)
          }
        },
        layers: layerDefs,
        modules,
        latestCoverageRun: latestCov,
        latestCoverageRuns: coverageSummary,
        latestTestRun: latestRun,
        latestTestRuns: runSummary,
        traceability: {
          totalRequirements,
          coveredRequirements,
          plannedBacklogRequirements,
          coveragePercentage: reqCodePct,
          plannedCoveragePercentage: reqPlannedPct,
          uncoveredGaps: Math.max(0, totalRequirements - coveredRequirements)
        }
      };
    } catch (err) {
      return {
        status: 'UNAVAILABLE',
        error: err.message,
        overview: {
          qualityGateStatus: 'UNAVAILABLE',
          passRate: 'N/A',
          totalVerifiedTests: 0,
          totalLogicalScenarios: 0,
          lineCoveragePercent: null,
          coverageStatus: 'UNAVAILABLE'
        },
        layers: [],
        modules: [],
        traceability: { totalRequirements: 0, coveredRequirements: 0, coveragePercentage: 0, uncoveredGaps: 0 }
      };
    }
  }

  async getTestCatalogue(page = 1, limit = 50, moduleFilter = '', layerFilter = '', search = '', includeBaseline = false) {
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.max(1, Math.min(200, parseInt(limit, 10) || 50));
    const skip = (safePage - 1) * safeLimit;

    const whereClauses = [];
    if (!includeBaseline) {
      whereClauses.push("coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'");
    }
    const params = {
      skip: neo4j.int(skip),
      limit: neo4j.int(safeLimit)
    };

    if (moduleFilter) {
      whereClauses.push('(toLower(coalesce(tc.plugin, tc.module, "")) CONTAINS toLower($moduleFilter))');
      params.moduleFilter = moduleFilter;
    }
    if (layerFilter) {
      if (layerFilter.toLowerCase().includes('api')) {
        whereClauses.push('EXISTS { MATCH (tc)-[:EXECUTES_AGAINST]->(:ApiEndpoint) }');
      } else if (layerFilter.toLowerCase().includes('ui')) {
        whereClauses.push('EXISTS { MATCH (tc)-[:TESTS_COMPONENT]->(:UIComponent) }');
      } else if (layerFilter.toLowerCase().includes('database')) {
        whereClauses.push('EXISTS { MATCH (tc)-[:TESTS]->(:Method)<-[:DECLARES]-(c:Class) WHERE c.fqcn CONTAINS $daoToken }');
        params.daoToken = '\\Dao\\';
      } else {
        whereClauses.push('(toLower(coalesce(tc.test_level, tc.level, "unit")) CONTAINS toLower($layerFilter))');
        params.layerFilter = layerFilter;
      }
    }
    if (search) {
      whereClauses.push('(toLower(coalesce(tc.name, "")) CONTAINS toLower($search) OR toLower(coalesce(tc.testcase_id, tc.canonical_id, "")) CONTAINS toLower($search) OR toLower(coalesce(tc.suite, "")) CONTAINS toLower($search))');
      params.search = search;
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const [countRes, rows, grandRes] = await Promise.all([
      neo4jService.runQuery(`MATCH (tc:TestCase) ${whereSql} RETURN count(tc) AS total`, params),
      neo4jService.runQuery(`
        MATCH (tc:TestCase)
        ${whereSql}
        OPTIONAL MATCH (tc)<-[:EXECUTED_TEST]-(te:TestExecution)
        WITH tc, te ORDER BY te.executed_at DESC
        WITH tc, collect(te)[0] AS lastExec
        RETURN coalesce(tc.testcase_id, tc.canonical_id) AS id,
               tc.canonical_id AS canonicalId,
               tc.name AS name,
               tc.suite AS suite,
               coalesce(tc.test_level, tc.level, 'Unit') AS layer,
               coalesce(tc.plugin, tc.module, 'Core') AS plugin,
               tc.framework AS framework,
               tc.origin AS origin,
               tc.file AS file,
               coalesce(lastExec.status, 'DISCOVERED') AS status,
               lastExec.duration_ms AS durationMs
        ORDER BY plugin, suite, id
        SKIP $skip LIMIT $limit
      `, params),
      neo4jService.runQuery(`
        MATCH (tc:TestCase)
        WHERE coalesce(tc.origin, 'AST_DEV_SUITE') <> 'BASELINE_MANIFEST'
        RETURN count(tc) AS grandTotal
      `)
    ]);

    const totalTests = Number(countRes[0]?.total || 0);
    const grandTotalCatalogue = Number(grandRes[0]?.grandTotal || 0);

    return {
      totalTests,
      grandTotalCatalogue,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(totalTests / safeLimit)),
      tests: rows.map((r) => ({
        ...r,
        module: pluginToModuleName(r.plugin),
        priority: r.layer === 'API' || r.layer === 'Unit' ? 'P1' : 'P2'
      }))
    };
  }
}

module.exports = new MetricsService();
module.exports.MetricsService = MetricsService;
module.exports.pluginToModuleName = pluginToModuleName;
