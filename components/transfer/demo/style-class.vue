<docs>
---
order: 20
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom Semantic DOM Styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Transfer 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Transfer by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="large" style="width: 100%" class="transfer-style-class-demo">
    <a-transfer
      v-model:target-keys="targetKeys1"
      :data-source="mockData"
      :render="item => item.title"
      :class-names="classNames"
      status="error"
      :styles="stylesObject"
    />
    <a-transfer
      v-model:target-keys="targetKeys2"
      :data-source="mockData"
      :render="item => item.title"
      :class-names="classNames"
      status="warning"
      :styles="stylesFn"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TransferProps } from 'ant-design-vue';

interface MockData {
  key: string;
  title: string;
  description: string;
}

const mockData: MockData[] = Array.from({ length: 20 }).map((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
}));

const initialTargetKeys = mockData.filter(item => Number(item.key) > 10).map(item => item.key);

const targetKeys1 = ref<string[]>([...initialTargetKeys]);
const targetKeys2 = ref<string[]>([...initialTargetKeys]);

const classNames: TransferProps['classNames'] = {
  section: 'custom-transfer-section',
  header: 'custom-transfer-header',
  actions: 'custom-transfer-actions',
};

const stylesObject: TransferProps['styles'] = {
  header: {
    fontWeight: 700,
  },
};

const stylesFn: TransferProps['styles'] = info => {
  if (info.props.status === 'warning') {
    return {
      section: {
        backgroundColor: 'rgba(246, 255, 237, 0.6)',
        borderColor: '#b7eb8f',
      },
      header: {
        color: '#8DBCC7',
        fontWeight: 400,
      },
    };
  }
  return {};
};
</script>

<style scoped>
.transfer-style-class-demo :deep(.custom-transfer-section) {
  background-color: rgba(250, 250, 250, 0.5);
}

.transfer-style-class-demo :deep(.custom-transfer-header) {
  color: var(--ant-color-primary, #1677ff);
}

.transfer-style-class-demo :deep(.custom-transfer-actions button) {
  background-color: rgba(255, 242, 232, 0.6);
}
</style>
