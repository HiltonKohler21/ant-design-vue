import { defineComponent } from 'vue';
import { FloatButton, Space } from 'ant-design-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Space size="middle">
        <FloatButton style={{ position: 'static' }} />
        <FloatButton
          type="primary"
          style={{ position: 'static' }}
          v-slots={{ icon: () => <QuestionCircleOutlined /> }}
        />
        <FloatButton shape="square" description="HELP" style={{ position: 'static' }} />
      </Space>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgElevated', 'colorPrimary', 'boxShadowSecondary'],
  key: 'default',
};

export default componentDemo;
