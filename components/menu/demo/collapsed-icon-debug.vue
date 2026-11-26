<docs>
---
order: 17
debug: true
title:
  zh-CN: 折叠菜单 icon 对齐
  en-US: Collapsed menu icon alignment
---

## zh-CN

用于排查折叠态 `collapsedIconSize` 放大后的图标布局。红框是 `item-icon`，蓝框是 `svg`，绿框是隐藏中的文字容器。

## en-US

Debug collapsed icon layout when `collapsedIconSize` is enlarged. Red outlines show `item-icon`, blue outlines show `svg`, and green outlines show the hidden title content container.
</docs>

<template>
  <a-config-provider :theme="themeConfig">
    <div class="menu-collapsed-icon-debug">
      <a-menu mode="inline" inline-collapsed :items="items" @click="onClick" />
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons-vue';
import type { ConfigProviderProps, MenuProps } from '@hiltonkohler21/ant-design-vue';

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Menu: {
      collapsedIconSize: 30,
    } as Record<string, any>,
  },
};

const items: MenuProps['items'] = [
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: () => h(MailOutlined),
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' },
        ],
      },
      {
        key: 'g2',
        label: 'Item 2',
        type: 'group',
        children: [
          { key: '3', label: 'Option 3' },
          { key: '4', label: 'Option 4' },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    icon: () => h(AppstoreOutlined),
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '7', label: 'Option 7' },
          { key: '8', label: 'Option 8' },
        ],
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    key: 'sub4',
    label: 'Navigation Three',
    icon: () => h(SettingOutlined),
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' },
    ],
  },
  {
    key: 'grp',
    label: 'Group',
    type: 'group',
    children: [
      { key: '13', label: 'Option 13' },
      { key: '14', label: 'Option 14' },
    ],
  },
];

const onClick: MenuProps['onClick'] = e => {
  console.log('click ', e);
};
</script>

<style>
.menu-collapsed-icon-debug .ant-menu-item,
.menu-collapsed-icon-debug .ant-menu-submenu-title {
  background: rgba(22, 119, 255, 0.06);
}
.menu-collapsed-icon-debug .ant-menu-item-icon {
  outline: 1px solid #ff4d4f;
  background: rgba(255, 77, 79, 0.12);
}
.menu-collapsed-icon-debug .ant-menu-item-icon svg,
.menu-collapsed-icon-debug .ant-menu-submenu-title .anticon svg {
  outline: 1px solid #1677ff;
  background: rgba(22, 119, 255, 0.16);
}
.menu-collapsed-icon-debug .ant-menu-title-content {
  outline: 1px dashed #52c41a;
  background: rgba(82, 196, 26, 0.12);
}
</style>
