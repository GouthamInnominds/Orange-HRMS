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
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="ohrm_pay_period")
 * @ORM\Entity
 */
class PayrollPayPeriod
{
    public const STATUS_DRAFT = 'Draft';
    public const STATUS_CALCULATING = 'Calculating';
    public const STATUS_UNDER_REVIEW = 'UnderReview';
    public const STATUS_APPROVED = 'Approved';
    public const STATUS_LOCKED = 'Locked';

    public const FREQUENCY_MONTHLY = 'Monthly';
    public const FREQUENCY_BIWEEKLY = 'BiWeekly';
    public const FREQUENCY_WEEKLY = 'Weekly';

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=100)
     */
    private string $name;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="start_date", type="date")
     */
    private DateTime $startDate;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="end_date", type="date")
     */
    private DateTime $endDate;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="pay_date", type="date")
     */
    private DateTime $payDate;

    /**
     * @var string
     *
     * @ORM\Column(name="frequency", type="string", length=30)
     */
    private string $frequency = self::FREQUENCY_MONTHLY;

    /**
     * @var string
     *
     * @ORM\Column(name="status", type="string", length=20)
     */
    private string $status = self::STATUS_DRAFT;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="OrangeHRM\Entity\PayrollRecord", mappedBy="payPeriod", cascade={"persist", "remove"})
     */
    private Collection $payrollRecords;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="created_at", type="datetime")
     */
    private DateTime $createdAt;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime")
     */
    private DateTime $updatedAt;

    public function __construct()
    {
        $this->payrollRecords = new ArrayCollection();
        $this->createdAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getStartDate(): DateTime
    {
        return $this->startDate;
    }

    public function setStartDate(DateTime $startDate): void
    {
        $this->startDate = $startDate;
    }

    public function getEndDate(): DateTime
    {
        return $this->endDate;
    }

    public function setEndDate(DateTime $endDate): void
    {
        $this->endDate = $endDate;
    }

    public function getPayDate(): DateTime
    {
        return $this->payDate;
    }

    public function setPayDate(DateTime $payDate): void
    {
        $this->payDate = $payDate;
    }

    public function getFrequency(): string
    {
        return $this->frequency;
    }

    public function setFrequency(string $frequency): void
    {
        $this->frequency = $frequency;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
        $this->updatedAt = new DateTime();
    }

    public function getPayrollRecords(): Collection
    {
        return $this->payrollRecords;
    }

    public function addPayrollRecord(PayrollRecord $record): void
    {
        if (!$this->payrollRecords->contains($record)) {
            $this->payrollRecords->add($record);
            $record->setPayPeriod($this);
        }
    }

    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): DateTime
    {
        return $this->updatedAt;
    }
}
