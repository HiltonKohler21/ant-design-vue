<docs>
---
order: 27
title:
  en-US: Summary
  zh-CN: 总结栏
---

## zh-CN

通过 `summary` 设置总结栏。使用 `a-table-summary-cell` 同步 Column 的固定状态。你可以通过配置 `a-table-summary` 的 `fixed` 属性使其固定。

## en-US

Set summary content by `summary` prop. Sync column fixed status with `a-table-summary-cell`. You can fixed it by set `a-table-summary` `fixed` prop.

</docs>

<template>
  <a-flex vertical gap="middle" class="components-table-demo-summary">
    <a-table :columns="columns" :data-source="data" :pagination="false" bordered>
      <template #summary>
        <a-table-summary-row>
          <a-table-summary-cell :index="0">Total</a-table-summary-cell>
          <a-table-summary-cell :index="1">
            <a-typography-text type="danger">{{ totals.totalBorrow }}</a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell :index="2">
            <a-typography-text>{{ totals.totalRepayment }}</a-typography-text>
          </a-table-summary-cell>
        </a-table-summary-row>
        <a-table-summary-row>
          <a-table-summary-cell :index="0">Balance</a-table-summary-cell>
          <a-table-summary-cell :index="1" :col-span="2">
            <a-typography-text type="danger">
              {{ totals.totalBorrow - totals.totalRepayment }}
            </a-typography-text>
          </a-table-summary-cell>
        </a-table-summary-row>
      </template>
    </a-table>

    <a-table
      :columns="fixedColumns"
      :data-source="fixedData"
      :pagination="false"
      :scroll="{ x: 2000, y: 500 }"
      bordered
    >
      <template #summary>
        <a-table-summary fixed>
          <a-table-summary-row>
            <a-table-summary-cell :index="0">Summary</a-table-summary-cell>
            <a-table-summary-cell :index="1">This is a summary content</a-table-summary-cell>
          </a-table-summary-row>
        </a-table-summary>
      </template>
    </a-table>
  </a-flex>
</template>

<script lang="ts" setup>
import type { TableColumnsType } from '@hiltonkohler21/ant-design-vue';
import { computed, ref } from 'vue';

const columns = ref<TableColumnsType>([
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Borrow',
    dataIndex: 'borrow',
  },
  {
    title: 'Repayment',
    dataIndex: 'repayment',
  },
]);

const data = ref([
  {
    key: '1',
    name: 'John Brown',
    borrow: 10,
    repayment: 33,
  },
  {
    key: '2',
    name: 'Jim Green',
    borrow: 100,
    repayment: 0,
  },
  {
    key: '3',
    name: 'Joe Black',
    borrow: 10,
    repayment: 10,
  },
  {
    key: '4',
    name: 'Jim Red',
    borrow: 75,
    repayment: 45,
  },
]);

const fixedColumns = ref<TableColumnsType>([
  {
    title: 'Name',
    dataIndex: 'name',
    fixed: true,
    width: 100,
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
]);

const fixedData = ref(
  Array.from({ length: 20 }, (_, i) => ({
    key: i,
    name: ['Light', 'Bamboo', 'Little'][i % 3],
    description: 'Everything that has a beginning, has an end.',
  })),
);

const totals = computed(() => {
  let totalBorrow = 0;
  let totalRepayment = 0;

  data.value.forEach(({ borrow, repayment }) => {
    totalBorrow += borrow;
    totalRepayment += repayment;
  });
  return { totalBorrow, totalRepayment };
});
</script>

<style scoped>
.components-table-demo-summary :deep(tfoot th),
.components-table-demo-summary :deep(tfoot td) {
  background: var(--ant-color-fill-alter, #fafafa);
}
</style>
