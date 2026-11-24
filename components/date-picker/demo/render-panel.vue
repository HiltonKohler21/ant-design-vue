<docs>
---
order: 29
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
    <InternalDatePicker />
  </div>
</template>

<script lang="ts" setup>
import { DatePicker } from 'ant-design-vue';

const InternalDatePicker = DatePicker._InternalPanelDoNotUseOrYouWillBeFired;
</script>
