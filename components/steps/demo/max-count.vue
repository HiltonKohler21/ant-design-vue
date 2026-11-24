<docs>
---
order: 8
version: 4.3.0
title:
  zh-CN: 限量展示
  en-US: Max Count
---

## zh-CN

通过 `maxCount` 限制可见步骤数量，多余步骤会聚合为省略号步骤。

## en-US

Use `maxCount` to limit visible steps. Hidden ranges are collapsed into ellipsis steps.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-typography-title :level="5" :style="{ margin: 0 }">Number of Steps</a-typography-title>

    <a-steps :current="current" :max-count="5" :items="items" />

    <a-flex gap="small" align="center" :style="{ alignSelf: 'center' }">
      <a-button :disabled="current <= 0" @click="handlePrev">
        <template #icon><LeftOutlined /></template>
      </a-button>
      <a-input-number
        aria-label="Number of Steps"
        :min="3"
        :max="7"
        :value="count"
        :style="{ width: '120px' }"
        @change="handleCountChange"
      />
      <a-button :disabled="current >= count - 1" @click="handleNext">
        <template #icon><RightOutlined /></template>
      </a-button>
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';

const getMiddleCurrent = (total: number) => Math.floor((total - 1) / 2);

const count = ref(7);
const current = ref(getMiddleCurrent(7));

const items = computed(() =>
  Array.from({ length: count.value }, (_, index) => ({ title: `Step ${index + 1}` })),
);

const handleCountChange = (value: number | string | null) => {
  if (typeof value !== 'number') {
    return;
  }
  count.value = value;
  current.value = getMiddleCurrent(value);
};

const handlePrev = () => {
  current.value = Math.max(current.value - 1, 0);
};

const handleNext = () => {
  current.value = Math.min(current.value + 1, count.value - 1);
};
</script>
