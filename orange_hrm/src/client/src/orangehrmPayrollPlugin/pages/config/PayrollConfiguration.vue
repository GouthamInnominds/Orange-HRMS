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
  <div class="orangehrm-paper-container">
    <div class="orangehrm-header-container" style="padding-bottom: 0">
      <div>
        <oxd-text tag="h6" class="orangehrm-main-title">
          India Payroll Policy &amp; Statutory Configuration
        </oxd-text>
        <oxd-text type="subtitle-2">
          Jurisdiction: IN · Currency: INR (₹) · Separation of Duties (SoD)
          &amp; Cross-Module Rules
        </oxd-text>
      </div>
    </div>

    <div
      class="orangehrm-horizontal-padding"
      style="padding-top: 0.75rem; padding-bottom: 0"
    >
      <div class="orangehrm-payroll-subtabs">
        <button
          type="button"
          class="orangehrm-payroll-subtab-btn"
          :class="{'--active': activeTab === 'org'}"
          @click="activeTab = 'org'"
        >
          Organization Settings
        </button>
        <button
          type="button"
          class="orangehrm-payroll-subtab-btn"
          :class="{'--active': activeTab === 'tax'}"
          @click="activeTab = 'tax'"
        >
          Income Tax Slabs (FY {{ fyFilter }})
        </button>
        <button
          type="button"
          class="orangehrm-payroll-subtab-btn"
          :class="{'--active': activeTab === 'statutory'}"
          @click="activeTab = 'statutory'"
        >
          EPF / ESIC / PT Rules
        </button>
        <button
          type="button"
          class="orangehrm-payroll-subtab-btn"
          :class="{'--active': activeTab === 'leave'}"
          @click="activeTab = 'leave'"
        >
          Leave LWP Mapping
        </button>
      </div>
    </div>

    <div
      v-if="activeTab === 'org'"
      class="orangehrm-horizontal-padding orangehrm-vertical-padding"
    >
      <oxd-form :loading="isOrgLoading" @submit-valid="onSaveOrgConfig">
        <oxd-form-row>
          <oxd-grid :cols="3" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                v-model="orgForm.payFrequency"
                type="select"
                label="Default Pay Frequency"
                :options="frequencyOptions"
                :disabled="!canEditConfig"
                required
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="orgForm.lwpDivisorMode"
                type="select"
                label="LWP Proration Divisor"
                :options="lwpDivisorOptions"
                :disabled="!canEditConfig"
                required
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="orgForm.timeAttendanceSourceMode"
                type="select"
                label="Time &amp; Attendance Source"
                :options="timeSourceOptions"
                :disabled="!canEditConfig"
                required
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>

        <oxd-form-row>
          <oxd-grid :cols="3" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                v-model="orgForm.standardShiftHours"
                label="Standard Shift Hours / Day"
                :rules="rules.positiveNum"
                :disabled="!canEditConfig"
                required
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="orgForm.overtimeMultiplier"
                label="Overtime Multiplier (Factories Act 2x)"
                :rules="rules.positiveNum"
                :disabled="!canEditConfig"
                required
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="orgForm.overtimeEligibleMaxBasic"
                label="OT Eligible Max Basic (INR)"
                :rules="rules.zeroOrPositiveNum"
                :disabled="!canEditConfig"
                required
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>

        <oxd-form-row>
          <oxd-grid :cols="3" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                v-model="orgForm.epfWageCeiling"
                label="EPF Wage Ceiling (INR)"
                :rules="rules.positiveNum"
                :disabled="!canEditConfig"
                required
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="orgForm.esicGrossCeiling"
                label="ESIC Gross Ceiling (INR)"
                :rules="rules.positiveNum"
                :disabled="!canEditConfig"
                required
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="orgForm.defaultPtStateCode"
                type="select"
                label="Default Professional Tax State"
                :options="ptStateOptions"
                :disabled="!canEditConfig"
                required
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>

        <oxd-form-row>
          <oxd-grid :cols="3" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                v-model="orgForm.defaultTaxRegime"
                type="select"
                label="Default Income Tax Regime"
                :options="taxRegimeOptions"
                :disabled="!canEditConfig"
                required
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <div class="orangehrm-payroll-switch-row">
                <oxd-text tag="p" style="font-size: 0.85rem">
                  Cap EPF Contribution at Ceiling (₹15,000)
                </oxd-text>
                <oxd-switch-input
                  v-model="orgForm.epfCapAtCeiling"
                  :disabled="!canEditConfig"
                />
              </div>
            </oxd-grid-item>
            <oxd-grid-item>
              <div class="orangehrm-payroll-switch-row">
                <oxd-text tag="p" style="font-size: 0.85rem">
                  Enforce Maker-Checker Approval (SoD)
                </oxd-text>
                <oxd-switch-input
                  v-model="orgForm.requireMakerCheckerApproval"
                  :disabled="!canEditConfig"
                />
              </div>
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>

        <oxd-divider />
        <oxd-form-actions v-if="canEditConfig">
          <submit-button />
        </oxd-form-actions>
      </oxd-form>
    </div>

    <template v-else-if="activeTab === 'tax'">
      <div class="orangehrm-horizontal-padding" style="padding-top: 0.5rem">
        <oxd-form @submit-valid="loadTaxBrackets">
          <oxd-form-row>
            <oxd-grid :cols="3" class="orangehrm-full-width-grid">
              <oxd-grid-item>
                <oxd-input-field
                  v-model="fyFilter"
                  label="Financial Year"
                  placeholder="2026-27"
                />
              </oxd-grid-item>
              <oxd-grid-item>
                <oxd-input-field
                  v-model="regimeFilter"
                  type="select"
                  label="Tax Regime Filter"
                  :options="taxRegimeFilterOptions"
                />
              </oxd-grid-item>
              <oxd-grid-item
                style="display: flex; align-items: flex-end; gap: 0.5rem"
              >
                <oxd-button
                  type="submit"
                  display-type="secondary"
                  label="Load Slabs"
                />
              </oxd-grid-item>
            </oxd-grid>
          </oxd-form-row>
        </oxd-form>
      </div>
      <table-header
        :total="filteredTaxBrackets.length"
        :loading="isTaxLoading"
      />
      <div class="orangehrm-container">
        <oxd-card-table
          :items="filteredTaxBrackets"
          :headers="taxHeaders"
          :selectable="false"
          :clickable="false"
          :loading="isTaxLoading"
          row-decorator="oxd-table-decorator-card"
        />
      </div>
      <div class="orangehrm-bottom-container" />
    </template>

    <template v-else-if="activeTab === 'statutory'">
      <div class="orangehrm-horizontal-padding" style="padding-top: 0.5rem">
        <oxd-form>
          <oxd-form-row>
            <oxd-grid :cols="3" class="orangehrm-full-width-grid">
              <oxd-grid-item>
                <oxd-input-field
                  v-model="ruleTypeFilter"
                  type="select"
                  label="Statutory Rule Type"
                  :options="ruleTypeOptions"
                />
              </oxd-grid-item>
            </oxd-grid>
          </oxd-form-row>
        </oxd-form>
      </div>
      <table-header
        :total="filteredStatutoryRules.length"
        :loading="isStatutoryLoading"
      />
      <div class="orangehrm-container">
        <oxd-card-table
          :items="filteredStatutoryRules"
          :headers="statutoryHeaders"
          :selectable="false"
          :clickable="false"
          :loading="isStatutoryLoading"
          row-decorator="oxd-table-decorator-card"
        />
      </div>
      <div class="orangehrm-bottom-container" />
    </template>

    <template v-else>
      <table-header :total="leavePolicies.length" :loading="isLeaveLoading" />
      <div class="orangehrm-container">
        <oxd-card-table
          :items="leavePolicies"
          :headers="leaveHeaders"
          :selectable="false"
          :clickable="false"
          :loading="isLeaveLoading"
          row-decorator="oxd-table-decorator-card"
        />
      </div>
      <div class="orangehrm-bottom-container" />
    </template>
  </div>

  <teleport to="#app">
    <oxd-dialog
      v-if="editingBracket"
      :style="{width: '90%', maxWidth: '520px'}"
      @update:show="editingBracket = null"
    >
      <div class="orangehrm-modal-header">
        <oxd-text type="card-title">
          Edit Tax Slab — {{ editingBracket.regimeLabel }} (Slab #{{
            editingBracket.slabOrder
          }})
        </oxd-text>
      </div>
      <oxd-divider />
      <oxd-form :loading="isSavingModal" @submit-valid="onSaveBracket">
        <oxd-form-row>
          <oxd-grid :cols="2" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                v-model="bracketForm.taxRate"
                label="Tax Rate (%)"
                :rules="rules.zeroOrPositiveNum"
                required
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="bracketForm.cessRate"
                label="Health &amp; Edu Cess (%)"
                :rules="rules.zeroOrPositiveNum"
                required
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>
        <oxd-form-row>
          <oxd-grid :cols="2" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                v-model="bracketForm.standardDeduction"
                label="Standard Deduction (INR)"
                :rules="rules.zeroOrPositiveNum"
                required
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <div
                class="orangehrm-payroll-switch-row"
                style="padding-top: 1.5rem"
              >
                <oxd-text tag="p" style="font-size: 0.85rem"
                  >Active Slab</oxd-text
                >
                <oxd-switch-input v-model="bracketForm.isActive" />
              </div>
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>
        <oxd-divider />
        <oxd-form-actions>
          <oxd-button
            type="button"
            display-type="ghost"
            :label="$t('general.cancel')"
            @click="editingBracket = null"
          />
          <submit-button />
        </oxd-form-actions>
      </oxd-form>
    </oxd-dialog>

    <oxd-dialog
      v-if="editingLeavePolicy"
      :style="{width: '90%', maxWidth: '520px'}"
      @update:show="editingLeavePolicy = null"
    >
      <div class="orangehrm-modal-header">
        <oxd-text type="card-title">
          Leave Pay Treatment — {{ editingLeavePolicy.leaveTypeName }}
        </oxd-text>
      </div>
      <oxd-divider />
      <oxd-form :loading="isSavingModal" @submit-valid="onSaveLeavePolicy">
        <oxd-form-row>
          <oxd-grid :cols="2" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                v-model="leaveForm.payrollPayTreatment"
                type="select"
                label="Pay Treatment"
                :options="leaveTreatmentOptions"
                required
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="leaveForm.deductionMultiplier"
                label="Deduction Multiplier"
                :rules="rules.zeroOrPositiveNum"
                required
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>
        <oxd-form-row>
          <oxd-input-field
            v-model="leaveForm.notes"
            type="textarea"
            label="Policy Notes"
            :rules="rules.notes"
          />
        </oxd-form-row>
        <oxd-divider />
        <oxd-form-actions>
          <oxd-button
            type="button"
            display-type="ghost"
            :label="$t('general.cancel')"
            @click="editingLeavePolicy = null"
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
import {OxdDialog, OxdSwitchInput} from '@ohrm/oxd';
import {APIService} from '@/core/util/services/api.service';
import {
  required,
  shouldNotExceedCharLength,
} from '@ohrm/core/util/validation/rules';
import {
  extractApiError,
  formatInr,
  formatStatusLabel,
  getBaseUrl,
} from '@/orangehrmPayrollPlugin/util/formatInr';
import {usePayrollPermissions} from '@/orangehrmPayrollPlugin/util/usePayrollPermissions';

