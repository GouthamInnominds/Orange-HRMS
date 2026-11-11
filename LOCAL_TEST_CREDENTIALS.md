# Local Environment Test Credentials & Roles Reference

> **Notice:** These credentials are strictly for **local development, automated QA, and demo sandbox verification** in this repository (`127.0.0.1` only). Never reuse these credentials in shared or production environments.

---

## 1. OrangeHRM Application (`http://127.0.0.1:5121`)

All active accounts in `orangehrm_mysql.ohrm_user` (verified against `ohrm_user_role` and `hs_hr_employee`):

| Role (`ohrm_user_role.name`) | Role ID | Role Type | Username | Password | Linked Employee | Access & UI Scope |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **`Admin`** | `1` | Predefined / Assignable | `Admin` | `Admin@123456` | OrangeHRM Admin (`0001`, skipped in INR payroll batch) | Full HRMS sidebar (12 modules) + all 6 Payroll tabs. Acts as **Payroll Maker**: manages India Payroll Configuration, Pay Periods, Draft Run creation, Batch Calculation, Manual Adjustments, Submit for Approval, and Employee Statutory Profiles. Blocked (`403`) from self-approving runs (`SoD`). |
| **`PayrollApprover`** | `8` | Custom (`Payroll Approver`) / Assignable | `fin.approver` | `Approver@123` | Meera Nair (`EMP-IN-002`, Finance Director, KA Old Tax Regime) | Restricted sidebar (`Payroll` only) + 5 Payroll tabs (`Configuration` hidden). Acts as **Finance Checker & Disburser**: approves/rejects submitted runs, locks finalized runs (`PUBLISHED` slips), creates/exports NEFT CSV batches, and reconciles UTR payment settlements (`PAID_RECONCILED`). Read-only on Pay Periods & Run Calculation. |
| **`ESS`** | `2` | Predefined / Assignable | `aarav.ess` | `EmpInd@2026!` | Aarav Sharma (`EMP-IN-001`, KA New Regime, LWP + Claim ₹3,450) | Employee Self-Service sidebar (`9` modules; `Admin`, `PIM`, `Recruitment`, `Maintenance` hidden) + single Payroll tab (**`My Salary Slips`** only). Views/downloads own `PUBLISHED` INR slips; blocked (`403`) from Payroll admin APIs and peer employee slips/profiles (IDOR protected). |
| **`ESS`** | `2` | Predefined / Assignable | `rajesh.ess` | `EmpInd@2026!` | Rajesh Kumar (`EMP-IN-003`, MH New Regime, ESIC + 8h OT) | Employee Self-Service (`My Salary Slips` only, read-only). |
| **`ESS`** | `2` | Predefined / Assignable | `ananya.ess` | `EmpInd@2026!` | Ananya Das (`EMP-IN-004`, WB New Regime, Paid + Half-Day LWP) | Employee Self-Service (`My Salary Slips` only, read-only). |

### Contextual System Roles (`is_assignable = 0`, No Standalone Login Accounts)
OrangeHRM also defines 5 built-in contextual roles in `ohrm_user_role` (`is_predefined = 1`, `is_assignable = 0`). These are attached dynamically to ESS users via module relationships (`0` active assignments in the current seed):

| Role Name | Role ID | Assigned Dynamically When |
| :--- | :---: | :--- |
| `Supervisor` | `3` | User is linked as a manager in `hs_hr_emp_reportto` |
| `ProjectAdmin` | `4` | User is assigned as a project admin in `ohrm_project_admin` |
| `Interviewer` | `5` | User is assigned to a job interview in `ohrm_job_interview_interviewer` |
| `HiringManager` | `6` | User is assigned as hiring manager on a recruitment vacancy |
| `Reviewer` | `7` | User is assigned as a reviewer in performance reviews |

---

## 2. Seeded Payroll Test Employees Without User Logins (Negative / Edge Cases)

| Employee ID | Name | Purpose in Seeded India Payroll Batch |
| :--- | :--- | :--- |
| `EMP-IN-005` | Vikram Patel | **Terminated employee skip test** (`termination_id = 1` -> skipped with `TERMINATED_BEFORE_PERIOD`) |
| `EMP-IN-006` | Sneha Iyer | **Currency mismatch skip test** (`USD 4,500.00/mo` -> skipped with `NO_SALARY_IN_PERIOD_CURRENCY_INR`) |

---

## 3. Supporting Local Services & Ports

| Service | URL / Address | Username | Password | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **OrangeHRM 5.8 + India Payroll v2.2** | `http://127.0.0.1:5121` | See Section 1 | See Section 1 | Launched via `orange_hrm/run-orangehrm.sh remove` inside WSL2 |
| **MariaDB (Application & Test DBs)** | `127.0.0.1:3306` | `root` | `root` | Schemas: `orangehrm_mysql`, `test_orangehrm_mysql` |
| **MariaDB Web UI (Adminer)** | `http://127.0.0.1:8080` | `root` | `root` | Server: `127.0.0.1`, Database: `orangehrm_mysql` |
| **Neo4j Knowledge Graph** | `http://127.0.0.1:7474` / `bolt://127.0.0.1:7687` | `neo4j` | `admin123` | Docker container `orangehrm-neo4j` |
| **QE Intelligence Platform** | `http://127.0.0.1:4500` | N/A | N/A | Express server `tools/qe_app/server.js` |

