<docs>
---
order: 37
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Form 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Form by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <div class="demo-form-style-class">
    <a-form
      ref="objectFormRef"
      :model="objectFormState"
      name="style-class-object"
      :label-col="{ xs: { span: 24 }, sm: { span: 6 } }"
      :wrapper-col="{ xs: { span: 24 }, sm: { span: 18 } }"
      autocomplete="off"
      :class-names="formClassNames"
      :styles="stylesObject"
      @finish="onFinish"
    >
      <a-form-item
        label="Username"
        name="username"
        extra="Use 4 to 16 characters."
        :rules="[{ required: true, message: 'Please enter username!' }]"
      >
        <a-input v-model:value="objectFormState.username" placeholder="Please enter username" />
      </a-form-item>

      <a-form-item
        label="Email"
        name="email"
        :rules="[{ required: true, message: 'Please enter email!' }]"
      >
        <a-input v-model:value="objectFormState.email" placeholder="Please enter email" />
      </a-form-item>

      <a-form-item :label="null">
        <a-space wrap>
          <a-button type="primary" html-type="submit">Submit</a-button>
          <a-button html-type="button" @click="objectFormRef?.resetFields()">Reset</a-button>
        </a-space>
      </a-form-item>
    </a-form>

    <a-form
      ref="fnFormRef"
      :model="fnFormState"
      name="style-class-function"
      variant="filled"
      :label-col="{ xs: { span: 24 }, sm: { span: 6 } }"
      :wrapper-col="{ xs: { span: 24 }, sm: { span: 18 } }"
      autocomplete="off"
      :class-names="formClassNames"
      :styles="stylesFunction"
      @finish="onFinish"
    >
      <a-form-item
        label="Username"
        name="username"
        extra="Variant-aware functional styles."
        :rules="[{ required: true, message: 'Please enter username!' }]"
      >
        <a-input v-model:value="fnFormState.username" placeholder="Please enter username" />
      </a-form-item>

      <a-form-item
        label="Email"
        name="email"
        :rules="[{ required: true, message: 'Please enter email!' }]"
      >
        <a-input v-model:value="fnFormState.email" placeholder="Please enter email" />
      </a-form-item>

      <a-form-item :label="null">
        <a-space wrap>
          <a-button type="primary" html-type="submit">Submit</a-button>
          <a-button html-type="button" @click="fnFormRef?.resetFields()">Reset</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance, FormProps } from 'ant-design-vue';

const objectFormRef = ref<FormInstance>();
const fnFormRef = ref<FormInstance>();

const objectFormState = reactive({
  username: '',
  email: '',
});

const fnFormState = reactive({
  username: '',
  email: '',
});

const formClassNames: FormProps['classNames'] = {
  root: 'demo-form-semantic-root',
};

const stylesObject: FormProps['styles'] = {
  label: {
    color: 'var(--ant-color-text-heading, inherit)',
    fontWeight: 600,
  },
  content: {
    paddingInlineStart: '12px',
  },
  extra: {
    fontStyle: 'italic',
  },
};

const stylesFunction: FormProps['styles'] = info => {
  if (info.props.variant === 'filled') {
    return {
      root: {
        border: '1px solid #1677ff',
      },
      label: {
        color: '#1677ff',
        fontWeight: 600,
      },
      content: {
        paddingInlineStart: '12px',
      },
    };
  }
  return {};
};

const onFinish = (values: Record<string, any>) => {
  console.log('Success:', values);
};
</script>

<style scoped>
.demo-form-style-class :deep(.demo-form-semantic-root) {
  padding: 16px;
  max-width: 600px;
  width: 100%;
  margin-top: 24px;
  background-color: var(--ant-color-bg-container, transparent);
  border: 1px solid var(--ant-color-border-secondary, rgba(128, 128, 128, 0.25));
  border-radius: var(--ant-border-radius-lg, 8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.demo-form-style-class :deep(.demo-form-semantic-root:first-child) {
  margin-top: 0;
}
</style>
