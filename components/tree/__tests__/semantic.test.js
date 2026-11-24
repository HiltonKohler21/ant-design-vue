import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tree from '..';
import ConfigProvider from '../../config-provider';

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'leaf 1',
        key: '0-0-0',
        children: [{ title: 'deep leaf', key: '0-0-0-0' }],
      },
    ],
  },
];

describe('Tree.Semantic & v6 features', () => {
  it('supports static object classNames and styles for root, item, itemIcon, itemTitle, itemSwitcher', () => {
    const wrapper = mount(Tree, {
      props: {
        treeData,
        defaultExpandAll: true,
        showIcon: true,
        classNames: {
          root: 'custom-tree-root',
          item: 'custom-tree-item',
          itemIcon: 'custom-tree-icon',
          itemTitle: 'custom-tree-title',
          itemSwitcher: 'custom-tree-switcher',
        },
        styles: {
          root: { color: 'rgb(255, 0, 0)' },
          item: { margin: '2px 0' },
          itemIcon: { fontSize: '16px' },
          itemTitle: { fontWeight: 700 },
          itemSwitcher: { width: '32px' },
        },
      },
    });

    const root = wrapper.find('.ant-tree');
    const item = wrapper.find('.ant-tree-treenode:not([aria-hidden])');
    const icon = wrapper.find('.ant-tree-iconEle');
    const title = wrapper.find('.ant-tree-title');
    const switcher = wrapper.find('.ant-tree-switcher');

    expect(root.classes()).toContain('custom-tree-root');
    expect(item.classes()).toContain('custom-tree-item');
    expect(icon.classes()).toContain('custom-tree-icon');
    expect(title.classes()).toContain('custom-tree-title');
    expect(switcher.classes()).toContain('custom-tree-switcher');

    expect(root.attributes('style')).toContain('color: rgb(255, 0, 0)');
    expect(item.attributes('style')).toContain('margin: 2px 0px');
    expect(icon.attributes('style')).toContain('font-size: 16px');
    expect(title.attributes('style')).toContain('font-weight: 700');
    expect(switcher.attributes('style')).toContain('width: 32px');

    wrapper.unmount();
  });

  it('supports functional classNames/styles and merges ConfigProvider.tree', async () => {
    const classNamesFn = info => ({
      root: info.props.disabled ? 'tree-disabled-root' : 'tree-enabled-root',
      item: info.props.checkable ? 'checkable-item' : 'plain-item',
      itemTitle: 'fn-title',
    });
    const stylesFn = info => ({
      root: {
        backgroundColor: info.props.disabled ? 'rgb(245, 245, 245)' : 'rgb(255, 255, 255)',
      },
      itemTitle: {
        color: info.props.disabled ? 'rgb(191, 191, 191)' : 'rgb(24, 144, 255)',
      },
    });

    const wrapper = mount({
      props: {
        disabled: { type: Boolean, default: false },
      },
      render() {
        return (
          <ConfigProvider
            tree={{
              className: 'ctx-cls',
              style: { padding: '8px' },
              classNames: { root: 'ctx-root', itemTitle: 'ctx-title' },
              styles: { root: { borderRadius: '4px' }, itemTitle: { letterSpacing: '1px' } },
            }}
          >
            <Tree
              treeData={treeData}
              defaultExpandAll
              checkable
              disabled={this.disabled}
              classNames={classNamesFn}
              styles={stylesFn}
            />
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-tree');
    const item = wrapper.find('.ant-tree-treenode:not([aria-hidden])');
    const title = wrapper.find('.ant-tree-title');

    expect(root.classes()).toContain('ctx-cls');
    expect(root.classes()).toContain('ctx-root');
    expect(root.classes()).toContain('tree-enabled-root');
    expect(root.attributes('style')).toContain('padding: 8px');
    expect(root.attributes('style')).toContain('border-radius: 4px');
    expect(root.attributes('style')).toContain('background-color: rgb(255, 255, 255)');
    expect(item.classes()).toContain('checkable-item');
    expect(title.classes()).toContain('ctx-title');
    expect(title.classes()).toContain('fn-title');
    expect(title.attributes('style')).toContain('letter-spacing: 1px');
    expect(title.attributes('style')).toContain('color: rgb(24, 144, 255)');

    await wrapper.setProps({ disabled: true });
    await nextTick();
    expect(wrapper.find('.ant-tree').classes()).toContain('tree-disabled-root');
    expect(wrapper.find('.ant-tree').attributes('style')).toContain(
      'background-color: rgb(245, 245, 245)',
    );
    expect(wrapper.find('.ant-tree-title').attributes('style')).toContain(
      'color: rgb(191, 191, 191)',
    );

    wrapper.unmount();
  });

  it('supports Tree.useTree().getPath and scrollTo ref method', async () => {
    const { getPath } = Tree.useTree(treeData, {});
    const path = getPath('0-0-0-0');
    expect(path.map(item => item.key)).toEqual(['0-0', '0-0-0', '0-0-0-0']);
    expect(getPath('non-existent')).toEqual([]);

    const wrapper = mount(Tree, {
      props: {
        height: 200,
        treeData,
        expandedKeys: ['0-0', '0-0-0'],
      },
    });

    expect(typeof wrapper.vm.scrollTo).toBe('function');
    wrapper.vm.scrollTo({ key: '0-0-0-0', align: 'top' });
    await nextTick();

    wrapper.unmount();
  });
});
