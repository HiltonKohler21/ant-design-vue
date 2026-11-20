<docs>
---
order: 1
title:
  zh-CN: 受控模式
  en-US: Controlled Mode
---

## zh-CN

通过 `value` 和 `onChange`（或 `onChangeComplete`）受控管理颜色状态。

## en-US

Manage color state in controlled mode via `value` and `onChange` (or `onChangeComplete`).

</docs>
<template>
  <a-space direction="vertical" :size="16">
    <a-space>
      <a-color-picker v-model:value="color" />
      <span>实时受控：{{ color }}</span>
    </a-space>
    <a-space>
      <a-color-picker :value="completedColor" @changeComplete="onComplete" />
      <span>完成时受控：{{ completedColor }}</span>
    </a-space>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const color = ref('#1677ff');
const completedColor = ref('#52c41a');

const onComplete = (val: string) => {
  completedColor.value = val;
};
</script>
