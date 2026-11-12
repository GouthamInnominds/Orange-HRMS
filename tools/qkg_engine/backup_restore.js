/**
 * QKG Backup, Checksum Verification & Recovery Restore Engine (Phase 5C - P5-07)
 *
 * Exports deterministic QKG snapshot bundles (manifest + graph entities/edges + SHA-256),
 * validates cryptographic integrity against corruption/tampering, and restores bundles
 * into a clean Neo4j staging/target instance with optional 27/27 Golden verification.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const neo4j = require('neo4j-driver');

const {
  DEFAULT_SNAPSHOTS_DIR,
  listManifestFiles,
  loadManifest,
  finalizeManifest,
  pickPrimaryLabel
} = require('./snapshot_manifest');
const { canonicalStringify } = require('./canonical_hash');

const DEFAULT_BACKUPS_DIR = path.resolve(__dirname, 'output', 'backups');
const LABEL_KEY_PROP = {
  Plugin: 'name',
  DatabaseTable: 'name',
  TestSuite: 'name',
  Class: 'fqcn',
  Interface: 'fqcn',
  Trait: 'fqcn',
  ExternalClass: 'fqcn',
  ExternalInterface: 'fqcn',
  ExternalTrait: 'fqcn',
  DatabaseEntity: 'fqcn',
  Method: 'signature',
  ApiEndpoint: 'endpoint_id',
  UIComponent: 'component_id',
  UIPage: 'page_id',
  DatabaseColumn: 'column_id',
  SchemaMigration: 'migration_id',
  Event: 'event_id',
  Document: 'doc_id',
  BusinessDomain: 'domain_id',
  BusinessWorkflow: 'workflow_id',
  Feature: 'feature_id',
  RequirementGroup: 'group_id',
  Requirement: 'requirement_id',
  BusinessRule: 'rule_id',
  Persona: 'persona_id',
  UserStory: 'story_id',
  TestCase: 'canonical_id',
  TestRun: 'run_id',
  CoverageRun: 'run_id',
  TestExecution: 'exec_id',
  CoverageObservation: 'obs_id',
  Commit: 'sha',
  Release: 'version_id',
  GraphSnapshot: 'snapshot_id'
};

const ENTITY_KEY_PRIORITY = [
  'signature', 'fqcn', 'endpoint_id', 'component_id', 'page_id', 'column_id',
  'migration_id', 'event_id', 'doc_id', 'domain_id', 'workflow_id', 'feature_id',
  'group_id', 'requirement_id', 'rule_id', 'persona_id', 'story_id', 'exec_id',
  'obs_id', 'run_id', 'sha', 'version_id', 'canonical_id', 'snapshot_id', 'id', 'name'
];

function computeSha256(objOrStr) {
  const str = typeof objOrStr === 'string' ? objOrStr : canonicalStringify(objOrStr);
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
}

function isSerializedNeo4jInt(val) {
  if (!val || typeof val !== 'object' || Array.isArray(val)) return false;
  const keys = Object.keys(val);
  return keys.length === 2
    && typeof val.low === 'number'
    && typeof val.high === 'number';
}

function normalizeNeo4jValue(val) {
  if (val === undefined || val === null) return val;
  if (neo4j.isInt(val)) return val.toNumber();
  if (isSerializedNeo4jInt(val)) return neo4j.integer.toNumber(val);
  if (neo4j.isDateTime(val) || neo4j.isDate(val) || neo4j.isLocalDateTime(val) || neo4j.isTime(val) || neo4j.isLocalTime(val)) {
    return val.toString();
  }
  if (Array.isArray(val)) return val.map((item) => normalizeNeo4jValue(item));
  if (typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) {
      if (v === undefined) continue;
      out[k] = normalizeNeo4jValue(v);
    }
    return out;
  }
  return val;
}

function normalizeNeo4jProps(rawProps = {}) {
  const normalized = normalizeNeo4jValue(rawProps);
  return normalized && typeof normalized === 'object' ? normalized : {};
}

function resolveKeyPair(props = {}, labels = []) {
  for (const label of labels || []) {
    const preferredProp = LABEL_KEY_PROP[label];
    if (preferredProp && props[preferredProp] !== undefined && props[preferredProp] !== null && props[preferredProp] !== '') {
      return { keyProp: preferredProp, keyVal: String(props[preferredProp]) };
    }
  }
  for (const prop of ENTITY_KEY_PRIORITY) {
    if (props[prop] !== undefined && props[prop] !== null && props[prop] !== '') {
      return { keyProp: prop, keyVal: String(props[prop]) };
    }
  }
  return null;
}

function buildRelDiscriminatorPattern(relType, props = {}) {
  if (relType === 'FK_REFERENCES' && props.column !== undefined && props.ref_column !== undefined) {
    return {
      key: 'fk',
      patternProps: '{ column: item.dColumn, ref_column: item.dRefColumn }',
      discFields: { dColumn: props.column, dRefColumn: props.ref_column }
    };
  }
  if (relType === 'CALLS' && props.call_type) {
    return {
      key: 'call_type',
      patternProps: '{ call_type: item.dCallType }',
      discFields: { dCallType: props.call_type }
    };
  }
  if (relType === 'MAPS_TO_COLUMN' && props.property_name) {
    return {
      key: 'property_name',
      patternProps: '{ property_name: item.dPropName }',
      discFields: { dPropName: props.property_name }
    };
  }
  if (relType === 'ACCESSES_COLUMN' && props.access_mode) {
    return {
      key: 'access_mode',
      patternProps: '{ access_mode: item.dAccessMode }',
      discFields: { dAccessMode: props.access_mode }
    };
  }
  return { key: 'none', patternProps: '', discFields: {} };
}

function resolveBundlePaths(bundlePathOrDir) {
  const abs = path.resolve(bundlePathOrDir);
  if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
    return {
      bundleDir: abs,
      bundleFile: path.join(abs, 'snapshot_bundle.json'),
      checksumFile: path.join(abs, 'manifest.sha256'),
      metaFile: path.join(abs, 'bundle_meta.json')
    };
  }
  const dir = path.dirname(abs);
  return {
    bundleDir: dir,
    bundleFile: abs,
    checksumFile: path.join(dir, 'manifest.sha256'),
    metaFile: path.join(dir, 'bundle_meta.json')
  };
}

/**
 * Exports either a live Neo4j graph + manifest bundle OR an offline manifest bundle.
 */
