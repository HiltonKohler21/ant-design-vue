import { mount } from '@vue/test-utils';
import { nextTick, h } from 'vue';
import { MailOutlined } from '@ant-design/icons-vue';
import Menu from '..';
import ConfigProvider from '../../config-provider';
import { sleep } from '../../../tests/utils';

describe('Menu.Semantic & v6 features', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('supports static object classNames and styles including subMenu and itemGroup slots', () => {
    const items = [
      {
        label: 'Navigation One',
        key: 'mail',
        icon: () => h(MailOutlined),
      },
      {
        key: 'SubMenu',
        label: 'Navigation Sub',
        icon: () => h(MailOutlined),
        children: [
          {
            key: 'g1',
            label: 'Item 1',
            type: 'group',
            children: [
              { key: '1', label: 'Option 1', icon: () => h(MailOutlined) },
              { key: '2', label: 'Option 2' },
            ],
          },
        ],
      },
    ];
    const testClassNames = {
      root: 'test-root',
      item: 'test-item',
      itemIcon: 'test-item-icon',
      itemContent: 'test-item-content',
      itemTitle: 'test-group-title',
      list: 'test-group-list',
      subMenu: {
        list: 'test-sub-menu-list',
        item: 'test-sub-menu-list-item',
        itemIcon: 'test-sub-menu-list-item-icon',
        itemContent: 'test-sub-menu-list-item-content',
        itemTitle: 'test-sub-menu-list-title',
      },
    };
    const testStyles = {
      root: { fontSize: '12px' },
      item: { backgroundColor: 'rgb(0, 123, 255)' },
      itemIcon: { backgroundColor: 'rgb(40, 167, 69)' },
      itemContent: { backgroundColor: 'rgb(255, 193, 7)' },
      itemTitle: { color: 'rgb(10, 20, 30)' },
      list: { paddingLeft: '4px' },
      subMenu: {
        list: { color: 'rgb(255, 7, 201)' },
        item: { color: 'rgb(109, 76, 76)' },
        itemIcon: { color: 'rgb(40, 167, 69)' },
        itemContent: { color: 'rgb(68, 60, 35)' },
        itemTitle: { color: 'rgb(255, 0, 0)' },
      },
    };

    const wrapper = mount(Menu, {
      props: {
        selectedKeys: ['mail'],
        mode: 'inline',
        items,
        openKeys: ['SubMenu'],
        classNames: testClassNames,
        styles: testStyles,
      },
      attachTo: 'body',
    });

    const root = wrapper.find('.ant-menu');
    const firstLevelItem = wrapper.findAll('.ant-menu-item')[0];
    const firstLevelIcon = firstLevelItem.find('.ant-menu-item-icon');
    const firstLevelContent = firstLevelItem.find('.ant-menu-title-content');

    expect(root.classes()).toContain('test-root');
    expect(root.attributes('style')).toContain('font-size: 12px');
    expect(firstLevelItem.classes()).toContain('test-item');
    expect(firstLevelItem.attributes('style')).toContain('background-color: rgb(0, 123, 255)');
    expect(firstLevelIcon.classes()).toContain('test-item-icon');
    expect(firstLevelIcon.attributes('style')).toContain('background-color: rgb(40, 167, 69)');
    expect(firstLevelContent.classes()).toContain('test-item-content');
    expect(firstLevelContent.attributes('style')).toContain('background-color: rgb(255, 193, 7)');

    const groupTitle = wrapper.find('.ant-menu-item-group-title');
    const groupList = wrapper.find('.ant-menu-item-group-list');
    expect(groupTitle.classes()).toContain('test-group-title');
    expect(groupTitle.attributes('style')).toContain('color: rgb(10, 20, 30)');
    expect(groupList.classes()).toContain('test-group-list');
    expect(groupList.attributes('style')).toContain('padding-left: 4px');

    const subMenuList = wrapper.find('.test-sub-menu-list');
    const subMenuItem = wrapper.find('.test-sub-menu-list-item');
    const subMenuIcon = wrapper.find('.test-sub-menu-list-item-icon');
    const subMenuContent = wrapper.find('.test-sub-menu-list-item-content');
    const subMenuTitle = wrapper.find('.test-sub-menu-list-title');

    expect(subMenuList.attributes('style')).toContain('color: rgb(255, 7, 201)');
    expect(subMenuItem.attributes('style')).toContain('color: rgb(109, 76, 76)');
    expect(subMenuIcon.attributes('style')).toContain('color: rgb(40, 167, 69)');
    expect(subMenuContent.attributes('style')).toContain('color: rgb(68, 60, 35)');
    expect(subMenuTitle.attributes('style')).toContain('color: rgb(255, 0, 0)');
    wrapper.unmount();
  });

  it('supports functional classNames/styles and merges ConfigProvider.menu', async () => {
    const classNamesFn = info => ({
      root: info.props.items?.length ? 'fn-root-grouped' : 'fn-root-plain',
      item: 'fn-item',
    });
    const stylesFn = info => ({
      root: {
        backgroundColor: info.props.items?.length ? 'rgb(240, 249, 255)' : 'rgb(255, 255, 255)',
      },
    });

    const wrapper = mount({
      props: {
        items: { type: Array, default: () => [{ key: 'mail', label: 'Mail' }] },
      },
      render() {
        return (
          <ConfigProvider
            menu={{
              className: 'ctx-menu-cls',
              style: { opacity: '0.9' },
              classNames: { root: 'ctx-menu-root', item: 'ctx-menu-item' },
              styles: { root: { borderRadius: '6px' }, item: { paddingLeft: '10px' } },
            }}
          >
            <Menu
              mode="inline"
              items={this.items}
              classNames={classNamesFn}
              styles={stylesFn}
              style={{ marginTop: '4px' }}
            />
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-menu');
    expect(root.classes()).toContain('ctx-menu-cls');
    expect(root.classes()).toContain('ctx-menu-root');
    expect(root.classes()).toContain('fn-root-grouped');
    expect(root.attributes('style')).toContain('opacity: 0.9');
    expect(root.attributes('style')).toContain('border-radius: 6px');
    expect(root.attributes('style')).toContain('background-color: rgb(240, 249, 255)');
    expect(root.attributes('style')).toContain('margin-top: 4px');

    const item = wrapper.find('.ant-menu-item');
    expect(item.classes()).toContain('ctx-menu-item');
    expect(item.classes()).toContain('fn-item');
    expect(item.attributes('style')).toContain('padding-left: 10px');

    await wrapper.setProps({ items: [] });
    await nextTick();
    expect(wrapper.find('.ant-menu').classes()).toContain('fn-root-plain');
    expect(wrapper.find('.ant-menu').attributes('style')).toContain(
      'background-color: rgb(255, 255, 255)',
    );
    wrapper.unmount();
  });

  it('supports popup semantic classNames/styles, popupRender, extra, and tooltip=false', async () => {
    const origRaf = window.requestAnimationFrame;
    const origCancelRaf = window.cancelAnimationFrame;
    window.requestAnimationFrame = cb => window.setTimeout(cb, 16);
    window.cancelAnimationFrame = window.clearTimeout;
    const wrapper = mount(Menu, {
      props: {
        mode: 'horizontal',
        disabledOverflow: true,
        openKeys: ['sub1'],
        classNames: { popup: 'custom-popup-cls' },
        styles: { popup: { root: { zIndex: 1234 } } },
        popupRender: (node, { item }) =>
          h('div', { class: 'custom-popup-wrapper', 'data-title': item.title }, [node]),
        items: [
          {
            key: 'item1',
            label: 'Item 1',
            extra: '⌘P',
          },
          {
            key: 'sub1',
            label: 'SubMenu 1',
            children: [{ key: 'child1', label: 'Child 1' }],
          },
        ],
      },
      attachTo: 'body',
    });

    await sleep(100);
    await nextTick();

    expect(wrapper.find('.ant-menu-title-content-with-extra').exists()).toBe(true);
    expect(wrapper.find('.ant-menu-item-extra').text()).toBe('⌘P');

    const popup = document.body.querySelector('.ant-menu-submenu-popup');
    expect(popup).toBeTruthy();
    expect(popup.classList.contains('custom-popup-cls')).toBe(true);
    expect(popup.style.zIndex).toBe('1234');
    const customWrapper = document.body.querySelector('.custom-popup-wrapper');
    expect(customWrapper).toBeTruthy();
    expect(customWrapper.getAttribute('data-title')).toBe('SubMenu 1');

    wrapper.unmount();

    // tooltip={false} disables collapsed tooltip
    const collapsedWrapper = mount(Menu, {
      props: {
        mode: 'inline',
        inlineCollapsed: true,
        tooltip: false,
        items: [{ key: '1', label: 'No Tooltip Item' }],
      },
      attachTo: 'body',
    });
    await collapsedWrapper.find('.ant-menu-item').trigger('mouseenter');
    await sleep(60);
    expect(document.body.querySelector('.ant-tooltip')).toBeNull();
    collapsedWrapper.unmount();
    window.requestAnimationFrame = origRaf;
    window.cancelAnimationFrame = origCancelRaf;
  });
});
