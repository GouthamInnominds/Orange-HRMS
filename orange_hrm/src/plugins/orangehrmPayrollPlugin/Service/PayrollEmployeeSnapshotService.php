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

use OrangeHRM\Core\Dao\BaseDao;
use OrangeHRM\Entity\EmpDirectDebit;
use OrangeHRM\Entity\Employee;
use OrangeHRM\Entity\EmployeePayrollProfile;
use OrangeHRM\Entity\EmployeeSalary;
use OrangeHRM\Entity\PayrollConfig;
use OrangeHRM\Entity\PayrollEmployeeSnapshot;
use OrangeHRM\Entity\PayrollPayPeriod;
use OrangeHRM\Entity\PayrollRun;
use OrangeHRM\ORM\Doctrine;
use OrangeHRM\Payroll\Dao\PayrollConfigDao;
use OrangeHRM\Payroll\Dao\PayrollRunDao;
use OrangeHRM\Payroll\Util\Money;

/**
 * PIM Integration Service that captures immutable employee salary, eligibility,
 * location state, and statutory profile snapshots for each PayrollRun.
 * Masks direct-debit / bank account details everywhere outside authorized payment exports.
 */
class PayrollEmployeeSnapshotService
{
    private ?PayrollConfigDao $configDao = null;
    private ?PayrollRunDao $runDao = null;

    public function getConfigDao(): PayrollConfigDao
    {
        if ($this->configDao === null) {
            $this->configDao = new PayrollConfigDao();
        }
        return $this->configDao;
    }

    public function getRunDao(): PayrollRunDao
    {
        if ($this->runDao === null) {
            $this->runDao = new PayrollRunDao();
        }
        return $this->runDao;
    }

    /**
     * Loads all non-purged employees and creates immutable PayrollEmployeeSnapshot entities for the run.
     *
     * @return PayrollEmployeeSnapshot[]
     */
    public function captureSnapshotsForRun(PayrollRun $run, PayrollConfig $config): array
    {
        $em = Doctrine::getEntityManager();
        /** @var Employee[] $employees */
        $employees = $em->createQuery(
            'SELECT e FROM OrangeHRM\Entity\Employee e WHERE e.purgedAt IS NULL ORDER BY e.empNumber ASC'
        )->execute();

        $snapshots = [];
        foreach ($employees as $employee) {
            $snapshots[] = $this->captureEmployeeSnapshot($employee, $run, $config);
        }
        return $snapshots;
    }

