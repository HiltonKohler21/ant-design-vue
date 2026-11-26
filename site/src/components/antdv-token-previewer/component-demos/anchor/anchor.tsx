import { Anchor } from '@hiltonkohler21/ant-design-vue';
import type { ComponentDemo } from '../../interface';

const items = [
  { key: 'basic', href: '#', title: 'Basic demo' },
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

const Demo = () => {
  return (
    <div style={{ padding: '12px' }}>
      <Anchor items={items} />
    </div>
  );
};

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorSplit', 'colorBgContainer'],
  key: 'anchor',
};

export default componentDemo;
