<?php
// Auto-clean any malformed query strings from previous attempts
if (isset($_SERVER['QUERY_STRING']) && (strpos($_SERVER['QUERY_STRING'], '127.0.0.1&') !== false || substr_count($_SERVER['QUERY_STRING'], '127.0.0.1') > 1)) {
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
if (!isset($_GET['db'])) {
    $_GET['db'] = 'orangehrm_mysql';
}

// Pre-authorize session with MariaDB credentials
$_SESSION['pwds']['server']['127.0.0.1']['root'] = 'root';
$_SESSION['databases']['server']['127.0.0.1']['root'] = ['orangehrm_mysql', 'test_orangehrm_mysql'];

function adminer_object() {
    class AdminerCustom extends Adminer {
        function name() {
            return 'OrangeHRM MariaDB Manager';
        }
        function credentials() {
            return ['127.0.0.1', 'root', 'root'];
        }
        function database() {
            return 'orangehrm_mysql';
        }
        function login($login, $password) {
            return true;
        }
    }
    return new AdminerCustom;
}

include __DIR__ . '/adminer-core.php';
