<docs>
---
order: 25
title:
  zh-CN: 嵌套子表格
  en-US: Nested tables
---

## zh-CN

展示每行数据更详细的信息。

## en-US

Showing more detailed info of every row.

</docs>

<template>
  <a-flex vertical gap="middle">
    <a-table
      v-for="tableSize in tableSizes"
      :key="tableSize || 'large'"
      :size="tableSize"
      :columns="columns"
      :data-source="data"
      :default-expanded-row-keys="['0']"
      class="components-table-demo-nested"
    >
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'operation'">
          <a>Publish</a>
        </template>
      </template>
      <template #expandedRowRender>
        <a-table :columns="innerColumns" :data-source="innerData" :pagination="false">
          <template #bodyCell="{ column }">
            <template v-if="column.key === 'state'">
              <a-badge status="success" text="Finished" />
            </template>
            <template v-else-if="column.key === 'operation'">
              <a-space size="middle">
                <a>Pause</a>
                <a>Stop</a>
                <a-dropdown>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="1">Action 1</a-menu-item>
                      <a-menu-item key="2">Action 2</a-menu-item>
                    </a-menu>
                  </template>
                  <a>
                    More
                    <DownOutlined />
                  </a>
                </a-dropdown>
              </a-space>
            </template>
          </template>
        </a-table>
      </template>
    </a-table>
  </a-flex>
</template>

<script lang="ts" setup>
import { DownOutlined } from '@ant-design/icons-vue';
import type { TableColumnsType, TableProps } from '@hiltonkohler21/ant-design-vue';

interface DataItem {
  key: string;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number;
  creator: string;
  createdAt: string;
}

interface InnerDataItem {
  key: string;
  date: string;
  name: string;
  upgradeNum: string;
}

const tableSizes: TableProps['size'][] = ['large', 'medium', 'small'];

const columns: TableColumnsType<DataItem> = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Platform', dataIndex: 'platform', key: 'platform' },
  { title: 'Version', dataIndex: 'version', key: 'version' },
  { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  { title: 'Creator', dataIndex: 'creator', key: 'creator' },
  { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Action', key: 'operation' },
];

const data: DataItem[] = Array.from({ length: 3 }, (_, i) => ({
  key: String(i),
  name: 'Screen',
  platform: 'iOS',
  version: '10.3.4.5654',
  upgradeNum: 500,
  creator: 'Jack',
  createdAt: '2014-12-24 23:12:00',
}));

const innerColumns: TableColumnsType<InnerDataItem> = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Status', key: 'state' },
  { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  { title: 'Action', dataIndex: 'operation', key: 'operation' },
];

const innerData: InnerDataItem[] = Array.from({ length: 3 }, (_, i) => ({
  key: String(i),
  date: '2014-12-24 23:12:00',
  name: 'This is production name',
  upgradeNum: 'Upgraded: 56',
}));
</script>
