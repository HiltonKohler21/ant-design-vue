<docs>
---
order: 35
debug: true
title:
  zh-CN: measureRowRender
  en-US: measureRowRender
---

## zh-CN

调试 `sticky` 表格测量行与自定义筛选菜单、排序提示同时开启时的布局表现。

## en-US

Debug `sticky` table measure row rendering together with custom filter dropdowns and sorter tooltip.
</docs>

<template>
  <div ref="containerRef" :style="{ position: 'relative' }">
    <a-table
      sticky
      :columns="columns"
      :data-source="data"
      :scroll="{ x: 'max-content' }"
      :get-popup-container="getPopupContainer"
    >
      <template
        #customFilterDropdown="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
          close,
        }"
      >
        <div :style="{ padding: '8px' }" @keydown.stop>
          <a-input
            ref="searchInput"
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            :style="{ marginBottom: '8px', display: 'block', width: '188px' }"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @press-enter="handleSearch(selectedKeys as string[], confirm, String(column.dataIndex))"
          />
          <a-space>
            <a-button
              type="primary"
              size="small"
              :style="{ width: '90px' }"
              @click="handleSearch(selectedKeys as string[], confirm, String(column.dataIndex))"
            >
              <template #icon><SearchOutlined /></template>
              Search
            </a-button>
            <a-button size="small" :style="{ width: '90px' }" @click="handleReset(clearFilters)">
              Reset
            </a-button>
            <a-button
              type="link"
              size="small"
              @click="
                () => {
                  confirm({ closeDropdown: false });
                  searchText = String(selectedKeys[0] || '');
                  searchedColumn = String(column.dataIndex);
                }
              "
            >
              Filter
            </a-button>
            <a-button type="link" size="small" @click="close?.()">close</a-button>
          </a-space>
        </div>
      </template>
      <template #customFilterIcon="{ filtered }">
        <SearchOutlined :style="{ color: filtered ? '#1677ff' : undefined }" />
      </template>
      <template #bodyCell="{ text, column }">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in String(text || '').split(
              new RegExp(`(?<=${escapeRegExp(searchText)})|(?=${escapeRegExp(searchText)})`, 'i'),
            )"
            :key="i"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :style="{ backgroundColor: '#ffc069', color: '#000', padding: '0' }"
            >
              {{ fragment }}
            </mark>
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-else>{{ text }}</template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import type { TableColumnsType } from 'ant-design-vue';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Joe Black',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Jim Green',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

const containerRef = ref<HTMLElement>();
const searchInput = ref();
const searchText = ref('');
const searchedColumn = ref('');

const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getPopupContainer = (trigger: HTMLElement) =>
  containerRef.value || trigger.parentElement || document.body;

const handleSearch = (
  selectedKeys: string[],
  confirm: (param?: { closeDropdown: boolean }) => void,
  dataIndex: string,
) => {
  confirm();
  searchText.value = selectedKeys[0] || '';
  searchedColumn.value = dataIndex;
};

const handleReset = (clearFilters?: (param?: { confirm?: boolean }) => void) => {
  clearFilters?.({ confirm: true });
  searchText.value = '';
};

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
    customFilterDropdown: true,
    onFilter: (value, record) => record.name.toLowerCase().includes(String(value).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open: boolean) {
        if (open) {
          setTimeout(() => searchInput.value?.focus?.(), 100);
        }
      },
    },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: '20%',
    filters: [
      { text: '32', value: '32' },
      { text: '42', value: '42' },
    ],
    onFilter: (value, record) => String(record.age) === String(value),
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    customFilterDropdown: true,
    onFilter: (value, record) => record.address.toLowerCase().includes(String(value).toLowerCase()),
    sorter: (a, b) => a.address.length - b.address.length,
    sortDirections: ['descend', 'ascend'],
    showSorterTooltip: {
      target: 'full-header',
    },
  },
];
</script>
