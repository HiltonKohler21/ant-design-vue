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
  <a-flex wrap="wrap" :gap="16" align="flex-end" :style="{ paddingTop: '160px' }">
    <InternalFloatButton back-top />
    <InternalFloatButton :icon="h(CustomerServiceOutlined)" />
    <InternalFloatButton
      :icon="h(QuestionCircleOutlined)"
      content="HELP"
      shape="square"
      type="primary"
    />
    <InternalFloatButton shape="square" :items="items" />
    <InternalFloatButton open :icon="h(CustomerServiceOutlined)" trigger="click" :items="items" />
  </a-flex>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import {
  CustomerServiceOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue';
import { FloatButton } from 'ant-design-vue';

/** Test usage. Do not use in your production. */
const InternalFloatButton = FloatButton._InternalPanelDoNotUseOrYouWillBeFired;

const items = [
  { icon: h(QuestionCircleOutlined) },
  { icon: h(CustomerServiceOutlined) },
  { icon: h(SyncOutlined) },
];
</script>
