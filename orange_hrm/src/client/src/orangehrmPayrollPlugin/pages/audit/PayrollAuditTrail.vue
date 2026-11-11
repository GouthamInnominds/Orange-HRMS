<!--
/**
 * OrangeHRM is a comprehensive Human Resource Management (HRM) System that captures
 * all the essential functionalities required for any enterprise.
 * Copyright (C) 2006 OrangeHRM Inc., http://www.orangehrm.com
 */
-->
<template>
  <oxd-table-filter filter-title="Immutable Payroll Audit Trail">
    <oxd-form @submit-valid="execQuery">
      <oxd-form-row>
        <oxd-grid :cols="3" class="orangehrm-full-width-grid">
          <oxd-grid-item>
            <oxd-input-field
              v-model="filters.eventType"
              label="Event Type"
              placeholder="e.g. RUN_LOCKED, BATCH_CALCULATED"
            />
          </oxd-grid-item>
          <oxd-grid-item>
            <oxd-input-field
              v-model="filters.payrollRunId"
              label="Payroll Run ID"
              placeholder="e.g. 1"
            />
          </oxd-grid-item>
          <oxd-grid-item>
            <oxd-input-field
              v-model="filters.empNumber"
              label="Employee Number"
              placeholder="e.g. 2"
            />
          </oxd-grid-item>
        </oxd-grid>
      </oxd-form-row>
      <oxd-divider />
      <oxd-form-actions>
        <oxd-button
          display-type="ghost"
          :label="$t('general.reset')"
          @click="onClickReset"
        />
        <oxd-button
          class="orangehrm-left-space"
          display-type="secondary"
          :label="$t('general.search')"
          type="submit"
        />
      </oxd-form-actions>
    </oxd-form>
  </oxd-table-filter>

  <br />

  <div class="orangehrm-paper-container">
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
      v-if="selectedEvent"
      :style="{width: '92%', maxWidth: '680px'}"
      @update:show="selectedEvent = null"
    >
      <div class="orangehrm-modal-header">
        <oxd-text type="card-title">
          Audit Event #{{ selectedEvent.id }} — {{ selectedEvent.eventType }}
        </oxd-text>
      </div>
      <oxd-divider />
      <oxd-text type="subtitle-2">
        Actor: {{ selectedEvent.actorUsername }} · At:
        {{ selectedEvent.occurredAt }} · IP:
        {{ selectedEvent.ipAddress || 'N/A' }}
      </oxd-text>
      <div class="orangehrm-payroll-breakdown-grid">
        <div>
          <oxd-text tag="h6" class="orangehrm-sub-title">Before State</oxd-text>
          <pre class="orangehrm-payroll-json-box">{{
            selectedEvent.before
              ? JSON.stringify(selectedEvent.before, null, 2)
              : 'null'
          }}</pre>
        </div>
        <div>
          <oxd-text tag="h6" class="orangehrm-sub-title">After State</oxd-text>
          <pre class="orangehrm-payroll-json-box">{{
            selectedEvent.after
              ? JSON.stringify(selectedEvent.after, null, 2)
              : 'null'
          }}</pre>
        </div>
      </div>
      <oxd-divider />
      <oxd-form-actions>
        <oxd-button
          display-type="ghost"
          :label="$t('general.close')"
          @click="selectedEvent = null"
        />
      </oxd-form-actions>
    </oxd-dialog>
  </teleport>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import {OxdDialog} from '@ohrm/oxd';
import {APIService} from '@/core/util/services/api.service';
import usePaginate from '@ohrm/core/util/composable/usePaginate';
import useSort from '@ohrm/core/util/composable/useSort';
import {getBaseUrl} from '@/orangehrmPayrollPlugin/util/formatInr';

export default defineComponent({
  name: 'PayrollAuditTrail',
  components: {
    'oxd-dialog': OxdDialog,
  },
  setup() {
    const filters = ref({
      eventType: '',
      payrollRunId: '',
      empNumber: '',
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selectedEvent = ref<any>(null);

    const {sortDefinition, sortField, sortOrder, onSort} = useSort({
      sortDefinition: {'evt.id': 'DESC'},
    });

    const query = computed(() => ({
      eventType: filters.value.eventType || null,
      payrollRunId: filters.value.payrollRunId
        ? Number(filters.value.payrollRunId)
        : null,
      empNumber: filters.value.empNumber
        ? Number(filters.value.empNumber)
        : null,
      sortField: sortField.value,
      sortOrder: sortOrder.value,
    }));

    const http = new APIService(getBaseUrl(), '/api/v2/payroll/audit-events');

    const {
      showPaginator,
      currentPage,
      total,
      pages,
      response,
      isLoading,
      execQuery,
    } = usePaginate(http, {
      query,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      normalizer: (data: any[]) =>
        data.map((e) => ({
          ...e,
          entityRef: e.entityId
            ? `${e.entityType} #${e.entityId}`
            : e.entityType,
          runDisplay: e.payrollRunId ? `Run #${e.payrollRunId}` : '-',
        })),
    });
    onSort(execQuery);

    const onClickReset = () => {
      filters.value = {eventType: '', payrollRunId: '', empNumber: ''};
      execQuery();
    };

    const headers = [
      {
        name: 'occurredAt',
        title: 'Timestamp',
        sortField: 'evt.occurredAt',
        style: {flex: 2},
      },
      {
        name: 'eventType',
        title: 'Event',
        slot: 'title',
        sortField: 'evt.eventType',
        style: {flex: 2},
      },
      {name: 'actorUsername', title: 'Actor', style: {flex: 1}},
      {name: 'entityRef', title: 'Entity', style: {flex: 2}},
      {name: 'runDisplay', title: 'Run', style: {flex: 1}},
      {
        name: 'actions',
        slot: 'action',
        title: 'Diff',
        style: {flex: 1},
        cellType: 'oxd-table-cell-actions',
        cellConfig: {
          inspect: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick: (item: any) => {
              selectedEvent.value = item;
            },
            props: {name: 'eye-fill'},
          },
        },
      },
    ];

    return {
      filters,
      selectedEvent,
      sortDefinition,
      showPaginator,
      currentPage,
      total,
      pages,
      items: response,
      isLoading,
      headers,
      execQuery,
      onClickReset,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/orangehrmPayrollPlugin/styles/payroll.scss';
</style>
