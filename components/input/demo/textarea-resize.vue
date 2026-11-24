<docs>
---
order: 103
debug: true
title:
  zh-CN: 文本域 Resize Debug
  en-US: TextArea Resize Debug
---

## zh-CN

用于多行输入。

## en-US

For multi-line input.
</docs>

<template>
  <div>
    <a-button :style="{ marginBottom: '16px' }" @click="autoResize = !autoResize">
      Auto Resize: {{ String(autoResize) }}
    </a-button>
    <a-textarea :rows="4" :auto-size="autoResize" :default-value="defaultValue" />
    <br />
    <br />
    <a-textarea allow-clear :style="{ width: '93px' }" />
    <br />
    <br />
    <a-textarea :style="{ resize: 'both', maxWidth: '100%' }" show-count />
    <br />
    <br />
    <a-tooltip title="Debug TextArea with Tooltip">
      <a-textarea
        ref="textAreaRef"
        placeholder="TextArea wrapped in Tooltip for debugging"
        :style="{ marginTop: '16px' }"
        @focus="onFocus"
      />
    </a-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const defaultValue =
  'The autoSize property applies to textarea nodes, and only the height changes automatically. In addition, autoSize can be set to an object, specifying the minimum number of rows and the maximum number of rows. The autoSize property applies to textarea nodes, and only the height changes automatically. In addition, autoSize can be set to an object, specifying the minimum number of rows and the maximum number of rows.';

const autoResize = ref(false);
const textAreaRef = ref<any>(null);

const onFocus = () => {
  console.log('nativeElement:', textAreaRef.value?.nativeElement);
};
</script>
