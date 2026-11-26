<docs>
---
order: 7
version: 4.3.0
title:
  zh-CN: 堆叠
  en-US: Stack
---

## zh-CN

堆叠配置，默认开启。超过阈值后的消息会被自动收起，可以通过 `threshold` 设置触发堆叠的数量。折叠状态下最多展示 3 个消息。

## en-US

Stack configuration, enabled by default. Notifications will be stacked when the amount is over `threshold`. Up to 3 notifications are shown in the collapsed stack.

</docs>

<template>
  <contextHolder />
  <div>
    <a-space size="large">
      <a-space :style="{ width: '100%' }">
        <span>Enabled:</span>
        <a-switch v-model:checked="enabled" />
      </a-space>
      <a-space :style="{ width: '100%' }">
        <span>Threshold:</span>
        <a-input-number
          v-model:value="threshold"
          :disabled="!enabled"
          :step="1"
          :min="1"
          :max="10"
        />
      </a-space>
    </a-space>
    <a-divider />
    <a-button type="primary" @click="openNotification">Open the notification box</a-button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { notification } from '@hiltonkohler21/ant-design-vue';

const enabled = ref<boolean>(true);
const threshold = ref<number>(3);
let count = 0;

const [api, contextHolder] = notification.useNotification({
  stack: computed(() => (enabled.value ? { threshold: threshold.value } : false)),
});

const openNotification = () => {
  count += 1;
  api.open({
    title: `Notification #${count}`,
    description: 'This is the content of the stacked notification.',
    duration: false,
  });
};
</script>
