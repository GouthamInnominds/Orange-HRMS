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

namespace OrangeHRM\Payroll\Dao;

use DateTime;
use OrangeHRM\Core\Dao\BaseDao;
use OrangeHRM\Entity\PayrollApproval;
use OrangeHRM\Entity\PayrollAuditEvent;
use OrangeHRM\Entity\PayrollClaimLink;
use OrangeHRM\Entity\PayrollEmployeeSnapshot;
use OrangeHRM\Entity\PayrollPaymentBatch;
use OrangeHRM\Entity\PayrollRecord;
use OrangeHRM\Entity\PayrollRun;
use OrangeHRM\Entity\SalarySlip;
use OrangeHRM\ORM\Paginator;
use OrangeHRM\Payroll\Dto\PayrollAuditSearchFilterParams;
use OrangeHRM\Payroll\Dto\PayrollPaymentBatchSearchFilterParams;
use OrangeHRM\Payroll\Dto\PayrollRecordSearchFilterParams;
use OrangeHRM\Payroll\Dto\PayrollRunSearchFilterParams;
use OrangeHRM\Payroll\Dto\SalarySlipSearchFilterParams;

class PayrollRunDao extends BaseDao
{
    public function getRunById(int $id): ?PayrollRun
    {
        return $this->getRepository(PayrollRun::class)->find($id);
    }

    public function getRunByIdempotencyKey(string $idempotencyKey): ?PayrollRun
    {
        return $this->getRepository(PayrollRun::class)->findOneBy(['idempotencyKey' => $idempotencyKey]);
    }

