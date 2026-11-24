<docs>
---
order: 44
debug: true
title:
  zh-CN: Custom feedback icons
  en-US: Custom feedback icons
---

## zh-CN

调试表单级 `feedbackIcons` 与表单项级 `hasFeedback.icons`（含隐藏成功图标与 Tooltip 提示）的渲染效果。

## en-US

Debug Form-level `feedbackIcons` and Form.Item-level `hasFeedback.icons`, including hiding icons and Tooltip overlays.
</docs>

<template>
  <div class="demo-custom-feedback-icons">
    <a-form
      :model="formState"
      name="custom-feedback-icons"
      style="max-width: 600px"
      :feedback-icons="formFeedbackIcons"
    >
      <a-form-item
        name="item1"
        label="Test"
        class="custom-feedback-item"
        :rules="[{ required: true, type: 'email' }, { min: 10 }]"
        help=""
        has-feedback
      >
        <a-input v-model:value="formState.item1" />
      </a-form-item>

      <a-form-item
        name="item2"
        label="Test"
        class="custom-feedback-item"
        :rules="[{ required: true, type: 'email' }, { min: 10 }]"
        help=""
        :has-feedback="{ icons: itemFeedbackIcons }"
      >
        <a-input v-model:value="formState.item2" />
      </a-form-item>

      <a-form-item
        name="item3"
        label="Test"
        class="custom-feedback-item"
        has-feedback
        validate-status="success"
      >
        <a-mentions
          v-model:value="formState.item3"
          allow-clear
          :options="[
            { value: 'mention1', label: 'mention1' },
            { value: 'mention2', label: 'mention2' },
          ]"
        />
      </a-form-item>

      <a-form-item>
        <a-button html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { h, reactive } from 'vue';
import { AlertFilled, CloseSquareFilled } from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';
import type { FeedbackIcons } from 'ant-design-vue/es/form';

const formState = reactive({
  item1: '',
  item2: '',
  item3: '@mention1',
});

const formFeedbackIcons: FeedbackIcons = ({ errors }) => ({
  error: h(
    Tooltip,
    {
      color: 'red',
      title: () => errors?.map((err, idx) => h('div', { key: idx }, String(err))),
    },
    () => h(CloseSquareFilled),
  ),
});

const itemFeedbackIcons: FeedbackIcons = ({ errors }) => ({
  error: h(
    Tooltip,
    {
      color: 'pink',
      title: () => errors?.map((err, idx) => h('div', { key: idx }, String(err))),
    },
    () => h(AlertFilled),
  ),
  success: false,
});
</script>

<style scoped>
.demo-custom-feedback-icons :deep(.ant-form-item-feedback-icon) {
  pointer-events: all;
}
</style>
