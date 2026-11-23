import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Badge from '../../badge';
import ConfigProvider from '../../config-provider';
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

  it('Badge supports functional classNames and styles across count, dot, status, and no-wrapper paths', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // 1. Count mode with wrapped children
    const countWrapper = mount(Badge, {
      props: {
        count: 5,
        size: 'small',
        classNames: ({ props }) => ({
          root: `badge-root-${props.size}`,
          indicator: `badge-ind-${props.count}`,
        }),
        styles: ({ props }) => ({
          root: { padding: props.size === 'small' ? '2px' : '4px' },
          indicator: { backgroundColor: 'rgb(11, 22, 33)' },
        }),
      },
      slots: { default: () => <span class="inner-box">box</span> },
    });
    expect(countWrapper.find('.ant-badge').classes()).toContain('badge-root-small');
    expect(countWrapper.find('.ant-badge').element.style.padding).toBe('2px');
    expect(countWrapper.find('sup.ant-scroll-number').classes()).toContain('badge-ind-5');
    expect(countWrapper.find('sup.ant-scroll-number').element.style.backgroundColor).toBe(
      'rgb(11, 22, 33)',
    );

    await countWrapper.setProps({ count: 9, size: 'default' });
    expect(countWrapper.find('.ant-badge').classes()).toContain('badge-root-default');
    expect(countWrapper.find('.ant-badge').element.style.padding).toBe('4px');
    expect(countWrapper.find('sup.ant-scroll-number').classes()).toContain('badge-ind-9');

    // 2. Dot mode
    const dotWrapper = mount(Badge, {
      props: {
        dot: true,
        classNames: ({ props }) => ({
          root: props.dot ? 'dot-root' : 'normal-root',
          indicator: props.dot ? 'dot-ind' : 'normal-ind',
        }),
        styles: () => ({
          root: { margin: '3px' },
          indicator: { backgroundColor: 'rgb(44, 55, 66)' },
        }),
      },
      slots: { default: () => <span>target</span> },
    });
    expect(dotWrapper.find('.ant-badge').classes()).toContain('dot-root');
    expect(dotWrapper.find('.ant-badge').element.style.margin).toBe('3px');
    expect(dotWrapper.find('.ant-badge-dot').classes()).toContain('dot-ind');
    expect(dotWrapper.find('.ant-badge-dot').element.style.backgroundColor).toBe('rgb(44, 55, 66)');

    // 3. Status mode (no children)
    const statusWrapper = mount(Badge, {
      props: {
        status: 'success',
        text: 'Done',
        classNames: ({ props }) => ({
          root: `status-root-${props.status}`,
          indicator: `status-ind-${props.status}`,
        }),
        styles: ({ props }) => ({
          root: { display: props.status === 'success' ? 'inline-flex' : 'inline-block' },
          indicator: { width: '10px' },
        }),
      },
    });
    expect(statusWrapper.find('.ant-badge-status').classes()).toContain('status-root-success');
    expect(statusWrapper.find('.ant-badge-status').element.style.display).toBe('inline-flex');
    expect(statusWrapper.find('.ant-badge-status-dot').classes()).toContain('status-ind-success');
    expect(statusWrapper.find('.ant-badge-status-dot').element.style.width).toBe('10px');

    // 4. No-wrapper count mode
    const standaloneWrapper = mount(Badge, {
      props: {
        count: 12,
        classNames: ({ props }) => ({
          root: 'standalone-root',
          indicator: `standalone-ind-${props.count}`,
        }),
        styles: () => ({
          root: { opacity: '0.9' },
          indicator: { color: 'rgb(77, 88, 99)' },
        }),
      },
    });
    expect(standaloneWrapper.find('.ant-badge-not-a-wrapper').classes()).toContain(
      'standalone-root',
    );
    expect(standaloneWrapper.find('.ant-badge-not-a-wrapper').element.style.opacity).toBe('0.9');
    expect(standaloneWrapper.find('sup.ant-scroll-number').classes()).toContain(
      'standalone-ind-12',
    );
    expect(standaloneWrapper.find('sup.ant-scroll-number').element.style.color).toBe(
      'rgb(77, 88, 99)',
    );

    // 5. ConfigProvider functional merging
    const ctxWrapper = mount({
      render() {
        return (
          <ConfigProvider
            badge={{
              classNames: ({ props }) => ({
                root: `ctx-root-${props.count}`,
                indicator: 'ctx-ind',
              }),
              styles: () => ({
                root: { padding: '6px' },
                indicator: { fontSize: '12px' },
              }),
            }}
          >
            <Badge
              count={3}
              classNames={() => ({ root: 'own-root', indicator: 'own-ind' })}
              styles={() => ({ root: { margin: '2px' }, indicator: { color: 'rgb(9, 9, 9)' } })}
            />
          </ConfigProvider>
        );
      },
    });
    expect(ctxWrapper.find('.ant-badge').classes()).toContain('ctx-root-3');
    expect(ctxWrapper.find('.ant-badge').classes()).toContain('own-root');
    expect(ctxWrapper.find('.ant-badge').element.style.padding).toBe('6px');
    expect(ctxWrapper.find('.ant-badge').element.style.margin).toBe('2px');
    expect(ctxWrapper.find('sup.ant-scroll-number').classes()).toContain('ctx-ind');
    expect(ctxWrapper.find('sup.ant-scroll-number').classes()).toContain('own-ind');
    expect(ctxWrapper.find('sup.ant-scroll-number').element.style.fontSize).toBe('12px');
    expect(ctxWrapper.find('sup.ant-scroll-number').element.style.color).toBe('rgb(9, 9, 9)');

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
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
