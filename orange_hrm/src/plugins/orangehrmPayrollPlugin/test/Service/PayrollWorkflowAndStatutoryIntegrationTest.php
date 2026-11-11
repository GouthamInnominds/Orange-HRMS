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
use OrangeHRM\Entity\PayrollEmployeeSnapshot;
use OrangeHRM\Entity\PayrollItem;
use OrangeHRM\Entity\PayrollPaymentBatch;
use OrangeHRM\Entity\PayrollPayPeriod;
use OrangeHRM\Entity\PayrollRecord;
use OrangeHRM\Entity\PayrollRun;
use OrangeHRM\Entity\PayrollStatutoryRule;
use OrangeHRM\Entity\PayrollTaxBracket;
use OrangeHRM\Entity\User;
use OrangeHRM\Payroll\Dao\PayrollRunDao;
use OrangeHRM\Payroll\Exception\PayrollException;
use OrangeHRM\Payroll\Service\IndianStatutoryCalculator;
use OrangeHRM\Payroll\Service\LeavePayrollAdapter;
use OrangeHRM\Payroll\Service\PayrollCalculationService;
use OrangeHRM\Payroll\Service\PayrollConfigService;
use OrangeHRM\Payroll\Service\PayrollPaymentService;
use OrangeHRM\Payroll\Service\PayrollWorkflowService;
use OrangeHRM\Payroll\Service\TimeAttendancePayrollAdapter;
use OrangeHRM\Payroll\Util\Money;
use OrangeHRM\Tests\Util\TestCase;
use ReflectionProperty;

/**
 * @group Payroll
 */
class PayrollWorkflowAndStatutoryIntegrationTest extends TestCase
{
    public function testLeaveLwpDivisorsCalendarWorkingAndFixed30(): void
    {
        $adapter = new LeavePayrollAdapter();
        $gross = Money::of('106250.00', 'INR');

        // 1. India Calendar Days divisor (Nov = 30 days, 1.5 LWP days) -> 106250 * 1.5 / 30 = 5312.50
        $cfgCal = new PayrollConfig();
        $cfgCal->setLwpDivisorMode(PayrollConfig::LWP_DIVISOR_CALENDAR_DAYS);
        $resCal = $adapter->computeLwpBreakdown(1.5, 1.0, 21.0, 30, $cfgCal, $gross);
        $this->assertSame(30, $resCal['divisorDays']);
        $this->assertSame('5312.50', $resCal['lwpDeduction']->toDatabaseString(2));
        $this->assertEquals(28.5, $resCal['payableDays']);

        // 2. Working Days divisor (21 working days, 1.0 LWP day) -> 106250 / 21 = 5059.52
        $cfgWork = new PayrollConfig();
        $cfgWork->setLwpDivisorMode(PayrollConfig::LWP_DIVISOR_WORKING_DAYS);
        $resWork = $adapter->computeLwpBreakdown(1.0, 0.0, 21.0, 30, $cfgWork, $gross);
        $this->assertSame(21, $resWork['divisorDays']);
        $this->assertSame('5059.52', $resWork['lwpDeduction']->toDatabaseString(2));
        $this->assertEquals(20.0, $resWork['payableDays']);

        // 3. Clamping when LWP exceeds divisor days -> payableDays cannot go negative
        $cfg30 = new PayrollConfig();
        $cfg30->setLwpDivisorMode(PayrollConfig::LWP_DIVISOR_FIXED_30);
        $resExcess = $adapter->computeLwpBreakdown(40.0, 0.0, 21.0, 31, $cfg30, $gross);
        $this->assertSame(30, $resExcess['divisorDays']);
        $this->assertSame('106250.00', $resExcess['lwpDeduction']->toDatabaseString(2));
    }

