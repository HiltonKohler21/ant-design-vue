<docs>
---
order: 11
version: 4.3.0
title:
  zh-CN: 自定义操作按钮
  en-US: Custom Actions
---

## zh-CN

通过 `actions` 传入自定义按钮元素，支持加载态、图标和自定义点击事件处理。

## en-US

Customize operation buttons via `actions` with custom icons, loading states, and click handlers.
</docs>

<template>
  <a-transfer
    v-model:target-keys="targetKeys"
    v-model:selected-keys="selectedKeys"
    :data-source="mockData"
    :render="item => item.title"
    :list-style="{ width: '140px', height: '260px' }"
    :actions="actions"
    @change="handleChange"
    @select-change="handleSelectChange"
  />
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import { Button, message } from '@hiltonkohler21/ant-design-vue';
import type { TransferProps } from '@hiltonkohler21/ant-design-vue';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons-vue';

interface RecordType {
  key: string;
  title: string;
  description: string;
}

const mockData: RecordType[] = Array.from({ length: 20 }).map((_, i) => ({
  key: i.toString(),
  title: `Content ${i + 1}`,
  description: `Description ${i + 1}`,
}));

const initialTargetKeys = mockData.filter(item => Number(item.key) > 10).map(item => item.key);

const targetKeys = ref<string[]>([...initialTargetKeys]);
const selectedKeys = ref<string[]>([]);
const loadingRight = ref(false);
const loadingLeft = ref(false);

const handleChange: TransferProps['onChange'] = (newTargetKeys, direction, moveKeys) => {
  targetKeys.value = newTargetKeys;
  if (direction === 'right') {
    loadingRight.value = true;
    setTimeout(() => {
      loadingRight.value = false;
      message.success(`Moved ${moveKeys.length} items to the right`);
    }, 500);
  } else {
    loadingLeft.value = true;
    setTimeout(() => {
      loadingLeft.value = false;
      message.success(`Moved ${moveKeys.length} items to the left`);
    }, 500);
  }
};

const handleSelectChange: TransferProps['onSelectChange'] = (
  sourceSelectedKeys,
  targetSelectedKeys,
) => {
  selectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
};

const rightButtonDisabled = computed(
  () =>
    selectedKeys.value.length === 0 ||
    selectedKeys.value.every(key => targetKeys.value.includes(key)),
);

const leftButtonDisabled = computed(
  () =>
    selectedKeys.value.length === 0 ||
    selectedKeys.value.every(key => !targetKeys.value.includes(key)),
);

const actions = computed(() => [
  h(
    Button,
    {
      key: 'to-right',
      type: 'primary',
      size: 'small',
      icon: h(DoubleRightOutlined),
      loading: loadingRight.value,
      disabled: rightButtonDisabled.value,
    },
    () => 'Right',
  ),
  h(
    Button,
    {
      key: 'to-left',
      type: 'primary',
      size: 'small',
      icon: h(DoubleLeftOutlined),
      loading: loadingLeft.value,
      disabled: leftButtonDisabled.value,
    },
    () => 'Left',
  ),
]);
</script>
