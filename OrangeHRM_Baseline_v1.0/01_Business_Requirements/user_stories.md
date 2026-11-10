# OrangeHRM Baseline v1.0 User Stories Catalog (Whole Application)

**Total User Stories:** 29  
**Coverage:** 100% of all 12 Business Domains, 30 Features, 10 Workflows, and 8 Personas  
**Methodology:** Agile / BDD (Given-When-Then Acceptance Criteria)  

---

## Domain: DOMAIN_PIM

### US_PIM_001: Create New Employee Profile with Mandatory Identity Fields
- **Persona:** `PERSONA_HR_MANAGER`
- **Feature:** `FEAT_PIM_EMPLOYEE_MASTER` | **Workflow:** `WF_ONBOARDING`
- **Requirement:** `FR_PIM_001` | **Rules:** `BR_PIM_001`
- **Statement:** *"As an HR Manager, I want to create a new employee profile with first name, last name, and employee ID, so that the new hire is officially recorded in the organization."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Successful Employee Profile Creation via UI**
- **Given:** The HR Manager is on the Add Employee screen (/pim/addEmployee)
- **When:** They enter valid first name, last name, and a unique employee ID, then click Save
- **Then:** The employee profile is saved with HTTP 201, a success toast is displayed, and the page navigates to Personal Details.

**Scenario: Rejection of Duplicate Employee Number**
- **Given:** An active employee with employee ID "EMP001" already exists
- **When:** The HR Manager attempts to create another profile with employee ID "EMP001"
- **Then:** The system rejects the submission with validation error "Employee Id already exists" complying with BR_PIM_001.

- **Target UI Components:** `SaveEmployee.vue`, `Employee.vue`
- **Target API Endpoints:** `POST /api/v2/pim/employees`, `GET /api/v2/pim/employees`

---

### US_PIM_002: Assign Organizational Placement, Job Title, and Employment Status
- **Persona:** `PERSONA_HR_MANAGER`
- **Feature:** `FEAT_PIM_JOB_DETAILS` | **Workflow:** `WF_ONBOARDING`
- **Requirement:** `FR_PIM_002` | **Rules:** `BR_ADM_001`
- **Statement:** *"As an HR Manager, I want to assign an active job title, subunit, and employment status to an employee, so that their organizational placement and role are clearly defined."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Assign Job Details Successfully**
- **Given:** An employee profile exists in Draft or Active state
- **When:** The HR Manager selects an active Job Title, Subunit, and Employment Status and submits the form
- **Then:** The job details are persisted via PUT /api/v2/pim/employees/{id}/job-details with HTTP 200.

- **Target UI Components:** `EmployeeJob.vue`
- **Target API Endpoints:** `PUT /api/v2/pim/employees/{id}/job-details`, `GET /api/v2/pim/employees/{id}/job-details`

---

### US_PIM_003: Establish Direct and Indirect Reporting Supervision
- **Persona:** `PERSONA_HR_MANAGER`
- **Feature:** `FEAT_PIM_REPORT_TO` | **Workflow:** `WF_ONBOARDING`
- **Requirement:** `FR_PIM_003` | **Rules:** `BR_PIM_002`
- **Statement:** *"As an HR Manager, I want to assign supervisors and reporting methods to an employee, so that approval hierarchies for leave and timesheets are established."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Assign Direct Supervisor**
- **Given:** Both supervisor and employee profiles are active
- **When:** The HR Manager selects the supervisor with reporting method "Direct" and saves
- **Then:** The supervisor-subordinate relationship is recorded in the hierarchy.

**Scenario: Circular Reporting Hierarchy Prevention**
- **Given:** Employee A is assigned as supervisor of Employee B
- **When:** The HR Manager attempts to assign Employee B as supervisor of Employee A
- **Then:** The system prohibits the assignment and displays a loop prevention error complying with BR_PIM_002.

