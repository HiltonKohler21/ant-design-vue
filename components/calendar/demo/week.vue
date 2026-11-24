<docs>
---
order: 6
version: 4.3.0
title:
  zh-CN: 周数
  en-US: Show Week
---

## zh-CN

通过将 `showWeek` 属性设置为 `true`，在日历中显示周数。

## en-US

Show week number in calendar by setting `showWeek` prop to `true`.
</docs>

<template>
  <div :style="{ maxWidth: '100%', overflowX: 'auto' }">
    <a-calendar :fullscreen="true" show-week />
    <br />
    <div
      :style="{
        width: '320px',
        maxWidth: '100%',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
      }"
    >
      <a-calendar :fullscreen="false" show-week />
    </div>
  </div>
</template>
