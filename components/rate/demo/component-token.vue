<docs>
---
order: 7
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

调试使用。

## en-US

Component Token Debug.
</docs>

<template>
  <a-config-provider :theme="theme">
    <a-rate v-model:value="value" allow-half />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const value = ref<number>(2.5);

const theme: ConfigProviderProps['theme'] = {
  components: {
    Rate: {
      starColor: 'blue',
      starSize: 40,
      starHoverScale: 'scale(2)',
      starBg: 'red',
    } as Record<string, any>,
  },
};
</script>
