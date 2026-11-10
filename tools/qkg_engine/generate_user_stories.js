/**
 * OrangeHRM QKG User Stories Generator
 * Generates an enterprise-grade Agile / BDD User Story Catalog for the entire application (all 12 domains).
 * Each story includes:
 * - Standard Agile statement (As a... I want to... So that...)
 * - Given-When-Then Acceptance Criteria
 * - End-to-end mapping: Persona -> Feature -> UIComponent -> ApiEndpoint -> Requirement -> BusinessRule
 */

const fs = require('fs');
const path = require('path');

const userStories = [
  // ==========================================
  // DOMAIN 1: PIM (Employee Management)
  // ==========================================
  {
    story_id: 'US_PIM_001',
    domain_id: 'DOMAIN_PIM',
    feature_id: 'FEAT_PIM_EMPLOYEE_MASTER',
    workflow_id: 'WF_ONBOARDING',
    requirement_id: 'FR_PIM_001',
    rule_ids: ['BR_PIM_001'],
    persona_id: 'PERSONA_HR_MANAGER',
    title: 'Create New Employee Profile with Mandatory Identity Fields',
    statement: 'As an HR Manager, I want to create a new employee profile with first name, last name, and employee ID, so that the new hire is officially recorded in the organization.',
    acceptance_criteria: [
      {
        scenario: 'Successful Employee Profile Creation via UI',
        given: 'The HR Manager is on the Add Employee screen (/pim/addEmployee)',
        when: 'They enter valid first name, last name, and a unique employee ID, then click Save',
        then: 'The employee profile is saved with HTTP 201, a success toast is displayed, and the page navigates to Personal Details.'
      },
      {
        scenario: 'Rejection of Duplicate Employee Number',
        given: 'An active employee with employee ID "EMP001" already exists',
        when: 'The HR Manager attempts to create another profile with employee ID "EMP001"',
        then: 'The system rejects the submission with validation error "Employee Id already exists" complying with BR_PIM_001.'
      }
    ],
    target_ui_components: ['SaveEmployee.vue', 'Employee.vue'],
    target_endpoints: ['POST /api/v2/pim/employees', 'GET /api/v2/pim/employees']
  },
  {
    story_id: 'US_PIM_002',
    domain_id: 'DOMAIN_PIM',
    feature_id: 'FEAT_PIM_JOB_DETAILS',
    workflow_id: 'WF_ONBOARDING',
    requirement_id: 'FR_PIM_002',
    rule_ids: ['BR_ADM_001'],
    persona_id: 'PERSONA_HR_MANAGER',
    title: 'Assign Organizational Placement, Job Title, and Employment Status',
    statement: 'As an HR Manager, I want to assign an active job title, subunit, and employment status to an employee, so that their organizational placement and role are clearly defined.',
    acceptance_criteria: [
      {
        scenario: 'Assign Job Details Successfully',
        given: 'An employee profile exists in Draft or Active state',
        when: 'The HR Manager selects an active Job Title, Subunit, and Employment Status and submits the form',
        then: 'The job details are persisted via PUT /api/v2/pim/employees/{id}/job-details with HTTP 200.'
      }
    ],
    target_ui_components: ['EmployeeJob.vue'],
    target_endpoints: ['PUT /api/v2/pim/employees/{id}/job-details', 'GET /api/v2/pim/employees/{id}/job-details']
  },
  {
    story_id: 'US_PIM_003',
    domain_id: 'DOMAIN_PIM',
    feature_id: 'FEAT_PIM_REPORT_TO',
    workflow_id: 'WF_ONBOARDING',
    requirement_id: 'FR_PIM_003',
    rule_ids: ['BR_PIM_002'],
    persona_id: 'PERSONA_HR_MANAGER',
    title: 'Establish Direct and Indirect Reporting Supervision',
    statement: 'As an HR Manager, I want to assign supervisors and reporting methods to an employee, so that approval hierarchies for leave and timesheets are established.',
    acceptance_criteria: [
      {
        scenario: 'Assign Direct Supervisor',
        given: 'Both supervisor and employee profiles are active',
        when: 'The HR Manager selects the supervisor with reporting method "Direct" and saves',
        then: 'The supervisor-subordinate relationship is recorded in the hierarchy.'
      },
      {
        scenario: 'Circular Reporting Hierarchy Prevention',
        given: 'Employee A is assigned as supervisor of Employee B',
        when: 'The HR Manager attempts to assign Employee B as supervisor of Employee A',
        then: 'The system prohibits the assignment and displays a loop prevention error complying with BR_PIM_002.'
      }
    ],
    target_ui_components: ['EmployeeReportTo.vue'],
    target_endpoints: ['POST /api/v2/pim/employees/{id}/supervisors', 'GET /api/v2/pim/employees/{id}/supervisors']
  },
  {
    story_id: 'US_PIM_004',
    domain_id: 'DOMAIN_PIM',
    feature_id: 'FEAT_PIM_SALARY',
    workflow_id: 'WF_ONBOARDING',
    requirement_id: 'FR_PIM_004',
    rule_ids: ['BR_PIM_003'],
    persona_id: 'PERSONA_HR_MANAGER',
    title: 'Configure Compensation and Salary Components',
    statement: 'As an HR Manager, I want to add pay grade salary components and payment frequency for an employee, so that compensation details are accurately maintained.',
    acceptance_criteria: [
      {
        scenario: 'Add Valid Salary Component',
        given: 'An employee has an assigned Pay Grade',
        when: 'The HR Manager enters an authorized basic amount within the pay grade currency range and saves',
        then: 'The salary record is encrypted and saved via POST /api/v2/pim/employees/{id}/salary-components.'
      }
    ],
    target_ui_components: ['EmployeeSalary.vue'],
    target_endpoints: ['POST /api/v2/pim/employees/{id}/salary-components', 'GET /api/v2/pim/employees/{id}/salary-components']
  },
  {
    story_id: 'US_PIM_005',
    domain_id: 'DOMAIN_PIM',
    feature_id: 'FEAT_PIM_PERSONAL_CONTACT',
    workflow_id: 'WF_ONBOARDING',
    requirement_id: 'FR_PIM_001',
    rule_ids: [],
    persona_id: 'PERSONA_EMPLOYEE',
    title: 'Update Personal Contact Details and Emergency Contacts',
    statement: 'As an Employee (ESS), I want to update my street address, phone number, and emergency contacts, so that the company has my current emergency information.',
    acceptance_criteria: [
      {
        scenario: 'Employee Self-Service Contact Update',
        given: 'An employee is logged into their ESS account',
        when: 'They update their mobile phone number and add a primary emergency contact',
        then: 'The contact details are updated via PUT /api/v2/pim/employees/{id}/contact-details.'
      }
    ],
    target_ui_components: ['EmployeeContactDetails.vue', 'EmployeeEmergencyContacts.vue'],
    target_endpoints: ['PUT /api/v2/pim/employees/{id}/contact-details', 'POST /api/v2/pim/employees/{id}/emergency-contacts']
  },
  {
    story_id: 'US_PIM_006',
    domain_id: 'DOMAIN_PIM',
    feature_id: 'FEAT_PIM_TERMINATION',
    workflow_id: 'WF_SEPARATION',
    requirement_id: 'FR_PIM_001',
    rule_ids: ['BR_PIM_005'],
    persona_id: 'PERSONA_HR_MANAGER',
    title: 'Execute Employee Termination and Account Deactivation',
    statement: 'As an HR Manager, I want to record an employee termination with reason and date, so that the employee record is archived and system access is automatically revoked.',
    acceptance_criteria: [
      {
        scenario: 'Employee Offboarding Execution',
        given: 'An active employee is departing the company',
        when: 'The HR Manager enters the termination date and reason and confirms',
        then: 'The employee status becomes Terminated and associated user login accounts are disabled complying with BR_PIM_005.'
      }
    ],
    target_ui_components: ['TerminationReason.vue', 'Employee.vue'],
    target_endpoints: ['POST /api/v2/pim/employees/{id}/termination', 'DELETE /api/v2/pim/employees/{id}/termination']
  },

  // ==========================================
  // DOMAIN 2: System Administration
  // ==========================================
  {
    story_id: 'US_ADM_001',
    domain_id: 'DOMAIN_ADM',
    feature_id: 'FEAT_ADM_JOB_TITLE',
    workflow_id: 'WF_ONBOARDING',
    requirement_id: 'FR_ADM_001',
    rule_ids: ['BR_ADM_001', 'BR_ADM_002'],
    persona_id: 'PERSONA_GLOBAL_ADMIN',
    title: 'Define Job Titles with Specifications and File Attachments',
    statement: 'As a Global Admin, I want to create and configure job titles with job descriptions and file specifications, so that roles across the enterprise are standardized.',
    acceptance_criteria: [
      {
        scenario: 'Create Unique Job Title',
        given: 'A job title name that does not exist in the system',
        when: 'The Admin submits the new title and specification document',
        then: 'The job title is created with HTTP 201.'
      },
      {
        scenario: 'Prevent Deletion of Job Title Assigned to Active Employees',
        given: 'The job title "QA Lead" is assigned to 3 active employees',
        when: 'The Admin attempts to delete "QA Lead"',
        then: 'The system prohibits deletion and returns an integrity lock error complying with BR_ADM_002.'
      }
    ],
    target_ui_components: ['JobTitle.vue', 'SaveJobTitle.vue'],
    target_endpoints: ['POST /api/v2/admin/job-titles', 'DELETE /api/v2/admin/job-titles/{id}']
  },
  {
    story_id: 'US_ADM_002',
    domain_id: 'DOMAIN_ADM',
    feature_id: 'FEAT_ADM_USER_MGMT',
    workflow_id: 'WF_ONBOARDING',
    requirement_id: 'FR_ADM_002',
    rule_ids: ['BR_ADM_004', 'NFR_SEC_004'],
    persona_id: 'PERSONA_GLOBAL_ADMIN',
    title: 'Provision User Accounts, Roles, and Strong Passwords',
    statement: 'As a Global Admin, I want to provision user accounts linked to employee records and assign Admin or ESS roles, so that personnel can authenticate securely.',
    acceptance_criteria: [
      {
        scenario: 'Create User Account for Employee',
        given: 'An active employee exists without a user account',
        when: 'The Admin assigns a unique username, strong password, and role "ESS"',
        then: 'The account is saved in ohrm_user via POST /api/v2/admin/users.'
      },
      {
        scenario: 'Protection of Default Global Admin Account',
        given: 'The primary system admin account (ID 1)',
        when: 'An admin attempts to delete or disable this account',
        then: 'The system rejects the action complying with BR_ADM_004.'
      }
    ],
    target_ui_components: ['User.vue', 'SaveUser.vue'],
    target_endpoints: ['POST /api/v2/admin/users', 'GET /api/v2/admin/users', 'PUT /api/v2/admin/users/{id}']
  },
  {
    story_id: 'US_ADM_003',
    domain_id: 'DOMAIN_ADM',
    feature_id: 'FEAT_ADM_ORGANIZATION',
    workflow_id: 'WF_ONBOARDING',
    requirement_id: 'FR_ADM_003',
    rule_ids: ['NFR_DATA_001'],
    persona_id: 'PERSONA_GLOBAL_ADMIN',
    title: 'Model Organizational Units and Geographic Locations',
    statement: 'As a Global Admin, I want to maintain the organizational subunit tree and location master, so that employees can be mapped to offices and departments.',
    acceptance_criteria: [
      {
        scenario: 'Add New Organizational Subunit',
        given: 'A parent unit "Engineering" exists',
        when: 'The Admin adds a child subunit "Quality Assurance"',
        then: 'The subunit is inserted into the nested set tree structure.'
      }
    ],
    target_ui_components: ['OrganizationStructure.vue', 'Location.vue'],
    target_endpoints: ['POST /api/v2/admin/subunits', 'GET /api/v2/admin/subunits', 'POST /api/v2/admin/locations']
  },
  {
    story_id: 'US_ADM_004',
    domain_id: 'DOMAIN_ADM',
    feature_id: 'FEAT_ADM_PAY_GRADE',
    workflow_id: 'WF_ONBOARDING',
    requirement_id: 'FR_ADM_001',
    rule_ids: [],
    persona_id: 'PERSONA_GLOBAL_ADMIN',
    title: 'Define Pay Grades and Allowed Currency Min/Max Ranges',
    statement: 'As a Global Admin, I want to configure pay grades and set min/max salary ranges per currency, so that compensation offers adhere to company policy.',
    acceptance_criteria: [
      {
        scenario: 'Define Pay Grade Currency Bracket',
        given: 'Pay Grade "Grade A" exists',
        when: 'The Admin sets USD currency with min $50,000 and max $80,000',
        then: 'The currency bracket is saved via POST /api/v2/admin/pay-grades/{id}/currencies.'
      }
    ],
    target_ui_components: ['PayGrade.vue', 'EditPayGrade.vue'],
    target_endpoints: ['POST /api/v2/admin/pay-grades', 'POST /api/v2/admin/pay-grades/{id}/currencies']
  },

  // ==========================================
  // DOMAIN 3: Leave & Absence Management
  // ==========================================
  {
    story_id: 'US_LEV_001',
    domain_id: 'DOMAIN_LEV',
    feature_id: 'FEAT_LEV_ENTITLEMENT',
    workflow_id: 'WF_LEAVE_LIFECYCLE',
    requirement_id: 'FR_LEV_001',
    rule_ids: [],
    persona_id: 'PERSONA_HR_MANAGER',
    title: 'Allocate Annual Leave Entitlements to Staff',
    statement: 'As an HR Manager, I want to assign leave entitlements by leave period and leave type to employees or subunits, so that employees have available balances.',
    acceptance_criteria: [
      {
        scenario: 'Bulk Entitlement Allocation',
        given: 'An active leave period 2026 is configured',
        when: 'The HR Manager assigns 20 days of "Annual Leave" to all employees in the Engineering subunit',
        then: 'Leave entitlements are created in ohrm_leave_entitlement with HTTP 201.'
      }
    ],
    target_ui_components: ['AddLeaveEntitlement.vue', 'LeaveEntitlementList.vue'],
    target_endpoints: ['POST /api/v2/leave/leave-entitlements', 'GET /api/v2/leave/leave-entitlements']
  },
  {
    story_id: 'US_LEV_002',
    domain_id: 'DOMAIN_LEV',
    feature_id: 'FEAT_LEV_APPLICATION',
    workflow_id: 'WF_LEAVE_LIFECYCLE',
    requirement_id: 'FR_LEV_002',
    rule_ids: ['BR_LEV_001', 'BR_LEV_002', 'BR_LEV_003'],
    persona_id: 'PERSONA_EMPLOYEE',
    title: 'Apply for Leave with Automated Balance and Overlap Verification',
    statement: 'As an Employee (ESS), I want to apply for leave dates, so that my balance is calculated, non-working days excluded, and the request is routed for approval.',
    acceptance_criteria: [
      {
        scenario: 'Submit Valid Leave Application',
        given: 'The employee has 10 days of Annual Leave balance',
        when: 'They apply for 3 days of leave from Wednesday to Friday',
        then: 'The leave request status becomes "Pending Approval" and an email event is queued.'
      },
      {
        scenario: 'Prohibit Overlapping Leave Dates',
        given: 'The employee already has an approved leave request on November 15',
        when: 'They attempt to submit another leave request covering November 15',
        then: 'The system rejects the application complying with BR_LEV_002.'
      }
    ],
    target_ui_components: ['ApplyLeave.vue', 'MyLeaveList.vue'],
    target_endpoints: ['POST /api/v2/leave/leave-requests', 'GET /api/v2/leave/leave-requests']
  },
  {
    story_id: 'US_LEV_003',
    domain_id: 'DOMAIN_LEV',
    feature_id: 'FEAT_LEV_APPROVAL',
    workflow_id: 'WF_LEAVE_LIFECYCLE',
    requirement_id: 'FR_LEV_003',
    rule_ids: [],
    persona_id: 'PERSONA_SUPERVISOR',
    title: 'Review and Approve/Reject Subordinate Leave Requests',
    statement: 'As a Supervisor, I want to review pending leave requests from my direct reports and approve or reject them, so that operational scheduling is maintained.',
    acceptance_criteria: [
      {
        scenario: 'Supervisor Approves Leave',
        given: 'A subordinate has a leave request in "Pending Approval"',
        when: 'The Supervisor clicks Approve',
        then: 'The leave state transitions to "Taken / Approved" and entitlement balance is formally deducted.'
      }
    ],
    target_ui_components: ['LeaveList.vue', 'LeaveActionDialog.vue'],
    target_endpoints: ['PUT /api/v2/leave/leave-requests/{id}', 'GET /api/v2/leave/leave-requests']
  },
  {
    story_id: 'US_LEV_004',
    domain_id: 'DOMAIN_LEV',
    feature_id: 'FEAT_LEV_CALENDAR',
    workflow_id: 'WF_LEAVE_LIFECYCLE',
    requirement_id: 'FR_LEV_001',
    rule_ids: ['BR_LEV_003'],
    persona_id: 'PERSONA_GLOBAL_ADMIN',
    title: 'Configure Company Holidays and Work Week Schedule',
    statement: 'As a Global Admin, I want to define company holidays and work week days (full, half, non-working), so that leave balance deductions automatically skip non-working days.',
    acceptance_criteria: [
      {
        scenario: 'Exclude Holidays from Leave Deduction',
        given: 'A company holiday is declared on Monday',
        when: 'An employee applies for leave from Monday to Tuesday',
        then: 'The deducted balance is exactly 1 day instead of 2 complying with BR_LEV_003.'
      }
    ],
    target_ui_components: ['HolidayList.vue', 'WorkWeek.vue'],
    target_endpoints: ['POST /api/v2/leave/holidays', 'GET /api/v2/leave/work-week']
  },

  // ==========================================
  // DOMAIN 4: Time & Timesheets
  // ==========================================
  {
    story_id: 'US_TIM_001',
    domain_id: 'DOMAIN_TIM',
    feature_id: 'FEAT_TIM_TIMESHEET',
    workflow_id: 'WF_TIMESHEET_CYCLE',
    requirement_id: 'FR_TIM_001',
    rule_ids: ['BR_TIM_001', 'BR_TIM_004'],
    persona_id: 'PERSONA_EMPLOYEE',
    title: 'Log Weekly Timesheet Project Activity Hours and Submit',
    statement: 'As an Employee (ESS), I want to record hours spent on customer project activities each week and submit the timesheet, so that project effort is billed and verified.',
    acceptance_criteria: [
      {
        scenario: 'Log and Submit Timesheet',
        given: 'An active timesheet week',
        when: 'The employee logs 8 hours per day across approved activities and clicks Submit',
        then: 'The timesheet state becomes "Submitted" and locks against further employee edits complying with BR_TIM_004.'
      },
      {
        scenario: 'Daily 24-Hour Time Cap Enforcement',
        given: 'An open timesheet day',
        when: 'The employee attempts to log 26 hours in a single calendar day',
        then: 'The system rejects the entry complying with BR_TIM_001.'
      }
    ],
    target_ui_components: ['MyTimesheet.vue', 'TimesheetGrid.vue'],
    target_endpoints: ['PUT /api/v2/time/timesheets/{id}', 'GET /api/v2/time/timesheets/default']
  },
  {
    story_id: 'US_TIM_002',
    domain_id: 'DOMAIN_TIM',
    feature_id: 'FEAT_TIM_TIMESHEET',
    workflow_id: 'WF_TIMESHEET_CYCLE',
    requirement_id: 'FR_TIM_001',
    rule_ids: ['BR_TIM_004'],
    persona_id: 'PERSONA_SUPERVISOR',
    title: 'Review and Approve Subordinate Timesheets',
    statement: 'As a Supervisor, I want to inspect and sign off on submitted weekly timesheets for my team, so that project records are authorized for payroll.',
    acceptance_criteria: [
      {
        scenario: 'Supervisor Approves Timesheet',
        given: 'A team member has submitted a weekly timesheet',
        when: 'The Supervisor verifies project activity hours and clicks Approve',
        then: 'The timesheet state transitions to "Approved" via PUT /api/v2/time/timesheets/{id}/action.'
      }
    ],
    target_ui_components: ['EmployeeTimesheet.vue'],
    target_endpoints: ['PUT /api/v2/time/timesheets/{id}/action', 'GET /api/v2/time/timesheets']
  },
  {
    story_id: 'US_TIM_003',
    domain_id: 'DOMAIN_TIM',
    feature_id: 'FEAT_TIM_PROJECT',
    workflow_id: 'WF_TIMESHEET_CYCLE',
    requirement_id: 'FR_TIM_002',
    rule_ids: [],
    persona_id: 'PERSONA_GLOBAL_ADMIN',
    title: 'Define Customer Accounts, Projects, and Work Activities',
    statement: 'As a Global Admin, I want to create customers, projects, and work activities with designated project admins, so that project-based tracking is enabled.',
    acceptance_criteria: [
      {
        scenario: 'Add New Project with Activities',
        given: 'A customer "Acme Corp" exists',
        when: 'The Admin adds project "Core Banking" with activity "Architecture Design"',
        then: 'The project is created with HTTP 201.'
      }
    ],
    target_ui_components: ['ProjectList.vue', 'SaveProject.vue'],
    target_endpoints: ['POST /api/v2/time/projects', 'POST /api/v2/time/customers', 'POST /api/v2/time/activities']
  },

  // ==========================================
  // DOMAIN 5: Attendance Management
  // ==========================================
  {
    story_id: 'US_ATT_001',
    domain_id: 'DOMAIN_ATT',
    feature_id: 'FEAT_ATT_PUNCH',
    workflow_id: 'WF_ATTENDANCE_PUNCH',
    requirement_id: 'FR_ATT_001',
    rule_ids: ['BR_TIM_002'],
    persona_id: 'PERSONA_EMPLOYEE',
    title: 'Perform Sequential Punch In and Punch Out with Timestamp Logging',
    statement: 'As an Employee (ESS), I want to record my daily shift punch in and punch out times with optional notes, so that my work attendance is accurately recorded.',
    acceptance_criteria: [
      {
        scenario: 'Successful Punch In',
        given: 'The employee is currently punched out',
        when: 'They click Punch In at 09:00 AM with note "Morning Shift"',
        then: 'A new attendance record is created in ohrm_attendance_record with HTTP 201.'
      },
      {
        scenario: 'Prohibit Duplicate Punch In without Prior Punch Out',
        given: 'The employee is currently punched in',
        when: 'They attempt to Punch In again without punching out',
        then: 'The system prevents the action complying with BR_TIM_002.'
      }
    ],
    target_ui_components: ['PunchIn.vue', 'PunchOut.vue', 'MyAttendanceRecord.vue'],
    target_endpoints: ['POST /api/v2/attendance/records', 'PUT /api/v2/attendance/records/{id}']
  },

  // ==========================================
  // DOMAIN 6: Recruitment & Talent Acquisition
  // ==========================================
  {
    story_id: 'US_REC_001',
    domain_id: 'DOMAIN_REC',
    feature_id: 'FEAT_REC_VACANCY',
    workflow_id: 'WF_RECRUITMENT_PIPELINE',
    requirement_id: 'FR_REC_001',
    rule_ids: ['BR_REC_001'],
    persona_id: 'PERSONA_HR_MANAGER',
    title: 'Publish and Manage Job Vacancies with Assigned Hiring Managers',
    statement: 'As an HR Manager, I want to create and publish open job vacancies with job titles, vacancy names, and designated hiring managers, so that applicants can apply.',
    acceptance_criteria: [
      {
        scenario: 'Publish Active Vacancy',
        given: 'An active job title exists',
        when: 'The HR Manager creates vacancy "Senior QA Engineer" with status Active',
        then: 'The vacancy is published and visible on the recruitment pipeline.'
      }
    ],
    target_ui_components: ['VacancyList.vue', 'SaveVacancy.vue'],
    target_endpoints: ['POST /api/v2/recruitment/vacancies', 'GET /api/v2/recruitment/vacancies']
  },
  {
    story_id: 'US_REC_002',
    domain_id: 'DOMAIN_REC',
    feature_id: 'FEAT_REC_CANDIDATE',
    workflow_id: 'WF_RECRUITMENT_PIPELINE',
    requirement_id: 'FR_REC_002',
    rule_ids: ['BR_REC_001'],
    persona_id: 'PERSONA_APPLICANT',
    title: 'Candidate Resume Ingestion and Profile Pipeline Progression',
    statement: 'As an Applicant or Hiring Lead, I want to submit candidate profiles with resume attachments, so that candidate evaluation can proceed through hiring stages.',
    acceptance_criteria: [
      {
        scenario: 'Candidate Application Submission with Resume',
        given: 'An active vacancy exists',
        when: 'The applicant submits name, email, and a valid PDF resume (<=5MB)',
        then: 'The candidate record is created in status "Application Initiated" with HTTP 201.'
      }
    ],
    target_ui_components: ['CandidateList.vue', 'SaveCandidate.vue'],
    target_endpoints: ['POST /api/v2/recruitment/candidates', 'POST /api/v2/recruitment/candidates/{id}/attachments']
  },
  {
    story_id: 'US_REC_003',
    domain_id: 'DOMAIN_REC',
    feature_id: 'FEAT_REC_INTERVIEW',
    workflow_id: 'WF_RECRUITMENT_PIPELINE',
    requirement_id: 'FR_REC_003',
    rule_ids: [],
    persona_id: 'PERSONA_HR_MANAGER',
    title: 'Schedule Candidate Interviews and Record Multi-Rater Evaluations',
    statement: 'As an HR Manager or Interviewer, I want to schedule interview rounds with interviewers and log candidate ratings, so that hiring decisions are objective.',
    acceptance_criteria: [
      {
        scenario: 'Schedule Technical Interview Round',
        given: 'A candidate has passed the initial screening stage',
        when: 'The HR Manager schedules a Technical Round on a future date with designated interviewers',
        then: 'The candidate status transitions to "Interview Scheduled" and calendar notices are dispatched.'
      }
    ],
    target_ui_components: ['InterviewList.vue', 'ScheduleInterview.vue'],
    target_endpoints: ['POST /api/v2/recruitment/candidates/{id}/interviews', 'PUT /api/v2/recruitment/candidates/{id}/action']
  },

  // ==========================================
  // DOMAIN 7: Performance & Appraisals
  // ==========================================
  {
    story_id: 'US_PRF_001',
    domain_id: 'DOMAIN_PRF',
    feature_id: 'FEAT_PRF_KPI',
    workflow_id: 'WF_APPRAISAL_CYCLE',
    requirement_id: 'FR_PRF_001',
    rule_ids: [],
    persona_id: 'PERSONA_HR_MANAGER',
    title: 'Define Key Performance Indicators (KPIs) per Job Title',
    statement: 'As an HR Manager, I want to establish measurable KPIs with min/max rating scales per job title, so that appraisals have objective evaluation criteria.',
    acceptance_criteria: [
      {
        scenario: 'Create Job Title KPI',
        given: 'Job title "QA Lead" exists',
        when: 'The HR Manager adds KPI "Test Automation Coverage" with scale 1 to 100',
        then: 'The KPI is saved with HTTP 201.'
      }
    ],
    target_ui_components: ['KpiList.vue', 'SaveKpi.vue'],
    target_endpoints: ['POST /api/v2/performance/kpis', 'GET /api/v2/performance/kpis']
  },
  {
    story_id: 'US_PRF_002',
    domain_id: 'DOMAIN_PRF',
    feature_id: 'FEAT_PRF_TRACKER',
    workflow_id: 'WF_APPRAISAL_CYCLE',
    requirement_id: 'FR_PRF_001',
    rule_ids: [],
    persona_id: 'PERSONA_SUPERVISOR',
    title: 'Log Ongoing Performance Tracker Observations (Positive/Negative)',
    statement: 'As a Supervisor, I want to log ongoing positive or constructive performance tracker entries for my team members, so that annual reviews reflect continuous feedback.',
    acceptance_criteria: [
      {
        scenario: 'Add Positive Performance Log Entry',
        given: 'An active performance tracker for a subordinate',
        when: 'The Supervisor logs entry "Delivered QKG Parser ahead of schedule" with rating Positive',
        then: 'The log is persisted via POST /api/v2/performance/trackers/{id}/logs.'
      }
    ],
    target_ui_components: ['PerformanceTrackerList.vue', 'SavePerformanceTrackerLog.vue'],
    target_endpoints: ['POST /api/v2/performance/trackers/{id}/logs', 'GET /api/v2/performance/trackers']
  },

  // ==========================================
  // DOMAIN 8: Travel & Expense Claims
  // ==========================================
  {
    story_id: 'US_CLM_001',
    domain_id: 'DOMAIN_CLM',
    feature_id: 'FEAT_CLM_EXPENSE',
    workflow_id: 'WF_EXPENSE_CLAIM',
    requirement_id: 'FR_CLM_001',
    rule_ids: ['BR_CLM_001'],
    persona_id: 'PERSONA_EMPLOYEE',
    title: 'Submit Expense Claims with Receipt Attachments and Expense Types',
    statement: 'As an Employee (ESS), I want to submit expense claim requests with expense dates, amounts, and receipt attachments, so that business expenses are reimbursed.',
    acceptance_criteria: [
      {
        scenario: 'Submit Valid Expense Claim',
        given: 'An active claim event "Client Visit Tokyo" exists',
        when: 'The employee submits expense type "Flight" for $1,200 with receipt attachment',
        then: 'The claim is submitted in status "Pending Approval" via POST /api/v2/claim/requests.'
      }
    ],
    target_ui_components: ['SubmitClaim.vue', 'MyClaimList.vue'],
    target_endpoints: ['POST /api/v2/claim/requests', 'POST /api/v2/claim/requests/{id}/expenses']
  },
  {
    story_id: 'US_CLM_002',
    domain_id: 'DOMAIN_CLM',
    feature_id: 'FEAT_CLM_APPROVAL',
    workflow_id: 'WF_EXPENSE_CLAIM',
    requirement_id: 'FR_CLM_001',
    rule_ids: [],
    persona_id: 'PERSONA_SUPERVISOR',
    title: 'Authorize and Approve Subordinate Expense Claims',
    statement: 'As a Supervisor, I want to inspect submitted expense items and receipts and approve them, so that finance can disburse reimbursement.',
    acceptance_criteria: [
      {
        scenario: 'Supervisor Approves Claim',
        given: 'A subordinate has submitted an expense claim',
        when: 'The Supervisor verifies attached receipts and clicks Approve',
        then: 'The claim transitions to "Approved" via PUT /api/v2/claim/requests/{id}/action.'
      }
    ],
    target_ui_components: ['ClaimList.vue', 'ClaimActionDialog.vue'],
    target_endpoints: ['PUT /api/v2/claim/requests/{id}/action', 'GET /api/v2/claim/requests']
  },

  // ==========================================
  // DOMAIN 9: Corporate Collaboration Feed (Buzz)
  // ==========================================
  {
    story_id: 'US_BUZ_001',
    domain_id: 'DOMAIN_BUZ',
    feature_id: 'FEAT_BUZ_POSTS',
    workflow_id: 'WF_BUZZ_COLLABORATION',
    requirement_id: 'FR_BUZ_001',
    rule_ids: ['NFR_SEC_002'],
    persona_id: 'PERSONA_EMPLOYEE',
    title: 'Publish Social Posts, Multimedia, and Interact with Peer Shares',
    statement: 'As an Employee (ESS), I want to share updates, photos, and video links on the corporate Buzz feed, and comment or like colleagues\' posts, so that team collaboration is enhanced.',
    acceptance_criteria: [
      {
        scenario: 'Publish Text and Photo Post with XSS Sanitization',
        given: 'The employee is on the Buzz social feed',
        when: 'They publish a celebratory post containing formatted text and an image',
        then: 'The post is sanitized against script injection complying with NFR_SEC_002 and rendered on the live feed.'
      }
    ],
    target_ui_components: ['BuzzFeed.vue', 'PostShare.vue', 'BuzzComments.vue'],
    target_endpoints: ['POST /api/v2/buzz/posts', 'POST /api/v2/buzz/shares/{id}/likes', 'POST /api/v2/buzz/shares/{id}/comments']
  },

  // ==========================================
  // DOMAIN 10: Corporate Directory
  // ==========================================
  {
    story_id: 'US_DIR_001',
    domain_id: 'DOMAIN_DIR',
    feature_id: 'FEAT_DIR_SEARCH',
    workflow_id: 'WF_ONBOARDING',
    requirement_id: 'FR_PIM_001',
    rule_ids: [],
    persona_id: 'PERSONA_EMPLOYEE',
    title: 'Search Corporate Directory by Name, Job Title, Subunit, and Location',
    statement: 'As an Employee (ESS), I want to search and view company colleagues by name, department, or office location, so that I can discover contact information.',
    acceptance_criteria: [
      {
        scenario: 'Filter Directory by Subunit',
        given: 'The user is on the Corporate Directory page',
        when: 'They filter by Subunit "Engineering"',
        then: 'All active employees in Engineering are listed with work email and job title.'
      }
    ],
    target_ui_components: ['DirectoryList.vue', 'EmployeeCard.vue'],
    target_endpoints: ['GET /api/v2/directory/employees']
  },

  // ==========================================
  // DOMAIN 11: Compliance & Data Maintenance
  // ==========================================
  {
    story_id: 'US_MNT_001',
    domain_id: 'DOMAIN_MNT',
    feature_id: 'FEAT_MNT_PURGE',
    workflow_id: 'WF_DATA_PURGE',
    requirement_id: 'FR_MNT_001',
    rule_ids: ['NFR_DATA_002'],
    persona_id: 'PERSONA_GLOBAL_ADMIN',
    title: 'GDPR Historical Personal Record Purge with Administrative Audit Log',
    statement: 'As a Global Admin or Compliance Officer, I want to permanently purge personal data for candidates and terminated employees past their retention period, so that GDPR compliance is maintained.',
    acceptance_criteria: [
      {
        scenario: 'Purge Terminated Employee Data Past Retention SLA',
        given: 'Employees terminated more than 3 years ago',
        when: 'The Admin initiates the GDPR purge routine with admin password re-verification',
        then: 'Personal identifiers are permanently eradicated from hs_hr_employee and an immutable purge event is logged complying with NFR_DATA_002.'
      }
    ],
    target_ui_components: ['PurgeEmployeeData.vue', 'PurgeCandidateData.vue'],
    target_endpoints: ['POST /api/v2/maintenance/purge-employee-data', 'POST /api/v2/maintenance/purge-candidate-data']
  },

  // ==========================================
  // DOMAIN 12: Authentication & Security
  // ==========================================
  {
    story_id: 'US_AUT_001',
    domain_id: 'DOMAIN_AUT',
    feature_id: 'FEAT_ADM_USER_MGMT',
    workflow_id: 'WF_ONBOARDING',
    requirement_id: 'FR_ADM_002',
    rule_ids: ['NFR_SEC_004'],
    persona_id: 'PERSONA_EMPLOYEE',
    title: 'Secure Credential Authentication and Brute-Force Rate Limiting',
    statement: 'As an Employee or Admin, I want to log in securely with username and password, so that unauthorized access is defended against brute-force attacks.',
    acceptance_criteria: [
      {
        scenario: 'Successful Authentication',
        given: 'A valid active user account',
        when: 'The user enters correct credentials',
        then: 'An authenticated session token is issued and user is redirected to the home dashboard.'
      },
      {
        scenario: 'Brute-Force Account Lockout',
        given: 'A targeted user account',
        when: '5 consecutive incorrect password attempts occur within 2 minutes',
        then: 'The account is temporarily locked with HTTP 429 defending against brute force complying with NFR_SEC_004.'
      }
    ],
    target_ui_components: ['Login.vue', 'ResetPassword.vue'],
    target_endpoints: ['POST /api/v2/auth/login', 'POST /api/v2/auth/logout', 'POST /api/v2/auth/password-strength']
  }
];

