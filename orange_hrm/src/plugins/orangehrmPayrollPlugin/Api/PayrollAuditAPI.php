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
use OrangeHRM\Core\Api\V2\ParameterBag;
use OrangeHRM\Core\Api\V2\RequestParams;
use OrangeHRM\Core\Api\V2\Validator\ParamRule;
use OrangeHRM\Core\Api\V2\Validator\ParamRuleCollection;
use OrangeHRM\Core\Api\V2\Validator\Rule;
use OrangeHRM\Core\Api\V2\Validator\Rules;
use OrangeHRM\Payroll\Api\Model\PayrollAuditEventModel;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;
use OrangeHRM\Payroll\Dto\PayrollAuditSearchFilterParams;

class PayrollAuditAPI extends Endpoint implements CollectionEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/audit-events",
     *     tags={"Payroll/Audit"},
     *     summary="Query Immutable Payroll Audit Events",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getAll(): EndpointResult
    {
        $fp = new PayrollAuditSearchFilterParams();
        $this->setSortingAndPaginationParams($fp, 'evt.id');
        $fp->setPayrollRunId($this->getRequestParams()->getIntOrNull(RequestParams::PARAM_TYPE_QUERY, 'payrollRunId'));
        $fp->setEmpNumber($this->getRequestParams()->getIntOrNull(RequestParams::PARAM_TYPE_QUERY, 'empNumber'));
        $fp->setEventType($this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_QUERY, 'eventType'));

        $dao = $this->getPayrollApplicationService()->getRunDao();
        $events = $dao->getAuditEventList($fp);
        $count = $dao->getAuditEventCount($fp);

        return new EndpointCollectionResult(
            PayrollAuditEventModel::class,
            $events,
            new ParameterBag([CommonParams::PARAMETER_TOTAL => $count])
        );
    }

    public function getValidationRuleForGetAll(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('payrollRunId', new Rule(Rules::POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('empNumber', new Rule(Rules::POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('eventType', new Rule(Rules::STRING_TYPE))),
            ...$this->getSortingAndPaginationParamsRules(PayrollAuditSearchFilterParams::ALLOWED_SORT_FIELDS)
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

    public function delete(): EndpointResult
    {
        throw new NotImplementedException();
    }

    public function getValidationRuleForDelete(): ParamRuleCollection
    {
        return new ParamRuleCollection();
    }
}

