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

namespace OrangeHRM\Payroll\Api\Model;

use OrangeHRM\Core\Api\V2\Serializer\Normalizable;
use OrangeHRM\Entity\EmployeePayrollProfile;
use OrangeHRM\Payroll\Service\PayrollEmployeeSnapshotService;

class EmployeeStatutoryProfileModel implements Normalizable
{
    private EmployeePayrollProfile $profile;

    public function __construct(EmployeePayrollProfile $profile)
    {
        $this->profile = $profile;
    }

    public function toArray(): array
    {
        $emp = $this->profile->getEmployee();
        return [
            'id' => $this->profile->getId(),
            'empNumber' => $emp->getEmpNumber(),
            'employeeName' => trim($emp->getFirstName() . ' ' . $emp->getLastName()),
            'panNumber' => $this->profile->getPanNumber(),
            'uanNumber' => $this->profile->getUanNumber(),
            'esicIpNumber' => $this->profile->getEsicIpNumber(),
            'ptStateCode' => $this->profile->getPtStateCode(),
            'taxRegime' => $this->profile->getTaxRegime(),
            'epfOptedIn' => $this->profile->isEpfOptedIn(),
            'epfRestrictToCeiling' => $this->profile->isEpfRestrictToCeiling(),
            'esicApplicable' => $this->profile->isEsicApplicable(),
            'ptApplicable' => $this->profile->isPtApplicable(),
            'basicPercentOfCtc' => (float)$this->profile->getBasicPercentOfCtc(),
            'hraPercentOfBasic' => (float)$this->profile->getHraPercentOfBasic(),
            'declared80c' => (float)$this->profile->getDeclared80c(),
            'declared80d' => (float)$this->profile->getDeclared80d(),
            'declaredHraAnnual' => (float)$this->profile->getDeclaredHraAnnual(),
            'otherExemptions' => (float)$this->profile->getOtherExemptions(),
            'bankAccountHolder' => $this->profile->getBankAccountHolder(),
            // Always mask bank account number in profile API responses
            'maskedBankAccountNumber' => PayrollEmployeeSnapshotService::maskAccountNumber($this->profile->getBankAccountNumber()),
            'bankIfscCode' => $this->profile->getBankIfscCode(),
            'bankName' => $this->profile->getBankName(),
            'hasBankAccount' => $this->profile->getBankAccountNumber() !== null && trim($this->profile->getBankAccountNumber()) !== '',
        ];
    }
}

