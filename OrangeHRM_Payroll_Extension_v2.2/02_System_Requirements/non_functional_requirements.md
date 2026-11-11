# OrangeHRM v2.2 India Payroll Extension — Non-Functional Requirements (NFR)

## 1.0 Security & Financial Authorization (`NFR_PAY_SEC`)
- **`NFR_PAY_SEC_001` (BOLA / IDOR Zero-Leakage):** Cross-employee access to `/api/v2/payroll/employees/{empNumber}/payslips`, `/statutory-profile`, `/slips/{id}`, or `/payroll/slips/{id}/download` by any unauthorized ESS caller returns `HTTP 403` regardless of reporting hierarchy.
- **`NFR_PAY_SEC_002` (Maker-Checker Separation of Duties):** Self-approval or self-locking by the creator/submitter of a run returns `HTTP 403` when `require_maker_checker_approval = 1`.
- **`NFR_PAY_SEC_003` (Bank PII Masking & XSS Output Escaping):** Calculation records and preview UI mask raw bank accounts (`XXXXXX1234`); HTML payslips HTML-escape all dynamic strings (`htmlspecialchars(..., ENT_QUOTES, 'UTF-8')`).

## 2.0 Financial Precision & Determinism (`NFR_PAY_PREC`)
- **`NFR_PAY_PREC_001` (Fixed-Point INR Math):** Monetary arithmetic uses `OrangeHRM\Payroll\Util\Money` with integer paise/bcmath string math, explicit `HALF_UP`, ESIC rupee `CEIL`, and Sec 288B nearest-₹10 rounding — eliminating IEEE-754 floating-point drift and rejecting currency mismatches via `PayrollException`.

## 3.0 Auditability & State Integrity (`NFR_PAY_AUDIT`)
- **`NFR_PAY_AUDIT_001` (Append-Only Lifecycle Audit & Transactional Locking):** Workflow state changes, adjustments, batch exports, and UTR reconciliations emit structured rows into `ohrm_payroll_audit_event` with `before_json`, `after_json`, and actor ID; duplicate/concurrent claim settlement is prevented at DB level via `UNIQUE uq_active_claim_lock`.

## 4.0 Native OXD UI Theme Parity (`NFR_PAY_UX`)
- **`NFR_PAY_UX_001` (`@ohrm/oxd` Design Parity & Clean Browser Telemetry):** All 8 Payroll Vue screens use OrangeHRM's core OXD CSS custom properties, card tables, status badges, orange navigation alignment (wallet+`₹` icon between `Claim` and `Buzz`), PIM `edit-employee-layout`, and emit `0` console errors, `0` uncaught page errors, and `0` HTTP `>= 400` asset/API errors during normal operation.

