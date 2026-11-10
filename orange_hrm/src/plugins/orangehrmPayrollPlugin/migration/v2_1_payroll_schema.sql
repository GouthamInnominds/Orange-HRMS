-- =============================================================================
-- Migration: Add Enterprise Payroll Schema Tables
-- Release: OrangeHRM v2.1.0
-- Target Tables: ohrm_pay_period, ohrm_payroll_record, ohrm_payroll_item, ohrm_salary_slip
-- =============================================================================

CREATE TABLE IF NOT EXISTS `ohrm_pay_period` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `pay_date` DATE NOT NULL,
  `frequency` VARCHAR(30) DEFAULT 'Monthly' NOT NULL,
  `status` VARCHAR(30) DEFAULT 'Draft' NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_pay_period_dates` (`start_date`, `end_date`),
  INDEX `idx_pay_period_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ohrm_payroll_record` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `pay_period_id` INT NOT NULL,
  `emp_number` INT NOT NULL,
  `gross_salary` DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
  `total_allowance` DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
  `total_deduction` DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
  `total_tax` DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
  `net_salary` DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
  `currency_id` VARCHAR(6) DEFAULT 'USD' NOT NULL,
  `status` VARCHAR(30) DEFAULT 'Calculated' NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_payroll_record_period` FOREIGN KEY (`pay_period_id`) REFERENCES `ohrm_pay_period` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_payroll_record_emp` FOREIGN KEY (`emp_number`) REFERENCES `hs_hr_employee` (`emp_number`) ON DELETE CASCADE,
  INDEX `idx_payroll_record_emp_period` (`emp_number`, `pay_period_id`),
  INDEX `idx_payroll_record_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ohrm_payroll_item` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `payroll_record_id` INT NOT NULL,
  `item_type` VARCHAR(30) NOT NULL,
  `component_name` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
  `is_taxable` TINYINT(1) DEFAULT 1 NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_payroll_item_record` FOREIGN KEY (`payroll_record_id`) REFERENCES `ohrm_payroll_record` (`id`) ON DELETE CASCADE,
  INDEX `idx_payroll_item_type` (`item_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ohrm_salary_slip` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `payroll_record_id` INT NOT NULL UNIQUE,
  `slip_number` VARCHAR(50) NOT NULL UNIQUE,
  `file_path` VARCHAR(255) NOT NULL,
  `generated_at` DATETIME NOT NULL,
  `downloaded_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_salary_slip_record` FOREIGN KEY (`payroll_record_id`) REFERENCES `ohrm_payroll_record` (`id`) ON DELETE CASCADE,
  INDEX `idx_salary_slip_number` (`slip_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
