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
use OrangeHRM\Core\Api\V2\CollectionEndpoint;
use OrangeHRM\Core\Api\V2\Endpoint;
use OrangeHRM\Core\Api\V2\EndpointResourceResult;
use OrangeHRM\Core\Api\V2\EndpointResult;
use OrangeHRM\Core\Api\V2\Exception\NotImplementedException;
use OrangeHRM\Core\Api\V2\RequestParams;
use OrangeHRM\Core\Api\V2\Validator\ParamRule;
use OrangeHRM\Core\Api\V2\Validator\ParamRuleCollection;
use OrangeHRM\Core\Api\V2\Validator\Rule;
use OrangeHRM\Core\Api\V2\Validator\Rules;
use OrangeHRM\Payroll\Api\Model\PayrollRunModel;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;

class PayrollRunSubmitAPI extends Endpoint implements CollectionEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Post(
     *     path="/api/v2/payroll/runs/{runId}/submit",
     *     tags={"Payroll/Workflow"},
     *     summary="Submit Calculated Payroll Run for Approval",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function create(): EndpointResult
    {
        $runId = $this->getRequestParams()->getInt(RequestParams::PARAM_TYPE_ATTRIBUTE, 'runId');
        $comments = $this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_BODY, 'comments');
        $actor = $this->getCurrentPayrollUser();
        $run = $this->executePayrollCall(fn () => $this->getPayrollWorkflowService()->submitForApproval($runId, $actor, $comments));
        return new EndpointResourceResult(PayrollRunModel::class, $run);
    }

    public function getValidationRuleForCreate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule('runId', new Rule(Rules::POSITIVE)),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('comments', new Rule(Rules::STRING_TYPE)))
        );
    }

    public function getAll(): EndpointResult
    {
        throw new NotImplementedException();
    }

    public function getValidationRuleForGetAll(): ParamRuleCollection
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

