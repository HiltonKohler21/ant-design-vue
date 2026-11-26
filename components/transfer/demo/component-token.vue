<docs>
---
order: 21
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

Component Token Debug.

## en-US

Component Token Debug.
</docs>

<template>
  <a-config-provider :theme="transferTheme">
    <a-transfer
      v-model:target-keys="targetKeys"
      v-model:selected-keys="selectedKeys"
      :data-source="mockData"
      :titles="['Source', 'Target']"
      :render="item => item.title"
      @change="onChange"
      @selectChange="onSelectChange"
      @scroll="onScroll"
    />
    <a-transfer status="error" />
    <a-transfer status="warning" show-search />
    <a-transfer
      v-model:target-keys="targetKeys"
      :data-source="mockData"
      :disabled="disabled"
      :show-search="showSearch"
      :filter-option="
        (inputValue, item) =>
          (item.title || '').includes(inputValue) || (item.tag || '').includes(inputValue)
      "
    >
      <template
        #children="{
          direction,
          filteredItems,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
          onItemSelectAll,
          onItemSelect,
        }"
      >
        <a-table
          :row-selection="
            getRowSelection({
              disabled: listDisabled,
              selectedKeys: listSelectedKeys,
              onItemSelectAll,
              onItemSelect,
            })
          "
          :columns="direction === 'left' ? leftTableColumns : rightTableColumns"
          :data-source="filteredItems"
          size="small"
          :style="{ pointerEvents: listDisabled ? 'none' : undefined }"
          :custom-row="
            ({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) return;
                onItemSelect(key as string, !listSelectedKeys.includes(key as string));
              },
            })
          "
        >
          <template #bodyCell="{ column, text }">
            <a-tag v-if="column.dataIndex === 'tag'">{{ text }}</a-tag>
          </template>
        </a-table>
      </template>
    </a-transfer>
    <a-space style="margin-top: 16px">
      <a-switch
        v-model:checked="disabled"
        un-checked-children="disabled"
        checked-children="disabled"
      />
      <a-switch
        v-model:checked="showSearch"
        un-checked-children="showSearch"
        checked-children="showSearch"
      />
    </a-space>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type {
  ConfigProviderProps,
  TableColumnsType,
  TransferProps,
} from '@hiltonkohler21/ant-design-vue';

interface RecordType {
  key: string;
  title: string;
  description: string;
  disabled: boolean;
  tag: string;
}

const mockTags = ['cat', 'dog', 'bird'];

const mockData: RecordType[] = Array.from({ length: 20 }).map((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
  disabled: i % 4 === 0,
  tag: mockTags[i % 3],
}));

const leftTableColumns: TableColumnsType<RecordType> = [
  {
    dataIndex: 'title',
    title: 'Name',
  },
  {
    dataIndex: 'tag',
    title: 'Tag',
  },
  {
    dataIndex: 'description',
    title: 'Description',
  },
];

const rightTableColumns: TableColumnsType<RecordType> = [
  {
    dataIndex: 'title',
    title: 'Name',
  },
];

const initialTargetKeys = mockData.filter(item => Number(item.key) > 10).map(item => item.key);

const targetKeys = ref<string[]>(initialTargetKeys);
const selectedKeys = ref<string[]>([]);
const disabled = ref<boolean>(false);
const showSearch = ref<boolean>(false);

const onChange: TransferProps['onChange'] = (nextTargetKeys, direction, moveKeys) => {
  console.log('targetKeys:', nextTargetKeys);
  console.log('direction:', direction);
  console.log('moveKeys:', moveKeys);
};

const onSelectChange: TransferProps['onSelectChange'] = (
  sourceSelectedKeys,
  targetSelectedKeys,
) => {
  console.log('sourceSelectedKeys:', sourceSelectedKeys);
  console.log('targetSelectedKeys:', targetSelectedKeys);
};

const onScroll: TransferProps['onScroll'] = (direction, e) => {
  console.log('direction:', direction);
  console.log('target:', e.target);
};

const getRowSelection = ({
  disabled: listDisabled,
  selectedKeys: listSelectedKeys,
  onItemSelectAll,
  onItemSelect,
}: {
  disabled: boolean;
  selectedKeys: string[];
  onItemSelectAll: (keys: string[], selected: boolean) => void;
  onItemSelect: (key: string, selected: boolean) => void;
}) => ({
  getCheckboxProps: (item: RecordType) => ({
    disabled: listDisabled || item.disabled,
  }),
  onSelectAll(selected: boolean, selectedRows: RecordType[]) {
    const treeSelectedKeys = selectedRows.filter(item => !item.disabled).map(({ key }) => key);
    onItemSelectAll(treeSelectedKeys, selected);
  },
  onSelect({ key }: RecordType, selected: boolean) {
    onItemSelect(key, selected);
  },
  selectedRowKeys: listSelectedKeys,
});

const transferTheme: ConfigProviderProps['theme'] = {
  components: {
    Transfer: {
      listWidth: 40,
      listWidthLG: 50,
      listHeight: 30,
      itemHeight: 20,
      itemPaddingBlock: 10,
      headerHeight: 18,
    } as Record<string, any>,
  },
};
</script>
