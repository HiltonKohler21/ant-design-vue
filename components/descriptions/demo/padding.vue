<docs>
---
order: 3
debug: true
title:
  zh-CN: 间距
  en-US: Padding
---

## zh-CN

间距。

## en-US

Padding debug.
</docs>

<template>
  <a-flex :gap="8" vertical>
    <div :style="boxStyle">
      <a-descriptions title="User Info" :column="2" :items="items" />
    </div>
    <div :style="boxStyle">
      <a-descriptions layout="vertical" title="User Info" :column="2" :items="items" />
    </div>
  </a-flex>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import type { DescriptionsProps } from '@hiltonkohler21/ant-design-vue';

const boxStyle: CSSProperties = {
  width: '600px',
  maxWidth: '100%',
  border: '1px solid #d9d9d9',
  padding: '20px',
  boxSizing: 'border-box',
};

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'long',
    children: 'loooooooooooooooooooooooooooooooooooooooooooooooong',
  },
  {
    key: '2',
    label: 'long',
    children: 'loooooooooooooooooooooooooooooooooooooooooooooooong',
  },
  {
    key: '3',
    label: 'long',
    children: 'loooooooooooooooooooooooooooooooooooooooooooooooong',
  },
  {
    key: '4',
    label: 'long',
    children: 'loooooooooooooooooooooooooooooooooooooooooooooooong',
  },
  {
    key: '5',
    label: 'long',
    children: 'loooooooooooooooooooooooooooooooooooooooooooooooong',
  },
];
</script>
