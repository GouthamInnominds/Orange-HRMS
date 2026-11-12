/**
 * Clover XML Code Coverage Ingestion Engine (PHPUnit PCOV + Jest Clover)
 *
 * Parses PHPUnit / Jest Clover XML coverage reports and stores immutable,
 * provenance-tracked CoverageRun & CoverageObservation nodes linked to
 * Method nodes (COVERED_IN) and UIComponent nodes (COVERED_COMPONENT_IN).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
try {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
} catch (_) {}

const neo4j = require('neo4j-driver');
const { WORKSPACE_ROOT, toRepoRelPath } = require('./qkg_config');

function normalizeCloverPath(rawPath) {
  const clean = String(rawPath || '').replace(/\\/g, '/').trim();
  const idx = clean.indexOf('orange_hrm/');
  if (idx !== -1) return clean.slice(idx);
  return toRepoRelPath(clean);
}

function parseXmlAttributes(attrStr) {
  const attrs = {};
  const re = /([A-Za-z_][A-Za-z0-9_:-]*)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(attrStr)) !== null) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

/**
 * Parses a Clover XML string into normalized file/line/method coverage records.
 */
function parseCloverXml(xmlText, options = {}) {
  const sha256 = crypto.createHash('sha256').update(xmlText).digest('hex');
  const projectMatch = xmlText.match(/<coverage([^>]*)>[\s\S]*?<project([^>]*)>/);
  const coverageAttrs = projectMatch ? parseXmlAttributes(projectMatch[1]) : {};
  const rawGen = coverageAttrs.generated ? Number(coverageAttrs.generated) : NaN;
  const generatedTs = Number.isFinite(rawGen)
    ? new Date(rawGen > 1e12 ? rawGen : rawGen * 1000).toISOString()
    : new Date().toISOString();

  // Handle BOTH Jest Clover (<project><metrics files="..."/> first) & PHPUnit Clover (<metrics/> at project end)
  let totalStatements = 0;
  let coveredStatements = 0;
  const projectBodyMatch = xmlText.match(/<project[^>]*>([\s\S]*?)<\/project>/);
  if (projectBodyMatch) {
    const projectBody = projectBodyMatch[1];
    const directFirst = projectBody.match(/^\s*<metrics\s+([^>]*?)\/>/);
    const directLast = projectBody.match(/<metrics\s+([^>]*?)\/>\s*$/);
    const chosen = directLast || directFirst;
    if (chosen) {
      const mAttrs = parseXmlAttributes(chosen[1]);
      totalStatements = Number(mAttrs.statements || 0);
      coveredStatements = Number(mAttrs.coveredstatements || 0);
    }
  }

  const files = [];
  const fileBlockRegex = /<file\s+([^>]*?)>([\s\S]*?)<\/file>/g;
  let fileMatch;
  while ((fileMatch = fileBlockRegex.exec(xmlText)) !== null) {
    const fileAttrs = parseXmlAttributes(fileMatch[1]);
    const body = fileMatch[2];
    // Jest puts full file path in `path` and basename in `name`; PHPUnit puts path in `name`.
    const relPath = normalizeCloverPath(fileAttrs.path || fileAttrs.name || '');
    if (!relPath) continue;

    const classes = [];
    const classRegex = /<class\s+([^>]*?)>([\s\S]*?)<\/class>/g;
    let clsMatch;
    while ((clsMatch = classRegex.exec(body)) !== null) {
      const clsAttrs = parseXmlAttributes(clsMatch[1]);
      const clsMetricsM = clsMatch[2].match(/<metrics\s+([^>]*?)\/>/);
      const clsMetrics = clsMetricsM ? parseXmlAttributes(clsMetricsM[1]) : {};
      classes.push({
        name: clsAttrs.name || null,
        namespace: (clsAttrs.namespace || '').replace(/^\\+/, ''),
        statements: Number(clsMetrics.statements || 0),
        coveredStatements: Number(clsMetrics.coveredstatements || 0)
      });
    }

    const lines = [];
    const lineRegex = /<line\s+([^>]*?)\/>/g;
    let lineMatch;
    while ((lineMatch = lineRegex.exec(body)) !== null) {
      const la = parseXmlAttributes(lineMatch[1]);
      lines.push({
        num: Number(la.num || 0),
        type: la.type || 'stmt',
        name: la.name || null,
        count: Number(la.count || 0)
      });
    }

    // File-level statement totals (directly supports Jest .ts / .vue UIComponents)
    const fileMetricsM = body.match(/<metrics\s+([^>]*?)\/>/);
    const fileMetrics = fileMetricsM ? parseXmlAttributes(fileMetricsM[1]) : {};
    let fileLinesTotal = Number(fileMetrics.statements || 0);
    let fileLinesCovered = Number(fileMetrics.coveredstatements || 0);
    if (fileLinesTotal === 0 && lines.length > 0) {
      for (const l of lines) {
        if (l.type === 'stmt') {
          fileLinesTotal++;
          if (l.count > 0) fileLinesCovered++;
        }
      }
    }

    files.push({
      file: relPath,
      classes,
      lines,
      linesValid: fileLinesTotal,
      linesCovered: fileLinesCovered,
      lineCoveragePct: fileLinesTotal > 0 ? Number(((fileLinesCovered / fileLinesTotal) * 100).toFixed(2)) : null
    });
  }

  // Recompute totals cleanly if summary tag was missing or partial
  if (totalStatements === 0 && files.length > 0) {
    for (const f of files) {
      totalStatements += f.linesValid;
      coveredStatements += f.linesCovered;
    }
  }

  const detectedFramework = options.framework
    ? String(options.framework).toLowerCase()
    : (files.some((f) => /\.(?:ts|tsx|js|vue)$/i.test(f.file)) ? 'jest' : 'phpunit');

  return {
    artifactSha256: sha256,
    framework: detectedFramework,
    generatedAt: options.generatedAt || generatedTs,
    linesValid: totalStatements,
    linesCovered: coveredStatements,
    lineRate: totalStatements > 0 ? Number((coveredStatements / totalStatements).toFixed(4)) : null,
    files
  };
}

