<docs>
---
order: 4
title:
  zh-CN: 贴边偏移
  en-US: Auto Shift
---

## zh-CN

当 Tooltip 贴边时，自动偏移并且调整箭头位置。当超出过多时，则一同滚出可视区域。

## en-US

Auto adjust Popup and arrow position when Tooltip is close to the edge of the container. Will be out of view when exceeding limitation.
</docs>

<template>
  <div ref="containerRef" :style="scrollContainerStyle">
    <div :style="innerStyle">
      <a-tooltip
        ref="tooltipRef"
        title="Thanks for using antd. Have a nice day !"
        open
        :get-popup-container="getPopupContainer"
      >
        <a-button type="primary">Scroll The Container</a-button>
      </a-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';

const containerRef = ref<HTMLDivElement | null>(null);
const tooltipRef = ref<{ forceAlign?: () => void } | null>(null);

const scrollContainerStyle = {
  width: '100%',
  height: '300px',
  overflow: 'auto',
  position: 'relative' as const,
  border: '1px solid var(--ant-color-border-secondary, #f0f0f0)',
  borderRadius: '6px',
};

const innerStyle = {
  width: '200%',
  height: '700px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const getPopupContainer = () => containerRef.value as HTMLElement;

onMounted(() => {
  const el = containerRef.value;
  if (el) {
    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }
  nextTick(() => {
    tooltipRef.value?.forceAlign?.();
  });
});
</script>
