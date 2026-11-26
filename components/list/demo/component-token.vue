<docs>
---
order: 14
debug: true
title:
  zh-CN: 自定义组件 Token
  en-US: Custom component token
---

## zh-CN

自定义组件 Token。

## en-US

Custom component token.
</docs>

<template>
  <a-config-provider :theme="themeConfig">
    <a-divider title-placement="start">Default Size</a-divider>
    <a-list bordered :data-source="data">
      <template #header>
        <div>Header</div>
      </template>
      <template #footer>
        <div>Footer</div>
      </template>
      <template #renderItem="{ item }">
        <a-list-item>
          <a-typography-text mark>[ITEM]</a-typography-text>
          {{ item }}
        </a-list-item>
      </template>
    </a-list>

    <a-divider title-placement="start">Small Size</a-divider>
    <a-list size="small" bordered :data-source="data">
      <template #header>
        <div>Header</div>
      </template>
      <template #footer>
        <div>Footer</div>
      </template>
      <template #renderItem="{ item }">
        <a-list-item>{{ item }}</a-list-item>
      </template>
    </a-list>

    <a-divider title-placement="start">Large Size</a-divider>
    <a-list size="large" bordered :data-source="data">
      <template #header>
        <div>Header</div>
      </template>
      <template #footer>
        <div>Footer</div>
      </template>
      <template #renderItem="{ item }">
        <a-list-item>{{ item }}</a-list-item>
      </template>
    </a-list>

    <a-divider title-placement="start">Meta</a-divider>
    <a-list item-layout="horizontal" :data-source="data1">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          >
            <template #avatar>
              <a-avatar :src="avatarUrl" />
            </template>
            <template #title>
              <a href="https://ant.design">{{ item.title }}</a>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>

    <a-divider title-placement="start">Vertical</a-divider>
    <a-list item-layout="vertical" :data-source="data1">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          >
            <template #avatar>
              <a-avatar :src="avatarUrl" />
            </template>
            <template #title>
              <a href="https://ant.design">{{ item.title }}</a>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>

    <a-divider title-placement="start">Empty Text</a-divider>
    <a-list :data-source="[]" />
  </a-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

const avatarUrl =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%231677ff%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E';

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

const data1 = [
  { title: 'Ant Design Title 1' },
  { title: 'Ant Design Title 2' },
  { title: 'Ant Design Title 3' },
  { title: 'Ant Design Title 4' },
];

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    List: {
      headerBg: 'pink',
      footerBg: 'pink',
      emptyTextPadding: 32,
      itemPadding: '26px',
      itemPaddingSM: '16px',
      itemPaddingLG: '36px',
      metaMarginBottom: 20,
      avatarMarginRight: 20,
      titleMarginBottom: 10,
      descriptionFontSize: 20,
    } as Record<string, any>,
  },
};
</script>
