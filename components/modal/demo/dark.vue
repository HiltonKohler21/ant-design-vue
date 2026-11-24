<docs>
---
order: 10
debug: true
title:
  zh-CN: 调试使用
  en-US: Demo for debugging
---

## zh-CN

调试使用。

## en-US

Demo for debugging.
</docs>

<template>
  <a-button type="primary" @click="showModal">Open Modal</a-button>
  <a-modal v-model:open="open" title="Basic Modal" @ok="handleOk" @cancel="handleCancel">
    <a-switch
      v-model:checked="disabled"
      un-checked-children="disabled"
      checked-children="disabled"
      :style="{ marginBottom: '16px' }"
    />
    <a-card title="Card Title">
      <a-card-grid>Content</a-card-grid>
      <a-card-grid :hoverable="false">Content</a-card-grid>
      <a-card-grid>Content</a-card-grid>
      <a-card-grid>Content</a-card-grid>
      <a-card-grid>Content</a-card-grid>
      <a-card-grid>Content</a-card-grid>
      <a-card-grid>Content</a-card-grid>
    </a-card>
    <a-collapse>
      <a-collapse-panel key="1" header="This is panel header 1">
        <a-collapse active-key="1">
          <a-collapse-panel key="1" header="This is panel nest panel">
            <p>{{ text }}</p>
          </a-collapse-panel>
        </a-collapse>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="This is panel header 2">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="This is panel header 3">
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
    <a-transfer
      v-model:target-keys="targetKeys"
      v-model:selected-keys="selectedKeys"
      :data-source="mockData"
      :titles="['Source', 'Target']"
      :render="item => item.title"
      :disabled="disabled"
    />
    <a-transfer
      v-model:target-keys="targetKeys"
      :data-source="mockData"
      :disabled="disabled"
      :show-search="showSearch"
      :show-select-all="false"
      :filter-option="filterOption"
    >
      <template
        #children="{
          filteredItems,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
          onItemSelectAll,
          onItemSelect,
        }"
      >
        <a-table
          id="components-transfer-table"
          :row-selection="
            getRowSelection({
              disabled: listDisabled,
              selectedKeys: listSelectedKeys,
              onItemSelectAll,
              onItemSelect,
            })
          "
          :columns="tableTransferColumns"
          :data-source="filteredItems"
          size="small"
          :style="{ pointerEvents: listDisabled ? 'none' : undefined }"
          :custom-row="
            ({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) {
                  return;
                }
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })
          "
        />
      </template>
    </a-transfer>
    <a-switch
      v-model:checked="disabled"
      un-checked-children="disabled"
      checked-children="disabled"
      :style="{ marginTop: '16px' }"
    />
    <a-switch
      v-model:checked="showSearch"
      un-checked-children="showSearch"
      checked-children="showSearch"
      :style="{ marginTop: '16px' }"
    />
    <a-anchor>
      <a-anchor-link href="#anchor-demo-basic" title="Basic demo" />
      <a-anchor-link href="#anchor-demo-static" title="Static demo" />
      <a-anchor-link href="#anchor-demo-basic" title="Basic demo with Target" target="_blank" />
      <a-anchor-link href="#API" title="API">
        <a-anchor-link href="#Anchor-Props" title="Anchor Props" />
        <a-anchor-link href="#Link-Props" title="Link Props" />
      </a-anchor-link>
    </a-anchor>
    <a-tabs type="card">
      <a-tab-pane key="1" tab="Tab 1">Content of Tab Pane 1</a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2">Content of Tab Pane 2</a-tab-pane>
      <a-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</a-tab-pane>
    </a-tabs>
    <a-timeline>
      <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
      <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
      <a-timeline-item color="red">
        <template #dot>
          <ClockCircleOutlined :style="{ fontSize: '16px' }" />
        </template>
        Technical testing 2015-09-01
      </a-timeline-item>
      <a-timeline-item>Network problems being solved 2015-09-01</a-timeline-item>
    </a-timeline>
    <a-calendar />
    <a-tree show-line :default-expanded-keys="['0-0-0']" :tree-data="treeData">
      <template #switcherIcon>
        <DownOutlined />
      </template>
    </a-tree>
    <a-table :columns="columns" :data-source="dataSource">
      <template #footer>Footer</template>
    </a-table>
    <a-table
      id="table-demo-summary"
      :columns="columnsTable"
      :data-source="summaryDataSource"
      :pagination="false"
      bordered
    >
      <template #summary>
        <a-table-summary-row>
          <a-table-summary-cell>Total</a-table-summary-cell>
          <a-table-summary-cell>
            <a-typography-text type="danger">{{ totalBorrow }}</a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell>
            <a-typography-text>{{ totalRepayment }}</a-typography-text>
          </a-table-summary-cell>
        </a-table-summary-row>
        <a-table-summary-row>
          <a-table-summary-cell>Balance</a-table-summary-cell>
          <a-table-summary-cell :col-span="2">
            <a-typography-text type="danger">{{ totalBorrow - totalRepayment }}</a-typography-text>
          </a-table-summary-cell>
        </a-table-summary-row>
      </template>
    </a-table>
    <br />
    <a-table :columns="columnsNest" :data-source="nestDataSource">
      <template #expandedRowRender>
        <a-table :columns="expandColumns" :data-source="expandDataSource" :pagination="false" />
      </template>
    </a-table>
    <a-table :columns="columnsFixed" :data-source="fixedDataSource" :scroll="{ x: 1300, y: 100 }" />
    <a-card hoverable :style="{ width: '240px' }">
      <template #cover>
        <img
          draggable="false"
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        />
      </template>
      <a-card-meta title="Europe Street beat" description="www.instagram.com" />
    </a-card>
    <a-slider v-model:value="sliderValue" />
    <a-date-picker v-model:value="dateValue" format="YYYY/MM/DD" />
    <a-badge :count="5">
      <a href="#" class="head-example" />
    </a-badge>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import { ClockCircleOutlined, DownOutlined } from '@ant-design/icons-vue';
