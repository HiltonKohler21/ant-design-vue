<docs>
---
order: 5
title:
  zh-CN: 自定义指示符
  en-US: Custom spinning indicator
---

## zh-CN

使用自定义指示符。

## en-US

Use custom loading indicator.

</docs>

<template>
  <a-flex align="center" gap="medium">
    <a-spin :indicator="indicator" size="small" />
    <a-spin :indicator="indicator" />
    <a-spin :indicator="indicator" size="large" />
    <a-spin :indicator="largeIndicator" />
  </a-flex>
</template>
<script lang="ts" setup>
import { LoadingOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

const indicator = h(LoadingOutlined, { spin: true });
const largeIndicator = h(LoadingOutlined, {
  style: {
    fontSize: '48px',
  },
  spin: true,
});
</script>
