<docs>
---
order: 16
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

自定义组件 Token。

## en-US

Custom component token.
</docs>

<template>
  <a-config-provider :theme="timelineTheme">
    <a-timeline :items="items" />
  </a-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps, TimelineProps } from 'ant-design-vue';

const timelineTheme: ConfigProviderProps['theme'] = {
  components: {
    Timeline: {
      tailColor: 'red',
      tailWidth: 10,
      dotBorderWidth: 1,
      dotBg: 'yellow',
      dotSize: 20,
      itemPaddingBottom: 10,
    } as Record<string, any>,
  },
};

const items: TimelineProps['items'] = [
  {
    content: 'Create a services site 2015-09-01',
  },
  {
    content: 'Solve initial network problems 2015-09-01',
  },
  {
    content: 'Technical testing 2015-09-01',
  },
  {
    content: 'Network problems being solved 2015-09-01',
  },
];
</script>
