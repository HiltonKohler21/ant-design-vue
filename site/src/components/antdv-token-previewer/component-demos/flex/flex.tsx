import { defineComponent } from 'vue';
import { Button, Flex } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Flex gap="small" wrap="wrap" align="center">
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="text">Text</Button>
      </Flex>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'borderRadius', 'paddingSM'],
  key: 'default',
};

export default componentDemo;
