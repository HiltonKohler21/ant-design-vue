<docs>
---
order: 3
version: 5.14.0
title:
  zh-CN: 选择确认
  en-US: Need Confirm
---

## zh-CN

使用 `needConfirm` 属性控制是否在面板底部展示确认按钮，点击确认后生效。

## en-US

Use `needConfirm` to require clicking the confirm button before applying the selected date.

</docs>

<template>
  <a-space direction="vertical" :size="12">
    <a-date-picker v-model:value="value" need-confirm @change="onChange" />
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Dayjs } from 'dayjs';

const value = ref<Dayjs>();
const onChange = (date: Dayjs | string, dateString: string) => {
  console.log(date, dateString);
};
</script>
