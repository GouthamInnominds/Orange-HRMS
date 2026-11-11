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

use DateInterval;
use DatePeriod;
use DateTime;
use OrangeHRM\Entity\Leave;
use OrangeHRM\Entity\PayrollConfig;
use OrangeHRM\Entity\PayrollLeavePolicy;
use OrangeHRM\Entity\PayrollPayPeriod;
use OrangeHRM\Leave\Service\HolidayService;
use OrangeHRM\Leave\Service\WorkWeekService;
use OrangeHRM\ORM\Doctrine;
use OrangeHRM\Payroll\Dao\PayrollConfigDao;
use OrangeHRM\Payroll\Util\Money;

/**
 * Integrates OrangeHRM Leave module cleanly into Payroll:
 * - Reads APPROVED (2) & TAKEN (3) Leave rows
 * - Consults explicit PayrollLeavePolicy (never misuses LeaveType::$situational)
 * - Uses WorkWeekService & HolidayService for working-day calculations
 * - Supports configurable LWP divisor (CALENDAR_DAYS | WORKING_DAYS | FIXED_30)
 */
class LeavePayrollAdapter
{
    private ?PayrollConfigDao $configDao = null;
    private ?WorkWeekService $workWeekService = null;
    private ?HolidayService $holidayService = null;

    public function getConfigDao(): PayrollConfigDao
    {
        if ($this->configDao === null) {
            $this->configDao = new PayrollConfigDao();
        }
        return $this->configDao;
    }

    public function getWorkWeekService(): WorkWeekService
    {
        if ($this->workWeekService === null) {
            $this->workWeekService = new WorkWeekService();
        }
        return $this->workWeekService;
    }

    public function getHolidayService(): HolidayService
    {
        if ($this->holidayService === null) {
            $this->holidayService = new HolidayService();
        }
        return $this->holidayService;
    }

    /**
     * @return array{
     *   workingDays: float,
     *   calendarDays: int,
     *   divisorDays: int,
     *   lwpDays: float,
     *   paidLeaveDays: float,
     *   payableDays: float,
     *   lwpDeduction: Money,
     *   warnings: string[]
     * }
     */
    public function evaluateLeaveImpact(
        int $empNumber,
        PayrollPayPeriod $period,
        PayrollConfig $config,
        Money $monthlyGrossSalary
    ): array {
        $start = clone $period->getStartDate();
        $end = clone $period->getEndDate();
        $calendarDays = (int)$start->diff($end)->days + 1;
        $workingDays = $this->countWorkingDaysInRange($start, $end);
        if ($workingDays <= 0.0) {
            $workingDays = (float)$period->getStandardWorkingDays();
        }

        $em = Doctrine::getEntityManager();
        /** @var Leave[] $leaves */
        $leaves = $em->createQuery(
            'SELECT l FROM OrangeHRM\Entity\Leave l
             WHERE IDENTITY(l.employee) = :empNumber
               AND l.date >= :startDate
               AND l.date <= :endDate'
        )
            ->setParameter('empNumber', $empNumber)
            ->setParameter('startDate', $start->format('Y-m-d'))
            ->setParameter('endDate', $end->format('Y-m-d'))
            ->execute();

        $policies = $this->getConfigDao()->getLeavePoliciesKeyedByTypeId();
        $lwpDays = 0.0;
        $paidLeaveDays = 0.0;
        $pendingLeaveCount = 0;
        $warnings = [];

        foreach ($leaves as $leave) {
            $status = $leave->getStatus();
            if ($status === Leave::LEAVE_STATUS_LEAVE_PENDING_APPROVAL) {
                $pendingLeaveCount++;
                continue;
            }
            if (!in_array($status, [Leave::LEAVE_STATUS_LEAVE_APPROVED, Leave::LEAVE_STATUS_LEAVE_TAKEN], true)) {
                continue;
            }

            $lengthDays = (float)($leave->getLengthDays() ?? 1.0);
            $leaveType = $leave->getLeaveType();
            $policy = $policies[$leaveType->getId()] ?? null;

            $multiplier = 0.0;
            if ($policy !== null) {
                $multiplier = (float)$policy->getDeductionMultiplier();
            } else {
                // Fallback only if leave type policy row wasn't seeded yet
                $nameLower = strtolower($leaveType->getName());
                if (str_contains($nameLower, 'unpaid') || str_contains($nameLower, 'lwp') || str_contains($nameLower, 'loss of pay')) {
                    $multiplier = 1.0;
                }
            }

            if ($multiplier > 0.0) {
                $lwpDays += $lengthDays * $multiplier;
            } else {
                $paidLeaveDays += $lengthDays;
            }
        }

        if ($pendingLeaveCount > 0) {
            $warnings[] = sprintf('PENDING_LEAVE_APPROVAL_COUNT:%d', $pendingLeaveCount);
        }

        return $this->computeLwpBreakdown(
            $lwpDays,
            $paidLeaveDays,
            $workingDays,
            $calendarDays,
            $config,
            $monthlyGrossSalary,
            $warnings
        );
    }

