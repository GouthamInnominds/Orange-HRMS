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

namespace OrangeHRM\Payroll\Service;

use OrangeHRM\Entity\PayrollConfig;
use OrangeHRM\Payroll\Util\Money;

/**
 * Policy-driven overtime eligibility & payout calculator.
 */
class OvertimePolicyService
{
    public function calculateOvertimePay(
        Money $monthlyBasic,
        float $overtimeHours,
        float $scheduledWorkingDays,
        PayrollConfig $config
    ): array {
        $currency = $monthlyBasic->getCurrencyCode();
        if ($overtimeHours <= 0.0 || $scheduledWorkingDays <= 0.0) {
            return ['eligible' => false, 'overtimePay' => Money::zero($currency), 'reason' => null];
        }

        $maxBasicStr = $config->getOvertimeEligibleMaxBasic();
        if ($maxBasicStr !== null) {
            $maxBasic = Money::of($maxBasicStr, $currency);
            if ($monthlyBasic->greaterThan($maxBasic)) {
                return [
                    'eligible' => false,
                    'overtimePay' => Money::zero($currency),
                    'reason' => 'EXCEEDS_OVERTIME_BASIC_THRESHOLD',
                ];
            }
        }

        $shiftHours = max(1.0, (float)$config->getStandardShiftHours());
        $scheduledHoursScaled = (int)round($scheduledWorkingDays * $shiftHours * 100);
        $otHoursScaled = (int)round($overtimeHours * 100);
        $multScaled = (int)round((float)$config->getOvertimeMultiplier() * 100);

        // Overtime = monthlyBasic * (otHours / scheduledHours) * multiplier
        $otPay = $monthlyBasic
            ->multiplyRatio($otHoursScaled, $scheduledHoursScaled)
            ->multiplyRatio($multScaled, 100)
            ->roundHalfUp(2);

        return ['eligible' => true, 'overtimePay' => $otPay, 'reason' => null];
    }
}

