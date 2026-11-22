import { mount } from '@vue/test-utils';
import BorderBeam, { getBorderBeamGradient } from '..';

describe('BorderBeam', () => {
  it('renders children and one beam by default', () => {
    const wrapper = mount(BorderBeam, {
      slots: { default: () => <div class="child">content</div> },
    });
    expect(wrapper.find('.child').exists()).toBe(true);
    expect(wrapper.findAll('.ant-border-beam-beam').length).toBe(1);
  });

  it('renders N beams with items and applies gradient', () => {
    const wrapper = mount(BorderBeam, {
      props: {
        items: [{ color: '#ff0000' }, { color: [{ color: '#00ff00', percent: 20 }] }],
        duration: 3,
        lineWidth: 2,
      },
      slots: { default: () => <div>c</div> },
    });
    const beams = wrapper.findAll('.ant-border-beam-beam');
    expect(beams.length).toBe(2);
    expect(beams[0].attributes('style')).toContain('conic-gradient');
    expect(beams[0].attributes('style')).toContain('animation-duration: 3s');
  });

  it('getBorderBeamGradient builds conic-gradient for string/array', () => {
    expect(getBorderBeamGradient('#1677ff')).toContain('conic-gradient');
    expect(
      getBorderBeamGradient([
        { color: '#1677ff', percent: 10 },
        { color: '#52c41a', percent: 40 },
      ]),
    ).toContain('#52c41a 40%');
    expect(getBorderBeamGradient(undefined)).toBeUndefined();
  });
});
