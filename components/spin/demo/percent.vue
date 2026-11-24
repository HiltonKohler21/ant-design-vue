<docs>
---
order: 6
version: 4.3.0
title:
  zh-CN: 进度
  en-US: Progress
---

## zh-CN

展示进度，当设置 `percent="auto"` 时会预估一个永远不会停止的进度条。

## en-US

Show the progress. When `percent="auto"` is set, an indeterminate progress will be displayed.

</docs>

<template>
  <a-flex align="center" gap="medium">
    <a-switch
      v-model:checked="auto"
      checked-children="Auto"
      un-checked-children="Auto"
      @change="handleAutoChange"
    />
    <a-spin :percent="mergedPercent" size="small" />
    <a-spin :percent="mergedPercent" />
    <a-spin :percent="mergedPercent" size="large" />
  </a-flex>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const auto = ref(false);
const percent = ref(-50);
let timer: ReturnType<typeof setTimeout> | null = null;

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

const scheduleNext = () => {
  clearTimer();
  timer = setTimeout(() => {
    const nextPercent = percent.value + 5;
    percent.value = nextPercent > 150 ? -50 : nextPercent;
  }, 100);
};

watch(percent, scheduleNext);
onMounted(scheduleNext);
onBeforeUnmount(clearTimer);

const handleAutoChange = () => {
  percent.value = -50;
  scheduleNext();
};

const mergedPercent = computed(() => (auto.value ? 'auto' : percent.value));
</script>
