-- OrangeHRM India-Standard Payroll Extension v2.2 Schema Migration
-- Compatible with MariaDB 10.3+ (UTF8/UTF8MB4 matching existing OrangeHRM core tables)
-- Uses clean inline CREATE TABLE definitions (avoiding multi-step InnoDB ALTER TABLE rebuilds).

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Pay Periods (ohrm_pay_period; distinct from hs_hr_pay_period / hs_hr_payperiod)
CREATE TABLE IF NOT EXISTS `ohrm_pay_period` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `pay_date` DATE NOT NULL,
    `frequency` VARCHAR(30) NOT NULL DEFAULT 'MONTHLY',
    `status` VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    `jurisdiction_code` VARCHAR(20) NOT NULL DEFAULT 'IN',
    `financial_year` VARCHAR(16) NOT NULL DEFAULT '2026-27',
    `period_month` TINYINT(2) NULL,
    `period_year` SMALLINT(4) NULL,
    `currency_id` VARCHAR(3) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'INR',
    `standard_working_days` DECIMAL(5,2) NOT NULL DEFAULT 22.00,
    `created_by` INT(10) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_pay_period_range` (`start_date`, `end_date`, `jurisdiction_code`),
    KEY `idx_pay_period_dates` (`start_date`, `end_date`),
    KEY `idx_pay_period_status` (`status`),
    CONSTRAINT `fk_pay_period_currency` FOREIGN KEY (`currency_id`) REFERENCES `hs_hr_currency_type` (`currency_id`) ON UPDATE CASCADE,
    CONSTRAINT `fk_pay_period_created_by` FOREIGN KEY (`created_by`) REFERENCES `ohrm_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Payroll Jurisdiction & Policy Configuration (inside orangehrmPayrollPlugin boundary)
CREATE TABLE IF NOT EXISTS `ohrm_payroll_config` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `jurisdiction_code` VARCHAR(20) NOT NULL DEFAULT 'IN',
    `default_currency_id` VARCHAR(3) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'INR',
    `pay_frequency` VARCHAR(30) NOT NULL DEFAULT 'MONTHLY',
    `lwp_divisor_mode` VARCHAR(30) NOT NULL DEFAULT 'CALENDAR_DAYS',
    `time_attendance_source_mode` VARCHAR(50) NOT NULL DEFAULT 'ATTENDANCE_ONLY',
    `standard_shift_hours` DECIMAL(5,2) NOT NULL DEFAULT 8.00,
    `overtime_multiplier` DECIMAL(5,2) NOT NULL DEFAULT 2.00,
    `overtime_eligible_max_basic` DECIMAL(15,2) NULL DEFAULT 50000.00,
    `epf_wage_ceiling` DECIMAL(15,2) NOT NULL DEFAULT 15000.00,
    `epf_cap_at_ceiling` TINYINT(1) NOT NULL DEFAULT 1,
    `esic_gross_ceiling` DECIMAL(15,2) NOT NULL DEFAULT 21000.00,
    `default_pt_state_code` VARCHAR(10) NOT NULL DEFAULT 'KA',
    `default_tax_regime` VARCHAR(20) NOT NULL DEFAULT 'NEW_115BAC',
    `require_maker_checker_approval` TINYINT(1) NOT NULL DEFAULT 1,
    `updated_by` INT(10) NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_payroll_config_jurisdiction` (`jurisdiction_code`),
    CONSTRAINT `fk_payroll_config_currency` FOREIGN KEY (`default_currency_id`) REFERENCES `hs_hr_currency_type` (`currency_id`) ON UPDATE CASCADE,
    CONSTRAINT `fk_payroll_config_user` FOREIGN KEY (`updated_by`) REFERENCES `ohrm_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Versioned Statutory Rules (EPF, ESIC, State PT slabs, Cess)
