/**
 * QKG Deterministic Entity & Relationship Snapshot Manifest Engine (Phase 4A)
 *
 * Builds canonical, order-independent entity-level and relationship-level
 * manifests from either:
 *   1. Extracted workspace AST / config / spec data (offline / pre-commit / CI)
 *   2. Live Neo4j graph state (post-ingestion / incremental-sync parity & diffs)
 *
 * Guarantees:
 *   - Excludes Neo4j internal IDs (identity/elementId)
 *   - Excludes volatile ingestion metadata (timestamps, snapshot_id, line numbers)
 *   - Computes stable canonical IDs, signature_hash, content_fingerprint, edge_fingerprint
 *   - Computes deterministic SHA-256 structural_digest over canonical entities + relationships
 *   - Keeps runtime execution & coverage summaries cleanly separated from structural digests
 */

const fs = require('fs');
const path = require('path');
const {
  REPOS,
  extractPluginFromPath,
  toRepoRelPath
} = require('./qkg_config');
const ontology = require('./ontology');
const { RELATIONSHIP_CONTRACTS } = require('./schema_contract');
const { normalizeEndpointComparable, routeMatchesUiPage } = require('./qa_spec_ingestor');
const {
  VOLATILE_METADATA_KEYS,
  canonicalizeValue,
  sha256Hex
} = require('./canonical_hash');

const MANIFEST_VERSION = '1.0.0';
const DEFAULT_EXTRACTOR_VERSION = '2.2.0';
const DEFAULT_SNAPSHOTS_DIR = path.join(__dirname, 'snapshots');

const RUNTIME_AND_BOOKKEEPING_LABELS = new Set([
  'GraphSnapshot',
  'Commit',
  'Release',
  'TestRun',
  'TestExecution',
  'CoverageRun',
  'CoverageObservation'
]);

const RUNTIME_AND_BOOKKEEPING_RELS = new Set([
  'RECORDED_COMMIT',
  'PREVIOUS_SNAPSHOT',
  'INCLUDES_COMMIT',
  'HAS_EXECUTION',
  'EXECUTED_TEST',
  'EXECUTED_AGAINST_SNAPSHOT',
  'HAS_OBSERVATION',
  'COVERED_IN',
  'COVERED_COMPONENT_IN',
  'MEASURED_FOR',
  'PART_OF_RELEASE'
]);

const LABEL_PRECEDENCE = [
  'Method',
  'Class',
  'Interface',
  'Trait',
  'ExternalClass',
  'ExternalInterface',
  'ExternalTrait',
  'ApiEndpoint',
  'UIPage',
  'UIComponent',
  'DatabaseColumn',
  'DatabaseEntity',
  'DatabaseTable',
  'SchemaMigration',
  'Event',
  'TestCase',
  'TestSuite',
  'BusinessDomain',
  'BusinessWorkflow',
  'Feature',
  'RequirementGroup',
  'Requirement',
  'BusinessRule',
  'Persona',
  'UserStory',
  'Document',
  'Plugin'
];

const ARRAY_SORT_PROPS = new Set([
  'implements',
  'traits',
  'trait_fqcns',
  'inputs',
  'child_components',
  'legacy_ids',
  'tables_modified',
  'affected_tables',
  'affected_columns',
  'observed_sources',
  'schema_drift_flags',
  'menu_titles',
  'rule_ids'
]);

function pickPrimaryLabel(labels = []) {
  for (const candidate of LABEL_PRECEDENCE) {
    if (labels.includes(candidate)) return candidate;
  }
  return labels[0] || 'Unknown';
}

function getCanonicalEntityId(label, props = {}) {
  switch (label) {
    case 'Plugin':
    case 'DatabaseTable':
    case 'TestSuite':
      return props.name || null;
    case 'Class':
    case 'Interface':
    case 'Trait':
    case 'ExternalClass':
    case 'ExternalInterface':
    case 'ExternalTrait':
    case 'DatabaseEntity':
      return props.fqcn || null;
    case 'Method':
      return props.signature || null;
    case 'ApiEndpoint':
      return props.endpoint_id || null;
    case 'UIComponent':
      return props.component_id || null;
    case 'UIPage':
      return props.page_id || null;
    case 'DatabaseColumn':
      return props.column_id || null;
    case 'SchemaMigration':
      return props.migration_id || null;
    case 'Event':
      return props.event_id || null;
    case 'TestCase':
      return props.canonical_id || props.testcase_id || null;
    case 'BusinessDomain':
      return props.domain_id || null;
    case 'BusinessWorkflow':
      return props.workflow_id || null;
    case 'Feature':
      return props.feature_id || null;
    case 'RequirementGroup':
      return props.group_id || null;
    case 'Requirement':
      return props.requirement_id || null;
    case 'BusinessRule':
      return props.rule_id || null;
    case 'Persona':
      return props.persona_id || null;
    case 'UserStory':
      return props.story_id || null;
    case 'Document':
      return props.doc_id || null;
    default:
      return props.id || props.name || null;
  }
}

function deriveModuleFromPlugin(plugin) {
  if (!plugin || plugin === 'core') return 'core';
  return String(plugin)
    .replace(/^orangehrm/i, '')
    .replace(/Plugin$/i, '')
    .toLowerCase() || 'core';
}

function normalizeStructuralProperties(rawProps = {}) {
  const cleaned = {};
  const keys = Object.keys(rawProps).sort();
  for (const key of keys) {
    if (VOLATILE_METADATA_KEYS.has(key)) continue;
    let val = rawProps[key];
    if (val === undefined || typeof val === 'function') continue;

    if (typeof val === 'object' && val !== null && typeof val.toNumber === 'function') {
      val = val.toNumber();
    }

    if (Array.isArray(val)) {
      const normalizedArr = val.map((item) => canonicalizeValue(item));
      if (ARRAY_SORT_PROPS.has(key)) {
        const dedup = [...new Set(normalizedArr.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))))]
          .sort()
          .map((x) => {
            try {
              return typeof x === 'string' && (x.startsWith('{') || x.startsWith('[')) ? JSON.parse(x) : x;
            } catch (_) {
              return x;
            }
          });
        cleaned[key] = dedup;
      } else {
        cleaned[key] = normalizedArr;
      }
    } else if (val !== null) {
      cleaned[key] = canonicalizeValue(val, { excludeKeys: VOLATILE_METADATA_KEYS });
    }
  }
  return cleaned;
}

/**
 * Produces a deterministic canonical entity manifest entry.
 */
