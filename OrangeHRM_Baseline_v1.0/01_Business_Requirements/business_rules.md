# OrangeHRM v1.0 Enterprise Business Rules Catalog

## 1.0 Business Rules Overview
These business rules define the domain constraints, eligibility criteria, and operational logic governing OrangeHRM. In accordance with ISO/IEC/IEEE 29148, these rules are specified independently of database schema or implementation mechanisms.

---

## 2.0 Domain Business Rules

### 2.1 Workforce Management (PIM) Rules
- **`BR_PIM_001` (Employee Number Uniqueness):** Every employee must have an employee identification number that is strictly unique across the enterprise, including active and historically terminated records.
- **`BR_PIM_002` (Supervisor Hierarchy Loop Prevention):** An employee cannot be assigned as a supervisor to their own direct or indirect supervisor (circular reporting chains are prohibited).
- **`BR_PIM_003` (Salary Component Assignment):** An employee can only be assigned salary components defined within the active Pay Grade allocated to their Job Title.
- **`BR_PIM_004` (Document Expiry Tracking):** Passports and work permits must enforce validation prohibiting an expiration date that precedes the date of issuance.
- **`BR_PIM_005` (Termination Lock):** Once an employee's employment status is updated to `Terminated`, their user login account must automatically be disabled, preventing system authentication.

### 2.2 Organization & System Administration (Admin) Rules
- **`BR_ADM_001` (Job Title Uniqueness):** Job title names must be unique across all active organizational titles (ignoring soft-deleted titles).
- **`BR_ADM_002` (Job Title Deletion Lock):** A Job Title cannot be hard-deleted if there are one or more active employees currently holding that job title.
- **`BR_ADM_003` (Subunit Hierarchy):** An organizational subunit (department) cannot be set as a child subunit of itself.
- **`BR_ADM_004` (Admin Account Protection):** The default primary Global Administrator user account cannot be deleted or set to inactive status.

### 2.3 Leave & Absence Rules
- **`BR_LEV_001` (Leave Balance Constraint):** An employee cannot apply for leave exceeding their available entitlement balance, unless negative balance is explicitly enabled for that specific Leave Type.
- **`BR_LEV_002` (Overlapping Leave Prohibited):** The system shall strictly prevent an employee from submitting multiple leave applications that overlap the same calendar dates or half-day periods.
- **`BR_LEV_003` (Holiday & Non-Working Day Exemption):** Standard leave deductions must automatically exclude defined company holidays and non-working days specified in the official company Work Week definition.
- **`BR_LEV_004` (Past Leave Application Restriction):** Employees cannot apply for leave retroactively beyond a configurable period (default: 30 days) without administrative override.

### 2.4 Time & Attendance Rules
- **`BR_TIM_001` (Daily Time Cap):** The total logged project hours across all activities for an employee on a single calendar date cannot exceed 24 hours.
- **`BR_TIM_002` (Sequential Punch In/Out):** An employee cannot register a new Punch-In if their previous Punch-In does not have a corresponding Punch-Out record.
- **`BR_TIM_003` (Punch-Out Time Validity):** The Punch-Out timestamp cannot precede the Punch-In timestamp.
- **`BR_TIM_004` (Approved Timesheet Immutability):** Once a weekly timesheet has been approved by a supervisor, it is permanently locked against further employee edits unless reopened by an Administrator.

### 2.5 Recruitment (ATS) Rules
- **`BR_REC_001` (Active Vacancy Prerequisite):** Candidates can only be associated with vacancies that possess an active (open) hiring status.
- **`BR_REC_002` (Interview Scheduling Constraint):** Interviews can only be scheduled for candidates in the `Shortlisted` status.
- **`BR_REC_003` (Hiring Conversion):** When a candidate achieves `Hired` status, the system must support automated transition to a new Employee master profile.

### 2.6 Expense Claims Rules
- **`BR_CLM_001` (Claim Currency Constraint):** All expense items logged under a single claim event must adhere to the authorized currency defined for that event.
- **`BR_CLM_002` (Receipt Requirement):** Expense items exceeding the configured minimum policy threshold must mandate at least one valid receipt attachment prior to submission.

