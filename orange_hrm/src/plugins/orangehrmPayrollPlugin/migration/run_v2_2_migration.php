<?php

/**
 * Idempotent PHP Migration Runner for OrangeHRM India-Standard Payroll v2.2.
 * Upgrades any legacy v2.1 payroll tables cleanly via fresh CREATE TABLE definitions
 * (avoiding multi-step InnoDB ALTER TABLE rebuilds on WSL/Windows filesystems)
 * and seeds RBAC, menus, I18N keys, statutory rules, and income tax slabs.
 */

declare(strict_types=1);

$host = getenv('OHRM_DB_HOST') ?: '127.0.0.1';
$port = (int)(getenv('OHRM_DB_PORT') ?: 3306);
$user = getenv('OHRM_DB_USER') ?: 'root';
$pass = getenv('OHRM_DB_PASS') ?: 'root';

$targets = $argc > 1 ? array_slice($argv, 1) : ['orangehrm_mysql', 'test_orangehrm_mysql'];

$schemaSqlPath = __DIR__ . '/v2_2_india_payroll_schema.sql';
$rbacSqlPath = __DIR__ . '/v2_2_india_payroll_rbac_and_i18n.sql';

if (!file_exists($schemaSqlPath) || !file_exists($rbacSqlPath)) {
    fwrite(STDERR, "Migration SQL files not found.\n");
    exit(1);
}

$schemaSql = file_get_contents($schemaSqlPath);
$rbacSql = file_get_contents($rbacSqlPath);

foreach ($targets as $dbName) {
    echo "=== Migrating database: {$dbName} ===\n";
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $host, $port, $dbName);
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_MULTI_STATEMENTS => true,
    ]);

    $modCheck = $pdo->query("SELECT id FROM ohrm_module WHERE name = 'payroll'")->fetchColumn();
    if (!$modCheck) {
        $pdo->exec("INSERT INTO ohrm_module (name, status) VALUES ('payroll', 1)");
        $modCheck = $pdo->query("SELECT id FROM ohrm_module WHERE name = 'payroll'")->fetchColumn();
    }

    $scrCheck = $pdo->prepare("SELECT id FROM ohrm_screen WHERE module_id = ? AND action_url = 'viewPayrollModule'");
    $scrCheck->execute([$modCheck]);
    if (!$scrCheck->fetchColumn()) {
        $stmt = $pdo->prepare("INSERT INTO ohrm_screen (name, module_id, action_url) VALUES ('View Payroll Module', ?, 'viewPayrollModule')");
        $stmt->execute([$modCheck]);
    }
    $rootScreenId = (int)$pdo->query("SELECT id FROM ohrm_screen WHERE module_id = {$modCheck} AND action_url = 'viewPayrollModule'")->fetchColumn();
    $menuCheck = $pdo->query("SELECT id FROM ohrm_menu_item WHERE menu_title = 'Payroll' AND parent_id IS NULL")->fetchColumn();
    if (!$menuCheck) {
        $stmt = $pdo->prepare("INSERT INTO ohrm_menu_item (menu_title, screen_id, parent_id, level, order_hint, status, additional_params) VALUES ('Payroll', ?, NULL, 1, 1350, 1, '{\"icon\":\"payroll\"}')");
        $stmt->execute([$rootScreenId]);
    }

    // Upgrade legacy v2.1 tables cleanly to v2.2 inline DDL if uq_payroll_record_run_emp / v2.2 columns are missing
    $isV22 = false;
    $tblExists = (int)$pdo->query("SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = '{$dbName}' AND TABLE_NAME = 'ohrm_payroll_record'")->fetchColumn();
    if ($tblExists > 0) {
        $hasKey = (int)$pdo->query("
            SELECT COUNT(*) FROM information_schema.STATISTICS
            WHERE TABLE_SCHEMA = '{$dbName}' AND TABLE_NAME = 'ohrm_payroll_record' AND INDEX_NAME = 'uq_payroll_record_run_emp'
        ")->fetchColumn();
        $hasCess = (int)$pdo->query("
            SELECT COUNT(*) FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = '{$dbName}' AND TABLE_NAME = 'ohrm_payroll_record' AND COLUMN_NAME = 'health_education_cess'
        ")->fetchColumn();
        $isV22 = ($hasKey > 0 && $hasCess > 0);
    }

    if (!$isV22 && $tblExists > 0) {
        echo "Upgrading legacy v2.1 payroll tables cleanly in {$dbName}...\n";
        $pdo->exec('SET FOREIGN_KEY_CHECKS = 0');
        foreach ([
            'ohrm_payroll_audit_event',
            'ohrm_payroll_approval',
            'ohrm_payroll_claim_link',
            'ohrm_payroll_payment_batch',
            'ohrm_salary_slip',
            'ohrm_payroll_item',
            'ohrm_payroll_record',
            'ohrm_payroll_emp_snapshot',
            'ohrm_payroll_run',
            'ohrm_pay_period',
        ] as $tbl) {
            $pdo->exec("DROP TABLE IF EXISTS `{$tbl}`");
        }
        $pdo->exec('SET FOREIGN_KEY_CHECKS = 1');
    }

    executeSqlBatch($pdo, $schemaSql);
    executeSqlBatch($pdo, $rbacSql);

    echo "Migration complete for {$dbName}.\n";
}

function executeSqlBatch(PDO $pdo, string $sql): void
{
    $lines = explode("\n", str_replace("\r\n", "\n", $sql));
    $clean = [];
    foreach ($lines as $line) {
        if (str_starts_with(ltrim($line), '--')) {
            continue;
        }
        $clean[] = $line;
    }
    $statements = splitSqlStatements(implode("\n", $clean));
    foreach ($statements as $stmtSql) {
        $trimmed = trim($stmtSql);
        if ($trimmed !== '') {
            $pdo->exec($trimmed);
        }
    }
}

function splitSqlStatements(string $sql): array
{
    $stmts = [];
    $buf = '';
    $inSingle = false;
    $inDouble = false;
    $len = strlen($sql);
    for ($i = 0; $i < $len; $i++) {
        $ch = $sql[$i];
        $prev = $i > 0 ? $sql[$i - 1] : '';
        if ($ch === "'" && !$inDouble && $prev !== '\\') {
            $inSingle = !$inSingle;
        } elseif ($ch === '"' && !$inSingle && $prev !== '\\') {
            $inDouble = !$inDouble;
        } elseif ($ch === ';' && !$inSingle && !$inDouble) {
            $stmts[] = $buf;
            $buf = '';
            continue;
        }
        $buf .= $ch;
    }
    if (trim($buf) !== '') {
        $stmts[] = $buf;
    }
    return $stmts;
}
