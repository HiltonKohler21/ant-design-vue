<docs>
---
order: 16
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
  <a-flex vertical align="start" gap="small">
    <a-switch v-model:checked="open" />
    <InternalAutoComplete
      default-value="lucy"
      :style="{ width: '120px' }"
      :open="open"
      :options="options"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { AutoComplete } from '@hiltonkohler21/ant-design-vue';

const InternalAutoComplete = AutoComplete._InternalPanelDoNotUseOrYouWillBeFired;

const open = ref(false);

const options = [
  { label: 'Jack', value: 'jack' },
  { label: 'Lucy', value: 'lucy' },
  { label: 'Disabled', value: 'disabled' },
  { label: 'Bamboo', value: 'bamboo' },
];
</script>
