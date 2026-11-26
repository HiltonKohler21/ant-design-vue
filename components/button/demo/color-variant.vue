<docs>
---
order: 1
version: 4.3.0
title:
  zh-CN: 颜色与变体
  en-US: Color & Variant
---

## zh-CN

同时设置 `color` 和 `variant` 属性，可以衍生出更多的变体按钮。

## en-US

You can set the `color` and `variant` attributes at the same time to derive more variant buttons.
</docs>

<template>
  <a-config-provider :component-size="screens.xxl ? 'middle' : 'small'">
    <a-flex vertical gap="small">
      <a-flex v-for="color in colors" :key="color" gap="small" wrap="wrap">
        <a-button v-for="variant in variants" :key="variant" :color="color" :variant="variant">
          {{ variantLabels[variant] }}
        </a-button>
      </a-flex>
    </a-flex>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { Grid } from '@hiltonkohler21/ant-design-vue';
import type { ButtonProps } from '@hiltonkohler21/ant-design-vue';

const screens = Grid.useBreakpoint();

const colors: NonNullable<ButtonProps['color']>[] = [
  'default',
  'primary',
  'danger',
  'pink',
  'purple',
  'cyan',
];

const variants: NonNullable<ButtonProps['variant']>[] = [
  'solid',
  'outlined',
  'dashed',
  'filled',
  'text',
  'link',
];

const variantLabels: Record<NonNullable<ButtonProps['variant']>, string> = {
  solid: 'Solid',
  outlined: 'Outlined',
  dashed: 'Dashed',
  filled: 'Filled',
  text: 'Text',
  link: 'Link',
};
</script>
