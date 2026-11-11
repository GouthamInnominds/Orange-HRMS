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

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="ohrm_payroll_record")
 * @ORM\Entity
 */
class PayrollRecord
{
    public const STATUS_CALCULATED = 'CALCULATED';
    public const STATUS_APPROVED = 'APPROVED';
    public const STATUS_LOCKED = 'LOCKED';
    public const STATUS_REVERSED = 'REVERSED';

    public const PAYMENT_UNPAID = 'UNPAID';
    public const PAYMENT_PENDING = 'PAYMENT_PENDING';
    public const PAYMENT_EXPORTED = 'PAYMENT_EXPORTED';
    public const PAYMENT_PAID = 'PAID';
    public const PAYMENT_FAILED = 'PAYMENT_FAILED';

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
     * @var PayrollPayPeriod
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\PayrollPayPeriod")
     * @ORM\JoinColumn(name="pay_period_id", referencedColumnName="id", nullable=false)
     */
    private PayrollPayPeriod $payPeriod;

    /**
     * @var Employee
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\Employee")
     * @ORM\JoinColumn(name="emp_number", referencedColumnName="emp_number", nullable=false)
     */
    private Employee $employee;

    /**
     * @var PayrollEmployeeSnapshot|null
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\PayrollEmployeeSnapshot")
     * @ORM\JoinColumn(name="snapshot_id", referencedColumnName="id", nullable=true)
     */
    private ?PayrollEmployeeSnapshot $snapshot = null;

    /**
     * @var string
     * @ORM\Column(name="basic_salary", type="decimal", precision=15, scale=2)
     */
    private string $basicSalary = '0.00';

    /**
     * @var string
     * @ORM\Column(name="hra_amount", type="decimal", precision=15, scale=2)
     */
    private string $hraAmount = '0.00';

    /**
     * @var string
     * @ORM\Column(name="special_allowance", type="decimal", precision=15, scale=2)
     */
    private string $specialAllowance = '0.00';

    /**
     * @var string
     * @ORM\Column(name="overtime_amount", type="decimal", precision=15, scale=2)
     */
    private string $overtimeAmount = '0.00';

    /**
     * @var string
     * @ORM\Column(name="reimbursement_amount", type="decimal", precision=15, scale=2)
     */
    private string $reimbursementAmount = '0.00';

    /**
     * @var string
     * @ORM\Column(name="lwp_deduction", type="decimal", precision=15, scale=2)
     */
    private string $lwpDeduction = '0.00';

    /**
     * @var string
     * @ORM\Column(name="gross_salary", type="decimal", precision=15, scale=2)
     */
    private string $grossSalary = '0.00';

    /**
     * @var string
     * @ORM\Column(name="total_allowance", type="decimal", precision=15, scale=2)
     */
    private string $totalAllowance = '0.00';

    /**
     * @var string
     * @ORM\Column(name="total_deduction", type="decimal", precision=15, scale=2)
     */
    private string $totalDeduction = '0.00';

    /**
     * @var string
     * @ORM\Column(name="epf_employee", type="decimal", precision=15, scale=2)
     */
    private string $epfEmployee = '0.00';

    /**
     * @var string
     * @ORM\Column(name="epf_employer", type="decimal", precision=15, scale=2)
     */
    private string $epfEmployer = '0.00';

    /**
     * @var string
     * @ORM\Column(name="esic_employee", type="decimal", precision=15, scale=2)
     */
    private string $esicEmployee = '0.00';

    /**
     * @var string
     * @ORM\Column(name="esic_employer", type="decimal", precision=15, scale=2)
     */
    private string $esicEmployer = '0.00';

    /**
     * @var string
     * @ORM\Column(name="professional_tax", type="decimal", precision=15, scale=2)
     */
    private string $professionalTax = '0.00';

    /**
     * @var string
     * @ORM\Column(name="total_tax", type="decimal", precision=15, scale=2)
     */
    private string $totalTax = '0.00';

    /**
     * @var string
     * @ORM\Column(name="income_tax_tds", type="decimal", precision=15, scale=2)
     */
    private string $incomeTaxTds = '0.00';

