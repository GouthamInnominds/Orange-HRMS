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

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="ohrm_payroll_item")
 * @ORM\Entity
 */
class PayrollItem
{
    public const TYPE_EARNING = 'Earning';
    public const TYPE_DEDUCTION = 'Deduction';
    public const TYPE_TAX = 'Tax';

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;

    /**
     * @var PayrollRecord
     *
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\PayrollRecord", inversedBy="payrollItems")
     * @ORM\JoinColumn(name="payroll_record_id", referencedColumnName="id", nullable=false)
     */
    private PayrollRecord $payrollRecord;

    /**
     * @var string
     *
     * @ORM\Column(name="item_type", type="string", length=30)
     */
    private string $itemType = self::TYPE_EARNING;

    /**
     * @var string
     *
     * @ORM\Column(name="component_name", type="string", length=100)
     */
    private string $componentName;

    /**
     * @var float
     *
     * @ORM\Column(name="amount", type="decimal", precision=12, scale=2)
     */
    private float $amount = 0.00;

    /**
     * @var bool
     *
     * @ORM\Column(name="is_taxable", type="boolean")
     */
    private bool $isTaxable = true;

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getPayrollRecord(): PayrollRecord
    {
        return $this->payrollRecord;
    }

    public function setPayrollRecord(PayrollRecord $payrollRecord): void
    {
        $this->payrollRecord = $payrollRecord;
    }

    public function getItemType(): string
    {
        return $this->itemType;
    }

    public function setItemType(string $itemType): void
    {
        $this->itemType = $itemType;
    }

    public function getComponentName(): string
    {
        return $this->componentName;
    }

    public function setComponentName(string $componentName): void
    {
        $this->componentName = $componentName;
    }

    public function getAmount(): float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): void
    {
        $this->amount = $amount;
    }

    public function isTaxable(): bool
    {
        return $this->isTaxable;
    }

    public function setIsTaxable(bool $isTaxable): void
    {
        $this->isTaxable = $isTaxable;
    }
}
