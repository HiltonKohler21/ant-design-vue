import { DatePicker } from '@hiltonkohler21/ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = () => <DatePicker status={'warning'} />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorWarning', 'colorWarningBorder', 'colorWarningHover', 'colorWarningOutline'],
  key: 'warning',
};

export default componentDemo;
