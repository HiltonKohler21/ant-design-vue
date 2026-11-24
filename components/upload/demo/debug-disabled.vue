<docs>
---
order: 20
debug: true
title:
  zh-CN: 禁用态样式调试
  en-US: Debug Disabled Styles
---

## zh-CN

检查各种形态（文字、按钮、照片墙、圆形照片墙、拖拽区）在 `disabled` 状态下的样式表现。

## en-US

Debug disabled styles across text, button, picture-card, picture-circle, and Dragger variants.
</docs>

<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <a-upload disabled>Click Text to Upload</a-upload>
    <a-upload disabled>
      <a-button disabled>
        <upload-outlined />
        Click to Upload
      </a-button>
    </a-upload>
    <a-upload name="avatar" list-type="picture-card" :file-list="fileList" disabled>
      <div>
        <plus-outlined />
        <div :style="{ marginTop: '8px' }">Upload</div>
      </div>
    </a-upload>
    <a-upload name="avatar" list-type="picture-circle" :file-list="fileList" disabled>
      <div>
        <plus-outlined />
        <div :style="{ marginTop: '8px' }">Upload</div>
      </div>
    </a-upload>
    <a-upload-dragger disabled>
      <p class="ant-upload-drag-icon">
        <inbox-outlined />
      </p>
      <p class="ant-upload-text">Click or drag file to this area to upload</p>
      <p class="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading company data or
        other banned files.
      </p>
    </a-upload-dragger>
  </a-space>
</template>

<script lang="ts" setup>
import { InboxOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import type { UploadFile } from 'ant-design-vue';

const sampleImageUrl =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">' +
      '<rect width="160" height="160" fill="#1677ff"/>' +
      '<circle cx="56" cy="54" r="18" fill="#fff" fill-opacity="0.88"/>' +
      '<path d="M16 130 L64 78 L98 110 L118 90 L144 130 Z" fill="#fff" fill-opacity="0.92"/>' +
      '</svg>',
  );

const fileList: UploadFile[] = [
  { uid: '-1', name: 'image.png', status: 'done', url: sampleImageUrl },
  { uid: '-2', name: 'image.png', status: 'done', url: sampleImageUrl },
  { uid: '-xxx', percent: 50, name: 'image.png', status: 'uploading', url: sampleImageUrl },
  { uid: '-5', name: 'image.png', status: 'error' },
];
</script>