    public function testTimeAttendanceNonDoubleCountingAndVarianceWarnings(): void
    {
        $adapter = new TimeAttendancePayrollAdapter();

        // ATTENDANCE_ONLY ignores timesheet hours so 176 attendance + 176 timesheet does NOT become 352h!
        $cfgAtt = new PayrollConfig();
        $cfgAtt->setStandardShiftHours('8.00');
        $cfgAtt->setTimeAttendanceSourceMode(PayrollConfig::TIME_SOURCE_ATTENDANCE_ONLY);
        $attOnly = $adapter->selectWorkedAndOvertimeHours(176.0, 176.0, 4.5, 2, 21.0, $cfgAtt);
        $this->assertSame('ATTENDANCE_ONLY', $attOnly['sourceUsed']);
        $this->assertEquals(176.0, $attOnly['workedHours']);
        $this->assertEquals(168.0, $attOnly['scheduledHours']);
        $this->assertEquals(8.0, $attOnly['overtimeHours']);
        $this->assertContains('OPEN_PUNCHED_IN_RECORDS:2', $attOnly['warnings']);
        $this->assertContains('UNAPPROVED_TIMESHEET_HOURS:4.50', $attOnly['warnings']);

        // TIMESHEET_PRIMARY uses approved timesheets and warns on >4h variance vs attendance
        $cfgTsPrim = new PayrollConfig();
        $cfgTsPrim->setStandardShiftHours('8.00');
        $cfgTsPrim->setTimeAttendanceSourceMode(PayrollConfig::TIME_SOURCE_TIMESHEET_PRIMARY);
        $tsPrim = $adapter->selectWorkedAndOvertimeHours(168.0, 180.0, 0.0, 0, 21.0, $cfgTsPrim);
        $this->assertSame(PayrollConfig::TIME_SOURCE_TIMESHEET_PRIMARY, $tsPrim['sourceUsed']);
        $this->assertEquals(180.0, $tsPrim['workedHours']);
        $this->assertEquals(12.0, $tsPrim['overtimeHours']);
        $this->assertContains('TIME_ATTENDANCE_VARIANCE:180.00_VS_168.00', $tsPrim['warnings']);
    }

    public function testSec87ARebateThresholdEpfCapAndYtdReconciliation(): void
    {
        $calc = new IndianStatutoryCalculator();
        $inr = new CurrencyType();
        $inr->setId('INR');
        $inr->setName('Indian Rupee');

        $cfg = new PayrollConfig();
        $cfg->setJurisdictionCode('IN');
        $cfg->setDefaultTaxRegime('NEW_115BAC');
        $cfg->setDefaultPtStateCode('KA');
        $cfg->setEpfCapAtCeiling(true);
        $cfg->setEpfWageCeiling('15000.00');
        $cfg->setEsicGrossCeiling('21000.00');

        $apr = new PayrollPayPeriod();
        $apr->setName('April 2026');
        $apr->setStartDate(new DateTime('2026-04-01'));
        $apr->setEndDate(new DateTime('2026-04-30'));
        $apr->setPayDate(new DateTime('2026-04-30'));
        $apr->setFinancialYear('2026-27');
        $apr->setPeriodMonth(4);
        $apr->setPeriodYear(2026);
        $apr->setCurrency($inr);

        $epfRule = new PayrollStatutoryRule();
        $epfRule->setRuleType(PayrollStatutoryRule::RULE_TYPE_EPF);
        $epfRule->setEffectiveFrom(new DateTime('2024-04-01'));
        $epfRule->setEmployeeRate('12.0000');
        $epfRule->setEmployerRate('12.0000');
        $epfRule->setWageCeiling('15000.00');
        $epfRule->setMetadataJson('{"eps_rate":8.33,"epf_diff_rate":3.67}');

        $brackets = [];
        foreach ([
            [1, '0.00', '400000.00', '0.0000'],
            [2, '400000.00', '800000.00', '5.0000'],
            [3, '800000.00', '1200000.00', '10.0000'],
            [4, '1200000.00', '1600000.00', '15.0000'],
        ] as [$ord, $min, $max, $rate]) {
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
            $brackets[] = $b;
        }

        // CTC Rs.12,84,000 (Rs.1,07,000/mo) => Taxable Rs.12,09,000 > Rs.12,00,000 => No 87A rebate
        // Base Tax = 20,000 + 40,000 + 1,350 = 61,350; + 4% Cess (2,454) = 63,804 annual => Rs.5,317/mo
        // Also Basic = Rs.53,500 > Rs.15,000 => EPF restricted to Rs.15,000 -> Rs.1,800 EE / Rs.1,800 ER (1,250 EPS + 550 Diff)
        $res = $calc->calculateBreakdown(
            $apr,
            $cfg,
            Money::of('107000.00', 'INR'),
            ['taxRegime' => 'NEW_115BAC', 'ptStateCode' => 'KA', 'epfOptedIn' => true, 'epfRestrictToCeiling' => true, 'esicApplicable' => true, 'ptApplicable' => false],
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            0,
            new DateTime('2024-01-01'),
            [$epfRule],
            [],
            [],
            $brackets
        );
        $this->assertSame('1800.00', $res['epfEmployee']->toDatabaseString(2));
        $this->assertSame('1800.00', $res['epfEmployer']->toDatabaseString(2));
        $this->assertSame('1250.00', $res['epfEmployerEps']->toDatabaseString(2));
        $this->assertSame('550.00', $res['epfEmployerDiff']->toDatabaseString(2));
        $this->assertSame('1209000.00', $res['projectedAnnualTaxable']->toDatabaseString(2));
        $this->assertSame('63804.00', $res['projectedAnnualTax']->toDatabaseString(2));
        $this->assertSame('5317.00', $res['totalTax']->toDatabaseString(2));
        $this->assertSame($res['incomeTaxTds']->add($res['healthEducationCess'])->toDatabaseString(2), $res['totalTax']->toDatabaseString(2));

        // November mid-FY YTD reconciliation (Nov = FY month 8, remainingMonthsInclusive = 5):
        // With 7 prior runs summing Rs.7,49,000 + Nov Rs.1,07,000 + 4 remaining * 1,07,000 = Rs.12,84,000
        // Annual tax Rs.63,804 minus Rs.38,804 YTD TDS paid => Rs.25,000 / 5 remaining months = Rs.5,000.00/mo!
        $nov = clone $apr;
        $nov->setName('November 2026');
        $nov->setStartDate(new DateTime('2026-11-01'));
        $nov->setEndDate(new DateTime('2026-11-30'));
        $nov->setPayDate(new DateTime('2026-12-01'));
        $nov->setPeriodMonth(11);
        $novYtd = $calc->calculateBreakdown(
            $nov,
            $cfg,
            Money::of('107000.00', 'INR'),
            ['taxRegime' => 'NEW_115BAC', 'ptStateCode' => 'KA', 'epfOptedIn' => false, 'esicApplicable' => false, 'ptApplicable' => false],
            Money::zero('INR'),
            Money::zero('INR'),
            Money::zero('INR'),
            Money::of('749000.00', 'INR'),
            Money::of('38804.00', 'INR'),
            7,
            new DateTime('2024-01-01'),
            [],
            [],
            [],
            $brackets
        );
        $this->assertSame('5000.00', $novYtd['totalTax']->toDatabaseString(2));
    }

