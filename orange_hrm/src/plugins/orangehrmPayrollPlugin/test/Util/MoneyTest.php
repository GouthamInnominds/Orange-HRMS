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

namespace OrangeHRM\Tests\Payroll\Util;

use InvalidArgumentException;
use OrangeHRM\Payroll\Util\Money;
use OrangeHRM\Tests\Util\TestCase;

/**
 * @group Payroll
 */
class MoneyTest extends TestCase
{
    public function testArithmeticAndRoundingModes(): void
    {
        $a = Money::of('12345.6789', 'INR');
        $b = Money::of(100, 'INR');
        $sum = $a->add($b);

        $this->assertSame('12445.6789', $sum->toDatabaseString(4));
        $this->assertSame('12445.68', $sum->toDatabaseString(2));
        $this->assertSame('12446', $sum->roundNearestRupee()->toDatabaseString(0));
    }

    public function testEsicCeilRupeeRounding(): void
    {
        $wage = Money::of('21000.00', 'INR');
        $esic = $wage->multiplyPercent('0.75'); // 157.5000
        $this->assertSame('157.50', $esic->toDatabaseString(2));
        $this->assertSame('158.00', $esic->ceilRupee()->toDatabaseString(2));

        $exact = Money::of('18000.00', 'INR')->multiplyPercent('0.75'); // 135.0000
        $this->assertSame('135.00', $exact->ceilRupee()->toDatabaseString(2));

        $tinyFrac = Money::of('135.0001', 'INR');
        $this->assertSame('136.00', $tinyFrac->ceilRupee()->toDatabaseString(2));
        $this->assertSame('0.00', Money::zero('INR')->ceilRupee()->toDatabaseString(2));
    }

    public function testSection288BRoundingToNearestTen(): void
    {
        $this->assertSame('1450.00', Money::of('1454.99', 'INR')->roundNearestTenRupees()->toDatabaseString(2));
        $this->assertSame('1460.00', Money::of('1455.00', 'INR')->roundNearestTenRupees()->toDatabaseString(2));
    }

    public function testBigStringMultiplicationFallbackWithoutBcmath(): void
    {
        // >18 digits combined forces big-string math fallback without integer overflow
        $bigSalary = Money::of('50000000.00', 'INR'); // 5,00,00,000 -> scaled 500,000,000,000 (12 digits)
        $percent = $bigSalary->multiplyPercent('12.3456'); // scaled pct 123,456 (6 digits) => 18+ digits total
        $this->assertSame('6172800.00', $percent->toDatabaseString(2));
    }

    public function testCurrencyMismatchThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        Money::of('100.00', 'INR')->add(Money::of('100.00', 'USD'));
    }
}

