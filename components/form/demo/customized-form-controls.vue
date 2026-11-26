<docs>
---
order: 21
title:
  zh-CN: 自定义表单控件
  en-US: Customized Form Controls
---

## zh-CN

自定义或第三方的表单控件，也可以与 Form 组件一起使用。只要该组件注入 `useInjectFormItemContext` 并调用相应方法。

## en-US

Customized or third-party form controls can be used in Form, too.

Controls must inject `useInjectFormItemContext` and call the corresponding method.
</docs>
<template>
  <a-form name="customized_form_controls" layout="inline" :model="formState" @finish="onFinish">
    <a-form-item name="price" label="Price" :rules="[{ validator: checkPrice }]">
      <PriceInput v-model:value="formState.price" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { defineComponent, h, reactive } from 'vue';
import type { PropType } from 'vue';
import { Form, Input, Select } from '@hiltonkohler21/ant-design-vue';

type Currency = 'rmb' | 'dollar';

interface PriceValue {
  number: number;
  currency: Currency;
}

const PriceInput = defineComponent({
  name: 'PriceInput',
  props: {
    value: {
      type: Object as PropType<PriceValue>,
      required: true,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const formItemContext = Form.useInjectFormItemContext();
    const triggerChange = (changedValue: { number?: number; currency?: Currency }) => {
      emit('update:value', { ...props.value, ...changedValue });
      formItemContext.onFieldChange();
    };
    const onNumberChange = (e: Event) => {
      const newNumber = parseInt((e.target as HTMLInputElement).value || '0', 10);
      triggerChange({ number: Number.isNaN(newNumber) ? 0 : newNumber });
    };
    const onCurrencyChange = (newCurrency: any) => {
      triggerChange({ currency: newCurrency as Currency });
    };

    return () =>
      h('span', { style: { display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' } }, [
        h(Input, {
          type: 'text',
          value: String(props.value.number),
          style: { width: '100px' },
          onChange: onNumberChange,
        }),
        h(Select, {
          value: props.value.currency,
          style: { width: '80px', margin: '0 8px' },
          options: [
            { value: 'rmb', label: 'RMB' },
            { value: 'dollar', label: 'Dollar' },
          ],
          onChange: onCurrencyChange,
        }),
      ]);
  },
});

const formState = reactive<{ price: PriceValue }>({
  price: {
    number: 0,
    currency: 'rmb',
  },
});

const onFinish = (values: any) => {
  console.log('Received values from form: ', values);
};

const checkPrice = (_: any, value: { number: number }) => {
  if (value.number > 0) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('Price must be greater than zero!'));
};
</script>
