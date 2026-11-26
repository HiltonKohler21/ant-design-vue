<docs>
---
order: 22
title:
  zh-CN: 表单数据存储于上层组件
  en-US: Store Form Data into Upper Component
---

## zh-CN

通过使用响应式状态和事件回调，将表单数据与校验状态托管到上层组件中。

## en-US

We can store form data and validation state into an upper component using reactive state and event callbacks.
</docs>

<template>
  <CustomizedForm :fields="fields" @change="onFieldsChange" />
  <a-typography-paragraph style="max-width: 440px; margin-top: 24px">
    <pre class="global-state-pre">{{ JSON.stringify(fields, null, 2) }}</pre>
  </a-typography-paragraph>
</template>

<script lang="ts" setup>
import { defineComponent, h, reactive, ref, watch } from 'vue';
import type { PropType } from 'vue';
import { Form, Input } from '@hiltonkohler21/ant-design-vue';

interface FieldData {
  name: (string | number)[];
  value?: unknown;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

const CustomizedForm = defineComponent({
  name: 'CustomizedForm',
  props: {
    fields: {
      type: Array as PropType<FieldData[]>,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const localModel = reactive({
      username: String(props.fields[0]?.value ?? ''),
      profile: {
        email: String(props.fields[1]?.value ?? ''),
      },
    });
    const fieldErrors = reactive<Record<string, string[]>>({
      username: [],
      email: [],
    });

    const emitFields = () => {
      emit('change', [
        {
          name: ['username'],
          value: localModel.username,
          touched: true,
          validating: false,
          errors: fieldErrors.username,
        },
        {
          name: ['profile', 'email'],
          value: localModel.profile.email,
          touched: true,
          validating: false,
          errors: fieldErrors.email,
        },
      ]);
    };

    watch(localModel, emitFields, { deep: true });

    const onValidate = (name: any, _status: boolean, errorMsgs: string[] | null) => {
      const key = Array.isArray(name) ? name[name.length - 1] : name;
      fieldErrors[key] = errorMsgs || [];
      emitFields();
    };

    return () =>
      h(
        Form,
        {
          name: 'global_state',
          layout: 'inline',
          model: localModel,
          onValidate,
        },
        () => [
          h(
            Form.Item,
            {
              name: 'username',
              label: 'Username',
              rules: [{ required: true, message: 'Username is required!' }],
              style: { marginBottom: '12px' },
            },
            () =>
              h(Input, {
                value: localModel.username,
                'onUpdate:value': (val: string) => {
                  localModel.username = val;
                },
              }),
          ),
          h(
            Form.Item,
            {
              name: ['profile', 'email'],
              label: 'Email',
              style: { marginBottom: '12px' },
            },
            () =>
              h(Input, {
                value: localModel.profile.email,
                'onUpdate:value': (val: string) => {
                  localModel.profile.email = val;
                },
              }),
          ),
        ],
      );
  },
});

const fields = ref<FieldData[]>([
  { name: ['username'], value: 'Ant Design' },
  { name: ['profile', 'email'], value: 'antd@example.com' },
]);

const onFieldsChange = (newFields: FieldData[]) => {
  fields.value = newFields;
};
</script>

<style scoped>
.global-state-pre {
  border: none;
  max-width: 100%;
  overflow-x: auto;
}
</style>
