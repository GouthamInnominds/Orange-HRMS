<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', 'root', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "Connected to MariaDB 3306 successfully.\n";
    $pdo->exec('CREATE DATABASE IF NOT EXISTS test_orangehrm_mysql CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    echo "Database test_orangehrm_mysql ensured.\n";

    // Check tables in orangehrm_mysql
    $tables = $pdo->query("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'orangehrm_mysql'")->fetchAll(PDO::FETCH_COLUMN);
    echo "Found " . count($tables) . " tables in orangehrm_mysql.\n";

    // Clone table structures to test_orangehrm_mysql if empty
    $testTables = $pdo->query("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'test_orangehrm_mysql'")->fetchAll(PDO::FETCH_COLUMN);
    if (count($testTables) === 0) {
        echo "Cloning schema to test_orangehrm_mysql...\n";
        foreach ($tables as $table) {
            $pdo->exec("CREATE TABLE IF NOT EXISTS `test_orangehrm_mysql`.`$table` LIKE `orangehrm_mysql`.`$table`;");
            $pdo->exec("INSERT INTO `test_orangehrm_mysql`.`$table` SELECT * FROM `orangehrm_mysql`.`$table`;");
        }
        echo "Successfully cloned all " . count($tables) . " tables and seed data to test_orangehrm_mysql.\n";
    } else {
        echo "test_orangehrm_mysql already has " . count($testTables) . " tables.\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
