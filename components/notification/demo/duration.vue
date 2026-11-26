<docs>
---
order: 1
title:
  zh-CN: 自动关闭的延时
  en-US: Duration after which the notification box is closed
---

## zh-CN

自定义通知框自动关闭的延时，默认 `4.5s`，取消自动关闭只要将该值设为 `0` 即可。

## en-US

`Duration` can be used to specify how long the notification stays open. After the duration time elapses, the notification closes automatically. If not specified, default value is 4.5 seconds. If you set the value to 0, the notification box will never close automatically.

</docs>

<template>
  <contextHolder />
  <a-button type="primary" @click="openNotification">Open the notification box</a-button>
</template>
<script lang="ts" setup>
import { notification } from '@hiltonkohler21/ant-design-vue';

const [api, contextHolder] = notification.useNotification();

const openNotification = () => {
  api.open({
    title: 'Notification Title',
    description:
      'I will never close automatically. This is a purposely very very long description that has many many characters and words.',
    duration: 0,
  });
};
</script>
