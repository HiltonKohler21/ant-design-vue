<docs>
---
order: 14
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
  <a-config-provider :theme="themeConfig">
    <a-alert
      title="Success Tips"
      description="Detailed description and advice about successful copywriting."
      type="success"
      show-icon
    >
      <template #icon>
        <SmileOutlined />
      </template>
    </a-alert>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { SmileOutlined } from '@ant-design/icons-vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Alert: {
      withDescriptionIconSize: 32,
      withDescriptionPadding: '16px',
    } as Record<string, any>,
  },
};
</script>
