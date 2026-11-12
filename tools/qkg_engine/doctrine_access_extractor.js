/**
 * Doctrine & SQL Data-Access Extractor (Phase 2.2)
 *
 * Extracts READS_TABLE and WRITES_TABLE relationships from production PHP Methods
 * across ALL 23 plugins + src/lib using:
 *  1. Doctrine Repository / QueryBuilder DQL hints (DOCTRINE_MAPPING, DQL_QUERYBUILDER)
 *  2. Doctrine EntityManager persist() / remove() / flush() on typed entities (DOCTRINE_PERSISTENCE)
 *  3. Raw SQL statements inside method line ranges (RAW_SQL)
 */

const fs = require('fs');
const path = require('path');
const { WORKSPACE_ROOT } = require('./qkg_config');

const WRITE_QUERY_METHODS = new Set(['update', 'delete', 'insert', 'executeStatement']);

class DoctrineAccessExtractor {
  _buildEntityLookup(prodParsedFiles) {
    const entityFqcnToTable = new Map();
    const shortNameToTable = new Map();
    const knownTables = new Set();

    for (const pf of prodParsedFiles) {
      for (const cls of pf.classes || []) {
        if (!cls.tableName) continue;
        const tbl = cls.tableName.toLowerCase();
        entityFqcnToTable.set(cls.fqcn, tbl);
        shortNameToTable.set(cls.name, tbl);
        knownTables.add(tbl);
      }
    }
    return { entityFqcnToTable, shortNameToTable, knownTables };
  }

  _recordEdge(edgeMap, methodSig, tableName, relation, evidenceType, confidence) {
    if (!methodSig || !tableName) return;
    const cleanTable = tableName.toLowerCase();
    const key = `${methodSig}|${relation}|${cleanTable}`;
    const prev = edgeMap.get(key);
    if (!prev || confidence > prev.confidence) {
      edgeMap.set(key, {
        method_signature: methodSig,
        table_name: cleanTable,
        relation,
        access_type: relation === 'WRITES_TABLE' ? 'WRITE' : 'READ',
        evidence_type: evidenceType,
        confidence
      });
    }
  }

  _resolveEntityTable(entityFqcn, entityFqcnToTable, shortNameToTable) {
    if (!entityFqcn) return null;
    if (entityFqcnToTable.has(entityFqcn)) return entityFqcnToTable.get(entityFqcn);
    const shortName = entityFqcn.split('\\').pop();
    return shortNameToTable.get(shortName) || null;
  }

