<docs>
---
order: 17
title:
  zh-CN: 渐变按钮
  en-US: Gradient Button
---

## zh-CN

自定义为渐变背景按钮。

## en-US

Buttons with a gradient background.
</docs>

<template>
  <a-config-provider :button="{ className: 'linear-gradient-button' }">
    <a-space class="linear-gradient-wrapper">
      <a-button type="primary" size="large" :icon="h(AntDesignOutlined)">Gradient Button</a-button>
      <a-button size="large">Button</a-button>
    </a-space>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { AntDesignOutlined } from '@ant-design/icons-vue';
</script>

<style scoped>
.linear-gradient-wrapper
  :deep(.linear-gradient-button.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous) > span) {
  position: relative;
}

.linear-gradient-wrapper
  :deep(.linear-gradient-button.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous)::before) {
  content: '';
  background: linear-gradient(135deg, #6253e1, #04befe);
  position: absolute;
  inset: -1px;
  opacity: 1;
  transition: all var(--ant-motion-duration-slow, 0.3s);
  border-radius: inherit;
}

.linear-gradient-wrapper
  :deep(
    .linear-gradient-button.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous):hover::before
  ) {
  opacity: 0;
}
</style>
