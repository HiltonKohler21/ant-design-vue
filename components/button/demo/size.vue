<docs>
---
order: 7
title:
  zh-CN: 按钮尺寸
  en-US: Size
---

## zh-CN

按钮有大、中、小三种尺寸。

通过设置 `size` 为 `large` `small` 分别把按钮设为大、小尺寸。若不设置 `size`，则尺寸默认为中（`middle`）。

## en-US

Ant Design Vue supports three sizes of buttons: small, middle and large.

If a large or small button is desired, set the `size` property to either `large` or `small` respectively. Omit the `size` property for a button with the default `middle` size.
</docs>

<template>
  <a-radio-group v-model:value="size">
    <a-radio-button value="large">Large</a-radio-button>
    <a-radio-button value="middle">Default</a-radio-button>
    <a-radio-button value="small">Small</a-radio-button>
  </a-radio-group>
  <a-divider title-placement="start" plain>Preview</a-divider>
  <a-flex gap="small" align="flex-start" vertical>
    <a-flex gap="small" wrap="wrap">
      <a-button type="primary" :size="size">Primary</a-button>
      <a-button :size="size">Default</a-button>
      <a-button type="dashed" :size="size">Dashed</a-button>
    </a-flex>
    <a-button type="link" :size="size">Link</a-button>
    <a-flex gap="small" wrap="wrap">
      <a-button type="primary" :icon="h(DownloadOutlined)" :size="size" />
      <a-button type="primary" shape="circle" :icon="h(DownloadOutlined)" :size="size" />
      <a-button type="primary" shape="round" :icon="h(DownloadOutlined)" :size="size" />
      <a-button type="primary" shape="round" :icon="h(DownloadOutlined)" :size="size">
        Download
      </a-button>
      <a-button type="primary" :icon="h(DownloadOutlined)" :size="size">Download</a-button>
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { DownloadOutlined } from '@ant-design/icons-vue';
import type { ConfigProviderProps } from 'ant-design-vue';

type SizeType = ConfigProviderProps['componentSize'];

const size = ref<SizeType>('large');
</script>
