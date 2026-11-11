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

use DateTime;
use OrangeHRM\Entity\PayrollConfig;
use OrangeHRM\Entity\PayrollPayPeriod;
use OrangeHRM\Entity\PayrollStatutoryRule;
use OrangeHRM\Entity\PayrollTaxBracket;
use OrangeHRM\Payroll\Dao\PayrollConfigDao;
use OrangeHRM\Payroll\Util\Money;

/**
 * India FY 2026-27 Statutory Calculation Engine:
 * - Pro-rata Basic / HRA / Special Allowance after LWP
 * - EPF (12% Employee + 12% Employer split EPS/EPF, configurable Rs.15,000 wage ceiling)
 * - ESIC (0.75% Employee + 3.25% Employer, gross <= Rs.21,000 excluding expense claims, CEIL_RUPEE)
 * - State Professional Tax (KA, MH including Feb Rs.300 slab, WB, effective-dated)
 * - Income Tax TDS (NEW_115BAC vs OLD regime, Std Deduction, Sec 87A rebate, 4% Cess, Apr-Mar FY annualization & YTD reconciliation)
 */
class IndianStatutoryCalculator
{
    private ?PayrollConfigDao $configDao = null;

    public function getConfigDao(): PayrollConfigDao
    {
        if ($this->configDao === null) {
            $this->configDao = new PayrollConfigDao();
        }
        return $this->configDao;
    }

    public function setConfigDao(PayrollConfigDao $dao): void
    {
        $this->configDao = $dao;
    }

