<docs>
---
order: 4
version: 4.3.0
title:
  zh-CN: 圆形照片墙
  en-US: Pictures with picture-circle type
---

## zh-CN

使用 `listType="picture-circle"` 展示圆形缩略图照片墙。

## en-US

Display circular thumbnail picture wall with `listType="picture-circle"`.
</docs>

<template>
  <div>
    <a-upload
      v-model:file-list="fileList"
      list-type="picture-circle"
      :custom-request="customRequest"
      @preview="handlePreview"
    >
      <div v-if="fileList.length < 8">
        <plus-outlined />
        <div :style="{ marginTop: '8px' }">Upload</div>
      </div>
    </a-upload>
    <a-modal :open="previewOpen" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="preview" :style="{ width: '100%' }" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { UploadFile, UploadProps } from 'ant-design-vue';

const sampleImageUrl =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#1677ff"/><stop offset="100%" stop-color="#69b1ff"/>' +
      '</linearGradient></defs>' +
      '<rect width="160" height="160" fill="url(#g)"/>' +
      '<circle cx="56" cy="54" r="18" fill="#fff" fill-opacity="0.88"/>' +
      '<path d="M16 130 L64 78 L98 110 L118 90 L144 130 Z" fill="#fff" fill-opacity="0.92"/>' +
      '</svg>',
  );

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

const previewOpen = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const fileList = ref<UploadFile[]>([
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: sampleImageUrl,
  },
  {
    uid: '-xxx',
    percent: 50,
    name: 'image.png',
    status: 'uploading',
    url: sampleImageUrl,
  },
  {
    uid: '-5',
    name: 'image.png',
    status: 'error',
  },
]);

const customRequest: UploadProps['customRequest'] = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess?.({ status: 'ok' });
  }, 200);
};

const handleCancel = () => {
  previewOpen.value = false;
  previewTitle.value = '';
};

const handlePreview = async (file: UploadFile) => {
  if (!file.url && !file.preview && file.originFileObj) {
    file.preview = await getBase64(file.originFileObj as File);
  }
  previewImage.value = file.url || (file.preview as string) || '';
  previewOpen.value = true;
  previewTitle.value = file.name || 'Preview';
};
</script>
