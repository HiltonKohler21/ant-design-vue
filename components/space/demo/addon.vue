<docs>
---
order: 9
title:
  zh-CN: 紧凑布局附加标签 Space.Addon
  en-US: Compact Addon (Space.Addon)
---

## zh-CN

配合 `Space.Compact` 使用 `Space.Addon`，可以为输入框、选择器等表单控件提供统一风格的前置/后置标签，支持 `variant`、`status`、`size`、`disabled` 等属性。

## en-US

Use `Space.Addon` inside `Space.Compact` to create styled prefix/suffix cells with `variant`, `status`, `size`, and `disabled` support.

</docs>

<template>
  <a-space orientation="vertical" size="middle" style="width: 100%">
    <a-space-compact>
      <a-space-addon>https://</a-space-addon>
      <a-input default-value="antdv.com" />
      <a-space-addon>.cn</a-space-addon>
    </a-space-compact>
    <a-space-compact>
      <a-space-addon variant="filled">¥</a-space-addon>
      <a-input-number :default-value="100" variant="filled" />
      <a-space-addon variant="filled">RMB</a-space-addon>
    </a-space-compact>
    <a-space-compact size="small">
      <a-space-addon status="error">Error</a-space-addon>
      <a-input status="error" default-value="Invalid value" />
    </a-space-compact>
    <a-space-compact size="large">
      <a-space-addon status="warning">Warning</a-space-addon>
      <a-input status="warning" default-value="Check value" />
      <a-space-addon disabled>Disabled</a-space-addon>
    </a-space-compact>
  </a-space>
</template>
