<docs>
---
order: 26.8
title:
  zh-CN: 自定义空状态
  en-US: Custom empty
---

## zh-CN

自定义空状态，支持通过 `ConfigProvider` 的 `renderEmpty` 自定义筛选菜单空状态（`Table.filter`）。

## en-US

Custom empty status, including customizing filter dropdown empty state (`Table.filter`) via `ConfigProvider.renderEmpty`.
</docs>

<template>
  <a-config-provider :render-empty="renderEmpty">
    <a-button v-if="dataSource.length" type="primary" @click="handleToggle">Toggle Data</a-button>
    <div :style="{ marginBlock: '8px' }" />
    <a-table bordered :data-source="dataSource" :columns="columns" :scroll="{ x: 'max-content' }">
      <template #emptyText>
        <a-empty description="No Data">
          <a-button type="primary" @click="handleToggle">Toggle Data</a-button>
        </a-empty>
      </template>
    </a-table>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import { Empty } from '@hiltonkohler21/ant-design-vue';
import type { ConfigProviderProps, TableColumnsType } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
}

const genFakeData = (count = 5): DataType[] =>
  Array.from({ length: count }).map((_, index) => ({
    key: index,
    name: `Edward King ${index}`,
    age: 32 + index,
    address: `London, Park Lane no. ${index}`,
  }));

const renderEmpty: ConfigProviderProps['renderEmpty'] = componentName => {
  if (componentName === 'Table.filter') {
    return h(Empty, {
      image: Empty.PRESENTED_IMAGE_SIMPLE,
      description: 'No Filter(Custom)',
    });
  }
  return undefined;
};

const dataSource = ref<DataType[]>(genFakeData(5));

const handleToggle = () => {
  dataSource.value = dataSource.value.length ? [] : genFakeData(5);
};

const columns = computed<TableColumnsType<DataType>>(() => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    filters: dataSource.value.length
      ? [
          { text: '>=35', value: 'gte35' },
          { text: '<18', value: 'lt18' },
        ]
      : [],
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
]);
</script>
