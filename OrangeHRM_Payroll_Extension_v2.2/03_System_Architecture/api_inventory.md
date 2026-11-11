# OrangeHRM v2.2 India Payroll Extension — API & Route Inventory

> Extracted verbatim from `orange_hrm/src/plugins/orangehrmPayrollPlugin/config/routes.yaml`.
> Total Registered Routes: **38** (**28 REST V2 API routes** across **22 API classes** + **10 Web Controller routes** across **10 Controllers**).

## 1.0 REST V2 API Endpoints (`28 Routes`)

| Route Name | HTTP Methods | Path | API Handler |
| :--- | :--- | :--- | :--- |
| `apiv2_payroll_pay_periods` | `GET, POST, DELETE` | `/api/v2/payroll/pay-periods` | `OrangeHRM\Payroll\Api\PayPeriodAPI` |
| `apiv2_payroll_pay_period` | `GET, PUT` | `/api/v2/payroll/pay-periods/{id}` | `OrangeHRM\Payroll\Api\PayPeriodAPI` |
| `apiv2_payroll_runs` | `GET, POST` | `/api/v2/payroll/runs` | `OrangeHRM\Payroll\Api\PayrollRunAPI` |
| `apiv2_payroll_run` | `GET, PUT` | `/api/v2/payroll/runs/{id}` | `OrangeHRM\Payroll\Api\PayrollRunAPI` |
| `apiv2_payroll_run_calculate` | `POST` | `/api/v2/payroll/runs/{runId}/calculate` | `OrangeHRM\Payroll\Api\PayrollRunCalculateAPI` |
| `apiv2_payroll_run_submit` | `POST` | `/api/v2/payroll/runs/{runId}/submit` | `OrangeHRM\Payroll\Api\PayrollRunSubmitAPI` |
| `apiv2_payroll_run_approve` | `POST` | `/api/v2/payroll/runs/{runId}/approve` | `OrangeHRM\Payroll\Api\PayrollRunApproveAPI` |
| `apiv2_payroll_run_reject` | `POST` | `/api/v2/payroll/runs/{runId}/reject` | `OrangeHRM\Payroll\Api\PayrollRunRejectAPI` |
| `apiv2_payroll_run_lock` | `POST` | `/api/v2/payroll/runs/{runId}/lock` | `OrangeHRM\Payroll\Api\PayrollRunLockAPI` |
| `apiv2_payroll_run_reverse` | `POST` | `/api/v2/payroll/runs/{runId}/reverse` | `OrangeHRM\Payroll\Api\PayrollRunReverseAPI` |
| `apiv2_payroll_run_records` | `GET` | `/api/v2/payroll/runs/{runId}/records` | `OrangeHRM\Payroll\Api\PayrollRecordAPI` |
| `apiv2_payroll_record` | `GET` | `/api/v2/payroll/records/{id}` | `OrangeHRM\Payroll\Api\PayrollRecordAPI` |
| `apiv2_payroll_record_adjustment` | `GET, PUT` | `/api/v2/payroll/records/{id}/adjustment` | `OrangeHRM\Payroll\Api\PayrollAdjustmentAPI` |
| `apiv2_payroll_config` | `GET, PUT` | `/api/v2/payroll/config` | `OrangeHRM\Payroll\Api\PayrollConfigAPI` |
| `apiv2_payroll_tax_brackets` | `GET` | `/api/v2/payroll/tax-brackets` | `OrangeHRM\Payroll\Api\PayrollTaxBracketAPI` |
| `apiv2_payroll_tax_bracket` | `PUT` | `/api/v2/payroll/tax-brackets/{id}` | `OrangeHRM\Payroll\Api\PayrollTaxBracketAPI` |
| `apiv2_payroll_statutory_rules` | `GET` | `/api/v2/payroll/statutory-rules` | `OrangeHRM\Payroll\Api\PayrollStatutoryRuleAPI` |
| `apiv2_payroll_leave_policies` | `GET` | `/api/v2/payroll/leave-policies` | `OrangeHRM\Payroll\Api\PayrollLeavePolicyAPI` |
| `apiv2_payroll_leave_policy` | `PUT` | `/api/v2/payroll/leave-policies/{id}` | `OrangeHRM\Payroll\Api\PayrollLeavePolicyAPI` |
| `apiv2_payroll_payment_batches` | `GET, POST` | `/api/v2/payroll/payment-batches` | `OrangeHRM\Payroll\Api\PayrollPaymentBatchAPI` |
| `apiv2_payroll_payment_batch` | `GET` | `/api/v2/payroll/payment-batches/{id}` | `OrangeHRM\Payroll\Api\PayrollPaymentBatchAPI` |
| `apiv2_payroll_payment_batch_export` | `POST` | `/api/v2/payroll/payment-batches/{batchId}/export` | `OrangeHRM\Payroll\Api\PayrollPaymentExportAPI` |
| `apiv2_payroll_payment_batch_reconcile` | `POST` | `/api/v2/payroll/payment-batches/{batchId}/reconcile` | `OrangeHRM\Payroll\Api\PayrollPaymentReconcileAPI` |
| `apiv2_payroll_my_slips` | `GET` | `/api/v2/payroll/my-salary-slips` | `OrangeHRM\Payroll\Api\SalarySlipAPI` |
| `apiv2_payroll_slip_document` | `GET` | `/api/v2/payroll/slips/{id}` | `OrangeHRM\Payroll\Api\SalarySlipDocumentAPI` |
| `apiv2_payroll_employee_payslips` | `GET` | `/api/v2/payroll/employees/{empNumber}/payslips` | `OrangeHRM\Payroll\Api\EmployeePayslipsAPI` |
| `apiv2_payroll_employee_statutory_profile` | `GET, PUT` | `/api/v2/payroll/employees/{empNumber}/statutory-profile` | `OrangeHRM\Payroll\Api\EmployeeStatutoryProfileAPI` |
| `apiv2_payroll_audit_events` | `GET` | `/api/v2/payroll/audit-events` | `OrangeHRM\Payroll\Api\PayrollAuditAPI` |

## 2.0 Web View & Document Controllers (`10 Routes`)

| Route Name | Path | Controller |
| :--- | :--- | :--- |
| `payroll_module` | `/payroll/viewPayrollModule` | `PayrollModuleController::handle` |
| `payroll_pay_periods_screen` | `/payroll/viewPayPeriods` | `PayPeriodsController::handle` |
| `payroll_processing_screen` | `/payroll/viewPayrollProcessing` | `PayrollProcessingController::handle` |
| `payroll_payments_screen` | `/payroll/viewPayrollPayments` | `PayrollPaymentsController::handle` |
| `payroll_my_slips_screen` | `/payroll/viewMySalarySlips` | `MySalarySlipsController::handle` |
| `payroll_audit_trail_screen` | `/payroll/viewPayrollAuditTrail` | `PayrollAuditController::handle` |
| `payroll_configuration_screen` | `/payroll/viewPayrollConfiguration` | `PayrollConfigurationController::handle` |
| `payroll_employee_payslips_screen` | `/payroll/viewEmployeePayslips/empNumber/{empNumber}` | `EmployeePayslipsController::handle` |
| `payroll_employee_statutory_profile_screen` | `/payroll/viewEmployeeStatutoryProfile/empNumber/{empNumber}` | `EmployeeStatutoryProfileController::handle` |
| `payroll_slip_download` | `/payroll/slips/{id}/download` | `SalarySlipDownloadController::handle` |