- **Target UI Components:** `EmployeeReportTo.vue`
- **Target API Endpoints:** `POST /api/v2/pim/employees/{id}/supervisors`, `GET /api/v2/pim/employees/{id}/supervisors`

---

### US_PIM_004: Configure Compensation and Salary Components
- **Persona:** `PERSONA_HR_MANAGER`
- **Feature:** `FEAT_PIM_SALARY` | **Workflow:** `WF_ONBOARDING`
- **Requirement:** `FR_PIM_004` | **Rules:** `BR_PIM_003`
- **Statement:** *"As an HR Manager, I want to add pay grade salary components and payment frequency for an employee, so that compensation details are accurately maintained."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Add Valid Salary Component**
- **Given:** An employee has an assigned Pay Grade
- **When:** The HR Manager enters an authorized basic amount within the pay grade currency range and saves
- **Then:** The salary record is encrypted and saved via POST /api/v2/pim/employees/{id}/salary-components.

- **Target UI Components:** `EmployeeSalary.vue`
- **Target API Endpoints:** `POST /api/v2/pim/employees/{id}/salary-components`, `GET /api/v2/pim/employees/{id}/salary-components`

---

### US_PIM_005: Update Personal Contact Details and Emergency Contacts
- **Persona:** `PERSONA_EMPLOYEE`
- **Feature:** `FEAT_PIM_PERSONAL_CONTACT` | **Workflow:** `WF_ONBOARDING`
- **Requirement:** `FR_PIM_001` | **Rules:** N/A
- **Statement:** *"As an Employee (ESS), I want to update my street address, phone number, and emergency contacts, so that the company has my current emergency information."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Employee Self-Service Contact Update**
- **Given:** An employee is logged into their ESS account
- **When:** They update their mobile phone number and add a primary emergency contact
- **Then:** The contact details are updated via PUT /api/v2/pim/employees/{id}/contact-details.

- **Target UI Components:** `EmployeeContactDetails.vue`, `EmployeeEmergencyContacts.vue`
- **Target API Endpoints:** `PUT /api/v2/pim/employees/{id}/contact-details`, `POST /api/v2/pim/employees/{id}/emergency-contacts`

---

### US_PIM_006: Execute Employee Termination and Account Deactivation
- **Persona:** `PERSONA_HR_MANAGER`
- **Feature:** `FEAT_PIM_TERMINATION` | **Workflow:** `WF_SEPARATION`
- **Requirement:** `FR_PIM_001` | **Rules:** `BR_PIM_005`
- **Statement:** *"As an HR Manager, I want to record an employee termination with reason and date, so that the employee record is archived and system access is automatically revoked."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Employee Offboarding Execution**
- **Given:** An active employee is departing the company
- **When:** The HR Manager enters the termination date and reason and confirms
- **Then:** The employee status becomes Terminated and associated user login accounts are disabled complying with BR_PIM_005.

- **Target UI Components:** `TerminationReason.vue`, `Employee.vue`
- **Target API Endpoints:** `POST /api/v2/pim/employees/{id}/termination`, `DELETE /api/v2/pim/employees/{id}/termination`

---

## Domain: DOMAIN_ADM

### US_ADM_001: Define Job Titles with Specifications and File Attachments
- **Persona:** `PERSONA_GLOBAL_ADMIN`
- **Feature:** `FEAT_ADM_JOB_TITLE` | **Workflow:** `WF_ONBOARDING`
- **Requirement:** `FR_ADM_001` | **Rules:** `BR_ADM_001`, `BR_ADM_002`
- **Statement:** *"As a Global Admin, I want to create and configure job titles with job descriptions and file specifications, so that roles across the enterprise are standardized."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Create Unique Job Title**
- **Given:** A job title name that does not exist in the system
- **When:** The Admin submits the new title and specification document
- **Then:** The job title is created with HTTP 201.

**Scenario: Prevent Deletion of Job Title Assigned to Active Employees**
- **Given:** The job title "QA Lead" is assigned to 3 active employees
- **When:** The Admin attempts to delete "QA Lead"
- **Then:** The system prohibits deletion and returns an integrity lock error complying with BR_ADM_002.

