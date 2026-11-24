<docs>
---
order: 11
debug: true
title:
  zh-CN: 标签页中嵌套
  en-US: Nested in tabs
---

## zh-CN

嵌套在标签页中。

## en-US

Nested in tabs.

</docs>

<template>
  <a-tabs v-model:active-key="activeKey">
    <a-tab-pane key="1" tab="General">Content of Tab Pane 1</a-tab-pane>
    <a-tab-pane key="2" tab="Splitter Tab">
      <a-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
        <a-splitter-panel collapsible>
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
              1
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>
        <a-splitter-panel :collapsible="{ start: true }">
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
              2
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>
        <a-splitter-panel>
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
              3
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>
      </a-splitter>
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const activeKey = ref('1');
</script>
