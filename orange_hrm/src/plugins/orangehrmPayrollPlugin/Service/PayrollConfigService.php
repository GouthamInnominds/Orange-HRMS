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
use OrangeHRM\Core\Traits\Service\NormalizerServiceTrait;
use OrangeHRM\Entity\EmployeePayrollProfile;
use OrangeHRM\Entity\PayrollAuditEvent;
use OrangeHRM\Entity\PayrollConfig;
use OrangeHRM\Entity\PayrollLeavePolicy;
use OrangeHRM\Entity\PayrollStatutoryRule;
use OrangeHRM\Entity\PayrollTaxBracket;
use OrangeHRM\Entity\User;
use OrangeHRM\Payroll\Dao\PayrollConfigDao;
use OrangeHRM\Payroll\Dao\PayrollRunDao;
use OrangeHRM\Payroll\Exception\PayrollException;

class PayrollConfigService
{
    private ?PayrollConfigDao $payrollConfigDao = null;
    private ?PayrollRunDao $payrollRunDao = null;

    public function getPayrollConfigDao(): PayrollConfigDao
    {
        if ($this->payrollConfigDao === null) {
            $this->payrollConfigDao = new PayrollConfigDao();
        }
        return $this->payrollConfigDao;
    }

    public function setPayrollConfigDao(PayrollConfigDao $dao): void
    {
        $this->payrollConfigDao = $dao;
    }

    public function getPayrollRunDao(): PayrollRunDao
    {
        if ($this->payrollRunDao === null) {
            $this->payrollRunDao = new PayrollRunDao();
        }
        return $this->payrollRunDao;
    }

    public function setPayrollRunDao(PayrollRunDao $dao): void
    {
        $this->payrollRunDao = $dao;
    }

    public function getConfig(string $jurisdictionCode = 'IN'): PayrollConfig
    {
        $config = $this->getPayrollConfigDao()->getPayrollConfig($jurisdictionCode);
        if ($config === null) {
            throw new PayrollException(
                sprintf('Payroll configuration for jurisdiction "%s" not found.', $jurisdictionCode),
                PayrollException::CODE_NOT_FOUND,
                ['jurisdiction' => $jurisdictionCode],
                404
            );
        }
        return $config;
    }

    public function updateConfig(array $payload, ?User $actor = null): PayrollConfig
    {
        $jurisdiction = $payload['jurisdictionCode'] ?? 'IN';
        $config = $this->getConfig($jurisdiction);
        $before = $this->serializeConfig($config);

        if (isset($payload['lwpDivisorMode'])) {
            $config->setLwpDivisorMode($payload['lwpDivisorMode']);
        }
        if (isset($payload['timeAttendanceSourceMode'])) {
            $config->setTimeAttendanceSourceMode($payload['timeAttendanceSourceMode']);
        }
        if (isset($payload['standardShiftHours'])) {
            $config->setStandardShiftHours(number_format((float)$payload['standardShiftHours'], 2, '.', ''));
        }
        if (isset($payload['overtimeMultiplier'])) {
            $config->setOvertimeMultiplier(number_format((float)$payload['overtimeMultiplier'], 2, '.', ''));
        }
        if (array_key_exists('overtimeEligibleMaxBasic', $payload)) {
            $config->setOvertimeEligibleMaxBasic(
                $payload['overtimeEligibleMaxBasic'] === null
                    ? null
                    : number_format((float)$payload['overtimeEligibleMaxBasic'], 2, '.', '')
            );
        }
        if (isset($payload['epfWageCeiling'])) {
            $config->setEpfWageCeiling(number_format((float)$payload['epfWageCeiling'], 2, '.', ''));
        }
        if (isset($payload['epfCapAtCeiling'])) {
            $config->setEpfCapAtCeiling((bool)$payload['epfCapAtCeiling']);
        }
        if (isset($payload['esicGrossCeiling'])) {
            $config->setEsicGrossCeiling(number_format((float)$payload['esicGrossCeiling'], 2, '.', ''));
        }
        if (isset($payload['defaultPtStateCode'])) {
            $config->setDefaultPtStateCode(strtoupper((string)$payload['defaultPtStateCode']));
        }
        if (isset($payload['defaultTaxRegime'])) {
            $config->setDefaultTaxRegime((string)$payload['defaultTaxRegime']);
        }
        if (isset($payload['requireMakerCheckerApproval'])) {
            $config->setRequireMakerCheckerApproval((bool)$payload['requireMakerCheckerApproval']);
        }
        if ($actor !== null) {
            $config->setUpdatedBy($actor);
        }

        $saved = $this->getPayrollConfigDao()->savePayrollConfig($config);
        $this->recordAudit('CONFIG_UPDATED', 'PayrollConfig', $saved->getId(), null, $actor, $before, $this->serializeConfig($saved));
        return $saved;
    }

