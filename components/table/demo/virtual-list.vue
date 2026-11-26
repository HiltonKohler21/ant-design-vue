<docs>
---
order: 28
version: 4.3.0
title:
  zh-CN: 虚拟列表
  en-US: Virtual list
---

## zh-CN

通过设置 `virtual` 与 `scroll.y` 开启虚拟滚动，高效渲染大数据表格，支持 `scrollTo` 快速滚动到指定行。

## en-US

Enable virtual scrolling via `virtual` and `scroll.y` to render large datasets smoothly, with `scrollTo` support.

</docs>

<template>
  <a-flex vertical gap="middle">
    <a-space wrap>
      <a-switch
        v-model:checked="bordered"
        checked-children="Bordered"
        un-checked-children="Bordered"
      />
      <a-switch v-model:checked="empty" checked-children="Empty" un-checked-children="Empty" />
      <a-segmented
        v-model:value="count"
        :options="[
          { label: 'None', value: 0 },
          { label: 'Less', value: 4 },
          { label: 'Lot (10000)', value: 10000 },
        ]"
      />
      <a-button v-if="dataSource.length >= 1000" @click="scrollTo999">Scroll To index 999</a-button>
    </a-space>

    <a-table
      ref="tblRef"
      virtual
      :bordered="bordered"
      :columns="columns"
      :data-source="empty ? [] : dataSource"
      :scroll="{ y: 360 }"
      :pagination="false"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { TableColumnsType, TableRef } from '@hiltonkohler21/ant-design-vue';

interface VirtualRow {
  key: number;
  index: number;
  name: string;
  department: string;
  city: string;
  score: number;
}

const columns: TableColumnsType<VirtualRow> = [
  { title: 'ID', dataIndex: 'index', key: 'index', width: 80 },
  { title: 'Name', dataIndex: 'name', key: 'name', width: 160 },
  { title: 'Department', dataIndex: 'department', key: 'department', width: 180 },
  { title: 'City', dataIndex: 'city', key: 'city', width: 140 },
  { title: 'Score', dataIndex: 'score', key: 'score', width: 100 },
];

const departments = ['Engineering', 'Design', 'Product', 'Operations', 'Analytics'];
const cities = ['Hangzhou', 'Shanghai', 'Beijing', 'Shenzhen', 'Chengdu'];

const bordered = ref(true);
const empty = ref(false);
const count = ref(10000);
const tblRef = ref<TableRef>();

const dataSource = computed<VirtualRow[]>(() =>
  Array.from({ length: count.value }, (_, i) => ({
    key: i,
    index: i + 1,
    name: `Member ${i + 1}`,
    department: departments[i % departments.length],
    city: cities[i % cities.length],
    score: 60 + ((i * 7) % 41),
  })),
);

const scrollTo999 = () => {
  tblRef.value?.scrollTo({ index: 999 });
};
</script>
