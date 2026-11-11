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

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatInr(value: number | string | null | undefined): string {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) {
    return '₹0.00';
  }
  return inrFormatter.format(num);
}

export function formatNumber(
  value: number | string | null | undefined,
  decimals = 2,
): string {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) {
    return '0.00';
  }
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export type StatusTone = 'neutral' | 'info' | 'warn' | 'success' | 'danger';

const STATUS_TONE_MAP: Record<string, StatusTone> = {
  OPEN: 'info',
  DRAFT: 'neutral',
  CALCULATED: 'info',
  COMPUTED: 'info',
  PENDING_APPROVAL: 'warn',
  ADJUSTED: 'warn',
  APPROVED: 'success',
  LOCKED: 'success',
  PAID_RECONCILED: 'success',
  PAID: 'success',
  PUBLISHED: 'success',
  RECONCILED: 'success',
  GENERATED: 'info',
  EXPORTED: 'warn',
  REJECTED: 'danger',
  REVERSED: 'danger',
  CANCELLED: 'danger',
  VOIDED: 'danger',
  FAILED: 'danger',
  CLOSED: 'neutral',
  UNPAID: 'warn',
  HALF_PAID: 'info',
  EXCESS_UNPAID: 'warn',
};

export function getStatusTone(status?: string | null): StatusTone {
  if (!status) {
    return 'neutral';
  }
  return STATUS_TONE_MAP[status.toUpperCase()] ?? 'neutral';
}

export function formatStatusLabel(status?: string | null): string {
  if (!status) {
    return '-';
  }
  return status.replace(/_/g, ' ');
}

export function extractApiError(
  err: unknown,
  fallback = 'Operation could not be completed.',
): string {
  const e = err as {
    response?: {data?: {error?: {message?: string}; message?: string}};
    message?: string;
  };
  return (
    e?.response?.data?.error?.message ||
    e?.response?.data?.message ||
    e?.message ||
    fallback
  );
}

export function getBaseUrl(): string {
  const win = window as unknown as {appGlobal?: {baseUrl?: string}};
  return win.appGlobal?.baseUrl ?? '';
}
