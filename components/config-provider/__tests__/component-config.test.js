import { mount } from '@vue/test-utils';
import ConfigProvider from '..';
import { useConfigContextInject } from '../context';

describe('ConfigProvider 组件级默认配置（camelCase）', () => {
  it('接收 button/card 等组件配置并合并到 context', () => {
    const Child = {
      setup() {
        const configProvider = useConfigContextInject();
        return () => <div class="child">{JSON.stringify(configProvider.button?.value)}</div>;
      },
    };
    const wrapper = mount(ConfigProvider, {
      props: {
        button: { variant: 'dashed' },
        card: { variant: 'borderless' },
      },
      slots: { default: () => <Child /> },
    });
    expect(wrapper.find('.child').text()).toContain('dashed');
  });

  it('声明 52 个组件配置 props（抽查）', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        button: { variant: 'solid' },
        card: {},
        tabs: {},
        modal: { className: 'x' },
      },
    });
    for (const k of [
      'button',
      'card',
      'tabs',
      'modal',
      'alert',
      'upload',
      'treeSelect',
      'image',
      'empty',
      'switch',
      'message',
      'table',
      'notification',
      'flex',
      'warning',
    ]) {
      expect(k in wrapper.vm.$props).toBe(true);
    }
  });
});