    /**
     * Pure LWP & payable-days calculator for configurable divisor modes (CALENDAR_DAYS | WORKING_DAYS | FIXED_30).
     *
     * @param string[] $warnings
     * @return array{
     *   workingDays: float,
     *   calendarDays: int,
     *   divisorDays: int,
     *   lwpDays: float,
     *   paidLeaveDays: float,
     *   payableDays: float,
     *   lwpDeduction: Money,
     *   warnings: string[]
     * }
     */
    public function computeLwpBreakdown(
        float $lwpDays,
        float $paidLeaveDays,
        float $workingDays,
        int $calendarDays,
        PayrollConfig $config,
        Money $monthlyGrossSalary,
        array $warnings = []
    ): array {
        $divisorMode = $config->getLwpDivisorMode();
        $divisorDays = match ($divisorMode) {
            PayrollConfig::LWP_DIVISOR_WORKING_DAYS => max(1, (int)round($workingDays)),
            PayrollConfig::LWP_DIVISOR_FIXED_30 => 30,
            default => max(1, $calendarDays), // CALENDAR_DAYS India best practice
        };

        $effectiveLwp = min((float)$divisorDays, max(0.0, $lwpDays));
        $payableDays = max(0.0, ($divisorMode === PayrollConfig::LWP_DIVISOR_WORKING_DAYS ? $workingDays : (float)$calendarDays) - $effectiveLwp);

        $lwpScaledNumerator = (int)round($effectiveLwp * 1000);
        $lwpScaledDenominator = $divisorDays * 1000;
        $lwpDeduction = $lwpScaledNumerator > 0
            ? $monthlyGrossSalary->multiplyRatio($lwpScaledNumerator, $lwpScaledDenominator)->roundHalfUp(2)
            : Money::zero($monthlyGrossSalary->getCurrencyCode());

        return [
            'workingDays' => round($workingDays, 2),
            'calendarDays' => $calendarDays,
            'divisorDays' => $divisorDays,
            'lwpDays' => round($effectiveLwp, 2),
            'paidLeaveDays' => round($paidLeaveDays, 2),
            'payableDays' => round($payableDays, 2),
            'lwpDeduction' => $lwpDeduction,
            'warnings' => $warnings,
        ];
    }

    public function countWorkingDaysInRange(DateTime $start, DateTime $end): float
    {
        $endInclusive = (clone $end)->modify('+1 day');
        $interval = new DateInterval('P1D');
        $range = new DatePeriod($start, $interval, $endInclusive);

        $holidayDates = [];
        try {
            $holidays = $this->getHolidayService()->getHolidayDao()->searchHolidays(
                (function () use ($start, $end) {
                    $fp = new \OrangeHRM\Leave\Dto\HolidaySearchFilterParams();
                    $fp->setFromDate($start);
                    $fp->setToDate($end);
                    return $fp;
                })()
            );
            foreach ($holidays as $h) {
                if ($h->getDate() !== null) {
                    $holidayDates[$h->getDate()->format('Y-m-d')] = (int)$h->getLength();
                }
            }
        } catch (\Throwable $e) {
            // Gracefully fallback if holiday cache/query empty
        }

        $wwDao = $this->getWorkWeekService()->getWorkWeekDao();
        $days = 0.0;
        /** @var DateTime $dt */
        foreach ($range as $dt) {
            $dateKey = $dt->format('Y-m-d');
            if (isset($holidayDates[$dateKey])) {
                continue;
            }
            try {
                if ($wwDao->isNonWorkingDay($dt, true)) {
                    continue;
                }
                if ($wwDao->isNonWorkingDay($dt, false)) {
                    $days += 0.5;
                    continue;
                }
            } catch (\Throwable $e) {
                $dow = (int)$dt->format('N');
                if ($dow >= 6) {
                    continue;
                }
            }
            $days += 1.0;
        }
        return $days;
    }
}
