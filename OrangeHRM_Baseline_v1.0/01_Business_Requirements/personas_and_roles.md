# OrangeHRM v1.0 User Personas & Authorization Taxonomy

## 1.0 Enterprise User Personas

### 1.1 Global System Administrator (`Admin`)
- **Profile:** IT or HR Systems Operations Specialist responsible for company-wide configuration, access governance, organizational hierarchies, and system maintenance.
- **Key Responsibilities:**
  - Define organizational units, job titles, pay grades, and employment statuses.
  - Manage user accounts, role definitions, and credentials.
  - Configure localization, corporate branding themes, and email subscriptions.
  - Execute GDPR data privacy purges and inspect system audit logs.

### 1.2 HR Operations Manager (`HR_Manager`)
- **Profile:** People Operations Specialist responsible for day-to-day employee lifecycle operations and talent management.
- **Key Responsibilities:**
  - Onboard new employees and maintain complete personnel records (immigration, job, salary, emergency contacts).
  - Define leave entitlement policies, assign leave balances, and manage company holidays.
  - Create recruitment vacancies, manage candidate pipelines, and schedule interviews.
  - Oversee annual performance review cycles and manage defined reporting structures.

### 1.3 People Manager / Team Lead (`Supervisor`)
- **Profile:** Operational team leader with direct or indirect subordinates.
- **Key Responsibilities:**
  - Review and approve/reject leave applications submitted by subordinates.
  - Review, monitor, and sign off on weekly employee timesheets.
  - Conduct performance appraisal ratings and record tracker logs for team members.
  - Review and authorize travel expense claims submitted by subordinates.

### 1.4 General Employee (`ESS - Employee Self-Service`)
- **Profile:** Individual contributor accessing the system for personal HR services.
- **Key Responsibilities:**
  - Maintain personal profile, contact information, and emergency contacts.
  - Punch in/out and view personal attendance sheets.
  - Submit leave applications and view real-time leave entitlement balances.
  - Enter project timesheet hours and submit for supervisor approval.
  - Submit expense claims with receipt attachments.
  - Collaborate with colleagues via the corporate Buzz social feed.

### 1.5 External Candidate / Job Applicant (`Applicant`)
- **Profile:** Prospective employee applying for open company vacancies.
- **Key Responsibilities:**
  - View published job listings.
  - Submit job applications with resume attachments and personal contact details.

---

## 2.0 Role-Based Access Control (RBAC) High-Level Matrix

| Functional Capability | Global Admin | HR Manager | Supervisor | Employee (ESS) |
| :--- | :---: | :---: | :---: | :---: |
| **System Configuration & Branding** | Full Control | Read Only | No Access | No Access |
| **User Account & Role Management** | Full Control | No Access | No Access | No Access |
| **Organization Structure & Job Architecture** | Full Control | Full Control | Read Only | Read Only |
| **Employee Master Data (All Staff)** | Full Control | Full Control | Subordinates Only | Self Only |
| **Salary & Compensation Records** | Full Control | Full Control | No Access (Hidden) | Self (View Only) |
| **Leave Entitlement Allocation** | Full Control | Full Control | No Access | No Access |
| **Leave Approval / Rejection** | Full Control | Full Control | Subordinates Only | No Access |
| **Timesheet Approval** | Full Control | Full Control | Subordinates Only | No Access |
| **Recruitment Vacancies & Hiring** | Full Control | Full Control | Assigned Vacancy | No Access |
| **Performance Appraisal Rating** | Full Control | Full Control | Subordinates Only | Self Evaluation |
| **Expense Claim Approval** | Full Control | Full Control | Subordinates Only | No Access |
| **Buzz Social Feed & Interactions** | Full Access | Full Access | Full Access | Full Access |

