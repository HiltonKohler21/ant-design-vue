<docs>
---
order: 13
title:
  zh-CN: 字段路径前缀
  en-US: Path Prefix
---

## zh-CN

使用 Vue `provide` / `inject` 封装路径分组组件，自动为嵌套 `Form.Item` 拼接 `name` 前缀路径。

## en-US

Wrap field groups with Vue `provide` / `inject` to automatically prepend `name` path prefixes to nested `Form.Item`s.
</docs>

<template>
  <a-form
    :model="formState"
    name="form_item_path"
    layout="vertical"
    style="max-width: 600px"
    @finish="onFinish"
  >
    <MyFormItemGroup :prefix="['user']">
      <MyFormItemGroup :prefix="['name']">
        <MyFormItem name="firstName" label="First Name">
          <a-input v-model:value="formState.user.name.firstName" />
        </MyFormItem>
        <MyFormItem name="lastName" label="Last Name">
          <a-input v-model:value="formState.user.name.lastName" />
        </MyFormItem>
      </MyFormItemGroup>

      <MyFormItem name="age" label="Age">
        <a-input v-model:value="formState.user.age" />
      </MyFormItem>
    </MyFormItemGroup>

    <a-button type="primary" html-type="submit">Submit</a-button>
  </a-form>
</template>

<script lang="ts" setup>
import { computed, defineComponent, h, inject, provide, reactive } from 'vue';
import type { ComputedRef, InjectionKey, PropType } from 'vue';
import { Form } from 'ant-design-vue';

type PathSegment = string | number | (string | number)[];

const MyFormItemContextKey: InjectionKey<ComputedRef<(string | number)[]>> =
  Symbol('MyFormItemContext');

function toArr(val: PathSegment): (string | number)[] {
  return Array.isArray(val) ? val : [val];
}

const MyFormItemGroup = defineComponent({
  name: 'MyFormItemGroup',
  props: {
    prefix: {
      type: [String, Number, Array] as PropType<PathSegment>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const parentPrefix = inject(
      MyFormItemContextKey,
      computed<(string | number)[]>(() => []),
    );
    const concatPath = computed(() => [...parentPrefix.value, ...toArr(props.prefix)]);
    provide(MyFormItemContextKey, concatPath);
    return () => slots.default?.();
  },
});

const MyFormItem = defineComponent({
  name: 'MyFormItem',
  props: {
    name: {
      type: [String, Number, Array] as PropType<PathSegment>,
      default: undefined,
    },
    label: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    const prefixPath = inject(
      MyFormItemContextKey,
      computed<(string | number)[]>(() => []),
    );
    const concatName = computed(() =>
      props.name !== undefined ? [...prefixPath.value, ...toArr(props.name)] : undefined,
    );
    return () => h(Form.Item, { ...attrs, label: props.label, name: concatName.value }, slots);
  },
});

const formState = reactive({
  user: {
    name: {
      firstName: '',
      lastName: '',
    },
    age: '',
  },
});

const onFinish = (value: Record<string, any>) => {
  console.log(value);
};
</script>
