<docs>
---
order: 2
title:
  zh-CN: 卡片加载中
  en-US: Embedded mode
---

## zh-CN

可以直接把内容内嵌到 `Spin` 中，将现有容器变为加载状态。

## en-US

Embedding content into `Spin` will set it into loading state.

</docs>

<template>
  <a-flex gap="medium" vertical>
    <a-spin :spinning="loading">
      <a-alert
        type="info"
        title="Alert message title"
        description="Further details about the context of this alert."
      />
    </a-spin>
    <p>
      Loading state：
      <a-switch v-model:checked="loading" />
    </p>
  </a-flex>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const loading = ref<boolean>(false);
</script>
