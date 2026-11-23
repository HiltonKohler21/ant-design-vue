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
  <div style="position: relative">
    <div
      ref="containerRef"
      :style="{
        height: '240px',
        overflow: 'auto',
        padding: '16px',
        border: '1px solid var(--ant-color-border-secondary, #f0f0f0)',
        borderRadius: '8px',
      }"
    >
      <p style="color: var(--ant-color-text-secondary, #999); font-size: 14px">
        Scroll down to see the bottom-right
        <span style="color: var(--ant-color-primary, #1677ff)">BackTop</span>
        button.
      </p>
      <div v-for="i in 30" :key="i" style="line-height: 28px">Scroll content line {{ i }}</div>
    </div>
    <a-back-top
      :target="() => containerRef"
      :visibility-height="50"
      :style="{ position: 'absolute', right: '24px', bottom: '24px' }"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const containerRef = ref<HTMLElement>();
</script>
