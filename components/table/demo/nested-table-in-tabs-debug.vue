<docs>
---
order: 29.4
debug: true
title:
  zh-CN: Tabs 中的嵌套表格 Debug
  en-US: Nested Table in Tabs Debug
---

## zh-CN

调试展开行内包含 `Tabs` 及嵌套带边框 `Table` 时的样式表现。

## en-US

Debug nested bordered `Table` rendered inside `Tabs` within an expanded row.
</docs>

<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :default-expanded-row-keys="['0']"
    :pagination="false"
  >
    <template #expandedRowRender>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="Tab 1">
          <a-table bordered :columns="columns" :data-source="dataSource" :pagination="false" />
        </a-tab-pane>
      </a-tabs>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';

interface DataType {
  key: string;
  name: string;
}

const columns: TableColumnsType<DataType> = [{ title: 'Name', dataIndex: 'name' }];

const dataSource: DataType[] = [{ key: '0', name: 'Jack' }];
</script>
