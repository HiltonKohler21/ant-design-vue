<docs>
---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

最简单的用法。

## en-US

The most basic usage.

</docs>

<template>
  <a-switch v-model:checked="checked" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const checked = ref<boolean>(false);
</script>
