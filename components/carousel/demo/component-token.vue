<docs>
---
order: 8
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
  <a-config-provider :theme="themeConfig">
    <a-carousel>
      <div>
        <h3 :style="contentStyle">1</h3>
      </div>
      <div>
        <h3 :style="contentStyle">2</h3>
      </div>
      <div>
        <h3 :style="contentStyle">3</h3>
      </div>
      <div>
        <h3 :style="contentStyle">4</h3>
      </div>
    </a-carousel>
  </a-config-provider>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const contentStyle: CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Carousel: {
      dotWidth: 50,
      dotHeight: 50,
      dotActiveWidth: 80,
    } as Record<string, any>,
  },
};
</script>
