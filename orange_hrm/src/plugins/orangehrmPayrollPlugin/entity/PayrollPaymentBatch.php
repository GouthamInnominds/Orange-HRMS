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
 * @ORM\Table(name="ohrm_payroll_payment_batch")
 * @ORM\Entity
 */
class PayrollPaymentBatch
{
    public const STATUS_PAYMENT_PENDING = 'PAYMENT_PENDING';
    public const STATUS_EXPORTED = 'EXPORTED';
    public const STATUS_PARTIALLY_PAID = 'PARTIALLY_PAID';
    public const STATUS_PAID_RECONCILED = 'PAID_RECONCILED';
    public const STATUS_PAYMENT_FAILED = 'PAYMENT_FAILED';

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
     * @var string
     * @ORM\Column(name="batch_reference", type="string", length=64, unique=true)
     */
    private string $batchReference;

    /**
     * @var string
     * @ORM\Column(name="payment_mode", type="string", length=30)
     */
    private string $paymentMode = 'NEFT';

    /**
     * @var string
     * @ORM\Column(name="total_amount", type="decimal", precision=19, scale=4)
     */
    private string $totalAmount = '0.0000';

    /**
     * @var int
     * @ORM\Column(name="record_count", type="integer")
     */
    private int $recordCount = 0;

    /**
     * @var CurrencyType
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\CurrencyType")
     * @ORM\JoinColumn(name="currency_id", referencedColumnName="currency_id", nullable=false)
     */
    private CurrencyType $currency;

    /**
     * @var string
     * @ORM\Column(name="status", type="string", length=32)
     */
    private string $status = self::STATUS_PAYMENT_PENDING;

    /**
     * @var string|null
     * @ORM\Column(name="export_csv_path", type="string", length=255, nullable=true)
     */
    private ?string $exportCsvPath = null;

    /**
     * @var string|null
     * @ORM\Column(name="utr_number", type="string", length=100, nullable=true)
     */
    private ?string $utrNumber = null;

    /**
     * @var User|null
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\User")
     * @ORM\JoinColumn(name="exported_by", referencedColumnName="id", nullable=true)
     */
    private ?User $exportedBy = null;

    /**
     * @var DateTime|null
     * @ORM\Column(name="exported_at", type="datetime", nullable=true)
     */
    private ?DateTime $exportedAt = null;

    /**
     * @var User|null
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\User")
     * @ORM\JoinColumn(name="reconciled_by", referencedColumnName="id", nullable=true)
     */
    private ?User $reconciledBy = null;

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

    public function __construct()
    {
        $this->createdAt = new DateTime();
    }

    public function getId(): int { return $this->id; }
    public function getPayrollRun(): PayrollRun { return $this->payrollRun; }
    public function setPayrollRun(PayrollRun $payrollRun): void { $this->payrollRun = $payrollRun; }
    public function getBatchReference(): string { return $this->batchReference; }
    public function setBatchReference(string $batchReference): void { $this->batchReference = $batchReference; }
    public function getPaymentMode(): string { return $this->paymentMode; }
    public function setPaymentMode(string $paymentMode): void { $this->paymentMode = $paymentMode; }
    public function getTotalAmount(): string { return $this->totalAmount; }
    public function setTotalAmount(string $totalAmount): void { $this->totalAmount = $totalAmount; }
    public function getRecordCount(): int { return $this->recordCount; }
    public function setRecordCount(int $recordCount): void { $this->recordCount = $recordCount; }
    public function getCurrency(): CurrencyType { return $this->currency; }
    public function setCurrency(CurrencyType $currency): void { $this->currency = $currency; }
    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): void { $this->status = $status; }
    public function getExportCsvPath(): ?string { return $this->exportCsvPath; }
    public function setExportCsvPath(?string $exportCsvPath): void { $this->exportCsvPath = $exportCsvPath; }
    public function getUtrNumber(): ?string { return $this->utrNumber; }
    public function setUtrNumber(?string $utrNumber): void { $this->utrNumber = $utrNumber; }
    public function getExportedBy(): ?User { return $this->exportedBy; }
    public function setExportedBy(?User $exportedBy): void { $this->exportedBy = $exportedBy; }
    public function getExportedAt(): ?DateTime { return $this->exportedAt; }
    public function setExportedAt(?DateTime $exportedAt): void { $this->exportedAt = $exportedAt; }
    public function getReconciledBy(): ?User { return $this->reconciledBy; }
    public function setReconciledBy(?User $reconciledBy): void { $this->reconciledBy = $reconciledBy; }
    public function getReconciledAt(): ?DateTime { return $this->reconciledAt; }
    public function setReconciledAt(?DateTime $reconciledAt): void { $this->reconciledAt = $reconciledAt; }
    public function getCreatedAt(): DateTime { return $this->createdAt; }
    public function setCreatedAt(DateTime $createdAt): void { $this->createdAt = $createdAt; }
}

