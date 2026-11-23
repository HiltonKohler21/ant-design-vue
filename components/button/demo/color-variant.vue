<docs>
---
order: 1
title:
  zh-CN: 颜色与变体
  en-US: Color & Variant
---

## zh-CN

同时设置 `color` 和 `variant` 属性，可以衍生出更多的变体按钮。支持 `default`、`primary`、`danger` 及 13 种预设色。

## en-US

Combine `color` and `variant` props to create rich button variations across `default`, `primary`, `danger`, and 13 preset colors.
</docs>

<template>
  <a-flex vertical gap="small">
    <a-flex v-for="color in colors" :key="color" gap="small" wrap="wrap">
      <a-button v-for="variant in variants" :key="variant" :color="color" :variant="variant">
        {{ variantLabels[variant] }}
      </a-button>
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import type { ButtonProps } from 'ant-design-vue';

const colors: NonNullable<ButtonProps['color']>[] = [
  'default',
  'primary',
  'danger',
  'pink',
  'purple',
  'cyan',
  'green',
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