async function exportSnapshotBundle({
  outDir = null,
  snapshotId = null,
  manifest = null,
  offline = true,
  uri = process.env.NEO4J_URI || 'bolt://localhost:7687',
  user = process.env.NEO4J_USER || 'neo4j',
  password = process.env.NEO4J_PASSWORD || 'admin123',
  database = process.env.NEO4J_DATABASE || 'neo4j',
  snapshotsDir = DEFAULT_SNAPSHOTS_DIR
} = {}) {
  let activeManifest = manifest;
  if (!activeManifest) {
    const files = listManifestFiles(snapshotsDir);
    const chosen = snapshotId
      ? files.find((f) => f.snapshotId === snapshotId && f.isFullManifest)
        || files.find((f) => f.snapshotId === snapshotId)
        || { filePath: snapshotId }
      : files.find((f) => f.isFullManifest) || files[0];
    if (chosen && (chosen.isFullManifest || snapshotId)) {
      activeManifest = loadManifest(chosen.filePath, snapshotsDir);
      if (snapshotId && !activeManifest) {
        throw new Error(`Unable to load snapshot manifest '${snapshotId}'.`);
      }
    }
    if (!activeManifest || !Array.isArray(activeManifest.entities) || !Array.isArray(activeManifest.relationships)) {
      if (snapshotId || !offline) {
        throw new Error(`No full entity snapshot manifest available to export${snapshotId ? ` for '${snapshotId}'` : ''}.`);
      }
      const { extractWorkspaceSnapshot } = require('./ingest_pipeline');
      const { buildManifestFromExtractedData } = require('./snapshot_manifest');
      const extracted = await extractWorkspaceSnapshot({ connectMariaDb: false });
      activeManifest = buildManifestFromExtractedData(extracted, {
        snapshot_id: chosen?.snapshotId || `snap-offline-${Date.now()}`,
        branch: extracted.branch || 'v2-main'
      });
    }
  }

  let graphData = null;
  let exportMode = 'OFFLINE_MANIFEST_BUNDLE';

  if (!offline) {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), { connectionTimeout: 5000 });
    const session = driver.session({ database, defaultAccessMode: neo4j.session.READ });
    try {
      const nodeRows = await session.run(`
        MATCH (n)
        RETURN labels(n) AS labels, properties(n) AS props
      `);
      const relRows = await session.run(`
        MATCH (a)-[r]->(b)
        RETURN labels(a) AS fromLabels, properties(a) AS fromProps,
               type(r) AS relType, properties(r) AS relProps,
               labels(b) AS toLabels, properties(b) AS toProps
      `);

      const nodes = nodeRows.records.map((rec) => {
        const labels = rec.get('labels') || [];
        const props = normalizeNeo4jProps(rec.get('props') || {});
        const keyInfo = resolveKeyPair(props, labels);
        return { labels, keyProp: keyInfo?.keyProp || null, keyVal: keyInfo?.keyVal || null, props };
      }).filter((n) => n.keyProp && n.keyVal);

      const relationships = relRows.records.map((rec) => {
        const fromLabels = rec.get('fromLabels') || [];
        const toLabels = rec.get('toLabels') || [];
        const fromProps = normalizeNeo4jProps(rec.get('fromProps') || {});
        const toProps = normalizeNeo4jProps(rec.get('toProps') || {});
        const fk = resolveKeyPair(fromProps, fromLabels);
        const tk = resolveKeyPair(toProps, toLabels);
        if (!fk || !tk) return null;
        return {
          fromLabel: pickPrimaryLabel(fromLabels),
          fromKeyProp: fk.keyProp,
          fromKeyVal: fk.keyVal,
          relType: rec.get('relType'),
          props: normalizeNeo4jProps(rec.get('relProps') || {}),
          toLabel: pickPrimaryLabel(toLabels),
          toKeyProp: tk.keyProp,
          toKeyVal: tk.keyVal
        };
      }).filter(Boolean);

      graphData = { nodes, relationships };
      exportMode = 'LIVE_NEO4J_AND_MANIFEST_BUNDLE';
    } finally {
      await session.close();
      await driver.close();
    }
  }

  const snapId = activeManifest.snapshot_id || activeManifest.metadata?.snapshot_id || 'snap-unknown';
  const targetDir = path.resolve(outDir || path.join(DEFAULT_BACKUPS_DIR, snapId));
  fs.mkdirSync(targetDir, { recursive: true });

  const bundlePayload = {
    bundleVersion: '1.0',
    exportMode,
    snapshotId: snapId,
    exportedAt: new Date().toISOString(),
    manifest: activeManifest,
    graph: graphData
  };

  const payloadSha256 = computeSha256(bundlePayload);
  const paths = resolveBundlePaths(targetDir);
  fs.writeFileSync(paths.bundleFile, JSON.stringify(bundlePayload, null, 2), 'utf8');
  fs.writeFileSync(paths.checksumFile, `${payloadSha256}  snapshot_bundle.json\n`, 'utf8');

  const meta = {
    snapshotId: snapId,
    exportMode,
    sha256: payloadSha256,
    structuralDigest: activeManifest.structural_digest || null,
    entityCount: (activeManifest.entities || []).length,
    relationshipCount: (activeManifest.relationships || []).length,
    liveNodesExported: graphData ? graphData.nodes.length : 0,
    liveRelationshipsExported: graphData ? graphData.relationships.length : 0,
    createdAt: bundlePayload.exportedAt
  };
  fs.writeFileSync(paths.metaFile, JSON.stringify(meta, null, 2), 'utf8');

  return {
    ok: true,
    ...meta,
    bundleDir: targetDir,
    bundleFile: paths.bundleFile
  };
}

