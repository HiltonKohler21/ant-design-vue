import { defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import BorderBeam, { getBorderBeamGradient } from '..';
import ConfigProvider from '../../config-provider';
import { unitless } from '../../theme/util/unitless';

describe('BorderBeam', () => {
  it('teleports a single beam directly inside the child element without adding a wrapper div', async () => {
    const wrapper = mount(BorderBeam, {
      slots: {
        default: () => (
          <div class="child" style="position: relative; border: 1px solid #eee">
            content
          </div>
        ),
      },
    });
    await nextTick();
    await nextTick();

    const child = wrapper.find('.child');
    expect(child.exists()).toBe(true);
    // No outer wrapper div around .child
    expect(child.element.parentElement).not.toHaveProperty(
      'className',
      expect.stringContaining('ant-border-beam'),
    );
    // Beam is teleported inside .child
    const beams = child.findAll('.ant-border-beam');
    expect(beams.length).toBe(1);
    expect(beams[0].attributes('aria-hidden')).toBe('true');
    expect(beams[0].attributes('style')).toContain('--ant-border-beam-inset-offset');
  });

  it('renders N beams with items, negative delay, CSS length size, and linear-gradient', async () => {
    const wrapper = mount(BorderBeam, {
      props: {
        items: [
          { color: '#ff0000', size: 120 },
          { color: [{ color: '#00ff00', percent: 50 }], lineWidth: 3, outset: 4 },
        ],
        duration: 4,
        lineWidth: 2,
        rootClassName: 'custom-beam',
      },
      slots: {
        default: () => (
          <div class="host" style="position: relative">
            c
          </div>
        ),
      },
    });
    await nextTick();
    await nextTick();

    const beams = wrapper.find('.host').findAll('.ant-border-beam');
    expect(beams.length).toBe(2);
    expect(beams[0].classes()).toContain('custom-beam');

    const style0 = beams[0].attributes('style') || '';
    expect(style0).toContain(
      '--ant-border-beam-beam-gradient: linear-gradient(to left, #ff0000 0%, #ff0000 70%, transparent)',
    );
    expect(style0).toContain('--ant-border-beam-duration: 4s');
    expect(style0).toContain('--ant-border-beam-line-width: 2px');
    expect(style0).toContain('--ant-border-beam-size: 120px');

    const style1 = beams[1].attributes('style') || '';
    expect(style1).toContain('--ant-border-beam-delay: -2s');
    expect(style1).toContain('--ant-border-beam-line-width: 3px');
    expect(style1).toContain('--ant-border-beam-inset-offset: -4px');
    expect(style1).toContain('#00ff00 35%');
  });

  it('supports count with negative phase delays and wraps custom Vue components', async () => {
    const CustomCard = defineComponent({
      setup(_, { slots, expose }) {
        expose({ customMethod: () => true });
        return () => (
          <div class="custom-card" style="position: relative">
            {slots.default?.()}
          </div>
        );
      },
    });

    const wrapper = mount(BorderBeam, {
      props: { count: 2, duration: 6 },
      slots: {
        default: () => <CustomCard>hello</CustomCard>,
      },
    });
    await nextTick();
    await nextTick();

    const beams = wrapper.find('.custom-card').findAll('.ant-border-beam');
    expect(beams.length).toBe(2);
    expect(beams[1].attributes('style')).toContain('--ant-border-beam-delay: -3s');
  });

  it('getBorderBeamGradient builds linear-gradient for string, string[], and stop objects', () => {
    expect(getBorderBeamGradient('#1677ff')).toBe(
      'linear-gradient(to left, #1677ff 0%, #1677ff 70%, transparent)',
    );
    expect(getBorderBeamGradient(['#1677ff', '#722ed1'])).toBe(
      'linear-gradient(to left, #1677ff 0%, #722ed1 70%, transparent)',
    );
    expect(
      getBorderBeamGradient([
        { color: '#1677ff', percent: 0 },
        { color: '#52c41a', percent: 50 },
      ]),
    ).toBe('linear-gradient(to left, #1677ff 0%, #52c41a 35%, #52c41a 70%, transparent)');
    expect(getBorderBeamGradient(undefined)).toBeUndefined();
    expect(getBorderBeamGradient([])).toBeUndefined();
  });

  it('warns in dev when both items and count are passed, respects motion=false, wires ConfigProvider.borderBeam, and removes orphaned beamDuration', async () => {
    expect(unitless.beamDuration).toBeUndefined();

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    document.head.innerHTML = '';

    const wrapper = mount(ConfigProvider, {
      props: {
        borderBeam: {
          className: 'cp-border-beam',
          style: { zIndex: 5 },
        },
        theme: {
          token: {
            motion: false,
          },
        },
      },
      slots: {
        default: () => (
          <BorderBeam count={2} items={[{ color: '#1677ff' }]}>
            <div class="motion-host" style="position: relative">
              content
            </div>
          </BorderBeam>
        ),
      },
    });
    await nextTick();
    await nextTick();

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('`count` is ignored when `items` is provided.'),
    );
    const beam = wrapper.find('.motion-host .ant-border-beam');
    expect(beam.exists()).toBe(true);
    expect(beam.classes()).toContain('cp-border-beam');
    expect(beam.classes()).toContain('ant-border-beam-no-motion');
    expect(beam.attributes('style')).toContain('z-index: 5');

    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('ant-border-beam-no-motion');

    errorSpy.mockRestore();
  });

  it('supports outset=0 for clipped non-uniform radius containers and count=3 evenly distributed phases', async () => {
    const wrapper = mount(BorderBeam, {
      props: { count: 3, duration: 6, outset: 0, lineWidth: 2, size: 56 },
      slots: {
        default: () => (
          <div
            class="radius-host"
            style="position: relative; border-radius: 20px 20px 0 0; overflow: hidden"
          >
            stream
          </div>
        ),
      },
    });
    await nextTick();
    await nextTick();

    const beams = wrapper.find('.radius-host').findAll('.ant-border-beam');
    expect(beams).toHaveLength(3);
    expect(beams[0].attributes('style')).toContain('--ant-border-beam-inset-offset: 0px');
    expect(beams[0].attributes('style')).toContain('--ant-border-beam-line-width: 2px');
    expect(beams[0].attributes('style')).toContain('--ant-border-beam-size: 56px');
    expect(beams[1].attributes('style')).toContain('--ant-border-beam-delay: -2s');
    expect(beams[2].attributes('style')).toContain('--ant-border-beam-delay: -4s');
  });
});
