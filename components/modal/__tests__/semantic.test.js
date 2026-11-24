import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Modal from '..';
import ConfigProvider from '../../config-provider';

const PurePanel = Modal._InternalPanelDoNotUseOrYouWillBeFired;

describe('upstream semantic API: Modal（antd 6.x）', () => {
  it('classNames 覆盖 root / mask / wrapper / container / content / header / title / body / footer / close', async () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        title: 't',
        classNames: {
          root: 'sem-root',
          mask: 'sem-mask',
          wrapper: 'sem-wrapper',
          container: 'sem-container',
          content: 'sem-content',
          header: 'sem-header',
          title: 'sem-title',
          body: 'sem-body',
          footer: 'sem-footer',
          close: 'sem-close',
        },
      },
      slots: { default: () => 'body-content', footer: () => 'footer-content' },
      attachTo: 'body',
    });
    await nextTick();
    const html = document.body.innerHTML;
    for (const c of [
      'sem-root',
      'sem-mask',
      'sem-wrapper',
      'sem-container',
      'sem-content',
      'sem-header',
      'sem-title',
      'sem-body',
      'sem-footer',
      'sem-close',
    ]) {
      expect(html).toContain(c);
    }
    wrapper.unmount();
  });

  it('styles 覆盖 root / body / mask / wrapper / container / content / header / title / footer / close', async () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        title: 't',
        styles: {
          root: { opacity: '0.95' },
          body: { color: 'rgb(1, 2, 3)' },
          mask: { background: 'rgb(4, 5, 6)' },
          wrapper: { paddingTop: '11px' },
          content: { marginLeft: '12px' },
          container: { borderRadius: '14px' },
          header: { paddingBottom: '8px' },
          title: { letterSpacing: '1px' },
          footer: { paddingTop: '9px' },
          close: { right: '10px' },
        },
      },
      slots: { default: () => 'body-content' },
      attachTo: 'body',
    });
    await nextTick();
    const html = document.body.innerHTML;
    expect(html).toContain('opacity: 0.95');
    expect(html).toContain('color: rgb(1, 2, 3)');
    expect(html).toContain('background: rgb(4, 5, 6)');
    expect(html).toContain('padding-top: 11px');
    expect(html).toContain('margin-left: 12px');
    expect(html).toContain('border-radius: 14px');
    expect(html).toContain('padding-bottom: 8px');
    expect(html).toContain('letter-spacing: 1px');
    expect(html).toContain('padding-top: 9px');
    expect(html).toContain('right: 10px');
    wrapper.unmount();
  });

  it('supports functional classNames & styles merged with ConfigProvider.modal', async () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            modal={{
              classNames: {
                container: 'ctx-container',
                header: 'ctx-header',
              },
              styles: {
                header: { backgroundColor: 'rgb(10, 20, 30)' },
              },
            }}
          >
            <Modal
              getContainer={false}
              open
              title="Fn Modal"
              centered
              classNames={info => ({
                container: info.props.centered ? 'fn-centered-container' : 'fn-normal',
                title: 'fn-title',
              })}
              styles={info => ({
                container: info.props.footer ? { padding: '0px' } : { padding: '20px' },
                title: { color: 'rgb(9, 8, 7)' },
              })}
              v-slots={{
                default: () => 'Body',
                footer: () => <span>Custom Footer</span>,
              }}
            />
          </ConfigProvider>
        );
      },
    });
    await nextTick();
    const contentEl = wrapper.find('.ant-modal-content');
    expect(contentEl.classes()).toContain('ctx-container');
    expect(contentEl.classes()).toContain('fn-centered-container');
    expect(contentEl.element.style.padding).toBe('0px');

    const headerEl = wrapper.find('.ant-modal-header');
    expect(headerEl.classes()).toContain('ctx-header');
    expect(headerEl.element.style.backgroundColor).toBe('rgb(10, 20, 30)');

    const titleEl = wrapper.find('.ant-modal-title');
    expect(titleEl.classes()).toContain('fn-title');
    expect(titleEl.element.style.color).toBe('rgb(9, 8, 7)');
    wrapper.unmount();
  });

  it('supports functional classNames & styles on PurePanel', async () => {
    const wrapper = mount(PurePanel, {
      props: {
        title: 'Pure Semantic',
        classNames: info => ({
          root: 'pure-sem-root',
          container: info.props.title ? 'pure-has-title' : '',
          title: 'pure-sem-title',
        }),
        styles: () => ({
          container: { borderRadius: '12px' },
          body: { padding: '16px' },
        }),
      },
      slots: { default: () => 'Pure Body' },
    });
    await nextTick();
    expect(wrapper.find('.ant-modal-pure-panel').classes()).toContain('pure-sem-root');
    expect(wrapper.find('.ant-modal-content').classes()).toContain('pure-has-title');
    expect(wrapper.find('.ant-modal-content').element.style.borderRadius).toBe('12px');
    expect(wrapper.find('.ant-modal-title').classes()).toContain('pure-sem-title');
    expect(wrapper.find('.ant-modal-body').element.style.padding).toBe('16px');
    wrapper.unmount();
  });

  it('语义化属性不泄漏成 DOM attribute', async () => {
    const wrapper = mount(Modal, {
      props: { open: true, classNames: { body: 'x' }, styles: { body: { color: 'red' } } },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.body.innerHTML).not.toContain('classnames=');
    expect(document.body.innerHTML).not.toContain('styles=');
    wrapper.unmount();
  });
});
