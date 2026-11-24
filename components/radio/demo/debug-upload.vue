<docs>
---
order: 14
debug: true
title:
  zh-CN: Upload Debug
  en-US: Upload Debug
---

## zh-CN

验证 Radio 与 Checkbox 作为 Upload 子元素时的事件交互。

## en-US

Verify interaction when Radio and Checkbox are nested inside Upload.
</docs>

<template>
  <a-space wrap>
    <a-upload :before-upload="() => false">
      <a-radio>Radio</a-radio>
    </a-upload>
    <a-upload :before-upload="() => false">
      <a-checkbox>Checkbox</a-checkbox>
    </a-upload>
  </a-space>
</template>
