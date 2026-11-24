<docs>
---
order: 1.5
title:
  zh-CN: JSX 风格的 API
  en-US: JSX style API
---

## zh-CN

使用组件标签（`a-table-column` / `a-table-column-group`）风格的 API。

> 这个只是一个描述 `columns` 的语法糖，所以你不能用其他组件去包裹 `Column` 和 `ColumnGroup`。

## en-US

Using declarative component (`a-table-column` / `a-table-column-group`) style API.

> Since this is just a syntax sugar for the prop `columns`, you can't compose `Column` and `ColumnGroup` with other Components.
</docs>

<template>
  <a-table :data-source="data">
    <a-table-column-group title="Name">
      <a-table-column key="firstName" title="First Name" data-index="firstName" />
      <a-table-column key="lastName" title="Last Name" data-index="lastName" />
    </a-table-column-group>
    <a-table-column key="age" title="Age" data-index="age" />
    <a-table-column key="address" title="Address" data-index="address" />
    <a-table-column key="tags" title="Tags" data-index="tags">
      <template #default="{ text: tags }">
        <a-flex gap="small" align="center" wrap="wrap">
          <a-tag
            v-for="tag in tags"
            :key="tag"
            :color="tag === 'kawaii' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </a-flex>
      </template>
    </a-table-column>
    <a-table-column key="action" title="Action">
      <template #default="{ record }">
        <a-space size="middle">
          <a>Invite {{ record.lastName }}</a>
          <a>Delete</a>
        </a-space>
      </template>
    </a-table-column>
  </a-table>
</template>

<script lang="ts" setup>
interface DataType {
  key: string;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  tags: string[];
}

const data: DataType[] = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    firstName: 'Jim',
    lastName: 'Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['kawaii'],
  },
  {
    key: '3',
    firstName: 'Joe',
    lastName: 'Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];
</script>
