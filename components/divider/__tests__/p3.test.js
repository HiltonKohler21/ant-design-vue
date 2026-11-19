import { mount } from '@vue/test-utils';
import Switch from '../../switch';
import Checkbox from '../../checkbox';
import Avatar from '../../avatar';
import Divider from '../../divider';

describe('upstream P3: 零散属性第一批', () => {
  it('Switch defaultValue 作为非受控初始值', () => {
    const wrapper = mount(Switch, { props: { defaultValue: true } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-switch-checked');
  });

  it('Checkbox required 透传到原生 input', () => {
    const wrapper = mount(Checkbox, { props: { required: true } });
    expect(wrapper.find('input').element.getAttribute('required')).not.toBeNull();
  });

  it('Avatar.Group max 别名 maxCount', () => {
    const wrapper = mount(Avatar.Group, {
      props: { max: 1 },
      slots: { default: () => [<Avatar>A</Avatar>, <Avatar>B</Avatar>] },
    });
    expect(wrapper.html()).toContain('+1');
  });

  it('Divider variant=dotted', () => {
    const wrapper = mount(Divider, { props: { variant: 'dotted' } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-divider-dotted');
    expect(wrapper.element.getAttribute('class')).not.toContain('ant-divider-dashed');
  });

  it('Divider dashed 兼容旧属性', () => {
    const wrapper = mount(Divider, { props: { dashed: true } });
    expect(wrapper.element.getAttribute('class')).toContain('ant-divider-dashed');
  });
});
