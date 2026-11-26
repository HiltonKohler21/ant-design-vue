<docs>
---
order: 9
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Descriptions 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Descriptions by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <div class="demo-descriptions-style-class">
    <a-flex vertical :gap="16">
      <a-descriptions
        title="User Info"
        :items="items"
        bordered
        :class-names="classNames"
        :styles="stylesObject"
        size="small"
      />
      <a-descriptions
        title="User Info"
        :items="items"
        bordered
        :class-names="classNames"
        :styles="stylesFn"
        size="large"
      />
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import type { DescriptionsProps } from '@hiltonkohler21/ant-design-vue';

const classNames: DescriptionsProps['classNames'] = {
  root: 'demo-descriptions-semantic-root',
};

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Product',
    children: 'Cloud Database',
  },
  {
    key: '2',
    label: 'Billing Mode',
    children: 'Prepaid',
  },
  {
    key: '3',
    label: 'Automatic Renewal',
    children: 'YES',
  },
];

const stylesObject: DescriptionsProps['styles'] = {
  label: {
    color: '#000',
  },
};

const stylesFn: DescriptionsProps['styles'] = info => {
  if (info.props.size === 'large') {
    return {
      root: {
        borderRadius: '8px',
        border: '1px solid #CDC1FF',
      },
      label: { color: '#A294F9' },
    };
  }
  return {};
};
</script>

<style scoped>
.demo-descriptions-style-class :deep(.demo-descriptions-semantic-root) {
  padding: 10px;
}
</style>
