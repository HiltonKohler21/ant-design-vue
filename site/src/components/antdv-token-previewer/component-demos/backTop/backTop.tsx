import { defineComponent, ref } from 'vue';
import { BackTop } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const containerRef = ref<HTMLDivElement | null>(null);

    return () => (
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <BackTop
          visibilityHeight={0}
          target={() => containerRef.value || window}
          style={{ position: 'static' }}
        />
        <span>Scroll back to top button preview</span>
      </div>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorTextDescription', 'colorBgElevated', 'boxShadowSecondary'],
  key: 'default',
};

export default componentDemo;
