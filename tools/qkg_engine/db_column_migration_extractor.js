/**
 * Database Column, Access & Schema Migration Extractor (Workstream 4 / QKG-08)
 *
 * Extracts:
 *   1. DatabaseColumn nodes ({table}.{column}, data_type, nullable, is_pk, is_fk)
 *      from Doctrine Entity ORM metadata, SQL DDL files, and optional MariaDB introspection.
 *   2. DatabaseEntity -[:MAPS_TO_COLUMN { property_name, evidence_type: 'DOCTRINE_MAPPING' }]-> DatabaseColumn.
 *   3. Prioritized Method -[:ACCESSES_COLUMN { access_mode, evidence_type, confidence, priority }]-> DatabaseColumn:
 *        Priority 1 (0.90): DOCTRINE_MAPPING (Entity getters/setters + resolved CALLS/typed receiver calls)
 *        Priority 2 (0.80): DQL_QUERYBUILDER (DQL / QueryBuilder entity.property references)
 *        Priority 3 (0.50): RAW_SQL (unambiguous qualified/INSERT/UPDATE table.column references)
 *   4. SchemaMigration nodes (installer/Migration/* & plugin SQL migrations) + MODIFIES_TABLE / MODIFIES_COLUMN.
 */

const fs = require('fs');
const path = require('path');
const {
  WORKSPACE_ROOT,
  ORANGE_HRM_ROOT,
  PLUGINS_DIR,
  toRepoRelPath,
  extractPluginFromPath
} = require('./qkg_config');

function walkFilesFiltered(dir, predicate, out = []) {
  if (!dir || !fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walkFilesFiltered(full, predicate, out);
    } else if (ent.isFile() && predicate(ent.name, full)) {
      out.push(full);
    }
  }
  return out;
}

class DbColumnMigrationExtractor {
  constructor() {
    this._fileLinesCache = new Map();
  }

  _getMethodSlice(relFile, lineStart, lineEnd) {
    if (!relFile || !lineStart || !lineEnd) return '';
    const abs = path.isAbsolute(relFile) ? relFile : path.join(WORKSPACE_ROOT, relFile);
    if (!this._fileLinesCache.has(abs)) {
      if (!fs.existsSync(abs)) {
        this._fileLinesCache.set(abs, []);
      } else {
        this._fileLinesCache.set(abs, fs.readFileSync(abs, 'utf8').split(/\r?\n/));
      }
    }
    const lines = this._fileLinesCache.get(abs);
    const start = Math.max(0, lineStart - 1);
    const end = Math.min(lines.length, lineEnd);
    return lines.slice(start, end).join('\n');
  }

  _normalizeTypeToken(rawType) {
    const t = String(rawType || '').toLowerCase().replace(/\s+/g, '');
    if (!t || t === 'unknown') return 'unknown';
    if (t === 'integer' || t === 'int' || /^int\(\d+\)$/.test(t)) return 'int';
    if (t === 'smallint' || /^smallint\(\d+\)$/.test(t)) return 'smallint';
    if (t === 'bigint' || /^bigint\(\d+\)$/.test(t)) return 'bigint';
    if (t === 'boolean' || t === 'bool' || t === 'tinyint(1)') return 'boolean';
    if (t.startsWith('varchar') || t === 'string') return 'string';
    if (t === 'text' || t === 'longtext' || t === 'mediumtext') return 'text';
    if (t === 'datetime' || t === 'timestamp' || t === 'datetimetz') return 'datetime';
    if (t.startsWith('decimal') || t.startsWith('numeric') || t === 'float' || t === 'double') {
      return t.replace(/^numeric/, 'decimal');
    }
    return t.replace(/\(\d+\)$/, '');
  }

