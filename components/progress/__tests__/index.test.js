import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import { handleGradient, sortGradient } from '../Line';
import Progress from '..';
import ProgressSteps from '../Steps';
import ConfigProvider from '../../config-provider';

describe('Progress', () => {
  it('successPercent should decide the progress status when it exists', async () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 100,
        success: { percent: 50 },
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-progress-status-success')).toHaveLength(0);
    });

    wrapper.setProps({ percent: 50, success: { percent: 100 } });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-progress-status-success')).toHaveLength(1);
    });

    wrapper.setProps({ percent: 100, success: { percent: 0 } });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-progress-status-success')).toHaveLength(0);
    });
  });

  it('render out-of-range progress', async () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 120,
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('render out-of-range progress with info', async () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 120,
        showInfo: true,
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('render negative progress', async () => {
    const wrapper = mount(Progress, {
      props: {
        percent: -20,
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('render negative successPercent', async () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 50,
        success: { percent: -20 },
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('render format', async () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 50,
        success: { percent: 10 },
        format: (percent, successPercent) => `${percent} ${successPercent}`,
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('render strokeColor', async () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 50,
        type: 'circle',
        strokeColor: 'red',
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
    wrapper.setProps({
      strokeColor: {
        from: '#108ee9',
        to: '#87d068',
      },
      type: 'line',
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
    wrapper.setProps({
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('render normal progress', () => {
    const wrapper = mount(Progress, { props: { status: 'normal' } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('render trailColor progress', () => {
    const wrapper = mount({
      render() {
        return <Progress status="normal" trailColor="#ffffff" />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('render successColor progress', () => {
    const wrapper = mount({
      render() {
        return <Progress percent={60} success={{ percent: 30, strokeColor: '#ffffff' }} />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('render dashboard zero gapDegree', () => {
    const wrapper = mount({
      render() {
        return <Progress type="dashboard" gapDegree={0} />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('render dashboard 295 gapDegree', () => {
    const wrapper = mount({
      render() {
        return <Progress type="dashboard" gapDegree={295} />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('render dashboard 296 gapDegree', () => {
    const wrapper = mount({
      render() {
        return <Progress type="dashboard" gapDegree={296} />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('get correct line-gradient', () => {
    expect(handleGradient({ from: 'test', to: 'test' }).backgroundImage).toBe(
      'linear-gradient(to right, test, test)',
    );
    expect(handleGradient({}).backgroundImage).toBe('linear-gradient(to right, #1890FF, #1890FF)');
    expect(handleGradient({ from: 'test', to: 'test', '0%': 'test' }).backgroundImage).toBe(
      'linear-gradient(to right, test 0%)',
    );
  });

  it('sort gradients correctly', () => {
    expect(sortGradient({ '10%': 'test10', '30%': 'test30', '20%': 'test20' })).toBe(
      'test10 10%, test20 20%, test30 30%',
    );
    expect(sortGradient({ '10%': 'test10', '30%': 'test30', '20%': 'test20', dummy: 'test' })).toBe(
      'test10 10%, test20 20%, test30 30%',
    );
  });

  it('should show success status when percent is 100', () => {
    const wrapper = mount({
      render() {
        return <Progress percent={100} />;
      },
    });
    expect(wrapper.findAll('.ant-progress-status-success')).toHaveLength(1);
  });

  // https://github.com/ant-design/ant-design/issues/15950
  it('should show success status when percent is 100 and status is undefined', () => {
    const wrapper = mount({
      render() {
        return <Progress percent={100} status={undefined} />;
      },
    });
    expect(wrapper.findAll('.ant-progress-status-success')).toHaveLength(1);
  });

  // // https://github.com/ant-design/ant-design/pull/15951#discussion_r273062969
  // it('should show success status when status is invalid', () => {
  //   const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  //   const wrapper = mount({
  //     render() {
  //       return <Progress percent={100} status="invalid" />;
  //     },
  //   });
  //   expect(wrapper.findAll('.ant-progress-status-success')).toHaveLength(1);
  //   errorSpy.mockRestore();
  // });

  it('should support steps', () => {
    const wrapper = mount({
      render() {
        return <Progress steps={3} />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('steps should be changable', async () => {
    const wrapper = mount({
      render() {
        return <Progress steps={5} percent={60} />;
      },
    });
    expect(wrapper.findAll('.ant-progress-steps-item-active').length).toBe(3);
    wrapper.setProps({ percent: 40 });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-progress-steps-item-active').length).toBe(2);
    });
  });

  it('steps should be changable when has strokeColor', async () => {
    const wrapper = mount({
      render() {
        return <Progress steps={5} percent={60} strokeColor="#1890ff" />;
      },
    });
    expect(wrapper.findAll('.ant-progress-steps-item')[0].element.style.backgroundColor).toBe(
      'rgb(24, 144, 255)',
    );
    wrapper.setProps({ percent: 40 });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-progress-steps-item')[2].element.style.backgroundColor).toBe('');
      expect(wrapper.findAll('.ant-progress-steps-item')[1].element.style.backgroundColor).toBe(
        'rgb(24, 144, 255)',
      );
    });
  });

  it('steps should support trailColor', () => {
    const wrapper = mount(<Progress steps={5} percent={20} trailColor="#1890ee" />);
    expect(wrapper.findAll('.ant-progress-steps-item')[1].element.style.backgroundColor).toBe(
      'rgb(24, 144, 238)',
    );
  });

  it('should display correct step', async () => {
    const wrapper = mount({
      render() {
        return <Progress steps={9} percent={22.22} />;
      },
    });
    expect(wrapper.findAll('.ant-progress-steps-item-active').length).toBe(2);
    wrapper.setProps({ percent: 33.33 });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-progress-steps-item-active').length).toBe(3);
    });
    wrapper.setProps({ percent: 44.44 });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-progress-steps-item-active').length).toBe(4);
    });
  });

  it('steps should have default percent 0', () => {
    const wrapper = mount({
      render() {
        return <ProgressSteps />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should warning if use `progress` in success', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount(<Progress percent={60} success={{ progress: 30 }} />);
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [ant-design-vue: Progress] `success.progress` is deprecated. Please use `success.percent` instead.',
    );
  });

  it('should warning if use `progress` in success in type Circle', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount({
      render() {
        return <Progress percent={60} success={{ progress: 30 }} type="circle" />;
      },
    });
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [ant-design-vue: Progress] `success.progress` is deprecated. Please use `success.percent` instead.',
    );
  });

  it('percentPosition supports both string and { align, type } object', () => {
    const strInner = mount(Progress, {
      props: { percent: 50, percentPosition: 'inner' },
    });
    expect(strInner.classes()).toContain('ant-progress-line-position-inner');
    expect(strInner.classes()).toContain('ant-progress-line-align-end');
    expect(strInner.classes()).toContain('ant-progress-show-info-inner');
    expect(strInner.find('.ant-progress-bg-inner .ant-progress-text-inner').exists()).toBe(true);

    const objInnerStart = mount(Progress, {
      props: { percent: 100, percentPosition: { align: 'start', type: 'inner' } },
    });
    expect(objInnerStart.classes()).toContain('ant-progress-line-position-inner');
    expect(objInnerStart.classes()).toContain('ant-progress-line-align-start');
    const innerText = objInnerStart.find('.ant-progress-bg-inner .ant-progress-text');
    expect(innerText.exists()).toBe(true);
    expect(innerText.classes()).toContain('ant-progress-text-start');
    expect(innerText.classes()).toContain('ant-progress-text-inner');
    expect(innerText.text()).toBe('100%');

    const outerStart = mount(Progress, {
      props: { percent: 50, percentPosition: { align: 'start', type: 'outer' } },
    });
    expect(outerStart.classes()).toContain('ant-progress-line-position-outer');
    expect(outerStart.classes()).toContain('ant-progress-line-align-start');
    const outerChildren = outerStart.find('.ant-progress-outer').element.children;
    expect(outerChildren[0].className).toContain('ant-progress-text');
    expect(outerChildren[0].className).toContain('ant-progress-text-start');
    expect(outerChildren[0].className).toContain('ant-progress-text-outer');
    expect(outerChildren[1].className).toContain('ant-progress-inner');

    const outerCenter = mount(Progress, {
      props: { percent: 50, percentPosition: { align: 'center', type: 'outer' } },
    });
    expect(outerCenter.classes()).toContain('ant-progress-line-position-outer');
    expect(outerCenter.classes()).toContain('ant-progress-line-align-center');
    expect(outerCenter.find('.ant-progress-layout-bottom').exists()).toBe(true);
    expect(outerCenter.find('.ant-progress-layout-bottom .ant-progress-text-center').exists()).toBe(
      true,
    );

    const outerEnd = mount(Progress, {
      props: { percent: 50, percentPosition: { align: 'end', type: 'outer' } },
    });
    const endChildren = outerEnd.find('.ant-progress-outer').element.children;
    expect(endChildren[0].className).toContain('ant-progress-inner');
    expect(endChildren[1].className).toContain('ant-progress-text-end');
  });

  it('ConfigProvider.progress wires className and style', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider progress={{ className: 'cp-progress', style: { marginTop: '6px' } }}>
            <Progress percent={30} />
          </ConfigProvider>
        );
      },
    });
    const root = wrapper.find('.ant-progress');
    expect(root.classes()).toContain('cp-progress');
    expect(root.element.style.marginTop).toBe('6px');
  });

  it('supports railColor alias taking precedence over trailColor on line, circle, and steps', () => {
    const lineWrapper = mount(Progress, {
      props: { percent: 40, railColor: 'rgb(10, 20, 30)', trailColor: 'rgb(99, 99, 99)' },
    });
    expect(lineWrapper.find('.ant-progress-inner').element.style.backgroundColor).toBe(
      'rgb(10, 20, 30)',
    );

    const stepsWrapper = mount(Progress, {
      props: { steps: 4, percent: 25, railColor: 'rgb(11, 22, 33)', trailColor: 'rgb(88, 88, 88)' },
    });
    expect(stepsWrapper.findAll('.ant-progress-steps-item')[2].element.style.backgroundColor).toBe(
      'rgb(11, 22, 33)',
    );

    const circleWrapper = mount(Progress, {
      props: {
        type: 'circle',
        percent: 50,
        railColor: '#abcdef',
        trailColor: '#111111',
      },
    });
    expect(circleWrapper.find('.ant-progress-circle-trail').attributes('stroke')).toBe('#abcdef');
  });

  it('supports gapPlacement with RTL-aware start/end mapping and precedence over gapPosition', () => {
    const ltrStart = mount(Progress, {
      props: { type: 'dashboard', percent: 50, gapPlacement: 'start', gapPosition: 'top' },
    });
    const ltrLeft = mount(Progress, {
      props: { type: 'dashboard', percent: 50, gapPosition: 'left' },
    });
    expect(ltrStart.find('.ant-progress-circle-trail').attributes('d')).toBe(
      ltrLeft.find('.ant-progress-circle-trail').attributes('d'),
    );

    const ltrEnd = mount(Progress, {
      props: { type: 'dashboard', percent: 50, gapPlacement: 'end' },
    });
    const ltrRight = mount(Progress, {
      props: { type: 'dashboard', percent: 50, gapPosition: 'right' },
    });
    expect(ltrEnd.find('.ant-progress-circle-trail').attributes('d')).toBe(
      ltrRight.find('.ant-progress-circle-trail').attributes('d'),
    );

    const rtlStart = mount({
      render() {
        return (
          <ConfigProvider direction="rtl">
            <Progress type="dashboard" percent={50} gapPlacement="start" />
          </ConfigProvider>
        );
      },
    });
    expect(rtlStart.find('.ant-progress-circle-trail').attributes('d')).toBe(
      ltrRight.find('.ant-progress-circle-trail').attributes('d'),
    );

    const rtlEnd = mount({
      render() {
        return (
          <ConfigProvider direction="rtl">
            <Progress type="dashboard" percent={50} gapPlacement="end" />
          </ConfigProvider>
        );
      },
    });
    expect(rtlEnd.find('.ant-progress-circle-trail').attributes('d')).toBe(
      ltrLeft.find('.ant-progress-circle-trail').attributes('d'),
    );
  });

  it('supports static and functional classNames/styles merged with ConfigProvider.progress', () => {
    const lineWrapper = mount({
      render() {
        return (
          <ConfigProvider
            progress={{
              classNames: ({ props }) => ({
                root: `ctx-root-${props.type}`,
                rail: 'ctx-rail',
              }),
              styles: {
                root: { padding: '4px' },
                indicator: { fontWeight: 'bold' },
              },
            }}
          >
            <Progress
              percent={50}
              classNames={({ props }) => ({
                root: `prop-root-${props.percent}`,
                body: 'prop-body',
                rail: 'prop-rail',
                track: 'prop-track',
                indicator: 'prop-indicator',
              })}
              styles={({ props }) => ({
                root: { marginBottom: props.percent === 50 ? '8px' : '0px' },
                body: { opacity: '0.9' },
                rail: { borderRadius: '2px' },
                track: { boxShadow: 'none' },
                indicator: { color: 'rgb(1, 2, 3)' },
              })}
            />
          </ConfigProvider>
        );
      },
    });

    const root = lineWrapper.find('.ant-progress');
    expect(root.classes()).toContain('ctx-root-line');
    expect(root.classes()).toContain('prop-root-50');
    expect(root.attributes('style')).toContain('padding: 4px');
    expect(root.attributes('style')).toContain('margin-bottom: 8px');

    const body = lineWrapper.find('.ant-progress-outer');
    expect(body.classes()).toContain('prop-body');
    expect(body.attributes('style')).toContain('opacity: 0.9');

    const rail = lineWrapper.find('.ant-progress-inner');
    expect(rail.classes()).toContain('ctx-rail');
    expect(rail.classes()).toContain('prop-rail');
    expect(rail.attributes('style')).toContain('border-radius: 2px');

    const track = lineWrapper.find('.ant-progress-bg');
    expect(track.classes()).toContain('prop-track');
    expect(track.attributes('style')).toContain('box-shadow: none');

    const indicator = lineWrapper.find('.ant-progress-text');
    expect(indicator.classes()).toContain('prop-indicator');
    expect(indicator.attributes('style')).toContain('font-weight: bold');
    expect(indicator.attributes('style')).toContain('color: rgb(1, 2, 3)');

    // Circle semantic classNames & styles
    const circleWrapper = mount(Progress, {
      props: {
        type: 'circle',
        percent: 60,
        classNames: {
          root: 'c-root',
          body: 'c-body',
          rail: 'c-rail',
          track: 'c-track',
          indicator: 'c-indicator',
        },
        styles: {
          body: { padding: '2px' },
          rail: { opacity: '0.4' },
          track: { opacity: '0.8' },
          indicator: { letterSpacing: '1px' },
        },
      },
    });
    expect(circleWrapper.find('.ant-progress').classes()).toContain('c-root');
    expect(circleWrapper.find('.ant-progress-inner').classes()).toContain('c-body');
    expect(circleWrapper.find('.ant-progress-inner').attributes('style')).toContain('padding: 2px');
    expect(circleWrapper.find('.ant-progress-circle-trail').classes()).toContain('c-rail');
    expect(circleWrapper.find('.ant-progress-circle-trail').attributes('style')).toContain(
      'opacity: 0.4',
    );
    expect(circleWrapper.find('.ant-progress-circle-path').classes()).toContain('c-track');
    expect(circleWrapper.find('.ant-progress-circle-path').attributes('style')).toContain(
      'opacity: 0.8',
    );
    expect(circleWrapper.find('.ant-progress-text').classes()).toContain('c-indicator');
    expect(circleWrapper.find('.ant-progress-text').attributes('style')).toContain(
      'letter-spacing: 1px',
    );

    // Steps semantic classNames & styles
    const stepsWrapper = mount(Progress, {
      props: {
        steps: 3,
        percent: 34,
        classNames: {
          body: 's-body',
          rail: 's-rail',
          track: 's-track',
          indicator: 's-indicator',
        },
        styles: {
          body: { gap: '2px' },
          rail: { opacity: '0.3' },
          track: { opacity: '0.95' },
        },
      },
    });
    expect(stepsWrapper.find('.ant-progress-steps-outer').classes()).toContain('s-body');
    expect(stepsWrapper.find('.ant-progress-steps-outer').attributes('style')).toContain(
      'gap: 2px',
    );
    const items = stepsWrapper.findAll('.ant-progress-steps-item');
    expect(items[0].classes()).toContain('s-track');
    expect(items[0].attributes('style')).toContain('opacity: 0.95');
    expect(items[1].classes()).toContain('s-rail');
    expect(items[1].attributes('style')).toContain('opacity: 0.3');
    expect(stepsWrapper.find('.ant-progress-text').classes()).toContain('s-indicator');
  });

  it('emits max-width:100% constraints on line/outer/layout-bottom/inner without breaking circle/dashboard/steps/custom size', () => {
    document.head.innerHTML = '';
    const lineCustom = mount(Progress, {
      props: {
        percent: 100,
        percentPosition: { align: 'center', type: 'inner' },
        size: [400, 20],
      },
    });
    expect(lineCustom.find('.ant-progress-outer').element.style.width).toBe('400px');
    expect(lineCustom.find('.ant-progress-bg').element.style.height).toBe('20px');

    const circle = mount(Progress, { props: { type: 'circle', percent: 50, size: 120 } });
    expect(circle.find('.ant-progress-inner').element.style.width).toBe('120px');
    expect(circle.find('.ant-progress-inner').element.style.height).toBe('120px');

    const dashboard = mount(Progress, { props: { type: 'dashboard', percent: 50, size: 80 } });
    expect(dashboard.find('.ant-progress-inner').element.style.width).toBe('80px');
    expect(dashboard.find('.ant-progress-inner').element.style.height).toBe('80px');

    const steps = mount(Progress, { props: { steps: 3, percent: 50, size: [20, 30] } });
    expect(steps.findAll('.ant-progress-steps-item')).toHaveLength(3);
    expect(steps.findAll('.ant-progress-steps-item')[0].element.style.width).toBe('20px');
    expect(steps.findAll('.ant-progress-steps-item')[0].element.style.height).toBe('30px');

    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toMatch(/\.ant-progress-line\{[^}]*max-width:100%/);
    expect(css).toMatch(/\.ant-progress-outer\{[^}]*max-width:100%/);
    expect(css).toMatch(/\.ant-progress-layout-bottom\{[^}]*max-width:100%/);
    expect(css).toMatch(/\.ant-progress-inner\{[^}]*max-width:100%/);
  });
});
