<docs>
---
order: 13
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Slider 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Slider by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="slider-style-class-demo">
    <a-slider
      v-model:value="horizontalValue"
      orientation="horizontal"
      :class-names="horizontalClassNames"
      :styles="stylesObject"
    />
    <a-slider
      v-model:value="verticalValue"
      orientation="vertical"
      reverse
      :class-names="verticalClassNames"
      :styles="stylesFn"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { SliderProps } from '@hiltonkohler21/ant-design-vue';

const horizontalValue = ref(30);
const verticalValue = ref(30);

const horizontalClassNames: SliderProps['classNames'] = {
  root: 'custom-slider-horizontal-root',
};

const verticalClassNames: SliderProps['classNames'] = {
  root: 'custom-slider-vertical-root',
  handle: 'custom-slider-vertical-handle',
};

const stylesObject: SliderProps['styles'] = {
  track: { backgroundImage: 'linear-gradient(90deg, #91caff, #1677ff)' },
  handle: { borderColor: '#1677ff', boxShadow: '0 2px 8px #1677ff' },
};

const stylesFn: SliderProps['styles'] = info => {
  if (info.props.orientation === 'vertical') {
    return {
      root: { height: '240px' },
      track: { backgroundImage: 'linear-gradient(180deg, #722cc0, #722ed1)' },
      handle: { borderColor: '#722ed1', boxShadow: '0 2px 8px #722ed1' },
    };
  }
  return {};
};
</script>

<style scoped>
.slider-style-class-demo :deep(.custom-slider-horizontal-root) {
  width: 300px;
  max-width: 100%;
}

.slider-style-class-demo :deep(.custom-slider-vertical-root) {
  width: 100px;
}

.slider-style-class-demo :deep(.custom-slider-vertical-root:hover .ant-slider-handle::after),
.slider-style-class-demo :deep(.custom-slider-vertical-handle::after),
.slider-style-class-demo :deep(.custom-slider-vertical-handle:hover::after),
.slider-style-class-demo :deep(.custom-slider-vertical-handle:active::after),
.slider-style-class-demo :deep(.custom-slider-vertical-handle:focus::after) {
  box-shadow: 0 0 0 2px #722ed1;
}
</style>
