# OrangeHRM v1.0 Authorization & Role-Based Access Control (RBAC) Requirements

## 1.0 Authorization Architecture
OrangeHRM implements a hierarchical, data-group-driven Role-Based Access Control (RBAC) engine managed via `UserRoleManager` and `DataGroupPermission`. Permissions are evaluated dynamically on every request based on:
1. User System Role (`Admin` vs `ESS`).
2. Data Group (`pim_personal_details`, `pim_salary`, `leave_entitlements`, etc.).
3. Entity Scope (`Self`, `Subordinate`, `Global`).

---

## 2.0 Detailed Screen & API Permission Matrix

| Feature / Data Group | Global Admin | HR Manager | Supervisor | Employee (ESS) |
| :--- | :---: | :---: | :---: | :---: |
| **PIM: Basic Personal Details** | Read / Write / Delete | Read / Write | Read (Subordinates) | Read / Write (Self) |
| **PIM: Contact Details** | Read / Write / Delete | Read / Write | Read (Subordinates) | Read / Write (Self) |
| **PIM: Emergency Contacts** | Read / Write / Delete | Read / Write | Read (Subordinates) | Read / Write (Self) |
| **PIM: Dependents** | Read / Write / Delete | Read / Write | Read (Subordinates) | Read / Write (Self) |
| **PIM: Immigration Documents**| Read / Write / Delete | Read / Write | Read (Subordinates) | Read Only (Self) |
| **PIM: Job & Reporting Details**| Read / Write / Delete | Read / Write | Read (Subordinates) | Read Only (Self) |
| **PIM: Salary & Compensation** | Read / Write / Delete | Read / Write | **Hidden / No Access**| Read Only (Self) |
| **Leave: Entitlement Allocations** | Read / Write / Delete | Read / Write | No Access | Read Only (Self) |
| **Leave: Applications** | Read / Write / Delete | Read / Write | Approve / Reject (Subordinates) | Apply / Cancel (Self) |
| **Attendance: Punch Clock** | Read / Write (All) | Read / Write | Edit (Subordinates) | Punch In/Out (Self) |
| **Timesheets: Activity Hours** | Read / Write (All) | Read / Write | Approve / Reject (Subordinates) | Submit Hours (Self) |
| **Recruitment: Vacancies** | Full Control | Full Control | Read (Assigned Vacancy)| No Access |
| **Recruitment: Candidates** | Full Control | Full Control | Rate Interview (Assigned)| No Access |
| **Performance: Trackers & Reviews** | Full Control | Full Control | Review / Rate (Subordinates) | Self Evaluation |
| **Claims: Expenses & Receipts** | Full Control | Full Control | Approve (Subordinates) | Submit Claims (Self) |
| **Admin: Job Architecture** | Full Control | Read Only | Read Only | Read Only |
| **Admin: User Management** | Full Control | No Access | No Access | No Access |
| **Maintenance: Data Purge** | Full Control | No Access | No Access | No Access |

---

## 3.0 Authorization Enforcement Rules (SRS)
- **`REQ_AUTH_001`:** All REST API endpoints must intercept the incoming request token, extract the caller's role, and evaluate `UserRoleManager::isScreenAllowed()` and `UserRoleManager::isDataGroupAllowed()`.
- **`REQ_AUTH_002`:** If an authorized ESS user requests an endpoint with an `empNumber` differing from their own token's bound employee number, and the caller is not a registered supervisor of that employee, the request is immediately aborted with `HTTP 403 Forbidden`.
- **`REQ_AUTH_003`:** Field-level masking must dynamically redact salary components in JSON responses when returned to supervisors or non-administrative peers.