function canonicalizeEntity(entityType, rawProps = {}) {
  const canonicalId = getCanonicalEntityId(entityType, rawProps);
  if (!canonicalId) return null;

  const props = normalizeStructuralProperties(rawProps);
  const signatureHash = props.signature_hash || (entityType === 'Method'
    ? sha256Hex({
        signature: canonicalId,
        visibility: props.visibility || 'public',
        is_static: Boolean(props.is_static),
        return_type: props.return_type || null
      })
    : null);

  if (signatureHash && !props.signature_hash) {
    props.signature_hash = signatureHash;
  }

  const contentFingerprint = props.content_fingerprint || sha256Hex({
    entity_type: entityType,
    canonical_id: canonicalId,
    properties: props
  });

  const plugin = props.plugin || (entityType === 'Plugin' ? canonicalId : null) || null;
  const sourceFile = props.source_file || props.file || null;
  const sourceRepo = props.repo || props.source_repo || (
    String(props.origin || '').startsWith('AST_') && ['Playwright', 'Cypress'].includes(props.framework)
      ? REPOS.QA
      : REPOS.APP
  );

  return {
    entity_type: entityType,
    canonical_id: canonicalId,
    plugin,
    module: props.module || (plugin ? deriveModuleFromPlugin(plugin) : null),
    source_file: sourceFile,
    source_repo: sourceRepo,
    signature_hash: signatureHash,
    content_fingerprint: contentFingerprint,
    properties: props
  };
}

function resolveRelationshipDiscriminator(relType, props = {}) {
  if (relType === 'FK_REFERENCES') {
    return `${props.column || ''}->${props.ref_column || ''}`;
  }
  if (relType === 'CALLS' && props.call_type) {
    return String(props.call_type);
  }
  return '';
}

/**
 * Produces a deterministic canonical relationship manifest entry.
 */
function canonicalizeRelationship({
  source_type,
  source_id,
  rel_type,
  target_type,
  target_id,
  properties = {}
}) {
  if (!source_type || !source_id || !rel_type || !target_type || !target_id) return null;
  const cleanProps = normalizeStructuralProperties(properties);
  const discriminator = resolveRelationshipDiscriminator(rel_type, cleanProps);
  const discPart = discriminator ? `[${discriminator}]` : '';
  const canonicalKey = `${source_type}:${source_id}|${rel_type}${discPart}|${target_type}:${target_id}`;

  const contract = RELATIONSHIP_CONTRACTS[rel_type];
  const provenanceClass = contract ? contract.classification : 'STRUCTURAL';
  const evidenceType = cleanProps.evidence_type || null;

  const edgeFingerprint = sha256Hex({
    canonical_key: canonicalKey,
    provenance_class: provenanceClass,
    properties: cleanProps
  });

  return {
    canonical_key: canonicalKey,
    source_type,
    source_id,
    rel_type,
    target_type,
    target_id,
    discriminator,
    evidence_type: evidenceType,
    provenance_class: provenanceClass,
    edge_fingerprint: edgeFingerprint,
    properties: cleanProps
  };
}

/**
 * Computes light structural delta summary vs a parent manifest.
 */
function computeLightDeltaSummary(parentManifest, currentEntities, currentRelationships, currentDigest) {
  if (!parentManifest) return null;

  const prevEntMap = new Map(
    (parentManifest.entities || []).map((e) => [`${e.entity_type}::${e.canonical_id}`, e.content_fingerprint])
  );
  const currEntMap = new Map(
    currentEntities.map((e) => [`${e.entity_type}::${e.canonical_id}`, e.content_fingerprint])
  );

  let addedEntities = 0;
  let removedEntities = 0;
  let modifiedEntities = 0;
  for (const [k, fp] of currEntMap.entries()) {
    if (!prevEntMap.has(k)) addedEntities++;
    else if (prevEntMap.get(k) !== fp) modifiedEntities++;
  }
  for (const k of prevEntMap.keys()) {
    if (!currEntMap.has(k)) removedEntities++;
  }

  const prevRelMap = new Map(
    (parentManifest.relationships || []).map((r) => [r.canonical_key, r.edge_fingerprint])
  );
  const currRelMap = new Map(
    currentRelationships.map((r) => [r.canonical_key, r.edge_fingerprint])
  );

  let addedRels = 0;
  let removedRels = 0;
  let modifiedRels = 0;
  for (const [k, fp] of currRelMap.entries()) {
    if (!prevRelMap.has(k)) addedRels++;
    else if (prevRelMap.get(k) !== fp) modifiedRels++;
  }
  for (const k of prevRelMap.keys()) {
    if (!currRelMap.has(k)) removedRels++;
  }

  return {
    parent_snapshot_id: parentManifest.snapshot_id || null,
    digest_changed: parentManifest.structural_digest !== currentDigest,
    added_entities: addedEntities,
    removed_entities: removedEntities,
    modified_entities: modifiedEntities,
    added_relationships: addedRels,
    removed_relationships: removedRels,
    modified_relationships: modifiedRels
  };
}

/**
 * Deduplicates, sorts canonically, and hashes entities + relationships into a full manifest.
 */
function finalizeManifest({
  entities = [],
  relationships = [],
  metadata = {},
  parentManifest = null,
  qualitySummary = null
}) {
  const entMap = new Map();
  for (const ent of entities) {
    if (!ent || !ent.entity_type || !ent.canonical_id) continue;
    const key = `${ent.entity_type}::${ent.canonical_id}`;
    entMap.set(key, ent);
  }
  const sortedEntities = [...entMap.values()].sort((a, b) =>
    a.entity_type.localeCompare(b.entity_type) || a.canonical_id.localeCompare(b.canonical_id)
  );

  const relMap = new Map();
  for (const rel of relationships) {
    if (!rel || !rel.canonical_key) continue;
    relMap.set(rel.canonical_key, rel);
  }
  const sortedRelationships = [...relMap.values()].sort((a, b) =>
    a.canonical_key.localeCompare(b.canonical_key)
  );

  const entitiesByType = {};
  for (const ent of sortedEntities) {
    entitiesByType[ent.entity_type] = (entitiesByType[ent.entity_type] || 0) + 1;
  }

  const relationshipsByType = {};
  for (const rel of sortedRelationships) {
    relationshipsByType[rel.rel_type] = (relationshipsByType[rel.rel_type] || 0) + 1;
  }

  const extractorVersion = metadata.extractor_version || DEFAULT_EXTRACTOR_VERSION;
  const schemaVersion = metadata.schema_version || ontology.meta.schema_version;

  // Deterministic digest strictly over structural semantics (excludes timestamps/snapshot IDs)
  const structuralDigest = sha256Hex({
    manifest_version: MANIFEST_VERSION,
    extractor_version: extractorVersion,
    schema_version: schemaVersion,
    entities: sortedEntities.map((e) => ({
      entity_type: e.entity_type,
      canonical_id: e.canonical_id,
      signature_hash: e.signature_hash,
      content_fingerprint: e.content_fingerprint
    })),
    relationships: sortedRelationships.map((r) => ({
      canonical_key: r.canonical_key,
      edge_fingerprint: r.edge_fingerprint
    }))
  });

  const deltaFromParent = computeLightDeltaSummary(
    parentManifest,
    sortedEntities,
    sortedRelationships,
    structuralDigest
  );

  return {
    manifest_version: MANIFEST_VERSION,
    snapshot_id: metadata.snapshot_id || null,
    parent_snapshot_id: metadata.parent_snapshot_id || parentManifest?.snapshot_id || null,
    repo: metadata.repo || REPOS.APP,
    app_commit: metadata.app_commit || null,
    app_branch: metadata.app_branch || null,
    qa_repo: metadata.qa_repo || REPOS.QA,
    qa_commit: metadata.qa_commit || null,
    qa_branch: metadata.qa_branch || null,
    extractor_version: extractorVersion,
    schema_version: schemaVersion,
    created_at: metadata.created_at || null,
    published_at: metadata.published_at || null,
    structural_digest: structuralDigest,
    counts: {
      total_entities: sortedEntities.length,
      total_relationships: sortedRelationships.length,
      entities_by_type: entitiesByType,
      relationships_by_type: relationshipsByType
    },
    delta_from_parent: deltaFromParent,
    quality_summary: qualitySummary || {
      status: 'UNAVAILABLE',
      reason: 'STRUCTURAL_EXTRACTION_ONLY',
      test_runs: 0,
      test_executions: 0,
      coverage_runs: 0,
      coverage_observations: 0
    },
    entities: sortedEntities,
    relationships: sortedRelationships
  };
}

