<docs>
---
order: 6
debug: true
title:
  zh-CN: 调试按钮block属性
  en-US: Debug Block
---

## zh-CN

调试使用

## en-US

Debug usage
</docs>

<template>
  <a-form>
    <a-form-item>
      <a-button size="large" shape="round" block style="margin-bottom: 12px">Submit</a-button>
      <a-button size="large" shape="round" :icon="h(DownloadOutlined)" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { DownloadOutlined } from '@ant-design/icons-vue';
</script>
