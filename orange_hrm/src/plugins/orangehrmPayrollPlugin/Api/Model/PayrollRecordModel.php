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
use OrangeHRM\Entity\PayrollRecord;

class PayrollRecordModel implements Normalizable
{
    private PayrollRecord $record;

    public function __construct(PayrollRecord $record)
    {
        $this->record = $record;
    }

    public function toArray(): array
    {
        $emp = $this->record->getEmployee();
        $snap = $this->record->getSnapshot();
        $payload = ($snap && $snap->getSnapshotPayloadJson()) ? (json_decode($snap->getSnapshotPayloadJson(), true) ?: []) : [];

        $items = [];
        foreach ($this->record->getItems() as $item) {
            $items[] = [
                'id' => $item->getId(),
                'itemType' => $item->getItemType(),
                'componentCode' => $item->getComponentCode(),
                'componentName' => $item->getComponentName(),
                'amount' => (float)$item->getAmount(),
                'isTaxable' => $item->isTaxable(),
                'isStatutory' => $item->isStatutory(),
                'sourceModule' => $item->getSourceModule(),
                'notes' => $item->getNotes(),
            ];
        }

        return [
            'id' => $this->record->getId(),
            'payrollRunId' => $this->record->getPayrollRun()->getId(),
            'payPeriodId' => $this->record->getPayPeriod()->getId(),
            'empNumber' => $emp->getEmpNumber(),
            'employeeId' => $snap ? $snap->getEmployeeCode() : $emp->getEmployeeId(),
            'employeeName' => $snap ? $snap->getFullName() : trim($emp->getFirstName() . ' ' . $emp->getLastName()),
            'departmentName' => $snap ? $snap->getDepartmentName() : ($emp->getSubDivision() ? $emp->getSubDivision()->getName() : null),
            'jobTitleName' => $snap ? $snap->getJobTitleName() : ($emp->getJobTitle() ? $emp->getJobTitle()->getJobTitleName() : null),
            'ptStateCode' => $snap ? $snap->getPtStateCode() : 'KA',
            'taxRegime' => $this->record->getTaxRegime(),
            'maskedBankAccount' => $payload['profile']['maskedBankAccount'] ?? null,
            'basicSalary' => (float)$this->record->getBasicSalary(),
            'hraAmount' => (float)$this->record->getHraAmount(),
            'specialAllowance' => (float)$this->record->getSpecialAllowance(),
            'overtimeAmount' => (float)$this->record->getOvertimeAmount(),
            'reimbursementAmount' => (float)$this->record->getReimbursementAmount(),
            'lwpDeduction' => (float)$this->record->getLwpDeduction(),
            'grossSalary' => (float)$this->record->getGrossSalary(),
            'totalAllowance' => (float)$this->record->getTotalAllowance(),
            'epfEmployee' => (float)$this->record->getEpfEmployee(),
            'epfEmployer' => (float)$this->record->getEpfEmployer(),
            'esicEmployee' => (float)$this->record->getEsicEmployee(),
            'esicEmployer' => (float)$this->record->getEsicEmployer(),
            'professionalTax' => (float)$this->record->getProfessionalTax(),
            'incomeTaxTds' => (float)$this->record->getIncomeTaxTds(),
            'healthEducationCess' => (float)$this->record->getHealthEducationCess(),
            'totalTax' => (float)$this->record->getTotalTax(),
            'totalDeduction' => (float)$this->record->getTotalDeduction(),
            'adjustmentAmount' => (float)$this->record->getAdjustmentAmount(),
            'netSalary' => (float)$this->record->getNetSalary(),
            'currencyId' => $this->record->getCurrency()->getId(),
            'workingDays' => (float)$this->record->getWorkingDays(),
            'payableDays' => (float)$this->record->getPayableDays(),
            'lwpDays' => (float)$this->record->getLwpDays(),
            'overtimeHours' => (float)$this->record->getOvertimeHours(),
            'status' => $this->record->getStatus(),
            'paymentStatus' => $this->record->getPaymentStatus(),
            'isManualOverride' => $this->record->isManualOverride(),
            'warnings' => $this->record->getValidationWarningsJson() ? json_decode($this->record->getValidationWarningsJson(), true) : [],
            'items' => $items,
        ];
    }
}

