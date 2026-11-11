# OrangeHRM v2.2 India Payroll Extension — Integration Requirements

## 1.0 Cross-Module Integration Contracts

| Source Module | Plugin & Tables Consumed | Integration Service / Adapter | Consumption Semantics & Guards |
| :--- | :--- | :--- | :--- |
| **Admin** | `orangehrmAdminPlugin` (`hs_hr_currency_type`, `ohrm_pay_grade`, `ohrm_work_shift`, `ohrm_user`, `ohrm_user_role`) | `PayrollConfigService`, RBAC migration `v2_2_india_payroll_rbac_and_i18n.sql` | Reuses core `INR` currency and roles (`Admin` Role 1, `PayrollApprover` Role 8, `ESS` Role 2); stores Payroll policy inside `orangehrmPayrollPlugin` rather than bloating Admin entity schemas. |
| **PIM** | `orangehrmPimPlugin` (`hs_hr_employee`, `hs_hr_emp_basicsalary`, `hs_hr_emp_termination`, `ohrm_emp_us_tax` unused) | `PayrollEmployeeSnapshotService`, `PIMLeftMenuService` | Snapshots active INR salaries and eligibility before calculation (`TERMINATED_BEFORE_PERIOD`, `MISSING_SALARY_IN_PIM`, `NO_SALARY_IN_PERIOD_CURRENCY_INR`). Injects **Payslips** and **Statutory Profile** into PIM left menu. |
| **Leave** | `orangehrmLeavePlugin` (`ohrm_leave`, `ohrm_leave_request`, `ohrm_leave_type`) | `LeavePayrollAdapter` | Filters Scheduled (`2`) and Taken (`3`) leave days in period dates; resolves treatment via `ohrm_payroll_leave_policy` and computes LWP using configured `lwp_divisor_mode`. |
| **Time & Attendance** | `orangehrmAttendancePlugin`, `orangehrmTimePlugin` (`ohrm_attendance_record`, `ohrm_timesheet_item`) | `TimeAttendancePayrollAdapter`, `OvertimePolicyService` | Single primary hour source (`ATTENDANCE_ONLY` or `TIMESHEET_PRIMARY_ATTENDANCE_VALIDATION`) preventing double-counting; validates overtime against `overtime_eligible_max_basic`. |
| **Claim** | `orangehrmClaimPlugin` (`ohrm_claim_request`) | `ClaimSettlementAdapter` | Reserves `APPROVED` INR claims via `ohrm_payroll_claim_link.active_claim_lock`; adds untaxed/non-ESIC reimbursement on payslip; transitions claim `APPROVED -> PAID` upon Bank UTR reconciliation. |
| **My Info / ESS** | `orangehrmPimPlugin` / `orangehrmPayrollPlugin` | `MySalarySlipsController`, `SalarySlipDownloadController`, `SalarySlipAPI` | Exposes `PUBLISHED` INR slips strictly to owning employee (`empNumber` match enforced). |

## 2.0 REST V2 API & HTML Document Contracts
- **REST V2 Envelope:** All JSON API endpoints registered in `orangehrmPayrollPlugin/config/routes.yaml` conform to OrangeHRM's `GenericRestController` envelope (`{ "data": ..., "meta": { ... }, "rels": [] }`).
- **Authorized Errors:** Validation errors return HTTP `400`/`422`; Unauthorized/RBAC/SoD/IDOR violations return `403`; State machine conflicts return `409`/`422`.
- **HTML Payslip Output:** `/payroll/slips/{id}/download` renders standalone print-ready HTML formatted in INR (`₹`) with masked bank account details, YTD tax reconciliation summary, and itemized earnings/statutory deductions.

