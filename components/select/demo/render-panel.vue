<docs>
---
order: 20.2
debug: true
title:
  zh-CN: _InternalPanelDoNotUseOrYouWillBeFired
  en-US: _InternalPanelDoNotUseOrYouWillBeFired
---

## zh-CN

调试用组件，请勿直接使用。

## en-US

Debug usage. Do not use in your production.
</docs>

<template>
  <a-flex vertical gap="small" align="start">
    <a-switch v-model:checked="open" />
    <InternalSelect
      default-value="lucy"
      :style="{ width: '120px' }"
      :open="open"
      :options="options"
      :virtual="false"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Select } from 'ant-design-vue';

const InternalSelect = Select._InternalPanelDoNotUseOrYouWillBeFired;

const open = ref(true);

const options = [
  { label: 'Jack', value: 'jack' },
  { label: 'Lucy', value: 'lucy' },
  { label: 'Disabled', value: 'disabled' },
  { label: 'Bamboo', value: 'bamboo' },
];
</script>
