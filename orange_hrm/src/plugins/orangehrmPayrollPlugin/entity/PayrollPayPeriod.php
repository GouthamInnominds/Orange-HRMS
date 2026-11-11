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
 * @ORM\Table(name="ohrm_pay_period")
 * @ORM\Entity
 */
class PayrollPayPeriod
{
    public const STATUS_OPEN = 'OPEN';
    public const STATUS_DRAFT = 'DRAFT';
    public const STATUS_IN_PROCESSING = 'IN_PROCESSING';
    public const STATUS_LOCKED = 'LOCKED';
    public const STATUS_CLOSED = 'CLOSED';

    /**
     * @var int
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;

    /**
     * @var string
     * @ORM\Column(name="name", type="string", length=100)
     */
    private string $name;

    /**
     * @var DateTime
     * @ORM\Column(name="start_date", type="date")
     */
    private DateTime $startDate;

    /**
     * @var DateTime
     * @ORM\Column(name="end_date", type="date")
     */
    private DateTime $endDate;

    /**
     * @var DateTime
     * @ORM\Column(name="pay_date", type="date")
     */
    private DateTime $payDate;

    /**
     * @var string
     * @ORM\Column(name="frequency", type="string", length=30)
     */
    private string $frequency = 'MONTHLY';

    /**
     * @var string
     * @ORM\Column(name="status", type="string", length=30)
     */
    private string $status = self::STATUS_OPEN;

    /**
     * @var string
     * @ORM\Column(name="jurisdiction_code", type="string", length=20)
     */
    private string $jurisdictionCode = 'IN';

    /**
     * @var string
     * @ORM\Column(name="financial_year", type="string", length=16)
     */
    private string $financialYear = '2026-27';

    /**
     * @var int|null
     * @ORM\Column(name="period_month", type="smallint", nullable=true)
     */
    private ?int $periodMonth = null;

    /**
     * @var int|null
     * @ORM\Column(name="period_year", type="smallint", nullable=true)
     */
    private ?int $periodYear = null;

    /**
     * @var CurrencyType
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\CurrencyType")
     * @ORM\JoinColumn(name="currency_id", referencedColumnName="currency_id", nullable=false)
     */
    private CurrencyType $currency;

    /**
     * @var string
     * @ORM\Column(name="standard_working_days", type="decimal", precision=5, scale=2)
     */
    private string $standardWorkingDays = '22.00';

    /**
     * @var User|null
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\User")
     * @ORM\JoinColumn(name="created_by", referencedColumnName="id", nullable=true)
     */
    private ?User $createdBy = null;

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
    public function getName(): string { return $this->name; }
    public function setName(string $name): void { $this->name = $name; }
    public function getStartDate(): DateTime { return $this->startDate; }
    public function setStartDate(DateTime $startDate): void { $this->startDate = $startDate; }
    public function getEndDate(): DateTime { return $this->endDate; }
    public function setEndDate(DateTime $endDate): void { $this->endDate = $endDate; }
    public function getPayDate(): DateTime { return $this->payDate; }
    public function setPayDate(DateTime $payDate): void { $this->payDate = $payDate; }
    public function getFrequency(): string { return $this->frequency; }
    public function setFrequency(string $frequency): void { $this->frequency = $frequency; }
    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): void { $this->status = $status; }
    public function getJurisdictionCode(): string { return $this->jurisdictionCode; }
    public function setJurisdictionCode(string $jurisdictionCode): void { $this->jurisdictionCode = $jurisdictionCode; }
    public function getFinancialYear(): string { return $this->financialYear; }
    public function setFinancialYear(string $financialYear): void { $this->financialYear = $financialYear; }
    public function getPeriodMonth(): ?int { return $this->periodMonth; }
    public function setPeriodMonth(?int $periodMonth): void { $this->periodMonth = $periodMonth; }
    public function getPeriodYear(): ?int { return $this->periodYear; }
    public function setPeriodYear(?int $periodYear): void { $this->periodYear = $periodYear; }
    public function getCurrency(): CurrencyType { return $this->currency; }
    public function setCurrency(CurrencyType $currency): void { $this->currency = $currency; }
    public function getStandardWorkingDays(): string { return $this->standardWorkingDays; }
    public function setStandardWorkingDays(string $standardWorkingDays): void { $this->standardWorkingDays = $standardWorkingDays; }
    public function getCreatedBy(): ?User { return $this->createdBy; }
    public function setCreatedBy(?User $createdBy): void { $this->createdBy = $createdBy; }
    public function getCreatedAt(): DateTime { return $this->createdAt; }
    public function setCreatedAt(DateTime $createdAt): void { $this->createdAt = $createdAt; }
    public function getUpdatedAt(): DateTime { return $this->updatedAt; }
    public function setUpdatedAt(DateTime $updatedAt): void { $this->updatedAt = $updatedAt; }
}
