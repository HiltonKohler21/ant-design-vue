import { mount } from '@vue/test-utils';
import Slider from '..';
import ConfigProvider from '../../config-provider';

const cls = wrapper => wrapper.element.getAttribute('class') || '';

describe('upstream semantic API: Slider（antd 5.25）', () => {
  it('classNames.root / classNames.rail / classNames.track / classNames.tracks / classNames.handle', () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 30,
        classNames: {
          root: 's-root',
          rail: 's-rail',
          track: 's-track',
          tracks: 's-tracks',
          handle: 's-handle',
        },
      },
    });
    const html = wrapper.html();
    expect(cls(wrapper)).toContain('s-root');
    expect(html).toContain('s-rail');
    expect(html).toContain('s-track');
    expect(html).toContain('s-tracks');
    expect(html).toContain('s-handle');
    expect(wrapper.find('.ant-slider-track').classes()).toContain('s-tracks');
  });

  it('styles.root / styles.track / styles.tracks / styles.handle / styles.rail', () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 30,
        styles: {
          root: { color: 'rgb(1, 2, 3)' },
          rail: { background: 'rgb(4, 5, 6)' },
          tracks: { opacity: '0.8' },
          track: { background: 'rgb(7, 8, 9)' },
          handle: { color: 'rgb(10, 11, 12)' },
        },
      },
    });
    const html = wrapper.html();
    expect(html).toContain('color: rgb(1, 2, 3)');
    expect(html).toContain('background: rgb(4, 5, 6)');
    expect(html).toContain('background: rgb(7, 8, 9)');
    expect(html).toContain('opacity: 0.8');
    expect(html).toContain('color: rgb(10, 11, 12)');
  });

  it('range 模式 classNames.tracks & styles.tracks/track/handle 生效', () => {
    const wrapper = mount(Slider, {
      props: {
        range: true,
        defaultValue: [20, 30, 50],
        classNames: { tracks: 'r-tracks', track: 'r-track', handle: 'r-handle' },
        styles: {
          tracks: { opacity: '0.7' },
          track: { background: 'rgb(11, 22, 33)' },
          handle: { borderColor: 'rgb(44, 55, 66)' },
        },
      },
    });
    const tracks = wrapper.findAll('.ant-slider-track');
    expect(tracks.length).toBe(2);
    tracks.forEach(track => {
      expect(track.classes()).toContain('r-tracks');
      expect(track.classes()).toContain('r-track');
      expect(track.element.style.opacity).toBe('0.7');
      expect(track.element.style.background).toContain('rgb(11, 22, 33)');
    });
    const handles = wrapper.findAll('.ant-slider-handle');
    expect(handles.length).toBe(3);
    handles.forEach(handle => {
      expect(handle.classes()).toContain('r-handle');
      expect(handle.element.style.borderColor).toBe('rgb(44, 55, 66)');
    });
  });

  it('ConfigProvider.slider className / style / classNames / styles', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            slider={{
              className: 'cp-slider',
              style: { marginTop: '12px' },
              classNames: { tracks: 'cp-tracks', rail: 'cp-rail' },
              styles: { tracks: { opacity: '0.6' } },
            }}
          >
            <Slider defaultValue={40} />
          </ConfigProvider>
        );
      },
    });
    const root = wrapper.find('.ant-slider');
    expect(root.classes()).toContain('cp-slider');
    expect(root.element.style.marginTop).toBe('12px');
    expect(wrapper.find('.ant-slider-rail').classes()).toContain('cp-rail');
    const track = wrapper.find('.ant-slider-track');
    expect(track.classes()).toContain('cp-tracks');
    expect(track.element.style.opacity).toBe('0.6');
  });

  it('语义化属性不泄漏成 DOM attribute', () => {
    const wrapper = mount(Slider, {
      props: { defaultValue: 30, classNames: { root: 'x' }, styles: { root: { color: 'red' } } },
    });
    expect(wrapper.element.hasAttribute('classnames')).toBe(false);
    expect(wrapper.element.hasAttribute('styles')).toBe(false);
  });

  it('supports functional classNames and styles with orientation prop', () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 30,
        orientation: 'vertical',
        classNames: info => ({
          root: `fn-${info.props.orientation}`,
          handle: 'fn-handle',
        }),
        styles: info =>
          info.props.orientation === 'vertical'
            ? {
                root: { height: '240px' },
                track: { backgroundColor: 'rgb(114, 46, 209)' },
              }
            : {},
      },
    });
    const root = wrapper.find('.ant-slider');
    expect(root.classes()).toContain('fn-vertical');
    expect(root.element.style.height).toBe('240px');
    expect(wrapper.find('.ant-slider-handle').classes()).toContain('fn-handle');
    expect(wrapper.find('.ant-slider-track').element.style.backgroundColor).toBe(
      'rgb(114, 46, 209)',
    );
  });

  it('supports disabled array per handle in range mode', () => {
    const wrapper = mount(Slider, {
      props: {
        range: true,
        defaultValue: [20, 50, 80],
        disabled: [true, false, true],
      },
    });
    const handles = wrapper.findAll('.ant-slider-handle');
    expect(handles.length).toBe(3);
    expect(handles[0].classes()).toContain('ant-slider-handle-disabled');
    expect(handles[0].attributes('aria-disabled')).toBe('true');
    expect(handles[1].classes()).not.toContain('ant-slider-handle-disabled');
    expect(handles[1].attributes('aria-disabled')).toBe('false');
    expect(handles[2].classes()).toContain('ant-slider-handle-disabled');
    expect(handles[2].attributes('aria-disabled')).toBe('true');
  });

  it('supports range editable add and delete nodes within minCount/maxCount', async () => {
    const onChange = jest.fn();
    const wrapper = mount(Slider, {
      props: {
        range: { editable: true, minCount: 1, maxCount: 3 },
        defaultValue: [20, 80],
        onChange,
      },
      attachTo: document.body,
    });
    const sliderEl = wrapper.find('.ant-slider').element;
    sliderEl.getBoundingClientRect = () => ({
      left: 0,
      right: 100,
      top: 0,
      bottom: 20,
      width: 100,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // Click rail at x=50 to add node -> [20, 50, 80]
    const rail = wrapper.find('.ant-slider-rail').element;
    rail.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, button: 0, clientX: 50, clientY: 10 }),
    );
    await wrapper.vm.$nextTick();
    expect(onChange).toHaveBeenLastCalledWith([20, 50, 80]);

    // Press Delete on first handle -> [50, 80]
    const firstHandle = wrapper.findAll('.ant-slider-handle')[0].element;
    firstHandle.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Delete' }));
    await wrapper.vm.$nextTick();
    expect(onChange).toHaveBeenLastCalledWith([50, 80]);

    wrapper.unmount();
  });
});
