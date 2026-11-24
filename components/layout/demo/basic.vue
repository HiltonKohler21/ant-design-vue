<docs>
---
order: 0
title:
  zh-CN: 基本结构
  en-US: Basic Structure
---

## zh-CN

典型的页面布局。

## en-US

Classic page layouts.

</docs>
<template>
  <a-space direction="vertical" :style="{ width: '100%', maxWidth: '100%' }" :size="[0, 32]">
    <a-layout style="border-radius: 8px; overflow: hidden; max-width: 100%">
      <a-layout-header :style="headerStyle">Header</a-layout-header>
      <a-layout-content :style="contentStyle">Content</a-layout-content>
      <a-layout-footer :style="footerStyle">Footer</a-layout-footer>
    </a-layout>

    <a-layout style="border-radius: 8px; overflow: hidden; max-width: 100%">
      <a-layout-header :style="headerStyle">Header</a-layout-header>
      <a-layout has-sider>
        <a-layout-sider :style="siderStyle">Sider</a-layout-sider>
        <a-layout-content :style="contentStyle">Content</a-layout-content>
      </a-layout>
      <a-layout-footer :style="footerStyle">Footer</a-layout-footer>
    </a-layout>

    <a-layout style="border-radius: 8px; overflow: hidden; max-width: 100%">
      <a-layout-header :style="headerStyle">Header</a-layout-header>
      <a-layout has-sider>
        <a-layout-content :style="contentStyle">Content</a-layout-content>
        <a-layout-sider :style="siderStyle">Sider</a-layout-sider>
      </a-layout>
      <a-layout-footer :style="footerStyle">Footer</a-layout-footer>
    </a-layout>

    <a-layout has-sider style="border-radius: 8px; overflow: hidden; max-width: 100%">
      <a-layout-sider :style="siderStyle">Sider</a-layout-sider>
      <a-layout>
        <a-layout-header :style="headerStyle">Header</a-layout-header>
        <a-layout-content :style="contentStyle">Content</a-layout-content>
        <a-layout-footer :style="footerStyle">Footer</a-layout-footer>
      </a-layout>
    </a-layout>
  </a-space>
</template>
<script lang="ts" setup>
import type { CSSProperties } from 'vue';
const headerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: '64px',
  paddingInline: '48px',
  lineHeight: '64px',
  backgroundColor: '#1677ff',
};

const contentStyle: CSSProperties = {
  textAlign: 'center',
  minHeight: '120px',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#0958d9',
};

const siderStyle: CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#1677ff',
  width: '200px',
};

const footerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
};
</script>
