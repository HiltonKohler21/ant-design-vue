<docs>
---
order: 5
version: 4.3.0
title:
  zh-CN: 动画时长
  en-US: Duration
---

## zh-CN

通过 `duration` 控制流光完成一圈所需时间，单位为秒，默认值为 6 秒。

## en-US

Use `duration` to control how many seconds the beam takes to complete one loop. The default is 6 seconds.
</docs>

<template>
  <a-flex :gap="16" wrap="wrap">
    <div v-for="item in durations" :key="item.name" :style="{ width: '220px', maxWidth: '100%' }">
      <a-border-beam :duration="item.seconds">
        <a-card :title="item.name">
          <template #extra>
            <a-tag variant="filled">{{ item.seconds }}s</a-tag>
          </template>
          <a-typography-text type="secondary">{{ item.description }}</a-typography-text>
        </a-card>
      </a-border-beam>
    </div>
  </a-flex>
</template>

<script lang="ts" setup>
const durations = [
  {
    name: 'Fast',
    seconds: 3,
    description: 'A quick loop for temporary highlights and active modules.',
  },
  {
    name: 'Default',
    seconds: 6,
    description: 'The original pacing for most emphasized containers.',
  },
  {
    name: 'Slow',
    seconds: 12,
    description: 'A calmer loop for persistent panels and ambient surfaces.',
  },
];
</script>
