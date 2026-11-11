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
use OrangeHRM\Entity\PayrollPaymentBatch;
use OrangeHRM\Payroll\Api\Model\PayrollPaymentBatchModel;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;
use OrangeHRM\Payroll\Dto\PayrollPaymentBatchSearchFilterParams;

class PayrollPaymentBatchAPI extends Endpoint implements CollectionEndpoint, ResourceEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/payment-batches",
     *     tags={"Payroll/Payments"},
     *     summary="List Bank Disbursement Batches",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getAll(): EndpointResult
    {
        $fp = new PayrollPaymentBatchSearchFilterParams();
        $this->setSortingAndPaginationParams($fp, 'batch.id');
        $fp->setPayrollRunId($this->getRequestParams()->getIntOrNull(RequestParams::PARAM_TYPE_QUERY, 'payrollRunId'));
        $fp->setStatus($this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_QUERY, 'status'));

        $dao = $this->getPayrollPaymentService()->getRunDao();
        $batches = $dao->getPaymentBatchList($fp);
        $count = $dao->getPaymentBatchCount($fp);

        return new EndpointCollectionResult(
            PayrollPaymentBatchModel::class,
            $batches,
            new ParameterBag([CommonParams::PARAMETER_TOTAL => $count])
        );
    }

    public function getValidationRuleForGetAll(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('payrollRunId', new Rule(Rules::POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('status', new Rule(Rules::STRING_TYPE))),
            ...$this->getSortingAndPaginationParamsRules(PayrollPaymentBatchSearchFilterParams::ALLOWED_SORT_FIELDS)
        );
    }

    /**
     * @OA\Post(
     *     path="/api/v2/payroll/payment-batches",
     *     tags={"Payroll/Payments"},
     *     summary="Create Payment Disbursement Batch for Locked Run",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function create(): EndpointResult
    {
        $runId = $this->getRequestParams()->getInt(RequestParams::PARAM_TYPE_BODY, 'payrollRunId');
        $mode = $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, 'paymentMode', 'NEFT');
        $actor = $this->getCurrentPayrollUser();

        $batch = $this->executePayrollCall(
            fn () => $this->getPayrollPaymentService()->createPaymentBatch($runId, $mode, $actor)
        );
        return new EndpointResourceResult(PayrollPaymentBatchModel::class, $batch);
    }

    public function getValidationRuleForCreate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule('payrollRunId', new Rule(Rules::POSITIVE)),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('paymentMode', new Rule(Rules::IN, [['NEFT', 'IMPS', 'RTGS']])))
        );
    }

    public function getOne(): EndpointResult
    {
        $id = $this->getAttributeId();
        $batch = $this->getPayrollPaymentService()->getRunDao()->getPaymentBatchById($id);
        $this->throwRecordNotFoundExceptionIfNotExist($batch, PayrollPaymentBatch::class);
        return new EndpointResourceResult(PayrollPaymentBatchModel::class, $batch);
    }

    public function getValidationRuleForGetOne(): ParamRuleCollection
    {
        return new ParamRuleCollection(new ParamRule(CommonParams::PARAMETER_ID, new Rule(Rules::POSITIVE)));
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

