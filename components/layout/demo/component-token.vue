<docs>
---
order: 11
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

组件 Token

## en-US

Component Token
</docs>

<template>
  <a-config-provider :theme="layoutTheme">
    <a-layout style="border-radius: 8px; overflow: hidden; max-width: 100%">
      <a-layout-header style="display: flex; align-items: center">
        <div class="demo-logo" />
        <div style="margin-inline-start: 24px; font-size: 24px">Ant Design</div>
      </a-layout-header>
      <a-layout has-sider>
        <a-config-provider :theme="redSiderTheme">
          <a-layout-sider :width="32" />
        </a-config-provider>
        <a-layout-sider :width="200">
          <a-menu
            v-model:selected-keys="selectedKeys"
            v-model:open-keys="openKeys"
            mode="inline"
            style="border-inline-end: 0"
            :items="items2"
          />
        </a-layout-sider>
        <a-layout style="padding: 0 24px 24px">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Home</a-breadcrumb-item>
            <a-breadcrumb-item>List</a-breadcrumb-item>
            <a-breadcrumb-item>App</a-breadcrumb-item>
          </a-breadcrumb>
          <a-layout-content
            :style="{
              padding: '24px',
              margin: 0,
              minHeight: '280px',
              background: token.colorBgLayout,
              borderRadius: `${token.borderRadiusLG}px`,
            }"
          >
            Content
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons-vue';
import { theme } from '@hiltonkohler21/ant-design-vue';
import type { ConfigProviderProps, MenuProps } from '@hiltonkohler21/ant-design-vue';

const { token } = theme.useToken();

const selectedKeys = ref<string[]>(['1']);
const openKeys = ref<string[]>(['sub1']);

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: () => h(icon),
      label: `subnav ${key}`,
      children: Array.from({ length: 4 }).map((_, j) => {
        const subKey = String(index * 4 + j + 1);
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  },
);

const layoutTheme = computed<ConfigProviderProps['theme']>(() => ({
  components: {
    Layout: {
      bodyBg: '#fff',
      headerBg: '#1677ff',
      headerHeight: 64,
      headerPadding: '0 24px',
      headerColor: token.value.colorBgContainer,
      siderBg: '#800080',
    } as Record<string, any>,
  },
}));

const redSiderTheme: ConfigProviderProps['theme'] = {
  components: {
    Layout: {
      siderBg: 'red',
    } as Record<string, any>,
  },
};
</script>

<style scoped>
.demo-logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
