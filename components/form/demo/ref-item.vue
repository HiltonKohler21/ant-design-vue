<docs>
---
order: 43
debug: true
title:
  zh-CN: 引用字段
  en-US: Ref item
---

## zh-CN

调试通过表单实例 `getFieldInstance` 定位并聚焦普通字段和数组嵌套字段。

## en-US

Debug locating and focusing regular and array-nested fields via `getFieldInstance`.
</docs>

<template>
  <a-form ref="formRef" :model="formState" name="ref_item_debug" style="max-width: 600px">
    <a-form-item name="test" label="test">
      <a-input v-model:value="formState.test" />
    </a-form-item>

    <a-form-item
      v-for="(_item, index) in formState.list"
      :key="index"
      :name="['list', index]"
      :label="`list[${index}]`"
    >
      <a-input v-model:value="formState.list[index]" />
    </a-form-item>

    <a-space wrap>
      <a-button html-type="button" @click="focusTest">Focus Form.Item</a-button>
      <a-button html-type="button" @click="focusList">Focus Form.List</a-button>
    </a-space>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance } from '@hiltonkohler21/ant-design-vue';

const formRef = ref<FormInstance>();

const formState = reactive({
  test: '',
  list: ['light'],
});

const focusTest = () => {
  formRef.value?.getFieldInstance('test')?.focus();
};

const focusList = () => {
  formRef.value?.getFieldInstance(['list', 0])?.focus();
};
</script>