  _upsertColumn(columnsMap, colObj) {
    const tableName = String(colObj.table_name || '').toLowerCase().trim();
    const columnName = String(colObj.column_name || '').toLowerCase().trim();
    if (!tableName || !columnName) return null;
    const columnId = `${tableName}.${columnName}`;
    const incomingSource = colObj.source || 'SQL_DDL';
    const prev = columnsMap.get(columnId) || {
      column_id: columnId,
      table_name: tableName,
      column_name: columnName,
      data_type: 'unknown',
      nullable: true,
      is_pk: false,
      is_fk: false,
      plugin: null,
      source: incomingSource,
      observed_sources: [],
      mariadb_verified: false,
      mariadb_data_type: null,
      mariadb_nullable: null,
      mariadb_is_pk: null,
      mariadb_is_fk: null,
      mariadb_observed_at: null,
      schema_drift_flags: []
    };

    const incomingType = colObj.data_type && colObj.data_type !== 'unknown' ? String(colObj.data_type).toLowerCase() : null;
    const sourcesSet = new Set(prev.observed_sources || []);
    sourcesSet.add(incomingSource);

    // Non-destructive provenance: preserve static DOCTRINE_ORM / SQL_DDL definition as primary source
    const isLiveMariaDb = incomingSource === 'MARIADB_INFO_SCHEMA';
    const nextSource = isLiveMariaDb && prev.observed_sources.length > 0
      ? prev.source
      : (incomingSource === 'DOCTRINE_ORM' || prev.source === 'DOCTRINE_ORM' ? 'DOCTRINE_ORM' : prev.source);

    const nextType = isLiveMariaDb && prev.data_type !== 'unknown'
      ? prev.data_type
      : (prev.data_type === 'unknown' && incomingType ? incomingType : (colObj.preferIncomingType && incomingType ? incomingType : prev.data_type));

    columnsMap.set(columnId, {
      ...prev,
      data_type: nextType,
      nullable: isLiveMariaDb && prev.observed_sources.length > 0
        ? prev.nullable
        : (colObj.nullable !== undefined ? Boolean(colObj.nullable) : prev.nullable),
      is_pk: isLiveMariaDb && prev.observed_sources.length > 0
        ? prev.is_pk
        : Boolean(prev.is_pk || colObj.is_pk),
      is_fk: isLiveMariaDb && prev.observed_sources.length > 0
        ? prev.is_fk
        : Boolean(prev.is_fk || colObj.is_fk),
      plugin: prev.plugin || colObj.plugin || null,
      source: nextSource,
      observed_sources: [...sourcesSet].sort(),
      mariadb_verified: Boolean(prev.mariadb_verified || isLiveMariaDb),
      mariadb_data_type: isLiveMariaDb ? (incomingType || prev.mariadb_data_type) : prev.mariadb_data_type,
      mariadb_nullable: isLiveMariaDb && colObj.nullable !== undefined ? Boolean(colObj.nullable) : prev.mariadb_nullable,
      mariadb_is_pk: isLiveMariaDb && colObj.is_pk !== undefined ? Boolean(colObj.is_pk) : prev.mariadb_is_pk,
      mariadb_is_fk: isLiveMariaDb && colObj.is_fk !== undefined ? Boolean(colObj.is_fk) : prev.mariadb_is_fk,
      mariadb_observed_at: isLiveMariaDb ? (colObj.observed_at || new Date().toISOString()) : prev.mariadb_observed_at,
      schema_drift_flags: colObj.schema_drift_flags || prev.schema_drift_flags
    });
    return columnsMap.get(columnId);
  }

  _reconcileMariaDbRows(columnsMap, fkColumnsSet, liveRows = [], liveFkRows = [], observedAt = new Date().toISOString()) {
    const staticTables = new Set();
    const staticColsMap = new Map();
    for (const col of columnsMap.values()) {
      staticTables.add(col.table_name);
      staticColsMap.set(col.column_id, col);
    }

    const liveTables = new Set();
    const liveColsMap = new Map();
    const liveFkSet = new Set();
    for (const fkRow of liveFkRows || []) {
      const t = String(fkRow.TABLE_NAME || '').toLowerCase();
      const c = String(fkRow.COLUMN_NAME || '').toLowerCase();
      if (t && c) {
        liveFkSet.add(`${t}.${c}`);
        fkColumnsSet.add(`${t}.${c}`);
      }
    }

    const matchedColumns = [];
    const liveOnlyColumns = [];
    const typeMismatches = [];
    const nullabilityMismatches = [];
    const pkMismatches = [];
    const fkMismatches = [];

    for (const row of liveRows || []) {
      const tableName = String(row.TABLE_NAME || '').toLowerCase();
      const colName = String(row.COLUMN_NAME || '').toLowerCase();
      if (!tableName || !colName) continue;
      liveTables.add(tableName);

      const colId = `${tableName}.${colName}`;
      const colKey = String(row.COLUMN_KEY || '').toUpperCase();
      const liveType = String(row.COLUMN_TYPE || row.DATA_TYPE || 'unknown').toLowerCase();
      const liveNullable = String(row.IS_NULLABLE || '').toUpperCase() === 'YES';
      const liveIsPk = colKey === 'PRI';
      const liveIsFk = liveFkSet.has(colId) || fkColumnsSet.has(colId) || colKey === 'MUL';
      liveColsMap.set(colId, { tableName, colName, liveType, liveNullable, liveIsPk, liveIsFk });

      const staticCol = staticColsMap.get(colId);
      const driftFlags = [];
      if (!staticCol) {
        driftFlags.push('LIVE_ONLY_COLUMN');
        liveOnlyColumns.push(colId);
      } else {
        matchedColumns.push(colId);
        const normStatic = this._normalizeTypeToken(staticCol.data_type);
        const normLive = this._normalizeTypeToken(liveType);
        if (normStatic !== 'unknown' && normLive !== 'unknown' && normStatic !== normLive) {
          driftFlags.push('TYPE_MISMATCH');
          typeMismatches.push({ column_id: colId, static_type: staticCol.data_type, mariadb_type: liveType });
        }
        if (Boolean(staticCol.nullable) !== liveNullable && !staticCol.is_pk) {
          driftFlags.push('NULLABILITY_MISMATCH');
          nullabilityMismatches.push({ column_id: colId, static_nullable: staticCol.nullable, mariadb_nullable: liveNullable });
        }
        if (Boolean(staticCol.is_pk) !== liveIsPk) {
          driftFlags.push('PK_MISMATCH');
          pkMismatches.push({ column_id: colId, static_pk: staticCol.is_pk, mariadb_pk: liveIsPk });
        }
        if (Boolean(staticCol.is_fk) !== liveIsFk && liveFkSet.has(colId)) {
          driftFlags.push('FK_MISMATCH');
          fkMismatches.push({ column_id: colId, static_fk: staticCol.is_fk, mariadb_fk: liveIsFk });
        }
      }

      this._upsertColumn(columnsMap, {
        table_name: tableName,
        column_name: colName,
        data_type: liveType,
        nullable: liveNullable,
        is_pk: liveIsPk,
        is_fk: liveIsFk,
        source: 'MARIADB_INFO_SCHEMA',
        observed_at: observedAt,
        schema_drift_flags: driftFlags
      });
    }

    const staticOnlyColumns = [];
    for (const [colId, col] of staticColsMap.entries()) {
      if (!liveColsMap.has(colId)) {
        staticOnlyColumns.push(colId);
        col.schema_drift_flags = [...new Set([...(col.schema_drift_flags || []), 'STATIC_ONLY_COLUMN'])];
      }
    }

    const liveOnlyTables = [...liveTables].filter((t) => !staticTables.has(t)).sort();
    const staticOnlyTables = [...staticTables].filter((t) => !liveTables.has(t)).sort();

    return {
      status: 'RECONCILED',
      observedAt,
      staticTablesCount: staticTables.size,
      liveTablesCount: liveTables.size,
      matchedColumnsCount: matchedColumns.length,
      liveOnlyTablesCount: liveOnlyTables.length,
      staticOnlyTablesCount: staticOnlyTables.length,
      liveOnlyColumnsCount: liveOnlyColumns.length,
      staticOnlyColumnsCount: staticOnlyColumns.length,
      typeMismatchCount: typeMismatches.length,
      nullabilityMismatchCount: nullabilityMismatches.length,
      pkMismatchCount: pkMismatches.length,
      fkMismatchCount: fkMismatches.length,
      samples: {
        liveOnlyTables: liveOnlyTables.slice(0, 20),
        staticOnlyTables: staticOnlyTables.slice(0, 20),
        liveOnlyColumns: liveOnlyColumns.slice(0, 25),
        staticOnlyColumns: staticOnlyColumns.slice(0, 25),
        typeMismatches: typeMismatches.slice(0, 25),
        nullabilityMismatches: nullabilityMismatches.slice(0, 25),
        pkMismatches: pkMismatches.slice(0, 20),
        fkMismatches: fkMismatches.slice(0, 20)
      }
    };
  }