    /**
     * @return PayrollLeavePolicy[]
     */
    public function getLeavePoliciesWithDefaults(): array
    {
        $dao = $this->getPayrollConfigDao();
        $leaveTypes = $dao->getActiveLeaveTypes();
        $existing = $dao->getLeavePoliciesKeyedByTypeId();
        $result = [];
        foreach ($leaveTypes as $lt) {
            if (isset($existing[$lt->getId()])) {
                $result[] = $existing[$lt->getId()];
                continue;
            }
            $policy = new PayrollLeavePolicy();
            $policy->setLeaveType($lt);
            $nameLower = strtolower($lt->getName());
            $isUnpaid = str_contains($nameLower, 'unpaid') || str_contains($nameLower, 'lwp') || str_contains($nameLower, 'loss of pay');
            $policy->setPayrollPayTreatment($isUnpaid ? PayrollLeavePolicy::TREATMENT_UNPAID : PayrollLeavePolicy::TREATMENT_PAID);
            $policy->setDeductionMultiplier($isUnpaid ? '1.0000' : '0.0000');
            $result[] = $dao->saveLeavePolicy($policy);
        }
        return $result;
    }

    public function upsertLeavePolicy(int $leaveTypeId, string $treatment, ?string $multiplier = null, ?string $notes = null, ?User $actor = null): PayrollLeavePolicy
    {
        $dao = $this->getPayrollConfigDao();
        $policy = $dao->getLeavePolicyByLeaveTypeId($leaveTypeId);
        $before = $policy ? ['treatment' => $policy->getPayrollPayTreatment(), 'multiplier' => $policy->getDeductionMultiplier()] : null;

        if ($policy === null) {
            $leaveTypes = $dao->getActiveLeaveTypes();
            $targetLt = null;
            foreach ($leaveTypes as $lt) {
                if ($lt->getId() === $leaveTypeId) {
                    $targetLt = $lt;
                    break;
                }
            }
            if ($targetLt === null) {
                throw new PayrollException(sprintf('Leave type #%d not found.', $leaveTypeId), PayrollException::CODE_NOT_FOUND, [], 404);
            }
            $policy = new PayrollLeavePolicy();
            $policy->setLeaveType($targetLt);
        }

        $policy->setPayrollPayTreatment($treatment);
        if ($multiplier !== null) {
            $policy->setDeductionMultiplier(number_format((float)$multiplier, 4, '.', ''));
        } else {
            $defaultMult = match ($treatment) {
                PayrollLeavePolicy::TREATMENT_UNPAID, PayrollLeavePolicy::TREATMENT_EXCESS_UNPAID => '1.0000',
                PayrollLeavePolicy::TREATMENT_HALF_PAID => '0.5000',
                default => '0.0000',
            };
            $policy->setDeductionMultiplier($defaultMult);
        }
        $policy->setNotes($notes);
        $saved = $dao->saveLeavePolicy($policy);

        $this->recordAudit(
            'LEAVE_POLICY_UPDATED',
            'PayrollLeavePolicy',
            $saved->getId(),
            null,
            $actor,
            $before,
            ['leaveTypeId' => $leaveTypeId, 'treatment' => $saved->getPayrollPayTreatment(), 'multiplier' => $saved->getDeductionMultiplier()]
        );

        return $saved;
    }

    public function getOrCreateEmployeeProfile(int $empNumber): EmployeePayrollProfile
    {
        $dao = $this->getPayrollConfigDao();
        $profile = $dao->getEmployeePayrollProfile($empNumber);
        if ($profile !== null) {
            return $profile;
        }
        $employee = $dao->getEmployeeByNumber($empNumber);
        if ($employee === null) {
            throw new PayrollException(sprintf('Employee #%d not found.', $empNumber), PayrollException::CODE_NOT_FOUND, [], 404);
        }
        $config = $this->getConfig('IN');
        $profile = new EmployeePayrollProfile();
        $profile->setEmployee($employee);
        $profile->setPtStateCode($config->getDefaultPtStateCode());
        $profile->setTaxRegime($config->getDefaultTaxRegime());
        return $dao->saveEmployeePayrollProfile($profile);
    }

