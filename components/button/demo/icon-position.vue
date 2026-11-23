<docs>
---
order: 2
title:
  zh-CN: 按钮图标位置
  en-US: Icon Position
---

## zh-CN

通过 `icon-position` 属性设置按钮中图标的位置，可选 `start` 或 `end`。

## en-US

Set the icon placement inside a button with the `icon-position` prop (`start` or `end`).
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-space align="center">
      <span>Icon Position:</span>
      <a-radio-group v-model:value="position">
        <a-radio-button value="start">start</a-radio-button>
        <a-radio-button value="end">end</a-radio-button>
      </a-radio-group>
    </a-space>

    <a-flex gap="small" wrap="wrap">
      <a-button type="primary" :icon="h(SearchOutlined)" :icon-position="position">Search</a-button>
      <a-button :icon="h(SearchOutlined)" :icon-position="position">Search</a-button>
      <a-button type="dashed" :icon="h(DownloadOutlined)" :icon-position="position">
        Download
      </a-button>
      <a-button type="text" :icon="h(SearchOutlined)" :icon-position="position">Search</a-button>
      <a-button type="link" :icon="h(ArrowRightOutlined)" :icon-position="position">
        Go Next
      </a-button>
      <a-button type="primary" loading :icon-position="position">Loading</a-button>
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { ArrowRightOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons-vue';
import type { ButtonProps } from 'ant-design-vue';

const position = ref<ButtonProps['iconPosition']>('end');
</script>