    /**
     * @var string
     * @ORM\Column(name="health_education_cess", type="decimal", precision=15, scale=2)
     */
    private string $healthEducationCess = '0.00';

    /**
     * @var string
     * @ORM\Column(name="adjustment_amount", type="decimal", precision=15, scale=2)
     */
    private string $adjustmentAmount = '0.00';

    /**
     * @var string
     * @ORM\Column(name="net_salary", type="decimal", precision=15, scale=2)
     */
    private string $netSalary = '0.00';

    /**
     * @var CurrencyType
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\CurrencyType")
     * @ORM\JoinColumn(name="currency_id", referencedColumnName="currency_id", nullable=false)
     */
    private CurrencyType $currency;

    /**
     * @var string
     * @ORM\Column(name="working_days", type="decimal", precision=6, scale=2)
     */
    private string $workingDays = '22.00';

    /**
     * @var string
     * @ORM\Column(name="payable_days", type="decimal", precision=6, scale=2)
     */
    private string $payableDays = '22.00';

    /**
     * @var string
     * @ORM\Column(name="lwp_days", type="decimal", precision=6, scale=2)
     */
    private string $lwpDays = '0.00';

    /**
     * @var string
     * @ORM\Column(name="overtime_hours", type="decimal", precision=6, scale=2)
     */
    private string $overtimeHours = '0.00';

    /**
     * @var string
     * @ORM\Column(name="tax_regime", type="string", length=20)
     */
    private string $taxRegime = PayrollTaxBracket::REGIME_NEW_115BAC;

    /**
     * @var string
     * @ORM\Column(name="status", type="string", length=32)
     */
    private string $status = self::STATUS_CALCULATED;

    /**
     * @var string
     * @ORM\Column(name="payment_status", type="string", length=32)
     */
    private string $paymentStatus = self::PAYMENT_UNPAID;

    /**
     * @var bool
     * @ORM\Column(name="is_manual_override", type="boolean")
     */
    private bool $isManualOverride = false;

    /**
     * @var string|null
     * @ORM\Column(name="validation_warnings_json", type="text", nullable=true)
     */
    private ?string $validationWarningsJson = null;

    /**
     * @var Collection<int, PayrollItem>
     * @ORM\OneToMany(targetEntity="OrangeHRM\Entity\PayrollItem", mappedBy="payrollRecord", cascade={"persist", "remove"})
     */
    private Collection $items;

    public function __construct()
    {
        $this->items = new ArrayCollection();
    }

