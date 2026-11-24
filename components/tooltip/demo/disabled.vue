<docs>
---
order: 11
title:
  zh-CN: 禁用
  en-US: Disabled
---

## zh-CN

通过设置 `:title="null"` 或者 `title=""` 可以禁用 Tooltip。

## en-US

The Tooltip can be disabled by setting `:title="null"` or `title=""`.
</docs>

<template>
  <a-tooltip :title="disabled ? null : 'prompt text'">
    <a-button @click="disabled = !disabled">{{ disabled ? 'Enable' : 'Disable' }}</a-button>
  </a-tooltip>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const disabled = ref(true);
</script>
