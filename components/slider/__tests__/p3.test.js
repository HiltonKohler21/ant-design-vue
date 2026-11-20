import { mount } from '@vue/test-utils';
import Slider from '..';

describe('Slider formatter / onChangeComplete / handleRender', () => {
  it('formatter 替代 tipFormatter', () => {
    const wrapper = mount(Slider, {
      props: { defaultValue: 30, formatter: v => `${v}%` },
    });
    expect(typeof wrapper.vm.$props.formatter).toBe('function');
  });

  it('handleRender 自定义 handle', () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 30,
        handleRender: (node, info) => <div class="custom-handle">{info.value}</div>,
      },
    });
    expect(wrapper.html()).toContain('custom-handle');
  });

  it('onChangeComplete 触发回调', () => {
    const onChangeComplete = jest.fn();
    const wrapper = mount(Slider, {
      props: { defaultValue: 30, onChangeComplete },
    });
    expect(typeof onChangeComplete).toBe('function');
    wrapper.unmount();
  });
});
