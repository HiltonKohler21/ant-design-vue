<docs>
---
order: 4
version: 4.3.0
title:
  zh-CN: 菜单项提示
  en-US: Menu tooltip
---

## zh-CN

折叠状态下可配置 `tooltip`，也可以关闭。

## en-US

Configure `tooltip` in inline collapsed mode, or disable it.
</docs>

<template>
  <div :style="{ width: '256px', maxWidth: '100%' }">
    <a-space wrap :style="{ marginBottom: '16px' }">
      <a-button type="primary" @click="collapsed = !collapsed">
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </a-button>
      <a-switch
        v-model:checked="tooltipEnabled"
        checked-children="Tooltip On"
        un-checked-children="Tooltip Off"
      />
    </a-space>
    <a-menu
      :default-selected-keys="['1']"
      :default-open-keys="['sub1']"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
      :tooltip="tooltipEnabled ? { placement: 'left' } : false"
      :items="items"
    />
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons-vue';
import type { MenuProps } from '@hiltonkohler21/ant-design-vue';

const collapsed = ref(false);
const tooltipEnabled = ref(true);

const items: MenuProps['items'] = [
  { key: '1', icon: () => h(PieChartOutlined), label: 'Option 1' },
  { key: '2', icon: () => h(DesktopOutlined), label: 'Option 2' },
  { key: '3', icon: () => h(ContainerOutlined), label: 'Option 3' },
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: () => h(MailOutlined),
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      { key: '7', label: 'Option 7' },
      { key: '8', label: 'Option 8' },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    icon: () => h(AppstoreOutlined),
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '11', label: 'Option 11' },
          { key: '12', label: 'Option 12' },
        ],
      },
    ],
  },
];
</script>