/**
 * Cryptographically verifies bundle SHA-256, manifest digest recomputation, and internal ID safety.
 */
function verifySnapshotBundle(bundlePathOrDir) {
  const paths = resolveBundlePaths(bundlePathOrDir);
  if (!fs.existsSync(paths.bundleFile)) {
    return { valid: false, checksumValid: false, digestValid: false, reason: `Bundle file not found: ${paths.bundleFile}` };
  }
  if (!fs.existsSync(paths.checksumFile)) {
    return { valid: false, checksumValid: false, digestValid: false, reason: `Checksum file not found: ${paths.checksumFile}` };
  }

  let bundle;
  try {
    bundle = JSON.parse(fs.readFileSync(paths.bundleFile, 'utf8'));
  } catch (err) {
    return { valid: false, checksumValid: false, digestValid: false, reason: `Corrupt JSON bundle: ${err.message}` };
  }

  const expectedChecksum = fs.readFileSync(paths.checksumFile, 'utf8').trim().split(/\s+/)[0];
  const actualChecksum = computeSha256(bundle);
  const checksumValid = Boolean(expectedChecksum && actualChecksum === expectedChecksum);

  let digestValid = false;
  if (bundle.manifest && Array.isArray(bundle.manifest.entities) && Array.isArray(bundle.manifest.relationships)) {
    const recomputed = finalizeManifest({
      metadata: bundle.manifest.metadata || {
        snapshot_id: bundle.manifest.snapshot_id,
        extractor_version: bundle.manifest.extractor_version,
        schema_version: bundle.manifest.schema_version
      },
      entities: bundle.manifest.entities,
      relationships: bundle.manifest.relationships
    });
    digestValid = recomputed.structural_digest === bundle.manifest.structural_digest;
  }

  const rawText = fs.readFileSync(paths.bundleFile, 'utf8');
  const hasInternalNeo4jId = /"neo4j_internal_id"\s*:|"elementId"\s*:/i.test(rawText);

  const valid = checksumValid && digestValid && !hasInternalNeo4jId;
  return {
    valid,
    checksumValid,
    digestValid,
    internalIdLeaks: hasInternalNeo4jId ? 1 : 0,
    expectedChecksum,
    actualChecksum,
    snapshotId: bundle.snapshotId || bundle.manifest?.snapshot_id || bundle.manifest?.metadata?.snapshot_id || null,
    exportMode: bundle.exportMode,
    reason: valid ? null : (!checksumValid ? 'SHA256_CHECKSUM_MISMATCH' : (!digestValid ? 'MANIFEST_DIGEST_MISMATCH' : 'INTERNAL_ID_LEAK'))
  };
}

