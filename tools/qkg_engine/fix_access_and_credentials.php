<?php
$pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=orangehrm_mysql', 'root', 'root');

// Check Admin password
$stmt = $pdo->query("SELECT user_password FROM ohrm_user WHERE user_name = 'Admin'");
$hash = $stmt->fetchColumn();

echo "Testing existing hash with common passwords:\n";
$passwords = ['admin123', 'Admin@123', 'admin', 'Jacqueline@OHRM123', 'Jacqueline@123', 'Admin123!'];
$found = false;
foreach ($passwords as $p) {
    if (password_verify($p, $hash)) {
        echo "MATCH FOUND! Admin password is: $p\n";
        $found = true;
        break;
    }
}

if (!$found) {
    echo "No match in common list. Setting Admin password to: admin123\n";
    $newHash = password_hash('admin123', PASSWORD_BCRYPT);
    $update = $pdo->prepare("UPDATE ohrm_user SET user_password = ? WHERE user_name = 'Admin'");
    $update->execute([$newHash]);
    echo "Admin password has been reset to: admin123\n";
}

// Ensure MariaDB allows connections from ANY host ('%')
echo "\nConfiguring MariaDB remote access for user 'root'@'%'...\n";
$pdo->exec("CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'root';");
$pdo->exec("GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION;");
$pdo->exec("GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY 'root' WITH GRANT OPTION;");
$pdo->exec("GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' IDENTIFIED BY 'root' WITH GRANT OPTION;");
$pdo->exec("FLUSH PRIVILEGES;");
echo "MariaDB user 'root'@'%' granted all privileges with password 'root'.\n";

// Display all users in mysql.user
echo "\nUpdated MySQL users:\n";
$stmt2 = $pdo->query('SELECT Host, User FROM mysql.user');
while ($row = $stmt2->fetch(PDO::FETCH_ASSOC)) {
    echo "Host: " . $row['Host'] . " | User: " . $row['User'] . "\n";
}
