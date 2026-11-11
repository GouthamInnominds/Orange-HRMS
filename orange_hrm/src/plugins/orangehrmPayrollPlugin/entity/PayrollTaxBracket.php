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
 * @ORM\Table(name="ohrm_payroll_tax_bracket")
 * @ORM\Entity
 */
class PayrollTaxBracket
{
    public const REGIME_NEW_115BAC = 'NEW_115BAC';
    public const REGIME_OLD = 'OLD';

    /**
     * @var int
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;

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
     * @var string
     * @ORM\Column(name="tax_regime", type="string", length=20)
     */
    private string $taxRegime = self::REGIME_NEW_115BAC;

    /**
     * @var int
     * @ORM\Column(name="slab_order", type="integer")
     */
    private int $slabOrder;

    /**
     * @var string
     * @ORM\Column(name="min_income", type="decimal", precision=15, scale=2)
     */
    private string $minIncome = '0.00';

    /**
     * @var string|null
     * @ORM\Column(name="max_income", type="decimal", precision=15, scale=2, nullable=true)
     */
    private ?string $maxIncome = null;

    /**
     * @var string
     * @ORM\Column(name="tax_rate", type="decimal", precision=7, scale=4)
     */
    private string $taxRate = '0.0000';

    /**
     * @var string
     * @ORM\Column(name="cess_rate", type="decimal", precision=7, scale=4)
     */
    private string $cessRate = '4.0000';

    /**
     * @var string
     * @ORM\Column(name="rebate_limit", type="decimal", precision=15, scale=2)
     */
    private string $rebateLimit = '1200000.00';

    /**
     * @var string
     * @ORM\Column(name="rebate_max_amount", type="decimal", precision=15, scale=2)
     */
    private string $rebateMaxAmount = '60000.00';

    /**
     * @var string
     * @ORM\Column(name="standard_deduction", type="decimal", precision=15, scale=2)
     */
    private string $standardDeduction = '75000.00';

    /**
     * @var bool
     * @ORM\Column(name="is_active", type="boolean")
     */
    private bool $isActive = true;

    public function getId(): int { return $this->id; }
    public function getJurisdictionCode(): string { return $this->jurisdictionCode; }
    public function setJurisdictionCode(string $jurisdictionCode): void { $this->jurisdictionCode = $jurisdictionCode; }
    public function getFinancialYear(): string { return $this->financialYear; }
    public function setFinancialYear(string $financialYear): void { $this->financialYear = $financialYear; }
    public function getTaxRegime(): string { return $this->taxRegime; }
    public function setTaxRegime(string $taxRegime): void { $this->taxRegime = $taxRegime; }
    public function getSlabOrder(): int { return $this->slabOrder; }
    public function setSlabOrder(int $slabOrder): void { $this->slabOrder = $slabOrder; }
    public function getMinIncome(): string { return $this->minIncome; }
    public function setMinIncome(string $minIncome): void { $this->minIncome = $minIncome; }
    public function getMaxIncome(): ?string { return $this->maxIncome; }
    public function setMaxIncome(?string $maxIncome): void { $this->maxIncome = $maxIncome; }
    public function getTaxRate(): string { return $this->taxRate; }
    public function setTaxRate(string $taxRate): void { $this->taxRate = $taxRate; }
    public function getCessRate(): string { return $this->cessRate; }
    public function setCessRate(string $cessRate): void { $this->cessRate = $cessRate; }
    public function getRebateLimit(): string { return $this->rebateLimit; }
    public function setRebateLimit(string $rebateLimit): void { $this->rebateLimit = $rebateLimit; }
    public function getRebateMaxAmount(): string { return $this->rebateMaxAmount; }
    public function setRebateMaxAmount(string $rebateMaxAmount): void { $this->rebateMaxAmount = $rebateMaxAmount; }
    public function getStandardDeduction(): string { return $this->standardDeduction; }
    public function setStandardDeduction(string $standardDeduction): void { $this->standardDeduction = $standardDeduction; }
    public function isActive(): bool { return $this->isActive; }
    public function setIsActive(bool $isActive): void { $this->isActive = $isActive; }
}

