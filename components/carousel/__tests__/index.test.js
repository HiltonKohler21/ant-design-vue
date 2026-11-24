import { mount } from '@vue/test-utils';
import { nextTick, h, createVNode } from 'vue';
import { asyncExpect, sleep } from '../../../tests/utils';
import Carousel from '..';
import ConfigProvider from '../../config-provider';
import mountTest from '../../../tests/shared/mountTest';

describe('Carousel', () => {
  mountTest(Carousel);
  // beforeEach(() => {
  //   jest.useFakeTimers();
  // });

  // afterEach(() => {
  //   jest.useRealTimers();
  // });
  it('should has innerSlider', () => {
    const props = {
      slots: {
        default: () => h('div'),
      },
      sync: false,
    };
    const wrapper = mount(Carousel, props);
    const { innerSlider } = wrapper.componentVM;
    expect(typeof innerSlider.slickNext).toBe('function');
  });

  it('should has prev, next and go function', async () => {
    const props = {
      slots: {
        default: () => [
          createVNode('div', null, '1'),
          createVNode('div', null, '2'),
          createVNode('div', null, '3'),
        ],
      },
      sync: false,
    };
    const wrapper = mount(Carousel, props);
    const { prev, next, goTo, innerSlider } = wrapper.componentVM;
    expect(typeof prev).toBe('function');
    expect(typeof next).toBe('function');
    expect(typeof goTo).toBe('function');

    expect(innerSlider.currentSlide).toBe(0);
    wrapper.vm.goTo(2);
    await asyncExpect(() => {
      expect(innerSlider.currentSlide).toBe(2);
    }, 1000);
    prev();
    await asyncExpect(() => {
      expect(innerSlider.currentSlide).toBe(1);
    }, 1000);

    next();

    await asyncExpect(() => {
      expect(innerSlider.currentSlide).toBe(2);
    }, 1000);
  });
  // TODO
  // it('should trigger autoPlay after window resize', async () => {
  //   const props = {
  //     props: {
  //       autoplay: true,
  //     },
  //     slots: {
  //       default: () => [
  //         createVNode('div', null, '1'),
  //         createVNode('div', null, '2'),
  //         createVNode('div', null, '3'),
  //       ],
  //     },
  //     sync: false,
  //   };
  //   const wrapper = mount(Carousel, props);
  //   await sleep(100);
  //   const spy = jest.spyOn(wrapper.componentVM.innerSlider, 'handleAutoPlay');
  //   window.resizeTo(1000);
  //   expect(spy).not.toHaveBeenCalled();
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //   expect(spy).toHaveBeenCalled();
  // });

  it('cancel resize listener when unmount', async () => {
    const props = {
      props: {
        autoplay: true,
      },
      slots: {
        default: () => [
          createVNode('div', null, '1'),
          createVNode('div', null, '2'),
          createVNode('div', null, '3'),
        ],
      },
      sync: false,
    };
    const wrapper = mount(Carousel, props);
    const spy = jest.spyOn(window, 'removeEventListener');
    wrapper.unmount();
    expect(spy).toHaveBeenCalled();
  });

  describe('should works for dotPosition', () => {
    ['left', 'right', 'top', 'bottom'].forEach(dotPosition => {
      it(dotPosition, async () => {
        const wrapper = mount(
          {
            render() {
              return (
                <Carousel dotPosition={dotPosition}>
                  <div />
                </Carousel>
              );
            },
          },
          { sync: false, attachTo: 'body' },
        );
        await sleep(100);
        expect(wrapper.html()).toMatchSnapshot();
      });
    });
  });

  it('warning', () => {
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount({
      render() {
        return (
          <Carousel vertical>
            <div />
          </Carousel>
        );
      },
    });
    expect(warnSpy).toHaveBeenCalledWith(
      'Warning: [ant-design-vue: Carousel] `vertical` is deprecated, please use `dotPosition` instead.',
    );
    warnSpy.mockRestore();
  });

  it('supports dotPlacement with RTL-aware start/end mapping and precedence over dotPosition', () => {
    const ltrStart = mount({
      render() {
        return (
          <Carousel dotPlacement="start" dotPosition="top">
            <div>1</div>
            <div>2</div>
          </Carousel>
        );
      },
    });
    expect(ltrStart.find('.ant-carousel').classes()).toContain('ant-carousel-vertical');
    expect(ltrStart.find('.slick-dots').classes()).toContain('slick-dots-left');

    const ltrEnd = mount({
      render() {
        return (
          <Carousel dotPlacement="end">
            <div>1</div>
            <div>2</div>
          </Carousel>
        );
      },
    });
    expect(ltrEnd.find('.ant-carousel').classes()).toContain('ant-carousel-vertical');
    expect(ltrEnd.find('.slick-dots').classes()).toContain('slick-dots-right');

    const rtlStart = mount({
      render() {
        return (
          <ConfigProvider direction="rtl">
            <Carousel dotPlacement="start">
              <div>1</div>
              <div>2</div>
            </Carousel>
          </ConfigProvider>
        );
      },
    });
    expect(rtlStart.find('.ant-carousel').classes()).toContain('ant-carousel-vertical');
    expect(rtlStart.find('.slick-dots').classes()).toContain('slick-dots-right');

    const rtlEnd = mount({
      render() {
        return (
          <ConfigProvider direction="rtl">
            <Carousel dotPlacement="end">
              <div>1</div>
              <div>2</div>
            </Carousel>
          </ConfigProvider>
        );
      },
    });
    expect(rtlEnd.find('.ant-carousel').classes()).toContain('ant-carousel-vertical');
    expect(rtlEnd.find('.slick-dots').classes()).toContain('slick-dots-left');

    const topPlacement = mount({
      render() {
        return (
          <Carousel dotPlacement="top">
            <div>1</div>
            <div>2</div>
          </Carousel>
        );
      },
    });
    expect(topPlacement.find('.ant-carousel').classes()).not.toContain('ant-carousel-vertical');
    expect(topPlacement.find('.slick-dots').classes()).toContain('slick-dots-top');
  });

  it('supports autoplay={{ dotDuration: true }} with custom autoplaySpeed and cssVar-safe CSS', async () => {
    document.head.innerHTML = '';
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider theme={{ cssVar: true }}>
            <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={5000}>
              <div>1</div>
              <div>2</div>
            </Carousel>
          </ConfigProvider>
        );
      },
    });
    await nextTick();
    const root = wrapper.find('.ant-carousel');
    expect(root.attributes('style')).toContain('--dot-duration: 5000ms');

    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('var(--dot-duration');
    expect(css).toContain('dot-animation');
    expect(css).not.toContain('NaN');
    wrapper.unmount();

    const defaultSpeedWrapper = mount({
      render() {
        return (
          <Carousel autoplay={{ dotDuration: true }}>
            <div>1</div>
            <div>2</div>
          </Carousel>
        );
      },
    });
    expect(defaultSpeedWrapper.find('.ant-carousel').attributes('style')).toContain(
      '--dot-duration: 3000ms',
    );
    defaultSpeedWrapper.unmount();

    const boolAutoplayWrapper = mount({
      render() {
        return (
          <Carousel autoplay>
            <div>1</div>
            <div>2</div>
          </Carousel>
        );
      },
    });
    expect(boolAutoplayWrapper.find('.ant-carousel').attributes('style')).toBeUndefined();
    boolAutoplayWrapper.unmount();
  });

  it('renders accessible styled prev/next arrows when arrows=true and supports vertical dotPlacement', async () => {
    document.head.innerHTML = '';
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider theme={{ cssVar: true }}>
            <Carousel arrows infinite={false}>
              <div>1</div>
              <div>2</div>
              <div>3</div>
            </Carousel>
          </ConfigProvider>
        );
      },
    });
    await nextTick();
    const prevBtn = wrapper.find('button.slick-prev');
    const nextBtn = wrapper.find('button.slick-next');
    expect(prevBtn.exists()).toBe(true);
    expect(nextBtn.exists()).toBe(true);
    expect(prevBtn.text()).toBe('');
    expect(nextBtn.text()).toBe('');
    expect(prevBtn.attributes('aria-label')).toBe('Previous slide');
    expect(nextBtn.attributes('aria-label')).toBe('Next slide');
    expect(prevBtn.classes()).toContain('slick-disabled');
    expect(nextBtn.classes()).not.toContain('slick-disabled');

    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('.slick-prev');
    expect(css).toContain(':empty::after');
    expect(css).not.toContain('NaN');
    wrapper.unmount();
  });
});
