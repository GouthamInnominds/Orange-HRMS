<?php

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

namespace OrangeHRM\Payroll\Api\Model;

use OrangeHRM\Core\Api\V2\Serializer\Normalizable;
use OrangeHRM\Entity\SalarySlip;

class SalarySlipModel implements Normalizable
{
    private SalarySlip $slip;

    public function __construct(SalarySlip $slip)
    {
        $this->slip = $slip;
    }

    public function toArray(): array
    {
        $rec = $this->slip->getPayrollRecord();
        $period = $rec->getPayPeriod();
        $snap = $rec->getSnapshot();
        $emp = $rec->getEmployee();

        return [
            'id' => $this->slip->getId(),
            'slipNumber' => $this->slip->getSlipNumber(),
            'slipStatus' => $this->slip->getSlipStatus(),
            'payrollRunId' => $this->slip->getPayrollRun() ? $this->slip->getPayrollRun()->getId() : null,
            'payrollRecordId' => $rec->getId(),
            'empNumber' => $emp->getEmpNumber(),
            'employeeId' => $snap ? $snap->getEmployeeCode() : $emp->getEmployeeId(),
            'employeeName' => $snap ? $snap->getFullName() : trim($emp->getFirstName() . ' ' . $emp->getLastName()),
            'payPeriodName' => $period->getName(),
            'financialYear' => $period->getFinancialYear(),
            'payDate' => $period->getPayDate()->format('Y-m-d'),
            'currencyId' => $rec->getCurrency()->getId(),
            'grossSalary' => (float)$rec->getGrossSalary(),
            'reimbursementAmount' => (float)$rec->getReimbursementAmount(),
            'totalDeduction' => (float)$rec->getTotalDeduction(),
            'totalTax' => (float)$rec->getTotalTax(),
            'netSalary' => (float)$rec->getNetSalary(),
            'generatedAt' => $this->slip->getGeneratedAt()->format('Y-m-d H:i:s'),
            'publishedAt' => $this->slip->getPublishedAt() ? $this->slip->getPublishedAt()->format('Y-m-d H:i:s') : null,
        ];
    }
}