    public function captureEmployeeSnapshot(Employee $employee, PayrollRun $run, PayrollConfig $config): PayrollEmployeeSnapshot
    {
        $em = Doctrine::getEntityManager();
        $period = $run->getPayPeriod();
        $currencyId = $period->getCurrency()->getId();
        $empNumber = $employee->getEmpNumber();

        $profile = $this->getConfigDao()->getEmployeePayrollProfile($empNumber);
        /** @var EmployeeSalary[] $salaryRows */
        $salaryRows = $em->createQuery(
            'SELECT s FROM OrangeHRM\Entity\EmployeeSalary s WHERE IDENTITY(s.employee) = :empNumber'
        )->setParameter('empNumber', $empNumber)->execute();

        $eligibilityReason = $this->evaluateEligibility($employee, $period);
        $monthlyBase = Money::zero($currencyId);
        $payGradeId = null;
        $salaryComponents = [];
        $foundCurrencyMismatch = false;

        foreach ($salaryRows as $row) {
            $rowCurrency = $row->getCurrencyType()->getId();
            if ($rowCurrency !== $currencyId) {
                $foundCurrencyMismatch = true;
                continue;
            }
            if ($payGradeId === null && $row->getPayGrade() !== null) {
                $payGradeId = $row->getPayGrade()->getId();
            }
            $rawAmount = Money::of((string)($row->getAmount() ?? '0'), $currencyId);
            $freqCode = $row->getPayPeriod() !== null ? (string)$row->getPayPeriod()->getCode() : '4';
            $monthlyEquivalent = $this->normalizeToMonthly($rawAmount, $freqCode, $period, $config);
            $monthlyBase = $monthlyBase->add($monthlyEquivalent);

            $salaryComponents[] = [
                'salaryComponent' => $row->getSalaryName(),
                'rawAmount' => $rawAmount->toDatabaseString(2),
                'payFrequencyCode' => $freqCode,
                'monthlyEquivalent' => $monthlyEquivalent->toDatabaseString(2),
                'currency' => $rowCurrency,
            ];
        }

        $isEligible = ($eligibilityReason === null);
        if ($isEligible && $monthlyBase->isZero()) {
            $isEligible = false;
            $eligibilityReason = $foundCurrencyMismatch
                ? sprintf('NO_SALARY_IN_PERIOD_CURRENCY_%s', $currencyId)
                : 'MISSING_SALARY_IN_PIM';
        }

        $ptState = $this->resolvePtState($employee, $profile, $config);
        $taxRegime = $profile !== null ? $profile->getTaxRegime() : $config->getDefaultTaxRegime();
        $locationState = $this->extractLocationState($employee);

        $departmentName = $employee->getSubDivision() !== null ? $employee->getSubDivision()->getName() : null;
        $jobTitleName = $employee->getJobTitle() !== null ? $employee->getJobTitle()->getJobTitleName() : null;
        $empStatus = $employee->getEmpStatus() !== null ? $employee->getEmpStatus()->getName() : null;

        // Sensitive bank details are NOT stored raw inside calculation snapshot JSON; masked reference only
        $maskedAccount = $this->resolveMaskedAccount($profile, $salaryRows);

        $payload = [
            'empNumber' => $empNumber,
            'employeeId' => $employee->getEmployeeId(),
            'fullName' => trim($employee->getFirstName() . ' ' . $employee->getLastName()),
            'departmentName' => $departmentName,
            'jobTitleName' => $jobTitleName,
            'employmentStatus' => $empStatus,
            'locationState' => $locationState,
            'joinedDate' => $employee->getJoinedDate() ? $employee->getJoinedDate()->format('Y-m-d') : null,
            'baseMonthlySalary' => $monthlyBase->toDatabaseString(4),
            'currencyId' => $currencyId,
            'salaryComponents' => $salaryComponents,
            'profile' => [
                'taxRegime' => $taxRegime,
                'ptStateCode' => $ptState,
                'epfOptedIn' => $profile ? $profile->isEpfOptedIn() : true,
                'epfRestrictToCeiling' => $profile ? $profile->isEpfRestrictToCeiling() : true,
                'esicApplicable' => $profile ? $profile->isEsicApplicable() : true,
                'ptApplicable' => $profile ? $profile->isPtApplicable() : true,
                'basicPercentOfCtc' => $profile ? $profile->getBasicPercentOfCtc() : '50.00',
                'hraPercentOfBasic' => $profile ? $profile->getHraPercentOfBasic() : '40.00',
                'declared80c' => $profile ? $profile->getDeclared80c() : '0.00',
                'declared80d' => $profile ? $profile->getDeclared80d() : '0.00',
                'declaredHraAnnual' => $profile ? $profile->getDeclaredHraAnnual() : '0.00',
                'otherExemptions' => $profile ? $profile->getOtherExemptions() : '0.00',
                'maskedBankAccount' => $maskedAccount,
            ],
        ];
        $payloadJson = json_encode($payload, JSON_UNESCAPED_SLASHES);

        $snapshot = new PayrollEmployeeSnapshot();
        $snapshot->setPayrollRun($run);
        $snapshot->setEmployee($employee);
        $snapshot->setEmployeeCode($employee->getEmployeeId());
        $snapshot->setFullName($payload['fullName']);
        $snapshot->setDepartmentName($departmentName);
        $snapshot->setJobTitleName($jobTitleName);
        $snapshot->setLocationState($locationState);
        $snapshot->setEmploymentStatus($empStatus);
        $snapshot->setIsEligible($isEligible);
        $snapshot->setIneligibilityReason($eligibilityReason);
        $snapshot->setBaseMonthlySalary($monthlyBase->toDatabaseString(4));
        $snapshot->setCurrency($period->getCurrency());
        $snapshot->setPayGradeId($payGradeId);
        $snapshot->setTaxRegime($taxRegime);
        $snapshot->setPtStateCode($ptState);
        $snapshot->setSnapshotPayloadJson($payloadJson);
        $snapshot->setSnapshotHash(hash('sha256', $payloadJson));

        return $this->getRunDao()->saveSnapshot($snapshot);
    }