    /**
     * @param array<string,mixed> $profileSnapshot
     * @param PayrollStatutoryRule[]|null $epfRulesOverride
     * @param PayrollStatutoryRule[]|null $esicRulesOverride
     * @param PayrollStatutoryRule[]|null $ptRulesOverride
     * @param PayrollTaxBracket[]|null $taxBracketsOverride
     * @return array<string,mixed>
     */
    public function calculateBreakdown(
        PayrollPayPeriod $period,
        PayrollConfig $config,
        Money $monthlyBaseCtc,
        array $profileSnapshot,
        Money $lwpDeduction,
        Money $overtimePay,
        Money $reimbursementTotal,
        Money $ytdTaxableIncomeBeforePeriod,
        Money $ytdTdsPaidBeforePeriod,
        int $ytdRunCount = 0,
        ?DateTime $employeeJoinedDate = null,
        ?array $epfRulesOverride = null,
        ?array $esicRulesOverride = null,
        ?array $ptRulesOverride = null,
        ?array $taxBracketsOverride = null
    ): array {
        $currency = $period->getCurrency()->getId();
        $asOfDate = $period->getEndDate();

        // 1. Nominal monthly structure (Basic % of CTC, HRA % of Basic, remainder Special Allowance)
        $basicPct = (string)($profileSnapshot['basicPercentOfCtc'] ?? '50.00');
        $hraPctOfBasic = (string)($profileSnapshot['hraPercentOfBasic'] ?? '40.00');

        $nominalBasic = $monthlyBaseCtc->multiplyPercent($basicPct)->roundHalfUp(2);
        $nominalHra = $nominalBasic->multiplyPercent($hraPctOfBasic)->roundHalfUp(2);
        if ($nominalBasic->add($nominalHra)->greaterThan($monthlyBaseCtc)) {
            $nominalHra = Money::max(Money::zero($currency), $monthlyBaseCtc->sub($nominalBasic));
        }
        $nominalSpecial = Money::max(
            Money::zero($currency),
            $monthlyBaseCtc->sub($nominalBasic)->sub($nominalHra)->roundHalfUp(2)
        );

        // 2. Apply LWP deduction proportionally across earnings so earned components sum exactly to (monthlyBaseCtc - lwpDeduction)
        $clampedLwp = Money::min($monthlyBaseCtc, Money::max(Money::zero($currency), $lwpDeduction->roundHalfUp(2)));
        $earnedBaseTotal = Money::max(Money::zero($currency), $monthlyBaseCtc->sub($clampedLwp)->roundHalfUp(2));

        if ($clampedLwp->isZero() || $monthlyBaseCtc->isZero()) {
            $earnedBasic = $nominalBasic;
            $earnedHra = $nominalHra;
            $earnedSpecial = $nominalSpecial;
        } else {
            $num = $earnedBaseTotal->getScaledInt();
            $den = max(1, $monthlyBaseCtc->getScaledInt());
            $earnedBasic = $nominalBasic->multiplyRatio($num, $den)->roundHalfUp(2);
            $earnedHra = $nominalHra->multiplyRatio($num, $den)->roundHalfUp(2);
            if ($earnedBasic->add($earnedHra)->greaterThan($earnedBaseTotal)) {
                $earnedHra = Money::max(Money::zero($currency), $earnedBaseTotal->sub($earnedBasic));
            }
            $earnedSpecial = Money::max(
                Money::zero($currency),
                $earnedBaseTotal->sub($earnedBasic)->sub($earnedHra)->roundHalfUp(2)
            );
        }

        // Gross salary includes earned components + eligible overtime (excludes non-taxable expense reimbursements)
        $grossSalary = $earnedBasic
            ->add($earnedHra)
            ->add($earnedSpecial)
            ->add($overtimePay->roundHalfUp(2))
            ->roundHalfUp(2);
        $totalAllowance = $earnedHra->add($earnedSpecial)->roundHalfUp(2);

        // 3. EPF (12% Employee & 12% Employer split EPS 8.33% / EPF diff 3.67%)
        $epfRules = $epfRulesOverride ?? $this->getConfigDao()->getEffectiveStatutoryRules(
            PayrollStatutoryRule::RULE_TYPE_EPF,
            $asOfDate,
            null,
            $config->getJurisdictionCode()
        );
        $epfResult = $this->calculateEpf($earnedBasic, $config, $profileSnapshot, $epfRules);

        // 4. ESIC (0.75% Employee & 3.25% Employer, CEIL_RUPEE, <= Rs.21,000 regular wage eligibility, excludes claims)
        $esicRules = $esicRulesOverride ?? $this->getConfigDao()->getEffectiveStatutoryRules(
            PayrollStatutoryRule::RULE_TYPE_ESIC,
            $asOfDate,
            null,
            $config->getJurisdictionCode()
        );
        $esicResult = $this->calculateEsic($monthlyBaseCtc, $grossSalary, $config, $profileSnapshot, $esicRules);

        // 5. Professional Tax (state slab, MH Feb Rs.300 override)
        $ptState = strtoupper((string)($profileSnapshot['ptStateCode'] ?? $config->getDefaultPtStateCode()));
        $ptRules = $ptRulesOverride ?? $this->getConfigDao()->getEffectiveStatutoryRules(
            PayrollStatutoryRule::RULE_TYPE_PT,
            $asOfDate,
            $ptState,
            $config->getJurisdictionCode()
        );
        $periodMonth = $period->getPeriodMonth() ?? (int)$period->getEndDate()->format('n');
        $ptAmount = $this->calculateProfessionalTax($grossSalary, $periodMonth, $ptState, $profileSnapshot, $ptRules);

        // 6. Income Tax TDS + 4% Cess (Apr-Mar FY Annualization & YTD reconciliation)
        $taxRegime = (string)($profileSnapshot['taxRegime'] ?? $config->getDefaultTaxRegime());
        $taxBrackets = $taxBracketsOverride ?? $this->getConfigDao()->getTaxBrackets(
            $period->getFinancialYear(),
            $taxRegime,
            $config->getJurisdictionCode(),
            true
        );
        $tdsResult = $this->calculateMonthlyTds(
            $period,
            $monthlyBaseCtc,
            $grossSalary,
            $taxRegime,
            $profileSnapshot,
            $ytdTaxableIncomeBeforePeriod,
            $ytdTdsPaidBeforePeriod,
            $ytdRunCount,
            $employeeJoinedDate,
            $taxBrackets
        );

        $totalIncomeTax = $tdsResult['incomeTaxTds']->add($tdsResult['healthEducationCess'])->roundHalfUp(2);
        $totalDeduction = $epfResult['epfEmployee']
            ->add($esicResult['esicEmployee'])
            ->add($ptAmount)
            ->add($totalIncomeTax)
            ->roundHalfUp(2);

        $netSalary = $grossSalary
            ->sub($totalDeduction)
            ->add($reimbursementTotal->roundHalfUp(2))
            ->roundHalfUp(2);

        return [
            'basicSalary' => $earnedBasic,
            'hraAmount' => $earnedHra,
            'specialAllowance' => $earnedSpecial,
            'overtimeAmount' => $overtimePay->roundHalfUp(2),
            'reimbursementAmount' => $reimbursementTotal->roundHalfUp(2),
            'lwpDeduction' => $clampedLwp,
            'grossSalary' => $grossSalary,
            'totalAllowance' => $totalAllowance,
            'epfEmployee' => $epfResult['epfEmployee'],
            'epfEmployer' => $epfResult['epfEmployer'],
            'epfEmployerEps' => $epfResult['epfEmployerEps'],
            'epfEmployerDiff' => $epfResult['epfEmployerDiff'],
            'esicEmployee' => $esicResult['esicEmployee'],
            'esicEmployer' => $esicResult['esicEmployer'],
            'professionalTax' => $ptAmount,
            'incomeTaxTds' => $tdsResult['incomeTaxTds'],
            'healthEducationCess' => $tdsResult['healthEducationCess'],
            'totalTax' => $totalIncomeTax,
            'totalDeduction' => $totalDeduction,
            'netSalary' => $netSalary,
            'taxRegime' => $taxRegime,
            'projectedAnnualTaxable' => $tdsResult['projectedAnnualTaxable'],
            'projectedAnnualTax' => $tdsResult['projectedAnnualTax'],
        ];
    }

