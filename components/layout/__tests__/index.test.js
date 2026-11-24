import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import Layout from '..';
import ConfigProvider from '../../config-provider';
import theme from '../../theme';
import mountTest from '../../../tests/shared/mountTest';
import { sleep } from '../../../tests/utils';

const { Sider, Content, Header, Footer } = Layout;

describe('Layout', () => {
  mountTest(Layout);
  mountTest(Content);
  mountTest(Sider);
  it('detect the sider as children', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Layout>
              <Sider>Sider</Sider>
              <Content>Content</Content>
            </Layout>
          );
        },
      },
      { sync: false },
    );
    await sleep();
    expect(wrapper.find('.ant-layout').classes()).toContain('ant-layout-has-sider');
  });

  it('detect the sider inside the children', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Layout>
              <div>
                <Sider>Sider</Sider>
              </div>
              <Content>Content</Content>
            </Layout>
          );
        },
      },
      { sync: false },
    );
    await sleep();
    expect(wrapper.find('.ant-layout').classes()).toContain('ant-layout-has-sider');
  });

  it('detect ant-layout-sider-has-trigger class in sider when ant-layout-sider-trigger div tag exists', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Layout>
              <div>
                <Sider collapsible>Sider</Sider>
              </div>
              <Content>Content</Content>
            </Layout>
          );
        },
      },
      { sync: false },
    );
    await sleep();
    expect(wrapper.find('.ant-layout-sider').classes()).toContain('ant-layout-sider-has-trigger');
  });

  it('Header/Footer/Content receive hashId and Layout cssVars dynamically update on Compact switch', async () => {
    document.head.innerHTML = '';
    const isCompact = ref(false);
    const wrapper = mount(
      {
        setup() {
          return () => (
            <ConfigProvider
              theme={{
                cssVar: true,
                hashed: true,
                algorithm: isCompact.value ? theme.compactAlgorithm : theme.defaultAlgorithm,
              }}
            >
              <Layout>
                <Header>Header</Header>
                <Content>Content</Content>
                <Footer>Footer</Footer>
              </Layout>
            </ConfigProvider>
          );
        },
      },
      { attachTo: 'body' },
    );
    await nextTick();
    await sleep(50);

    const headerClasses = wrapper.find('.ant-layout-header').classes();
    expect(headerClasses.some(c => c.startsWith('css-'))).toBe(true);
    expect(
      wrapper
        .find('.ant-layout-content')
        .classes()
        .some(c => c.startsWith('css-')),
    ).toBe(true);
    expect(
      wrapper
        .find('.ant-layout-footer')
        .classes()
        .some(c => c.startsWith('css-')),
    ).toBe(true);

    const collectCss = () =>
      Array.from(document.querySelectorAll('style'))
        .map(s => s.innerHTML)
        .join('\n');

    const defaultCss = collectCss();
    expect(defaultCss).toContain('--ant-layout-header-height:64px');
    expect(defaultCss).toContain('--ant-layout-trigger-height:48px');
    expect(defaultCss).toContain('--ant-layout-zero-trigger-width:40px');
    expect(defaultCss).toContain('--ant-layout-header-padding:0 50px');
    expect(defaultCss).toContain('--ant-layout-footer-padding:24px 50px');

    isCompact.value = true;
    await nextTick();
    await sleep(50);

    const compactCss = collectCss();
    expect(compactCss).toContain('--ant-layout-header-height:56px');
    expect(compactCss).toContain('--ant-layout-trigger-height:43px');
    expect(compactCss).toContain('--ant-layout-zero-trigger-width:35px');
    expect(compactCss).toContain('--ant-layout-header-padding:0 43.75px');
    expect(compactCss).toContain('--ant-layout-footer-padding:21px 43.75px');

    wrapper.unmount();
  });

  it('supports deprecated colorBgHeader/colorBgBody/colorBgTrigger aliases and new component token overrides', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(
      {
        render() {
          return (
            <ConfigProvider
              theme={{
                cssVar: true,
                components: {
                  Layout: {
                    colorBgHeader: '#123456',
                    colorBgBody: '#eeeeee',
                    colorBgTrigger: '#654321',
                    headerHeight: 72,
                  },
                },
              }}
            >
              <Layout>
                <Header>Header</Header>
              </Layout>
            </ConfigProvider>
          );
        },
      },
      { attachTo: 'body' },
    );
    await nextTick();
    await sleep(50);

    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');

    expect(css).toContain('--ant-layout-header-bg:#123456');
    expect(css).toContain('--ant-layout-sider-bg:#123456');
    expect(css).toContain('--ant-layout-body-bg:#eeeeee');
    expect(css).toContain('--ant-layout-footer-bg:#eeeeee');
    expect(css).toContain('--ant-layout-trigger-bg:#654321');
    expect(css).toContain('--ant-layout-header-height:72px');

    wrapper.unmount();
  });

  it('supports static and functional semantic classNames/styles on Layout and Layout.Sider merged with ConfigProvider.layout', async () => {
    const collapsed = ref(false);
    const wrapper = mount({
      setup() {
        return () => (
          <ConfigProvider
            layout={{
              className: 'ctx-layout',
              style: { minHeight: '200px' },
              classNames: ({ props }) => ({
                root: props.hasSider ? 'ctx-has-sider' : 'ctx-semantic-root',
                body: 'ctx-sider-body',
              }),
              styles: {
                root: { padding: '4px' },
                body: { backgroundColor: 'rgb(1, 2, 3)' },
              },
            }}
          >
            <Layout
              classNames={({ props }) => ({
                root: props.hasSider ? 'prop-layout-has-sider' : 'prop-layout-no-sider',
              })}
              styles={{ root: { borderWidth: '1px' } }}
            >
              <Sider
                collapsible
                collapsed={collapsed.value}
                classNames={({ props }) => ({
                  root: props.collapsed ? 'sider-root-collapsed' : 'sider-root-expanded',
                  body: props.collapsed ? 'sider-body-collapsed' : 'sider-body-expanded',
                })}
                styles={({ props }) => ({
                  root: { opacity: props.collapsed ? '0.8' : '1' },
                  body: { padding: '8px' },
                })}
              >
                Sider Content
              </Sider>
              <Content classNames={{ root: 'content-root' }} styles={{ root: { margin: '2px' } }}>
                Main
              </Content>
            </Layout>
          </ConfigProvider>
        );
      },
    });
    await nextTick();

    const layoutEl = wrapper.find('.ant-layout');
    expect(layoutEl.classes()).toContain('ctx-layout');
    expect(layoutEl.classes()).toContain('ctx-has-sider');
    expect(layoutEl.classes()).toContain('prop-layout-has-sider');
    expect(layoutEl.attributes('style')).toContain('min-height: 200px');
    expect(layoutEl.attributes('style')).toContain('padding: 4px');
    expect(layoutEl.attributes('style')).toContain('border-width: 1px');

    const siderEl = wrapper.find('.ant-layout-sider');
    const siderBodyEl = wrapper.find('.ant-layout-sider-children');
    expect(siderEl.classes()).toContain('ctx-semantic-root');
    expect(siderEl.classes()).toContain('sider-root-expanded');
    expect(siderEl.attributes('style')).toContain('padding: 4px');
    expect(siderEl.attributes('style')).toContain('opacity: 1');
    expect(siderBodyEl.classes()).toContain('ctx-sider-body');
    expect(siderBodyEl.classes()).toContain('sider-body-expanded');
    expect(siderBodyEl.attributes('style')).toContain('background-color: rgb(1, 2, 3)');
    expect(siderBodyEl.attributes('style')).toContain('padding: 8px');

    const contentEl = wrapper.find('.ant-layout-content');
    expect(contentEl.classes()).toContain('content-root');
    expect(contentEl.attributes('style')).toContain('margin: 2px');

    collapsed.value = true;
    await nextTick();
    expect(siderEl.classes()).toContain('sider-root-collapsed');
    expect(siderBodyEl.classes()).toContain('sider-body-collapsed');
    expect(siderEl.attributes('style')).toContain('opacity: 0.8');
  });
});