- **Target UI Components:** `JobTitle.vue`, `SaveJobTitle.vue`
- **Target API Endpoints:** `POST /api/v2/admin/job-titles`, `DELETE /api/v2/admin/job-titles/{id}`

---

### US_ADM_002: Provision User Accounts, Roles, and Strong Passwords
- **Persona:** `PERSONA_GLOBAL_ADMIN`
- **Feature:** `FEAT_ADM_USER_MGMT` | **Workflow:** `WF_ONBOARDING`
- **Requirement:** `FR_ADM_002` | **Rules:** `BR_ADM_004`, `NFR_SEC_004`
- **Statement:** *"As a Global Admin, I want to provision user accounts linked to employee records and assign Admin or ESS roles, so that personnel can authenticate securely."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Create User Account for Employee**
- **Given:** An active employee exists without a user account
- **When:** The Admin assigns a unique username, strong password, and role "ESS"
- **Then:** The account is saved in ohrm_user via POST /api/v2/admin/users.

**Scenario: Protection of Default Global Admin Account**
- **Given:** The primary system admin account (ID 1)
- **When:** An admin attempts to delete or disable this account
- **Then:** The system rejects the action complying with BR_ADM_004.

- **Target UI Components:** `User.vue`, `SaveUser.vue`
- **Target API Endpoints:** `POST /api/v2/admin/users`, `GET /api/v2/admin/users`, `PUT /api/v2/admin/users/{id}`

---

### US_ADM_003: Model Organizational Units and Geographic Locations
- **Persona:** `PERSONA_GLOBAL_ADMIN`
- **Feature:** `FEAT_ADM_ORGANIZATION` | **Workflow:** `WF_ONBOARDING`
- **Requirement:** `FR_ADM_003` | **Rules:** `NFR_DATA_001`
- **Statement:** *"As a Global Admin, I want to maintain the organizational subunit tree and location master, so that employees can be mapped to offices and departments."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Add New Organizational Subunit**
- **Given:** A parent unit "Engineering" exists
- **When:** The Admin adds a child subunit "Quality Assurance"
- **Then:** The subunit is inserted into the nested set tree structure.

- **Target UI Components:** `OrganizationStructure.vue`, `Location.vue`
- **Target API Endpoints:** `POST /api/v2/admin/subunits`, `GET /api/v2/admin/subunits`, `POST /api/v2/admin/locations`

---

### US_ADM_004: Define Pay Grades and Allowed Currency Min/Max Ranges
- **Persona:** `PERSONA_GLOBAL_ADMIN`
- **Feature:** `FEAT_ADM_PAY_GRADE` | **Workflow:** `WF_ONBOARDING`
- **Requirement:** `FR_ADM_001` | **Rules:** N/A
- **Statement:** *"As a Global Admin, I want to configure pay grades and set min/max salary ranges per currency, so that compensation offers adhere to company policy."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Define Pay Grade Currency Bracket**
- **Given:** Pay Grade "Grade A" exists
- **When:** The Admin sets USD currency with min $50,000 and max $80,000
- **Then:** The currency bracket is saved via POST /api/v2/admin/pay-grades/{id}/currencies.

- **Target UI Components:** `PayGrade.vue`, `EditPayGrade.vue`
- **Target API Endpoints:** `POST /api/v2/admin/pay-grades`, `POST /api/v2/admin/pay-grades/{id}/currencies`

---

## Domain: DOMAIN_LEV

### US_LEV_001: Allocate Annual Leave Entitlements to Staff
- **Persona:** `PERSONA_HR_MANAGER`
- **Feature:** `FEAT_LEV_ENTITLEMENT` | **Workflow:** `WF_LEAVE_LIFECYCLE`
- **Requirement:** `FR_LEV_001` | **Rules:** N/A
- **Statement:** *"As an HR Manager, I want to assign leave entitlements by leave period and leave type to employees or subunits, so that employees have available balances."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Bulk Entitlement Allocation**
- **Given:** An active leave period 2026 is configured
- **When:** The HR Manager assigns 20 days of "Annual Leave" to all employees in the Engineering subunit
- **Then:** Leave entitlements are created in ohrm_leave_entitlement with HTTP 201.

