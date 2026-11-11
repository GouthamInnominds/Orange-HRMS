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

namespace OrangeHRM\Payroll\Exception;

use Exception;

class PayrollException extends Exception
{
    public const CODE_INVALID_STATE_TRANSITION = 'PAYROLL_INVALID_STATE_TRANSITION';
    public const CODE_PERIOD_OVERLAP = 'PAYROLL_PERIOD_OVERLAP';
    public const CODE_PREREQUISITE_BLOCKED = 'PAYROLL_PREREQUISITE_BLOCKED';
    public const CODE_SOD_VIOLATION = 'PAYROLL_SOD_VIOLATION';
    public const CODE_NEGATIVE_NET_PAY = 'PAYROLL_NEGATIVE_NET_PAY';
    public const CODE_CLAIM_ALREADY_LOCKED = 'PAYROLL_CLAIM_ALREADY_LOCKED';
    public const CODE_IDOR_FORBIDDEN = 'PAYROLL_IDOR_FORBIDDEN';
    public const CODE_NOT_FOUND = 'PAYROLL_NOT_FOUND';
    public const CODE_IMMUTABLE_RECORD = 'PAYROLL_IMMUTABLE_RECORD';

    private string $errorCode;
    private array $context;

    public function __construct(string $message, string $errorCode = 'PAYROLL_ERROR', array $context = [], int $httpCode = 400)
    {
        parent::__construct($message, $httpCode);
        $this->errorCode = $errorCode;
        $this->context = $context;
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    public function getContext(): array
    {
        return $this->context;
    }

    public static function invalidStateTransition(string $from, string $to): self
    {
        return new self(
            sprintf('Invalid payroll state transition from "%s" to "%s".', $from, $to),
            self::CODE_INVALID_STATE_TRANSITION,
            ['from' => $from, 'to' => $to],
            409
        );
    }

    public static function periodOverlap(string $startDate, string $endDate): self
    {
        return new self(
            sprintf('Pay period [%s to %s] overlaps with an existing pay period.', $startDate, $endDate),
            self::CODE_PERIOD_OVERLAP,
            ['startDate' => $startDate, 'endDate' => $endDate],
            409
        );
    }

    public static function sodViolation(string $action): self
    {
        return new self(
            sprintf('Segregation of duties violation: preparer cannot self-%s the same payroll run.', $action),
            self::CODE_SOD_VIOLATION,
            ['action' => $action],
            403
        );
    }

    public static function prerequisiteBlocked(string $reason, array $details = []): self
    {
        return new self($reason, self::CODE_PREREQUISITE_BLOCKED, $details, 422);
    }

    public static function negativeNetPay(int $empNumber, string $netAmount): self
    {
        return new self(
            sprintf('Employee #%d calculated net salary (%s) is negative and cannot proceed without override/recovery carry-forward.', $empNumber, $netAmount),
            self::CODE_NEGATIVE_NET_PAY,
            ['empNumber' => $empNumber, 'netAmount' => $netAmount],
            422
        );
    }

    public static function claimAlreadyLocked(int $claimRequestId): self
    {
        return new self(
            sprintf('Claim request #%d is already reserved or settled by another payroll run.', $claimRequestId),
            self::CODE_CLAIM_ALREADY_LOCKED,
            ['claimRequestId' => $claimRequestId],
            409
        );
    }

    public static function idorForbidden(string $message = 'Access denied to this payroll resource.'): self
    {
        return new self($message, self::CODE_IDOR_FORBIDDEN, [], 403);
    }
}
