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

class PayrollAuditSearchFilterParams extends FilterParams
{
    public const ALLOWED_SORT_FIELDS = ['evt.id', 'evt.occurredAt', 'evt.eventType'];

    private ?int $payrollRunId = null;
    private ?int $empNumber = null;
    private ?string $eventType = null;

    public function __construct()
    {
        $this->setSortField('evt.id');
        $this->setSortOrder(ListSorter::DESCENDING);
    }

    public function getPayrollRunId(): ?int { return $this->payrollRunId; }
    public function setPayrollRunId(?int $payrollRunId): void { $this->payrollRunId = $payrollRunId; }
    public function getEmpNumber(): ?int { return $this->empNumber; }
    public function setEmpNumber(?int $empNumber): void { $this->empNumber = $empNumber; }
    public function getEventType(): ?string { return $this->eventType; }
    public function setEventType(?string $eventType): void { $this->eventType = $eventType; }
}

