# OrangeHRM v2.2 India Payroll Extension — User Stories Catalog

**Total User Stories:** 12 (`US_PAY_001` – `US_PAY_012`)  
**Jurisdiction & Currency:** India (`IN`) · INR (`₹`) · Financial Year `2026-27`  
**Methodology:** Agile / BDD (Given-When-Then Acceptance Criteria) mapped across 6 OrangeHRM Modules  

---

## Domain: `DOMAIN_PAYROLL` (`orangehrmPayrollPlugin`)

### `US_PAY_001`: Configure India FY 2026-27 Income Tax Slabs, Statutory Ceilings & Leave LWP Policy
- **Persona:** `PERSONA_PAYROLL_MAKER` (`Admin`)
- **Feature:** `FEAT_PAY_CONFIG` | **Requirement:** `FR_PAY_001` | **Rules:** `BR_PAY_001`, `BR_PAY_005`, `BR_PAY_012`
- **Statement:** *"As a Payroll Admin, I want to maintain India FY 2026-27 New (`u/s 115BAC`) and Old tax slabs, EPF/ESIC ceilings, State PT slabs, OT multiplier, and explicit Leave Type LWP mappings inside OXD Payroll Configuration so calculation behavior stays jurisdiction-coherent and policy-driven."*
- **Acceptance Criteria:**
  - **Given** India config (`jurisdictionCode = IN`, `defaultCurrencyId = INR`, `lwpDivisorMode`, `requireMakerCheckerApproval = true`)
  - **When** Admin views `/payroll/viewPayrollConfiguration` across all 4 tabs and updates LWP or slab rates via `/api/v2/payroll/*`
  - **Then** updates persist cleanly with INR formatting and ESS users are denied with `HTTP 403`.
- **Target UI:** `PayrollConfiguration.vue`
- **Target Endpoints:** `GET/PUT /api/v2/payroll/config`, `GET/PUT /api/v2/payroll/tax-brackets`, `GET /api/v2/payroll/statutory-rules`, `GET/PUT /api/v2/payroll/leave-policies`

---

### `US_PAY_002`: Create India Monthly INR Pay Period with Overlap Prevention
- **Persona:** `PERSONA_PAYROLL_MAKER` (`Admin`)
- **Feature:** `FEAT_PAY_PERIOD` | **Requirement:** `FR_PAY_002` | **Rules:** `BR_PAY_001`, `BR_PAY_002`
- **Statement:** *"As a Payroll Admin, I want to create India monthly INR pay periods (`2026-27`) while automatically blocking overlapping date ranges so no employee can be double-paid for the same calendar window."*
- **Acceptance Criteria:**
  - **Given** existing November 2026 pay period (`2026-11-01` to `2026-11-30`)
  - **When** Admin creates an overlapping period (`2026-11-15` to `2026-12-10`)
  - **Then** API rejects with `HTTP 400` overlap error.
- **Target UI:** `PayPeriods.vue`, `PayPeriodModal.vue`
- **Target Endpoints:** `GET/POST /api/v2/payroll/pay-periods`, `GET/PUT /api/v2/payroll/pay-periods/{id}`

---

### `US_PAY_003`: Manage Employee India Statutory Profile & Masked Banking Inside PIM
- **Persona:** `PERSONA_PAYROLL_MAKER` (`Admin`) / `PERSONA_ESS` (Blocked on colleagues)
- **Feature:** `FEAT_PAY_SNAPSHOT` | **Requirement:** `FR_PAY_003` | **Rules:** `BR_PAY_004`, `BR_PAY_016`
- **Statement:** *"As a Payroll Admin, I want to manage PAN, EPF UAN, ESIC IP, Professional Tax State (`KA`/`MH`/`WB`), Tax Regime (`NEW_115BAC`/`OLD`), 80C/80D/HRA declarations, CTC split, and masked bank accounts directly inside PIM's employee left menu without exposing raw account numbers to processing tables."*
- **Acceptance Criteria:**
  - **Given** employee `empNumber = 2` (`Aarav Sharma`) in PIM
  - **When** Admin opens `/payroll/viewEmployeeStatutoryProfile/empNumber/2`
  - **Then** form renders inside `edit-employee-layout`, masks raw bank account digits (`XXXXXX`), and blocks non-owner `ESS` peer access with `HTTP 403`.
