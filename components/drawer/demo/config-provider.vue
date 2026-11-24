<docs>
---
order: 13
debug: true
title:
  zh-CN: ConfigProvider
  en-US: ConfigProvider
---

## zh-CN

支持 ConfigProvider 配置。

## en-US

Config by ConfigProvider.
</docs>

<template>
  <a-config-provider :get-popup-container="getContainer">
    <div ref="domRef" class="site-drawer-render-in-current-wrapper">
      <a-button type="primary" @click="open = true">Open</a-button>
      <a-drawer
        v-model:open="open"
        :root-style="{ position: 'absolute' }"
        title="ConfigProvider"
        placement="right"
        @close="open = false"
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </a-drawer>
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const domRef = ref<HTMLDivElement>();
const open = ref(false);

const getContainer = () => domRef.value || document.body;
</script>

<style scoped>
.site-drawer-render-in-current-wrapper {
  position: relative;
  height: 200px;
  padding: 48px;
  overflow: hidden;
  text-align: center;
  background: #fafafa;
  border: 1px solid #ebedf0;
  border-radius: 2px;
}
</style>
