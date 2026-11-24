<docs>
---
order: 11
version: 4.3.0
title:
  zh-CN: 动态增减节点
  en-US: Dynamic edit nodes
---

## zh-CN

通过设置 `range.editable` 开启动态增减节点（点击轨道新增节点，将节点拖离轨道或按 Delete 键删除节点），可配合 `minCount` 与 `maxCount` 限制节点数量。

## en-US

Enable dynamic adding and removing of handles via `range.editable` (click the rail to add a node, drag a handle away or press Delete to remove), bounded by `minCount` and `maxCount`.
</docs>

<template>
  <a-slider v-model:value="value" :range="{ editable: true, minCount: 1, maxCount: 5 }" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref<number[]>([20, 80]);
</script>
