<docs>
---
order: 12
debug: true
title:
  zh-CN: v4 版本 Menu
  en-US: Menu v4
---

## zh-CN

V4 样式的 Menu 组件。

## en-US

Menu with v4 style.
</docs>

<template>
  <div>
    <a-space wrap :style="{ marginBottom: '16px' }">
      <a-switch @change="changeMode" />
      <span>Change Mode</span>
    </a-space>
    <a-config-provider :theme="v4Theme">
      <a-menu
        :style="{ width: '256px', maxWidth: '100%' }"
        :default-selected-keys="['1']"
        :default-open-keys="['sub1']"
        :mode="mode"
        :items="items"
      />
    </a-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import {
  AppstoreOutlined,
  CalendarOutlined,
  LinkOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue';
import { Typography } from 'ant-design-vue';
import type { ConfigProviderProps, MenuProps } from 'ant-design-vue';

const mode = ref<'vertical' | 'inline'>('inline');

const changeMode = (value: boolean | string | number) => {
  mode.value = value ? 'vertical' : 'inline';
};

const v4Theme: ConfigProviderProps['theme'] = {
  components: {
    Menu: {
      radiusItem: 0,
      radiusSubMenuItem: 0,
      colorItemTextHover: '#1890ff',
      colorItemTextSelected: '#1890ff',
      colorItemBgSelected: '#e6f7ff',
      colorActiveBarWidth: 3,
      itemMarginInline: 0,
      colorItemBgHover: 'transparent',
    } as Record<string, any>,
  },
};

const items: MenuProps['items'] = [
  {
    key: '1',
    icon: () => h(MailOutlined),
    label: 'Navigation One',
  },
  {
    key: '2',
    icon: () => h(CalendarOutlined),
    label: 'Navigation Two',
  },
  {
    key: 'sub1',
    icon: () => h(AppstoreOutlined),
    label: 'Navigation Two',
    children: [
      {
        key: '3',
        label: h(
          Typography.Text,
          { ellipsis: true },
          {
            default: () =>
              'Ant Design, a design language for background applications, is refined by Ant UED Team',
          },
        ),
      },
      {
        key: '4',
        label: 'Option 4',
      },
      {
        key: 'sub1-2',
        label: 'Submenu',
        children: [
          { key: '5', label: 'Option 5' },
          { key: '6', label: 'Option 6' },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Three',
    icon: () => h(SettingOutlined),
    children: [
      { label: 'Option 7', key: '7' },
      { label: 'Option 8', key: '8' },
      { label: 'Option 9', key: '9' },
      { label: 'Option 10', key: '10' },
    ],
  },
  {
    key: 'link',
    icon: () => h(LinkOutlined),
    label: h(
      'a',
      { href: 'https://antdv.com', target: '_blank', rel: 'noopener noreferrer' },
      'Ant Design Vue',
    ),
  },
];
</script>
