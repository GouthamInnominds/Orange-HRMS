<?php
$pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', 'root');
$dbs = $pdo->query('SHOW DATABASES')->fetchAll(PDO::FETCH_COLUMN);
echo "Databases:\n";
foreach ($dbs as $db) {
    $tables = $pdo->query("SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = '$db'")->fetchColumn();
    echo "  - $db ($tables tables)\n";
}
