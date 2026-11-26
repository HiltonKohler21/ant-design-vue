<docs>
---
order: 15
debug: true
title:
  zh-CN: 自定义主题
  en-US: Customize Addon with theme
---

## zh-CN

使用 `ConfigProvider` 自定义 `Space.Addon` 的主题样式。

## en-US

Use `ConfigProvider` to customize the theme of `Space.Addon`.
</docs>

<template>
  <a-config-provider :theme="theme">
    <a-space-compact>
      <a-space-addon>Addon</a-space-addon>
      <a-button type="primary">Button</a-button>
    </a-space-compact>
  </a-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

const theme: ConfigProviderProps['theme'] = {
  components: {
    Space: { colorText: 'blue', algorithm: true } as Record<string, any>,
  },
};
</script>
