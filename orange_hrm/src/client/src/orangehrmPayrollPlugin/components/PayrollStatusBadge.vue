<!--
/**
 * OrangeHRM is a comprehensive Human Resource Management (HRM) System that captures
 * all the essential functionalities required for any enterprise.
 * Copyright (C) 2006 OrangeHRM Inc., http://www.orangehrm.com
 */
-->
<template>
  <span class="orangehrm-payroll-badge" :class="`--${tone}`">
    {{ label }}
  </span>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {formatStatusLabel, getStatusTone} from '../util/formatInr';

export default defineComponent({
  name: 'PayrollStatusBadge',
  props: {
    status: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const tone = computed(() => getStatusTone(props.status));
    const label = computed(() => formatStatusLabel(props.status));
    return {tone, label};
  },
});
</script>

<style lang="scss" scoped>
@import '@/orangehrmPayrollPlugin/styles/payroll.scss';
</style>
