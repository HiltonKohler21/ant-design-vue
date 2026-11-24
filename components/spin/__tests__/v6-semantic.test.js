import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Spin from '..';
import ConfigProvider from '../../config-provider';

describe('Spin v6 APIs & Semantic DOM', () => {
  afterEach(() => {
    Spin.setDefaultIndicator(null);
    jest.useRealTimers();
  });

  it('supports description prop/slot and prioritizes description over tip', () => {
    const wDesc = mount(Spin, {
      props: { description: 'Loading data...' },
    });
    expect(wDesc.find('.ant-spin-description').text()).toBe('Loading data...');
    expect(wDesc.find('.ant-spin-text').text()).toBe('Loading data...');
    expect(wDesc.find('.ant-spin').classes()).toContain('ant-spin-show-text');

    const wPriority = mount(Spin, {
      props: { description: 'Primary Description', tip: 'Legacy Tip' },
    });
    expect(wPriority.find('.ant-spin-description').text()).toBe('Primary Description');

    const wSlot = mount(Spin, {
      props: { tip: 'Legacy Tip' },
      slots: { description: () => <span class="desc-slot">Slot Description</span> },
    });
    expect(wSlot.find('.desc-slot').text()).toBe('Slot Description');

    const wLegacyTip = mount(Spin, {
      props: { tip: 'Only Tip' },
    });
    expect(wLegacyTip.find('.ant-spin-description').text()).toBe('Only Tip');
    expect(wLegacyTip.find('.ant-spin-text').text()).toBe('Only Tip');
  });

  it('renders upstream inline SVG circular progress and transitions smoothly from Looper', async () => {
    // percent=0 keeps Looper visible and does not render SVG progress yet
    const wZero = mount(Spin, {
      props: { spinning: true, percent: 0 },
    });
    expect(wZero.find('.ant-spin-dot-holder').classes()).not.toContain(
      'ant-spin-dot-holder-hidden',
    );
    expect(wZero.find('.ant-spin-dot-progress').exists()).toBe(false);

    // percent=50 hides Looper and renders inline SVG progressbar with viewBox="0 0 100 100"
    await wZero.setProps({ percent: 50 });
    await nextTick();
    expect(wZero.find('.ant-spin-dot-holder').classes()).toContain('ant-spin-dot-holder-hidden');
    const progressEl = wZero.find('.ant-spin-dot-progress');
    expect(progressEl.exists()).toBe(true);
    expect(progressEl.classes()).not.toContain('ant-spin-dot-holder-hidden');
    const svg = progressEl.find('svg');
    expect(svg.attributes('viewBox')).toBe('0 0 100 100');
    expect(svg.attributes('role')).toBe('progressbar');
    expect(svg.attributes('aria-valuenow')).toBe('50');
    expect(svg.findAll('circle').length).toBe(2);
    expect(svg.find('.ant-spin-dot-circle-bg').exists()).toBe(true);

    // percent clamped to 100
    await wZero.setProps({ percent: 120 });
    await nextTick();
    expect(wZero.find('svg[role="progressbar"]').attributes('aria-valuenow')).toBe('100');
  });

  it('supports percent="auto" with smooth advancement and cleans up timers on stop/unmount', async () => {
    jest.useFakeTimers();
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const wrapper = mount(Spin, {
      props: { spinning: true, percent: 'auto' },
    });

    // Initially mockPercent is 0 -> Looper visible, SVG progress not yet rendered
    expect(wrapper.find('.ant-spin-dot-progress').exists()).toBe(false);

    jest.advanceTimersByTime(200);
    await nextTick();
    const getVal = () =>
      Number(wrapper.find('svg[role="progressbar"]').attributes('aria-valuenow'));
    const p1 = getVal();
    expect(p1).toBeGreaterThan(0);

    jest.advanceTimersByTime(600);
    await nextTick();
    const p2 = getVal();
    expect(p2).toBeGreaterThan(p1);
    expect(p2).toBeLessThan(100);

    // Turning spinning off stops interval cleanly
    await wrapper.setProps({ spinning: false });
    await nextTick();
    const callsAfterStop = clearIntervalSpy.mock.calls.length;
    expect(callsAfterStop).toBeGreaterThan(0);
    expect(wrapper.find('svg[role="progressbar"]').exists()).toBe(false);

    // Restart and unmount cleans up interval
    await wrapper.setProps({ spinning: true });
    await nextTick();
    const callsBeforeUnmount = clearIntervalSpy.mock.calls.length;
    wrapper.unmount();
    expect(clearIntervalSpy.mock.calls.length).toBeGreaterThan(callsBeforeUnmount);
    clearIntervalSpy.mockRestore();
  });

  it('supports semantic classNames and styles in standalone, nested, and fullscreen modes', () => {
    // Standalone
    const wStandalone = mount(Spin, {
      props: {
        spinning: true,
        description: 'Wait',
        classNames: {
          root: 's-root',
          section: 's-section',
          indicator: 's-indicator',
          description: 's-desc',
        },
        styles: {
          root: { backgroundColor: 'rgb(1, 1, 1)' },
          section: { padding: '4px' },
          indicator: { color: 'rgb(2, 2, 2)' },
          description: { fontSize: '18px' },
        },
      },
    });
    const standaloneRoot = wStandalone.find('.ant-spin');
    expect(standaloneRoot.classes()).toContain('ant-spin-section');
    expect(standaloneRoot.classes()).toContain('s-root');
    expect(standaloneRoot.classes()).toContain('s-section');
    expect(standaloneRoot.attributes('style')).toContain('background-color: rgb(1, 1, 1)');
    expect(standaloneRoot.attributes('style')).toContain('padding: 4px');
    expect(wStandalone.find('.ant-spin-dot-holder').classes()).toContain('s-indicator');
    expect(wStandalone.find('.ant-spin-dot-holder').attributes('style')).toContain(
      'color: rgb(2, 2, 2)',
    );
    expect(wStandalone.find('.ant-spin-description').classes()).toContain('s-desc');
    expect(wStandalone.find('.ant-spin-description').attributes('style')).toContain(
      'font-size: 18px',
    );

    // Nested
    const wNested = mount({
      render() {
        return (
          <Spin
            spinning
            description="Nested"
            classNames={{
              root: 'n-root',
              wrapper: 'n-wrapper',
              section: 'n-section',
              indicator: 'n-indicator',
              description: 'n-desc',
              container: 'n-container',
            }}
            styles={{
              root: { margin: '4px' },
              wrapper: { padding: '6px' },
              section: { opacity: '0.9' },
              indicator: { color: 'rgb(3, 3, 3)' },
              description: { fontWeight: '700' },
              container: { borderWidth: '2px' },
            }}
          >
            <div>Body</div>
          </Spin>
        );
      },
    });
    const nestedRoot = wNested.find('.ant-spin-nested-loading');
    expect(nestedRoot.classes()).toContain('ant-spin');
    expect(nestedRoot.classes()).toContain('n-root');
    expect(nestedRoot.classes()).toContain('n-wrapper');
    expect(nestedRoot.attributes('style')).toContain('margin: 4px');
    expect(nestedRoot.attributes('style')).toContain('padding: 6px');
    expect(wNested.find('.ant-spin-section').classes()).toContain('n-section');
    expect(wNested.find('.ant-spin-section').attributes('style')).toContain('opacity: 0.9');
    expect(wNested.find('.ant-spin-dot-holder').classes()).toContain('n-indicator');
    expect(wNested.find('.ant-spin-description').classes()).toContain('n-desc');
    expect(wNested.find('.ant-spin-container').classes()).toContain('n-container');
    expect(wNested.find('.ant-spin-container').classes()).toContain('ant-spin-blur');
    expect(wNested.find('.ant-spin-container').attributes('style')).toContain('border-width: 2px');

    // Fullscreen + legacy mask/tip semantic keys
    const wFull = mount(Spin, {
      props: {
        spinning: true,
        fullscreen: true,
        tip: 'Full',
        classNames: {
          root: 'f-root',
          mask: 'f-mask',
          section: 'f-section',
          indicator: 'f-indicator',
          tip: 'f-tip',
        },
        styles: {
          mask: { backgroundColor: 'rgb(10, 20, 30)' },
          section: { gap: '8px' },
          tip: { color: 'rgb(40, 50, 60)' },
        },
      },
    });
    const maskEl = wFull.find('.ant-spin-fullscreen');
    expect(maskEl.classes()).toContain('ant-spin');
    expect(maskEl.classes()).toContain('ant-spin-spinning');
    expect(maskEl.classes()).toContain('f-root');
    expect(maskEl.classes()).toContain('f-mask');
    expect(maskEl.attributes('style')).toContain('background-color: rgb(10, 20, 30)');
    expect(wFull.find('.ant-spin-section').classes()).toContain('f-section');
    expect(wFull.find('.ant-spin-dot-holder').classes()).toContain('f-indicator');
    expect(wFull.find('.ant-spin-description').classes()).toContain('f-tip');
    expect(wFull.find('.ant-spin-description').attributes('style')).toContain(
      'color: rgb(40, 50, 60)',
    );
  });

  it('supports functional classNames/styles merged with ConfigProvider.spin', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            spin={{
              classNames: {
                root: 'ctx-spin-root',
                indicator: 'ctx-spin-indicator',
                description: 'ctx-spin-desc',
              },
              styles: {
                root: { padding: '8px' },
              },
            }}
          >
            <Spin
              spinning
              size="large"
              description="Loading..."
              classNames={({ props }) => ({
                root: `fn-spin-${props.size}`,
                description: props.spinning ? 'fn-spinning-desc' : 'fn-idle-desc',
              })}
              styles={({ props }) => ({
                description: { fontSize: props.size === 'large' ? '20px' : '14px' },
              })}
            />
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-spin');
    expect(root.classes()).toContain('ctx-spin-root');
    expect(root.classes()).toContain('fn-spin-large');
    expect(root.attributes('style')).toContain('padding: 8px');
    expect(wrapper.find('.ant-spin-dot-holder').classes()).toContain('ctx-spin-indicator');
    expect(wrapper.find('.ant-spin-description').classes()).toContain('ctx-spin-desc');
    expect(wrapper.find('.ant-spin-description').classes()).toContain('fn-spinning-desc');
    expect(wrapper.find('.ant-spin-description').attributes('style')).toContain('font-size: 20px');
  });

  it('supports Spin.setDefaultIndicator with both legacy object and standard VNode', () => {
    // Legacy Vue object syntax
    Spin.setDefaultIndicator({
      indicator: h('span', { class: 'legacy-global-indicator' }),
    });
    const wLegacy = mount(Spin);
    expect(wLegacy.find('.legacy-global-indicator').exists()).toBe(true);
    expect(wLegacy.find('.legacy-global-indicator').classes()).toContain('ant-spin-dot');

    // Standard antd VNode syntax
    Spin.setDefaultIndicator(h('span', { class: 'antd-global-indicator' }));
    const wAntd = mount(Spin);
    expect(wAntd.find('.antd-global-indicator').exists()).toBe(true);
    expect(wAntd.find('.antd-global-indicator').classes()).toContain('ant-spin-dot');

    // Reset
    Spin.setDefaultIndicator(null);
    const wDefault = mount(Spin);
    expect(wDefault.find('.ant-spin-dot-spin').exists()).toBe(true);
  });

  it('exposes nativeElement ref and supports size="medium"', () => {
    const wrapper = mount(Spin, {
      props: { size: 'medium' },
    });
    expect(wrapper.vm.nativeElement).toBeInstanceOf(HTMLDivElement);
    expect(wrapper.vm.nativeElement).toBe(wrapper.element);
    expect(wrapper.find('.ant-spin').classes()).not.toContain('ant-spin-sm');
    expect(wrapper.find('.ant-spin').classes()).not.toContain('ant-spin-lg');
  });
});
