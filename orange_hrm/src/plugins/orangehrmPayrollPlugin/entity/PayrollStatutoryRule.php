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
 * @ORM\Table(name="ohrm_payroll_statutory_rule")
 * @ORM\Entity
 */
class PayrollStatutoryRule
{
    public const RULE_TYPE_EPF = 'EPF';
    public const RULE_TYPE_ESIC = 'ESIC';
    public const RULE_TYPE_PT = 'PT';

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
     * @ORM\Column(name="rule_type", type="string", length=30)
     */
    private string $ruleType;

    /**
     * @var string|null
     * @ORM\Column(name="state_code", type="string", length=10, nullable=true)
     */
    private ?string $stateCode = null;

    /**
     * @var DateTime
     * @ORM\Column(name="effective_from", type="date")
     */
    private DateTime $effectiveFrom;

    /**
     * @var DateTime|null
     * @ORM\Column(name="effective_to", type="date", nullable=true)
     */
    private ?DateTime $effectiveTo = null;

    /**
     * @var string
     * @ORM\Column(name="slab_min", type="decimal", precision=15, scale=2)
     */
    private string $slabMin = '0.00';

    /**
     * @var string|null
     * @ORM\Column(name="slab_max", type="decimal", precision=15, scale=2, nullable=true)
     */
    private ?string $slabMax = null;

    /**
     * @var string
     * @ORM\Column(name="employee_rate", type="decimal", precision=7, scale=4)
     */
    private string $employeeRate = '0.0000';

    /**
     * @var string
     * @ORM\Column(name="employer_rate", type="decimal", precision=7, scale=4)
     */
    private string $employerRate = '0.0000';

    /**
     * @var string
     * @ORM\Column(name="fixed_employee_amount", type="decimal", precision=15, scale=2)
     */
    private string $fixedEmployeeAmount = '0.00';

    /**
     * @var string|null
     * @ORM\Column(name="february_employee_amount", type="decimal", precision=15, scale=2, nullable=true)
     */
    private ?string $februaryEmployeeAmount = null;

    /**
     * @var string|null
     * @ORM\Column(name="wage_ceiling", type="decimal", precision=15, scale=2, nullable=true)
     */
    private ?string $wageCeiling = null;

    /**
     * @var string
     * @ORM\Column(name="rounding_mode", type="string", length=30)
     */
    private string $roundingMode = 'HALF_UP';

    /**
     * @var string|null
     * @ORM\Column(name="metadata_json", type="text", nullable=true)
     */
    private ?string $metadataJson = null;

    /**
     * @var bool
     * @ORM\Column(name="is_active", type="boolean")
     */
    private bool $isActive = true;

    public function getId(): int { return $this->id; }
    public function getJurisdictionCode(): string { return $this->jurisdictionCode; }
    public function setJurisdictionCode(string $jurisdictionCode): void { $this->jurisdictionCode = $jurisdictionCode; }
    public function getRuleType(): string { return $this->ruleType; }
    public function setRuleType(string $ruleType): void { $this->ruleType = $ruleType; }
    public function getStateCode(): ?string { return $this->stateCode; }
    public function setStateCode(?string $stateCode): void { $this->stateCode = $stateCode; }
    public function getEffectiveFrom(): DateTime { return $this->effectiveFrom; }
    public function setEffectiveFrom(DateTime $effectiveFrom): void { $this->effectiveFrom = $effectiveFrom; }
    public function getEffectiveTo(): ?DateTime { return $this->effectiveTo; }
    public function setEffectiveTo(?DateTime $effectiveTo): void { $this->effectiveTo = $effectiveTo; }
    public function getSlabMin(): string { return $this->slabMin; }
    public function setSlabMin(string $slabMin): void { $this->slabMin = $slabMin; }
    public function getSlabMax(): ?string { return $this->slabMax; }
    public function setSlabMax(?string $slabMax): void { $this->slabMax = $slabMax; }
    public function getEmployeeRate(): string { return $this->employeeRate; }
    public function setEmployeeRate(string $employeeRate): void { $this->employeeRate = $employeeRate; }
    public function getEmployerRate(): string { return $this->employerRate; }
    public function setEmployerRate(string $employerRate): void { $this->employerRate = $employerRate; }
    public function getFixedEmployeeAmount(): string { return $this->fixedEmployeeAmount; }
    public function setFixedEmployeeAmount(string $fixedEmployeeAmount): void { $this->fixedEmployeeAmount = $fixedEmployeeAmount; }
    public function getFebruaryEmployeeAmount(): ?string { return $this->februaryEmployeeAmount; }
    public function setFebruaryEmployeeAmount(?string $februaryEmployeeAmount): void { $this->februaryEmployeeAmount = $februaryEmployeeAmount; }
    public function getWageCeiling(): ?string { return $this->wageCeiling; }
    public function setWageCeiling(?string $wageCeiling): void { $this->wageCeiling = $wageCeiling; }
    public function getRoundingMode(): string { return $this->roundingMode; }
    public function setRoundingMode(string $roundingMode): void { $this->roundingMode = $roundingMode; }
    public function getMetadataJson(): ?string { return $this->metadataJson; }
    public function setMetadataJson(?string $metadataJson): void { $this->metadataJson = $metadataJson; }
    public function isActive(): bool { return $this->isActive; }
    public function setIsActive(bool $isActive): void { $this->isActive = $isActive; }
}

