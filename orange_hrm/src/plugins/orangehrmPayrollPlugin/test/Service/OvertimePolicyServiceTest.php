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

namespace OrangeHRM\Tests\Payroll\Service;

use OrangeHRM\Entity\PayrollConfig;
use OrangeHRM\Payroll\Service\OvertimePolicyService;
use OrangeHRM\Payroll\Util\Money;
use OrangeHRM\Tests\Util\TestCase;

/**
 * @group Payroll
 */
class OvertimePolicyServiceTest extends TestCase
{
    public function testOvertimeEligibleAndCeilingBlocking(): void
    {
        $service = new OvertimePolicyService();
        $config = new PayrollConfig();
        $config->setStandardShiftHours('8.00');
        $config->setOvertimeMultiplier('2.00');
        $config->setOvertimeEligibleMaxBasic('50000.00');

        // 22 days * 8h = 176 scheduled hours. Basic = Rs.17,600 => Rs.100/hr * 2.0x = Rs.200/hr OT -> 10h = Rs.2,000.00
        $eligible = $service->calculateOvertimePay(Money::of('17600.00', 'INR'), 10.0, 22.0, $config);
        $this->assertTrue($eligible['eligible']);
        $this->assertSame('2000.00', $eligible['overtimePay']->toDatabaseString(2));
        $this->assertNull($eligible['reason']);

        // Managerial staff with Basic > Rs.50,000 should not earn hourly overtime unless ceiling raised
        $blocked = $service->calculateOvertimePay(Money::of('60000.00', 'INR'), 10.0, 22.0, $config);
        $this->assertFalse($blocked['eligible']);
        $this->assertSame('0.00', $blocked['overtimePay']->toDatabaseString(2));
        $this->assertSame('EXCEEDS_OVERTIME_BASIC_THRESHOLD', $blocked['reason']);
    }
}

