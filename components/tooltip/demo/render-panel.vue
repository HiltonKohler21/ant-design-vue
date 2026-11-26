<docs>
---
order: 9
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
  <div :style="{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start' }">
    <InternalTooltip title="Hello, Pink Pure Panel!" color="pink" />
    <InternalTooltip title="Hello, Customize Color Pure Panel!" color="#f50" />
    <InternalTooltip
      title="Hello, Pure Panel!"
      placement="bottomLeft"
      :style="{ width: '200px' }"
    />
  </div>
</template>

<script lang="ts" setup>
import { Tooltip } from '@hiltonkohler21/ant-design-vue';

const InternalTooltip = Tooltip._InternalPanelDoNotUseOrYouWillBeFired;
</script>
