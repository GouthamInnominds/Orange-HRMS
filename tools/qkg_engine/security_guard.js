/**
 * Shared Security & Governance Guardrails (Phase 5A/5C - P5-06)
 *
 * Single source of truth for:
 *   - Defense-in-depth read-only Cypher validation + LIMIT enforcement
 *   - Defense-in-depth read-only SQL validation + identifier allowlisting
 *   - PII / secret field & credential redaction across logs, SQL/Cypher outputs & MCP/REST envelopes
 */

const SENSITIVE_KEY_RE = /^(password|passwd|api_?key|secret|token|access_?token|refresh_?token|private_?key|aadhaar|aadhaar_?no|aadhaar_?number|pan|pan_?num|pan_?number|bank_?account|account_?number|ifsc|salary|basic_?salary|gross_?salary|net_?salary|ctc|epf|esic|uan|email|work_?email|other_?email|phone|mobile|ssn|emp_?ssn_?num|emp_?dri_?lice_?num|emp_?firstname|emp_?lastname|emp_?middle_?name|user_?password|authorization|hash)$/i;
const SENSITIVE_VALUE_RE = /\b(sk-[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9]{12,}|Bearer\s+[A-Za-z0-9._-]{12,}|[A-Z]{5}[0-9]{4}[A-Z])\b/g;
const URI_CREDS_RE = /([a-z][a-z0-9+.-]*:\/\/)([^:/\s@]+):([^@/\s]+)@/gi;

const READ_ONLY_CYPHER_START_RE = /^(?:(?:MATCH|OPTIONAL\s+MATCH|WITH|UNWIND|RETURN|SHOW|EXPLAIN)\b|CALL\s+(?:db\.labels|db\.relationshipTypes|db\.propertyKeys|db\.schema\b|\{))/i;
const FORBIDDEN_CYPHER_RE = /\b(CREATE|MERGE|DELETE|DETACH|SET|REMOVE|DROP|FOREACH|LOAD\s+CSV|IMPORT|EXPORT|TERMINATE|ALTER|GRANT|REVOKE|DENY|RENAME)\b/i;
const FORBIDDEN_PROC_RE = /\bCALL\s+(dbms\.|apoc\.periodic\.|apoc\.create\.|apoc\.merge\.|apoc\.refactor\.|apoc\.export\.|apoc\.import\.|apoc\.load\.|apoc\.cypher\.runWrite|db\.create|db\.index\.\w+\.drop)/i;
const INTERNAL_ID_FN_RE = /\b(id|elementId)\s*\(/i;

const SQL_IDENT_RE = /^[A-Za-z0-9_]+$/;
const READ_ONLY_SQL_START_RE = /^(SELECT|SHOW|DESCRIBE|DESC|EXPLAIN)\b/i;
const FORBIDDEN_SQL_RE = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|REPLACE|RENAME|GRANT|REVOKE|SET\s+GLOBAL|INTO\s+OUTFILE|INTO\s+DUMPFILE|LOAD\s+DATA|LOAD_FILE|FOR\s+UPDATE|LOCK\s+IN\s+SHARE\s+MODE|CALL|EXECUTE|PREPARE|DEALLOCATE)\b/i;

function sanitizeString(str) {
  return String(str)
    .replace(SENSITIVE_VALUE_RE, '[REDACTED_SECRET]')
    .replace(URI_CREDS_RE, '$1[REDACTED_SECRET]:[REDACTED_SECRET]@');
}

function sanitizePayload(value, depth = 0) {
  if (depth > 20 || value === null || value === undefined) return value;
  if (typeof value === 'string') return sanitizeString(value);
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((item) => sanitizePayload(item, depth + 1));
  if (typeof value.toNumber === 'function') return value.toNumber();

  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (SENSITIVE_KEY_RE.test(k)) {
      out[k] = '[REDACTED]';
    } else {
      out[k] = sanitizePayload(v, depth + 1);
    }
  }
  return out;
}

/**
 * Strips string literals and comments (both Cypher // / /* * / and SQL -- / # / /* * /).
 */
