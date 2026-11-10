<?php
$_GET['server'] = '127.0.0.1';
$_GET['username'] = 'root';
$_GET['db'] = 'test_orangehrm_mysql';

session_start();
$_SESSION['pwds']['server']['127.0.0.1']['root'] = 'root';

ob_start();
include __DIR__ . '/../db_web_ui/index.php';
$html = ob_get_clean();

preg_match('/<title>(.*?)<\/title>/', $html, $title);
preg_match('/<h2>Database: (.*?)<\/h2>/', $html, $h2);
echo "Title: " . ($title[1] ?? 'none') . "\n";
echo "H2: " . ($h2[1] ?? 'none') . "\n";
echo "Has test_orangehrm_mysql in HTML: " . (strpos($html, 'test_orangehrm_mysql') !== false ? 'YES' : 'NO') . "\n";
