<docs>
---
order: 5
title:
  zh-CN: 位置
  en-US: Placement
---

## zh-CN

使用 `placement` 可以配置通知从上面、下面、左上角、右上角、左下角、右下角弹出。

## en-US

A notification box can appear from the `top`, `bottom`, `topLeft`, `topRight`, `bottomLeft` or `bottomRight` of the viewport via `placement`.

</docs>

<template>
  <contextHolder />
  <a-space>
    <a-button type="primary" @click="openNotification('top')">
      <template #icon><BorderTopOutlined /></template>
      top
    </a-button>
    <a-button type="primary" @click="openNotification('bottom')">
      <template #icon><BorderBottomOutlined /></template>
      bottom
    </a-button>
  </a-space>
  <a-divider />
  <a-space>
    <a-button type="primary" @click="openNotification('topLeft')">
      <template #icon><RadiusUpleftOutlined /></template>
      topLeft
    </a-button>
    <a-button type="primary" @click="openNotification('topRight')">
      <template #icon><RadiusUprightOutlined /></template>
      topRight
    </a-button>
  </a-space>
  <a-divider />
  <a-space>
    <a-button type="primary" @click="openNotification('bottomLeft')">
      <template #icon><RadiusBottomleftOutlined /></template>
      bottomLeft
    </a-button>
    <a-button type="primary" @click="openNotification('bottomRight')">
      <template #icon><RadiusBottomrightOutlined /></template>
      bottomRight
    </a-button>
  </a-space>
</template>
<script lang="ts" setup>
import {
  BorderBottomOutlined,
  BorderTopOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from '@ant-design/icons-vue';
import { notification } from '@hiltonkohler21/ant-design-vue';
import type { NotificationPlacement } from '@hiltonkohler21/ant-design-vue';

const [api, contextHolder] = notification.useNotification();

const openNotification = (placement: NotificationPlacement) => {
  api.info({
    title: `Notification ${placement}`,
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    placement,
  });
};
</script>
