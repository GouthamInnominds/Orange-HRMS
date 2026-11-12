/**
 * Canonical Deterministic Serialization & Structural Hashing (Phase 4A)
 *
 * Produces order-independent SHA-256 digests and structural fingerprints while
 * strictly stripping volatile ingestion metadata (timestamps, snapshot IDs,
 * commit SHAs, Neo4j internal IDs, and editor line numbers).
 */

const crypto = require('crypto');

const VOLATILE_METADATA_KEYS = new Set([
  'snapshot_id',
  'parent_snapshot_id',
  'started_at',
  'published_at',
  'created_at',
  'updated_at',
  'first_seen_at',
  'last_seen_at',
  'executed_at',
  'generated_at',
  'mariadb_observed_at',
  'ingestion_duration_ms',
  'commit_sha',
  'qa_commit',
  'app_commit',
  'identity',
  'elementId',
  'line_start',
  'line_end',
  'line_count'
]);

const AST_NOISE_KEYS = new Set([
  'loc',
  'leadingComments',
  'trailingComments',
  'comments'
]);

/**
 * Normalizes values into deterministic sorted-key JSON structures.
 * @param {*} value Input value
 * @param {Object} [options]
 * @param {Set<string>} [options.excludeKeys] Keys omitted from objects
 * @param {boolean} [options.normalizeLineEndings=true] Convert CRLF to LF for strings
 * @returns {*}
 */
function canonicalizeValue(value, options = {}) {
  const excludeKeys = options.excludeKeys || null;
  const normalizeLineEndings = options.normalizeLineEndings !== false;

  if (value === undefined || value === null) return null;

  if (typeof value === 'object' && typeof value.toNumber === 'function') {
    return value.toNumber();
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    return normalizeLineEndings ? value.replace(/\r\n/g, '\n') : value;
  }

  if (typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => canonicalizeValue(item, options));
  }

  const out = {};
  const keys = Object.keys(value).sort();
  for (const key of keys) {
    if (excludeKeys && excludeKeys.has(key)) continue;
    const raw = value[key];
    if (raw === undefined || typeof raw === 'function') continue;
    out[key] = canonicalizeValue(raw, options);
  }
  return out;
}

/**
 * Serializes any value into deterministic canonical JSON.
 */
function canonicalStringify(value, options = {}) {
  return JSON.stringify(canonicalizeValue(value, options));
}

/**
 * Computes SHA-256 hex digest over canonicalized JSON or string input.
 */
function sha256Hex(value, options = {}) {
  const payload = typeof value === 'string'
    ? (options.normalizeLineEndings !== false ? value.replace(/\r\n/g, '\n') : value)
    : canonicalStringify(value, options);
  return crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
}

/**
 * Computes deterministic AST fingerprint excluding source positions and comments.
 */
function hashAstNode(astNode) {
  if (!astNode) return null;
  return sha256Hex(astNode, { excludeKeys: AST_NOISE_KEYS });
}

module.exports = {
  VOLATILE_METADATA_KEYS,
  AST_NOISE_KEYS,
  canonicalizeValue,
  canonicalStringify,
  sha256Hex,
  hashAstNode
};
