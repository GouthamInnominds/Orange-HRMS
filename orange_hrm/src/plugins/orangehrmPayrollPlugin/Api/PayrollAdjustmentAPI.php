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
use OrangeHRM\Core\Api\V2\Endpoint;
use OrangeHRM\Core\Api\V2\EndpointResourceResult;
use OrangeHRM\Core\Api\V2\EndpointResult;
use OrangeHRM\Core\Api\V2\Exception\NotImplementedException;
use OrangeHRM\Core\Api\V2\RequestParams;
use OrangeHRM\Core\Api\V2\ResourceEndpoint;
use OrangeHRM\Core\Api\V2\Validator\ParamRule;
use OrangeHRM\Core\Api\V2\Validator\ParamRuleCollection;
use OrangeHRM\Core\Api\V2\Validator\Rule;
use OrangeHRM\Core\Api\V2\Validator\Rules;
use OrangeHRM\Entity\PayrollRecord;
use OrangeHRM\Payroll\Api\Model\PayrollRecordModel;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;

class PayrollAdjustmentAPI extends Endpoint implements ResourceEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/records/{id}/adjustment",
     *     tags={"Payroll/Records"},
     *     summary="Get Payroll Record Adjustment Detail",
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

    /**
     * @OA\Put(
     *     path="/api/v2/payroll/records/{id}/adjustment",
     *     tags={"Payroll/Records"},
     *     summary="Apply Audited Manual Adjustment on Calculated/Rejected Payroll Record",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function update(): EndpointResult
    {
        $id = $this->getAttributeId();
        $amount = (string)$this->getRequestParams()->getFloat(RequestParams::PARAM_TYPE_BODY, 'adjustmentAmount');
        $reason = $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, 'reason');
        $actor = $this->getCurrentPayrollUser();

        $record = $this->executePayrollCall(
            fn () => $this->getPayrollCalculationService()->applyManualAdjustment($id, $amount, $reason, $actor)
        );
        return new EndpointResourceResult(PayrollRecordModel::class, $record);
    }

    public function getValidationRuleForUpdate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule(CommonParams::PARAMETER_ID, new Rule(Rules::POSITIVE)),
            new ParamRule('adjustmentAmount', new Rule(Rules::NUMERIC_VAL)),
            new ParamRule('reason', new Rule(Rules::STRING_TYPE), new Rule(Rules::LENGTH, [3, 250]))
        );
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

