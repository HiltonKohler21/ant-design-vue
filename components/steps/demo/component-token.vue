<docs>
---
order: 14
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

Component Token Debug.

## en-US

Component Token Debug.
</docs>

<template>
  <a-config-provider :theme="theme">
    <a-flex vertical gap="middle">
      <a-steps :current="1" :items="basicItems" />
      <a-steps size="small" :current="1" :items="basicItems" />
      <a-steps :items="iconItems" />
      <a-steps progress-dot :current="1" :items="dotItems" />
      <a-steps type="navigation" :current="1" :items="navItems" />
    </a-flex>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import type { ConfigProviderProps, StepsProps } from 'ant-design-vue';

const content = 'This is a content.';

const theme: ConfigProviderProps['theme'] = {
  components: {
    Steps: {
      titleLineHeight: 20,
      customIconSize: 40,
      customIconTop: 0,
      customIconFontSize: 32,
      iconSize: 20,
      iconTop: 0,
      iconFontSize: 12,
      iconSizeSM: 16,
      dotSize: 20,
      dotCurrentSize: 24,
      navArrowColor: '#163CFF',
      navContentMaxWidth: 100,
      descriptionMaxWidth: 100,
    } as Record<string, any>,
  },
};

const basicItems: StepsProps['items'] = [
  {
    title: 'Finished',
    content,
  },
  {
    title: 'In Progress',
    content,
    subTitle: 'Left 00:00:08',
  },
  {
    title: 'Waiting',
    content,
  },
];

const iconItems: StepsProps['items'] = [
  {
    title: 'Login',
    status: 'finish',
    icon: h(UserOutlined),
  },
  {
    title: 'Verification',
    status: 'finish',
    icon: h(SolutionOutlined),
  },
  {
    title: 'Pay',
    status: 'process',
    icon: h(LoadingOutlined),
  },
  {
    title: 'Done',
    status: 'wait',
    icon: h(SmileOutlined),
  },
];

const dotItems: StepsProps['items'] = [
  {
    title: 'Finished',
    content: 'This is a content.',
  },
  {
    title: 'In Progress',
    content: 'This is a content.',
  },
  {
    title: 'Waiting',
    content: 'This is a content.',
  },
];

const navItems: StepsProps['items'] = [
  {
    title: 'Step 1',
    subTitle: '00:00:05',
    status: 'finish',
    content: 'This is a content.',
  },
  {
    title: 'Step 2',
    subTitle: '00:01:02',
    status: 'process',
    content: 'This is a content.',
  },
  {
    title: 'Step 3',
    subTitle: 'waiting for longlong time',
    status: 'wait',
    content: 'This is a content.',
  },
];
</script>
