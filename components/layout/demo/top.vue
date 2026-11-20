<docs>
---
order: 1
title:
  zh-CN: 上中下布局
  en-US: Header-Content-Footer
---

## zh-CN

最基本的『上-中-下』布局。<br>
一般主导航放置于页面的顶端，从左自右依次为：logo、一级导航项、辅助菜单（用户、设置、通知等）。通常将内容放在固定尺寸（例如：1200px）内，整个页面排版稳定，不受用户终端显示器影响。

## en-US

The most basic "header-content-footer" layout.<br>
Generally, the mainnav is placed at the top of the page, and includes the logo, the first level navigation, and the secondary menu from left to right in it.

</docs>
<template>
  <a-layout class="layout" style="border-radius: 8px; overflow: hidden">
    <a-layout-header style="display: flex; align-items: center">
      <div class="demo-logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px', flex: 1, minWidth: 0 }"
      >
        <a-menu-item key="1">nav 1</a-menu-item>
        <a-menu-item key="2">nav 2</a-menu-item>
        <a-menu-item key="3">nav 3</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 48px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px', borderRadius: '8px' }">
        Content
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2024 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const selectedKeys = ref<string[]>(['2']);
</script>
<style scoped>
.demo-logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
.ant-row-rtl .demo-logo {
  float: right;
  margin: 16px 0 16px 24px;
}
</style>
