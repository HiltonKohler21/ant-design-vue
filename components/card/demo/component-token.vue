<docs>
---
order: 14
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
    <a-flex vertical gap="middle">
      <a-card
        title="Card title"
        :tab-list="tabList"
        :active-tab-key="activeKey"
        @tabChange="onTabChange"
      >
        <template #extra>More</template>
        <template #actions>
          <SettingOutlined key="setting" />
          <EditOutlined key="edit" />
          <EllipsisOutlined key="ellipsis" />
        </template>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </a-card>
      <a-card size="small" title="Small size card" style="width: 300px; max-width: 100%">
        <template #extra>
          <a href="#">More</a>
        </template>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </a-card>
    </a-flex>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons-vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const activeKey = ref('tab1');
const tabList = [
  { key: 'tab1', tab: 'tab1' },
  { key: 'tab2', tab: 'tab2' },
];

const onTabChange = (key: string) => {
  activeKey.value = key;
};

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Card: {
      headerBg: '#e6f4ff',
      bodyPaddingSM: 22,
      headerPaddingSM: 20,
      headerPadding: 18,
      bodyPadding: 26,
      headerFontSize: 20,
      headerFontSizeSM: 20,
      headerHeight: 60,
      headerHeightSM: 60,
      actionsBg: '#e6f4ff',
      actionsLiMargin: '2px 0',
      tabsMarginBottom: 0,
      extraColor: 'rgba(0,0,0,0.25)',
    } as Record<string, any>,
  },
};
</script>
