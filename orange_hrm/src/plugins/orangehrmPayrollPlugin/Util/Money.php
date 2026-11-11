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

namespace OrangeHRM\Payroll\Util;

use InvalidArgumentException;

/**
 * Immutable fixed-point Money value object scaled to 4 fractional decimal places (1 unit = 10000 scaled units).
 * Uses pure-PHP integer and big-digit arithmetic so exact financial precision is preserved without ext-bcmath.
 */
final class Money
{
    public const SCALE_DECIMALS = 4;
    public const SCALE_FACTOR = 10000;

    private int $scaledAmount;
    private string $currencyCode;

    private function __construct(int $scaledAmount, string $currencyCode = 'INR')
    {
        $normalizedCurrency = strtoupper(trim($currencyCode));
        if ($normalizedCurrency === '') {
            throw new InvalidArgumentException('Currency code cannot be empty.');
        }
        $this->scaledAmount = $scaledAmount;
        $this->currencyCode = $normalizedCurrency;
    }

    /**
     * @param string|int|float $amount
     */
    public static function of($amount, string $currencyCode = 'INR'): self
    {
        if (is_int($amount)) {
            return new self($amount * self::SCALE_FACTOR, $currencyCode);
        }
        if (is_float($amount)) {
            $str = number_format($amount, self::SCALE_DECIMALS, '.', '');
        } elseif (is_string($amount)) {
            $str = trim($amount);
        } else {
            throw new InvalidArgumentException('Unsupported money amount type.');
        }

        if (!preg_match('/^([+-])?(\d+)(?:\.(\d+))?$/', $str, $m)) {
            throw new InvalidArgumentException(sprintf('Invalid money amount "%s".', $str));
        }

        $sign = ($m[1] ?? '') === '-' ? -1 : 1;
        $whole = (int)$m[2];
        $fracRaw = $m[3] ?? '';
        $fracPadded = str_pad(substr($fracRaw, 0, self::SCALE_DECIMALS), self::SCALE_DECIMALS, '0', STR_PAD_RIGHT);
        $roundDigit = isset($fracRaw[self::SCALE_DECIMALS]) ? (int)$fracRaw[self::SCALE_DECIMALS] : 0;

        $scaled = $whole * self::SCALE_FACTOR + (int)$fracPadded;
        if ($roundDigit >= 5) {
            $scaled++;
        }

        return new self($sign * $scaled, $currencyCode);
    }

    public static function zero(string $currencyCode = 'INR'): self
    {
        return new self(0, $currencyCode);
    }

    public static function fromScaledInt(int $scaledAmount, string $currencyCode = 'INR'): self
    {
        return new self($scaledAmount, $currencyCode);
    }

    public function getScaledInt(): int
    {
        return $this->scaledAmount;
    }

    public function getCurrencyCode(): string
    {
        return $this->currencyCode;
    }

    public function add(self $other): self
    {
        $this->assertSameCurrency($other);
        return new self($this->scaledAmount + $other->scaledAmount, $this->currencyCode);
    }

    public function sub(self $other): self
    {
        $this->assertSameCurrency($other);
        return new self($this->scaledAmount - $other->scaledAmount, $this->currencyCode);
    }

    public function negate(): self
    {
        return new self(-$this->scaledAmount, $this->currencyCode);
    }

    public function abs(): self
    {
        return new self(abs($this->scaledAmount), $this->currencyCode);
    }

    /**
     * Multiplies this Money amount by a percentage (e.g., "12.00" -> 12%, "0.75" -> 0.75%) with HALF_UP rounding.
     *
     * @param string|int|float $percent
     */
    public function multiplyPercent($percent): self
    {
        $pctScaled = self::of($percent, $this->currencyCode)->scaledAmount;
        // Effective ratio = pctScaled / (100 * SCALE_FACTOR) = pctScaled / 1_000_000
        return $this->multiplyScaledRatio($pctScaled, 100 * self::SCALE_FACTOR);
    }

