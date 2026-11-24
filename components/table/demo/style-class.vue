<docs>
---
order: 30.4
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Table 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Table by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="table-style-class-demo">
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :class-names="objectClassNames"
      :styles="objectStyles"
      :pagination="{ pageSize: 3, simple: true }"
      :title="() => 'Table Object Styles'"
      :footer="() => 'Table Object Footer'"
      size="small"
      virtual
      :scroll="{ x: 'max-content', y: 240 }"
    />
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :class-names="fnClassNames"
      :styles="fnStyles"
      :pagination="{ pageSize: 3, simple: true }"
      :title="() => 'Table Function Styles'"
      :footer="() => 'Table Function Footer'"
      size="medium"
      :scroll="{ x: 'max-content' }"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import type { TableColumnsType, TableProps } from 'ant-design-vue';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  description: string;
}

const columns: TableColumnsType<DataType> = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: 130 },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 80 },
  { title: 'Address', dataIndex: 'address', key: 'address', width: 200 },
  { title: 'Description', dataIndex: 'description', key: 'description', width: 300 },
];

const dataSource: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sydney No. 2 Lake Park',
    description: 'This user is disabled.',
  },
];

const objectClassNames: TableProps<DataType>['classNames'] = {
  root: 'custom-table-root',
  title: 'custom-table-title',
  header: {
    cell: 'custom-table-header-cell',
  },
};

const objectStyles: TableProps<DataType>['styles'] = {
  root: {
    padding: '10px',
    borderRadius: '10px',
  },
  title: {
    fontWeight: 600,
    fontSize: '15px',
  },
  pagination: {
    root: {
      padding: '8px 10px',
    },
  },
  body: {
    row: {
      outline: '1px dashed rgba(106, 90, 205, 0.2)',
    },
    cell: {
      outline: '1px dashed rgba(106, 90, 205, 0.16)',
    },
  },
};

const fnClassNames: TableProps<DataType>['classNames'] = info => {
  if (info?.props?.size === 'medium') {
    return {
      root: 'custom-table-root custom-table-root-accent',
    };
  }
  return {};
};

const fnStyles: TableProps<DataType>['styles'] = info => {
  if (info?.props?.size === 'medium') {
    return {
      root: {
        borderRadius: '10px',
        padding: '10px',
      },
      title: {
        backgroundImage: 'linear-gradient(90deg, #5b4bd6, #7c66f5)',
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: 600,
        padding: '12px 16px',
      },
      footer: {
        color: 'var(--ant-color-text-secondary, #6b7280)',
        fontStyle: 'italic',
      },
      header: {
        cell: {
          fontWeight: 600,
          fontSize: '14px',
          color: '#7c66f5',
          backgroundColor: 'rgba(106, 90, 205, 0.08)',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(106, 90, 205, 0.25)',
        },
      },
      pagination: {
        root: {
          padding: '8px 10px',
        },
        item: {
          borderColor: 'rgba(106, 90, 205, 0.45)',
        },
      },
    };
  }
  return {};
};
</script>

<style scoped>
.table-style-class-demo :deep(.custom-table-root) {
  border-radius: 12px;
  border: 1px solid var(--ant-color-border-secondary, rgba(128, 128, 128, 0.2));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background: var(--ant-color-bg-container);
}

.table-style-class-demo :deep(.custom-table-root-accent) {
  border-color: rgba(106, 90, 205, 0.35);
  box-shadow: 0 4px 20px rgba(91, 75, 214, 0.14);
}
</style>
