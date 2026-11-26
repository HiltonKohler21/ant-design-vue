<docs>
---
order: 10
title:
  en-US: Customized filter panel
  zh-CN: 自定义筛选菜单
---

## zh-CN

通过 `customFilterDropdown` 定义自定义的列筛选功能，并实现一个搜索列的示例。

## en-US

Implement a customized column search example via `customFilterDropdown`.

</docs>

<template>
  <a-table :data-source="data" :columns="columns">
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
          @press-enter="handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-space>
          <a-button
            type="primary"
            size="small"
            :style="{ width: '90px' }"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
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
                state.searchText = selectedKeys[0] || '';
                state.searchedColumn = column.dataIndex;
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
      <span v-if="state.searchText && state.searchedColumn === column.dataIndex">
        <template
          v-for="(fragment, i) in String(text ?? '').split(
            new RegExp(
              `(?<=${escapeRegExp(state.searchText)})|(?=${escapeRegExp(state.searchText)})`,
              'i',
            ),
          )"
          :key="i"
        >
          <mark v-if="fragment.toLowerCase() === state.searchText.toLowerCase()" class="highlight">
            {{ fragment }}
          </mark>
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
      <template v-else>{{ text }}</template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { SearchOutlined } from '@ant-design/icons-vue';
import { reactive, ref } from 'vue';
import type { TableColumnsType } from '@hiltonkohler21/ant-design-vue';

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

const state = reactive({
  searchText: '',
  searchedColumn: '',
});

const searchInput = ref();

const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getColumnSearchProps = (dataIndex: keyof DataType) => ({
  customFilterDropdown: true,
  onFilter: (value: any, record: DataType) =>
    record[dataIndex].toString().toLowerCase().includes(String(value).toLowerCase()),
  filterDropdownProps: {
    onOpenChange(open: boolean) {
      if (open) {
        setTimeout(() => {
          searchInput.value?.focus?.();
        }, 100);
      }
    },
  },
});

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
    ...getColumnSearchProps('name'),
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: '20%',
    ...getColumnSearchProps('age'),
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    ...getColumnSearchProps('address'),
    sorter: (a, b) => a.address.length - b.address.length,
    sortDirections: ['descend', 'ascend'],
  },
];

const handleSearch = (selectedKeys: any[], confirm: any, dataIndex: string) => {
  confirm();
  state.searchText = selectedKeys[0] || '';
  state.searchedColumn = dataIndex;
};

const handleReset = (clearFilters?: any) => {
  clearFilters?.({ confirm: true });
  state.searchText = '';
};
</script>

<style scoped>
.highlight {
  background-color: #ffc069;
  color: #000;
  padding: 0;
}
</style>
