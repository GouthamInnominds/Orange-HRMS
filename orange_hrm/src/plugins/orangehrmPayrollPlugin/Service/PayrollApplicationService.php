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
use OrangeHRM\Entity\PayrollPayPeriod;
use OrangeHRM\Entity\PayrollRun;
use OrangeHRM\Entity\User;
use OrangeHRM\Payroll\Dao\PayrollConfigDao;
use OrangeHRM\Payroll\Dao\PayrollPeriodDao;
use OrangeHRM\Payroll\Dao\PayrollRunDao;
use OrangeHRM\Payroll\Dto\PayrollRunSearchFilterParams;
use OrangeHRM\Payroll\Exception\PayrollException;

/**
 * Application orchestration for Pay Period CRUD (with overlap validation)
 * and Idempotent PayrollRun lifecycle initialization.
 */
class PayrollApplicationService
{
    private ?PayrollPeriodDao $periodDao = null;
    private ?PayrollRunDao $runDao = null;
    private ?PayrollConfigDao $configDao = null;
    private ?PayrollConfigService $configService = null;
    private ?LeavePayrollAdapter $leaveAdapter = null;

    public function getPeriodDao(): PayrollPeriodDao
    {
        return $this->periodDao ??= new PayrollPeriodDao();
    }

    public function getRunDao(): PayrollRunDao
    {
        return $this->runDao ??= new PayrollRunDao();
    }

    public function getConfigDao(): PayrollConfigDao
    {
        return $this->configDao ??= new PayrollConfigDao();
    }

    public function getConfigService(): PayrollConfigService
    {
        return $this->configService ??= new PayrollConfigService();
    }

    public function getLeaveAdapter(): LeavePayrollAdapter
    {
        return $this->leaveAdapter ??= new LeavePayrollAdapter();
    }

    public function createPayPeriod(array $payload, ?User $actor = null): PayrollPayPeriod
    {
        $startDate = new DateTime($payload['startDate']);
        $endDate = new DateTime($payload['endDate']);
        $payDate = isset($payload['payDate']) ? new DateTime($payload['payDate']) : clone $endDate;

        if ($endDate < $startDate) {
            throw PayrollException::prerequisiteBlocked('Pay period end date cannot be earlier than start date.');
        }

        $jurisdiction = strtoupper((string)($payload['jurisdictionCode'] ?? 'IN'));
        $overlaps = $this->getPeriodDao()->findOverlappingPeriods($startDate, $endDate, $jurisdiction);
        if (!empty($overlaps)) {
            throw PayrollException::periodOverlap($startDate->format('Y-m-d'), $endDate->format('Y-m-d'));
        }

        $currencyCode = strtoupper((string)($payload['currencyId'] ?? 'INR'));
        $currency = $this->getConfigDao()->getCurrencyById($currencyCode);
        if ($currency === null) {
            throw new PayrollException(sprintf('Currency "%s" not found.', $currencyCode), PayrollException::CODE_NOT_FOUND, [], 404);
        }

        $workingDays = isset($payload['standardWorkingDays'])
            ? (float)$payload['standardWorkingDays']
            : $this->getLeaveAdapter()->countWorkingDaysInRange($startDate, $endDate);

        $period = new PayrollPayPeriod();
        $period->setName(trim((string)$payload['name']));
        $period->setStartDate($startDate);
        $period->setEndDate($endDate);
        $period->setPayDate($payDate);
        $period->setFrequency(strtoupper((string)($payload['frequency'] ?? 'MONTHLY')));
        $period->setStatus(PayrollPayPeriod::STATUS_OPEN);
        $period->setJurisdictionCode($jurisdiction);
        $period->setFinancialYear((string)($payload['financialYear'] ?? $this->deriveIndianFinancialYear($startDate)));
        $period->setPeriodMonth((int)($payload['periodMonth'] ?? $endDate->format('n')));
        $period->setPeriodYear((int)($payload['periodYear'] ?? $endDate->format('Y')));
        $period->setCurrency($currency);
        $period->setStandardWorkingDays(number_format(max(1.0, $workingDays), 2, '.', ''));
        $period->setCreatedBy($actor);

        $saved = $this->getPeriodDao()->savePayPeriod($period);
        $this->getConfigService()->recordAudit(
            'PAY_PERIOD_CREATED',
            'PayrollPayPeriod',
            $saved->getId(),
            null,
            $actor,
            null,
            [
                'name' => $saved->getName(),
                'startDate' => $saved->getStartDate()->format('Y-m-d'),
                'endDate' => $saved->getEndDate()->format('Y-m-d'),
                'financialYear' => $saved->getFinancialYear(),
            ]
        );

        return $saved;
    }

