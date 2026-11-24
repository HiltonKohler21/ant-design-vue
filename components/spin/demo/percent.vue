<docs>
---
order: 6
version: 5.18.0
title:
  zh-CN: 进度
  en-US: Progress
---

## zh-CN

展示进度，支持受控的 `percent` 数值与自动递增模式。

## en-US

Show the progress with controlled numeric `percent` or auto-incrementing progress.

</docs>

<template>
  <a-flex vertical gap="middle">
    <a-flex align="center" gap="middle">
      <a-switch v-model:checked="auto" checked-children="Auto" un-checked-children="Manual" />
      <a-slider
        v-model:value="percent"
        :disabled="auto"
        :min="0"
        :max="100"
        style="width: 180px; margin: 0"
      />
    </a-flex>
    <a-flex align="center" gap="middle">
      <a-spin :percent="mergedPercent" size="small" />
      <a-spin :percent="mergedPercent" />
      <a-spin :percent="mergedPercent" size="large" />
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const auto = ref(false);
const percent = ref(30);
const autoPercent = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

watch(auto, val => {
  stopTimer();
  if (val) {
    autoPercent.value = 0;
    timer = setInterval(() => {
      autoPercent.value = autoPercent.value >= 100 ? 0 : autoPercent.value + 5;
    }, 100);
  }
});

onBeforeUnmount(stopTimer);

const mergedPercent = computed(() => (auto.value ? autoPercent.value : percent.value));
</script>
