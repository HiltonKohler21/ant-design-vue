<docs>
---
order: 15
debug: true
title:
  zh-CN: Pure Render
  en-US: Pure Render
---

## zh-CN

Pure Panel

## en-US

Pure Panel
</docs>

<template>
  <div :style="{ paddingInlineStart: '24px', maxWidth: '100%', overflowX: 'auto' }">
    <PureRenderColorPicker v-model:value="color" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ColorPicker } from 'ant-design-vue';

const PureRenderColorPicker = ColorPicker._InternalPanelDoNotUseOrYouWillBeFired;

const color = ref('#1677ff');
</script>
