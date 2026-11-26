<docs>
---
order: 9
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
  <a-config-provider :theme="theme">
    <a-result
      status="success"
      title="Successfully Purchased Cloud Server ECS!"
      sub-title="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
    >
      <template #extra>
        <a-button key="console" type="primary">Go Console</a-button>
        <a-button key="buy">Buy Again</a-button>
      </template>
    </a-result>
  </a-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

const theme: ConfigProviderProps['theme'] = {
  components: {
    Result: {
      titleFontSize: 18,
      subtitleFontSize: 14,
      iconFontSize: 48,
      extraMargin: '12px 0 0 0',
    } as Record<string, any>,
  },
};
</script>
