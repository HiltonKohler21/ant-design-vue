<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic
---

## zh-CN

获取 `message`、`notification`、`modal` 静态方法。

## en-US

Static method for `message`, `notification`, `modal`.
</docs>

<template>
  <a-app>
    <MyPage />
  </a-app>
</template>

<script lang="ts" setup>
import { defineComponent, h } from 'vue';
import { App, Button, Space } from '@hiltonkohler21/ant-design-vue';

const MyPage = defineComponent({
  name: 'AppBasicPage',
  setup() {
    const { message, modal, notification } = App.useApp();

    const showMessage = () => {
      message.success('Success!');
    };

    const showModal = () => {
      modal.warning({
        title: 'This is a warning message',
        content: 'some messages...some messages...',
      });
    };

    const showNotification = () => {
      notification.info({
        title: 'Notification topLeft',
        description: 'Hello, Ant Design Vue!!',
        placement: 'topLeft',
      });
    };

    return () =>
      h(Space, { wrap: true }, () => [
        h(Button, { type: 'primary', onClick: showMessage }, () => 'Open message'),
        h(Button, { type: 'primary', onClick: showModal }, () => 'Open modal'),
        h(Button, { type: 'primary', onClick: showNotification }, () => 'Open notification'),
      ]);
  },
});
</script>
