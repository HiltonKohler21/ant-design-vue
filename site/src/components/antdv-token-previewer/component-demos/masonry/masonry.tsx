import { defineComponent } from 'vue';
import { Card, Masonry } from '@hiltonkohler21/ant-design-vue';
import type { ComponentDemo } from '../../interface';

const items = [
  { key: '1', height: 64, label: 'Item 1' },
  { key: '2', height: 88, label: 'Item 2' },
  { key: '3', height: 72, label: 'Item 3' },
  { key: '4', height: 80, label: 'Item 4' },
  { key: '5', height: 68, label: 'Item 5' },
  { key: '6', height: 76, label: 'Item 6' },
];

const Demo = defineComponent({
  setup() {
    return () => (
      <Masonry
        items={items}
        columns={3}
        gutter={8}
        v-slots={{
          item: ({ item }: { item: (typeof items)[number] }) => (
            <Card size="small" style={{ height: `${item.height}px` }}>
              {item.label}
            </Card>
          ),
        }}
      />
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgContainer', 'colorBorderSecondary', 'borderRadiusLG'],
  key: 'default',
};

export default componentDemo;