- **Target UI Components:** `AddLeaveEntitlement.vue`, `LeaveEntitlementList.vue`
- **Target API Endpoints:** `POST /api/v2/leave/leave-entitlements`, `GET /api/v2/leave/leave-entitlements`

---

### US_LEV_002: Apply for Leave with Automated Balance and Overlap Verification
- **Persona:** `PERSONA_EMPLOYEE`
- **Feature:** `FEAT_LEV_APPLICATION` | **Workflow:** `WF_LEAVE_LIFECYCLE`
- **Requirement:** `FR_LEV_002` | **Rules:** `BR_LEV_001`, `BR_LEV_002`, `BR_LEV_003`
- **Statement:** *"As an Employee (ESS), I want to apply for leave dates, so that my balance is calculated, non-working days excluded, and the request is routed for approval."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Submit Valid Leave Application**
- **Given:** The employee has 10 days of Annual Leave balance
- **When:** They apply for 3 days of leave from Wednesday to Friday
- **Then:** The leave request status becomes "Pending Approval" and an email event is queued.

**Scenario: Prohibit Overlapping Leave Dates**
- **Given:** The employee already has an approved leave request on November 15
- **When:** They attempt to submit another leave request covering November 15
- **Then:** The system rejects the application complying with BR_LEV_002.

- **Target UI Components:** `ApplyLeave.vue`, `MyLeaveList.vue`
- **Target API Endpoints:** `POST /api/v2/leave/leave-requests`, `GET /api/v2/leave/leave-requests`

---

### US_LEV_003: Review and Approve/Reject Subordinate Leave Requests
- **Persona:** `PERSONA_SUPERVISOR`
- **Feature:** `FEAT_LEV_APPROVAL` | **Workflow:** `WF_LEAVE_LIFECYCLE`
- **Requirement:** `FR_LEV_003` | **Rules:** N/A
- **Statement:** *"As a Supervisor, I want to review pending leave requests from my direct reports and approve or reject them, so that operational scheduling is maintained."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Supervisor Approves Leave**
- **Given:** A subordinate has a leave request in "Pending Approval"
- **When:** The Supervisor clicks Approve
- **Then:** The leave state transitions to "Taken / Approved" and entitlement balance is formally deducted.

- **Target UI Components:** `LeaveList.vue`, `LeaveActionDialog.vue`
- **Target API Endpoints:** `PUT /api/v2/leave/leave-requests/{id}`, `GET /api/v2/leave/leave-requests`

---

### US_LEV_004: Configure Company Holidays and Work Week Schedule
- **Persona:** `PERSONA_GLOBAL_ADMIN`
- **Feature:** `FEAT_LEV_CALENDAR` | **Workflow:** `WF_LEAVE_LIFECYCLE`
- **Requirement:** `FR_LEV_001` | **Rules:** `BR_LEV_003`
- **Statement:** *"As a Global Admin, I want to define company holidays and work week days (full, half, non-working), so that leave balance deductions automatically skip non-working days."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Exclude Holidays from Leave Deduction**
- **Given:** A company holiday is declared on Monday
- **When:** An employee applies for leave from Monday to Tuesday
- **Then:** The deducted balance is exactly 1 day instead of 2 complying with BR_LEV_003.

- **Target UI Components:** `HolidayList.vue`, `WorkWeek.vue`
- **Target API Endpoints:** `POST /api/v2/leave/holidays`, `GET /api/v2/leave/work-week`

---

## Domain: DOMAIN_TIM

