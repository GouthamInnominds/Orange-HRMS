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
use OrangeHRM\Entity\SalarySlip;
use OrangeHRM\Payroll\Api\Model\SalarySlipModel;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;
use OrangeHRM\Payroll\Dto\SalarySlipSearchFilterParams;

class SalarySlipAPI extends Endpoint implements CollectionEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/my-salary-slips",
     *     tags={"Payroll/Salary Slips"},
     *     summary="List Logged-in Employee's Published Salary Slips",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getAll(): EndpointResult
    {
        $empNumber = $this->getAuthUser()->getEmpNumber();
        if ($empNumber === null) {
            return new EndpointCollectionResult(
                SalarySlipModel::class,
                [],
                new ParameterBag([CommonParams::PARAMETER_TOTAL => 0])
            );
        }

        $fp = new SalarySlipSearchFilterParams();
        $this->setSortingAndPaginationParams($fp, 'period.startDate');
        $fp->setEmpNumber($empNumber);
        // Self-service strictly returns PUBLISHED payslips (never draft previews or voided slips)
        $fp->setSlipStatus(SalarySlip::STATUS_PUBLISHED);
        $fp->setFinancialYear($this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_QUERY, 'financialYear'));

        $dao = $this->getPayrollSlipService()->getRunDao();
        $slips = $dao->getSalarySlipList($fp);
        $count = $dao->getSalarySlipCount($fp);

        return new EndpointCollectionResult(
            SalarySlipModel::class,
            $slips,
            new ParameterBag([CommonParams::PARAMETER_TOTAL => $count])
        );
    }

    public function getValidationRuleForGetAll(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('financialYear', new Rule(Rules::STRING_TYPE))),
            ...$this->getSortingAndPaginationParamsRules(SalarySlipSearchFilterParams::ALLOWED_SORT_FIELDS)
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
