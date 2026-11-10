# OrangeHRM v1.0 Data Requirements, Retention & Governance

## 1.0 Data Governance & Classification
Workforce data is classified based on sensitivity:
1. **Public:** Corporate Directory name, work email, subunit, job title.
2. **Confidential:** Personal phone, home address, emergency contacts, leave balances, performance reviews.
3. **Restricted / PII:** Date of birth, SSN/PAN/National ID, salary records, bank account numbers, immigration passport attachments.

---

## 2.0 Data Requirements Specifications

### 2.1 Soft Deletion & Audit Retention (`DATA_REQ_001`)
- Master entities (Employees, Job Titles, Users) must utilize soft-deletion flags (`deleted = 1`) rather than physical record purging to preserve referential historical integrity.
- Historical leave, attendance, and timesheet records linked to a terminated employee must remain queryable for compliance reporting.

### 2.2 PII Protection & Encryption (`DATA_REQ_002`)
- Passwords must be hashed using strong one-way cryptographic algorithms (`BCrypt` / Argon2) with salt.
- Plaintext passwords must never appear in application logs or database rows.

### 2.3 File Storage & Binary Attachments (`DATA_REQ_003`)
- Binary attachments (resumes, job specifications, profile photos, claim receipts) may be stored in database BLOB columns or dedicated secure filesystem directories outside the webroot.
- File filenames must be sanitized to eliminate directory traversal sequences (`../`).

