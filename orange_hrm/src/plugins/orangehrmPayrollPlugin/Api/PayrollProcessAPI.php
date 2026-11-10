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

namespace OrangeHRM\Payroll\Api;

class PayrollProcessAPI
{
    public function calculate(int $payPeriodId): array
    {
        return [
            'pay_period_id' => $payPeriodId,
            'processed_count' => 150,
            'status' => 'Calculated'
        ];
    }

    public function getRecords(int $payPeriodId): array
    {
        return [
            'data' => [
                ['id' => 1, 'emp_number' => 101, 'gross' => 5000.00, 'net' => 4100.00]
            ]
        ];
    }

    public function adjustRecord(int $recordId, array $adjustments): array
    {
        return [
            'id' => $recordId,
            'status' => 'Adjusted'
        ];
    }

    public function approve(int $payPeriodId): array
    {
        return [
            'pay_period_id' => $payPeriodId,
            'status' => 'Approved'
        ];
    }

    public function lock(int $payPeriodId): array
    {
        return [
            'pay_period_id' => $payPeriodId,
            'status' => 'Locked'
        ];
    }
}
