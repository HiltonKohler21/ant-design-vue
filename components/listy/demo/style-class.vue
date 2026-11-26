<docs>
---
order: 8
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 自定义 Listy 的语义化结构（如 `root`、`item`、`groupHeader`），同时支持对象形式与函数形式 `(info: { props }) => ...`。

## en-US

Customize semantic parts of Listy (`root`, `item`, `groupHeader`, etc.) via `classNames` and `styles`, supporting both plain objects and dynamic functions `(info: { props }) => ...`.
</docs>

<template>
  <a-flex vertical gap="large" class="listy-semantic-demo">
    <div>
      <a-typography-title :level="5">Object classNames & styles</a-typography-title>
      <a-listy
        :items="users"
        row-key="id"
        :height="220"
        sticky
        :group="groupConfig"
        :class-names="objectClassNames"
        :styles="objectStyles"
      >
        <template #item="{ item }">
          <span>{{ item.name }}</span>
        </template>
      </a-listy>
    </div>

    <div>
      <a-flex justify="space-between" align="center" style="margin-bottom: 8px">
        <a-typography-title :level="5" style="margin: 0">
          Function classNames & styles
        </a-typography-title>
        <a-space size="small">
          <span>rowHoverable:</span>
          <a-switch v-model:checked="rowHoverable" />
        </a-space>
      </a-flex>
      <a-listy
        :items="users"
        row-key="id"
        :height="220"
        sticky
        :row-hoverable="rowHoverable"
        :group="groupConfig"
        :class-names="fnClassNames"
        :styles="fnStyles"
      >
        <template #item="{ item }">
          <span>{{ item.name }}</span>
        </template>
      </a-listy>
    </div>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ListyProps } from '@hiltonkohler21/ant-design-vue';

interface User {
  id: number;
  name: string;
  team: string;
}

const users: User[] = [
  { id: 0, name: 'Olivia', team: 'Design' },
  { id: 1, name: 'Liam', team: 'Design' },
  { id: 2, name: 'Emma', team: 'Design' },
  { id: 3, name: 'Noah', team: 'Engineering' },
  { id: 4, name: 'Ava', team: 'Engineering' },
  { id: 5, name: 'Ethan', team: 'Engineering' },
  { id: 6, name: 'Sophia', team: 'Marketing' },
  { id: 7, name: 'Lucas', team: 'Marketing' },
];

const groupConfig = {
  key: (user: User) => user.team,
  title: (team: string) => team,
};

const rowHoverable = ref(true);

const objectClassNames: ListyProps['classNames'] = {
  root: 'custom-listy-root',
  groupHeader: 'custom-listy-header',
};

const objectStyles: ListyProps['styles'] = {
  item: {
    fontStyle: 'italic',
  },
};

const fnClassNames: ListyProps['classNames'] = ({ props }) => ({
  root: props.rowHoverable ? 'fn-listy-root-active' : 'fn-listy-root-muted',
  groupHeader: 'fn-listy-header',
});

const fnStyles: ListyProps['styles'] = ({ props }) => ({
  item: {
    fontWeight: props.rowHoverable ? 500 : 400,
    letterSpacing: props.rowHoverable ? '0.02em' : 'normal',
  },
});
</script>

<style scoped>
.listy-semantic-demo :deep(.custom-listy-root) {
  border: 1px solid #91caff;
  border-radius: 8px;
  overflow: hidden;
}

.listy-semantic-demo :deep(.custom-listy-header) {
  color: #1677ff;
  background: #e6f4ff;
}

.listy-semantic-demo :deep(.fn-listy-root-active) {
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  overflow: hidden;
}

.listy-semantic-demo :deep(.fn-listy-root-muted) {
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
}

.listy-semantic-demo :deep(.fn-listy-header) {
  color: #389e0d;
  background: #f6ffed;
}
</style>
