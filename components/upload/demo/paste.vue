<docs>
---
order: 6
version: 4.3.0
title:
  zh-CN: 粘贴上传
  en-US: Paste
---

## zh-CN

通过设置 `pastable` 属性，支持直接粘贴剪贴板中的文件或图片进行上传。

## en-US

Set `pastable` to enable uploading files or images directly from the clipboard.
</docs>

<template>
  <a-upload
    v-model:file-list="fileList"
    name="file"
    pastable
    :custom-request="customRequest"
    @change="handleChange"
  >
    <a-button>
      <upload-outlined />
      Paste or click to upload
    </a-button>
  </a-upload>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam, UploadFile, UploadProps } from 'ant-design-vue';

const fileList = ref<UploadFile[]>([]);

const customRequest: UploadProps['customRequest'] = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess?.({ status: 'ok' });
  }, 200);
};

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
};
</script>
