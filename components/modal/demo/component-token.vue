<docs>
---
order: 22
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
  <a-config-provider :theme="modalTheme">
    <div :style="{ display: 'flex', flexDirection: 'column', rowGap: '16px' }">
      <InternalPanel title="Hello World!" :style="{ width: '100%' }">Hello World?!</InternalPanel>
      <a-config-provider :theme="wireframeTheme">
        <InternalPanel title="Hello World!" :style="{ width: '100%' }">Hello World?!</InternalPanel>
      </a-config-provider>
      <InternalPanel type="success" :style="{ width: '200px' }">A good news!</InternalPanel>
      <InternalPanel title="Confirm This?" type="confirm" :style="{ width: '300px' }">
        Some descriptions.
      </InternalPanel>
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { Modal } from 'ant-design-vue';
import type { ConfigProviderProps } from 'ant-design-vue';

/** Test usage. Do not use in your production. */
const InternalPanel = Modal._InternalPanelDoNotUseOrYouWillBeFired;

const modalTheme: ConfigProviderProps['theme'] = {
  components: {
    Modal: {
      footerBg: '#f6ffed',
      contentBg: '#e6fffb',
      headerBg: '#f9f0ff',
      titleLineHeight: 3,
      titleFontSize: 12,
      titleColor: '#1d39c4',
    } as Record<string, any>,
  },
};

const wireframeTheme: ConfigProviderProps['theme'] = {
  token: {
    wireframe: true,
  },
};
</script>
