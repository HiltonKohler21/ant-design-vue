<docs>
---
order: 5
title:
  zh-CN: 自定义渲染
  en-US: Custom
---

## zh-CN

自定义渲染每一个 Segmented Item。

## en-US
Custom each Segmented Item.
</docs>
<template>
  <a-segmented v-model:value="value" :options="data">
    <template #label="{ value: val, payload = {} }">
      <div style="padding: 4px 4px">
        <template v-if="payload.icon">
          <a-avatar :src="payload.src" :style="payload.style">
            <template #icon><component :is="payload.icon" /></template>
            {{ payload.content }}
          </a-avatar>
        </template>
        <template v-else>
          <a-avatar :src="payload.src" :style="payload.style">
            {{ payload.content }}
          </a-avatar>
        </template>
        <div>{{ val }}</div>
      </div>
    </template>
  </a-segmented>
  <br />
  <br />
  <a-segmented v-model:value="value2" :options="options2">
    <template #label="{ payload }">
      <div style="padding: 4px 4px">
        <div>{{ payload.title }}</div>
        <div>{{ payload.subTitle }}</div>
      </div>
    </template>
  </a-segmented>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';

const avatarUrl =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%231677ff%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E';

const data = ref([
  {
    value: 'user1',
    payload: {
      src: avatarUrl,
      style: { backgroundColor: '#f56a00' },
    },
  },
  {
    value: 'user2',
    payload: {
      style: { backgroundColor: '#f56a00' },
      content: 'K',
    },
  },
  {
    value: 'user3',
    payload: {
      icon: UserOutlined,
      style: { backgroundColor: '#f56a00' },
    },
  },
]);
const options2 = ref([
  {
    value: 'spring',
    payload: {
      title: 'Spring',
      subTitle: 'Jan-Mar',
    },
  },
  {
    value: 'summer',
    payload: {
      title: 'Summer',
      subTitle: 'Apr-Jun',
    },
  },
  {
    value: 'autumn',
    payload: {
      title: 'Autumn',
      subTitle: 'Jul-Sept',
    },
  },
  {
    value: 'winter',
    payload: {
      title: 'Winter',
      subTitle: 'Oct-Dec',
    },
  },
]);
const value = ref('user1');
const value2 = ref('spring');
</script>
