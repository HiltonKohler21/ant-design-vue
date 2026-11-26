import { Calendar } from '@hiltonkohler21/ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = () => <Calendar />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorPrimaryHover', 'colorBgContainer'],
  key: 'default',
};

export default componentDemo;
