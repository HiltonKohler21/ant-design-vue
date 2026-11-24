<docs>
---
order: 4
title:
  zh-CN: 延迟
  en-US: Delay
---

## zh-CN

延迟显示 loading 效果。当 spinning 状态在 `delay` 时间内结束，则不显示 loading 状态。

## en-US

Specifies a delay for loading state. If `spinning` ends during delay, loading status won't appear.

</docs>

<template>
  <a-flex gap="medium" vertical>
    <a-spin :spinning="loading" :delay="500">
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
