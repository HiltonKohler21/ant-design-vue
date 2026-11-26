<docs>
---
order: 17
debug: true
title:
  zh-CN: 变体 Debug
  en-US: Variant Debug
---

## zh-CN

包含步骤点的进度条与不同变体的组合调试。

## en-US

Steps with progress dot style and variant combinations.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-steps v-bind="sharedProps" variant="filled" @change="onChange" />
    <a-steps v-bind="sharedProps" @change="onChange" />
    <a-steps v-bind="sharedProps" size="small" @change="onChange" />
    <a-steps v-bind="sharedPercentProps" size="small" @change="onChange" />
    <a-flex gap="middle" wrap="wrap">
      <a-steps v-bind="sharedPercentProps" orientation="vertical" @change="onChange" />
      <a-steps v-bind="sharedPercentProps" size="small" orientation="vertical" @change="onChange" />
    </a-flex>
    <a-flex gap="middle" wrap="wrap">
      <a-steps v-bind="sharedProps" orientation="vertical" @change="onChange" />
      <a-steps v-bind="sharedProps" orientation="vertical" size="small" @change="onChange" />
    </a-flex>
    <a-steps v-bind="sharedProps" type="dot" size="small" @change="onChange" />
    <a-flex gap="middle" wrap="wrap">
      <a-steps
        v-bind="sharedProps"
        type="dot"
        size="small"
        orientation="vertical"
        @change="onChange"
      />
      <a-steps
        v-bind="sharedProps"
        type="navigation"
        size="small"
        orientation="vertical"
        @change="onChange"
      />
    </a-flex>
    <a-divider />
    <a-config-provider :theme="themeConfig">
      <a-flex vertical gap="middle">
        <a-steps v-bind="sharedProps" type="dot" @change="onChange" />
        <a-steps v-bind="sharedProps" title-placement="vertical" @change="onChange" />
        <a-steps v-bind="sharedProps" title-placement="vertical" size="small" @change="onChange" />
      </a-flex>
    </a-config-provider>
  </a-flex>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { ConfigProviderProps, StepsProps } from '@hiltonkohler21/ant-design-vue';

const current = ref(1);

const onChange = (value: number) => {
  current.value = value;
};

const items: StepsProps['items'] = [
  {
    title: 'Finished',
    content: 'This is a content.',
  },
  {
    title: 'In Progress',
    content: 'This is a content.',
    status: 'error',
  },
  {
    title: 'Waiting',
    content: 'This is a content.',
  },
];

const percentItems: StepsProps['items'] = items.map(({ status: _status, ...item }) => item);

const sharedProps = computed<StepsProps>(() => ({
  current: current.value,
  variant: 'outlined',
  items,
}));

const sharedPercentProps = computed<StepsProps>(() => ({
  current: current.value,
  variant: 'outlined',
  items: percentItems,
  percent: 60,
}));

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Steps: {
      descriptionMaxWidth: 140,
      customIconSize: 22,
    } as Record<string, any>,
  },
};
</script>
