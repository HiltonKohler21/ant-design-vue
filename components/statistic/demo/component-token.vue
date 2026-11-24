<docs>
---
order: 6
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

Component Token Debug.

## en-US

Component Token Debug.
</docs>

<template>
  <a-config-provider :theme="theme">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-statistic title="Active Users" :value="112893" />
      </a-col>
      <a-col :span="12">
        <a-statistic title="Account Balance (CNY)" :value="112893" :precision="2" />
        <a-button style="margin-top: 16px" type="primary">Recharge</a-button>
      </a-col>
      <a-col :span="12">
        <a-statistic title="Active Users" :value="112893" loading />
      </a-col>
    </a-row>
  </a-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps } from 'ant-design-vue';

const theme: ConfigProviderProps['theme'] = {
  components: {
    Statistic: {
      titleFontSize: 20,
      contentFontSize: 20,
    },
  },
};
</script>
