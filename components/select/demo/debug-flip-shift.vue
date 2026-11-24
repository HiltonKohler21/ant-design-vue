<docs>
---
order: 20.4
debug: true
title:
  zh-CN: 翻转+偏移
  en-US: Flip + Shift
---

## zh-CN

翻转后如果不够则偏移以供完全的展示。

## en-US

Shift the popup if not enough space after flip.
</docs>

<template>
  <div
    ref="containerRef"
    :style="{
      height: '200px',
      overflow: 'auto',
      position: 'relative',
      border: '1px solid var(--ant-color-border-secondary, #f0f0f0)',
      borderRadius: '6px',
      padding: '16px',
    }"
  >
    <div :style="{ height: '320px', paddingTop: '80px' }">
      <a-select
        :style="{ width: '120px' }"
        :open="open"
        :get-popup-container="getPopupContainer"
        :options="options"
        placeholder="Select"
        @open-change="val => (open = val)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const containerRef = ref<HTMLElement | null>(null);
const open = ref(false);

const options = Array.from({ length: 100 }).map((_, index) => ({
  value: index,
  label: `Option ${index}`,
}));

const getPopupContainer = () => containerRef.value || document.body;
</script>
