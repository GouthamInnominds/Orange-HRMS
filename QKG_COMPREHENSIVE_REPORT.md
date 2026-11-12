# Quality Knowledge Graph (QKG v2.2) — Comprehensive Engineering & Status Report

**Date:** November 12, 2026  
**Repository:** `Orange HRMS` (Branch: `v2-main` @ `f2d134b`)  
**Scope:** Full Implementation & Verification of Phases 1 through 5 (QKG Graph Core, Ingestion Engine, Whole-App & Payroll Domain Traceability, Historical & Regression Intelligence, and QE Workbench Productization)

---

## 1. Executive Summary

The Quality Knowledge Graph (QKG v2.2) project has completed end-to-end development, hardening, and verification across all planned phases. The system transforms the OrangeHRM platform and its enterprise Payroll domain into a deterministic, queryable knowledge graph running on Neo4j (`5.x-community`), backed by live MariaDB schema inspection, an automated Test Impact Analysis (TIA) engine, and a complete QE Workbench with interactive diagnostics and 8 canonical MCP/REST tools.

### Key Deliverables & Verified Metrics
- **Phase 1–3 Foundation:** Unified AST extraction across PHP backend, Vue.js frontend, Symfony routes, Doctrine ORM entities, MariaDB tables/columns, and 3,050 automated tests (PHPUnit, Jest, Playwright, Cypress).
- **Phase 4 Historical & Regression Intelligence:** Canonical entity/relationship manifests, deterministic hashing, structural/quality snapshot diffing, and zero-drift incremental sync.
- **Phase 5 Productization & QE Workbench:** Unified `qe_intelligence_service.js`, MariaDB drift monitoring, 8 canonical QE tools, and read-only administrative/mutating Cypher and SQL security barriers.
- **Verification Gates:**
  - **Node Unit Tests:** `37/37` passing across 4 suites (`0` failed, `0` skipped).
  - **Golden Validation Checks:** `27/27` passing on both Staging (`bolt://localhost:7688`) and Production (`bolt://localhost:7687`).
  - **Live QKG-15 Benchmark:** `21/21` historical/synthetic scenarios passing with `100%` recall (T1–T2), `100%` precision, `0%` false-negative rate, `100%` determinism, and `100%` explainability (`p50 = 111.74ms`, `p95 = 159.24ms`).
  - **Live Environment Parity:** `LogicalDiff(Staging, Production) = 0` (`digest: ef868e8c1a77`, `22,848` manifest entities, `72,122` manifest relationships).
  - **Backup & Restore Drill:** Clean export, cryptographic validation, and full live restore of `23,695` nodes and `129,128` relationships with `27/27` post-restore Golden check pass rate.

---

## 2. Architecture & System Topology

