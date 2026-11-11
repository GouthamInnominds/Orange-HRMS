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

use DateTime;
use OrangeHRM\Entity\CurrencyType;
use OrangeHRM\Entity\PayrollConfig;
use OrangeHRM\Entity\PayrollPayPeriod;
use OrangeHRM\Entity\PayrollStatutoryRule;
use OrangeHRM\Entity\PayrollTaxBracket;
use OrangeHRM\Payroll\Service\IndianStatutoryCalculator;
use OrangeHRM\Payroll\Util\Money;
use OrangeHRM\Tests\Util\TestCase;

/**
 * @group Payroll
 */
class IndianStatutoryCalculatorTest extends TestCase
{
    private IndianStatutoryCalculator $calculator;
    private CurrencyType $inr;
    private PayrollConfig $config;

    protected function setUp(): void
    {
        $this->calculator = new IndianStatutoryCalculator();
        $this->inr = new CurrencyType();
        $this->inr->setId('INR');
        $this->inr->setCode(67);
        $this->inr->setName('Indian Rupee');

        $this->config = new PayrollConfig();
        $this->config->setDefaultCurrency($this->inr);
        $this->config->setEpfWageCeiling('15000.00');
        $this->config->setEpfCapAtCeiling(true);
        $this->config->setEsicGrossCeiling('21000.00');
        $this->config->setDefaultPtStateCode('KA');
        $this->config->setDefaultTaxRegime(PayrollTaxBracket::REGIME_NEW_115BAC);
    }

    public function testEpfCapToggleSplitsEpsAndDiffCorrectly(): void
    {
        $period = $this->makePeriod('2026-11-01', '2026-11-30', 11, 2026);
        $epfRules = [$this->makeEpfRule()];

        // CTC 1,20,000 => Basic 60,000; restricted to Rs.15,000 ceiling => EPF = Rs.1,800 (EPS Rs.1,250 + Diff Rs.550)
        $capped = $this->calculator->calculateBreakdown(
            $period,
            $this->config,
            Money::of('120000.00', 'INR'),
            ['taxRegime' => 'NEW_115BAC', 'ptStateCode' => 'KA', 'epfOptedIn' => true, 'epfRestrictToCeiling' => true, 'esicApplicable' => true, 'ptApplicable' => false],
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            0,
            new DateTime('2025-01-01'),
            $epfRules,
            [],
            [],
            $this->makeNewRegimeBrackets()
        );

        $this->assertSame('60000.00', $capped['basicSalary']->toDatabaseString(2));
        $this->assertSame('1800.00', $capped['epfEmployee']->toDatabaseString(2));
        $this->assertSame('1800.00', $capped['epfEmployer']->toDatabaseString(2));
        $this->assertSame('1250.00', $capped['epfEmployerEps']->toDatabaseString(2));
        $this->assertSame('550.00', $capped['epfEmployerDiff']->toDatabaseString(2));

        // Uncapped EPF on Basic Rs.60,000 => 12% = Rs.7,200 (EPS still capped at Rs.1,250)
        $uncapped = $this->calculator->calculateBreakdown(
            $period,
            $this->config,
            Money::of('120000.00', 'INR'),
            ['taxRegime' => 'NEW_115BAC', 'ptStateCode' => 'KA', 'epfOptedIn' => true, 'epfRestrictToCeiling' => false, 'esicApplicable' => true, 'ptApplicable' => false],
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            0,
            new DateTime('2025-01-01'),
            $epfRules,
            [],
            [],
            $this->makeNewRegimeBrackets()
        );

        $this->assertSame('7200.00', $uncapped['epfEmployee']->toDatabaseString(2));
        $this->assertSame('7200.00', $uncapped['epfEmployer']->toDatabaseString(2));
        $this->assertSame('1250.00', $uncapped['epfEmployerEps']->toDatabaseString(2));
        $this->assertSame('5950.00', $uncapped['epfEmployerDiff']->toDatabaseString(2));
    }

