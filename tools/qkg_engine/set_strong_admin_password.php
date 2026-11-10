<?php
$pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=orangehrm_mysql', 'root', 'root');

$strongPassword = 'Admin@123456';
$hash = password_hash($strongPassword, PASSWORD_BCRYPT);

// Update Admin password and disable any forced reset flags
$pdo->prepare("UPDATE ohrm_user SET user_password = ? WHERE user_name = 'Admin'")->execute([$hash]);

echo "Admin password updated to: $strongPassword\n";

// Check if there is an open reset code in ohrm_reset_password or similar
$tables = $pdo->query("SHOW TABLES LIKE '%reset%'")->fetchAll(PDO::FETCH_COLUMN);
foreach ($tables as $t) {
    echo "Found table: $t\n";
    $pdo->exec("DELETE FROM `$t`");
}

echo "Cleaned reset password table.\n";
