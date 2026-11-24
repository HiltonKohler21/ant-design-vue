<docs>
---
order: 7
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Tour 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Tour by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-flex gap="middle">
      <a-button type="primary" @click="open = true">Begin Tour Object</a-button>
      <a-button type="primary" @click="openFn = true">Begin Tour Function</a-button>
    </a-flex>
    <a-divider />
    <a-tour
      :steps="steps"
      :class-names="classNames"
      :styles="stylesObject"
      :arrow="false"
      :open="open"
      @close="open = false"
    />
    <a-tour
      :steps="fnSteps"
      :class-names="classNames"
      :styles="stylesFunction"
      :arrow="false"
      type="primary"
      :open="openFn"
      @close="openFn = false"
    />
    <a-space>
      <a-button ref="ref1" type="primary">Upload</a-button>
      <a-button ref="ref2">Save</a-button>
      <a-button ref="ref3" type="dashed">Other Actions</a-button>
    </a-space>
  </a-flex>
</template>

<script lang="ts" setup>
import { createVNode, ref } from 'vue';
import type { TourProps } from 'ant-design-vue';

const ref1 = ref(null);
const ref2 = ref(null);
const ref3 = ref(null);

const open = ref<boolean>(false);
const openFn = ref<boolean>(false);

const classNames: TourProps['classNames'] = {
  root: 'tour-style-class-root',
  section: 'tour-style-class-section',
};

const stylesObject: TourProps['styles'] = {
  mask: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  section: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '2px solid #4096ff',
  },
  cover: {
    borderRadius: '12px 12px 0 0',
  },
};

const stylesFunction: TourProps['styles'] = info => {
  if (info.props.type === 'primary') {
    return {
      mask: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      },
      section: {
        backgroundColor: 'rgba(205, 193, 255, 0.8)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      cover: {
        borderRadius: '12px 12px 0 0',
      },
    };
  }
  return {};
};

const btnProps = {
  nextButtonProps: {
    style: {
      border: '1px solid #CDC1FF',
      color: '#CDC1FF',
    },
  },
  prevButtonProps: {
    style: {
      backgroundColor: '#CDC1FF',
      color: '#fff',
    },
  },
};

const steps: TourProps['steps'] = [
  {
    title: 'Upload File',
    description: 'Put your files here.',
    cover: createVNode('img', {
      alt: 'tour.png',
      src: 'https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png',
    }),
    target: () => (ref1.value as any)?.$el || document.body,
  },
  {
    title: 'Save',
    description: 'Save your changes.',
    target: () => (ref2.value as any)?.$el || document.body,
  },
  {
    title: 'Other Actions',
    description: 'Click to see other actions.',
    target: () => (ref3.value as any)?.$el || document.body,
  },
];

const fnSteps: TourProps['steps'] = steps.map(s => ({ ...s, ...btnProps }));
</script>

<style scoped>
:global(.tour-style-class-root) {
  border-radius: 4px;
}
:global(.tour-style-class-section) {
  border-radius: 8px;
}
</style>
