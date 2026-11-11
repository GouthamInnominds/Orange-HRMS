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
use OrangeHRM\Core\Api\V2\Endpoint;
use OrangeHRM\Core\Api\V2\EndpointResourceResult;
use OrangeHRM\Core\Api\V2\EndpointResult;
use OrangeHRM\Core\Api\V2\Exception\InvalidParamException;
use OrangeHRM\Core\Api\V2\Exception\NotImplementedException;
use OrangeHRM\Core\Api\V2\RequestParams;
use OrangeHRM\Core\Api\V2\ResourceEndpoint;
use OrangeHRM\Core\Api\V2\Validator\ParamRule;
use OrangeHRM\Core\Api\V2\Validator\ParamRuleCollection;
use OrangeHRM\Core\Api\V2\Validator\Rule;
use OrangeHRM\Core\Api\V2\Validator\Rules;
use OrangeHRM\Entity\PayrollTaxBracket;
use OrangeHRM\Payroll\Api\Model\EmployeeStatutoryProfileModel;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;

class EmployeeStatutoryProfileAPI extends Endpoint implements ResourceEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/employees/{empNumber}/statutory-profile",
     *     tags={"Payroll/Employee Profile"},
     *     summary="Get Employee Indian Statutory, Tax Regime & Masked Bank Profile",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getOne(): EndpointResult
    {
        $empNumber = $this->getRequestParams()->getInt(RequestParams::PARAM_TYPE_ATTRIBUTE, 'empNumber');
        $this->assertEmployeePayrollAccess($empNumber);

        $profile = $this->executePayrollCall(
            fn () => $this->getPayrollConfigService()->getOrCreateEmployeeProfile($empNumber)
        );
        return new EndpointResourceResult(EmployeeStatutoryProfileModel::class, $profile);
    }

    public function getValidationRuleForGetOne(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule('empNumber', new Rule(Rules::POSITIVE))
        );
    }

    /**
     * @OA\Put(
     *     path="/api/v2/payroll/employees/{empNumber}/statutory-profile",
     *     tags={"Payroll/Employee Profile"},
     *     summary="Update Employee Indian Statutory, Tax Regime & Bank Profile",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function update(): EndpointResult
    {
        $empNumber = $this->getRequestParams()->getInt(RequestParams::PARAM_TYPE_ATTRIBUTE, 'empNumber');
        $params = $this->getRequestParams();
        $payload = [];

        foreach ([
            'panNumber',
            'uanNumber',
            'esicIpNumber',
            'ptStateCode',
            'taxRegime',
            'bankAccountHolder',
            'bankAccountNumber',
            'bankIfscCode',
            'bankName',
        ] as $strField) {
            if ($params->has(RequestParams::PARAM_TYPE_BODY, $strField)) {
                $val = $params->getStringOrNull(RequestParams::PARAM_TYPE_BODY, $strField);
                if ($strField === 'panNumber' && $val !== null && trim($val) !== '') {
                    $upperPan = strtoupper(trim($val));
                    if (!preg_match('/^[A-Z]{5}[0-9]{4}[A-Z]$/', $upperPan)) {
                        throw new InvalidParamException('PAN number must follow valid Indian PAN format (e.g., ABCDE1234F).');
                    }
                    $val = $upperPan;
                }
                if ($strField === 'bankIfscCode' && $val !== null && trim($val) !== '') {
                    $upperIfsc = strtoupper(trim($val));
                    if (!preg_match('/^[A-Z]{4}0[A-Z0-9]{6}$/', $upperIfsc)) {
                        throw new InvalidParamException('IFSC code must follow 11-character RBI IFSC format (e.g., HDFC0001234).');
                    }
                    $val = $upperIfsc;
                }
                if ($strField === 'bankAccountNumber' && ($val === null || trim($val) === '')) {
                    // Do not accidentally erase existing bank account unless explicitly requested
                    continue;
                }
                $payload[$strField] = $val;
            }
        }

        if ($params->has(RequestParams::PARAM_TYPE_BODY, 'clearBankAccount') && $params->getBoolean(RequestParams::PARAM_TYPE_BODY, 'clearBankAccount', false)) {
            $payload['bankAccountNumber'] = null;
        }

        foreach (['epfOptedIn', 'epfRestrictToCeiling', 'esicApplicable', 'ptApplicable'] as $boolField) {
            if ($params->has(RequestParams::PARAM_TYPE_BODY, $boolField)) {
                $payload[$boolField] = $params->getBoolean(RequestParams::PARAM_TYPE_BODY, $boolField);
            }
        }

        foreach (['basicPercentOfCtc', 'hraPercentOfBasic', 'declared80c', 'declared80d', 'declaredHraAnnual', 'otherExemptions'] as $numField) {
            if ($params->has(RequestParams::PARAM_TYPE_BODY, $numField)) {
                $payload[$numField] = $params->getFloat(RequestParams::PARAM_TYPE_BODY, $numField);
            }
        }

        $actor = $this->getCurrentPayrollUser();
        $saved = $this->executePayrollCall(
            fn () => $this->getPayrollConfigService()->updateEmployeeProfile($empNumber, $payload, $actor)
        );
        return new EndpointResourceResult(EmployeeStatutoryProfileModel::class, $saved);
    }

    public function getValidationRuleForUpdate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule('empNumber', new Rule(Rules::POSITIVE)),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('panNumber', new Rule(Rules::STRING_VAL)), true),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('uanNumber', new Rule(Rules::STRING_VAL)), true),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('esicIpNumber', new Rule(Rules::STRING_VAL)), true),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('ptStateCode', new Rule(Rules::IN, [['KA', 'MH', 'WB']]))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('taxRegime', new Rule(Rules::IN, [[PayrollTaxBracket::REGIME_NEW_115BAC, PayrollTaxBracket::REGIME_OLD]]))),
            new ParamRule('epfOptedIn', new Rule(Rules::BOOL_VAL)),
            new ParamRule('epfRestrictToCeiling', new Rule(Rules::BOOL_VAL)),
            new ParamRule('esicApplicable', new Rule(Rules::BOOL_VAL)),
            new ParamRule('ptApplicable', new Rule(Rules::BOOL_VAL)),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('basicPercentOfCtc', new Rule(Rules::POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('hraPercentOfBasic', new Rule(Rules::ZERO_OR_POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('declared80c', new Rule(Rules::ZERO_OR_POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('declared80d', new Rule(Rules::ZERO_OR_POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('declaredHraAnnual', new Rule(Rules::ZERO_OR_POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('otherExemptions', new Rule(Rules::ZERO_OR_POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('bankAccountHolder', new Rule(Rules::STRING_VAL)), true),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('bankAccountNumber', new Rule(Rules::STRING_VAL)), true),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('bankIfscCode', new Rule(Rules::STRING_VAL)), true),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('bankName', new Rule(Rules::STRING_VAL)), true),
            new ParamRule('clearBankAccount', new Rule(Rules::BOOL_VAL))
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

