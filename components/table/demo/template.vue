<docs>
---
order: 1
title:
  en-US: template style API
  zh-CN: template 风格的 API
---

## zh-CN

使用 template 风格的 API。

> 不推荐使用，会有一定的性能损耗。

> 这个只是一个描述 `columns` 的语法糖，所以你不能用其他组件去包裹 `Column` 和 `ColumnGroup`。

## en-US

Using template style API.

> Not recommended, there will be a certain performance loss.

> Since this is just a syntax sugar for the prop `columns`, so that you can't compose `Column` and `ColumnGroup` with other Components.

</docs>

<template>
  <a-table :data-source="data">
    <a-table-column-group>
      <template #title><span style="color: var(--ant-color-primary, #1677ff)">Name</span></template>
      <a-table-column key="firstName" data-index="firstName">
        <template #title>
          <span style="color: var(--ant-color-primary, #1677ff)">First Name</span>
        </template>
      </a-table-column>
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
const data = [
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
