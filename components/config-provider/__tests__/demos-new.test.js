import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import antd from '../../index';
import { globalConfig } from '..';
import WaveDemo from '../demo/wave.vue';
import HolderRenderDemo from '../demo/holderRender.vue';
import PrefixClsDemo from '../demo/prefixCls.vue';
import UseConfigDemo from '../demo/useConfig.vue';
import WarningDemo from '../demo/warning.vue';
import FocusOutlineDebugDemo from '../demo/focus-outline-debug.vue';

describe('ConfigProvider new demos smoke & isolation checks', () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    const vueWarns = warnSpy.mock.calls
      .map(args => args.map(String).join(' '))
      .filter(msg => msg.includes('[Vue warn]'));
    warnSpy.mockRestore();
    expect(vueWarns).toEqual([]);
  });

  it('mounts wave.vue cleanly with 5 primary buttons', () => {
    const wrapper = mount(WaveDemo, { global: { plugins: [antd] } });
    expect(wrapper.findAll('button').length).toBe(5);
    wrapper.unmount();
  });

  it('mounts holderRender.vue without mutating global holderRender on mount and cleans up on unmount', () => {
    expect(globalConfig().holderRender).toBeUndefined();
    const wrapper = mount(HolderRenderDemo, { global: { plugins: [antd] } });
    expect(globalConfig().holderRender).toBeUndefined();
    expect(wrapper.findAll('button').length).toBe(3);
    wrapper.unmount();
    expect(globalConfig().holderRender).toBeUndefined();
  });

  it('mounts prefixCls.vue locally without mutating global prefixCls and toggles prefixCls', async () => {
    const wrapper = mount(PrefixClsDemo, { global: { plugins: [antd] } });
    expect(globalConfig().getPrefixCls()).toBe('ant');
    expect(wrapper.find('.light-select').exists()).toBe(true);
    await wrapper.find('button').trigger('click');
    await nextTick();
    expect(wrapper.find('.dark-select').exists()).toBe(true);
    expect(globalConfig().getPrefixCls()).toBe('ant');
    wrapper.unmount();
  });

  it('mounts useConfig.vue and displays reactive ConfigProvider.useConfig values', async () => {
    const wrapper = mount(UseConfigDemo, { global: { plugins: [antd] } });
    await nextTick();
    const inputs = wrapper.findAll('input.ant-input');
    expect(inputs.length).toBe(2);
    expect(inputs[0].element.value).toBe('small');
    expect(inputs[1].element.value).toBe('true');
    wrapper.unmount();
  });

  it('mounts warning.vue locally without global side effects', () => {
    const wrapper = mount(WarningDemo, { global: { plugins: [antd] } });
    expect(wrapper.find('.ant-alert').exists()).toBe(true);
    wrapper.unmount();
  });

  it('mounts focus-outline-debug.vue cleanly without errors or Vue warnings', () => {
    const originGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = () => ({
      getPropertyValue: () => '',
      lineHeight: '22px',
      fontSize: '14px',
      paddingTop: '0px',
      paddingBottom: '0px',
    });
    try {
      const wrapper = mount(FocusOutlineDebugDemo, { global: { plugins: [antd] } });
      expect(wrapper.findAll('.focus-row').length).toBeGreaterThan(50);
      wrapper.unmount();
    } finally {
      window.getComputedStyle = originGetComputedStyle;
    }
  });
});
