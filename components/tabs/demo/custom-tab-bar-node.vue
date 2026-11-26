<docs>
---
order: 15
title:
  zh-CN: 可拖拽标签
  en-US: Draggable Tabs
---

## zh-CN

使用原生 HTML5 拖拽 API 与 `renderTabBar` 实现标签可拖拽排序。

## en-US

Make tabs draggable and reorderable using native HTML5 Drag and Drop with `renderTabBar`.
</docs>

<template>
  <a-tabs v-model:active-key="activeKey" :items="items">
    <template #renderTabBar="{ DefaultTabBar, ...tabBarProps }">
      <component :is="DefaultTabBar" v-bind="tabBarProps">
        <template #default="{ node: tabNode }">
          <DraggableTabNode :node="tabNode" :node-key="String(tabNode.key)" />
        </template>
      </component>
    </template>
  </a-tabs>
</template>

<script lang="ts" setup>
import { cloneVNode, defineComponent, ref } from 'vue';
import type { TabsProps } from '@hiltonkohler21/ant-design-vue';

const activeKey = ref('1');
const draggingKey = ref<string | null>(null);
const dragOverKey = ref<string | null>(null);

const items = ref<NonNullable<TabsProps['items']>>([
  { key: '1', label: 'Tab 1', children: 'Content of Tab Pane 1' },
  { key: '2', label: 'Tab 2', children: 'Content of Tab Pane 2' },
  { key: '3', label: 'Tab 3', children: 'Content of Tab Pane 3' },
]);

const moveItem = (fromKey: string, toKey: string) => {
  if (fromKey === toKey) return;
  const list = [...items.value];
  const fromIndex = list.findIndex(item => String(item.key) === fromKey);
  const toIndex = list.findIndex(item => String(item.key) === toKey);
  if (fromIndex === -1 || toIndex === -1) return;
  const [moved] = list.splice(fromIndex, 1);
  list.splice(toIndex, 0, moved);
  items.value = list;
};

const DraggableTabNode = defineComponent({
  name: 'DraggableTabNode',
  props: {
    node: { type: Object, required: true },
    nodeKey: { type: String, required: true },
  },
  setup(props) {
    return () =>
      cloneVNode(props.node as any, {
        draggable: true,
        style: {
          cursor: 'move',
          opacity: draggingKey.value === props.nodeKey ? 0.5 : 1,
          outline:
            dragOverKey.value === props.nodeKey && draggingKey.value !== props.nodeKey
              ? '1px dashed var(--ant-color-primary, #1677ff)'
              : undefined,
        },
        onDragstart: (e: DragEvent) => {
          draggingKey.value = props.nodeKey;
          if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', props.nodeKey);
          }
        },
        onDragover: (e: DragEvent) => {
          e.preventDefault();
          dragOverKey.value = props.nodeKey;
        },
        onDragleave: () => {
          if (dragOverKey.value === props.nodeKey) {
            dragOverKey.value = null;
          }
        },
        onDrop: (e: DragEvent) => {
          e.preventDefault();
          const sourceKey = draggingKey.value || e.dataTransfer?.getData('text/plain') || '';
          if (sourceKey) {
            moveItem(sourceKey, props.nodeKey);
          }
          draggingKey.value = null;
          dragOverKey.value = null;
        },
        onDragend: () => {
          draggingKey.value = null;
          dragOverKey.value = null;
        },
      });
  },
});
</script>
