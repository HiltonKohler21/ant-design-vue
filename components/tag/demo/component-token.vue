<docs>
---
order: 12
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

组件 Token 调试使用。

## en-US

Component Token Debug.
</docs>

<template>
  <a-flex vertical gap="small" align="start">
    <a-config-provider :theme="tagTheme">
      <a-flex gap="small" align="center" wrap="wrap">
        <a-tag>
          <a
            href="https://github.com/ant-design/ant-design/issues/1862"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ant Design issue"
          >
            Link
          </a>
        </a-tag>
        <a-tag variant="filled">
          <a
            href="https://github.com/ant-design/ant-design/issues/1862"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ant Design issue"
          >
            Link
          </a>
        </a-tag>
        <a-tag closable color="magenta">Tag 2</a-tag>
        <a-tag color="error">
          <template #icon>
            <CloseCircleOutlined />
          </template>
          error
        </a-tag>
        <a-tag color="red" variant="solid">red</a-tag>
        <a-tag variant="filled" color="magenta">magenta</a-tag>
        <a-tag color="processing">
          <template #icon>
            <SyncOutlined :spin="true" />
          </template>
          processing
        </a-tag>
        <a-tag color="success" disabled>disabled</a-tag>
      </a-flex>
    </a-config-provider>
    <a-config-provider :theme="darkTheme">
      <a-flex gap="small" align="center" wrap="wrap" style="background-color: #000; padding: 4px">
        <a-tag variant="solid" color="default">Dark</a-tag>
      </a-flex>
    </a-config-provider>
  </a-flex>
</template>

<script lang="ts" setup>
import { CloseCircleOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { theme } from 'ant-design-vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const tagTheme: ConfigProviderProps['theme'] = {
  components: {
    Tag: {
      defaultBg: '#f9f0ff',
      defaultColor: '#4b34d3',
      colorBorderDisabled: '#FF0000',
    } as Record<string, any>,
  },
};

const darkTheme: ConfigProviderProps['theme'] = {
  algorithm: theme.darkAlgorithm,
};
</script>
