<docs>
---
order: 32
title:
  en-US: Stripe Style
  zh-CN: 带斑马纹表格
---

## zh-CN

利用 `rowClassName` 自定义带斑马纹的表格。

## en-US

Use `rowClassName` Customize the table with Striped.

</docs>

<template>
  <a-flex vertical gap="middle">
    <a-table
      class="ant-table-striped"
      size="medium"
      :columns="columns"
      :data-source="data"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
    />
    <a-table
      class="ant-table-striped"
      size="medium"
      :columns="columns"
      :data-source="data"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      bordered
    />
  </a-flex>
</template>

<script lang="ts" setup>
const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Address', dataIndex: 'address' },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Ben Kang',
    age: 15,
    address: 'Sydney No. 1 Lake Park',
  },
];
</script>

<style scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: var(--ant-color-fill-alter, #fafafa);
}
</style>
