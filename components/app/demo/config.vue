<docs>
---
order: 1
title:
  zh-CN: Hooks 配置
  en-US: Hooks config
---

## zh-CN

对 `message`、`notification` 进行配置。

## en-US

Config for `message`, `notification`.
</docs>

<template>
  <a-app :message="{ maxCount: 1 }" :notification="{ placement: 'bottomLeft' }">
    <MyPage />
  </a-app>
</template>

<script lang="ts" setup>
import { defineComponent, h } from 'vue';
import { App, Button, Space } from '@hiltonkohler21/ant-design-vue';

const MyPage = defineComponent({
  name: 'AppConfigPage',
  setup() {
    const { message, notification } = App.useApp();

    const showMessage = () => {
      message.success('Success!');
    };

    const showNotification = () => {
      notification.info({
        title: 'Notification',
        description: 'Hello, Ant Design Vue!!',
      });
    };

    return () =>
      h(Space, { wrap: true }, () => [
        h(Button, { type: 'primary', onClick: showMessage }, () => 'Message for only one'),
        h(
          Button,
          { type: 'primary', onClick: showNotification },
          () => 'Notification for bottomLeft',
        ),
      ]);
  },
});
</script>
