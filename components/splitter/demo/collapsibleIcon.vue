<docs>
---
order: 4
version: 4.3.0
title:
  zh-CN: 可折叠图标显示
  en-US: Control collapsible icons
---

## zh-CN

配置 `collapsible.showCollapsibleIcon` 控制可折叠图标的显示方式。

## en-US

Set `collapsible.showCollapsibleIcon` to control the display mode of collapsible icons.

</docs>

<template>
  <a-flex vertical :gap="20">
    <a-flex :gap="5" align="center" wrap="wrap">
      <span>ShowCollapsibleIcon:</span>
      <a-radio-group v-model:value="showIconMode" :options="options" />
    </a-flex>
    <a-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
      <a-splitter-panel
        :collapsible="{ start: true, end: true, showCollapsibleIcon: showIconMode }"
        min="20%"
      >
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
            First
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel
        :collapsible="{ start: true, end: true, showCollapsibleIcon: showIconMode }"
      >
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
            Second
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel
        :collapsible="{ start: true, end: true, showCollapsibleIcon: showIconMode }"
      >
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
            Third
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const showIconMode = ref<'auto' | boolean>(true);

const options = [
  { label: 'Auto', value: 'auto' },
  { label: 'True', value: true },
  { label: 'False', value: false },
];
</script>
