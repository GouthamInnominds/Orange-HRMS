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

namespace OrangeHRM\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;

/**
 * 6-stage Claim-to-Payroll settlement link preventing concurrent double-inclusion via active_claim_lock UNIQUE constraint.
 *
 * @ORM\Table(name="ohrm_payroll_claim_link")
 * @ORM\Entity
 */
class PayrollClaimLink
{
    public const STATUS_RESERVED = 'RESERVED';
    public const STATUS_LOCKED_FOR_PAYMENT = 'LOCKED_FOR_PAYMENT';
    public const STATUS_PAYMENT_EXPORTED = 'PAYMENT_EXPORTED';
    public const STATUS_PAID_RECONCILED = 'PAID_RECONCILED';
    public const STATUS_PAYMENT_FAILED = 'PAYMENT_FAILED';
    public const STATUS_RELEASED = 'RELEASED';

    /**
     * @var int
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;

    /**
     * @var PayrollRun
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\PayrollRun")
     * @ORM\JoinColumn(name="payroll_run_id", referencedColumnName="id", nullable=false)
     */
    private PayrollRun $payrollRun;

    /**
     * @var PayrollRecord|null
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\PayrollRecord")
     * @ORM\JoinColumn(name="payroll_record_id", referencedColumnName="id", nullable=true)
     */
    private ?PayrollRecord $payrollRecord = null;

    /**
     * @var ClaimRequest
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\ClaimRequest")
     * @ORM\JoinColumn(name="claim_request_id", referencedColumnName="id", nullable=false)
     */
    private ClaimRequest $claimRequest;

    /**
     * @var Employee
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\Employee")
     * @ORM\JoinColumn(name="emp_number", referencedColumnName="emp_number", nullable=false)
     */
    private Employee $employee;

    /**
     * @var string
     * @ORM\Column(name="claim_amount", type="decimal", precision=15, scale=2)
     */
    private string $claimAmount = '0.00';

    /**
     * @var CurrencyType
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\CurrencyType")
     * @ORM\JoinColumn(name="currency_id", referencedColumnName="currency_id", nullable=false)
     */
    private CurrencyType $currency;

    /**
     * @var string
     * @ORM\Column(name="settlement_status", type="string", length=32)
     */
    private string $settlementStatus = self::STATUS_RESERVED;

    /**
     * @var int|null
     * @ORM\Column(name="active_claim_lock", type="integer", nullable=true, unique=true)
     */
    private ?int $activeClaimLock = null;

    /**
     * @var PayrollPaymentBatch|null
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\PayrollPaymentBatch")
     * @ORM\JoinColumn(name="payment_batch_id", referencedColumnName="id", nullable=true)
     */
    private ?PayrollPaymentBatch $paymentBatch = null;

    /**
     * @var string|null
     * @ORM\Column(name="bank_reference", type="string", length=100, nullable=true)
     */
    private ?string $bankReference = null;

    /**
     * @var DateTime|null
     * @ORM\Column(name="reconciled_at", type="datetime", nullable=true)
     */
    private ?DateTime $reconciledAt = null;

    /**
     * @var DateTime
     * @ORM\Column(name="created_at", type="datetime")
     */
    private DateTime $createdAt;

    /**
     * @var DateTime
     * @ORM\Column(name="updated_at", type="datetime")
     */
    private DateTime $updatedAt;

    public function __construct()
    {
        $now = new DateTime();
        $this->createdAt = $now;
        $this->updatedAt = $now;
    }

    public function getId(): int { return $this->id; }
    public function getPayrollRun(): PayrollRun { return $this->payrollRun; }
    public function setPayrollRun(PayrollRun $payrollRun): void { $this->payrollRun = $payrollRun; }
    public function getPayrollRecord(): ?PayrollRecord { return $this->payrollRecord; }
    public function setPayrollRecord(?PayrollRecord $payrollRecord): void { $this->payrollRecord = $payrollRecord; }
    public function getClaimRequest(): ClaimRequest { return $this->claimRequest; }
    public function setClaimRequest(ClaimRequest $claimRequest): void { $this->claimRequest = $claimRequest; }
    public function getEmployee(): Employee { return $this->employee; }
    public function setEmployee(Employee $employee): void { $this->employee = $employee; }
    public function getClaimAmount(): string { return $this->claimAmount; }
    public function setClaimAmount(string $claimAmount): void { $this->claimAmount = $claimAmount; }
    public function getCurrency(): CurrencyType { return $this->currency; }
    public function setCurrency(CurrencyType $currency): void { $this->currency = $currency; }
    public function getSettlementStatus(): string { return $this->settlementStatus; }
    public function setSettlementStatus(string $settlementStatus): void { $this->settlementStatus = $settlementStatus; }
    public function getActiveClaimLock(): ?int { return $this->activeClaimLock; }
    public function setActiveClaimLock(?int $activeClaimLock): void { $this->activeClaimLock = $activeClaimLock; }
    public function getPaymentBatch(): ?PayrollPaymentBatch { return $this->paymentBatch; }
    public function setPaymentBatch(?PayrollPaymentBatch $paymentBatch): void { $this->paymentBatch = $paymentBatch; }
    public function getBankReference(): ?string { return $this->bankReference; }
    public function setBankReference(?string $bankReference): void { $this->bankReference = $bankReference; }
    public function getReconciledAt(): ?DateTime { return $this->reconciledAt; }
    public function setReconciledAt(?DateTime $reconciledAt): void { $this->reconciledAt = $reconciledAt; }
    public function getCreatedAt(): DateTime { return $this->createdAt; }
    public function setCreatedAt(DateTime $createdAt): void { $this->createdAt = $createdAt; }
    public function getUpdatedAt(): DateTime { return $this->updatedAt; }
    public function setUpdatedAt(DateTime $updatedAt): void { $this->updatedAt = $updatedAt; }
}

