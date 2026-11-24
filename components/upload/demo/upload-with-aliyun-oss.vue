<docs>
---
order: 15
title:
  zh-CN: 阿里云 OSS
  en-US: Aliyun OSS
---

## zh-CN

使用阿里云 OSS 进行直传的示例，通过 `beforeUpload` 与 `data` 动态生成签名参数。

## en-US

Example of direct upload with Aliyun OSS using `beforeUpload` and `data` to attach signed credentials.
</docs>

<template>
  <a-form :model="formState" :label-col="{ span: 6 }">
    <a-form-item label="Photos" name="photos">
      <a-upload
        v-model:file-list="formState.photos"
        name="file"
        :data="getExtraData"
        :before-upload="beforeUpload"
        :custom-request="customRequest"
        @remove="handleRemove"
      >
        <a-button>
          <upload-outlined />
          Click to Upload
        </a-button>
      </a-upload>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadFile, UploadProps } from 'ant-design-vue';

interface OSSDataType {
  dir: string;
  expire: string;
  host: string;
  accessId: string;
  policy: string;
  signature: string;
}

const mockOSSData = (): Promise<OSSDataType> =>
  Promise.resolve({
    dir: 'user-dir/',
    expire: String(Math.floor(Date.now() / 1000) + 3600),
    host: 'https://oss.example.invalid/upload',
    accessId: 'c2hhb2RhaG9uZw==',
    policy: 'eGl4aWhhaGFrdWt1ZGFkYQ==',
    signature: 'ZGFob25nc2hhbw==',
  });

const formState = reactive<{ photos: UploadFile[] }>({
  photos: [],
});
const ossData = ref<OSSDataType>();

const initOSS = async () => {
  try {
    ossData.value = await mockOSSData();
  } catch (err) {
    if (err instanceof Error) {
      message.error(err.message);
    }
  }
};

onMounted(() => {
  initOSS();
});

const getExtraData: UploadProps['data'] = file => ({
  key: file.url,
  OSSAccessKeyId: ossData.value?.accessId,
  policy: ossData.value?.policy,
  Signature: ossData.value?.signature,
});

const beforeUpload: UploadProps['beforeUpload'] = async file => {
  if (!ossData.value) {
    await initOSS();
  }
  if (!ossData.value) {
    return false;
  }
  const expire = Number(ossData.value.expire) * 1000;
  if (expire < Date.now()) {
    await initOSS();
  }
  const dotIdx = file.name.lastIndexOf('.');
  const suffix = dotIdx >= 0 ? file.name.slice(dotIdx) : '';
  const filename = `${Date.now()}${suffix}`;
  (file as any).url = `${ossData.value.dir}${filename}`;
  return file;
};

const customRequest: UploadProps['customRequest'] = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess?.({ status: 'ok', host: ossData.value?.host });
  }, 200);
};

const handleRemove = (file: UploadFile) => {
  formState.photos = formState.photos.filter(item => item.uid !== file.uid);
};
</script>
