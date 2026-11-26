<docs>
---
order: 18
title:
  zh-CN: 上传前裁切图片
  en-US: Crop image before uploading
---

## zh-CN

在 `beforeUpload` 中结合 Modal 与 Canvas 实现上传前的图片缩放与旋转裁切预览。

## en-US

Crop, zoom, and rotate images with a Modal and Canvas preview inside `beforeUpload` before uploading.
</docs>

<template>
  <div>
    <a-upload
      v-model:file-list="fileList"
      list-type="picture-card"
      accept="image/*"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      @preview="handlePreview"
    >
      <div v-if="fileList.length < 5">
        <plus-outlined />
        <div :style="{ marginTop: '8px' }">Upload</div>
      </div>
    </a-upload>

    <a-modal
      :open="cropOpen"
      title="Edit image"
      ok-text="OK"
      cancel-text="Cancel"
      @ok="handleCropConfirm"
      @cancel="handleCropCancel"
    >
      <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }">
        <canvas
          ref="canvasRef"
          width="240"
          height="240"
          :style="{
            border: '1px solid var(--ant-color-border, #d9d9d9)',
            borderRadius: '8px',
            maxWidth: '100%',
          }"
        />
        <div :style="{ width: '100%' }">
          <div>Zoom: {{ zoom.toFixed(1) }}x</div>
          <a-slider v-model:value="zoom" :min="1" :max="3" :step="0.1" @change="drawCropCanvas" />
          <div>Rotate: {{ rotate }}°</div>
          <a-slider
            v-model:value="rotate"
            :min="-180"
            :max="180"
            :step="5"
            @change="drawCropCanvas"
          />
        </div>
      </div>
    </a-modal>

    <a-modal :open="previewOpen" :title="previewTitle" :footer="null" @cancel="previewOpen = false">
      <img alt="preview" :style="{ width: '100%' }" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { UploadFile, UploadProps } from '@hiltonkohler21/ant-design-vue';

const sampleImageUrl =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">' +
      '<defs><linearGradient id="cropGrad" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#722ed1"/><stop offset="100%" stop-color="#1677ff"/>' +
      '</linearGradient></defs>' +
      '<rect width="160" height="160" rx="12" fill="url(#cropGrad)"/>' +
      '<circle cx="80" cy="64" r="24" fill="#fff" fill-opacity="0.9"/>' +
      '<path d="M36 132 C36 104 124 104 124 132 Z" fill="#fff" fill-opacity="0.9"/>' +
      '</svg>',
  );

const fileList = ref<UploadFile[]>([
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: sampleImageUrl,
  },
]);

const cropOpen = ref(false);
const zoom = ref(1);
const rotate = ref(0);
const canvasRef = ref<HTMLCanvasElement | null>(null);
let sourceImg: HTMLImageElement | null = null;
let pendingFile: File | null = null;
let pendingResolve: ((value: File | boolean) => void) | null = null;

const previewOpen = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const drawCropCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas || !sourceImg) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((rotate.value * Math.PI) / 180);
  const scale = Math.max(width / sourceImg.width, height / sourceImg.height) * zoom.value;
  const drawW = sourceImg.width * scale;
  const drawH = sourceImg.height * scale;
  ctx.drawImage(sourceImg, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
};

const beforeUpload: UploadProps['beforeUpload'] = file => {
  return new Promise(resolve => {
    pendingFile = file as File;
    pendingResolve = resolve as any;
    zoom.value = 1;
    rotate.value = 0;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = async () => {
        sourceImg = img;
        cropOpen.value = true;
        await nextTick();
        drawCropCanvas();
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file as File);
  });
};

const handleCropConfirm = () => {
  const canvas = canvasRef.value;
  const file = pendingFile;
  const resolve = pendingResolve;
  cropOpen.value = false;
  pendingFile = null;
  pendingResolve = null;
  if (!canvas || !file || !resolve) return;
  canvas.toBlob(blob => {
    if (blob) {
      const croppedFile = new File([blob], file.name, { type: file.type || 'image/png' });
      resolve(croppedFile);
    } else {
      resolve(file);
    }
  }, file.type || 'image/png');
};

const handleCropCancel = () => {
  cropOpen.value = false;
  pendingResolve?.(false);
  pendingFile = null;
  pendingResolve = null;
};

const customRequest: UploadProps['customRequest'] = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess?.({ status: 'ok' });
  }, 200);
};

const handlePreview = async (file: UploadFile) => {
  if (!file.url && !file.preview && file.originFileObj) {
    file.preview = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as File);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = err => reject(err);
    });
  }
  previewImage.value = file.url || (file.preview as string) || '';
  previewTitle.value = file.name || 'Preview';
  previewOpen.value = true;
};
</script>
