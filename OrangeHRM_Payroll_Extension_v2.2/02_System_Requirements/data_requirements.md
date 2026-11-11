# OrangeHRM v2.2 India Payroll Extension — Data Requirements, Privacy & Retention

## 1.0 Data Governance & Financial Classification
1. **Master Consumption (Read-Only):** Consumes PIM `hs_hr_employee`, `hs_hr_emp_basicsalary`, Leave `ohrm_leave`, Attendance/Time `ohrm_attendance_record` / `ohrm_timesheet_item`, and Admin `ohrm_pay_grade`, `hs_hr_currency_type` without mutating core HR entities (except transitioning `ohrm_claim_request.status` from `APPROVED -> PAID` strictly upon reconciled bank UTR).
2. **Financial & Tax Confidentiality:** Payroll calculation tables store statutory breakdown (`basic_salary`, `hra_amount`, `epf_employee`, `esic_employee`, `professional_tax`, `income_tax_tds`, `health_education_cess`) using `DECIMAL(15,2)` / `DECIMAL(19,4)` fixed-point precision and string-safe `Money` math.
3. **Restricted Banking PII:** Bank account numbers (`ohrm_payroll_emp_profile.bank_account_number`) and IFSC codes (`bank_ifsc_code`) are never exposed in raw form inside `PayrollRecordModel`, payslip HTML previews, or AI chatbot payloads — calculation records & slips expose only masked `XXXXXX` + last 4 digits. Unmasked account numbers are serialized exclusively inside authorized NEFT/IMPS disbursement CSV exports.

---

## 2.0 MariaDB Table Inventory (15 Payroll Tables — Verified `183` Total Tables Across `orangehrm_mysql` & `test_orangehrm_mysql`)

| Doctrine Entity | MariaDB Table Name | Purpose |
| :--- | :--- | :--- |
| `PayrollPayPeriod` | `ohrm_pay_period` | India monthly INR pay period definitions & non-overlap constraint (`uq_pay_period_range`) |
| `PayrollConfig` | `ohrm_payroll_config` | Jurisdiction settings, LWP divisor mode, OT multiplier/ceiling, EPF/ESIC thresholds, SoD flag |
| `PayrollStatutoryRule` | `ohrm_payroll_statutory_rule` | Effective-dated EPF, ESIC, and state PT slabs (`KA`, `MH` February ₹300 override, `WB`, `TN`) |
| `PayrollTaxBracket` | `ohrm_payroll_tax_bracket` | FY 2026-27 Income Tax slabs (`NEW_115BAC`, `OLD`), Sec 87A rebate & cess rates |
| `PayrollLeavePolicy` | `ohrm_payroll_leave_policy` | Explicit mapping from `ohrm_leave_type` to `PAID` / `UNPAID_LWP` / `HALF_PAID` |
| `EmployeePayrollProfile` | `ohrm_payroll_emp_profile` | Employee PAN, EPF UAN, ESIC IP, PT state, Tax Regime, 80C/80D/HRA declarations, bank details |
| `PayrollRun` | `ohrm_payroll_run` | Versioned payroll run header with `idempotency_key` & workflow actor timestamps |
| `PayrollEmployeeSnapshot` | `ohrm_payroll_emp_snapshot` | Frozen calculation-time employee snapshot with `is_eligible`, `ineligibility_reason`, `snapshot_hash` |
| `PayrollRecord` | `ohrm_payroll_record` | Employee-level calculated salary, deductions, TDS, net pay & `validation_warnings_json` |
| `PayrollItem` | `ohrm_payroll_item` | Itemized earnings, statutory deductions, taxes, LWP & claim line items |
| `PayrollPaymentBatch` | `ohrm_payroll_payment_batch` | NEFT/IMPS disbursement batch tracking export & Bank UTR reconciliation |
| `PayrollClaimLink` | `ohrm_payroll_claim_link` | 6-stage Claim reservation link with `UNIQUE uq_active_claim_lock` anti-double-claim guard |
| `PayrollApproval` | `ohrm_payroll_approval` | Maker-Checker approval/rejection/lock/reversal action history |
| `SalarySlip` | `ohrm_salary_slip` | Slip archive (`DRAFT_PREVIEW` -> `PUBLISHED` -> `VOIDED`) and immutable HTML snapshot |
| `PayrollAuditEvent` | `ohrm_payroll_audit_event` | Append-only audit log capturing `before_json`, `after_json`, actor user, and timestamp |

