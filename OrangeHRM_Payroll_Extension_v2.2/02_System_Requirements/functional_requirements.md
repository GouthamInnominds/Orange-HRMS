# OrangeHRM v2.2 India Payroll Extension — Functional Requirements Specification (SRS)

## 1.0 Payroll Configuration & Policy Requirements
- **`FR_PAY_001` (India Config, Tax Brackets & Leave Policy):** System shall store and serve jurisdiction config (`IN`/`INR`, LWP divisor mode, Time/Attendance source mode, OT multiplier & basic ceiling, EPF/ESIC thresholds, Maker-Checker toggle), FY `2026-27` `NEW_115BAC`/`OLD` slabs, statutory rules, and explicit `ohrm_leave_type -> ohrm_payroll_leave_policy` rules.

## 2.0 Pay Period & Employee Profile Requirements
- **`FR_PAY_002` (Pay Period Management & Overlap Check):** System shall support India monthly INR pay period creation and reject overlapping `[startDate, endDate]` intervals in `IN` jurisdiction.
- **`FR_PAY_003` (PIM Statutory Profile & Masked Bank Exposure):** Authorized Payroll admins shall read and update PAN, UAN, ESIC IP, PT state, Tax Regime, 80C/80D/HRA declarations, CTC split, and banking info via PIM (`EmployeeStatutoryProfile.vue`), exposing only masked `XXXXXX` bank account strings on read responses and calculation records.

## 3.0 Snapshotting & Batch Calculation Requirements
- **`FR_PAY_004` (Idempotent Runs & Frozen Snapshots):** Creating a run with duplicate `idempotencyKey` returns the existing run; batch calculation freezes all active/terminated/foreign-currency employee states into `ohrm_payroll_emp_snapshot` with `is_eligible` and `ineligibility_reason`.
- **`FR_PAY_005` (Leave LWP Intake & Divisors):** `LeavePayrollAdapter` resolves Scheduled (`2`) and Taken (`3`) leaves into LWP days via `ohrm_payroll_leave_policy` and computes per-day deduction via `CALENDAR_DAYS`, `WORKING_DAYS`, or `FIXED_30`.
- **`FR_PAY_006` (Time/Attendance Intake & Overtime Ceiling):** `TimeAttendancePayrollAdapter` computes regular/overtime hours without double counting Attendance and Timesheet, blocking OT payouts when basic exceeds `overtime_eligible_max_basic`.
- **`FR_PAY_007` (Indian Statutory & TDS Calculation):** `IndianStatutoryCalculator` and `Money` compute EPF (`12%`, optional ₹15k cap, 8.33% EPS/3.67% diff split), ESIC (`0.75%/3.25%` up to ₹21k excluding claims), state PT (`KA`/`MH` Feb ₹300/`WB`), and annualized YTD-reconciled TDS (`115BAC` ₹75k std ded + Sec 87A ₹12L cliff; `OLD` ₹50k std ded + Chapter VI-A) with Sec 288B ₹10 rounding + 4% Cess.
- **`FR_PAY_008` (Claim Reservation & Anti-Double-Payout):** `ClaimSettlementAdapter` reserves `APPROVED` INR claims in `ohrm_payroll_claim_link` under `uq_active_claim_lock` and includes them solely on net pay (excluded from EPF/ESIC/TDS).

## 4.0 Governance, Bank Disbursement & Self-Service Requirements
- **`FR_PAY_009` (Audited Adjustments Before Submit):** Authorized Maker can apply INR adjustments with mandatory reason during `CALCULATED` or `REJECTED`; attempts after submission/locking return `409`/`422`.
- **`FR_PAY_010` (Maker-Checker SoD & Publication):** Distinct `PayrollApprover` approves/rejects/locks runs (`created_by`/`submitted_by` self-approval blocked `403`); locking transitions pay period to `LOCKED` and publishes `SalarySlip` (`PUBLISHED`); reversing voids slips (`VOIDED`) and releases claim locks.
- **`FR_PAY_011` (NEFT CSV Export Guard & UTR Settlement):** Payment batch export aborts (`422`) when positive-net employees lack bank/IFSC; successful export emits NEFT CSV with IFSC/account columns; UTR reconciliation sets run `PAID_RECONCILED` and transitions linked `ohrm_claim_request` rows `APPROVED -> PAID`.
- **`FR_PAY_012` (ESS Self-Service & Download):** ESS employees list/preview/download their own `PUBLISHED` HTML INR slips (`/payroll/viewMySalarySlips`, `/payroll/slips/{id}/download`); cross-employee slip/profile queries fail with `403`.

