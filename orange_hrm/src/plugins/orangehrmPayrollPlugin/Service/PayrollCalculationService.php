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

use OrangeHRM\Entity\PayrollRecord;
use OrangeHRM\Entity\PayrollItem;

class PayrollCalculationService
{
    private TaxDeductionService $taxService;

    public function __construct(TaxDeductionService $taxService)
    {
        $this->taxService = $taxService;
    }

    /**
     * Compute gross-to-net salary for an employee.
     * Complies with BR_PAY_001 (unpaid leave deduction) and BR_PAY_002 (non-negative net salary).
     */
    public function calculate(float $baseSalary, array $allowances, array $deductions, int $unpaidLeaveDays, int $workingDays = 22): array
    {
        // 1. Calculate Gross Salary
        $totalAllowance = 0.00;
        foreach ($allowances as $a) {
            $totalAllowance += (float)$a['amount'];
        }

        $gross = round($baseSalary + $totalAllowance, 2);

        // 2. Unpaid Absence Deduction (BR_PAY_001)
        $unpaidDeduction = 0.00;
        if ($unpaidLeaveDays > 0 && $workingDays > 0) {
            $dailyRate = $baseSalary / $workingDays;
            $unpaidDeduction = round($dailyRate * $unpaidLeaveDays, 2);
        }

        // 3. Voluntary & Standard Deductions
        $totalDeduction = $unpaidDeduction;
        foreach ($deductions as $d) {
            $totalDeduction += (float)$d['amount'];
        }
        $totalDeduction = round($totalDeduction, 2);

        // 4. Taxable Base & Tax Calculation
        $taxableGross = max(0.00, $gross - $totalDeduction);
        $totalTax = $this->taxService->computeTax($taxableGross);

        // 5. Net Salary Calculation (BR_PAY_002: cannot be negative)
        $net = max(0.00, round($gross - $totalDeduction - $totalTax, 2));

        return [
            'gross_salary' => $gross,
            'total_allowance' => $totalAllowance,
            'total_deduction' => $totalDeduction,
            'total_tax' => $totalTax,
            'net_salary' => $net,
            'unpaid_leave_deduction' => $unpaidDeduction
        ];
    }
}
