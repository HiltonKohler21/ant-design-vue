<docs>
---
order: 3
debug: true
title:
  zh-CN: 多选 Debug
  en-US: Multiple Debug
---

## zh-CN

非响应式间距测试。

## en-US

Non-responsive spacing test.
</docs>

<template>
  <a-flex vertical gap="small" style="max-width: 100%">
    <a-date-picker multiple placeholder="Bamboo" />
    <a-date-picker multiple :default-value="defaultValue" size="small" />
    <a-date-picker multiple :default-value="defaultValue" />
    <a-date-picker multiple :default-value="defaultValue" size="large" />
  </a-flex>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';

const defaultValue = Array.from({ length: 10 }).map((_, i) => dayjs('2000-01-01').add(i, 'day'));
</script>
