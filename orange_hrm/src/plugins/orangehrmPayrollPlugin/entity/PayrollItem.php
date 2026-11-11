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
    public const TYPE_EARNING = 'EARNING';
    public const TYPE_DEDUCTION = 'DEDUCTION';
    public const TYPE_TAX = 'TAX';
    public const TYPE_STATUTORY_EMPLOYER = 'STATUTORY_EMPLOYER';
    public const TYPE_REIMBURSEMENT = 'REIMBURSEMENT';
    public const TYPE_ADJUSTMENT = 'ADJUSTMENT';

    /**
     * @var int
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;

    /**
     * @var PayrollRecord
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\PayrollRecord", inversedBy="items")
     * @ORM\JoinColumn(name="payroll_record_id", referencedColumnName="id", nullable=false)
     */
    private PayrollRecord $payrollRecord;

    /**
     * @var string
     * @ORM\Column(name="item_type", type="string", length=30)
     */
    private string $itemType;

    /**
     * @var string
     * @ORM\Column(name="component_code", type="string", length=40)
     */
    private string $componentCode = 'GENERAL';

    /**
     * @var string
     * @ORM\Column(name="component_name", type="string", length=100)
     */
    private string $componentName;

    /**
     * @var string
     * @ORM\Column(name="amount", type="decimal", precision=15, scale=2)
     */
    private string $amount = '0.00';

    /**
     * @var bool
     * @ORM\Column(name="is_taxable", type="boolean")
     */
    private bool $isTaxable = true;

    /**
     * @var bool
     * @ORM\Column(name="is_statutory", type="boolean")
     */
    private bool $isStatutory = false;

    /**
     * @var string|null
     * @ORM\Column(name="source_module", type="string", length=30, nullable=true)
     */
    private ?string $sourceModule = 'PIM';

    /**
     * @var string|null
     * @ORM\Column(name="notes", type="string", length=255, nullable=true)
     */
    private ?string $notes = null;

    public function getId(): int { return $this->id; }
    public function getPayrollRecord(): PayrollRecord { return $this->payrollRecord; }
    public function setPayrollRecord(PayrollRecord $payrollRecord): void { $this->payrollRecord = $payrollRecord; }
    public function getItemType(): string { return $this->itemType; }
    public function setItemType(string $itemType): void { $this->itemType = $itemType; }
    public function getComponentCode(): string { return $this->componentCode; }
    public function setComponentCode(string $componentCode): void { $this->componentCode = $componentCode; }
    public function getComponentName(): string { return $this->componentName; }
    public function setComponentName(string $componentName): void { $this->componentName = $componentName; }
    public function getAmount(): string { return $this->amount; }
    public function setAmount(string $amount): void { $this->amount = $amount; }
    public function isTaxable(): bool { return $this->isTaxable; }
    public function setIsTaxable(bool $isTaxable): void { $this->isTaxable = $isTaxable; }
    public function isStatutory(): bool { return $this->isStatutory; }
    public function setIsStatutory(bool $isStatutory): void { $this->isStatutory = $isStatutory; }
    public function getSourceModule(): ?string { return $this->sourceModule; }
    public function setSourceModule(?string $sourceModule): void { $this->sourceModule = $sourceModule; }
    public function getNotes(): ?string { return $this->notes; }
    public function setNotes(?string $notes): void { $this->notes = $notes; }
}