function normalizeUiUrl(urlRaw) {
  if (!urlRaw) return null;
  let u = String(urlRaw).split('?')[0].trim();
  if (!u.startsWith('/')) u = '/' + u;
  return u;
}

/**
 * Builds a deterministic manifest from extractWorkspaceSnapshot() output.
 */
function buildManifestFromExtractedData(data = {}, metadata = {}, options = {}) {
  const entities = [];
  const relationships = [];
  const pushEnt = (label, raw) => {
    const item = canonicalizeEntity(label, raw);
    if (item) entities.push(item);
    return item;
  };
  const pushRel = (srcType, srcId, relType, dstType, dstId, properties = {}) => {
    const item = canonicalizeRelationship({
      source_type: srcType,
      source_id: srcId,
      rel_type: relType,
      target_type: dstType,
      target_id: dstId,
      properties
    });
    if (item) relationships.push(item);
    return item;
  };

  // 1. Plugins
  const pluginSet = new Set([...(data.pluginNames || []), 'core']);
  for (const name of pluginSet) {
    const intro = name === 'orangehrmPayrollPlugin' ? 'v2.2-india-payroll' : 'v1.0';
    pushEnt('Plugin', { name, introduced_in: intro, version: intro });
  }

  // 2. PHP Classes, Interfaces, Traits & Methods
  const classToTypeLabel = new Map();
  const methodToSig = new Set();

  for (const pf of data.prodParsedFiles || []) {
    const filePlugin = extractPluginFromPath(pf.file) || 'orangehrmCorePlugin';
    const intro = filePlugin === 'orangehrmPayrollPlugin' ? 'v2.2-india-payroll' : 'v1.0';

    const registerType = (label, t) => {
      const fqcn = t.fqcn;
      if (!fqcn) return;
      classToTypeLabel.set(fqcn, label);
      const props = {
        fqcn,
        name: t.name,
        namespace: t.namespace || '',
        plugin: filePlugin,
        source_file: t.source_file || pf.file,
        introduced_in: intro,
        version: intro,
        content_fingerprint: t.content_fingerprint || null
      };
      if (label === 'Class') {
        props.extends = t.extends_fqcn || t.extends || null;
        props.implements = t.implements || [];
        props.traits = t.trait_fqcns || [];
      } else if (label === 'Interface') {
        props.extends = Array.isArray(t.extends) ? t.extends : [];
      } else if (label === 'Trait') {
        props.traits = t.trait_fqcns || [];
      }
      pushEnt(label, props);
      if (pluginSet.has(filePlugin)) {
        pushRel('Plugin', filePlugin, 'DECLARES', label, fqcn);
      }

      for (const m of t.methods || []) {
        methodToSig.add(m.signature);
        pushEnt('Method', {
          signature: m.signature,
          name: m.name,
          class_fqcn: fqcn,
          plugin: filePlugin,
          visibility: m.visibility || 'public',
          is_static: Boolean(m.is_static),
          return_type: m.return_type_fqcn || m.return_type || null,
          source_file: m.source_file || t.source_file || pf.file,
          signature_hash: m.signature_hash || null,
          body_hash: m.body_hash || null,
          content_fingerprint: m.content_fingerprint || null,
          introduced_in: intro
        });
        pushRel(label, fqcn, 'DECLARES', 'Method', m.signature);
      }
    };

    for (const c of pf.classes || []) registerType('Class', c);
    for (const i of pf.interfaces || []) registerType('Interface', i);
    for (const t of pf.traits || []) registerType('Trait', t);
  }

  // Second pass over inheritance so internal vs ExternalClass/ExternalInterface/ExternalTrait resolves
  const internalTypeByLower = new Map();
  for (const [fqcn, label] of classToTypeLabel.entries()) {
    internalTypeByLower.set(`${label}:${fqcn.toLowerCase()}`, fqcn);
  }

  for (const pf of data.prodParsedFiles || []) {
    for (const c of pf.classes || []) {
      const parentRaw = c.extends_fqcn || c.extends;
      if (parentRaw) {
        const internal = internalTypeByLower.get(`Class:${parentRaw.toLowerCase()}`);
        if (internal) {
          pushRel('Class', c.fqcn, 'EXTENDS', 'Class', internal);
        } else {
          pushEnt('ExternalClass', { fqcn: parentRaw, name: parentRaw.split('\\').pop() });
          pushRel('Class', c.fqcn, 'EXTENDS', 'ExternalClass', parentRaw);
        }
      }
      for (const ifFqcn of c.implements || []) {
        const internal = internalTypeByLower.get(`Interface:${ifFqcn.toLowerCase()}`);
        if (internal) {
          pushRel('Class', c.fqcn, 'IMPLEMENTS', 'Interface', internal);
        } else {
          pushEnt('ExternalInterface', { fqcn: ifFqcn, name: ifFqcn.split('\\').pop() });
          pushRel('Class', c.fqcn, 'IMPLEMENTS', 'ExternalInterface', ifFqcn);
        }
      }
      for (const trFqcn of c.trait_fqcns || []) {
        const internal = internalTypeByLower.get(`Trait:${trFqcn.toLowerCase()}`);
        if (internal) {
          pushRel('Class', c.fqcn, 'USES_TRAIT', 'Trait', internal);
        } else {
          pushEnt('ExternalTrait', { fqcn: trFqcn, name: trFqcn.split('\\').pop() });
          pushRel('Class', c.fqcn, 'USES_TRAIT', 'ExternalTrait', trFqcn);
        }
      }
    }
    for (const i of pf.interfaces || []) {
      for (const parFqcn of i.extends || []) {
        const internal = internalTypeByLower.get(`Interface:${parFqcn.toLowerCase()}`);
        if (internal) {
          pushRel('Interface', i.fqcn, 'EXTENDS', 'Interface', internal);
        } else {
          pushEnt('ExternalInterface', { fqcn: parFqcn, name: parFqcn.split('\\').pop() });
          pushRel('Interface', i.fqcn, 'EXTENDS', 'ExternalInterface', parFqcn);
        }
      }
    }
    for (const t of pf.traits || []) {
      for (const trFqcn of t.trait_fqcns || []) {
        const internal = internalTypeByLower.get(`Trait:${trFqcn.toLowerCase()}`);
        if (internal) {
          pushRel('Trait', t.fqcn, 'USES_TRAIT', 'Trait', internal);
        } else {
          pushEnt('ExternalTrait', { fqcn: trFqcn, name: trFqcn.split('\\').pop() });
          pushRel('Trait', t.fqcn, 'USES_TRAIT', 'ExternalTrait', trFqcn);
        }
      }
    }
  }

  // 3. Method CALLS
  for (const e of data.callEdges || []) {
    if (!methodToSig.has(e.callerSignature) || !methodToSig.has(e.calleeSignature)) continue;
    pushRel('Method', e.callerSignature, 'CALLS', 'Method', e.calleeSignature, {
      call_type: e.call_type,
      confidence: e.confidence,
      evidence_type: e.evidence_type,
      mapping_source: 'TWO_PASS_SYMBOL_RESOLVER'
    });
  }

  // 4. ApiEndpoints
  const endpointsList = data.apiEndpoints || [];
  for (const ep of endpointsList) {
    const intro = ep.plugin === 'orangehrmPayrollPlugin' ? 'v2.2-india-payroll' : 'v1.0';
    pushEnt('ApiEndpoint', { ...ep, introduced_in: intro });
    if (classToTypeLabel.get(ep.handler_fqcn) === 'Class') {
      pushRel('Class', ep.handler_fqcn, 'EXPOSES', 'ApiEndpoint', ep.endpoint_id);
      pushRel('ApiEndpoint', ep.endpoint_id, 'HANDLED_BY', 'Class', ep.handler_fqcn, {
        evidence_type: 'SYMFONY_ROUTE_YAML',
        confidence: 1.0
      });
    }
  }

  // 5. Frontend UIComponents & UIPages
  const uiComponents = data.frontend?.components || [];
  const uiCompByFile = new Map();
  const uiCompByPluginName = new Map();

  for (const ui of uiComponents) {
    const intro = ui.plugin === 'orangehrmPayrollPlugin' ? 'v2.2-india-payroll' : 'v1.0';
    pushEnt('UIComponent', { ...ui, introduced_in: intro });
    if (ui.file) uiCompByFile.set(ui.file, ui.component_id);
    if (ui.plugin && ui.name) uiCompByPluginName.set(`${ui.plugin}::${ui.name}`, ui.component_id);
    if (ui.plugin && pluginSet.has(ui.plugin)) {
      pushRel('UIComponent', ui.component_id, 'DECLARED_IN', 'Plugin', ui.plugin);
    }
    for (const apiPathRaw of ui.api_calls || []) {
      const normPath = normalizeUiUrl(apiPathRaw);
      if (!normPath) continue;
      for (const ep of endpointsList) {
        const matched = ep.path === normPath ||
          (normPath.includes('{*}') && String(ep.path || '').startsWith(normPath.split('{*}')[0]));
        if (matched) {
          pushRel('UIComponent', ui.component_id, 'CALLS_ENDPOINT', 'ApiEndpoint', ep.endpoint_id, {
            evidence_type: 'VUE_AST_HTTP',
            confidence: 0.85
          });
        }
      }
    }
  }

  for (const pg of data.frontend?.pages || []) {
    const intro = pg.plugin === 'orangehrmPayrollPlugin' ? 'v2.2-india-payroll' : 'v1.0';
    pushEnt('UIPage', { ...pg, introduced_in: intro });
    const resolvedCompId = (pg.target_file && uiCompByFile.get(pg.target_file)) ||
      uiCompByPluginName.get(`${pg.plugin}::${pg.component_name}`);
    if (resolvedCompId) {
      pushRel('UIPage', pg.page_id, 'RENDERS', 'UIComponent', resolvedCompId);
    } else if (pg.target_file) {
      pushEnt('UIComponent', {
        component_id: pg.target_file,
        name: pg.component_name,
        file: pg.target_file,
        plugin: pg.plugin,
        type: 'RouteTarget',
        component_kind: 'ROUTE_TARGET',
        introduced_in: intro
      });
      pushRel('UIPage', pg.page_id, 'RENDERS', 'UIComponent', pg.target_file);
      if (pg.plugin) {
        pushEnt('Plugin', {
          name: pg.plugin,
          introduced_in: pg.plugin === 'orangehrmPayrollPlugin' ? 'v2.2-india-payroll' : 'v1.0'
        });
        pushRel('UIComponent', pg.target_file, 'DECLARED_IN', 'Plugin', pg.plugin);
      }
    }
  }

  // 6. DatabaseTables, Entities, Columns, Migrations & Data Access
  const tableSet = new Set();
  for (const t of data.schemaData?.tables || []) {
    const intro = (String(t.name).startsWith('ohrm_payroll') || t.name === 'ohrm_salary_slip')
      ? 'v2.2-india-payroll'
      : 'v1.0';
    tableSet.add(t.name);
    pushEnt('DatabaseTable', { name: t.name, source: t.source, plugin: t.plugin, introduced_in: intro });
  }
  for (const e of data.schemaData?.entities || []) {
    const intro = e.plugin === 'orangehrmPayrollPlugin' ? 'v2.2-india-payroll' : 'v1.0';
    if (classToTypeLabel.get(e.class_fqcn) === 'Class') {
      pushEnt('DatabaseEntity', {
        fqcn: e.class_fqcn,
        name: e.entity_name,
        table_name: e.table_name || 'unmapped',
        source_file: e.source_file,
        plugin: e.plugin,
        introduced_in: intro
      });
      pushRel('Class', e.class_fqcn, 'IS_ENTITY', 'DatabaseEntity', e.class_fqcn);
      if (e.table_name) {
        if (!tableSet.has(e.table_name)) {
          tableSet.add(e.table_name);
          const tblIntro = (e.table_name.startsWith('ohrm_payroll') || e.table_name === 'ohrm_salary_slip')
            ? 'v2.2-india-payroll'
            : 'v1.0';
          pushEnt('DatabaseTable', { name: e.table_name, introduced_in: tblIntro });
        }
        pushRel('DatabaseEntity', e.class_fqcn, 'MAPS_TO', 'DatabaseTable', e.table_name);
      }
      if (e.plugin && pluginSet.has(e.plugin)) {
        pushRel('Plugin', e.plugin, 'DECLARES', 'DatabaseEntity', e.class_fqcn);
      }
    }
  }
  for (const fk of data.schemaData?.fkEdges || []) {
    if (!tableSet.has(fk.from_table) || !tableSet.has(fk.to_table)) continue;
    pushRel('DatabaseTable', fk.from_table, 'FK_REFERENCES', 'DatabaseTable', fk.to_table, {
      column: fk.from_column,
      ref_column: fk.to_column,
      constraint_name: fk.constraint_name,
      evidence_type: fk.evidence_type,
      confidence: fk.confidence
    });
  }
  for (const acc of data.doctrineAccess?.tableAccessEdges || []) {
    if (!methodToSig.has(acc.method_signature) || !tableSet.has(acc.table_name)) continue;
    pushRel('Method', acc.method_signature, acc.relation, 'DatabaseTable', acc.table_name, {
      evidence_type: acc.evidence_type,
      confidence: acc.confidence
    });
  }
  const colSet = new Set();
  for (const col of data.dbColumnData?.columns || []) {
    colSet.add(col.column_id);
    pushEnt('DatabaseColumn', col);
    if (tableSet.has(col.table_name)) {
      pushRel('DatabaseTable', col.table_name, 'HAS_COLUMN', 'DatabaseColumn', col.column_id);
    }
    if (col.entity_fqcn && classToTypeLabel.get(col.entity_fqcn) === 'Class') {
      pushRel('DatabaseEntity', col.entity_fqcn, 'MAPS_TO_COLUMN', 'DatabaseColumn', col.column_id, {
        evidence_type: col.source || 'DOCTRINE_ORM',
        confidence: col.confidence || 0.95
      });
    }
  }
  for (const ca of data.dbColumnData?.columnAccessEdges || []) {
    if (!methodToSig.has(ca.method_signature) || !colSet.has(ca.column_id)) continue;
    pushRel('Method', ca.method_signature, 'ACCESSES_COLUMN', 'DatabaseColumn', ca.column_id, {
      access_type: ca.access_type,
      evidence_type: ca.evidence_type,
      confidence: ca.confidence
    });
  }
  for (const mig of data.dbColumnData?.migrations || []) {
    pushEnt('SchemaMigration', mig);
    for (const tbl of mig.affected_tables || mig.tables_modified || []) {
      if (tableSet.has(tbl)) {
        pushRel('SchemaMigration', mig.migration_id, 'MODIFIES_TABLE', 'DatabaseTable', tbl, {
          evidence_type: mig.evidence_type || 'MIGRATION_AST',
          confidence: mig.confidence || 0.9
        });
      }
    }
    for (const cid of mig.affected_columns || mig.columns_modified || []) {
      if (colSet.has(cid)) {
        pushRel('SchemaMigration', mig.migration_id, 'MODIFIES_COLUMN', 'DatabaseColumn', cid, {
          evidence_type: mig.evidence_type || 'MIGRATION_AST',
          confidence: mig.confidence || 0.9
        });
      }
    }
  }

  // 7. Symfony DI, Events & Menus
  for (const di of data.symfonyData?.diEdges || []) {
    if (classToTypeLabel.get(di.from_class_fqcn) === 'Class' && classToTypeLabel.get(di.to_class_fqcn) === 'Class') {
      pushRel('Class', di.from_class_fqcn, 'INJECTED_WITH', 'Class', di.to_class_fqcn, {
        service_key: di.service_key || null,
        evidence_type: di.evidence_type,
        confidence: di.confidence
      });
    }
  }
  for (const ev of data.symfonyData?.events || []) {
    pushEnt('Event', ev);
  }
  for (const l of data.symfonyData?.listenEdges || []) {
    pushRel('Class', l.class_fqcn, 'LISTENS_TO', 'Event', l.event_name, {
      handler_method: l.handler_method,
      evidence_type: l.evidence_type,
      confidence: l.confidence
    });
  }
  for (const d of data.symfonyData?.dispatchEdges || []) {
    pushRel('Class', d.class_fqcn, 'DISPATCHES', 'Event', d.event_name, {
      evidence_type: d.evidence_type,
      confidence: d.confidence
    });
  }
  for (const m of data.symfonyData?.menuEdges || []) {
    pushRel('Class', m.class_fqcn, 'EXTENDS_MENU', 'UIPage', m.page_id, {
      menu_titles: m.menu_titles || [],
      evidence_type: m.evidence_type,
      confidence: m.confidence
    });
  }

  // 8. Business Specs & Docs
  const specs = data.baselineSpecs || {};
  const storySet = new Set();
  const reqSet = new Set();
  const ruleSet = new Set();
  for (const d of specs.domains || []) {
    pushEnt('BusinessDomain', { ...d, introduced_in: d.introduced_in || 'v1.0', version: 'v1.0' });
    if (d.plugin && pluginSet.has(d.plugin)) pushRel('Plugin', d.plugin, 'CONTAINS', 'BusinessDomain', d.domain_id);
  }
  for (const w of specs.workflows || []) {
    pushEnt('BusinessWorkflow', { ...w, introduced_in: w.introduced_in || 'v1.0', version: 'v1.0' });
    if (w.domain_id) pushRel('BusinessDomain', w.domain_id, 'CONTAINS', 'BusinessWorkflow', w.workflow_id);
  }
  for (const f of specs.features || []) {
    pushEnt('Feature', { ...f, introduced_in: f.introduced_in || 'v1.0', version: 'v1.0' });
    if (f.workflow_id) pushRel('BusinessWorkflow', f.workflow_id, 'DECOMPOSES_TO', 'Feature', f.feature_id);
  }
  for (const g of specs.requirementGroups || []) {
    pushEnt('RequirementGroup', { ...g, introduced_in: g.introduced_in || 'v1.0', version: 'v1.0' });
    if (g.feature_id) pushRel('Feature', g.feature_id, 'HAS_REQUIREMENT_GROUP', 'RequirementGroup', g.group_id);
  }
  for (const r of specs.requirements || []) {
    reqSet.add(r.requirement_id);
    pushEnt('Requirement', { ...r, introduced_in: r.introduced_in || 'v1.0', version: 'v1.0' });
    if (r.group_id) pushRel('RequirementGroup', r.group_id, 'HAS_REQUIREMENT', 'Requirement', r.requirement_id);
  }
  for (const b of specs.businessRules || []) {
    ruleSet.add(b.rule_id);
    pushEnt('BusinessRule', { ...b, introduced_in: b.introduced_in || 'v1.0', version: 'v1.0' });
    if (b.requirement_id) pushRel('Requirement', b.requirement_id, 'GOVERNED_BY', 'BusinessRule', b.rule_id);
  }
  for (const p of specs.personas || []) {
    pushEnt('Persona', { ...p, introduced_in: p.introduced_in || 'v1.0', version: 'v1.0' });
  }
  for (const s of specs.userStories || []) {
    storySet.add(s.story_id);
    pushEnt('UserStory', { ...s, introduced_in: s.introduced_in || 'v1.0', version: 'v1.0' });
    if (s.persona_id) pushRel('Persona', s.persona_id, 'EXECUTES', 'UserStory', s.story_id);
    if (s.feature_id) pushRel('UserStory', s.story_id, 'BELONGS_TO', 'Feature', s.feature_id);
    if (s.workflow_id) pushRel('UserStory', s.story_id, 'SUPPORTS_WORKFLOW', 'BusinessWorkflow', s.workflow_id);
    if (s.requirement_id) pushRel('UserStory', s.story_id, 'REALIZES', 'Requirement', s.requirement_id);
    for (const rid of s.rule_ids || []) {
      if (String(rid).startsWith('BR_')) {
        pushRel('UserStory', s.story_id, 'GOVERNED_BY', 'BusinessRule', rid);
      } else if (String(rid).startsWith('NFR_') || String(rid).startsWith('FR_')) {
        pushRel('UserStory', s.story_id, 'REALIZES', 'Requirement', rid);
      }
    }
  }
  for (const l of data.storyTargets?.endpointLinks || []) {
    pushRel('UserStory', l.story_id, 'EXECUTES_VIA', 'ApiEndpoint', l.endpoint_id, {
      origin: 'SPEC_AUTHORED',
      evidence_type: 'SPEC_STORY_ENDPOINT',
      raw_target: l.raw_target
    });
    if (l.feature_id) {
      pushRel('Feature', l.feature_id, 'INCLUDES_ENDPOINT', 'ApiEndpoint', l.endpoint_id, {
        origin: 'SPEC_DERIVED'
      });
    }
  }
  for (const l of data.storyTargets?.uiLinks || []) {
    pushRel('UserStory', l.story_id, 'IMPLEMENTED_BY', 'UIComponent', l.component_id, {
      origin: 'SPEC_AUTHORED',
      evidence_type: 'SPEC_STORY_UI',
      raw_target: l.raw_target
    });
  }
  for (const d of data.documents || []) {
    pushEnt('Document', d);
    if (d.plugin && pluginSet.has(d.plugin)) pushRel('Document', d.doc_id, 'DOCUMENTS', 'Plugin', d.plugin);
  }

  // 9. Automated Code-AST TestSuites, TestCases & Link Edges (excluding volatile run history)
  for (const ts of data.testLinkData?.suites || []) {
    const intro = ts.plugin === 'orangehrmPayrollPlugin' ? 'v2.2-india-payroll' : 'v1.0';
    pushEnt('TestSuite', { ...ts, introduced_in: intro });
    if (ts.plugin && pluginSet.has(ts.plugin)) pushRel('Plugin', ts.plugin, 'HAS_TEST_SUITE', 'TestSuite', ts.name);
  }
  const confirmedTestMethodKeys = new Set();
  for (const tc of data.testLinkData?.testCases || []) {
    const intro = tc.plugin === 'orangehrmPayrollPlugin' ? 'v2.2-india-payroll' : 'v1.0';
    pushEnt('TestCase', {
      canonical_id: tc.canonical_id,
      testcase_id: tc.testcase_id,
      legacy_ids: tc.legacy_ids,
      name: tc.name,
      class_fqcn: tc.class_fqcn,
      class: tc.class_name,
      method_name: tc.method_name,
      plugin: tc.plugin,
      module: tc.module,
      suite: tc.suite,
      file: tc.file,
      framework: tc.framework,
      test_level: tc.test_level,
      level: tc.test_level,
      automation_status: 'Automated',
      origin: tc.origin,
      repo: tc.repo || REPOS.APP,
      introduced_in: intro
    });
    if (tc.suite) pushRel('TestSuite', tc.suite, 'CONTAINS_TEST', 'TestCase', tc.canonical_id);
  }
  for (const e of data.testLinkData?.testsEdges || []) {
    if (!methodToSig.has(e.target_method_signature)) continue;
    confirmedTestMethodKeys.add(`${e.canonical_id}|${e.target_method_signature}`);
    pushRel('TestCase', e.canonical_id, 'TESTS', 'Method', e.target_method_signature, {
      tier: e.tier,
      confidence: e.confidence,
      evidence_type: e.evidence_type,
      mapping_source: e.mapping_source
    });
  }
  for (const e of data.testLinkData?.potentialCoversEdges || []) {
    if (!methodToSig.has(e.target_method_signature)) continue;
    if (confirmedTestMethodKeys.has(`${e.canonical_id}|${e.target_method_signature}`)) continue;
    pushRel('TestCase', e.canonical_id, 'POTENTIAL_COVERS', 'Method', e.target_method_signature, {
      tier: 4,
      confidence: e.confidence,
      evidence_type: e.evidence_type,
      mapping_source: e.mapping_source
    });
  }
  for (const e of data.testLinkData?.executesAgainstEdges || []) {
    pushRel('TestCase', e.canonical_id, 'EXECUTES_AGAINST', 'ApiEndpoint', e.endpoint_id, {
      http_method: e.http_method,
      confidence: e.confidence,
      evidence_type: e.evidence_type
    });
  }
  for (const e of data.testLinkData?.uiComponentEdges || []) {
    pushRel('TestCase', e.canonical_id, 'TESTS_COMPONENT', 'UIComponent', e.target_component_id, {
      confidence: e.confidence,
      evidence_type: e.evidence_type
    });
  }

  // External QA Repo TestSuites, TestCases & Structural/Traceability Edges
  const epIndex = new Map();
  for (const ep of endpointsList) {
    const norm = normalizeEndpointComparable(ep.endpoint_id);
    if (!epIndex.has(norm.key)) epIndex.set(norm.key, []);
    epIndex.get(norm.key).push(ep);
  }
  const allPages = data.frontend?.pages || [];
  const allUiNodes = entities.filter((e) => e.entity_type === 'UIComponent');

  for (const ts of data.qaData?.suites || []) {
    pushEnt('TestSuite', { ...ts, introduced_in: 'v1.0' });
    if (ts.plugin && pluginSet.has(ts.plugin)) pushRel('Plugin', ts.plugin, 'HAS_TEST_SUITE', 'TestSuite', ts.name);
  }
  for (const tc of data.qaData?.testCases || []) {
    pushEnt('TestCase', {
      canonical_id: tc.canonical_id,
      testcase_id: tc.testcase_id,
      name: tc.title,
      short_title: tc.short_title,
      method_name: tc.short_title,
      plugin: tc.plugin,
      module: deriveModuleFromPlugin(tc.plugin),
      suite: tc.suite,
      file: tc.file,
      framework: tc.framework,
      test_level: String(tc.file || '').includes('/api/') ? 'API' : 'E2E',
      level: String(tc.file || '').includes('/api/') ? 'API' : 'E2E',
      automation_status: 'Automated',
      skipped: Boolean(tc.skipped),
      origin: tc.origin,
      repo: tc.repo || REPOS.QA,
      introduced_in: 'v1.0'
    });
    const suiteKey = tc._suiteNodeName || `${tc.origin}::${tc.file}::${tc.suite}`;
    pushRel('TestSuite', suiteKey, 'CONTAINS_TEST', 'TestCase', tc.canonical_id);

    const isPw = tc.framework === 'Playwright';
    for (const rawEp of tc.covers_endpoints || []) {
      const norm = normalizeEndpointComparable(rawEp);
      for (const ep of epIndex.get(norm.key) || []) {
        pushRel('TestCase', tc.canonical_id, 'EXECUTES_AGAINST', 'ApiEndpoint', ep.endpoint_id, {
          http_method: ep.http_method || norm.method,
          evidence_type: isPw ? 'PLAYWRIGHT_AST_NETWORK' : 'CYPRESS_API_ASSERT',
          confidence: 0.9
        });
      }
    }
    for (const rawRoute of tc.navigates_routes || []) {
      for (const pg of allPages) {
        if (routeMatchesUiPage(rawRoute, pg)) {
          pushRel('TestCase', tc.canonical_id, 'NAVIGATES_PAGE', 'UIPage', pg.page_id, {
            evidence_type: isPw ? 'PLAYWRIGHT_GOTO' : 'CYPRESS_PAGE_GOTO',
            confidence: 0.85
          });
        }
      }
    }
    for (const comp of tc.covers_components || []) {
      const baseName = String(comp).replace(/\.vue$/i, '');
      for (const ui of allUiNodes) {
        const uiName = ui.properties?.name || '';
        const uiFile = ui.properties?.file || ui.source_file || '';
        if (ui.canonical_id === comp || uiName === baseName || String(uiFile).endsWith('/' + comp)) {
          pushRel('TestCase', tc.canonical_id, 'TESTS_COMPONENT', 'UIComponent', ui.canonical_id, {
            evidence_type: isPw ? 'PLAYWRIGHT_TAG' : 'CYPRESS_TAG',
            confidence: 0.85
          });
        }
      }
    }
    for (const sid of tc.verifies_stories || []) {
      if (storySet.has(sid)) {
        pushRel('TestCase', tc.canonical_id, 'VERIFIES_STORY', 'UserStory', sid, {
          evidence_type: isPw ? 'PLAYWRIGHT_TAG' : 'CYPRESS_TAG',
          confidence: 0.9
        });
      }
    }
    for (const rid of tc.verifies_requirements || []) {
      if (reqSet.has(rid)) {
        pushRel('TestCase', tc.canonical_id, 'VERIFIES', 'Requirement', rid, {
          evidence_type: isPw ? 'PLAYWRIGHT_TAG' : 'CYPRESS_TAG',
          confidence: 0.9
        });
      }
    }
    for (const bid of tc.validates_rules || []) {
      if (ruleSet.has(bid)) {
        pushRel('TestCase', tc.canonical_id, 'VALIDATES_RULE', 'BusinessRule', bid, {
          evidence_type: isPw ? 'PLAYWRIGHT_TAG' : 'CYPRESS_TAG',
          confidence: 0.9
        });
      }
    }
  }

  return finalizeManifest({
    entities,
    relationships,
    metadata: {
      ...metadata,
      qa_commit: metadata.qa_commit || data.qaData?.qaCommit || null
    },
    parentManifest: options.parentManifest || null,
    qualitySummary: options.qualitySummary || null
  });
}

