<docs>
---
order: 1
debug: true
title:
  zh-CN: 顶部导航（dark）
  en-US: Top Navigation (dark)
---

## zh-CN

水平的顶部导航菜单。

## en-US

Horizontal top navigation menu.
</docs>

<template>
  <a-menu
    v-model:selected-keys="current"
    mode="horizontal"
    theme="dark"
    :items="items"
    :style="{ maxWidth: '100%' }"
    @click="onClick"
  />
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';

const current = ref<string[]>(['mail']);

const items: MenuProps['items'] = [
  {
    label: 'Navigation One',
    key: 'mail',
    icon: () => h(MailOutlined),
  },
  {
    label: 'Navigation Two',
    key: 'app',
    icon: () => h(AppstoreOutlined),
    disabled: true,
  },
  {
    label: 'Navigation Three - Submenu',
    key: 'SubMenu',
    icon: () => h(SettingOutlined),
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          { label: 'Option 1', key: 'setting:1' },
          { label: 'Option 2', key: 'setting:2' },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          { label: 'Option 3', key: 'setting:3' },
          { label: 'Option 4', key: 'setting:4' },
        ],
      },
    ],
  },
  {
    key: 'alipay',
    label: h(
      'a',
      { href: 'https://antdv.com', target: '_blank', rel: 'noopener noreferrer' },
      'Navigation Four - Link',
    ),
  },
];

const onClick: MenuProps['onClick'] = e => {
  current.value = [String(e.key)];
};
</script>
