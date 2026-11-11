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
 * Immutable per-run employee eligibility, salary, and statutory profile snapshot.
 * Ensures historical payroll runs never mutate when future PIM changes occur.
 *
 * @ORM\Table(name="ohrm_payroll_emp_snapshot")
 * @ORM\Entity
 */
class PayrollEmployeeSnapshot
{
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
     * @var Employee
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\Employee")
     * @ORM\JoinColumn(name="emp_number", referencedColumnName="emp_number", nullable=false)
     */
    private Employee $employee;

    /**
     * @var string|null
     * @ORM\Column(name="employee_code", type="string", length=50, nullable=true)
     */
    private ?string $employeeCode = null;

    /**
     * @var string
     * @ORM\Column(name="full_name", type="string", length=255)
     */
    private string $fullName;

    /**
     * @var string|null
     * @ORM\Column(name="department_name", type="string", length=150, nullable=true)
     */
    private ?string $departmentName = null;

    /**
     * @var string|null
     * @ORM\Column(name="job_title_name", type="string", length=150, nullable=true)
     */
    private ?string $jobTitleName = null;

    /**
     * @var string|null
     * @ORM\Column(name="location_state", type="string", length=60, nullable=true)
     */
    private ?string $locationState = null;

    /**
     * @var string|null
     * @ORM\Column(name="employment_status", type="string", length=60, nullable=true)
     */
    private ?string $employmentStatus = null;

    /**
     * @var bool
     * @ORM\Column(name="is_eligible", type="boolean")
     */
    private bool $isEligible = true;

    /**
     * @var string|null
     * @ORM\Column(name="ineligibility_reason", type="string", length=255, nullable=true)
     */
    private ?string $ineligibilityReason = null;

    /**
     * @var string
     * @ORM\Column(name="base_monthly_salary", type="decimal", precision=19, scale=4)
     */
    private string $baseMonthlySalary = '0.0000';

    /**
     * @var CurrencyType
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\CurrencyType")
     * @ORM\JoinColumn(name="currency_id", referencedColumnName="currency_id", nullable=false)
     */
    private CurrencyType $currency;

    /**
     * @var int|null
     * @ORM\Column(name="pay_grade_id", type="integer", nullable=true)
     */
    private ?int $payGradeId = null;

    /**
     * @var string
     * @ORM\Column(name="tax_regime", type="string", length=20)
     */
    private string $taxRegime = PayrollTaxBracket::REGIME_NEW_115BAC;

    /**
     * @var string
     * @ORM\Column(name="pt_state_code", type="string", length=10)
     */
    private string $ptStateCode = 'KA';

    /**
     * @var string
     * @ORM\Column(name="snapshot_payload_json", type="text")
     */
    private string $snapshotPayloadJson;

    /**
     * @var string
     * @ORM\Column(name="snapshot_hash", type="string", length=64)
     */
    private string $snapshotHash;

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
    public function getEmployee(): Employee { return $this->employee; }
    public function setEmployee(Employee $employee): void { $this->employee = $employee; }
    public function getEmployeeCode(): ?string { return $this->employeeCode; }
    public function setEmployeeCode(?string $employeeCode): void { $this->employeeCode = $employeeCode; }
    public function getFullName(): string { return $this->fullName; }
    public function setFullName(string $fullName): void { $this->fullName = $fullName; }
    public function getDepartmentName(): ?string { return $this->departmentName; }
    public function setDepartmentName(?string $departmentName): void { $this->departmentName = $departmentName; }
    public function getJobTitleName(): ?string { return $this->jobTitleName; }
    public function setJobTitleName(?string $jobTitleName): void { $this->jobTitleName = $jobTitleName; }
    public function getLocationState(): ?string { return $this->locationState; }
    public function setLocationState(?string $locationState): void { $this->locationState = $locationState; }
    public function getEmploymentStatus(): ?string { return $this->employmentStatus; }
    public function setEmploymentStatus(?string $employmentStatus): void { $this->employmentStatus = $employmentStatus; }
    public function isEligible(): bool { return $this->isEligible; }
    public function setIsEligible(bool $isEligible): void { $this->isEligible = $isEligible; }
    public function getIneligibilityReason(): ?string { return $this->ineligibilityReason; }
    public function setIneligibilityReason(?string $ineligibilityReason): void { $this->ineligibilityReason = $ineligibilityReason; }
    public function getBaseMonthlySalary(): string { return $this->baseMonthlySalary; }
    public function setBaseMonthlySalary(string $baseMonthlySalary): void { $this->baseMonthlySalary = $baseMonthlySalary; }
    public function getCurrency(): CurrencyType { return $this->currency; }
    public function setCurrency(CurrencyType $currency): void { $this->currency = $currency; }
    public function getPayGradeId(): ?int { return $this->payGradeId; }
    public function setPayGradeId(?int $payGradeId): void { $this->payGradeId = $payGradeId; }
    public function getTaxRegime(): string { return $this->taxRegime; }
    public function setTaxRegime(string $taxRegime): void { $this->taxRegime = $taxRegime; }
    public function getPtStateCode(): string { return $this->ptStateCode; }
    public function setPtStateCode(string $ptStateCode): void { $this->ptStateCode = $ptStateCode; }
    public function getSnapshotPayloadJson(): string { return $this->snapshotPayloadJson; }
    public function setSnapshotPayloadJson(string $snapshotPayloadJson): void { $this->snapshotPayloadJson = $snapshotPayloadJson; }
    public function getSnapshotHash(): string { return $this->snapshotHash; }
    public function setSnapshotHash(string $snapshotHash): void { $this->snapshotHash = $snapshotHash; }
    public function getCreatedAt(): DateTime { return $this->createdAt; }
    public function setCreatedAt(DateTime $createdAt): void { $this->createdAt = $createdAt; }
}

