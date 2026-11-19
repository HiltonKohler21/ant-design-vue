import { mount } from '@vue/test-utils';
import Input from '..';
import ConfigProvider from '../../config-provider';

const { TextArea } = Input;

/** 取根元素的 class 字符串（不同 DOM 位置：纯 input / affix wrapper / textarea） */
const rootClasses = wrapper => wrapper.element.getAttribute('class') || '';

describe('Input.Variant', () => {
  it('defaults to outlined (no variant class emitted)', () => {
    const wrapper = mount(Input);
    expect(rootClasses(wrapper)).not.toMatch(/ant-input-(filled|underlined|borderless)/);
  });

  it('supports filled', () => {
    const wrapper = mount(Input, { props: { variant: 'filled' } });
    expect(rootClasses(wrapper)).toContain('ant-input-filled');
  });

  it('supports underlined', () => {
    const wrapper = mount(Input, { props: { variant: 'underlined' } });
    expect(rootClasses(wrapper)).toContain('ant-input-underlined');
  });

  it('supports borderless via variant', () => {
    const wrapper = mount(Input, { props: { variant: 'borderless' } });
    expect(rootClasses(wrapper)).toContain('ant-input-borderless');
  });

  it('keeps legacy bordered={false} working', () => {
    const wrapper = mount(Input, { props: { bordered: false } });
    expect(rootClasses(wrapper)).toContain('ant-input-borderless');
  });

  it('variant wins over legacy bordered', () => {
    const wrapper = mount(Input, { props: { bordered: false, variant: 'filled' } });
    expect(rootClasses(wrapper)).toContain('ant-input-filled');
    expect(rootClasses(wrapper)).not.toContain('ant-input-borderless');
  });

  it('applies variant on affix wrapper when prefix/suffix present', () => {
    const wrapper = mount(Input, { props: { variant: 'filled', prefix: '￥' } });
    expect(rootClasses(wrapper)).toContain('ant-input-affix-wrapper-filled');
  });

  it('does not leak variant onto the native input attribute', () => {
    const wrapper = mount(Input, { props: { variant: 'filled' } });
    expect(wrapper.find('input').attributes('variant')).toBeUndefined();
  });

  it('reads global variant from ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { variant: 'underlined' },
      slots: { default: () => <Input /> },
    });
    expect(rootClasses(wrapper.find('input'))).toContain('ant-input-underlined');
  });

  it('reads component-level variant from ConfigProvider.input', () => {
    const wrapper = mount(ConfigProvider, {
      props: { input: { variant: 'filled' } },
      slots: { default: () => <Input /> },
    });
    expect(rootClasses(wrapper.find('input'))).toContain('ant-input-filled');
  });

  it('TextArea supports variant', () => {
    const wrapper = mount(TextArea, { props: { variant: 'filled' } });
    expect(rootClasses(wrapper)).toContain('ant-input-filled');
  });
});
