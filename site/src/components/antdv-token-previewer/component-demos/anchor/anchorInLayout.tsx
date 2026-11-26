import { defineComponent } from 'vue';
import { Anchor, theme } from '@hiltonkohler21/ant-design-vue';
import type { ComponentDemo } from '../../interface';

const items = [
  { key: 'basic', href: '#components-anchor-demo-basic', title: 'Basic demo' },
  { key: 'static', href: '#components-anchor-demo-static', title: 'Static demo' },
  {
    key: 'api',
    href: '#api',
    title: 'API',
    children: [
      { key: 'anchor-props', href: '#Anchor-Props', title: 'Anchor Props' },
      { key: 'link-props', href: '#Link-Props', title: 'Link Props' },
    ],
  },
];

const Demo = defineComponent({
  setup() {
    const { token } = theme.useToken();

    return () => {
      return (
        <div style={{ background: token.value.colorBorderSecondary, padding: '12px' }}>
          <Anchor items={items} />
        </div>
      );
    };
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorSplit'],
  key: 'anchorInLayout',
};

export default componentDemo;
