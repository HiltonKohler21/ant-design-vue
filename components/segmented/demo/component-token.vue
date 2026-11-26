<docs>
---
order: 15
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
  <a-space direction="vertical">
    <a-config-provider :theme="theme1">
      <a-segmented v-model:value="value1" :options="options" />
    </a-config-provider>
    <a-config-provider :theme="theme2">
      <a-segmented v-model:value="value2" :options="options" />
    </a-config-provider>
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

type Theme = ConfigProviderProps['theme'];

const options = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
const value1 = ref('Daily');
const value2 = ref('Daily');

const theme1: Theme = {
  components: {
    Segmented: {
      itemColor: '#222',
      itemHoverColor: '#333',
      itemHoverBg: 'rgba(0, 0, 0, 0.06)',
      itemSelectedBg: '#aaa',
      itemActiveBg: '#ccc',
      itemSelectedColor: '#fff',
    } as Record<string, any>,
  },
};

const theme2: Theme = {
  components: {
    Segmented: {
      itemColor: '#222',
      itemHoverColor: '#333',
      itemHoverBg: 'rgba(0, 0, 0, 0.06)',
      itemSelectedBg: 'linear-gradient(225deg, #c200ff 0%, #00ffff 100%)',
      itemActiveBg: '#ccc',
      itemSelectedColor: '#fff',
    } as Record<string, any>,
  },
};
</script>