    /**
     * Multiplies by an integer numerator/denominator ratio with HALF_UP rounding to 4 decimal places.
     */
    public function multiplyRatio(int $numerator, int $denominator): self
    {
        return $this->multiplyScaledRatio($numerator, $denominator);
    }

    /**
     * Floors or rounds HALF_UP to $decimals (0..4) while keeping internal 4-decimal scale.
     */
    public function roundHalfUp(int $decimals = 2): self
    {
        if ($decimals < 0 || $decimals > self::SCALE_DECIMALS) {
            throw new InvalidArgumentException('Decimals must be between 0 and 4.');
        }
        $step = (int)(10 ** (self::SCALE_DECIMALS - $decimals));
        if ($step === 1) {
            return $this;
        }
        $sign = $this->scaledAmount < 0 ? -1 : 1;
        $abs = abs($this->scaledAmount);
        $half = intdiv($step, 2);
        $rounded = intdiv($abs + $half, $step) * $step;
        return new self($sign * $rounded, $this->currencyCode);
    }

    /**
     * ESIC statutory rounding: any fractional rupee above zero rounds UP to the next whole rupee.
     */
    public function ceilRupee(): self
    {
        if ($this->scaledAmount <= 0) {
            return $this->roundHalfUp(0);
        }
        $whole = intdiv($this->scaledAmount, self::SCALE_FACTOR);
        $rem = $this->scaledAmount % self::SCALE_FACTOR;
        if ($rem > 0) {
            $whole++;
        }
        return new self($whole * self::SCALE_FACTOR, $this->currencyCode);
    }

    /**
     * Standard HALF_UP rounding to nearest whole rupee.
     */
    public function roundNearestRupee(): self
    {
        return $this->roundHalfUp(0);
    }

    /**
     * Income Tax Act Section 288B rounding: rounds tax payable to nearest multiple of ₹10 (HALF_UP on ₹5).
     */
    public function roundNearestTenRupees(): self
    {
        $sign = $this->scaledAmount < 0 ? -1 : 1;
        $tenRupeesScaled = 10 * self::SCALE_FACTOR;
        $halfTenScaled = 5 * self::SCALE_FACTOR;
        $roundedTen = intdiv(abs($this->scaledAmount) + $halfTenScaled, $tenRupeesScaled) * 10;
        return new self($sign * $roundedTen * self::SCALE_FACTOR, $this->currencyCode);
    }

    public function compareTo(self $other): int
    {
        $this->assertSameCurrency($other);
        return $this->scaledAmount <=> $other->scaledAmount;
    }

    public function greaterThan(self $other): bool
    {
        return $this->compareTo($other) > 0;
    }

    public function greaterThanOrEqual(self $other): bool
    {
        return $this->compareTo($other) >= 0;
    }

    public function lessThan(self $other): bool
    {
        return $this->compareTo($other) < 0;
    }

    public function lessThanOrEqual(self $other): bool
    {
        return $this->compareTo($other) <= 0;
    }

    public function equals(self $other): bool
    {
        return $this->currencyCode === $other->currencyCode && $this->scaledAmount === $other->scaledAmount;
    }

    public function isPositive(): bool
    {
        return $this->scaledAmount > 0;
    }

    public function isZero(): bool
    {
        return $this->scaledAmount === 0;
    }

    public function isNegative(): bool
    {
        return $this->scaledAmount < 0;
    }

    public static function min(self $a, self $b): self
    {
        return $a->compareTo($b) <= 0 ? $a : $b;
    }

    public static function max(self $a, self $b): self
    {
        return $a->compareTo($b) >= 0 ? $a : $b;
    }

    /**
     * Returns canonical decimal string with 2 or 4 decimal places for database persistence & APIs.
     */
    public function toDatabaseString(int $decimals = 2): string
    {
        if ($decimals < 0 || $decimals > self::SCALE_DECIMALS) {
            throw new InvalidArgumentException('Decimals must be between 0 and 4.');
        }
        $rounded = $this->roundHalfUp($decimals);
        $sign = $rounded->scaledAmount < 0 ? '-' : '';
        $abs = abs($rounded->scaledAmount);
        $whole = intdiv($abs, self::SCALE_FACTOR);
        if ($decimals === 0) {
            return $sign . (string)$whole;
        }
        $rem = $abs % self::SCALE_FACTOR;
        $fracStr = str_pad((string)$rem, self::SCALE_DECIMALS, '0', STR_PAD_LEFT);
        return $sign . $whole . '.' . substr($fracStr, 0, $decimals);
    }

