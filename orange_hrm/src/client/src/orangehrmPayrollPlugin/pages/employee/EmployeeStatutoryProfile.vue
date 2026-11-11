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
        <div>
          <oxd-text tag="h6" class="orangehrm-main-title">
            India Statutory, Tax Regime &amp; Disbursement Profile
          </oxd-text>
          <oxd-text type="subtitle-2">
            PAN, EPFO UAN, ESIC IP, State Professional Tax, CTC Split &amp;
            Masked Bank Account
          </oxd-text>
        </div>
        <payroll-status-badge :status="form.taxRegime?.id || 'NEW_115BAC'" />
      </div>
      <oxd-divider />

      <oxd-form :loading="isLoading" @submit-valid="onSave">
        <oxd-text tag="h6" class="orangehrm-sub-title">
          Statutory Identifiers &amp; Applicability
        </oxd-text>
        <oxd-form-row>
          <oxd-grid :cols="3" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.panNumber"
                label="PAN Number"
                placeholder="ABCDE1234F"
                :rules="rules.pan"
                :disabled="!canEdit"
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.uanNumber"
                label="EPF UAN (12 Digits)"
                placeholder="100123456789"
                :disabled="!canEdit"
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.esicIpNumber"
                label="ESIC IP Number"
                :disabled="!canEdit"
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>

        <oxd-form-row>
          <oxd-grid :cols="3" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.ptStateCode"
                type="select"
                label="Professional Tax State"
                :options="ptStateOptions"
                :disabled="!canEdit"
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.taxRegime"
                type="select"
                label="Income Tax Regime"
                :options="taxRegimeOptions"
                :disabled="!canEdit"
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>

        <oxd-form-row>
          <oxd-grid :cols="4" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <div class="orangehrm-payroll-switch-row">
                <oxd-text tag="p" style="font-size: 0.85rem">
                  EPF Opted In
                </oxd-text>
                <oxd-switch-input
                  v-model="form.epfOptedIn"
                  :disabled="!canEdit"
                />
              </div>
            </oxd-grid-item>
            <oxd-grid-item>
              <div class="orangehrm-payroll-switch-row">
                <oxd-text tag="p" style="font-size: 0.85rem">
                  Cap EPF at ₹15k
                </oxd-text>
                <oxd-switch-input
                  v-model="form.epfRestrictToCeiling"
                  :disabled="!canEdit"
                />
              </div>
            </oxd-grid-item>
            <oxd-grid-item>
              <div class="orangehrm-payroll-switch-row">
                <oxd-text tag="p" style="font-size: 0.85rem">
                  ESIC Applicable
                </oxd-text>
                <oxd-switch-input
                  v-model="form.esicApplicable"
                  :disabled="!canEdit"
                />
              </div>
            </oxd-grid-item>
            <oxd-grid-item>
              <div class="orangehrm-payroll-switch-row">
                <oxd-text tag="p" style="font-size: 0.85rem">
                  PT Applicable
                </oxd-text>
                <oxd-switch-input
                  v-model="form.ptApplicable"
                  :disabled="!canEdit"
                />
              </div>
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>

        <oxd-divider />
        <oxd-text tag="h6" class="orangehrm-sub-title">
          CTC Salary Split &amp; Chapter VI-A Tax Declarations (INR Annual)
        </oxd-text>

        <oxd-form-row>
          <oxd-grid :cols="3" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.basicPercentOfCtc"
                label="Basic (% of Monthly Gross)"
                :rules="rules.positiveNum"
                :disabled="!canEdit"
                required
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.hraPercentOfBasic"
                label="HRA (% of Basic)"
                :rules="rules.zeroOrPositiveNum"
                :disabled="!canEdit"
                required
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.declared80c"
                label="Sec 80C Declaration (Old Regime)"
                :rules="rules.zeroOrPositiveNum"
                :disabled="!canEdit"
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>

        <oxd-form-row>
          <oxd-grid :cols="3" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.declared80d"
                label="Sec 80D Medical (Old Regime)"
                :rules="rules.zeroOrPositiveNum"
                :disabled="!canEdit"
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.declaredHraAnnual"
                label="Annual HRA Exemption (Old Regime)"
                :rules="rules.zeroOrPositiveNum"
                :disabled="!canEdit"
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.otherExemptions"
                label="Other Exempt Allowances"
                :rules="rules.zeroOrPositiveNum"
                :disabled="!canEdit"
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>

        <oxd-divider />
        <oxd-text tag="h6" class="orangehrm-sub-title">
          Bank Disbursement Account (PII Masked on Read)
        </oxd-text>

        <oxd-form-row>
          <oxd-grid :cols="3" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.bankAccountHolder"
                label="Account Holder Name"
                :disabled="!canEdit"
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.bankName"
                label="Bank Name"
                :disabled="!canEdit"
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.bankIfscCode"
                label="IFSC Code (11 Chars)"
                placeholder="HDFC0001234"
                :rules="rules.ifsc"
                :disabled="!canEdit"
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>

        <oxd-form-row>
          <oxd-grid :cols="2" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                :model-value="maskedBankDisplay"
                label="Registered Account (Masked)"
                disabled
              />
            </oxd-grid-item>
            <oxd-grid-item v-if="canEdit">
              <oxd-input-field
                v-model="form.newBankAccountNumber"
                label="Set / Replace Account Number"
                placeholder="Leave blank to retain current account"
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>

        <template v-if="canEdit">
          <oxd-divider />
          <oxd-form-actions>
            <submit-button />
          </oxd-form-actions>
        </template>
      </oxd-form>
    </div>
  </edit-employee-layout>
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
import {OxdSwitchInput} from '@ohrm/oxd';
import {APIService} from '@/core/util/services/api.service';
import {required} from '@ohrm/core/util/validation/rules';
import EditEmployeeLayout from '@/orangehrmPimPlugin/components/EditEmployeeLayout.vue';
import PayrollStatusBadge from '@/orangehrmPayrollPlugin/components/PayrollStatusBadge.vue';
import {
  extractApiError,
  getBaseUrl,
} from '@/orangehrmPayrollPlugin/util/formatInr';
import {usePayrollPermissions} from '@/orangehrmPayrollPlugin/util/usePayrollPermissions';

