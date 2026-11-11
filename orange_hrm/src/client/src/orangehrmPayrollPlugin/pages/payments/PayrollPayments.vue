<!--
/**
 * OrangeHRM is a comprehensive Human Resource Management (HRM) System that captures
 * all the essential functionalities required for any enterprise.
 * Copyright (C) 2006 OrangeHRM Inc., http://www.orangehrm.com
 */
-->
<template>
  <div v-if="$can.create('payroll_payments')" class="orangehrm-card-container">
    <oxd-text tag="h6" class="orangehrm-main-title">
      Create Bank Disbursement Batch (Locked Runs)
    </oxd-text>
    <oxd-divider />
    <oxd-form :loading="isCreating" @submit-valid="onCreateBatch">
      <oxd-form-row>
        <oxd-grid :cols="3" class="orangehrm-full-width-grid">
          <oxd-grid-item>
            <oxd-input-field
              v-model="createForm.run"
              type="select"
              label="Locked Payroll Run"
              :options="lockedRunOptions"
              :rules="rules.required"
              required
            />
          </oxd-grid-item>
          <oxd-grid-item>
            <oxd-input-field
              v-model="createForm.paymentMode"
              type="select"
              label="Disbursement Mode"
              :options="paymentModes"
              :rules="rules.required"
              required
            />
          </oxd-grid-item>
        </oxd-grid>
      </oxd-form-row>
      <oxd-form-actions>
        <oxd-button
          type="submit"
          display-type="secondary"
          icon-name="plus"
          label="Generate Payment Batch"
        />
      </oxd-form-actions>
    </oxd-form>
  </div>

  <br v-if="$can.create('payroll_payments')" />

  <div class="orangehrm-paper-container">
    <div class="orangehrm-header-container">
      <oxd-text tag="h6" class="orangehrm-main-title">
        Payment Batches &amp; Bank Reconciliation
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

  <teleport to="#app">
    <oxd-dialog
      v-if="reconcileBatch"
      :style="{width: '90%', maxWidth: '500px'}"
      @update:show="reconcileBatch = null"
    >
      <div class="orangehrm-modal-header">
        <oxd-text type="card-title">
          Bank UTR Reconciliation — {{ reconcileBatch.batchReference }}
        </oxd-text>
      </div>
      <oxd-divider />
      <oxd-form :loading="isReconciling" @submit-valid="onSubmitReconcile">
        <oxd-form-row>
          <oxd-input-field
            v-model="reconcileForm.outcome"
            type="select"
            label="Bank Settlement Outcome"
            :options="reconcileOutcomes"
            required
          />
        </oxd-form-row>
        <oxd-form-row>
          <oxd-input-field
            v-model="reconcileForm.utrOrReason"
            :label="
              reconcileForm.outcome?.id === 'PAID'
                ? 'Bank UTR / Reference Number'
                : 'Failure / Rejection Reason'
            "
            :rules="rules.required"
            required
          />
        </oxd-form-row>
        <oxd-divider />
        <oxd-form-actions>
          <oxd-button
            type="button"
            display-type="ghost"
            :label="$t('general.cancel')"
            @click="reconcileBatch = null"
          />
          <submit-button />
        </oxd-form-actions>
      </oxd-form>
    </oxd-dialog>
  </teleport>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
} from 'vue';
import {OxdDialog} from '@ohrm/oxd';
import {APIService} from '@/core/util/services/api.service';
import usePaginate from '@ohrm/core/util/composable/usePaginate';
import useSort from '@ohrm/core/util/composable/useSort';
import {required} from '@ohrm/core/util/validation/rules';
import {
  formatInr,
  formatStatusLabel,
  getBaseUrl,
} from '@/orangehrmPayrollPlugin/util/formatInr';
import {usePayrollPermissions} from '@/orangehrmPayrollPlugin/util/usePayrollPermissions';

const PAYMENT_MODES = [
  {id: 'NEFT', label: 'NEFT Bulk Bank File'},
  {id: 'IMPS', label: 'IMPS Fast Transfer'},
  {id: 'RTGS', label: 'RTGS High Value'},
];

const RECONCILE_OUTCOMES = [
  {id: 'PAID', label: 'Mark Paid & Reconcile Claims (UTR)'},
  {id: 'FAILED', label: 'Mark Batch Failed'},
];

