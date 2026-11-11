<!--
/**
 * OrangeHRM is a comprehensive Human Resource Management (HRM) System that captures
 * all the essential functionalities required for any enterprise.
 * Copyright (C) 2006 OrangeHRM Inc., http://www.orangehrm.com
 */
-->
<template>
  <oxd-table-filter filter-title="Pay Periods (India FY)">
    <oxd-form @submit-valid="execQuery">
      <oxd-form-row>
        <oxd-grid :cols="3" class="orangehrm-full-width-grid">
          <oxd-grid-item>
            <oxd-input-field
              v-model="filters.financialYear"
              label="Financial Year"
              placeholder="e.g. 2026-27"
            />
          </oxd-grid-item>
          <oxd-grid-item>
            <oxd-input-field
              v-model="filters.status"
              type="select"
              :label="$t('general.status')"
              :options="statusOptions"
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
    <div
      v-if="$can.create('payroll_pay_periods')"
      class="orangehrm-header-container"
    >
      <oxd-button
        :label="$t('general.add')"
        icon-name="plus"
        display-type="secondary"
        @click="onClickAdd"
      />
    </div>
    <table-header
      :total="total"
      :loading="isLoading"
      :selected="checkedItems.length"
      @delete="onClickDeleteSelected"
    />
    <div class="orangehrm-container">
      <oxd-card-table
        v-model:selected="checkedItems"
        v-model:order="sortDefinition"
        :items="items.data"
        :headers="headers"
        :selectable="$can.delete('payroll_pay_periods')"
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

  <pay-period-modal
    v-if="showPeriodModal"
    :period="editingPeriod"
    @close="showPeriodModal = false"
    @saved="execQuery"
  />
  <delete-confirmation ref="deleteDialog" />
</template>

<script lang="ts">
import {computed, defineComponent, getCurrentInstance, ref} from 'vue';
import {APIService} from '@/core/util/services/api.service';
import usePaginate from '@ohrm/core/util/composable/usePaginate';
import useSort from '@ohrm/core/util/composable/useSort';
import DeleteConfirmationDialog from '@ohrm/components/dialogs/DeleteConfirmationDialog.vue';
import PayPeriodModal from '@/orangehrmPayrollPlugin/components/PayPeriodModal.vue';
import {
  formatStatusLabel,
  getBaseUrl,
} from '@/orangehrmPayrollPlugin/util/formatInr';
import {usePayrollPermissions} from '@/orangehrmPayrollPlugin/util/usePayrollPermissions';
import {navigate} from '@ohrm/core/util/helper/navigation';

const STATUS_OPTIONS = [
  {id: 'OPEN', label: 'Open'},
  {id: 'LOCKED', label: 'Locked'},
  {id: 'CLOSED', label: 'Closed'},
];

export default defineComponent({
  name: 'PayPeriods',
  components: {
    'delete-confirmation': DeleteConfirmationDialog,
    'pay-period-modal': PayPeriodModal,
  },
  setup() {
    const vm = getCurrentInstance();
    const $toast = vm?.appContext.config.globalProperties.$toast;
    const {canCreate, canUpdate, canDelete} = usePayrollPermissions();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters = ref<{financialYear: string; status: any}>({
      financialYear: '',
      status: null,
    });
    const checkedItems = ref<number[]>([]);
    const showPeriodModal = ref(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editingPeriod = ref<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deleteDialog = ref<any>(null);

    const {sortDefinition, sortField, sortOrder, onSort} = useSort({
      sortDefinition: {'period.startDate': 'DESC'},
    });

    const query = computed(() => ({
      financialYear: filters.value.financialYear || null,
      status: filters.value.status?.id ?? null,
      sortField: sortField.value,
      sortOrder: sortOrder.value,
    }));

    const http = new APIService(getBaseUrl(), '/api/v2/payroll/pay-periods');
    const runHttp = new APIService(getBaseUrl(), '/api/v2/payroll/runs');

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
        data.map((item) => ({
          ...item,
          periodWindow: `${item.startDate} to ${item.endDate}`,
          statusText: formatStatusLabel(item.status),
        })),
    });
    onSort(execQuery);

    const onClickReset = () => {
      filters.value = {financialYear: '', status: null};
      execQuery();
    };

    const onClickAdd = () => {
      editingPeriod.value = null;
      showPeriodModal.value = true;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onClickEdit = (item: any) => {
      editingPeriod.value = item;
      showPeriodModal.value = true;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onClickProcess = (item: any) => {
      if (canCreate('payroll_run_process')) {
        runHttp
          .create({payPeriodId: item.id, runType: 'REGULAR'})
          .then((res) => {
            const runId = res.data?.data?.id;
            navigate(
              '/payroll/viewPayrollProcessing',
              {},
              runId ? {runId} : {},
            );
          });
      } else {
        navigate('/payroll/viewPayrollProcessing');
      }
    };

    const deleteIds = (ids: number[]) => {
      if (!ids.length) return;
      isLoading.value = true;
      http
        .deleteAll({ids})
        .then(() => {
          $toast?.deleteSuccess();
          checkedItems.value = [];
          return execQuery();
        })
        .finally(() => {
          isLoading.value = false;
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onClickDelete = (item: any) => {
      deleteDialog.value?.showDialog().then((conf: string) => {
        if (conf === 'ok') {
          deleteIds([item.id]);
        }
      });
    };

    const onClickDeleteSelected = () => {
      const ids = checkedItems.value
        .map((idx) => response.value?.data?.[idx]?.id)
        .filter(Boolean);
      if (!ids.length) return;
      deleteDialog.value?.showDialog().then((conf: string) => {
        if (conf === 'ok') {
          deleteIds(ids);
        }
      });
    };

    const headers = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cellConfig: Record<string, any> = {
        process: {
          onClick: onClickProcess,
          component: 'oxd-button',
          props: {
            label: 'Process Run',
            displayType: 'text',
            size: 'medium',
          },
        },
      };
      if (canUpdate('payroll_pay_periods')) {
        cellConfig.edit = {
          onClick: onClickEdit,
          props: {name: 'pencil-fill'},
        };
      }
      if (canDelete('payroll_pay_periods')) {
        cellConfig.delete = {
          onClick: onClickDelete,
          props: {name: 'trash'},
        };
      }

      return [
        {name: 'name', title: 'Pay Period', slot: 'title', style: {flex: 2}},
        {
          name: 'financialYear',
          title: 'Financial Year',
          sortField: 'period.financialYear',
          style: {flex: 1.2},
        },
        {name: 'periodWindow', title: 'Period Dates', style: {flex: 2}},
        {name: 'payDate', title: 'Pay Date', style: {flex: 1.1}},
        {
          name: 'standardWorkingDays',
          title: 'Work Days',
          style: {flex: 1},
        },
        {
          name: 'statusText',
          title: 'Status',
          sortField: 'period.status',
          style: {flex: 1.2},
        },
        {
          name: 'actions',
          slot: 'action',
          title: 'Actions',
          style: {flex: 2.5},
          cellType: 'oxd-table-cell-actions',
          cellConfig,
        },
      ];
    });

    return {
      filters,
      statusOptions: STATUS_OPTIONS,
      checkedItems,
      showPeriodModal,
      editingPeriod,
      deleteDialog,
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
      onClickAdd,
      onClickDeleteSelected,
    };
  },
});
</script>
