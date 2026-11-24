<docs>
---
order: 7
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
    <a-space>
      <a-popover title="Title">
        <template #content>
          <div>
            <p>Content</p>
            <p>Content</p>
          </div>
        </template>
        <a-button>Default Popover</a-button>
      </a-popover>
      <a-popover title="Title" placement="bottomLeft" :overlay-style="{ width: '250px' }">
        <template #content>
          <div>
            <p>Content</p>
            <p>Content</p>
          </div>
        </template>
        <a-button>BottomLeft (250px)</a-button>
      </a-popover>
    </a-space>
  </a-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps } from 'ant-design-vue';

const theme: ConfigProviderProps['theme'] = {
  components: {
    Popover: {
      titleMinWidth: 40,
    } as Record<string, any>,
  },
};
</script>
