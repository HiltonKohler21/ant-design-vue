<docs>
---
order: 7
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Statistic 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Statistic by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <div class="demo-statistic-style-class">
    <a-flex vertical :gap="16">
      <a-statistic
        title="Monthly Active Users"
        :value="93241"
        :class-names="classNames"
        :styles="stylesObject"
        suffix="users"
      >
        <template #prefix>
          <ArrowUpOutlined />
        </template>
      </a-statistic>
      <a-statistic
        title="Yearly Loss"
        :value="-18.7"
        :precision="1"
        :class-names="classNames"
        :styles="stylesFn"
        suffix="%"
      >
        <template #prefix>
          <ArrowUpOutlined />
        </template>
      </a-statistic>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { ArrowUpOutlined } from '@ant-design/icons-vue';
import type { StatisticProps } from '@hiltonkohler21/ant-design-vue';

const classNames: StatisticProps['classNames'] = {
  root: 'demo-statistic-semantic-root',
};

const stylesObject: StatisticProps['styles'] = {
  title: { color: '#1890ff', fontWeight: 600 },
  content: { fontSize: '24px' },
  value: {
    backgroundColor: '#e6f4ff',
    borderRadius: '4px',
    color: '#0958d9',
    paddingInline: '6px',
    userSelect: 'none',
  },
};

const stylesFn: StatisticProps['styles'] = ({ props }) => {
  const numValue = Number(props.value ?? 0);
  const isNegative = Number.isFinite(numValue) && numValue < 0;
  if (isNegative) {
    return {
      title: {
        color: '#ff4d4f',
      },
      content: {
        color: '#ff7875',
      },
      value: {
        backgroundColor: '#fff1f0',
        borderRadius: '4px',
        paddingInline: '6px',
        userSelect: 'none',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.demo-statistic-style-class :deep(.demo-statistic-semantic-root) {
  border: 2px dashed #ccc;
  padding: 16px;
  border-radius: 8px;
}
</style>
