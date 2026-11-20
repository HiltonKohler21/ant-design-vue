<docs>
---
order: 6
title:
  zh-CN: 清除颜色
  en-US: Allow Clear
---

## zh-CN

通过 `allowClear` 允许清除已选择的颜色。

## en-US

Allow clearing the selected color via `allowClear`.

</docs>
<template>
  <a-space direction="vertical" :size="12">
    <a-color-picker v-model:value="color" allowClear showText />
    <span style="font-size: 13px; color: #888">当前颜色：{{ color || '(已清除)' }}</span>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const color = ref('#1677ff');
</script>