    public function testEsicCeilingBoundaryAndClaimExclusion(): void
    {
        $period = $this->makePeriod('2026-11-01', '2026-11-30', 11, 2026);
        $esicRules = [$this->makeEsicRule()];

        // Regular gross Rs.18,000 + Rs.5,000 Claim reimbursement => MUST still qualify for ESIC on Rs.18,000 only!
        $withClaim = $this->calculator->calculateBreakdown(
            $period,
            $this->config,
            Money::of('18000.00', 'INR'),
            ['taxRegime' => 'NEW_115BAC', 'ptStateCode' => 'KA', 'epfOptedIn' => false, 'esicApplicable' => true, 'ptApplicable' => false],
            Money::zero('INR'),
            Money::zero('INR'),
            Money::of('5000.00', 'INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            0,
            new DateTime('2025-01-01'),
            [],
            $esicRules,
            [],
            $this->makeNewRegimeBrackets()
        );
        $this->assertSame('135.00', $withClaim['esicEmployee']->toDatabaseString(2));
        $this->assertSame('585.00', $withClaim['esicEmployer']->toDatabaseString(2));
        $this->assertSame('5000.00', $withClaim['reimbursementAmount']->toDatabaseString(2));

        // Exact boundary Rs.21,000 => 21000 * 0.75% = 157.50 => CEIL_RUPEE = Rs.158.00
        $atCeiling = $this->calculator->calculateBreakdown(
            $period,
            $this->config,
            Money::of('21000.00', 'INR'),
            ['taxRegime' => 'NEW_115BAC', 'ptStateCode' => 'KA', 'epfOptedIn' => false, 'esicApplicable' => true, 'ptApplicable' => false],
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            0,
            new DateTime('2025-01-01'),
            [],
            $esicRules,
            [],
            $this->makeNewRegimeBrackets()
        );
        $this->assertSame('158.00', $atCeiling['esicEmployee']->toDatabaseString(2));

        // Just above boundary Rs.21,001 => NOT eligible => Rs.0.00
        $aboveCeiling = $this->calculator->calculateBreakdown(
            $period,
            $this->config,
            Money::of('21001.00', 'INR'),
            ['taxRegime' => 'NEW_115BAC', 'ptStateCode' => 'KA', 'epfOptedIn' => false, 'esicApplicable' => true, 'ptApplicable' => false],
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            0,
            new DateTime('2025-01-01'),
            [],
            $esicRules,
            [],
            $this->makeNewRegimeBrackets()
        );
        $this->assertSame('0.00', $aboveCeiling['esicEmployee']->toDatabaseString(2));
        $this->assertSame('0.00', $aboveCeiling['esicEmployer']->toDatabaseString(2));
    }

    public function testMaharashtraFebruaryPtSlabOverride(): void
    {
        $mhRules = $this->makeMhPtRules();

        $nov = $this->calculator->calculateBreakdown(
            $this->makePeriod('2026-11-01', '2026-11-30', 11, 2026),
            $this->config,
            Money::of('25000.00', 'INR'),
            ['taxRegime' => 'NEW_115BAC', 'ptStateCode' => 'MH', 'epfOptedIn' => false, 'esicApplicable' => false, 'ptApplicable' => true],
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            0,
            new DateTime('2025-01-01'),
            [],
            [],
            $mhRules,
            $this->makeNewRegimeBrackets()
        );
        $this->assertSame('200.00', $nov['professionalTax']->toDatabaseString(2));

        $feb = $this->calculator->calculateBreakdown(
            $this->makePeriod('2027-02-01', '2027-02-28', 2, 2027),
            $this->config,
            Money::of('25000.00', 'INR'),
            ['taxRegime' => 'NEW_115BAC', 'ptStateCode' => 'MH', 'epfOptedIn' => false, 'esicApplicable' => false, 'ptApplicable' => true],
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            0,
            new DateTime('2025-01-01'),
            [],
            [],
            $mhRules,
            $this->makeNewRegimeBrackets()
        );
        $this->assertSame('300.00', $feb['professionalTax']->toDatabaseString(2));
    }

    public function testFy2026TdsNewVsOldRegimeRebateCessAndLwpProRata(): void
    {
        $apr = $this->makePeriod('2026-04-01', '2026-04-30', 4, 2026);

        // Monthly Rs.1,06,250 = Rs.12,75,000 annual; Std Deduction 75k => Taxable Rs.12,00,000 => Sec 87A rebate covers tax!
        $zeroTaxNew = $this->calculator->calculateBreakdown(
            $apr,
            $this->config,
            Money::of('106250.00', 'INR'),
            ['taxRegime' => 'NEW_115BAC', 'ptStateCode' => 'KA', 'epfOptedIn' => false, 'esicApplicable' => false, 'ptApplicable' => false],
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            0,
            new DateTime('2025-01-01'),
            [],
            [],
            [],
            $this->makeNewRegimeBrackets()
        );
        $this->assertSame('1200000.00', $zeroTaxNew['projectedAnnualTaxable']->toDatabaseString(2));
        $this->assertSame('0.00', $zeroTaxNew['totalTax']->toDatabaseString(2));

        // Monthly Rs.1,50,000 = Rs.18,00,000 annual under NEW_115BAC:
        // Taxable = 17,25,000 -> Slab Tax = 0 + 20,000 + 40,000 + 60,000 + 25,000 = 1,45,000 + 4% Cess (5,800) = 1,50,800
        // April monthly = 1,50,800 / 12 = 12,567
        $highNew = $this->calculator->calculateBreakdown(
            $apr,
            $this->config,
            Money::of('150000.00', 'INR'),
            ['taxRegime' => 'NEW_115BAC', 'ptStateCode' => 'KA', 'epfOptedIn' => false, 'esicApplicable' => false, 'ptApplicable' => false],
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            0,
            new DateTime('2025-01-01'),
            [],
            [],
            [],
            $this->makeNewRegimeBrackets()
        );
        $this->assertSame('1725000.00', $highNew['projectedAnnualTaxable']->toDatabaseString(2));
        $this->assertSame('150800.00', $highNew['projectedAnnualTax']->toDatabaseString(2));
        $this->assertSame('12567.00', $highNew['totalTax']->toDatabaseString(2));

        // Old Regime on Rs.18,00,000 annual with 1.5L 80C + 25k 80D + 1.8L HRA + 50k Std Ded = 4,05,000 exempt -> Taxable 13,95,000
        // Old slabs: 12,500 + 1,00,000 + 1,18,500 = 2,31,000 + 4% (9,240) = 2,40,240 -> Monthly = 20,020
        $oldRegime = $this->calculator->calculateBreakdown(
            $apr,
            $this->config,
            Money::of('150000.00', 'INR'),
            [
                'taxRegime' => 'OLD',
                'ptStateCode' => 'KA',
                'epfOptedIn' => false,
                'esicApplicable' => false,
                'ptApplicable' => false,
                'declared80c' => '200000.00', // capped at 1,50,000!
                'declared80d' => '25000.00',
                'declaredHraAnnual' => '180000.00',
            ],
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            0,
            new DateTime('2025-01-01'),
            [],
            [],
            [],
            $this->makeOldRegimeBrackets()
        );
        $this->assertSame('1395000.00', $oldRegime['projectedAnnualTaxable']->toDatabaseString(2));
        $this->assertSame('240240.00', $oldRegime['projectedAnnualTax']->toDatabaseString(2));
        $this->assertSame('20020.00', $oldRegime['totalTax']->toDatabaseString(2));

        // LWP Pro-rata invariance: Rs.1,00,000 CTC minus Rs.10,000 LWP => Basic+HRA+Special === Rs.90,000.00 exactly
        $lwp = $this->calculator->calculateBreakdown(
            $apr,
            $this->config,
            Money::of('100000.00', 'INR'),
            ['taxRegime' => 'NEW_115BAC', 'ptStateCode' => 'KA', 'epfOptedIn' => false, 'esicApplicable' => false, 'ptApplicable' => false],
            Money::of('10000.00', 'INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            0,
            new DateTime('2025-01-01'),
            [],
            [],
            [],
            $this->makeNewRegimeBrackets()
        );
        $componentSum = $lwp['basicSalary']->add($lwp['hraAmount'])->add($lwp['specialAllowance']);
        $this->assertSame('90000.00', $componentSum->toDatabaseString(2));
        $this->assertSame('90000.00', $lwp['grossSalary']->toDatabaseString(2));
    }

    private function makePeriod(string $start, string $end, int $month, int $year): PayrollPayPeriod
    {
        $p = new PayrollPayPeriod();
        $p->setName('Period');
        $p->setStartDate(new DateTime($start));
        $p->setEndDate(new DateTime($end));
        $p->setPayDate(new DateTime($end));
        $p->setFinancialYear('2026-27');
        $p->setPeriodMonth($month);
        $p->setPeriodYear($year);
        $p->setCurrency($this->inr);
        return $p;
    }

    private function makeEpfRule(): PayrollStatutoryRule
    {
        $r = new PayrollStatutoryRule();
        $r->setRuleType(PayrollStatutoryRule::RULE_TYPE_EPF);
        $r->setEffectiveFrom(new DateTime('2024-04-01'));
        $r->setEmployeeRate('12.0000');
        $r->setEmployerRate('12.0000');
        $r->setWageCeiling('15000.00');
        $r->setMetadataJson('{"eps_rate":8.33,"epf_diff_rate":3.67}');
        return $r;
    }

    private function makeEsicRule(): PayrollStatutoryRule
    {
        $r = new PayrollStatutoryRule();
        $r->setRuleType(PayrollStatutoryRule::RULE_TYPE_ESIC);
        $r->setEffectiveFrom(new DateTime('2024-04-01'));
        $r->setSlabMin('0.00');
        $r->setSlabMax('21000.00');
        $r->setWageCeiling('21000.00');
        $r->setEmployeeRate('0.7500');
        $r->setEmployerRate('3.2500');
        return $r;
    }

    /** @return PayrollStatutoryRule[] */
    private function makeMhPtRules(): array
    {
        $r1 = new PayrollStatutoryRule();
        $r1->setRuleType(PayrollStatutoryRule::RULE_TYPE_PT);
        $r1->setStateCode('MH');
        $r1->setEffectiveFrom(new DateTime('2024-04-01'));
        $r1->setSlabMin('10000.01');
        $r1->setSlabMax(null);
        $r1->setFixedEmployeeAmount('200.00');
        $r1->setFebruaryEmployeeAmount('300.00');
        return [$r1];
    }

    /** @return PayrollTaxBracket[] */
    private function makeNewRegimeBrackets(): array
    {
        $slabs = [
            [1, '0.00', '400000.00', '0.0000'],
            [2, '400000.00', '800000.00', '5.0000'],
            [3, '800000.00', '1200000.00', '10.0000'],
            [4, '1200000.00', '1600000.00', '15.0000'],
            [5, '1600000.00', '2000000.00', '20.0000'],
            [6, '2000000.00', '2400000.00', '25.0000'],
            [7, '2400000.00', null, '30.0000'],
        ];
        $out = [];
        foreach ($slabs as [$ord, $min, $max, $rate]) {
            $b = new PayrollTaxBracket();
            $b->setFinancialYear('2026-27');
            $b->setTaxRegime(PayrollTaxBracket::REGIME_NEW_115BAC);
            $b->setSlabOrder($ord);
            $b->setMinIncome($min);
            $b->setMaxIncome($max);
            $b->setTaxRate($rate);
            $b->setCessRate('4.0000');
            $b->setRebateLimit('1200000.00');
            $b->setRebateMaxAmount('60000.00');
            $b->setStandardDeduction('75000.00');
            $out[] = $b;
        }
        return $out;
    }

    /** @return PayrollTaxBracket[] */
    private function makeOldRegimeBrackets(): array
    {
        $slabs = [
            [1, '0.00', '250000.00', '0.0000'],
            [2, '250000.00', '500000.00', '5.0000'],
            [3, '500000.00', '1000000.00', '20.0000'],
            [4, '1000000.00', null, '30.0000'],
        ];
        $out = [];
        foreach ($slabs as [$ord, $min, $max, $rate]) {
            $b = new PayrollTaxBracket();
            $b->setFinancialYear('2026-27');
            $b->setTaxRegime(PayrollTaxBracket::REGIME_OLD);
            $b->setSlabOrder($ord);
            $b->setMinIncome($min);
            $b->setMaxIncome($max);
            $b->setTaxRate($rate);
            $b->setCessRate('4.0000');
            $b->setRebateLimit('500000.00');
            $b->setRebateMaxAmount('12500.00');
            $b->setStandardDeduction('50000.00');
            $out[] = $b;
        }
        return $out;
    }
}
