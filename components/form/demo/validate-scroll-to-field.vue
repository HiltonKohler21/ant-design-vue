<docs>
---
order: 34
title:
  zh-CN: 滑动到错误字段
  en-US: Slide to error field
---

## zh-CN

通过 `scrollToFirstError` 和 `scrollToField` 方法，在提交校验失败或点击按钮时自动滚动并聚焦到对应字段。

## en-US

Use `scrollToFirstError` and `scrollToField` to automatically scroll and focus the target field on validation failure or button click.
</docs>

<template>
  <div class="scroll-demo-box">
    <a-form
      ref="formRef"
      :model="formState"
      name="validate_scroll_to_field"
      :scroll-to-first-error="{ behavior: 'smooth', block: 'end', focus: true }"
      style="padding-block: 16px; max-width: 600px"
      :label-col="{ xs: { span: 24 }, sm: { span: 6 } }"
      :wrapper-col="{ xs: { span: 24 }, sm: { span: 14 } }"
    >
      <a-form-item :label="null">
        <a-button @click="formRef?.scrollToField('bio', { behavior: 'smooth', focus: true })">
          Scroll to Bio
        </a-button>
      </a-form-item>

      <a-form-item name="username" label="UserName" :rules="[{ required: true }]">
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item label="Occupation" name="occupation">
        <a-select
          v-model:value="formState.occupation"
          :options="[
            { label: 'Designer', value: 'designer' },
            { label: 'Developer', value: 'developer' },
            { label: 'Product Manager', value: 'product-manager' },
          ]"
        />
      </a-form-item>

      <a-form-item name="motto" label="Motto">
        <a-textarea v-model:value="formState.motto" :rows="4" />
      </a-form-item>

      <a-form-item name="bio" label="Bio" :rules="[{ required: true }]">
        <a-textarea v-model:value="formState.bio" :rows="6" />
      </a-form-item>

      <a-form-item :label="null">
        <a-flex gap="small" wrap="wrap">
          <a-button type="primary" html-type="submit">Submit</a-button>
          <a-button danger @click="formRef?.resetFields()">Reset</a-button>
        </a-flex>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance } from '@hiltonkohler21/ant-design-vue';

const formRef = ref<FormInstance>();

const formState = reactive({
  username: '',
  occupation: undefined as string | undefined,
  motto: '',
  bio: '',
});
</script>

<style scoped>
.scroll-demo-box {
  max-height: 360px;
  overflow-y: auto;
  padding-inline-end: 8px;
}
</style>
