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
 * @ORM\Table(name="ohrm_payroll_record")
 * @ORM\Entity
 */
class PayrollRecord
{
    public const STATUS_CALCULATED = 'Calculated';
    public const STATUS_ADJUSTED = 'Adjusted';
    public const STATUS_APPROVED = 'Approved';
    public const STATUS_LOCKED = 'Locked';

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;

    /**
     * @var PayrollPayPeriod
     *
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\PayrollPayPeriod", inversedBy="payrollRecords")
     * @ORM\JoinColumn(name="pay_period_id", referencedColumnName="id", nullable=false)
     */
    private PayrollPayPeriod $payPeriod;

    /**
     * @var int
     *
     * @ORM\Column(name="emp_number", type="integer")
     */
    private int $empNumber;

    /**
     * @var float
     *
     * @ORM\Column(name="gross_salary", type="decimal", precision=12, scale=2)
     */
    private float $grossSalary = 0.00;

    /**
     * @var float
     *
     * @ORM\Column(name="total_allowance", type="decimal", precision=12, scale=2)
     */
    private float $totalAllowance = 0.00;

    /**
     * @var float
     *
     * @ORM\Column(name="total_deduction", type="decimal", precision=12, scale=2)
     */
    private float $totalDeduction = 0.00;

    /**
     * @var float
     *
     * @ORM\Column(name="total_tax", type="decimal", precision=12, scale=2)
     */
    private float $totalTax = 0.00;

    /**
     * @var float
     *
     * @ORM\Column(name="net_salary", type="decimal", precision=12, scale=2)
     */
    private float $netSalary = 0.00;

    /**
     * @var string
     *
     * @ORM\Column(name="currency_id", type="string", length=6)
     */
    private string $currencyId = 'USD';

    /**
     * @var string
     *
     * @ORM\Column(name="status", type="string", length=30)
     */
    private string $status = self::STATUS_CALCULATED;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="OrangeHRM\Entity\PayrollItem", mappedBy="payrollRecord", cascade={"persist", "remove"})
     */
    private Collection $payrollItems;

    public function __construct()
    {
        $this->payrollItems = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getPayPeriod(): PayrollPayPeriod
    {
        return $this->payPeriod;
    }

    public function setPayPeriod(PayrollPayPeriod $payPeriod): void
    {
        $this->payPeriod = $payPeriod;
    }

    public function getEmpNumber(): int
    {
        return $this->empNumber;
    }

    public function setEmpNumber(int $empNumber): void
    {
        $this->empNumber = $empNumber;
    }

    public function getGrossSalary(): float
    {
        return $this->grossSalary;
    }

    public function setGrossSalary(float $grossSalary): void
    {
        $this->grossSalary = $grossSalary;
    }

    public function getTotalAllowance(): float
    {
        return $this->totalAllowance;
    }

    public function setTotalAllowance(float $totalAllowance): void
    {
        $this->totalAllowance = $totalAllowance;
    }

    public function getTotalDeduction(): float
    {
        return $this->totalDeduction;
    }

    public function setTotalDeduction(float $totalDeduction): void
    {
        $this->totalDeduction = $totalDeduction;
    }

    public function getTotalTax(): float
    {
        return $this->totalTax;
    }

    public function setTotalTax(float $totalTax): void
    {
        $this->totalTax = $totalTax;
    }

    public function getNetSalary(): float
    {
        return $this->netSalary;
    }

    public function setNetSalary(float $netSalary): void
    {
        $this->netSalary = $netSalary;
    }

    public function getCurrencyId(): string
    {
        return $this->currencyId;
    }

    public function setCurrencyId(string $currencyId): void
    {
        $this->currencyId = $currencyId;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    public function getPayrollItems(): Collection
    {
        return $this->payrollItems;
    }
}
