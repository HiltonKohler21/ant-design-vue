<docs>
---
order: 3
title:
  zh-CN: 贴边偏移
  en-US: Auto Shift
---

## zh-CN

当 Popconfirm 贴边时，自动偏移并且调整箭头位置。当超出过多时，则一同滚出屏幕。

## en-US

Auto adjust Popup and arrow position when Popconfirm is close to the edge of the screen. Will be out of screen when exceed limitation.

</docs>

<template>
  <div
    ref="containerRef"
    :style="{
      height: '300px',
      overflow: 'auto',
      position: 'relative',
      border: '1px solid var(--ant-color-border-secondary)',
    }"
  >
    <div
      :style="{
        width: '1200px',
        height: '700px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }"
    >
      <a-popconfirm
        title="Thanks for using antd. Have a nice day !"
        :open="true"
        :auto-adjust-overflow="true"
        :get-popup-container="getPopupContainer"
      >
        <a-button type="primary">Scroll The Window</a-button>
      </a-popconfirm>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const containerRef = ref<HTMLDivElement | null>(null);

const getPopupContainer = () => containerRef.value || document.body;

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.scrollTop =
      (containerRef.value.scrollHeight - containerRef.value.clientHeight) / 2;
    containerRef.value.scrollLeft =
      (containerRef.value.scrollWidth - containerRef.value.clientWidth) / 2;
  }
});
</script>
