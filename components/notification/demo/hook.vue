<docs>
---
order: 0
title:
  zh-CN: Hooks 调用（推荐）
  en-US: Hooks usage (recommended)
---

## zh-CN

通过 `notification.useNotification` 创建支持读取 context 的 `contextHolder`。请注意，我们推荐通过顶层注册的方式代替 `notification` 静态方法，因为静态方法无法消费上下文，因而 ConfigProvider 的数据也不会生效。

## en-US

Use `notification.useNotification` to get `contextHolder` with context accessible issue. Please note that, we recommend to use top level registration instead of `notification` static method, because static method cannot consume context, and ConfigProvider data will not work.

</docs>
<template>
  <contextHolder />
  <a-space>
    <a-button type="primary" @click="() => openNotification('topLeft')">
      <template #icon><RadiusUpleftOutlined /></template>
      topLeft
    </a-button>
    <a-button type="primary" @click="() => openNotification('topRight')">
      <template #icon><RadiusUprightOutlined /></template>
      topRight
    </a-button>
  </a-space>
  <a-divider />
  <a-space>
    <a-button type="primary" @click="() => openNotification('bottomLeft')">
      <template #icon><RadiusBottomleftOutlined /></template>
      bottomLeft
    </a-button>
    <a-button type="primary" @click="() => openNotification('bottomRight')">
      <template #icon><RadiusBottomrightOutlined /></template>
      bottomRight
    </a-button>
  </a-space>
</template>

<script lang="ts" setup>
import {
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
    description: 'Hello, Ant Design!',
    placement,
  });
};
</script>
