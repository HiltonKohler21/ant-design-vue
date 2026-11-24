<docs>
---
order: 5
version: 4.3.0
title:
  zh-CN: 静态方法
  en-US: Static function
---

## zh-CN

使用 `holderRender` 给 `message`、`modal`、`notification` 静态方法设置 `Provider`。

## en-US

Use `holderRender` to set the `Provider` for the static methods `message`, `modal`, `notification`.
</docs>

<template>
  <a-space wrap>
    <a-button type="primary" @click="showMessage">message</a-button>
    <a-button type="primary" @click="showNotification">notification</a-button>
    <a-button type="primary" @click="showModal">Modal</a-button>
  </a-space>
</template>

<script lang="ts" setup>
import { h, onBeforeUnmount } from 'vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import { App, ConfigProvider, Modal, StyleProvider, message, notification } from 'ant-design-vue';

let configured = false;

const holderRender = (children: any) =>
  h(
    StyleProvider,
    { hashPriority: 'high' },
    {
      default: () =>
        h(
          ConfigProvider,
          {
            componentSize: 'small',
            theme: { token: { colorPrimary: '#1677ff' } },
          },
          {
            default: () =>
              h(
                App,
                {
                  message: { maxCount: 1 },
                  notification: { maxCount: 1 },
                },
                { default: () => children },
              ),
          },
        ),
    },
  );

const ensureConfig = () => {
  if (!configured) {
    ConfigProvider.config({ holderRender });
    configured = true;
  }
};

const showMessage = () => {
  ensureConfig();
  message.info('This is a normal message');
};

const showNotification = () => {
  ensureConfig();
  notification.open({
    title: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
  });
};

const showModal = () => {
  ensureConfig();
  Modal.confirm({
    title: 'Do you want to delete these items?',
    icon: h(ExclamationCircleFilled),
    content: 'Some descriptions',
  });
};

onBeforeUnmount(() => {
  if (configured) {
    ConfigProvider.config({ holderRender: undefined });
    configured = false;
  }
});
</script>
