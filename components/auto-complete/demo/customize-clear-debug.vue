<docs>
---
order: 10
debug: true
title:
  zh-CN: 自定义输入组件配合清除按钮 Debug
  en-US: Custom input with allowClear debug
---

## zh-CN

自定义输入组件配合 `allowClear` 时的悬浮态 Debug。

## en-US

Custom input with `allowClear` on hover debug.
</docs>

<template>
  <a-flex vertical :gap="24" :style="{ width: '300px', maxWidth: '100%' }">
    <a-auto-complete allow-clear default-value="Burnaby" :options="options">
      <a-input />
    </a-auto-complete>
    <a-auto-complete allow-clear default-value="Burnaby" :options="options">
      <a-textarea />
    </a-auto-complete>
  </a-flex>
</template>

<script lang="ts" setup>
const options = [{ value: 'Burnaby' }, { value: 'Seattle' }, { value: 'Los Angeles' }];
</script>
