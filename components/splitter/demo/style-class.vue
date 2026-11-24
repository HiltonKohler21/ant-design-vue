<docs>
---
order: 9
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom Semantic DOM Styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Splitter 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Splitter by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="large" class="splitter-style-class-demo">
    <a-splitter :style="{ height: '200px' }" :class-names="classNames" :styles="stylesObject">
      <a-splitter-panel>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; color: #000">
            First
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap; color: #000">
            Second
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>
    <a-splitter :style="{ height: '200px' }" :class-names="classNames" :styles="stylesFn">
      <a-splitter-panel>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            First
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel>
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            Second
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>
  </a-flex>
</template>

<script lang="ts" setup>
import type { SplitterProps } from 'ant-design-vue';

const classNames: SplitterProps['classNames'] = {
  root: 'custom-splitter-root',
};

const stylesObject: SplitterProps['styles'] = {
  root: { backgroundColor: '#fffbe6' },
  dragger: { default: { backgroundColor: 'rgba(194, 223, 252, 0.4)' } },
};

const stylesFn: SplitterProps['styles'] = ({ props }) => {
  if (props.orientation === 'horizontal') {
    return {
      root: {
        borderWidth: '2px',
        borderStyle: 'dashed',
        marginBottom: '10px',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.splitter-style-class-demo :deep(.custom-splitter-root) {
  box-shadow: var(
    --ant-box-shadow-secondary,
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  );
}
</style>
