<docs>
---
order: 2
debug: true
title:
  zh-CN: 复杂文本的情况
  en-US: Complex text
---

## zh-CN

复杂文本的情况。

## en-US

The situation of complex text.
</docs>

<template>
  <div :style="{ maxWidth: '100%', overflowX: 'auto' }">
    <a-descriptions title="User Info" :column="2" :items="items" />
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { Badge, Table } from '@hiltonkohler21/ant-design-vue';
import type { DescriptionsProps, TableProps } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const dataSource: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'No. 1 Lake Park',
  },
];

const columns: TableProps['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Product',
    children: 'Cloud Database',
  },
  {
    key: '2',
    label: h('div', { style: { display: 'flex' } }, 'Billing Mode'),
    children: 'Prepaid',
  },
  {
    key: '3',
    label: 'Automatic Renewal',
    children: 'YES',
  },
  {
    key: '4',
    label: 'Order time',
    children: '2018-04-24 18:00:00',
  },
  {
    key: '5',
    label: 'Usage Time',
    span: 2,
    children: '2019-04-24 18:00:00',
  },
  {
    key: '6',
    label: 'Status',
    span: 2,
    children: h(Badge, { status: 'processing', text: 'Running' }),
  },
  {
    key: '7',
    label: 'Negotiated Amount',
    children: '$80.00',
  },
  {
    key: '8',
    label: 'Discount',
    children: '$20.00',
  },
  {
    key: '9',
    label: 'Official Receipts',
    children: '$60.00',
  },
  {
    key: '10',
    label: 'Config Info',
    children: h('div', [
      'Data disk type: MongoDB',
      h('br'),
      'Database version: 3.4',
      h('br'),
      'Package: dds.mongo.mid',
      h('br'),
      'Storage space: 10 GB',
      h('br'),
      'Replication factor: 3',
      h('br'),
      'Region: East China 1',
      h('br'),
    ]),
  },
  {
    key: '11',
    label: 'Official Receipts',
    children: '$60.00',
  },
  {
    key: '12',
    label: 'Config Info',
    children: h(Table, {
      size: 'small',
      pagination: false,
      dataSource,
      columns,
    }),
  },
];
</script>
