<!--
/**
 * OrangeHRM is a comprehensive Human Resource Management (HRM) System that captures
 * all the essential functionalities required for any enterprise.
 * Copyright (C) 2006 OrangeHRM Inc., http://www.orangehrm.com
 */
-->
<template>
  <teleport to="#app">
    <oxd-dialog
      :style="{width: '92%', maxWidth: '720px'}"
      @update:show="onClose"
    >
      <div class="orangehrm-modal-header">
        <oxd-text type="card-title">
          Payroll Record Breakdown
          <span v-if="record"> — {{ record.employeeName }}</span>
        </oxd-text>
      </div>
      <oxd-divider />

      <div v-if="isLoading" class="orangehrm-dialog-vertical-padding">
        <oxd-text tag="p">Loading payroll record...</oxd-text>
      </div>

      <div v-else-if="record">
        <div class="orangehrm-payroll-toolbar">
          <oxd-text type="subtitle-2">
            Emp ID: {{ record.employeeId }} · Bank:
            {{ record.maskedBankAccount || 'Not set' }} · Regime:
            {{ record.taxRegime }} ({{ record.ptStateCode }})
          </oxd-text>
          <payroll-status-badge :status="record.status" />
        </div>

        <div class="orangehrm-payroll-breakdown-grid">
          <div class="orangehrm-payroll-breakdown-panel">
            <oxd-text tag="h6" class="orangehrm-sub-title">
              Component Breakdown
            </oxd-text>
            <div
              v-for="item in record.items"
              :key="item.id"
              class="orangehrm-payroll-breakdown-row"
            >
              <span>
                {{ item.componentName }}
                <small v-if="item.sourceModule"
                  >({{ item.sourceModule }})</small
                >
              </span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(item.amount) }}
              </span>
            </div>
          </div>

          <div class="orangehrm-payroll-breakdown-panel">
            <oxd-text tag="h6" class="orangehrm-sub-title">
              Totals Summary
            </oxd-text>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Payable / Working Days</span>
              <span class="orangehrm-payroll-mono">
                {{ record.payableDays }} / {{ record.workingDays }} (LWP:
                {{ record.lwpDays }})
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Overtime Hours</span>
              <span class="orangehrm-payroll-mono">{{
                record.overtimeHours
              }}</span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Gross Salary</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(record.grossSalary) }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Claim Reimbursements</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(record.reimbursementAmount) }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Total Deductions</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(record.totalDeduction) }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Total Tax (TDS + Cess)</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(record.totalTax) }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <strong>Net Payable (INR)</strong>
              <strong class="orangehrm-payroll-mono">
                {{ formatInr(record.netSalary) }}
              </strong>
            </div>
          </div>
        </div>

        <oxd-form
          v-if="canAdjust"
          :loading="isSaving"
          style="margin-top: 1rem"
          @submit-valid="onSaveAdjustment"
        >
          <oxd-divider />
          <oxd-text tag="h6" class="orangehrm-sub-title">
            Manual Adjustment Override (BR_PAY_002)
          </oxd-text>
          <oxd-form-row>
            <oxd-grid :cols="2" class="orangehrm-full-width-grid">
              <oxd-grid-item>
                <oxd-input-field
                  v-model="adjustmentAmount"
                  label="Adjustment Amount (INR, +/-)"
                  :rules="rules.amount"
                  required
                />
              </oxd-grid-item>
              <oxd-grid-item>
                <oxd-input-field
                  v-model="adjustmentReason"
                  label="Adjustment Reason"
                  :rules="rules.reason"
                  required
                />
              </oxd-grid-item>
            </oxd-grid>
          </oxd-form-row>
          <oxd-form-actions>
            <oxd-button
              type="button"
              display-type="ghost"
              :label="$t('general.close')"
              @click="onClose"
            />
            <submit-button />
          </oxd-form-actions>
        </oxd-form>

        <oxd-form-actions v-else style="margin-top: 1rem">
          <oxd-button
            type="button"
            display-type="ghost"
            :label="$t('general.close')"
            @click="onClose"
          />
        </oxd-form-actions>
      </div>
    </oxd-dialog>
  </teleport>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
} from 'vue';
import {OxdDialog} from '@ohrm/oxd';
import {APIService} from '@/core/util/services/api.service';
import {
  required,
  shouldNotExceedCharLength,
} from '@ohrm/core/util/validation/rules';
import PayrollStatusBadge from './PayrollStatusBadge.vue';
import {formatInr, getBaseUrl} from '../util/formatInr';

export default defineComponent({
  name: 'RecordAdjustmentModal',
  components: {
    'oxd-dialog': OxdDialog,
    'payroll-status-badge': PayrollStatusBadge,
  },
  props: {
    recordId: {
      type: Number,
      required: true,
    },
    allowAdjust: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'updated'],
  setup(props, {emit}) {
    const vm = getCurrentInstance();
    const $toast = vm?.appContext.config.globalProperties.$toast;
    const isLoading = ref(true);
    const isSaving = ref(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const record = ref<any>(null);
    const adjustmentAmount = ref('0.00');
    const adjustmentReason = ref('');

    const recordHttp = new APIService(getBaseUrl(), '/api/v2/payroll/records');
    const adjHttp = new APIService(
      getBaseUrl(),
      `/api/v2/payroll/records/${props.recordId}/adjustment`,
    );

    const canAdjust = computed(() => {
      return (
        props.allowAdjust &&
        record.value &&
        ['COMPUTED', 'ADJUSTED'].includes(record.value.status)
      );
    });

    onMounted(() => {
      isLoading.value = true;
      recordHttp
        .get(props.recordId)
        .then((res) => {
          record.value = res.data?.data ?? null;
          if (record.value) {
            adjustmentAmount.value = String(record.value.adjustmentAmount ?? 0);
          }
        })
        .finally(() => {
          isLoading.value = false;
        });
    });

    const onSaveAdjustment = () => {
      isSaving.value = true;
      adjHttp
        .request({
          method: 'PUT',
          data: {
            adjustmentAmount: Number(adjustmentAmount.value),
            reason: adjustmentReason.value,
          },
        })
        .then(() => {
          $toast?.updateSuccess();
          emit('updated');
          emit('close');
        })
        .finally(() => {
          isSaving.value = false;
        });
    };

    const onClose = () => emit('close');

    return {
      isLoading,
      isSaving,
      record,
      adjustmentAmount,
      adjustmentReason,
      canAdjust,
      onSaveAdjustment,
      onClose,
      formatInr,
      rules: {
        amount: [
          required,
          (v: string) =>
            !Number.isNaN(Number(v)) || 'Must be a valid numeric amount',
        ],
        reason: [required, shouldNotExceedCharLength(250)],
      },
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/orangehrmPayrollPlugin/styles/payroll.scss';
</style>
