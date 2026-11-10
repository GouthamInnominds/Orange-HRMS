<!--
/**
 * OrangeHRM is a comprehensive Human Resource Management (HRM) System that captures
 * all the essential functionalities required for any enterprise.
 * Copyright (C) 2006 OrangeHRM Inc., http://www.orangehrm.com
 */
-->

<template>
  <div class="orangehrm-background-container">
    <div class="orangehrm-card-container">
      <oxd-text tag="h6" class="orangehrm-main-title">
        {{ $t('payroll.processing_dashboard') }}
      </oxd-text>
      <oxd-divider />

      <div class="orangehrm-header-container">
        <oxd-button
          type="button"
          display-type="secondary"
          :label="$t('payroll.calculate_batch')"
          @click="onCalculateBatch"
        />
        <oxd-button
          type="button"
          display-type="success"
          :label="$t('payroll.lock_period')"
          @click="onLockPeriod"
        />
      </div>

      <oxd-table
        :loading="isLoading"
        :data="payrollRecords"
        class="orangehrm-payroll-table"
      >
        <template #columns>
          <oxd-table-column :label="$t('general.employee_name')" />
          <oxd-table-column :label="$t('payroll.gross_salary')" />
          <oxd-table-column :label="$t('payroll.total_tax')" />
          <oxd-table-column :label="$t('payroll.net_salary')" />
          <oxd-table-column :label="$t('general.status')" />
          <oxd-table-column :label="$t('general.actions')" />
        </template>
      </oxd-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayrollProcessing',

  props: {
    http: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      payrollRecords: [],
      activePeriodId: 1,
    };
  },

  created() {
    this.fetchRecords();
  },

  methods: {
    fetchRecords() {
      this.isLoading = true;
      this.http
        .request({
          method: 'GET',
          url: `/api/v2/payroll/pay-periods/${this.activePeriodId}/records`,
        })
        .then((response) => {
          this.payrollRecords = response.data?.data || [];
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    onCalculateBatch() {
      this.isLoading = true;
      this.http
        .request({
          method: 'POST',
          url: `/api/v2/payroll/pay-periods/${this.activePeriodId}/calculate`,
        })
        .then(() => {
          this.fetchRecords();
        });
    },

    onLockPeriod() {
      this.http.request({
        method: 'PUT',
        url: `/api/v2/payroll/pay-periods/${this.activePeriodId}/lock`,
      });
    },
  },
};
</script>
