<docs>
---
order: 12
debug: true
title:
  zh-CN: 禁用文字颜色在 Form 中 Debug
  en-US: Disabled text color in Form debug
---

## zh-CN

禁用状态下的文字颜色 Debug：AutoComplete 在禁用的 Form 中以及直接禁用时，输入框文字均应使用禁用色。

## en-US

Disabled text color debug: the input text should use the disabled color both when the AutoComplete sits inside a disabled Form and when it is disabled directly.
</docs>

<template>
  <a-flex vertical :gap="12" :style="{ width: '240px', maxWidth: '100%' }">
    <a-form disabled>
      <a-form-item label="Form disabled" :style="{ marginBottom: '0' }">
        <a-auto-complete value="Disabled Value" :options="options" />
      </a-form-item>
    </a-form>
    <a-auto-complete disabled value="Disabled Value" :options="options" />
  </a-flex>
</template>

<script lang="ts" setup>
const options = [{ value: 'Disabled Value' }];
</script>
