<docs>
---
order: 8.5
version: 4.3.0
title:
  zh-CN: 自定义分词
  en-US: Custom tokenization
---

## zh-CN

自定义分词函数，按业务规则拆分输入内容。

## en-US

Customize tokenization logic to split input with your own rules.
</docs>

<template>
  <a-select
    v-model:value="value"
    mode="tags"
    style="width: 100%"
    :token-separators="tokenize"
    placeholder='Try paste: "San Francisco, CA", New York'
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref<string[]>([]);

const tokenize = (input: string): string[] => {
  const tokens: string[] = [];
  const regex = /"([^"]*)"|([^,\n]+)/g;
  let match: RegExpExecArray | null = regex.exec(input);
  while (match) {
    tokens.push((match[1] ?? match[2]).trim());
    match = regex.exec(input);
  }
  return tokens.filter(Boolean);
};
</script>