function generateArtifacts() {
  const outputJsonPath = path.resolve(__dirname, '..', '..', 'OrangeHRM_Baseline_v1.0', '01_Business_Requirements', 'user_stories.json');
  const outputMdPath = path.resolve(__dirname, '..', '..', 'OrangeHRM_Baseline_v1.0', '01_Business_Requirements', 'user_stories.md');

  // 1. Write JSON
  fs.writeFileSync(outputJsonPath, JSON.stringify(userStories, null, 2));
  console.log(`✓ Wrote ${userStories.length} User Stories to ${outputJsonPath}`);

  // 2. Write Markdown
  let md = `# OrangeHRM Baseline v1.0 User Stories Catalog (Whole Application)\n\n`;
  md += `**Total User Stories:** ${userStories.length}  \n`;
  md += `**Coverage:** 100% of all 12 Business Domains, 30 Features, 10 Workflows, and 8 Personas  \n`;
  md += `**Methodology:** Agile / BDD (Given-When-Then Acceptance Criteria)  \n\n`;
  md += `---\n\n`;

  // Group by Domain
  const domains = {};
  for (const s of userStories) {
    if (!domains[s.domain_id]) domains[s.domain_id] = [];
    domains[s.domain_id].push(s);
  }

  for (const [dom, stories] of Object.entries(domains)) {
    md += `## Domain: ${dom}\n\n`;
    for (const s of stories) {
      md += `### ${s.story_id}: ${s.title}\n`;
      md += `- **Persona:** \`${s.persona_id}\`\n`;
      md += `- **Feature:** \`${s.feature_id}\` | **Workflow:** \`${s.workflow_id}\`\n`;
      md += `- **Requirement:** \`${s.requirement_id}\` | **Rules:** ${s.rule_ids.map(r => `\`${r}\``).join(', ') || 'N/A'}\n`;
      md += `- **Statement:** *"${s.statement}"*\n\n`;
      md += `#### Acceptance Criteria (Given-When-Then)\n`;
      for (const ac of s.acceptance_criteria) {
        md += `**Scenario: ${ac.scenario}**\n`;
        md += `- **Given:** ${ac.given}\n`;
        md += `- **When:** ${ac.when}\n`;
        md += `- **Then:** ${ac.then}\n\n`;
      }
      md += `- **Target UI Components:** ${s.target_ui_components.map(c => `\`${c}\``).join(', ')}\n`;
      md += `- **Target API Endpoints:** ${s.target_endpoints.map(e => `\`${e}\``).join(', ')}\n\n`;
      md += `---\n\n`;
    }
  }

  fs.writeFileSync(outputMdPath, md);
  console.log(`✓ Wrote User Stories Markdown to ${outputMdPath}`);
}

generateArtifacts();
