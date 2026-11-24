import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Anchor from '..';
import ConfigProvider from '../../config-provider';

const items = [
  { key: 'part-1', href: '#part-1', title: 'Part 1' },
  { key: 'part-2', href: '#part-2', title: 'Part 2', targetOffset: 50 },
  { key: 'part-3', href: '#part-3', title: 'Part 3' },
];

describe('Anchor.Semantic & v6 features', () => {
  it('supports static object classNames and styles for root, item, itemTitle, indicator', () => {
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        items,
        classNames: {
          root: 'custom-root',
          item: 'custom-item',
          itemTitle: 'custom-title',
          indicator: 'custom-indicator',
        },
        styles: {
          root: { color: 'rgb(255, 0, 0)' },
          item: { color: 'rgb(0, 0, 255)' },
          itemTitle: { color: 'rgb(0, 128, 0)' },
          indicator: { color: 'rgb(255, 255, 0)' },
        },
      },
    });

    const root = wrapper.find('.ant-anchor-wrapper');
    const item = wrapper.find('.ant-anchor-link');
    const title = wrapper.find('.ant-anchor-link-title');
    const indicator = wrapper.find('.ant-anchor-ink');

    expect(root.classes()).toContain('custom-root');
    expect(item.classes()).toContain('custom-item');
    expect(title.classes()).toContain('custom-title');
    expect(indicator.classes()).toContain('custom-indicator');

    expect(root.attributes('style')).toContain('color: rgb(255, 0, 0)');
    expect(item.attributes('style')).toContain('color: rgb(0, 0, 255)');
    expect(title.attributes('style')).toContain('color: rgb(0, 128, 0)');
    expect(indicator.attributes('style')).toContain('color: rgb(255, 255, 0)');
    wrapper.unmount();
  });

  it('supports functional classNames/styles and merges ConfigProvider.anchor', async () => {
    const classNamesFn = info => ({
      root: info.props.direction === 'horizontal' ? 'anchor-horizontal' : 'anchor-vertical',
      item: 'fn-item',
    });
    const stylesFn = info => ({
      root: { padding: info.props.direction === 'horizontal' ? '12px' : '8px' },
      item: { marginBottom: '4px' },
    });

    const wrapper = mount({
      props: {
        direction: { type: String, default: 'vertical' },
      },
      render() {
        return (
          <ConfigProvider
            anchor={{
              className: 'ctx-cls',
              style: { opacity: '0.9' },
              classNames: { root: 'ctx-root', item: 'ctx-item' },
              styles: { root: { backgroundColor: 'rgb(1, 2, 3)' }, item: { paddingLeft: '6px' } },
            }}
          >
            <Anchor
              affix={false}
              direction={this.direction}
              items={items}
              classNames={classNamesFn}
              styles={stylesFn}
            />
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-anchor-wrapper');
    const item = wrapper.find('.ant-anchor-link');

    expect(root.classes()).toContain('ctx-cls');
    expect(root.classes()).toContain('ctx-root');
    expect(root.classes()).toContain('anchor-vertical');
    expect(root.attributes('style')).toContain('opacity: 0.9');
    expect(root.attributes('style')).toContain('background-color: rgb(1, 2, 3)');
    expect(root.attributes('style')).toContain('padding: 8px');

    expect(item.classes()).toContain('ctx-item');
    expect(item.classes()).toContain('fn-item');
    expect(item.attributes('style')).toContain('padding-left: 6px');
    expect(item.attributes('style')).toContain('margin-bottom: 4px');

    await wrapper.setProps({ direction: 'horizontal' });
    await nextTick();
    expect(wrapper.find('.ant-anchor-wrapper').classes()).toContain('anchor-horizontal');
    expect(wrapper.find('.ant-anchor-wrapper').attributes('style')).toContain('padding: 12px');

    wrapper.unmount();
  });

  it('supports Anchor replace prop and per-link targetOffset', async () => {
    const replaceStateSpy = jest.spyOn(window.history, 'replaceState').mockImplementation(() => {});
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        replace: true,
        targetOffset: 20,
        items,
      },
    });

    await wrapper.find('a[href="#part-2"]').trigger('click');
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '#part-2');
    replaceStateSpy.mockRestore();
    wrapper.unmount();
  });
});
