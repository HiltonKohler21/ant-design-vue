<docs>
---
order: 26
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
  <a-config-provider :theme="themeConfig">
    <a-form
      :model="formState"
      name="component-token"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      style="max-width: 600px"
      autocomplete="off"
    >
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
    </a-form>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

const formState = reactive({
  username: '',
  password: '',
  remember: true,
});

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Form: {
      labelRequiredMarkColor: 'pink',
      labelColor: 'green',
      labelFontSize: 16,
      labelHeight: 34,
      labelColonMarginInlineStart: 4,
      labelColonMarginInlineEnd: 12,
      itemMarginBottom: 18,
      inlineItemMarginBottom: 18,
    } as Record<string, any>,
  },
};
</script>
