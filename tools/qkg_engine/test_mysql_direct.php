<?php
$_GET['server'] = '127.0.0.1';
$_GET['username'] = 'root';
$_GET['db'] = 'mysql';

ob_start();
include '/mnt/c/Users/parav/Workspace/Orange HRMS/tools/db_web_ui/index.php';
$html = ob_get_clean();

echo "DIRECT EXECUTION H2: ";
preg_match('/<h2>(.*?)<\/h2>/', $html, $m);
echo ($m[1] ?? 'not found') . "\n";
echo "Has user table: " . (strpos($html, 'user') !== false ? 'YES' : 'NO') . "\n";
