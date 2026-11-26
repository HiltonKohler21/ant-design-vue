<docs>
---
order: 8
title:
  zh-CN: 滚动加载
  en-US: Scrolling loaded
---

## zh-CN

监听容器滚动事件实现滚动自动加载列表。

## en-US

Implement infinite scroll loading by listening to the container's scroll event.
</docs>

<template>
  <div
    id="scrollableDiv"
    :style="{
      height: '400px',
      overflow: 'auto',
      padding: '0 16px',
      border: '1px solid rgba(140, 140, 140, 0.35)',
    }"
    @scroll="handleScroll"
  >
    <a-list :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item :key="item.id">
          <a-list-item-meta :description="item.email">
            <template #avatar>
              <a-avatar :src="item.avatar" />
            </template>
            <template #title>
              <a href="https://hiltonkohler21.github.io/ant-design-vue/">{{ item.name }}</a>
            </template>
          </a-list-item-meta>
          <div>Content</div>
        </a-list-item>
      </template>
    </a-list>
    <a-skeleton v-if="loading" avatar :paragraph="{ rows: 1 }" active />
    <a-divider v-if="!hasMore && !loading" plain>It is all, nothing more 🤐</a-divider>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue';

interface DataType {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

const MAX_COUNT = 50;
const PAGE_SIZE = 10;

const avatars = [
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%231677ff%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23f9f0ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%23722ed1%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%23722ed1%22%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6fffb%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%2313c2c2%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%2313c2c2%22%2F%3E%3C%2Fsvg%3E',
];

const firstNames = [
  'Olivia',
  'Liam',
  'Emma',
  'Noah',
  'Ava',
  'Ethan',
  'Sophia',
  'Lucas',
  'Mia',
  'Mason',
];
const lastNames = [
  'Carter',
  'Adams',
  'Evans',
  'Brooks',
  'Reed',
  'Parker',
  'Hayes',
  'Foster',
  'Kim',
  'Lopez',
];

const createMockBatch = (offset: number, size: number): DataType[] =>
  Array.from({ length: size }, (_, idx) => {
    const seq = offset + idx + 1;
    const first = firstNames[(seq - 1) % firstNames.length];
    const last = lastNames[Math.floor((seq - 1) / firstNames.length) % lastNames.length];
    return {
      id: `user-${seq}`,
      name: `${first} ${last} #${seq}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}.${seq}@example.com`,
      avatar: avatars[(seq - 1) % avatars.length],
    };
  });

const loading = ref(false);
const data = ref<DataType[]>(createMockBatch(0, PAGE_SIZE));
const hasMore = computed(() => data.value.length < MAX_COUNT);
let timer: ReturnType<typeof setTimeout> | undefined;

const loadMoreData = () => {
  if (loading.value || !hasMore.value) {
    return;
  }
  loading.value = true;
  timer = setTimeout(() => {
    const remaining = MAX_COUNT - data.value.length;
    const nextBatch = createMockBatch(data.value.length, Math.min(PAGE_SIZE, remaining));
    data.value = [...data.value, ...nextBatch];
    loading.value = false;
  }, 300);
};

const handleScroll = (e: Event) => {
  const target = e.currentTarget as HTMLElement | null;
  if (!target) {
    return;
  }
  if (target.scrollHeight - target.scrollTop - target.clientHeight <= 40) {
    loadMoreData();
  }
};

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>
