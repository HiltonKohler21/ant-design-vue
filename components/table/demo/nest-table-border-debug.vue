<docs>
---
order: 29.2
debug: true
title:
  zh-CN: 嵌套带边框的表格 Debug
  en-US: Nested Bordered Table Debug
---

## zh-CN

调试父表格与嵌套子表格分别切换 `bordered` 时的边框渲染表现。

## en-US

Debug border rendering when toggling `bordered` on parent and nested child tables independently.
</docs>

<template>
  <a-form
    layout="inline"
    :style="{
      marginBottom: '16px',
      display: 'flex',
      flexWrap: 'wrap',
      rowGap: '8px',
    }"
  >
    <a-form-item label="Root Table Bordered">
      <a-switch v-model:checked="rootTableBordered" />
    </a-form-item>
    <a-form-item label="Child Table Bordered">
      <a-switch v-model:checked="childTableBordered" />
    </a-form-item>
  </a-form>
  <a-table
    :title="() => 'cool'"
    :footer="() => 'cool'"
    :columns="columns"
    :data-source="dataSource"
    :bordered="rootTableBordered"
    :scroll="{ x: 'max-content' }"
  >
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'operation'">
        <a>Publish</a>
      </template>
    </template>
    <template #expandedRowRender>
      <a-table
        :columns="expandedColumns"
        :data-source="expandedDataSource"
        :pagination="false"
        :bordered="childTableBordered"
      >
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'state'">
            <span>
              <a-badge status="success" />
              Finished
            </span>
          </template>
          <template v-else-if="column.key === 'operation'">
            <a-space size="middle">
              <a>Pause</a>
              <a>Stop</a>
              <a-dropdown>
                <a>
                  More
                  <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="1">Action 1</a-menu-item>
                    <a-menu-item key="2">Action 2</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import type { TableColumnsType } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: number;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number;
  creator: string;
  createdAt: string;
}

interface ExpandedDataType {
  key: number;
  date: string;
  name: string;
  upgradeNum: string;
}

const expandedColumns: TableColumnsType<ExpandedDataType> = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Status', key: 'state' },
  { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  { title: 'Action', dataIndex: 'operation', key: 'operation' },
];

const expandedDataSource: ExpandedDataType[] = Array.from({ length: 3 }).map((_, i) => ({
  key: i,
  date: '2014-12-24 23:12:00',
  name: 'This is production name',
  upgradeNum: 'Upgraded: 56',
}));

const columns: TableColumnsType<DataType> = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Platform', dataIndex: 'platform', key: 'platform' },
  { title: 'Version', dataIndex: 'version', key: 'version' },
  { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  { title: 'Creator', dataIndex: 'creator', key: 'creator' },
  { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Action', key: 'operation' },
];

const dataSource: DataType[] = Array.from({ length: 3 }).map((_, i) => ({
  key: i,
  name: 'Screem',
  platform: 'iOS',
  version: '10.3.4.5654',
  upgradeNum: 500,
  creator: 'Jack',
  createdAt: '2014-12-24 23:12:00',
}));

const rootTableBordered = ref(true);
const childTableBordered = ref(true);
</script>
