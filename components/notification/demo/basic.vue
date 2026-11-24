<docs>
---
order: 9
title:
  zh-CN: 静态方法（不推荐）
  en-US: Static Method (deprecated)
---

## zh-CN

静态方法无法消费 Context，不能动态响应 ConfigProvider 提供的各项配置。请优先使用 hooks 版本或者 App 组件提供的 `notification` 实例。

## en-US

Static methods cannot consume Context provided by `ConfigProvider`. Please use hooks version or `App` provided instance first.

</docs>

<template>
  <a-button type="primary" @click="openNotification">Open the notification box</a-button>
</template>
<script lang="ts" setup>
import { notification } from 'ant-design-vue';

const openNotification = () => {
  notification.open({
    title: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};
</script>
