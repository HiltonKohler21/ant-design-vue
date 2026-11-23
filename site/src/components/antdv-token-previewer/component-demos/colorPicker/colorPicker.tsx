import { defineComponent } from 'vue';
import { ColorPicker, Space } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Space>
        <ColorPicker defaultValue="#1677ff" showText />
        <ColorPicker defaultValue="#52c41a" />
      </Space>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorBorder', 'colorBgElevated'],
  key: 'default',
};

export default componentDemo;
