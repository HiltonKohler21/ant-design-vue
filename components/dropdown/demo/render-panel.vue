<docs>
---
order: 19
debug: true
title:
  zh-CN: _InternalPanelDoNotUseOrYouWillBeFired
  en-US: _InternalPanelDoNotUseOrYouWillBeFired
---

## zh-CN

调试用组件，请勿直接使用。

## en-US

Debug usage. Do not use in your production.
</docs>

<template>
  <InternalDropdown :menu="{ items }" />
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { SmileOutlined } from '@ant-design/icons-vue';
import { Dropdown } from '@hiltonkohler21/ant-design-vue';

const InternalDropdown = Dropdown._InternalPanelDoNotUseOrYouWillBeFired;

const items = [
  {
    key: '1',
    label: h(
      'a',
      { target: '_blank', rel: 'noopener noreferrer', href: 'https://www.antgroup.com' },
      '1st menu item',
    ),
  },
  {
    key: '2',
    label: h(
      'a',
      { target: '_blank', rel: 'noopener noreferrer', href: 'https://www.aliyun.com' },
      '2nd menu item (disabled)',
    ),
    icon: h(SmileOutlined),
    disabled: true,
  },
  {
    key: '3',
    label: h(
      'a',
      { target: '_blank', rel: 'noopener noreferrer', href: 'https://www.luohanacademy.com' },
      '3rd menu item (disabled)',
    ),
    disabled: true,
  },
  {
    key: '4',
    danger: true,
    label: 'a danger item',
  },
];
</script>
