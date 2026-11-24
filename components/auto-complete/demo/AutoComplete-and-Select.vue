<docs>
---
order: 15
debug: true
title:
  zh-CN: AutoComplete 和 Select
  en-US: AutoComplete and Select
---

## zh-CN

调试不同尺寸下 `AutoComplete` 与 `Select` 的对齐效果。

## en-US

Debug alignment of `AutoComplete` and `Select` across sizes.
</docs>

<template>
  <a-flex vertical :gap="16">
    <a-flex v-for="size in sizes" :key="size" :gap="8" wrap="wrap">
      <a-select
        value="centered"
        :size="size"
        :style="{ width: '160px', maxWidth: '100%' }"
        :show-search="{ searchValue: 'centered' }"
      />
      <a-auto-complete
        value="centered"
        :size="size"
        :style="{ width: '160px', maxWidth: '100%' }"
      />
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
const sizes = ['small', 'middle', 'large'] as const;
</script>
