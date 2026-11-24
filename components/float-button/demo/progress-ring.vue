<docs>
---
order: 11
version: 4.3.0
title:
  zh-CN: 滚动进度
  en-US: Progress ring
---

## zh-CN

通过 `showProgress` 在回到顶部按钮边缘展示当前滚动进度。

## en-US

Use `showProgress` to display the current scroll progress around the BackTop button edge.
</docs>

<template>
  <div :style="{ position: 'relative' }">
    <div
      ref="scrollContainerRef"
      :style="{
        height: '240px',
        overflow: 'auto',
        padding: '16px',
        border: '1px solid var(--ant-color-border-secondary, rgba(0, 0, 0, 0.06))',
        borderRadius: '8px',
      }"
    >
      <p :style="{ color: 'var(--ant-color-text-tertiary, #999)' }">
        Scroll to bottom to view progress ring
      </p>
      <div v-for="i in 30" :key="i" :style="{ lineHeight: '28px' }">
        Scroll content line {{ i }}
      </div>
    </div>
    <a-float-button-back-top
      show-progress
      :visibility-height="0"
      :target="getTarget"
      shape="circle"
      :style="{ position: 'absolute', insetInlineEnd: '24px', bottom: '24px' }"
    />
    <a-float-button-back-top
      show-progress
      :visibility-height="0"
      :target="getTarget"
      shape="square"
      :style="{ position: 'absolute', insetInlineEnd: '84px', bottom: '24px' }"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const scrollContainerRef = ref<HTMLElement | null>(null);
const getTarget = () => scrollContainerRef.value || window;
</script>
