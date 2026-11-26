<docs>
---
order: 11
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

展示新的组件 Token 功能，支持为不同类型的通知设置不同的背景色。可以通过 `colorSuccessBg`、`colorErrorBg`、`colorInfoBg`、`colorWarningBg` 来自定义各种类型通知的背景色。

## en-US

Demonstrates the new component token functionality that supports different background colors for different notification types. You can customize the background colors using `colorSuccessBg`, `colorErrorBg`, `colorInfoBg`, and `colorWarningBg` tokens.
</docs>

<template>
  <a-config-provider :theme="theme">
    <CustomThemeDemo />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { defineComponent, h } from 'vue';
import { Button, Flex, notification } from '@hiltonkohler21/ant-design-vue';
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const CustomThemeDemo = defineComponent({
  setup() {
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type: NotificationType) => {
      api[type]({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
        description:
          'This notification uses custom component tokens for enhanced background colors.',
        duration: 0,
      });
    };

    return () => [
      h(Flex, { gap: 8, wrap: 'wrap' }, () => [
        h(
          Button,
          {
            color: 'green',
            variant: 'outlined',
            onClick: () => openNotificationWithIcon('success'),
          },
          () => 'Success',
        ),
        h(
          Button,
          { color: 'blue', variant: 'outlined', onClick: () => openNotificationWithIcon('info') },
          () => 'Info',
        ),
        h(
          Button,
          {
            color: 'yellow',
            variant: 'outlined',
            onClick: () => openNotificationWithIcon('warning'),
          },
          () => 'Warning',
        ),
        h(
          Button,
          { color: 'red', variant: 'outlined', onClick: () => openNotificationWithIcon('error') },
          () => 'Error',
        ),
      ]),
      h(contextHolder),
    ];
  },
});

const theme: ConfigProviderProps['theme'] = {
  components: {
    Notification: {
      colorSuccessBg: 'linear-gradient(30deg, #d9f7be, #f6ffed)',
      colorErrorBg: 'linear-gradient(30deg, #ffccc7, #fff1f0)',
      colorInfoBg: 'linear-gradient(30deg, #bae0ff, #e6f4ff)',
      colorWarningBg: 'linear-gradient(30deg, #ffffb8, #feffe6)',
    },
  },
};
</script>
