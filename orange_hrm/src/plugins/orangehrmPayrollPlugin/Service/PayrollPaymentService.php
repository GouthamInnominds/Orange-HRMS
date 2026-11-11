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
use OrangeHRM\Entity\PayrollPaymentBatch;
use OrangeHRM\Entity\PayrollPayPeriod;
use OrangeHRM\Entity\PayrollRecord;
use OrangeHRM\Entity\PayrollRun;
use OrangeHRM\Entity\User;
use OrangeHRM\ORM\Doctrine;
use OrangeHRM\Payroll\Dao\PayrollPeriodDao;
use OrangeHRM\Payroll\Dao\PayrollRunDao;
use OrangeHRM\Payroll\Dto\PayrollPaymentBatchSearchFilterParams;
use OrangeHRM\Payroll\Exception\PayrollException;
use OrangeHRM\Payroll\Util\Money;

/**
 * Payment Disbursement & Bank Reconciliation Service:
 * - Only operates on LOCKED PayrollRuns
 * - Authorized access to unmasked Beneficiary Bank Account & IFSC for NEFT/IMPS CSV export
 * - UTR Reconciliation transitions ClaimRequests APPROVED -> PAID strictly via ClaimSettlementAdapter (FLOW_CLAIM)
 */
class PayrollPaymentService
{
    private ?PayrollRunDao $runDao = null;
    private ?PayrollPeriodDao $periodDao = null;
    private ?PayrollConfigService $configService = null;
    private ?PayrollEmployeeSnapshotService $snapshotService = null;
    private ?ClaimSettlementAdapter $claimAdapter = null;

    public function getRunDao(): PayrollRunDao
    {
        return $this->runDao ??= new PayrollRunDao();
    }

    public function getPeriodDao(): PayrollPeriodDao
    {
        return $this->periodDao ??= new PayrollPeriodDao();
    }

    public function getConfigService(): PayrollConfigService
    {
        return $this->configService ??= new PayrollConfigService();
    }

    public function getSnapshotService(): PayrollEmployeeSnapshotService
    {
        return $this->snapshotService ??= new PayrollEmployeeSnapshotService();
    }

    public function getClaimAdapter(): ClaimSettlementAdapter
    {
        return $this->claimAdapter ??= new ClaimSettlementAdapter();
    }

    public function createPaymentBatch(int $runId, string $paymentMode = 'NEFT', ?User $actor = null): PayrollPaymentBatch
    {
        $run = $this->getRunDao()->getRunById($runId);
        if ($run === null) {
            throw new PayrollException(sprintf('Payroll run #%d not found.', $runId), PayrollException::CODE_NOT_FOUND, [], 404);
        }
        if ($run->getStatus() !== PayrollRun::STATUS_LOCKED) {
            throw PayrollException::prerequisiteBlocked(
                sprintf('Payment batches can only be created for LOCKED payroll runs (current status: %s).', $run->getStatus())
            );
        }

        // Reuse existing non-failed batch if already present for idempotency
        $fp = new PayrollPaymentBatchSearchFilterParams();
        $fp->setPayrollRunId($runId);
        foreach ($this->getRunDao()->getPaymentBatchList($fp) as $existing) {
            if ($existing->getStatus() !== PayrollPaymentBatch::STATUS_PAYMENT_FAILED) {
                return $existing;
            }
        }

        $records = $this->getRunDao()->getRecordsByRunId($runId);
        $currency = $run->getPayPeriod()->getCurrency();
        $currencyCode = $currency->getId();
        $totalAmount = Money::zero($currencyCode);
        $payableCount = 0;

        foreach ($records as $rec) {
            $net = Money::of($rec->getNetSalary(), $currencyCode);
            if ($net->isPositive()) {
                $totalAmount = $totalAmount->add($net);
                $payableCount++;
            }
        }

        if ($payableCount === 0) {
            throw PayrollException::prerequisiteBlocked('No positive net salary records exist to disburse in this payroll run.');
        }

        $batch = new PayrollPaymentBatch();
        $batch->setPayrollRun($run);
        $batch->setBatchReference(sprintf('NEFT-%s-R%d-%s', $run->getPayPeriod()->getStartDate()->format('Ym'), $run->getId(), date('His')));
        $batch->setPaymentMode(strtoupper($paymentMode));
        $batch->setTotalAmount($totalAmount->toDatabaseString(4));
        $batch->setRecordCount($payableCount);
        $batch->setCurrency($currency);
        $batch->setStatus(PayrollPaymentBatch::STATUS_PAYMENT_PENDING);

        $saved = $this->getRunDao()->savePaymentBatch($batch);
        $this->getConfigService()->recordAudit(
            'PAYMENT_BATCH_CREATED',
            'PayrollPaymentBatch',
            $saved->getId(),
            null,
            $actor,
            null,
            [
                'batchReference' => $saved->getBatchReference(),
                'paymentMode' => $saved->getPaymentMode(),
                'totalAmount' => $saved->getTotalAmount(),
                'recordCount' => $saved->getRecordCount(),
            ],
            $run
        );

        return $saved;
    }

