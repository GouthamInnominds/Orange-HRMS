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
  <oxd-table-filter filter-title="My Salary Slips (India INR)">
    <oxd-form @submit-valid="execQuery">
      <oxd-form-row>
        <oxd-grid :cols="3" class="orangehrm-full-width-grid">
          <oxd-grid-item>
            <oxd-input-field
              v-model="filters.financialYear"
              label="Financial Year (India FY)"
              placeholder="e.g. 2026-27"
            />
          </oxd-grid-item>
        </oxd-grid>
      </oxd-form-row>
      <oxd-divider />
      <oxd-form-actions>
        <oxd-button
          display-type="ghost"
          :label="$t('general.reset')"
          @click="onClickReset"
        />
        <oxd-button
          class="orangehrm-left-space"
          display-type="secondary"
          :label="$t('general.search')"
          type="submit"
        />
      </oxd-form-actions>
    </oxd-form>
  </oxd-table-filter>

  <br />

  <div class="orangehrm-paper-container">
    <div class="orangehrm-header-container">
      <oxd-text tag="h6" class="orangehrm-main-title">
        Published Payslips
      </oxd-text>
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
  </div>

  <payslip-preview-modal
    v-if="previewSlipId"
    :slip-id="previewSlipId"
    @close="previewSlipId = null"
  />
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import {APIService} from '@/core/util/services/api.service';
import usePaginate from '@ohrm/core/util/composable/usePaginate';
import useSort from '@ohrm/core/util/composable/useSort';
import PayslipPreviewModal from '@/orangehrmPayrollPlugin/components/PayslipPreviewModal.vue';
import {
  formatInr,
  formatStatusLabel,
  getBaseUrl,
} from '@/orangehrmPayrollPlugin/util/formatInr';

export default defineComponent({
  name: 'MySalarySlips',
  components: {
    'payslip-preview-modal': PayslipPreviewModal,
  },
  setup() {
    const filters = ref({financialYear: ''});
    const previewSlipId = ref<number | null>(null);

    const {sortDefinition, sortField, sortOrder, onSort} = useSort({
      sortDefinition: {'period.startDate': 'DESC'},
    });

    const query = computed(() => ({
      financialYear: filters.value.financialYear || undefined,
      sortField: sortField.value,
      sortOrder: sortOrder.value,
    }));

    const http = new APIService(
      getBaseUrl(),
      '/api/v2/payroll/my-salary-slips',
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
          reimbursementFormatted: formatInr(s.reimbursementAmount),
          deductionFormatted: formatInr(s.totalDeduction),
          taxFormatted: formatInr(s.totalTax),
          netFormatted: formatInr(s.netSalary),
          statusText: formatStatusLabel(s.slipStatus),
        })),
    });
    onSort(execQuery);

    const onClickReset = () => {
      filters.value.financialYear = '';
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
      {name: 'financialYear', title: 'FY', style: {flex: 1}},
      {name: 'payDate', title: 'Pay Date', style: {flex: 1.2}},
      {name: 'grossFormatted', title: 'Gross', style: {flex: 1.4}},
      {name: 'reimbursementFormatted', title: 'Claims', style: {flex: 1.2}},
      {name: 'deductionFormatted', title: 'Deductions', style: {flex: 1.3}},
      {name: 'taxFormatted', title: 'TDS Tax', style: {flex: 1.2}},
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
      filters,
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
      onClickReset,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/orangehrmPayrollPlugin/styles/payroll.scss';
</style>
