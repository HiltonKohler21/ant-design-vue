<docs>
---
order: 9
title:
  zh-CN: 非阻塞校验
  en-US: No block rule
---

## zh-CN

`rule` 添加 `warningOnly` 后校验失败时仅展示警告信息，不会阻塞表单提交。

## en-US

Rules with `warningOnly` only display warning messages and will not block form submission.
</docs>

<template>
  <a-form
    :model="formState"
    layout="vertical"
    autocomplete="off"
    style="max-width: 600px"
    @finish="onFinish"
    @finish-failed="onFinishFailed"
  >
    <a-form-item
      name="url"
      label="URL"
      :rules="[{ required: true }, { type: 'url', warningOnly: true }, { type: 'string', min: 6 }]"
    >
      <a-input v-model:value="formState.url" placeholder="input placeholder" />
    </a-form-item>
    <a-form-item>
      <a-space wrap>
        <a-button type="primary" html-type="submit">Submit</a-button>
        <a-button html-type="button" @click="onFill">Fill</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { message } from '@hiltonkohler21/ant-design-vue';

const formState = reactive({
  url: '',
});

const onFinish = () => {
  message.success('Submit success!');
};

const onFinishFailed = () => {
  message.error('Submit failed!');
};

const onFill = () => {
  formState.url = 'https://taobao.com/';
};
</script>
