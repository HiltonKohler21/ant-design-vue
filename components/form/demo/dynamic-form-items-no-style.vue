<docs>
---
order: 39
debug: true
title:
  zh-CN: 动态增减嵌套纯字段
  en-US: Dynamic Form nest pure Items
---

## zh-CN

在 `noStyle` 嵌套场景下动态增减纯字段控件。

## en-US

Dynamically add and remove pure `noStyle` nested form fields.
</docs>

<template>
  <a-form
    :model="formState"
    name="dynamic_form_no_style"
    style="max-width: 600px"
    autocomplete="off"
    @finish="onFinish"
  >
    <a-form-item label="Users">
      <a-space
        v-for="(user, index) in formState.users"
        :key="user.id"
        wrap
        style="display: flex; margin-bottom: 16px"
      >
        <a-form-item no-style :name="['users', index, 'lastName']" :rules="[{ required: true }]">
          <a-input v-model:value="user.lastName" placeholder="Last Name" />
        </a-form-item>
        <a-form-item no-style :name="['users', index, 'firstName']" :rules="[{ required: true }]">
          <a-input v-model:value="user.firstName" placeholder="First Name" />
        </a-form-item>
        <MinusCircleOutlined style="cursor: pointer" @click="removeUser(index)" />
      </a-space>
      <a-form-item>
        <a-button type="dashed" block @click="addUser">
          <PlusOutlined />
          Add field
        </a-button>
      </a-form-item>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';

interface UserRow {
  id: number;
  lastName: string;
  firstName: string;
}

let uid = 0;

const formState = reactive<{ users: UserRow[] }>({
  users: [],
});

const addUser = () => {
  uid += 1;
  formState.users.push({ id: uid, lastName: '', firstName: '' });
};

const removeUser = (index: number) => {
  formState.users.splice(index, 1);
};

const onFinish = (values: any) => {
  console.log('Received values of form:', values);
};
</script>
