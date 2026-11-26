<docs>
---
order: 4
title:
  zh-CN: 分组与吸顶
  en-US: Grouping and sticky headers
---

## zh-CN

通过 `group` 从数据项中提取分组键并渲染分组标题，开启 `sticky` 后分组标题会在滚动时吸顶。

## en-US

Use `group` to derive a group key from each item and render group headers. Enable `sticky` to keep the active group header pinned to the top while scrolling.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-space align="center">
      <span>Sticky headers:</span>
      <a-switch v-model:checked="sticky" />
      <a-button size="small" @click="jumpToGroup('E')">Jump to Group E</a-button>
      <a-button size="small" @click="jumpToGroup('H')">Jump to Group H</a-button>
    </a-space>
    <a-listy
      ref="listRef"
      :items="contacts"
      row-key="id"
      :height="360"
      :sticky="sticky"
      :group="groupConfig"
    >
      <template #item="{ item }">
        <a-flex align="center" gap="small">
          <a-avatar size="small" :style="{ backgroundColor: colorOf(item.name[0]) }">
            {{ item.name[0] }}
          </a-avatar>
          <span>{{ item.name }}</span>
        </a-flex>
      </template>
    </a-listy>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ListyRef } from '@hiltonkohler21/ant-design-vue';

interface Contact {
  id: number;
  name: string;
}

const names = [
  'Aaron Baker',
  'Alice Adams',
  'Bella Carter',
  'Brian Diaz',
  'Chloe Evans',
  'Colin Foster',
  'Daisy Garcia',
  'David Hayes',
  'Elena Ingram',
  'Eric Jensen',
  'Fiona Kim',
  'Frank Lopez',
  'Grace Miller',
  'Gavin Nguyen',
  'Hannah Ortiz',
  'Henry Parker',
  'Iris Quincy',
  'Ivan Reed',
  'Jack Smith',
  'Julia Turner',
];

const contacts: Contact[] = names.map((name, id) => ({ id, name }));

const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#87d068'];
const colorOf = (letter: string) => colors[(letter.charCodeAt(0) - 65) % colors.length];

const sticky = ref(true);
const listRef = ref<ListyRef>();

const groupConfig = {
  key: (contact: Contact) => contact.name[0],
  title: (letter: string, groupItems: Contact[]) => `${letter} (${groupItems.length})`,
};

const jumpToGroup = (groupKey: string) => {
  listRef.value?.scrollTo({ groupKey, align: 'top' });
};
</script>