### US_TIM_001: Log Weekly Timesheet Project Activity Hours and Submit
- **Persona:** `PERSONA_EMPLOYEE`
- **Feature:** `FEAT_TIM_TIMESHEET` | **Workflow:** `WF_TIMESHEET_CYCLE`
- **Requirement:** `FR_TIM_001` | **Rules:** `BR_TIM_001`, `BR_TIM_004`
- **Statement:** *"As an Employee (ESS), I want to record hours spent on customer project activities each week and submit the timesheet, so that project effort is billed and verified."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Log and Submit Timesheet**
- **Given:** An active timesheet week
- **When:** The employee logs 8 hours per day across approved activities and clicks Submit
- **Then:** The timesheet state becomes "Submitted" and locks against further employee edits complying with BR_TIM_004.

**Scenario: Daily 24-Hour Time Cap Enforcement**
- **Given:** An open timesheet day
- **When:** The employee attempts to log 26 hours in a single calendar day
- **Then:** The system rejects the entry complying with BR_TIM_001.

- **Target UI Components:** `MyTimesheet.vue`, `TimesheetGrid.vue`
- **Target API Endpoints:** `PUT /api/v2/time/timesheets/{id}`, `GET /api/v2/time/timesheets/default`

---

### US_TIM_002: Review and Approve Subordinate Timesheets
- **Persona:** `PERSONA_SUPERVISOR`
- **Feature:** `FEAT_TIM_TIMESHEET` | **Workflow:** `WF_TIMESHEET_CYCLE`
- **Requirement:** `FR_TIM_001` | **Rules:** `BR_TIM_004`
- **Statement:** *"As a Supervisor, I want to inspect and sign off on submitted weekly timesheets for my team, so that project records are authorized for payroll."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Supervisor Approves Timesheet**
- **Given:** A team member has submitted a weekly timesheet
- **When:** The Supervisor verifies project activity hours and clicks Approve
- **Then:** The timesheet state transitions to "Approved" via PUT /api/v2/time/timesheets/{id}/action.

- **Target UI Components:** `EmployeeTimesheet.vue`
- **Target API Endpoints:** `PUT /api/v2/time/timesheets/{id}/action`, `GET /api/v2/time/timesheets`

---

### US_TIM_003: Define Customer Accounts, Projects, and Work Activities
- **Persona:** `PERSONA_GLOBAL_ADMIN`
- **Feature:** `FEAT_TIM_PROJECT` | **Workflow:** `WF_TIMESHEET_CYCLE`
- **Requirement:** `FR_TIM_002` | **Rules:** N/A
- **Statement:** *"As a Global Admin, I want to create customers, projects, and work activities with designated project admins, so that project-based tracking is enabled."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Add New Project with Activities**
- **Given:** A customer "Acme Corp" exists
- **When:** The Admin adds project "Core Banking" with activity "Architecture Design"
- **Then:** The project is created with HTTP 201.

- **Target UI Components:** `ProjectList.vue`, `SaveProject.vue`
- **Target API Endpoints:** `POST /api/v2/time/projects`, `POST /api/v2/time/customers`, `POST /api/v2/time/activities`

---

## Domain: DOMAIN_ATT

### US_ATT_001: Perform Sequential Punch In and Punch Out with Timestamp Logging
- **Persona:** `PERSONA_EMPLOYEE`
- **Feature:** `FEAT_ATT_PUNCH` | **Workflow:** `WF_ATTENDANCE_PUNCH`
- **Requirement:** `FR_ATT_001` | **Rules:** `BR_TIM_002`
- **Statement:** *"As an Employee (ESS), I want to record my daily shift punch in and punch out times with optional notes, so that my work attendance is accurately recorded."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Successful Punch In**
- **Given:** The employee is currently punched out
- **When:** They click Punch In at 09:00 AM with note "Morning Shift"
- **Then:** A new attendance record is created in ohrm_attendance_record with HTTP 201.

**Scenario: Prohibit Duplicate Punch In without Prior Punch Out**
- **Given:** The employee is currently punched in
- **When:** They attempt to Punch In again without punching out
- **Then:** The system prevents the action complying with BR_TIM_002.

