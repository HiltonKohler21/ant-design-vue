<docs>
---
order: 3
version: 4.3.0
title:
  zh-CN: 横向滚动
  en-US: Horizontal scrolling
---

## zh-CN

设置 `scrollWidth` 后，当内容宽度超出容器宽度时可以横向滚动，并可与 `virtual`、`group`、`sticky` 组合使用。

## en-US

Set `scrollWidth` to scroll horizontally when the content exceeds the container width. Works seamlessly with `virtual`, `group`, and `sticky`.
</docs>

<template>
  <a-listy
    virtual
    :items="items"
    :height="360"
    :scroll-width="1000"
    row-key="id"
    sticky
    :group="groupConfig"
  >
    <template #item="{ item }">
      <a-flex gap="middle" align="center">
        <span style="flex: 0 0 100px">{{ item.name }}</span>
        <span style="flex: 0 0 220px">{{ item.email }}</span>
        <span style="flex: 0 0 480px">{{ item.address }}</span>
        <a-tag :color="item.status === 'Active' ? 'green' : 'default'">{{ item.status }}</a-tag>
      </a-flex>
    </template>
  </a-listy>
</template>

<script lang="ts" setup>
interface Item {
  id: number;
  name: string;
  email: string;
  address: string;
  status: 'Active' | 'Inactive';
}

const items: Item[] = Array.from({ length: 1000 }, (_, index) => ({
  id: index,
  name: `User ${index}`,
  email: `user.${index}@antdv.com`,
  address: `No. ${index} Zhongshan Road, Xihu District, Hangzhou, Zhejiang`,
  status: index % 2 ? 'Active' : 'Inactive',
}));

const groupConfig = {
  key: (item: Item) => Math.floor(item.id / 50),
  title: (groupKey: number) => `User ${groupKey * 50} - ${groupKey * 50 + 49}`,
};
</script>