    public function getLatestRunForPeriod(int $payPeriodId): ?PayrollRun
    {
        return $this->createQueryBuilder(PayrollRun::class, 'run')
            ->andWhere('IDENTITY(run.payPeriod) = :periodId')
            ->setParameter('periodId', $payPeriodId)
            ->addOrderBy('run.runVersion', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getNextRunVersion(int $payPeriodId): int
    {
        $max = $this->createQueryBuilder(PayrollRun::class, 'run')
            ->select('MAX(run.runVersion)')
            ->andWhere('IDENTITY(run.payPeriod) = :periodId')
            ->setParameter('periodId', $payPeriodId)
            ->getQuery()
            ->getSingleScalarResult();
        return ((int)$max) + 1;
    }

    public function saveRun(PayrollRun $run): PayrollRun
    {
        $run->setUpdatedAt(new DateTime());
        $this->persist($run);
        return $run;
    }

    /**
     * @return PayrollRun[]
     */
    public function getRunList(PayrollRunSearchFilterParams $filterParams): array
    {
        return $this->getRunPaginator($filterParams)->getQuery()->execute();
    }

    public function getRunCount(PayrollRunSearchFilterParams $filterParams): int
    {
        return $this->getRunPaginator($filterParams)->count();
    }

    private function getRunPaginator(PayrollRunSearchFilterParams $filterParams): Paginator
    {
        $q = $this->createQueryBuilder(PayrollRun::class, 'run')
            ->leftJoin('run.payPeriod', 'period');
        $this->setSortingAndPaginationParams($q, $filterParams);

        if ($filterParams->getPayPeriodId() !== null) {
            $q->andWhere('IDENTITY(run.payPeriod) = :periodId')->setParameter('periodId', $filterParams->getPayPeriodId());
        }
        if ($filterParams->getStatus() !== null) {
            $q->andWhere('run.status = :status')->setParameter('status', $filterParams->getStatus());
        }

        return $this->getPaginator($q);
    }

    public function saveSnapshot(PayrollEmployeeSnapshot $snapshot): PayrollEmployeeSnapshot
    {
        $this->persist($snapshot);
        return $snapshot;
    }

    public function saveRecord(PayrollRecord $record): PayrollRecord
    {
        $this->persist($record);
        return $record;
    }

    public function getRecordById(int $id): ?PayrollRecord
    {
        return $this->getRepository(PayrollRecord::class)->find($id);
    }

    public function getRecordByRunAndEmployee(int $runId, int $empNumber): ?PayrollRecord
    {
        return $this->createQueryBuilder(PayrollRecord::class, 'rec')
            ->andWhere('IDENTITY(rec.payrollRun) = :runId')
            ->andWhere('IDENTITY(rec.employee) = :empNumber')
            ->setParameter('runId', $runId)
            ->setParameter('empNumber', $empNumber)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @return PayrollRecord[]
     */
    public function getRecordsByRunId(int $runId): array
    {
        return $this->createQueryBuilder(PayrollRecord::class, 'rec')
            ->leftJoin('rec.employee', 'emp')
            ->andWhere('IDENTITY(rec.payrollRun) = :runId')
            ->setParameter('runId', $runId)
            ->addOrderBy('emp.firstName', 'ASC')
            ->getQuery()
            ->execute();
    }

    /**
     * @return PayrollRecord[]
     */
    public function getRecordList(PayrollRecordSearchFilterParams $filterParams): array
    {
        return $this->getRecordPaginator($filterParams)->getQuery()->execute();
    }

    public function getRecordCount(PayrollRecordSearchFilterParams $filterParams): int
    {
        return $this->getRecordPaginator($filterParams)->count();
    }

    private function getRecordPaginator(PayrollRecordSearchFilterParams $filterParams): Paginator
    {
        $q = $this->createQueryBuilder(PayrollRecord::class, 'rec')
            ->leftJoin('rec.employee', 'emp')
            ->leftJoin('rec.payrollRun', 'run')
            ->leftJoin('rec.payPeriod', 'period');
        $this->setSortingAndPaginationParams($q, $filterParams);

        if ($filterParams->getPayrollRunId() !== null) {
            $q->andWhere('IDENTITY(rec.payrollRun) = :runId')->setParameter('runId', $filterParams->getPayrollRunId());
        }
        if ($filterParams->getPayPeriodId() !== null) {
            $q->andWhere('IDENTITY(rec.payPeriod) = :periodId')->setParameter('periodId', $filterParams->getPayPeriodId());
        }
        if ($filterParams->getEmpNumber() !== null) {
            $q->andWhere('IDENTITY(rec.employee) = :empNumber')->setParameter('empNumber', $filterParams->getEmpNumber());
        }
        if ($filterParams->getStatus() !== null) {
            $q->andWhere('rec.status = :status')->setParameter('status', $filterParams->getStatus());
        }
        if ($filterParams->getSearch() !== null && trim($filterParams->getSearch()) !== '') {
            $term = '%' . trim($filterParams->getSearch()) . '%';
            $q->andWhere(
                $q->expr()->orX(
                    $q->expr()->like('emp.firstName', ':searchTerm'),
                    $q->expr()->like('emp.lastName', ':searchTerm'),
                    $q->expr()->like('emp.employeeId', ':searchTerm')
                )
            )->setParameter('searchTerm', $term);
        }

        return $this->getPaginator($q);
    }

    /**
     * YTD locked/approved records for an employee in the same Financial Year before the current pay period.
     *
     * @return PayrollRecord[]
     */
    public function getYtdPriorRecordsForEmployee(
        int $empNumber,
        string $financialYear,
        int $excludeRunId,
        DateTime $beforeStartDate
    ): array {
        return $this->createQueryBuilder(PayrollRecord::class, 'rec')
            ->leftJoin('rec.payrollRun', 'run')
            ->leftJoin('rec.payPeriod', 'period')
            ->andWhere('IDENTITY(rec.employee) = :empNumber')
            ->andWhere('period.financialYear = :fy')
            ->andWhere('period.startDate < :beforeDate')
            ->andWhere('run.id != :excludeRunId')
            ->andWhere('run.status IN (:validStatuses)')
            ->setParameter('empNumber', $empNumber)
            ->setParameter('fy', $financialYear)
            ->setParameter('beforeDate', $beforeStartDate->format('Y-m-d'))
            ->setParameter('excludeRunId', $excludeRunId)
            ->setParameter('validStatuses', [PayrollRun::STATUS_APPROVED, PayrollRun::STATUS_LOCKED])
            ->getQuery()
            ->execute();
    }

    public function deleteRunCalculationArtifacts(int $runId): void
    {
        $em = $this->getEntityManager();
        // Release active claim locks for this run before deleting DRAFT records
        $em->createQuery(
            'DELETE FROM OrangeHRM\Entity\PayrollClaimLink l WHERE IDENTITY(l.payrollRun) = :runId'
        )->setParameter('runId', $runId)->execute();

        $em->createQuery(
            'DELETE FROM OrangeHRM\Entity\SalarySlip s WHERE IDENTITY(s.payrollRun) = :runId'
        )->setParameter('runId', $runId)->execute();

        $em->createQuery(
            'DELETE FROM OrangeHRM\Entity\PayrollRecord r WHERE IDENTITY(r.payrollRun) = :runId'
        )->setParameter('runId', $runId)->execute();

        $em->createQuery(
            'DELETE FROM OrangeHRM\Entity\PayrollEmployeeSnapshot sn WHERE IDENTITY(sn.payrollRun) = :runId'
        )->setParameter('runId', $runId)->execute();
    }

    /**
     * @return PayrollClaimLink[]
     */
    public function getClaimLinksForRun(int $runId): array
    {
        return $this->createQueryBuilder(PayrollClaimLink::class, 'l')
            ->andWhere('IDENTITY(l.payrollRun) = :runId')
            ->setParameter('runId', $runId)
            ->getQuery()
            ->execute();
    }

    /**
     * @return PayrollClaimLink[]
     */
    public function getClaimLinksForBatch(int $batchId): array
    {
        return $this->createQueryBuilder(PayrollClaimLink::class, 'l')
            ->andWhere('IDENTITY(l.paymentBatch) = :batchId')
            ->setParameter('batchId', $batchId)
            ->getQuery()
            ->execute();
    }

    public function saveClaimLink(PayrollClaimLink $link): PayrollClaimLink
    {
        $link->setUpdatedAt(new DateTime());
        $this->persist($link);
        return $link;
    }

    public function saveApproval(PayrollApproval $approval): PayrollApproval
    {
        $this->persist($approval);
        return $approval;
    }

    /**
     * @return PayrollApproval[]
     */
    public function getApprovalsForRun(int $runId): array
    {
        return $this->createQueryBuilder(PayrollApproval::class, 'a')
            ->andWhere('IDENTITY(a.payrollRun) = :runId')
            ->setParameter('runId', $runId)
            ->addOrderBy('a.actionAt', 'ASC')
            ->getQuery()
            ->execute();
    }

    public function savePaymentBatch(PayrollPaymentBatch $batch): PayrollPaymentBatch
    {
        $this->persist($batch);
        return $batch;
    }

    public function getPaymentBatchById(int $id): ?PayrollPaymentBatch
    {
        return $this->getRepository(PayrollPaymentBatch::class)->find($id);
    }

    /**
     * @return PayrollPaymentBatch[]
     */
    public function getPaymentBatchList(PayrollPaymentBatchSearchFilterParams $filterParams): array
    {
        return $this->getPaymentBatchPaginator($filterParams)->getQuery()->execute();
    }

    public function getPaymentBatchCount(PayrollPaymentBatchSearchFilterParams $filterParams): int
    {
        return $this->getPaymentBatchPaginator($filterParams)->count();
    }

    private function getPaymentBatchPaginator(PayrollPaymentBatchSearchFilterParams $filterParams): Paginator
    {
        $q = $this->createQueryBuilder(PayrollPaymentBatch::class, 'batch')
            ->leftJoin('batch.payrollRun', 'run');
        $this->setSortingAndPaginationParams($q, $filterParams);

        if ($filterParams->getPayrollRunId() !== null) {
            $q->andWhere('IDENTITY(batch.payrollRun) = :runId')->setParameter('runId', $filterParams->getPayrollRunId());
        }
        if ($filterParams->getStatus() !== null) {
            $q->andWhere('batch.status = :status')->setParameter('status', $filterParams->getStatus());
        }

        return $this->getPaginator($q);
    }

    public function saveSalarySlip(SalarySlip $slip): SalarySlip
    {
        $this->persist($slip);
        return $slip;
    }

    public function getSalarySlipById(int $id): ?SalarySlip
    {
        return $this->getRepository(SalarySlip::class)->find($id);
    }

    public function getSalarySlipByRecordId(int $recordId): ?SalarySlip
    {
        return $this->createQueryBuilder(SalarySlip::class, 'slip')
            ->andWhere('IDENTITY(slip.payrollRecord) = :recId')
            ->setParameter('recId', $recordId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @return SalarySlip[]
     */
    public function getSalarySlipsForRun(int $runId): array
    {
        return $this->createQueryBuilder(SalarySlip::class, 'slip')
            ->andWhere('IDENTITY(slip.payrollRun) = :runId')
            ->setParameter('runId', $runId)
            ->getQuery()
            ->execute();
    }

    /**
     * @return SalarySlip[]
     */
    public function getSalarySlipList(SalarySlipSearchFilterParams $filterParams): array
    {
        return $this->getSalarySlipPaginator($filterParams)->getQuery()->execute();
    }

    public function getSalarySlipCount(SalarySlipSearchFilterParams $filterParams): int
    {
        return $this->getSalarySlipPaginator($filterParams)->count();
    }

    private function getSalarySlipPaginator(SalarySlipSearchFilterParams $filterParams): Paginator
    {
        $q = $this->createQueryBuilder(SalarySlip::class, 'slip')
            ->leftJoin('slip.payrollRecord', 'rec')
            ->leftJoin('rec.payPeriod', 'period');
        $this->setSortingAndPaginationParams($q, $filterParams);

        if ($filterParams->getEmpNumber() !== null) {
            $q->andWhere('slip.empNumber = :empNumber')->setParameter('empNumber', $filterParams->getEmpNumber());
        }
        if ($filterParams->getSlipStatus() !== null) {
            $q->andWhere('slip.slipStatus = :slipStatus')->setParameter('slipStatus', $filterParams->getSlipStatus());
        }
        if ($filterParams->getFinancialYear() !== null) {
            $q->andWhere('period.financialYear = :fy')->setParameter('fy', $filterParams->getFinancialYear());
        }

        return $this->getPaginator($q);
    }

    public function appendAuditEvent(PayrollAuditEvent $event): PayrollAuditEvent
    {
        $this->persist($event);
        return $event;
    }

    /**
     * @return PayrollAuditEvent[]
     */
    public function getAuditEventList(PayrollAuditSearchFilterParams $filterParams): array
    {
        return $this->getAuditPaginator($filterParams)->getQuery()->execute();
    }

    public function getAuditEventCount(PayrollAuditSearchFilterParams $filterParams): int
    {
        return $this->getAuditPaginator($filterParams)->count();
    }

    private function getAuditPaginator(PayrollAuditSearchFilterParams $filterParams): Paginator
    {
        $q = $this->createQueryBuilder(PayrollAuditEvent::class, 'evt');
        $this->setSortingAndPaginationParams($q, $filterParams);

        if ($filterParams->getPayrollRunId() !== null) {
            $q->andWhere('IDENTITY(evt.payrollRun) = :runId')->setParameter('runId', $filterParams->getPayrollRunId());
        }
        if ($filterParams->getEmpNumber() !== null) {
            $q->andWhere('evt.empNumber = :empNumber')->setParameter('empNumber', $filterParams->getEmpNumber());
        }
        if ($filterParams->getEventType() !== null) {
            $q->andWhere('evt.eventType = :eventType')->setParameter('eventType', $filterParams->getEventType());
        }

        return $this->getPaginator($q);
    }
}

