<docs>
---
order: 16
version: 4.3.0
title:
  zh-CN: 自定义弹出框
  en-US: Custom Submenu Render
---

## zh-CN

使用 `popupRender` 属性自定义弹出菜单的渲染。

## en-US

Use the `popupRender` prop to customize submenu popup rendering.
</docs>

<template>
  <a-config-provider :theme="themeConfig">
    <a-menu
      mode="horizontal"
      :items="menuItems"
      :popup-render="popupRender"
      :style="{ maxWidth: '100%' }"
    />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { Col, Flex, Row, Typography } from '@hiltonkohler21/ant-design-vue';
import type { ConfigProviderProps, MenuProps } from '@hiltonkohler21/ant-design-vue';

const renderCard = (title: string, description: string) =>
  h('div', { class: 'custom-popup-menu-item' }, [
    h(Typography.Title, { level: 5, class: 'custom-popup-margin-less' }, { default: () => title }),
    h(
      Typography.Paragraph,
      { type: 'secondary', class: 'custom-popup-margin-less' },
      { default: () => description },
    ),
  ]);

const menuItems: MenuProps['items'] = [
  {
    key: 'home',
    label: 'Home',
  },
  {
    key: 'features',
    label: 'Features',
    children: [
      {
        key: 'getting-started',
        label: renderCard('Getting Started', 'Quick start guide and learn the basics.'),
      },
      {
        key: 'components',
        label: renderCard('Components', 'Explore our component library.'),
      },
      {
        key: 'templates',
        label: renderCard('Templates', 'Ready-to-use template designs.'),
      },
    ],
  },
  {
    key: 'resources',
    label: 'Resources',
    children: [
      {
        key: 'blog',
        label: renderCard('Blog', 'Latest updates and articles.'),
      },
      {
        key: 'community',
        label: renderCard('Community', 'Join our developer community.'),
      },
    ],
  },
];

const popupRender: MenuProps['popupRender'] = (_node, { item }) => {
  const children = Array.isArray(item.children) ? item.children : [];
  return h(
    Flex,
    { class: 'custom-popup-navigation', vertical: true, gap: 'middle' },
    {
      default: () => [
        h(
          Typography.Title,
          { level: 4, class: 'custom-popup-leading-header' },
          { default: () => item.title },
        ),
        h(
          Row,
          { gutter: [12, 12] },
          {
            default: () =>
              children.map((child: any, idx: number) =>
                h(Col, { span: 12, key: child?.key ?? idx }, { default: () => child }),
              ),
          },
        ),
      ],
    },
  );
};

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Menu: {
      popupBg: '#fff',
    } as Record<string, any>,
  },
};
</script>

<style>
.custom-popup-navigation {
  padding: 16px;
  width: 360px;
  max-width: 90vw;
  background: var(--ant-color-bg-elevated, #fff);
  border-radius: 8px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08);
}
.custom-popup-leading-header {
  margin: 0 !important;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
}
.custom-popup-menu-item {
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
}
.custom-popup-menu-item:hover {
  background: rgba(0, 0, 0, 0.02);
}
.custom-popup-margin-less {
  margin: 0 !important;
}
</style>