/**
 * Maps parsed Clover file line coverage onto AST Method ranges [{ signature, line_start, line_end }].
 * Returns lineCoveragePct = null when linesTotal === 0 (avoids fake 0% or 100%).
 */
function aggregateMethodCoverage(fileRecord, methods = []) {
  const stmtLines = (fileRecord.lines || []).filter((l) => l.type === 'stmt');
  const methodEntries = (fileRecord.lines || []).filter((l) => l.type === 'method' && l.name);
  const methodHitsByName = new Map(methodEntries.map((m) => [m.name, m.count]));

  const observations = [];
  for (const m of methods) {
    const start = Number(m.line_start || 0);
    const end = Number(m.line_end || 0);
    let linesTotal = 0;
    let linesCovered = 0;

    if (start > 0 && end >= start) {
      for (const l of stmtLines) {
        if (l.num >= start && l.num <= end) {
          linesTotal++;
          if (l.count > 0) linesCovered++;
        }
      }
    }

    const callHits = methodHitsByName.has(m.name) ? methodHitsByName.get(m.name) : 0;
    const lineCoveragePct = linesTotal > 0 ? Number(((linesCovered / linesTotal) * 100).toFixed(2)) : null;

    if (linesTotal > 0 || callHits > 0) {
      observations.push({
        methodSignature: m.signature,
        linesCovered,
        linesTotal,
        lineCoveragePct,
        callHits
      });
    }
  }
  return observations;
}

