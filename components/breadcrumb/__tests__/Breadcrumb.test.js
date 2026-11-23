import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Breadcrumb from '../index';
import ConfigProvider from '../../config-provider';

describe('Breadcrumb', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  // // https://github.com/airbnb/enzyme/issues/875
  it('warns on non-Breadcrumb.Item and non-Breadcrumb.Separator children', () => {
    mount({
      render() {
        return (
          <Breadcrumb>
            <div>foo</div>
          </Breadcrumb>
        );
      },
    });
    expect(errorSpy.mock.calls).toHaveLength(1);
    expect(errorSpy.mock.calls[0][0]).toMatch(
      "Warning: [ant-design-vue: Breadcrumb] Only accepts Breadcrumb.Item and Breadcrumb.Separator as it's children",
    );
  });

  // https:// github.com/ant-design/ant-design/issues/5015
  it('should allow Breadcrumb.Item is null or undefined', () => {
    const wrapper = mount({
      render() {
        return (
          <Breadcrumb>
            {null}
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            {undefined}
          </Breadcrumb>
        );
      },
    });
    expect(errorSpy).not.toHaveBeenCalled();
    expect(wrapper.html()).toMatchSnapshot();
  });

  // https://github.com/ant-design/ant-design/issues/5542
  it('should not display Breadcrumb Item when its children is falsy', () => {
    const wrapper = mount({
      render() {
        return (
          <Breadcrumb>
            <Breadcrumb.Item />
            <Breadcrumb.Item>xxx</Breadcrumb.Item>
            <Breadcrumb.Item>yyy</Breadcrumb.Item>
          </Breadcrumb>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('should render a menu', () => {
    const routes = [
      {
        path: 'index',
        breadcrumbName: 'home',
      },
      {
        path: 'first',
        breadcrumbName: 'first',
        children: [
          {
            path: '/general',
            breadcrumbName: 'General',
          },
          {
            path: '/layout',
            breadcrumbName: 'Layout',
          },
          {
            path: '/navigation',
            breadcrumbName: 'Navigation',
          },
        ],
      },
      {
        path: 'second',
        breadcrumbName: 'second',
      },
    ];
    const wrapper = mount(Breadcrumb, { props: { routes } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should support custom attribute', () => {
    const wrapper = mount({
      render() {
        return (
          <Breadcrumb data-custom="custom">
            <Breadcrumb.Item data-custom="custom-item">xxx</Breadcrumb.Item>
            <Breadcrumb.Item>yyy</Breadcrumb.Item>
          </Breadcrumb>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // https://github.com/ant-design/ant-design/issues/25975
  it('should support Breadcrumb.Item default separator', () => {
    const MockComponent = () => (
      <span>
        <Breadcrumb.Item>Mock Node</Breadcrumb.Item>
      </span>
    );
    const wrapper = mount({
      render() {
        return (
          <Breadcrumb>
            <Breadcrumb.Item>Location</Breadcrumb.Item>
            <MockComponent />
            <Breadcrumb.Item>Application Center</Breadcrumb.Item>
          </Breadcrumb>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('items and dropdownIcon', () => {
    it('supports config-driven items with title, href, path, params, onClick, and class', async () => {
      const onClick = jest.fn();
      const wrapper = mount(Breadcrumb, {
        props: {
          params: { id: '42' },
          separator: '>',
          items: [
            { key: 'home', title: 'Home', href: 'https://antdv.com', class: 'home-item' },
            { key: 'user', title: 'User :id', path: 'users/:id', onClick },
            { key: 'detail', title: 'Detail', path: 'detail' },
          ],
        },
      });

      const items = wrapper.findAll('li');
      expect(items).toHaveLength(3);
      expect(items[0].classes()).toContain('home-item');
      expect(items[0].find('a').attributes('href')).toBe('https://antdv.com');
      expect(items[0].find('a').text()).toBe('Home');
      expect(items[0].find('.ant-breadcrumb-separator').text()).toBe('>');

      expect(items[1].find('a').attributes('href')).toBe('#/users/42');
      expect(items[1].find('a').text()).toBe('User 42');
      await items[1].find('a').trigger('click');
      expect(onClick).toHaveBeenCalledTimes(1);

      expect(items[2].find('a').attributes('href')).toBe('#/users/42/detail');
      expect(items[2].find('.ant-breadcrumb-separator').exists()).toBe(false);
    });

    it('supports inline separator items with type: "separator"', () => {
      const wrapper = mount(Breadcrumb, {
        props: {
          separator: '',
          items: [
            { title: 'Location' },
            { type: 'separator', separator: ':' },
            { title: 'Application Center', href: '#/center' },
            { type: 'separator' },
            { title: 'An Application' },
          ],
        },
      });

      const separators = wrapper.findAll('.ant-breadcrumb-separator');
      expect(separators).toHaveLength(2);
      expect(separators[0].text()).toBe(':');
      expect(separators[1].text()).toBe('/');
      expect(wrapper.findAll('li')).toHaveLength(3);
    });

    it('supports menu, dropdownProps, and custom dropdownIcon prop and slot', () => {
      const wrapper = mount(Breadcrumb, {
        props: {
          dropdownIcon: <span class="custom-dropdown-icon">v</span>,
          items: [
            { title: 'Home' },
            {
              title: 'General',
              href: '#/general',
              dropdownProps: { placement: 'bottomLeft' },
              menu: {
                items: [
                  { key: '1', label: 'Layout', path: '/layout' },
                  { key: '2', title: 'Navigation', href: '#/nav' },
                ],
              },
            },
            { title: 'Button' },
          ],
        },
      });

      expect(wrapper.find('.ant-breadcrumb-overlay-link').exists()).toBe(true);
      expect(wrapper.find('.custom-dropdown-icon').exists()).toBe(true);
      expect(wrapper.find('.anticon-down').exists()).toBe(false);

      const slotWrapper = mount({
        render() {
          return (
            <Breadcrumb
              items={[
                { title: 'Home' },
                {
                  title: 'Menu',
                  menu: { items: [{ key: 'a', label: 'A' }] },
                },
              ]}
              v-slots={{
                dropdownIcon: () => <span class="slot-dropdown-icon">*</span>,
              }}
            />
          );
        },
      });
      expect(slotWrapper.find('.slot-dropdown-icon').exists()).toBe(true);
    });

    it('supports itemRender with items', () => {
      const wrapper = mount(Breadcrumb, {
        props: {
          items: [
            { title: 'Home', path: 'home' },
            { title: 'List', path: 'list' },
          ],
          itemRender: ({ route, paths }) => (
            <span class="custom-rendered" data-path={paths.join('/')}>
              {route.title}
            </span>
          ),
        },
      });

      const rendered = wrapper.findAll('.custom-rendered');
      expect(rendered).toHaveLength(2);
      expect(rendered[0].attributes('data-path')).toBe('home');
      expect(rendered[1].attributes('data-path')).toBe('home/list');
    });

    it('generates valid cssVar styles and component tokens without illegal CSS', async () => {
      document.head.innerHTML = '';
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider
              theme={{
                cssVar: true,
                components: {
                  Breadcrumb: {
                    itemColor: '#123456',
                    separatorMargin: 12,
                  },
                },
              }}
            >
              <Breadcrumb items={[{ title: 'Home', href: '#/' }, { title: 'Detail' }]} />
            </ConfigProvider>
          );
        },
      });
      await nextTick();
      const css = Array.from(document.querySelectorAll('style'))
        .map(s => s.innerHTML)
        .join('\n');
      expect(css).toContain('--ant-breadcrumb-item-color:#123456');
      expect(css).toContain('--ant-breadcrumb-separator-margin:12px');
      expect(css).not.toMatch(/NaN|undefined|\[object Object\]/);
      expect(css).not.toMatch(/(?<![\w)])-var\(--ant-/);
      expect(css).not.toMatch(/var\(--ant-[a-z0-9-]+\)(?=[A-Za-z0-9.-]+)/);
      wrapper.unmount();
    });
  });
});