async function runQuery(queryRunnerOrSession, cypher, params = {}) {
  if (typeof queryRunnerOrSession === 'function') {
    return await queryRunnerOrSession(cypher, params);
  }
  const res = await queryRunnerOrSession.run(cypher, params);
  return (res.records || []).map((rec) => {
    const row = {};
    for (const key of rec.keys || []) {
      const val = rec.get(key);
      row[key] = val && typeof val === 'object' && val.properties ? val.properties : val;
    }
    return row;
  });
}

/**
 * Builds a deterministic manifest + separate quality summary directly from Neo4j.
 * Never exposes Neo4j internal IDs (`id`/`elementId`) or volatile timestamps.
 */
async function buildManifestFromNeo4j(queryRunnerOrSession, metadata = {}, options = {}) {
  const excludedLabels = [...RUNTIME_AND_BOOKKEEPING_LABELS];
  const excludedRels = [...RUNTIME_AND_BOOKKEEPING_RELS];

  const nodeRows = await runQuery(queryRunnerOrSession, `
    MATCH (n)
    WHERE NONE(lbl IN labels(n) WHERE lbl IN $excludedLabels)
    RETURN labels(n) AS labels, properties(n) AS props
  `, { excludedLabels });

  const relRows = await runQuery(queryRunnerOrSession, `
    MATCH (a)-[r]->(b)
    WHERE NOT type(r) IN $excludedRels
      AND NONE(lbl IN labels(a) WHERE lbl IN $excludedLabels)
      AND NONE(lbl IN labels(b) WHERE lbl IN $excludedLabels)
    RETURN labels(a) AS srcLabels, properties(a) AS srcProps,
           type(r) AS relType, properties(r) AS relProps,
           labels(b) AS dstLabels, properties(b) AS dstProps
  `, { excludedRels });

  const entities = [];
  for (const row of nodeRows) {
    const primaryLabel = pickPrimaryLabel(row.labels || []);
    const item = canonicalizeEntity(primaryLabel, row.props || {});
    if (item) entities.push(item);
  }

  const relationships = [];
  for (const row of relRows) {
    const srcLabel = pickPrimaryLabel(row.srcLabels || []);
    const dstLabel = pickPrimaryLabel(row.dstLabels || []);
    const srcId = getCanonicalEntityId(srcLabel, row.srcProps || {});
    const dstId = getCanonicalEntityId(dstLabel, row.dstProps || {});
    const item = canonicalizeRelationship({
      source_type: srcLabel,
      source_id: srcId,
      rel_type: row.relType,
      target_type: dstLabel,
      target_id: dstId,
      properties: row.relProps || {}
    });
    if (item) relationships.push(item);
  }

  // Separate quality observations (NEVER folded into structural_digest)
  let qualitySummary = options.qualitySummary || null;
  if (!qualitySummary && !options.skipQualityQuery) {
    try {
      const qRows = await runQuery(queryRunnerOrSession, `
        OPTIONAL MATCH (tr:TestRun)
        WITH count(DISTINCT tr) AS testRuns
        OPTIONAL MATCH (te:TestExecution)
        WITH testRuns,
             count(te) AS testExecutions,
             count(CASE WHEN toUpper(coalesce(te.status, '')) IN ['PASS', 'PASSED'] THEN 1 END) AS passedExecs,
             count(CASE WHEN toUpper(coalesce(te.status, '')) IN ['FAIL', 'FAILED', 'ERROR'] THEN 1 END) AS failedExecs
        OPTIONAL MATCH (cr:CoverageRun)
        WITH testRuns, testExecutions, passedExecs, failedExecs, count(DISTINCT cr) AS coverageRuns
        OPTIONAL MATCH (co:CoverageObservation)
        RETURN testRuns, testExecutions, passedExecs, failedExecs, coverageRuns, count(co) AS coverageObservations
      `);
      const q = qRows[0] || {};
      const toInt = (v) => (v && typeof v.toNumber === 'function' ? v.toNumber() : Number(v || 0));
      const execCount = toInt(q.testExecutions);
      const passedCount = toInt(q.passedExecs);
      const failedCount = toInt(q.failedExecs);
      const covObs = toInt(q.coverageObservations);
      qualitySummary = {
        status: execCount > 0 || covObs > 0 ? 'AVAILABLE' : 'UNAVAILABLE',
        reason: execCount > 0 || covObs > 0 ? null : 'NO_RUNTIME_OBSERVATIONS_RECORDED',
        test_runs: toInt(q.testRuns),
        test_executions: execCount,
        passed_executions: passedCount,
        failed_executions: failedCount,
        pass_rate_pct: execCount > 0 ? Number(((passedCount / execCount) * 100).toFixed(2)) : null,
        coverage_runs: toInt(q.coverageRuns),
        coverage_observations: covObs
      };
    } catch (err) {
      qualitySummary = {
        status: 'UNAVAILABLE',
        reason: `QUALITY_QUERY_ERROR: ${err.message}`,
        test_runs: 0,
        test_executions: 0,
        coverage_runs: 0,
        coverage_observations: 0
      };
    }
  }

  return finalizeManifest({
    entities,
    relationships,
    metadata,
    parentManifest: options.parentManifest || null,
    qualitySummary
  });
}

