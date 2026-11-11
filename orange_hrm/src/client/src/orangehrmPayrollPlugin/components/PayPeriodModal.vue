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
      :style="{width: '90%', maxWidth: '580px'}"
      @update:show="onClose"
    >
      <div class="orangehrm-modal-header">
        <oxd-text type="card-title">
          {{ period ? 'Edit Pay Period' : 'Create Pay Period' }}
        </oxd-text>
      </div>
      <oxd-divider />
      <oxd-form :loading="isSaving" @submit-valid="onSave">
        <oxd-form-row>
          <oxd-input-field
            v-model="form.name"
            label="Pay Period Name"
            placeholder="e.g. November 2026"
            :rules="rules.name"
            required
          />
        </oxd-form-row>

        <oxd-form-row>
          <oxd-grid :cols="2" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <date-input
                v-model="form.startDate"
                label="Start Date"
                :rules="rules.date"
                required
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <date-input
                v-model="form.endDate"
                label="End Date"
                :rules="rules.date"
                required
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>

        <oxd-form-row>
          <oxd-grid :cols="2" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <date-input
                v-model="form.payDate"
                label="Pay Date (Disbursement)"
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.standardWorkingDays"
                label="Standard Working Days"
                :rules="rules.workingDays"
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>

        <oxd-form-row>
          <oxd-grid :cols="2" class="orangehrm-full-width-grid">
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.financialYear"
                label="Financial Year (India FY)"
                placeholder="2026-27 (auto if blank)"
              />
            </oxd-grid-item>
            <oxd-grid-item>
              <oxd-input-field
                v-model="form.frequency"
                type="select"
                label="Frequency"
                :options="frequencyOptions"
              />
            </oxd-grid-item>
          </oxd-grid>
        </oxd-form-row>

        <oxd-divider />
        <oxd-form-actions>
          <required-text />
          <oxd-button
            type="button"
            display-type="ghost"
            :label="$t('general.cancel')"
            @click="onClose"
          />
          <submit-button />
        </oxd-form-actions>
      </oxd-form>
    </oxd-dialog>
  </teleport>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, reactive, ref} from 'vue';
import {OxdDialog} from '@ohrm/oxd';
import {APIService} from '@/core/util/services/api.service';
import {
  required,
  shouldNotExceedCharLength,
  validDateFormat,
} from '@ohrm/core/util/validation/rules';
import useDateFormat from '@/core/util/composable/useDateFormat';
import {getBaseUrl} from '@/orangehrmPayrollPlugin/util/formatInr';

const FREQUENCY_OPTIONS = [
  {id: 'MONTHLY', label: 'Monthly'},
  {id: 'BI_WEEKLY', label: 'Bi-Weekly'},
];

export default defineComponent({
  name: 'PayPeriodModal',
  components: {
    'oxd-dialog': OxdDialog,
  },
  props: {
    period: {
      type: Object,
      default: null,
    },
  },
  emits: ['close', 'saved'],
  setup(props, {emit}) {
    const vm = getCurrentInstance();
    const $toast = vm?.appContext.config.globalProperties.$toast;
    const {userDateFormat} = useDateFormat();
    const isSaving = ref(false);
    const http = new APIService(getBaseUrl(), '/api/v2/payroll/pay-periods');

    const form = reactive({
      name: props.period?.name ?? '',
      startDate: props.period?.startDate ?? '',
      endDate: props.period?.endDate ?? '',
      payDate: props.period?.payDate ?? '',
      standardWorkingDays: String(props.period?.standardWorkingDays ?? '22'),
      financialYear: props.period?.financialYear ?? '',
      frequency:
        FREQUENCY_OPTIONS.find((o) => o.id === props.period?.frequency) ??
        FREQUENCY_OPTIONS[0],
    });

    const onSave = () => {
      isSaving.value = true;
      const payload = {
        name: form.name,
        startDate: form.startDate,
        endDate: form.endDate,
        payDate: form.payDate || form.endDate,
        standardWorkingDays: Number(form.standardWorkingDays || 22),
        financialYear: form.financialYear || null,
        frequency: form.frequency?.id ?? 'MONTHLY',
        jurisdictionCode: 'IN',
        currencyId: 'INR',
      };

      const req = props.period?.id
        ? http.update(props.period.id, payload)
        : http.create(payload);

      req
        .then(() => {
          props.period?.id ? $toast?.updateSuccess() : $toast?.saveSuccess();
          emit('saved');
          emit('close');
        })
        .finally(() => {
          isSaving.value = false;
        });
    };

    const onClose = () => emit('close');

    return {
      isSaving,
      form,
      frequencyOptions: FREQUENCY_OPTIONS,
      onSave,
      onClose,
      rules: {
        name: [required, shouldNotExceedCharLength(100)],
        date: [required, validDateFormat(userDateFormat)],
        workingDays: [
          (v: string) =>
            !v || Number(v) > 0 || 'Working days must be greater than zero',
        ],
      },
    };
  },
});
</script>