/**
 * Restores a verified snapshot bundle into Neo4j (or an injected queryRunner for testing).
 */
async function restoreSnapshotBundle(bundlePathOrDir, options = {}) {
  const verifyRes = verifySnapshotBundle(bundlePathOrDir);
  if (!verifyRes.valid) {
    throw new Error(`Refusing restore of invalid/corrupted bundle: ${verifyRes.reason}`);
  }

  const paths = resolveBundlePaths(bundlePathOrDir);
  const bundle = JSON.parse(fs.readFileSync(paths.bundleFile, 'utf8'));

  const nodes = bundle.graph?.nodes || (bundle.manifest?.entities || []).map((e) => ({
    labels: [e.entity_type || 'Entity'],
    keyProp: 'canonical_id',
    keyVal: e.canonical_id,
    props: { canonical_id: e.canonical_id, ...(e.properties || {}) }
  }));

  const relationships = bundle.graph?.relationships || (bundle.manifest?.relationships || []).map((r) => ({
    fromLabel: r.source_type || 'Entity',
    fromKeyProp: 'canonical_id',
    fromKeyVal: r.source_id,
    relType: r.rel_type,
    props: r.properties || {},
    toLabel: r.target_type || 'Entity',
    toKeyProp: 'canonical_id',
    toKeyVal: r.target_id
  }));

  const runExec = async (runner) => {
    if (options.clean) {
      await runner('MATCH (n) DETACH DELETE n', {});
    }
    let nodesRestored = 0;
    const nodeGroups = new Map();
    for (const node of nodes) {
      const labelToken = (node.labels || ['Entity']).filter((l) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(l)).join(':') || 'Entity';
      const keyProp = /^[A-Za-z_][A-Za-z0-9_]*$/.test(node.keyProp) ? node.keyProp : 'canonical_id';
      const gk = `${labelToken}||${keyProp}`;
      if (!nodeGroups.has(gk)) nodeGroups.set(gk, { labelToken, keyProp, items: [] });
      nodeGroups.get(gk).items.push({
        keyVal: node.keyVal,
        props: normalizeNeo4jProps(node.props || {})
      });
    }
    const BATCH = 250;
    for (const { labelToken, keyProp, items } of nodeGroups.values()) {
      for (let i = 0; i < items.length; i += BATCH) {
        const batch = items.slice(i, i + BATCH);
        await runner(
          `UNWIND $batch AS item MERGE (n:${labelToken} { ${keyProp}: item.keyVal }) SET n += item.props`,
          { batch }
        );
        nodesRestored += batch.length;
      }
    }

    let relationshipsRestored = 0;
    const relGroups = new Map();
    for (const rel of relationships) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(rel.relType)) continue;
      const fLabel = /^[A-Za-z_][A-Za-z0-9_]*$/.test(rel.fromLabel) ? `:${rel.fromLabel}` : '';
      const tLabel = /^[A-Za-z_][A-Za-z0-9_]*$/.test(rel.toLabel) ? `:${rel.toLabel}` : '';
      const fk = /^[A-Za-z_][A-Za-z0-9_]*$/.test(rel.fromKeyProp) ? rel.fromKeyProp : 'canonical_id';
      const tk = /^[A-Za-z_][A-Za-z0-9_]*$/.test(rel.toKeyProp) ? rel.toKeyProp : 'canonical_id';
      const cleanProps = normalizeNeo4jProps(rel.props || {});
      const disc = buildRelDiscriminatorPattern(rel.relType, cleanProps);
      const gk = `${fLabel}||${fk}||${rel.relType}||${disc.key}||${tLabel}||${tk}`;
      if (!relGroups.has(gk)) {
        relGroups.set(gk, {
          fLabel,
          fk,
          relType: rel.relType,
          patternProps: disc.patternProps,
          tLabel,
          tk,
          items: []
        });
      }
      relGroups.get(gk).items.push({
        fromKey: rel.fromKeyVal,
        toKey: rel.toKeyVal,
        props: cleanProps,
        ...disc.discFields
      });
    }
    for (const { fLabel, fk, relType, patternProps, tLabel, tk, items } of relGroups.values()) {
      for (let i = 0; i < items.length; i += BATCH) {
        const batch = items.slice(i, i + BATCH);
        const relPattern = patternProps ? `[r:${relType} ${patternProps}]` : `[r:${relType}]`;
        await runner(
          `UNWIND $batch AS item MATCH (a${fLabel} { ${fk}: item.fromKey }), (b${tLabel} { ${tk}: item.toKey }) MERGE (a)-${relPattern}->(b) SET r += item.props`,
          { batch }
        );
        relationshipsRestored += batch.length;
      }
    }
    return { nodesRestored, relationshipsRestored };
  };

  if (options.queryRunner) {
    const counts = await runExec(options.queryRunner);
    return { restored: true, checksumValid: true, ...counts, snapshotId: verifyRes.snapshotId };
  }

  const uri = options.uri || process.env.NEO4J_URI || 'bolt://localhost:7688';
  const user = options.user || process.env.NEO4J_USER || 'neo4j';
  const password = options.password || process.env.NEO4J_PASSWORD || 'admin123';
  const database = options.database || process.env.NEO4J_DATABASE || 'neo4j';
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), { connectionTimeout: 5000 });
  const session = driver.session({ database });
  let counts;
  try {
    counts = await runExec((c, p) => session.run(c, p));
  } finally {
    await session.close();
    await driver.close();
  }

  let validation = null;
  if (options.runGoldenCheck) {
    const { validateGoldenDataset } = require('./validate_golden_dataset');
    validation = await validateGoldenDataset({ uri, user, password, database });
  }

  return {
    restored: true,
    checksumValid: true,
    ...counts,
    snapshotId: verifyRes.snapshotId,
    validation
  };
}

