import { mount } from '@vue/test-utils';
import Card from '..';

describe('Card variant', () => {
  it('variant=borderless 移除 bordered class', () => {
    const wrapper = mount(Card, { props: { variant: 'borderless' } });
    expect(wrapper.element.getAttribute('class')).not.toContain('ant-card-bordered');
  });

  it('默认 outlined 保留 bordered class', () => {
    const wrapper = mount(Card);
    expect(wrapper.element.getAttribute('class')).toContain('ant-card-bordered');
  });

  it('bordered=false 兼容旧属性', () => {
    const wrapper = mount(Card, { props: { bordered: false } });
    expect(wrapper.element.getAttribute('class')).not.toContain('ant-card-bordered');
  });
});
