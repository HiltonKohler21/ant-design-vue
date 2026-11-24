<docs>
---
order: 11
debug: true
title:
  zh-CN: 测试 Badge 的样式
  en-US: Badge style
---

## zh-CN

在水平与垂直 Radio.Group 中组合 Badge 与 Radio.Button。

## en-US

Combine Badge and Radio.Button inside horizontal and vertical Radio.Group.
</docs>

<template>
  <a-flex vertical gap="middle" align="flex-start">
    <a-radio-group v-model:value="val1" button-style="solid">
      <a-badge :count="1">
        <a-radio-button :value="1">Click Me</a-radio-button>
      </a-badge>
      <a-badge :count="2">
        <a-radio-button :value="2">Not Me</a-radio-button>
      </a-badge>
    </a-radio-group>
    <a-radio-group v-model:value="val2" vertical button-style="solid">
      <a-badge :count="1">
        <a-radio-button value="vertical-1">Click Me</a-radio-button>
      </a-badge>
      <a-badge :count="0">
        <a-radio-button value="vertical-0">Hidden Badge</a-radio-button>
      </a-badge>
      <a-badge :count="2">
        <a-radio-button value="vertical-2">Not Me</a-radio-button>
      </a-badge>
    </a-radio-group>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const val1 = ref(1);
const val2 = ref('vertical-1');
</script>
