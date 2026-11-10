# OrangeHRM v1.0 System Requirements Specification (SRS)
## 1.0 Functional Requirements (ISO/IEC/IEEE 29148 Standard)

Every requirement below specifies a testable capability with unambiguous preconditions, inputs, postconditions, and Given-When-Then acceptance criteria.

---

## 2.0 Personal Information Management (PIM) Requirements

### `FR_PIM_001`: Create New Employee Profile
- **Description:** The system shall allow authorized HR Personnel to register a new employee record with basic personal identifiers.
- **Authorized Personas:** `Global Admin`, `HR Manager`
- **Preconditions:** Authenticated user session active; employee number is unique.
- **Input Constraints:**
  - `firstName`: string, 1–30 characters, mandatory.
  - `lastName`: string, 1–30 characters, mandatory.
  - `middleName`: string, 0–30 characters, optional.
  - `employeeId`: string, 1–50 characters, mandatory, unique.
- **Postconditions:** New employee record persisted; unique internal identifier assigned.
- **Acceptance Criteria:**
  - **AC-1:** Given valid first and last names and an unused ID, when submitted, then the system persists the employee and returns success.
  - **AC-2:** Given an employee ID that already exists in active or terminated records, when submitted, then the system rejects the transaction with a duplicate ID validation error.
  - **AC-3:** Given empty first or last names, when submitted, then validation messages identify the missing mandatory fields.

### `FR_PIM_002`: Employee Job Assignment
- **Description:** The system shall allow HR Personnel to assign an employee to an organizational job title, department (subunit), and employment status.
- **Authorized Personas:** `Global Admin`, `HR Manager`
- **Preconditions:** Target employee exists; active job title and subunit exist.
- **Acceptance Criteria:**
  - **AC-1:** Given valid job title and department IDs, when assigned to an employee, then the employee's active job profile updates immediately.
  - **AC-2:** Historical job assignments are logged with effective dates.

### `FR_PIM_003`: Reporting Hierarchy Definition
- **Description:** The system shall allow assigning direct or indirect supervisors to an employee to establish the organizational reporting chain.
- **Authorized Personas:** `Global Admin`, `HR Manager`
- **Acceptance Criteria:**
  - **AC-1:** Given Employee A and Supervisor B, when B is assigned as direct supervisor, then B gains supervisory authority over A's leaves and timesheets.
  - **AC-2:** Given an assignment that would create a circular reporting chain (e.g., A reports to B, B reports to C, C assigned to report to A), when submitted, then the system rejects the assignment with a hierarchy loop error.

### `FR_PIM_004`: Salary Component & Compensation Management
- **Description:** The system shall allow HR Personnel to configure basic salary components, pay frequency, and currency for an employee.
- **Authorized Personas:** `Global Admin`, `HR Manager`
- **Acceptance Criteria:**
  - **AC-1:** Salary amounts must be numeric with up to 2 decimal places.
  - **AC-2:** Direct deposit account numbers, routing numbers, and account types must be validated prior to persistence.
  - **AC-3:** Regular employees (ESS) cannot view salary records of any colleague.

---

## 3.0 System Administration (Admin) Requirements

### `FR_ADM_001`: Job Title Management
- **Description:** The system shall allow administrators to define, update, and manage job titles and associated specification documents.
- **Authorized Personas:** `Global Admin`
- **Input Constraints:**
  - `jobTitleName`: string, 1–100 characters, mandatory, unique.
  - `jobDescription`: string, $\le 400$ characters, optional.
  - `note`: string, $\le 400$ characters, optional.
  - `jobSpecification`: file attachment (PDF/DOC/DOCX), $\le 1\text{ MB}$, optional.
- **Acceptance Criteria:**
  - **AC-1:** Given a title exceeding 100 characters, when submitted, then the system returns a boundary validation error.
  - **AC-2:** Given an existing job title with 5 assigned employees, when deletion is attempted, then the system blocks deletion and displays an active dependency warning.
  - **AC-3:** Updating a job title allows replacing or removing the job specification attachment without modifying the title text.

