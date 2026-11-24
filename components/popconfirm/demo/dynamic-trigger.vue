<docs>
---
order: 4
title:
  zh-CN: 条件触发
  en-US: Conditional trigger
---

## zh-CN

可以判断是否需要弹出。

## en-US

Make it pop up under some conditions.

</docs>

<template>
  <div>
    <a-popconfirm
      title="Delete the task"
      description="Are you sure to delete this task?"
      :open="open"
      ok-text="Yes"
      cancel-text="No"
      @openChange="handleOpenChange"
      @confirm="confirm"
      @cancel="cancel"
    >
      <a-button danger>Delete a task</a-button>
    </a-popconfirm>
    <br />
    <br />
    Whether directly execute：
    <a-switch v-model:checked="condition" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';

const open = ref<boolean>(false);
const condition = ref<boolean>(true);

const confirm = () => {
  open.value = false;
  message.success('Next step.');
};

const cancel = () => {
  open.value = false;
  message.error('Click on cancel.');
};

const handleOpenChange = (newOpen: boolean) => {
  if (!newOpen) {
    open.value = false;
    return;
  }
  // Determining condition before show the popconfirm.
  console.log(condition.value);
  if (condition.value) {
    confirm(); // next step
  } else {
    open.value = true;
  }
};
</script>