    public function updatePayPeriod(int $id, array $payload, ?User $actor = null): PayrollPayPeriod
    {
        $period = $this->getPeriodDao()->getPayPeriodById($id);
        if ($period === null) {
            throw new PayrollException(sprintf('Pay period #%d not found.', $id), PayrollException::CODE_NOT_FOUND, [], 404);
        }
        if (in_array($period->getStatus(), [PayrollPayPeriod::STATUS_LOCKED, PayrollPayPeriod::STATUS_CLOSED], true)) {
            throw new PayrollException(
                sprintf('Pay period "%s" is %s and cannot be modified.', $period->getName(), $period->getStatus()),
                PayrollException::CODE_IMMUTABLE_RECORD,
                [],
                409
            );
        }

        $before = [
            'name' => $period->getName(),
            'startDate' => $period->getStartDate()->format('Y-m-d'),
            'endDate' => $period->getEndDate()->format('Y-m-d'),
            'payDate' => $period->getPayDate()->format('Y-m-d'),
        ];

        $startDate = isset($payload['startDate']) ? new DateTime($payload['startDate']) : $period->getStartDate();
        $endDate = isset($payload['endDate']) ? new DateTime($payload['endDate']) : $period->getEndDate();
        if ($endDate < $startDate) {
            throw PayrollException::prerequisiteBlocked('Pay period end date cannot be earlier than start date.');
        }

        $overlaps = $this->getPeriodDao()->findOverlappingPeriods($startDate, $endDate, $period->getJurisdictionCode(), $id);
        if (!empty($overlaps)) {
            throw PayrollException::periodOverlap($startDate->format('Y-m-d'), $endDate->format('Y-m-d'));
        }

        if (isset($payload['name'])) {
            $period->setName(trim((string)$payload['name']));
        }
        $period->setStartDate($startDate);
        $period->setEndDate($endDate);
        if (isset($payload['payDate'])) {
            $period->setPayDate(new DateTime($payload['payDate']));
        }
        if (isset($payload['standardWorkingDays'])) {
            $period->setStandardWorkingDays(number_format((float)$payload['standardWorkingDays'], 2, '.', ''));
        }
        if (isset($payload['financialYear'])) {
            $period->setFinancialYear((string)$payload['financialYear']);
        }
        $period->setPeriodMonth((int)$endDate->format('n'));
        $period->setPeriodYear((int)$endDate->format('Y'));

        $saved = $this->getPeriodDao()->savePayPeriod($period);
        $this->getConfigService()->recordAudit(
            'PAY_PERIOD_UPDATED',
            'PayrollPayPeriod',
            $saved->getId(),
            null,
            $actor,
            $before,
            [
                'name' => $saved->getName(),
                'startDate' => $saved->getStartDate()->format('Y-m-d'),
                'endDate' => $saved->getEndDate()->format('Y-m-d'),
                'payDate' => $saved->getPayDate()->format('Y-m-d'),
            ]
        );
        return $saved;
    }

    public function deletePayPeriod(int $id, ?User $actor = null): void
    {
        $period = $this->getPeriodDao()->getPayPeriodById($id);
        if ($period === null) {
            throw new PayrollException(sprintf('Pay period #%d not found.', $id), PayrollException::CODE_NOT_FOUND, [], 404);
        }

        $fp = new PayrollRunSearchFilterParams();
        $fp->setPayPeriodId($id);
        if ($this->getRunDao()->getRunCount($fp) > 0) {
            throw PayrollException::prerequisiteBlocked(
                sprintf('Cannot delete pay period "%s" because payroll runs already exist for it.', $period->getName())
            );
        }

        $this->getPeriodDao()->deletePayPeriod($id);
        $this->getConfigService()->recordAudit(
            'PAY_PERIOD_DELETED',
            'PayrollPayPeriod',
            $id,
            null,
            $actor,
            ['name' => $period->getName()],
            null
        );
    }

    public function createOrGetRun(
        int $payPeriodId,
        ?string $idempotencyKey = null,
        string $runType = PayrollRun::RUN_TYPE_REGULAR,
        ?User $actor = null
    ): PayrollRun {
        if ($idempotencyKey !== null && trim($idempotencyKey) !== '') {
            $existing = $this->getRunDao()->getRunByIdempotencyKey(trim($idempotencyKey));
            if ($existing !== null) {
                return $existing;
            }
        }

        $period = $this->getPeriodDao()->getPayPeriodById($payPeriodId);
        if ($period === null) {
            throw new PayrollException(sprintf('Pay period #%d not found.', $payPeriodId), PayrollException::CODE_NOT_FOUND, [], 404);
        }
        if (in_array($period->getStatus(), [PayrollPayPeriod::STATUS_LOCKED, PayrollPayPeriod::STATUS_CLOSED], true)) {
            throw PayrollException::prerequisiteBlocked(
                sprintf('Cannot create a new payroll run for %s period "%s".', $period->getStatus(), $period->getName())
            );
        }

        // Prevent creating duplicate active non-cancelled/non-reversed run if one already exists
        $latest = $this->getRunDao()->getLatestRunForPeriod($payPeriodId);
        if ($latest !== null && !in_array($latest->getStatus(), [PayrollRun::STATUS_REVERSED, PayrollRun::STATUS_CANCELLED], true)) {
            return $latest;
        }

        $run = new PayrollRun();
        $run->setPayPeriod($period);
        $run->setRunVersion($this->getRunDao()->getNextRunVersion($payPeriodId));
        $run->setRunType($runType);
        $run->setStatus(PayrollRun::STATUS_DRAFT);
        $run->setCalculationVersion('IN-FY' . $period->getFinancialYear() . '-v2.2');
        $run->setIdempotencyKey($idempotencyKey !== null && trim($idempotencyKey) !== '' ? trim($idempotencyKey) : null);
        $run->setCreatedBy($actor);

        $saved = $this->getRunDao()->saveRun($run);
        $this->getConfigService()->recordAudit(
            'RUN_CREATED',
            'PayrollRun',
            $saved->getId(),
            null,
            $actor,
            null,
            ['payPeriodId' => $payPeriodId, 'runVersion' => $saved->getRunVersion(), 'runType' => $runType],
            $saved
        );

        return $saved;
    }

    public function deriveIndianFinancialYear(DateTime $date): string
    {
        $year = (int)$date->format('Y');
        $month = (int)$date->format('n');
        $fyStart = $month >= 4 ? $year : ($year - 1);
        $fyEndShort = ($fyStart + 1) % 100;
        return sprintf('%04d-%02d', $fyStart, $fyEndShort);
    }
}

