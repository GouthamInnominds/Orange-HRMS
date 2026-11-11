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
 * @ORM\Table(name="ohrm_payroll_emp_profile")
 * @ORM\Entity
 */
class EmployeePayrollProfile
{
    /**
     * @var int
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;

    /**
     * @var Employee
     * @ORM\OneToOne(targetEntity="OrangeHRM\Entity\Employee")
     * @ORM\JoinColumn(name="emp_number", referencedColumnName="emp_number", nullable=false)
     */
    private Employee $employee;

    /**
     * @var string|null
     * @ORM\Column(name="pan_number", type="string", length=20, nullable=true)
     */
    private ?string $panNumber = null;

    /**
     * @var string|null
     * @ORM\Column(name="uan_number", type="string", length=20, nullable=true)
     */
    private ?string $uanNumber = null;

    /**
     * @var string|null
     * @ORM\Column(name="esic_ip_number", type="string", length=30, nullable=true)
     */
    private ?string $esicIpNumber = null;

    /**
     * @var string
     * @ORM\Column(name="pt_state_code", type="string", length=10)
     */
    private string $ptStateCode = 'KA';

    /**
     * @var string
     * @ORM\Column(name="tax_regime", type="string", length=20)
     */
    private string $taxRegime = PayrollTaxBracket::REGIME_NEW_115BAC;

    /**
     * @var bool
     * @ORM\Column(name="epf_opted_in", type="boolean")
     */
    private bool $epfOptedIn = true;

    /**
     * @var bool
     * @ORM\Column(name="epf_restrict_to_ceiling", type="boolean")
     */
    private bool $epfRestrictToCeiling = true;

    /**
     * @var bool
     * @ORM\Column(name="esic_applicable", type="boolean")
     */
    private bool $esicApplicable = true;

    /**
     * @var bool
     * @ORM\Column(name="pt_applicable", type="boolean")
     */
    private bool $ptApplicable = true;

    /**
     * @var string
     * @ORM\Column(name="basic_percent_of_ctc", type="decimal", precision=5, scale=2)
     */
    private string $basicPercentOfCtc = '50.00';

    /**
     * @var string
     * @ORM\Column(name="hra_percent_of_basic", type="decimal", precision=5, scale=2)
     */
    private string $hraPercentOfBasic = '40.00';

    /**
     * @var string
     * @ORM\Column(name="declared_80c", type="decimal", precision=15, scale=2)
     */
    private string $declared80c = '0.00';

    /**
     * @var string
     * @ORM\Column(name="declared_80d", type="decimal", precision=15, scale=2)
     */
    private string $declared80d = '0.00';

    /**
     * @var string
     * @ORM\Column(name="declared_hra_annual", type="decimal", precision=15, scale=2)
     */
    private string $declaredHraAnnual = '0.00';

    /**
     * @var string
     * @ORM\Column(name="other_exemptions", type="decimal", precision=15, scale=2)
     */
    private string $otherExemptions = '0.00';

    /**
     * @var string|null
     * @ORM\Column(name="bank_account_holder", type="string", length=120, nullable=true)
     */
    private ?string $bankAccountHolder = null;

    /**
     * @var string|null
     * @ORM\Column(name="bank_account_number", type="string", length=50, nullable=true)
     */
    private ?string $bankAccountNumber = null;

    /**
     * @var string|null
     * @ORM\Column(name="bank_ifsc_code", type="string", length=20, nullable=true)
     */
    private ?string $bankIfscCode = null;

    /**
     * @var string|null
     * @ORM\Column(name="bank_name", type="string", length=100, nullable=true)
     */
    private ?string $bankName = null;

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
    public function getEmployee(): Employee { return $this->employee; }
    public function setEmployee(Employee $employee): void { $this->employee = $employee; }
    public function getPanNumber(): ?string { return $this->panNumber; }
    public function setPanNumber(?string $panNumber): void { $this->panNumber = $panNumber; }
    public function getUanNumber(): ?string { return $this->uanNumber; }
    public function setUanNumber(?string $uanNumber): void { $this->uanNumber = $uanNumber; }
    public function getEsicIpNumber(): ?string { return $this->esicIpNumber; }
    public function setEsicIpNumber(?string $esicIpNumber): void { $this->esicIpNumber = $esicIpNumber; }
    public function getPtStateCode(): string { return $this->ptStateCode; }
    public function setPtStateCode(string $ptStateCode): void { $this->ptStateCode = $ptStateCode; }
    public function getTaxRegime(): string { return $this->taxRegime; }
    public function setTaxRegime(string $taxRegime): void { $this->taxRegime = $taxRegime; }
    public function isEpfOptedIn(): bool { return $this->epfOptedIn; }
    public function setEpfOptedIn(bool $epfOptedIn): void { $this->epfOptedIn = $epfOptedIn; }
    public function isEpfRestrictToCeiling(): bool { return $this->epfRestrictToCeiling; }
    public function setEpfRestrictToCeiling(bool $epfRestrictToCeiling): void { $this->epfRestrictToCeiling = $epfRestrictToCeiling; }
    public function isEsicApplicable(): bool { return $this->esicApplicable; }
    public function setEsicApplicable(bool $esicApplicable): void { $this->esicApplicable = $esicApplicable; }
    public function isPtApplicable(): bool { return $this->ptApplicable; }
    public function setPtApplicable(bool $ptApplicable): void { $this->ptApplicable = $ptApplicable; }
    public function getBasicPercentOfCtc(): string { return $this->basicPercentOfCtc; }
    public function setBasicPercentOfCtc(string $basicPercentOfCtc): void { $this->basicPercentOfCtc = $basicPercentOfCtc; }
    public function getHraPercentOfBasic(): string { return $this->hraPercentOfBasic; }
    public function setHraPercentOfBasic(string $hraPercentOfBasic): void { $this->hraPercentOfBasic = $hraPercentOfBasic; }
    public function getDeclared80c(): string { return $this->declared80c; }
    public function setDeclared80c(string $declared80c): void { $this->declared80c = $declared80c; }
    public function getDeclared80d(): string { return $this->declared80d; }
    public function setDeclared80d(string $declared80d): void { $this->declared80d = $declared80d; }
    public function getDeclaredHraAnnual(): string { return $this->declaredHraAnnual; }
    public function setDeclaredHraAnnual(string $declaredHraAnnual): void { $this->declaredHraAnnual = $declaredHraAnnual; }
    public function getOtherExemptions(): string { return $this->otherExemptions; }
    public function setOtherExemptions(string $otherExemptions): void { $this->otherExemptions = $otherExemptions; }
    public function getBankAccountHolder(): ?string { return $this->bankAccountHolder; }
    public function setBankAccountHolder(?string $bankAccountHolder): void { $this->bankAccountHolder = $bankAccountHolder; }
    public function getBankAccountNumber(): ?string { return $this->bankAccountNumber; }
    public function setBankAccountNumber(?string $bankAccountNumber): void { $this->bankAccountNumber = $bankAccountNumber; }
    public function getBankIfscCode(): ?string { return $this->bankIfscCode; }
    public function setBankIfscCode(?string $bankIfscCode): void { $this->bankIfscCode = $bankIfscCode; }
    public function getBankName(): ?string { return $this->bankName; }
    public function setBankName(?string $bankName): void { $this->bankName = $bankName; }
    public function getUpdatedAt(): DateTime { return $this->updatedAt; }
    public function setUpdatedAt(DateTime $updatedAt): void { $this->updatedAt = $updatedAt; }
}

