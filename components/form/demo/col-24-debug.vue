<docs>
---
order: 42
debug: true
title:
  zh-CN: 测试特殊 col 24 用法
  en-US: Test col 24 usage
---

## zh-CN

调试 `labelCol` / `wrapperCol` 为 24 栅格及响应式 24 栅格与垂直布局混合时的对齐表现。

## en-US

Debug 24-span `labelCol` / `wrapperCol`, responsive 24-span layouts, and vertical form alignment.
</docs>

<template>
  <a-form
    :model="form1"
    name="col-24-debug"
    :label-col="{ span: 24 }"
    :wrapper-col="{ span: 24 }"
    style="max-width: 600px"
    autocomplete="off"
    @finish="onFinish"
    @finish-failed="onFinishFailed"
  >
    <a-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="form1.username" />
    </a-form-item>

    <a-form-item
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password v-model:value="form1.password" />
    </a-form-item>

    <a-form-item name="select" style="box-shadow: 0 0 3px red">
      <template #label>
        <a
          href="https://github.com/ant-design/ant-design/issues/36459"
          target="_blank"
          rel="noopener noreferrer"
        >
          #36459
        </a>
      </template>
      <a-select
        v-model:value="form1.select"
        style="width: 70%"
        mode="multiple"
        :options="selectOptions"
      />
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>

  <a-form
    :model="form2"
    name="responsive-col-24"
    :label-col="{ sm: 24, xl: 24 }"
    :wrapper-col="{ sm: 24, xl: 24 }"
    style="max-width: 600px"
    autocomplete="off"
    @finish="onFinish"
    @finish-failed="onFinishFailed"
  >
    <a-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="form2.username" />
    </a-form-item>

    <a-form-item
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password v-model:value="form2.password" />
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>

  <a-divider />

  <a-form :model="form3" layout="vertical" style="max-width: 600px">
    <a-form-item name="select" style="box-shadow: 0 0 3px red">
      <template #label>
        <a
          href="https://github.com/ant-design/ant-design/issues/36459"
          target="_blank"
          rel="noopener noreferrer"
        >
          #36459
        </a>
      </template>
      <a-select
        v-model:value="form3.select"
        style="width: 70%"
        mode="multiple"
        :options="selectOptions"
      />
    </a-form-item>

    <a-form-item label="col12" name="col12" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
      <a-input v-model:value="form3.col12" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const selectOptions = [
  { label: 'Bamboo', value: 'bamboo' },
  { label: 'Little', value: 'little' },
  { label: 'Light', value: 'light' },
];

const form1 = reactive({
  username: '',
  password: '',
  select: ['bamboo'],
});

const form2 = reactive({
  username: '',
  password: '',
});

const form3 = reactive({
  select: ['bamboo'],
  col12: '',
});

const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>
