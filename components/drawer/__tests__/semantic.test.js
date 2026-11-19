import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Drawer from '..';

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
});
