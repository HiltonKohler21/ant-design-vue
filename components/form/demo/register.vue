<docs>
---
order: 26
title:
  zh-CN: 注册新用户
  en-US: Registration
---

## zh-CN

用户填写必须的信息以注册新用户。

## en-US

Fill in this form to create a new account for you.
</docs>

<template>
  <a-form
    :model="formState"
    v-bind="formItemLayout"
    name="register"
    style="max-width: 600px"
    scroll-to-first-error
    @finish="onFinish"
  >
    <a-form-item
      name="email"
      label="E-mail"
      :rules="[
        { type: 'email', message: 'The input is not valid E-mail!' },
        { required: true, message: 'Please input your E-mail!' },
      ]"
    >
      <a-input v-model:value="formState.email" />
    </a-form-item>

    <a-form-item
      name="password"
      label="Password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
      has-feedback
    >
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item
      name="confirm"
      label="Confirm Password"
      :dependencies="['password']"
      has-feedback
      :rules="[
        { required: true, message: 'Please confirm your password!' },
        { validator: validateConfirmPassword },
      ]"
    >
      <a-input-password v-model:value="formState.confirm" />
    </a-form-item>

    <a-form-item
      name="nickname"
      label="Nickname"
      tooltip="What do you want others to call you?"
      :rules="[{ required: true, message: 'Please input your nickname!', whitespace: true }]"
    >
      <a-input v-model:value="formState.nickname" />
    </a-form-item>

    <a-form-item
      name="residence"
      label="Habitual Residence"
      :rules="[
        { type: 'array', required: true, message: 'Please select your habitual residence!' },
      ]"
    >
      <a-cascader v-model:value="formState.residence" :options="residences" />
    </a-form-item>

    <a-form-item
      name="phone"
      label="Phone Number"
      :rules="[{ required: true, validator: validatePhone }]"
    >
      <a-space-compact block>
        <a-form-item-rest>
          <a-select
            v-model:value="formState.prefix"
            style="width: 70px"
            :options="[
              { label: '+86', value: '86' },
              { label: '+87', value: '87' },
            ]"
          />
        </a-form-item-rest>
        <a-input v-model:value="formState.phone" style="width: 100%" />
      </a-space-compact>
    </a-form-item>

    <a-form-item
      name="donation"
      label="Donation"
      :rules="[{ required: true, message: 'Please input donation amount!' }]"
    >
      <a-space-compact block>
        <a-input-number v-model:value="formState.donation" style="width: 100%" />
        <a-form-item-rest>
          <a-select
            v-model:value="formState.currency"
            style="width: 70px"
            :options="[
              { label: '$', value: 'USD' },
              { label: '¥', value: 'CNY' },
            ]"
          />
        </a-form-item-rest>
      </a-space-compact>
    </a-form-item>

    <a-form-item
      name="website"
      label="Website"
      :rules="[{ required: true, message: 'Please input website!' }]"
    >
      <a-auto-complete
        v-model:value="formState.website"
        :options="websiteOptions"
        placeholder="website"
        @search="onWebsiteSearch"
      >
        <a-input />
      </a-auto-complete>
    </a-form-item>

    <a-form-item
      name="intro"
      label="Intro"
      :rules="[{ required: true, message: 'Please input Intro' }]"
    >
      <a-textarea v-model:value="formState.intro" show-count :maxlength="100" />
    </a-form-item>

    <a-form-item
      name="gender"
      label="Gender"
      :rules="[{ required: true, message: 'Please select gender!' }]"
    >
      <a-select
        v-model:value="formState.gender"
        placeholder="select your gender"
        :options="[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ]"
      />
    </a-form-item>

    <a-form-item label="Captcha" extra="We must make sure that you are a human.">
      <a-row :gutter="8">
        <a-col :span="12">
          <a-form-item
            name="captcha"
            no-style
            :rules="[{ required: true, message: 'Please input the captcha you got!' }]"
          >
            <a-input v-model:value="formState.captcha" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-button>Get captcha</a-button>
        </a-col>
      </a-row>
    </a-form-item>

    <a-form-item
      name="agreement"
      :rules="[{ validator: validateAgreement }]"
      v-bind="tailFormItemLayout"
    >
      <a-checkbox v-model:checked="formState.agreement">
        I have read the
        <a href="javascript:void(0)">agreement</a>
      </a-checkbox>
    </a-form-item>

    <a-form-item v-bind="tailFormItemLayout">
      <a-button type="primary" html-type="submit">Register</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import type { CascaderProps } from 'ant-design-vue';

const residences: CascaderProps['options'] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{ value: 'xihu', label: 'West Lake' }],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [{ value: 'zhonghuamen', label: 'Zhong Hua Men' }],
      },
    ],
  },
];

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
  },
};

const formState = reactive({
  email: '',
  password: '',
  confirm: '',
  nickname: '',
  residence: ['zhejiang', 'hangzhou', 'xihu'],
  prefix: '86',
  phone: '',
  donation: undefined as number | undefined,
  currency: 'USD',
  website: '',
  intro: '',
  gender: 'male',
  captcha: '',
  agreement: false,
});

const autoCompleteResult = ref<string[]>([]);

const onWebsiteSearch = (value: string) => {
  autoCompleteResult.value = value
    ? ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
    : [];
};

const websiteOptions = computed(() =>
  autoCompleteResult.value.map(website => ({ label: website, value: website })),
);

const validateConfirmPassword = (_: any, value: string) => {
  if (!value || formState.password === value) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('The new password that you entered do not match!'));
};

const validatePhone = (_: any, value: string) => {
  if (value) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('Please input your phone number!'));
};

const validateAgreement = (_: any, value: boolean) => {
  if (value) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('Should accept agreement'));
};

const onFinish = (values: any) => {
  console.log('Received values of form: ', values);
};
</script>
