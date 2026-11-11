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

namespace OrangeHRM\Payroll\Controller;

use OrangeHRM\Core\Vue\Component;
use OrangeHRM\Core\Vue\Prop;
use OrangeHRM\Framework\Http\Request;

class PayrollProcessingController extends BasePayrollController
{
    public function preRender(Request $request): void
    {
        $component = new Component('payroll-processing');
        $runId = $request->query->getInt('runId', 0);
        if ($runId > 0) {
            $component->addProp(new Prop('initial-run-id', Prop::TYPE_NUMBER, $runId));
        }
        $this->setComponent($component);
        $this->setPermissionsForController([
            'payroll_pay_periods',
            'payroll_run_process',
            'payroll_run_approve',
            'payroll_run_lock',
            'payroll_payments',
            'apiv2_payroll_run_calculate',
            'apiv2_payroll_run_submit',
            'apiv2_payroll_run_approve',
            'apiv2_payroll_run_lock',
            'apiv2_payroll_adjustment',
        ]);
    }
}
