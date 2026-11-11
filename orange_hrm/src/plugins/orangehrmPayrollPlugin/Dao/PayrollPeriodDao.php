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
use OrangeHRM\Entity\PayrollPayPeriod;
use OrangeHRM\ORM\Paginator;
use OrangeHRM\Payroll\Dto\PayrollPayPeriodSearchFilterParams;

class PayrollPeriodDao extends BaseDao
{
    public function savePayPeriod(PayrollPayPeriod $payPeriod): PayrollPayPeriod
    {
        $payPeriod->setUpdatedAt(new DateTime());
        $this->persist($payPeriod);
        return $payPeriod;
    }

    public function getPayPeriodById(int $id): ?PayrollPayPeriod
    {
        return $this->getRepository(PayrollPayPeriod::class)->find($id);
    }

    /**
     * @return PayrollPayPeriod[]
     */
    public function getPayPeriodList(PayrollPayPeriodSearchFilterParams $filterParams): array
    {
        return $this->getPayPeriodPaginator($filterParams)->getQuery()->execute();
    }

    public function getPayPeriodCount(PayrollPayPeriodSearchFilterParams $filterParams): int
    {
        return $this->getPayPeriodPaginator($filterParams)->count();
    }

    private function getPayPeriodPaginator(PayrollPayPeriodSearchFilterParams $filterParams): Paginator
    {
        $q = $this->createQueryBuilder(PayrollPayPeriod::class, 'period');
        $this->setSortingAndPaginationParams($q, $filterParams);

        if ($filterParams->getStatus() !== null) {
            $q->andWhere('period.status = :status')->setParameter('status', $filterParams->getStatus());
        }
        if ($filterParams->getFinancialYear() !== null) {
            $q->andWhere('period.financialYear = :fy')->setParameter('fy', $filterParams->getFinancialYear());
        }
        if ($filterParams->getJurisdictionCode() !== null) {
            $q->andWhere('period.jurisdictionCode = :jurisdiction')->setParameter('jurisdiction', $filterParams->getJurisdictionCode());
        }

        return $this->getPaginator($q);
    }

    /**
     * @return PayrollPayPeriod[]
     */
    public function findOverlappingPeriods(
        DateTime $startDate,
        DateTime $endDate,
        string $jurisdictionCode = 'IN',
        ?int $excludePeriodId = null
    ): array {
        $q = $this->createQueryBuilder(PayrollPayPeriod::class, 'period')
            ->andWhere('period.jurisdictionCode = :jurisdiction')
            ->andWhere('period.startDate <= :endDate')
            ->andWhere('period.endDate >= :startDate')
            ->setParameter('jurisdiction', $jurisdictionCode)
            ->setParameter('startDate', $startDate->format('Y-m-d'))
            ->setParameter('endDate', $endDate->format('Y-m-d'));

        if ($excludePeriodId !== null) {
            $q->andWhere('period.id != :excludeId')->setParameter('excludeId', $excludePeriodId);
        }

        return $q->getQuery()->execute();
    }

    public function deletePayPeriod(int $id): int
    {
        $q = $this->createQueryBuilder(PayrollPayPeriod::class, 'period')
            ->delete()
            ->where('period.id = :id')
            ->setParameter('id', $id);
        return $q->getQuery()->execute();
    }
}

