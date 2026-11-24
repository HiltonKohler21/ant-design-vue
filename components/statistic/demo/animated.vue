<docs>
---
order: 2
title:
  zh-CN: 动画效果
  en-US: Animated number
---

## zh-CN

给数值添加平滑递增的动画进入效果。

## en-US

Display numbers with a smooth count-up animation effect.
</docs>

<template>
  <div class="demo-statistic-animated">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-statistic
          :class-names="{ content: 'demo-statistic-animated-content' }"
          title="Active Users"
          :value="activeUsers"
        />
      </a-col>
      <a-col :span="12">
        <a-statistic
          :class-names="{ content: 'demo-statistic-animated-content' }"
          title="Account Balance (CNY)"
          :value="accountBalance"
          :precision="2"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const TARGET_VALUE = 112893;
const DURATION = 1200;

const activeUsers = ref(0);
const accountBalance = ref(0);
let rafId: number | null = null;

onMounted(() => {
  if (typeof requestAnimationFrame === 'undefined') {
    activeUsers.value = TARGET_VALUE;
    accountBalance.value = TARGET_VALUE;
    return;
  }
  const startTime = performance.now();
  const step = (now: number) => {
    const progress = Math.min((now - startTime) / DURATION, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = TARGET_VALUE * eased;
    activeUsers.value = Math.round(current);
    accountBalance.value = Number(current.toFixed(2));
    if (progress < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      activeUsers.value = TARGET_VALUE;
      accountBalance.value = TARGET_VALUE;
      rafId = null;
    }
  };
  rafId = requestAnimationFrame(step);
});

onBeforeUnmount(() => {
  if (rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
});
</script>

<style scoped>
.demo-statistic-animated :deep(.demo-statistic-animated-content) {
  font-variant-numeric: tabular-nums;
}
</style>