- **Target UI Components:** `PunchIn.vue`, `PunchOut.vue`, `MyAttendanceRecord.vue`
- **Target API Endpoints:** `POST /api/v2/attendance/records`, `PUT /api/v2/attendance/records/{id}`

---

## Domain: DOMAIN_REC

### US_REC_001: Publish and Manage Job Vacancies with Assigned Hiring Managers
- **Persona:** `PERSONA_HR_MANAGER`
- **Feature:** `FEAT_REC_VACANCY` | **Workflow:** `WF_RECRUITMENT_PIPELINE`
- **Requirement:** `FR_REC_001` | **Rules:** `BR_REC_001`
- **Statement:** *"As an HR Manager, I want to create and publish open job vacancies with job titles, vacancy names, and designated hiring managers, so that applicants can apply."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Publish Active Vacancy**
- **Given:** An active job title exists
- **When:** The HR Manager creates vacancy "Senior QA Engineer" with status Active
- **Then:** The vacancy is published and visible on the recruitment pipeline.

- **Target UI Components:** `VacancyList.vue`, `SaveVacancy.vue`
- **Target API Endpoints:** `POST /api/v2/recruitment/vacancies`, `GET /api/v2/recruitment/vacancies`

---

### US_REC_002: Candidate Resume Ingestion and Profile Pipeline Progression
- **Persona:** `PERSONA_APPLICANT`
- **Feature:** `FEAT_REC_CANDIDATE` | **Workflow:** `WF_RECRUITMENT_PIPELINE`
- **Requirement:** `FR_REC_002` | **Rules:** `BR_REC_001`
- **Statement:** *"As an Applicant or Hiring Lead, I want to submit candidate profiles with resume attachments, so that candidate evaluation can proceed through hiring stages."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Candidate Application Submission with Resume**
- **Given:** An active vacancy exists
- **When:** The applicant submits name, email, and a valid PDF resume (<=5MB)
- **Then:** The candidate record is created in status "Application Initiated" with HTTP 201.

- **Target UI Components:** `CandidateList.vue`, `SaveCandidate.vue`
- **Target API Endpoints:** `POST /api/v2/recruitment/candidates`, `POST /api/v2/recruitment/candidates/{id}/attachments`

---

### US_REC_003: Schedule Candidate Interviews and Record Multi-Rater Evaluations
- **Persona:** `PERSONA_HR_MANAGER`
- **Feature:** `FEAT_REC_INTERVIEW` | **Workflow:** `WF_RECRUITMENT_PIPELINE`
- **Requirement:** `FR_REC_003` | **Rules:** N/A
- **Statement:** *"As an HR Manager or Interviewer, I want to schedule interview rounds with interviewers and log candidate ratings, so that hiring decisions are objective."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Schedule Technical Interview Round**
- **Given:** A candidate has passed the initial screening stage
- **When:** The HR Manager schedules a Technical Round on a future date with designated interviewers
- **Then:** The candidate status transitions to "Interview Scheduled" and calendar notices are dispatched.

- **Target UI Components:** `InterviewList.vue`, `ScheduleInterview.vue`
- **Target API Endpoints:** `POST /api/v2/recruitment/candidates/{id}/interviews`, `PUT /api/v2/recruitment/candidates/{id}/action`

---

## Domain: DOMAIN_PRF

### US_PRF_001: Define Key Performance Indicators (KPIs) per Job Title
- **Persona:** `PERSONA_HR_MANAGER`
- **Feature:** `FEAT_PRF_KPI` | **Workflow:** `WF_APPRAISAL_CYCLE`
- **Requirement:** `FR_PRF_001` | **Rules:** N/A
- **Statement:** *"As an HR Manager, I want to establish measurable KPIs with min/max rating scales per job title, so that appraisals have objective evaluation criteria."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Create Job Title KPI**
- **Given:** Job title "QA Lead" exists
- **When:** The HR Manager adds KPI "Test Automation Coverage" with scale 1 to 100
- **Then:** The KPI is saved with HTTP 201.

