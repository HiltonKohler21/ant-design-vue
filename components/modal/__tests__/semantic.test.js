import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Modal from '..';

describe('upstream semantic API: Modal（antd 5.25）', () => {
  it('classNames 覆盖 mask / wrapper / content / header / body / footer', async () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        title: 't',
        classNames: {
          mask: 'sem-mask',
          wrapper: 'sem-wrapper',
          content: 'sem-content',
          header: 'sem-header',
          body: 'sem-body',
          footer: 'sem-footer',
        },
      },
      slots: { default: () => 'body-content', footer: () => 'footer-content' },
      attachTo: 'body',
    });
    await nextTick();
    const html = document.body.innerHTML;
    for (const c of [
      'sem-mask',
      'sem-wrapper',
      'sem-content',
      'sem-header',
      'sem-body',
      'sem-footer',
    ]) {
      expect(html).toContain(c);
    }
    wrapper.unmount();
  });

  it('styles 覆盖 body / mask / wrapper / content', async () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        title: 't',
        styles: {
          body: { color: 'rgb(1, 2, 3)' },
          mask: { background: 'rgb(4, 5, 6)' },
          wrapper: { paddingTop: '11px' },
          content: { marginLeft: '12px' },
        },
      },
      slots: { default: () => 'body-content' },
      attachTo: 'body',
    });
    await nextTick();
    const html = document.body.innerHTML;
    expect(html).toContain('color: rgb(1, 2, 3)');
    expect(html).toContain('background: rgb(4, 5, 6)');
    expect(html).toContain('padding-top: 11px');
    expect(html).toContain('margin-left: 12px');
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
