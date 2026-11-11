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

class PayrollPayPeriodSearchFilterParams extends FilterParams
{
    public const ALLOWED_SORT_FIELDS = ['period.startDate', 'period.endDate', 'period.payDate', 'period.status', 'period.id'];

    private ?string $status = null;
    private ?string $financialYear = null;
    private ?string $jurisdictionCode = null;

    public function __construct()
    {
        $this->setSortField('period.startDate');
        $this->setSortOrder(ListSorter::DESCENDING);
    }

    public function getStatus(): ?string { return $this->status; }
    public function setStatus(?string $status): void { $this->status = $status; }
    public function getFinancialYear(): ?string { return $this->financialYear; }
    public function setFinancialYear(?string $financialYear): void { $this->financialYear = $financialYear; }
    public function getJurisdictionCode(): ?string { return $this->jurisdictionCode; }
    public function setJurisdictionCode(?string $jurisdictionCode): void { $this->jurisdictionCode = $jurisdictionCode; }
}