    public function testWorkflowSeparationOfDutiesAndLifecycleGuards(): void
    {
        $maker = new User();
        $maker->setId(1);
        $checker = new User();
        $checker->setId(8);

        $cfg = new PayrollConfig();
        $cfg->setJurisdictionCode('IN');
        $cfg->setRequireMakerCheckerApproval(true);

        $period = new PayrollPayPeriod();
        $period->setJurisdictionCode('IN');

        $run = new PayrollRun();
        $this->injectPrivateProperty($run, 'id', 101);
        $run->setPayPeriod($period);
        $run->setStatus(PayrollRun::STATUS_SUBMITTED_FOR_APPROVAL);
        $run->setCreatedBy($maker);
        $run->setSubmittedBy($maker);

        $runDao = $this->createMock(PayrollRunDao::class);
        $runDao->method('getRunById')->willReturn($run);

        $cfgService = $this->createMock(PayrollConfigService::class);
        $cfgService->method('getConfig')->willReturn($cfg);

        $workflow = new PayrollWorkflowService();
        $this->injectPrivateProperty($workflow, 'runDao', $runDao);
        $this->injectPrivateProperty($workflow, 'configService', $cfgService);

        // 1. Maker trying to self-approve must fail with 403 SoD violation!
        try {
            $workflow->approveRun(101, $maker, 'Self approve attempt');
            $this->fail('Expected PayrollException on SoD violation');
        } catch (PayrollException $e) {
            $this->assertSame(PayrollException::CODE_SOD_VIOLATION, $e->getErrorCode());
            $this->assertSame(403, $e->getCode());
        }

        // 2. Rejecting without mandatory reason must fail 422
        try {
            $workflow->rejectRun(101, $checker, '   ');
            $this->fail('Expected PayrollException for blank reject reason');
        } catch (PayrollException $e) {
            $this->assertSame(PayrollException::CODE_PREREQUISITE_BLOCKED, $e->getErrorCode());
            $this->assertSame(422, $e->getCode());
        }

        // 3. Locking before APPROVED must fail 409 invalid transition
        try {
            $workflow->lockRun(101, $checker);
            $this->fail('Expected PayrollException for locking non-APPROVED run');
        } catch (PayrollException $e) {
            $this->assertSame(PayrollException::CODE_INVALID_STATE_TRANSITION, $e->getErrorCode());
            $this->assertSame(409, $e->getCode());
        }

        // 4. Reversing a LOCKED run that has a PAID_RECONCILED batch must fail 422
        $run->setStatus(PayrollRun::STATUS_LOCKED);
        $paidBatch = new PayrollPaymentBatch();
        $paidBatch->setBatchReference('NEFT-202611-R101');
        $paidBatch->setStatus(PayrollPaymentBatch::STATUS_PAID_RECONCILED);
        $runDao->method('getPaymentBatchList')->willReturn([$paidBatch]);
        try {
            $workflow->reverseRun(101, $checker, 'After-payment reversal blocked');
            $this->fail('Expected PayrollException when reversing paid run');
        } catch (PayrollException $e) {
            $this->assertSame(PayrollException::CODE_PREREQUISITE_BLOCKED, $e->getErrorCode());
            $this->assertSame(422, $e->getCode());
        }

        // 5. Creating payment batch for non-LOCKED run must fail 422
        $run->setStatus(PayrollRun::STATUS_APPROVED);
        $paymentSvc = new PayrollPaymentService();
        $this->injectPrivateProperty($paymentSvc, 'runDao', $runDao);
        try {
            $paymentSvc->createPaymentBatch(101, 'NEFT', $checker);
            $this->fail('Expected PayrollException when creating batch for non-LOCKED run');
        } catch (PayrollException $e) {
            $this->assertSame(PayrollException::CODE_PREREQUISITE_BLOCKED, $e->getErrorCode());
            $this->assertSame(422, $e->getCode());
        }
    }

