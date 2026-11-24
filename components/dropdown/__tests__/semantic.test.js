import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { SaveOutlined } from '@ant-design/icons-vue';
import Dropdown from '..';
import ConfigProvider from '../../config-provider';

const waitDropdown = async () => {
  await nextTick();
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 60));
  await nextTick();
};

const sampleItems = [
  {
    key: '1',
    type: 'group',
    label: 'Group title',
    children: [
      {
        key: '1-1',
        label: '1st menu item',
        icon: <SaveOutlined />,
        extra: '⌘S',
      },
      {
        key: '1-2',
        label: '2nd menu item',
        icon: <SaveOutlined />,
      },
    ],
  },
  {
    key: 'SubMenu',
    label: 'SubMenu',
    children: [
      {
        key: '2-1',
        label: 'Option 1',
      },
    ],
  },
];

describe('Dropdown.semantic, menu prop & PurePanel', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('supports static classNames and styles for root, menu, item, itemTitle, itemIcon, itemContent', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        open: true,
        menu: { items: sampleItems },
        classNames: {
          root: 'test-root',
          menu: 'test-menu',
          item: 'test-menu-item',
          itemTitle: 'test-menu-item-title',
          itemIcon: 'test-menu-item-icon',
          itemContent: 'test-menu-item-content',
        },
        styles: {
          root: { backgroundColor: 'rgb(0, 0, 255)' },
          menu: { width: '200px' },
          item: { backgroundColor: 'rgb(0, 255, 0)' },
          itemTitle: { color: 'rgb(255, 0, 0)' },
          itemIcon: { fontSize: '20px' },
          itemContent: { color: 'rgb(255, 255, 0)' },
        },
      },
      slots: { default: () => <button type="button">button</button> },
      attachTo: 'body',
    });

    await waitDropdown();

    const root = document.body.querySelector('.ant-dropdown');
    const menu = document.body.querySelector('.ant-dropdown-menu');
    const item = document.body.querySelector('.ant-dropdown-menu-item');
    const itemIcon = document.body.querySelector('.ant-dropdown-menu-item-icon');
    const itemContent = document.body.querySelector('.ant-dropdown-menu-title-content');
    const itemTitle = document.body.querySelector('.ant-dropdown-menu-item-group-title');
    const extraEl = document.body.querySelector('.ant-dropdown-menu-item-extra');

    expect(root.classList.contains('test-root')).toBe(true);
    expect(root.style.backgroundColor).toBe('rgb(0, 0, 255)');
    expect(menu.classList.contains('test-menu')).toBe(true);
    expect(menu.style.width).toBe('200px');
    expect(item.classList.contains('test-menu-item')).toBe(true);
    expect(item.style.backgroundColor).toBe('rgb(0, 255, 0)');
    expect(itemIcon.classList.contains('test-menu-item-icon')).toBe(true);
    expect(itemIcon.style.fontSize).toBe('20px');
    expect(itemContent.classList.contains('test-menu-item-content')).toBe(true);
    expect(itemContent.style.color).toBe('rgb(255, 255, 0)');
    expect(itemTitle.classList.contains('test-menu-item-title')).toBe(true);
    expect(itemTitle.style.color).toBe('rgb(255, 0, 0)');
    expect(extraEl.textContent).toBe('⌘S');

    wrapper.unmount();
  });

  it('supports functional classNames/styles and merges ConfigProvider.dropdown', async () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        dropdown: {
          classNames: { root: 'ctx-dd-root', item: 'ctx-dd-item' },
          styles: { root: { opacity: '0.95' }, item: { padding: '6px' } },
        },
      },
      slots: {
        default: () => (
          <Dropdown
            open
            trigger={['click']}
            menu={{
              items: [{ key: '1', label: 'Item 1' }],
              selectable: true,
              defaultSelectedKeys: ['1'],
            }}
            classNames={({ props }) => ({
              root: `fn-dd-root-${Array.isArray(props.trigger) ? props.trigger[0] : props.trigger}`,
              item: 'fn-dd-item',
            })}
            styles={({ props }) => ({
              root: {
                borderRadius:
                  Array.isArray(props.trigger) && props.trigger.includes('click') ? '8px' : '4px',
              },
              item: { fontSize: '14px' },
            })}
          >
            <button type="button">trigger</button>
          </Dropdown>
        ),
      },
      attachTo: 'body',
    });

    await waitDropdown();

    const root = document.body.querySelector('.ant-dropdown');
    const item = document.body.querySelector('.ant-dropdown-menu-item');

    expect(root.classList.contains('ctx-dd-root')).toBe(true);
    expect(root.classList.contains('fn-dd-root-click')).toBe(true);
    expect(root.style.opacity).toBe('0.95');
    expect(root.style.borderRadius).toBe('8px');
    expect(item.classList.contains('ctx-dd-item')).toBe(true);
    expect(item.classList.contains('fn-dd-item')).toBe(true);
    expect(item.classList.contains('ant-dropdown-menu-item-selected')).toBe(true);
    expect(item.style.padding).toBe('6px');
    expect(item.style.fontSize).toBe('14px');

    wrapper.unmount();
  });

  it('supports _InternalPanelDoNotUseOrYouWillBeFired pure panel', async () => {
    const InternalDropdown = Dropdown._InternalPanelDoNotUseOrYouWillBeFired;
    expect(InternalDropdown).toBeDefined();

    const wrapper = mount(InternalDropdown, {
      props: {
        menu: { items: [{ key: '1', label: 'Pure Item' }] },
        classNames: { root: 'pure-dd-root', item: 'pure-dd-item' },
      },
    });

    await waitDropdown();
    expect(wrapper.find('.ant-dropdown-pure').exists()).toBe(true);
    expect(wrapper.find('.ant-dropdown-pure').classes()).toContain('pure-dd-root');
    expect(wrapper.find('.ant-dropdown-menu-item').text()).toContain('Pure Item');
    expect(wrapper.find('.ant-dropdown-menu-item').classes()).toContain('pure-dd-item');

    wrapper.unmount();
  });
});
