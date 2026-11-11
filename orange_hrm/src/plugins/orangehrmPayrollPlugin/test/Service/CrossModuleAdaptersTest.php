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

use OrangeHRM\Entity\PayrollClaimLink;
use OrangeHRM\Entity\PayrollConfig;
use OrangeHRM\Payroll\Dao\PayrollRunDao;
use OrangeHRM\Payroll\Service\ClaimSettlementAdapter;
use OrangeHRM\Payroll\Service\LeavePayrollAdapter;
use OrangeHRM\Payroll\Service\TimeAttendancePayrollAdapter;
use OrangeHRM\Payroll\Util\Money;
use OrangeHRM\Tests\Util\TestCase;

/**
 * @group Payroll
 */
class CrossModuleAdaptersTest extends TestCase
{
    public function testLeaveLwpDivisorModes(): void
    {
        $adapter = new LeavePayrollAdapter();
        $config = new PayrollConfig();
        $monthlyGross = Money::of('30000.00', 'INR');

        // CALENDAR_DAYS in November (30 days): 2 LWP days => 2/30 * 30,000 = Rs.2,000.00
        $config->setLwpDivisorMode(PayrollConfig::LWP_DIVISOR_CALENDAR_DAYS);
        $calRes = $adapter->computeLwpBreakdown(2.0, 1.0, 22.0, 30, $config, $monthlyGross);
        $this->assertSame(30, $calRes['divisorDays']);
        $this->assertSame('2000.00', $calRes['lwpDeduction']->toDatabaseString(2));
        $this->assertSame(28.0, $calRes['payableDays']);

        // WORKING_DAYS (20 days): 2 LWP days => 2/20 * 30,000 = Rs.3,000.00
        $config->setLwpDivisorMode(PayrollConfig::LWP_DIVISOR_WORKING_DAYS);
        $wdRes = $adapter->computeLwpBreakdown(2.0, 0.0, 20.0, 30, $config, $monthlyGross);
        $this->assertSame(20, $wdRes['divisorDays']);
        $this->assertSame('3000.00', $wdRes['lwpDeduction']->toDatabaseString(2));
        $this->assertSame(18.0, $wdRes['payableDays']);
    }

    public function testTimeAndAttendanceNeverDoubleCountsHours(): void
    {
        $adapter = new TimeAttendancePayrollAdapter();
        $config = new PayrollConfig();
        $config->setStandardShiftHours('8.00');

        // 22 working days => 176 scheduled hours. Attendance = 184h, Approved Timesheet = 180h.
        // Mode ATTENDANCE_ONLY MUST use 184h (NOT 184 + 180 = 364h!)
        $config->setTimeAttendanceSourceMode(PayrollConfig::TIME_SOURCE_ATTENDANCE_ONLY);
        $attOnly = $adapter->selectWorkedAndOvertimeHours(184.0, 180.0, 0.0, 0, 22.0, $config);
        $this->assertSame('ATTENDANCE_ONLY', $attOnly['sourceUsed']);
        $this->assertSame(184.0, $attOnly['workedHours']);
        $this->assertSame(8.0, $attOnly['overtimeHours']);

        // Mode TIMESHEET_PRIMARY_ATTENDANCE_VALIDATION uses Timesheet (182h) + emits variance warning vs 172h Attendance
        $config->setTimeAttendanceSourceMode(PayrollConfig::TIME_SOURCE_TIMESHEET_PRIMARY);
        $tsPrimary = $adapter->selectWorkedAndOvertimeHours(172.0, 182.0, 4.0, 1, 22.0, $config);
        $this->assertSame(182.0, $tsPrimary['workedHours']);
        $this->assertSame(6.0, $tsPrimary['overtimeHours']);
        $this->assertContains('OPEN_PUNCHED_IN_RECORDS:1', $tsPrimary['warnings']);
        $this->assertContains('UNAPPROVED_TIMESHEET_HOURS:4.00', $tsPrimary['warnings']);
        $this->assertContains('TIME_ATTENDANCE_VARIANCE:182.00_VS_172.00', $tsPrimary['warnings']);
    }

    public function testClaimReservationLockAndReleaseLifecycle(): void
    {
        $link = new PayrollClaimLink();
        $link->setSettlementStatus(PayrollClaimLink::STATUS_RESERVED);
        $link->setActiveClaimLock(77);

        $dao = $this->createMock(PayrollRunDao::class);
        $dao->method('getClaimLinksForRun')->with(10)->willReturn([$link]);
        $dao->method('getClaimLinksForBatch')->with(5)->willReturn([$link]);
        $dao->expects($this->exactly(3))->method('saveClaimLink')->willReturnArgument(0);

        $adapter = new ClaimSettlementAdapter();
        $adapter->setRunDao($dao);

        // Step 1: Run lock transitions RESERVED -> LOCKED_FOR_PAYMENT (retains lock 77)
        $adapter->lockClaimLinksForRun(10);
        $this->assertSame(PayrollClaimLink::STATUS_LOCKED_FOR_PAYMENT, $link->getSettlementStatus());
        $this->assertSame(77, $link->getActiveClaimLock());

        // Step 2: Payment batch failure releases activeClaimLock to NULL for clean retry!
        $batch = new \OrangeHRM\Entity\PayrollPaymentBatch();
        $ref = new \ReflectionClass($batch);
        $idProp = $ref->getProperty('id');
        $idProp->setAccessible(true);
        $idProp->setValue($batch, 5);

        $adapter->markBatchFailed($batch, 'NEFT_REJECTED_IFSC');
        $this->assertSame(PayrollClaimLink::STATUS_PAYMENT_FAILED, $link->getSettlementStatus());
        $this->assertNull($link->getActiveClaimLock());

        // Step 3: Release on draft recalc keeps non-PAID link released with null lock
        $link->setSettlementStatus(PayrollClaimLink::STATUS_RESERVED);
        $link->setActiveClaimLock(77);
        $adapter->releaseReservationsForRun(10);
        $this->assertSame(PayrollClaimLink::STATUS_RELEASED, $link->getSettlementStatus());
        $this->assertNull($link->getActiveClaimLock());
    }
}

