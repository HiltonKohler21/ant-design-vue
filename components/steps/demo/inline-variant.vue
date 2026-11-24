<docs>
---
order: 16
version: 4.3.0
title:
  zh-CN: 内联样式组合
  en-US: Inline Style Combination
---

## zh-CN

内联步骤条修改样式，通过 `offset` 进行对齐。

## en-US

Inline step bar modifies the style and aligns through `offset`.
</docs>

<template>
  <a-flex vertical>
    <a-steps type="inline" :current="1" :items="items" />
    <a-steps type="inline" :current="4" :items="items" status="finish" :styles="customStyles" />
    <a-steps type="inline" :current="1" :items="slicedItems" :offset="2" />
  </a-flex>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { theme } from 'ant-design-vue';
import type { StepsProps } from 'ant-design-vue';

const { token } = theme.useToken();

const items: StepsProps['items'] = Array.from({ length: 5 }, (_, index) => ({
  title: `Step ${index + 1}`,
  subTitle: 'Sub Title',
  content: `This is Step ${index + 1}`,
}));

const slicedItems = items.slice(2);

const customStyles = computed<StepsProps['styles']>(() => ({
  itemTitle: {
    color: token.value.colorPrimaryText,
  },
  itemSubtitle: {
    color: token.value.colorPrimaryTextActive,
  },
  itemRail: {
    background: token.value.colorTextDisabled,
  },
}));
</script>
