<docs>
---
order: 15
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
  <a-config-provider :theme="primaryTabsTheme">
    <div>
      <a-tabs default-active-key="1" style="margin-bottom: 32px" :items="tabItems">
        <template #rightExtra>
          <a-button>Extra Action</a-button>
        </template>
      </a-tabs>
      <a-tabs
        tab-placement="start"
        default-active-key="1"
        style="margin-bottom: 32px"
        :items="tabItems"
      >
        <template #rightExtra>
          <a-button>Extra Action</a-button>
        </template>
      </a-tabs>
      <a-tabs size="small" default-active-key="1" style="margin-bottom: 32px" :items="tabItems">
        <template #rightExtra>
          <a-button>Extra Action</a-button>
        </template>
      </a-tabs>
      <a-tabs size="large" default-active-key="1" style="margin-bottom: 32px" :items="tabItems">
        <template #rightExtra>
          <a-button>Extra Action</a-button>
        </template>
      </a-tabs>
      <a-tabs default-active-key="1" centered type="card" :items="tabItems" />
      <a-tabs size="small" default-active-key="1" centered type="card" :items="tabItems" />
      <a-tabs size="large" default-active-key="1" centered type="card" :items="tabItems" />
    </div>
  </a-config-provider>
  <a-config-provider :theme="compactCardTheme">
    <a-tabs size="small" type="editable-card" :items="tabItems" />
  </a-config-provider>
  <a-flex align="flex-end">
    <a-tabs size="large" type="card" :items="sharedTabItems" :tab-bar-style="sharedTabBarStyle" />
    <a-tabs size="middle" type="card" :items="sharedTabItems" :tab-bar-style="sharedTabBarStyle" />
    <a-tabs
      size="small"
      type="editable-card"
      :items="sharedTabItems"
      :tab-bar-style="sharedTabBarStyle"
    />
    <a-tabs size="small" type="card" :items="sharedTabItems" :tab-bar-style="sharedTabBarStyle" />
  </a-flex>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps, TabsProps } from '@hiltonkohler21/ant-design-vue';

const tabItems: TabsProps['items'] = Array.from({ length: 3 }).map((_, i) => {
  const id = String(i + 1);
  return {
    disabled: i === 2,
    label: `Tab ${id}`,
    key: id,
    children: `Content of Tab Pane ${id}`,
  };
});

const sharedTabItems: TabsProps['items'] = Array.from({ length: 2 }).map((_, i) => {
  const id = String(i + 1);
  return {
    label: `Tab ${id}`,
    key: id,
  };
});

const sharedTabBarStyle = { background: 'red' };

const primaryTabsTheme: ConfigProviderProps['theme'] = {
  components: {
    Tabs: {
      cardBg: '#f6ffed',
      cardHeight: 60,
      cardPadding: '20px',
      cardPaddingSM: '20px',
      cardPaddingLG: '20px',
      titleFontSize: 20,
      titleFontSizeLG: 20,
      titleFontSizeSM: 20,
      inkBarColor: '#52C41A',
      horizontalMargin: '0 0 12px 0',
      horizontalItemGutter: 12,
      horizontalItemPadding: '20px',
      horizontalItemPaddingSM: '20px',
      horizontalItemPaddingLG: '20px',
      verticalItemPadding: '8px',
      verticalItemMargin: '4px 0 0 0',
      itemColor: 'rgba(0,0,0,0.85)',
      itemSelectedColor: '#389e0d',
      itemHoverColor: '#d9f7be',
      itemActiveColor: '#b7eb8f',
      cardGutter: 12,
    } as Record<string, any>,
  },
};

const compactCardTheme: ConfigProviderProps['theme'] = {
  components: {
    Tabs: {
      cardHeight: 180,
      cardPadding: '0px 0px 0px 0px',
      cardPaddingSM: '0px 0px 0px 0px',
      verticalItemPadding: '0px 0px',
      borderRadiusLG: 0,
      borderRadius: 0,
      horizontalItemPadding: '0px 0px 0px 0px',
      horizontalMargin: '0 0 0 0',
      inkBarColor: '#ffa940',
    } as Record<string, any>,
  },
};
</script>
