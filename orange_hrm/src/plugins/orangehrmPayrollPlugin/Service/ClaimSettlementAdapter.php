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
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use OrangeHRM\Core\Service\AccessFlowStateMachineService;
use OrangeHRM\Entity\ClaimExpense;
use OrangeHRM\Entity\ClaimRequest;
use OrangeHRM\Entity\PayrollClaimLink;
use OrangeHRM\Entity\PayrollPaymentBatch;
use OrangeHRM\Entity\PayrollRecord;
use OrangeHRM\Entity\PayrollRun;
use OrangeHRM\Entity\WorkflowStateMachine;
use OrangeHRM\ORM\Doctrine;
use OrangeHRM\Payroll\Dao\PayrollRunDao;
use OrangeHRM\Payroll\Exception\PayrollException;
use OrangeHRM\Payroll\Util\Money;

/**
 * Manages the 6-stage Claim-to-Payroll settlement lifecycle:
 * 1. APPROVED ClaimRequest discovered -> RESERVED (active_claim_lock = claim_request_id UNIQUE)
 * 2. PayrollRun LOCKED -> LOCKED_FOR_PAYMENT (does NOT mark ClaimRequest PAID yet)
 * 3. PaymentBatch EXPORTED -> PAYMENT_EXPORTED
 * 4. Bank Reconciliation Failed -> PAYMENT_FAILED & releases lock (active_claim_lock = NULL)
 * 5. Bank Reconciliation Success -> PAID_RECONCILED + ClaimRequest APPROVED -> PAID via FLOW_CLAIM
 */
class ClaimSettlementAdapter
{
    private ?PayrollRunDao $runDao = null;

    public function getRunDao(): PayrollRunDao
    {
        if ($this->runDao === null) {
            $this->runDao = new PayrollRunDao();
        }
        return $this->runDao;
    }

    public function setRunDao(PayrollRunDao $dao): void
    {
        $this->runDao = $dao;
    }

    /**
     * Discovers eligible APPROVED Claims for employee in period currency not currently locked by any active run,
     * and reserves them for $run / $record.
     *
     * @return array{reimbursementTotal: Money, reservedLinks: PayrollClaimLink[]}
     */
    public function reserveApprovedClaimsForEmployee(
        int $empNumber,
        PayrollRun $run,
        PayrollRecord $record
    ): array {
        $em = Doctrine::getEntityManager();
        $period = $run->getPayPeriod();
        $currencyId = $period->getCurrency()->getId();

        // Eligible claims: APPROVED, not deleted, same employee, matching currency, submitted on/before period end
        /** @var ClaimRequest[] $approvedClaims */
        $approvedClaims = $em->createQuery(
            'SELECT c FROM OrangeHRM\Entity\ClaimRequest c
             WHERE IDENTITY(c.employee) = :empNumber
               AND c.status = :approvedStatus
               AND c.isDeleted = :deleted
               AND IDENTITY(c.currencyType) = :currencyId
               AND NOT EXISTS (
                   SELECT 1 FROM OrangeHRM\Entity\PayrollClaimLink l
                   WHERE IDENTITY(l.claimRequest) = c.id
                     AND l.activeClaimLock IS NOT NULL
               )
             ORDER BY c.id ASC'
        )
            ->setParameter('empNumber', $empNumber)
            ->setParameter('approvedStatus', 'APPROVED')
            ->setParameter('deleted', false)
            ->setParameter('currencyId', $currencyId)
            ->execute();

        $total = Money::zero($currencyId);
        $links = [];

        foreach ($approvedClaims as $claim) {
            // Sum expenses for this claim request
            /** @var ClaimExpense[] $expenses */
            $expenses = $em->createQuery(
                'SELECT e FROM OrangeHRM\Entity\ClaimExpense e
                 WHERE IDENTITY(e.claimRequest) = :claimId AND e.isDeleted = :deleted'
            )
                ->setParameter('claimId', $claim->getId())
                ->setParameter('deleted', false)
                ->execute();

            $claimTotal = Money::zero($currencyId);
            foreach ($expenses as $exp) {
                $claimTotal = $claimTotal->add(Money::of($exp->getAmount(), $currencyId));
            }
            if ($claimTotal->isZero() || $claimTotal->isNegative()) {
                continue;
            }

            $link = new PayrollClaimLink();
            $link->setPayrollRun($run);
            $link->setPayrollRecord($record);
            $link->setClaimRequest($claim);
            $link->setEmployee($record->getEmployee());
            $link->setClaimAmount($claimTotal->toDatabaseString(2));
            $link->setCurrency($period->getCurrency());
            $link->setSettlementStatus(PayrollClaimLink::STATUS_RESERVED);
            $link->setActiveClaimLock($claim->getId());

            try {
                $this->getRunDao()->saveClaimLink($link);
            } catch (UniqueConstraintViolationException $e) {
                throw PayrollException::claimAlreadyLocked($claim->getId());
            }

            $total = $total->add($claimTotal);
            $links[] = $link;
        }

        return ['reimbursementTotal' => $total, 'reservedLinks' => $links];
    }

