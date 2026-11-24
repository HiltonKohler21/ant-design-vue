<docs>
---
order: 3
title:
  zh-CN: 可选择标签
  en-US: Checkable
---

## zh-CN

可通过 `CheckableTag` 实现类似 Checkbox 的效果，点击切换选中效果。而 `CheckableTagGroup` 则提供了类似 `CheckboxGroup` 或 `RadioGroup` 的功能。

> `CheckableTag` 为完全受控组件，不支持非受控用法。

## en-US

`CheckableTag` works like Checkbox, click it to toggle checked state. `CheckableTagGroup` provides function that is similar to `CheckboxGroup` or `RadioGroup`.

> `CheckableTag` is absolute controlled component and has no uncontrolled mode.

</docs>

<template>
  <a-form :label-col="{ span: 6 }">
    <a-form-item label="Checkable">
      <a-checkable-tag v-model:checked="checked">Yes</a-checkable-tag>
    </a-form-item>
    <a-form-item label="Single">
      <a-checkable-tag-group v-model:value="singleSelected" :options="tagsData" />
    </a-form-item>
    <a-form-item label="Multiple">
      <a-checkable-tag-group v-model:value="multipleSelected" :options="tagsData" multiple />
    </a-form-item>
    <a-form-item label="Disabled">
      <a-checkable-tag-group :default-value="['Books']" :options="tagsData" multiple disabled />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const tagsData = ['Movies', 'Books', 'Music', 'Sports'];
const checked = ref(true);
const singleSelected = ref<string | null>('Books');
const multipleSelected = ref<string[]>(['Movies', 'Music']);
</script>
