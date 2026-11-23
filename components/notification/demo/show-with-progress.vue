<docs>
---
order: 8
title:
  zh-CN: 显示进度条
  en-US: Show with progress
---

## zh-CN

通过 `showProgress` 显示自动关闭的倒计时进度条，并可通过 `pauseOnHover` 控制鼠标悬停时是否暂停倒计时。

## en-US

Display an auto-close progress bar via `showProgress`, and control whether hovering pauses the timer with `pauseOnHover`.

</docs>

<template>
  <a-space>
    <a-button type="primary" @click="openNotification(true)">Pause on hover</a-button>
    <a-button type="primary" @click="openNotification(false)">Don't pause on hover</a-button>
  </a-space>
  <contextHolder />
</template>

<script lang="ts" setup>
import { notification } from 'ant-design-vue';

const [api, contextHolder] = notification.useNotification();

const openNotification = (pauseOnHover: boolean) => {
  api.open({
    message: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    showProgress: true,
    pauseOnHover,
  });
};
</script>
