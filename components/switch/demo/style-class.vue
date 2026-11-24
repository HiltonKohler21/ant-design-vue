<docs>
---
order: 6
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Switch 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Switch by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex
    vertical
    align="flex-start"
    justify="flex-start"
    gap="middle"
    class="switch-style-class-demo"
  >
    <a-switch
      v-model:checked="checked1"
      size="small"
      checked-children="on"
      un-checked-children="off"
      :styles="stylesObject"
      :class-names="{ root: 'custom-switch-root' }"
    />
    <a-switch
      v-model:checked="checked2"
      size="medium"
      checked-children="on"
      un-checked-children="off"
      :styles="stylesFn"
      :class-names="{ root: 'custom-switch-root', content: 'custom-switch-content' }"
    />
    <a-switch
      v-model:checked="checked3"
      :class-names="{ root: 'custom-switch-mui-root', indicator: 'custom-switch-mui-indicator' }"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { SwitchProps } from 'ant-design-vue';

const checked1 = ref(false);
const checked2 = ref(false);
const checked3 = ref(true);

const stylesObject: SwitchProps['styles'] = {
  root: {
    backgroundColor: '#F5D2D2',
  },
};

const stylesFn: SwitchProps['styles'] = info => {
  if (info.props.size === 'medium') {
    return {
      root: {
        backgroundColor: '#BDE3C3',
      },
      content: {
        color: '#1f2937',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.switch-style-class-demo :deep(.custom-switch-root) {
  width: 48px;
}

.switch-style-class-demo :deep(.custom-switch-content) {
  font-weight: 600;
}

.switch-style-class-demo :deep(.custom-switch-mui-root) {
  min-width: 32px;
  height: 14px;
  line-height: 14px;
}

.switch-style-class-demo :deep(.custom-switch-mui-root.ant-switch-checked) {
  background-color: rgba(25, 118, 210, 0.5);
}

.switch-style-class-demo :deep(.custom-switch-mui-root.ant-switch-checked .ant-switch-handle) {
  inset-inline-start: calc(100% - 17px);
}

.switch-style-class-demo :deep(.custom-switch-mui-indicator) {
  top: -3px;
  width: 20px;
  height: 20px;
  inset-inline-start: -3px;
}

.switch-style-class-demo :deep(.custom-switch-mui-indicator::before) {
  background-color: rgb(25, 118, 210);
  border-radius: 999px;
  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 1px -1px, rgba(0, 0, 0, 0.14) 0 1px 1px 0,
    rgba(0, 0, 0, 0.12) 0 1px 4px 0;
}
</style>
