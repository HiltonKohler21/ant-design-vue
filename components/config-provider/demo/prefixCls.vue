<docs>
---
order: 7
debug: true
title:
  zh-CN: 前缀
  en-US: prefixCls
---

## zh-CN

修改组件和图标前缀。

## en-US

Config component and icon prefixCls.
</docs>

<template>
  <a-button style="margin-bottom: 12px" type="primary" @click="togglePrefixCls">
    toggle prefixCls
  </a-button>
  <br />
  <a-config-provider :prefix-cls="prefixCls" icon-prefix-cls="bamboo">
    <a-space wrap align="center">
      <SmileOutlined />
      <a-select style="width: 120px" />
      <a-radio>test</a-radio>
      <a-checkbox>test</a-checkbox>
    </a-space>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { SmileOutlined } from '@ant-design/icons-vue';

const prefixCls = ref('light');

const togglePrefixCls = () => {
  prefixCls.value = prefixCls.value === 'light' ? 'dark' : 'light';
};
</script>
