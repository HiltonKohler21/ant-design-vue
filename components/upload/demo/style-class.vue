<docs>
---
order: 16
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Upload 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Upload by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex gap="large" vertical class="upload-style-class-demo">
    <a-upload
      :default-file-list="defaultFileList"
      :class-names="classNamesObj"
      :styles="stylesObject"
      :custom-request="customRequest"
    >
      <a-button>
        <upload-outlined />
        Upload
      </a-button>
    </a-upload>
    <a-upload
      :default-file-list="defaultFileList"
      :class-names="classNamesObj"
      :styles="stylesFn"
      :custom-request="customRequest"
      multiple
    >
      <a-button>
        <upload-outlined />
        Upload (Multiple)
      </a-button>
    </a-upload>
  </a-flex>
</template>

<script lang="ts" setup>
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadFile, UploadProps } from 'ant-design-vue';

const defaultFileList: UploadFile[] = [
  {
    uid: '1',
    name: 'xxx.png',
    status: 'uploading',
    url: '#xxx.png',
    percent: 33,
  },
  {
    uid: '2',
    name: 'yyy.png',
    status: 'done',
    url: '#yyy.png',
  },
  {
    uid: '3',
    name: 'zzz.png',
    status: 'error',
    response: 'Server Error 500',
    url: '#zzz.png',
  },
];

const classNamesObj: UploadProps['classNames'] = {
  root: 'custom-upload-root',
  list: 'custom-upload-list',
};

const stylesObject: UploadProps['styles'] = {
  item: {
    borderRadius: '4px',
    backgroundColor: 'var(--ant-color-fill-quaternary, rgba(5, 5, 5, 0.06))',
    height: '30px',
  },
  trigger: {
    backgroundColor: 'rgba(84, 89, 172, 0.12)',
    padding: '8px',
    borderRadius: '4px',
  },
};

const stylesFn: UploadProps['styles'] = info => {
  if (info.props.multiple) {
    return {
      root: { border: '1px solid #5459AC' },
      item: {
        borderRadius: '4px',
        backgroundColor: 'var(--ant-color-fill-quaternary, rgba(5, 5, 5, 0.06))',
        height: '30px',
      },
      trigger: {
        backgroundColor: 'rgba(84, 89, 172, 0.22)',
        padding: '8px',
        borderRadius: '4px',
      },
    };
  }
  return {};
};

const customRequest: UploadProps['customRequest'] = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess?.({ status: 'ok' });
  }, 200);
};
</script>

<style scoped>
.upload-style-class-demo :deep(.custom-upload-root) {
  display: block;
  border-radius: var(--ant-border-radius, 6px);
  padding: 12px;
}

.upload-style-class-demo :deep(.custom-upload-list) {
  margin-top: 8px;
}
</style>
