<docs>
---
order: 16
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

组件 Token Debug。

## en-US

Component Token Debug.
</docs>

<template>
  <a-config-provider :theme="themeConfig">
    <a-space direction="vertical" style="width: 100%">
      <a-progress :percent="50" />
      <a-progress :percent="50" size="small" />
      <a-progress :percent="50" :size="[300, 20]" />
    </a-space>
    <br />
    <br />
    <a-space :size="30">
      <a-progress type="circle" :percent="50" />
      <a-progress type="circle" :percent="50" size="small" />
      <a-progress type="circle" :percent="50" :size="20" />
    </a-space>
    <br />
    <br />
    <a-space :size="30">
      <a-progress type="dashboard" :percent="50" />
      <a-progress type="dashboard" :percent="50" size="small" />
      <a-progress type="dashboard" :percent="50" :size="20" />
    </a-space>
    <br />
    <br />
    <a-space :size="30" wrap>
      <a-progress :steps="3" :percent="50" />
      <a-progress :steps="3" :percent="50" size="small" />
      <a-progress :steps="3" :percent="50" :size="20" />
      <a-progress :steps="3" :percent="50" :size="[20, 30]" />
    </a-space>
  </a-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps } from 'ant-design-vue';

const themeConfig: ConfigProviderProps['theme'] = {
  token: {
    marginXXS: 20,
    fontSizeSM: 24,
  },
  components: {
    Progress: {
      defaultColor: '#bae0ff',
      remainingColor: '#f5222d',
      colorText: '#52c41a',
      circleTextColor: '#52c41a',
      lineBorderRadius: 50,
    } as Record<string, any>,
  },
};
</script>