CREATE TABLE IF NOT EXISTS `ohrm_payroll_statutory_rule` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `jurisdiction_code` VARCHAR(20) NOT NULL DEFAULT 'IN',
    `rule_type` VARCHAR(30) NOT NULL,
    `state_code` VARCHAR(10) NULL,
    `effective_from` DATE NOT NULL,
    `effective_to` DATE NULL,
    `slab_min` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `slab_max` DECIMAL(15,2) NULL,
    `employee_rate` DECIMAL(7,4) NOT NULL DEFAULT 0.0000,
    `employer_rate` DECIMAL(7,4) NOT NULL DEFAULT 0.0000,
    `fixed_employee_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `february_employee_amount` DECIMAL(15,2) NULL,
    `wage_ceiling` DECIMAL(15,2) NULL,
    `rounding_mode` VARCHAR(30) NOT NULL DEFAULT 'HALF_UP',
    `metadata_json` LONGTEXT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    KEY `idx_psr_lookup` (`jurisdiction_code`, `rule_type`, `state_code`, `is_active`, `effective_from`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Effective-Dated Income Tax Brackets (New Regime 115BAC & Old Regime)
CREATE TABLE IF NOT EXISTS `ohrm_payroll_tax_bracket` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `jurisdiction_code` VARCHAR(20) NOT NULL DEFAULT 'IN',
    `financial_year` VARCHAR(16) NOT NULL,
    `tax_regime` VARCHAR(20) NOT NULL,
    `slab_order` INT(11) NOT NULL,
    `min_income` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `max_income` DECIMAL(15,2) NULL,
    `tax_rate` DECIMAL(7,4) NOT NULL DEFAULT 0.0000,
    `cess_rate` DECIMAL(7,4) NOT NULL DEFAULT 4.0000,
    `rebate_limit` DECIMAL(15,2) NOT NULL DEFAULT 1200000.00,
    `rebate_max_amount` DECIMAL(15,2) NOT NULL DEFAULT 60000.00,
    `standard_deduction` DECIMAL(15,2) NOT NULL DEFAULT 75000.00,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_ptb_fy_regime_order` (`jurisdiction_code`, `financial_year`, `tax_regime`, `slab_order`),
    KEY `idx_ptb_active` (`jurisdiction_code`, `financial_year`, `tax_regime`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Explicit Leave Type to Payroll Policy Mapping (never misuses situational flag)
CREATE TABLE IF NOT EXISTS `ohrm_payroll_leave_policy` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `leave_type_id` INT(10) UNSIGNED NOT NULL,
    `payroll_pay_treatment` VARCHAR(30) NOT NULL DEFAULT 'PAID',
    `deduction_multiplier` DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    `effective_from` DATE NOT NULL DEFAULT '2026-01-01',
    `notes` VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_plp_leave_type` (`leave_type_id`),
    CONSTRAINT `fk_payroll_leave_policy_type` FOREIGN KEY (`leave_type_id`) REFERENCES `ohrm_leave_type` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Indian Employee Statutory & Banking Profile (keeps hs_hr_emp_us_tax and dd_routing_num intact)
CREATE TABLE IF NOT EXISTS `ohrm_payroll_emp_profile` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `emp_number` INT(11) NOT NULL,
    `pan_number` VARCHAR(20) NULL,
    `uan_number` VARCHAR(20) NULL,
    `esic_ip_number` VARCHAR(30) NULL,
    `pt_state_code` VARCHAR(10) NOT NULL DEFAULT 'KA',
    `tax_regime` VARCHAR(20) NOT NULL DEFAULT 'NEW_115BAC',
    `epf_opted_in` TINYINT(1) NOT NULL DEFAULT 1,
    `epf_restrict_to_ceiling` TINYINT(1) NOT NULL DEFAULT 1,
    `esic_applicable` TINYINT(1) NOT NULL DEFAULT 1,
    `pt_applicable` TINYINT(1) NOT NULL DEFAULT 1,
    `basic_percent_of_ctc` DECIMAL(5,2) NOT NULL DEFAULT 50.00,
    `hra_percent_of_basic` DECIMAL(5,2) NOT NULL DEFAULT 40.00,
    `declared_80c` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `declared_80d` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `declared_hra_annual` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `other_exemptions` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `bank_account_holder` VARCHAR(120) NULL,
    `bank_account_number` VARCHAR(50) NULL,
    `bank_ifsc_code` VARCHAR(20) NULL,
    `bank_name` VARCHAR(100) NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_payroll_emp_profile_emp` (`emp_number`),
    CONSTRAINT `fk_payroll_emp_profile_emp` FOREIGN KEY (`emp_number`) REFERENCES `hs_hr_employee` (`emp_number`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Versioned Payroll Run State Machine per Pay Period
CREATE TABLE IF NOT EXISTS `ohrm_payroll_run` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `pay_period_id` INT(11) NOT NULL,
    `run_version` INT(11) NOT NULL DEFAULT 1,
    `run_type` VARCHAR(20) NOT NULL DEFAULT 'REGULAR',
    `status` VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    `calculation_version` VARCHAR(32) NOT NULL DEFAULT 'IN-FY2026-27-v2.2',
    `idempotency_key` VARCHAR(128) NULL,
    `total_employees` INT(11) NOT NULL DEFAULT 0,
    `total_gross` DECIMAL(19,4) NOT NULL DEFAULT 0.0000,
    `total_deductions` DECIMAL(19,4) NOT NULL DEFAULT 0.0000,
    `total_tax` DECIMAL(19,4) NOT NULL DEFAULT 0.0000,
    `total_reimbursements` DECIMAL(19,4) NOT NULL DEFAULT 0.0000,
    `total_net_pay` DECIMAL(19,4) NOT NULL DEFAULT 0.0000,
    `exception_count` INT(11) NOT NULL DEFAULT 0,
    `created_by` INT(10) NULL,
    `submitted_by` INT(10) NULL,
    `submitted_at` DATETIME NULL,
    `approved_by` INT(10) NULL,
    `approved_at` DATETIME NULL,
    `locked_by` INT(10) NULL,
    `locked_at` DATETIME NULL,
    `rejection_reason` VARCHAR(500) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_payroll_run_period_ver` (`pay_period_id`, `run_version`),
    UNIQUE KEY `uq_payroll_run_idem` (`idempotency_key`),
    KEY `idx_payroll_run_status` (`status`),
    CONSTRAINT `fk_payroll_run_period` FOREIGN KEY (`pay_period_id`) REFERENCES `ohrm_pay_period` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_payroll_run_created_by` FOREIGN KEY (`created_by`) REFERENCES `ohrm_user` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_payroll_run_submitted_by` FOREIGN KEY (`submitted_by`) REFERENCES `ohrm_user` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_payroll_run_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `ohrm_user` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_payroll_run_locked_by` FOREIGN KEY (`locked_by`) REFERENCES `ohrm_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Immutable Employee Salary & Eligibility Snapshot Captured at Calculation Time
CREATE TABLE IF NOT EXISTS `ohrm_payroll_emp_snapshot` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `payroll_run_id` INT(11) NOT NULL,
    `emp_number` INT(11) NOT NULL,
    `employee_code` VARCHAR(50) NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `department_name` VARCHAR(150) NULL,
    `job_title_name` VARCHAR(150) NULL,
    `location_state` VARCHAR(60) NULL,
    `employment_status` VARCHAR(60) NULL,
    `is_eligible` TINYINT(1) NOT NULL DEFAULT 1,
    `ineligibility_reason` VARCHAR(255) NULL,
    `base_monthly_salary` DECIMAL(19,4) NOT NULL DEFAULT 0.0000,
    `currency_id` VARCHAR(3) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'INR',
    `pay_grade_id` INT(11) NULL,
    `tax_regime` VARCHAR(20) NOT NULL DEFAULT 'NEW_115BAC',
    `pt_state_code` VARCHAR(10) NOT NULL DEFAULT 'KA',
    `snapshot_payload_json` LONGTEXT NOT NULL,
    `snapshot_hash` VARCHAR(64) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_snapshot_run_emp` (`payroll_run_id`, `emp_number`),
    KEY `idx_snapshot_emp` (`emp_number`),
    CONSTRAINT `fk_snapshot_run` FOREIGN KEY (`payroll_run_id`) REFERENCES `ohrm_payroll_run` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_snapshot_emp` FOREIGN KEY (`emp_number`) REFERENCES `hs_hr_employee` (`emp_number`) ON DELETE CASCADE,
    CONSTRAINT `fk_snapshot_currency` FOREIGN KEY (`currency_id`) REFERENCES `hs_hr_currency_type` (`currency_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Employee Payroll Record per Run
CREATE TABLE IF NOT EXISTS `ohrm_payroll_record` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `payroll_run_id` INT(11) NOT NULL,
    `pay_period_id` INT(11) NOT NULL,
    `emp_number` INT(11) NOT NULL,
    `snapshot_id` INT(11) NULL,
    `basic_salary` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `hra_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `special_allowance` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `overtime_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `reimbursement_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `lwp_deduction` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `gross_salary` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `total_allowance` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `total_deduction` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `epf_employee` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `epf_employer` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `esic_employee` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `esic_employer` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `professional_tax` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `total_tax` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `income_tax_tds` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `health_education_cess` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `adjustment_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `net_salary` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `currency_id` VARCHAR(3) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'INR',
    `working_days` DECIMAL(6,2) NOT NULL DEFAULT 22.00,
    `payable_days` DECIMAL(6,2) NOT NULL DEFAULT 22.00,
    `lwp_days` DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    `overtime_hours` DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    `tax_regime` VARCHAR(20) NOT NULL DEFAULT 'NEW_115BAC',
    `status` VARCHAR(32) NOT NULL DEFAULT 'CALCULATED',
    `payment_status` VARCHAR(32) NOT NULL DEFAULT 'UNPAID',
    `is_manual_override` TINYINT(1) NOT NULL DEFAULT 0,
    `validation_warnings_json` LONGTEXT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_payroll_record_run_emp` (`payroll_run_id`, `emp_number`),
    KEY `idx_payroll_record_period` (`pay_period_id`),
    KEY `idx_payroll_record_emp_period` (`emp_number`, `pay_period_id`),
    KEY `idx_payroll_record_status` (`status`),
    CONSTRAINT `fk_payroll_record_run` FOREIGN KEY (`payroll_run_id`) REFERENCES `ohrm_payroll_run` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_payroll_record_period` FOREIGN KEY (`pay_period_id`) REFERENCES `ohrm_pay_period` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_payroll_record_emp` FOREIGN KEY (`emp_number`) REFERENCES `hs_hr_employee` (`emp_number`) ON DELETE CASCADE,
    CONSTRAINT `fk_payroll_record_snapshot` FOREIGN KEY (`snapshot_id`) REFERENCES `ohrm_payroll_emp_snapshot` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_payroll_record_currency` FOREIGN KEY (`currency_id`) REFERENCES `hs_hr_currency_type` (`currency_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Itemized Line Breakdown per Payroll Record
CREATE TABLE IF NOT EXISTS `ohrm_payroll_item` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `payroll_record_id` INT(11) NOT NULL,
    `item_type` VARCHAR(30) NOT NULL,
    `component_code` VARCHAR(40) NOT NULL DEFAULT 'GENERAL',
    `component_name` VARCHAR(100) NOT NULL,
    `amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `is_taxable` TINYINT(1) NOT NULL DEFAULT 1,
    `is_statutory` TINYINT(1) NOT NULL DEFAULT 0,
    `source_module` VARCHAR(30) NULL DEFAULT 'PIM',
    `notes` VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    KEY `idx_payroll_item_record` (`payroll_record_id`),
    KEY `idx_payroll_item_type` (`item_type`),
    CONSTRAINT `fk_payroll_item_record` FOREIGN KEY (`payroll_record_id`) REFERENCES `ohrm_payroll_record` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Bank Payment Batches (NEFT / IMPS CSV Export & UTR Reconciliation)
CREATE TABLE IF NOT EXISTS `ohrm_payroll_payment_batch` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `payroll_run_id` INT(11) NOT NULL,
    `batch_reference` VARCHAR(64) NOT NULL,
    `payment_mode` VARCHAR(30) NOT NULL DEFAULT 'NEFT',
    `total_amount` DECIMAL(19,4) NOT NULL DEFAULT 0.0000,
    `record_count` INT(11) NOT NULL DEFAULT 0,
    `currency_id` VARCHAR(3) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'INR',
    `status` VARCHAR(32) NOT NULL DEFAULT 'PAYMENT_PENDING',
    `export_csv_path` VARCHAR(255) NULL,
    `utr_number` VARCHAR(100) NULL,
    `exported_by` INT(10) NULL,
    `exported_at` DATETIME NULL,
    `reconciled_by` INT(10) NULL,
    `reconciled_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_payment_batch_ref` (`batch_reference`),
    KEY `idx_payment_batch_run` (`payroll_run_id`),
    CONSTRAINT `fk_ppb_run` FOREIGN KEY (`payroll_run_id`) REFERENCES `ohrm_payroll_run` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ppb_currency` FOREIGN KEY (`currency_id`) REFERENCES `hs_hr_currency_type` (`currency_id`) ON UPDATE CASCADE,
    CONSTRAINT `fk_ppb_exported_by` FOREIGN KEY (`exported_by`) REFERENCES `ohrm_user` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_ppb_reconciled_by` FOREIGN KEY (`reconciled_by`) REFERENCES `ohrm_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. 6-Stage Claim-to-Payroll Lifecycle Link (prevents concurrent double-claim reservation)
CREATE TABLE IF NOT EXISTS `ohrm_payroll_claim_link` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `payroll_run_id` INT(11) NOT NULL,
    `payroll_record_id` INT(11) NULL,
    `claim_request_id` INT(11) NOT NULL,
    `emp_number` INT(11) NOT NULL,
    `claim_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `currency_id` VARCHAR(3) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'INR',
    `settlement_status` VARCHAR(32) NOT NULL DEFAULT 'RESERVED',
    `active_claim_lock` INT(11) NULL,
    `payment_batch_id` INT(11) NULL,
    `bank_reference` VARCHAR(100) NULL,
    `reconciled_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_active_claim_lock` (`active_claim_lock`),
    KEY `idx_pcl_run` (`payroll_run_id`),
    KEY `idx_pcl_claim` (`claim_request_id`),
    CONSTRAINT `fk_pcl_run` FOREIGN KEY (`payroll_run_id`) REFERENCES `ohrm_payroll_run` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pcl_record` FOREIGN KEY (`payroll_record_id`) REFERENCES `ohrm_payroll_record` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_pcl_claim` FOREIGN KEY (`claim_request_id`) REFERENCES `ohrm_claim_request` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pcl_emp` FOREIGN KEY (`emp_number`) REFERENCES `hs_hr_employee` (`emp_number`) ON DELETE CASCADE,
    CONSTRAINT `fk_pcl_batch` FOREIGN KEY (`payment_batch_id`) REFERENCES `ohrm_payroll_payment_batch` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_pcl_currency` FOREIGN KEY (`currency_id`) REFERENCES `hs_hr_currency_type` (`currency_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Maker-Checker Approvals History
CREATE TABLE IF NOT EXISTS `ohrm_payroll_approval` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `payroll_run_id` INT(11) NOT NULL,
    `action` VARCHAR(32) NOT NULL,
    `actor_user_id` INT(10) NOT NULL,
    `comments` VARCHAR(500) NULL,
    `action_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_pa_run` (`payroll_run_id`),
    CONSTRAINT `fk_pa_run` FOREIGN KEY (`payroll_run_id`) REFERENCES `ohrm_payroll_run` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pa_user` FOREIGN KEY (`actor_user_id`) REFERENCES `ohrm_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Payslip Archive & Publication Status
CREATE TABLE IF NOT EXISTS `ohrm_salary_slip` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `payroll_record_id` INT(11) NOT NULL,
    `payroll_run_id` INT(11) NULL,
    `emp_number` INT(11) NULL,
    `slip_number` VARCHAR(50) NOT NULL,
    `slip_status` VARCHAR(30) NOT NULL DEFAULT 'DRAFT_PREVIEW',
    `file_path` VARCHAR(255) NOT NULL,
    `generated_at` DATETIME NOT NULL,
    `published_at` DATETIME NULL,
    `voided_at` DATETIME NULL,
    `downloaded_at` DATETIME NULL,
    `html_snapshot` LONGTEXT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_salary_slip_record` (`payroll_record_id`),
    UNIQUE KEY `uq_salary_slip_number` (`slip_number`),
    KEY `idx_salary_slip_emp` (`emp_number`),
    CONSTRAINT `fk_salary_slip_record` FOREIGN KEY (`payroll_record_id`) REFERENCES `ohrm_payroll_record` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_salary_slip_run` FOREIGN KEY (`payroll_run_id`) REFERENCES `ohrm_payroll_run` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Immutable Append-Only Payroll Audit Log
CREATE TABLE IF NOT EXISTS `ohrm_payroll_audit_event` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `event_type` VARCHAR(64) NOT NULL,
    `entity_type` VARCHAR(64) NOT NULL,
    `entity_id` INT(11) NULL,
    `payroll_run_id` INT(11) NULL,
    `emp_number` INT(11) NULL,
    `actor_user_id` INT(10) NULL,
    `before_json` LONGTEXT NULL,
    `after_json` LONGTEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `occurred_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_pae_run` (`payroll_run_id`),
    KEY `idx_pae_emp` (`emp_number`),
    KEY `idx_pae_type_time` (`event_type`, `occurred_at`),
    CONSTRAINT `fk_pae_run` FOREIGN KEY (`payroll_run_id`) REFERENCES `ohrm_payroll_run` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_pae_user` FOREIGN KEY (`actor_user_id`) REFERENCES `ohrm_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
