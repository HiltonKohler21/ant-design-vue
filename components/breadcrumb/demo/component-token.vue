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
  <a-config-provider :theme="themeConfig">
    <a-breadcrumb separator=">">
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item>
        <a href="">Application Center</a>
      </a-breadcrumb-item>
      <a-breadcrumb-item>
        <a href="">General</a>
        <template #overlay>
          <a-menu>
            <a-menu-item key="1">
              <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">General</a>
            </a-menu-item>
            <a-menu-item key="2">
              <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">Layout</a>
            </a-menu-item>
            <a-menu-item key="3">
              <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                Navigation
              </a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-breadcrumb-item>
      <a-breadcrumb-item href="">Application Center</a-breadcrumb-item>
      <a-breadcrumb-item href="">
        <HomeOutlined />
      </a-breadcrumb-item>
      <a-breadcrumb-item href="">
        <UserOutlined />
        <span>Application List</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { HomeOutlined, UserOutlined } from '@ant-design/icons-vue';
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Breadcrumb: {
      itemColor: '#b02121',
      lastItemColor: '#0f3a88',
      iconFontSize: 28,
      linkColor: '#979a42',
      linkHoverColor: '#9450c0',
      separatorColor: '#b41b60',
      separatorMargin: 22,
    } as Record<string, any>,
  },
};
</script>
