<docs>
---
order: 8
debug: true
title:
  zh-CN: 自定义 label & wrapper 样式
  en-US: Customize label & wrapper style
---

## zh-CN

自定义 label & wrapper 样式。

## en-US

Customize label & wrapper style.
</docs>

<template>
  <div>
    <a-switch v-model:checked="border" checked-children="Border" un-checked-children="No Border" />
    <a-divider />
    <a-radio-group v-model:value="layout">
      <a-radio value="horizontal">horizontal</a-radio>
      <a-radio value="vertical">vertical</a-radio>
    </a-radio-group>
    <a-divider />
    <a-descriptions title="User Info" :bordered="border" :layout="layout" :items="items" />
    <a-divider />
    <a-descriptions
      title="Root style"
      :styles="{ label: labelStyle, content: contentStyle }"
      :bordered="border"
      :layout="layout"
      :items="rootStyleItems"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CSSProperties } from 'vue';
import type { DescriptionsProps } from '@hiltonkohler21/ant-design-vue';

const labelStyle: CSSProperties = { background: 'red' };
const contentStyle: CSSProperties = { background: 'green' };

const border = ref(true);
const layout = ref<'horizontal' | 'vertical'>('horizontal');

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Product',
    children: 'Cloud Database',
    styles: {
      label: labelStyle,
      content: contentStyle,
    },
  },
  {
    key: '2',
    label: 'Billing Mode',
    children: 'Prepaid',
  },
  {
    key: '3',
    label: 'Automatic Renewal',
    children: 'YES',
  },
];

const rootStyleItems: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Product',
    children: 'Cloud Database',
  },
  {
    key: '2',
    label: 'Billing Mode',
    children: 'Prepaid',
  },
  {
    key: '3',
    label: 'Automatic Renewal',
    children: 'YES',
    styles: {
      label: { color: 'orange' },
      content: { color: 'blue' },
    },
  },
];
</script>
