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
 * @ORM\Table(name="ohrm_payroll_run")
 * @ORM\Entity
 */
class PayrollRun
{
    public const STATUS_DRAFT = 'DRAFT';
    public const STATUS_CALCULATED = 'CALCULATED';
    public const STATUS_SUBMITTED_FOR_APPROVAL = 'SUBMITTED_FOR_APPROVAL';
    public const STATUS_APPROVED = 'APPROVED';
    public const STATUS_REJECTED = 'REJECTED';
    public const STATUS_LOCKED = 'LOCKED';
    public const STATUS_REVERSED = 'REVERSED';
    public const STATUS_CANCELLED = 'CANCELLED';

    public const RUN_TYPE_REGULAR = 'REGULAR';
    public const RUN_TYPE_ADJUSTMENT = 'ADJUSTMENT';
    public const RUN_TYPE_REVERSAL = 'REVERSAL';

    /**
     * @var int
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;

    /**
     * @var PayrollPayPeriod
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\PayrollPayPeriod")
     * @ORM\JoinColumn(name="pay_period_id", referencedColumnName="id", nullable=false)
     */
    private PayrollPayPeriod $payPeriod;

    /**
     * @var int
     * @ORM\Column(name="run_version", type="integer")
     */
    private int $runVersion = 1;

    /**
     * @var string
     * @ORM\Column(name="run_type", type="string", length=20)
     */
    private string $runType = self::RUN_TYPE_REGULAR;

    /**
     * @var string
     * @ORM\Column(name="status", type="string", length=32)
     */
    private string $status = self::STATUS_DRAFT;

    /**
     * @var string
     * @ORM\Column(name="calculation_version", type="string", length=32)
     */
    private string $calculationVersion = 'IN-FY2026-27-v2.2';

    /**
     * @var string|null
     * @ORM\Column(name="idempotency_key", type="string", length=128, nullable=true, unique=true)
     */
    private ?string $idempotencyKey = null;

    /**
     * @var int
     * @ORM\Column(name="total_employees", type="integer")
     */
    private int $totalEmployees = 0;

    /**
     * @var string
     * @ORM\Column(name="total_gross", type="decimal", precision=19, scale=4)
     */
    private string $totalGross = '0.0000';

    /**
     * @var string
     * @ORM\Column(name="total_deductions", type="decimal", precision=19, scale=4)
     */
    private string $totalDeductions = '0.0000';

    /**
     * @var string
     * @ORM\Column(name="total_tax", type="decimal", precision=19, scale=4)
     */
    private string $totalTax = '0.0000';

    /**
     * @var string
     * @ORM\Column(name="total_reimbursements", type="decimal", precision=19, scale=4)
     */
    private string $totalReimbursements = '0.0000';

    /**
     * @var string
     * @ORM\Column(name="total_net_pay", type="decimal", precision=19, scale=4)
     */
    private string $totalNetPay = '0.0000';

    /**
     * @var int
     * @ORM\Column(name="exception_count", type="integer")
     */
    private int $exceptionCount = 0;

    /**
     * @var User|null
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\User")
     * @ORM\JoinColumn(name="created_by", referencedColumnName="id", nullable=true)
     */
    private ?User $createdBy = null;

    /**
     * @var User|null
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\User")
     * @ORM\JoinColumn(name="submitted_by", referencedColumnName="id", nullable=true)
     */
    private ?User $submittedBy = null;

    /**
     * @var DateTime|null
     * @ORM\Column(name="submitted_at", type="datetime", nullable=true)
     */
    private ?DateTime $submittedAt = null;

    /**
     * @var User|null
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\User")
     * @ORM\JoinColumn(name="approved_by", referencedColumnName="id", nullable=true)
     */
    private ?User $approvedBy = null;

    /**
     * @var DateTime|null
     * @ORM\Column(name="approved_at", type="datetime", nullable=true)
     */
    private ?DateTime $approvedAt = null;

    /**
     * @var User|null
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\User")
     * @ORM\JoinColumn(name="locked_by", referencedColumnName="id", nullable=true)
     */
    private ?User $lockedBy = null;

