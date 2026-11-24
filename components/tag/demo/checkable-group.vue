<docs>
---
order: 12
title:
  zh-CN: 可选择标签组
  en-US: CheckableTagGroup
---

## zh-CN

使用 `Tag.CheckableTagGroup`（`<a-checkable-tag-group>`）实现单选或多选标签组。

## en-US

Use `Tag.CheckableTagGroup` (`<a-checkable-tag-group>`) for single or multiple selectable tag groups.

</docs>

<template>
  <a-space direction="vertical" :size="12">
    <div>
      <span style="margin-right: 8px">Single:</span>
      <a-checkable-tag-group v-model:value="singleVal" :options="options" />
    </div>
    <div>
      <span style="margin-right: 8px">Multiple:</span>
      <a-checkable-tag-group v-model:value="multiVal" :options="options" multiple />
    </div>
    <div>
      <span style="margin-right: 8px">Disabled:</span>
      <a-checkable-tag-group :default-value="['Books']" :options="options" multiple disabled />
    </div>
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const options = ['Movies', 'Books', 'Music', 'Sports'];
const singleVal = ref<string | null>('Movies');
const multiVal = ref<string[]>(['Books', 'Music']);
</script>
