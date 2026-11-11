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

use OrangeHRM\Entity\AttendanceRecord;
use OrangeHRM\Entity\PayrollConfig;
use OrangeHRM\Entity\PayrollPayPeriod;
use OrangeHRM\Entity\TimesheetItem;
use OrangeHRM\ORM\Doctrine;

/**
 * Integrates Time (Timesheets) & Attendance without EVER double-counting hours.
 * Strict mutually-exclusive precedence:
 *   - ATTENDANCE_ONLY (default)
 *   - TIMESHEET_ONLY (APPROVED timesheets only)
 *   - TIMESHEET_PRIMARY_ATTENDANCE_VALIDATION (uses APPROVED timesheets for pay, checks Attendance variance)
 */
class TimeAttendancePayrollAdapter
{
    /**
     * @return array{
     *   workedHours: float,
     *   scheduledHours: float,
     *   overtimeHours: float,
     *   sourceUsed: string,
     *   warnings: string[]
     * }
     */
    public function evaluateWorkedAndOvertimeHours(
        int $empNumber,
        PayrollPayPeriod $period,
        PayrollConfig $config,
        float $workingDays
    ): array {
        $startStr = $period->getStartDate()->format('Y-m-d') . ' 00:00:00';
        $endStr = $period->getEndDate()->format('Y-m-d') . ' 23:59:59';
        $em = Doctrine::getEntityManager();

        // Attendance hours + open punch check
        /** @var AttendanceRecord[] $attendanceRows */
        $attendanceRows = $em->createQuery(
            'SELECT a FROM OrangeHRM\Entity\AttendanceRecord a
             WHERE IDENTITY(a.employee) = :empNumber
               AND a.punchInUtcTime >= :startDt
               AND a.punchInUtcTime <= :endDt'
        )
            ->setParameter('empNumber', $empNumber)
            ->setParameter('startDt', $startStr)
            ->setParameter('endDt', $endStr)
            ->execute();

        $attendanceHours = 0.0;
        $openPunchCount = 0;
        foreach ($attendanceRows as $rec) {
            if ($rec->getState() === AttendanceRecord::STATE_PUNCHED_IN) {
                $openPunchCount++;
                continue;
            }
            if ($rec->getPunchInUtcTime() !== null && $rec->getPunchOutUtcTime() !== null) {
                $secs = max(0, $rec->getPunchOutUtcTime()->getTimestamp() - $rec->getPunchInUtcTime()->getTimestamp());
                $attendanceHours += $secs / 3600.0;
            }
        }
        // Timesheet hours (APPROVED vs SUBMITTED warning check)
        /** @var TimesheetItem[] $tsItems */
        $tsItems = $em->createQuery(
            'SELECT ti FROM OrangeHRM\Entity\TimesheetItem ti
             JOIN ti.timesheet t
             WHERE IDENTITY(t.employee) = :empNumber
               AND ti.date >= :startDate
               AND ti.date <= :endDate'
        )
            ->setParameter('empNumber', $empNumber)
            ->setParameter('startDate', $period->getStartDate()->format('Y-m-d'))
            ->setParameter('endDate', $period->getEndDate()->format('Y-m-d'))
            ->execute();

        $approvedTimesheetHours = 0.0;
        $unapprovedTimesheetHours = 0.0;
        foreach ($tsItems as $item) {
            $hours = ((int)($item->getDuration() ?? 0)) / 3600.0;
            if (strtoupper($item->getTimesheet()->getState()) === 'APPROVED') {
                $approvedTimesheetHours += $hours;
            } else {
                $unapprovedTimesheetHours += $hours;
            }
        }
        return $this->selectWorkedAndOvertimeHours(
            $attendanceHours,
            $approvedTimesheetHours,
            $unapprovedTimesheetHours,
            $openPunchCount,
            $workingDays,
            $config
        );
    }

    /**
     * Pure non-double-counting selector enforcing mutually exclusive Time/Attendance precedence.
     *
     * @return array{
     *   workedHours: float,
     *   scheduledHours: float,
     *   overtimeHours: float,
     *   sourceUsed: string,
     *   warnings: string[]
     * }
     */
    public function selectWorkedAndOvertimeHours(
        float $attendanceHours,
        float $approvedTimesheetHours,
        float $unapprovedTimesheetHours,
        int $openPunchCount,
        float $workingDays,
        PayrollConfig $config
    ): array {
        $warnings = [];
        if ($openPunchCount > 0) {
            $warnings[] = sprintf('OPEN_PUNCHED_IN_RECORDS:%d', $openPunchCount);
        }
        if ($unapprovedTimesheetHours > 0.0) {
            $warnings[] = sprintf('UNAPPROVED_TIMESHEET_HOURS:%.2f', $unapprovedTimesheetHours);
        }

        $mode = $config->getTimeAttendanceSourceMode();
        if ($mode === PayrollConfig::TIME_SOURCE_TIMESHEET_ONLY) {
            $workedHours = $approvedTimesheetHours;
        } elseif ($mode === PayrollConfig::TIME_SOURCE_TIMESHEET_PRIMARY) {
            $workedHours = $approvedTimesheetHours;
            if ($attendanceHours > 0.0 && abs($approvedTimesheetHours - $attendanceHours) > 4.0) {
                $warnings[] = sprintf(
                    'TIME_ATTENDANCE_VARIANCE:%.2f_VS_%.2f',
                    $approvedTimesheetHours,
                    $attendanceHours
                );
            }
        } else {
            // Strict default: ATTENDANCE_ONLY (never adds timesheet hours on top of attendance!)
            $workedHours = $attendanceHours;
        }

        $shiftHours = max(1.0, (float)$config->getStandardShiftHours());
        $scheduledHours = max(0.0, $workingDays * $shiftHours);
        $overtimeHours = $workedHours > $scheduledHours ? ($workedHours - $scheduledHours) : 0.0;

        return [
            'workedHours' => round($workedHours, 2),
            'scheduledHours' => round($scheduledHours, 2),
            'overtimeHours' => round($overtimeHours, 2),
            'sourceUsed' => $mode,
            'warnings' => $warnings,
        ];
    }
}
