import { defineComponent } from 'vue';
import { Watermark } from '@hiltonkohler21/ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Watermark content="Ant Design Vue">
        <div style={{ height: '140px' }} />
      </Watermark>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorText', 'fontSize'],
  key: 'default',
};

export default componentDemo;