const PT_STATES = [
  {id: 'KA', label: 'Karnataka (KA)'},
  {id: 'MH', label: 'Maharashtra (MH)'},
  {id: 'WB', label: 'West Bengal (WB)'},
];

const TAX_REGIMES = [
  {id: 'NEW_115BAC', label: 'New Tax Regime (Sec 115BAC)'},
  {id: 'OLD', label: 'Old Tax Regime (With Ch. VI-A)'},
];

export default defineComponent({
  name: 'EmployeeStatutoryProfile',
  components: {
    'edit-employee-layout': EditEmployeeLayout,
    'oxd-switch-input': OxdSwitchInput,
    'payroll-status-badge': PayrollStatusBadge,
  },
  props: {
    empNumber: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const vm = getCurrentInstance();
    const $toast = vm?.appContext.config.globalProperties.$toast;
    const {canUpdate} = usePayrollPermissions();
    const isLoading = ref(false);

    const canEdit = computed(() => canUpdate('payroll_statutory_profile'));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = reactive<Record<string, any>>({
      panNumber: '',
      uanNumber: '',
      esicIpNumber: '',
      ptStateCode: PT_STATES[0],
      taxRegime: TAX_REGIMES[0],
      epfOptedIn: true,
      epfRestrictToCeiling: true,
      esicApplicable: false,
      ptApplicable: true,
      basicPercentOfCtc: '50',
      hraPercentOfBasic: '40',
      declared80c: '0',
      declared80d: '0',
      declaredHraAnnual: '0',
      otherExemptions: '0',
      bankAccountHolder: '',
      bankName: '',
      bankIfscCode: '',
      maskedBankAccountNumber: '',
      hasBankAccount: false,
      newBankAccountNumber: '',
    });

    const maskedBankDisplay = computed(() =>
      form.hasBankAccount
        ? form.maskedBankAccountNumber || 'Configured (Masked)'
        : 'Not Configured',
    );

    const http = new APIService(
      getBaseUrl(),
      `/api/v2/payroll/employees/${props.empNumber}/statutory-profile`,
    );

    const findOpt = (opts: Array<{id: string; label: string}>, id?: string) =>
      opts.find((o) => o.id === id) ?? opts[0];

    const loadProfile = () => {
      isLoading.value = true;
      http
        .getAll()
        .then((res) => {
          const d = res.data?.data;
          if (!d) return;
          form.panNumber = d.panNumber ?? '';
          form.uanNumber = d.uanNumber ?? '';
          form.esicIpNumber = d.esicIpNumber ?? '';
          form.ptStateCode = findOpt(PT_STATES, d.ptStateCode);
          form.taxRegime = findOpt(TAX_REGIMES, d.taxRegime);
          form.epfOptedIn = Boolean(d.epfOptedIn);
          form.epfRestrictToCeiling = Boolean(d.epfRestrictToCeiling);
          form.esicApplicable = Boolean(d.esicApplicable);
          form.ptApplicable = Boolean(d.ptApplicable);
          form.basicPercentOfCtc = String(d.basicPercentOfCtc ?? 50);
          form.hraPercentOfBasic = String(d.hraPercentOfBasic ?? 40);
          form.declared80c = String(d.declared80c ?? 0);
          form.declared80d = String(d.declared80d ?? 0);
          form.declaredHraAnnual = String(d.declaredHraAnnual ?? 0);
          form.otherExemptions = String(d.otherExemptions ?? 0);
          form.bankAccountHolder = d.bankAccountHolder ?? '';
          form.bankName = d.bankName ?? '';
          form.bankIfscCode = d.bankIfscCode ?? '';
          form.maskedBankAccountNumber = d.maskedBankAccountNumber ?? '';
          form.hasBankAccount = Boolean(d.hasBankAccount);
          form.newBankAccountNumber = '';
        })
        .finally(() => {
          isLoading.value = false;
        });
    };

    onMounted(loadProfile);

    const onSave = () => {
      isLoading.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: Record<string, any> = {
        panNumber: form.panNumber ? form.panNumber.toUpperCase().trim() : null,
        uanNumber: form.uanNumber ? form.uanNumber.trim() : null,
        esicIpNumber: form.esicIpNumber ? form.esicIpNumber.trim() : null,
        ptStateCode: form.ptStateCode?.id ?? 'KA',
        taxRegime: form.taxRegime?.id ?? 'NEW_115BAC',
        epfOptedIn: Boolean(form.epfOptedIn),
        epfRestrictToCeiling: Boolean(form.epfRestrictToCeiling),
        esicApplicable: Boolean(form.esicApplicable),
        ptApplicable: Boolean(form.ptApplicable),
        basicPercentOfCtc: Number(form.basicPercentOfCtc),
        hraPercentOfBasic: Number(form.hraPercentOfBasic),
        declared80c: Number(form.declared80c || 0),
        declared80d: Number(form.declared80d || 0),
        declaredHraAnnual: Number(form.declaredHraAnnual || 0),
        otherExemptions: Number(form.otherExemptions || 0),
        bankAccountHolder: form.bankAccountHolder
          ? form.bankAccountHolder.trim()
          : null,
        bankName: form.bankName ? form.bankName.trim() : null,
        bankIfscCode: form.bankIfscCode
          ? form.bankIfscCode.toUpperCase().trim()
          : null,
      };
      if (form.newBankAccountNumber && form.newBankAccountNumber.trim()) {
        payload.bankAccountNumber = form.newBankAccountNumber.trim();
      }

      http
        .request({method: 'PUT', data: payload})
        .then(() => {
          $toast?.updateSuccess();
          loadProfile();
        })
        .catch((err) => {
          $toast?.error({
            title: 'Save Profile Failed',
            message: extractApiError(err),
          });
        })
        .finally(() => {
          isLoading.value = false;
        });
    };

    return {
      isLoading,
      canEdit,
      form,
      maskedBankDisplay,
      ptStateOptions: PT_STATES,
      taxRegimeOptions: TAX_REGIMES,
      onSave,
      rules: {
        pan: [
          (v: string) =>
            !v ||
            !v.trim() ||
            /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/.test(v.trim()) ||
            'Invalid Indian PAN format (e.g. ABCDE1234F)',
        ],
        ifsc: [
          (v: string) =>
            !v ||
            !v.trim() ||
            /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(v.trim()) ||
            'Invalid 11-char IFSC format (e.g. HDFC0001234)',
        ],
        positiveNum: [
          required,
          (v: string) =>
            (!Number.isNaN(Number(v)) && Number(v) > 0) || 'Must be > 0',
        ],
        zeroOrPositiveNum: [
          (v: string) =>
            v === '' ||
            v === null ||
            v === undefined ||
            (!Number.isNaN(Number(v)) && Number(v) >= 0) ||
            'Must be >= 0',
        ],
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
  padding: 0.35rem 0;
}
</style>
