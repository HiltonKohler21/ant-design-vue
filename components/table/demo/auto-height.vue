<docs>
---
order: 18.5
title:
  zh-CN: 自动高度
  en-US: Auto height
---

## zh-CN

通过封装，实现 Table 始终自动填充容器高度。

## en-US

Wrap Table to make it always fill the container height automatically.
</docs>

<template>
  <a-flex vertical gap="middle" align="start">
    <a-switch
      v-model:checked="hasData"
      checked-children="More Data"
      un-checked-children="More Data"
    />
    <div
      :style="{
        height: '400px',
        boxSizing: 'border-box',
        background: 'rgba(140, 140, 140, 0.04)',
        padding: '16px',
        alignSelf: 'stretch',
        width: '100%',
      }"
    >
      <a-table
        ref="tableRef"
        :columns="columns"
        :data-source="mergedData"
        :scroll="{ y: scrollY }"
        :style="{ height: '100%' }"
        :styles="tableStyles"
        :class-names="tableClassNames"
      />
    </div>
  </a-flex>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { TableColumnsType, TableProps, TableRef } from 'ant-design-vue';

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
}

const measureClassNames = {
  header: 'measure-header',
  pagination: 'measure-pagination',
};

const tableClassNames: TableProps<DataType>['classNames'] = {
  header: {
    wrapper: measureClassNames.header,
  },
  pagination: {
    root: measureClassNames.pagination,
  },
};

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: '20%',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: '20%',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: '60%',
  },
];

const genData = (length: number): DataType[] =>
  Array.from({ length }).map((_, index) => ({
    key: index,
    name: `Edward King ${index}`,
    age: 32 + index,
    address: `London, Park Lane no. ${index}`,
  }));

const dataMore = genData(30);
const dataLess = genData(2);

const hasData = ref(true);
const mergedData = computed(() => (hasData.value ? dataMore : dataLess));

const tableRef = ref<TableRef>();
const scrollY = ref(240);
const sectionHeight = ref(300);

const tableStyles = computed<TableProps<DataType>['styles']>(() => ({
  section: {
    height: `${sectionHeight.value}px`,
  },
}));

const getHeight = (target: string | HTMLElement | undefined) => {
  const rootEl = tableRef.value?.nativeElement;
  const ele =
    typeof target === 'string' ? rootEl?.querySelector<HTMLElement>(`.${target}`) : target;
  if (ele) {
    const computedStyle = getComputedStyle(ele);
    const marginTop = Number.parseFloat(computedStyle.marginTop) || 0;
    const marginBottom = Number.parseFloat(computedStyle.marginBottom) || 0;
    return ele.getBoundingClientRect().height + marginTop + marginBottom;
  }
  return 0;
};

let resizeObserver: ResizeObserver | null = null;

const measure = () => {
  const element = tableRef.value?.nativeElement;
  if (!element) return;
  const totalHeight = getHeight(element);
  if (!totalHeight) return;
  const headerHeight = getHeight(measureClassNames.header);
  const paginationHeight = getHeight(measureClassNames.pagination);
  scrollY.value = Math.max(0, Math.floor(totalHeight - headerHeight - paginationHeight));
  sectionHeight.value = Math.max(0, Math.floor(totalHeight - paginationHeight));
};

onMounted(() => {
  nextTick(() => {
    measure();
    const element = tableRef.value?.nativeElement;
    if (element && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(element);
    }
  });
});

watch(hasData, () => {
  nextTick(measure);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});
</script>
