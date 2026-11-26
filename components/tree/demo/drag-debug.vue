<docs>
---
order: 13
debug: true
title:
  zh-CN: Drag Debug
  en-US: Drag Debug
---

## zh-CN

结合连接线、图标和节点拖拽的调试示例。

## en-US

Debug draggable tree together with `showLine`, `showIcon`, and `showLeafIcon`.
</docs>

<template>
  <a-space wrap :style="{ marginBottom: '16px' }">
    <span>
      showLine:
      <a-switch :checked="Boolean(showLine)" @change="onShowLineChange" />
    </span>
    <span>
      showIcon:
      <a-switch v-model:checked="showIcon" />
    </span>
    <span>
      showLeafIcon:
      <a-switch :checked="showLeafIcon" @change="onShowLeafIconChange" />
    </span>
  </a-space>
  <a-tree
    class="draggable-tree"
    :show-line="showLine"
    :show-icon="showIcon"
    :default-expanded-keys="expandedKeys"
    draggable
    block-node
    :tree-data="gData"
    @dragenter="onDragEnter"
    @drop="onDrop"
  >
    <template #icon>
      <carry-out-outlined />
    </template>
  </a-tree>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { CarryOutOutlined } from '@ant-design/icons-vue';
import type {
  AntTreeNodeDragEnterEvent,
  AntTreeNodeDropEvent,
  TreeProps,
} from '@hiltonkohler21/ant-design-vue/es/tree';

const x = 3;
const y = 2;
const z = 1;
const initData: NonNullable<TreeProps['treeData']> = [];

const generateData = (
  _level: number,
  preKey = '0',
  tns: NonNullable<TreeProps['treeData']> = initData,
) => {
  const children: string[] = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    generateData(level, key, tns[index].children);
  });
};

generateData(z);

type TreeDataItem = NonNullable<TreeProps['treeData']>[number];

const gData = ref<NonNullable<TreeProps['treeData']>>(initData);
const showLine = ref<boolean | { showLeafIcon: boolean }>(true);
const showIcon = ref(true);
const showLeafIcon = ref(true);
const expandedKeys = ref<(string | number)[]>(['0-0', '0-0-0', '0-0-0-0']);

const onShowLineChange = (checked: boolean | string | number) => {
  if (checked) {
    showLine.value = showLeafIcon.value ? { showLeafIcon: true } : true;
  } else {
    showLine.value = false;
  }
};

const onShowLeafIconChange = (checked: boolean | string | number) => {
  const val = Boolean(checked);
  showLeafIcon.value = val;
  showLine.value = { showLeafIcon: val };
};

const onDragEnter = (info: AntTreeNodeDragEnterEvent) => {
  console.log(info);
  expandedKeys.value = info.expandedKeys;
};

const onDrop = (info: AntTreeNodeDropEvent) => {
  console.log(info);
  const dropKey = info.node.key;
  const dragKey = info.dragNode.key;
  const dropPos = info.node.pos.split('-');
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

  const loop = (
    data: NonNullable<TreeProps['treeData']>,
    key: string | number,
    callback: (item: TreeDataItem, index: number, arr: NonNullable<TreeProps['treeData']>) => void,
  ) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        callback(data[i], i, data);
        return;
      }
      const children = data[i].children;
      if (children) {
        loop(children, key, callback);
      }
    }
  };

  const data = [...gData.value];
  let dragObj: TreeDataItem | undefined;
  loop(data, dragKey, (item, index, arr) => {
    arr.splice(index, 1);
    dragObj = item;
  });
  if (!dragObj) return;
  const movedNode = dragObj;

  if (!info.dropToGap) {
    loop(data, dropKey, item => {
      item.children = item.children || [];
      item.children.push(movedNode);
    });
  } else if ((info.node.children || []).length > 0 && info.node.expanded && dropPosition === 1) {
    loop(data, dropKey, item => {
      item.children = item.children || [];
      item.children.unshift(movedNode);
    });
  } else {
    let ar: NonNullable<TreeProps['treeData']> = [];
    let i = 0;
    loop(data, dropKey, (_item, index, arr) => {
      ar = arr;
      i = index;
    });
    if (dropPosition === -1) {
      ar.splice(i, 0, movedNode);
    } else {
      ar.splice(i + 1, 0, movedNode);
    }
  }
  gData.value = data;
};
</script>
