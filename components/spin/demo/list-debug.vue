<docs>
---
order: 9
debug: true
title:
  zh-CN: List 嵌套调试
  en-US: Nested in List debug
---

## zh-CN

在非加载状态的 Spin 容器（如 List）中嵌套独立 Spin 的调试示例。

## en-US

Debug example for standalone Spin components nested in a non-spinning Spin container (e.g. List).
</docs>

<template>
  <a-spin :spinning="false">
    <a-flex vertical gap="small">
      <a-flex v-for="item in items" :key="item" justify="space-between" align="center">
        {{ item }}
        <a-spin size="small" />
      </a-flex>
    </a-flex>
  </a-spin>
</template>

<script lang="ts" setup>
const items = ['Apple', 'Banana'];
</script>
