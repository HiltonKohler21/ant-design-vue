<docs>
---
order: 4
title:
  zh-CN: 分页设置
  en-US: Pagination Settings
---

## zh-CN

可通过 `pagination` 属性使用列表分页，并进行设置。

## en-US

List pagination can be used and set through the `pagination` property.
</docs>

<template>
  <a-space direction="vertical" :style="{ marginBottom: '20px', maxWidth: '100%' }" size="middle">
    <a-space wrap>
      <span>Pagination Position:</span>
      <a-radio-group v-model:value="position" option-type="button">
        <a-radio-button v-for="item in positionOptions" :key="item" :value="item">
          {{ item }}
        </a-radio-button>
      </a-radio-group>
    </a-space>
    <a-space wrap>
      <span>Pagination Align:</span>
      <a-radio-group v-model:value="align" option-type="button">
        <a-radio-button v-for="item in alignOptions" :key="item" :value="item">
          {{ item }}
        </a-radio-button>
      </a-radio-group>
    </a-space>
  </a-space>
  <a-list :pagination="{ position, align }" :data-source="data">
    <template #renderItem="{ item, index }">
      <a-list-item>
        <a-list-item-meta
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        >
          <template #avatar>
            <a-avatar :src="avatars[index % avatars.length]" />
          </template>
          <template #title>
            <a href="https://hiltonkohler21.github.io/ant-design-vue/">{{ item.title }}</a>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

type PaginationPosition = 'top' | 'bottom' | 'both';
type PaginationAlign = 'start' | 'center' | 'end';

const avatars = [
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%231677ff%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23f9f0ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%23722ed1%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%23722ed1%22%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6fffb%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%2313c2c2%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%2313c2c2%22%2F%3E%3C%2Fsvg%3E',
];

const data = [
  { title: 'Ant Design Title 1' },
  { title: 'Ant Design Title 2' },
  { title: 'Ant Design Title 3' },
  { title: 'Ant Design Title 4' },
];

const positionOptions: PaginationPosition[] = ['top', 'bottom', 'both'];
const alignOptions: PaginationAlign[] = ['start', 'center', 'end'];

const position = ref<PaginationPosition>('bottom');
const align = ref<PaginationAlign>('center');
</script>
