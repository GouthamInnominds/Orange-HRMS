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

class SalarySlipSearchFilterParams extends FilterParams
{
    public const ALLOWED_SORT_FIELDS = ['slip.id', 'slip.generatedAt', 'slip.publishedAt', 'period.startDate'];

    private ?int $empNumber = null;
    private ?string $slipStatus = null;
    private ?string $financialYear = null;

    public function __construct()
    {
        $this->setSortField('slip.id');
        $this->setSortOrder(ListSorter::DESCENDING);
    }

    public function getEmpNumber(): ?int { return $this->empNumber; }
    public function setEmpNumber(?int $empNumber): void { $this->empNumber = $empNumber; }
    public function getSlipStatus(): ?string { return $this->slipStatus; }
    public function setSlipStatus(?string $slipStatus): void { $this->slipStatus = $slipStatus; }
    public function getFinancialYear(): ?string { return $this->financialYear; }
    public function setFinancialYear(?string $financialYear): void { $this->financialYear = $financialYear; }
}

