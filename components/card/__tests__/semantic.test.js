import { mount } from '@vue/test-utils';
import Button from '../../button';
import Card from '../../card';
import Descriptions from '../../descriptions';
import List from '../../list';

describe('upstream semantic API: Button / Card / Descriptions / List', () => {
  it('Button classNames.icon / styles.icon', () => {
    const wrapper = mount(Button, {
      props: {
        classNames: { icon: 'btn-icon' },
        styles: { icon: { color: 'rgb(1, 2, 3)' } },
      },
      slots: { default: () => 'ok', icon: () => <span class="raw-icon">i</span> },
    });
    const html = wrapper.html();
    expect(html).toContain('btn-icon');
    expect(html).toContain('color: rgb(1, 2, 3)');
  });

  it('Card 六个语义位', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'T',
        extra: 'E',
        cover: <div>cover</div>,
        classNames: {
          header: 'c-head',
          title: 'c-title',
          extra: 'c-extra',
          cover: 'c-cover',
          body: 'c-body',
          actions: 'c-actions',
        },
        styles: {
          header: { color: 'rgb(1, 2, 3)' },
          body: { color: 'rgb(4, 5, 6)' },
        },
        actions: [<span>a1</span>],
      },
      slots: { default: () => 'body' },
    });
    const html = wrapper.html();
    for (const c of ['c-head', 'c-title', 'c-extra', 'c-cover', 'c-body', 'c-actions'])
      expect(html).toContain(c);
    expect(html).toContain('color: rgb(1, 2, 3)');
    expect(html).toContain('color: rgb(4, 5, 6)');
  });

  it('Descriptions root/header/title/extra', () => {
    const wrapper = mount(Descriptions, {
      props: {
        title: 'T',
        extra: 'E',
        classNames: { root: 'd-root', header: 'd-head', title: 'd-title', extra: 'd-extra' },
        styles: { root: { color: 'rgb(1, 2, 3)' } },
      },
      slots: { default: () => [<Descriptions.Item label="l">c</Descriptions.Item>] },
    });
    const html = wrapper.html();
    for (const c of ['d-root', 'd-head', 'd-title', 'd-extra']) expect(html).toContain(c);
    expect(html).toContain('color: rgb(1, 2, 3)');
  });

  it('List.Item classNames.actions / styles.actions', () => {
    const wrapper = mount(List.Item, {
      props: {
        actions: [<span>act</span>],
        classNames: { actions: 'l-actions' },
        styles: { actions: { color: 'rgb(1, 2, 3)' } },
      },
      slots: { default: () => 'item' },
    });
    const html = wrapper.html();
    expect(html).toContain('l-actions');
    expect(html).toContain('color: rgb(1, 2, 3)');
  });
});
