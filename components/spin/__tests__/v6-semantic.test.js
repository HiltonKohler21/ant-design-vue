import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Spin from '..';
import Progress from '../../progress';
import ConfigProvider from '../../config-provider';

describe('Spin v6 APIs & Semantic DOM', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('supports description prop/slot and prioritizes description over tip', () => {
    const wDesc = mount(Spin, {
      props: { description: 'Loading data...' },
    });
    expect(wDesc.find('.ant-spin-text').text()).toBe('Loading data...');
    expect(wDesc.find('.ant-spin').classes()).toContain('ant-spin-show-text');

    const wPriority = mount(Spin, {
      props: { description: 'Primary Description', tip: 'Legacy Tip' },
    });
    expect(wPriority.find('.ant-spin-text').text()).toBe('Primary Description');

    const wSlot = mount(Spin, {
      props: { tip: 'Legacy Tip' },
      slots: { description: () => <span class="desc-slot">Slot Description</span> },
    });
    expect(wSlot.find('.desc-slot').text()).toBe('Slot Description');

    const wLegacyTip = mount(Spin, {
      props: { tip: 'Only Tip' },
    });
    expect(wLegacyTip.find('.ant-spin-text').text()).toBe('Only Tip');
  });

  it('supports percent="auto" with smooth advancement and cleans up timers on stop/unmount', async () => {
    jest.useFakeTimers();
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const wrapper = mount(Spin, {
      props: { spinning: true, percent: 'auto' },
    });

    const getPercent = () => wrapper.findComponent(Progress).props('percent');
    expect(wrapper.find('.ant-progress-circle').exists()).toBe(true);
    const p0 = getPercent();
    expect(p0).toBe(0);

    jest.advanceTimersByTime(200);
    await nextTick();
    const p1 = getPercent();
    expect(p1).toBeGreaterThan(p0);

    jest.advanceTimersByTime(600);
    await nextTick();
    const p2 = getPercent();
    expect(p2).toBeGreaterThan(p1);
    expect(p2).toBeLessThan(100);

    // Turning spinning off stops interval cleanly
    await wrapper.setProps({ spinning: false });
    await nextTick();
    const callsAfterStop = clearIntervalSpy.mock.calls.length;
    expect(callsAfterStop).toBeGreaterThan(0);

    const frozenPercent = getPercent();
    jest.advanceTimersByTime(1000);
    await nextTick();
    expect(getPercent()).toBe(frozenPercent);

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
    expect(standaloneRoot.classes()).toContain('s-root');
    expect(standaloneRoot.classes()).toContain('s-section');
    expect(standaloneRoot.attributes('style')).toContain('background-color: rgb(1, 1, 1)');
    expect(standaloneRoot.attributes('style')).toContain('padding: 4px');
    expect(wStandalone.find('.ant-spin-dot').classes()).toContain('s-indicator');
    expect(wStandalone.find('.ant-spin-dot').attributes('style')).toContain('color: rgb(2, 2, 2)');
    expect(wStandalone.find('.ant-spin-text').classes()).toContain('s-desc');
    expect(wStandalone.find('.ant-spin-text').attributes('style')).toContain('font-size: 18px');

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
    const nestedWrapper = wNested.find('.ant-spin-nested-loading');
    expect(nestedWrapper.classes()).toContain('n-root');
    expect(nestedWrapper.classes()).toContain('n-wrapper');
    expect(nestedWrapper.attributes('style')).toContain('margin: 4px');
    expect(nestedWrapper.attributes('style')).toContain('padding: 6px');
    expect(wNested.find('.ant-spin').classes()).toContain('n-section');
    expect(wNested.find('.ant-spin').attributes('style')).toContain('opacity: 0.9');
    expect(wNested.find('.ant-spin-dot').classes()).toContain('n-indicator');
    expect(wNested.find('.ant-spin-text').classes()).toContain('n-desc');
    expect(wNested.find('.ant-spin-container').classes()).toContain('n-container');
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
    expect(maskEl.classes()).toContain('f-root');
    expect(maskEl.classes()).toContain('f-mask');
    expect(maskEl.attributes('style')).toContain('background-color: rgb(10, 20, 30)');
    expect(wFull.find('.ant-spin').classes()).toContain('f-section');
    expect(wFull.find('.ant-spin-dot').classes()).toContain('f-indicator');
    expect(wFull.find('.ant-spin-text').classes()).toContain('f-tip');
    expect(wFull.find('.ant-spin-text').attributes('style')).toContain('color: rgb(40, 50, 60)');
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
    expect(wrapper.find('.ant-spin-dot').classes()).toContain('ctx-spin-indicator');
    expect(wrapper.find('.ant-spin-text').classes()).toContain('ctx-spin-desc');
    expect(wrapper.find('.ant-spin-text').classes()).toContain('fn-spinning-desc');
    expect(wrapper.find('.ant-spin-text').attributes('style')).toContain('font-size: 20px');
  });
});
