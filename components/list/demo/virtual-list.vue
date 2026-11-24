<docs>
---
order: 13
title:
  zh-CN: 滚动加载无限长列表
  en-US: virtual list
---

## zh-CN

使用固定高度虚拟窗口渲染无限长列表，能够提高数据量大时候长列表的性能。

## en-US

An example of infinite & virtualized list using fixed-height virtual windowing for large datasets.
</docs>

<template>
  <context-holder />
  <a-list bordered>
    <div
      :style="{
        height: `${CONTAINER_HEIGHT}px`,
        overflowY: 'auto',
        position: 'relative',
      }"
      @scroll="onScroll"
    >
      <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
        <ul
          class="ant-list-items"
          :style="{
            position: 'absolute',
            top: '0px',
            left: '0px',
            right: '0px',
            transform: `translateY(${offsetY}px)`,
          }"
        >
          <a-list-item
            v-for="item in visibleItems"
            :key="item.email"
            :style="{ height: `${ITEM_HEIGHT}px`, boxSizing: 'border-box' }"
          >
            <a-list-item-meta :description="item.email">
              <template #avatar>
                <a-avatar :src="item.avatar" />
              </template>
              <template #title>
                <a href="https://www.antdv.com/">{{ item.name }}</a>
              </template>
            </a-list-item-meta>
            <div>Content</div>
          </a-list-item>
        </ul>
      </div>
    </div>
  </a-list>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';

interface UserItem {
  email: string;
  name: string;
  avatar: string;
}

const CONTAINER_HEIGHT = 400;
const ITEM_HEIGHT = 74;
const OVERSCAN = 4;
const PAGE_SIZE = 20;

const avatars = [
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%231677ff%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23f9f0ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%23722ed1%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%23722ed1%22%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6fffb%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%2313c2c2%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%2313c2c2%22%2F%3E%3C%2Fsvg%3E',
];

const names = ['Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Lucas', 'Mia', 'Mason'];

const createMockUsers = (offset: number, count: number): UserItem[] =>
  Array.from({ length: count }, (_, idx) => {
    const seq = offset + idx + 1;
    const baseName = names[(seq - 1) % names.length];
    return {
      name: `${baseName} User ${seq}`,
      email: `${baseName.toLowerCase()}.user.${seq}@antdv.com`,
      avatar: avatars[(seq - 1) % avatars.length],
    };
  });

const [messageApi, contextHolder] = message.useMessage();
const data = ref<UserItem[]>(createMockUsers(0, PAGE_SIZE));
const scrollTop = ref(0);

const totalHeight = computed(() => data.value.length * ITEM_HEIGHT);
const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / ITEM_HEIGHT) - OVERSCAN),
);
const visibleCount = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT) + OVERSCAN * 2;
const endIndex = computed(() => Math.min(data.value.length, startIndex.value + visibleCount));
const offsetY = computed(() => startIndex.value * ITEM_HEIGHT);
const visibleItems = computed(() => data.value.slice(startIndex.value, endIndex.value));

const appendData = () => {
  const nextBatch = createMockUsers(data.value.length, PAGE_SIZE);
  data.value = [...data.value, ...nextBatch];
  messageApi.success(`${nextBatch.length} more items loaded!`);
};

const onScroll = (e: Event) => {
  const target = e.currentTarget as HTMLElement | null;
  if (!target) {
    return;
  }
  scrollTop.value = target.scrollTop;
  if (Math.abs(target.scrollHeight - target.scrollTop - CONTAINER_HEIGHT) <= 1) {
    appendData();
  }
};
</script>
