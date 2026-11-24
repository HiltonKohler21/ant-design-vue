<docs>
---
order: 13
debug: true
title:
  zh-CN: 调试小圆点使用
  en-US: Debug dot
---

## zh-CN

调试使用。

## en-US

Debug use.
</docs>

<template>
  <div
    :style="{
      position: 'relative',
      height: '180px',
      padding: '16px',
      border: '1px solid var(--ant-color-border-secondary, rgba(0, 0, 0, 0.06))',
      borderRadius: '8px',
    }"
  >
    <a-slider v-model:value="radius" :min="0" :max="20" :style="{ margin: '16px' }" />
    <a-config-provider :theme="themeConfig">
      <a-float-button
        shape="square"
        :badge="{ dot: true }"
        :style="{ position: 'absolute', insetInlineEnd: '24px', bottom: '24px' }"
      />
    </a-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const radius = ref(0);

const themeConfig = computed<ConfigProviderProps['theme']>(() => ({
  token: {
    borderRadius: radius.value,
    borderRadiusLG: radius.value,
  },
}));
</script>
