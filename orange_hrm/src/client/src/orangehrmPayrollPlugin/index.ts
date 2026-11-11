/**
 * OrangeHRM is a comprehensive Human Resource Management (HRM) System that captures
 * all the essential functionalities required for any enterprise.
 * Copyright (C) 2006 OrangeHRM Inc., http://www.orangehrm.com
 *
 * OrangeHRM is free software: you can redistribute it and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * OrangeHRM is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with OrangeHRM.
 * If not, see <https://www.gnu.org/licenses/>.
 */

import PayPeriods from './pages/payPeriods/PayPeriods.vue';
import PayrollProcessing from './pages/payroll/PayrollProcessing.vue';
import PayrollPayments from './pages/payments/PayrollPayments.vue';
import PayrollAuditTrail from './pages/audit/PayrollAuditTrail.vue';
import PayrollConfiguration from './pages/config/PayrollConfiguration.vue';
import MySalarySlips from './pages/salarySlip/MySalarySlips.vue';
import EmployeePayslips from './pages/employee/EmployeePayslips.vue';
import EmployeeStatutoryProfile from './pages/employee/EmployeeStatutoryProfile.vue';

export default {
  'payroll-pay-periods': PayPeriods,
  'payroll-processing': PayrollProcessing,
  'payroll-payments': PayrollPayments,
  'payroll-audit-trail': PayrollAuditTrail,
  'payroll-configuration': PayrollConfiguration,
  'my-salary-slips': MySalarySlips,
  'employee-payslips': EmployeePayslips,
  'employee-statutory-profile': EmployeeStatutoryProfile,
};
