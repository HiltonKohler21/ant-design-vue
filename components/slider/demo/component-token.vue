<docs>
---
order: 10
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
    <a-slider :default-value="30" disabled />
    <a-slider :range="{ draggableTrack: true }" :default-value="[20, 50]" />
    <div :style="verticalStyle">
      <a-slider vertical :default-value="30" />
    </div>
    <div :style="verticalStyle">
      <a-slider vertical range :step="10" :default-value="[20, 50]" />
    </div>
    <div :style="verticalStyle">
      <a-slider vertical range :marks="marks" :default-value="[26, 37]" />
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { createVNode } from 'vue';
import type { CSSProperties } from 'vue';
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

const verticalStyle: CSSProperties = {
  display: 'inline-block',
  height: '300px',
  marginInlineStart: '70px',
};

const marks: Record<number, any> = {
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: {
    style: { color: '#f50' },
    label: createVNode('strong', {}, '100°C'),
  },
};

const theme: ConfigProviderProps['theme'] = {
  components: {
    Slider: {
      controlSize: 20,
      railSize: 4,
      handleSize: 22,
      handleSizeHover: 18,
      dotSize: 8,
      handleLineWidth: 6,
      handleLineWidthHover: 2,
      railBg: '#9f3434',
      railHoverBg: '#8d2424',
      trackBg: '#b0b0ef',
      trackHoverBg: '#c77195',
      handleColor: '#e6f6a2',
      handleActiveColor: '#d22bc4',
      dotBorderColor: '#303030',
      dotActiveBorderColor: '#918542',
      trackBgDisabled: '#1a1b80',
    } as Record<string, any>,
  },
};
</script>
