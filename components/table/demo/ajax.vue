<docs>
---
order: 11
title:
  en-US: Ajax
  zh-CN: 远程加载数据
---

## zh-CN

这个例子通过简单的 ajax 读取方式，演示了如何从服务端读取并展现数据，具有筛选、排序等功能以及页面 loading 效果。开发者可以自行接入其他数据处理方式。

另外，本例也展示了筛选排序功能如何交给服务端实现，列不需要指定具体的 `onFilter` 和 `sorter` 函数，而是在把筛选和排序的参数发到服务端来处理。

当使用 `rowSelection` 时，请设置 `rowSelection.preserveSelectedRowKeys` 属性以保留 `key`。

## en-US

This example shows how to fetch and present data from a remote server, and how to implement filtering and sorting in server side by sending related parameters to server.

Setting `rowSelection.preserveSelectedRowKeys` to keep the `key` when enable selection.

</docs>

<template>
  <a-table
    :columns="columns"
    :row-key="record => record.id"
    :data-source="data"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import type {
  TableColumnsType,
  TablePaginationConfig,
  TableProps,
} from '@hiltonkohler21/ant-design-vue';

interface DataType {
  id: string;
  name: string;
  gender: 'male' | 'female';
  email: string;
}

interface TableParams {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string | null;
  filters?: Record<string, any>;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
    ],
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];

const firstNames = [
  'Olivia',
  'Ethan',
  'Sophia',
  'Liam',
  'Ava',
  'Noah',
  'Emma',
  'Lucas',
  'Mia',
  'Mason',
];
const lastNames = [
  'Brown',
  'Green',
  'Clark',
  'Walker',
  'Hall',
  'Young',
  'Allen',
  'King',
  'Wright',
  'Scott',
];

const fallbackUsers: DataType[] = Array.from({ length: 100 }, (_, i) => {
  const first = firstNames[i % firstNames.length];
  const last = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
  const gender: 'male' | 'female' = i % 2 === 0 ? 'female' : 'male';
  return {
    id: `user-${i + 1}`,
    name: `${first} ${last}`,
    gender,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@example.com`,
  };
});

const getLocalFallbackData = (params: TableParams) => {
  let list = [...fallbackUsers];
  const genderFilters = params.filters?.gender;
  if (Array.isArray(genderFilters) && genderFilters.length > 0) {
    list = list.filter(item => genderFilters.includes(item.gender));
  }
  if (params.sortField === 'name' && params.sortOrder) {
    list.sort((a, b) =>
      params.sortOrder === 'ascend' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    );
  }
  const current = params.pagination.current || 1;
  const pageSize = params.pagination.pageSize || 10;
  const start = (current - 1) * pageSize;
  return {
    rows: list.slice(start, start + pageSize),
    total: list.length,
  };
};

const data = ref<DataType[]>([]);
const loading = ref(false);
const tableParams = ref<TableParams>({
  pagination: {
    current: 1,
    pageSize: 10,
    total: 100,
  },
});

const pagination = computed(() => tableParams.value.pagination);

const buildQueryString = (params: TableParams) => {
  const search = new URLSearchParams();
  search.append('limit', String(params.pagination.pageSize || 10));
  search.append('page', String(params.pagination.current || 1));
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        search.append(key, String(value));
      }
    });
  }
  if (params.sortField && params.sortOrder) {
    search.append('orderby', params.sortField);
    search.append('order', params.sortOrder === 'ascend' ? 'asc' : 'desc');
  }
  return search.toString();
};

const fetchData = async () => {
  loading.value = true;
  const currentParams = tableParams.value;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://660d2bd96ddfa2943b33731c.mockapi.io/api/users?${buildQueryString(currentParams)}`,
      { signal: controller.signal },
    );
    clearTimeout(timer);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const list = await res.json();
    if (Array.isArray(list)) {
      data.value = list;
      tableParams.value = {
        ...currentParams,
        pagination: {
          ...currentParams.pagination,
          total: 100,
        },
      };
    } else {
      const fallback = getLocalFallbackData(currentParams);
      data.value = fallback.rows;
      tableParams.value = {
        ...currentParams,
        pagination: {
          ...currentParams.pagination,
          total: fallback.total,
        },
      };
    }
  } catch {
    const fallback = getLocalFallbackData(currentParams);
    data.value = fallback.rows;
    tableParams.value = {
      ...currentParams,
      pagination: {
        ...currentParams.pagination,
        total: fallback.total,
      },
    };
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const handleTableChange: TableProps<DataType>['onChange'] = (pag, filters, sorter) => {
  const singleSorter = Array.isArray(sorter) ? undefined : sorter;
  tableParams.value = {
    pagination: pag,
    filters,
    sortField: singleSorter?.field as string | undefined,
    sortOrder: singleSorter?.order ?? null,
  };
  fetchData();
};
</script>
