# OrangeHRM v1.0 Business Capabilities Catalogue

## 1.0 Enterprise Capability Decomposition

```
[ OrangeHRM Enterprise Platform ]
 ├── 1.0 Workforce & Personal Information Management (PIM)
 │    ├── 1.1 Employee Profile & Identity Management
 │    ├── 1.2 Employment & Job History Tracking
 │    ├── 1.3 Compensation & Salary Component Configuration
 │    ├── 1.4 Reporting Hierarchies (Supervisor / Subordinate)
 │    └── 1.5 Compliance, Immigration & Qualifications Tracking
 │
 ├── 2.0 Organization & Enterprise Governance (Admin)
 │    ├── 2.1 Enterprise Structure & Subunits
 │    ├── 2.2 Job Titles, Specifications & Pay Grades
 │    ├── 2.3 User Account Security & Role Provisioning
 │    └── 2.4 Localization, Mail Configuration & Corporate Branding
 │
 ├── 3.0 Leave & Absence Management
 │    ├── 3.1 Policy, Leave Types & Accrual Rules
 │    ├── 3.2 Entitlement Allocation & Adjustment
 │    ├── 3.3 Application, Approval & Cancellation Lifecycle
 │    └── 3.4 Working Week & Statutory Holiday Governance
 │
 ├── 4.0 Time & Attendance Tracking
 │    ├── 4.1 Daily Attendance & Punch In/Out Recording
 │    ├── 4.2 Project & Customer Definition
 │    ├── 4.3 Weekly Timesheet Activity Logging & Submission
 │    └── 4.4 Supervisory Sign-off & Timesheet Audit
 │
 ├── 5.0 Talent Acquisition & Recruitment (ATS)
 │    ├── 5.1 Vacancy Requisition & Publishing
 │    ├── 5.2 Candidate Ingestion, Resume Attachment & Parsing
 │    ├── 5.3 Interview Scheduling & Multi-Rater Evaluations
 │    └── 5.4 Candidate Status Advancement & Job Offer
 │
 ├── 6.0 Performance & Talent Development
 │    ├── 6.1 Key Performance Indicator (KPI) Architecture
 │    ├── 6.2 Continuous Performance Trackers & Supervisor Logs
 │    └── 6.3 Structured Appraisal Reviews & Scoring
 │
 ├── 7.0 Travel & Expense Claims
 │    ├── 7.1 Claim Event & Expense Category Setup
 │    ├── 7.2 Expense Filing with Receipt Verification
 │    └── 7.3 Multi-Level Approval & Settlement Tracking
 │
 └── 8.0 Corporate Collaboration & Employee Engagement (Buzz)
      ├── 8.1 Public & Team Social Posts
      ├── 8.2 Multimedia & Document Sharing
      └── 8.3 Peer Comments, Likes & Workplace Celebrations
```

## 2.0 Mapping Business Capabilities to Technical Plugins

| Business Capability ID | Capability Name | Technical Plugin Domain | Primary Entry Point |
| :--- | :--- | :--- | :--- |
| **`CAP_PIM`** | Personal Information Management | `orangehrmPimPlugin` | `/api/v2/pim/*` |
| **`CAP_ADM`** | System & Organization Administration | `orangehrmAdminPlugin` | `/api/v2/admin/*` |
| **`CAP_LEV`** | Leave & Absence Management | `orangehrmLeavePlugin` | `/api/v2/leave/*` |
| **`CAP_TIM`** | Time & Timesheets | `orangehrmTimePlugin` | `/api/v2/time/*` |
| **`CAP_ATT`** | Attendance & Punches | `orangehrmAttendancePlugin` | `/api/v2/attendance/*` |
| **`CAP_REC`** | Talent Acquisition / Recruitment | `orangehrmRecruitmentPlugin` | `/api/v2/recruitment/*` |
| **`CAP_PRF`** | Performance & Appraisal Trackers | `orangehrmPerformancePlugin` | `/api/v2/performance/*` |
| **`CAP_CLM`** | Travel & Expense Claims | `orangehrmClaimPlugin` | `/api/v2/claim/*` |
| **`CAP_BUZ`** | Corporate Collaboration Feed | `orangehrmBuzzPlugin` | `/api/v2/buzz/*` |
| **`CAP_DIR`** | Corporate Directory | `orangehrmCorporateDirectoryPlugin` | `/api/v2/directory/*` |
| **`CAP_MNT`** | Privacy & Data Purge Maintenance | `orangehrmMaintenancePlugin` | `/api/v2/maintenance/*` |
| **`CAP_AUT`** | Authentication & Identity Provisioning | `Core / OAuth / LDAP / OpenID` | `/oauth/*`, `/auth/*` |