    /**
     * @param array<string,mixed> $profile
     * @param PayrollStatutoryRule[] $rules
     * @return array{epfEmployee:Money,epfEmployer:Money,epfEmployerEps:Money,epfEmployerDiff:Money}
     */
    private function calculateEpf(Money $earnedBasic, PayrollConfig $config, array $profile, array $rules): array
    {
        $currency = $earnedBasic->getCurrencyCode();
        $optedIn = (bool)($profile['epfOptedIn'] ?? true);
        if (!$optedIn || $earnedBasic->isZero() || empty($rules)) {
            $z = Money::zero($currency);
            return ['epfEmployee' => $z, 'epfEmployer' => $z, 'epfEmployerEps' => $z, 'epfEmployerDiff' => $z];
        }

        $rule = $rules[0];
        $capEnabled = $config->isEpfCapAtCeiling() && (bool)($profile['epfRestrictToCeiling'] ?? true);
        $ceilingStr = $rule->getWageCeiling() ?? $config->getEpfWageCeiling();
        $ceiling = Money::of($ceilingStr, $currency);

        $epfWage = $capEnabled ? Money::min($earnedBasic, $ceiling) : $earnedBasic;

        $epfEmployee = $epfWage->multiplyPercent($rule->getEmployeeRate())->roundNearestRupee();
        $epfEmployerTotal = $epfWage->multiplyPercent($rule->getEmployerRate())->roundNearestRupee();

        // EPS 8.33% is always capped at statutory Rs.15,000 wage ceiling
        $meta = $rule->getMetadataJson() ? json_decode($rule->getMetadataJson(), true) : [];
        $epsRate = isset($meta['eps_rate']) ? (string)$meta['eps_rate'] : '8.33';
        $epsWage = Money::min($epfWage, $ceiling);
        $epsEmployer = $epsWage->multiplyPercent($epsRate)->roundNearestRupee();
        if ($epsEmployer->greaterThan($epfEmployerTotal)) {
            $epsEmployer = $epfEmployerTotal;
        }
        $epfDiffEmployer = Money::max(Money::zero($currency), $epfEmployerTotal->sub($epsEmployer)->roundHalfUp(2));

        return [
            'epfEmployee' => $epfEmployee,
            'epfEmployer' => $epfEmployerTotal,
            'epfEmployerEps' => $epsEmployer,
            'epfEmployerDiff' => $epfDiffEmployer,
        ];
    }

    /**
     * @param array<string,mixed> $profile
     * @param PayrollStatutoryRule[] $rules
     * @return array{esicEmployee:Money,esicEmployer:Money}
     */
    private function calculateEsic(
        Money $monthlyBaseCtc,
        Money $esicWageBase,
        PayrollConfig $config,
        array $profile,
        array $rules
    ): array {
        $currency = $esicWageBase->getCurrencyCode();
        $applicable = (bool)($profile['esicApplicable'] ?? true);
        if (!$applicable || $esicWageBase->isZero() || empty($rules)) {
            return ['esicEmployee' => Money::zero($currency), 'esicEmployer' => Money::zero($currency)];
        }

        $rule = $rules[0];
        $ceilingStr = $rule->getSlabMax() ?? $rule->getWageCeiling() ?? $config->getEsicGrossCeiling();
        $ceiling = Money::of($ceilingStr, $currency);

        // ESIC ceiling eligibility applies to regular monthly gross wages (strictly excluding claim reimbursements)
        if ($monthlyBaseCtc->greaterThan($ceiling)) {
            return ['esicEmployee' => Money::zero($currency), 'esicEmployer' => Money::zero($currency)];
        }

        $esicEmployee = $esicWageBase->multiplyPercent($rule->getEmployeeRate())->ceilRupee();
        $esicEmployer = $esicWageBase->multiplyPercent($rule->getEmployerRate())->ceilRupee();

        return [
            'esicEmployee' => $esicEmployee,
            'esicEmployer' => $esicEmployer,
        ];
    }

