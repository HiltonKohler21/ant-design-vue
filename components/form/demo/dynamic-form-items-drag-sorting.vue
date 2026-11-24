<docs>
---
order: 16
title:
  zh-CN: 拖拽排序
  en-US: Drag sorting
---

## zh-CN

使用原生 HTML5 拖拽能力实现动态表单项的上下拖拽排序。

## en-US

Drag and drop to reorder dynamic form items using native HTML5 drag-and-drop.
</docs>

<template>
  <a-form
    :model="formState"
    name="dynamic_form_draggable_item"
    autocomplete="off"
    style="max-width: 600px"
    @finish="onFinish"
  >
    <div
      v-for="(user, index) in formState.users"
      :key="user.id"
      draggable="true"
      class="drag-sort-row"
      :class="{
        'drag-sort-row-dragging': dragIndex === index,
        'drag-sort-row-over': overIndex === index && dragIndex !== index,
      }"
      @dragstart="onDragStart(index, $event)"
      @dragenter.prevent="onDragEnter(index)"
      @dragover.prevent
      @drop.prevent="onDrop(index)"
      @dragend="onDragEnd"
    >
      <a-space wrap align="baseline" class="drag-sort-space">
        <a-button type="text" size="small" style="cursor: move" aria-label="Drag handle">
          <template #icon><HolderOutlined /></template>
        </a-button>
        <a-form-item
          :name="['users', index, 'first']"
          :rules="[{ required: true, message: 'Missing first name' }]"
          style="margin-bottom: 8px"
        >
          <a-input v-model:value="user.first" placeholder="First Name" />
        </a-form-item>
        <a-form-item
          :name="['users', index, 'last']"
          :rules="[{ required: true, message: 'Missing last name' }]"
          style="margin-bottom: 8px"
        >
          <a-input v-model:value="user.last" placeholder="Last Name" />
        </a-form-item>
        <MinusCircleOutlined class="drag-remove-icon" @click="removeUser(index)" />
      </a-space>
    </div>

    <a-form-item>
      <a-button type="dashed" block @click="addUser">
        <PlusOutlined />
        Add field
      </a-button>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { HolderOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';

interface UserItem {
  id: number;
  first: string;
  last: string;
}

let uid = 2;

const formState = reactive<{ users: UserItem[] }>({
  users: [
    { id: 1, first: 'Alice', last: 'Smith' },
    { id: 2, first: 'Bob', last: 'Jones' },
  ],
});

const dragIndex = ref<number | null>(null);
const overIndex = ref<number | null>(null);

const onDragStart = (index: number, e: DragEvent) => {
  dragIndex.value = index;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  }
};

const onDragEnter = (index: number) => {
  overIndex.value = index;
};

const onDrop = (targetIndex: number) => {
  if (dragIndex.value === null || dragIndex.value === targetIndex) {
    onDragEnd();
    return;
  }
  const moved = formState.users.splice(dragIndex.value, 1)[0];
  formState.users.splice(targetIndex, 0, moved);
  onDragEnd();
};

const onDragEnd = () => {
  dragIndex.value = null;
  overIndex.value = null;
};

const addUser = () => {
  uid += 1;
  formState.users.push({ id: uid, first: '', last: '' });
};

const removeUser = (index: number) => {
  formState.users.splice(index, 1);
};

const onFinish = (values: any) => {
  console.log('Received values of form:', values);
};
</script>

<style scoped>
.drag-sort-row {
  margin-bottom: 8px;
  padding: 4px 8px;
  border-radius: var(--ant-border-radius, 6px);
  border: 1px dashed transparent;
  transition: background-color 0.2s, border-color 0.2s, opacity 0.2s;
}

.drag-sort-row-dragging {
  opacity: 0.5;
}

.drag-sort-row-over {
  border-color: var(--ant-color-primary, #1677ff);
  background-color: var(--ant-color-primary-bg, rgba(22, 119, 255, 0.06));
}

.drag-sort-space {
  display: flex;
}

.drag-remove-icon {
  cursor: pointer;
  color: var(--ant-color-text-secondary, rgba(0, 0, 0, 0.45));
}
</style>
