<docs>
---
order: 6.5
version: 4.3.0
title:
  zh-CN: 多种形态
  en-US: Variants
---

## zh-CN

可选 `outlined` `filled` `borderless` `underlined` 四种形态。

## en-US

There are `outlined`, `filled`, `borderless`, and `underlined` variants to choose from.
</docs>

<template>
  <a-flex vertical :gap="12">
    <a-auto-complete
      :options="options"
      :style="{ width: '200px', maxWidth: '100%' }"
      placeholder="Outlined"
      :show-search="{ onSearch }"
      @select="onSelect"
    />
    <a-auto-complete
      :options="options"
      :style="{ width: '200px', maxWidth: '100%' }"
      placeholder="Filled"
      variant="filled"
      :show-search="{ onSearch }"
      @select="onSelect"
    />
    <a-auto-complete
      :options="options"
      :style="{ width: '200px', maxWidth: '100%' }"
      placeholder="Borderless"
      variant="borderless"
      :show-search="{ onSearch }"
      @select="onSelect"
    />
    <a-auto-complete
      :options="options"
      :style="{ width: '200px', maxWidth: '100%' }"
      placeholder="Underlined"
      variant="underlined"
      @search="onSearch"
      @select="onSelect"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { AutoCompleteProps } from 'ant-design-vue';

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

const options = ref<AutoCompleteProps['options']>([]);

const onSearch = (searchText: string) => {
  options.value = !searchText
    ? []
    : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];
};

const onSelect = (value: string) => {
  console.log('onSelect', value);
};
</script>
