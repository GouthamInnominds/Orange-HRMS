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
use OrangeHRM\Core\Api\V2\Model\ArrayModel;
use OrangeHRM\Core\Api\V2\ResourceEndpoint;
use OrangeHRM\Core\Api\V2\Validator\ParamRule;
use OrangeHRM\Core\Api\V2\Validator\ParamRuleCollection;
use OrangeHRM\Core\Api\V2\Validator\Rule;
use OrangeHRM\Core\Api\V2\Validator\Rules;
use OrangeHRM\Payroll\Api\Model\PayrollRecordModel;
use OrangeHRM\Payroll\Api\Model\SalarySlipModel;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;
use OrangeHRM\Payroll\Service\PayrollCalculationService;

class SalarySlipDocumentAPI extends Endpoint implements ResourceEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/slips/{id}",
     *     tags={"Payroll/Salary Slips"},
     *     summary="Get Single Salary Slip Breakdown & HTML Preview (IDOR Protected)",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getOne(): EndpointResult
    {
        $id = $this->getAttributeId();
        $actor = $this->getCurrentPayrollUser();
        $canManage = $this->canManageAllPayroll();

        $slip = $this->executePayrollCall(
            fn () => $this->getPayrollSlipService()->getSlipWithAccessCheck($id, $actor, $canManage, true)
        );

        $record = $slip->getPayrollRecord();
        $html = $slip->getHtmlSnapshot();
        if (($html === null || trim($html) === '') && $record->getSnapshot() !== null) {
            $html = PayrollCalculationService::renderHtmlPayslip($record, $record->getSnapshot(), $slip->getSlipNumber());
        }

        $data = (new SalarySlipModel($slip))->toArray();
        $data['htmlSnapshot'] = $html;
        $data['downloadUrl'] = '/payroll/slips/' . $slip->getId() . '/download';
        $data['record'] = (new PayrollRecordModel($record))->toArray();

        return new EndpointResourceResult(ArrayModel::class, $data);
    }

    public function getValidationRuleForGetOne(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule(CommonParams::PARAMETER_ID, new Rule(Rules::POSITIVE))
        );
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

