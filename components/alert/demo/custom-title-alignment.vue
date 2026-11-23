<docs>
---
order: 10
title:
  zh-CN: 自定义标题对齐
  en-US: Custom Title Alignment
---

## zh-CN

未设置 `description` 时，Alert 默认将图标、内容、操作区和关闭按钮整体垂直居中。当标题较长需要换行且希望图标与操作按钮与首行对齐时，可通过自定义样式调整对齐方式。

## en-US

Without `description`, Alert vertically centers the icon, content, action, and close button as a group. When a wrapping message should align those elements with the first line, override the alignment via CSS.
</docs>

<template>
  <a-flex vertical gap="middle" style="max-width: 360px">
    <a-radio-group v-model:value="alignMode" size="small">
      <a-radio-button value="first-line">First-line aligned</a-radio-button>
      <a-radio-button value="center">Default (center)</a-radio-button>
    </a-radio-group>

    <a-alert
      :class="{ 'alert-first-line-align': alignMode === 'first-line' }"
      :message="longMessage"
      type="info"
      show-icon
      closable
    />

    <a-alert
      :class="{ 'alert-first-line-align': alignMode === 'first-line' }"
      :message="longMessage"
      type="success"
      show-icon
      closable
    >
      <template #action>
        <a-button size="small" type="text">Action</a-button>
      </template>
    </a-alert>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const alignMode = ref<'first-line' | 'center'>('first-line');
const longMessage =
  'Long alert title wraps to multiple lines when the alert container is narrow enough.';
</script>

<style scoped>
.alert-first-line-align {
  align-items: flex-start;
}

.alert-first-line-align :deep(.ant-alert-icon) {
  margin-block-start: 4px;
}

.alert-first-line-align :deep(.ant-alert-action) {
  margin-block-start: -1px;
}

.alert-first-line-align :deep(.ant-alert-close-icon) {
  margin-block-start: 5px;
}
</style>
