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
use OrangeHRM\Entity\PayrollApproval;
use OrangeHRM\Entity\PayrollPaymentBatch;
use OrangeHRM\Entity\PayrollPayPeriod;
use OrangeHRM\Entity\PayrollRecord;
use OrangeHRM\Entity\PayrollRun;
use OrangeHRM\Entity\SalarySlip;
use OrangeHRM\Entity\User;
use OrangeHRM\ORM\Doctrine;
use OrangeHRM\Payroll\Dao\PayrollPeriodDao;
use OrangeHRM\Payroll\Dao\PayrollRunDao;
use OrangeHRM\Payroll\Dto\PayrollPaymentBatchSearchFilterParams;
use OrangeHRM\Payroll\Exception\PayrollException;

/**
 * Enforces PayrollRun governance state machine & Maker-Checker Separation of Duties (BR_PAY_005):
 * DRAFT -> CALCULATED -> SUBMITTED_FOR_APPROVAL -> APPROVED / REJECTED -> LOCKED -> REVERSED | CANCELLED
 */
class PayrollWorkflowService
{
    private ?PayrollConfigService $configService = null;
    private ?PayrollPeriodDao $periodDao = null;
    private ?PayrollRunDao $runDao = null;
    private ?ClaimSettlementAdapter $claimAdapter = null;

    public function getConfigService(): PayrollConfigService
    {
        return $this->configService ??= new PayrollConfigService();
    }

    public function getPeriodDao(): PayrollPeriodDao
    {
        return $this->periodDao ??= new PayrollPeriodDao();
    }

    public function getRunDao(): PayrollRunDao
    {
        return $this->runDao ??= new PayrollRunDao();
    }

    public function getClaimAdapter(): ClaimSettlementAdapter
    {
        return $this->claimAdapter ??= new ClaimSettlementAdapter();
    }

    public function submitForApproval(int $runId, User $actor, ?string $comments = null): PayrollRun
    {
        $run = $this->requireRun($runId);
        if (!in_array($run->getStatus(), [PayrollRun::STATUS_CALCULATED, PayrollRun::STATUS_REJECTED], true)) {
            throw PayrollException::invalidStateTransition($run->getStatus(), PayrollRun::STATUS_SUBMITTED_FOR_APPROVAL);
        }
        if ($run->getTotalEmployees() <= 0) {
            throw PayrollException::prerequisiteBlocked('Cannot submit an empty payroll run with zero eligible employees.');
        }

        $em = Doctrine::getEntityManager();
        return $em->wrapInTransaction(function () use ($run, $actor, $comments): PayrollRun {
            $beforeStatus = $run->getStatus();
            $run->setStatus(PayrollRun::STATUS_SUBMITTED_FOR_APPROVAL);
            $run->setSubmittedBy($actor);
            $run->setSubmittedAt(new DateTime());
            $run->setRejectionReason(null);
            $this->getRunDao()->saveRun($run);

            $this->recordApproval($run, PayrollApproval::ACTION_SUBMITTED, $actor, $comments);
            $this->getConfigService()->recordAudit(
                'RUN_SUBMITTED',
                'PayrollRun',
                $run->getId(),
                null,
                $actor,
                ['status' => $beforeStatus],
                ['status' => $run->getStatus(), 'comments' => $comments],
                $run
            );

            return $run;
        });
    }

    public function approveRun(int $runId, User $actor, ?string $comments = null): PayrollRun
    {
        $run = $this->requireRun($runId);
        if ($run->getStatus() !== PayrollRun::STATUS_SUBMITTED_FOR_APPROVAL) {
            throw PayrollException::invalidStateTransition($run->getStatus(), PayrollRun::STATUS_APPROVED);
        }

        $config = $this->getConfigService()->getConfig($run->getPayPeriod()->getJurisdictionCode());
        if ($config->isRequireMakerCheckerApproval()) {
            $this->assertSeparationOfDuties($run, $actor, 'approve');
        }

        $em = Doctrine::getEntityManager();
        return $em->wrapInTransaction(function () use ($run, $actor, $comments): PayrollRun {
            $beforeStatus = $run->getStatus();
            $now = new DateTime();
            $run->setStatus(PayrollRun::STATUS_APPROVED);
            $run->setApprovedBy($actor);
            $run->setApprovedAt($now);
            $this->getRunDao()->saveRun($run);

            foreach ($this->getRunDao()->getRecordsByRunId($run->getId()) as $rec) {
                $rec->setStatus(PayrollRecord::STATUS_APPROVED);
                $this->getRunDao()->saveRecord($rec);
            }

            $this->recordApproval($run, PayrollApproval::ACTION_APPROVED, $actor, $comments);
            $this->getConfigService()->recordAudit(
                'RUN_APPROVED',
                'PayrollRun',
                $run->getId(),
                null,
                $actor,
                ['status' => $beforeStatus],
                ['status' => $run->getStatus(), 'comments' => $comments],
                $run
            );

            return $run;
        });
    }

