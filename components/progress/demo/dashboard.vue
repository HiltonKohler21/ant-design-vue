<docs>
---
order: 7
title:
  zh-CN: 仪表盘
  en-US: Dashboard
---

## zh-CN

通过设置 `type=dashboard`，可以很方便地实现仪表盘样式的进度条。

## en-US

By setting `type=dashboard`, you can get a dashboard style of progress easily.

</docs>

<template>
  <a-flex vertical gap="large">
    <div>
      gapDegree:
      <a-segmented
        v-model:value="gapDegree"
        :options="[
          { label: 50, value: 50 },
          { label: 100, value: 100 },
        ]"
      />
    </div>
    <div>
      gapPlacement:
      <a-segmented
        v-model:value="gapPlacement"
        :options="[
          { label: 'start', value: 'start' },
          { label: 'end', value: 'end' },
          { label: 'top', value: 'top' },
          { label: 'bottom', value: 'bottom' },
        ]"
      />
    </div>
    <a-progress
      type="dashboard"
      :gap-degree="gapDegree"
      :percent="30"
      :gap-placement="gapPlacement"
    />
  </a-flex>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { ProgressProps } from '@hiltonkohler21/ant-design-vue';

type GapPlacement = NonNullable<ProgressProps['gapPlacement']>;

const gapPlacement = ref<GapPlacement>('bottom');
const gapDegree = ref<number>(50);
</script>