function stripQuotedAndComments(query, { supportHashComment = false, commentReplacement = ' ' } = {}) {
  let out = '';
  let i = 0;
  while (i < query.length) {
    const ch = query[i];
    const next = query[i + 1];

    if (ch === '/' && next === '*') {
      const end = query.indexOf('*/', i + 2);
      i = end === -1 ? query.length : end + 2;
      out += commentReplacement;
      continue;
    }
    if ((ch === '/' && next === '/') || (ch === '-' && next === '-') || (supportHashComment && ch === '#')) {
      const nl = query.indexOf('\n', i + 1);
      i = nl === -1 ? query.length : nl + 1;
      out += '\n';
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      const quote = ch;
      i++;
      while (i < query.length) {
        if (query[i] === '\\') {
          i += 2;
          continue;
        }
        if (query[i] === quote) {
          i++;
          break;
        }
        i++;
      }
      out += ' __STR__ ';
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

function validateReadOnlyCypher(cypher, maxLimit = 100) {
  const raw = String(cypher || '').trim();
  if (!raw) throw new Error('Cypher query cannot be empty');
  if (raw.length > 4000) throw new Error('Cypher query exceeds maximum length of 4000 characters');

  const stripped = stripQuotedAndComments(raw).trim().replace(/;+\s*$/, '');
  const compactStripped = stripQuotedAndComments(raw, { commentReplacement: '' }).trim().replace(/;+\s*$/, '');
  if (!stripped) throw new Error('Cypher query contains no executable clauses');
  if (stripped.includes(';')) {
    throw new Error('Multi-statement Cypher queries are not permitted');
  }
  if (!READ_ONLY_CYPHER_START_RE.test(stripped)) {
    throw new Error('Only allowlisted read-only Cypher clauses (MATCH/OPTIONAL MATCH/WITH/UNWIND/RETURN/SHOW/EXPLAIN) are permitted');
  }
  if (FORBIDDEN_CYPHER_RE.test(stripped) || FORBIDDEN_CYPHER_RE.test(compactStripped)) {
    throw new Error('Security Policy Violation: Mutating or administrative Cypher clauses are strictly prohibited');
  }
  if (FORBIDDEN_PROC_RE.test(stripped) || FORBIDDEN_PROC_RE.test(compactStripped)) {
    throw new Error('Security Policy Violation: Privileged or mutating Neo4j procedures are strictly prohibited');
  }
  if (INTERNAL_ID_FN_RE.test(stripped) || INTERNAL_ID_FN_RE.test(compactStripped)) {
    throw new Error('Governance Policy Violation: Never expose Neo4j internal node id() or elementId(); return canonical domain keys instead');
  }

  let boundedQuery = raw.replace(/;+\s*$/, '');
  const limitNumMatch = stripped.match(/\bLIMIT\s+(\d+)\s*$/i);
  const limitParamMatch = stripped.match(/\bLIMIT\s+\$[A-Za-z_][A-Za-z0-9_]*\s*$/i);
  let limitApplied = null;
  if (limitNumMatch) {
    const requested = parseInt(limitNumMatch[1], 10);
    if (requested > maxLimit) {
      boundedQuery = boundedQuery.replace(/LIMIT\s+\d+\s*$/i, `LIMIT ${maxLimit}`);
      limitApplied = maxLimit;
    } else {
      limitApplied = requested;
    }
  } else if (limitParamMatch) {
    limitApplied = 'parameterized';
  } else if (/\bRETURN\b/i.test(stripped) && !/^\s*(EXPLAIN|SHOW)\b/i.test(stripped)) {
    boundedQuery = `${boundedQuery}\nLIMIT ${Math.min(50, maxLimit)}`;
    limitApplied = Math.min(50, maxLimit);
  }

  return { valid: true, query: boundedQuery, limitApplied };
}

function validateSqlIdentifier(name, kind = 'identifier') {
  const clean = String(name || '').trim();
  if (!SQL_IDENT_RE.test(clean)) {
    throw new Error(`Invalid SQL ${kind}: '${clean}'`);
  }
  return clean;
}

function validateReadOnlySql(sql, maxLimit = 100) {
  const raw = String(sql || '').trim();
  if (!raw) throw new Error('SQL query cannot be empty');
  if (raw.length > 4000) throw new Error('SQL query exceeds maximum length of 4000 characters');

  const stripped = stripQuotedAndComments(raw, { supportHashComment: true }).trim().replace(/;+\s*$/, '');
  const compactStripped = stripQuotedAndComments(raw, { supportHashComment: true, commentReplacement: '' }).trim().replace(/;+\s*$/, '');
  if (!stripped) throw new Error('SQL query contains no executable clauses');
  if (stripped.includes(';')) {
    throw new Error('Security Violation: Multi-statement SQL queries are not permitted');
  }
  if (!READ_ONLY_SQL_START_RE.test(stripped)) {
    throw new Error('Security Violation: Only read-only queries (SELECT, SHOW, DESCRIBE, EXPLAIN) are permitted.');
  }
  if (FORBIDDEN_SQL_RE.test(stripped) || FORBIDDEN_SQL_RE.test(compactStripped)) {
    throw new Error('Security Violation: Write, locking, file-IO, or procedural SQL clauses are strictly prohibited.');
  }

  let boundedSql = raw.replace(/;+\s*$/, '');
  let limitApplied = null;
  const limitMatch = stripped.match(/\bLIMIT\s+(\d+)(?:\s*(?:,|OFFSET)\s*\d+)?\s*$/i);
  if (limitMatch) {
    const requested = parseInt(limitMatch[1], 10);
    if (requested > maxLimit) {
      boundedSql = boundedSql.replace(/\bLIMIT\s+\d+/i, `LIMIT ${maxLimit}`);
      limitApplied = maxLimit;
    } else {
      limitApplied = requested;
    }
  } else if (/^\s*SELECT\b/i.test(stripped)) {
    boundedSql += ` LIMIT ${Math.min(100, maxLimit)}`;
    limitApplied = Math.min(100, maxLimit);
  }

  return { valid: true, sql: boundedSql, limitApplied };
}

module.exports = {
  SENSITIVE_KEY_RE,
  SENSITIVE_VALUE_RE,
  SQL_IDENT_RE,
  sanitizePayload,
  stripQuotedAndComments,
  validateReadOnlyCypher,
  validateReadOnlySql,
  validateSqlIdentifier
};
