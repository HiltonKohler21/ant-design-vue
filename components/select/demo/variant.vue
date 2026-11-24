<docs>
---
order: 13
version: 4.3.0
title:
  zh-CN: 形态变体
  en-US: Variants
---

## zh-CN

Select 形态变体，支持 `outlined`、`filled`、`borderless`、`underlined` 四种形态，同时支持通过 `prefix` 属性或插槽配置前缀。

## en-US

Variants of Select (`outlined`, `filled`, `borderless`, `underlined`) and custom `prefix` content.

</docs>

<template>
  <a-flex vertical :gap="12">
    <a-flex :gap="8">
      <a-select placeholder="Outlined" style="flex: 1" :options="options" />
      <a-select
        mode="multiple"
        :default-value="['lucy']"
        placeholder="Outlined"
        style="flex: 1"
        :options="options"
      />
    </a-flex>
    <a-flex :gap="8">
      <a-select placeholder="Filled" variant="filled" style="flex: 1" :options="options" />
      <a-select
        mode="multiple"
        :default-value="['lucy']"
        placeholder="Filled"
        variant="filled"
        style="flex: 1"
        :options="options"
      />
    </a-flex>
    <a-flex :gap="8">
      <a-select placeholder="Borderless" variant="borderless" style="flex: 1" :options="options" />
      <a-select
        mode="multiple"
        :default-value="['lucy']"
        placeholder="Borderless"
        variant="borderless"
        style="flex: 1"
        :options="options"
      />
    </a-flex>
    <a-flex :gap="8">
      <a-select placeholder="Underlined" variant="underlined" style="flex: 1" :options="options" />
      <a-select
        mode="multiple"
        :default-value="['lucy']"
        placeholder="Underlined"
        variant="underlined"
        style="flex: 1"
        :options="options"
      />
    </a-flex>
    <a-flex :gap="8">
      <a-select :default-value="'lucy'" prefix="User" style="flex: 1" :options="options" />
      <a-select :default-value="'jack'" variant="filled" style="flex: 1" :options="options">
        <template #prefix>
          <SmileOutlined />
        </template>
      </a-select>
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import { SmileOutlined } from '@ant-design/icons-vue';

const options = [
  { value: 'jack', label: 'Jack' },
  { value: 'lucy', label: 'Lucy' },
  { value: 'yiminghe', label: 'yiminghe' },
];
</script>
