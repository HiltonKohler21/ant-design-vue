import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Breadcrumb from '..';
import ConfigProvider from '../../config-provider';

describe('Breadcrumb.Semantic', () => {
  it('supports static object classNames and styles for root, item, and separator', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [{ title: 'Home' }, { title: 'Application Center', href: '' }, { title: 'App' }],
        classNames: {
          root: 'custom-root',
          item: 'custom-item',
          separator: 'custom-sep',
        },
        styles: {
          root: { padding: '8px' },
          item: { color: 'rgb(24, 144, 255)' },
          separator: { color: 'rgb(150, 150, 150)' },
        },
      },
    });

    const root = wrapper.find('.ant-breadcrumb');
    const items = wrapper.findAll('li');
    const separators = wrapper.findAll('.ant-breadcrumb-separator');

    expect(root.classes()).toContain('custom-root');
    expect(root.attributes('style')).toContain('padding: 8px');
    expect(items[0].classes()).toContain('custom-item');
    expect(items[0].attributes('style')).toContain('color: rgb(24, 144, 255)');
    expect(separators[0].classes()).toContain('custom-sep');
    expect(separators[0].attributes('style')).toContain('color: rgb(150, 150, 150)');
    wrapper.unmount();
  });

  it('supports functional classNames/styles and merges ConfigProvider.breadcrumb', async () => {
    const classNamesFn = info => {
      const len = info.props.items?.length ?? 0;
      return {
        root: len > 2 ? 'fn-root-long' : 'fn-root-short',
        item: 'fn-item',
        separator: 'fn-sep',
      };
    };
    const stylesFn = info => {
      const len = info.props.items?.length ?? 0;
      return {
        root: { backgroundColor: len > 2 ? 'rgb(240, 249, 255)' : 'rgb(255, 255, 255)' },
        separator: { fontWeight: '600' },
      };
    };

    const allItems = [{ title: 'One' }, { title: 'Two' }, { title: 'Three' }];

    const wrapper = mount({
      props: {
        items: { type: Array, default: () => allItems.slice(0, 2) },
      },
      render() {
        return (
          <ConfigProvider
            breadcrumb={{
              className: 'ctx-cls',
              style: { opacity: '0.95' },
              separator: '>',
              classNames: { root: 'ctx-root', item: 'ctx-item', separator: 'ctx-sep' },
              styles: { root: { borderRadius: '4px' }, item: { paddingLeft: '2px' } },
            }}
          >
            <Breadcrumb
              items={this.items}
              classNames={classNamesFn}
              styles={stylesFn}
              style={{ marginTop: '4px' }}
            />
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-breadcrumb');
    expect(root.classes()).toContain('ctx-cls');
    expect(root.classes()).toContain('ctx-root');
    expect(root.classes()).toContain('fn-root-short');
    expect(root.attributes('style')).toContain('opacity: 0.95');
    expect(root.attributes('style')).toContain('border-radius: 4px');
    expect(root.attributes('style')).toContain('background-color: rgb(255, 255, 255)');
    expect(root.attributes('style')).toContain('margin-top: 4px');

    const item = wrapper.find('li');
    expect(item.classes()).toContain('ctx-item');
    expect(item.classes()).toContain('fn-item');
    expect(item.attributes('style')).toContain('padding-left: 2px');

    const sep = wrapper.find('.ant-breadcrumb-separator');
    expect(sep.text()).toBe('>');
    expect(sep.classes()).toContain('ctx-sep');
    expect(sep.classes()).toContain('fn-sep');
    expect(sep.attributes('style')).toContain('font-weight: 600');

    await wrapper.setProps({ items: allItems });
    await nextTick();
    expect(wrapper.find('.ant-breadcrumb').classes()).toContain('fn-root-long');
    expect(wrapper.find('.ant-breadcrumb').attributes('style')).toContain(
      'background-color: rgb(240, 249, 255)',
    );
    wrapper.unmount();
  });

  it('supports semantic separator on standalone Breadcrumb.Separator', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        separator: '',
        items: [{ title: 'Location' }, { type: 'separator', separator: ':' }, { title: 'App' }],
        classNames: { separator: 'inline-sep-cls' },
        styles: { separator: { color: 'rgb(255, 0, 0)' } },
      },
    });

    const sep = wrapper.find('.ant-breadcrumb-separator');
    expect(sep.text()).toBe(':');
    expect(sep.classes()).toContain('inline-sep-cls');
    expect(sep.attributes('style')).toContain('color: rgb(255, 0, 0)');
    wrapper.unmount();
  });
});
