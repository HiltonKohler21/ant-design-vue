import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Drawer from '..';
import ConfigProvider from '../../config-provider';

describe('upstream semantic API: Drawer（antd 5.25）', () => {
  it('classNames 覆盖 header / body / footer / content / mask / wrapper', async () => {
    const wrapper = mount(Drawer, {
      props: {
        open: true,
        title: 'title',
        classNames: {
          header: 'sem-header',
          body: 'sem-body',
          footer: 'sem-footer',
          content: 'sem-content',
          mask: 'sem-mask',
          wrapper: 'sem-wrapper',
        },
      },
      slots: { default: () => 'drawer-content', footer: () => 'drawer-footer' },
      attachTo: 'body',
    });
    await nextTick();
    const html = document.body.innerHTML;
    for (const c of [
      'sem-header',
      'sem-body',
      'sem-footer',
      'sem-content',
      'sem-mask',
      'sem-wrapper',
    ]) {
      expect(html).toContain(c);
    }
    wrapper.unmount();
  });

  it('styles 覆盖 header / body / footer / mask', async () => {
    const wrapper = mount(Drawer, {
      props: {
        open: true,
        title: 'title',
        styles: {
          header: { color: 'rgb(1, 2, 3)' },
          body: { color: 'rgb(4, 5, 6)' },
          footer: { color: 'rgb(7, 8, 9)' },
          mask: { background: 'rgb(10, 11, 12)' },
        },
      },
      slots: { default: () => 'drawer-content', footer: () => 'drawer-footer' },
      attachTo: 'body',
    });
    await nextTick();
    const html = document.body.innerHTML;
    for (const v of [
      'color: rgb(1, 2, 3)',
      'color: rgb(4, 5, 6)',
      'color: rgb(7, 8, 9)',
      'background: rgb(10, 11, 12)',
    ]) {
      expect(html).toContain(v);
    }
    wrapper.unmount();
  });

  it('语义化属性不泄漏成 DOM attribute', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, classNames: { body: 'x' }, styles: { body: { color: 'red' } } },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.body.innerHTML).not.toContain('classnames=');
    expect(document.body.innerHTML).not.toContain('styles=');
    wrapper.unmount();
  });

  it('supports functional classNames/styles with all v6 slots merged with ConfigProvider.drawer', async () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            drawer={{
              closable: { placement: 'end' },
              classNames: { root: 'cp-root', body: 'cp-body' },
              styles: { root: { zIndex: 1200 }, header: { padding: '12px' } },
            }}
          >
            <Drawer
              open
              getContainer={false}
              resizable
              title="Drawer Title"
              extra={<span>Extra</span>}
              footer={<span>Footer</span>}
              classNames={({ props }) => ({
                root: props.footer ? 'fn-root-footer' : 'fn-root',
                section: 'fn-section',
                title: 'fn-title',
                extra: 'fn-extra',
                close: 'fn-close',
                dragger: 'fn-dragger',
              })}
              styles={({ props }) => ({
                wrapper: { borderRadius: '12px' },
                section: { backgroundColor: 'rgb(250, 250, 250)' },
                title: { fontSize: '20px' },
                extra: { marginRight: '8px' },
                close: { color: 'rgb(100, 100, 100)' },
                dragger: { width: '6px' },
                footer: props.footer ? { padding: '16px 10px' } : {},
              })}
            >
              Body content
            </Drawer>
          </ConfigProvider>
        );
      },
    });
    await nextTick();
    await nextTick();

    expect(wrapper.find('.ant-drawer').classes()).toContain('cp-root');
    expect(wrapper.find('.ant-drawer').classes()).toContain('fn-root-footer');
    expect(wrapper.find('.ant-drawer').attributes('style')).toContain('z-index: 1200');
    expect(wrapper.find('.ant-drawer-content-wrapper').attributes('style')).toContain(
      'border-radius: 12px',
    );
    expect(wrapper.find('.ant-drawer-wrapper-body').classes()).toContain('fn-section');
    expect(wrapper.find('.ant-drawer-wrapper-body').attributes('style')).toContain(
      'background-color: rgb(250, 250, 250)',
    );
    expect(wrapper.find('.ant-drawer-header').attributes('style')).toContain('padding: 12px');
    expect(wrapper.find('.ant-drawer-title').classes()).toContain('fn-title');
    expect(wrapper.find('.ant-drawer-title').attributes('style')).toContain('font-size: 20px');
    expect(wrapper.find('.ant-drawer-extra').classes()).toContain('fn-extra');
    expect(wrapper.find('.ant-drawer-extra').attributes('style')).toContain('margin-right: 8px');
    expect(wrapper.find('.ant-drawer-close').classes()).toContain('ant-drawer-close-end');
    expect(wrapper.find('.ant-drawer-close').classes()).toContain('fn-close');
    expect(wrapper.find('.ant-drawer-close').attributes('style')).toContain(
      'color: rgb(100, 100, 100)',
    );
    expect(wrapper.find('.ant-drawer-body').classes()).toContain('cp-body');
    expect(wrapper.find('.ant-drawer-footer').attributes('style')).toContain('padding: 16px 10px');
    expect(wrapper.find('.ant-drawer-resizable-dragger').classes()).toContain('fn-dragger');
    expect(wrapper.find('.ant-drawer-resizable-dragger').attributes('style')).toContain(
      'width: 6px',
    );
    wrapper.unmount();
  });

  it('exposes _InternalPanelDoNotUseOrYouWillBeFired (PurePanel)', () => {
    const InternalDrawer = Drawer._InternalPanelDoNotUseOrYouWillBeFired;
    const wrapper = mount(InternalDrawer, {
      props: {
        title: 'Hello Title',
        footer: 'Footer!',
        classNames: { root: 'pure-root', body: 'pure-body' },
        styles: { body: { padding: '20px' } },
      },
      slots: {
        default: () => 'Hello Content',
      },
    });
    expect(wrapper.find('.ant-drawer-pure').exists()).toBe(true);
    expect(wrapper.find('.ant-drawer-pure').classes()).toContain('pure-root');
    expect(wrapper.find('.ant-drawer-title').text()).toBe('Hello Title');
    expect(wrapper.find('.ant-drawer-body').classes()).toContain('pure-body');
    expect(wrapper.find('.ant-drawer-body').attributes('style')).toContain('padding: 20px');
    expect(wrapper.find('.ant-drawer-body').text()).toBe('Hello Content');
    expect(wrapper.find('.ant-drawer-footer').text()).toBe('Footer!');
  });
});
