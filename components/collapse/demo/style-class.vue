<docs>
---
order: 8
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Collapse 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Collapse by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="collapse-style-class-demo">
    <a-collapse
      v-model:active-key="activeKey1"
      :class-names="collapseClassNames"
      :styles="stylesObject"
    >
      <a-collapse-panel key="1" header="This is panel header 1">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="This is panel header 2">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="This is panel header 3">
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>

    <a-collapse
      v-model:active-key="activeKey2"
      size="large"
      :class-names="collapseClassNames"
      :styles="stylesFn"
    >
      <a-collapse-panel key="1" header="This is panel header 1">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="This is panel header 2">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="This is panel header 3">
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CollapseProps } from 'ant-design-vue';

const activeKey1 = ref(['1']);
const activeKey2 = ref(['2']);

const text =
  'A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.';

const collapseClassNames: CollapseProps['classNames'] = {
  root: 'custom-collapse-root',
};

const stylesObject: CollapseProps['styles'] = {
  root: {
    backgroundColor: '#fafafa',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
  },
  header: {
    backgroundColor: '#f0f0f0',
    padding: '12px 16px',
    color: '#141414',
  },
};

const stylesFn: CollapseProps['styles'] = ({ props }) => {
  if (props.size === 'large') {
    return {
      root: {
        backgroundColor: '#fff',
        border: '1px solid #696FC7',
        borderRadius: '8px',
      },
      header: {
        backgroundColor: '#F5EFFF',
        padding: '12px 16px',
        color: '#141414',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.collapse-style-class-demo :deep(.custom-collapse-root) {
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