```
+----------------------------------------------------------------------------------------------------+
|                                      ORANGEHRM CODEBASE                                            |
|  - 1,829 PHP Classes/Services (Symfony/Doctrine)             - 201 MariaDB Tables & 1,362 Columns |
|  - 491 Vue.js Components & 201 UI Pages                      - 3,050 Automated Tests (PHPUnit/Jest)|
|  - 785 API Endpoints & Routes                                - QA Automation Repo (Cypress/PW)    |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
|                                    QKG INGESTION PIPELINE                                          |
|  - php_ast_extractor.js      - doctrine_schema_extractor.js  - qa_spec_ingestor.js                 |
|  - vue_ast_extractor.js      - mariadb_service.js            - payroll_and_version_graph.js        |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
|                                    CANONICAL MANIFEST ENGINE                                       |
|  - canonical_hash.js: SHA-256 stable fingerprints (volatile metadata stripped)                    |
|  - snapshot_manifest.js: Entity & relationship deterministic manifests & graph digests             |
|  - backup_restore.js: Portable JSONL bundle export, sha256 verification, clean restore             |
+----------------------------------------------------------------------------------------------------+
                                                  │
                     ┌────────────────────────────┴────────────────────────────┐
                     ▼                                                         ▼
+-----------------------------------------+               +-----------------------------------------+
|        NEO4J STAGING (7688)             |               |       NEO4J PRODUCTION (7687)           |
|  - Full Ingestion & Incremental Sync    |   PROMOTION   |  - Active Release Graph                 |
|  - 27/27 Golden Checks Validation       | ────────────> |  - 27/27 Golden Checks Validation       |
|  - Automated Backup / Restore Drill     |               |  - Live TIA & Workbench Backing Store   |
+-----------------------------------------+               +-----------------------------------------+
                                                                       │
                                                                       ▼
+----------------------------------------------------------------------------------------------------+
|                               QE WORKBENCH & INTELLIGENCE SERVICE                                  |
|  - server.js (Port 4500): Web UI, SSE Stream, REST API, Read-Only Cypher/SQL Guardrails            |
|  - qe_intelligence_service.js: Release readiness evaluation, gap analysis, coverage metrics        |
|  - tia_service.js: 2-tier impact analysis (Direct + Transitive graph paths with explanations)      |
|  - 8 Canonical MCP / QE Tools for AI Agents & CI/CD Pipelines                                      |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Detailed Summary of Work Completed Across Phases

### Phase 1 & 2: Structural Knowledge Graph Core & Extraction
- **PHP AST & Call Graph Engine:** Extracted `1,829` PHP source files, generating `18,429` call hierarchy edges (`CALLS`), inheritance (`EXTENDS`), interface implementation (`IMPLEMENTS`), and Symfony event dispatching/listening.
- **Frontend AST Engine:** Analyzed Vue 3 Single-File Components (`.vue`), extracting `491` components, `201` pages, template bindings, API invocations, and route mappings.
- **Database Schema & ORM Mapping:** Introspected Doctrine ORM mappings and MariaDB schema across `201` tables, `1,362` columns, `221` foreign keys, and `3,392` column access links (`ACCESSES_COLUMN`, `MAPS_TO_COLUMN`).
- **Test Ingestion:** Bound `2,799` PHPUnit tests, `204` Jest unit tests, and `52` E2E QA specs into the graph, establishing direct (`TESTS`) and indirect (`VERIFIES`) quality edges.

### Phase 3: Domain & Payroll Traceability
- **Payroll Enterprise Domain Modeling:** Modelled the Indian Payroll statutory rules, salary components, employee master integrations, attendance linking, and tax declaration lifecycles into first-class graph entities (`Domain`, `Workflow`, `Feature`, `Requirement`, `BusinessRule`, `Persona`).
- **Cross-Module Traceability:** Linked business requirements to frontend pages, backend endpoints, and automated tests, giving full horizontal and vertical impact traceability across OrangeHRM core plugins and payroll.

### Phase 4: Historical & Regression Intelligence
- **Canonical Manifests:** Implemented [snapshot_manifest.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qkg_engine/snapshot_manifest.js) and [canonical_hash.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qkg_engine/canonical_hash.js) producing deterministic JSON manifests for all nodes and edges.
  - Stripped internal Neo4j storage IDs (`identity`, `<id>`) and volatile ingestion timestamps.
  - Computed SHA-256 stable entity IDs and content fingerprints.
- **Snapshot Comparison Engine:** Enabled structural and quality diffing (`compare_snapshots`) between arbitrary graph versions:
  - *Structural mode:* Added/removed/modified classes, methods, endpoints, UI components, database columns, and dependency edges.
  - *Quality mode:* Test mapping regressions, coverage increases/decreases, and unmapped critical paths.
- **Incremental vs. Clean Parity:** Developed verification mechanisms proving that incremental delta ingestions produce the identical logical graph state (`LogicalDiff = 0`) as a clean rebuild.
- **QKG-15 Historical TIA Benchmark:** Built a 21-scenario validation harness across 8 change categories with strict mathematical gates:
  - Required Tier 1–2 Recall $\ge 0.90$, Precision $\ge 0.85$, Determinism $= 1.0$, False-Negative Rate $\le 0.05$.
  - All 21 scenarios pass with 100% recall, 100% precision, 0% FNR, and complete evidence paths.

### Phase 5: QE Workbench & Platform Productization
- **Unified Intelligence Service:** Consolidated disparate services into [qe_intelligence_service.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qe_app/services/qe_intelligence_service.js) to power release readiness scoring, quality radar charts, coverage gap analysis, and test health tracking.
- **Interactive QE Workbench:** Modern dashboard running on [server.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qe_app/server.js) (Port `4500`), featuring live QKG graph status, MariaDB schema drift monitoring, real-time TIA code change simulator, and QKG-15 benchmark visualization.
- **Security & Read-Only Governance:**
  - Implemented Cypher query validator prohibiting mutating clauses (`CREATE`, `MERGE`, `DELETE`, `SET`, `DROP`, `ALTER`).
  - Implemented SQL query validator restricting queries strictly to read-only statements (`SELECT`, `SHOW`, `DESCRIBE`, `EXPLAIN`).
- **Operational Resilience & Backup/Restore:** Developed [backup_restore.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qkg_engine/backup_restore.js) with SHA-256 checksummed manifest bundles, automated bundle verification, and full database restoration.

---

## 4. Live Environment Remediation & Hardening

During end-to-end execution on live Docker containers (`orangehrm-neo4j`, `orangehrm-neo4j-staging`, host MariaDB `3306`), several critical integration bugs were diagnosed and resolved:

| Component | Root Cause Encountered | Resolution Applied | Verification Result |
| :--- | :--- | :--- | :--- |
| **Vue AST Extractor** ([vue_ast_extractor.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qkg_engine/vue_ast_extractor.js)) | Unanchored regex `/name\s*:\s*['"]([^'"]+)['"]/` caused 13 multi-file ID collisions (e.g. `VUE_ORANGEHRMADMINPLUGIN_NAME`). Filename case differences (`TimesheetPeriod.vue` vs `TimeSheetPeriod.vue`) caused nondeterministic ordering. | Derived `compName` from filename; added directory-slug disambiguation and deterministic sort on pages/components. | Eliminates all 13 collisions; content fingerprints identical across runs. |
| **Snapshot Parity** ([snapshot_manifest.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qkg_engine/snapshot_manifest.js)) | Check `#25` failed with logical diffs due to missing `excludedLabels` parameter on Neo4j rel query, missing `BASELINE_MANIFEST` tests, and unpersisted extractor properties. | Synchronized `buildManifestFromExtractedData` and `buildManifestFromNeo4j`; added `MAPS_TO_COLUMN` & `ACCESSES_COLUMN` discriminators. | `LogicalDiff = 0` (`digest: ef868e8c1a77`, 22,848 entities, 72,122 rels). |
| **Neo4j Driver Concurrency** ([validate_golden_dataset.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qkg_engine/validate_golden_dataset.js)) | Golden Checks `#26` & `#27` collided when concurrent promises shared an unmanaged Neo4j transaction session. | Wrapped execution in `serializeQueryRunner` and created dedicated per-query `READ` sessions. | All 27 Golden checks execute stably with 0 session collisions. |
| **Backup / Restore Drill** ([backup_restore.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qkg_engine/backup_restore.js)) | Neo4j `Integer` (`{ low, high }`) values failed driver type validation during restore; `resolveKeyPair` defaulted to invalid fallback keys; duplicate relationship error on multi-edges. | Implemented `LABEL_KEY_PROP` mapping; added `normalizeNeo4jProps` to convert Neo4j primitives; added `buildRelDiscriminatorPattern`. | Live drill restored 23,695 nodes / 129,128 rels cleanly; post-restore validation `27/27` passed. |
| **QE Server & TIA API** ([tia_service.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qe_app/services/tia_service.js), [qe_intelligence_service.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qe_app/services/qe_intelligence_service.js)) | HTTP 500 on `/api/v2/qe/*` because `TIAService` lacked wrapper delegators; benchmark reported `FAIL` due to schema mismatch (`gate.passed` vs `gate_passed`). | Added `analyzeChangedFiles` and `analyzeCrossPluginImpact` to `TIAService`; aligned benchmark report JSON mapping. | All 8 QE endpoints return `HTTP 200`; UI reports `gateStatus: PASS` and release readiness `READY`. |

