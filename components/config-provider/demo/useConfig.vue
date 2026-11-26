<docs>
---
order: 8
version: 4.3.0
debug: true
title:
  zh-CN: 获取配置
  en-US: useConfig
---

## zh-CN

获取父级 `Provider` 的值，如 `DisabledContext`、`SizeContext`。

## en-US

Get the value of the parent `Provider`, such as `DisabledContext`, `SizeContext`.
</docs>

<template>
  <div>
    <a-space wrap>
      <a-radio-group v-model:value="componentSize">
        <a-radio-button value="small">Small</a-radio-button>
        <a-radio-button value="middle">Middle</a-radio-button>
        <a-radio-button value="large">Large</a-radio-button>
      </a-radio-group>
      <a-checkbox v-model:checked="disabled">Form disabled</a-checkbox>
    </a-space>
    <a-divider />
    <a-config-provider :component-size="componentSize">
      <div class="example">
        <a-form :disabled="disabled">
          <ConfigDisplay />
        </a-form>
      </div>
    </a-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, h, ref } from 'vue';
import { ConfigProvider, Form, Input } from '@hiltonkohler21/ant-design-vue';
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

type SizeType = ConfigProviderProps['componentSize'];

const componentSize = ref<SizeType>('small');
const disabled = ref<boolean>(true);

const ConfigDisplay = defineComponent({
  name: 'ConfigDisplay',
  setup() {
    const { componentDisabled, componentSize: sizeRef } = ConfigProvider.useConfig();

    return () => [
      h(Form.Item, { label: 'componentSize value' }, () =>
        h(Input, { value: sizeRef.value ?? '' }),
      ),
      h(Form.Item, { label: 'componentDisabled value' }, () =>
        h(Input, {
          value: String(componentDisabled.value),
          disabled: componentDisabled.value,
        }),
      ),
    ];
  },
});
</script>
