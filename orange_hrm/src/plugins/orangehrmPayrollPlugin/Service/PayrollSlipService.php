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

namespace OrangeHRM\Payroll\Service;

use DateTime;
use OrangeHRM\Entity\SalarySlip;
use OrangeHRM\Entity\User;
use OrangeHRM\Payroll\Dao\PayrollRunDao;
use OrangeHRM\Payroll\Exception\PayrollException;

/**
 * Payslip Retrieval, Download & IDOR Security Enforcement Service (BR_PAY_006).
 */
class PayrollSlipService
{
    private ?PayrollRunDao $runDao = null;
    private ?PayrollConfigService $configService = null;

    public function getRunDao(): PayrollRunDao
    {
        return $this->runDao ??= new PayrollRunDao();
    }

    public function getConfigService(): PayrollConfigService
    {
        return $this->configService ??= new PayrollConfigService();
    }

    public function getSlipWithAccessCheck(int $slipId, User $actor, bool $canManagePayroll, bool $allowDraftPreviewForManager = true): SalarySlip
    {
        $slip = $this->getRunDao()->getSalarySlipById($slipId);
        if ($slip === null) {
            throw new PayrollException(sprintf('Salary slip #%d not found.', $slipId), PayrollException::CODE_NOT_FOUND, [], 404);
        }

        $ownerEmpNumber = $slip->getEmpNumber() ?? $slip->getPayrollRecord()->getEmployee()->getEmpNumber();
        $actorEmpNumber = $actor->getEmployee() !== null ? $actor->getEmployee()->getEmpNumber() : null;

        if (!$canManagePayroll) {
            // Strict IDOR guard: ESS user can strictly access their own PUBLISHED payslips
            if ($actorEmpNumber === null || $actorEmpNumber !== $ownerEmpNumber) {
                throw PayrollException::idorForbidden('You are not authorized to access another employee\'s salary slip.');
            }
            if ($slip->getSlipStatus() !== SalarySlip::STATUS_PUBLISHED) {
                throw PayrollException::idorForbidden('Unpublished or voided salary slips are not accessible in self-service.');
            }
        } elseif (!$allowDraftPreviewForManager && $slip->getSlipStatus() === SalarySlip::STATUS_VOIDED) {
            throw PayrollException::idorForbidden('This salary slip has been voided.');
        }

        return $slip;
    }

    public function renderDownloadHtml(SalarySlip $slip, User $actor): string
    {
        if ($slip->getDownloadedAt() === null) {
            $slip->setDownloadedAt(new DateTime());
            $this->getRunDao()->saveSalarySlip($slip);
        }

        $this->getConfigService()->recordAudit(
            'SALARY_SLIP_DOWNLOADED',
            'SalarySlip',
            $slip->getId(),
            $slip->getEmpNumber(),
            $actor,
            null,
            ['slipNumber' => $slip->getSlipNumber(), 'slipStatus' => $slip->getSlipStatus()],
            $slip->getPayrollRun()
        );

        if ($slip->getHtmlSnapshot() !== null && trim($slip->getHtmlSnapshot()) !== '') {
            return $slip->getHtmlSnapshot();
        }

        $record = $slip->getPayrollRecord();
        $snapshot = $record->getSnapshot();
        if ($snapshot !== null) {
            return PayrollCalculationService::renderHtmlPayslip($record, $snapshot, $slip->getSlipNumber());
        }

        return sprintf('<html><body><h2>Payslip %s</h2><p>Net Salary: INR %s</p></body></html>', htmlspecialchars($slip->getSlipNumber()), $record->getNetSalary());
    }
}

