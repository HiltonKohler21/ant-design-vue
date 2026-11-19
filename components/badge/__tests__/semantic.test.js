import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Badge from '../../badge';
import Empty from '../../empty';
import Space from '../../space';
import Tooltip from '../../tooltip';
import Button from '../../button';

const cls = wrapper => wrapper.element.getAttribute('class') || '';

describe('upstream semantic API: Badge / Empty / Space / Tooltip', () => {
  it('Badge classNames.root + classNames.indicator', () => {
    const wrapper = mount(Badge, {
      props: { count: 5, classNames: { root: 'b-root', indicator: 'b-ind' } },
    });
    expect(cls(wrapper)).toContain('b-root');
    expect(wrapper.html()).toContain('b-ind');
  });

  it('Badge styles.root / styles.indicator', () => {
    const wrapper = mount(Badge, {
      props: {
        count: 5,
        styles: { root: { color: 'rgb(1, 2, 3)' }, indicator: { color: 'rgb(4, 5, 6)' } },
      },
    });
    const html = wrapper.html();
    expect(html).toContain('color: rgb(1, 2, 3)');
    expect(html).toContain('color: rgb(4, 5, 6)');
  });

  it('Empty 四个语义位', () => {
    const wrapper = mount(Empty, {
      props: {
        classNames: {
          root: 'e-root',
          image: 'e-image',
          description: 'e-desc',
          footer: 'e-footer',
        },
        styles: {
          root: { color: 'rgb(1, 2, 3)' },
          image: { color: 'rgb(4, 5, 6)' },
          description: { color: 'rgb(7, 8, 9)' },
          footer: { color: 'rgb(10, 11, 12)' },
        },
      },
      slots: { default: () => 'footer-content' },
    });
    const html = wrapper.html();
    for (const c of ['e-root', 'e-image', 'e-desc', 'e-footer']) expect(html).toContain(c);
    for (const v of [
      'color: rgb(1, 2, 3)',
      'color: rgb(4, 5, 6)',
      'color: rgb(7, 8, 9)',
      'color: rgb(10, 11, 12)',
    ])
      expect(html).toContain(v);
  });

  it('Space classNames.item / styles.item', () => {
    const wrapper = mount(Space, {
      props: {
        classNames: { item: 'sp-item' },
        styles: { item: { color: 'rgb(1, 2, 3)' } },
      },
      slots: { default: () => [<span>a</span>, <span>b</span>] },
    });
    const html = wrapper.html();
    expect(html).toContain('sp-item');
    expect(html).toContain('color: rgb(1, 2, 3)');
  });

  it('Tooltip classNames.root / classNames.body / styles.body', async () => {
    const wrapper = mount(Tooltip, {
      props: {
        open: true,
        title: 'tip',
        classNames: { root: 't-root', body: 't-body' },
        styles: { body: { color: 'rgb(1, 2, 3)' } },
      },
      slots: { default: () => <Button>btn</Button> },
      attachTo: 'body',
    });
    await nextTick();
    await nextTick();
    const html = document.body.innerHTML;
    expect(html).toContain('t-body');
    expect(html).toContain('color: rgb(1, 2, 3)');
    wrapper.unmount();
  });
});
