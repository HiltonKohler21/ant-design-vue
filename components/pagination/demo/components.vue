<docs>
---
order: 12
version: 4.3.0
title:
  zh-CN: 定制组件
  en-US: Custom component
---

## zh-CN

通过 `components` 替换每页条数切换器。

## en-US

Replace the page size changer with `components`.
</docs>

<template>
  <a-pagination
    show-size-changer
    :components="{ sizeChanger: SizeChanger }"
    :default-current="3"
    :total="500"
  />
</template>

<script lang="ts" setup>
import { defineComponent, h } from 'vue';
import { InputNumber } from 'ant-design-vue';

const SizeChanger = defineComponent({
  name: 'CustomSizeChanger',
  props: {
    value: Number,
    disabled: Boolean,
    className: String,
    onChange: Function,
  },
  setup(props) {
    return () =>
      h(InputNumber, {
        'aria-label': 'Page Size',
        class: props.className,
        disabled: props.disabled,
        min: 1,
        precision: 0,
        style: { width: '100px' },
        value: props.value,
        onChange: (nextValue: number | string | null) => {
          if (nextValue !== null && nextValue !== '') {
            props.onChange?.(Number(nextValue));
          }
        },
      });
  },
});
</script>