    public function updateEmployeeProfile(int $empNumber, array $payload, ?User $actor = null): EmployeePayrollProfile
    {
        $dao = $this->getPayrollConfigDao();
        $profile = $this->getOrCreateEmployeeProfile($empNumber);
        $before = [
            'taxRegime' => $profile->getTaxRegime(),
            'ptStateCode' => $profile->getPtStateCode(),
            'epfOptedIn' => $profile->isEpfOptedIn(),
            'esicApplicable' => $profile->isEsicApplicable(),
        ];

        $stringFields = [
            'panNumber' => 'setPanNumber',
            'uanNumber' => 'setUanNumber',
            'esicIpNumber' => 'setEsicIpNumber',
            'ptStateCode' => 'setPtStateCode',
            'taxRegime' => 'setTaxRegime',
            'bankAccountHolder' => 'setBankAccountHolder',
            'bankAccountNumber' => 'setBankAccountNumber',
            'bankIfscCode' => 'setBankIfscCode',
            'bankName' => 'setBankName',
        ];
        foreach ($stringFields as $key => $setter) {
            if (array_key_exists($key, $payload)) {
                $val = $payload[$key] !== null ? trim((string)$payload[$key]) : null;
                if (in_array($key, ['ptStateCode', 'panNumber', 'bankIfscCode'], true) && $val !== null) {
                    $val = strtoupper($val);
                }
                $profile->$setter($val === '' ? null : $val);
            }
        }
        if (isset($payload['epfOptedIn'])) {
            $profile->setEpfOptedIn((bool)$payload['epfOptedIn']);
        }
        if (isset($payload['epfRestrictToCeiling'])) {
            $profile->setEpfRestrictToCeiling((bool)$payload['epfRestrictToCeiling']);
        }
        if (isset($payload['esicApplicable'])) {
            $profile->setEsicApplicable((bool)$payload['esicApplicable']);
        }
        if (isset($payload['ptApplicable'])) {
            $profile->setPtApplicable((bool)$payload['ptApplicable']);
        }
        foreach (['basicPercentOfCtc', 'hraPercentOfBasic', 'declared80c', 'declared80d', 'declaredHraAnnual', 'otherExemptions'] as $numField) {
            if (isset($payload[$numField])) {
                $setter = 'set' . ucfirst($numField);
                $profile->$setter(number_format((float)$payload[$numField], 2, '.', ''));
            }
        }

        $saved = $dao->saveEmployeePayrollProfile($profile);
        $this->recordAudit(
            'STATUTORY_PROFILE_UPDATED',
            'EmployeePayrollProfile',
            $saved->getId(),
            $empNumber,
            $actor,
            $before,
            [
                'taxRegime' => $saved->getTaxRegime(),
                'ptStateCode' => $saved->getPtStateCode(),
                'epfOptedIn' => $saved->isEpfOptedIn(),
                'esicApplicable' => $saved->isEsicApplicable(),
            ]
        );
        return $saved;
    }

    /**
     * @return PayrollTaxBracket[]
     */
    public function getTaxBrackets(string $financialYear = '2026-27', string $taxRegime = PayrollTaxBracket::REGIME_NEW_115BAC): array
    {
        return $this->getPayrollConfigDao()->getTaxBrackets($financialYear, $taxRegime, 'IN', true);
    }

    /**
     * @return PayrollStatutoryRule[]
     */
    public function getStatutoryRules(): array
    {
        return $this->getPayrollConfigDao()->getAllStatutoryRules('IN');
    }

    public function recordAudit(
        string $eventType,
        string $entityType,
        ?int $entityId,
        ?int $empNumber,
        ?User $actor,
        ?array $before,
        ?array $after,
        ?\OrangeHRM\Entity\PayrollRun $run = null
    ): void {
        $evt = new PayrollAuditEvent();
        $evt->setEventType($eventType);
        $evt->setEntityType($entityType);
        $evt->setEntityId($entityId);
        $evt->setEmpNumber($empNumber);
        $evt->setActorUser($actor);
        $evt->setPayrollRun($run);
        $evt->setBeforeJson($before !== null ? json_encode($before, JSON_UNESCAPED_SLASHES) : null);
        $evt->setAfterJson($after !== null ? json_encode($after, JSON_UNESCAPED_SLASHES) : null);
        $evt->setIpAddress($_SERVER['REMOTE_ADDR'] ?? null);
        $evt->setOccurredAt(new DateTime());
        $this->getPayrollRunDao()->appendAuditEvent($evt);
    }

    private function serializeConfig(PayrollConfig $c): array
    {
        return [
            'jurisdictionCode' => $c->getJurisdictionCode(),
            'lwpDivisorMode' => $c->getLwpDivisorMode(),
            'timeAttendanceSourceMode' => $c->getTimeAttendanceSourceMode(),
            'standardShiftHours' => $c->getStandardShiftHours(),
            'overtimeMultiplier' => $c->getOvertimeMultiplier(),
            'epfWageCeiling' => $c->getEpfWageCeiling(),
            'esicGrossCeiling' => $c->getEsicGrossCeiling(),
            'defaultPtStateCode' => $c->getDefaultPtStateCode(),
            'defaultTaxRegime' => $c->getDefaultTaxRegime(),
            'requireMakerCheckerApproval' => $c->isRequireMakerCheckerApproval(),
        ];
    }
}

