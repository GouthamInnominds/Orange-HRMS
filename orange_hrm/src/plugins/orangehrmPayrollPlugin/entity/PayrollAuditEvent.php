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

namespace OrangeHRM\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;

/**
 * Append-only immutable payroll audit trail event.
 *
 * @ORM\Table(name="ohrm_payroll_audit_event")
 * @ORM\Entity
 */
class PayrollAuditEvent
{
    /**
     * @var int
     * @ORM\Column(name="id", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;

    /**
     * @var string
     * @ORM\Column(name="event_type", type="string", length=64)
     */
    private string $eventType;

    /**
     * @var string
     * @ORM\Column(name="entity_type", type="string", length=64)
     */
    private string $entityType;

    /**
     * @var int|null
     * @ORM\Column(name="entity_id", type="integer", nullable=true)
     */
    private ?int $entityId = null;

    /**
     * @var PayrollRun|null
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\PayrollRun")
     * @ORM\JoinColumn(name="payroll_run_id", referencedColumnName="id", nullable=true)
     */
    private ?PayrollRun $payrollRun = null;

    /**
     * @var int|null
     * @ORM\Column(name="emp_number", type="integer", nullable=true)
     */
    private ?int $empNumber = null;

    /**
     * @var User|null
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\User")
     * @ORM\JoinColumn(name="actor_user_id", referencedColumnName="id", nullable=true)
     */
    private ?User $actorUser = null;

    /**
     * @var string|null
     * @ORM\Column(name="before_json", type="text", nullable=true)
     */
    private ?string $beforeJson = null;

    /**
     * @var string|null
     * @ORM\Column(name="after_json", type="text", nullable=true)
     */
    private ?string $afterJson = null;

    /**
     * @var string|null
     * @ORM\Column(name="ip_address", type="string", length=45, nullable=true)
     */
    private ?string $ipAddress = null;

    /**
     * @var DateTime
     * @ORM\Column(name="occurred_at", type="datetime")
     */
    private DateTime $occurredAt;

    public function __construct()
    {
        $this->occurredAt = new DateTime();
    }

    public function getId(): int { return $this->id; }
    public function getEventType(): string { return $this->eventType; }
    public function setEventType(string $eventType): void { $this->eventType = $eventType; }
    public function getEntityType(): string { return $this->entityType; }
    public function setEntityType(string $entityType): void { $this->entityType = $entityType; }
    public function getEntityId(): ?int { return $this->entityId; }
    public function setEntityId(?int $entityId): void { $this->entityId = $entityId; }
    public function getPayrollRun(): ?PayrollRun { return $this->payrollRun; }
    public function setPayrollRun(?PayrollRun $payrollRun): void { $this->payrollRun = $payrollRun; }
    public function getEmpNumber(): ?int { return $this->empNumber; }
    public function setEmpNumber(?int $empNumber): void { $this->empNumber = $empNumber; }
    public function getActorUser(): ?User { return $this->actorUser; }
    public function setActorUser(?User $actorUser): void { $this->actorUser = $actorUser; }
    public function getBeforeJson(): ?string { return $this->beforeJson; }
    public function setBeforeJson(?string $beforeJson): void { $this->beforeJson = $beforeJson; }
    public function getAfterJson(): ?string { return $this->afterJson; }
    public function setAfterJson(?string $afterJson): void { $this->afterJson = $afterJson; }
    public function getIpAddress(): ?string { return $this->ipAddress; }
    public function setIpAddress(?string $ipAddress): void { $this->ipAddress = $ipAddress; }
    public function getOccurredAt(): DateTime { return $this->occurredAt; }
    public function setOccurredAt(DateTime $occurredAt): void { $this->occurredAt = $occurredAt; }
}

