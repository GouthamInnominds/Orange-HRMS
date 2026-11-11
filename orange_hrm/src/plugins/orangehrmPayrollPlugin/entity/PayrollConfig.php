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
 * @ORM\Table(name="ohrm_payroll_config")
 * @ORM\Entity
 */
class PayrollConfig
{
    public const LWP_DIVISOR_CALENDAR_DAYS = 'CALENDAR_DAYS';
    public const LWP_DIVISOR_WORKING_DAYS = 'WORKING_DAYS';
    public const LWP_DIVISOR_FIXED_30 = 'FIXED_30';

    public const TIME_SOURCE_ATTENDANCE_ONLY = 'ATTENDANCE_ONLY';
    public const TIME_SOURCE_TIMESHEET_ONLY = 'TIMESHEET_ONLY';
    public const TIME_SOURCE_TIMESHEET_PRIMARY = 'TIMESHEET_PRIMARY_ATTENDANCE_VALIDATION';

    /**
     * @var int
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;

    /**
     * @var string
     * @ORM\Column(name="jurisdiction_code", type="string", length=20, unique=true)
     */
    private string $jurisdictionCode = 'IN';

    /**
     * @var CurrencyType
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\CurrencyType")
     * @ORM\JoinColumn(name="default_currency_id", referencedColumnName="currency_id", nullable=false)
     */
    private CurrencyType $defaultCurrency;

    /**
     * @var string
     * @ORM\Column(name="pay_frequency", type="string", length=30)
     */
    private string $payFrequency = 'MONTHLY';

    /**
     * @var string
     * @ORM\Column(name="lwp_divisor_mode", type="string", length=30)
     */
    private string $lwpDivisorMode = self::LWP_DIVISOR_CALENDAR_DAYS;

    /**
     * @var string
     * @ORM\Column(name="time_attendance_source_mode", type="string", length=50)
     */
    private string $timeAttendanceSourceMode = self::TIME_SOURCE_ATTENDANCE_ONLY;

    /**
     * @var string
     * @ORM\Column(name="standard_shift_hours", type="decimal", precision=5, scale=2)
     */
    private string $standardShiftHours = '8.00';

    /**
     * @var string
     * @ORM\Column(name="overtime_multiplier", type="decimal", precision=5, scale=2)
     */
    private string $overtimeMultiplier = '2.00';

    /**
     * @var string|null
     * @ORM\Column(name="overtime_eligible_max_basic", type="decimal", precision=15, scale=2, nullable=true)
     */
    private ?string $overtimeEligibleMaxBasic = '50000.00';

    /**
     * @var string
     * @ORM\Column(name="epf_wage_ceiling", type="decimal", precision=15, scale=2)
     */
    private string $epfWageCeiling = '15000.00';

    /**
     * @var bool
     * @ORM\Column(name="epf_cap_at_ceiling", type="boolean")
     */
    private bool $epfCapAtCeiling = true;

    /**
     * @var string
     * @ORM\Column(name="esic_gross_ceiling", type="decimal", precision=15, scale=2)
     */
    private string $esicGrossCeiling = '21000.00';

    /**
     * @var string
     * @ORM\Column(name="default_pt_state_code", type="string", length=10)
     */
    private string $defaultPtStateCode = 'KA';

    /**
     * @var string
     * @ORM\Column(name="default_tax_regime", type="string", length=20)
     */
    private string $defaultTaxRegime = 'NEW_115BAC';

    /**
     * @var bool
     * @ORM\Column(name="require_maker_checker_approval", type="boolean")
     */
    private bool $requireMakerCheckerApproval = true;

    /**
     * @var User|null
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\User")
     * @ORM\JoinColumn(name="updated_by", referencedColumnName="id", nullable=true)
     */
    private ?User $updatedBy = null;

    /**
     * @var DateTime
     * @ORM\Column(name="updated_at", type="datetime")
     */
    private DateTime $updatedAt;

    public function __construct()
    {
        $this->updatedAt = new DateTime();
    }

    public function getId(): int { return $this->id; }
    public function getJurisdictionCode(): string { return $this->jurisdictionCode; }
    public function setJurisdictionCode(string $jurisdictionCode): void { $this->jurisdictionCode = $jurisdictionCode; }
    public function getDefaultCurrency(): CurrencyType { return $this->defaultCurrency; }
    public function setDefaultCurrency(CurrencyType $defaultCurrency): void { $this->defaultCurrency = $defaultCurrency; }
    public function getPayFrequency(): string { return $this->payFrequency; }
    public function setPayFrequency(string $payFrequency): void { $this->payFrequency = $payFrequency; }
    public function getLwpDivisorMode(): string { return $this->lwpDivisorMode; }
    public function setLwpDivisorMode(string $lwpDivisorMode): void { $this->lwpDivisorMode = $lwpDivisorMode; }
    public function getTimeAttendanceSourceMode(): string { return $this->timeAttendanceSourceMode; }
    public function setTimeAttendanceSourceMode(string $timeAttendanceSourceMode): void { $this->timeAttendanceSourceMode = $timeAttendanceSourceMode; }
    public function getStandardShiftHours(): string { return $this->standardShiftHours; }
    public function setStandardShiftHours(string $standardShiftHours): void { $this->standardShiftHours = $standardShiftHours; }
    public function getOvertimeMultiplier(): string { return $this->overtimeMultiplier; }
    public function setOvertimeMultiplier(string $overtimeMultiplier): void { $this->overtimeMultiplier = $overtimeMultiplier; }
    public function getOvertimeEligibleMaxBasic(): ?string { return $this->overtimeEligibleMaxBasic; }
    public function setOvertimeEligibleMaxBasic(?string $overtimeEligibleMaxBasic): void { $this->overtimeEligibleMaxBasic = $overtimeEligibleMaxBasic; }
    public function getEpfWageCeiling(): string { return $this->epfWageCeiling; }
    public function setEpfWageCeiling(string $epfWageCeiling): void { $this->epfWageCeiling = $epfWageCeiling; }
    public function isEpfCapAtCeiling(): bool { return $this->epfCapAtCeiling; }
    public function setEpfCapAtCeiling(bool $epfCapAtCeiling): void { $this->epfCapAtCeiling = $epfCapAtCeiling; }
    public function getEsicGrossCeiling(): string { return $this->esicGrossCeiling; }
    public function setEsicGrossCeiling(string $esicGrossCeiling): void { $this->esicGrossCeiling = $esicGrossCeiling; }
    public function getDefaultPtStateCode(): string { return $this->defaultPtStateCode; }
    public function setDefaultPtStateCode(string $defaultPtStateCode): void { $this->defaultPtStateCode = $defaultPtStateCode; }
    public function getDefaultTaxRegime(): string { return $this->defaultTaxRegime; }
    public function setDefaultTaxRegime(string $defaultTaxRegime): void { $this->defaultTaxRegime = $defaultTaxRegime; }
    public function isRequireMakerCheckerApproval(): bool { return $this->requireMakerCheckerApproval; }
    public function setRequireMakerCheckerApproval(bool $requireMakerCheckerApproval): void { $this->requireMakerCheckerApproval = $requireMakerCheckerApproval; }
    public function getUpdatedBy(): ?User { return $this->updatedBy; }
    public function setUpdatedBy(?User $updatedBy): void { $this->updatedBy = $updatedBy; }
    public function getUpdatedAt(): DateTime { return $this->updatedAt; }
    public function setUpdatedAt(DateTime $updatedAt): void { $this->updatedAt = $updatedAt; }
}

