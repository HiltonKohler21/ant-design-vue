<docs>
---
order: 19
debug: true
title:
  zh-CN: 嵌套
  en-US: Nest
---

## zh-CN

调试专用。

## en-US

Debug only.
</docs>

<template>
  <div>
    <a-space wrap :style="{ marginBottom: '12px' }">
      <a-select
        v-model:value="parentPos"
        placeholder="Parent placement"
        :style="{ width: '160px' }"
        :options="parentPosOptions"
      />
      <a-select
        v-model:value="childPos"
        placeholder="Child placement"
        :style="{ width: '160px' }"
        :options="childPosOptions"
      />
      <a-select
        v-model:value="parentType"
        placeholder="Parent type"
        :style="{ width: '160px' }"
        :options="parentTypeOptions"
      />
      <a-select
        v-model:value="childType"
        placeholder="Child type"
        :style="{ width: '160px' }"
        :options="childTypeOptions"
      />
    </a-space>
    <a-tabs default-active-key="1" :tab-placement="parentPos" :type="parentType">
      <a-tab-pane key="1" tab="Tab 1">
        <a-tabs
          default-active-key="1"
          :tab-placement="childPos"
          :type="childType"
          :style="{ height: '300px' }"
          :items="childItems"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2">Content of Tab Pane 2</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TabsProps } from '@hiltonkohler21/ant-design-vue';

const placementList: Array<NonNullable<TabsProps['tabPlacement']>> = [
  'start',
  'end',
  'top',
  'bottom',
];

const parentPos = ref<TabsProps['tabPlacement']>(undefined);
const childPos = ref<TabsProps['tabPlacement']>(undefined);
const parentType = ref<TabsProps['type']>(undefined);
const childType = ref<TabsProps['type']>(undefined);

const parentPosOptions = placementList.map(pos => ({ value: pos, label: `Parent - ${pos}` }));
const childPosOptions = placementList.map(pos => ({ value: pos, label: `Child - ${pos}` }));
const parentTypeOptions = [
  { value: 'line', label: 'Parent - line' },
  { value: 'card', label: 'Parent - card' },
  { value: 'editable-card', label: 'Parent - card edit' },
];
const childTypeOptions = [
  { value: 'line', label: 'Child - line' },
  { value: 'card', label: 'Child - card' },
  { value: 'editable-card', label: 'Child - card edit' },
];

const childItems: TabsProps['items'] = Array.from({ length: 20 }).map((_, index) => {
  const key = String(index);
  return {
    label: `Tab ${key}`,
    key,
    children: `TTTT ${key}`,
  };
});
</script>