- **Target UI:** `EmployeeStatutoryProfile.vue`
- **Target Endpoints:** `GET/PUT /api/v2/payroll/employees/{empNumber}/statutory-profile`

---

### `US_PAY_004`: Freeze Immutable Per-Run PIM Snapshots & Triage Ineligible Staff
- **Persona:** `PERSONA_PAYROLL_MAKER` (`Admin`)
- **Feature:** `FEAT_PAY_SNAPSHOT` | **Requirement:** `FR_PAY_004` | **Rules:** `BR_PAY_001`, `BR_PAY_003`, `BR_PAY_004`
- **Statement:** *"As a Payroll Admin, I want batch calculation to snapshot each employee's eligibility, INR salary, and statutory profile with idempotent run keys and explicit exclusion reasons (`TERMINATED_BEFORE_PERIOD`, `NO_SALARY_IN_PERIOD_CURRENCY_INR`, `MISSING_SALARY_IN_PIM`) so historical runs never drift if PIM data changes later."*
- **Target UI:** `PayrollProcessing.vue` (`Skipped & Warnings` tab)
- **Target Endpoints:** `POST /api/v2/payroll/runs`, `POST /api/v2/payroll/runs/{runId}/calculate`

---

### `US_PAY_005`: Compute Approved Unpaid Leave (LWP) Using Configured Divisor Modes
- **Persona:** `PERSONA_PAYROLL_MAKER` (`Admin`)
- **Feature:** `FEAT_PAY_CROSS` | **Requirement:** `FR_PAY_005` | **Rules:** `BR_PAY_005`
- **Statement:** *"As a Payroll Engine, I need to consume Scheduled/Taken Leaves mapped via explicit `ohrm_payroll_leave_policy` and pro-rate earnings via `CALENDAR_DAYS`, `WORKING_DAYS`, or `FIXED_30` divisors."*
- **Target Service:** `LeavePayrollAdapter`, `PayrollCalculationService`

---

### `US_PAY_006`: Compute Attendance / Timesheet Hours & Overtime Without Double-Counting
- **Persona:** `PERSONA_PAYROLL_MAKER` (`Admin`)
- **Feature:** `FEAT_PAY_CROSS` | **Requirement:** `FR_PAY_006` | **Rules:** `BR_PAY_006`, `BR_PAY_007`
- **Statement:** *"As a Payroll Engine, I need to extract worked hours and overtime from a single configured source (`ATTENDANCE_ONLY` or `TIMESHEET_PRIMARY_ATTENDANCE_VALIDATION`) honoring the `overtime_eligible_max_basic` ceiling (`₹50,000`) so eligible staff receive exact 2.0x overtime without double-counting Attendance + Timesheet."*
- **Target Service:** `TimeAttendancePayrollAdapter`, `OvertimePolicyService`

---

### `US_PAY_007`: Calculate India Statutory EPF/EPS, ESIC, State PT & FY 2026-27 TDS u/s 115BAC / Old Regime
- **Persona:** `PERSONA_PAYROLL_MAKER` (`Admin`)
- **Feature:** `FEAT_PAY_ENGINE` | **Requirement:** `FR_PAY_007` | **Rules:** `BR_PAY_009`, `BR_PAY_010`, `BR_PAY_011`, `BR_PAY_012`
- **Statement:** *"As a Payroll Engine, I need fixed-point INR precision (`Money`) to compute EPF/EPS (`12%` with ₹15k cap), ESIC (`0.75%/3.25%` for statutory gross `<= ₹21,000`), State PT (including Maharashtra Feb ₹300 slab), Sec 87A rebate cliff (`<= ₹12,00,000`), YTD mid-year reconciliation, Sec 288B ₹10 rounding, and 4% Health & Education Cess."*
- **Target Service:** `IndianStatutoryCalculator`, `Money`
- **Target UI:** `PayrollProcessing.vue`

---

