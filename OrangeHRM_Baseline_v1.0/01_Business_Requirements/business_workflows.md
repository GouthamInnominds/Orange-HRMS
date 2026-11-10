# OrangeHRM v1.0 Business Workflows & State Machines

## 1.0 End-to-End Enterprise Business Workflows

### 1.1 Workflow 1: Employee Onboarding to Operational Readiness
```mermaid
sequenceDiagram
    autonumber
    actor HR as HR Manager
    participant PIM as PIM System
    participant Admin as User Management
    actor Emp as New Employee

    HR->>PIM: 1. Create Employee Record (Name, Emp Number, Location)
    PIM-->>HR: Employee ID Generated
    HR->>Admin: 2. Create User Login Account (Username, Role=ESS)
    HR->>PIM: 3. Assign Job Title, Department, & Employment Status
    HR->>PIM: 4. Assign Direct Supervisor (Reporting Hierarchy)
    HR->>PIM: 5. Configure Salary Component & Pay Grade
    HR->>Emp: 6. Dispatch System Welcome Credentials
    Emp->>PIM: 7. Log in, complete Contact Details & Emergency Contacts
```

---

### 1.2 Workflow 2: Leave Application, Approval & Balance Reconciliation
```mermaid
stateDiagram-v2
    [*] --> SUBMITTED : Employee submits leave application
    SUBMITTED --> CANCELLED : Employee cancels prior to review
    SUBMITTED --> APPROVED : Supervisor approves
    SUBMITTED --> REJECTED : Supervisor rejects
    APPROVED --> CANCELLED : Employee requests cancellation
    APPROVED --> TAKEN : Leave period elapses
    REJECTED --> [*]
    CANCELLED --> [*]
    TAKEN --> [*]
```

#### State Transition Governance Rules:
- Transition from `REJECTED` directly to `APPROVED` without a new application is prohibited.
- Transition from `TAKEN` to `CANCELLED` is prohibited.
- Leave balance is locked/deducted upon `SUBMITTED`; if `REJECTED` or `CANCELLED`, balance is automatically credited back.

---

### 1.3 Workflow 3: Weekly Timesheet Lifecycle & Activity Audit
```mermaid
stateDiagram-v2
    [*] --> NOT_SUBMITTED : Timesheet period starts
    NOT_SUBMITTED --> SUBMITTED : Employee enters hours & submits
    SUBMITTED --> APPROVED : Supervisor reviews & approves
    SUBMITTED --> REJECTED : Supervisor finds discrepancy
    REJECTED --> NOT_SUBMITTED : Returned to employee for corrections
    APPROVED --> [*] : Hours locked for reporting
```

#### State Transition Governance Rules:
- Approved timesheets cannot be edited by the employee.
- Timesheet hours cannot exceed 24 hours per day per employee.
- Project hours must be tied to an active, assigned customer project and activity.

---

### 1.4 Workflow 4: Candidate Recruitment Pipeline & Hiring Journey
```mermaid
stateDiagram-v2
    [*] --> APPLICATION_INITIATED : Candidate submits resume
    APPLICATION_INITIATED --> SHORTLISTED : Recruiter reviews qualification
    APPLICATION_INITIATED --> REJECTED : Fails initial screening
    SHORTLISTED --> INTERVIEW_SCHEDULED : Interview date & interviewers set
    INTERVIEW_SCHEDULED --> INTERVIEW_PASSED : Panel logs favorable rating
    INTERVIEW_SCHEDULED --> INTERVIEW_FAILED : Panel logs unfavorable rating
    INTERVIEW_PASSED --> JOB_OFFERED : HR extends offer
    JOB_OFFERED --> HIRED : Candidate accepts; record converted to Employee
    JOB_OFFERED --> DECLINED : Candidate declines offer
    INTERVIEW_FAILED --> REJECTED
    DECLINED --> [*]
    REJECTED --> [*]
    HIRED --> [*]
```

---

### 1.5 Workflow 5: Travel & Expense Claim Settlement
```mermaid
stateDiagram-v2
    [*] --> INITIATED : Employee creates claim event
    INITIATED --> EXPENSES_LOGGED : Adds line items with receipt attachments
    EXPENSES_LOGGED --> SUBMITTED : Submits claim package
    SUBMITTED --> APPROVED : Supervisor authorizes expenses
    SUBMITTED --> REJECTED : Supervisor disputes line item
    SUBMITTED --> CANCELLED : Employee withdraws claim
    APPROVED --> PAID : Accounts processes reimbursement
    REJECTED --> [*]
    CANCELLED --> [*]
    PAID --> [*]
```

