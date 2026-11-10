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

class PayPeriodAPI
{
    public function getAll(): array
    {
        return [
            ['id' => 1, 'name' => 'November 2026 Monthly Payroll', 'status' => 'Draft']
        ];
    }

    public function getOne(int $id): array
    {
        return [
            'id' => $id,
            'name' => 'November 2026 Monthly Payroll',
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-30',
            'status' => 'Draft'
        ];
    }

    public function create(array $data): array
    {
        return [
            'id' => 2,
            'name' => $data['name'] ?? 'December 2026 Payroll',
            'status' => 'Draft'
        ];
    }

    public function update(int $id, array $data): array
    {
        return ['success' => true, 'id' => $id];
    }

    public function delete(int $id): array
    {
        return ['success' => true];
    }
}