  extractAll({ prodParsedFiles = [], knownTables = [], symbolResolver = null } = {}) {
    const { entityFqcnToTable, shortNameToTable, knownTables: entityTables } = this._buildEntityLookup(prodParsedFiles);
    const validTableSet = new Set([...entityTables, ...knownTables.map((t) => String(t).toLowerCase())]);
    const fileLinesCache = new Map();

    const getMethodSourceSlice = (relFile, lineStart, lineEnd) => {
      if (!relFile || !lineStart) return '';
      if (!fileLinesCache.has(relFile)) {
        const abs = path.join(WORKSPACE_ROOT, relFile);
        fileLinesCache.set(
          relFile,
          fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8').split(/\r?\n/) : []
        );
      }
      const lines = fileLinesCache.get(relFile);
      const start = Math.max(0, lineStart - 1);
      const end = Math.min(lines.length, lineEnd || lines.length);
      return lines.slice(start, end).join('\n');
    };

    const edgeMap = new Map();

    for (const pf of prodParsedFiles) {
      const owners = [...(pf.classes || []), ...(pf.traits || [])];
      for (const owner of owners) {
        for (const method of owner.methods || []) {
          const sig = method.signature;
          if (!sig) continue;

          const calledNames = new Set((method.rawCalls || []).map((c) => c.methodName).filter(Boolean));
          const hasQueryWriteCall =
            calledNames.has('update') ||
            calledNames.has('delete') ||
            calledNames.has('executeStatement');

          // 1. DQL & Repository hints
          for (const hint of method.dqlHints || []) {
            const tbl = this._resolveEntityTable(hint.entityFqcn, entityFqcnToTable, shortNameToTable);
            if (!tbl) continue;

            if (hint.mode === 'WRITE' || hasQueryWriteCall) {
              this._recordEdge(
                edgeMap,
                sig,
                tbl,
                'WRITES_TABLE',
                hint.evidence_type || 'DQL_QUERYBUILDER',
                0.9
              );
            } else {
              this._recordEdge(
                edgeMap,
                sig,
                tbl,
                'READS_TABLE',
                hint.evidence_type || 'DOCTRINE_MAPPING',
                hint.evidence_type === 'DOCTRINE_MAPPING' ? 0.95 : 0.9
              );
            }
          }

          // 2. Doctrine persist / remove / raw Entity instantiations in DAO/Service/Adapter
          const hasPersistOrRemove = calledNames.has('persist') || calledNames.has('remove') || calledNames.has('flush');
          if (hasPersistOrRemove) {
            const candidateEntities = new Set(method.instantiations || []);
            for (const p of method.parameters || []) {
              if (p.type_fqcn) candidateEntities.add(p.type_fqcn);
            }
            for (const v of Object.values(method.localVarTypes || {})) {
              if (!v) continue;
              if (v.kind === 'STATIC_TYPE' && v.fqcn) {
                candidateEntities.add(v.fqcn);
              } else if (symbolResolver) {
                const resolvedFqcn = symbolResolver._resolveExprType(v, owner, method, new Set());
                if (resolvedFqcn) candidateEntities.add(resolvedFqcn);
              }
            }
            // Also check resolved return types of getter calls on entities (e.g. $link->getClaimRequest()) followed by persist()
            if (symbolResolver) {
              for (const rc of method.rawCalls || []) {
                if (rc.methodName && rc.methodName.startsWith('get')) {
                  const res = symbolResolver._resolveSingleCall(rc, owner, method, new Set());
                  if (res && res.targetMethod && res.targetMethod.return_type_fqcn) {
                    candidateEntities.add(res.targetMethod.return_type_fqcn);
                  } else if (rc.methodName.length > 3) {
                    const guessedEntityName = rc.methodName.slice(3);
                    const importedEntityFqcn = owner.useMap && owner.useMap[guessedEntityName];
                    if (importedEntityFqcn && entityFqcnToTable.has(importedEntityFqcn)) {
                      candidateEntities.add(importedEntityFqcn);
                    }
                  }
                }
              }
            }
            // Fallback to method.dqlHints entities if updated & flushed in the same method
            for (const hint of method.dqlHints || []) {
              if (hint.entityFqcn) candidateEntities.add(hint.entityFqcn);
            }
            for (const entFqcn of candidateEntities) {
              const tbl = this._resolveEntityTable(entFqcn, entityFqcnToTable, shortNameToTable);
              if (tbl) {
                this._recordEdge(edgeMap, sig, tbl, 'WRITES_TABLE', 'DOCTRINE_PERSISTENCE', 0.9);
              }
            }
          }

          // 3. Raw SQL patterns inside method body (when SQL keywords appear)
          const mayContainSql = calledNames.has('executeQuery') ||
            calledNames.has('executeStatement') ||
            calledNames.has('prepare') ||
            calledNames.has('createNativeQuery') ||
            WRITE_QUERY_METHODS.has(method.name);

          if (mayContainSql) {
            const slice = getMethodSourceSlice(method.source_file || pf.file, method.line_start, method.line_end);
            if (/\b(?:ohrm_|hs_hr_)[a-z0-9_]+\b/i.test(slice)) {
              const writeSqlRe = /\b(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM)\s+[`"]?((?:ohrm|hs_hr)_[a-z0-9_]+)[`"]?/gi;
              const readSqlRe = /\b(?:FROM|JOIN)\s+[`"]?((?:ohrm|hs_hr)_[a-z0-9_]+)[`"]?/gi;
              let rm;
              while ((rm = writeSqlRe.exec(slice)) !== null) {
                const t = rm[1].toLowerCase();
                if (validTableSet.size === 0 || validTableSet.has(t)) {
                  this._recordEdge(edgeMap, sig, t, 'WRITES_TABLE', 'RAW_SQL', 0.9);
                }
              }
              while ((rm = readSqlRe.exec(slice)) !== null) {
                const t = rm[1].toLowerCase();
                if (validTableSet.size === 0 || validTableSet.has(t)) {
                  this._recordEdge(edgeMap, sig, t, 'READS_TABLE', 'RAW_SQL', 0.85);
                }
              }
            }
          }
        }
      }
    }

    const edges = [...edgeMap.values()];
    return {
      tableAccessEdges: edges,
      diagnostics: {
        totalAccessEdges: edges.length,
        readsCount: edges.filter((e) => e.relation === 'READS_TABLE').length,
        writesCount: edges.filter((e) => e.relation === 'WRITES_TABLE').length
      }
    };
  }
}

module.exports = DoctrineAccessExtractor;
