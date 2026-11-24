<docs>
---
order: 6
title:
  zh-CN: 布局变化后重新对齐
  en-US: Realign after layout changes
---

## zh-CN

当异步加载数据、刷新列表或展开折叠区域导致触发元素位置发生变化时，可以通过 `ref` 调用 `forceAlign` 方法重新对齐 Tooltip。

## en-US

When async data loading or layout updates shift the trigger element, call `forceAlign` via `ref` to realign the Tooltip.
</docs>

<template>
  <div ref="containerRef" :style="{ position: 'relative', minHeight: '160px', paddingTop: '48px' }">
    <div v-if="loaded" :style="{ height: '80px', marginBottom: '16px' }">Async content loaded.</div>
    <a-space>
      <a-tooltip
        ref="tooltipRef"
        title="Tooltip stays aligned"
        open
        placement="top"
        :get-popup-container="getPopupContainer"
      >
        <a-button>Trigger</a-button>
      </a-tooltip>
      <a-button size="small" @click="toggleLoaded">
        {{ loaded ? 'Collapse Async Content' : 'Load Async Content' }}
      </a-button>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const containerRef = ref<HTMLDivElement>();
const tooltipRef = ref<{ forceAlign: () => void }>();
const loaded = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

const getPopupContainer = () => containerRef.value || document.body;

const toggleLoaded = async () => {
  loaded.value = !loaded.value;
  await nextTick();
  tooltipRef.value?.forceAlign();
};

onMounted(() => {
  timer = setTimeout(async () => {
    loaded.value = true;
    await nextTick();
    tooltipRef.value?.forceAlign();
  }, 2000);
});

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
});
</script>
