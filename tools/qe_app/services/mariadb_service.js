const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const {
  validateReadOnlySql,
  validateSqlIdentifier,
  sanitizePayload,
  SENSITIVE_KEY_RE
} = require('../../qkg_engine/security_guard');

class MariaDBService {
  constructor() {
    this.host = process.env.MARIADB_HOST || '127.0.0.1';
    this.port = parseInt(process.env.MARIADB_PORT || '3306', 10);
    this.user = process.env.MARIADB_READONLY_USER || process.env.MARIADB_USER || 'root';
    this.password = process.env.MARIADB_READONLY_PASSWORD || process.env.MARIADB_PASSWORD || 'root';
    this.defaultDb = validateSqlIdentifier(process.env.MARIADB_DEFAULT_DB || 'orangehrm_mysql', 'database');
  }

  async getConnection(database = null) {
    const db = database ? validateSqlIdentifier(database, 'database') : this.defaultDb;
    return await mysql.createConnection({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.password,
      database: db,
      multipleStatements: false,
      connectTimeout: 5000
    });
  }

  async executeReadOnlySql(sql, database = null) {
    const checked = validateReadOnlySql(sql, 100);
    const db = database ? validateSqlIdentifier(database, 'database') : this.defaultDb;

    let conn;
    const startTime = Date.now();
    try {
      conn = await this.getConnection(db);
      await conn.query('SET SESSION TRANSACTION READ ONLY');

      const [rows, fields] = await conn.query(checked.sql);
      const executionTimeMs = Date.now() - startTime;
      const sanitizedRows = sanitizePayload(rows);

      return {
        database: db,
        sql: checked.sql,
        executionTimeMs,
        limitApplied: checked.limitApplied,
        count: Array.isArray(sanitizedRows) ? sanitizedRows.length : 1,
        columns: fields ? fields.map(f => f.name) : [],
        rows: sanitizedRows
      };
    } finally {
      if (conn) await conn.end();
    }
  }

  async getDatabaseOverview(database = null) {
    const dbName = database || this.defaultDb;
    let conn;
    try {
      conn = await this.getConnection(dbName);
      const [tables] = await conn.query(`
        SELECT TABLE_NAME AS tableName,
               TABLE_ROWS AS rowEstimate,
               ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) AS sizeMb,
               ENGINE AS engine
        FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = ?
        ORDER BY TABLE_NAME
      `, [dbName]);

      const [payrollCheck] = await conn.query(`
        SELECT COUNT(*) AS count FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = ?
          AND (TABLE_NAME LIKE '%payroll%' OR TABLE_NAME IN ('ohrm_pay_period', 'ohrm_salary_slip'))
      `, [dbName]);

      return {
        database: dbName,
        totalTables: tables.length,
        payrollTablesCount: payrollCheck[0].count,
        sampleTables: tables.slice(0, 30),
        status: 'ONLINE'
      };
    } catch (e) {
      return {
        database: dbName,
        error: e.message,
        status: 'UNAVAILABLE',
        totalTables: null,
        payrollTablesCount: null,
        sampleTables: []
      };
    } finally {
      if (conn) await conn.end();
    }
  }

  async getTableSchema(database, tableName) {
    const dbName = validateSqlIdentifier(database || this.defaultDb, 'database');
    const safeTable = validateSqlIdentifier(tableName, 'table');
    let conn;
    try {
      conn = await this.getConnection(dbName);
      const [columns] = await conn.query(`
        SELECT COLUMN_NAME AS columnName,
               COLUMN_TYPE AS columnType,
               IS_NULLABLE AS isNullable,
               COLUMN_KEY AS columnKey,
               EXTRA AS extra
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `, [dbName, safeTable]);

      const sanitized = columns.map(c => {
        if (SENSITIVE_KEY_RE.test(c.columnName) || /password|token|secret|hash|aadhaar|pan|salary|bank|ifsc|ssn|email|phone|epf|esic|uan/i.test(c.columnName)) {
          return { ...c, columnType: '[REDACTED_SENSITIVE]' };
        }
        return c;
      });

      return {
        database: dbName,
        tableName: safeTable,
        columnCount: sanitized.length,
        columns: sanitized
      };
    } catch (e) {
      return { database: dbName, tableName: safeTable, status: 'UNAVAILABLE', error: e.message };
    } finally {
      if (conn) await conn.end();
    }
  }

  async getTableRows(table, database = null, page = 1, limit = 20) {
    const safeTable = validateSqlIdentifier(table, 'table');
    const db = validateSqlIdentifier(database || this.defaultDb, 'database');
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const offset = (safePage - 1) * safeLimit;
    return await this.executeReadOnlySql(`SELECT * FROM \`${safeTable}\` LIMIT ${safeLimit} OFFSET ${offset}`, db);
  }

  async compareTableSchemas(sourceDb = 'orangehrm_mysql', targetDb = 'test_orangehrm_mysql') {
    const safeSource = validateSqlIdentifier(sourceDb, 'database');
    const safeTarget = validateSqlIdentifier(targetDb, 'database');
    let conn;
    try {
      conn = await this.getConnection(safeSource);
      const [srcTables] = await conn.query(`SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?`, [safeSource]);
      const [tgtTables] = await conn.query(`SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?`, [safeTarget]);

      const srcSet = new Set(srcTables.map(t => t.TABLE_NAME));
      const tgtSet = new Set(tgtTables.map(t => t.TABLE_NAME));

      const missingInTarget = [...srcSet].filter(t => !tgtSet.has(t));
      const missingInSource = [...tgtSet].filter(t => !srcSet.has(t));

      // Deep check on payroll tables
      const [srcPayrollCols] = await conn.query(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'ohrm_payroll_record'
      `, [safeSource]);

      return {
        status: 'AVAILABLE',
        sourceDb: safeSource,
        targetDb: safeTarget,
        sourceTableCount: srcSet.size,
        targetTableCount: tgtSet.size,
        isSynchronized: missingInTarget.length === 0 && missingInSource.length === 0,
        missingInTarget,
        missingInSource,
        driftDetected: missingInTarget.length > 0 || missingInSource.length > 0,
        payrollSchemaVerified: srcPayrollCols.length > 0,
        inspectedColumns: srcPayrollCols
      };
    } catch (e) {
      return {
        status: 'UNAVAILABLE',
        sourceDb: safeSource,
        targetDb: safeTarget,
        error: e.message,
        isSynchronized: null,
        sourceTableCount: null,
        targetTableCount: null,
        driftDetected: null,
        payrollSchemaVerified: null
      };
    } finally {
      if (conn) await conn.end();
    }
  }
}

module.exports = new MariaDBService();
module.exports.MariaDBService = MariaDBService;
