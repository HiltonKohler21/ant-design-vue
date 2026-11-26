import { defineComponent, ref } from 'vue';
import { TreeSelect } from '@hiltonkohler21/ant-design-vue';
import type { ComponentDemo } from '../../interface';

const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          { value: 'leaf1', title: 'leaf1' },
          { value: 'leaf2', title: 'leaf2' },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [{ value: 'leaf3', title: 'leaf3' }],
      },
    ],
  },
];

const Demo = defineComponent({
  setup() {
    const value = ref(undefined);
    const onChange = () => {
      value.value = value.value;
    };
    return () => {
      return (
        <TreeSelect
          showSearch
          style={{ width: '100%' }}
          value={value.value}
          dropdownStyle={{ maxHeight: '400px', overflow: 'auto' }}
          placeholder="Please select"
          allowClear
          treeDefaultExpandAll
          treeData={treeData}
          onChange={onChange}
        />
      );
    };
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: [
    'colorPrimary',
    'colorPrimaryActive',
    'controlOutline',
    'colorBgElevated',
    'colorBgContainer',
  ],
  key: 'default',
};

export default componentDemo;
