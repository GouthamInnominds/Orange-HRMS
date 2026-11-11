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
use OrangeHRM\Core\Api\V2\EndpointResourceResult;
use OrangeHRM\Core\Api\V2\EndpointResult;
use OrangeHRM\Core\Api\V2\Exception\NotImplementedException;
use OrangeHRM\Core\Api\V2\ParameterBag;
use OrangeHRM\Core\Api\V2\RequestParams;
use OrangeHRM\Core\Api\V2\ResourceEndpoint;
use OrangeHRM\Core\Api\V2\Validator\ParamRule;
use OrangeHRM\Core\Api\V2\Validator\ParamRuleCollection;
use OrangeHRM\Core\Api\V2\Validator\Rule;
use OrangeHRM\Core\Api\V2\Validator\Rules;
use OrangeHRM\Entity\PayrollRecord;
use OrangeHRM\Payroll\Api\Model\PayrollRecordModel;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;
use OrangeHRM\Payroll\Dto\PayrollRecordSearchFilterParams;

class PayrollRecordAPI extends Endpoint implements CollectionEndpoint, ResourceEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/runs/{runId}/records",
     *     tags={"Payroll/Records"},
     *     summary="List Calculated Payroll Records for a Run",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getAll(): EndpointResult
    {
        $runId = $this->getRequestParams()->getInt(RequestParams::PARAM_TYPE_ATTRIBUTE, 'runId');
        $fp = new PayrollRecordSearchFilterParams();
        $this->setSortingAndPaginationParams($fp, 'emp.firstName');
        $fp->setPayrollRunId($runId);
        $fp->setStatus($this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_QUERY, 'status'));
        $fp->setSearch($this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_QUERY, 'search'));

        $dao = $this->getPayrollApplicationService()->getRunDao();
        $records = $dao->getRecordList($fp);
        $count = $dao->getRecordCount($fp);

        return new EndpointCollectionResult(
            PayrollRecordModel::class,
            $records,
            new ParameterBag([CommonParams::PARAMETER_TOTAL => $count])
        );
    }

    public function getValidationRuleForGetAll(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule('runId', new Rule(Rules::POSITIVE)),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('status', new Rule(Rules::STRING_TYPE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('search', new Rule(Rules::STRING_TYPE))),
            ...$this->getSortingAndPaginationParamsRules(PayrollRecordSearchFilterParams::ALLOWED_SORT_FIELDS)
        );
    }

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/records/{id}",
     *     tags={"Payroll/Records"},
     *     summary="Get Single Payroll Record Breakdown",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getOne(): EndpointResult
    {
        $id = $this->getAttributeId();
        $record = $this->getPayrollApplicationService()->getRunDao()->getRecordById($id);
        $this->throwRecordNotFoundExceptionIfNotExist($record, PayrollRecord::class);
        return new EndpointResourceResult(PayrollRecordModel::class, $record);
    }

    public function getValidationRuleForGetOne(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule(CommonParams::PARAMETER_ID, new Rule(Rules::POSITIVE))
        );
    }

    public function create(): EndpointResult
    {
        throw new NotImplementedException();
    }

    public function getValidationRuleForCreate(): ParamRuleCollection
    {
        return new ParamRuleCollection();
    }

    public function update(): EndpointResult
    {
        throw new NotImplementedException();
    }

    public function getValidationRuleForUpdate(): ParamRuleCollection
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

