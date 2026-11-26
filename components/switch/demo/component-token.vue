<docs>
---
order: 5
debug: true
title:
  zh-CN: 自定义组件 Token
  en-US: Custom component token
---

## zh-CN

自定义组件 Token。

## en-US

Custom component token.
</docs>

<template>
  <a-config-provider :theme="theme">
    <a-space>
      <a-switch v-model:checked="checked" />
    </a-space>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

const checked = ref(true);

const theme: ConfigProviderProps['theme'] = {
  components: {
    Switch: {
      trackHeight: 14,
      trackMinWidth: 32,
      colorPrimary: 'rgba(25, 118, 210, 0.5)',
      trackPadding: -3,
      handleSize: 20,
      handleBg: 'rgb(25, 118, 210)',
      handleShadow:
        'rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px',
    },
  },
};
</script>
