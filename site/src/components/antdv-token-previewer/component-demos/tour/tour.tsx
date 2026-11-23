import { computed, defineComponent, ref } from 'vue';
import { Button, Space, Tour } from 'ant-design-vue';
import type { TourProps } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const open = ref(false);
    const targetRef = ref<any>(null);

    const steps = computed<TourProps['steps']>(() => [
      {
        title: 'Theme Preview',
        description: 'Inspect how Tour adapts to your custom theme tokens.',
        target: () => targetRef.value?.$el,
      },
    ]);

    return () => (
      <>
        <Space>
          <Button type="primary" onClick={() => (open.value = true)}>
            Begin Tour
          </Button>
          <Button ref={targetRef}>Target</Button>
        </Space>
        <Tour open={open.value} steps={steps.value} onClose={() => (open.value = false)} />
      </>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgElevated', 'colorPrimary', 'borderRadiusLG'],
  key: 'default',
};

export default componentDemo;
