import { defineComponent } from 'vue';
import { Listy } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const items = Array.from({ length: 12 }, (_, idx) => ({
  key: `item-${idx + 1}`,
  label: `Virtual List Item ${idx + 1}`,
}));

const Demo = defineComponent({
  setup() {
    return () => (
      <Listy
        items={items}
        rowKey="key"
        height={160}
        itemHeight={36}
        itemRender={(item: any) => <span>{item.label}</span>}
      />
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgContainer', 'colorBorderSecondary', 'colorText'],
  key: 'default',
};

export default componentDemo;
