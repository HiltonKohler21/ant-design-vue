<docs>
---
order: 17
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
    <div
      :style="{
        position: 'relative',
        height: '300px',
        overflow: 'hidden',
        padding: '32px',
        background: '#e6e6e6',
      }"
    >
      <a-button type="primary" @click="open = true">Open Drawer</a-button>
      <a-drawer
        title="Hello Title"
        :open="open"
        :get-container="false"
        :style="{ position: 'absolute' }"
        @close="open = false"
      >
        Hello Content
        <template #footer>Footer!</template>
      </a-drawer>
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const open = ref(false);

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Drawer: {
      footerPaddingBlock: 0,
      footerPaddingInline: 0,
    } as Record<string, any>,
  },
};
</script>
