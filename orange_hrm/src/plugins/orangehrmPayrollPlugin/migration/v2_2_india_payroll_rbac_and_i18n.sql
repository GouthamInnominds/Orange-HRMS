-- OrangeHRM India-Standard Payroll Extension v2.2 RBAC, Menus, I18N, & India Statutory Rule Seed
-- Idempotent script safe for repeated execution via run_v2_2_migration.php

SET @payroll_module_id := (SELECT id FROM ohrm_module WHERE name = 'payroll' LIMIT 1);
SET @admin_role_id := (SELECT id FROM ohrm_user_role WHERE name = 'Admin' LIMIT 1);
SET @ess_role_id := (SELECT id FROM ohrm_user_role WHERE name = 'ESS' LIMIT 1);
SET @supervisor_role_id := (SELECT id FROM ohrm_user_role WHERE name = 'Supervisor' LIMIT 1);

-- 1. Create dedicated assignable PayrollApprover role (Separation of Duties: Admin calculates/submits; PayrollApprover approves/locks/disburses)
INSERT INTO ohrm_user_role (name, display_name, is_assignable, is_predefined)
SELECT 'PayrollApprover', 'Payroll Approver', 1, 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM ohrm_user_role WHERE name = 'PayrollApprover');

SET @approver_role_id := (SELECT id FROM ohrm_user_role WHERE name = 'PayrollApprover' LIMIT 1);

-- 2. Update Payroll top-level icon in ohrm_menu_item from generic briefcase to native 'payroll' icon
UPDATE ohrm_menu_item
SET additional_params = '{"icon":"payroll"}'
WHERE menu_title = 'Payroll' AND parent_id IS NULL;

SET @payroll_parent_menu_id := (SELECT id FROM ohrm_menu_item WHERE menu_title = 'Payroll' AND parent_id IS NULL LIMIT 1);

-- 3. Screens under payroll module (preserve 183, 184, 185; add v2.2 screens idempotently)
INSERT INTO ohrm_screen (name, module_id, action_url, menu_configurator)
SELECT 'Pay Periods', @payroll_module_id, 'viewPayPeriods', NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewPayPeriods');

INSERT INTO ohrm_screen (name, module_id, action_url, menu_configurator)
SELECT 'Payroll Payments', @payroll_module_id, 'viewPayrollPayments', NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewPayrollPayments');

INSERT INTO ohrm_screen (name, module_id, action_url, menu_configurator)
SELECT 'Payroll Audit Trail', @payroll_module_id, 'viewPayrollAuditTrail', NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewPayrollAuditTrail');

INSERT INTO ohrm_screen (name, module_id, action_url, menu_configurator)
SELECT 'Payroll Configuration', @payroll_module_id, 'viewPayrollConfiguration', NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewPayrollConfiguration');

INSERT INTO ohrm_screen (name, module_id, action_url, menu_configurator)
SELECT 'Employee Payslips', @payroll_module_id, 'viewEmployeePayslips', 'OrangeHRM\\Payroll\\Menu\\PayrollEmployeeMenuItemConfigurator' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewEmployeePayslips');

INSERT INTO ohrm_screen (name, module_id, action_url, menu_configurator)
SELECT 'Statutory Profile', @payroll_module_id, 'viewEmployeeStatutoryProfile', 'OrangeHRM\\Payroll\\Menu\\PayrollEmployeeMenuItemConfigurator' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewEmployeeStatutoryProfile');

UPDATE ohrm_screen
SET menu_configurator = 'OrangeHRM\\Payroll\\Menu\\PayrollEmployeeMenuItemConfigurator'
WHERE module_id = @payroll_module_id AND action_url IN ('viewEmployeePayslips', 'viewEmployeeStatutoryProfile');

