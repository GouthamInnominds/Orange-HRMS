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
  <div class="orangehrm-card-container">
    <div class="orangehrm-payroll-toolbar">
      <div>
        <oxd-text tag="h6" class="orangehrm-main-title">
          India Payroll Run Processing
          <span v-if="selectedRun"> — {{ selectedRun.payPeriodName }}</span>
        </oxd-text>
        <oxd-text v-if="selectedRun" type="subtitle-2">
          Run #{{ selectedRun.id }} · {{ selectedRun.runType }} v{{
            selectedRun.runVersion
          }}
          · FY {{ selectedRun.financialYear }} · Pay Date
          {{ selectedRun.payDate }}
        </oxd-text>
      </div>
      <payroll-status-badge v-if="selectedRun" :status="selectedRun.status" />
    </div>

    <oxd-divider />

    <oxd-form :loading="isRunLoading">
      <oxd-form-row>
        <oxd-grid :cols="3" class="orangehrm-full-width-grid">
          <oxd-grid-item>
            <oxd-input-field
              v-model="selectedRunOption"
              type="select"
              label="Active Payroll Run"
              :options="runOptions"
              @update:model-value="onSelectRun"
            />
          </oxd-grid-item>
          <oxd-grid-item v-if="$can.create('payroll_run_process')">
            <oxd-input-field
              v-model="newRunPeriodOption"
              type="select"
              label="Pay Period (Create / Open Run)"
              :options="periodOptions"
            />
          </oxd-grid-item>
          <oxd-grid-item v-if="$can.create('payroll_run_process')">
            <oxd-input-field
              v-model="newRunTypeOption"
              type="select"
              label="Run Type"
              :options="runTypeOptions"
            />
          </oxd-grid-item>
        </oxd-grid>
      </oxd-form-row>

      <div class="orangehrm-payroll-toolbar">
        <div class="orangehrm-payroll-toolbar-actions">
          <oxd-button
            v-if="$can.create('payroll_run_process')"
            type="button"
            display-type="ghost"
            icon-name="plus"
            label="Create / Open Run"
            :disabled="!newRunPeriodOption?.id || isActionRunning"
            @click="onCreateOrOpenRun"
          />
          <oxd-button
            v-if="canCalculateRun"
            type="button"
            display-type="secondary"
            label="Calculate Batch"
            :disabled="isActionRunning"
            @click="onCalculateBatch"
          />
          <oxd-button
            v-if="canSubmitRun"
            type="button"
            display-type="secondary"
            label="Submit for Approval"
            :disabled="isActionRunning"
            @click="openWorkflowModal('submit')"
          />
          <oxd-button
            v-if="canApproveRun"
            type="button"
            display-type="secondary"
            label="Approve Run"
            :disabled="isActionRunning"
            @click="openWorkflowModal('approve')"
          />
          <oxd-button
            v-if="canApproveRun"
            type="button"
            display-type="danger"
            label="Reject Run"
            :disabled="isActionRunning"
            @click="openWorkflowModal('reject')"
          />
          <oxd-button
            v-if="canLockRun"
            type="button"
            display-type="secondary"
            label="Lock &amp; Publish Slips"
            :disabled="isActionRunning"
            @click="openWorkflowModal('lock')"
          />
          <oxd-button
            v-if="canReverseRun"
            type="button"
            display-type="danger"
            label="Reverse Run"
            :disabled="isActionRunning"
            @click="openWorkflowModal('reverse')"
          />
        </div>

        <div class="orangehrm-payroll-toolbar-actions">
          <oxd-button
            v-if="canGoToPayments"
            type="button"
            display-type="ghost"
            label="Go to Payments"
            @click="onGoToPayments"
          />
        </div>
      </div>

      <oxd-text
        v-if="selectedRun?.rejectionReason && selectedRun.status === 'REJECTED'"
        tag="p"
        style="color: #eb0910; margin-top: 0.75rem; font-size: 0.85rem"
      >
        Rejection Reason: {{ selectedRun.rejectionReason }}
      </oxd-text>
    </oxd-form>
  </div>

  <br />

  <div v-if="selectedRun" class="orangehrm-payroll-metrics">
    <div class="orangehrm-payroll-metric-card">
      <span class="orangehrm-payroll-metric-label">Employees Eligible</span>
      <span class="orangehrm-payroll-metric-value">
        {{ selectedRun.totalEmployees }}
      </span>
      <span class="orangehrm-payroll-metric-sub">
        Skipped: {{ selectedRun.exceptionCount }} · Engine
        {{ selectedRun.calculationVersion }}
      </span>
    </div>
    <div class="orangehrm-payroll-metric-card">
      <span class="orangehrm-payroll-metric-label">Total Gross + Claims</span>
      <span class="orangehrm-payroll-metric-value">
        {{
          formatInr(
            Number(selectedRun.totalGross || 0) +
              Number(selectedRun.totalReimbursements || 0),
          )
        }}
      </span>
      <span class="orangehrm-payroll-metric-sub">
        Claims Reimbursed: {{ formatInr(selectedRun.totalReimbursements) }}
      </span>
    </div>
    <div class="orangehrm-payroll-metric-card">
      <span class="orangehrm-payroll-metric-label"
        >Statutory &amp; TDS Tax</span
      >
      <span class="orangehrm-payroll-metric-value">
        {{
          formatInr(
            Number(selectedRun.totalDeductions || 0) +
              Number(selectedRun.totalTax || 0),
          )
        }}
      </span>
      <span class="orangehrm-payroll-metric-sub">
        TDS + Cess: {{ formatInr(selectedRun.totalTax) }}
      </span>
    </div>
    <div class="orangehrm-payroll-metric-card --highlight">
      <span class="orangehrm-payroll-metric-label">Total Net Disbursement</span>
      <span class="orangehrm-payroll-metric-value">
        {{ formatInr(selectedRun.totalNetPay) }}
      </span>
      <span class="orangehrm-payroll-metric-sub">
        Currency: {{ selectedRun.currencyId }} · Pay Date:
        {{ selectedRun.payDate }}
      </span>
    </div>
  </div>

  <div class="orangehrm-paper-container">
    <div class="orangehrm-header-container" style="padding-bottom: 0">
      <div class="orangehrm-payroll-subtabs">
        <button
          type="button"
          class="orangehrm-payroll-subtab-btn"
          :class="{'--active': activeTab === 'records'}"
          @click="activeTab = 'records'"
        >
          Employee Records ({{ recordTotal }})
        </button>
        <button
          type="button"
          class="orangehrm-payroll-subtab-btn"
          :class="{'--active': activeTab === 'exceptions'}"
          @click="activeTab = 'exceptions'"
        >
          Skipped &amp; Warnings ({{ exceptionsRows.length }})
        </button>
        <button
          type="button"
          class="orangehrm-payroll-subtab-btn"
          :class="{'--active': activeTab === 'approvals'}"
          @click="activeTab = 'approvals'"
        >
          Approval History ({{ approvals.length }})
        </button>
      </div>
    </div>

    <template v-if="activeTab === 'records'">
      <div class="orangehrm-horizontal-padding" style="padding-top: 0.25rem">
        <oxd-form @submit-valid="onFilterRecords">
          <oxd-form-row>
            <oxd-grid :cols="3" class="orangehrm-full-width-grid">
              <oxd-grid-item>
                <oxd-input-field
                  v-model="recordFilters.search"
                  label="Search Employee"
                  placeholder="Employee name or ID"
                />
              </oxd-grid-item>
              <oxd-grid-item>
                <oxd-input-field
                  v-model="recordFilters.status"
                  type="select"
                  :label="$t('general.status')"
                  :options="recordStatusOptions"
                />
              </oxd-grid-item>
              <oxd-grid-item
                style="display: flex; align-items: flex-end; gap: 0.5rem"
              >
                <oxd-button
                  type="button"
                  display-type="ghost"
                  :label="$t('general.reset')"
                  @click="onResetRecordFilters"
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
      <table-header :total="recordTotal" :loading="isRecordsLoading" />
      <div class="orangehrm-container">
        <oxd-card-table
          :items="recordRows"
          :headers="recordHeaders"
          :selectable="false"
          :clickable="false"
          :loading="isRecordsLoading"
          row-decorator="oxd-table-decorator-card"
        />
      </div>
      <div class="orangehrm-bottom-container">
        <oxd-pagination
          v-if="recordPages > 1"
          v-model:current="recordPage"
          :length="recordPages"
          @update:current="loadRecords"
        />
      </div>
    </template>

    <template v-else-if="activeTab === 'exceptions'">
      <table-header :total="exceptionsRows.length" :loading="isRunLoading" />
      <div class="orangehrm-container">
        <oxd-card-table
          :items="exceptionsRows"
          :headers="exceptionHeaders"
          :selectable="false"
          :clickable="false"
          :loading="isRunLoading"
          row-decorator="oxd-table-decorator-card"
        />
      </div>
    </template>

    <template v-else>
      <div
        v-if="selectedRun"
        class="orangehrm-horizontal-padding"
        style="padding-bottom: 0.75rem"
      >
        <oxd-text type="subtitle-2">
          Created by: {{ selectedRun.createdByUsername || '-' }} · Submitted by:
          {{ selectedRun.submittedByUsername || '-' }} ({{
            selectedRun.submittedAt || '-'
          }}) · Approved by: {{ selectedRun.approvedByUsername || '-' }} ({{
            selectedRun.approvedAt || '-'
          }}) · Locked by: {{ selectedRun.lockedByUsername || '-' }} ({{
            selectedRun.lockedAt || '-'
          }})
        </oxd-text>
      </div>
      <table-header :total="approvals.length" :loading="isRunLoading" />
      <div class="orangehrm-container">
        <oxd-card-table
          :items="approvals"
          :headers="approvalHeaders"
          :selectable="false"
          :clickable="false"
          :loading="isRunLoading"
          row-decorator="oxd-table-decorator-card"
        />
      </div>
    </template>
  </div>

  <record-adjustment-modal
    v-if="selectedRecordId"
    :record-id="selectedRecordId"
    :allow-adjust="canAdjustRun"
    @close="selectedRecordId = null"
    @updated="onRecordAdjusted"
  />

  <payslip-preview-modal
    v-if="previewSlipId"
    :slip-id="previewSlipId"
    @close="previewSlipId = null"
  />

  <teleport to="#app">
    <oxd-dialog
      v-if="workflowAction"
      :style="{width: '90%', maxWidth: '500px'}"
      @update:show="workflowAction = null"
    >
      <div class="orangehrm-modal-header">
        <oxd-text type="card-title">{{ workflowModalTitle }}</oxd-text>
      </div>
      <oxd-divider />
      <oxd-form :loading="isActionRunning" @submit-valid="onExecuteWorkflow">
        <oxd-form-row>
          <oxd-input-field
            v-model="workflowNote"
            type="textarea"
            :label="
              isWorkflowNoteRequired
                ? 'Mandatory Reason'
                : 'Audit Comments (Optional)'
            "
            :rules="isWorkflowNoteRequired ? rules.mandatoryReason : []"
            :required="isWorkflowNoteRequired"
          />
        </oxd-form-row>
        <oxd-divider />
        <oxd-form-actions>
          <oxd-button
            type="button"
            display-type="ghost"
            :label="$t('general.cancel')"
            @click="workflowAction = null"
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
import {navigate} from '@/core/util/helper/navigation';
import {
  required,
  shouldNotExceedCharLength,
} from '@ohrm/core/util/validation/rules';
import PayrollStatusBadge from '@/orangehrmPayrollPlugin/components/PayrollStatusBadge.vue';
import RecordAdjustmentModal from '@/orangehrmPayrollPlugin/components/RecordAdjustmentModal.vue';
import PayslipPreviewModal from '@/orangehrmPayrollPlugin/components/PayslipPreviewModal.vue';
import {
  extractApiError,
  formatInr,
  formatStatusLabel,
  getBaseUrl,
} from '@/orangehrmPayrollPlugin/util/formatInr';
import {usePayrollPermissions} from '@/orangehrmPayrollPlugin/util/usePayrollPermissions';

