<docs>
---
order: 11
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

Component Token Debug.

## en-US

Component Token Debug
</docs>

<template>
  <a-space wrap>
    <a-config-provider :theme="contentTheme">
      <MessageTrigger label="Custom contentPadding & contentBg" />
    </a-config-provider>
    <a-config-provider :theme="elevatedTheme">
      <MessageTrigger label="Custom colorBgElevated" />
    </a-config-provider>
  </a-space>
</template>

<script lang="ts" setup>
import { defineComponent, h } from 'vue';
import { Button, message } from '@hiltonkohler21/ant-design-vue';
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

const MessageTrigger = defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const [messageApi, contextHolder] = message.useMessage();
    const openError = () => {
      messageApi.error('Hello World!');
    };
    return () => [h(contextHolder), h(Button, { onClick: openError }, () => props.label)];
  },
});

const contentTheme: ConfigProviderProps['theme'] = {
  components: {
    Message: {
      contentPadding: 40,
      contentBg: '#e6f4ff',
    } as Record<string, any>,
  },
};

const elevatedTheme: ConfigProviderProps['theme'] = {
  components: {
    Message: {
      colorBgElevated: '#e6f4ff',
    } as Record<string, any>,
  },
};
</script>
