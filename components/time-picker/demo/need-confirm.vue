<docs>
---
order: 3
version: 4.3.0
title:
  zh-CN: 选择确认
  en-US: Need Confirm
---

## zh-CN

使用 `needConfirm` 属性控制是否需要点击确认按钮生效（设置 `:need-confirm="false"` 可直接选择生效）。

## en-US

Use `needConfirm` to control whether clicking the OK button is required to confirm selection.

</docs>

<template>
  <a-space direction="vertical" :size="12">
    <a-time-picker v-model:value="value1" need-confirm placeholder="Need confirm" />
    <a-time-picker v-model:value="value2" :need-confirm="false" placeholder="Instant select" />
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Dayjs } from 'dayjs';

const value1 = ref<Dayjs>();
const value2 = ref<Dayjs>();
</script>