    public function releaseReservationsForRun(int $runId): void
    {
        $links = $this->getRunDao()->getClaimLinksForRun($runId);
        foreach ($links as $link) {
            if ($link->getSettlementStatus() === PayrollClaimLink::STATUS_PAID_RECONCILED) {
                continue;
            }
            $link->setSettlementStatus(PayrollClaimLink::STATUS_RELEASED);
            $link->setActiveClaimLock(null);
            $this->getRunDao()->saveClaimLink($link);
        }
    }

    public function lockClaimLinksForRun(int $runId): void
    {
        $links = $this->getRunDao()->getClaimLinksForRun($runId);
        foreach ($links as $link) {
            if ($link->getSettlementStatus() === PayrollClaimLink::STATUS_RESERVED) {
                $link->setSettlementStatus(PayrollClaimLink::STATUS_LOCKED_FOR_PAYMENT);
                $this->getRunDao()->saveClaimLink($link);
            }
        }
    }

    public function markLinksExportedForBatch(PayrollPaymentBatch $batch): void
    {
        $links = $this->getRunDao()->getClaimLinksForRun($batch->getPayrollRun()->getId());
        foreach ($links as $link) {
            if ($link->getSettlementStatus() === PayrollClaimLink::STATUS_LOCKED_FOR_PAYMENT) {
                $link->setSettlementStatus(PayrollClaimLink::STATUS_PAYMENT_EXPORTED);
                $link->setPaymentBatch($batch);
                $this->getRunDao()->saveClaimLink($link);
            }
        }
    }

    public function markBatchReconciledPaid(PayrollPaymentBatch $batch, string $utrReference): void
    {
        $em = Doctrine::getEntityManager();
        $now = new DateTime();
        $links = $this->getRunDao()->getClaimLinksForBatch($batch->getId());
        $flowService = new AccessFlowStateMachineService();

        foreach ($links as $link) {
            $link->setSettlementStatus(PayrollClaimLink::STATUS_PAID_RECONCILED);
            $link->setBankReference($utrReference);
            $link->setReconciledAt($now);
            // Retain activeClaimLock = claimRequestId on PAID claims or keep status PAID so never re-selected
            $this->getRunDao()->saveClaimLink($link);

            // Transition OrangeHRM ClaimRequest APPROVED -> PAID via FLOW_CLAIM workflow
            $claim = $link->getClaimRequest();
            if ($claim->getStatus() === 'APPROVED') {
                $resultingState = $flowService->getNextState(
                    WorkflowStateMachine::FLOW_CLAIM,
                    'APPROVED',
                    'ADMIN',
                    WorkflowStateMachine::CLAIM_ACTION_PAY
                );
                $claim->setStatus($resultingState ?: 'PAID');
                $em->persist($claim);
            }
        }
        $em->flush();
    }

    public function markBatchFailed(PayrollPaymentBatch $batch, string $failureReason): void
    {
        $links = $this->getRunDao()->getClaimLinksForBatch($batch->getId());
        foreach ($links as $link) {
            $link->setSettlementStatus(PayrollClaimLink::STATUS_PAYMENT_FAILED);
            $link->setBankReference($failureReason);
            // Release lock so failed claim can be picked up cleanly by a subsequent payment retry / run!
            $link->setActiveClaimLock(null);
            $this->getRunDao()->saveClaimLink($link);
        }
    }
}
