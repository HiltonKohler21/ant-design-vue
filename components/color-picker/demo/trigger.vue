<docs>
---
order: 7
title:
  zh-CN: 自定义触发器
  en-US: Custom Trigger
---

## zh-CN

通过默认插槽自定义颜色选择器的触发器。

## en-US

Customize the color picker trigger via the default slot.

</docs>
<template>
  <a-space :size="16">
    <a-color-picker v-model:value="color">
      <a-button type="primary" :style="{ backgroundColor: color, borderColor: color }">
        选择主题颜色
      </a-button>
    </a-color-picker>
    <a-color-picker v-model:value="color">
      <a-tag :color="color" style="cursor: pointer; padding: 4px 8px">
        {{ color }}
      </a-tag>
    </a-color-picker>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const color = ref('#1677ff');
</script>
