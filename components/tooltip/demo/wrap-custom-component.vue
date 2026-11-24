<docs>
---
order: 13
title:
  zh-CN: 自定义子组件
  en-US: Wrap custom component
---

## zh-CN

与自定义组件一起使用。

## en-US

Use with a custom component.
</docs>

<template>
  <a-tooltip title="prompt text">
    <ComponentWithEvents />
  </a-tooltip>
</template>

<script lang="ts" setup>
import { defineComponent, h } from 'vue';

const ComponentWithEvents = defineComponent({
  name: 'ComponentWithEvents',
  setup(_, { attrs }) {
    return () =>
      h('span', attrs, 'This text is inside a component with the necessary events exposed.');
  },
});
</script>
