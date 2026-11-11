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
use OrangeHRM\Entity\PayrollPayPeriod;

class PayPeriodModel implements Normalizable
{
    private PayrollPayPeriod $period;

    public function __construct(PayrollPayPeriod $period)
    {
        $this->period = $period;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->period->getId(),
            'name' => $this->period->getName(),
            'startDate' => $this->period->getStartDate()->format('Y-m-d'),
            'endDate' => $this->period->getEndDate()->format('Y-m-d'),
            'payDate' => $this->period->getPayDate()->format('Y-m-d'),
            'frequency' => $this->period->getFrequency(),
            'status' => $this->period->getStatus(),
            'jurisdictionCode' => $this->period->getJurisdictionCode(),
            'financialYear' => $this->period->getFinancialYear(),
            'periodMonth' => $this->period->getPeriodMonth(),
            'periodYear' => $this->period->getPeriodYear(),
            'currencyId' => $this->period->getCurrency()->getId(),
            'standardWorkingDays' => (float)$this->period->getStandardWorkingDays(),
        ];
    }
}

