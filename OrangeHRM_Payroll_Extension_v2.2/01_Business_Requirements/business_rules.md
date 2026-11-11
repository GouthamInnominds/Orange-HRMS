# OrangeHRM v2.2 India Payroll Extension — Business Rules Catalog

## 1.0 India Payroll Business Rules

### 1.1 Pay Period & Run Integrity
- **`BR_PAY_001` (Single Jurisdiction & INR Currency Enforcement):** Every pay period and payroll run operates in jurisdiction `IN` and currency `INR` (`₹`). Employees lacking an `INR` compensation component in PIM for the pay period are automatically excluded (`NO_SALARY_IN_PERIOD_CURRENCY_INR`).
- **`BR_PAY_002` (Pay Period Date Non-Overlap):** Creating or updating a pay period in `ohrm_pay_period` is rejected with `HTTP 400/409` if `[startDate, endDate]` overlaps any existing pay period in jurisdiction `IN`.
- **`BR_PAY_003` (Idempotent Run Creation):** Creating a payroll run with an existing `idempotencyKey` returns the existing `PayrollRun` record rather than duplicating runs.
- **`BR_PAY_004` (Immutable PIM Snapshot per Run):** When `Calculate Batch` executes, `PayrollEmployeeSnapshotService` freezes each employee's name, employee ID, subunit, job title, employment status, monthly base salary, tax regime, PT state, and masked bank account into `ohrm_payroll_emp_snapshot` with a SHA-256 `snapshot_hash`. Subsequent PIM edits do not alter historical runs.

### 1.2 Cross-Module Consumption Rules
- **`BR_PAY_005` (Explicit Leave LWP Policy & Divisor Modes):** Approved/taken leaves (`Leave` statuses `2` Scheduled, `3` Taken) map via explicit `ohrm_payroll_leave_policy` (`PAID`, `UNPAID_LWP`, `HALF_PAID`) and `deduction_multiplier`. LWP daily divisor strictly follows `lwp_divisor_mode`: `CALENDAR_DAYS` (days in period), `WORKING_DAYS` (`standardWorkingDays`), or `FIXED_30`.
- **`BR_PAY_006` (Attendance vs. Timesheet Non-Double-Counting):** `TimeAttendancePayrollAdapter` reads either punched `AttendanceRecord` hours (`ATTENDANCE_ONLY`) or approved `TimesheetItem` hours (`TIMESHEET_PRIMARY_ATTENDANCE_VALIDATION`, flagging attendance mismatches as non-blocking validation warnings) — never summing both sources.
- **`BR_PAY_007` (Overtime Eligibility Ceiling):** Overtime payouts (`overtime_multiplier`, default `2.0x`) apply only when monthly basic salary is `<= overtime_eligible_max_basic` (`₹50,000.00` default).
- **`BR_PAY_008` (Single-Run Claim Reservation Lock):** `ClaimSettlementAdapter` links `APPROVED` INR claims via `ohrm_payroll_claim_link.active_claim_lock`, protected by a database `UNIQUE` constraint so a claim cannot be reimbursed concurrently by two payroll runs. If a run is `REVERSED`, reservations release cleanly back to `APPROVED`.

### 1.3 Indian Statutory & Tax Rules (`FY 2026-27`)
- **`BR_PAY_009` (EPF/EPS Calculation & ₹15,000 Ceiling):** Employee EPF is `12%` of EPF wage base (`min(basic, ₹15,000)` when capped -> max `₹1,800/mo`); Employer contributes `8.33%` to EPS (capped at `₹1,250/mo`) and remaining `3.67%` difference to EPF.
- **`BR_PAY_010` (ESIC Applicability Ceiling & Claim Exclusion):** ESIC (`0.75%` employee, `3.25%` employer, rounded up via `ceil` to whole rupee) applies only when monthly statutory gross `<= ₹21,000`. Approved expense reimbursements (`ohrm_claim_request`) are strictly excluded from ESIC wage base and taxable income.
- **`BR_PAY_011` (State Professional Tax & Maharashtra February Slab):** State PT (`KA`, `MH`, `WB`, `TN`) uses state-specific `ohrm_payroll_statutory_rule` slabs; Maharashtra applies the statutory `₹300` February deduction (`february_employee_amount`) in month `2`.
- **`BR_PAY_012` (TDS u/s 115BAC vs Old Regime, Sec 87A & Sec 288B):**
  - `NEW_115BAC` FY 2026-27 applies `₹75,000` Standard Deduction, 7 progressive slabs (`0–4L 0%`, `4–8L 5%`, `8–12L 10%`, `12–16L 15%`, `16–20L 20%`, `20–24L 25%`, `>24L 30%`), and Sec 87A full rebate (`0` tax) when net taxable annual income `<= ₹12,00,000`.
  - `OLD` regime applies `₹50,000` Standard Deduction plus `80C` (capped at `₹1,50,000`), `80D`, `HRA`, and `other_exemptions`.
  - Annual tax is rounded to nearest `₹10` per Sec 288B plus `4%` Health & Education Cess, reconciled YTD across prior locked runs in the same Indian FY.

### 1.4 Governance, Disbursement & Privacy Rules
- **`BR_PAY_013` (Maker-Checker Separation of Duties):** When `require_maker_checker_approval = 1`, the user who created or submitted a `PayrollRun` is strictly blocked (`HTTP 403`) from approving or locking it; a distinct user with `PayrollApprover` (Role `8`) must approve/lock.
- **`BR_PAY_014` (Immutability After Submission & Locking):** Manual overrides/adjustments are only permitted in `CALCULATED` or `REJECTED` status (`HTTP 409`/`422` once `PENDING_APPROVAL`, `APPROVED`, `LOCKED`, or `PAID_RECONCILED`). Locking publishes `SalarySlip` (`PUBLISHED`) records atomically; reversing voids published slips (`VOIDED`).
- **`BR_PAY_015` (Bank Validation Before NEFT Export & UTR Settlement):** `PayrollPaymentService::exportBankCsv()` aborts with `HTTP 422 PREREQUISITE_BLOCKED` if any payee with net salary `> 0` lacks `bank_account_number` or `bank_ifsc_code`. Reconciling a batch with a Bank UTR transitions the run to `PAID_RECONCILED` and linked claims to `PAID`.
- **`BR_PAY_016` (Bank Account Masking & ESS Slip Privacy):** Payroll calculation tables and payslips expose only masked accounts (`XXXXXX` + last 4 digits). ESS employees can view/download only their own `PUBLISHED` payslips (`HTTP 403` on drafts or peer employee slips).

