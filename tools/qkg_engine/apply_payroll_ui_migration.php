<?php
/**
 * Applies Payroll UI Menu & Screen Permissions Migration
 */

$databases = ['orangehrm_mysql', 'test_orangehrm_mysql'];

foreach ($databases as $db) {
    echo "====================================================\n";
    echo "Applying Payroll UI Migration to: $db\n";
    echo "====================================================\n";
    try {
        $pdo = new PDO("mysql:host=127.0.0.1;dbname=$db", 'root', 'root');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // 1. ohrm_module
        $pdo->exec("
            INSERT INTO ohrm_module (id, name, status, display_name)
            VALUES (19, 'payroll', 1, 'Payroll')
            ON DUPLICATE KEY UPDATE status = 1, display_name = 'Payroll'
        ");
        echo "  ✓ Module 'payroll' inserted/updated.\n";

        // 2. ohrm_screen
        $pdo->exec("
            INSERT INTO ohrm_screen (id, name, module_id, action_url)
            VALUES 
                (183, 'View Payroll Module', 19, 'viewPayrollModule'),
                (184, 'Payroll Processing', 19, 'viewPayrollProcessing'),
                (185, 'My Salary Slips', 19, 'viewMySalarySlips')
            ON DUPLICATE KEY UPDATE module_id = VALUES(module_id), action_url = VALUES(action_url)
        ");
        echo "  ✓ Screens (183, 184, 185) inserted/updated.\n";

        // 3. ohrm_user_role_screen
        // Clean existing permissions for these screens first to prevent duplicate entries
        $pdo->exec("DELETE FROM ohrm_user_role_screen WHERE screen_id IN (183, 184, 185)");
        $pdo->exec("
            INSERT INTO ohrm_user_role_screen (user_role_id, screen_id, can_read, can_create, can_update, can_delete)
            VALUES 
                (1, 183, 1, 1, 1, 1),
                (1, 184, 1, 1, 1, 1),
                (1, 185, 1, 1, 1, 1),
                (2, 183, 1, 0, 0, 0),
                (2, 185, 1, 0, 0, 0),
                (3, 183, 1, 0, 0, 0),
                (3, 185, 1, 0, 0, 0)
        ");
        echo "  ✓ Permissions granted to Admin, ESS, and Supervisor roles.\n";

        // 4. ohrm_module_default_page
        $pdo->exec("DELETE FROM ohrm_module_default_page WHERE module_id = 19");
        $pdo->exec("
            INSERT INTO ohrm_module_default_page (module_id, user_role_id, action, priority)
            VALUES 
                (19, 1, 'payroll/viewPayrollProcessing', 20),
                (19, 2, 'payroll/viewMySalarySlips', 0),
                (19, 3, 'payroll/viewMySalarySlips', 10)
        ");
        echo "  ✓ Default module landing pages configured.\n";

        // 5. ohrm_menu_item
        $pdo->exec("DELETE FROM ohrm_menu_item WHERE id IN (113, 114, 115)");
        $pdo->exec("
            INSERT INTO ohrm_menu_item (id, menu_title, screen_id, parent_id, level, order_hint, status, additional_params)
            VALUES (113, 'Payroll', 183, NULL, 1, 1350, 1, '{\"icon\":\"briefcase\"}')
        ");
        $pdo->exec("
            INSERT INTO ohrm_menu_item (id, menu_title, screen_id, parent_id, level, order_hint, status)
            VALUES 
                (114, 'Payroll Processing', 184, 113, 2, 100, 1),
                (115, 'My Salary Slips', 185, 113, 2, 200, 1)
        ");
        echo "  ✓ Menu items (Payroll, Payroll Processing, My Salary Slips) configured.\n";

    } catch (Exception $e) {
        echo "  ✗ Error: " . $e->getMessage() . "\n";
    }
}
echo "\nMigration execution finished.\n";

