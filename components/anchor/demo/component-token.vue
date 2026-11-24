<docs>
---
order: 11
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

Component Token Debug.

## en-US

Component Token Debug.
</docs>

<template>
  <a-config-provider :theme="themeConfig">
    <a-row>
      <a-col :span="16">
        <div id="token-part-1" style="height: 100vh; background: rgba(255, 0, 0, 0.02)" />
        <div id="token-part-2" style="height: 100vh; background: rgba(0, 255, 0, 0.02)" />
        <div id="token-part-3" style="height: 100vh; background: rgba(0, 0, 255, 0.02)" />
      </a-col>
      <a-col :span="8">
        <a-anchor :items="items" />
      </a-col>
    </a-row>
  </a-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps } from 'ant-design-vue';

const items = [
  {
    key: 'token-part-1',
    href: '#token-part-1',
    title: 'Part 1',
  },
  {
    key: 'token-part-2',
    href: '#token-part-2',
    title: 'Part 2',
  },
  {
    key: 'token-part-3',
    href: '#token-part-3',
    title: 'Part 3',
  },
];

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Anchor: {
      linkPaddingBlock: 100,
      linkPaddingInlineStart: 50,
    } as Record<string, any>,
  },
};
</script>
