<docs>
---
order: 6
version: 4.3.0
title:
  zh-CN: 自定义语义结构样式
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 可以自定义消息的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of messages with `classNames` and `styles`.
</docs>

<template>
  <context-holder />
  <a-space>
    <a-button @click="showObjectStyle">Object style</a-button>
    <a-button type="primary" @click="showFunctionStyle">Function style</a-button>
  </a-space>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import type { MessageArgsProps } from 'ant-design-vue';

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
};

const stylesFn: MessageArgsProps['styles'] = ({ props }) => {
  if (props.type === 'error') {
    return {
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
    };
  }
  return defaultStyles;
};

const [messageApi, contextHolder] = message.useMessage();

const showObjectStyle = () => {
  messageApi.open({
    type: 'success',
    content: 'This is a message with object styles',
    styles: defaultStyles,
  });
};

const showFunctionStyle = () => {
  messageApi.open({
    type: 'error',
    content: 'This is a message with function styles',
    styles: stylesFn,
  });
};
</script>
