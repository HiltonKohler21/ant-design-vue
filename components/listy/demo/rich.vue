<docs>
---
order: 4
title:
  zh-CN: 复杂内容
  en-US: Rich content
---

## zh-CN

通过 `#item` 插槽或 `itemRender` 可以渲染任意复杂的内容（如头像、标签、操作按钮等），行高不必相同。

## en-US

Render arbitrarily rich content such as avatars, tags, and action buttons via the `#item` slot or `itemRender`. Rows do not need to have the same height.
</docs>

<template>
  <a-listy :items="notifications" row-key="id" :height="400">
    <template #item="{ item }">
      <a-flex gap="middle" align="flex-start">
        <a-avatar :style="{ backgroundColor: colorOf(item.user), flex: 'none' }">
          {{ item.user[0] }}
        </a-avatar>
        <a-flex vertical flex="auto" style="min-width: 0">
          <a-flex justify="space-between" align="center" gap="small">
            <a-space size="small">
              <a-typography-text strong>{{ item.user }}</a-typography-text>
              <a-tag :color="item.tagColor">{{ item.tag }}</a-tag>
            </a-space>
            <a-space size="small">
              <a-typography-text type="secondary">{{ item.time }}</a-typography-text>
              <a-button type="link" size="small" @click="toggleRead(item.id)">
                {{ item.read ? 'Unread' : 'Read' }}
              </a-button>
            </a-space>
          </a-flex>
          <a-typography-text :type="item.read ? 'secondary' : undefined">
            {{ item.message }}
          </a-typography-text>
        </a-flex>
      </a-flex>
    </template>
  </a-listy>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Notification {
  id: number;
  user: string;
  tag: string;
  tagColor: string;
  message: string;
  time: string;
  read: boolean;
}

const users = ['Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Lucas'];
const tags = [
  { label: 'Review', color: 'blue' },
  { label: 'Meeting', color: 'purple' },
  { label: 'Design', color: 'cyan' },
  { label: 'Task', color: 'orange' },
  { label: 'Starred', color: 'green' },
  { label: 'PR', color: 'magenta' },
];
const messages = [
  'commented on your merge request',
  'invited you to the quarterly planning review. Please confirm your availability before Friday so the agenda can be finalized in time.',
  'mentioned you in the design review thread',
  'assigned you a task that is due next Monday. It covers the remaining accessibility issues found in the latest audit.',
  'starred the report you shared yesterday',
  'requested changes on your pull request. Most of the comments are about naming and the test coverage of the new cache layer.',
];

const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const colorOf = (user: string) => colors[users.indexOf(user) % colors.length];
const pad = (value: number) => String(value).padStart(2, '0');

const notifications = ref<Notification[]>(
  Array.from({ length: 12 }, (_, index) => {
    const tagInfo = tags[index % tags.length];
    return {
      id: index,
      user: users[index % users.length],
      tag: tagInfo.label,
      tagColor: tagInfo.color,
      message: messages[index % messages.length],
      time: `${pad((8 + index) % 24)}:${pad((index * 17) % 60)}`,
      read: index % 3 === 0,
    };
  }),
);

const toggleRead = (id: number) => {
  const target = notifications.value.find(item => item.id === id);
  if (target) {
    target.read = !target.read;
  }
};
</script>
