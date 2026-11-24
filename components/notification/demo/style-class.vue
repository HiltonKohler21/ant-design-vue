<docs>
---
order: 13
version: 4.3.0
title:
  zh-CN: 自定义语义结构样式
  en-US: Custom semantic styles
---

## zh-CN

通过 `classNames` 和 `styles` 可以自定义 Notification 的[语义化结构](#semantic-dom)样式，支持传入静态对象或函数。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Notification with `classNames` and `styles`, supporting both object and function forms.

</docs>

<template>
  <contextHolder />
  <a-space>
    <a-button type="primary" @click="openDefault">Default Notification</a-button>
    <a-button @click="openError">Error Notification</a-button>
  </a-space>
</template>

<script lang="ts" setup>
import { notification } from 'ant-design-vue';

type NotificationArgsProps = Parameters<typeof notification.open>[0];

const defaultClassNames = {
  root: 'demo-notification-semantic-root',
  title: 'demo-notification-semantic-title',
};

const defaultStyles = {
  root: {
    backgroundColor: '#f6ffed',
    border: '2px solid #95de64',
    borderRadius: '16px',
    boxShadow: '4px 4px 0 #d9f7be',
  },
  icon: {
    color: '#237804',
  },
  title: {
    color: '#237804',
    fontWeight: 600,
  },
  description: {
    color: '#3f6600',
  },
};

const classNamesFn: NotificationArgsProps['classNames'] = ({ props }) => {
  if (props.type === 'error') {
    return {
      root: 'demo-notification-semantic-root-error',
      title: 'demo-notification-semantic-title',
    };
  }
  return defaultClassNames;
};

const styleFn: NotificationArgsProps['styles'] = ({ props }) => {
  if (props.type === 'error') {
    return {
      ...defaultStyles,
      root: {
        ...defaultStyles.root,
        backgroundColor: '#fff2f0',
        borderColor: '#ffccc7',
        boxShadow: '4px 4px 0 #ffccc7',
      },
      icon: {
        color: '#cf1322',
      },
      title: {
        color: '#cf1322',
        fontWeight: 600,
      },
      description: {
        color: '#5c0011',
      },
    };
  }
  return defaultStyles;
};

const [api, contextHolder] = notification.useNotification();

const sharedProps: NotificationArgsProps = {
  title: 'Notification Title',
  description: 'This is a notification description.',
  duration: false,
};

const openDefault = () => {
  api.info({
    ...sharedProps,
    classNames: defaultClassNames,
    styles: defaultStyles,
  });
};

const openError = () => {
  api.error({
    ...sharedProps,
    classNames: classNamesFn,
    styles: styleFn,
  });
};
</script>

<style>
.demo-notification-semantic-root {
  letter-spacing: 0.2px;
}

.demo-notification-semantic-root-error {
  letter-spacing: 0.4px;
}

.demo-notification-semantic-title {
  font-size: 16px;
}
</style>