function buildCompactNeo4jManifestHeader(fullManifest, extra = {}) {
  const filename = fullManifest.snapshot_id
    ? `${fullManifest.snapshot_id}.manifest.json`
    : 'manifest.json';
  return {
    manifest_version: fullManifest.manifest_version,
    snapshot_id: fullManifest.snapshot_id,
    parent_snapshot_id: fullManifest.parent_snapshot_id,
    app_commit: fullManifest.app_commit,
    qa_commit: fullManifest.qa_commit,
    extractor_version: fullManifest.extractor_version,
    schema_version: fullManifest.schema_version,
    structural_digest: fullManifest.structural_digest,
    manifest_file: filename,
    counts: fullManifest.counts,
    delta_from_parent: fullManifest.delta_from_parent,
    quality_summary: fullManifest.quality_summary,
    ...extra
  };
}

function writeManifestArtifact(fullManifest, snapshotsDir = DEFAULT_SNAPSHOTS_DIR) {
  if (!fs.existsSync(snapshotsDir)) {
    fs.mkdirSync(snapshotsDir, { recursive: true });
  }
  const filename = `${fullManifest.snapshot_id || `snap-${Date.now()}`}.manifest.json`;
  const targetPath = path.join(snapshotsDir, filename);
  fs.writeFileSync(targetPath, JSON.stringify(fullManifest, null, 2), 'utf8');
  return targetPath;
}

