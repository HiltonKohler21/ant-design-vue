<docs>
---
order: 10
version: 4.3.0
title:
  zh-CN: 形态变体
  en-US: Variants
---

## zh-CN

TimePicker 形态变体，可选 `outlined`、`filled`、`borderless`、`underlined`。

## en-US

Variants of TimePicker: `outlined`, `filled`, `borderless`, and `underlined`.

</docs>

<template>
  <a-flex vertical :gap="12">
    <a-flex :gap="8" wrap="wrap">
      <a-time-picker placeholder="Outlined" />
      <a-time-range-picker :placeholder="['Outlined Start', 'Outlined End']" />
    </a-flex>
    <a-flex :gap="8" wrap="wrap">
      <a-time-picker variant="filled" placeholder="Filled" />
      <a-time-range-picker variant="filled" :placeholder="['Filled Start', 'Filled End']" />
    </a-flex>
    <a-flex :gap="8" wrap="wrap">
      <a-time-picker variant="borderless" placeholder="Borderless" />
      <a-time-range-picker
        variant="borderless"
        :placeholder="['Borderless Start', 'Borderless End']"
      />
    </a-flex>
    <a-flex :gap="8" wrap="wrap">
      <a-time-picker variant="underlined" placeholder="Underlined" />
      <a-time-range-picker
        variant="underlined"
        :placeholder="['Underlined Start', 'Underlined End']"
      />
    </a-flex>
  </a-flex>
</template>