    /**
     * @param array<string,mixed> $profile
     * @param PayrollStatutoryRule[] $rules
     */
    private function calculateProfessionalTax(
        Money $grossWages,
        int $periodMonth,
        string $stateCode,
        array $profile,
        array $rules
    ): Money {
        $currency = $grossWages->getCurrencyCode();
        if (!(bool)($profile['ptApplicable'] ?? true) || $grossWages->isZero() || empty($rules)) {
            return Money::zero($currency);
        }

        $matchedRule = null;
        foreach ($rules as $rule) {
            if ($rule->getStateCode() !== null && strtoupper($rule->getStateCode()) !== strtoupper($stateCode)) {
                continue;
            }
            $min = Money::of($rule->getSlabMin(), $currency);
            $max = $rule->getSlabMax() !== null ? Money::of($rule->getSlabMax(), $currency) : null;
            if ($grossWages->greaterThanOrEqual($min) && ($max === null || $grossWages->lessThanOrEqual($max))) {
                $matchedRule = $rule;
                break;
            }
        }

        if ($matchedRule === null) {
            return Money::zero($currency);
        }

        $amountStr = ($periodMonth === 2 && $matchedRule->getFebruaryEmployeeAmount() !== null)
            ? $matchedRule->getFebruaryEmployeeAmount()
            : $matchedRule->getFixedEmployeeAmount();

        return Money::of($amountStr, $currency)->roundHalfUp(2);
    }