### `FR_ADM_002`: User Account & Role Provisioning
- **Description:** The system shall allow administrators to create and manage system user credentials mapped to employee profiles.
- **Authorized Personas:** `Global Admin`
- **Input Constraints:**
  - `username`: string, 5–40 characters, unique across all users.
  - `password`: string, minimum 8 characters, requiring at least one numeral and one special character.
  - `status`: binary (`Enabled` | `Disabled`).
  - `userRole`: role reference (`Admin` | `ESS`).
- **Acceptance Criteria:**
  - **AC-1:** Passwords failing complexity rules are rejected with clear requirements guidance.
  - **AC-2:** Disabling a user account immediately terminates any active sessions and rejects subsequent login attempts.

---

## 4.0 Leave & Absence Management Requirements

### `FR_LEV_001`: Leave Entitlement Allocation
- **Description:** The system shall allow HR administrators to allocate leave entitlement days to an individual employee or bulk allocate by department/location for a defined leave period.
- **Acceptance Criteria:**
  - **AC-1:** Leave days must be positive decimal numbers in increments of 0.5 (half-day support).
  - **AC-2:** Bulk allocations calculate entitlements for all active employees matching subunit filters.

### `FR_LEV_002`: Leave Application & Auto-Deduction
- **Description:** The system shall allow employees to apply for single or multi-day leave against active leave types.
- **Acceptance Criteria:**
  - **AC-1:** Submitting leave for dates overlapping an existing approved or pending leave application is prohibited.
  - **AC-2:** Applying for leave with insufficient entitlement balance is rejected unless the leave type permits negative balance.
  - **AC-3:** Upon submission, an email notification is automatically queued for the employee's direct supervisor.

### `FR_LEV_003`: Supervisory Leave Approval Workflow
- **Description:** The system shall allow supervisors to review pending leave requests for their subordinates and issue approvals or rejections with mandatory comments.
- **Acceptance Criteria:**
  - **AC-1:** Approving a leave deducts the booked days from the employee's balance and marks days as scheduled on the company leave calendar.
  - **AC-2:** Rejecting a leave returns the booked entitlement days back to the employee's available balance.

---

## 5.0 Time & Attendance Requirements

### `FR_TIM_001`: Daily Punch In / Punch Out
- **Description:** The system shall provide a web-based punch clock for employees to log their daily working shifts.
- **Acceptance Criteria:**
  - **AC-1:** An employee with an active punch-in cannot register a second punch-in without punching out.
  - **AC-2:** Punch timestamps capture local date, time, and user-provided notes.
  - **AC-3:** Supervisors can inspect and edit punch records for subordinates with an audit notation indicating supervisor modification.

### `FR_TIM_002`: Project Activity Timesheet Logging
- **Description:** The system shall allow employees to log weekly hours spent on specific customer projects and assigned project activities.
- **Acceptance Criteria:**
  - **AC-1:** Daily total hours logged cannot exceed 24 hours.
  - **AC-2:** Timesheets submitted for approval are locked against further edits by the employee.
  - **AC-3:** Supervisors can reject a timesheet with revision notes, returning the timesheet to editable status for the employee.

---

## 6.0 Recruitment (ATS) Requirements

### `FR_REC_001`: Job Vacancy Management
- **Description:** The system shall allow recruiters to create and publish job vacancies associated with defined Job Titles and Hiring Managers.
- **Acceptance Criteria:**
  - **AC-1:** Vacancy specifies title, hiring manager, number of positions, and active/closed status.
  - **AC-2:** Closing a vacancy prohibits new candidate applications from linking to that vacancy.

### `FR_REC_002`: Candidate Resume Attachment & Status Progression
- **Description:** The system shall ingest candidate applications with resumes and track candidate progression through screening, interview, offer, and hire stages.
- **Acceptance Criteria:**
  - **AC-1:** Uploaded resumes must be validated for acceptable formats (`.pdf`, `.doc`, `.docx`) and size ($\le 2\text{ MB}$).
  - **AC-2:** Advancing a candidate to `Hired` prompts the recruiter to auto-generate a new employee draft record in PIM.

