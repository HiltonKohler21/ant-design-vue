<docs>
---
order: 3
title:
  zh-CN: 回复框
  en-US: Reply Editor
---

## zh-CN

评论编辑器组件提供了相同样式的封装以支持自定义评论编辑器。

## en-US

Comment can be used as editor, user can customize the editor component.

</docs>

<template>
  <a-list
    v-if="comments.length"
    :data-source="comments"
    :header="`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`"
    item-layout="horizontal"
  >
    <template #renderItem="{ item }">
      <a-list-item>
        <a-comment
          :author="item.author"
          :avatar="item.avatar"
          :content="item.content"
          :datetime="item.datetime"
        />
      </a-list-item>
    </template>
  </a-list>
  <a-comment>
    <template #avatar>
      <a-avatar :src="avatarUrl" alt="Han Solo" />
    </template>
    <template #content>
      <a-form-item>
        <a-textarea v-model:value="value" :rows="4" />
      </a-form-item>
      <a-form-item>
        <a-button html-type="submit" :loading="submitting" type="primary" @click="handleSubmit">
          Add Comment
        </a-button>
      </a-form-item>
    </template>
  </a-comment>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

type Comment = Record<string, string>;

const avatarUrl =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%231677ff%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E';

const comments = ref<Comment[]>([]);
const submitting = ref<boolean>(false);
const value = ref<string>('');
const handleSubmit = () => {
  if (!value.value) {
    return;
  }

  submitting.value = true;

  setTimeout(() => {
    submitting.value = false;
    comments.value = [
      {
        author: 'Han Solo',
        avatar: avatarUrl,
        content: value.value,
        datetime: dayjs().fromNow(),
      },
      ...comments.value,
    ];
    value.value = '';
  }, 1000);
};
</script>