import { Badge, Dropdown } from 'ant-design-vue';
import type { TableColumnsType, TreeProps } from 'ant-design-vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

interface MockTransferItem {
  key: string;
  title: string;
  description: string;
  disabled: boolean;
}

const mockData: MockTransferItem[] = Array.from({ length: 20 }).map((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
  disabled: i % 3 < 1,
}));

const oriTargetKeys = mockData.filter(item => Number(item.key) % 3 > 1).map(item => item.key);

const dataSource = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' },
  { key: '4', name: 'Jim Red', age: 32, address: 'London No. 2 Lake Park' },
];

const columnsTable: TableColumnsType = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Borrow', dataIndex: 'borrow' },
  { title: 'Repayment', dataIndex: 'repayment' },
];

const summaryDataSource = [
  { key: '1', name: 'John Brown', borrow: 10, repayment: 33 },
  { key: '2', name: 'Jim Green', borrow: 100, repayment: 0 },
  { key: '3', name: 'Joe Black', borrow: 10, repayment: 10 },
  { key: '4', name: 'Jim Red', borrow: 75, repayment: 45 },
];

const totalBorrow = computed(() => summaryDataSource.reduce((acc, item) => acc + item.borrow, 0));
const totalRepayment = computed(() =>
  summaryDataSource.reduce((acc, item) => acc + item.repayment, 0),
);

const expandDataSource = Array.from({ length: 3 }).map((_, i) => ({
  key: i,
  date: '2014-12-24 23:12:00',
  name: 'This is production name',
  upgradeNum: 'Upgraded: 56',
}));

const expandColumns: TableColumnsType = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Status',
    key: 'state',
    customRender: () => h('span', [h(Badge, { status: 'success' }), 'Finished']),
  },
  { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  {
    title: 'Action',
    dataIndex: 'operation',
    key: 'operation',
    customRender: () =>
      h('span', { class: 'table-operation' }, [
        h('a', 'Pause'),
        ' ',
        h('a', 'Stop'),
        ' ',
        h(Dropdown, null, () => h('a', ['More ', h(DownOutlined)])),
      ]),
  },
];