    public function rejectRun(int $runId, User $actor, string $reason): PayrollRun
    {
        $run = $this->requireRun($runId);
        if ($run->getStatus() !== PayrollRun::STATUS_SUBMITTED_FOR_APPROVAL) {
            throw PayrollException::invalidStateTransition($run->getStatus(), PayrollRun::STATUS_REJECTED);
        }

        $trimmed = trim($reason);
        if ($trimmed === '') {
            throw PayrollException::prerequisiteBlocked('A rejection reason is required when rejecting a payroll run.');
        }

        $em = Doctrine::getEntityManager();
        return $em->wrapInTransaction(function () use ($run, $actor, $trimmed): PayrollRun {
            $beforeStatus = $run->getStatus();
            $run->setStatus(PayrollRun::STATUS_REJECTED);
            $run->setRejectionReason(substr($trimmed, 0, 500));
            $this->getRunDao()->saveRun($run);

            foreach ($this->getRunDao()->getRecordsByRunId($run->getId()) as $rec) {
                $rec->setStatus(PayrollRecord::STATUS_CALCULATED);
                $this->getRunDao()->saveRecord($rec);
            }

            $this->recordApproval($run, PayrollApproval::ACTION_REJECTED, $actor, $trimmed);
            $this->getConfigService()->recordAudit(
                'RUN_REJECTED',
                'PayrollRun',
                $run->getId(),
                null,
                $actor,
                ['status' => $beforeStatus],
                ['status' => $run->getStatus(), 'reason' => $trimmed],
                $run
            );

            return $run;
        });
    }

    public function lockRun(int $runId, User $actor, ?string $comments = null): PayrollRun
    {
        $run = $this->requireRun($runId);
        if ($run->getStatus() !== PayrollRun::STATUS_APPROVED) {
            throw PayrollException::invalidStateTransition($run->getStatus(), PayrollRun::STATUS_LOCKED);
        }

        $config = $this->getConfigService()->getConfig($run->getPayPeriod()->getJurisdictionCode());
        if ($config->isRequireMakerCheckerApproval()) {
            $this->assertSeparationOfDuties($run, $actor, 'lock');
        }

        $em = Doctrine::getEntityManager();
        return $em->wrapInTransaction(function () use ($run, $actor, $comments): PayrollRun {
            $beforeStatus = $run->getStatus();
            $now = new DateTime();
            $run->setStatus(PayrollRun::STATUS_LOCKED);
            $run->setLockedBy($actor);
            $run->setLockedAt($now);
            $this->getRunDao()->saveRun($run);

            foreach ($this->getRunDao()->getRecordsByRunId($run->getId()) as $rec) {
                $rec->setStatus(PayrollRecord::STATUS_LOCKED);
                $rec->setPaymentStatus(PayrollRecord::PAYMENT_PENDING);
                $this->getRunDao()->saveRecord($rec);
            }

            // Publish SalarySlips so employees can view/download in My Info
            foreach ($this->getRunDao()->getSalarySlipsForRun($run->getId()) as $slip) {
                $slip->setSlipStatus(SalarySlip::STATUS_PUBLISHED);
                $slip->setPublishedAt($now);
                if ($slip->getPayrollRecord()->getSnapshot() !== null) {
                    $slip->setHtmlSnapshot(
                        PayrollCalculationService::renderHtmlPayslip(
                            $slip->getPayrollRecord(),
                            $slip->getPayrollRecord()->getSnapshot(),
                            $slip->getSlipNumber()
                        )
                    );
                }
                $this->getRunDao()->saveSalarySlip($slip);
            }

            // Transition reserved claims -> LOCKED_FOR_PAYMENT (still NOT marked PAID until bank reconciliation)
            $this->getClaimAdapter()->lockClaimLinksForRun($run->getId());

            // Lock PayPeriod
            $period = $run->getPayPeriod();
            $period->setStatus(PayrollPayPeriod::STATUS_LOCKED);
            $this->getPeriodDao()->savePayPeriod($period);

            $this->recordApproval($run, PayrollApproval::ACTION_LOCKED, $actor, $comments);
            $this->getConfigService()->recordAudit(
                'RUN_LOCKED',
                'PayrollRun',
                $run->getId(),
                null,
                $actor,
                ['status' => $beforeStatus],
                ['status' => $run->getStatus(), 'comments' => $comments],
                $run
            );

            return $run;
        });
    }

