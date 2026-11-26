<docs>
---
order: 17
debug: true
title:
  zh-CN: _InternalPanelDoNotUseOrYouWillBeFired
  en-US: _InternalPanelDoNotUseOrYouWillBeFired
---

## zh-CN

调试用组件，请勿直接使用。

## en-US

Debug usage. Do not use in your production.
</docs>

<template>
  <div :style="{ maxWidth: '100%', overflowX: 'auto' }">
    <InternalTimePicker />
  </div>
</template>

<script lang="ts" setup>
import { TimePicker } from '@hiltonkohler21/ant-design-vue';

const InternalTimePicker = TimePicker._InternalPanelDoNotUseOrYouWillBeFired;
</script>
