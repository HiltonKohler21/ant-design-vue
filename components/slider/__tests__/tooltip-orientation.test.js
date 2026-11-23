import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Slider from '..';
import SliderTooltip from '../SliderTooltip';
import ConfigProvider from '../../config-provider';

describe('Slider tooltip config & orientation', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('supports unified tooltip prop (open, formatter, placement, getPopupContainer, autoAdjustOverflow, prefixCls)', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const getPopupContainer = jest.fn(() => container);
    const formatter = jest.fn(v => `${v}%`);

    const wrapper = mount(Slider, {
      props: {
        defaultValue: 40,
        tooltip: {
          open: true,
          formatter,
          placement: 'bottom',
          getPopupContainer,
          autoAdjustOverflow: false,
          prefixCls: 'custom-tip',
        },
      },
      attachTo: document.body,
    });
    await nextTick();

    const tooltipComp = wrapper.findComponent(SliderTooltip);
    expect(tooltipComp.exists()).toBe(true);
    expect(tooltipComp.props('open')).toBe(true);
    expect(tooltipComp.props('title')).toBe('40%');
    expect(tooltipComp.props('placement')).toBe('bottom');
    expect(tooltipComp.props('getPopupContainer')).toBe(getPopupContainer);
    expect(tooltipComp.props('autoAdjustOverflow')).toBe(false);
    expect(tooltipComp.props('prefixCls')).toBe('custom-tip');
    expect(formatter).toHaveBeenCalledWith(40);

    // Ensure tooltip & orientation do not leak onto DOM
    expect(wrapper.find('.ant-slider').attributes('tooltip')).toBeUndefined();
    expect(wrapper.find('.ant-slider').attributes('orientation')).toBeUndefined();
    wrapper.unmount();
  });

  it('hides tooltip when tooltip.formatter is null', async () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 30,
        tooltip: {
          open: true,
          formatter: null,
        },
      },
      attachTo: document.body,
    });
    await nextTick();

    const tooltipComp = wrapper.findComponent(SliderTooltip);
    expect(tooltipComp.props('open')).toBe(false);
    expect(tooltipComp.props('title')).toBe('');

    await wrapper.find('.ant-slider-handle').trigger('mouseenter');
    await nextTick();
    expect(tooltipComp.props('open')).toBe(false);
    wrapper.unmount();
  });

  it('keeps legacy tooltipOpen and tipFormatter backwards-compatible', async () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 25,
        tooltipOpen: true,
        tipFormatter: v => `val:${v}`,
        tooltipPlacement: 'left',
      },
      attachTo: document.body,
    });
    await nextTick();

    const tooltipComp = wrapper.findComponent(SliderTooltip);
    expect(tooltipComp.props('open')).toBe(true);
    expect(tooltipComp.props('title')).toBe('val:25');
    expect(tooltipComp.props('placement')).toBe('left');
    wrapper.unmount();
  });

  it('supports orientation="vertical" and orientation="horizontal"', async () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 50,
        orientation: 'vertical',
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-slider').classes()).toContain('ant-slider-vertical');
    expect(wrapper.findComponent(SliderTooltip).props('placement')).toBe('right');

    await wrapper.setProps({ orientation: 'horizontal', vertical: true });
    await nextTick();
    // orientation takes precedence over vertical
    expect(wrapper.find('.ant-slider').classes()).toContain('ant-slider-horizontal');
    expect(wrapper.find('.ant-slider').classes()).not.toContain('ant-slider-vertical');
    expect(wrapper.findComponent(SliderTooltip).props('placement')).toBe('top');
    wrapper.unmount();
  });

  it('computes RTL placement correctly with orientation="vertical"', async () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider direction="rtl">
            <Slider defaultValue={50} orientation="vertical" />
          </ConfigProvider>
        );
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-slider').classes()).toContain('ant-slider-vertical');
    expect(wrapper.findComponent(SliderTooltip).props('placement')).toBe('left');
    wrapper.unmount();
  });
});