    public function reverseRun(int $runId, User $actor, string $reason): PayrollRun
    {
        $run = $this->requireRun($runId);
        if ($run->getStatus() !== PayrollRun::STATUS_LOCKED) {
            throw PayrollException::invalidStateTransition($run->getStatus(), PayrollRun::STATUS_REVERSED);
        }

        $trimmed = trim($reason);
        if ($trimmed === '') {
            throw PayrollException::prerequisiteBlocked('Reversal reason is mandatory for reversing a locked payroll run.');
        }

        // Block reversal if payment batch was already reconciled PAID
        $fp = new PayrollPaymentBatchSearchFilterParams();
        $fp->setPayrollRunId($runId);
        foreach ($this->getRunDao()->getPaymentBatchList($fp) as $batch) {
            if ($batch->getStatus() === PayrollPaymentBatch::STATUS_PAID_RECONCILED) {
                throw PayrollException::prerequisiteBlocked(
                    sprintf('Cannot reverse payroll run #%d because payment batch "%s" is already PAID & reconciled.', $runId, $batch->getBatchReference())
                );
            }
        }

        $em = Doctrine::getEntityManager();
        return $em->wrapInTransaction(function () use ($run, $actor, $trimmed): PayrollRun {
            $beforeStatus = $run->getStatus();
            $now = new DateTime();
            $run->setStatus(PayrollRun::STATUS_REVERSED);
            $this->getRunDao()->saveRun($run);

            foreach ($this->getRunDao()->getRecordsByRunId($run->getId()) as $rec) {
                $rec->setStatus(PayrollRecord::STATUS_REVERSED);
                $this->getRunDao()->saveRecord($rec);
            }

            foreach ($this->getRunDao()->getSalarySlipsForRun($run->getId()) as $slip) {
                $slip->setSlipStatus(SalarySlip::STATUS_VOIDED);
                $slip->setVoidedAt($now);
                $this->getRunDao()->saveSalarySlip($slip);
            }

            // Release any unreleased claim locks
            $this->getClaimAdapter()->releaseReservationsForRun($run->getId());

            // Re-open PayPeriod so a corrective run version can be initiated
            $period = $run->getPayPeriod();
            $period->setStatus(PayrollPayPeriod::STATUS_OPEN);
            $this->getPeriodDao()->savePayPeriod($period);

            $this->recordApproval($run, PayrollApproval::ACTION_REVERSED, $actor, $trimmed);
            $this->getConfigService()->recordAudit(
                'RUN_REVERSED',
                'PayrollRun',
                $run->getId(),
                null,
                $actor,
                ['status' => $beforeStatus],
                ['status' => $run->getStatus(), 'reason' => $trimmed],
                $run
            );

            return $run;
        });
    }

    public function cancelRun(int $runId, User $actor, ?string $reason = null): PayrollRun
    {
        $run = $this->requireRun($runId);
        if (!in_array($run->getStatus(), [PayrollRun::STATUS_DRAFT, PayrollRun::STATUS_CALCULATED, PayrollRun::STATUS_REJECTED], true)) {
            throw PayrollException::invalidStateTransition($run->getStatus(), PayrollRun::STATUS_CANCELLED);
        }

        $em = Doctrine::getEntityManager();
        return $em->wrapInTransaction(function () use ($run, $actor, $reason): PayrollRun {
            $beforeStatus = $run->getStatus();
            $now = new DateTime();
            $run->setStatus(PayrollRun::STATUS_CANCELLED);
            $this->getRunDao()->saveRun($run);

            $this->getClaimAdapter()->releaseReservationsForRun($run->getId());
            foreach ($this->getRunDao()->getSalarySlipsForRun($run->getId()) as $slip) {
                $slip->setSlipStatus(SalarySlip::STATUS_VOIDED);
                $slip->setVoidedAt($now);
                $this->getRunDao()->saveSalarySlip($slip);
            }

            $period = $run->getPayPeriod();
            if ($period->getStatus() === PayrollPayPeriod::STATUS_IN_PROCESSING) {
                $period->setStatus(PayrollPayPeriod::STATUS_OPEN);
                $this->getPeriodDao()->savePayPeriod($period);
            }

            $this->getConfigService()->recordAudit(
                'RUN_CANCELLED',
                'PayrollRun',
                $run->getId(),
                null,
                $actor,
                ['status' => $beforeStatus],
                ['status' => $run->getStatus(), 'reason' => $reason],
                $run
            );

            return $run;
        });
    }

    private function assertSeparationOfDuties(PayrollRun $run, User $actor, string $action): void
    {
        $actorId = $actor->getId();
        $createdById = $run->getCreatedBy() ? $run->getCreatedBy()->getId() : null;
        $submittedById = $run->getSubmittedBy() ? $run->getSubmittedBy()->getId() : null;

        if (($createdById !== null && $createdById === $actorId) || ($submittedById !== null && $submittedById === $actorId)) {
            throw PayrollException::sodViolation($action);
        }
    }

    private function recordApproval(PayrollRun $run, string $action, User $actor, ?string $comments): void
    {
        $approval = new PayrollApproval();
        $approval->setPayrollRun($run);
        $approval->setAction($action);
        $approval->setActorUser($actor);
        $approval->setComments($comments ? substr(trim($comments), 0, 500) : null);
        $approval->setActionAt(new DateTime());
        $this->getRunDao()->saveApproval($approval);
    }

    private function requireRun(int $runId): PayrollRun
    {
        $run = $this->getRunDao()->getRunById($runId);
        if ($run === null) {
            throw new PayrollException(sprintf('Payroll run #%d not found.', $runId), PayrollException::CODE_NOT_FOUND, [], 404);
        }
        return $run;
    }
}

