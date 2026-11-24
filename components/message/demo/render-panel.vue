<docs>
---
order: 10
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
  <InternalPanel content="Hello World!" type="error" />
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';

/** Test usage. Do not use in your production. */
const InternalPanel = message._InternalPanelDoNotUseOrYouWillBeFired;
</script>
