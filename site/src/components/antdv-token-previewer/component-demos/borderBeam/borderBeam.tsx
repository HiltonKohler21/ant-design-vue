import { defineComponent } from 'vue';
import { BorderBeam, Card } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <BorderBeam>
        <Card size="small" title="BorderBeam" style={{ width: '260px' }}>
          <p style={{ margin: 0 }}>Animated light beam along container border.</p>
        </Card>
      </BorderBeam>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorBgContainer', 'borderRadiusLG'],
  key: 'default',
};

export default componentDemo;