async function ingestCloverCoverage({
  xmlPath = null,
  xmlContent = null,
  ciRunId = 'local-run',
  appCommit = 'local-working-tree',
  framework = null,
  suiteScope = 'all',
  environment = process.env.CI_ENVIRONMENT || 'local',
  snapshotId = null,
  generatedAt = null,
  uri = process.env.NEO4J_URI || 'bolt://localhost:7687',
  user = process.env.NEO4J_USER || 'neo4j',
  password = process.env.NEO4J_PASSWORD || 'admin123',
  database = process.env.NEO4J_DATABASE || 'neo4j'
}) {
  const xmlText = xmlContent !== null ? xmlContent : fs.readFileSync(xmlPath, 'utf8');
  const parsed = parseCloverXml(xmlText, { framework, generatedAt });
  const resolvedFramework = String(framework || parsed.framework || 'phpunit').toLowerCase();
  const runId = `${ciRunId}-${resolvedFramework}-${parsed.artifactSha256.slice(0, 12)}`;

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session({ database });

  try {
    await session.run('CREATE CONSTRAINT qkg_cov_run_id IF NOT EXISTS FOR (n:CoverageRun) REQUIRE n.run_id IS UNIQUE');
    await session.run('CREATE CONSTRAINT qkg_cov_obs_id IF NOT EXISTS FOR (n:CoverageObservation) REQUIRE n.obs_id IS UNIQUE');

    const snapRes = await session.run(`
      MERGE (cr:CoverageRun { run_id: $runId })
      SET cr.ci_run_id = $ciRunId,
          cr.artifact_sha256 = $sha256,
          cr.framework = $framework,
          cr.suite_scope = $suiteScope,
          cr.environment = $environment,
          cr.app_commit = $appCommit,
          cr.lines_covered = $linesCovered,
          cr.lines_valid = $linesValid,
          cr.line_rate = $lineRate,
          cr.generated_at = $generatedAt,
          cr.ingested_at = $nowIso
      WITH cr
      OPTIONAL MATCH (s:GraphSnapshot)
      WHERE ($snapshotId IS NOT NULL AND s.snapshot_id = $snapshotId) OR ($snapshotId IS NULL AND s.status = 'PUBLISHED')
      WITH cr, s ORDER BY coalesce(s.published_at, s.started_at) DESC LIMIT 1
      FOREACH (_ IN CASE WHEN s IS NOT NULL THEN [1] ELSE [] END |
        SET cr.snapshot_id = s.snapshot_id
        MERGE (cr)-[:MEASURED_FOR]->(s)
      )
      RETURN s.snapshot_id AS resolvedSnapshotId
    `, {
      runId,
      ciRunId,
      sha256: parsed.artifactSha256,
      framework: resolvedFramework,
      suiteScope,
      environment,
      appCommit,
      linesCovered: parsed.linesCovered,
      linesValid: parsed.linesValid,
      lineRate: parsed.lineRate,
      generatedAt: parsed.generatedAt,
      nowIso: new Date().toISOString(),
      snapshotId
    });
    const resolvedSnapshotId = snapRes.records[0]?.get('resolvedSnapshotId') || snapshotId;

    const filePaths = parsed.files.map((f) => f.file);
    const methodsRes = await session.run(`
      UNWIND $files AS file
      MATCH (c:Class { source_file: file })-[:DECLARES]->(m:Method)
      RETURN file, m.signature AS signature, m.name AS name, m.line_start AS line_start, m.line_end AS line_end
    `, { files: filePaths });
    const uiRes = await session.run(`
      UNWIND $files AS file
      MATCH (ui:UIComponent { file: file })
      RETURN file, ui.component_id AS componentId
    `, { files: filePaths });

    const methodsByFile = new Map();
    for (const r of methodsRes.records) {
      const f = r.get('file');
      if (!methodsByFile.has(f)) methodsByFile.set(f, []);
      methodsByFile.get(f).push({
        signature: r.get('signature'),
        name: r.get('name'),
        line_start: r.get('line_start')?.toNumber ? r.get('line_start').toNumber() : r.get('line_start'),
        line_end: r.get('line_end')?.toNumber ? r.get('line_end').toNumber() : r.get('line_end')
      });
    }

    const uiByFile = new Map();
    for (const r of uiRes.records) {
      const f = r.get('file');
      if (!uiByFile.has(f)) uiByFile.set(f, []);
      uiByFile.get(f).push(r.get('componentId'));
    }

    const methodObsRows = [];
    const uiObsRows = [];
    for (const fileRec of parsed.files) {
      const methods = methodsByFile.get(fileRec.file) || [];
      if (methods.length > 0) {
        const obsList = aggregateMethodCoverage(fileRec, methods);
        for (const obs of obsList) {
          methodObsRows.push({
            obsId: `${runId}::method::${obs.methodSignature}`,
            ...obs
          });
        }
      }

      const compIds = uiByFile.get(fileRec.file) || [];
      if (compIds.length > 0 && (fileRec.linesValid > 0 || fileRec.linesCovered > 0)) {
        for (const cid of compIds) {
          uiObsRows.push({
            obsId: `${runId}::ui::${cid}`,
            componentId: cid,
            linesCovered: fileRec.linesCovered,
            linesTotal: fileRec.linesValid,
            lineCoveragePct: fileRec.lineCoveragePct
          });
        }
      }
    }

    for (let i = 0; i < methodObsRows.length; i += 400) {
      const batch = methodObsRows.slice(i, i + 400);
      await session.run(`
        UNWIND $batch AS o
        MATCH (cr:CoverageRun { run_id: $runId })
        MATCH (m:Method { signature: o.methodSignature })
        MERGE (obs:CoverageObservation { obs_id: o.obsId })
        SET obs.observation_id = o.obsId,
            obs.lines_covered = o.linesCovered,
            obs.lines_total = o.linesTotal,
            obs.line_coverage_pct = o.lineCoveragePct,
            obs.call_hits = o.callHits,
            obs.target_type = 'Method',
            obs.framework = $framework,
            obs.app_commit = $appCommit,
            obs.snapshot_id = $snapshotId
        MERGE (cr)-[:HAS_OBSERVATION]->(obs)
        MERGE (obs)-[:COVERED_IN]->(m)
      `, { batch, runId, framework: resolvedFramework, appCommit, snapshotId: resolvedSnapshotId });
    }

    for (let i = 0; i < uiObsRows.length; i += 400) {
      const batch = uiObsRows.slice(i, i + 400);
      await session.run(`
        UNWIND $batch AS o
        MATCH (cr:CoverageRun { run_id: $runId })
        MATCH (ui:UIComponent { component_id: o.componentId })
        MERGE (obs:CoverageObservation { obs_id: o.obsId })
        SET obs.observation_id = o.obsId,
            obs.lines_covered = o.linesCovered,
            obs.lines_total = o.linesTotal,
            obs.line_coverage_pct = o.lineCoveragePct,
            obs.call_hits = 0,
            obs.target_type = 'UIComponent',
            obs.framework = $framework,
            obs.app_commit = $appCommit,
            obs.snapshot_id = $snapshotId
        MERGE (cr)-[:HAS_OBSERVATION]->(obs)
        MERGE (obs)-[:COVERED_COMPONENT_IN]->(ui)
      `, { batch, runId, framework: resolvedFramework, appCommit, snapshotId: resolvedSnapshotId });
    }

    return {
      runId,
      artifactSha256: parsed.artifactSha256,
      framework: resolvedFramework,
      suiteScope,
      snapshotId: resolvedSnapshotId,
      filesParsed: parsed.files.length,
      methodObservations: methodObsRows.length,
      uiComponentObservations: uiObsRows.length,
      linesCovered: parsed.linesCovered,
      linesValid: parsed.linesValid,
      lineRate: parsed.lineRate
    };
  } finally {
    await session.close();
    await driver.close();
  }
}

if (require.main === module) {
  const xmlPath = process.argv[2];
  const ciRunId = process.argv[3] || `cli-${Date.now()}`;
  const appCommit = process.argv[4] || 'local-working-tree';
  const framework = process.argv[5] || null;
  const suiteScope = process.argv[6] || 'all';
  if (!xmlPath) {
    console.error('Usage: node qkg_engine/coverage_ingestion.js <clover.xml> [ciRunId] [appCommit] [framework] [suiteScope]');
    process.exit(1);
  }
  ingestCloverCoverage({ xmlPath: path.resolve(WORKSPACE_ROOT, xmlPath), ciRunId, appCommit, framework, suiteScope })
    .then((res) => console.log('Coverage ingested:', JSON.stringify(res)))
    .catch((err) => {
      console.error('Coverage ingestion failed:', err);
      process.exit(1);
    });
}

module.exports = {
  parseCloverXml,
  aggregateMethodCoverage,
  ingestCloverCoverage
};
