<docs>
---
order: 6
version: 4.3.0
title:
  zh-CN: 折叠覆盖布局
  en-US: Collapsible overlay
background: grey
compact: true
---

## zh-CN

通过贴附在 Sider 边缘的自定义触发器控制收起展开。展开后的 Sider 可以通过业务样式脱离文档流并覆盖内容，避免挤压内容区域。

## en-US

Use a custom trigger attached to the Sider edge to collapse or expand it. The expanded Sider can leave the document flow and overlay the content with business styles to avoid squeezing the content area.

</docs>

<template>
  <a-layout :style="layoutStyle">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      collapsed-width="0"
      :style="siderStyle"
    >
      <template #trigger>
        <menu-unfold-outlined v-if="collapsed" />
        <menu-fold-outlined v-else />
      </template>
      <div class="demo-logo-vertical" />
      <a-menu v-model:selected-keys="selectedKeys" theme="dark" mode="inline" :items="items" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        :style="{
          padding: 0,
          background: token.colorBgContainer,
        }"
      />
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div
          :style="{
            padding: '24px',
            minHeight: '240px',
            background: token.colorBgContainer,
            borderRadius: `${token.borderRadiusLG}px`,
          }"
        >
          Content keeps its full width when the sider overlays it.
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
        Ant Design ©2024 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import type { CSSProperties } from 'vue';
import {
  DesktopOutlined,
  FileOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue';
import { theme } from '@hiltonkohler21/ant-design-vue';
import type { MenuProps } from '@hiltonkohler21/ant-design-vue';

const { token } = theme.useToken();

const collapsed = ref(false);
const selectedKeys = ref<string[]>(['1']);

const layoutStyle: CSSProperties = {
  position: 'relative',
  minHeight: '360px',
  maxWidth: '100%',
  overflow: 'hidden',
  borderRadius: '8px',
};

const siderStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  insetInlineStart: 0,
  zIndex: 10,
};

const items: MenuProps['items'] = [
  PieChartOutlined,
  DesktopOutlined,
  TeamOutlined,
  FileOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: () => h(icon),
  label: `nav ${index + 1}`,
}));
</script>

<style scoped>
.demo-logo-vertical {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
