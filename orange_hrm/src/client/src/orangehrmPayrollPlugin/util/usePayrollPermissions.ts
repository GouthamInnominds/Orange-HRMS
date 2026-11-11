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

import {inject} from 'vue';

export type PayrollCapability =
  | 'canRead'
  | 'canCreate'
  | 'canUpdate'
  | 'canDelete';

export type PayrollDataGroupPermission = {
  [key in PayrollCapability]?: boolean;
};

export type PayrollPermissionMap = Record<string, PayrollDataGroupPermission>;

/**
 * Reads entity/controller permissions injected by OrangeHRM AbstractVueController
 * synchronously during Vue setup(), avoiding the Options-API-only `this.$can` mixin.
 */
export function usePayrollPermissions() {
  const permissions = inject<PayrollPermissionMap | undefined>(
    'permissions',
    undefined,
  );

  const hasPermission = (rule: string, cap: PayrollCapability): boolean =>
    Boolean(permissions?.[rule]?.[cap]);

  return {
    canRead: (...rules: string[]): boolean =>
      rules.every((rule) => hasPermission(rule, 'canRead')),
    canCreate: (...rules: string[]): boolean =>
      rules.every((rule) => hasPermission(rule, 'canCreate')),
    canUpdate: (...rules: string[]): boolean =>
      rules.every((rule) => hasPermission(rule, 'canUpdate')),
    canDelete: (...rules: string[]): boolean =>
      rules.every((rule) => hasPermission(rule, 'canDelete')),
  };
}

