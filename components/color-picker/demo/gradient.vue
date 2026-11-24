<docs>
---
order: 3
version: 5.20.0
title:
  zh-CN: 渐变色
  en-US: Linear Gradient
---

## zh-CN

通过配置 `mode="['single', 'gradient']"` 支持单一颜色与线性渐变色切换。

## en-US

Support switching between single colors and linear gradients by setting `mode="['single', 'gradient']"`.

</docs>
<template>
  <a-space
    direction="vertical"
    :size="12"
    style="max-width: 100%"
    :styles="{ item: { minWidth: 0, maxWidth: '100%' } }"
  >
    <a-color-picker v-model:value="color" :mode="['single', 'gradient']" showText />
    <div style="font-size: 13px; color: #888; overflow-wrap: anywhere; word-break: break-word">
      CSS 结果：{{ color }}
    </div>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const color = ref('linear-gradient(90deg, rgb(22, 119, 255) 0%, rgb(82, 196, 26) 100%)');
</script>
