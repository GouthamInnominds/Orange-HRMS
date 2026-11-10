# OrangeHRM v1.0 Measurable Non-Functional Requirements (NFR)

## 1.0 Non-Functional Quality Framework
In accordance with ISO/IEC 25010 and the Senior Architect review, every Non-Functional Requirement (NFR) is defined with concrete, measurable metrics, quantifiable thresholds, and empirical verification methods.

---

## 2.0 Security & Vulnerability Defense (NFR-SEC)

### `NFR_SEC_001`: Broken Object Level Authorization (BOLA / IDOR) Defense
- **Requirement:** The system shall strictly prevent users from reading, updating, or deleting resources belonging to other employees by directly manipulating object identifiers (e.g., `empNumber`, `claimId`, `leaveId`) in REST API endpoints.
- **Metric / SLA:** $0\%$ unauthorized access rate across all CRUD endpoints.
- **Verification Criteria:** When an authenticated ESS user sends `GET /api/v2/pim/employees/{empNumber}/salary` for another employee, the system must return `HTTP 403 Forbidden` and log a security audit event.

### `NFR_SEC_002`: Cross-Site Scripting (XSS) Sanitization
- **Requirement:** All user inputs rendered in the web application (especially rich text notes, Buzz posts, job descriptions, and custom fields) shall be escaped or sanitized against HTML/JavaScript injection.
- **Metric / SLA:** Zero execution of injected `<script>` or `<img onerror=...>` payloads.
- **Verification Criteria:** Submitting malicious strings like `<script>alert('XSS')</script>` in a Buzz post or employee note must result in sanitized entity-encoded text `&lt;script&gt;` when rendered in the DOM.

### `NFR_SEC_003`: SQL Injection (SQLi) Prevention
- **Requirement:** All database queries executed by the application backend must utilize parameterized statements or Doctrine ORM Query Builder.
- **Metric / SLA:** Zero raw SQL concatenation with user-supplied parameters.
- **Verification Criteria:** Executing search queries with SQL payloads (`' OR 1=1 --`) in employee search or filter params must execute as literal search terms and never alter query logic or leak records.

### `NFR_SEC_004`: Brute-Force Authentication Defense
- **Requirement:** The system shall implement authentication rate limiting and temporary account lockout to prevent automated password guessing.
- **Metric / SLA:** Account lockout triggered after 5 consecutive failed login attempts within 10 minutes.
- **Verification Criteria:** Upon the 6th failed attempt, the account is locked for a minimum duration of 15 minutes, returning an informative security advisory without leaking whether the username exists.

---

## 3.0 Performance, Latency & Scalability (NFR-PERF)

### `NFR_PERF_001`: API Response Latency Under Load
- **Requirement:** All core search, retrieval, and status-check REST API endpoints shall respond within strict latency percentiles under nominal enterprise concurrency.
- **Metric / SLA:**
  - $p95$ response latency $\le 450\text{ ms}$.
  - $p99$ response latency $\le 850\text{ ms}$.
  - Error rate $< 0.01\%$.
- **Verification Criteria:** Measured using an automated k6 load test simulating 50 concurrent virtual users executing search queries against a dataset of 10,000 employees.

### `NFR_PERF_002`: Bulk Data Import Throughput
- **Requirement:** The CSV employee data import engine must process bulk personnel records efficiently without web server request timeout.
- **Metric / SLA:** Throughput of $\ge 50$ employee records per second with full validation checks.
- **Verification Criteria:** Uploading a CSV batch of 1,000 employees must complete within 20 seconds.

---

## 4.0 Reliability & Fault Tolerance (NFR-REL)

### `NFR_REL_001`: External Notification Service Resilience
- **Requirement:** A temporary outage or socket timeout of an external SMTP mail server or LDAP directory must not cause unhandled fatal exceptions or break core user transaction commits.
- **Metric / SLA:** $100\%$ completion of core database transactions regardless of external notification status.
- **Verification Criteria:** When leave is submitted while SMTP is unreachable, the leave application is persisted successfully, an error is recorded in the mail spool log, and the user receives a successful confirmation message.

### `NFR_REL_002`: Database Transaction Atomicity
- **Requirement:** Multi-step transactional workflows (e.g., employee creation involving user account provisioning, salary record insertion, and job assignment) must execute within a strict database transaction.
- **Metric / SLA:** $0\%$ orphaned or partially committed records on failure.
- **Verification Criteria:** If user account creation fails during employee onboarding, the entire transaction is rolled back, leaving no orphaned rows in `ohrm_employee`.

---

## 5.0 Data Integrity & Privacy Compliance (NFR-DATA / NFR-COMP)

### `NFR_DATA_001`: Referential Integrity & Cascade Deletion Protection
- **Requirement:** The system shall prevent hard-deletion of organizational reference entities (such as Job Titles, Pay Grades, and Locations) if active employee profiles reference them.
- **Metric / SLA:** $0\%$ foreign key constraint violations or orphaned child records.
- **Verification Criteria:** Attempting to delete a Job Title currently assigned to employees returns an informative validation error blocking deletion.

### `NFR_DATA_002`: GDPR & Personal Data Purge
- **Requirement:** The Maintenance module shall allow compliance administrators to completely purge personal records and CV attachments of candidates or terminated employees after defined data retention periods.
- **Metric / SLA:** Complete sanitization or physical deletion of candidate CVs and personal identifiers from all database tables and file storage.
- **Verification Criteria:** Post-purge verification query on employee ID confirms zero matching personal records in `ohrm_emp_picture`, `ohrm_emp_attachment`, and `ohrm_emp_passport`.

