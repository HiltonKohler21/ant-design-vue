<docs>
---
order: 9
version: 4.3.0
title:
  zh-CN: 拨轮
  en-US: Spinner
---

## zh-CN

数字拨轮。

## en-US

Digit spinner.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-input-number
      mode="spinner"
      :min="1"
      :max="10"
      :default-value="3"
      :style="{ width: '150px' }"
      placeholder="Outlined"
      @change="onChange"
    />
    <a-input-number
      mode="spinner"
      variant="filled"
      :min="1"
      :max="10"
      :default-value="3"
      :style="{ width: '150px' }"
      placeholder="Filled"
      @change="onChange"
    />
  </a-flex>
</template>

<script lang="ts" setup>
const onChange = (value: number | string | null) => {
  console.log('changed', value);
};
</script>
