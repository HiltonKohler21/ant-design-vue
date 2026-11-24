<docs>
---
order: 6
title:
  zh-CN: 更新消息内容
  en-US: Update Message Content
---

## zh-CN

可以通过唯一的 key 来更新内容，或者通过响应式数据更新。

## en-US

Update content with unique key, or use reactive data.

</docs>

<template>
  <contextHolder />
  <a-space direction="vertical">
    <a-button type="primary" @click="openNotification">
      Open the notification box (update by key)
    </a-button>
    <a-button type="primary" @click="openNotification2">
      Open the notification box (update by reactive)
    </a-button>
  </a-space>
</template>
<script lang="ts" setup>
import { notification } from 'ant-design-vue';
import { ref } from 'vue';

const key = 'updatable';
const [api, contextHolder] = notification.useNotification();

const openNotification = () => {
  api.open({
    key,
    title: 'Notification Title',
    description: 'description.',
  });
  setTimeout(() => {
    api.open({
      key,
      title: 'New Title',
      description: 'New description.',
    });
  }, 1000);
};

const titleRef = ref('Notification Title');
const descriptionRef = ref('description.');
const openNotification2 = () => {
  // content must use function
  api.open({
    title: () => titleRef.value,
    description: () => descriptionRef.value,
  });
  setTimeout(() => {
    titleRef.value = 'New Title';
    descriptionRef.value = 'New description.';
  }, 1000);
};
</script>
