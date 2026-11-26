<docs>
---
order: 3
version: 4.3.0
title:
  zh-CN: 堆叠
  en-US: Stack
---

## zh-CN

堆叠配置，默认关闭。超过阈值后的消息会被自动收起，可以通过 `threshold` 设置触发堆叠的数量。折叠状态下仅展示最新的消息。

## en-US

Stack configuration, disabled by default. Messages will be stacked when the amount is over `threshold`. Only the latest message is shown in the collapsed stack.
</docs>

<template>
  <context-holder />
  <a-space size="large">
    <a-space style="width: 100%">
      <span>Enabled:</span>
      <a-switch v-model:checked="enabled" aria-label="Enable message stack" />
    </a-space>
    <a-space style="width: 100%">
      <span>Threshold:</span>
      <a-input-number
        v-model:value="threshold"
        aria-label="Stack threshold"
        :disabled="!enabled"
        :step="1"
        :min="1"
        :max="10"
      />
    </a-space>
  </a-space>
  <a-divider />
  <a-space>
    <a-button type="primary" @click="openMessage">Open the message box</a-button>
    <a-button @click="destroyAll">Destroy all</a-button>
  </a-space>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { message } from '@hiltonkohler21/ant-design-vue';

const enabled = ref(true);
const threshold = ref(3);
let index = 0;

const stackConfig = computed(() => (enabled.value ? { threshold: threshold.value ?? 1 } : false));

const [messageApi, contextHolder] = message.useMessage({
  stack: stackConfig,
});

const openMessage = () => {
  index += 1;
  const isOdd = index % 2 === 1;

  messageApi.open({
    type: 'info',
    content: isOdd
      ? `Message ${index}: This is a stacked message.`
      : `Message ${index}: This is a slightly longer stacked message.`,
    duration: 0,
  });
};

const destroyAll = () => {
  messageApi.destroy();
};
</script>