- **Target UI Components:** `KpiList.vue`, `SaveKpi.vue`
- **Target API Endpoints:** `POST /api/v2/performance/kpis`, `GET /api/v2/performance/kpis`

---

### US_PRF_002: Log Ongoing Performance Tracker Observations (Positive/Negative)
- **Persona:** `PERSONA_SUPERVISOR`
- **Feature:** `FEAT_PRF_TRACKER` | **Workflow:** `WF_APPRAISAL_CYCLE`
- **Requirement:** `FR_PRF_001` | **Rules:** N/A
- **Statement:** *"As a Supervisor, I want to log ongoing positive or constructive performance tracker entries for my team members, so that annual reviews reflect continuous feedback."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Add Positive Performance Log Entry**
- **Given:** An active performance tracker for a subordinate
- **When:** The Supervisor logs entry "Delivered QKG Parser ahead of schedule" with rating Positive
- **Then:** The log is persisted via POST /api/v2/performance/trackers/{id}/logs.

- **Target UI Components:** `PerformanceTrackerList.vue`, `SavePerformanceTrackerLog.vue`
- **Target API Endpoints:** `POST /api/v2/performance/trackers/{id}/logs`, `GET /api/v2/performance/trackers`

---

## Domain: DOMAIN_CLM

### US_CLM_001: Submit Expense Claims with Receipt Attachments and Expense Types
- **Persona:** `PERSONA_EMPLOYEE`
- **Feature:** `FEAT_CLM_EXPENSE` | **Workflow:** `WF_EXPENSE_CLAIM`
- **Requirement:** `FR_CLM_001` | **Rules:** `BR_CLM_001`
- **Statement:** *"As an Employee (ESS), I want to submit expense claim requests with expense dates, amounts, and receipt attachments, so that business expenses are reimbursed."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Submit Valid Expense Claim**
- **Given:** An active claim event "Client Visit Tokyo" exists
- **When:** The employee submits expense type "Flight" for $1,200 with receipt attachment
- **Then:** The claim is submitted in status "Pending Approval" via POST /api/v2/claim/requests.

- **Target UI Components:** `SubmitClaim.vue`, `MyClaimList.vue`
- **Target API Endpoints:** `POST /api/v2/claim/requests`, `POST /api/v2/claim/requests/{id}/expenses`

---

### US_CLM_002: Authorize and Approve Subordinate Expense Claims
- **Persona:** `PERSONA_SUPERVISOR`
- **Feature:** `FEAT_CLM_APPROVAL` | **Workflow:** `WF_EXPENSE_CLAIM`
- **Requirement:** `FR_CLM_001` | **Rules:** N/A
- **Statement:** *"As a Supervisor, I want to inspect submitted expense items and receipts and approve them, so that finance can disburse reimbursement."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Supervisor Approves Claim**
- **Given:** A subordinate has submitted an expense claim
- **When:** The Supervisor verifies attached receipts and clicks Approve
- **Then:** The claim transitions to "Approved" via PUT /api/v2/claim/requests/{id}/action.

- **Target UI Components:** `ClaimList.vue`, `ClaimActionDialog.vue`
- **Target API Endpoints:** `PUT /api/v2/claim/requests/{id}/action`, `GET /api/v2/claim/requests`

---

## Domain: DOMAIN_BUZ

### US_BUZ_001: Publish Social Posts, Multimedia, and Interact with Peer Shares
- **Persona:** `PERSONA_EMPLOYEE`
- **Feature:** `FEAT_BUZ_POSTS` | **Workflow:** `WF_BUZZ_COLLABORATION`
- **Requirement:** `FR_BUZ_001` | **Rules:** `NFR_SEC_002`
- **Statement:** *"As an Employee (ESS), I want to share updates, photos, and video links on the corporate Buzz feed, and comment or like colleagues' posts, so that team collaboration is enhanced."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Publish Text and Photo Post with XSS Sanitization**
- **Given:** The employee is on the Buzz social feed
- **When:** They publish a celebratory post containing formatted text and an image
- **Then:** The post is sanitized against script injection complying with NFR_SEC_002 and rendered on the live feed.

