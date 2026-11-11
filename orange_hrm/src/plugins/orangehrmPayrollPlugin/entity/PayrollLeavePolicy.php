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
 * @ORM\Table(name="ohrm_payroll_leave_policy")
 * @ORM\Entity
 */
class PayrollLeavePolicy
{
    public const TREATMENT_PAID = 'PAID';
    public const TREATMENT_UNPAID = 'UNPAID';
    public const TREATMENT_HALF_PAID = 'HALF_PAID';
    public const TREATMENT_EXCESS_UNPAID = 'EXCESS_UNPAID';

    /**
     * @var int
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;

    /**
     * @var LeaveType
     * @ORM\OneToOne(targetEntity="OrangeHRM\Entity\LeaveType")
     * @ORM\JoinColumn(name="leave_type_id", referencedColumnName="id", nullable=false)
     */
    private LeaveType $leaveType;

    /**
     * @var string
     * @ORM\Column(name="payroll_pay_treatment", type="string", length=30)
     */
    private string $payrollPayTreatment = self::TREATMENT_PAID;

    /**
     * @var string
     * @ORM\Column(name="deduction_multiplier", type="decimal", precision=5, scale=4)
     */
    private string $deductionMultiplier = '0.0000';

    /**
     * @var DateTime
     * @ORM\Column(name="effective_from", type="date")
     */
    private DateTime $effectiveFrom;

    /**
     * @var string|null
     * @ORM\Column(name="notes", type="string", length=255, nullable=true)
     */
    private ?string $notes = null;

    public function __construct()
    {
        $this->effectiveFrom = new DateTime('2026-01-01');
    }

    public function getId(): int { return $this->id; }
    public function getLeaveType(): LeaveType { return $this->leaveType; }
    public function setLeaveType(LeaveType $leaveType): void { $this->leaveType = $leaveType; }
    public function getPayrollPayTreatment(): string { return $this->payrollPayTreatment; }
    public function setPayrollPayTreatment(string $payrollPayTreatment): void { $this->payrollPayTreatment = $payrollPayTreatment; }
    public function getDeductionMultiplier(): string { return $this->deductionMultiplier; }
    public function setDeductionMultiplier(string $deductionMultiplier): void { $this->deductionMultiplier = $deductionMultiplier; }
    public function getEffectiveFrom(): DateTime { return $this->effectiveFrom; }
    public function setEffectiveFrom(DateTime $effectiveFrom): void { $this->effectiveFrom = $effectiveFrom; }
    public function getNotes(): ?string { return $this->notes; }
    public function setNotes(?string $notes): void { $this->notes = $notes; }
}

