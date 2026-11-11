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
use OrangeHRM\Core\Api\V2\ResourceEndpoint;
use OrangeHRM\Core\Api\V2\Validator\ParamRule;
use OrangeHRM\Core\Api\V2\Validator\ParamRuleCollection;
use OrangeHRM\Core\Api\V2\Validator\Rule;
use OrangeHRM\Core\Api\V2\Validator\Rules;
use OrangeHRM\Entity\PayrollConfig;
use OrangeHRM\Entity\PayrollTaxBracket;
use OrangeHRM\Payroll\Api\Model\PayrollConfigModel;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;

class PayrollConfigAPI extends Endpoint implements CollectionEndpoint, ResourceEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/config",
     *     tags={"Payroll/Configuration"},
     *     summary="Get India Payroll Organization Configuration",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getAll(): EndpointResult
    {
        $jurisdiction = $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_QUERY, 'jurisdictionCode', 'IN');
        $config = $this->executePayrollCall(fn () => $this->getPayrollConfigService()->getConfig($jurisdiction));
        return new EndpointResourceResult(PayrollConfigModel::class, $config);
    }

    public function getValidationRuleForGetAll(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('jurisdictionCode', new Rule(Rules::STRING_TYPE)))
        );
    }

    public function getOne(): EndpointResult
    {
        return $this->getAll();
    }

    public function getValidationRuleForGetOne(): ParamRuleCollection
    {
        return $this->getValidationRuleForGetAll();
    }

    /**
     * @OA\Put(
     *     path="/api/v2/payroll/config",
     *     tags={"Payroll/Configuration"},
     *     summary="Update India Payroll Organization Configuration",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function update(): EndpointResult
    {
        $payload = [];
        $body = $this->getRequestParams();
        $payload['jurisdictionCode'] = $body->getString(RequestParams::PARAM_TYPE_BODY, 'jurisdictionCode', 'IN');

        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'lwpDivisorMode')) {
            $payload['lwpDivisorMode'] = $body->getString(RequestParams::PARAM_TYPE_BODY, 'lwpDivisorMode');
        }
        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'timeAttendanceSourceMode')) {
            $payload['timeAttendanceSourceMode'] = $body->getString(RequestParams::PARAM_TYPE_BODY, 'timeAttendanceSourceMode');
        }
        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'standardShiftHours')) {
            $payload['standardShiftHours'] = $body->getFloat(RequestParams::PARAM_TYPE_BODY, 'standardShiftHours');
        }
        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'overtimeMultiplier')) {
            $payload['overtimeMultiplier'] = $body->getFloat(RequestParams::PARAM_TYPE_BODY, 'overtimeMultiplier');
        }
        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'overtimeEligibleMaxBasic')) {
            $payload['overtimeEligibleMaxBasic'] = $body->getFloatOrNull(RequestParams::PARAM_TYPE_BODY, 'overtimeEligibleMaxBasic');
        }
        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'epfWageCeiling')) {
            $payload['epfWageCeiling'] = $body->getFloat(RequestParams::PARAM_TYPE_BODY, 'epfWageCeiling');
        }
        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'epfCapAtCeiling')) {
            $payload['epfCapAtCeiling'] = $body->getBoolean(RequestParams::PARAM_TYPE_BODY, 'epfCapAtCeiling');
        }
        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'esicGrossCeiling')) {
            $payload['esicGrossCeiling'] = $body->getFloat(RequestParams::PARAM_TYPE_BODY, 'esicGrossCeiling');
        }
        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'defaultPtStateCode')) {
            $payload['defaultPtStateCode'] = $body->getString(RequestParams::PARAM_TYPE_BODY, 'defaultPtStateCode');
        }
        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'defaultTaxRegime')) {
            $payload['defaultTaxRegime'] = $body->getString(RequestParams::PARAM_TYPE_BODY, 'defaultTaxRegime');
        }
        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'requireMakerCheckerApproval')) {
            $payload['requireMakerCheckerApproval'] = $body->getBoolean(RequestParams::PARAM_TYPE_BODY, 'requireMakerCheckerApproval');
        }

        $actor = $this->getCurrentPayrollUser();
        $updated = $this->executePayrollCall(fn () => $this->getPayrollConfigService()->updateConfig($payload, $actor));
        return new EndpointResourceResult(PayrollConfigModel::class, $updated);
    }

    public function getValidationRuleForUpdate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('jurisdictionCode', new Rule(Rules::STRING_TYPE))),
            $this->getValidationDecorator()->notRequiredParamRule(
                new ParamRule('lwpDivisorMode', new Rule(Rules::IN, [[PayrollConfig::LWP_DIVISOR_CALENDAR_DAYS, PayrollConfig::LWP_DIVISOR_WORKING_DAYS, PayrollConfig::LWP_DIVISOR_FIXED_30]]))
            ),
            $this->getValidationDecorator()->notRequiredParamRule(
                new ParamRule('timeAttendanceSourceMode', new Rule(Rules::IN, [[PayrollConfig::TIME_SOURCE_ATTENDANCE_ONLY, PayrollConfig::TIME_SOURCE_TIMESHEET_ONLY, PayrollConfig::TIME_SOURCE_TIMESHEET_PRIMARY]]))
            ),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('standardShiftHours', new Rule(Rules::POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('overtimeMultiplier', new Rule(Rules::ZERO_OR_POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('overtimeEligibleMaxBasic', new Rule(Rules::ZERO_OR_POSITIVE)), true),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('epfWageCeiling', new Rule(Rules::ZERO_OR_POSITIVE))),
            new ParamRule('epfCapAtCeiling', new Rule(Rules::BOOL_VAL)),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('esicGrossCeiling', new Rule(Rules::ZERO_OR_POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('defaultPtStateCode', new Rule(Rules::IN, [['KA', 'MH', 'WB']]))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('defaultTaxRegime', new Rule(Rules::IN, [[PayrollTaxBracket::REGIME_NEW_115BAC, PayrollTaxBracket::REGIME_OLD]]))),
            new ParamRule('requireMakerCheckerApproval', new Rule(Rules::BOOL_VAL))
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
