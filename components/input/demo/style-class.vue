<docs>
---
order: 17
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Input 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Input by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="large" class="input-style-class-demo">
    <a-input :class-names="inputClassNames" placeholder="Object" name="input-object" />
    <a-input
      :class-names="inputClassNames"
      :styles="stylesFn"
      placeholder="Function"
      size="middle"
      name="input-fn"
    />
    <a-textarea
      v-model:value="textareaVal"
      :class-names="inputClassNames"
      :styles="stylesFnTextArea"
      show-count
      name="textarea-fn"
    />
    <a-input-password
      v-model:value="passwordVal"
      :class-names="inputClassNames"
      :styles="stylesFnPassword"
      size="middle"
      name="password-fn"
    />
    <a-input-otp
      :class-names="inputClassNames"
      :styles="stylesFnOTP"
      size="middle"
      :length="6"
      separator="*"
    />
    <a-input-search
      :class-names="inputClassNames"
      :styles="stylesFnSearch"
      size="large"
      placeholder="Search"
      name="search-fn"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Input } from 'ant-design-vue';
import type { InputProps, TextAreaProps } from 'ant-design-vue';

const AInputOtp = Input.OTP;
const textareaVal = ref('TextArea');
const passwordVal = ref('Password');

const inputClassNames = {
  root: 'custom-input-root',
};

const stylesFn: InputProps['styles'] = info => {
  if (info.props.size === 'middle') {
    return {
      root: {
        borderColor: '#696FC7',
      },
    };
  }
  return {};
};

const stylesFnTextArea: TextAreaProps['styles'] = info => {
  if (info.props.showCount) {
    return {
      root: { borderColor: '#BDE3C3' },
      textarea: { resize: 'none' },
      count: { color: '#BDE3C3' },
    };
  }
  return {};
};

const stylesFnPassword: InputProps['styles'] = info => {
  if (info.props.size === 'middle') {
    return {
      root: {
        borderColor: '#F5D3C4',
      },
    };
  }
  return {};
};

const stylesFnOTP = (info: { props: Record<string, any> }) => {
  if (info.props.size === 'middle') {
    return {
      root: {
        borderWidth: '0px',
      },
      input: {
        borderColor: '#6E8CFB',
        width: '32px',
      },
    };
  }
  return {};
};

const stylesFnSearch = (info: { props: Record<string, any> }) => {
  if (info.props.size === 'large') {
    return {
      root: { color: '#4DA8DA', borderWidth: '0px' },
      input: { color: '#4DA8DA', borderColor: '#4DA8DA' },
      prefix: { color: '#4DA8DA' },
      suffix: { color: '#4DA8DA' },
      count: { color: '#4DA8DA' },
      button: {
        root: { color: '#4DA8DA', borderColor: '#4DA8DA' },
        icon: { color: '#4DA8DA' },
      },
    };
  }
  return {};
};
</script>

<style scoped>
.input-style-class-demo :deep(.custom-input-root) {
  border-width: var(--ant-line-width, 1px);
  border-radius: var(--ant-border-radius, 6px);
  transition: box-shadow var(--ant-motion-duration-mid, 0.2s);
}

.input-style-class-demo :deep(.custom-input-root:hover) {
  border-color: #d9d9d9;
}
</style>