export default defineComponent({
  name: 'PayrollPayments',
  components: {
    'oxd-dialog': OxdDialog,
  },
  setup() {
    const vm = getCurrentInstance();
    const $toast = vm?.appContext.config.globalProperties.$toast;
    const {canUpdate} = usePayrollPermissions();
    const isCreating = ref(false);
    const isReconciling = ref(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lockedRunOptions = ref<Array<{id: number; label: string}>>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reconcileBatch = ref<any>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createForm = reactive<{run: any; paymentMode: any}>({
      run: null,
      paymentMode: PAYMENT_MODES[0],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reconcileForm = reactive<{outcome: any; utrOrReason: string}>({
      outcome: RECONCILE_OUTCOMES[0],
      utrOrReason: '',
    });

    const {sortDefinition, sortField, sortOrder, onSort} = useSort({
      sortDefinition: {'batch.id': 'DESC'},
    });

    const query = computed(() => ({
      sortField: sortField.value,
      sortOrder: sortOrder.value,
    }));

    const batchHttp = new APIService(
      getBaseUrl(),
      '/api/v2/payroll/payment-batches',
    );
    const runsHttp = new APIService(getBaseUrl(), '/api/v2/payroll/runs');

    const loadLockedRuns = () => {
      runsHttp.getAll({status: 'LOCKED', limit: 50}).then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: any[] = res.data?.data ?? [];
        lockedRunOptions.value = rows.map((r) => ({
          id: r.id,
          label: `Run #${r.id} — ${r.payPeriodName} (${formatInr(
            r.totalNetPay,
          )})`,
        }));
      });
    };

    const {
      showPaginator,
      currentPage,
      total,
      pages,
      response,
      isLoading,
      execQuery,
    } = usePaginate(batchHttp, {
      query,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      normalizer: (data: any[]) =>
        data.map((b) => ({
          ...b,
          totalFormatted: formatInr(b.totalAmount),
          statusText: formatStatusLabel(b.status),
          utrDisplay: b.utrNumber || '-',
        })),
    });
    onSort(execQuery);
    onMounted(loadLockedRuns);

    const onCreateBatch = () => {
      if (!createForm.run?.id) return;
      isCreating.value = true;
      batchHttp
        .create({
          payrollRunId: createForm.run.id,
          paymentMode: createForm.paymentMode?.id ?? 'NEFT',
        })
        .then(() => {
          $toast?.saveSuccess();
          createForm.run = null;
          loadLockedRuns();
          return execQuery();
        })
        .finally(() => {
          isCreating.value = false;
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onExportCsv = (item: any) => {
      if (!canUpdate('payroll_payments')) return;
      const exportHttp = new APIService(
        getBaseUrl(),
        `/api/v2/payroll/payment-batches/${item.id}/export`,
      );
      exportHttp.create({}).then((res) => {
        const data = res.data?.data;
        if (data?.csvContent) {
          const blob = new Blob([data.csvContent], {
            type: 'text/csv;charset=utf-8;',
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = data.filename || `${item.batchReference}.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        $toast?.success({
          title: 'Bank File Exported',
          message: `${item.batchReference} NEFT CSV downloaded.`,
        });
        execQuery();
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onOpenReconcile = (item: any) => {
      if (item.status !== 'EXPORTED') {
        $toast?.warn({
          title: 'Export Required',
          message:
            'Export the bank CSV file before confirming UTR reconciliation.',
        });
        return;
      }
      reconcileForm.outcome = RECONCILE_OUTCOMES[0];
      reconcileForm.utrOrReason = '';
      reconcileBatch.value = item;
    };

    const onSubmitReconcile = () => {
      if (!reconcileBatch.value) return;
      isReconciling.value = true;
      const recHttp = new APIService(
        getBaseUrl(),
        `/api/v2/payroll/payment-batches/${reconcileBatch.value.id}/reconcile`,
      );
      recHttp
        .create({
          succeeded: reconcileForm.outcome?.id === 'PAID',
          utrOrReason: reconcileForm.utrOrReason,
        })
        .then(() => {
          $toast?.updateSuccess();
          reconcileBatch.value = null;
          loadLockedRuns();
          return execQuery();
        })
        .finally(() => {
          isReconciling.value = false;
        });
    };

    const headers = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cellConfig: Record<string, any> = {};
      if (canUpdate('payroll_payments')) {
        cellConfig.exportCsv = {
          onClick: onExportCsv,
          component: 'oxd-button',
          props: {
            label: 'Export CSV',
            displayType: 'text',
            size: 'medium',
          },
        };
        cellConfig.reconcile = {
          onClick: onOpenReconcile,
          component: 'oxd-button',
          props: {
            label: 'Reconcile UTR',
            displayType: 'text',
            size: 'medium',
          },
        };
      }

      const cols = [
        {
          name: 'batchReference',
          title: 'Batch #',
          slot: 'title',
          style: {flex: 2},
        },
        {name: 'payPeriodName', title: 'Pay Period', style: {flex: 2}},
        {name: 'paymentMode', title: 'Mode', style: {flex: 1}},
        {name: 'recordCount', title: 'Employees', style: {flex: 1}},
        {name: 'totalFormatted', title: 'Amount (INR)', style: {flex: 2}},
        {name: 'statusText', title: 'Status', style: {flex: 1.5}},
        {name: 'utrDisplay', title: 'Bank UTR', style: {flex: 2}},
      ];

      if (canUpdate('payroll_payments')) {
        cols.push({
          name: 'actions',
          slot: 'action',
          title: 'Actions',
          style: {flex: 2.5},
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...({cellType: 'oxd-table-cell-actions', cellConfig} as any),
        });
      }
      return cols;
    });

    return {
      isCreating,
      isReconciling,
      lockedRunOptions,
      createForm,
      reconcileBatch,
      reconcileForm,
      paymentModes: PAYMENT_MODES,
      reconcileOutcomes: RECONCILE_OUTCOMES,
      sortDefinition,
      showPaginator,
      currentPage,
      total,
      pages,
      items: response,
      isLoading,
      headers,
      onCreateBatch,
      onSubmitReconcile,
      rules: {required: [required]},
    };
  },
});
</script>
