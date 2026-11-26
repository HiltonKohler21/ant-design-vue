<docs>
---
order: 4
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象或函数，自定义 `root` 与 `item` 语义区域的样式和类名。

## en-US

Customize `root` and `item` semantic regions by passing static objects or functions to `classNames` and `styles`.

</docs>
<template>
  <a-flex vertical :gap="24">
    <div>
      <a-typography-title :level="5">Object classNames &amp; styles</a-typography-title>
      <a-masonry
        :columns="4"
        :gutter="16"
        :items="items"
        :class-names="staticClassNames"
        :styles="staticStyles"
      >
        <template #item="{ item, index }">
          <a-card size="small" :style="{ height: `${item.data}px` }">Item {{ index + 1 }}</a-card>
        </template>
      </a-masonry>
    </div>
    <a-divider />
    <div>
      <a-typography-title :level="5">Function classNames &amp; styles</a-typography-title>
      <a-masonry
        :columns="3"
        :gutter="12"
        :items="items.slice(0, 6)"
        :class-names="dynamicClassNames"
        :styles="dynamicStyles"
      >
        <template #item="{ item, index }">
          <a-card size="small" :style="{ height: `${item.data}px` }">Item {{ index + 1 }}</a-card>
        </template>
      </a-masonry>
    </div>
  </a-flex>
</template>
<script lang="ts" setup>
import type { MasonryProps } from '@hiltonkohler21/ant-design-vue';

const items = [120, 80, 100, 60, 140, 90, 110, 70].map((height, index) => ({
  key: `item-${index}`,
  height,
  data: height,
}));

const staticClassNames: MasonryProps['classNames'] = {
  root: 'demo-masonry-root',
  item: 'demo-masonry-item',
};

const staticStyles: MasonryProps['styles'] = {
  root: {
    borderRadius: '12px',
    padding: '16px',
    backgroundColor: 'rgba(250, 250, 250, 0.7)',
    border: '1px solid #d9d9d9',
  },
  item: {
    borderRadius: '8px',
    overflow: 'hidden',
  },
};

const dynamicClassNames: MasonryProps['classNames'] = ({ props }) => ({
  root: `demo-masonry-cols-${props.columns}`,
  item: 'demo-masonry-fn-item',
});

const dynamicStyles: MasonryProps['styles'] = ({ props }) => ({
  root: {
    border: `2px solid ${
      typeof props.columns === 'number' && props.columns > 2 ? '#1677ff' : '#52c41a'
    }`,
    borderRadius: '12px',
    padding: '16px',
    backgroundColor: 'rgba(240, 248, 255, 0.6)',
  },
  item: {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    borderRadius: '8px',
  },
});
</script>