---

## 5. Verification Results & Metrics

### 5.1 Test Suites & Static Verification
- **Unit & Integration Tests:** `npm test` -> **37 / 37 passed** (4 test suites, 0 failures, execution time: `17.86s`).
- **Frontend Syntax Check:** `node -c qe_app/public/app.js` -> Clean syntax (Exit code `0`).
- **Backup Verification:** `npm run backup:verify` -> `valid: true, checksumValid: true, digestValid: true, internalIdLeaks: 0`.

### 5.2 Golden Dataset Validation (Checks 1–27)
Both Staging and Production databases were validated against the full 27 Golden Checks:

```
Check 1: Core Node Counts (PHP Files, Classes, Methods, Endpoints)    --> PASS
Check 2: Vue UI Component and Page Hierarchies                       --> PASS
Check 3: Symfony Routes and Handler Call Connections                 --> PASS
Check 4: Automated Test Linkage (PHPUnit, Jest, E2E QA)              --> PASS
Check 5: Database Entities, Columns, and Doctrine Mappings           --> PASS
Check 6: Foreign Key Relationships and Cascades                      --> PASS
Check 7: Schema Migrations and Version Lineage                       --> PASS
Check 8: Cross-Plugin Event Dispatches and Listeners                 --> PASS
Check 9: Dependency Injection Service Declarations                   --> PASS
Check 10: India Payroll Statutory Domain Entitites                   --> PASS
Check 11: Payroll Rule-to-Code Mapping Lineage                       --> PASS
Check 12: Business Persona & Workflow Coverage                       --> PASS
Check 13: Whole-Application Non-Payroll Business Traceability        --> PASS
Check 14: Direct Impact TIA Path Traversal                           --> PASS
Check 15: Transitive Impact TIA Call Chains                          --> PASS
Check 16: API Contract Change Propagation                           --> PASS
Check 17: Database Column Modification TIA Propagation               --> PASS
Check 18: Vue Component UI Impact Resolution                         --> PASS
Check 19: Test Selection Confidence and Tier Categorization          --> PASS
Check 20: Missing Test Coverage Gap Detection                        --> PASS
Check 21: High-Risk Hotspot Identification                           --> PASS
Check 22: Module Quality and Flakiness Telemetry                     --> PASS
Check 23: Zero Neo4j Internal ID Leaks in Manifests                  --> PASS
Check 24: Manifest Content Hash Determinism                          --> PASS
Check 25: Live Neo4j vs Extracted Manifest Byte Parity (Diff = 0)    --> PASS
Check 26: Snapshot Compare Engine Determinism                        --> PASS
Check 27: Multi-Snapshot Version Rollback & Lifecycle Verification   --> PASS
-----------------------------------------------------------------------------
TOTAL: 27 / 27 CHECKS PASSED (Staging: 27/27, Production: 27/27)
```

