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
      :style="{width: '92%', maxWidth: '780px'}"
      @update:show="onClose"
    >
      <div class="orangehrm-modal-header">
        <oxd-text type="card-title">
          Payslip Preview
          <span v-if="slip"> — {{ slip.slipNumber }}</span>
        </oxd-text>
      </div>
      <oxd-divider />

      <div v-if="isLoading" class="orangehrm-payroll-modal-loader">
        <oxd-loading-spinner />
      </div>

      <div v-else-if="slip">
        <div class="orangehrm-payroll-toolbar">
          <div>
            <oxd-text tag="h6" class="orangehrm-main-title">
              {{ slip.employeeName }} ({{ slip.employeeId }})
            </oxd-text>
            <oxd-text type="subtitle-2">
              {{ slip.payPeriodName }} · FY {{ slip.financialYear }} · Pay Date
              {{ slip.payDate }}
            </oxd-text>
          </div>
          <payroll-status-badge :status="slip.slipStatus" />
        </div>

        <oxd-divider />

        <div class="orangehrm-payroll-breakdown-grid">
          <div class="orangehrm-payroll-breakdown-panel">
            <oxd-text tag="h6" class="orangehrm-sub-title">
              Earnings &amp; Attendance
            </oxd-text>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Payable / Working Days</span>
              <span class="orangehrm-payroll-mono">
                {{ slip.record?.payableDays }} /
                {{ slip.record?.workingDays }} (LWP: {{ slip.record?.lwpDays }})
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Basic Salary</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(slip.record?.basicSalary) }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>House Rent Allowance (HRA)</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(slip.record?.hraAmount) }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Special / Other Allowances</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(slip.record?.specialAllowance) }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Overtime Pay ({{ slip.record?.overtimeHours }} hrs)</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(slip.record?.overtimeAmount) }}
              </span>
            </div>
            <div
              v-if="Number(slip.record?.lwpDeduction || 0) > 0"
              class="orangehrm-payroll-breakdown-row"
            >
              <span>LWP Deduction</span>
              <span class="orangehrm-payroll-mono">
                -{{ formatInr(slip.record?.lwpDeduction) }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Approved Claim Reimbursements</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(slip.record?.reimbursementAmount) }}
              </span>
            </div>
            <div
              v-if="Number(slip.record?.adjustmentAmount || 0) !== 0"
              class="orangehrm-payroll-breakdown-row"
            >
              <span>Manual Adjustment</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(slip.record?.adjustmentAmount) }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <strong>Gross Earnings</strong>
              <strong class="orangehrm-payroll-mono">
                {{ formatInr(slip.grossSalary) }}
              </strong>
            </div>
          </div>

          <div class="orangehrm-payroll-breakdown-panel">
            <oxd-text tag="h6" class="orangehrm-sub-title">
              Statutory Deductions &amp; TDS ({{ slip.record?.taxRegime }})
            </oxd-text>
            <div class="orangehrm-payroll-breakdown-row">
              <span>EPF Employee (12%)</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(slip.record?.epfEmployee) }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>ESIC Employee (0.75%)</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(slip.record?.esicEmployee) }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Professional Tax ({{ slip.record?.ptStateCode }})</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(slip.record?.professionalTax) }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Income Tax TDS</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(slip.record?.incomeTaxTds) }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Health &amp; Education Cess (4%)</span>
              <span class="orangehrm-payroll-mono">
                {{ formatInr(slip.record?.healthEducationCess) }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <strong>Total Deductions &amp; Tax</strong>
              <strong class="orangehrm-payroll-mono">
                {{
                  formatInr(Number(slip.totalDeduction) + Number(slip.totalTax))
                }}
              </strong>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <span>Employer EPF + ESIC (Info)</span>
              <span class="orangehrm-payroll-mono">
                {{
                  formatInr(
                    Number(slip.record?.epfEmployer || 0) +
                      Number(slip.record?.esicEmployer || 0),
                  )
                }}
              </span>
            </div>
            <div class="orangehrm-payroll-breakdown-row">
              <strong>Net Payable (INR)</strong>
              <strong class="orangehrm-payroll-mono">
                {{ formatInr(slip.netSalary) }}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <oxd-divider />
      <oxd-form-actions>
        <oxd-button
          display-type="ghost"
          :label="$t('general.close')"
          @click="onClose"
        />
        <oxd-button
          v-if="slip"
          display-type="secondary"
          icon-name="download"
          label="Open / Print Payslip"
          @click="onDownload"
        />
      </oxd-form-actions>
    </oxd-dialog>
  </teleport>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import {OxdDialog, OxdSpinner} from '@ohrm/oxd';
import {APIService} from '@/core/util/services/api.service';
import PayrollStatusBadge from './PayrollStatusBadge.vue';
import {formatInr, getBaseUrl} from '../util/formatInr';

export default defineComponent({
  name: 'PayslipPreviewModal',
  components: {
    'oxd-dialog': OxdDialog,
    'oxd-loading-spinner': OxdSpinner,
    'payroll-status-badge': PayrollStatusBadge,
  },
  props: {
    slipId: {
      type: Number,
      required: true,
    },
  },
  emits: ['close'],
  setup(props, {emit}) {
    const isLoading = ref(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const slip = ref<any>(null);
    const http = new APIService(getBaseUrl(), '/api/v2/payroll/slips');

    onMounted(() => {
      isLoading.value = true;
      http
        .get(props.slipId)
        .then((res) => {
          slip.value = res.data?.data ?? null;
        })
        .finally(() => {
          isLoading.value = false;
        });
    });

    const onClose = () => emit('close');
    const onDownload = () => {
      const url = `${getBaseUrl()}/payroll/slips/${props.slipId}/download`;
      window.open(url, '_blank', 'noopener');
    };

    return {
      isLoading,
      slip,
      onClose,
      onDownload,
      formatInr,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/orangehrmPayrollPlugin/styles/payroll.scss';
</style>