function loadManifest(snapshotIdOrPath, snapshotsDir = DEFAULT_SNAPSHOTS_DIR) {
  if (!snapshotIdOrPath) return null;
  const candidatePaths = path.isAbsolute(snapshotIdOrPath)
    ? [snapshotIdOrPath]
    : [
        snapshotIdOrPath,
        path.join(snapshotsDir, snapshotIdOrPath),
        path.join(snapshotsDir, `${snapshotIdOrPath}.manifest.json`),
        path.join(snapshotsDir, `${snapshotIdOrPath}.json`)
      ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  }
  return null;
}

if (require.main === module) {
  const { extractWorkspaceSnapshot } = require('./ingest_pipeline');
  const args = process.argv.slice(2);
  const outIdx = args.indexOf('--output-dir');
  const snapshotsDir = outIdx !== -1 ? args[outIdx + 1] : DEFAULT_SNAPSHOTS_DIR;
  const connectMariaDb = !args.includes('--no-mariadb');
  extractWorkspaceSnapshot({ connectMariaDb })
    .then((data) => {
      const snapId = `cli-${new Date().toISOString().replace(/[:.]/g, '-')}`;
      const manifest = buildManifestFromExtractedData(data, { snapshot_id: snapId });
      const file = writeManifestArtifact(manifest, snapshotsDir);
      console.log(`Snapshot manifest written: ${file} | digest=${manifest.structural_digest} | entities=${manifest.counts.total_entities} | rels=${manifest.counts.total_relationships}`);
    })
    .catch((err) => {
      console.error('[FATAL] Manifest CLI failed:', err);
      process.exit(1);
    });
}

module.exports = {
  MANIFEST_VERSION,
  DEFAULT_EXTRACTOR_VERSION,
  DEFAULT_SNAPSHOTS_DIR,
  RUNTIME_AND_BOOKKEEPING_LABELS,
  RUNTIME_AND_BOOKKEEPING_RELS,
  canonicalizeEntity,
  canonicalizeRelationship,
  finalizeManifest,
  buildManifestFromExtractedData,
  buildManifestFromNeo4j,
  buildCompactNeo4jManifestHeader,
  writeManifestArtifact,
  loadManifest,
  getCanonicalEntityId,
  pickPrimaryLabel,
  normalizeStructuralProperties
};
