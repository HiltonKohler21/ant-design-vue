<docs>
---
order: 20
title:
  zh-CN: 自定义禁用样式背景
  en-US: Custom Disabled Background
---

## zh-CN

自定义 `disabled` 下的背景颜色（适用 `default` 和 `dashed` 类型）。

## en-US

Customize the background color with `disabled` (applicable to type `default` and `dashed`).
</docs>

<template>
  <a-flex gap="small" wrap="wrap">
    <a-config-provider :theme="disabledBgTheme">
      <a-button type="primary" disabled>Primary Button</a-button>
      <a-button disabled>Default Button</a-button>
      <a-button type="dashed" disabled>Dashed Button</a-button>
    </a-config-provider>
  </a-flex>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps } from 'ant-design-vue';

const disabledBgTheme: ConfigProviderProps['theme'] = {
  components: {
    Button: {
      defaultBgDisabled: 'rgba(0,0,0,0.1)',
      dashedBgDisabled: 'rgba(0,0,0,0.4)',
    } as Record<string, any>,
  },
};
</script>
