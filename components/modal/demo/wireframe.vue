<docs>
---
order: 21
debug: true
title:
  zh-CN: 线框风格
  en-US: Wireframe
---

## zh-CN

线框风格。

## en-US

Wireframe.
</docs>

<template>
  <a-config-provider :theme="{ token: { wireframe: true } }">
    <div :style="{ display: 'flex', flexDirection: 'column', rowGap: '16px' }">
      <InternalPanel title="Hello World!" :style="{ width: '100%' }">Hello World?!</InternalPanel>
      <InternalPanel type="success" :style="{ width: '200px' }">A good news!</InternalPanel>
      <InternalPanel title="Confirm This?" type="confirm" :style="{ width: '300px' }">
        Some descriptions.
      </InternalPanel>
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { Modal } from 'ant-design-vue';

/** Test usage. Do not use in your production. */
const InternalPanel = Modal._InternalPanelDoNotUseOrYouWillBeFired;
</script>
