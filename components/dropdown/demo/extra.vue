<docs>
---
order: 1
version: 4.3.0
title:
  zh-CN: 额外节点
  en-US: Extra node
---

## zh-CN

带有快捷方式的下拉菜单。

## en-US

The dropdown menu with shortcut.
</docs>

<template>
  <a-dropdown :menu="{ items }">
    <a class="ant-dropdown-link" @click.prevent>
      <a-space>
        Hover me
        <DownOutlined />
      </a-space>
    </a>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { DownOutlined, SettingOutlined } from '@ant-design/icons-vue';

const items = [
  {
    key: '1',
    label: 'My Account',
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    key: '2',
    label: 'Profile',
    extra: '⌘P',
  },
  {
    key: '3',
    label: 'Billing',
    extra: '⌘B',
  },
  {
    key: '4',
    label: 'Settings',
    icon: h(SettingOutlined),
    extra: '⌘S',
  },
];
</script>
