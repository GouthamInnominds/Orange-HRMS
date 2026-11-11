# OrangeHRM v2.2 India Payroll Extension — Business Requirements Document (BRD)
## 1.0 Business Overview & Scope

### 1.1 Executive Summary
OrangeHRM v2.2 introduces an enterprise-grade, India-jurisdiction Payroll Processing & Statutory Disbursement Extension (`orangehrmPayrollPlugin`) natively embedded inside OrangeHRM 5.8 using Symfony 5, Doctrine ORM, and the `@ohrm/oxd` Vue 3 design system. Extending the verified v1.0 baseline where direct payroll computation and banking disbursement were explicitly out of scope, v2.2 integrates across **Admin**, **PIM**, **Leave**, **Time & Attendance**, **Claim**, and **My Info (ESS)**.

### 1.2 Enterprise Strategic Objectives (India Jurisdiction FY 2026-27)
- **Single-Jurisdiction Coherence (India / INR):** Enforce INR (`₹`) payroll processing anchored to India Financial Year (`April 1 – March 31`), eliminating mixed-country US/UK rules.
- **Cross-Module Consumption Without Domain Mutation:** Consume master salary, leave, attendance, timesheet, and claim data via dedicated integration adapters and immutable per-run snapshots (`ohrm_payroll_emp_snapshot`), updating `ohrm_claim_request` status (`APPROVED -> PAID`) only upon bank UTR reconciliation.
- **Indian Statutory & Tax Compliance:** Support FY 2026-27 Income Tax TDS under both New Regime (`u/s 115BAC` with `₹75,000` Standard Deduction and `₹12,00,000` Sec 87A rebate cliff) and Old Regime (`₹50,000` Standard Deduction + Chapter VI-A `80C`/`80D`/`HRA` exemptions), plus 4% Health & Education Cess, EPF/EPS (`12%` with optional `₹15,000` ceiling), ESIC (`0.75%`/`3.25%` up to `₹21,000` gross excluding expense claims), and State Professional Tax (`KA`, `MH`, `WB`, `TN`).
- **Financial Controls & Separation of Duties (SoD):** Enforce strict Maker-Checker governance across `DRAFT -> CALCULATED -> PENDING_APPROVAL -> APPROVED -> LOCKED -> PAID_RECONCILED`, blocking self-approval by the run creator/submitter via HTTP `403`.
- **PII Protection & BOLA/IDOR Hardening:** Mask raw bank account numbers in calculation records/payslips while authorizing full account/IFSC details exclusively inside NEFT/IMPS bank CSV export for the `PayrollApprover` / finance disbursement workflow.

### 1.3 Extension Boundaries vs. Baseline v1.0
- Baseline `OrangeHRM_Baseline_v1.0/` documentation and core tables remain intact; existing `hs_hr_emp_us_tax` and US direct-deposit routing columns are left untouched and unused by India Payroll.
- All Payroll policies, statutory slabs, tax regimes, pay periods, runs, snapshots, approval history, slips, bank batches, and immutable audit events reside within the `orangehrmPayrollPlugin` domain boundary.

