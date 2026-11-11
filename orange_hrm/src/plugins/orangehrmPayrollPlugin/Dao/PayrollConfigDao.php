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

namespace OrangeHRM\Payroll\Dao;

use DateTime;
use OrangeHRM\Core\Dao\BaseDao;
use OrangeHRM\Entity\CurrencyType;
use OrangeHRM\Entity\Employee;
use OrangeHRM\Entity\EmployeePayrollProfile;
use OrangeHRM\Entity\LeaveType;
use OrangeHRM\Entity\PayrollConfig;
use OrangeHRM\Entity\PayrollLeavePolicy;
use OrangeHRM\Entity\PayrollStatutoryRule;
use OrangeHRM\Entity\PayrollTaxBracket;

class PayrollConfigDao extends BaseDao
{
    public function getPayrollConfig(string $jurisdictionCode = 'IN'): ?PayrollConfig
    {
        return $this->getRepository(PayrollConfig::class)->findOneBy([
            'jurisdictionCode' => $jurisdictionCode,
        ]);
    }

    public function savePayrollConfig(PayrollConfig $config): PayrollConfig
    {
        $config->setUpdatedAt(new DateTime());
        $this->persist($config);
        return $config;
    }

    public function getCurrencyById(string $currencyId): ?CurrencyType
    {
        return $this->getRepository(CurrencyType::class)->find($currencyId);
    }

    /**
     * @return PayrollTaxBracket[]
     */
    public function getTaxBrackets(
        string $financialYear = '2026-27',
        string $taxRegime = PayrollTaxBracket::REGIME_NEW_115BAC,
        string $jurisdictionCode = 'IN',
        bool $activeOnly = true
    ): array {
        $q = $this->createQueryBuilder(PayrollTaxBracket::class, 'tb')
            ->andWhere('tb.jurisdictionCode = :jurisdiction')
            ->andWhere('tb.financialYear = :fy')
            ->andWhere('tb.taxRegime = :regime')
            ->setParameter('jurisdiction', $jurisdictionCode)
            ->setParameter('fy', $financialYear)
            ->setParameter('regime', $taxRegime)
            ->addOrderBy('tb.slabOrder', 'ASC');

        if ($activeOnly) {
            $q->andWhere('tb.isActive = :active')->setParameter('active', true);
        }

        return $q->getQuery()->execute();
    }

    public function getTaxBracketById(int $id): ?PayrollTaxBracket
    {
        return $this->getRepository(PayrollTaxBracket::class)->find($id);
    }

    public function saveTaxBracket(PayrollTaxBracket $bracket): PayrollTaxBracket
    {
        $this->persist($bracket);
        return $bracket;
    }

    /**
     * @return PayrollStatutoryRule[]
     */
    public function getEffectiveStatutoryRules(
        string $ruleType,
        DateTime $asOfDate,
        ?string $stateCode = null,
        string $jurisdictionCode = 'IN'
    ): array {
        $q = $this->createQueryBuilder(PayrollStatutoryRule::class, 'sr')
            ->andWhere('sr.jurisdictionCode = :jurisdiction')
            ->andWhere('sr.ruleType = :ruleType')
            ->andWhere('sr.isActive = :active')
            ->andWhere('sr.effectiveFrom <= :asOf')
            ->andWhere('(sr.effectiveTo IS NULL OR sr.effectiveTo >= :asOf)')
            ->setParameter('jurisdiction', $jurisdictionCode)
            ->setParameter('ruleType', $ruleType)
            ->setParameter('active', true)
            ->setParameter('asOf', $asOfDate->format('Y-m-d'))
            ->addOrderBy('sr.slabMin', 'ASC');

        if ($stateCode !== null) {
            $q->andWhere('sr.stateCode = :stateCode')->setParameter('stateCode', strtoupper($stateCode));
        }

        return $q->getQuery()->execute();
    }

    /**
     * @return PayrollStatutoryRule[]
     */
    public function getAllStatutoryRules(string $jurisdictionCode = 'IN'): array
    {
        return $this->createQueryBuilder(PayrollStatutoryRule::class, 'sr')
            ->andWhere('sr.jurisdictionCode = :jurisdiction')
            ->setParameter('jurisdiction', $jurisdictionCode)
            ->addOrderBy('sr.ruleType', 'ASC')
            ->addOrderBy('sr.stateCode', 'ASC')
            ->addOrderBy('sr.slabMin', 'ASC')
            ->getQuery()
            ->execute();
    }

    public function saveStatutoryRule(PayrollStatutoryRule $rule): PayrollStatutoryRule
    {
        $this->persist($rule);
        return $rule;
    }

    /**
     * @return PayrollLeavePolicy[]
     */
    public function getLeavePolicies(): array
    {
        return $this->createQueryBuilder(PayrollLeavePolicy::class, 'lp')
            ->leftJoin('lp.leaveType', 'lt')
            ->andWhere('lt.deleted = :deleted')
            ->setParameter('deleted', false)
            ->addOrderBy('lt.name', 'ASC')
            ->getQuery()
            ->execute();
    }

    /**
     * @return array<int, PayrollLeavePolicy> Keyed by LeaveType id
     */
    public function getLeavePoliciesKeyedByTypeId(): array
    {
        $policies = $this->getLeavePolicies();
        $map = [];
        foreach ($policies as $policy) {
            $map[$policy->getLeaveType()->getId()] = $policy;
        }
        return $map;
    }

    public function getLeavePolicyByLeaveTypeId(int $leaveTypeId): ?PayrollLeavePolicy
    {
        return $this->createQueryBuilder(PayrollLeavePolicy::class, 'lp')
            ->andWhere('IDENTITY(lp.leaveType) = :ltId')
            ->setParameter('ltId', $leaveTypeId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function saveLeavePolicy(PayrollLeavePolicy $policy): PayrollLeavePolicy
    {
        $this->persist($policy);
        return $policy;
    }

    /**
     * @return LeaveType[]
     */
    public function getActiveLeaveTypes(): array
    {
        return $this->createQueryBuilder(LeaveType::class, 'lt')
            ->andWhere('lt.deleted = :deleted')
            ->setParameter('deleted', false)
            ->addOrderBy('lt.name', 'ASC')
            ->getQuery()
            ->execute();
    }

    public function getEmployeePayrollProfile(int $empNumber): ?EmployeePayrollProfile
    {
        return $this->createQueryBuilder(EmployeePayrollProfile::class, 'p')
            ->andWhere('IDENTITY(p.employee) = :empNumber')
            ->setParameter('empNumber', $empNumber)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function saveEmployeePayrollProfile(EmployeePayrollProfile $profile): EmployeePayrollProfile
    {
        $profile->setUpdatedAt(new DateTime());
        $this->persist($profile);
        return $profile;
    }

    public function getEmployeeByNumber(int $empNumber): ?Employee
    {
        return $this->getRepository(Employee::class)->find($empNumber);
    }
}

