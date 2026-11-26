<docs>
---
order: 18
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

token debug

## en-US

token debug
</docs>

<template>
  <a-flex vertical gap="small">
    <a-config-provider :theme="controlHeightTheme">
      <a-input placeholder="Basic usage" />
    </a-config-provider>
    <a-config-provider component-size="small" :theme="smallFontSizeTheme">
      <a-input placeholder="Basic usage" />
    </a-config-provider>
    <a-config-provider :theme="prefixFontSizeTheme">
      <a-input placeholder="With prefix">
        <template #prefix>
          <UserOutlined />
        </template>
      </a-input>
    </a-config-provider>
  </a-flex>
</template>

<script lang="ts" setup>
import { UserOutlined } from '@ant-design/icons-vue';
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

const controlHeightTheme: ConfigProviderProps['theme'] = {
  token: {
    controlHeight: 28,
  },
};

const smallFontSizeTheme: ConfigProviderProps['theme'] = {
  token: {},
  components: {
    Input: {
      inputFontSizeSM: 12,
    } as Record<string, any>,
  },
};

const prefixFontSizeTheme: ConfigProviderProps['theme'] = {
  components: {
    Input: {
      inputFontSize: 10,
    } as Record<string, any>,
  },
};
</script>
