<docs>
---
order: 9
debug: true
title:
  zh-CN: _InternalPanelDoNotUseOrYouWillBeFired
  en-US: _InternalPanelDoNotUseOrYouWillBeFired
---

## zh-CN

调试用组件，请勿直接使用。

## en-US

Debug usage. Do not use in your production.

</docs>

<template>
  <div>
    <InternalPopconfirm title="Are you OK?" description="Does this look good?" />
    <InternalPopconfirm
      title="Are you OK?"
      description="Does this look good?"
      placement="bottomRight"
      :style="{ width: '250px' }"
    />
    <InternalPopconfirm :icon="null" title="Are you OK?" />
    <InternalPopconfirm :icon="null" title="Are you OK?" description="Does this look good?" />
  </div>
</template>
<script lang="ts" setup>
import { Popconfirm } from '@hiltonkohler21/ant-design-vue';

const { _InternalPanelDoNotUseOrYouWillBeFired: InternalPopconfirm } = Popconfirm;
</script>
