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
use OrangeHRM\Core\Api\V2\CrudEndpoint;
use OrangeHRM\Core\Api\V2\Endpoint;
use OrangeHRM\Core\Api\V2\EndpointCollectionResult;
use OrangeHRM\Core\Api\V2\EndpointResourceResult;
use OrangeHRM\Core\Api\V2\EndpointResult;
use OrangeHRM\Core\Api\V2\Model\ArrayModel;
use OrangeHRM\Core\Api\V2\ParameterBag;
use OrangeHRM\Core\Api\V2\RequestParams;
use OrangeHRM\Core\Api\V2\Validator\ParamRule;
use OrangeHRM\Core\Api\V2\Validator\ParamRuleCollection;
use OrangeHRM\Core\Api\V2\Validator\Rule;
use OrangeHRM\Core\Api\V2\Validator\Rules;
use OrangeHRM\Payroll\Api\Model\PayPeriodModel;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;
use OrangeHRM\Payroll\Dto\PayrollPayPeriodSearchFilterParams;

class PayPeriodAPI extends Endpoint implements CrudEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/pay-periods",
     *     tags={"Payroll/Pay Periods"},
     *     summary="List Pay Periods",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getAll(): EndpointResult
    {
        $fp = new PayrollPayPeriodSearchFilterParams();
        $this->setSortingAndPaginationParams($fp, 'period.startDate');
        $fp->setStatus($this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_QUERY, 'status'));
        $fp->setFinancialYear($this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_QUERY, 'financialYear'));
        $fp->setJurisdictionCode($this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_QUERY, 'jurisdictionCode'));

        $dao = $this->getPayrollApplicationService()->getPeriodDao();
        $items = $dao->getPayPeriodList($fp);
        $count = $dao->getPayPeriodCount($fp);

        return new EndpointCollectionResult(
            PayPeriodModel::class,
            $items,
            new ParameterBag([CommonParams::PARAMETER_TOTAL => $count])
        );
    }

    public function getValidationRuleForGetAll(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('status', new Rule(Rules::STRING_TYPE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('financialYear', new Rule(Rules::STRING_TYPE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('jurisdictionCode', new Rule(Rules::STRING_TYPE))),
            ...$this->getSortingAndPaginationParamsRules(PayrollPayPeriodSearchFilterParams::ALLOWED_SORT_FIELDS)
        );
    }

    /**
     * @OA\Post(
     *     path="/api/v2/payroll/pay-periods",
     *     tags={"Payroll/Pay Periods"},
     *     summary="Create Pay Period",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function create(): EndpointResult
    {
        $payload = [
            'name' => $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, 'name'),
            'startDate' => $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, 'startDate'),
            'endDate' => $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, 'endDate'),
            'payDate' => $this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_BODY, 'payDate'),
            'frequency' => $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, 'frequency', 'MONTHLY'),
            'jurisdictionCode' => $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, 'jurisdictionCode', 'IN'),
            'currencyId' => $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, 'currencyId', 'INR'),
            'standardWorkingDays' => $this->getRequestParams()->getFloatOrNull(RequestParams::PARAM_TYPE_BODY, 'standardWorkingDays'),
            'financialYear' => $this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_BODY, 'financialYear'),
        ];

        $actor = $this->getCurrentPayrollUser();
        $period = $this->executePayrollCall(
            fn () => $this->getPayrollApplicationService()->createPayPeriod(array_filter($payload, fn ($v) => $v !== null), $actor)
        );

        return new EndpointResourceResult(PayPeriodModel::class, $period);
    }

    public function getValidationRuleForCreate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule('name', new Rule(Rules::STRING_TYPE), new Rule(Rules::LENGTH, [1, 100])),
            new ParamRule('startDate', new Rule(Rules::API_DATE)),
            new ParamRule('endDate', new Rule(Rules::API_DATE)),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('payDate', new Rule(Rules::API_DATE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('frequency', new Rule(Rules::STRING_TYPE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('jurisdictionCode', new Rule(Rules::STRING_TYPE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('currencyId', new Rule(Rules::STRING_TYPE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('standardWorkingDays', new Rule(Rules::POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('financialYear', new Rule(Rules::STRING_TYPE)))
        );
    }

    /**
     * @OA\Delete(
     *     path="/api/v2/payroll/pay-periods",
     *     tags={"Payroll/Pay Periods"},
     *     summary="Delete Pay Periods",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function delete(): EndpointResult
    {
        $ids = $this->getRequestParams()->getArray(RequestParams::PARAM_TYPE_BODY, CommonParams::PARAMETER_IDS);
        $actor = $this->getCurrentPayrollUser();
        $this->executePayrollCall(function () use ($ids, $actor): void {
            foreach ($ids as $id) {
                $this->getPayrollApplicationService()->deletePayPeriod((int)$id, $actor);
            }
        });
        return new EndpointResourceResult(ArrayModel::class, $ids);
    }

    public function getValidationRuleForDelete(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule(CommonParams::PARAMETER_IDS, new Rule(Rules::INT_ARRAY))
        );
    }

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/pay-periods/{id}",
     *     tags={"Payroll/Pay Periods"},
     *     summary="Get a Pay Period",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getOne(): EndpointResult
    {
        $id = $this->getAttributeId();
        $period = $this->getPayrollApplicationService()->getPeriodDao()->getPayPeriodById($id);
        $this->throwRecordNotFoundExceptionIfNotExist($period, \OrangeHRM\Entity\PayrollPayPeriod::class);
        return new EndpointResourceResult(PayPeriodModel::class, $period);
    }

    public function getValidationRuleForGetOne(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule(CommonParams::PARAMETER_ID, new Rule(Rules::POSITIVE))
        );
    }

    /**
     * @OA\Put(
     *     path="/api/v2/payroll/pay-periods/{id}",
     *     tags={"Payroll/Pay Periods"},
     *     summary="Update a Pay Period",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function update(): EndpointResult
    {
        $id = $this->getAttributeId();
        $payload = array_filter([
            'name' => $this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_BODY, 'name'),
            'startDate' => $this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_BODY, 'startDate'),
            'endDate' => $this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_BODY, 'endDate'),
            'payDate' => $this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_BODY, 'payDate'),
            'standardWorkingDays' => $this->getRequestParams()->getFloatOrNull(RequestParams::PARAM_TYPE_BODY, 'standardWorkingDays'),
            'financialYear' => $this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_BODY, 'financialYear'),
        ], fn ($v) => $v !== null);

        $actor = $this->getCurrentPayrollUser();
        $period = $this->executePayrollCall(
            fn () => $this->getPayrollApplicationService()->updatePayPeriod($id, $payload, $actor)
        );
        return new EndpointResourceResult(PayPeriodModel::class, $period);
    }

    public function getValidationRuleForUpdate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule(CommonParams::PARAMETER_ID, new Rule(Rules::POSITIVE)),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('name', new Rule(Rules::STRING_TYPE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('startDate', new Rule(Rules::API_DATE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('endDate', new Rule(Rules::API_DATE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('payDate', new Rule(Rules::API_DATE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('standardWorkingDays', new Rule(Rules::POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('financialYear', new Rule(Rules::STRING_TYPE)))
        );
    }
}
