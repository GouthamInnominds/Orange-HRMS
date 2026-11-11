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
use OrangeHRM\Entity\PayrollTaxBracket;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;

class PayrollTaxBracketAPI extends Endpoint implements CollectionEndpoint, ResourceEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/tax-brackets",
     *     tags={"Payroll/Configuration"},
     *     summary="List Income Tax Brackets for FY & Regime",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getAll(): EndpointResult
    {
        $fy = $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_QUERY, 'financialYear', '2026-27');
        $regime = $this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_QUERY, 'taxRegime');
        $dao = $this->getPayrollConfigService()->getPayrollConfigDao();

        $brackets = [];
        $regimes = $regime ? [$regime] : [PayrollTaxBracket::REGIME_NEW_115BAC, PayrollTaxBracket::REGIME_OLD];
        foreach ($regimes as $reg) {
            foreach ($dao->getTaxBrackets($fy, $reg, 'IN', false) as $b) {
                $brackets[] = $this->serializeBracket($b);
            }
        }

        return new EndpointCollectionResult(
            ArrayModel::class,
            $brackets,
            new ParameterBag([CommonParams::PARAMETER_TOTAL => count($brackets)])
        );
    }

    public function getValidationRuleForGetAll(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('financialYear', new Rule(Rules::STRING_TYPE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('taxRegime', new Rule(Rules::IN, [[PayrollTaxBracket::REGIME_NEW_115BAC, PayrollTaxBracket::REGIME_OLD]]))),
            ...$this->getSortingAndPaginationParamsRules([], true)
        );
    }

    public function getOne(): EndpointResult
    {
        $id = $this->getAttributeId();
        $b = $this->getPayrollConfigService()->getPayrollConfigDao()->getTaxBracketById($id);
        $this->throwRecordNotFoundExceptionIfNotExist($b, PayrollTaxBracket::class);
        return new EndpointResourceResult(ArrayModel::class, $this->serializeBracket($b));
    }

    public function getValidationRuleForGetOne(): ParamRuleCollection
    {
        return new ParamRuleCollection(new ParamRule(CommonParams::PARAMETER_ID, new Rule(Rules::POSITIVE)));
    }

    /**
     * @OA\Put(
     *     path="/api/v2/payroll/tax-brackets/{id}",
     *     tags={"Payroll/Configuration"},
     *     summary="Update Tax Bracket Rate or Status",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function update(): EndpointResult
    {
        $id = $this->getAttributeId();
        $dao = $this->getPayrollConfigService()->getPayrollConfigDao();
        $b = $dao->getTaxBracketById($id);
        $this->throwRecordNotFoundExceptionIfNotExist($b, PayrollTaxBracket::class);

        $before = $this->serializeBracket($b);
        $body = $this->getRequestParams();

        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'taxRate')) {
            $b->setTaxRate(number_format($body->getFloat(RequestParams::PARAM_TYPE_BODY, 'taxRate'), 4, '.', ''));
        }
        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'cessRate')) {
            $b->setCessRate(number_format($body->getFloat(RequestParams::PARAM_TYPE_BODY, 'cessRate'), 4, '.', ''));
        }
        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'standardDeduction')) {
            $b->setStandardDeduction(number_format($body->getFloat(RequestParams::PARAM_TYPE_BODY, 'standardDeduction'), 2, '.', ''));
        }
        if ($body->has(RequestParams::PARAM_TYPE_BODY, 'isActive')) {
            $b->setIsActive($body->getBoolean(RequestParams::PARAM_TYPE_BODY, 'isActive'));
        }

        $saved = $dao->saveTaxBracket($b);
        $after = $this->serializeBracket($saved);
        $this->getPayrollConfigService()->recordAudit(
            'TAX_BRACKET_UPDATED',
            'PayrollTaxBracket',
            $saved->getId(),
            null,
            $this->getCurrentPayrollUser(),
            $before,
            $after
        );

        return new EndpointResourceResult(ArrayModel::class, $after);
    }

    public function getValidationRuleForUpdate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule(CommonParams::PARAMETER_ID, new Rule(Rules::POSITIVE)),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('taxRate', new Rule(Rules::ZERO_OR_POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('cessRate', new Rule(Rules::ZERO_OR_POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('standardDeduction', new Rule(Rules::ZERO_OR_POSITIVE))),
            new ParamRule('isActive', new Rule(Rules::BOOL_VAL))
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

    private function serializeBracket(PayrollTaxBracket $b): array
    {
        return [
            'id' => $b->getId(),
            'jurisdictionCode' => $b->getJurisdictionCode(),
            'financialYear' => $b->getFinancialYear(),
            'taxRegime' => $b->getTaxRegime(),
            'slabOrder' => $b->getSlabOrder(),
            'minIncome' => (float)$b->getMinIncome(),
            'maxIncome' => $b->getMaxIncome() !== null ? (float)$b->getMaxIncome() : null,
            'taxRate' => (float)$b->getTaxRate(),
            'cessRate' => (float)$b->getCessRate(),
            'rebateLimit' => (float)$b->getRebateLimit(),
            'rebateMaxAmount' => (float)$b->getRebateMaxAmount(),
            'standardDeduction' => (float)$b->getStandardDeduction(),
            'isActive' => $b->isActive(),
        ];
    }
}
