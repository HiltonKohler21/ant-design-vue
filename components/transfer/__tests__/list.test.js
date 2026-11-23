import fs from 'fs';
import path from 'path';
import { mount } from '@vue/test-utils';
import List from '../list';
import Transfer from '..';
import ConfigProvider from '../../config-provider';
import enUS from '../../locale/en_US';
import zhCN from '../../locale/zh_CN';
import zhTW from '../../locale/zh_TW';
import zhHK from '../../locale/zh_HK';

const listCommonProps = {
  prefixCls: 'ant-transfer-list',
  dataSource: [
    {
      key: 'a',
      title: 'a',
    },
    {
      key: 'b',
      title: 'b',
    },
    {
      key: 'c',
      title: 'c',
      disabled: true,
    },
  ],
  checkedKeys: ['a'],
  notFoundContent: 'Not Found',
  lazy: false,
};

describe('List', () => {
  it('should render correctly', () => {
    const props = {
      props: listCommonProps,
    };
    const wrapper = mount(List, props);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should check top Checkbox while all available items are checked', () => {
    const props = {
      props: {
        ...listCommonProps,
        checkedKeys: ['a', 'b'],
      },
    };
    const wrapper = mount(List, props);
    expect(
      wrapper
        .findComponent({
          name: 'ACheckbox',
        })
        .props().checked,
    ).toBeTruthy();
  });

  it('defines Transfer.deselectAll across all locale files and falls back safely in TransferList', () => {
    expect(enUS.Transfer.deselectAll).toBe('Deselect all');
    expect(zhCN.Transfer.deselectAll).toBe('取消全选');
    expect(zhTW.Transfer.deselectAll).toBe('取消全選');
    expect(zhHK.Transfer.deselectAll).toBe('取消全選');

    const localeDir = path.resolve(__dirname, '../../locale');
    const localeFiles = fs.readdirSync(localeDir).filter(f => f.endsWith('.ts'));
    expect(localeFiles.length).toBeGreaterThan(60);
    for (const file of localeFiles) {
      const content = fs.readFileSync(path.join(localeDir, file), 'utf8');
      expect(content).toMatch(/Transfer\s*:\s*\{[\s\S]*?deselectAll\s*:\s*'[^']+'/);
    }

    // Fallback to selectAll when custom locale omits deselectAll
    const wrapper = mount(List, {
      props: {
        ...listCommonProps,
        checkedKeys: ['a', 'b'],
        selectAll: 'Select all custom',
        deselectAll: undefined,
      },
    });
    const dropdown = wrapper.findComponent({ name: 'ADropdown' });
    const overlayVNode = dropdown.props('overlay');
    const menuItems = overlayVNode.children.default();
    const selectAllItem = menuItems.find(item => item && item.key === 'selectAll');
    expect(selectAllItem.children.default()).toEqual(['Select all custom']);
  });

  it('wires ConfigProvider.transfer className and style', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        transfer: {
          className: 'cp-transfer',
          style: { minHeight: '200px' },
        },
      },
      slots: {
        default: () => <Transfer dataSource={[{ key: '1', title: 'Item 1' }]} targetKeys={[]} />,
      },
    });
    const root = wrapper.find('.ant-transfer');
    expect(root.classes()).toContain('cp-transfer');
    expect(root.attributes('style')).toContain('min-height: 200px');
  });
});
