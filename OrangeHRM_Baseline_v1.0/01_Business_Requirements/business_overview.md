# OrangeHRM v1.0 Business Requirements Document (BRD)
## 1.0 Business Overview & Scope

### 1.1 Executive Summary
OrangeHRM is an enterprise-grade Human Resource Management System (HRMS) designed to centralize and automate the complete employee lifecycle. Version 1.0 Baseline establishes the verified, evidence-backed capabilities of the open-source platform, serving as the foundational ground truth for our Code-to-Test Quality Knowledge Graph.

### 1.2 Enterprise Strategic Objectives
- **Centralized Workforce Record-Keeping:** Provide an authoritative single source of truth for all employee master data, organizational structures, and job architectures.
- **Self-Service Empowerment:** Enable employees (ESS) and supervisors to process leaves, record attendance, submit timesheets, and file expense claims without administrative friction.
- **Compliance & Auditability:** Ensure all workforce actions, employment status transitions, and data privacy operations adhere to legal standards with immutable audit histories.
- **Process Standardization:** Digitize structured human resource workflows including candidate recruitment pipelines, annual performance appraisal cycles, and multi-tier approval chains.

### 1.3 Out-of-Scope Capabilities (v1.0 Baseline)
To ensure absolute accuracy between requirements and code:
- **Direct Payroll Disbursement Engine:** While salary structures, pay grades, and tax exemption categories are managed in PIM/Admin, automated net salary computation, tax filing, and direct banking disbursements are out of scope for the open-source baseline.
- **Hardware Biometric Capture:** Physical biometric scanning is handled via external devices; the core system ingests and processes punch records via API/database sync.
- **Third-Party Background Check Verifications:** Background checks during recruitment are manual workflows; external automated screening APIs are not integrated in baseline.