    /**
     * @param array<string,mixed> $profile
     * @param PayrollTaxBracket[] $brackets
     * @return array{
     *   incomeTaxTds:Money,
     *   healthEducationCess:Money,
     *   projectedAnnualTaxable:Money,
     *   projectedAnnualTax:Money
     * }
     */
    private function calculateMonthlyTds(
        PayrollPayPeriod $period,
        Money $monthlyBaseCtc,
        Money $currentGrossEarned,
        string $taxRegime,
        array $profile,
        Money $ytdTaxableIncomeBeforePeriod,
        Money $ytdTdsPaidBeforePeriod,
        int $ytdRunCount,
        ?DateTime $joinedDate,
        array $brackets
    ): array {
        $currency = $currentGrossEarned->getCurrencyCode();
        if (empty($brackets)) {
            $z = Money::zero($currency);
            return [
                'incomeTaxTds' => $z,
                'healthEducationCess' => $z,
                'projectedAnnualTaxable' => $z,
                'projectedAnnualTax' => $z,
            ];
        }

        $calMonth = $period->getPeriodMonth() ?? (int)$period->getEndDate()->format('n');
        $fyMonthIndex = $calMonth >= 4 ? ($calMonth - 3) : ($calMonth + 9); // Apr=1 .. Mar=12
        $remainingMonthsInclusive = max(1, 13 - $fyMonthIndex);
        $priorFyMonths = max(0, $fyMonthIndex - 1);

        // Determine active prior FY months accounting for mid-FY joiners when no prior payroll runs exist
        $activePriorMonths = $priorFyMonths;
        if ($joinedDate !== null && $priorFyMonths > 0) {
            $fyStartYear = (int)substr($period->getFinancialYear(), 0, 4);
            $fyStartDate = new DateTime(sprintf('%04d-04-01', $fyStartYear));
            if ($joinedDate > $fyStartDate) {
                $joinDiffMonths = (($period->getStartDate()->format('Y') - $joinedDate->format('Y')) * 12)
                    + ((int)$period->getStartDate()->format('n') - (int)$joinedDate->format('n'));
                $activePriorMonths = max(0, min($priorFyMonths, $joinDiffMonths));
            }
        }

        $unrecordedPriorMonths = max(0, $activePriorMonths - $ytdRunCount);
        $projectedUnrecordedPrior = $unrecordedPriorMonths > 0
            ? $monthlyBaseCtc->multiplyRatio($unrecordedPriorMonths, 1)
            : Money::zero($currency);
        $projectedRemaining = ($remainingMonthsInclusive - 1) > 0
            ? $monthlyBaseCtc->multiplyRatio($remainingMonthsInclusive - 1, 1)
            : Money::zero($currency);

        $projectedAnnualGross = $ytdTaxableIncomeBeforePeriod
            ->add($projectedUnrecordedPrior)
            ->add($currentGrossEarned)
            ->add($projectedRemaining)
            ->roundHalfUp(2);

        $firstBracket = $brackets[0];
        $stdDeduction = Money::of($firstBracket->getStandardDeduction(), $currency);
        $rebateLimit = Money::of($firstBracket->getRebateLimit(), $currency);
        $rebateMax = Money::of($firstBracket->getRebateMaxAmount(), $currency);
        $cessRateStr = $firstBracket->getCessRate();

        $totalExemptions = $stdDeduction;
        if (strtoupper($taxRegime) === PayrollTaxBracket::REGIME_OLD) {
            // Section 80C is capped at Rs.1,50,000 under Old Tax Regime
            $sec80c = Money::min(
                Money::of('150000.00', $currency),
                Money::of((string)($profile['declared80c'] ?? '0.00'), $currency)
            );
            $sec80d = Money::of((string)($profile['declared80d'] ?? '0.00'), $currency);
            $hraExemption = Money::of((string)($profile['declaredHraAnnual'] ?? '0.00'), $currency);
            $otherExemption = Money::of((string)($profile['otherExemptions'] ?? '0.00'), $currency);
            $totalExemptions = $totalExemptions->add($sec80c)->add($sec80d)->add($hraExemption)->add($otherExemption);
        }

        $projectedTaxable = Money::max(Money::zero($currency), $projectedAnnualGross->sub($totalExemptions));

        // Progressive bracket calculation
        $annualBaseTax = Money::zero($currency);
        foreach ($brackets as $bracket) {
            $min = Money::of($bracket->getMinIncome(), $currency);
            if ($projectedTaxable->lessThanOrEqual($min)) {
                break;
            }
            $max = $bracket->getMaxIncome() !== null ? Money::of($bracket->getMaxIncome(), $currency) : null;
            $upper = $max !== null ? Money::min($projectedTaxable, $max) : $projectedTaxable;
            $inSlab = Money::max(Money::zero($currency), $upper->sub($min));
            $annualBaseTax = $annualBaseTax->add($inSlab->multiplyPercent($bracket->getTaxRate()));
        }

        // Section 87A Rebate check on Net Taxable Income
        if ($projectedTaxable->lessThanOrEqual($rebateLimit)) {
            $rebate = Money::min($annualBaseTax, $rebateMax);
            $annualBaseTax = Money::max(Money::zero($currency), $annualBaseTax->sub($rebate));
        }

        $annualBaseTax = $annualBaseTax->roundNearestRupee();
        $annualCess = $annualBaseTax->multiplyPercent($cessRateStr)->roundNearestRupee();
        $annualTotalTax = $annualBaseTax->add($annualCess);

        $remainingTax = Money::max(Money::zero($currency), $annualTotalTax->sub($ytdTdsPaidBeforePeriod));
        $monthlyTotalTax = $remainingTax->multiplyRatio(1, $remainingMonthsInclusive)->roundNearestRupee();

        $cessPctScaled = (int)round((float)$cessRateStr * 100);
        if ($cessPctScaled > 0 && $monthlyTotalTax->isPositive()) {
            // Split monthlyTotalTax = TDS + (Cess%) cleanly so TDS + Cess === monthlyTotalTax exactly
            $monthlyTds = $monthlyTotalTax->multiplyRatio(10000, 10000 + $cessPctScaled)->roundHalfUp(2);
            $monthlyCess = Money::max(Money::zero($currency), $monthlyTotalTax->sub($monthlyTds)->roundHalfUp(2));
        } else {
            $monthlyTds = $monthlyTotalTax->roundHalfUp(2);
            $monthlyCess = Money::zero($currency);
        }

        return [
            'incomeTaxTds' => $monthlyTds,
            'healthEducationCess' => $monthlyCess,
            'projectedAnnualTaxable' => $projectedTaxable->roundHalfUp(2),
            'projectedAnnualTax' => $annualTotalTax->roundHalfUp(2),
        ];
    }
}
