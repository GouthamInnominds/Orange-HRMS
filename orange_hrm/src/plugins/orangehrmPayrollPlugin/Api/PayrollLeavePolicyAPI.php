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
use OrangeHRM\Core\Api\V2\Model\ArrayModel;
use OrangeHRM\Core\Api\V2\ParameterBag;
use OrangeHRM\Core\Api\V2\RequestParams;
use OrangeHRM\Core\Api\V2\ResourceEndpoint;
use OrangeHRM\Core\Api\V2\Validator\ParamRule;
use OrangeHRM\Core\Api\V2\Validator\ParamRuleCollection;
use OrangeHRM\Core\Api\V2\Validator\Rule;
use OrangeHRM\Core\Api\V2\Validator\Rules;
use OrangeHRM\Entity\PayrollLeavePolicy;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;

class PayrollLeavePolicyAPI extends Endpoint implements CollectionEndpoint, ResourceEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/leave-policies",
     *     tags={"Payroll/Configuration"},
     *     summary="List Leave Type -> Payroll Pay Treatment Policies",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getAll(): EndpointResult
    {
        $policies = $this->getPayrollConfigService()->getLeavePoliciesWithDefaults();
        $rows = array_map(fn (PayrollLeavePolicy $p) => $this->serializePolicy($p), $policies);

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

    public function getOne(): EndpointResult
    {
        $leaveTypeId = $this->getAttributeId();
        $policy = $this->getPayrollConfigService()->getPayrollConfigDao()->getLeavePolicyByLeaveTypeId($leaveTypeId);
        $this->throwRecordNotFoundExceptionIfNotExist($policy, PayrollLeavePolicy::class);
        return new EndpointResourceResult(ArrayModel::class, $this->serializePolicy($policy));
    }

    public function getValidationRuleForGetOne(): ParamRuleCollection
    {
        return new ParamRuleCollection(new ParamRule(CommonParams::PARAMETER_ID, new Rule(Rules::POSITIVE)));
    }

    /**
     * @OA\Put(
     *     path="/api/v2/payroll/leave-policies/{id}",
     *     tags={"Payroll/Configuration"},
     *     summary="Upsert Leave Policy by LeaveType ID",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function update(): EndpointResult
    {
        $leaveTypeId = $this->getAttributeId();
        $treatment = $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, 'payrollPayTreatment');
        $multiplier = $this->getRequestParams()->getFloatOrNull(RequestParams::PARAM_TYPE_BODY, 'deductionMultiplier');
        $notes = $this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_BODY, 'notes');
        $actor = $this->getCurrentPayrollUser();

        $saved = $this->executePayrollCall(
            fn () => $this->getPayrollConfigService()->upsertLeavePolicy(
                $leaveTypeId,
                $treatment,
                $multiplier !== null ? (string)$multiplier : null,
                $notes,
                $actor
            )
        );
        return new EndpointResourceResult(ArrayModel::class, $this->serializePolicy($saved));
    }

    public function getValidationRuleForUpdate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule(CommonParams::PARAMETER_ID, new Rule(Rules::POSITIVE)),
            new ParamRule(
                'payrollPayTreatment',
                new Rule(Rules::IN, [[
                    PayrollLeavePolicy::TREATMENT_PAID,
                    PayrollLeavePolicy::TREATMENT_UNPAID,
                    PayrollLeavePolicy::TREATMENT_HALF_PAID,
                    PayrollLeavePolicy::TREATMENT_EXCESS_UNPAID,
                ]])
            ),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('deductionMultiplier', new Rule(Rules::ZERO_OR_POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('notes', new Rule(Rules::STRING_TYPE)), true)
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

    private function serializePolicy(PayrollLeavePolicy $p): array
    {
        return [
            'id' => $p->getId(),
            'leaveTypeId' => $p->getLeaveType()->getId(),
            'leaveTypeName' => $p->getLeaveType()->getName(),
            'payrollPayTreatment' => $p->getPayrollPayTreatment(),
            'deductionMultiplier' => (float)$p->getDeductionMultiplier(),
            'effectiveFrom' => $p->getEffectiveFrom()->format('Y-m-d'),
            'notes' => $p->getNotes(),
        ];
    }
}