    /**
     * Authorized bank disbursement exporter helper (ONLY called inside PayrollPaymentService).
     *
     * @return array{holder:string,account:string,ifsc:string,bankName:string}|null
     */
    public function getUnmaskedDisbursementAccount(int $empNumber, string $fallbackHolder): ?array
    {
        $profile = $this->getConfigDao()->getEmployeePayrollProfile($empNumber);
        if ($profile !== null && $profile->getBankAccountNumber() !== null && $profile->getBankIfscCode() !== null) {
            return [
                'holder' => $profile->getBankAccountHolder() ?: $fallbackHolder,
                'account' => $profile->getBankAccountNumber(),
                'ifsc' => $profile->getBankIfscCode(),
                'bankName' => $profile->getBankName() ?: 'NEFT_BANK',
            ];
        }

        // Fallback to hs_hr_emp_directdebit if configured
        $em = Doctrine::getEntityManager();
        /** @var EmpDirectDebit|null $dd */
        $dd = $em->createQuery(
            'SELECT d FROM OrangeHRM\Entity\EmpDirectDebit d JOIN d.salary s WHERE IDENTITY(s.employee) = :empNumber'
        )->setParameter('empNumber', $empNumber)->setMaxResults(1)->getOneOrNullResult();

        if ($dd !== null && $dd->getAccount() !== '') {
            return [
                'holder' => $fallbackHolder,
                'account' => $dd->getAccount(),
                'ifsc' => (string)$dd->getRoutingNumber(),
                'bankName' => $dd->getAccountType() ?: 'DIRECT_DEBIT',
            ];
        }
        return null;
    }

    public static function maskAccountNumber(?string $raw): ?string
    {
        if ($raw === null || trim($raw) === '') {
            return null;
        }
        $clean = trim($raw);
        $len = strlen($clean);
        if ($len <= 4) {
            return str_repeat('X', $len);
        }
        return str_repeat('X', $len - 4) . substr($clean, -4);
    }

    private function evaluateEligibility(Employee $employee, PayrollPayPeriod $period): ?string
    {
        if ($employee->getPurgedAt() !== null) {
            return 'PURGED_EMPLOYEE';
        }
        $termination = $employee->getEmployeeTerminationRecord();
        if ($termination !== null && $termination->getDate() !== null) {
            if ($termination->getDate() < $period->getStartDate()) {
                return 'TERMINATED_BEFORE_PERIOD';
            }
        }
        if ($employee->getJoinedDate() !== null && $employee->getJoinedDate() > $period->getEndDate()) {
            return 'JOINED_AFTER_PERIOD';
        }
        return null;
    }

    private function normalizeToMonthly(Money $rawAmount, string $freqCode, PayrollPayPeriod $period, PayrollConfig $config): Money
    {
        return match ($freqCode) {
            '1' => $rawAmount->multiplyRatio(52, 12), // Weekly -> Monthly
            '2' => $rawAmount->multiplyRatio(26, 12), // Bi-Weekly -> Monthly
            '3' => $rawAmount->multiplyRatio(2, 1),   // Semi-Monthly -> Monthly
            '6' => $rawAmount->multiplyRatio(
                (int)round((float)$config->getStandardShiftHours() * (float)$period->getStandardWorkingDays()),
                1
            ), // Hourly
            default => $rawAmount, // '4' Monthly, '5' Monthly on first pay
        };
    }

    private function resolvePtState(Employee $employee, ?EmployeePayrollProfile $profile, PayrollConfig $config): string
    {
        if ($profile !== null && trim($profile->getPtStateCode()) !== '') {
            return strtoupper(trim($profile->getPtStateCode()));
        }
        $loc = $this->extractLocationState($employee);
        if ($loc !== null) {
            $lower = strtolower($loc);
            if (str_contains($lower, 'maharashtra') || $lower === 'mh') {
                return 'MH';
            }
            if (str_contains($lower, 'west bengal') || $lower === 'wb') {
                return 'WB';
            }
            if (str_contains($lower, 'karnataka') || $lower === 'ka') {
                return 'KA';
            }
        }
        return strtoupper($config->getDefaultPtStateCode());
    }

    private function extractLocationState(Employee $employee): ?string
    {
        foreach ($employee->getLocations() as $location) {
            if ($location->getProvince() !== null && trim($location->getProvince()) !== '') {
                return trim($location->getProvince());
            }
            if ($location->getCity() !== null && trim($location->getCity()) !== '') {
                return trim($location->getCity());
            }
        }
        return $employee->getProvince() ?: null;
    }

    /**
     * @param EmployeeSalary[] $salaryRows
     */
    private function resolveMaskedAccount(?EmployeePayrollProfile $profile, array $salaryRows): ?string
    {
        if ($profile !== null && $profile->getBankAccountNumber() !== null) {
            return self::maskAccountNumber($profile->getBankAccountNumber());
        }
        foreach ($salaryRows as $row) {
            $dd = $row->getDirectDebit();
            if ($dd !== null && $dd->getAccount() !== '') {
                return self::maskAccountNumber($dd->getAccount());
            }
        }
        return null;
    }
}
