<docs>
---
order: 8
title:
  zh-CN: 全屏
  en-US: Fullscreen
---

## zh-CN

`fullscreen` 属性非常适合创建流畅的页面加载器。它添加了半透明覆盖层，并在其中心放置了一个旋转指示器。

## en-US

The `fullscreen` mode is perfect for creating page loaders. It adds a dimmed overlay with a centered spinner.

</docs>

<template>
  <a-button @click="showLoader">Show fullscreen</a-button>
  <a-spin :spinning="spinning" :percent="percent" fullscreen />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue';

const spinning = ref(false);
const percent = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const clearTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const showLoader = () => {
  clearTimer();
  spinning.value = true;
  let ptg = 0;
  percent.value = ptg;

  timer = setInterval(() => {
    ptg += 10;
    percent.value = Math.min(ptg, 100);

    if (ptg >= 110) {
      clearTimer();
      spinning.value = false;
      percent.value = 0;
    }
  }, 100);
};

onBeforeUnmount(clearTimer);
</script>