    /**
     * @var DateTime|null
     * @ORM\Column(name="locked_at", type="datetime", nullable=true)
     */
    private ?DateTime $lockedAt = null;

    /**
     * @var string|null
     * @ORM\Column(name="rejection_reason", type="string", length=500, nullable=true)
     */
    private ?string $rejectionReason = null;

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
    public function getPayPeriod(): PayrollPayPeriod { return $this->payPeriod; }
    public function setPayPeriod(PayrollPayPeriod $payPeriod): void { $this->payPeriod = $payPeriod; }
    public function getRunVersion(): int { return $this->runVersion; }
    public function setRunVersion(int $runVersion): void { $this->runVersion = $runVersion; }
    public function getRunType(): string { return $this->runType; }
    public function setRunType(string $runType): void { $this->runType = $runType; }
    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): void { $this->status = $status; }
    public function getCalculationVersion(): string { return $this->calculationVersion; }
    public function setCalculationVersion(string $calculationVersion): void { $this->calculationVersion = $calculationVersion; }
    public function getIdempotencyKey(): ?string { return $this->idempotencyKey; }
    public function setIdempotencyKey(?string $idempotencyKey): void { $this->idempotencyKey = $idempotencyKey; }
    public function getTotalEmployees(): int { return $this->totalEmployees; }
    public function setTotalEmployees(int $totalEmployees): void { $this->totalEmployees = $totalEmployees; }
    public function getTotalGross(): string { return $this->totalGross; }
    public function setTotalGross(string $totalGross): void { $this->totalGross = $totalGross; }
    public function getTotalDeductions(): string { return $this->totalDeductions; }
    public function setTotalDeductions(string $totalDeductions): void { $this->totalDeductions = $totalDeductions; }
    public function getTotalTax(): string { return $this->totalTax; }
    public function setTotalTax(string $totalTax): void { $this->totalTax = $totalTax; }
    public function getTotalReimbursements(): string { return $this->totalReimbursements; }
    public function setTotalReimbursements(string $totalReimbursements): void { $this->totalReimbursements = $totalReimbursements; }
    public function getTotalNetPay(): string { return $this->totalNetPay; }
    public function setTotalNetPay(string $totalNetPay): void { $this->totalNetPay = $totalNetPay; }
    public function getExceptionCount(): int { return $this->exceptionCount; }
    public function setExceptionCount(int $exceptionCount): void { $this->exceptionCount = $exceptionCount; }
    public function getCreatedBy(): ?User { return $this->createdBy; }
    public function setCreatedBy(?User $createdBy): void { $this->createdBy = $createdBy; }
    public function getSubmittedBy(): ?User { return $this->submittedBy; }
    public function setSubmittedBy(?User $submittedBy): void { $this->submittedBy = $submittedBy; }
    public function getSubmittedAt(): ?DateTime { return $this->submittedAt; }
    public function setSubmittedAt(?DateTime $submittedAt): void { $this->submittedAt = $submittedAt; }
    public function getApprovedBy(): ?User { return $this->approvedBy; }
    public function setApprovedBy(?User $approvedBy): void { $this->approvedBy = $approvedBy; }
    public function getApprovedAt(): ?DateTime { return $this->approvedAt; }
    public function setApprovedAt(?DateTime $approvedAt): void { $this->approvedAt = $approvedAt; }
    public function getLockedBy(): ?User { return $this->lockedBy; }
    public function setLockedBy(?User $lockedBy): void { $this->lockedBy = $lockedBy; }
    public function getLockedAt(): ?DateTime { return $this->lockedAt; }
    public function setLockedAt(?DateTime $lockedAt): void { $this->lockedAt = $lockedAt; }
    public function getRejectionReason(): ?string { return $this->rejectionReason; }
    public function setRejectionReason(?string $rejectionReason): void { $this->rejectionReason = $rejectionReason; }
    public function getCreatedAt(): DateTime { return $this->createdAt; }
    public function setCreatedAt(DateTime $createdAt): void { $this->createdAt = $createdAt; }
    public function getUpdatedAt(): DateTime { return $this->updatedAt; }
    public function setUpdatedAt(DateTime $updatedAt): void { $this->updatedAt = $updatedAt; }
}

