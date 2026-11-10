<?php
// Auto-clean any malformed query strings with duplicated parameters from previous attempts
if (isset($_SERVER['QUERY_STRING']) && substr_count($_SERVER['QUERY_STRING'], '127.0.0.1') > 1) {
    header('Location: /');
    exit;
}

session_start();

if (!isset($_GET['server'])) {
    $_GET['server'] = '127.0.0.1';
}
if (!isset($_GET['username'])) {
    $_GET['username'] = 'root';
}
if (!isset($_GET['db']) && !isset($_GET['databases'])) {
    $_GET['db'] = 'orangehrm_mysql';
}

// Pre-authorize session with MariaDB credentials for all databases
$_SESSION['pwds']['server']['127.0.0.1']['root'] = 'root';

function adminer_object() {
    class AdminerCustom extends Adminer {
        function name() {
            return 'OrangeHRM MariaDB Manager';
        }
        function credentials() {
            return ['127.0.0.1', 'root', 'root'];
        }
        // Do NOT return a fixed string here, so Adminer allows switching databases freely
        function database() {
            return '';
        }
        function login($login, $password) {
            return true;
        }
    }
    return new AdminerCustom;
}

include __DIR__ . '/adminer-core.php';