    public function getId(): int { return $this->id; }
    public function getPayrollRun(): PayrollRun { return $this->payrollRun; }
    public function setPayrollRun(PayrollRun $payrollRun): void { $this->payrollRun = $payrollRun; }
    public function getPayPeriod(): PayrollPayPeriod { return $this->payPeriod; }
    public function setPayPeriod(PayrollPayPeriod $payPeriod): void { $this->payPeriod = $payPeriod; }
    public function getEmployee(): Employee { return $this->employee; }
    public function setEmployee(Employee $employee): void { $this->employee = $employee; }
    public function getSnapshot(): ?PayrollEmployeeSnapshot { return $this->snapshot; }
    public function setSnapshot(?PayrollEmployeeSnapshot $snapshot): void { $this->snapshot = $snapshot; }
    public function getBasicSalary(): string { return $this->basicSalary; }
    public function setBasicSalary(string $basicSalary): void { $this->basicSalary = $basicSalary; }
    public function getHraAmount(): string { return $this->hraAmount; }
    public function setHraAmount(string $hraAmount): void { $this->hraAmount = $hraAmount; }
    public function getSpecialAllowance(): string { return $this->specialAllowance; }
    public function setSpecialAllowance(string $specialAllowance): void { $this->specialAllowance = $specialAllowance; }
    public function getOvertimeAmount(): string { return $this->overtimeAmount; }
    public function setOvertimeAmount(string $overtimeAmount): void { $this->overtimeAmount = $overtimeAmount; }
    public function getReimbursementAmount(): string { return $this->reimbursementAmount; }
    public function setReimbursementAmount(string $reimbursementAmount): void { $this->reimbursementAmount = $reimbursementAmount; }
    public function getLwpDeduction(): string { return $this->lwpDeduction; }
    public function setLwpDeduction(string $lwpDeduction): void { $this->lwpDeduction = $lwpDeduction; }
    public function getGrossSalary(): string { return $this->grossSalary; }
    public function setGrossSalary(string $grossSalary): void { $this->grossSalary = $grossSalary; }
    public function getTotalAllowance(): string { return $this->totalAllowance; }
    public function setTotalAllowance(string $totalAllowance): void { $this->totalAllowance = $totalAllowance; }
    public function getTotalDeduction(): string { return $this->totalDeduction; }
    public function setTotalDeduction(string $totalDeduction): void { $this->totalDeduction = $totalDeduction; }
    public function getEpfEmployee(): string { return $this->epfEmployee; }
    public function setEpfEmployee(string $epfEmployee): void { $this->epfEmployee = $epfEmployee; }
    public function getEpfEmployer(): string { return $this->epfEmployer; }
    public function setEpfEmployer(string $epfEmployer): void { $this->epfEmployer = $epfEmployer; }
    public function getEsicEmployee(): string { return $this->esicEmployee; }
    public function setEsicEmployee(string $esicEmployee): void { $this->esicEmployee = $esicEmployee; }
    public function getEsicEmployer(): string { return $this->esicEmployer; }
    public function setEsicEmployer(string $esicEmployer): void { $this->esicEmployer = $esicEmployer; }
    public function getProfessionalTax(): string { return $this->professionalTax; }
    public function setProfessionalTax(string $professionalTax): void { $this->professionalTax = $professionalTax; }
    public function getTotalTax(): string { return $this->totalTax; }
    public function setTotalTax(string $totalTax): void { $this->totalTax = $totalTax; }
    public function getIncomeTaxTds(): string { return $this->incomeTaxTds; }
    public function setIncomeTaxTds(string $incomeTaxTds): void { $this->incomeTaxTds = $incomeTaxTds; }
    public function getHealthEducationCess(): string { return $this->healthEducationCess; }
    public function setHealthEducationCess(string $healthEducationCess): void { $this->healthEducationCess = $healthEducationCess; }
    public function getAdjustmentAmount(): string { return $this->adjustmentAmount; }
    public function setAdjustmentAmount(string $adjustmentAmount): void { $this->adjustmentAmount = $adjustmentAmount; }
    public function getNetSalary(): string { return $this->netSalary; }
    public function setNetSalary(string $netSalary): void { $this->netSalary = $netSalary; }
    public function getCurrency(): CurrencyType { return $this->currency; }
    public function setCurrency(CurrencyType $currency): void { $this->currency = $currency; }
    public function getWorkingDays(): string { return $this->workingDays; }
    public function setWorkingDays(string $workingDays): void { $this->workingDays = $workingDays; }
    public function getPayableDays(): string { return $this->payableDays; }
    public function setPayableDays(string $payableDays): void { $this->payableDays = $payableDays; }
    public function getLwpDays(): string { return $this->lwpDays; }
    public function setLwpDays(string $lwpDays): void { $this->lwpDays = $lwpDays; }
    public function getOvertimeHours(): string { return $this->overtimeHours; }
    public function setOvertimeHours(string $overtimeHours): void { $this->overtimeHours = $overtimeHours; }
    public function getTaxRegime(): string { return $this->taxRegime; }
    public function setTaxRegime(string $taxRegime): void { $this->taxRegime = $taxRegime; }
    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): void { $this->status = $status; }
    public function getPaymentStatus(): string { return $this->paymentStatus; }
    public function setPaymentStatus(string $paymentStatus): void { $this->paymentStatus = $paymentStatus; }
    public function isManualOverride(): bool { return $this->isManualOverride; }
    public function setIsManualOverride(bool $isManualOverride): void { $this->isManualOverride = $isManualOverride; }
    public function getValidationWarningsJson(): ?string { return $this->validationWarningsJson; }
    public function setValidationWarningsJson(?string $validationWarningsJson): void { $this->validationWarningsJson = $validationWarningsJson; }
    /** @return Collection<int, PayrollItem> */
    public function getItems(): Collection { return $this->items; }
    public function addItem(PayrollItem $item): void
    {
        $item->setPayrollRecord($this);
        $this->items->add($item);
    }
}
