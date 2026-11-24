<docs>
---
order: 102
debug: true
title:
  zh-CN: 图标按钮
  en-US: Icon
---

## zh-CN

可以扩展 `controls` 属性用以设置自定义图标。

## en-US

When you need to use a custom `Icon`, you can set the `Icon` component as the property value of `upIcon` and `downIcon`.
</docs>

<template>
  <a-input-number :controls="controlsConfig" :default-value="3" />
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons-vue';

const controlsConfig = {
  upIcon: h(ArrowUpOutlined),
  downIcon: h(ArrowDownOutlined),
};
</script>
