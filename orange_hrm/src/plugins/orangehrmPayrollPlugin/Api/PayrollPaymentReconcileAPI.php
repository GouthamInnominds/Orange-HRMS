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
use OrangeHRM\Payroll\Api\Model\PayrollPaymentBatchModel;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;

class PayrollPaymentReconcileAPI extends Endpoint implements CollectionEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Post(
     *     path="/api/v2/payroll/payment-batches/{batchId}/reconcile",
     *     tags={"Payroll/Payments"},
     *     summary="Reconcile Bank Payment UTR (Settles Claim Requests to PAID) or Mark Failed",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function create(): EndpointResult
    {
        $batchId = $this->getRequestParams()->getInt(RequestParams::PARAM_TYPE_ATTRIBUTE, 'batchId');
        $succeeded = $this->getRequestParams()->getBoolean(RequestParams::PARAM_TYPE_BODY, 'succeeded', true);
        $utrOrReason = $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, 'utrOrReason');
        $actor = $this->getCurrentPayrollUser();

        $batch = $this->executePayrollCall(
            fn () => $this->getPayrollPaymentService()->reconcileBatch($batchId, $succeeded, $utrOrReason, $actor)
        );
        return new EndpointResourceResult(PayrollPaymentBatchModel::class, $batch);
    }

    public function getValidationRuleForCreate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule('batchId', new Rule(Rules::POSITIVE)),
            new ParamRule('succeeded', new Rule(Rules::BOOL_VAL)),
            new ParamRule('utrOrReason', new Rule(Rules::STRING_TYPE), new Rule(Rules::LENGTH, [3, 100]))
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

