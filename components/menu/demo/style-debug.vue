<docs>
---
order: 11
debug: true
title:
  zh-CN: Style debug
  en-US: Style debug
---

## zh-CN

调试使用。

## en-US

Debug usage.
</docs>

<template>
  <div>
    <a-switch
      :checked="menuTheme === 'dark'"
      checked-children="Dark"
      un-checked-children="Light"
      @change="changeTheme"
    />
    <br />
    <br />
    <a-menu
      :theme="menuTheme"
      :selected-keys="[current]"
      mode="inline"
      :items="items"
      inline-collapsed
      :_internal-render-menu-item="renderMenuItem"
      :_internal-render-sub-menu-item="renderSubMenuItem"
      _internal-disable-menu-item-title-tooltip
      @click="onClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { cloneVNode, h, ref } from 'vue';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons-vue';
import type { MenuProps, MenuTheme } from '@hiltonkohler21/ant-design-vue';

const menuTheme = ref<MenuTheme>('dark');
const current = ref('1');

const items: MenuProps['items'] = [
  {
    key: 'sub1',
    label: 'Navigation One Long Long Long Long',
    icon: () => h(MailOutlined),
    children: [
      { key: '1', label: 'Option 1' },
      { key: '2', label: 'Option 2' },
      { key: '3', label: 'Option 3' },
      { key: '4', label: 'Option 4' },
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
  { key: '11', label: 'Option 11' },
  { key: '12', label: 'Option 12' },
];

const changeTheme = (value: boolean | string | number) => {
  menuTheme.value = value ? 'dark' : 'light';
};

const onClick: MenuProps['onClick'] = e => {
  current.value = String(e.key);
};

const renderMenuItem = (node: any) =>
  cloneVNode(node, {
    style: {
      textDecoration: 'underline',
    },
  });

const renderSubMenuItem = (node: any) =>
  cloneVNode(node, {
    style: {
      background: 'rgba(255, 255, 255, 0.3)',
    },
  });
</script>
