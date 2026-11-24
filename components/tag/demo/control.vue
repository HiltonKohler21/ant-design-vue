<docs>
---
order: 2
title:
  zh-CN: 动态添加和删除
  en-US: Add & Remove Dynamically
---

## zh-CN

用数组生成一组标签，可以动态添加和删除。

## en-US

Generating a set of Tags by array, you can add and remove dynamically.

</docs>

<template>
  <a-flex gap="small" align="center" wrap>
    <template v-for="(tag, index) in tags" :key="tag">
      <a-input
        v-if="editInputIndex === index"
        ref="editInputRef"
        v-model:value="editInputValue"
        size="small"
        :style="tagInputStyle"
        @blur="handleEditInputConfirm"
        @keyup.enter="handleEditInputConfirm"
      />
      <a-tooltip v-else-if="tag.length > 20" :title="tag">
        <a-tag :closable="index !== 0" style="user-select: none" @close="handleClose(tag)">
          <span @dblclick="e => handleEditStart(index, tag, e)">
            {{ `${tag.slice(0, 20)}...` }}
          </span>
        </a-tag>
      </a-tooltip>
      <a-tag v-else :closable="index !== 0" style="user-select: none" @close="handleClose(tag)">
        <span @dblclick="e => handleEditStart(index, tag, e)">
          {{ tag }}
        </span>
      </a-tag>
    </template>
    <a-input
      v-if="inputVisible"
      ref="inputRef"
      v-model:value="inputValue"
      type="text"
      size="small"
      :style="tagInputStyle"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <a-tag v-else variant="outlined" :style="tagPlusStyle" @click="showInput">
      <template #icon>
        <PlusOutlined />
      </template>
      New Tag
    </a-tag>
  </a-flex>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue';
import type { CSSProperties } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { theme } from 'ant-design-vue';

const { token } = theme.useToken();

const tagInputStyle: CSSProperties = {
  width: '64px',
  height: '22px',
  marginInlineEnd: '8px',
  verticalAlign: 'top',
};

const tagPlusStyle = computed<CSSProperties>(() => ({
  height: '22px',
  background: token.value.colorBgContainer,
  borderStyle: 'dashed',
  cursor: 'pointer',
}));

const tags = ref<string[]>(['Unremovable', 'Tag 2', 'Tag 3']);
const inputVisible = ref(false);
const inputValue = ref('');
const editInputIndex = ref(-1);
const editInputValue = ref('');
const inputRef = ref();
const editInputRef = ref();

const handleClose = (removedTag: string) => {
  const nextTags = tags.value.filter(tag => tag !== removedTag);
  console.log(nextTags);
  tags.value = nextTags;
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const handleInputConfirm = () => {
  const value = inputValue.value.trim();
  if (value && !tags.value.includes(value)) {
    tags.value = [...tags.value, value];
  }
  inputVisible.value = false;
  inputValue.value = '';
};

const handleEditStart = (index: number, tag: string, e: MouseEvent) => {
  if (index !== 0) {
    editInputIndex.value = index;
    editInputValue.value = tag;
    e.preventDefault();
    nextTick(() => {
      const target = Array.isArray(editInputRef.value) ? editInputRef.value[0] : editInputRef.value;
      target?.focus();
    });
  }
};

const handleEditInputConfirm = () => {
  const index = editInputIndex.value;
  if (index >= 0) {
    const nextTags = [...tags.value];
    const nextValue = editInputValue.value.trim();
    if (nextValue) {
      nextTags[index] = nextValue;
      tags.value = nextTags;
    }
  }
  editInputIndex.value = -1;
  editInputValue.value = '';
};
</script>
