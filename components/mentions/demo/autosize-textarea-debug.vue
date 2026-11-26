<docs>
---
order: 99
debug: true
title:
  zh-CN: debug 自动大小
  en-US: debug autoSize
---

## zh-CN

autoSize debug

## en-US

autoSize debug
</docs>

<template>
  <a-flex vertical :gap="32">
    <a-mentions placeholder="can resize" :options="options" @change="onChange" @select="onSelect" />
    <a-mentions
      placeholder="disable resize"
      :style="{ resize: 'none' }"
      :options="options"
      @change="onChange"
      @select="onSelect"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import type { MentionsOptionProps } from '@hiltonkohler21/ant-design-vue';

const options = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
];

const onChange = (value: string) => {
  console.log('Change:', value);
};

const onSelect = (option: MentionsOptionProps) => {
  console.log('select', option);
};
</script>
