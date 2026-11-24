<docs>
---
order: 8
title:
  zh-CN: 全屏
  en-US: Fullscreen
---

## zh-CN

`fullscreen` 属性非常适合创建流畅的页面加载器。它添加了半透明覆盖层，并在其中心放置了一个旋转加载符号。

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
  let ptg = -10;

  timer = setInterval(() => {
    ptg += 5;
    percent.value = ptg;

    if (ptg > 120) {
      clearTimer();
      spinning.value = false;
      percent.value = 0;
    }
  }, 100);
};

onBeforeUnmount(clearTimer);
</script>