const columnsNest: TableColumnsType = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Platform', dataIndex: 'platform', key: 'platform' },
  { title: 'Version', dataIndex: 'version', key: 'version' },
  { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  { title: 'Creator', dataIndex: 'creator', key: 'creator' },
  { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Action', key: 'operation', customRender: () => h('a', 'Publish') },
];

const nestDataSource = Array.from({ length: 3 }).map((_, i) => ({
  key: i,
  name: 'Screem',
  platform: 'iOS',
  version: '10.3.4.5654',
  upgradeNum: 500,
  creator: 'Jack',
  createdAt: '2014-12-24 23:12:00',
}));

const columnsFixed: TableColumnsType = [
  { title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
  { title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'left' },
  { title: 'Column 1', dataIndex: 'address', key: '1' },
  { title: 'Column 2', dataIndex: 'address', key: '2' },
  { title: 'Column 3', dataIndex: 'address', key: '3' },
  { title: 'Column 4', dataIndex: 'address', key: '4' },
  { title: 'Column 5', dataIndex: 'address', key: '5' },
  { title: 'Column 6', dataIndex: 'address', key: '6' },
  { title: 'Column 7', dataIndex: 'address', key: '7' },
  { title: 'Column 8', dataIndex: 'address', key: '8' },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    customRender: () => h('a', 'action'),
  },
];

const fixedDataSource = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York Park' },
  { key: '2', name: 'Jim Green', age: 40, address: 'London Park' },
];

const columns: TableColumnsType = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    filters: [
      { text: 'Joe', value: 'Joe' },
      { text: 'Jim', value: 'Jim' },
    ],
    filteredValue: null,
    onFilter: (value, record) => record.name.includes(value as string),
    sorter: (a, b) => a.name.length - b.name.length,
    sortOrder: 'ascend',
    ellipsis: true,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    sorter: false,
    sortOrder: 'ascend',
    ellipsis: true,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    filters: [
      { text: 'London', value: 'London' },
      { text: 'New York', value: 'New York' },
    ],
    filteredValue: null,
    onFilter: (value, record) => record.address.includes(value as string),
    sorter: false,
    sortOrder: 'ascend',
    ellipsis: true,
  },
];

const tableTransferColumns: TableColumnsType = [
  { dataIndex: 'title', title: 'Name' },
  { dataIndex: 'description', title: 'Description' },
];

const treeData: TreeProps['treeData'] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          { title: 'leaf', key: '0-0-0-0' },
          { title: 'leaf', key: '0-0-0-1' },
          { title: 'leaf', key: '0-0-0-2' },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: 'leaf', key: '0-0-1-0' }],
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        children: [
          { title: 'leaf', key: '0-0-2-0' },
          { title: 'leaf', key: '0-0-2-1' },
        ],
      },
    ],
  },
];

const open = ref<boolean>(false);
const targetKeys = ref<string[]>(oriTargetKeys);
const selectedKeys = ref<string[]>([]);
const disabled = ref<boolean>(false);
const showSearch = ref<boolean>(false);
const sliderValue = ref<number>(30);
const dateValue = ref(dayjs('2015/01/01', 'YYYY/MM/DD'));

const filterOption = (inputValue: string, item: MockTransferItem) =>
  item.title.includes(inputValue) || item.description.includes(inputValue);

const getRowSelection = ({
  disabled: listDisabled,
  selectedKeys: listSelectedKeys,
  onItemSelectAll,
  onItemSelect,
}: Record<string, any>) => ({
  getCheckboxProps: (item: MockTransferItem) => ({
    disabled: listDisabled || item.disabled,
  }),
  onSelectAll(selected: boolean, selectedRows: MockTransferItem[]) {
    const treeSelectedKeys = selectedRows.filter(item => !item.disabled).map(({ key }) => key);
    onItemSelectAll(treeSelectedKeys, selected);
  },
  onSelect({ key }: MockTransferItem, selected: boolean) {
    onItemSelect(key, selected);
  },
  selectedRowKeys: listSelectedKeys,
});

const showModal = () => {
  open.value = true;
};

const handleOk = () => {
  open.value = false;
};

const handleCancel = () => {
  open.value = false;
};
</script>
