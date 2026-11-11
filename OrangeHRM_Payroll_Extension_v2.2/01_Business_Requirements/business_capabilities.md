# OrangeHRM v2.2 India Payroll Extension — Business Capabilities Catalogue

## 1.0 Extension Capability Decomposition (`CAP_PAY`)

```
[ OrangeHRM v2.2 Payroll Extension (`orangehrmPayrollPlugin`) ]
 └── 9.0 India Payroll Processing & Statutory Disbursement (`CAP_PAY`)
      ├── 9.1 Jurisdiction, FY 2026-27 Tax Slab & Statutory Rule Governance (`FEAT_PAY_CONFIG`)
      ├── 9.2 Monthly INR Pay Period & Overlap Calendar Management (`FEAT_PAY_PERIOD`)
      ├── 9.3 Employee Statutory Profile & PIM Snapshot Isolation (`FEAT_PAY_SNAPSHOT`)
      ├── 9.4 Cross-Module LWP, Overtime & Claim Intake Engine (`FEAT_PAY_CROSS_MODULE`)
      ├── 9.5 India Statutory Calculation Engine (EPF, ESIC, PT, TDS u/s 115BAC) (`FEAT_PAY_ENGINE`)
      ├── 9.6 Audited Override Adjustments & Exception Triage (`FEAT_PAY_ADJUSTMENT`)
      ├── 9.7 Maker-Checker Workflow, Locking & Reversal (`FEAT_PAY_WORKFLOW`)
      ├── 9.8 NEFT/IMPS Bank Disbursement & UTR Claim Settlement (`FEAT_PAY_PAYMENT`)
      └── 9.9 Published INR Payslip Archive & ESS Self-Service (`FEAT_PAY_SLIPS`)
```

## 2.0 Mapping Payroll Capabilities to Technical Components

| Capability ID | Capability Name | Primary Service / Adapter | Primary Route Scope |
| :--- | :--- | :--- | :--- |
| `CAP_PAY_CONFIG` | India Tax, Statutory & LWP Policy Config | `PayrollConfigService` | `/api/v2/payroll/{config,tax-brackets,statutory-rules,leave-policies}` |
| `CAP_PAY_PERIOD` | India Monthly INR Pay Periods | `PayrollApplicationService`, `PayrollPeriodDao` | `/api/v2/payroll/pay-periods*` |
| `CAP_PAY_SNAPSHOT` | PIM Snapshot & Statutory Profile | `PayrollEmployeeSnapshotService` | `/api/v2/payroll/employees/{empNumber}/statutory-profile` |
| `CAP_PAY_CROSS` | Leave LWP, Time OT & Claim Intake | `LeavePayrollAdapter`, `TimeAttendancePayrollAdapter`, `OvertimePolicyService`, `ClaimSettlementAdapter` | Executed by `PayrollCalculationService` |
| `CAP_PAY_ENGINE` | EPF, ESIC, PT, TDS & Sec 87A/288B Engine | `IndianStatutoryCalculator`, `PayrollCalculationService` | `/api/v2/payroll/runs/{runId}/calculate` |
| `CAP_PAY_WF` | Maker-Checker SoD & State Machine | `PayrollWorkflowService` | `/api/v2/payroll/runs/{runId}/{submit,approve,reject,lock,reverse}` |
| `CAP_PAY_PAY` | NEFT/IMPS Batch Export & UTR Settlement | `PayrollPaymentService` | `/api/v2/payroll/payment-batches*` |
| `CAP_PAY_SLIP` | HTML Payslip Publication & ESS Download | `PayrollSlipService`, `SalarySlipDownloadController` | `/api/v2/payroll/my-salary-slips`, `/payroll/slips/{id}/download` |

