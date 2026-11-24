<docs>
---
order: 6
title:
  zh-CN: 紧凑模式
  en-US: Compact Style
---

## zh-CN

使用 Space.Compact 创建紧凑模式，更多请查看 [Space.Compact](/components/space-cn#spacecompact) 文档。

## en-US

Use Space.Compact create compact style, See the [Space.Compact](/components/space#spacecompact) documentation for more.
</docs>

<template>
  <a-space direction="vertical" size="middle" style="width: 100%">
    <a-space-compact style="width: 100%">
      <a-input default-value="26888888" />
    </a-space-compact>
    <a-space-compact style="width: 100%">
      <a-input style="width: 25%" default-value="0571" />
      <a-input style="width: 75%" default-value="26888888" />
    </a-space-compact>
    <a-space-compact style="width: 100%">
      <a-space-addon>https://</a-space-addon>
      <a-input-search placeholder="input search text" allow-clear />
    </a-space-compact>
    <a-space-compact style="width: 100%">
      <a-input default-value="Combine input and button" />
      <a-button type="primary">Submit</a-button>
    </a-space-compact>
    <a-space-compact style="width: 100%">
      <a-select v-model:value="province" :options="options" style="width: 110px" />
      <a-input default-value="Xihu District, Hangzhou" />
    </a-space-compact>
    <a-space-compact size="large" style="width: 100%">
      <a-space-addon>
        <SearchOutlined />
      </a-space-addon>
      <a-input placeholder="large size" />
      <a-input placeholder="another input" />
    </a-space-compact>
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';

const province = ref('zhejiang');

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
  },
];
</script>
