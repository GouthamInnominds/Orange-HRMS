# OrangeHRM v2.2 India Payroll Extension — User Personas & RBAC Taxonomy

## 1.0 Extension Personas

### 1.1 Payroll Maker / HR Operations (`Admin` — Role `1`)
- **Responsibilities:** Configure India FY 2026-27 tax brackets, statutory rules, LWP leave policies, and employee statutory profiles; create monthly pay periods; execute batch calculations; triage skipped employees; apply pre-submission audited adjustments; submit runs for approval.
- **SoD Restriction:** Explicitly blocked (`HTTP 403`) from approving or locking payroll runs they created or submitted when Maker-Checker is enabled.

### 1.2 Finance Checker / Payroll Approver (`PayrollApprover` — Role `8`)
- **Provisioned by:** `v2_2_india_payroll_rbac_and_i18n.sql` (`ohrm_user_role` id `8`, name `PayrollApprover`, pre-defined `0`, assignable `1`).
- **Responsibilities:** Independently audit calculated batches and approval history; approve or reject runs (`reason` mandatory on rejection); lock approved runs to publish ESS payslips; generate NEFT/IMPS payment batches; export unmasked CSV bank files; reconcile settled UTR numbers; reverse locked runs if required.

### 1.3 Employee (`ESS` — Role `2`)
- **Responsibilities:** View and download own `PUBLISHED` INR payslips via **My Info** / **Payroll -> My Salary Slips** (`/payroll/viewMySalarySlips`).
- **Security Boundary:** Strictly blocked (`HTTP 403`) from unpublished `DRAFT_PREVIEW` slips, payroll processing/configuration APIs, payment batches, and any peer employee's slips or statutory profile (BOLA/IDOR protected).

---

## 2.0 Role-Based Permission Matrix (India Payroll v2.2)

| Capability / Screen / Data Group | Global Admin (`Maker`, Role 1) | PayrollApprover (`Checker`, Role 8) | Supervisor | ESS (`Role 2`) |
| :--- | :---: | :---: | :---: | :---: |
| **Pay Periods CRUD** | Full | Read Only | No Access | No Access |
| **India Config, Slabs & LWP Policy** | Full | Read Only | No Access | No Access |
| **Employee Statutory Profile (Masked Bank)** | Read / Write | Read Only | No Access | No Access |
| **Run Calculate & Adjustments** | Create / Update | Read Only | No Access | No Access |
| **Run Submit for Approval** | Allowed | Allowed (non-maker) | No Access | No Access |
| **Run Approve / Reject / Lock / Reverse** | Blocked on own runs (`403 SoD`) | **Allowed** | No Access | No Access |
| **NEFT Payment Batch & CSV Export (Unmasked)** | Blocked / Finance-restricted | **Full Control** | No Access | No Access |
| **UTR Bank Reconciliation** | Read Only | **Allowed** | No Access | No Access |
| **Audit Trail Feed** | Read Only | Read Only | No Access | No Access |
| **My Salary Slips (`PUBLISHED` Only)** | Self | Self | Self | **Self Only** |

