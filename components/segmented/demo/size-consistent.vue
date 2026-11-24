<docs>
---
order: 14
debug: true
title:
  zh-CN: 统一高度
  en-US: Consistent height
---

## zh-CN

与其他组件保持统一高度。

## en-US

Keep consistent height with other components.
</docs>

<template>
  <a-flex gap="small" vertical>
    <a-space wrap align="center">
      <a-segmented size="large" :options="['Daily', 'Weekly', 'Monthly']" />
      <a-button type="primary" size="large">Button</a-button>
    </a-space>
    <a-space wrap align="center">
      <a-segmented size="medium" :options="['Daily', 'Weekly', 'Monthly']" />
      <a-input placeholder="default size" :style="{ width: '120px' }" />
    </a-space>
    <a-space wrap align="center">
      <a-segmented size="small" :options="['Daily', 'Weekly', 'Monthly']" />
      <a-select
        size="small"
        value="lucy"
        aria-label="select"
        :style="{ width: '120px' }"
        :options="[{ label: 'Lucy', value: 'lucy' }]"
      />
    </a-space>
  </a-flex>
</template>
