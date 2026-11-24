<docs>
---
order: 12
debug: true
title:
  zh-CN: 禁用子元素
  en-US: Disabled children
---

## zh-CN

Disabled 子元素。

## en-US

Disabled wrapper.
</docs>

<template>
  <a-space wrap>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-button disabled>Disabled</a-button>
    </a-tooltip>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-input disabled placeholder="disabled" />
    </a-tooltip>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-input-number disabled />
    </a-tooltip>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-checkbox disabled />
    </a-tooltip>
    <a-tooltip title="Thanks for using antd. Have a nice day !">
      <a-select disabled :style="{ width: '120px' }" />
    </a-tooltip>
  </a-space>
</template>
