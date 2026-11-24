<docs>
---
order: 6
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

组件 Token debug。

## en-US

Debug Component Token.
</docs>

<template>
  <a-space direction="vertical">
    <a-config-provider :theme="darkPopupTheme">
      <a-menu v-model:selected-keys="current" mode="horizontal" :items="items" @click="onClick" />
      <a-menu
        v-model:selected-keys="selectedKeys1"
        v-model:open-keys="openKeys1"
        mode="inline"
        theme="dark"
        inline-collapsed
        :items="items2"
        :style="{ width: '56px' }"
      />
    </a-config-provider>
    <a-config-provider :theme="horizontalTheme">
      <a-menu v-model:selected-keys="current" mode="horizontal" :items="items" @click="onClick" />
    </a-config-provider>
    <a-config-provider :theme="darkInlineTheme">
      <a-menu
        v-model:selected-keys="selectedKeys2"
        v-model:open-keys="openKeys2"
        mode="inline"
        theme="dark"
        :items="items2"
        :style="{ width: '256px' }"
      />
    </a-config-provider>
  </a-space>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue';
import { theme } from 'ant-design-vue';
import type { ConfigProviderProps, MenuProps } from 'ant-design-vue';

const current = ref<string[]>(['mail']);
const selectedKeys1 = ref<string[]>(['1']);
const openKeys1 = ref<string[]>(['sub1']);
const selectedKeys2 = ref<string[]>(['1']);
const openKeys2 = ref<string[]>(['sub1']);

const onClick: MenuProps['onClick'] = e => {
  console.log('click ', e);
  current.value = [String(e.key)];
};

const items: MenuProps['items'] = [
  {
    label: 'Navigation One',
    key: 'mail',
    icon: () => h(MailOutlined),
  },
  {
    label: 'Navigation Two',
    key: 'app',
    icon: () => h(AppstoreOutlined),
    disabled: true,
  },
  {
    label: 'Navigation Three - Submenu',
    key: 'SubMenu',
    icon: () => h(SettingOutlined),
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          { label: 'Option 1', key: 'setting:1' },
          { label: 'Option 2', key: 'setting:2' },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          { label: 'Option 3', key: 'setting:3' },
          { label: 'Option 4', key: 'setting:4' },
        ],
      },
    ],
  },
  {
    key: 'alipay',
    label: h(
      'a',
      { href: 'https://ant.design', target: '_blank', rel: 'noopener noreferrer' },
      'Navigation Four - Link',
    ),
  },
];

const items2: MenuProps['items'] = [
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
    key: '3',
    icon: () => h(ContainerOutlined),
    label: 'Option 3',
  },
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: () => h(MailOutlined),
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      { key: '7', label: 'Option 7' },
      { key: '8', label: 'Option 8' },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    icon: () => h(AppstoreOutlined),
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '11', label: 'Option 11' },
          { key: '12', label: 'Option 12' },
        ],
      },
    ],
  },
];

const darkPopupTheme: ConfigProviderProps['theme'] = {
  algorithm: [theme.darkAlgorithm],
  components: {
    Menu: {
      popupBg: 'yellow',
      darkPopupBg: 'red',
    } as Record<string, any>,
  },
};

const horizontalTheme: ConfigProviderProps['theme'] = {
  components: {
    Menu: {
      horizontalItemBorderRadius: 6,
      popupBg: 'red',
      horizontalItemHoverBg: '#f5f5f5',
    } as Record<string, any>,
  },
};

const darkInlineTheme: ConfigProviderProps['theme'] = {
  components: {
    Menu: {
      darkItemColor: '#91daff',
      darkItemBg: '#d48806',
      darkSubMenuItemBg: '#faad14',
      darkItemSelectedColor: '#ffccc7',
      darkItemSelectedBg: '#52c41a',
    } as Record<string, any>,
  },
};
</script>
