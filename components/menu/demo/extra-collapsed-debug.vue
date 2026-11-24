<docs>
---
order: 15
debug: true
title:
  zh-CN: Extra 折叠调试
  en-US: Extra collapsed debug
---

## zh-CN

调试 extra 在折叠菜单和 Tooltip 中的展示。

## en-US

Debug extra rendering in collapsed menu and Tooltip.
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
import { Badge } from 'ant-design-vue';
import type { MenuProps } from 'ant-design-vue';

const collapsed = ref(false);
const tooltipEnabled = ref(true);

const items: MenuProps['items'] = [
  {
    key: '1',
    icon: () => h(PieChartOutlined),
    label: 'Option 1Option 1Option 1Option 1Option 1',
    extra: h(Badge, { count: 123 }),
  },
  { key: '2', icon: () => h(DesktopOutlined), label: 'Option 2' },
  { key: '3', icon: () => h(ContainerOutlined), label: 'Option 3' },
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: () => h(MailOutlined),
    children: [
      {
        key: '5',
        label: 'Option 5Option 5Option 5Option 5',
        icon: () => h(MailOutlined),
        extra: h(Badge, { dot: true }),
      },
      {
        key: '6',
        label: 'Option 6',
        icon: () => h(MailOutlined),
        extra: h(Badge, { dot: true }),
      },
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