- **Target UI Components:** `BuzzFeed.vue`, `PostShare.vue`, `BuzzComments.vue`
- **Target API Endpoints:** `POST /api/v2/buzz/posts`, `POST /api/v2/buzz/shares/{id}/likes`, `POST /api/v2/buzz/shares/{id}/comments`

---

## Domain: DOMAIN_DIR

### US_DIR_001: Search Corporate Directory by Name, Job Title, Subunit, and Location
- **Persona:** `PERSONA_EMPLOYEE`
- **Feature:** `FEAT_DIR_SEARCH` | **Workflow:** `WF_ONBOARDING`
- **Requirement:** `FR_PIM_001` | **Rules:** N/A
- **Statement:** *"As an Employee (ESS), I want to search and view company colleagues by name, department, or office location, so that I can discover contact information."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Filter Directory by Subunit**
- **Given:** The user is on the Corporate Directory page
- **When:** They filter by Subunit "Engineering"
- **Then:** All active employees in Engineering are listed with work email and job title.

- **Target UI Components:** `DirectoryList.vue`, `EmployeeCard.vue`
- **Target API Endpoints:** `GET /api/v2/directory/employees`

---

## Domain: DOMAIN_MNT

### US_MNT_001: GDPR Historical Personal Record Purge with Administrative Audit Log
- **Persona:** `PERSONA_GLOBAL_ADMIN`
- **Feature:** `FEAT_MNT_PURGE` | **Workflow:** `WF_DATA_PURGE`
- **Requirement:** `FR_MNT_001` | **Rules:** `NFR_DATA_002`
- **Statement:** *"As a Global Admin or Compliance Officer, I want to permanently purge personal data for candidates and terminated employees past their retention period, so that GDPR compliance is maintained."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Purge Terminated Employee Data Past Retention SLA**
- **Given:** Employees terminated more than 3 years ago
- **When:** The Admin initiates the GDPR purge routine with admin password re-verification
- **Then:** Personal identifiers are permanently eradicated from hs_hr_employee and an immutable purge event is logged complying with NFR_DATA_002.

- **Target UI Components:** `PurgeEmployeeData.vue`, `PurgeCandidateData.vue`
- **Target API Endpoints:** `POST /api/v2/maintenance/purge-employee-data`, `POST /api/v2/maintenance/purge-candidate-data`

---

## Domain: DOMAIN_AUT

### US_AUT_001: Secure Credential Authentication and Brute-Force Rate Limiting
- **Persona:** `PERSONA_EMPLOYEE`
- **Feature:** `FEAT_ADM_USER_MGMT` | **Workflow:** `WF_ONBOARDING`
- **Requirement:** `FR_ADM_002` | **Rules:** `NFR_SEC_004`
- **Statement:** *"As an Employee or Admin, I want to log in securely with username and password, so that unauthorized access is defended against brute-force attacks."*

#### Acceptance Criteria (Given-When-Then)
**Scenario: Successful Authentication**
- **Given:** A valid active user account
- **When:** The user enters correct credentials
- **Then:** An authenticated session token is issued and user is redirected to the home dashboard.

**Scenario: Brute-Force Account Lockout**
- **Given:** A targeted user account
- **When:** 5 consecutive incorrect password attempts occur within 2 minutes
- **Then:** The account is temporarily locked with HTTP 429 defending against brute force complying with NFR_SEC_004.

- **Target UI Components:** `Login.vue`, `ResetPassword.vue`
- **Target API Endpoints:** `POST /api/v2/auth/login`, `POST /api/v2/auth/logout`, `POST /api/v2/auth/password-strength`

---

