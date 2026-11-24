<docs>
---
order: 10
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
    <a-space direction="vertical">
      <a-badge :count="5">
        <a-avatar shape="square" size="large" />
      </a-badge>
      <a-badge :count="26" />
      <a-badge dot>
        <NotificationOutlined />
      </a-badge>
      <a-badge status="success" text="Success" />
      <a-badge size="small" :count="0" show-zero />
    </a-space>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { NotificationOutlined } from '@ant-design/icons-vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Badge: {
      indicatorHeight: 24,
      indicatorHeightSM: 18,
      dotSize: 4,
      textFontWeight: 'bold',
      statusSize: 8,
      paddingInline: 12,
    } as Record<string, any>,
  },
};
</script>