    /**
     * Generates Indian Bank NEFT/IMPS disbursement CSV using unmasked bank account details
     * strictly within this authorized payment service.
     *
     * @return array{batch:PayrollPaymentBatch,csvContent:string,filename:string}
     */
    public function exportBankCsv(int $batchId, ?User $actor = null): array
    {
        $batch = $this->getRunDao()->getPaymentBatchById($batchId);
        if ($batch === null) {
            throw new PayrollException(sprintf('Payment batch #%d not found.', $batchId), PayrollException::CODE_NOT_FOUND, [], 404);
        }
        if ($batch->getStatus() === PayrollPaymentBatch::STATUS_PAID_RECONCILED) {
            throw PayrollException::prerequisiteBlocked('Reconciled PAID payment batch should not change status on CSV re-download; reading CSV snapshot.');
        }

        $run = $batch->getPayrollRun();
        $period = $run->getPayPeriod();
        $records = $this->getRunDao()->getRecordsByRunId($run->getId());
        $currencyCode = $batch->getCurrency()->getId();

        $lines = [
            'BeneficiaryName,EmployeeCode,BankAccountNumber,IFSCCode,BankName,PaymentMode,AmountINR,PayPeriod,BatchReference,Narration',
        ];

        $em = Doctrine::getEntityManager();
        return $em->wrapInTransaction(function () use ($batch, $run, $period, $records, $currencyCode, $actor, &$lines): array {
            foreach ($records as $rec) {
                $net = Money::of($rec->getNetSalary(), $currencyCode);
                if (!$net->isPositive()) {
                    continue;
                }
                $emp = $rec->getEmployee();
                $fullName = $rec->getSnapshot() ? $rec->getSnapshot()->getFullName() : trim($emp->getFirstName() . ' ' . $emp->getLastName());
                $acct = $this->getSnapshotService()->getUnmaskedDisbursementAccount($emp->getEmpNumber(), $fullName);
                if ($acct === null) {
                    throw PayrollException::prerequisiteBlocked(
                        sprintf('Employee %s (%s) is missing bank account / IFSC details for NEFT export.', $fullName, $emp->getEmployeeId())
                    );
                }

                $lines[] = implode(',', [
                    $this->csvSafeCell($acct['holder']),
                    $this->csvSafeCell((string)$emp->getEmployeeId()),
                    $this->csvSafeCell($acct['account']),
                    $this->csvSafeCell($acct['ifsc']),
                    $this->csvSafeCell($acct['bankName']),
                    $this->csvSafeCell($batch->getPaymentMode()),
                    $net->toDatabaseString(2),
                    $this->csvSafeCell($period->getName()),
                    $this->csvSafeCell($batch->getBatchReference()),
                    $this->csvSafeCell(sprintf('Salary %s', $period->getName())),
                ]);

                $rec->setPaymentStatus(PayrollRecord::PAYMENT_EXPORTED);
                $this->getRunDao()->saveRecord($rec);
            }

            $filename = sprintf('%s.csv', $batch->getBatchReference());
            $batch->setStatus(PayrollPaymentBatch::STATUS_EXPORTED);
            $batch->setExportCsvPath('/payroll/payment-batches/' . $batch->getId() . '/csv');
            $batch->setExportedBy($actor);
            $batch->setExportedAt(new DateTime());
            $this->getRunDao()->savePaymentBatch($batch);

            // Transition Claim links LOCKED_FOR_PAYMENT -> PAYMENT_EXPORTED
            $this->getClaimAdapter()->markLinksExportedForBatch($batch);

            $this->getConfigService()->recordAudit(
                'PAYMENT_BATCH_EXPORTED',
                'PayrollPaymentBatch',
                $batch->getId(),
                null,
                $actor,
                null,
                ['batchReference' => $batch->getBatchReference(), 'status' => $batch->getStatus()],
                $run
            );

            return [
                'batch' => $batch,
                'csvContent' => implode("\r\n", $lines) . "\r\n",
                'filename' => $filename,
            ];
        });
    }

