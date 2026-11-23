<docs>
---
order: 12
title:
  zh-CN: 配置式标签页
  en-US: Items Config
---

## zh-CN

通过 `items` 属性以数据驱动方式配置标签页，并支持 `destroyOnHidden` 在隐藏时销毁面板。

## en-US

Configure tabs via the data-driven `items` prop, with optional `destroyOnHidden` to unmount inactive panels.

</docs>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-switch
      v-model:checked="destroyOnHidden"
      checked-children="destroyOnHidden"
      un-checked-children="keepAlive"
    />
    <a-tabs v-model:active-key="activeKey" :items="items" :destroy-on-hidden="destroyOnHidden" />
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TabsProps } from 'ant-design-vue';

const activeKey = ref('1');
const destroyOnHidden = ref(false);

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Tab 1',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Tab 2',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Tab 3 (Disabled)',
    children: 'Content of Tab Pane 3',
    disabled: true,
  },
  {
    key: '4',
    label: 'Tab 4',
    children: 'Content of Tab Pane 4',
  },
];
</script>
