import { mount } from '@vue/test-utils';
import Switch from '..';
import ConfigProvider from '../../config-provider';

describe('Switch v6 semantic classNames & styles', () => {
  it('supports object and function classNames & styles on root, content, indicator', () => {
    const wrapper = mount(Switch, {
      props: {
        size: 'medium',
        checked: true,
        checkedChildren: 'ON',
        unCheckedChildren: 'OFF',
        classNames: info => ({
          root: `sw-root-${info.props.size}`,
          content: info.props.checked ? 'sw-content-on' : 'sw-content-off',
          indicator: 'sw-indicator',
        }),
        styles: info => ({
          root: { backgroundColor: info.props.size === 'medium' ? 'rgb(1, 2, 3)' : 'rgb(4, 5, 6)' },
          content: { color: 'rgb(7, 8, 9)' },
          indicator: { width: '20px' },
        }),
      },
    });

    const btn = wrapper.find('button');
    expect(btn.classes()).toContain('sw-root-medium');
    expect(btn.element.style.backgroundColor).toBe('rgb(1, 2, 3)');
    expect(btn.element.hasAttribute('classnames')).toBe(false);
    expect(btn.element.hasAttribute('styles')).toBe(false);

    const content = wrapper.find('.ant-switch-inner');
    expect(content.classes()).toContain('sw-content-on');
    expect(content.element.style.color).toBe('rgb(7, 8, 9)');

    const indicator = wrapper.find('.ant-switch-handle');
    expect(indicator.classes()).toContain('sw-indicator');
    expect(indicator.element.style.width).toBe('20px');
  });

  it('merges ConfigProvider.switch semantic classNames & styles', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            switch={{
              className: 'cp-sw',
              style: { marginLeft: '4px' },
              classNames: { root: 'cp-root', content: 'cp-content', indicator: 'cp-indicator' },
              styles: { content: { fontSize: '12px' }, indicator: { height: '18px' } },
            }}
          >
            <Switch classNames={{ root: 'own-root' }} styles={{ root: { borderRadius: '10px' } }} />
          </ConfigProvider>
        );
      },
    });

    const btn = wrapper.find('button');
    expect(btn.classes()).toContain('cp-sw');
    expect(btn.classes()).toContain('cp-root');
    expect(btn.classes()).toContain('own-root');
    expect(btn.element.style.marginLeft).toBe('4px');
    expect(btn.element.style.borderRadius).toBe('10px');

    expect(wrapper.find('.ant-switch-inner').classes()).toContain('cp-content');
    expect(wrapper.find('.ant-switch-inner').element.style.fontSize).toBe('12px');

    expect(wrapper.find('.ant-switch-handle').classes()).toContain('cp-indicator');
    expect(wrapper.find('.ant-switch-handle').element.style.height).toBe('18px');
  });
});
