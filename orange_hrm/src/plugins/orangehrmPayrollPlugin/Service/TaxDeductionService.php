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

class TaxDeductionService
{
    /**
     * Compute progressive statutory income tax based on graduated brackets.
     * Tier 1: $0 - $1,000 => 0%
     * Tier 2: $1,001 - $3,000 => 10%
     * Tier 3: $3,001 - $6,000 => 20%
     * Tier 4: > $6,000 => 30%
     */
    public function computeTax(float $taxableIncome): float
    {
        if ($taxableIncome <= 1000.00) {
            return 0.00;
        }

        $tax = 0.00;

        // Tier 2: $1,000 to $3,000 at 10% (max $200)
        if ($taxableIncome > 1000.00) {
            $tier2Income = min($taxableIncome, 3000.00) - 1000.00;
            $tax += $tier2Income * 0.10;
        }

        // Tier 3: $3,000 to $6,000 at 20% (max $600)
        if ($taxableIncome > 3000.00) {
            $tier3Income = min($taxableIncome, 6000.00) - 3000.00;
            $tax += $tier3Income * 0.20;
        }

        // Tier 4: Over $6,000 at 30%
        if ($taxableIncome > 6000.00) {
            $tier4Income = $taxableIncome - 6000.00;
            $tax += $tier4Income * 0.30;
        }

        return round($tax, 2);
    }
}
