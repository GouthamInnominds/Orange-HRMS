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

namespace OrangeHRM\Payroll\Dto;

use OrangeHRM\Core\Dto\FilterParams;
use OrangeHRM\ORM\ListSorter;

class PayrollRecordSearchFilterParams extends FilterParams
{
    public const ALLOWED_SORT_FIELDS = ['rec.id', 'emp.firstName', 'emp.employeeId', 'rec.grossSalary', 'rec.netSalary', 'rec.status'];

    private ?int $payrollRunId = null;
    private ?int $payPeriodId = null;
    private ?int $empNumber = null;
    private ?string $status = null;
    private ?string $search = null;

    public function __construct()
    {
        $this->setSortField('rec.id');
        $this->setSortOrder(ListSorter::ASCENDING);
    }

    public function getPayrollRunId(): ?int { return $this->payrollRunId; }
    public function setPayrollRunId(?int $payrollRunId): void { $this->payrollRunId = $payrollRunId; }
    public function getPayPeriodId(): ?int { return $this->payPeriodId; }
    public function setPayPeriodId(?int $payPeriodId): void { $this->payPeriodId = $payPeriodId; }
    public function getEmpNumber(): ?int { return $this->empNumber; }
    public function setEmpNumber(?int $empNumber): void { $this->empNumber = $empNumber; }
    public function getStatus(): ?string { return $this->status; }
    public function setStatus(?string $status): void { $this->status = $status; }
    public function getSearch(): ?string { return $this->search; }
    public function setSearch(?string $search): void { $this->search = $search; }
}

