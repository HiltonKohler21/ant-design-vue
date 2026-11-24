<docs>
---
order: 5
title:
  zh-CN: 动态展示
  en-US: Dynamic
---

## zh-CN

会动的进度条才是好进度条。

## en-US

A dynamic progress bar is better.

</docs>

<template>
  <a-flex vertical gap="small">
    <a-flex vertical gap="small">
      <a-progress :percent="percent" type="line" />
      <a-progress :percent="percent" type="circle" />
    </a-flex>
    <a-space-compact>
      <a-button @click="decline">
        <template #icon><minus-outlined /></template>
      </a-button>
      <a-button @click="increase">
        <template #icon><plus-outlined /></template>
      </a-button>
    </a-space-compact>
  </a-flex>
</template>
<script lang="ts" setup>
import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';

const percent = ref<number>(0);

const increase = () => {
  const newPercent = percent.value + 10;
  percent.value = newPercent > 100 ? 100 : newPercent;
};

const decline = () => {
  const newPercent = percent.value - 10;
  percent.value = newPercent < 0 ? 0 : newPercent;
};
</script>
