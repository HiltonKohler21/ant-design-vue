import { Rate } from '@hiltonkohler21/ant-design-vue';

import type { ComponentDemo } from '../../interface';

const Demo = () => <Rate />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorFillContent'],
  key: 'default',
};

export default componentDemo;
