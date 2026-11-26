<docs>
---
order: 19
debug: true
title:
  zh-CN: 自定义显示 icon
  en-US: custom show icon
---

## zh-CN

通过 `iconRender` 按文件后缀展示自定义文件图标。

## en-US

Customize file icons by extension using `iconRender`.
</docs>

<template>
  <div>
    <a-upload
      v-model:file-list="fileList"
      list-type="picture-card"
      :icon-render="handleIconRender"
      :custom-request="customRequest"
      @preview="handlePreview"
    >
      <div v-if="fileList.length < 8">
        <plus-outlined />
        <div :style="{ marginTop: '8px' }">Upload</div>
      </div>
    </a-upload>
    <a-modal :open="previewOpen" :title="previewTitle" :footer="null" @cancel="previewOpen = false">
      <div v-if="previewImage">{{ previewImage }}</div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import {
  FileExcelTwoTone,
  FilePdfTwoTone,
  FileWordTwoTone,
  LoadingOutlined,
  PaperClipOutlined,
  PictureTwoTone,
  PlusOutlined,
} from '@ant-design/icons-vue';
import type { UploadFile, UploadProps } from '@hiltonkohler21/ant-design-vue';

const previewOpen = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const fileList = ref<UploadFile[]>([
  { uid: '-2', name: 'pdf.pdf', status: 'done', type: 'application/pdf', url: '#pdf.pdf' },
  { uid: '-3', name: 'doc.doc', status: 'done', type: 'application/msword', url: '#doc.doc' },
  { uid: '-4', name: 'image.png', status: 'error' },
  { uid: '-5', name: 'pdf.pdf', status: 'error' },
  { uid: '-6', name: 'doc.doc', status: 'error' },
]);

const handleIconRender: UploadProps['iconRender'] = ({ file, listType }) => {
  const fileSufIconList = [
    { icon: FilePdfTwoTone, suf: ['.pdf'] },
    { icon: FileExcelTwoTone, suf: ['.xlsx', '.xls', '.csv'] },
    { icon: FileWordTwoTone, suf: ['.doc', '.docx'] },
    {
      icon: PictureTwoTone,
      suf: ['.webp', '.svg', '.png', '.gif', '.jpg', '.jpeg', '.jfif', '.bmp', '.dpg'],
    },
  ];
  let iconNode: any = file.status === 'uploading' ? h(LoadingOutlined) : h(PaperClipOutlined);
  if (listType === 'picture' || listType === 'picture-card' || listType === 'picture-circle') {
    if (listType === 'picture-card' && file.status === 'uploading') {
      iconNode = h(LoadingOutlined);
    } else {
      const dotIdx = file.name.lastIndexOf('.');
      const ext = dotIdx >= 0 ? file.name.slice(dotIdx).toLowerCase() : '';
      const matched = fileSufIconList.find(item => item.suf.includes(ext));
      if (matched) {
        iconNode = h(matched.icon);
      }
    }
  }
  return iconNode;
};

const customRequest: UploadProps['customRequest'] = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess?.({ status: 'ok' });
  }, 200);
};

const handlePreview = (file: UploadFile) => {
  previewTitle.value = file.name;
  previewImage.value = file.url || file.name;
  previewOpen.value = true;
};
</script>
