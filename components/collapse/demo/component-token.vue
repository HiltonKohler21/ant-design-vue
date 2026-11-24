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
  <a-config-provider :theme="themeConfig">
    <a-collapse v-model:active-key="activeKey">
      <a-collapse-panel key="1" :header="`This is panel header 1, (${text})`">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="2" :header="`This is panel header 2, (${text})`">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="3" :header="`This is panel header 3, (${text})`">
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const activeKey = ref<string[]>([]);
const text = 'Ant Design! '.repeat(26);

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Collapse: {
      headerPadding: '0px 10px 20px 30px',
      headerBg: '#eaeeff',
      contentPadding: '0px 10px 20px 30px',
      contentBg: '#e6f7ff',
    } as Record<string, any>,
  },
};
</script>