    public function reconcileBatch(int $batchId, bool $succeeded, string $utrOrReason, ?User $actor = null): PayrollPaymentBatch
    {
        $batch = $this->getRunDao()->getPaymentBatchById($batchId);
        if ($batch === null) {
            throw new PayrollException(sprintf('Payment batch #%d not found.', $batchId), PayrollException::CODE_NOT_FOUND, [], 404);
        }
        if (!in_array($batch->getStatus(), [PayrollPaymentBatch::STATUS_EXPORTED, PayrollPaymentBatch::STATUS_PAYMENT_PENDING], true)) {
            throw PayrollException::invalidStateTransition($batch->getStatus(), $succeeded ? PayrollPaymentBatch::STATUS_PAID_RECONCILED : PayrollPaymentBatch::STATUS_PAYMENT_FAILED);
        }

        $ref = trim($utrOrReason);
        if ($ref === '') {
            throw PayrollException::prerequisiteBlocked('Bank UTR reference or failure reason is required.');
        }

        $em = Doctrine::getEntityManager();
        return $em->wrapInTransaction(function () use ($batch, $succeeded, $ref, $actor): PayrollPaymentBatch {
            $beforeStatus = $batch->getStatus();
            $run = $batch->getPayrollRun();
            $now = new DateTime();

            if ($succeeded) {
                $batch->setStatus(PayrollPaymentBatch::STATUS_PAID_RECONCILED);
                $batch->setUtrNumber(substr($ref, 0, 100));
                $batch->setReconciledBy($actor);
                $batch->setReconciledAt($now);
                $this->getRunDao()->savePaymentBatch($batch);

                foreach ($this->getRunDao()->getRecordsByRunId($run->getId()) as $rec) {
                    $rec->setPaymentStatus(PayrollRecord::PAYMENT_PAID);
                    $this->getRunDao()->saveRecord($rec);
                }

                // Transition linked ClaimRequests APPROVED -> PAID via FLOW_CLAIM!
                $this->getClaimAdapter()->markBatchReconciledPaid($batch, $ref);

                // Close the PayPeriod once settled & reconciled
                $period = $run->getPayPeriod();
                $period->setStatus(PayrollPayPeriod::STATUS_CLOSED);
                $this->getPeriodDao()->savePayPeriod($period);

                $eventType = 'PAYMENT_BATCH_RECONCILED_PAID';
            } else {
                $batch->setStatus(PayrollPaymentBatch::STATUS_PAYMENT_FAILED);
                $batch->setUtrNumber(substr('FAILED:' . $ref, 0, 100));
                $batch->setReconciledBy($actor);
                $batch->setReconciledAt($now);
                $this->getRunDao()->savePaymentBatch($batch);

                foreach ($this->getRunDao()->getRecordsByRunId($run->getId()) as $rec) {
                    $rec->setPaymentStatus(PayrollRecord::PAYMENT_FAILED);
                    $this->getRunDao()->saveRecord($rec);
                }

                // Release activeClaimLock so failed claims can be retried cleanly
                $this->getClaimAdapter()->markBatchFailed($batch, $ref);

                $eventType = 'PAYMENT_BATCH_FAILED';
            }

            $this->getConfigService()->recordAudit(
                $eventType,
                'PayrollPaymentBatch',
                $batch->getId(),
                null,
                $actor,
                ['status' => $beforeStatus],
                ['status' => $batch->getStatus(), 'utrOrReason' => $ref],
                $run
            );

            return $batch;
        });
    }

    private function csvSafeCell(string $value): string
    {
        $clean = str_replace(["\r", "\n"], ' ', $value);
        // Prevent CSV formula injection (=, +, -, @)
        if ($clean !== '' && in_array($clean[0], ['=', '+', '-', '@'], true)) {
            $clean = "'" . $clean;
        }
        return '"' . str_replace('"', '""', $clean) . '"';
    }
}

