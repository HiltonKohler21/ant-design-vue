<docs>
---
order: 10
debug: true
title:
  zh-CN: 自定义触发器 Debug
  en-US: Custom trigger debug
background: grey
compact: true
---

## zh-CN

修改内容前，请尝试此 Demo 查看样式是否抖动。

## en-US

Try this demo before modifying content to verify whether the layout jitters.

</docs>

<template>
  <a-layout style="border-radius: 8px; overflow: hidden; max-width: 100%">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="demo-logo-vertical" />
      <a-menu
        v-model:selected-keys="selectedKeys"
        v-model:open-keys="openKeys"
        theme="dark"
        mode="inline"
        :items="items"
      />
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ padding: 0, background: token.colorBgContainer }">
        <a-button
          type="text"
          :style="{
            fontSize: '16px',
            width: '64px',
            height: '64px',
          }"
          @click="collapsed = !collapsed"
        >
          <template #icon>
            <menu-unfold-outlined v-if="collapsed" />
            <menu-fold-outlined v-else />
          </template>
        </a-button>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          minHeight: '280px',
          background: token.colorBgContainer,
          borderRadius: `${token.borderRadiusLG}px`,
        }"
      >
        Content
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import {
  DesktopOutlined,
  FileOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { theme } from '@hiltonkohler21/ant-design-vue';
import type { MenuProps } from '@hiltonkohler21/ant-design-vue';

const { token } = theme.useToken();

const collapsed = ref(true);
const selectedKeys = ref<string[]>(['3']);
const openKeys = ref<string[]>(['sub1']);

const items: MenuProps['items'] = [
  {
    key: '1',
    icon: () => h(PieChartOutlined),
    label: 'Option 1',
  },
  {
    key: '2',
    icon: () => h(DesktopOutlined),
    label: 'Option 2',
  },
  {
    key: 'sub1',
    icon: () => h(UserOutlined),
    label: 'User',
    children: [
      { key: '3', label: 'Tom' },
      { key: '4', label: 'Bill' },
      { key: '5', label: 'Alex' },
    ],
  },
  {
    key: 'sub2',
    icon: () => h(TeamOutlined),
    label: 'Team',
    children: [
      { key: '6', label: 'Team 1' },
      { key: '7', label: 'Team 2' },
    ],
  },
  {
    key: '9',
    icon: () => h(FileOutlined),
  },
];
</script>

<style scoped>
.demo-logo-vertical {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
