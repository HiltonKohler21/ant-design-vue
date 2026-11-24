<docs>
---
order: 5
version: 4.3.0
title:
  zh-CN: 自定义操作按钮
  en-US: Custom action
---

## zh-CN

自定义操作按钮。

## en-US

Custom action.
</docs>

<template>
  <a-button type="primary" @click="handleOpen(true)">Begin Tour</a-button>
  <a-divider />
  <a-space>
    <a-button ref="ref1">Upload</a-button>
    <a-button ref="ref2" type="primary">Save</a-button>
    <a-button ref="ref3"><EllipsisOutlined /></a-button>
  </a-space>

  <a-tour :open="open" :steps="steps" :actions-render="actionsRender" @close="handleOpen(false)" />
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';
import type { TourProps } from 'ant-design-vue';

const open = ref<boolean>(false);

const ref1 = ref(null);
const ref2 = ref(null);
const ref3 = ref(null);

const handleOpen = (val: boolean): void => {
  open.value = val;
};

const steps: TourProps['steps'] = [
  {
    title: 'Upload File',
    description: 'Put your files here.',
    target: () => ref1.value && (ref1.value as any).$el,
  },
  {
    title: 'Save',
    description: 'Save your changes.',
    target: () => ref2.value && (ref2.value as any).$el,
  },
  {
    title: 'Other Actions',
    description: 'Click to see other actions.',
    target: () => ref3.value && (ref3.value as any).$el,
  },
];

const actionsRender: TourProps['actionsRender'] = (originNode, { current, total }) => {
  return [
    current !== total - 1
      ? h(
          Button,
          {
            size: 'small',
            onClick: () => {
              handleOpen(false);
            },
          },
          () => 'Skip',
        )
      : null,
    originNode,
  ];
};
</script>