    public function toFloat(int $decimals = 2): float
    {
        return (float)$this->toDatabaseString($decimals);
    }

    /**
     * Exact overflow-safe integer product divided by positive integer denominator using HALF_UP rounding.
     */
    private function multiplyScaledRatio(int $numerator, int $denominator): self
    {
        if ($denominator === 0) {
            throw new InvalidArgumentException('Ratio denominator cannot be zero.');
        }
        if ($numerator === 0 || $this->scaledAmount === 0) {
            return self::zero($this->currencyCode);
        }

        $negCount = ($this->scaledAmount < 0 ? 1 : 0) + ($numerator < 0 ? 1 : 0) + ($denominator < 0 ? 1 : 0);
        $sign = ($negCount % 2 === 1) ? -1 : 1;
        $a = (string)abs($this->scaledAmount);
        $b = (string)abs($numerator);
        $den = abs($denominator);

        // If $a * $b safely fits within 64-bit signed PHP int (< 9e18), use fast int arithmetic.
        if (strlen($a) + strlen($b) <= 18) {
            $prod = ((int)$a) * ((int)$b);
            $q = intdiv($prod + intdiv($den, 2), $den);
            return new self($sign * $q, $this->currencyCode);
        }

        $productStr = self::mulPositiveStrings($a, $b);
        $halfStr = (string)intdiv($den, 2);
        $adjustedStr = self::addPositiveStrings($productStr, $halfStr);
        $quotientStr = self::divPositiveStringByInt($adjustedStr, $den);
        return new self($sign * (int)$quotientStr, $this->currencyCode);
    }

    private function assertSameCurrency(self $other): void
    {
        if ($this->currencyCode !== $other->currencyCode) {
            throw new InvalidArgumentException(
                sprintf('Currency mismatch: "%s" vs "%s".', $this->currencyCode, $other->currencyCode)
            );
        }
    }

    private static function mulPositiveStrings(string $a, string $b): string
    {
        $lenA = strlen($a);
        $lenB = strlen($b);
        $res = array_fill(0, $lenA + $lenB, 0);
        for ($i = $lenA - 1; $i >= 0; $i--) {
            $carry = 0;
            $da = (int)$a[$i];
            for ($j = $lenB - 1; $j >= 0; $j--) {
                $sum = $res[$i + $j + 1] + $da * (int)$b[$j] + $carry;
                $res[$i + $j + 1] = $sum % 10;
                $carry = intdiv($sum, 10);
            }
            $res[$i] += $carry;
        }
        $str = ltrim(implode('', $res), '0');
        return $str === '' ? '0' : $str;
    }

    private static function addPositiveStrings(string $a, string $b): string
    {
        $i = strlen($a) - 1;
        $j = strlen($b) - 1;
        $carry = 0;
        $out = '';
        while ($i >= 0 || $j >= 0 || $carry > 0) {
            $sum = $carry;
            if ($i >= 0) {
                $sum += (int)$a[$i--];
            }
            if ($j >= 0) {
                $sum += (int)$b[$j--];
            }
            $out = (string)($sum % 10) . $out;
            $carry = intdiv($sum, 10);
        }
        return $out === '' ? '0' : $out;
    }

    private static function divPositiveStringByInt(string $a, int $divisor): string
    {
        $len = strlen($a);
        $rem = 0;
        $out = '';
        for ($i = 0; $i < $len; $i++) {
            $cur = $rem * 10 + (int)$a[$i];
            $q = intdiv($cur, $divisor);
            $rem = $cur % $divisor;
            if ($out !== '' || $q > 0) {
                $out .= (string)$q;
            }
        }
        return $out === '' ? '0' : $out;
    }
}
