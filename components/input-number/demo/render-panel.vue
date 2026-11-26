<docs>
---
order: 103
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
  <div :style="{ display: 'flex', flexDirection: 'column', rowGap: '16px' }">
    <InternalInputNumber :style="{ width: '100%' }" />
  </div>
</template>

<script lang="ts" setup>
import { InputNumber } from '@hiltonkohler21/ant-design-vue';

const InternalInputNumber = InputNumber._InternalPanelDoNotUseOrYouWillBeFired;
</script>
