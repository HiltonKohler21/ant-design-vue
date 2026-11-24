<docs>
---
order: 13
debug: true
title:
  zh-CN: Progress Debug
  en-US: Progress Debug
---

## zh-CN

Buggy!

## en-US

Buggy!
</docs>

<template>
  <div>
    <a-space wrap>
      <a-button @click="percent = undefined">Percentage to undefined</a-button>
      <a-button @click="increasePercent">Percentage +</a-button>
      <a-button @click="current = (current + 1) % 3">Current +</a-button>
      <a-button @click="status = 'wait'">Status Wait</a-button>
      <a-button @click="status = 'process'">Status Process</a-button>
      <a-button @click="status = 'finish'">Status Finish</a-button>
      <a-button @click="status = 'error'">Status Error</a-button>
    </a-space>
    <br />
    <br />
    <a-steps :current="current" :percent="percent" :status="status" :items="items" />
    <a-steps :current="current" :percent="percent" :status="status" size="small" :items="items" />
    <a-steps
      :current="current"
      :percent="percent"
      :status="status"
      orientation="vertical"
      :items="items"
    />
    <a-steps
      :current="current"
      :percent="percent"
      :status="status"
      size="small"
      orientation="vertical"
      :items="items"
    />
    <div>{{ percent }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { StepsProps } from 'ant-design-vue';

const percent = ref<number | undefined>(0);
const current = ref(1);
const status = ref<StepsProps['status']>('process');

const content = 'This is a content.';
const items: StepsProps['items'] = [
  {
    title: 'Finished',
    content,
  },
  {
    title: 'In Progress',
    subTitle: 'Left 00:00:08',
    content,
  },
  {
    title: 'Waiting',
    content,
  },
];

const increasePercent = () => {
  const next = (percent.value ?? 0) + 10;
  percent.value = next > 100 ? 0 : next;
};
</script>
