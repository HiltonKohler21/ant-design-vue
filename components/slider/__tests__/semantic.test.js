import { mount } from '@vue/test-utils';
import Slider from '..';

const cls = wrapper => wrapper.element.getAttribute('class') || '';

describe('upstream semantic API: Slider（antd 5.25）', () => {
  it('classNames.root / classNames.rail / classNames.track / classNames.handle', () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 30,
        classNames: {
          root: 's-root',
          rail: 's-rail',
          track: 's-track',
          handle: 's-handle',
        },
      },
    });
    const html = wrapper.html();
    expect(cls(wrapper)).toContain('s-root');
    expect(html).toContain('s-rail');
    expect(html).toContain('s-track');
    expect(html).toContain('s-handle');
  });

  it('styles.root / styles.track / styles.handle / styles.rail', () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 30,
        styles: {
          root: { color: 'rgb(1, 2, 3)' },
          rail: { background: 'rgb(4, 5, 6)' },
          track: { background: 'rgb(7, 8, 9)' },
          handle: { color: 'rgb(10, 11, 12)' },
        },
      },
    });
    const html = wrapper.html();
    expect(html).toContain('color: rgb(1, 2, 3)');
    expect(html).toContain('background: rgb(4, 5, 6)');
    expect(html).toContain('background: rgb(7, 8, 9)');
    expect(html).toContain('color: rgb(10, 11, 12)');
  });

  it('range 模式同样生效', () => {
    const wrapper = mount(Slider, {
      props: {
        range: true,
        defaultValue: [20, 50],
        classNames: { track: 'r-track', handle: 'r-handle' },
      },
    });
    const html = wrapper.html();
    expect(html).toContain('r-track');
    expect(html).toContain('r-handle');
  });

  it('语义化属性不泄漏成 DOM attribute', () => {
    const wrapper = mount(Slider, {
      props: { defaultValue: 30, classNames: { root: 'x' }, styles: { root: { color: 'red' } } },
    });
    expect(wrapper.element.hasAttribute('classnames')).toBe(false);
    expect(wrapper.element.hasAttribute('styles')).toBe(false);
  });
});
