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

use OrangeHRM\Core\Traits\ServiceContainerTrait;
use OrangeHRM\Framework\Http\Request;
use OrangeHRM\Framework\PluginConfigurationInterface;
use OrangeHRM\Framework\Services;
use OrangeHRM\Payroll\Service\ClaimSettlementAdapter;
use OrangeHRM\Payroll\Service\IndianStatutoryCalculator;
use OrangeHRM\Payroll\Service\LeavePayrollAdapter;
use OrangeHRM\Payroll\Service\PayrollApplicationService;
use OrangeHRM\Payroll\Service\PayrollCalculationService;
use OrangeHRM\Payroll\Service\PayrollConfigService;
use OrangeHRM\Payroll\Service\PayrollEmployeeSnapshotService;
use OrangeHRM\Payroll\Service\PayrollPaymentService;
use OrangeHRM\Payroll\Service\PayrollSlipService;
use OrangeHRM\Payroll\Service\PayrollWorkflowService;
use OrangeHRM\Payroll\Service\TimeAttendancePayrollAdapter;

class PayrollPluginConfiguration implements PluginConfigurationInterface
{
    use ServiceContainerTrait;

    /**
     * @inheritDoc
     */
    public function initialize(Request $request): void
    {
        $container = $this->getContainer();

        $container->register(Services::PAYROLL_CONFIG_SERVICE, PayrollConfigService::class);
        $container->register(Services::PAYROLL_SNAPSHOT_SERVICE, PayrollEmployeeSnapshotService::class);
        $container->register(Services::PAYROLL_LEAVE_ADAPTER, LeavePayrollAdapter::class);
        $container->register(Services::PAYROLL_TIME_ADAPTER, TimeAttendancePayrollAdapter::class);
        $container->register(Services::PAYROLL_CLAIM_ADAPTER, ClaimSettlementAdapter::class);
        $container->register(Services::PAYROLL_STATUTORY_CALCULATOR, IndianStatutoryCalculator::class);
        $container->register(Services::PAYROLL_CALCULATION_SERVICE, PayrollCalculationService::class);
        $container->register(Services::PAYROLL_WORKFLOW_SERVICE, PayrollWorkflowService::class);
        $container->register(Services::PAYROLL_APPLICATION_SERVICE, PayrollApplicationService::class);
        $container->register(Services::PAYROLL_PAYMENT_SERVICE, PayrollPaymentService::class);
        $container->register(Services::PAYROLL_SLIP_SERVICE, PayrollSlipService::class);
    }
}
