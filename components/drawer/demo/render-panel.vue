<docs>
---
order: 15
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
  <div :style="{ padding: '32px', background: '#e6e6e6' }">
    <InternalDrawer title="Hello Title" :style="{ height: '300px' }" footer="Footer!">
      Hello Content
    </InternalDrawer>
  </div>
</template>

<script lang="ts" setup>
import { Drawer } from 'ant-design-vue';

/** Test usage. Do not use in your production. */
const InternalDrawer = Drawer._InternalPanelDoNotUseOrYouWillBeFired;
</script>
