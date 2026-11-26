<docs>
---
order: 7
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
    <a-skeleton loading active />
  </a-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

const theme: ConfigProviderProps['theme'] = {
  components: {
    Skeleton: {
      blockRadius: 30,
      titleHeight: 50,
      gradientFromColor: '#222',
      gradientToColor: '#444',
      paragraphMarginTop: 30,
      paragraphLiHeight: 30,
    } as Record<string, any>,
  },
};
</script>
