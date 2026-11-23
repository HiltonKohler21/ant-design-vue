<docs>
---
order: 11
title:
  zh-CN: 卡片式页签容器
  en-US: Container of card type Tab
debug: true
background: grey
compact: true
---

## zh-CN

用于容器顶部，需要一点额外的样式覆盖。

## en-US
Should be used at the top of container, needs to override styles.

</docs>

<template>
  <div class="card-container">
    <a-tabs v-model:activeKey="activeKey" type="card">
      <a-tab-pane key="1" tab="Tab Title 1">
        <p>Content of Tab Pane 1</p>
        <p>Content of Tab Pane 1</p>
        <p>Content of Tab Pane 1</p>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab Title 2">
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Tab Title 3">
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const activeKey = ref('2');
</script>

<style scoped>
.card-container {
  padding: 24px;
  overflow: hidden;
  background: var(--ant-color-fill-alter, #f5f5f5);
  border-radius: var(--ant-border-radius-lg, 8px);
}
.card-container p {
  margin: 0;
}
.card-container :deep(> .ant-tabs-card .ant-tabs-content) {
  height: 120px;
  margin-top: -16px;
}
.card-container :deep(> .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane) {
  padding: 16px;
  background: var(--ant-color-bg-container, #fff);
}
.card-container :deep(> .ant-tabs-card > .ant-tabs-nav::before) {
  display: none;
}
.card-container :deep(> .ant-tabs-card .ant-tabs-tab) {
  background: transparent;
  border-color: transparent;
}
.card-container :deep(> .ant-tabs-card .ant-tabs-tab-active) {
  background: var(--ant-color-bg-container, #fff);
  border-color: var(--ant-color-bg-container, #fff);
}
</style>
