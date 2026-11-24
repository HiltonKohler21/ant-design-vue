<docs>
---
order: 28
version: 4.3.0
title:
  zh-CN: 虚拟列表
  en-US: Virtual list
---

## zh-CN

通过设置 `virtual` 与 `scroll.y` 开启虚拟滚动，高效渲染 1,000 行大数据表格。

## en-US

Enable virtual scrolling via `virtual` and `scroll.y` to render 1,000 rows smoothly.

</docs>

<template>
  <a-table
    virtual
    bordered
    :columns="columns"
    :data-source="dataSource"
    :scroll="{ y: 360 }"
    :pagination="false"
  />
</template>

<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';

interface VirtualRow {
  key: number;
  index: number;
  name: string;
  department: string;
  city: string;
  score: number;
}

const columns: TableColumnsType<VirtualRow> = [
  { title: 'ID', dataIndex: 'index', key: 'index', width: 80 },
  { title: 'Name', dataIndex: 'name', key: 'name', width: 160 },
  { title: 'Department', dataIndex: 'department', key: 'department', width: 180 },
  { title: 'City', dataIndex: 'city', key: 'city', width: 140 },
  { title: 'Score', dataIndex: 'score', key: 'score', width: 100 },
];

const departments = ['Engineering', 'Design', 'Product', 'Operations', 'Analytics'];
const cities = ['Hangzhou', 'Shanghai', 'Beijing', 'Shenzhen', 'Chengdu'];

const dataSource: VirtualRow[] = Array.from({ length: 1000 }, (_, i) => ({
  key: i,
  index: i + 1,
  name: `Member ${i + 1}`,
  department: departments[i % departments.length],
  city: cities[i % cities.length],
  score: 60 + ((i * 7) % 41),
}));
</script>
