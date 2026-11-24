<docs>
---
order: 34
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

组件 Token

## en-US

Component Token
</docs>

<template>
  <a-form
    layout="inline"
    class="table-demo-control-bar"
    :style="{
      marginBottom: '16px',
      display: 'flex',
      flexWrap: 'wrap',
      rowGap: '8px',
    }"
  >
    <a-form-item label="Bordered">
      <a-switch v-model:checked="bordered" />
    </a-form-item>
    <a-form-item label="loading">
      <a-switch v-model:checked="loading" />
    </a-form-item>
    <a-form-item label="Title">
      <a-switch v-model:checked="showTitle" />
    </a-form-item>
    <a-form-item label="Column Header">
      <a-switch v-model:checked="showHeader" />
    </a-form-item>
    <a-form-item label="Footer">
      <a-switch v-model:checked="showFooter" />
    </a-form-item>
    <a-form-item label="Expandable">
      <a-switch v-model:checked="expandable" />
    </a-form-item>
    <a-form-item label="Checkbox">
      <a-switch v-model:checked="hasRowSelection" />
    </a-form-item>
    <a-form-item label="Fixed Header">
      <a-switch v-model:checked="yScroll" />
    </a-form-item>
    <a-form-item label="Has Data">
      <a-switch v-model:checked="hasData" />
    </a-form-item>
    <a-form-item label="Ellipsis">
      <a-switch v-model:checked="ellipsis" />
    </a-form-item>
    <a-form-item label="Size">
      <a-radio-group v-model:value="size">
        <a-radio-button value="large">Large</a-radio-button>
        <a-radio-button value="medium">Medium</a-radio-button>
        <a-radio-button value="small">Small</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Table Scroll">
      <a-radio-group v-model:value="xScroll">
        <a-radio-button value="unset">Unset</a-radio-button>
        <a-radio-button value="scroll">Scroll</a-radio-button>
        <a-radio-button value="fixed">Fixed Columns</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Table Layout">
      <a-radio-group v-model:value="tableLayout">
        <a-radio-button value="unset">Unset</a-radio-button>
        <a-radio-button value="fixed">Fixed</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Pagination Top">
      <a-radio-group v-model:value="top">
        <a-radio-button value="topStart">TopStart</a-radio-button>
        <a-radio-button value="topCenter">TopCenter</a-radio-button>
        <a-radio-button value="topEnd">TopEnd</a-radio-button>
        <a-radio-button value="none">None</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Pagination Bottom">
      <a-radio-group v-model:value="bottom">
        <a-radio-button value="bottomStart">BottomStart</a-radio-button>
        <a-radio-button value="bottomCenter">BottomCenter</a-radio-button>
        <a-radio-button value="bottomEnd">BottomEnd</a-radio-button>
        <a-radio-button value="none">None</a-radio-button>
      </a-radio-group>
    </a-form-item>
  </a-form>
  <a-config-provider :theme="tableTheme">
    <a-table
      :bordered="bordered"
      :loading="loading"
      :size="size"
      :expanded-row-render="expandable ? expandedRowRender : undefined"
      :title="showTitle ? defaultTitle : undefined"
      :show-header="showHeader"
      :footer="showFooter ? defaultFooter : undefined"
      :row-selection="hasRowSelection ? {} : undefined"
      :scroll="scroll"
      :table-layout="tableLayout === 'unset' ? undefined : (tableLayout as TableProps['tableLayout'])"
      :pagination="{ placement: [top, bottom] as any }"
      :columns="tableColumns"
      :data-source="hasData ? dataSource : []"
    >
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'action'">
          <a-space size="middle">
            <a>Delete</a>
            <a>
              <a-space>
                More actions
                <DownOutlined />
              </a-space>
            </a>
          </a-space>
        </template>
      </template>
    </a-table>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import type { ConfigProviderProps, TableColumnsType, TableProps } from 'ant-design-vue';

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
  description: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    filters: [
      {
        text: 'London',
        value: 'London',
      },
      {
        text: 'New York',
        value: 'New York',
      },
    ],
    onFilter: (value, record) => record.address.indexOf(value as string) === 0,
  },
  {
    title: 'Action',
    key: 'action',
    sorter: true,
  },
];

const dataSource: DataType[] = Array.from({ length: 10 }).map((_, i) => ({
  key: i,
  name: 'John Brown',
  age: Number(`${i}2`),
  address: `New York No. ${i} Lake Park`,
  description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
}));

const expandedRowRender = ({ record }: { record: DataType }) =>
  h('p', { style: { margin: '0' } }, record.description);
const defaultTitle = () => 'Here is title';
const defaultFooter = () => 'Here is footer';

const bordered = ref(false);
const loading = ref(false);
const size = ref<TableProps['size']>('large');
const expandable = ref(true);
const showTitle = ref(false);
const showHeader = ref(true);
const showFooter = ref(true);
const hasRowSelection = ref(true);
const hasData = ref(true);
const tableLayout = ref<string>('unset');
const top = ref<string>('none');
const bottom = ref<string>('bottomEnd');
const ellipsis = ref(false);
const yScroll = ref(false);
const xScroll = ref<string>('unset');

const scroll = computed(() => {
  const res: { x?: number | string; y?: number | string } = {};
  if (yScroll.value) {
    res.y = 240;
  }
  if (xScroll.value !== 'unset') {
    res.x = '100vw';
  }
  return res;
});

const tableColumns = computed<TableColumnsType<DataType>>(() => {
  const nextColumns: TableColumnsType<DataType> = columns.map(item => ({
    ...item,
    ellipsis: ellipsis.value,
  }));
  if (xScroll.value === 'fixed') {
    nextColumns[0] = { ...nextColumns[0], fixed: true };
    nextColumns[nextColumns.length - 1] = {
      ...nextColumns[nextColumns.length - 1],
      fixed: 'right',
    };
  }
  return nextColumns;
});

const tableTheme: ConfigProviderProps['theme'] = {
  components: {
    Table: {
      colorBgContainer: '#e6f4ff',
      headerBg: '#1677ff',
      headerColor: '#fff',
      headerSortActiveBg: '#0958d9',
      headerSortHoverBg: '#69b1ff',
      bodySortBg: '#1677ff10',
      rowHoverBg: '#1677ff10',
      rowSelectedBg: '#bae0ff',
      rowSelectedHoverBg: '#91caff',
      rowExpandedBg: '#1677ff10',
      cellPaddingBlock: 20,
      cellPaddingInline: 20,
      cellPaddingBlockMD: 16,
      cellPaddingInlineMD: 16,
      cellPaddingBlockSM: 12,
      cellPaddingInlineSM: 12,
      borderColor: '#e6f4ff',
      headerBorderRadius: 0,
      footerBg: '#1677ff',
      footerColor: '#fff',
      cellFontSize: 16,
      cellFontSizeMD: 16,
      cellFontSizeSM: 14,
      headerSplitColor: '#fff',
      headerFilterHoverBg: 'rgba(0, 0, 0, 0.12)',
      filterDropdownMenuBg: '#fff',
      filterDropdownBg: '#fff',
      expandIconBg: '#e6f4ff',
    } as Record<string, any>,
  },
};
</script>
