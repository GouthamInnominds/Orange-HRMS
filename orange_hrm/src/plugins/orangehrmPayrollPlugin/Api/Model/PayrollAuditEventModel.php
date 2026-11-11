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
use OrangeHRM\Entity\PayrollAuditEvent;

class PayrollAuditEventModel implements Normalizable
{
    private PayrollAuditEvent $event;

    public function __construct(PayrollAuditEvent $event)
    {
        $this->event = $event;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->event->getId(),
            'eventType' => $this->event->getEventType(),
            'entityType' => $this->event->getEntityType(),
            'entityId' => $this->event->getEntityId(),
            'payrollRunId' => $this->event->getPayrollRun() ? $this->event->getPayrollRun()->getId() : null,
            'empNumber' => $this->event->getEmpNumber(),
            'actorUsername' => $this->event->getActorUser() ? $this->event->getActorUser()->getUserName() : 'system',
            'before' => $this->event->getBeforeJson() ? json_decode($this->event->getBeforeJson(), true) : null,
            'after' => $this->event->getAfterJson() ? json_decode($this->event->getAfterJson(), true) : null,
            'ipAddress' => $this->event->getIpAddress(),
            'occurredAt' => $this->event->getOccurredAt()->format('Y-m-d H:i:s'),
        ];
    }
}