### `US_PAY_008`: Reserve Approved INR Expense Claims During Calculation Without Double Payout
- **Persona:** `PERSONA_PAYROLL_MAKER` (`Admin`)
- **Feature:** `FEAT_PAY_CROSS` | **Requirement:** `FR_PAY_008` | **Rules:** `BR_PAY_008`, `BR_PAY_010`
- **Statement:** *"As a Payroll Engine, I need to reserve `APPROVED` INR claims from `ohrm_claim_request` into `ohrm_payroll_claim_link` with an exclusive `active_claim_lock` so approved claims reimburse cleanly tax-free/non-ESIC on payslips without double payout."*
- **Target Service:** `ClaimSettlementAdapter`

---

### `US_PAY_009`: Apply Audited Manual Overrides Strictly Before Run Submission
- **Persona:** `PERSONA_PAYROLL_MAKER` (`Admin`)
- **Feature:** `FEAT_PAY_ADJUSTMENT` | **Requirement:** `FR_PAY_009` | **Rules:** `BR_PAY_014`
- **Statement:** *"As a Payroll Admin, I want to apply an audited INR adjustment with mandatory reason while a run is `CALCULATED` or `REJECTED`, while strictly blocking overrides once submitted or locked (`HTTP 409`/`422`)."*
- **Target UI:** `RecordAdjustmentModal.vue`, `PayrollAuditTrail.vue`
- **Target Endpoints:** `GET/PUT /api/v2/payroll/records/{id}/adjustment`, `GET /api/v2/payroll/audit-events`

---

### `US_PAY_010`: Enforce Maker-Checker Separation of Duties (`Submit -> Reject -> Resubmit -> Approve -> Lock`)
- **Persona:** `PERSONA_PAYROLL_APPROVER` (`PayrollApprover`, Role `8`) & `PERSONA_PAYROLL_MAKER` (`Admin`)
- **Feature:** `FEAT_PAY_WF` | **Requirement:** `FR_PAY_010` | **Rules:** `BR_PAY_013`, `BR_PAY_014`
- **Statement:** *"As a Finance Approver (`PayrollApprover`), I want independent Maker-Checker enforcement blocking creator self-approval (`HTTP 403`), allowing reasoned rejection/resubmission, and atomically publishing employee payslips & locking the pay period when locked."*
- **Target UI:** `PayrollProcessing.vue`
- **Target Endpoints:** `POST /api/v2/payroll/runs/{runId}/{submit,approve,reject,lock,reverse}`

---

### `US_PAY_011`: Export NEFT Bank CSV (With Missing-Bank Guard) & Settle Claims to `PAID` on UTR Reconcile
- **Persona:** `PERSONA_PAYROLL_APPROVER` (`PayrollApprover`, Role `8`)
- **Feature:** `FEAT_PAY_PAYMENT` | **Requirement:** `FR_PAY_011` | **Rules:** `BR_PAY_008`, `BR_PAY_015`
- **Statement:** *"As a Finance Approver, I want NEFT CSV export to block (`HTTP 422`) when any positive-net payee lacks Bank Account/IFSC, and upon successful export & Bank UTR reconciliation, transition the run to `PAID_RECONCILED` and linked `ohrm_claim_request` records from `APPROVED` to `PAID`."*
- **Target UI:** `PayrollPayments.vue`
- **Target Endpoints:** `GET/POST /api/v2/payroll/payment-batches`, `POST /api/v2/payroll/payment-batches/{batchId}/{export,reconcile}`

---

### `US_PAY_012`: ESS & PIM Self-Service INR Payslip Preview & Strict BOLA/IDOR Download Isolation
- **Persona:** `PERSONA_ESS` (`Role 2`) & `PERSONA_PAYROLL_MAKER` (`Admin`)
- **Feature:** `FEAT_PAY_SLIPS` | **Requirement:** `FR_PAY_012` | **Rules:** `BR_PAY_016`
- **Statement:** *"As an Employee (ESS), I want to preview and download my own `PUBLISHED` INR (`₹`) HTML payslips in My Info / Payroll, while receiving `HTTP 403` on unpublished drafts or any colleague's payslip URL."*
- **Target UI:** `MySalarySlips.vue`, `EmployeePayslips.vue`, `PayslipPreviewModal.vue`
- **Target Endpoints:** `GET /api/v2/payroll/my-salary-slips`, `GET /api/v2/payroll/slips/{id}`, `GET /api/v2/payroll/employees/{empNumber}/payslips`, `GET /payroll/slips/{id}/download`

