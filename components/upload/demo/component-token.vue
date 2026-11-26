<docs>
---
order: 16
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

Component Token Debug.

## en-US

Component Token Debug.
</docs>

<template>
  <a-config-provider :theme="uploadTheme">
    <a-upload
      v-model:file-list="fileList"
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      @change="handleChange"
    >
      <a-button>
        <UploadOutlined />
        Upload
      </a-button>
    </a-upload>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type {
  ConfigProviderProps,
  UploadChangeParam,
  UploadProps,
} from '@hiltonkohler21/ant-design-vue';

const fileList = ref<UploadProps['fileList']>([
  {
    uid: '1',
    name: 'xxx.png',
    status: 'uploading',
    url: 'http://www.baidu.com/xxx.png',
    percent: 33,
  },
  {
    uid: '2',
    name: 'yyy.png',
    status: 'done',
    url: 'http://www.baidu.com/yyy.png',
  },
  {
    uid: '3',
    name: 'zzz.png',
    status: 'error',
    response: 'Server Error 500',
    url: 'http://www.baidu.com/zzz.png',
  },
]);

const handleChange = ({ file, fileList: nextFileList }: UploadChangeParam) => {
  if (file.status !== 'uploading') {
    console.log(file, nextFileList);
  }
};

const uploadTheme: ConfigProviderProps['theme'] = {
  components: {
    Upload: {
      actionsColor: 'yellow',
    } as Record<string, any>,
  },
};
</script>
