import { defineComponent, ref } from 'vue';
import { Affix, Button } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const containerRef = ref<HTMLDivElement | null>(null);

    return () => (
      <div
        ref={containerRef}
        style={{
          height: '120px',
          overflowY: 'auto',
          border: '1px solid rgba(5, 5, 5, 0.06)',
          borderRadius: '6px',
          padding: '12px',
        }}
      >
        <div style={{ height: '240px', paddingTop: '12px' }}>
          <Affix offsetTop={8} target={() => containerRef.value || window}>
            <Button type="primary">Affix top</Button>
          </Affix>
        </div>
      </div>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'zIndexPopupBase'],
  key: 'default',
};

export default componentDemo;
