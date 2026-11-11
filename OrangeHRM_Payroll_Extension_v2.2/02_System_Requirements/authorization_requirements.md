# OrangeHRM v2.2 India Payroll Extension — Authorization & RBAC Requirements

## 1.0 Authorization Architecture
`orangehrmPayrollPlugin` integrates cleanly with OrangeHRM's `UserRoleManager`, `ApiAuthorizationSubscriber`, and `ScreenPermission` / `DataGroupPermission` metadata (`v2_2_india_payroll_rbac_and_i18n.sql`), augmented by domain-level Separation of Duties (SoD) and strict BOLA/IDOR ownership enforcement inside `PayrollEndpointTrait` and `PayrollWorkflowService`.

## 2.0 Provisioned Roles, Screens & Data Groups
- **New Assignable Role (`id = 8`):** `PayrollApprover` (`ohrm_user_role`, assignable = `1`), dedicated for independent Checker verification, run approval/rejection, run locking, and NEFT bank disbursement reconciliation.
- **22 Registered `ohrm_api_permission` Entries (`module_id = 19`):** Finely grained read/create/update/delete capabilities mapping across `Admin` (Role `1`), `ESS` (Role `2`), and `PayrollApprover` (Role `8`).

## 3.0 Separation of Duties (SoD) & BOLA/IDOR Controls

| Security Control ID | Requirement Specification | Verified Behavior |
| :--- | :--- | :--- |
| **`REQ_PAY_SOD_001`** | Maker (`created_by` or `submitted_by`) cannot approve or lock their own payroll run when `require_maker_checker_approval = 1`. | `PayrollWorkflowService::approveRun()` / `lockRun()` rejects with `HTTP 403`. |
| **`REQ_PAY_IDOR_001`** | `ESS` users calling `/api/v2/payroll/employees/{empNumber}/payslips` or `/statutory-profile` for any colleague `empNumber !== self` are denied (even supervisors are denied peer payroll view unless granted management rights). | `PayrollEndpointTrait::assertEmployeePayrollAccess()` aborts with `HTTP 403`. |
| **`REQ_PAY_IDOR_002`** | `ESS` users calling `/api/v2/payroll/slips/{id}` or `/payroll/slips/{id}/download` for another employee's slip or an unpublished (`DRAFT_PREVIEW` / `VOIDED`) slip are denied. | `SalarySlipDocumentAPI` & `SalarySlipDownloadController` return `HTTP 403`. |
| **`REQ_PAY_PII_001`** | Bank account numbers & IFSC codes remain masked (`XXXXXX1234`) in calculation tables, snapshots UI, and payslips; unmasked CSV export is restricted to authorized finance disbursement (`PayrollApprover`). | Verified `0` raw bank account leaks across calculation API/HTML slips. |
| **`REQ_PAY_IMM_001`** | Manual adjustments (`PUT /api/v2/payroll/records/{id}/adjustment`) and recalculations are blocked once run moves to `PENDING_APPROVAL`, `APPROVED`, `LOCKED`, or `PAID_RECONCILED`. | Rejected with `HTTP 409` / `HTTP 422`. |