async function runCli() {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf('--out');
  const outDir = outIdx !== -1 ? args[outIdx + 1] : null;
  const uriIdx = args.indexOf('--uri');
  const uri = uriIdx !== -1 ? args[uriIdx + 1] : undefined;
  const offline = !args.includes('--live');

  if (args.includes('--verify')) {
    const targetIdx = args.indexOf('--bundle');
    let verifyTarget = targetIdx !== -1 ? args[targetIdx + 1] : null;
    if (!verifyTarget) {
      const exported = await exportSnapshotBundle({ offline: true, outDir });
      verifyTarget = exported.bundleDir;
    }
    const res = verifySnapshotBundle(verifyTarget);
    console.log(`=== QKG Backup Bundle Verification | valid=${res.valid} ===`);
    console.log(JSON.stringify(res, null, 2));
    if (!res.valid) process.exit(1);
    return;
  }

  if (args.includes('--export')) {
    const res = await exportSnapshotBundle({ outDir, uri, offline });
    console.log(JSON.stringify(res, null, 2));
    return;
  }

  if (args.includes('--restore')) {
    const idx = args.indexOf('--restore');
    const dir = args[idx + 1];
    if (!dir) throw new Error('Specify bundle directory after --restore');
    const res = await restoreSnapshotBundle(dir, {
      uri,
      clean: args.includes('--clean'),
      runGoldenCheck: args.includes('--validate')
    });
    console.log(JSON.stringify(res, null, 2));
    if (res.validation && res.validation.failed > 0) process.exit(1);
    return;
  }

  console.log('Usage: node qkg_engine/backup_restore.js [--verify [--bundle dir]] | [--export [--live] [--out dir]] | [--restore dir [--uri bolt://...] [--clean] [--validate]]');
}

if (require.main === module) {
  runCli().catch((err) => {
    console.error('backup_restore error:', err.message);
    process.exit(1);
  });
}

module.exports = {
  DEFAULT_BACKUPS_DIR,
  computeSha256,
  exportSnapshotBundle,
  verifySnapshotBundle,
  restoreSnapshotBundle
};
