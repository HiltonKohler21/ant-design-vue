<docs>
---
order: 10
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Image 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Image by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex gap="middle" wrap="wrap" class="image-style-class-demo">
    <a-image
      :src="imgSrc"
      :width="160"
      alt="Example image"
      :class-names="imageClassNames"
      :styles="stylesObject"
    />
    <a-image
      :src="imgSrc"
      :width="160"
      alt="Example image"
      :class-names="imageClassNames"
      :styles="stylesFn"
      :preview="{ open: false }"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import type { ImageProps } from 'ant-design-vue';

const imgSrc = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

const imageClassNames: ImageProps['classNames'] = {
  root: 'custom-image-root',
};

const stylesObject: ImageProps['styles'] = {
  image: {
    borderRadius: '4px',
  },
};

const stylesFn: ImageProps['styles'] = info => {
  if (info.props.preview) {
    return {
      root: {
        border: '2px solid #A594F9',
        borderRadius: '8px',
        padding: '4px',
        transition: 'all 0.3s ease',
      },
      image: {
        borderRadius: '4px',
        filter: 'grayscale(50%)',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.image-style-class-demo :deep(.custom-image-root) {
  padding: 4px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
