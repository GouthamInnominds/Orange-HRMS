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
use OrangeHRM\Entity\PayrollEmployeeSnapshot;
use OrangeHRM\Entity\PayrollRun;
use OrangeHRM\Payroll\Api\Model\PayrollRunModel;
use OrangeHRM\Payroll\Api\Traits\PayrollEndpointTrait;
use OrangeHRM\Payroll\Dto\PayrollRunSearchFilterParams;

class PayrollRunAPI extends Endpoint implements CollectionEndpoint, ResourceEndpoint
{
    use PayrollEndpointTrait;

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/runs",
     *     tags={"Payroll/Runs"},
     *     summary="List Payroll Runs",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getAll(): EndpointResult
    {
        $fp = new PayrollRunSearchFilterParams();
        $this->setSortingAndPaginationParams($fp, 'run.id');
        $fp->setPayPeriodId($this->getRequestParams()->getIntOrNull(RequestParams::PARAM_TYPE_QUERY, 'payPeriodId'));
        $fp->setStatus($this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_QUERY, 'status'));

        $dao = $this->getPayrollApplicationService()->getRunDao();
        $runs = $dao->getRunList($fp);
        $count = $dao->getRunCount($fp);

        return new EndpointCollectionResult(
            PayrollRunModel::class,
            $runs,
            new ParameterBag([CommonParams::PARAMETER_TOTAL => $count])
        );
    }

    public function getValidationRuleForGetAll(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('payPeriodId', new Rule(Rules::POSITIVE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('status', new Rule(Rules::STRING_TYPE))),
            ...$this->getSortingAndPaginationParamsRules(PayrollRunSearchFilterParams::ALLOWED_SORT_FIELDS)
        );
    }

    /**
     * @OA\Post(
     *     path="/api/v2/payroll/runs",
     *     tags={"Payroll/Runs"},
     *     summary="Create or Get Idempotent Payroll Run for Pay Period",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function create(): EndpointResult
    {
        $payPeriodId = $this->getRequestParams()->getInt(RequestParams::PARAM_TYPE_BODY, 'payPeriodId');
        $idempotencyKey = $this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_BODY, 'idempotencyKey');
        $runType = $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, 'runType', PayrollRun::RUN_TYPE_REGULAR);

        $actor = $this->getCurrentPayrollUser();
        $run = $this->executePayrollCall(
            fn () => $this->getPayrollApplicationService()->createOrGetRun($payPeriodId, $idempotencyKey, $runType, $actor)
        );
        return new EndpointResourceResult(PayrollRunModel::class, $run);
    }

    public function getValidationRuleForCreate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule('payPeriodId', new Rule(Rules::POSITIVE)),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('idempotencyKey', new Rule(Rules::STRING_TYPE))),
            $this->getValidationDecorator()->notRequiredParamRule(
                new ParamRule('runType', new Rule(Rules::IN, [[PayrollRun::RUN_TYPE_REGULAR, PayrollRun::RUN_TYPE_ADJUSTMENT]]))
            )
        );
    }

    /**
     * @OA\Get(
     *     path="/api/v2/payroll/runs/{id}",
     *     tags={"Payroll/Runs"},
     *     summary="Get Payroll Run Details with Approvals & Exceptions",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function getOne(): EndpointResult
    {
        $id = $this->getAttributeId();
        $dao = $this->getPayrollApplicationService()->getRunDao();
        $run = $dao->getRunById($id);
        $this->throwRecordNotFoundExceptionIfNotExist($run, PayrollRun::class);

        $approvals = [];
        foreach ($dao->getApprovalsForRun($id) as $app) {
            $approvals[] = [
                'id' => $app->getId(),
                'action' => $app->getAction(),
                'actorUsername' => $app->getActorUser()->getUserName(),
                'comments' => $app->getComments(),
                'actionAt' => $app->getActionAt()->format('Y-m-d H:i:s'),
            ];
        }

        /** @var PayrollEmployeeSnapshot[] $ineligible */
        $ineligible = $this->getEntityManager()->createQuery(
            'SELECT s FROM OrangeHRM\Entity\PayrollEmployeeSnapshot s
             WHERE IDENTITY(s.payrollRun) = :runId AND s.isEligible = :elig
             ORDER BY s.id ASC'
        )->setParameter('runId', $id)->setParameter('elig', false)->execute();

        $skipped = [];
        foreach ($ineligible as $snap) {
            $skipped[] = [
                'empNumber' => $snap->getEmployee()->getEmpNumber(),
                'employeeId' => $snap->getEmployeeCode(),
                'fullName' => $snap->getFullName(),
                'reason' => $snap->getIneligibilityReason(),
            ];
        }

        return new EndpointResourceResult(
            PayrollRunModel::class,
            $run,
            new ParameterBag([
                'approvals' => $approvals,
                'ineligibleEmployees' => $skipped,
            ])
        );
    }

    public function getValidationRuleForGetOne(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule(CommonParams::PARAMETER_ID, new Rule(Rules::POSITIVE))
        );
    }

    /**
     * @OA\Put(
     *     path="/api/v2/payroll/runs/{id}",
     *     tags={"Payroll/Runs"},
     *     summary="Cancel a Non-Locked Payroll Run",
     *     @OA\Response(response="200", description="Success")
     * )
     */
    public function update(): EndpointResult
    {
        $id = $this->getAttributeId();
        $action = strtoupper($this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, 'action', 'CANCEL'));
        $reason = $this->getRequestParams()->getStringOrNull(RequestParams::PARAM_TYPE_BODY, 'reason');

        if ($action !== 'CANCEL') {
            throw new NotImplementedException('Only action CANCEL is supported on this endpoint.');
        }

        $actor = $this->getCurrentPayrollUser();
        $run = $this->executePayrollCall(
            fn () => $this->getPayrollWorkflowService()->cancelRun($id, $actor, $reason)
        );
        return new EndpointResourceResult(PayrollRunModel::class, $run);
    }

    public function getValidationRuleForUpdate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule(CommonParams::PARAMETER_ID, new Rule(Rules::POSITIVE)),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('action', new Rule(Rules::STRING_TYPE))),
            $this->getValidationDecorator()->notRequiredParamRule(new ParamRule('reason', new Rule(Rules::STRING_TYPE)))
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

