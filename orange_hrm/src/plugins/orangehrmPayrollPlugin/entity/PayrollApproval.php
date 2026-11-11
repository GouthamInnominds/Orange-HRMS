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
 * @ORM\Table(name="ohrm_payroll_approval")
 * @ORM\Entity
 */
class PayrollApproval
{
    public const ACTION_SUBMITTED = 'SUBMITTED';
    public const ACTION_APPROVED = 'APPROVED';
    public const ACTION_REJECTED = 'REJECTED';
    public const ACTION_LOCKED = 'LOCKED';
    public const ACTION_REVERSED = 'REVERSED';
    public const ACTION_OVERRIDDEN = 'OVERRIDDEN';

    /**
     * @var int
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;

    /**
     * @var PayrollRun
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\PayrollRun")
     * @ORM\JoinColumn(name="payroll_run_id", referencedColumnName="id", nullable=false)
     */
    private PayrollRun $payrollRun;

    /**
     * @var string
     * @ORM\Column(name="action", type="string", length=32)
     */
    private string $action;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="OrangeHRM\Entity\User")
     * @ORM\JoinColumn(name="actor_user_id", referencedColumnName="id", nullable=false)
     */
    private User $actorUser;

    /**
     * @var string|null
     * @ORM\Column(name="comments", type="string", length=500, nullable=true)
     */
    private ?string $comments = null;

    /**
     * @var DateTime
     * @ORM\Column(name="action_at", type="datetime")
     */
    private DateTime $actionAt;

    public function __construct()
    {
        $this->actionAt = new DateTime();
    }

    public function getId(): int { return $this->id; }
    public function getPayrollRun(): PayrollRun { return $this->payrollRun; }
    public function setPayrollRun(PayrollRun $payrollRun): void { $this->payrollRun = $payrollRun; }
    public function getAction(): string { return $this->action; }
    public function setAction(string $action): void { $this->action = $action; }
    public function getActorUser(): User { return $this->actorUser; }
    public function setActorUser(User $actorUser): void { $this->actorUser = $actorUser; }
    public function getComments(): ?string { return $this->comments; }
    public function setComments(?string $comments): void { $this->comments = $comments; }
    public function getActionAt(): DateTime { return $this->actionAt; }
    public function setActionAt(DateTime $actionAt): void { $this->actionAt = $actionAt; }
}

