<docs>
---
order: 7
title:
  zh-CN: 受控
  en-US: Controlled
---

## zh-CN

受控制的页码。

## en-US

Controlled page number.
</docs>

<template>
  <a-pagination :current="current" :total="50" @change="onChange" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { PaginationProps } from '@hiltonkohler21/ant-design-vue';

const current = ref(3);

const onChange: PaginationProps['onChange'] = page => {
  console.log(page);
  current.value = page;
};
</script>