    public function testHtmlPayslipMasksBankAccountAndFormatsInrSafely(): void
    {
        $period = new PayrollPayPeriod();
        $period->setName('November 2026');

        $run = new PayrollRun();
        $run->setCalculationVersion('v2.2-IN-FY26');
        $run->setPayPeriod($period);

        $snapshot = new PayrollEmployeeSnapshot();
        $snapshot->setFullName('Aarav Sharma');
        $snapshot->setEmployeeCode('EMP-IN-001');
        $snapshot->setDepartmentName('Engineering');
        $snapshot->setJobTitleName('Senior Engineer');
        $snapshot->setPtStateCode('KA');
        $snapshot->setSnapshotPayloadJson(json_encode([
            'profile' => ['maskedBankAccount' => 'XXXX5678'],
        ]));

        $record = new PayrollRecord();
        $record->setPayPeriod($period);
        $record->setPayrollRun($run);
        $record->setStatus(PayrollRecord::STATUS_LOCKED);
        $record->setTaxRegime('NEW_115BAC');
        $record->setWorkingDays('21.00');
        $record->setPayableDays('29.00');
        $record->setLwpDays('1.00');
        $record->setLwpDeduction('3541.67');
        $record->setGrossSalary('102708.33');
        $record->setTotalDeduction('2000.00');
        $record->setReimbursementAmount('3450.00');
        $record->setNetSalary('104158.33');

        $item = new PayrollItem();
        $item->setItemType(PayrollItem::TYPE_EARNING);
        $item->setComponentName('Basic Salary');
        $item->setAmount('51354.17');
        $record->addItem($item);

        $html = PayrollCalculationService::renderHtmlPayslip($record, $snapshot, 'SLP-202611-R1-E0002');
        $this->assertStringContainsString('Aarav Sharma (EMP-IN-001)', $html);
        $this->assertStringContainsString('XXXX5678', $html);
        $this->assertStringContainsString('PUBLISHED / FINAL', $html);
        $this->assertStringContainsString('&#8377;104,158.33', $html);
        $this->assertStringContainsString('LWP Days: 1.00', $html);
    }

    private function injectPrivateProperty(object $target, string $prop, $value): void
    {
        $rp = new ReflectionProperty($target, $prop);
        $rp->setAccessible(true);
        $rp->setValue($target, $value);
    }
}
