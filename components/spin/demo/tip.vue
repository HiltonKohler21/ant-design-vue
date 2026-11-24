<docs>
---
order: 3
title:
  zh-CN: 自定义描述文案
  en-US: Customized description
---

## zh-CN

自定义描述文案。

## en-US

Customize the description text.

</docs>

<template>
  <a-flex gap="medium" vertical>
    <a-flex gap="medium" wrap>
      <a-spin description="Loading" size="small">
        <div :style="contentStyle" />
      </a-spin>
      <a-spin description="Loading">
        <div :style="contentStyle" />
      </a-spin>
      <a-spin description="Loading" size="large">
        <div :style="contentStyle" />
      </a-spin>
    </a-flex>
    <a-spin description="Loading...">
      <a-alert
        title="Alert message title"
        description="Further details about the context of this alert."
        type="info"
      />
    </a-spin>
  </a-flex>
</template>
<script lang="ts" setup>
import type { CSSProperties } from 'vue';

const contentStyle: CSSProperties = {
  padding: '50px',
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: '4px',
};
</script>
