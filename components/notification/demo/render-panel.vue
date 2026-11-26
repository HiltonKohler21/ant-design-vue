<docs>
---
order: 12
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
  <InternalPanel
    title="Hello World!"
    description="Hello World?"
    type="success"
    :actions="actionsNode"
  />
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { Button, notification } from '@hiltonkohler21/ant-design-vue';

/** Test usage. Do not use in your production. */
const InternalPanel = notification._InternalPanelDoNotUseOrYouWillBeFired;

const actionsNode = () => h(Button, { type: 'primary', size: 'small' }, () => 'My Button');
</script>
