<?php
$pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=orangehrm_mysql', 'root', 'root');
$stmt = $pdo->query('SELECT id, user_name, user_password, user_role_id, status FROM ohrm_user');
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "User: " . $row['user_name'] . " | Status: " . $row['status'] . " | Password Hash: " . $row['user_password'] . "\n";
}

// Also check MySQL user table to see privileges
echo "\n--- MySQL Users ---\n";
$stmt2 = $pdo->query('SELECT Host, User, plugin FROM mysql.user');
while ($row = $stmt2->fetch(PDO::FETCH_ASSOC)) {
    echo "Host: " . $row['Host'] . " | User: " . $row['User'] . " | Plugin: " . $row['plugin'] . "\n";
}

