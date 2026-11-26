<docs>
---
order: 3
title:
  zh-CN: 自定义按钮
  en-US: Custom close button
---

## zh-CN

自定义关闭按钮的样式和文字。

## en-US

To customize the style or font of the close button.

</docs>

<template>
  <contextHolder />
  <a-button type="primary" @click="openNotification">Open the notification box</a-button>
</template>

<script lang="ts" setup>
import { Button, Space, notification } from '@hiltonkohler21/ant-design-vue';
import { h } from 'vue';

const close = () => {
  console.log(
    'Notification was closed. Either the close button was clicked or duration time elapsed.',
  );
};

const [api, contextHolder] = notification.useNotification();

const openNotification = () => {
  const key = `open${Date.now()}`;
  const actions = () =>
    h(Space, null, () => [
      h(
        Button,
        {
          type: 'link',
          size: 'small',
          onClick: () => api.destroy(),
        },
        () => 'Destroy All',
      ),
      h(
        Button,
        {
          type: 'primary',
          size: 'small',
          onClick: () => api.destroy(key),
        },
        () => 'Confirm',
      ),
    ]);
  api.open({
    title: 'Notification Title',
    description:
      'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
    actions,
    key,
    onClose: close,
  });
};
</script>
