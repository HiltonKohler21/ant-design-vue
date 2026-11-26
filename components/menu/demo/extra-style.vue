<docs>
---
order: 14
debug: true
title:
  zh-CN: Extra Style debug
  en-US: Extra Style debug
---

## zh-CN

调试使用。

## en-US

Debug usage.
</docs>

<template>
  <a-space direction="vertical" :style="{ maxWidth: '100%' }">
    <a-menu
      mode="inline"
      :default-open-keys="['sub1']"
      :default-selected-keys="['1']"
      :style="{ width: '256px', maxWidth: '100%' }"
      :items="items1"
    />
    <a-menu theme="dark" :style="{ width: '256px', maxWidth: '100%' }" :items="items2" />
  </a-space>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { DownOutlined, MailOutlined } from '@ant-design/icons-vue';
import { Flex } from '@hiltonkohler21/ant-design-vue';
import type { MenuProps } from '@hiltonkohler21/ant-design-vue';

const items1: MenuProps['items'] = [
  {
    key: 'sub1',
    icon: () => h(MailOutlined),
    label: 'Navigation One',
    children: [
      {
        key: '1',
        label: h(
          Flex,
          { justify: 'space-between', align: 'center' },
          {
            default: () => [h('span', 'Option 1'), h(DownOutlined)],
          },
        ),
      },
      {
        key: '2',
        label: 'Option 2',
        extra: '⌘P',
      },
      {
        key: '3',
        label: h(
          'a',
          { href: 'https://hiltonkohler21.github.io/ant-design-vue', target: '_blank' },
          'Link Option',
        ),
        disabled: true,
      },
    ],
  },
];

const items2: MenuProps['items'] = [
  { key: '1', label: 'Users', extra: '⌘U' },
  { key: '2', label: 'Profile', extra: '⌘P' },
];
</script>