const FREQUENCY_OPTIONS = [
  {id: 'MONTHLY', label: 'Monthly'},
  {id: 'BIWEEKLY', label: 'Bi-Weekly'},
  {id: 'WEEKLY', label: 'Weekly'},
];

const LWP_DIVISOR_OPTIONS = [
  {id: 'CALENDAR_DAYS', label: 'Calendar Days in Period'},
  {id: 'WORKING_DAYS', label: 'Standard Working Days'},
  {id: 'FIXED_30', label: 'Fixed 30 Days'},
];

const TIME_SOURCE_OPTIONS = [
  {id: 'TIMESHEET_PRIMARY', label: 'Timesheet Primary (+ Attendance Fallback)'},
  {id: 'ATTENDANCE_ONLY', label: 'Attendance Punches Only'},
  {id: 'TIMESHEET_ONLY', label: 'Approved Timesheets Only'},
];

const PT_STATE_OPTIONS = [
  {id: 'KA', label: 'Karnataka (KA)'},
  {id: 'MH', label: 'Maharashtra (MH)'},
  {id: 'WB', label: 'West Bengal (WB)'},
];

const TAX_REGIME_OPTIONS = [
  {id: 'NEW_115BAC', label: 'New Tax Regime (Sec 115BAC)'},
  {id: 'OLD', label: 'Old Tax Regime (With Ch. VI-A)'},
];

