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
use OrangeHRM\Entity\PayrollRun;

class PayrollRunModel implements Normalizable
{
    private PayrollRun $run;

    public function __construct(PayrollRun $run)
    {
        $this->run = $run;
    }

    public function toArray(): array
    {
        $period = $this->run->getPayPeriod();
        return [
            'id' => $this->run->getId(),
            'payPeriodId' => $period->getId(),
            'payPeriodName' => $period->getName(),
            'financialYear' => $period->getFinancialYear(),
            'currencyId' => $period->getCurrency()->getId(),
            'startDate' => $period->getStartDate()->format('Y-m-d'),
            'endDate' => $period->getEndDate()->format('Y-m-d'),
            'payDate' => $period->getPayDate()->format('Y-m-d'),
            'runVersion' => $this->run->getRunVersion(),
            'runType' => $this->run->getRunType(),
            'status' => $this->run->getStatus(),
            'calculationVersion' => $this->run->getCalculationVersion(),
            'totalEmployees' => $this->run->getTotalEmployees(),
            'totalGross' => round((float)$this->run->getTotalGross(), 2),
            'totalDeductions' => round((float)$this->run->getTotalDeductions(), 2),
            'totalTax' => round((float)$this->run->getTotalTax(), 2),
            'totalReimbursements' => round((float)$this->run->getTotalReimbursements(), 2),
            'totalNetPay' => round((float)$this->run->getTotalNetPay(), 2),
            'exceptionCount' => $this->run->getExceptionCount(),
            'createdByUserId' => $this->run->getCreatedBy() ? $this->run->getCreatedBy()->getId() : null,
            'createdByUsername' => $this->run->getCreatedBy() ? $this->run->getCreatedBy()->getUserName() : null,
            'submittedByUserId' => $this->run->getSubmittedBy() ? $this->run->getSubmittedBy()->getId() : null,
            'submittedByUsername' => $this->run->getSubmittedBy() ? $this->run->getSubmittedBy()->getUserName() : null,
            'submittedAt' => $this->run->getSubmittedAt() ? $this->run->getSubmittedAt()->format('Y-m-d H:i:s') : null,
            'approvedByUsername' => $this->run->getApprovedBy() ? $this->run->getApprovedBy()->getUserName() : null,
            'approvedAt' => $this->run->getApprovedAt() ? $this->run->getApprovedAt()->format('Y-m-d H:i:s') : null,
            'lockedByUsername' => $this->run->getLockedBy() ? $this->run->getLockedBy()->getUserName() : null,
            'lockedAt' => $this->run->getLockedAt() ? $this->run->getLockedAt()->format('Y-m-d H:i:s') : null,
            'rejectionReason' => $this->run->getRejectionReason(),
            'updatedAt' => $this->run->getUpdatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}

