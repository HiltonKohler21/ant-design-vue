<docs>
---
order: 8
title:
  zh-CN: 一次性密码框
  en-US: OTP
---

## zh-CN

用于输入一次性验证码（OTP），支持 `formatter` 格式化、`mask` 掩码、自定义 `separator` 分隔符、`status` 状态与 `variant` 变体。

## en-US

One-time password input supporting `formatter`, `mask`, custom `separator`, `status`, and `variant`.
</docs>

<template>
  <a-flex vertical gap="middle" align="flex-start">
    <div>
      <a-typography-title :level="5">Basic (v-model: {{ basicValue || '-' }})</a-typography-title>
      <a-input-otp v-model:value="basicValue" @change="onChange" />
    </div>

    <div>
      <a-typography-title :level="5">With formatter (Uppercase)</a-typography-title>
      <a-input-otp :formatter="str => str.toUpperCase()" @change="onChange" />
    </div>

    <div>
      <a-typography-title :level="5">With custom mask</a-typography-title>
      <a-input-otp mask="🔒" default-value="123456" @change="onChange" />
    </div>

    <div>
      <a-typography-title :level="5">With custom separator</a-typography-title>
      <a-space direction="vertical">
        <a-input-otp separator="/" @change="onChange" />
        <a-input-otp :separator="renderSeparator" @change="onChange" />
      </a-space>
    </div>

    <div>
      <a-typography-title :level="5">With status (error & warning)</a-typography-title>
      <a-space direction="vertical">
        <a-input-otp status="error" default-value="1234" />
        <a-input-otp status="warning" default-value="5678" />
      </a-space>
    </div>

    <div>
      <a-typography-title :level="5">With variant (filled)</a-typography-title>
      <a-input-otp variant="filled" :length="8" @change="onChange" />
    </div>
  </a-flex>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { Input } from 'ant-design-vue';

const AInputOtp = Input.OTP;
const basicValue = ref('');

const onChange = (text: string) => {
  console.log('OTP onChange:', text);
};

const renderSeparator = (index: number) =>
  h('span', { style: { color: index % 2 ? '#ff4d4f' : '#1677ff' } }, '—');
</script>
