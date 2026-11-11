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

namespace OrangeHRM\Payroll\Api\Traits;

use OrangeHRM\Core\Api\V2\Exception\BadRequestException;
use OrangeHRM\Core\Api\V2\Exception\ForbiddenException;
use OrangeHRM\Core\Api\V2\Exception\RecordNotFoundException;
use OrangeHRM\Core\Traits\Auth\AuthUserTrait;
use OrangeHRM\Core\Traits\ORM\EntityManagerHelperTrait;
use OrangeHRM\Core\Traits\ServiceContainerTrait;
use OrangeHRM\Core\Traits\UserRoleManagerTrait;
use OrangeHRM\Entity\User;
use OrangeHRM\Framework\Services;
use OrangeHRM\Payroll\Exception\PayrollException;
use OrangeHRM\Payroll\Service\PayrollApplicationService;
use OrangeHRM\Payroll\Service\PayrollCalculationService;
use OrangeHRM\Payroll\Service\PayrollConfigService;
use OrangeHRM\Payroll\Service\PayrollPaymentService;
use OrangeHRM\Payroll\Service\PayrollSlipService;
use OrangeHRM\Payroll\Service\PayrollWorkflowService;

trait PayrollEndpointTrait
{
    use AuthUserTrait;
    use EntityManagerHelperTrait;
    use ServiceContainerTrait;
    use UserRoleManagerTrait;

    protected function getPayrollApplicationService(): PayrollApplicationService
    {
        return $this->getContainer()->get(Services::PAYROLL_APPLICATION_SERVICE);
    }

    protected function getPayrollCalculationService(): PayrollCalculationService
    {
        return $this->getContainer()->get(Services::PAYROLL_CALCULATION_SERVICE);
    }

    protected function getPayrollWorkflowService(): PayrollWorkflowService
    {
        return $this->getContainer()->get(Services::PAYROLL_WORKFLOW_SERVICE);
    }

    protected function getPayrollPaymentService(): PayrollPaymentService
    {
        return $this->getContainer()->get(Services::PAYROLL_PAYMENT_SERVICE);
    }

    protected function getPayrollSlipService(): PayrollSlipService
    {
        return $this->getContainer()->get(Services::PAYROLL_SLIP_SERVICE);
    }

    protected function getPayrollConfigService(): PayrollConfigService
    {
        return $this->getContainer()->get(Services::PAYROLL_CONFIG_SERVICE);
    }

    protected function getCurrentPayrollUser(): User
    {
        $userId = $this->getAuthUser()->getUserId();
        /** @var User|null $user */
        $user = $this->getEntityManager()->getRepository(User::class)->find($userId);
        if ($user === null) {
            throw new ForbiddenException('Authenticated user record not found.');
        }
        return $user;
    }

    protected function canManageAllPayroll(): bool
    {
        $perms = $this->getUserRoleManager()->getDataGroupPermissions('apiv2_payroll_run', [], [], false);
        return $perms->canRead();
    }

    protected function assertEmployeePayrollAccess(int $empNumber): void
    {
        if ($this->canManageAllPayroll()) {
            return;
        }
        $authEmpNumber = $this->getAuthUser()->getEmpNumber();
        if ($authEmpNumber === null || $authEmpNumber !== $empNumber) {
            throw new ForbiddenException('Access denied: you may only access your own payroll records.');
        }
    }

    /**
     * Maps domain PayrollException codes cleanly to OrangeHRM REST V2 HTTP exceptions.
     *
     * @template T
     * @param callable():T $fn
     * @return T
     */
    protected function executePayrollCall(callable $fn)
    {
        try {
            return $fn();
        } catch (PayrollException $e) {
            if ($e->getCode() === 403 || $e->getErrorCode() === PayrollException::CODE_SOD_VIOLATION || $e->getErrorCode() === PayrollException::CODE_IDOR_FORBIDDEN) {
                throw new ForbiddenException($e->getMessage(), 403, $e);
            }
            if ($e->getCode() === 404 || $e->getErrorCode() === PayrollException::CODE_NOT_FOUND) {
                throw new RecordNotFoundException($e->getMessage(), 404, $e);
            }
            throw new BadRequestException($e->getMessage(), $e->getCode() ?: 400, $e);
        }
    }
}

