<docs>
---
order: 9
title:
  zh-CN: 前缀/后缀
  en-US: Prefix / Suffix
---

## zh-CN

在输入框上添加前缀或后缀。

## en-US

Add a prefix or suffix inside input.

</docs>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-input-number v-model:value="value1" prefix="￥" style="width: 100%" />
    <a-input-number v-model:value="value2" prefix="￥" suffix="RMB" style="width: 100%" />
    <a-input-number v-model:value="value3" style="width: 100%">
      <template #prefix>
        <UserOutlined />
      </template>
      <template #suffix>RMB</template>
    </a-input-number>
    <a-input-number v-model:value="value4" suffix="RMB" disabled style="width: 100%" />
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';

const value1 = ref<number>(1);
const value2 = ref<number>(2);
const value3 = ref<number>(3);
const value4 = ref<number>(4);
</script>