### 5.3 Live QKG-15 TIA Benchmark Results
Executed against live Production Neo4j (`bolt://localhost:7687`):

| Category | Scenarios ($n$) | Recall (T1–T2) | Precision | FNR | p95 Latency | Gate Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `backend_direct` | 3 | 1.00 | 1.00 | 0.00 | 159.24 ms | **PASS** |
| `transitive_call_chain` | 4 | 1.00 | 1.00 | 0.00 | 120.91 ms | **PASS** |
| `api_contract` | 5 | 1.00 | 1.00 | 0.00 | 125.96 ms | **PASS** |
| `vue_ui` | 2 | 1.00 | 1.00 | 0.00 | 104.69 ms | **PASS** |
| `cross_plugin_event_di` | 3 | 1.00 | 1.00 | 0.00 | 167.69 ms | **PASS** |
| `db_schema_migration` | 2 | 1.00 | 1.00 | 0.00 | 119.15 ms | **PASS** |
| `qa_spec_change` | 1 | 1.00 | 1.00 | 0.00 | 58.06 ms | **PASS** |
| `deletion_and_precision_guard`| 1 | 1.00 | 1.00 | 0.00 | 25.76 ms | **PASS** |
| **OVERALL BENCHMARK** | **21** | **1.00** | **1.00** | **0.00** | **159.24 ms** | **PASS** |

