# OrangeHRM v1.0 Enterprise Test Strategy & Quality Governance

## 1.0 Executive Summary & Purpose
This document establishes the comprehensive Quality Engineering (QE) Strategy for OrangeHRM Version 1.0 Baseline (`commit 4b88be22f8ae75561e2ff14a2b5fc31feb36d214`). It serves as the formal specification for all test execution tiers, quality attributes, automation standards, and regression policies.

## 2.0 Multi-Tier Testing Pyramid Architecture
To ensure rigorous validation from low-level algorithms up to complete cross-module user journeys, the test suite is partitioned into four execution tiers complemented by six cross-cutting quality dimensions:

```
                          ▲
                         / \     Tier 4: E2E User Journeys (60 Workflows)
                        /   \    Cross-module journeys: Hire-to-Retire, Leave, Claims
                       /─────\
                      /       \    Tier 3: Feature / Functional Tests (1,559 Tests)
                     /         \   Form inputs, business rules, validations & boundaries
                    /───────────\
                   /             \   Tier 2: API & Contract Tests (1,678 Tests)
                  /               \  All 501 REST endpoints: Status codes, schemas, auth
                 /─────────────────\
                /                   \  Tier 1: Unit & Component Class Tests (2,781 Tests)
               /                     \ PHPUnit test methods, DAOs, DTOs, and Services
              /───────────────────────\
   ═══════════════════════════════════════════════════════════════════════════════
   CROSS-CUTTING QUALITY DIMENSIONS (915 Specialized Tests):
   [Security & OWASP: 140] [State Machines: 120] [Data Integrity: 90]
   [File Uploads: 70] [Adapters/Resilience: 60] [I18N/A11y: 50] [Performance: 35]
   ═══════════════════════════════════════════════════════════════════════════════
```

## 3.0 Test Inventory Summary

| Tier / Suite | File Artifact | Test Count | Primary Objective |
| :--- | :--- | :--- | :--- |
| **Unit Tests** | `unit_tests.json` | **2,781** | Verify discrete PHP classes, methods, and logic in isolation. |
| **API Contract Tests** | `api_tests.json` | **1,678** | Validate HTTP status codes, envelope schemas, and auth boundaries across all 501 routes. |
| **Feature / Functional** | `functional_tests.json` | **1,559** | Validate functional business rules, inputs, and error feedback across all plugins. |
| **UI Components (Vue)** | `ui_component_tests.json` | **250** | Assert reactive state, modal confirmation, and client-side form validation. |
| **Workflow State Machines** | `workflow_state_tests.json` | **120** | Prevent illegal status transitions in Leave, Timesheet, Recruitment, and Claims. |
| **Security & OWASP** | `security_tests.json` | **140** | Protect against BOLA/IDOR, Stored/Reflected XSS, SQLi, CSRF, and Brute-force. |
| **Data Integrity** | `data_integrity_tests.json` | **90** | Verify foreign key cascade locks, soft-delete uniqueness, and purge safety. |
| **File Upload & Storage** | `file_upload_tests.json` | **70** | Validate file size boundaries, MIME sniffing, and polyglot attack prevention. |
| **Integration Adapters** | `integration_adapter_tests.json` | **60** | Assert system resilience on external SMTP, LDAP, and OAuth gateway timeouts. |
| **E2E User Journeys** | `e2e_tests.json` | **60** | End-to-end multi-role business journeys across UI and API. |
| **I18N & Accessibility** | `i18n_accessibility_tests.json` | **50** | Verify non-ASCII UTF-8 strings, RTL rendering, and WCAG 2.1 AA keyboard access. |
| **Performance Latency** | `performance_tests.json` | **35** | Benchmark p95 latency $\le 450\text{ ms}$ under concurrent virtual user load. |
| **GRAND TOTAL** | | **6,893** | **Complete Quality Engineering Ground Truth** |

## 4.0 Test Metadata Standard & Knowledge Graph Mapping
Every test case in the JSON test catalog adheres to a standardized schema designed for direct ingestion into the Neo4j Knowledge Graph:

```json
{
  "testcase_id": "Unique Identifier (e.g., TC_API_00042, TC_PIM_0012)",
  "requirement_ids": ["Array of linked ISO/IEC/IEEE 29148 Requirement IDs"],
  "feature_id": "Linked Business Feature ID",
  "test_level": "Unit | Integration/API | Component/Feature | E2E | Non-Functional",
  "test_type": ["Functional", "Negative", "Boundary", "Security", "Contract"],
  "quality_attributes": ["Security", "DataIntegrity", "Performance", "Usability"],
  "priority": "Critical | High | Medium | Low",
  "target_interface": {
    "endpoint": "HTTP_METHOD /route/path",
    "handler": "FQCN::method"
  },
  "preconditions": ["Prerequisite system state and authenticated role"],
  "test_steps": ["Step-by-step reproducible action sequence"],
  "expected_results": ["Verifiable outcomes, HTTP statuses, and state changes"],
  "automation_status": "Automated",
  "execution_status": "Ready",
  "source": {
    "repository": "orangehrm",
    "baseline_id": "ORANGEHRM_BASELINE_v1.0",
    "commit_sha": "4b88be22f8ae75561e2ff14a2b5fc31feb36d214"
  }
}
```

## 5.0 Regression Policy & Quality Gate
1. **Pull Request Quality Gate:** Any PR touching a PHP class or Vue component triggers the AST Impact Analyzer.
2. **Selective Regression:** Only test cases with an edge `(:TestCase)-[:TESTS|COVERS*1..3]->(:Method {name: $changedMethod})` are executed, reducing regression execution time by over 85%.
3. **Zero Critical Vulnerabilities:** Security tests (`security_tests.json`) and data integrity tests (`data_integrity_tests.json`) must pass with 100% success rate on every release candidate.

