<docs>
---
order: 6
title:
  zh-CN: 可复制
  en-US: Copyable
---

## zh-CN

提供可复制的交互能力及相关配置。

## en-US

Makes Typography copyable with related configuration options.
</docs>
<template>
  <a-typography-paragraph copyable>This is a copyable text.</a-typography-paragraph>
  <a-typography-paragraph :copyable="{ text: 'Hello, Ant Design!' }">
    Replace copy text.
  </a-typography-paragraph>
  <a-typography-paragraph
    :copyable="{
      icon: [h(SmileOutlined, { key: 'copy-icon' }), h(SmileFilled, { key: 'copied-icon' })],
      tooltips: ['click here', 'you clicked!!'],
    }"
  >
    Custom Copy icon and replace tooltips text.
  </a-typography-paragraph>
  <a-typography-paragraph :copyable="{ tooltips: false }">
    Hide Copy tooltips.
  </a-typography-paragraph>
  <a-typography-paragraph :copyable="{ text: requestCopyText }">
    Request copy text.
  </a-typography-paragraph>
  <a-typography-paragraph copyable :actions="{ placement: 'start' }">
    Copy action at the start.
  </a-typography-paragraph>
  <a-typography-text :copyable="{ text: 'text to be copied' }" />
</template>
<script lang="ts" setup>
import { h } from 'vue';
import { SmileFilled, SmileOutlined } from '@ant-design/icons-vue';

const requestCopyText = async () =>
  new Promise<string>(resolve => {
    setTimeout(() => {
      resolve('Request text');
    }, 500);
  });
</script>
