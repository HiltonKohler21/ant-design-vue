<docs>
---
order: 8
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
    <a-mentions v-model:value="value" style="width: 100%" :options="options" />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const value = ref<string>('@');

const options = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
];

const theme: ConfigProviderProps['theme'] = {
  components: {
    Mentions: {
      dropdownHeight: 500,
      controlItemWidth: 300,
      zIndexPopup: 1000,
    } as Record<string, any>,
  },
};
</script>
