<docs>
---
order: 13
debug: true
title:
  zh-CN: 填充形态自定义输入 Debug
  en-US: Filled custom input debug
---

## zh-CN

填充形态自定义输入组件 Debug。

## en-US

Filled custom input debug.
</docs>

<template>
  <a-flex :gap="24" wrap="wrap">
    <a-form layout="vertical" variant="filled" :style="{ width: '280px', maxWidth: '100%' }">
      <a-form-item label="AutoComplete TextArea">
        <a-auto-complete :options="options">
          <a-textarea placeholder="Custom TextArea" />
        </a-auto-complete>
      </a-form-item>
      <a-form-item label="Input TextArea">
        <a-textarea placeholder="Compare TextArea" />
      </a-form-item>
    </a-form>
  </a-flex>
</template>

<script lang="ts" setup>
const options = [{ value: 'Burnaby' }, { value: 'Seattle' }, { value: 'Los Angeles' }];
</script>
