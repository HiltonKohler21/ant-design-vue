<docs>
---
order: 4
title:
  zh-CN: 添加动画
  en-US: Animate
---

## zh-CN

使用 Vue 内置的 `<TransitionGroup>` 实现标签添加与删除的过渡动画效果。

## en-US

Animating the Tag add and remove transitions with Vue's built-in `<TransitionGroup>`.

</docs>

<template>
  <div>
    <div style="margin-bottom: 8px">
      <TransitionGroup name="tag-fade" tag="div" class="tag-animation-group">
        <a-tag
          v-for="tag in tags"
          :key="tag"
          closable
          @close="
            (e: MouseEvent) => {
              e.preventDefault();
              handleClose(tag);
            }
          "
        >
          {{ tag }}
        </a-tag>
      </TransitionGroup>
    </div>
    <a-input
      v-if="inputVisible"
      ref="inputRef"
      v-model:value="inputValue"
      type="text"
      size="small"
      :style="{ width: '78px' }"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <a-tag
      v-else
      variant="outlined"
      :style="{ background: token.colorBgContainer, borderStyle: 'dashed', cursor: 'pointer' }"
      @click="showInput"
    >
      <template #icon>
        <PlusOutlined />
      </template>
      New Tag
    </a-tag>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { theme } from '@hiltonkohler21/ant-design-vue';

const { token } = theme.useToken();

const tags = ref(['Tag 1', 'Tag 2', 'Tag 3']);
const inputVisible = ref(false);
const inputValue = ref('');
const inputRef = ref();

const handleClose = (removedTag: string) => {
  tags.value = tags.value.filter(tag => tag !== removedTag);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const handleInputConfirm = () => {
  const val = inputValue.value.trim();
  if (val && !tags.value.includes(val)) {
    tags.value = [...tags.value, val];
  }
  inputVisible.value = false;
  inputValue.value = '';
};
</script>

<style scoped>
.tag-animation-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.tag-fade-enter-active,
.tag-fade-leave-active {
  transition: all 0.2s ease;
}

.tag-fade-enter-from,
.tag-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.tag-fade-move {
  transition: transform 0.2s ease;
}
</style>
