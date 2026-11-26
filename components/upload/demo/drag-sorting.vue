<docs>
---
order: 17
title:
  zh-CN: 上传列表拖拽排序
  en-US: Drag sorting of uploadList
---

## zh-CN

使用 `itemRender` 插槽配合原生 HTML5 拖拽事件，我们可以实现上传列表拖拽排序。

## en-US

By using the `itemRender` slot with native HTML5 drag-and-drop events, we can reorder items in the upload list.
</docs>

<template>
  <a-upload
    v-model:file-list="fileList"
    :custom-request="customRequest"
    class="upload-drag-sorting-demo"
  >
    <a-button>
      <upload-outlined />
      Click to Upload
    </a-button>
    <template #itemRender="{ originNode, file }">
      <div
        draggable="true"
        :class="[
          'drag-sort-item',
          {
            'drag-sort-item-dragging': draggingUid === file.uid,
            'drag-sort-item-over': dragOverUid === file.uid && draggingUid !== file.uid,
          },
        ]"
        @dragstart="onDragStart(file.uid, $event)"
        @dragover.prevent="onDragOver(file.uid)"
        @dragleave="onDragLeave(file.uid)"
        @drop.prevent="onDrop(file.uid)"
        @dragend="onDragEnd"
      >
        <component :is="originNode" />
      </div>
    </template>
  </a-upload>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadFile, UploadProps } from '@hiltonkohler21/ant-design-vue';

const sampleImageUrl =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">' +
      '<rect width="120" height="120" rx="8" fill="#1677ff"/>' +
      '<circle cx="42" cy="40" r="14" fill="#fff" fill-opacity="0.85"/>' +
      '<path d="M12 98 L48 58 L74 84 L88 70 L108 98 Z" fill="#fff" fill-opacity="0.9"/>' +
      '</svg>',
  );

const fileList = ref<UploadFile[]>([
  { uid: '-1', name: 'image1.png', status: 'done', url: sampleImageUrl },
  { uid: '-2', name: 'image2.png', status: 'done', url: sampleImageUrl },
  { uid: '-3', name: 'image3.png', status: 'done', url: sampleImageUrl },
  { uid: '-4', name: 'image4.png', status: 'done', url: sampleImageUrl },
  { uid: '-5', name: 'image.png', status: 'error' },
]);

const draggingUid = ref<string | null>(null);
const dragOverUid = ref<string | null>(null);

const onDragStart = (uid: string, e: DragEvent) => {
  draggingUid.value = uid;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', uid);
  }
};

const onDragOver = (uid: string) => {
  dragOverUid.value = uid;
};

const onDragLeave = (uid: string) => {
  if (dragOverUid.value === uid) {
    dragOverUid.value = null;
  }
};

const onDrop = (targetUid: string) => {
  const sourceUid = draggingUid.value;
  if (!sourceUid || sourceUid === targetUid) {
    onDragEnd();
    return;
  }
  const list = [...fileList.value];
  const fromIdx = list.findIndex(item => item.uid === sourceUid);
  const toIdx = list.findIndex(item => item.uid === targetUid);
  if (fromIdx !== -1 && toIdx !== -1) {
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);
    fileList.value = list;
  }
  onDragEnd();
};

const onDragEnd = () => {
  draggingUid.value = null;
  dragOverUid.value = null;
};

const customRequest: UploadProps['customRequest'] = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess?.({ status: 'ok' });
  }, 200);
};
</script>

<style scoped>
.drag-sort-item {
  cursor: move;
  border-radius: 4px;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

.drag-sort-item-dragging {
  opacity: 0.5;
}

.drag-sort-item-over {
  outline: 1px dashed var(--ant-color-primary, #1677ff);
}
</style>
