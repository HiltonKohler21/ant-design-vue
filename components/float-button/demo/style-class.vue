<docs>
---
order: 14
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 FloatButton 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of FloatButton by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <div
    class="float-button-style-class-demo"
    :style="{
      position: 'relative',
      height: '180px',
      padding: '16px',
      border: '1px solid var(--ant-color-border-secondary, rgba(0, 0, 0, 0.06))',
      borderRadius: '8px',
    }"
  >
    <a-float-button-group
      shape="circle"
      :style="{ position: 'absolute', insetInlineEnd: '24px', bottom: '24px' }"
    >
      <a-float-button
        type="primary"
        :class-names="semanticClassNames"
        :styles="stylesFn"
        tooltip="custom style class"
      />
      <a-float-button type="default" :class-names="semanticClassNames" :styles="stylesObject">
        <template #icon>
          <QuestionCircleOutlined />
        </template>
      </a-float-button>
    </a-float-button-group>
  </div>
</template>

<script lang="ts" setup>
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import type { FloatButtonProps } from '@hiltonkohler21/ant-design-vue';

const semanticClassNames: FloatButtonProps['classNames'] = {
  root: 'custom-float-btn-root',
  content: 'custom-float-btn-content',
};

const stylesObject: FloatButtonProps['styles'] = {
  root: {
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
};

const stylesFn: FloatButtonProps['styles'] = info => {
  if (info.props.type === 'primary') {
    return {
      root: {
        backgroundColor: '#171717',
      },
      content: {
        color: '#fff',
      },
      icon: {
        color: '#fff',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.float-button-style-class-demo :deep(.custom-float-btn-root) {
  border: 1px solid var(--ant-color-border, #d9d9d9);
}
.float-button-style-class-demo :deep(.custom-float-btn-content) {
  color: var(--ant-color-text, rgba(0, 0, 0, 0.88));
}
</style>
