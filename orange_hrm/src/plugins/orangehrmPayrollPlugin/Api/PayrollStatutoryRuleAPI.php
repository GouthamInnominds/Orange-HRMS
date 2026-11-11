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

namespace OrangeHRM\Payroll\Api;

use OpenApi\Annotations as OA;
use OrangeHRM\Core\Api\CommonParams;
use OrangeHRM\Core\Api\V2\CollectionEndpoint;
use OrangeHRM\Core\Api\V2\Endpoint;
use OrangeHRM\Core\Api\V2\EndpointCollectionResult;
use OrangeHRM\Core\Api\V2\EndpointResult;
use OrangeHRM\Core\Api\V2\Exception\NotImplementedException;
use OrangeHRM\Core\Api\V2\Model\ArrayModel;
use OrangeHRM\Core\Api\V2\ParameterBag;
use OrangeHRM\Core\Api\V2\Validator\ParamRuleCollection;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;

class PayrollStatutoryRuleAPI extends Endpoint implements CollectionEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/statutory-rules",
     *     tags={"Payroll/Configuration"},
     *     summary="List Active Statutory Rules (EPF, ESIC, State PT)",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getAll(): EndpointResult
    {
        $rules = $this->getPayrollConfigService()->getStatutoryRules();
        $rows = [];
        foreach ($rules as $r) {
            $rows[] = [
                'id' => $r->getId(),
                'jurisdictionCode' => $r->getJurisdictionCode(),
                'ruleType' => $r->getRuleType(),
                'stateCode' => $r->getStateCode(),
                'effectiveFrom' => $r->getEffectiveFrom()->format('Y-m-d'),
                'effectiveTo' => $r->getEffectiveTo() ? $r->getEffectiveTo()->format('Y-m-d') : null,
                'slabMin' => (float)$r->getSlabMin(),
                'slabMax' => $r->getSlabMax() !== null ? (float)$r->getSlabMax() : null,
                'employeeRate' => (float)$r->getEmployeeRate(),
                'employerRate' => (float)$r->getEmployerRate(),
                'fixedEmployeeAmount' => (float)$r->getFixedEmployeeAmount(),
                'februaryEmployeeAmount' => $r->getFebruaryEmployeeAmount() !== null ? (float)$r->getFebruaryEmployeeAmount() : null,
                'wageCeiling' => $r->getWageCeiling() !== null ? (float)$r->getWageCeiling() : null,
                'roundingMode' => $r->getRoundingMode(),
                'isActive' => $r->isActive(),
            ];
        }

        return new EndpointCollectionResult(
            ArrayModel::class,
            $rows,
            new ParameterBag([CommonParams::PARAMETER_TOTAL => count($rows)])
        );
    }

    public function getValidationRuleForGetAll(): ParamRuleCollection
    {
        return new ParamRuleCollection(...$this->getSortingAndPaginationParamsRules([], true));
    }

    public function create(): EndpointResult
    {
        throw new NotImplementedException();
    }

    public function getValidationRuleForCreate(): ParamRuleCollection
    {
        return new ParamRuleCollection();
    }

    public function delete(): EndpointResult
    {
        throw new NotImplementedException();
    }

    public function getValidationRuleForDelete(): ParamRuleCollection
    {
        return new ParamRuleCollection();
    }
}

