<docs>
---
order: 8
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Calendar 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Calendar by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <div class="demo-calendar-style-class">
    <a-flex vertical :gap="16">
      <a-calendar :fullscreen="false" :class-names="classNames" :styles="stylesObject" />
      <a-calendar :class-names="classNames" :styles="stylesFunction" />
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import type { Dayjs } from 'dayjs';
import type { CalendarProps } from 'ant-design-vue';

const classNames: CalendarProps<Dayjs>['classNames'] = {
  root: 'demo-calendar-semantic-root',
};

const stylesObject: CalendarProps<Dayjs>['styles'] = {
  root: {
    borderRadius: '8px',
    width: '600px',
    maxWidth: '100%',
  },
};

const stylesFunction: CalendarProps<Dayjs>['styles'] = info => {
  if (info.props.fullscreen) {
    return {
      root: {
        border: '2px solid #BDE3C3',
        borderRadius: '10px',
        backgroundColor: 'rgba(189, 227, 195, 0.3)',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.demo-calendar-style-class {
  max-width: 100%;
  overflow-x: auto;
}

.demo-calendar-style-class :deep(.demo-calendar-semantic-root) {
  padding: 10px;
  background-color: rgba(22, 119, 255, 0.08);
}
</style>
