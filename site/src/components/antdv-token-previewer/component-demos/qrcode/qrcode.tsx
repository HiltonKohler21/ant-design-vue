import { defineComponent } from 'vue';
import { QRCode, Space } from '@hiltonkohler21/ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Space size="middle" wrap>
        <QRCode value="https://hiltonkohler21.github.io/ant-design-vue/" size={120} />
        <QRCode
          value="https://hiltonkohler21.github.io/ant-design-vue/"
          size={120}
          status="expired"
        />
      </Space>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorText', 'colorBgContainer', 'borderRadiusLG'],
  key: 'default',
};

export default componentDemo;