  _parseSqlColumnsAndMigrations(sqlText, plugin, relFile, columnsMap, fkColumnsSet) {
    const affectedTables = new Set();
    const affectedColumns = new Set();

    // Parse CREATE TABLE blocks cleanly using balanced outer parens inside file text
    const createRe = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?((?:ohrm|hs_hr)_[a-z0-9_]+)[`"]?\s*\(/gi;
    let cm;
    while ((cm = createRe.exec(sqlText)) !== null) {
      const tableName = cm[1].toLowerCase();
      affectedTables.add(tableName);

      let depth = 1;
      let idx = createRe.lastIndex;
      const startBody = idx;
      while (idx < sqlText.length && depth > 0) {
        const ch = sqlText[idx];
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        idx++;
      }
      const body = sqlText.slice(startBody, Math.max(startBody, idx - 1));

      // Check inline PRIMARY KEY (`col`) and FOREIGN KEY (`col`)
      const pkCols = new Set();
      for (const pkMatch of body.matchAll(/PRIMARY\s+KEY\s*\(([^)]+)\)/gi)) {
        for (const c of pkMatch[1].split(',')) {
          const clean = c.trim().replace(/[`"]/g, '').toLowerCase();
          if (clean) pkCols.add(clean);
        }
      }
      const fkCols = new Set();
      for (const fkMatch of body.matchAll(/FOREIGN\s+KEY\s*\(\s*[`"]?([a-z0-9_]+)[`"]?\s*\)/gi)) {
        const clean = fkMatch[1].toLowerCase();
        fkCols.add(clean);
        fkColumnsSet.add(`${tableName}.${clean}`);
      }

      for (const rawLine of body.split(/\r?\n/)) {
        const trimmed = rawLine.trim();
        if (!trimmed || trimmed.startsWith('--')) continue;
        if (/^(?:PRIMARY|UNIQUE|KEY|INDEX|CONSTRAINT|FULLTEXT|FOREIGN|CHECK)\b/i.test(trimmed)) continue;
        const colMatch = trimmed.match(/^[`"]?([a-z0-9_]+)[`"]?\s+([a-z]+(?:\s*\([^)]*\))?)/i);
        if (!colMatch) continue;
        const colName = colMatch[1].toLowerCase();
        const dataType = colMatch[2].replace(/\s+/g, '').toLowerCase();
        const isNotNull = /\bNOT\s+NULL\b/i.test(trimmed);
        const isPk = pkCols.has(colName) || /\bPRIMARY\s+KEY\b/i.test(trimmed) || /\bAUTO_INCREMENT\b/i.test(trimmed);
        const isFk = fkCols.has(colName) || fkColumnsSet.has(`${tableName}.${colName}`);

        this._upsertColumn(columnsMap, {
          table_name: tableName,
          column_name: colName,
          data_type: dataType,
          nullable: !isNotNull && !isPk,
          is_pk: isPk,
          is_fk: isFk,
          plugin,
          source: 'SQL_DDL'
        });
        affectedColumns.add(`${tableName}.${colName}`);
      }
    }

    // Parse ALTER TABLE ... ADD [COLUMN] / DROP [COLUMN] / MODIFY / CHANGE
    const alterRe = /ALTER\s+TABLE\s+[`"]?((?:ohrm|hs_hr)_[a-z0-9_]+)[`"]?\s+([^;]+);/gi;
    let am;
    while ((am = alterRe.exec(sqlText)) !== null) {
      const tableName = am[1].toLowerCase();
      affectedTables.add(tableName);
      const clauses = am[2];
      for (const addMatch of clauses.matchAll(/ADD\s+(?:COLUMN\s+)?[`"]?([a-z0-9_]+)[`"]?\s+([a-z]+(?:\s*\([^)]*\))?)/gi)) {
        const colName = addMatch[1].toLowerCase();
        if (['constraint', 'foreign', 'primary', 'unique', 'index', 'key'].includes(colName)) continue;
        this._upsertColumn(columnsMap, {
          table_name: tableName,
          column_name: colName,
          data_type: addMatch[2].replace(/\s+/g, '').toLowerCase(),
          nullable: !/\bNOT\s+NULL\b/i.test(addMatch[0]),
          is_pk: false,
          is_fk: fkColumnsSet.has(`${tableName}.${colName}`),
          plugin,
          source: 'SQL_DDL'
        });
        affectedColumns.add(`${tableName}.${colName}`);
      }
      for (const fkMatch of clauses.matchAll(/FOREIGN\s+KEY\s*\(\s*[`"]?([a-z0-9_]+)[`"]?\s*\)/gi)) {
        const fkCol = fkMatch[1].toLowerCase();
        fkColumnsSet.add(`${tableName}.${fkCol}`);
        affectedColumns.add(`${tableName}.${fkCol}`);
      }
    }

    return {
      affectedTables: [...affectedTables],
      affectedColumns: [...affectedColumns],
      file: relFile
    };
  }

  async _introspectMariaDbColumns(columnsMap, fkColumnsSet) {
    let mysql;
    try {
      mysql = require('mysql2/promise');
    } catch (_) {
      return { connected: false, status: 'UNAVAILABLE', reason: 'mysql2 package not installed', reconciliation: null };
    }

    const host = process.env.MARIADB_HOST || process.env.MYSQL_HOST || '127.0.0.1';
    const port = Number(process.env.MARIADB_PORT || process.env.MYSQL_PORT || 3306);
    const database = process.env.MARIADB_DEFAULT_DB || process.env.MYSQL_DATABASE || 'orangehrm_mysql';
    const user = process.env.MARIADB_USER || process.env.MYSQL_USER || 'root';
    const password = process.env.MARIADB_PASSWORD ?? process.env.MYSQL_PASSWORD ?? '';
    const observedAt = new Date().toISOString();

    let conn;
    try {
      conn = await mysql.createConnection({ host, port, user, password, database, connectTimeout: 3000 });
      const [rows] = await conn.query(
        `SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()`
      );
      const [fkRows] = await conn.query(
        `SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
         FROM information_schema.KEY_COLUMN_USAGE
         WHERE TABLE_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL`
      );
      const reconciliation = this._reconcileMariaDbRows(columnsMap, fkColumnsSet, rows, fkRows, observedAt);
      return {
        connected: true,
        status: 'RECONCILED',
        database,
        observedAt,
        columnRows: rows.length,
        fkRows: fkRows.length,
        reconciliation
      };
    } catch (err) {
      return {
        connected: false,
        status: 'ERROR',
        database,
        observedAt,
        reason: err.message,
        reconciliation: null
      };
    } finally {
      if (conn) {
        try { await conn.end(); } catch (_) {}
      }
    }
  }

  _extractDoctrineMigrations(knownTablesSet, columnsMap) {
    const migrations = [];

    // 1. Installer PHP Doctrine DBAL migrations (V3_3_3 .. V5_8_0)
    const migrationRoot = path.join(ORANGE_HRM_ROOT, 'installer', 'Migration');
    const phpMigrationFiles = walkFilesFiltered(migrationRoot, (name) => name === 'Migration.php');
    for (const absFile of phpMigrationFiles.sort()) {
      const code = fs.readFileSync(absFile, 'utf8');
      const rel = toRepoRelPath(absFile);
      const verMatch = rel.match(/installer\/Migration\/([^/]+)\/Migration\.php/i);
      const version = verMatch ? verMatch[1] : path.basename(path.dirname(absFile));

      const tables = new Set();
      const cols = new Set();

      // Track introspectTable variables ($var = $this->getSchemaManager()->introspectTable('tbl'))
      const tableVarMap = new Map();
      for (const tm of code.matchAll(/\$([a-zA-Z0-9_]+)\s*=\s*\$this->getSchemaManager\(\)->introspectTable\(\s*['"]([^'"]+)['"]\s*\)/g)) {
        const tbl = tm[2].toLowerCase();
        tableVarMap.set(tm[1], tbl);
        tables.add(tbl);
      }

      // Direct SchemaHelper / SchemaManager calls: addColumn('tbl', 'col', ...), dropColumn('tbl', 'col'), changeColumn('tbl', 'col', ...)
      for (const cm of code.matchAll(/->(?:addColumn|dropColumn|changeColumn)\(\s*['"]([a-zA-Z0-9_]+)['"]\s*,\s*['"]([a-zA-Z0-9_]+)['"]/g)) {
        const tbl = cm[1].toLowerCase();
        const col = cm[2].toLowerCase();
        tables.add(tbl);
        cols.add(`${tbl}.${col}`);
      }

      // Table object calls: $tableVar->addColumn('col', ...) / modifyColumn('col', ...) / dropColumn('col') / getColumn('col')
      for (const tm of code.matchAll(/\$([a-zA-Z0-9_]+)->(?:addColumn|modifyColumn|changeColumn|dropColumn|getColumn)\(\s*['"]([a-zA-Z0-9_]+)['"]/g)) {
        const tbl = tableVarMap.get(tm[1]);
        if (tbl) {
          tables.add(tbl);
          cols.add(`${tbl}.${tm[2].toLowerCase()}`);
        }
      }

      // createTable('tbl'), dropTable('tbl'), renameTable('old', 'new'), update('tbl', ...)
      for (const tblCall of code.matchAll(/->(?:createTable|dropTable|update|insert|delete|addForeignKeyConstraint)\(\s*['"]((?:ohrm|hs_hr)_[a-z0-9_]+)['"]/g)) {
        tables.add(tblCall[1].toLowerCase());
      }

      // SQL table/column strings inside custom migration helpers
      for (const alterMatch of code.matchAll(/ALTER\s+TABLE\s+[`"]?((?:ohrm|hs_hr)_[a-z0-9_]+)[`"]?/gi)) {
        tables.add(alterMatch[1].toLowerCase());
      }

      const validTables = [...tables].filter((t) => knownTablesSet.size === 0 || knownTablesSet.has(t));
      const validCols = [...cols].filter((c) => columnsMap.has(c));

      if (validTables.length > 0 || validCols.length > 0) {
        migrations.push({
          migration_id: `migration::${version}`,
          version,
          file: rel,
          migration_kind: 'DOCTRINE_DBAL',
          plugin: 'orangehrmCorePlugin',
          affected_tables: validTables.sort(),
          affected_columns: validCols.sort(),
          introduced_in: 'v1.0'
        });
      }
    }

    // 2. SQL migration files across installer/Migration & plugins/**/migration/*.sql
    const sqlFiles = [
      ...walkFilesFiltered(migrationRoot, (name) => name.endsWith('.sql')),
      ...walkFilesFiltered(PLUGINS_DIR, (name, full) => name.endsWith('.sql') && full.includes(`${path.sep}migration${path.sep}`))
    ];
    for (const absFile of sqlFiles.sort()) {
      const rel = toRepoRelPath(absFile);
      const plugin = extractPluginFromPath(rel) || 'orangehrmCorePlugin';
      const sqlText = fs.readFileSync(absFile, 'utf8');
      const parsed = this._parseSqlColumnsAndMigrations(sqlText, plugin, rel, columnsMap, new Set());
      const version = path.basename(absFile, '.sql');
      migrations.push({
        migration_id: `migration::${plugin}::${version}`,
        version,
        file: rel,
        migration_kind: 'SQL_DDL',
        plugin,
        affected_tables: parsed.affectedTables.sort(),
        affected_columns: parsed.affectedColumns.sort(),
        introduced_in: plugin === 'orangehrmPayrollPlugin' ? 'v2.2-india-payroll' : 'v1.0'
      });
    }

    return migrations;
  }

  _recordColumnAccess(accessMap, edge) {
    const key = `${edge.method_signature}::${edge.column_id}::${edge.access_mode}`;
    const prev = accessMap.get(key);
    // Lower priority number wins (Priority 1 DOCTRINE_MAPPING > Priority 2 DQL_QUERYBUILDER > Priority 3 RAW_SQL)
    if (!prev || edge.priority < prev.priority || (edge.priority === prev.priority && edge.confidence > prev.confidence)) {
      accessMap.set(key, edge);
    }
  }

  async extractAll({ prodParsedFiles = [], fkEdges = [], callEdges = [], connectMariaDb = true } = {}) {
    const columnsMap = new Map();
    const fkColumnsSet = new Set();
    for (const fk of fkEdges) {
      if (fk.from_table && fk.from_column) {
        fkColumnsSet.add(`${String(fk.from_table).toLowerCase()}.${String(fk.from_column).toLowerCase()}`);
      }
    }

    // 1. Seed DatabaseColumns + Entity MAPS_TO_COLUMN from Doctrine Entity AST metadata
    const entityColumnMaps = [];
    const propToColByEntity = new Map();
    const tableByEntity = new Map();
    const entityFqcnByShortName = new Map();

    for (const pf of prodParsedFiles) {
      for (const cls of pf.classes || []) {
        if (!cls.isOrmEntity || !cls.tableName) continue;
        const tableName = cls.tableName.toLowerCase();
        const plugin = extractPluginFromPath(cls.source_file) || 'orangehrmCorePlugin';
        tableByEntity.set(cls.fqcn, tableName);
        if (!entityFqcnByShortName.has(cls.name)) {
          entityFqcnByShortName.set(cls.name, cls.fqcn);
        }

        const propMap = new Map();
        propToColByEntity.set(cls.fqcn, propMap);

        for (const col of cls.ormColumns || []) {
          const isFk = Boolean(col.isFk || fkColumnsSet.has(`${tableName}.${col.columnName}`));
          const colNode = this._upsertColumn(columnsMap, {
            table_name: tableName,
            column_name: col.columnName,
            data_type: col.dataType,
            nullable: col.nullable,
            is_pk: col.isPk,
            is_fk: isFk,
            plugin,
            source: 'DOCTRINE_ORM'
          });
          if (!colNode) continue;

          propMap.set(col.propertyName.toLowerCase(), {
            property_name: col.propertyName,
            table_name: tableName,
            column_name: col.columnName,
            column_id: colNode.column_id
          });

          entityColumnMaps.push({
            entity_fqcn: cls.fqcn,
            table_name: tableName,
            property_name: col.propertyName,
            column_id: colNode.column_id,
            evidence_type: 'DOCTRINE_MAPPING',
            confidence: 0.95
          });
        }
      }
    }

    // 2. Parse SQL migrations first so columns & migrations share authoritative DDL metadata
    const installerSqlFiles = walkFilesFiltered(path.join(ORANGE_HRM_ROOT, 'installer'), (n) => n.endsWith('.sql'));
    const pluginSqlFiles = walkFilesFiltered(PLUGINS_DIR, (n) => n.endsWith('.sql'));
    for (const absSql of [...installerSqlFiles, ...pluginSqlFiles]) {
      const rel = toRepoRelPath(absSql);
      const plugin = extractPluginFromPath(rel) || 'orangehrmCorePlugin';
      const sqlText = fs.readFileSync(absSql, 'utf8');
      this._parseSqlColumnsAndMigrations(sqlText, plugin, rel, columnsMap, fkColumnsSet);
    }

    // 3. Optional live MariaDB information_schema.COLUMNS reconciliation
    const mariaDbStatus = connectMariaDb
      ? await this._introspectMariaDbColumns(columnsMap, fkColumnsSet)
      : { connected: false, status: 'SKIPPED_BY_OPTION', reason: 'SKIPPED_BY_OPTION', reconciliation: null };

    // Build table -> valid column names lookup for Priority 3 RAW_SQL guard
    const columnsByTable = new Map();
    const knownTablesSet = new Set();
    for (const col of columnsMap.values()) {
      knownTablesSet.add(col.table_name);
      if (!columnsByTable.has(col.table_name)) columnsByTable.set(col.table_name, new Set());
      columnsByTable.get(col.table_name).add(col.column_name);
    }

    // 4. SchemaMigration extraction
    const migrations = this._extractDoctrineMigrations(knownTablesSet, columnsMap);

    // 5. Prioritized Method -> DatabaseColumn ACCESSES_COLUMN edges
    const accessMap = new Map();
    const entityAccessorBySig = new Map(); // Entity getter/setter signature -> { column_id, access_mode }

    // Pass A: Direct Entity getter/setter/is* methods (Priority 1: DOCTRINE_MAPPING, 0.90)
    for (const pf of prodParsedFiles) {
      for (const cls of pf.classes || []) {
        const propMap = propToColByEntity.get(cls.fqcn);
        if (!propMap) continue;
        for (const method of cls.methods || []) {
          const m = method.name.match(/^(get|set|is)([A-Z][A-Za-z0-9_]*)$/);
          if (!m) continue;
          const opPrefix = m[1];
          const propLower = m[2].toLowerCase();
          const colRef = propMap.get(propLower);
          if (!colRef) continue;
          const accessMode = opPrefix === 'set' ? 'WRITE' : 'READ';
          entityAccessorBySig.set(method.signature, {
            column_id: colRef.column_id,
            access_mode: accessMode
          });
          this._recordColumnAccess(accessMap, {
            method_signature: method.signature,
            column_id: colRef.column_id,
            access_mode: accessMode,
            evidence_type: 'DOCTRINE_MAPPING',
            confidence: 0.90,
            priority: 1
          });
        }
      }
    }

    // Pass B: Resolved CALLS into Entity accessors -> propagate Priority 1 directly to caller Service/Dao/Controller methods
    for (const edge of callEdges || []) {
      const target = entityAccessorBySig.get(edge.callee);
      if (!target) continue;
      this._recordColumnAccess(accessMap, {
        method_signature: edge.caller,
        column_id: target.column_id,
        access_mode: target.access_mode,
        evidence_type: 'DOCTRINE_MAPPING',
        confidence: 0.90,
        priority: 1
      });
    }

    // Pass C: Method-level typed receiver getter/setter, Priority 2 DQL_QUERYBUILDER, Priority 3 RAW_SQL
    for (const pf of prodParsedFiles) {
      for (const cls of pf.classes || []) {
        const isEntityClass = propToColByEntity.has(cls.fqcn);
        for (const method of cls.methods || []) {
          // C1: Direct rawCall on Entity variable (Priority 1 DOCTRINE_MAPPING)
          for (const rc of method.rawCalls || []) {
            const targetFqcn = rc.receiver?.fqcn || rc.targetFqcn;
            const propMap = targetFqcn ? propToColByEntity.get(targetFqcn) : null;
            if (!propMap || !rc.methodName) continue;
            const gm = rc.methodName.match(/^(get|set|is)([A-Z][A-Za-z0-9_]*)$/);
            if (!gm) continue;
            const colRef = propMap.get(gm[2].toLowerCase());
            if (!colRef) continue;
            this._recordColumnAccess(accessMap, {
              method_signature: method.signature,
              column_id: colRef.column_id,
              access_mode: gm[1] === 'set' ? 'WRITE' : 'READ',
              evidence_type: 'DOCTRINE_MAPPING',
              confidence: 0.90,
              priority: 1
            });
          }

          if (isEntityClass) continue;

          // C2: Priority 2 DQL / QueryBuilder (`0.80`)
          const dqlEntityFqcns = new Set();
          for (const hint of method.dqlHints || []) {
            if (hint.entityFqcn && propToColByEntity.has(hint.entityFqcn)) {
              dqlEntityFqcns.add(hint.entityFqcn);
            }
          }
          // Also check typed locals or class useMap when method invokes QueryBuilder methods
          const calledNames = new Set((method.rawCalls || []).map((c) => c.methodName));
          const hasQbCall = calledNames.has('createQueryBuilder') || calledNames.has('createQuery') ||
            calledNames.has('andWhere') || calledNames.has('where') || calledNames.has('select');

          let slice = null;
          if (dqlEntityFqcns.size > 0 || hasQbCall) {
            slice = this._getMethodSlice(method.source_file || pf.file, method.line_start, method.line_end);

            // Detect Entity references via Entity::class in useMap when dqlHints missed
            for (const em of slice.matchAll(/\b([A-Z][A-Za-z0-9_]*)::class\b/g)) {
              const resolved = (cls.useMap && cls.useMap[em[1]]) || entityFqcnByShortName.get(em[1]);
              if (resolved && propToColByEntity.has(resolved)) {
                dqlEntityFqcns.add(resolved);
              }
            }

            if (dqlEntityFqcns.size > 0) {
              // Map QueryBuilder alias -> entityFqcn (`from(Emp::class, 'employee')` / `FROM OrangeHRM\...\Emp e`)
              const aliasToEntity = new Map();
              for (const fm of slice.matchAll(/from\(\s*([A-Za-z0-9_\\]+)::class\s*,\s*['"]([a-zA-Z0-9_]+)['"]/g)) {
                const rawRef = fm[1];
                const fqcn = (cls.useMap && cls.useMap[rawRef]) || entityFqcnByShortName.get(rawRef);
                if (fqcn && propToColByEntity.has(fqcn)) aliasToEntity.set(fm[2], fqcn);
              }
              for (const dqlFrom of slice.matchAll(/\bFROM\s+([A-Za-z0-9_\\]+)\s+(?:AS\s+)?([a-zA-Z0-9_]+)\b/gi)) {
                const fqcn = propToColByEntity.has(dqlFrom[1]) ? dqlFrom[1] : null;
                if (fqcn) aliasToEntity.set(dqlFrom[2], fqcn);
              }
              for (const joinM of slice.matchAll(/(?:leftJoin|innerJoin|join)\(\s*['"][a-zA-Z0-9_]+\.([a-zA-Z0-9_]+)['"]\s*,\s*['"]([a-zA-Z0-9_]+)['"]/g)) {
                // Check if alias target exists in entityFqcnByShortName or unique property
                const cand = entityFqcnByShortName.get(joinM[1].replace(/^./, (c) => c.toUpperCase()));
                if (cand && propToColByEntity.has(cand)) aliasToEntity.set(joinM[2], cand);
              }

              const fallbackEntity = dqlEntityFqcns.size === 1 ? [...dqlEntityFqcns][0] : null;
              const isDqlUpdate = /\bUPDATE\b/i.test(slice) || slice.includes('->update(');

              // Match alias.property in quoted DQL/QueryBuilder strings ONLY
              for (const strLit of slice.matchAll(/['"]([^'"]*[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+[^'"]*)['"]/g)) {
                const inner = strLit[1];
                // Skip if string is clearly raw SQL table prefix
                if (/\b(?:ohrm|hs_hr)_[a-z0-9_]+\./i.test(inner)) continue;
                for (const propRef of inner.matchAll(/\b([a-zA-Z][a-zA-Z0-9_]*)\.([a-z][a-zA-Z0-9_]*)\b/g)) {
                  const alias = propRef[1];
                  const prop = propRef[2].toLowerCase();
                  const targetEntity = aliasToEntity.get(alias) || (dqlEntityFqcns.size === 1 && !['this', 'q', 'qb'].includes(alias) ? fallbackEntity : null);
                  if (!targetEntity) continue;
                  const propMap = propToColByEntity.get(targetEntity);
                  const colRef = propMap && propMap.get(prop);
                  if (!colRef) continue;
                  const mode = isDqlUpdate && (inner.includes(`${alias}.${propRef[2]}`) && /\bSET\b|->set\(/i.test(slice)) ? 'WRITE' : 'READ';
                  this._recordColumnAccess(accessMap, {
                    method_signature: method.signature,
                    column_id: colRef.column_id,
                    access_mode: mode,
                    evidence_type: 'DQL_QUERYBUILDER',
                    confidence: 0.80,
                    priority: 2
                  });
                }
              }
            }
          }

          // C3: Priority 3 RAW_SQL (`0.50`) — unambiguous table.column, UPDATE tbl SET col=, INSERT INTO tbl (cols)
          const rawSqlHints = (method.dqlHints || []).filter((h) => h.kind === 'RAW_SQL_TABLE');
          const mayHaveSql = rawSqlHints.length > 0 || calledNames.has('executeQuery') || calledNames.has('executeStatement') || calledNames.has('prepare');
          if (mayHaveSql) {
            if (slice === null) {
              slice = this._getMethodSlice(method.source_file || pf.file, method.line_start, method.line_end);
            }
            if (/\b(?:ohrm_|hs_hr_)[a-z0-9_]+\b/i.test(slice)) {
              const isSqlWrite = /\b(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM)\b/i.test(slice);

              // Explicit table.column
              for (const tcMatch of slice.matchAll(/\b((?:ohrm|hs_hr)_[a-z0-9_]+)\.([a-z0-9_]+)\b/gi)) {
                const tbl = tcMatch[1].toLowerCase();
                const col = tcMatch[2].toLowerCase();
                if (columnsByTable.get(tbl)?.has(col)) {
                  this._recordColumnAccess(accessMap, {
                    method_signature: method.signature,
                    column_id: `${tbl}.${col}`,
                    access_mode: isSqlWrite ? 'WRITE' : 'READ',
                    evidence_type: 'RAW_SQL',
                    confidence: 0.50,
                    priority: 3
                  });
                }
              }

              // INSERT INTO tbl (col1, col2, ...)
              for (const insMatch of slice.matchAll(/\bINSERT\s+INTO\s+[`"]?((?:ohrm|hs_hr)_[a-z0-9_]+)[`"]?\s*\(([^)]+)\)/gi)) {
                const tbl = insMatch[1].toLowerCase();
                const validCols = columnsByTable.get(tbl);
                if (!validCols) continue;
                for (const c of insMatch[2].split(',')) {
                  const col = c.trim().replace(/[`"]/g, '').toLowerCase();
                  if (validCols.has(col)) {
                    this._recordColumnAccess(accessMap, {
                      method_signature: method.signature,
                      column_id: `${tbl}.${col}`,
                      access_mode: 'WRITE',
                      evidence_type: 'RAW_SQL',
                      confidence: 0.50,
                      priority: 3
                    });
                  }
                }
              }

              // UPDATE tbl SET col1 = ..., col2 = ...
              for (const updMatch of slice.matchAll(/\bUPDATE\s+[`"]?((?:ohrm|hs_hr)_[a-z0-9_]+)[`"]?(?:\s+(?:AS\s+)?[a-z0-9_]+)?\s+SET\s+([^;'"`]+?)(?:\bWHERE\b|$)/gi)) {
                const tbl = updMatch[1].toLowerCase();
                const validCols = columnsByTable.get(tbl);
                if (!validCols) continue;
                for (const assign of updMatch[2].matchAll(/\b(?:[a-z0-9_]+\.)?[`"]?([a-z0-9_]+)[`"]?\s*=/gi)) {
                  const col = assign[1].toLowerCase();
                  if (validCols.has(col)) {
                    this._recordColumnAccess(accessMap, {
                      method_signature: method.signature,
                      column_id: `${tbl}.${col}`,
                      access_mode: 'WRITE',
                      evidence_type: 'RAW_SQL',
                      confidence: 0.50,
                      priority: 3
                    });
                  }
                }
              }
            }
          }
        }
      }
    }

    const columnAccessEdges = [...accessMap.values()];
    return {
      columns: [...columnsMap.values()],
      entityColumnMaps,
      columnAccessEdges,
      migrations,
      diagnostics: {
        columnCount: columnsMap.size,
        entityColumnMapCount: entityColumnMaps.length,
        columnAccessEdgeCount: columnAccessEdges.length,
        priority1Count: columnAccessEdges.filter((e) => e.priority === 1).length,
        priority2Count: columnAccessEdges.filter((e) => e.priority === 2).length,
        priority3Count: columnAccessEdges.filter((e) => e.priority === 3).length,
        migrationCount: migrations.length,
        mariaDbStatus
      }
    };
  }
}

module.exports = DbColumnMigrationExtractor;
