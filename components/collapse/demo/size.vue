<docs>
---
order: 1
title:
  zh-CN: 面板尺寸
  en-US: Size
---

## zh-CN

折叠面板有大、中、小三种尺寸。

通过设置 `size` 为 `large` `small` 分别把折叠面板设为大、小尺寸。若不设置 `size`，则尺寸默认为中。

## en-US

Ant Design supports a default collapse size as well as a large and small size.

If a large or small collapse is desired, set the `size` property to either `large` or `small` respectively. Omit the `size` property for a collapse with the default `middle` size.
</docs>

<template>
  <a-divider title-placement="start">Default Size</a-divider>
  <a-collapse>
    <a-collapse-panel key="1" header="This is default size panel header">
      <p>{{ text }}</p>
    </a-collapse-panel>
  </a-collapse>
  <a-divider title-placement="start">Small Size</a-divider>
  <a-collapse size="small">
    <a-collapse-panel key="1" header="This is small size panel header">
      <p>{{ text }}</p>
    </a-collapse-panel>
  </a-collapse>
  <a-divider title-placement="start">Large Size</a-divider>
  <a-collapse size="large">
    <a-collapse-panel key="1" header="This is large size panel header">
      <p>{{ text }}</p>
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts" setup>
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
</script>
