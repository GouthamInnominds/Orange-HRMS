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
        {{ $t('payroll.my_salary_slips') }}
      </oxd-text>
      <oxd-divider />

      <oxd-table
        :loading="isLoading"
        :data="slips"
        class="orangehrm-salary-slips-table"
      >
        <template #columns>
          <oxd-table-column :label="$t('payroll.slip_number')" />
          <oxd-table-column :label="$t('payroll.pay_period')" />
          <oxd-table-column :label="$t('general.actions')" />
        </template>
      </oxd-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MySalarySlips',

  props: {
    http: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      slips: [],
    };
  },

  created() {
    this.fetchSlips();
  },

  methods: {
    fetchSlips() {
      this.isLoading = true;
      this.http
        .request({
          method: 'GET',
          url: '/api/v2/payroll/my-salary-slips',
        })
        .then((response) => {
          this.slips = response.data || [];
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    downloadPdf(slipId) {
      window.open(`/api/v2/payroll/salary-slips/${slipId}/download`, '_blank');
    },
  },
};
</script>
