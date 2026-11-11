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

namespace OrangeHRM\Payroll\Api\Model;

use OrangeHRM\Core\Api\V2\Serializer\Normalizable;
use OrangeHRM\Entity\PayrollConfig;

class PayrollConfigModel implements Normalizable
{
    private PayrollConfig $config;

    public function __construct(PayrollConfig $config)
    {
        $this->config = $config;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->config->getId(),
            'jurisdictionCode' => $this->config->getJurisdictionCode(),
            'defaultCurrencyId' => $this->config->getDefaultCurrency()->getId(),
            'payFrequency' => $this->config->getPayFrequency(),
            'lwpDivisorMode' => $this->config->getLwpDivisorMode(),
            'timeAttendanceSourceMode' => $this->config->getTimeAttendanceSourceMode(),
            'standardShiftHours' => (float)$this->config->getStandardShiftHours(),
            'overtimeMultiplier' => (float)$this->config->getOvertimeMultiplier(),
            'overtimeEligibleMaxBasic' => $this->config->getOvertimeEligibleMaxBasic() !== null ? (float)$this->config->getOvertimeEligibleMaxBasic() : null,
            'epfWageCeiling' => (float)$this->config->getEpfWageCeiling(),
            'epfCapAtCeiling' => $this->config->isEpfCapAtCeiling(),
            'esicGrossCeiling' => (float)$this->config->getEsicGrossCeiling(),
            'defaultPtStateCode' => $this->config->getDefaultPtStateCode(),
            'defaultTaxRegime' => $this->config->getDefaultTaxRegime(),
            'requireMakerCheckerApproval' => $this->config->isRequireMakerCheckerApproval(),
            'updatedAt' => $this->config->getUpdatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}

