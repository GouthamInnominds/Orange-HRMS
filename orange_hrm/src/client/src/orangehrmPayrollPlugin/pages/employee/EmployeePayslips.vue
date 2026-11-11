<!--
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
-->
<template>
  <edit-employee-layout :employee-id="String(empNumber)" screen="default">
    <div class="orangehrm-horizontal-padding orangehrm-vertical-padding">
      <div class="orangehrm-payroll-toolbar">
        <oxd-text tag="h6" class="orangehrm-main-title">
          Employee Salary Slips (INR)
        </oxd-text>
        <div
          v-if="$can.read('payroll_run_process')"
          style="display: flex; align-items: center; gap: 0.5rem"
        >
          <oxd-text tag="span" style="font-size: 0.8rem">
            Include Unpublished Slips
          </oxd-text>
          <oxd-switch-input
            v-model="includeDrafts"
            @update:model-value="execQuery"
          />
        </div>
      </div>
      <oxd-divider />
      <oxd-form @submit-valid="execQuery">
        <oxd-form-row>
          <oxd-grid :cols="3" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                v-model="financialYear"
                label="Financial Year"
                placeholder="e.g. 2026-27"
              />
            </oxd-grid-item>
            <oxd-grid-item
              style="display: flex; align-items: flex-end; gap: 0.5rem"
            >
              <oxd-button
                type="button"
                display-type="ghost"
                :label="$t('general.reset')"
                @click="onReset"
              />
              <oxd-button
                type="submit"
                display-type="secondary"
                :label="$t('general.search')"
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>
      </oxd-form>
    </div>

    <table-header :total="total" :loading="isLoading" />
    <div class="orangehrm-container">
      <oxd-card-table
        v-model:order="sortDefinition"
        :items="items.data"
        :headers="headers"
        :selectable="false"
        :clickable="false"
        :loading="isLoading"
        row-decorator="oxd-table-decorator-card"
      />
    </div>
    <div class="orangehrm-bottom-container">
      <oxd-pagination
        v-if="showPaginator"
        v-model:current="currentPage"
        :length="pages"
      />
    </div>

    <payslip-preview-modal
      v-if="previewSlipId"
      :slip-id="previewSlipId"
      @close="previewSlipId = null"
    />
  </edit-employee-layout>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import {OxdSwitchInput} from '@ohrm/oxd';
import {APIService} from '@/core/util/services/api.service';
import usePaginate from '@ohrm/core/util/composable/usePaginate';
import useSort from '@ohrm/core/util/composable/useSort';
import EditEmployeeLayout from '@/orangehrmPimPlugin/components/EditEmployeeLayout.vue';
import PayslipPreviewModal from '@/orangehrmPayrollPlugin/components/PayslipPreviewModal.vue';
import {
  formatInr,
  formatStatusLabel,
  getBaseUrl,
} from '@/orangehrmPayrollPlugin/util/formatInr';

export default defineComponent({
  name: 'EmployeePayslips',
  components: {
    'edit-employee-layout': EditEmployeeLayout,
    'oxd-switch-input': OxdSwitchInput,
    'payslip-preview-modal': PayslipPreviewModal,
  },
  props: {
    empNumber: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const financialYear = ref('');
    const includeDrafts = ref(false);
    const previewSlipId = ref<number | null>(null);

    const {sortDefinition, sortField, sortOrder, onSort} = useSort({
      sortDefinition: {'period.startDate': 'DESC'},
    });

    const query = computed(() => ({
      financialYear: financialYear.value || undefined,
      includeDrafts: includeDrafts.value || undefined,
      sortField: sortField.value,
      sortOrder: sortOrder.value,
    }));

    const http = new APIService(
      getBaseUrl(),
      `/api/v2/payroll/employees/${props.empNumber}/payslips`,
    );

    const {
      showPaginator,
      currentPage,
      total,
      pages,
      response,
      isLoading,
      execQuery,
    } = usePaginate(http, {
      query,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      normalizer: (data: any[]) =>
        data.map((s) => ({
          ...s,
          grossFormatted: formatInr(s.grossSalary),
          deductionFormatted: formatInr(s.totalDeduction),
          taxFormatted: formatInr(s.totalTax),
          netFormatted: formatInr(s.netSalary),
          statusText: formatStatusLabel(s.slipStatus),
        })),
    });
    onSort(execQuery);

    const onReset = () => {
      financialYear.value = '';
      execQuery();
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onPreview = (item: any) => {
      previewSlipId.value = item.id;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onDownload = (item: any) => {
      const url = `${getBaseUrl()}/payroll/slips/${
        item.id
      }/download?attachment=1`;
      window.open(url, '_blank', 'noopener');
    };

    const headers = [
      {name: 'slipNumber', title: 'Payslip #', slot: 'title', style: {flex: 2}},
      {name: 'payPeriodName', title: 'Pay Period', style: {flex: 1.5}},
      {name: 'payDate', title: 'Pay Date', style: {flex: 1.2}},
      {name: 'grossFormatted', title: 'Gross', style: {flex: 1.4}},
      {name: 'deductionFormatted', title: 'Deductions', style: {flex: 1.4}},
      {name: 'taxFormatted', title: 'TDS', style: {flex: 1.2}},
      {name: 'netFormatted', title: 'Net Pay', style: {flex: 1.4}},
      {name: 'statusText', title: 'Status', style: {flex: 1.4}},
      {
        name: 'actions',
        slot: 'action',
        title: 'Actions',
        style: {flex: 2.5},
        cellType: 'oxd-table-cell-actions',
        cellConfig: {
          preview: {
            onClick: onPreview,
            component: 'oxd-button',
            props: {
              label: 'Preview',
              displayType: 'text',
              size: 'medium',
            },
          },
          download: {
            onClick: onDownload,
            component: 'oxd-button',
            props: {
              label: 'Download',
              displayType: 'text',
              size: 'medium',
            },
          },
        },
      },
    ];

    return {
      financialYear,
      includeDrafts,
      previewSlipId,
      sortDefinition,
      showPaginator,
      currentPage,
      total,
      pages,
      items: response,
      isLoading,
      headers,
      execQuery,
      onReset,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/orangehrmPayrollPlugin/styles/payroll.scss';
</style>
