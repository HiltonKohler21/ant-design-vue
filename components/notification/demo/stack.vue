<docs>
---
order: 10
title:
  zh-CN: 堆叠
  en-US: Stack
---

## zh-CN

当通知数量超过指定阈值（默认为 3）时自动折叠堆叠，鼠标移入时展开查看全部通知。

## en-US

Notifications automatically collapse into a card stack when the count reaches the threshold (default 3), and expand smoothly on hover.
</docs>

<template>
  <contextHolder />
  <a-space size="large">
    <a-space>
      <span>Enabled:</span>
      <a-switch v-model:checked="enabled" />
    </a-space>
    <a-space>
      <span>Threshold:</span>
      <a-input-number v-model:value="threshold" :disabled="!enabled" :step="1" :min="1" :max="10" />
    </a-space>
  </a-space>
  <a-divider />
  <a-button type="primary" @click="openNotification">Open the notification box</a-button>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { notification } from 'ant-design-vue';

const enabled = ref<boolean>(true);
const threshold = ref<number>(3);
let count = 0;

const [api, contextHolder] = notification.useNotification({
  stack: computed(() => (enabled.value ? { threshold: threshold.value } : false)),
});

const openNotification = () => {
  count += 1;
  api.open({
    message: `Notification #${count}`,
    description: 'This is the content of the stacked notification.',
    duration: 0,
  });
};
</script>
