<docs>
---
order: 20
title:
  zh-CN: 复杂一点的控件
  en-US: Complex form control
---

## zh-CN

演示在一个 `Form.Item` 中组合多个子控件、紧凑组合与内联表单项的布局与校验方式。

## en-US

Demonstrate combining multiple controls, compact inputs, and inline nested `Form.Item`s inside a single field row.
</docs>

<template>
  <a-form
    :model="formState"
    name="complex-form"
    :label-col="{ xs: { span: 24 }, sm: { span: 8 } }"
    :wrapper-col="{ xs: { span: 24 }, sm: { span: 16 } }"
    style="max-width: 600px"
    @finish="onFinish"
  >
    <a-form-item label="Username" html-for="complex_username">
      <a-space wrap>
        <a-form-item
          name="username"
          no-style
          :rules="[{ required: true, message: 'Username is required' }]"
        >
          <a-input
            id="complex_username"
            v-model:value="formState.username"
            style="width: 160px; max-width: 100%"
            placeholder="Please input"
          />
        </a-form-item>
        <a-tooltip title="Useful information">
          <a-typography-link href="#API">Need Help?</a-typography-link>
        </a-tooltip>
      </a-space>
    </a-form-item>

    <a-form-item label="Address">
      <a-space-compact block>
        <a-form-item
          :name="['address', 'province']"
          no-style
          :rules="[{ required: true, message: 'Province is required' }]"
        >
          <a-select
            v-model:value="formState.address.province"
            placeholder="Select province"
            style="width: 50%"
            :options="[
              { label: 'Zhejiang', value: 'Zhejiang' },
              { label: 'Jiangsu', value: 'Jiangsu' },
            ]"
          />
        </a-form-item>
        <a-form-item
          :name="['address', 'street']"
          no-style
          :rules="[{ required: true, message: 'Street is required' }]"
        >
          <a-input
            v-model:value="formState.address.street"
            style="width: 50%"
            placeholder="Input street"
          />
        </a-form-item>
      </a-space-compact>
    </a-form-item>

    <a-form-item label="BirthDate" style="margin-bottom: 0px">
      <a-form-item
        name="year"
        :rules="[{ required: true }]"
        style="display: inline-block; width: calc(50% - 8px)"
      >
        <a-input v-model:value="formState.year" placeholder="Input birth year" />
      </a-form-item>
      <a-form-item
        name="month"
        :rules="[{ required: true }]"
        style="display: inline-block; width: calc(50% - 8px); margin: 0 8px"
      >
        <a-input v-model:value="formState.month" placeholder="Input birth month" />
      </a-form-item>
    </a-form-item>

    <a-form-item :label="null">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const formState = reactive({
  username: '',
  address: {
    province: undefined as string | undefined,
    street: '',
  },
  year: '',
  month: '',
});

const onFinish = (values: any) => {
  console.log('Received values of form: ', values);
};
</script>