-- 4. Top-bar Menu Items under Payroll module
SET @scr_mod := (SELECT id FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewPayrollModule' LIMIT 1);
SET @scr_periods := (SELECT id FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewPayPeriods' LIMIT 1);
SET @scr_process := (SELECT id FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewPayrollProcessing' LIMIT 1);
SET @scr_payments := (SELECT id FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewPayrollPayments' LIMIT 1);
SET @scr_slips := (SELECT id FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewMySalarySlips' LIMIT 1);
SET @scr_audit := (SELECT id FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewPayrollAuditTrail' LIMIT 1);
SET @scr_config := (SELECT id FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewPayrollConfiguration' LIMIT 1);
SET @scr_emp_slips := (SELECT id FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewEmployeePayslips' LIMIT 1);
SET @scr_emp_stat := (SELECT id FROM ohrm_screen WHERE module_id = @payroll_module_id AND action_url = 'viewEmployeeStatutoryProfile' LIMIT 1);

UPDATE ohrm_menu_item SET order_hint = 100 WHERE screen_id = @scr_process;
UPDATE ohrm_menu_item SET order_hint = 200 WHERE screen_id = @scr_slips;

INSERT INTO ohrm_menu_item (menu_title, screen_id, parent_id, level, order_hint, status, additional_params)
SELECT 'Pay Periods', @scr_periods, @payroll_parent_menu_id, 2, 50, 1, NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ohrm_menu_item WHERE screen_id = @scr_periods);

INSERT INTO ohrm_menu_item (menu_title, screen_id, parent_id, level, order_hint, status, additional_params)
SELECT 'Payments', @scr_payments, @payroll_parent_menu_id, 2, 150, 1, NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ohrm_menu_item WHERE screen_id = @scr_payments);

INSERT INTO ohrm_menu_item (menu_title, screen_id, parent_id, level, order_hint, status, additional_params)
SELECT 'Audit Trail', @scr_audit, @payroll_parent_menu_id, 2, 250, 1, NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ohrm_menu_item WHERE screen_id = @scr_audit);

INSERT INTO ohrm_menu_item (menu_title, screen_id, parent_id, level, order_hint, status, additional_params)
SELECT 'Configuration', @scr_config, @payroll_parent_menu_id, 2, 300, 1, NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ohrm_menu_item WHERE screen_id = @scr_config);

-- 5. Screen Permissions (Admin, PayrollApprover, ESS, Supervisor)
-- Admin screens
INSERT INTO ohrm_user_role_screen (user_role_id, screen_id, can_read, can_create, can_update, can_delete)
SELECT @admin_role_id, s.id, 1, 1, 1, 1 FROM ohrm_screen s
WHERE @admin_role_id IS NOT NULL AND s.module_id = @payroll_module_id AND s.action_url IN ('viewPayPeriods','viewPayrollPayments','viewPayrollAuditTrail','viewPayrollConfiguration','viewEmployeePayslips','viewEmployeeStatutoryProfile')
AND NOT EXISTS (SELECT 1 FROM ohrm_user_role_screen urs WHERE urs.user_role_id = @admin_role_id AND urs.screen_id = s.id);

-- PayrollApprover screens (includes PIM left-menu ESS + all payroll verification/approval screens)
INSERT INTO ohrm_user_role_screen (user_role_id, screen_id, can_read, can_create, can_update, can_delete)
SELECT @approver_role_id, s.id, 1, 1, 1, 0 FROM ohrm_screen s
WHERE @approver_role_id IS NOT NULL AND s.module_id = @payroll_module_id AND s.action_url IN ('viewPayrollModule','viewPayPeriods','viewPayrollProcessing','viewPayrollPayments','viewPayrollAuditTrail','viewMySalarySlips','viewEmployeePayslips','viewEmployeeStatutoryProfile')
AND NOT EXISTS (SELECT 1 FROM ohrm_user_role_screen urs WHERE urs.user_role_id = @approver_role_id AND urs.screen_id = s.id);

-- ESS & Supervisor screens (only module gateway, My Salary Slips, and self PIM/My Info Payslips & Statutory Profile)
INSERT INTO ohrm_user_role_screen (user_role_id, screen_id, can_read, can_create, can_update, can_delete)
SELECT @ess_role_id, s.id, 1, 0, 0, 0 FROM ohrm_screen s
WHERE @ess_role_id IS NOT NULL AND s.module_id = @payroll_module_id AND s.action_url IN ('viewEmployeePayslips','viewEmployeeStatutoryProfile')
AND NOT EXISTS (SELECT 1 FROM ohrm_user_role_screen urs WHERE urs.user_role_id = @ess_role_id AND urs.screen_id = s.id);

INSERT INTO ohrm_user_role_screen (user_role_id, screen_id, can_read, can_create, can_update, can_delete)
SELECT @supervisor_role_id, s.id, 1, 0, 0, 0 FROM ohrm_screen s
WHERE @supervisor_role_id IS NOT NULL AND s.module_id = @payroll_module_id AND s.action_url IN ('viewEmployeePayslips','viewEmployeeStatutoryProfile')
AND NOT EXISTS (SELECT 1 FROM ohrm_user_role_screen urs WHERE urs.user_role_id = @supervisor_role_id AND urs.screen_id = s.id);

-- 6. Data Groups (API & UI Feature Groups)
INSERT INTO ohrm_data_group (name, description, can_read, can_create, can_update, can_delete) VALUES
('payroll_pay_periods', 'Payroll - Pay Periods UI', 1, 1, 1, 1),
('payroll_run_process', 'Payroll - Run Calculation & Review UI', 1, 1, 1, 0),
('payroll_run_approve', 'Payroll - Run Approval Action', 1, 0, 1, 0),
('payroll_run_lock', 'Payroll - Run Lock & Reversal Action', 1, 0, 1, 0),
('payroll_payments', 'Payroll - Payment Batch & Reconciliation UI', 1, 1, 1, 0),
('payroll_config', 'Payroll - Statutory, Tax & Leave Policy Config', 1, 1, 1, 1),
('payroll_audit', 'Payroll - Audit Trail UI', 1, 0, 0, 0),
('payroll_employee_payslips', 'Payroll - Employee Payslips Tab', 1, 0, 0, 0),
('payroll_statutory_profile', 'Payroll - Employee Indian Statutory & Bank Profile Tab', 1, 1, 1, 0),
('apiv2_payroll_pay_period', 'API-v2 Payroll - Pay Periods', 1, 1, 1, 1),
('apiv2_payroll_run', 'API-v2 Payroll - Payroll Runs & Records', 1, 1, 1, 0),
('apiv2_payroll_run_calculate', 'API-v2 Payroll - Calculate Batch', 0, 1, 0, 0),
('apiv2_payroll_run_submit', 'API-v2 Payroll - Submit Run for Approval', 0, 1, 1, 0),
('apiv2_payroll_run_approve', 'API-v2 Payroll - Approve / Reject Run', 0, 1, 1, 0),
('apiv2_payroll_run_lock', 'API-v2 Payroll - Lock / Reverse Run', 0, 1, 1, 0),
('apiv2_payroll_adjustment', 'API-v2 Payroll - Manual Adjustments & Overrides', 1, 1, 1, 0),
('apiv2_payroll_config', 'API-v2 Payroll - Configuration, Tax Brackets, Statutory Rules, Leave Policies', 1, 1, 1, 1),
('apiv2_payroll_payment_batch', 'API-v2 Payroll - Payment Batches, Bank Export & UTR Reconciliation', 1, 1, 1, 0),
('apiv2_payroll_my_slips', 'API-v2 Payroll - My Salary Slips', 1, 0, 0, 0),
('apiv2_payroll_slip', 'API-v2 Payroll - Individual Payslip View & Download', 1, 0, 0, 0),
('apiv2_payroll_employee_payslips', 'API-v2 Payroll - Employee Payslips History', 1, 0, 0, 0),
('apiv2_payroll_statutory_profile', 'API-v2 Payroll - Employee Statutory & Banking Profile', 1, 1, 1, 0),
('apiv2_payroll_audit', 'API-v2 Payroll - Immutable Audit Trail', 1, 0, 0, 0)
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- 7. API Permissions mapped to Data Groups
INSERT INTO ohrm_api_permission (module_id, data_group_id, api_name)
SELECT @payroll_module_id, (SELECT id FROM ohrm_data_group WHERE name = t.dg), t.api_name
FROM (
    SELECT 'apiv2_payroll_pay_period' AS dg, 'OrangeHRM\\Payroll\\Api\\PayPeriodAPI' AS api_name UNION ALL
    SELECT 'apiv2_payroll_run', 'OrangeHRM\\Payroll\\Api\\PayrollRunAPI' UNION ALL
    SELECT 'apiv2_payroll_run', 'OrangeHRM\\Payroll\\Api\\PayrollRecordAPI' UNION ALL
    SELECT 'apiv2_payroll_run_calculate', 'OrangeHRM\\Payroll\\Api\\PayrollRunCalculateAPI' UNION ALL
    SELECT 'apiv2_payroll_run_submit', 'OrangeHRM\\Payroll\\Api\\PayrollRunSubmitAPI' UNION ALL
    SELECT 'apiv2_payroll_run_approve', 'OrangeHRM\\Payroll\\Api\\PayrollRunApproveAPI' UNION ALL
    SELECT 'apiv2_payroll_run_approve', 'OrangeHRM\\Payroll\\Api\\PayrollRunRejectAPI' UNION ALL
    SELECT 'apiv2_payroll_run_lock', 'OrangeHRM\\Payroll\\Api\\PayrollRunLockAPI' UNION ALL
    SELECT 'apiv2_payroll_run_lock', 'OrangeHRM\\Payroll\\Api\\PayrollRunReverseAPI' UNION ALL
    SELECT 'apiv2_payroll_adjustment', 'OrangeHRM\\Payroll\\Api\\PayrollAdjustmentAPI' UNION ALL
    SELECT 'apiv2_payroll_config', 'OrangeHRM\\Payroll\\Api\\PayrollConfigAPI' UNION ALL
    SELECT 'apiv2_payroll_config', 'OrangeHRM\\Payroll\\Api\\PayrollTaxBracketAPI' UNION ALL
    SELECT 'apiv2_payroll_config', 'OrangeHRM\\Payroll\\Api\\PayrollStatutoryRuleAPI' UNION ALL
    SELECT 'apiv2_payroll_config', 'OrangeHRM\\Payroll\\Api\\PayrollLeavePolicyAPI' UNION ALL
    SELECT 'apiv2_payroll_payment_batch', 'OrangeHRM\\Payroll\\Api\\PayrollPaymentBatchAPI' UNION ALL
    SELECT 'apiv2_payroll_payment_batch', 'OrangeHRM\\Payroll\\Api\\PayrollPaymentExportAPI' UNION ALL
    SELECT 'apiv2_payroll_payment_batch', 'OrangeHRM\\Payroll\\Api\\PayrollPaymentReconcileAPI' UNION ALL
    SELECT 'apiv2_payroll_my_slips', 'OrangeHRM\\Payroll\\Api\\SalarySlipAPI' UNION ALL
    SELECT 'apiv2_payroll_slip', 'OrangeHRM\\Payroll\\Api\\SalarySlipDocumentAPI' UNION ALL
    SELECT 'apiv2_payroll_employee_payslips', 'OrangeHRM\\Payroll\\Api\\EmployeePayslipsAPI' UNION ALL
    SELECT 'apiv2_payroll_statutory_profile', 'OrangeHRM\\Payroll\\Api\\EmployeeStatutoryProfileAPI' UNION ALL
    SELECT 'apiv2_payroll_audit', 'OrangeHRM\\Payroll\\Api\\PayrollAuditAPI'
) t
ON DUPLICATE KEY UPDATE data_group_id = VALUES(data_group_id), module_id = VALUES(module_id);

-- 8. Role -> DataGroup Permission Matrix (Enforcing Separation of Duties!)
-- Clear and re-insert role mappings cleanly for payroll data groups only
DELETE urdg FROM ohrm_user_role_data_group urdg
INNER JOIN ohrm_data_group dg ON dg.id = urdg.data_group_id
WHERE dg.name LIKE 'payroll_%' OR dg.name LIKE 'apiv2_payroll_%';

-- Admin: Full setup, pay periods, calculate, adjust, submit, config, view records/payments/audit. NO approve/lock!
INSERT INTO ohrm_user_role_data_group (user_role_id, data_group_id, can_read, can_create, can_update, can_delete, self)
SELECT @admin_role_id, id, r, c, u, d, 0 FROM (
    SELECT 'payroll_pay_periods' AS n, 1 r, 1 c, 1 u, 1 d UNION ALL
    SELECT 'payroll_run_process', 1, 1, 1, 0 UNION ALL
    SELECT 'payroll_payments', 1, 0, 0, 0 UNION ALL
    SELECT 'payroll_config', 1, 1, 1, 1 UNION ALL
    SELECT 'payroll_audit', 1, 0, 0, 0 UNION ALL
    SELECT 'payroll_employee_payslips', 1, 0, 0, 0 UNION ALL
    SELECT 'payroll_statutory_profile', 1, 1, 1, 0 UNION ALL
    SELECT 'apiv2_payroll_pay_period', 1, 1, 1, 1 UNION ALL
    SELECT 'apiv2_payroll_run', 1, 1, 1, 0 UNION ALL
    SELECT 'apiv2_payroll_run_calculate', 0, 1, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_run_submit', 0, 1, 1, 0 UNION ALL
    SELECT 'apiv2_payroll_adjustment', 1, 1, 1, 0 UNION ALL
    SELECT 'apiv2_payroll_config', 1, 1, 1, 1 UNION ALL
    SELECT 'apiv2_payroll_payment_batch', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_my_slips', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_slip', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_employee_payslips', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_statutory_profile', 1, 1, 1, 0 UNION ALL
    SELECT 'apiv2_payroll_audit', 1, 0, 0, 0
) m JOIN ohrm_data_group dg ON dg.name = m.n WHERE @admin_role_id IS NOT NULL;

-- PayrollApprover: Inspect runs/periods/config, Approve/Reject, Lock/Reverse, Payment Batch Export & UTR Reconcile
INSERT INTO ohrm_user_role_data_group (user_role_id, data_group_id, can_read, can_create, can_update, can_delete, self)
SELECT @approver_role_id, id, r, c, u, d, 0 FROM (
    SELECT 'payroll_pay_periods' AS n, 1 r, 0 c, 0 u, 0 d UNION ALL
    SELECT 'payroll_run_process', 1, 0, 0, 0 UNION ALL
    SELECT 'payroll_run_approve', 1, 0, 1, 0 UNION ALL
    SELECT 'payroll_run_lock', 1, 0, 1, 0 UNION ALL
    SELECT 'payroll_payments', 1, 1, 1, 0 UNION ALL
    SELECT 'payroll_config', 1, 0, 0, 0 UNION ALL
    SELECT 'payroll_audit', 1, 0, 0, 0 UNION ALL
    SELECT 'payroll_employee_payslips', 1, 0, 0, 0 UNION ALL
    SELECT 'payroll_statutory_profile', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_pay_period', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_run', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_run_approve', 0, 1, 1, 0 UNION ALL
    SELECT 'apiv2_payroll_run_lock', 0, 1, 1, 0 UNION ALL
    SELECT 'apiv2_payroll_config', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_payment_batch', 1, 1, 1, 0 UNION ALL
    SELECT 'apiv2_payroll_my_slips', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_slip', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_employee_payslips', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_statutory_profile', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_audit', 1, 0, 0, 0
) m JOIN ohrm_data_group dg ON dg.name = m.n WHERE @approver_role_id IS NOT NULL;

-- ESS (self-only permissions for My Salary Slips, self Payslips tab, self Statutory Profile read)
INSERT INTO ohrm_user_role_data_group (user_role_id, data_group_id, can_read, can_create, can_update, can_delete, self)
SELECT @ess_role_id, id, r, c, u, d, 1 FROM (
    SELECT 'payroll_employee_payslips' AS n, 1 r, 0 c, 0 u, 0 d UNION ALL
    SELECT 'payroll_statutory_profile', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_my_slips', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_slip', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_employee_payslips', 1, 0, 0, 0 UNION ALL
    SELECT 'apiv2_payroll_statutory_profile', 1, 0, 0, 0
) m JOIN ohrm_data_group dg ON dg.name = m.n WHERE @ess_role_id IS NOT NULL;

-- 9. I18N Group & Translation Keys for Payroll module and PIM/My Info integration
INSERT INTO ohrm_i18n_group (name, title)
SELECT 'payroll', 'Payroll' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM ohrm_i18n_group WHERE name = 'payroll');

SET @payroll_i18n_group := (SELECT id FROM ohrm_i18n_group WHERE name = 'payroll' LIMIT 1);
SET @en_us_lang_id := (SELECT id FROM ohrm_i18n_language WHERE code = 'en_US' LIMIT 1);

INSERT INTO ohrm_i18n_lang_string (unit_id, group_id, value, note, version)
SELECT k.unit_id, @payroll_i18n_group, k.val, 'India Payroll v2.2', '5.8.0'
FROM (
    SELECT 'payroll_title' AS unit_id, 'Payroll' AS val UNION ALL
    SELECT 'payroll_pay_periods', 'Pay Periods' UNION ALL
    SELECT 'payroll_processing', 'Payroll Processing' UNION ALL
    SELECT 'payroll_payments', 'Payments' UNION ALL
    SELECT 'payroll_my_salary_slips', 'My Salary Slips' UNION ALL
    SELECT 'payroll_audit_trail', 'Audit Trail' UNION ALL
    SELECT 'payroll_configuration', 'Configuration' UNION ALL
    SELECT 'payroll_payslips_tab', 'Payslips' UNION ALL
    SELECT 'payroll_statutory_profile_tab', 'Statutory Profile' UNION ALL
    SELECT 'payroll_calculate_batch', 'Calculate Payroll' UNION ALL
    SELECT 'payroll_submit_approval', 'Submit for Approval' UNION ALL
    SELECT 'payroll_approve_run', 'Approve Run' UNION ALL
    SELECT 'payroll_reject_run', 'Reject Run' UNION ALL
    SELECT 'payroll_lock_run', 'Lock Run' UNION ALL
    SELECT 'payroll_export_bank_csv', 'Export Bank CSV' UNION ALL
    SELECT 'payroll_reconcile_payment', 'Confirm & Reconcile Bank Payment'
) k
WHERE NOT EXISTS (
    SELECT 1 FROM ohrm_i18n_lang_string s WHERE s.unit_id = k.unit_id AND s.group_id = @payroll_i18n_group
);

INSERT IGNORE INTO ohrm_i18n_translate (lang_string_id, language_id, value, customized, version, modified_at)
SELECT s.id, @en_us_lang_id, s.value, 0, '5.8.0', NOW()
FROM ohrm_i18n_lang_string s
WHERE s.group_id = @payroll_i18n_group AND @en_us_lang_id IS NOT NULL;

-- 10. Default India Statutory Configuration, Slabs & FY 2026-27 Tax Brackets (INR)
INSERT IGNORE INTO hs_hr_currency_type (code, currency_id, currency_name) VALUES (67, 'INR', 'Indian Rupee');

INSERT INTO ohrm_payroll_config (
    jurisdiction_code, default_currency_id, pay_frequency, lwp_divisor_mode,
    time_attendance_source_mode, standard_shift_hours, overtime_multiplier,
    overtime_eligible_max_basic, epf_wage_ceiling, epf_cap_at_ceiling,
    esic_gross_ceiling, default_pt_state_code, default_tax_regime, require_maker_checker_approval
)
SELECT 'IN', 'INR', 'MONTHLY', 'CALENDAR_DAYS', 'ATTENDANCE_ONLY', 8.00, 2.00, 50000.00, 15000.00, 1, 21000.00, 'KA', 'NEW_115BAC', 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM ohrm_payroll_config WHERE jurisdiction_code = 'IN');

-- Seed FY 2026-27 New Tax Regime (Sec 115BAC: Std Deduction 75,000; 0%, 5%, 10%, 15%, 20%, 25%, 30%; 4% Cess; Sec 87A rebate up to 12,00,000 taxable income)
INSERT IGNORE INTO ohrm_payroll_tax_bracket (jurisdiction_code, financial_year, tax_regime, slab_order, min_income, max_income, tax_rate, cess_rate, rebate_limit, rebate_max_amount, standard_deduction, is_active) VALUES
('IN', '2026-27', 'NEW_115BAC', 1, 0.00, 400000.00, 0.0000, 4.0000, 1200000.00, 60000.00, 75000.00, 1),
('IN', '2026-27', 'NEW_115BAC', 2, 400000.00, 800000.00, 5.0000, 4.0000, 1200000.00, 60000.00, 75000.00, 1),
('IN', '2026-27', 'NEW_115BAC', 3, 800000.00, 1200000.00, 10.0000, 4.0000, 1200000.00, 60000.00, 75000.00, 1),
('IN', '2026-27', 'NEW_115BAC', 4, 1200000.00, 1600000.00, 15.0000, 4.0000, 1200000.00, 60000.00, 75000.00, 1),
('IN', '2026-27', 'NEW_115BAC', 5, 1600000.00, 2000000.00, 20.0000, 4.0000, 1200000.00, 60000.00, 75000.00, 1),
('IN', '2026-27', 'NEW_115BAC', 6, 2000000.00, 2400000.00, 25.0000, 4.0000, 1200000.00, 60000.00, 75000.00, 1),
('IN', '2026-27', 'NEW_115BAC', 7, 2400000.00, NULL, 30.0000, 4.0000, 1200000.00, 60000.00, 75000.00, 1);

-- Seed FY 2026-27 Old Tax Regime (Std Deduction 50,000; 0%, 5%, 20%, 30%; 4% Cess; Sec 87A rebate up to 5,00,000 max 12,500)
INSERT IGNORE INTO ohrm_payroll_tax_bracket (jurisdiction_code, financial_year, tax_regime, slab_order, min_income, max_income, tax_rate, cess_rate, rebate_limit, rebate_max_amount, standard_deduction, is_active) VALUES
('IN', '2026-27', 'OLD', 1, 0.00, 250000.00, 0.0000, 4.0000, 500000.00, 12500.00, 50000.00, 1),
('IN', '2026-27', 'OLD', 2, 250000.00, 500000.00, 5.0000, 4.0000, 500000.00, 12500.00, 50000.00, 1),
('IN', '2026-27', 'OLD', 3, 500000.00, 1000000.00, 20.0000, 4.0000, 500000.00, 12500.00, 50000.00, 1),
('IN', '2026-27', 'OLD', 4, 1000000.00, NULL, 30.0000, 4.0000, 500000.00, 12500.00, 50000.00, 1);

-- Seed Statutory Rules (EPF, ESIC, Karnataka PT, Maharashtra PT with Feb 300 rule, West Bengal PT)
DELETE FROM ohrm_payroll_statutory_rule WHERE jurisdiction_code = 'IN';
INSERT INTO ohrm_payroll_statutory_rule (jurisdiction_code, rule_type, state_code, effective_from, effective_to, slab_min, slab_max, employee_rate, employer_rate, fixed_employee_amount, february_employee_amount, wage_ceiling, rounding_mode, metadata_json, is_active) VALUES
('IN', 'EPF', NULL, '2024-04-01', NULL, 0.00, NULL, 12.0000, 12.0000, 0.00, NULL, 15000.00, 'ROUND_HALF_UP_RUPEE', '{"eps_rate":8.33,"epf_diff_rate":3.67,"admin_charges_rate":0.50,"edli_rate":0.50}', 1),
('IN', 'ESIC', NULL, '2024-04-01', NULL, 0.00, 21000.00, 0.7500, 3.2500, 0.00, NULL, 21000.00, 'CEIL_RUPEE', '{"threshold_is_gross":true}', 1),
('IN', 'PT', 'KA', '2024-04-01', NULL, 0.00, 24999.99, 0.0000, 0.0000, 0.00, 0.00, NULL, 'FIXED', NULL, 1),
('IN', 'PT', 'KA', '2024-04-01', NULL, 25000.00, NULL, 0.0000, 0.0000, 200.00, 200.00, NULL, 'FIXED', NULL, 1),
('IN', 'PT', 'MH', '2024-04-01', NULL, 0.00, 7500.00, 0.0000, 0.0000, 0.00, 0.00, NULL, 'FIXED', NULL, 1),
('IN', 'PT', 'MH', '2024-04-01', NULL, 7500.01, 10000.00, 0.0000, 0.0000, 175.00, 175.00, NULL, 'FIXED', NULL, 1),
('IN', 'PT', 'MH', '2024-04-01', NULL, 10000.01, NULL, 0.0000, 0.0000, 200.00, 300.00, NULL, 'FIXED', NULL, 1),
('IN', 'PT', 'WB', '2024-04-01', NULL, 0.00, 10000.00, 0.0000, 0.0000, 0.00, 0.00, NULL, 'FIXED', NULL, 1),
('IN', 'PT', 'WB', '2024-04-01', NULL, 10000.01, 15000.00, 0.0000, 0.0000, 110.00, 110.00, NULL, 'FIXED', NULL, 1),
('IN', 'PT', 'WB', '2024-04-01', NULL, 15000.01, 25000.00, 0.0000, 0.0000, 130.00, 130.00, NULL, 'FIXED', NULL, 1),
('IN', 'PT', 'WB', '2024-04-01', NULL, 25000.01, 40000.00, 0.0000, 0.0000, 150.00, 150.00, NULL, 'FIXED', NULL, 1),
('IN', 'PT', 'WB', '2024-04-01', NULL, 40000.01, NULL, 0.0000, 0.0000, 200.00, 200.00, NULL, 'FIXED', NULL, 1);

-- Ensure any existing Leave Types have an explicit policy entry (default PAID except 'LWP'/'Unpaid' named types)
INSERT IGNORE INTO ohrm_payroll_leave_policy (leave_type_id, payroll_pay_treatment, deduction_multiplier, effective_from, notes)
SELECT id,
       CASE WHEN LOWER(name) LIKE '%unpaid%' OR LOWER(name) LIKE '%lwp%' OR LOWER(name) LIKE '%loss of pay%' THEN 'UNPAID' ELSE 'PAID' END,
       CASE WHEN LOWER(name) LIKE '%unpaid%' OR LOWER(name) LIKE '%lwp%' OR LOWER(name) LIKE '%loss of pay%' THEN 1.0000 ELSE 0.0000 END,
       '2026-01-01',
       'Initialized by India Payroll v2.2 migration'
FROM ohrm_leave_type WHERE deleted = 0;