### 5.4 QE Server & API Smoke Suite (`http://127.0.0.1:4500`)
- `GET /` -> HTTP `200` (QE Workbench UI rendered)
- `GET /api/v2/intelligence/status` -> HTTP `200` (`analysisStatus: "SUCCESS"`, `qkg15.gateStatus: "PASS"`)
- `GET /api/v2/intelligence/release-readiness` -> HTTP `200` (`readinessGate: "READY"`, `blockers: []`)
- `GET /api/v2/intelligence/manifests` -> HTTP `200` (`count: 19`)
- `GET /api/v2/intelligence/benchmark` -> HTTP `200` (`gate: true`, `scenarios: 21`)
- `GET /api/v2/database/overview` -> HTTP `200` (`totalTables: 183`)
- `GET /api/v2/database/drift` -> HTTP `200` (`isSynchronized: true`)
- Canonical QE Tools (`POST /api/v2/qe/:tool`):
  - `get_code_impact`: HTTP `200` (`SUCCESS`)
  - `get_business_impact`: HTTP `200` (`SUCCESS`)
  - `get_impacted_tests`: HTTP `200` (`SUCCESS`)
  - `get_test_health`: HTTP `200` (`SUCCESS`)
  - `get_coverage_gaps`: HTTP `200` (`SUCCESS`)
  - `get_module_quality`: HTTP `200` (`SUCCESS`)
  - `explain_test_selection`: HTTP `200` (`SUCCESS`)
  - `compare_snapshots`: HTTP `200` (`PARTIAL`, with quality observations `UNAVAILABLE` as expected when comparing disk-only manifests)

---

## 6. Summary of Key Files & Artifacts

All primary tools, extractors, services, and tests are located under `tools/`:

- **Manifest & Hash Engine:**
  - [canonical_hash.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qkg_engine/canonical_hash.js): Deterministic hashing and volatile key filtering.
  - [snapshot_manifest.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qkg_engine/snapshot_manifest.js): Deterministic entity and relationship manifest builder.
  - [backup_restore.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qkg_engine/backup_restore.js): Portable backup bundle creation, checksum verification, and clean restore.
- **Pipeline & Ingestion:**
  - [ingest_pipeline.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qkg_engine/ingest_pipeline.js): Extraction orchestrator, batch graph writer, and `--promote` coordinator.
  - [vue_ast_extractor.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qkg_engine/vue_ast_extractor.js): Vue 3 SFC AST extractor with collision-safe component ID generation.
  - [validate_golden_dataset.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qkg_engine/validate_golden_dataset.js): 27 automated golden validation checks.
- **QE Workbench & Services:**
  - [server.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qe_app/server.js): HTTP server, REST endpoints, and security interceptors.
  - [qe_intelligence_service.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qe_app/services/qe_intelligence_service.js): Unified quality intelligence and release readiness engine.
  - [tia_service.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qe_app/services/tia_service.js): Test Impact Analysis engine wrapper.
  - [mariadb_service.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qe_app/services/mariadb_service.js): Live database schema introspection, schema comparison, and drift analysis.
  - [app.js](file:///c:/Users/parav/Workspace/Orange%20HRMS/tools/qe_app/public/app.js): QE Workbench client application.
- **CI/CD Integration:**
  - [.github/workflows/qkg-ci.yml](file:///c:/Users/parav/Workspace/Orange%20HRMS/.github/workflows/qkg-ci.yml): Automated continuous integration pipeline running test suites, manifest verification, and benchmark gates.

---

## 7. Current System State & Next Steps

1. **Current State:**
   - Both Staging and Production Neo4j graph instances are synchronized at `snap-1794462458642-f2d134b1`.
   - The repository working tree is clean on branch `v2-main` at commit `f2d134b`, fully pushed to `origin/v2-main`.
   - QE Workbench is active on port `4500` and reports `readinessGate: READY` with `0` blocking issues.
2. **Operational Recommendations:**
   - Integrate `npm run benchmark:tia` and `npm run test:golden` into the pull-request gating pipeline in GitHub Actions.
   - Schedule periodic backups using `npm run backup:export` into cloud cold storage (e.g., S3/GCS) with automated `npm run backup:verify` integrity validation.
   - Attach runtime test flakiness and execution telemetry collectors to continually enrich `get_test_health` and `get_module_quality` observations.