const RULE_TYPE_OPTIONS = [
  {id: 'ALL', label: 'All Statutory Rules'},
  {id: 'EPF', label: 'EPF (Provident Fund)'},
  {id: 'ESIC', label: 'ESIC (Employee State Insurance)'},
  {id: 'PT', label: 'PT (State Professional Tax)'},
];

const LEAVE_TREATMENT_OPTIONS = [
  {id: 'PAID', label: 'PAID (No LWP Deduction)'},
  {id: 'UNPAID', label: 'UNPAID (Full LWP Deduction)'},
  {id: 'HALF_PAID', label: 'HALF PAID (0.5x Deduction)'},
  {id: 'EXCESS_UNPAID', label: 'EXCESS UNPAID'},
];

export default defineComponent({
  name: 'PayrollConfiguration',
  components: {
    'oxd-dialog': OxdDialog,
    'oxd-switch-input': OxdSwitchInput,
  },
  setup() {
    const vm = getCurrentInstance();
    const $toast = vm?.appContext.config.globalProperties.$toast;
    const {canUpdate} = usePayrollPermissions();

    const activeTab = ref<'org' | 'tax' | 'statutory' | 'leave'>('org');
    const isOrgLoading = ref(false);
    const isTaxLoading = ref(false);
    const isStatutoryLoading = ref(false);
    const isLeaveLoading = ref(false);
    const isSavingModal = ref(false);

    const canEditConfig = computed(() => canUpdate('payroll_config'));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orgForm = reactive<Record<string, any>>({
      payFrequency: FREQUENCY_OPTIONS[0],
      lwpDivisorMode: LWP_DIVISOR_OPTIONS[0],
      timeAttendanceSourceMode: TIME_SOURCE_OPTIONS[0],
      standardShiftHours: '8',
      overtimeMultiplier: '2',
      overtimeEligibleMaxBasic: '21000',
      epfWageCeiling: '15000',
      epfCapAtCeiling: true,
      esicGrossCeiling: '21000',
      defaultPtStateCode: PT_STATE_OPTIONS[0],
      defaultTaxRegime: TAX_REGIME_OPTIONS[0],
      requireMakerCheckerApproval: true,
    });

    const fyFilter = ref('2026-27');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const regimeFilter = ref<any>({id: 'ALL', label: 'All Regimes'});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const taxBrackets = ref<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editingBracket = ref<any>(null);
    const bracketForm = reactive({
      taxRate: '0',
      cessRate: '4',
      standardDeduction: '75000',
      isActive: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ruleTypeFilter = ref<any>(RULE_TYPE_OPTIONS[0]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const statutoryRules = ref<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leavePolicies = ref<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editingLeavePolicy = ref<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leaveForm = reactive<Record<string, any>>({
      payrollPayTreatment: LEAVE_TREATMENT_OPTIONS[0],
      deductionMultiplier: '1',
      notes: '',
    });

    const configHttp = new APIService(getBaseUrl(), '/api/v2/payroll/config');
    const taxHttp = new APIService(
      getBaseUrl(),
      '/api/v2/payroll/tax-brackets',
    );
    const statutoryHttp = new APIService(
      getBaseUrl(),
      '/api/v2/payroll/statutory-rules',
    );
    const leaveHttp = new APIService(
      getBaseUrl(),
      '/api/v2/payroll/leave-policies',
    );

    const findOption = (
      opts: Array<{id: string; label: string}>,
      id?: string,
    ) => opts.find((o) => o.id === id) ?? opts[0];

    const loadOrgConfig = () => {
      isOrgLoading.value = true;
      configHttp
        .getAll()
        .then((res) => {
          const d = res.data?.data;
          if (!d) return;
          orgForm.payFrequency = findOption(FREQUENCY_OPTIONS, d.payFrequency);
          orgForm.lwpDivisorMode = findOption(
            LWP_DIVISOR_OPTIONS,
            d.lwpDivisorMode,
          );
          orgForm.timeAttendanceSourceMode = findOption(
            TIME_SOURCE_OPTIONS,
            d.timeAttendanceSourceMode,
          );
          orgForm.standardShiftHours = String(d.standardShiftHours ?? 8);
          orgForm.overtimeMultiplier = String(d.overtimeMultiplier ?? 2);
          orgForm.overtimeEligibleMaxBasic = String(
            d.overtimeEligibleMaxBasic ?? 0,
          );
          orgForm.epfWageCeiling = String(d.epfWageCeiling ?? 15000);
          orgForm.epfCapAtCeiling = Boolean(d.epfCapAtCeiling);
          orgForm.esicGrossCeiling = String(d.esicGrossCeiling ?? 21000);
          orgForm.defaultPtStateCode = findOption(
            PT_STATE_OPTIONS,
            d.defaultPtStateCode,
          );
          orgForm.defaultTaxRegime = findOption(
            TAX_REGIME_OPTIONS,
            d.defaultTaxRegime,
          );
          orgForm.requireMakerCheckerApproval = Boolean(
            d.requireMakerCheckerApproval,
          );
        })
        .finally(() => {
          isOrgLoading.value = false;
        });
    };

    const onSaveOrgConfig = () => {
      isOrgLoading.value = true;
      configHttp
        .request({
          method: 'PUT',
          data: {
            payFrequency: orgForm.payFrequency?.id ?? 'MONTHLY',
            lwpDivisorMode: orgForm.lwpDivisorMode?.id ?? 'CALENDAR_DAYS',
            timeAttendanceSourceMode:
              orgForm.timeAttendanceSourceMode?.id ?? 'TIMESHEET_PRIMARY',
            standardShiftHours: Number(orgForm.standardShiftHours),
            overtimeMultiplier: Number(orgForm.overtimeMultiplier),
            overtimeEligibleMaxBasic: Number(orgForm.overtimeEligibleMaxBasic),
            epfWageCeiling: Number(orgForm.epfWageCeiling),
            epfCapAtCeiling: Boolean(orgForm.epfCapAtCeiling),
            esicGrossCeiling: Number(orgForm.esicGrossCeiling),
            defaultPtStateCode: orgForm.defaultPtStateCode?.id ?? 'KA',
            defaultTaxRegime: orgForm.defaultTaxRegime?.id ?? 'NEW_115BAC',
            requireMakerCheckerApproval: Boolean(
              orgForm.requireMakerCheckerApproval,
            ),
          },
        })
        .then(() => {
          $toast?.updateSuccess();
          loadOrgConfig();
        })
        .catch((err) => {
          $toast?.error({
            title: 'Save Config Failed',
            message: extractApiError(err),
          });
        })
        .finally(() => {
          isOrgLoading.value = false;
        });
    };

    const loadTaxBrackets = () => {
      isTaxLoading.value = true;
      taxHttp
        .getAll({financialYear: fyFilter.value || '2026-27'})
        .then((res) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rows: any[] = res.data?.data ?? [];
          taxBrackets.value = rows.map((t) => ({
            ...t,
            regimeLabel:
              t.taxRegime === 'NEW_115BAC' ? 'New (115BAC)' : 'Old Regime',
            rangeDisplay: `${formatInr(t.minIncome)} — ${
              t.maxIncome ? formatInr(t.maxIncome) : 'Above'
            }`,
            taxRateDisplay: `${t.taxRate}% (+${t.cessRate}% Cess)`,
            stdDeductionDisplay: formatInr(t.standardDeduction),
            statusText: t.isActive ? 'ACTIVE' : 'INACTIVE',
          }));
        })
        .finally(() => {
          isTaxLoading.value = false;
        });
    };

    const filteredTaxBrackets = computed(() => {
      const id = regimeFilter.value?.id;
      if (!id || id === 'ALL') return taxBrackets.value;
      return taxBrackets.value.filter((t) => t.taxRegime === id);
    });

    const loadStatutoryRules = () => {
      isStatutoryLoading.value = true;
      statutoryHttp
        .getAll()
        .then((res) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rows: any[] = res.data?.data ?? [];
          statutoryRules.value = rows.map((r) => ({
            ...r,
            slabDisplay: `${formatInr(r.slabMin)} — ${
              r.slabMax ? formatInr(r.slabMax) : 'Above'
            }`,
            employeeShare:
              Number(r.fixedEmployeeAmount || 0) > 0
                ? formatInr(r.fixedEmployeeAmount)
                : `${r.employeeRate}%`,
            employerOrFeb:
              r.ruleType === 'PT' && Number(r.februaryEmployeeAmount || 0) > 0
                ? `Feb PT: ${formatInr(r.februaryEmployeeAmount)}`
                : `${r.employerRate}%`,
            ceilingDisplay: r.wageCeiling ? formatInr(r.wageCeiling) : '-',
            statusText: r.isActive ? 'ACTIVE' : 'INACTIVE',
          }));
        })
        .finally(() => {
          isStatutoryLoading.value = false;
        });
    };

    const filteredStatutoryRules = computed(() => {
      const type = ruleTypeFilter.value?.id;
      if (!type || type === 'ALL') return statutoryRules.value;
      return statutoryRules.value.filter((r) => r.ruleType === type);
    });

    const loadLeavePolicies = () => {
      isLeaveLoading.value = true;
      leaveHttp
        .getAll()
        .then((res) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rows: any[] = res.data?.data ?? [];
          leavePolicies.value = rows.map((p) => ({
            ...p,
            treatmentText: formatStatusLabel(p.payrollPayTreatment),
          }));
        })
        .finally(() => {
          isLeaveLoading.value = false;
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onOpenEditBracket = (item: any) => {
      editingBracket.value = item;
      bracketForm.taxRate = String(item.taxRate ?? 0);
      bracketForm.cessRate = String(item.cessRate ?? 4);
      bracketForm.standardDeduction = String(item.standardDeduction ?? 0);
      bracketForm.isActive = Boolean(item.isActive);
    };

    const onSaveBracket = () => {
      if (!editingBracket.value) return;
      isSavingModal.value = true;
      taxHttp
        .update(editingBracket.value.id, {
          taxRate: Number(bracketForm.taxRate),
          cessRate: Number(bracketForm.cessRate),
          standardDeduction: Number(bracketForm.standardDeduction),
          isActive: Boolean(bracketForm.isActive),
        })
        .then(() => {
          $toast?.updateSuccess();
          editingBracket.value = null;
          loadTaxBrackets();
        })
        .catch((err) => {
          $toast?.error({
            title: 'Update Slab Failed',
            message: extractApiError(err),
          });
        })
        .finally(() => {
          isSavingModal.value = false;
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onOpenEditLeave = (item: any) => {
      editingLeavePolicy.value = item;
      leaveForm.payrollPayTreatment = findOption(
        LEAVE_TREATMENT_OPTIONS,
        item.payrollPayTreatment,
      );
      leaveForm.deductionMultiplier = String(item.deductionMultiplier ?? 1);
      leaveForm.notes = item.notes ?? '';
    };

    const onSaveLeavePolicy = () => {
      if (!editingLeavePolicy.value) return;
      isSavingModal.value = true;
      leaveHttp
        .update(editingLeavePolicy.value.leaveTypeId, {
          payrollPayTreatment: leaveForm.payrollPayTreatment?.id ?? 'PAID',
          deductionMultiplier: Number(leaveForm.deductionMultiplier),
          notes: leaveForm.notes || null,
        })
        .then(() => {
          $toast?.updateSuccess();
          editingLeavePolicy.value = null;
          loadLeavePolicies();
        })
        .catch((err) => {
          $toast?.error({
            title: 'Update Leave Policy Failed',
            message: extractApiError(err),
          });
        })
        .finally(() => {
          isSavingModal.value = false;
        });
    };

    const taxHeaders = computed(() => {
      const cols: Array<Record<string, unknown>> = [
        {
          name: 'regimeLabel',
          title: 'Tax Regime',
          slot: 'title',
          style: {flex: 1.5},
        },
        {name: 'slabOrder', title: 'Slab #', style: {flex: 0.7}},
        {name: 'rangeDisplay', title: 'Income Range', style: {flex: 2.5}},
        {name: 'taxRateDisplay', title: 'Rate + Cess', style: {flex: 1.5}},
        {name: 'stdDeductionDisplay', title: 'Std Ded.', style: {flex: 1.2}},
        {name: 'statusText', title: 'Status', style: {flex: 1}},
      ];
      if (canEditConfig.value) {
        cols.push({
          name: 'actions',
          slot: 'action',
          title: 'Actions',
          style: {flex: 1},
          cellType: 'oxd-table-cell-actions',
          cellConfig: {
            edit: {onClick: onOpenEditBracket, props: {name: 'pencil-fill'}},
          },
        });
      }
      return cols;
    });

    const statutoryHeaders = [
      {name: 'ruleType', title: 'Rule', slot: 'title', style: {flex: 1}},
      {name: 'stateCode', title: 'Jurisdiction', style: {flex: 1}},
      {name: 'slabDisplay', title: 'Wage Slab', style: {flex: 2.5}},
      {name: 'employeeShare', title: 'Employee Share', style: {flex: 1.5}},
      {name: 'employerOrFeb', title: 'Employer / Feb PT', style: {flex: 1.5}},
      {name: 'ceilingDisplay', title: 'Ceiling', style: {flex: 1.2}},
      {name: 'effectiveFrom', title: 'Effective From', style: {flex: 1.2}},
      {name: 'statusText', title: 'Status', style: {flex: 1}},
    ];

    const leaveHeaders = computed(() => {
      const cols: Array<Record<string, unknown>> = [
        {
          name: 'leaveTypeName',
          title: 'Leave Type',
          slot: 'title',
          style: {flex: 2},
        },
        {name: 'treatmentText', title: 'Pay Treatment', style: {flex: 1.5}},
        {name: 'deductionMultiplier', title: 'Multiplier', style: {flex: 1}},
        {name: 'notes', title: 'Notes', style: {flex: 3}},
      ];
      if (canEditConfig.value) {
        cols.push({
          name: 'actions',
          slot: 'action',
          title: 'Actions',
          style: {flex: 1},
          cellType: 'oxd-table-cell-actions',
          cellConfig: {
            edit: {onClick: onOpenEditLeave, props: {name: 'pencil-fill'}},
          },
        });
      }
      return cols;
    });

    onMounted(() => {
      loadOrgConfig();
      loadTaxBrackets();
      loadStatutoryRules();
      loadLeavePolicies();
    });

    const validatePos = (v: string) =>
      (!Number.isNaN(Number(v)) && Number(v) > 0) || 'Must be > 0';
    const validateZeroPos = (v: string) =>
      (!Number.isNaN(Number(v)) && Number(v) >= 0) || 'Must be >= 0';

    return {
      activeTab,
      isOrgLoading,
      isTaxLoading,
      isStatutoryLoading,
      isLeaveLoading,
      isSavingModal,
      canEditConfig,
      orgForm,
      frequencyOptions: FREQUENCY_OPTIONS,
      lwpDivisorOptions: LWP_DIVISOR_OPTIONS,
      timeSourceOptions: TIME_SOURCE_OPTIONS,
      ptStateOptions: PT_STATE_OPTIONS,
      taxRegimeOptions: TAX_REGIME_OPTIONS,
      taxRegimeFilterOptions: [
        {id: 'ALL', label: 'All Regimes'},
        ...TAX_REGIME_OPTIONS,
      ],
      ruleTypeOptions: RULE_TYPE_OPTIONS,
      leaveTreatmentOptions: LEAVE_TREATMENT_OPTIONS,
      fyFilter,
      regimeFilter,
      filteredTaxBrackets,
      taxHeaders,
      ruleTypeFilter,
      filteredStatutoryRules,
      statutoryHeaders,
      leavePolicies,
      leaveHeaders,
      editingBracket,
      bracketForm,
      editingLeavePolicy,
      leaveForm,
      onSaveOrgConfig,
      loadTaxBrackets,
      onSaveBracket,
      onSaveLeavePolicy,
      rules: {
        positiveNum: [required, validatePos],
        zeroOrPositiveNum: [required, validateZeroPos],
        notes: [shouldNotExceedCharLength(255)],
      },
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/orangehrmPayrollPlugin/styles/payroll.scss';

.orangehrm-payroll-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.25rem;
}
</style>
