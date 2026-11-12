/**
 * Database Schema, Entity Mapping & Foreign-Key Extractor (Phase 2.2)
 *
 * Combines:
 *  1. Doctrine ORM @ORM\Table + @ORM\JoinColumn metadata parsed from PHP Entities (all 23 plugins)
 *  2. SQL DDL migrations (orange_hrm/src/plugins/ * /migration/*.sql & installer *.sql)
 *  3. Live MariaDB introspection (information_schema.KEY_COLUMN_USAGE) when reachable
 *
 * Produces DatabaseTable nodes, IS_ENTITY/MAPS_TO entity links, and cross-module
 * FK_REFERENCES edges (e.g. ohrm_payroll_claim_link -> ohrm_claim_request, hs_hr_employee).
 */

const fs = require('fs');
const path = require('path');
const { ORANGE_HRM_ROOT, PLUGINS_DIR, extractPluginFromPath } = require('./qkg_config');

function walkSqlFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'vendor' || ent.name === 'node_modules') continue;
      walkSqlFiles(full, out);
    } else if (ent.isFile() && ent.name.endsWith('.sql')) {
      out.push(full);
    }
  }
  return out;
}

class SchemaFkExtractor {
  _parseSqlFile(sqlText, defaultPlugin, tablesMap, fkMap) {
    // Extract CREATE TABLE [IF NOT EXISTS] `tbl` ( ... FOREIGN KEY (...) REFERENCES `refTbl` (...) )
    const createTableRe = /CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?\s+[`"]?([A-Za-z0-9_]+)[`"]?\s*\(([\s\S]*?)\)\s*(?:ENGINE|COMMENT|DEFAULT|;)/gi;
    let m;
    while ((m = createTableRe.exec(sqlText)) !== null) {
      const tableName = m[1].toLowerCase();
      const body = m[2];
      if (!tablesMap.has(tableName)) {
        tablesMap.set(tableName, { name: tableName, plugin: defaultPlugin, source: 'SQL_DDL' });
      }
      const fkLineRe = /(?:CONSTRAINT\s+[`"]?([A-Za-z0-9_]+)[`"]?\s+)?FOREIGN\s+KEY\s*\(\s*[`"]?([A-Za-z0-9_]+)[`"]?\s*\)\s*REFERENCES\s+[`"]?([A-Za-z0-9_]+)[`"]?\s*\(\s*[`"]?([A-Za-z0-9_]+)[`"]?\s*\)/gi;
      let fkm;
      while ((fkm = fkLineRe.exec(body)) !== null) {
        const constraintName = fkm[1] || `fk_${tableName}_${fkm[2]}`;
        this._upsertFk(fkMap, {
          from_table: tableName,
          from_column: fkm[2].toLowerCase(),
          to_table: fkm[3].toLowerCase(),
          to_column: fkm[4].toLowerCase(),
          constraint_name: constraintName,
          evidence_type: 'SQL_DDL',
          confidence: 0.95
        });
      }
    }

    // Extract ALTER TABLE `tbl` ADD [CONSTRAINT `name`] FOREIGN KEY (`col`) REFERENCES `ref` (`refCol`)
    const alterRe = /ALTER\s+TABLE\s+[`"]?([A-Za-z0-9_]+)[`"]?[\s\S]*?FOREIGN\s+KEY\s*\(\s*[`"]?([A-Za-z0-9_]+)[`"]?\s*\)\s*REFERENCES\s+[`"]?([A-Za-z0-9_]+)[`"]?\s*\(\s*[`"]?([A-Za-z0-9_]+)[`"]?\s*\)/gi;
    while ((m = alterRe.exec(sqlText)) !== null) {
      const tableName = m[1].toLowerCase();
      if (!tablesMap.has(tableName)) {
        tablesMap.set(tableName, { name: tableName, plugin: defaultPlugin, source: 'SQL_DDL' });
      }
      this._upsertFk(fkMap, {
        from_table: tableName,
        from_column: m[2].toLowerCase(),
        to_table: m[3].toLowerCase(),
        to_column: m[4].toLowerCase(),
        constraint_name: `fk_${tableName}_${m[2].toLowerCase()}`,
        evidence_type: 'SQL_DDL',
        confidence: 0.95
      });
    }
  }

  _upsertFk(fkMap, fk) {
    const key = `${fk.from_table}.${fk.from_column}->${fk.to_table}.${fk.to_column}`;
    const prev = fkMap.get(key);
    if (!prev || fk.confidence >= prev.confidence) {
      fkMap.set(key, fk);
    }
  }

  async _introspectMariaDb(tablesMap, fkMap) {
    let dotenvLoaded = false;
    try {
      const envPath = path.resolve(__dirname, '..', '.env');
      if (fs.existsSync(envPath)) {
        require('dotenv').config({ path: envPath });
        dotenvLoaded = true;
      }
    } catch (_) {
      // Optional dotenv
    }

    const host = process.env.MARIADB_HOST;
    const db = process.env.MARIADB_DEFAULT_DB;
    if (!host || !db) {
      return { connected: false, reason: dotenvLoaded ? 'MISSING_MARIADB_ENV' : 'ENV_NOT_LOADED' };
    }

    let mysql;
    try {
      mysql = require('mysql2/promise');
    } catch (_) {
      return { connected: false, reason: 'MYSQL2_NOT_AVAILABLE' };
    }

    let conn;
    try {
      conn = await mysql.createConnection({
        host,
        port: Number(process.env.MARIADB_PORT || 3306),
        user: process.env.MARIADB_USER || 'root',
        password: process.env.MARIADB_PASSWORD || '',
        database: db,
        connectTimeout: 2500
      });

      const [tableRows] = await conn.query('SHOW TABLES');
      let liveTables = 0;
      for (const row of tableRows) {
        const tbl = String(Object.values(row)[0] || '').toLowerCase();
        if (!tbl) continue;
        liveTables++;
        if (!tablesMap.has(tbl)) {
          tablesMap.set(tbl, { name: tbl, plugin: null, source: 'INFORMATION_SCHEMA' });
        }
      }

      const [fkRows] = await conn.query(
        'SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME, CONSTRAINT_NAME ' +
        'FROM information_schema.KEY_COLUMN_USAGE ' +
        'WHERE TABLE_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL'
      );

      for (const row of fkRows) {
        const fromTbl = String(row.TABLE_NAME).toLowerCase();
        const toTbl = String(row.REFERENCED_TABLE_NAME).toLowerCase();
        if (!tablesMap.has(fromTbl)) tablesMap.set(fromTbl, { name: fromTbl, plugin: null, source: 'INFORMATION_SCHEMA' });
        if (!tablesMap.has(toTbl)) tablesMap.set(toTbl, { name: toTbl, plugin: null, source: 'INFORMATION_SCHEMA' });
        this._upsertFk(fkMap, {
          from_table: fromTbl,
          from_column: String(row.COLUMN_NAME).toLowerCase(),
          to_table: toTbl,
          to_column: String(row.REFERENCED_COLUMN_NAME).toLowerCase(),
          constraint_name: row.CONSTRAINT_NAME,
          evidence_type: 'INFORMATION_SCHEMA',
          confidence: 1.0
        });
      }

      return { connected: true, database: db, liveTables, liveFks: fkRows.length };
    } catch (err) {
      return { connected: false, reason: err.message };
    } finally {
      if (conn) {
        try { await conn.end(); } catch (_) { /* ignore */ }
      }
    }
  }

  async extractAll({ prodParsedFiles = [], connectMariaDb = true } = {}) {
    const tablesMap = new Map();
    const entities = [];
    const entityByFqcn = new Map();
    const fkMap = new Map();

    // 1. Collect all Doctrine @ORM\Entity classes across all 23 plugins
    for (const pf of prodParsedFiles) {
      for (const cls of pf.classes || []) {
        if (!cls.isOrmEntity && !cls.tableName) continue;
        const tbl = (cls.tableName || '').toLowerCase();
        const plugin = extractPluginFromPath(cls.source_file) || 'orangehrmCorePlugin';
        const entityObj = {
          entity_name: cls.name,
          class_fqcn: cls.fqcn,
          table_name: tbl || null,
          plugin,
          source_file: cls.source_file
        };
        entities.push(entityObj);
        entityByFqcn.set(cls.fqcn, entityObj);
        if (tbl) {
          tablesMap.set(tbl, { name: tbl, plugin, source: 'DOCTRINE_ENTITY' });
        }
      }
    }

    // 2. Convert Doctrine @ORM\JoinColumn relations into FK edges
    for (const pf of prodParsedFiles) {
      for (const cls of pf.classes || []) {
        if (!cls.tableName || !Array.isArray(cls.ormJoinColumns)) continue;
        const fromTbl = cls.tableName.toLowerCase();
        for (const jc of cls.ormJoinColumns) {
          const targetEntity = jc.targetFqcn && entityByFqcn.get(jc.targetFqcn);
          if (!targetEntity || !targetEntity.table_name) continue;
          this._upsertFk(fkMap, {
            from_table: fromTbl,
            from_column: (jc.columnName || `${jc.property}_id`).toLowerCase(),
            to_table: targetEntity.table_name,
            to_column: (jc.referencedColumnName || 'id').toLowerCase(),
            constraint_name: `orm_${fromTbl}_${jc.property}`,
            evidence_type: 'DOCTRINE_ORM_JOIN',
            confidence: 0.85
          });
        }
      }
    }

    // 3. Parse SQL DDL migrations across plugins + installer
    const sqlFiles = [
      ...walkSqlFiles(PLUGINS_DIR),
      ...walkSqlFiles(path.join(ORANGE_HRM_ROOT, 'installer'))
    ];
    for (const sqlPath of sqlFiles) {
      const sqlText = fs.readFileSync(sqlPath, 'utf8');
      const plugin = extractPluginFromPath(sqlPath);
      this._parseSqlFile(sqlText, plugin, tablesMap, fkMap);
    }

    // 4. Live MariaDB introspection when available
    const mariaDbStatus = connectMariaDb
      ? await this._introspectMariaDb(tablesMap, fkMap)
      : { connected: false, reason: 'SKIPPED_BY_OPTION' };

    return {
      tables: [...tablesMap.values()],
      entities,
      fkEdges: [...fkMap.values()],
      diagnostics: {
        tableCount: tablesMap.size,
        entityCount: entities.length,
        fkCount: fkMap.size,
        sqlFilesParsed: sqlFiles.length,
        mariaDbStatus
      }
    };
  }
}

module.exports = SchemaFkExtractor;