const RUN_TYPES = [
  {id: 'REGULAR', label: 'Regular Monthly Payroll'},
  {id: 'OFF_CYCLE', label: 'Off-Cycle Settlement'},
  {id: 'ADJUSTMENT', label: 'Adjustment Run'},
];

const RECORD_STATUS_OPTIONS = [
  {id: 'COMPUTED', label: 'Computed'},
  {id: 'ADJUSTED', label: 'Adjusted'},
  {id: 'PAID', label: 'Paid'},
  {id: 'VOIDED', label: 'Voided'},
];

const WORKFLOW_TITLES: Record<string, string> = {
  submit: 'Submit Payroll Run for Approval',
  approve: 'Approve Payroll Run (Maker-Checker Verified)',
  reject: 'Reject Payroll Run Back to Processor',
  lock: 'Lock Approved Run & Publish Employee Payslips',
  reverse: 'Reverse Locked Payroll Run & Void Payslips',
};

export default defineComponent({
  name: 'PayrollProcessing',
  components: {
    'oxd-dialog': OxdDialog,
    'payroll-status-badge': PayrollStatusBadge,
    'record-adjustment-modal': RecordAdjustmentModal,
    'payslip-preview-modal': PayslipPreviewModal,
  },
  props: {
    initialRunId: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const vm = getCurrentInstance();
    const $toast = vm?.appContext.config.globalProperties.$toast;
    const {canRead, canCreate, canUpdate} = usePayrollPermissions();

    const isRunLoading = ref(false);
    const isRecordsLoading = ref(false);
    const isActionRunning = ref(false);
    const activeTab = ref<'records' | 'exceptions' | 'approvals'>('records');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const runs = ref<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selectedRun = ref<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selectedRunOption = ref<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periods = ref<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newRunPeriodOption = ref<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newRunTypeOption = ref<any>(RUN_TYPES[0]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ineligibleEmployees = ref<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const approvals = ref<any[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recordRows = ref<any[]>([]);
    const recordTotal = ref(0);
    const recordPage = ref(1);
    const recordLimit = 50;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recordFilters = reactive<{search: string; status: any}>({
      search: '',
      status: null,
    });

    const selectedRecordId = ref<number | null>(null);
    const previewSlipId = ref<number | null>(null);
    const workflowAction = ref<
      'submit' | 'approve' | 'reject' | 'lock' | 'reverse' | null
    >(null);
    const workflowNote = ref('');

    const periodsHttp = new APIService(
      getBaseUrl(),
      '/api/v2/payroll/pay-periods',
    );
    const runsHttp = new APIService(getBaseUrl(), '/api/v2/payroll/runs');

    const runOptions = computed(() =>
      runs.value.map((r) => ({
        id: r.id,
        label: `Run #${r.id} — ${r.payPeriodName} [${formatStatusLabel(
          r.status,
        )}] (${formatInr(r.totalNetPay)})`,
      })),
    );

    const periodOptions = computed(() =>
      periods.value.map((p) => ({
        id: p.id,
        label: `${p.name} (${p.startDate} to ${p.endDate})`,
      })),
    );

    const recordPages = computed(() =>
      Math.max(1, Math.ceil(recordTotal.value / recordLimit)),
    );

    const canCalculateRun = computed(
      () =>
        Boolean(selectedRun.value) &&
        canCreate('apiv2_payroll_run_calculate') &&
        ['DRAFT', 'CALCULATED', 'REJECTED'].includes(selectedRun.value.status),
    );

    const canSubmitRun = computed(
      () =>
        Boolean(selectedRun.value) &&
        canCreate('apiv2_payroll_run_submit') &&
        ['CALCULATED', 'REJECTED'].includes(selectedRun.value.status) &&
        Number(selectedRun.value.totalEmployees || 0) > 0,
    );

    const canApproveRun = computed(
      () =>
        Boolean(selectedRun.value) &&
        canCreate('apiv2_payroll_run_approve') &&
        selectedRun.value.status === 'PENDING_APPROVAL',
    );

    const canLockRun = computed(
      () =>
        Boolean(selectedRun.value) &&
        canCreate('apiv2_payroll_run_lock') &&
        selectedRun.value.status === 'APPROVED',
    );

    const canReverseRun = computed(
      () =>
        Boolean(selectedRun.value) &&
        canCreate('apiv2_payroll_run_approve') &&
        selectedRun.value.status === 'LOCKED',
    );

    const canAdjustRun = computed(
      () =>
        Boolean(selectedRun.value) &&
        canUpdate('apiv2_payroll_adjustment') &&
        ['CALCULATED', 'REJECTED'].includes(selectedRun.value.status),
    );

    const canGoToPayments = computed(
      () =>
        Boolean(selectedRun.value) &&
        canRead('payroll_payments') &&
        ['LOCKED', 'PAID_RECONCILED'].includes(selectedRun.value.status),
    );

    const isWorkflowNoteRequired = computed(
      () =>
        workflowAction.value === 'reject' || workflowAction.value === 'reverse',
    );

    const workflowModalTitle = computed(() =>
      workflowAction.value ? WORKFLOW_TITLES[workflowAction.value] : '',
    );

    const exceptionsRows = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows: any[] = ineligibleEmployees.value.map((e) => ({
        employeeId: e.employeeId || `#${e.empNumber}`,
        fullName: e.fullName,
        category: 'SKIPPED',
        reason: e.reason,
      }));
      recordRows.value.forEach((r) => {
        if (Array.isArray(r.warnings) && r.warnings.length > 0) {
          rows.push({
            employeeId: r.employeeId,
            fullName: r.employeeName,
            category: 'WARNING',
            reason: r.warnings.join('; '),
          });
        }
      });
      return rows;
    });

    const loadRecords = (page = recordPage.value) => {
      if (!selectedRun.value?.id) {
        recordRows.value = [];
        recordTotal.value = 0;
        return Promise.resolve();
      }
      recordPage.value = page;
      isRecordsLoading.value = true;
      const recHttp = new APIService(
        getBaseUrl(),
        `/api/v2/payroll/runs/${selectedRun.value.id}/records`,
      );
      return recHttp
        .getAll({
          search: recordFilters.search || undefined,
          status: recordFilters.status?.id || undefined,
          limit: recordLimit,
          offset: (recordPage.value - 1) * recordLimit,
        })
        .then((res) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const raw: any[] = res.data?.data ?? [];
          recordTotal.value = Number(res.data?.meta?.total ?? raw.length);
          recordRows.value = raw.map((r) => ({
            ...r,
            grossFormatted: formatInr(r.grossSalary),
            reimbursementFormatted: formatInr(r.reimbursementAmount),
            statutoryFormatted: formatInr(
              Number(r.epfEmployee || 0) +
                Number(r.esicEmployee || 0) +
                Number(r.professionalTax || 0),
            ),
            taxFormatted: formatInr(r.totalTax),
            netFormatted: formatInr(r.netSalary),
            statusText: r.isManualOverride
              ? `${formatStatusLabel(r.status)} (Override)`
              : formatStatusLabel(r.status),
          }));
        })
        .finally(() => {
          isRecordsLoading.value = false;
        });
    };

    const loadRunDetail = (runId: number) => {
      if (!runId) return Promise.resolve();
      isRunLoading.value = true;
      return runsHttp
        .get(runId)
        .then((res) => {
          const runData = res.data?.data ?? null;
          selectedRun.value = runData;
          if (runData) {
            selectedRunOption.value = {
              id: runData.id,
              label: `Run #${runData.id} — ${
                runData.payPeriodName
              } [${formatStatusLabel(runData.status)}] (${formatInr(
                runData.totalNetPay,
              )})`,
            };
          }
          ineligibleEmployees.value = res.data?.meta?.ineligibleEmployees ?? [];
          approvals.value = res.data?.meta?.approvals ?? [];
          return loadRecords(1);
        })
        .finally(() => {
          isRunLoading.value = false;
        });
    };

    const loadRunsAndPeriods = (targetRunId?: number) => {
      isRunLoading.value = true;
      return Promise.all([
        runsHttp.getAll({limit: 50}),
        periodsHttp.getAll({limit: 50}),
      ])
        .then(([runsRes, periodsRes]) => {
          runs.value = runsRes.data?.data ?? [];
          periods.value = periodsRes.data?.data ?? [];
          if (!newRunPeriodOption.value && periods.value.length > 0) {
            const p = periods.value[0];
            newRunPeriodOption.value = {
              id: p.id,
              label: `${p.name} (${p.startDate} to ${p.endDate})`,
            };
          }
          const resolvedId =
            targetRunId ||
            selectedRun.value?.id ||
            (props.initialRunId > 0 ? props.initialRunId : 0) ||
            runs.value[0]?.id ||
            0;
          if (resolvedId > 0) {
            return loadRunDetail(resolvedId);
          }
          return undefined;
        })
        .finally(() => {
          isRunLoading.value = false;
        });
    };

    onMounted(() => {
      loadRunsAndPeriods();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSelectRun = (option: any) => {
      if (option?.id) {
        loadRunDetail(option.id);
      }
    };

    const onCreateOrOpenRun = () => {
      if (!newRunPeriodOption.value?.id) return;
      isActionRunning.value = true;
      runsHttp
        .create({
          payPeriodId: newRunPeriodOption.value.id,
          runType: newRunTypeOption.value?.id || 'REGULAR',
        })
        .then((res) => {
          const createdId = res.data?.data?.id;
          $toast?.saveSuccess();
          return loadRunsAndPeriods(createdId);
        })
        .catch((err) => {
          $toast?.error({
            title: 'Create Run Failed',
            message: extractApiError(err),
          });
        })
        .finally(() => {
          isActionRunning.value = false;
        });
    };

    const onCalculateBatch = () => {
      if (!selectedRun.value?.id) return;
      isActionRunning.value = true;
      const calcHttp = new APIService(
        getBaseUrl(),
        `/api/v2/payroll/runs/${selectedRun.value.id}/calculate`,
      );
      calcHttp
        .create({})
        .then(() => {
          $toast?.success({
            title: 'Batch Calculated',
            message:
              'India statutory deductions (EPF, ESIC, PT, TDS) and cross-module Leave/Time/Claim inputs recomputed.',
          });
          return loadRunsAndPeriods(selectedRun.value.id);
        })
        .catch((err) => {
          $toast?.error({
            title: 'Calculation Error',
            message: extractApiError(err),
          });
        })
        .finally(() => {
          isActionRunning.value = false;
        });
    };

    const openWorkflowModal = (
      action: 'submit' | 'approve' | 'reject' | 'lock' | 'reverse',
    ) => {
      workflowNote.value = '';
      workflowAction.value = action;
    };

    const onExecuteWorkflow = () => {
      if (!selectedRun.value?.id || !workflowAction.value) return;
      const action = workflowAction.value;
      isActionRunning.value = true;
      const actionHttp = new APIService(
        getBaseUrl(),
        `/api/v2/payroll/runs/${selectedRun.value.id}/${action}`,
      );
      const body =
        action === 'reject' || action === 'reverse'
          ? {reason: workflowNote.value}
          : workflowNote.value.trim()
          ? {comments: workflowNote.value.trim()}
          : {};

      actionHttp
        .create(body)
        .then(() => {
          workflowAction.value = null;
          $toast?.updateSuccess();
          return loadRunsAndPeriods(selectedRun.value.id);
        })
        .catch((err) => {
          $toast?.error({
            title: 'Workflow Action Denied',
            message: extractApiError(err),
          });
        })
        .finally(() => {
          isActionRunning.value = false;
        });
    };

    const onFilterRecords = () => loadRecords(1);

    const onResetRecordFilters = () => {
      recordFilters.search = '';
      recordFilters.status = null;
      loadRecords(1);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onOpenRecordModal = (row: any) => {
      selectedRecordId.value = row.id;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onOpenSlipForRecord = (row: any) => {
      const empSlipHttp = new APIService(
        getBaseUrl(),
        `/api/v2/payroll/employees/${row.empNumber}/payslips`,
      );
      empSlipHttp
        .getAll({includeDrafts: true, limit: 25})
        .then((res) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const slips: any[] = res.data?.data ?? [];
          const match = slips.find((s) => s.payrollRecordId === row.id);
          if (match) {
            previewSlipId.value = match.id;
          } else {
            $toast?.info({
              title: 'Payslip Not Generated',
              message:
                'Lock the approved payroll run to publish employee salary slips.',
            });
          }
        })
        .catch((err) => {
          $toast?.error({
            title: 'Payslip Lookup Failed',
            message: extractApiError(err),
          });
        });
    };

    const onRecordAdjusted = () => {
      if (selectedRun.value?.id) {
        loadRunsAndPeriods(selectedRun.value.id);
      }
    };

    const onGoToPayments = () => {
      navigate('/payroll/viewPayrollPayments');
    };

    const recordHeaders = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cellConfig: Record<string, any> = {
        breakdown: {
          onClick: onOpenRecordModal,
          component: 'oxd-button',
          props: {
            label: canAdjustRun.value ? 'Adjust / View' : 'Breakdown',
            displayType: 'text',
            size: 'medium',
          },
        },
        payslip: {
          onClick: onOpenSlipForRecord,
          component: 'oxd-button',
          props: {
            label: 'Payslip',
            displayType: 'text',
            size: 'medium',
          },
        },
      };

      return [
        {name: 'employeeId', title: 'Emp ID', style: {flex: 1}},
        {
          name: 'employeeName',
          title: 'Employee',
          slot: 'title',
          style: {flex: 2},
        },
        {name: 'departmentName', title: 'Department', style: {flex: 1.5}},
        {name: 'grossFormatted', title: 'Gross', style: {flex: 1.5}},
        {name: 'reimbursementFormatted', title: 'Claims', style: {flex: 1.2}},
        {name: 'statutoryFormatted', title: 'EPF/ESI/PT', style: {flex: 1.5}},
        {name: 'taxFormatted', title: 'TDS Tax', style: {flex: 1.3}},
        {name: 'netFormatted', title: 'Net Pay', style: {flex: 1.5}},
        {name: 'statusText', title: 'Status', style: {flex: 1.4}},
        {
          name: 'actions',
          slot: 'action',
          title: 'Actions',
          style: {flex: 2.8},
          cellType: 'oxd-table-cell-actions',
          cellConfig,
        },
      ];
    });

    const exceptionHeaders = [
      {name: 'employeeId', title: 'Emp ID', style: {flex: 1}},
      {name: 'fullName', title: 'Employee', slot: 'title', style: {flex: 2}},
      {name: 'category', title: 'Type', style: {flex: 1}},
      {name: 'reason', title: 'Exclusion / Warning Reason', style: {flex: 4}},
    ];

    const approvalHeaders = [
      {
        name: 'action',
        title: 'Workflow Action',
        slot: 'title',
        style: {flex: 2},
      },
      {name: 'actorUsername', title: 'Actor', style: {flex: 1.5}},
      {name: 'actionAt', title: 'Timestamp', style: {flex: 2}},
      {name: 'comments', title: 'Comments / Reason', style: {flex: 3}},
    ];

    return {
      isRunLoading,
      isRecordsLoading,
      isActionRunning,
      activeTab,
      selectedRun,
      selectedRunOption,
      runOptions,
      periodOptions,
      newRunPeriodOption,
      newRunTypeOption,
      runTypeOptions: RUN_TYPES,
      canCalculateRun,
      canSubmitRun,
      canApproveRun,
      canLockRun,
      canReverseRun,
      canAdjustRun,
      canGoToPayments,
      recordFilters,
      recordStatusOptions: RECORD_STATUS_OPTIONS,
      recordRows,
      recordTotal,
      recordPage,
      recordPages,
      recordHeaders,
      exceptionsRows,
      exceptionHeaders,
      approvals,
      approvalHeaders,
      selectedRecordId,
      previewSlipId,
      workflowAction,
      workflowNote,
      isWorkflowNoteRequired,
      workflowModalTitle,
      onSelectRun,
      onCreateOrOpenRun,
      onCalculateBatch,
      openWorkflowModal,
      onExecuteWorkflow,
      onFilterRecords,
      onResetRecordFilters,
      loadRecords,
      onRecordAdjusted,
      onGoToPayments,
      formatInr,
      rules: {
        mandatoryReason: [required, shouldNotExceedCharLength(500)],
      },
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/orangehrmPayrollPlugin/styles/payroll.scss';
</style>
