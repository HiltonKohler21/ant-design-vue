<docs>
---
order: 7
title:
  zh-CN: 自定义字符
  en-US: Customize character
---

## zh-CN

可以使用 `(RateProps) => VueNode` 的方式自定义每一个字符。

## en-US

Can customize each character using `(RateProps) => VueNode`.
</docs>

<template>
  <a-flex gap="middle" vertical>
    <a-rate v-model:value="value1" :character="renderNumber" />
    <a-rate v-model:value="value2" :character="renderIcon" />
  </a-flex>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons-vue';

const value1 = ref(2);
const value2 = ref(3);

const customIcons: Record<number, any> = {
  1: FrownOutlined,
  2: FrownOutlined,
  3: MehOutlined,
  4: SmileOutlined,
  5: SmileOutlined,
};

const renderNumber = ({ index = 0 }: { index?: number }) => index + 1;
const renderIcon = ({ index = 0 }: { index?: number }) => h(customIcons[index + 1]);
</script>
