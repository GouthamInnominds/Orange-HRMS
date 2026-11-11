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
use OrangeHRM\Entity\PayrollPaymentBatch;

class PayrollPaymentBatchModel implements Normalizable
{
    private PayrollPaymentBatch $batch;

    public function __construct(PayrollPaymentBatch $batch)
    {
        $this->batch = $batch;
    }

    public function toArray(): array
    {
        $run = $this->batch->getPayrollRun();
        $period = $run->getPayPeriod();

        return [
            'id' => $this->batch->getId(),
            'payrollRunId' => $run->getId(),
            'payPeriodName' => $period->getName(),
            'batchReference' => $this->batch->getBatchReference(),
            'paymentMode' => $this->batch->getPaymentMode(),
            'totalAmount' => round((float)$this->batch->getTotalAmount(), 2),
            'recordCount' => $this->batch->getRecordCount(),
            'currencyId' => $this->batch->getCurrency()->getId(),
            'status' => $this->batch->getStatus(),
            'utrNumber' => $this->batch->getUtrNumber(),
            'exportedByUsername' => $this->batch->getExportedBy() ? $this->batch->getExportedBy()->getUserName() : null,
            'exportedAt' => $this->batch->getExportedAt() ? $this->batch->getExportedAt()->format('Y-m-d H:i:s') : null,
            'reconciledByUsername' => $this->batch->getReconciledBy() ? $this->batch->getReconciledBy()->getUserName() : null,
            'reconciledAt' => $this->batch->getReconciledAt() ? $this->batch->getReconciledAt()->format('Y-m-d H:i:s') : null,
            'createdAt' => $this->batch->getCreatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}

