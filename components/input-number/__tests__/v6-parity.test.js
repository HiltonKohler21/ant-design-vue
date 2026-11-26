import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import InputNumber from '..';
import Input from '../../input';
import ConfigProvider from '../../config-provider';
import Button from '../../button';
import Flex from '../../flex';
import Space from '../../space';
import Select from '../../select';
import Typography from '../../typography';
import StyleClassDemo from '../demo/style-class.vue';
import AllowClearDemo from '../demo/allow-clear.vue';
import VariantDemo from '../demo/variant.vue';
import SpinnerDemo from '../demo/spinner.vue';
import FocusDemo from '../demo/focus.vue';
import DisabledHoverDebugDemo from '../demo/disabled-hover-debug.vue';
import FilledDebugDemo from '../demo/filled-debug.vue';
import BorderlessHeightDebugDemo from '../demo/borderless-height-debug.vue';
import ControlsDemo from '../demo/controls.vue';
import RenderPanelDemo from '../demo/render-panel.vue';
import DebugTokenDemo from '../demo/debug-token.vue';

jest.mock('@hiltonkohler21/ant-design-vue', () => ({
  InputNumber: require('..').default,
}));

const demoPlugins = [InputNumber, Input, ConfigProvider, Button, Flex, Space, Select, Typography];

describe('InputNumber v6 parity: semantic classNames/styles, allowClear, variant, spinner, focus, PurePanel', () => {
  it('supports object & functional classNames/styles merging ConfigProvider.inputNumber with zero Vue warnings', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const wrapper = mount(ConfigProvider, {
        props: {
          inputNumber: {
            className: 'ctx-in-cls',
            style: { margin: '2px' },
            classNames: ({ props }) => ({
              root: `ctx-root-${props.size || 'default'}`,
              input: 'ctx-input',
              prefix: 'ctx-prefix',
              suffix: 'ctx-suffix',
              actions: 'ctx-actions',
              action: 'ctx-action',
              clear: 'ctx-clear',
            }),
            styles: {
              root: { padding: '1px' },
              input: { letterSpacing: '1px' },
              clear: { opacity: '0.9' },
            },
          },
        },
        slots: {
          default: () => (
            <InputNumber
              size="large"
              prefix="￥"
              suffix="RMB"
              allowClear
              defaultValue={10}
              classNames={({ props }) => ({
                root: `prop-root-${props.size}`,
                input: 'prop-input',
                prefix: 'prop-prefix',
                suffix: 'prop-suffix',
                actions: 'prop-actions',
                action: 'prop-action',
                clear: 'prop-clear',
              })}
              styles={() => ({
                root: { borderColor: 'rgb(10, 20, 30)' },
                prefix: { color: 'rgb(1, 2, 3)' },
                suffix: { color: 'rgb(4, 5, 6)' },
                input: { fontSize: '16px' },
                actions: { width: '24px' },
                action: { color: 'rgb(7, 8, 9)' },
                clear: { color: 'rgb(11, 12, 13)' },
              })}
            />
          ),
        },
      });

      const root = wrapper.find('.ant-input-number-affix-wrapper');
      expect(root.classes()).toContain('ctx-in-cls');
      expect(root.classes()).toContain('ctx-root-large');
      expect(root.classes()).toContain('prop-root-large');
      expect(root.attributes('style')).toContain('margin: 2px');
      expect(root.attributes('style')).toContain('border-color: rgb(10, 20, 30)');

      expect(wrapper.find('.ant-input-number-prefix').classes()).toContain('ctx-prefix');
      expect(wrapper.find('.ant-input-number-prefix').classes()).toContain('prop-prefix');
      expect(wrapper.find('.ant-input-number-prefix').attributes('style')).toContain(
        'color: rgb(1, 2, 3)',
      );

      expect(wrapper.find('.ant-input-number-suffix').classes()).toContain('ctx-suffix');
      expect(wrapper.find('.ant-input-number-suffix').classes()).toContain('prop-suffix');
      expect(wrapper.find('.ant-input-number-suffix').attributes('style')).toContain(
        'color: rgb(4, 5, 6)',
      );

      const input = wrapper.find('input');
      expect(input.classes()).toContain('ctx-input');
      expect(input.classes()).toContain('prop-input');
      expect(input.attributes('style')).toContain('letter-spacing: 1px');
      expect(input.attributes('style')).toContain('font-size: 16px');

      const actions = wrapper.find('.ant-input-number-actions');
      expect(actions.classes()).toContain('ctx-actions');
      expect(actions.classes()).toContain('prop-actions');
      expect(actions.attributes('style')).toContain('width: 24px');

      const actionBtns = wrapper.findAll('.ant-input-number-action');
      expect(actionBtns).toHaveLength(2);
      expect(actionBtns[0].classes()).toContain('ctx-action');
      expect(actionBtns[0].classes()).toContain('prop-action');
      expect(actionBtns[0].attributes('style')).toContain('color: rgb(7, 8, 9)');

      const clearBtn = wrapper.find('.ant-input-number-clear-icon');
      expect(clearBtn.classes()).toContain('ctx-clear');
      expect(clearBtn.classes()).toContain('prop-clear');
      expect(clearBtn.attributes('style')).toContain('color: rgb(11, 12, 13)');

      const propWarns = warnSpy.mock.calls.filter(args => String(args[0]).includes('Invalid prop'));
      expect(propWarns).toHaveLength(0);
      wrapper.unmount();
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('supports allowClear including clearing 0 and emits null + clear event', async () => {
    const onChange = jest.fn();
    const onClear = jest.fn();
    const wrapper = mount(InputNumber, {
      props: {
        allowClear: true,
        defaultValue: 0,
        onChange,
        onClear,
      },
    });
    const clearBtn = wrapper.find('.ant-input-number-clear-icon');
    expect(clearBtn.exists()).toBe(true);
    expect(clearBtn.classes()).not.toContain('ant-input-number-clear-icon-hidden');

    await clearBtn.trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(wrapper.find('input').element.value).toBe('');
    expect(wrapper.find('.ant-input-number-clear-icon').classes()).toContain(
      'ant-input-number-clear-icon-hidden',
    );
    wrapper.unmount();
  });

  it('supports mode="spinner" with +/- stepping, min/max disabling, prefix/suffix, and allowClear', async () => {
    const onChange = jest.fn();
    const wrapper = mount(InputNumber, {
      props: {
        mode: 'spinner',
        min: 1,
        max: 3,
        defaultValue: 2,
        prefix: '$',
        suffix: 'USD',
        allowClear: true,
        onChange,
      },
    });
    expect(wrapper.find('.ant-input-number-mode-spinner').exists()).toBe(true);
    expect(wrapper.find('.ant-input-number-prefix').text()).toBe('$');
    expect(wrapper.find('.ant-input-number-suffix').text()).toContain('USD');

    const upBtn = wrapper.find('.ant-input-number-action-up');
    const downBtn = wrapper.find('.ant-input-number-action-down');
    expect(upBtn.exists()).toBe(true);
    expect(downBtn.exists()).toBe(true);

    await upBtn.trigger('mousedown');
    await nextTick();
    expect(onChange).toHaveBeenLastCalledWith(3);
    expect(wrapper.find('.ant-input-number-action-up').classes()).toContain(
      'ant-input-number-action-up-disabled',
    );

    await downBtn.trigger('mousedown');
    await nextTick();
    expect(onChange).toHaveBeenLastCalledWith(2);
    wrapper.unmount();
  });

  it('supports variant classes and controls object custom icons', () => {
    const filled = mount(InputNumber, { props: { variant: 'filled' } });
    expect(filled.find('.ant-input-number').classes()).toContain('ant-input-number-filled');

    const underlined = mount(InputNumber, { props: { variant: 'underlined' } });
    expect(underlined.find('.ant-input-number').classes()).toContain('ant-input-number-underlined');

    const customControls = mount(InputNumber, {
      props: {
        controls: {
          upIcon: <span class="custom-up">UP</span>,
          downIcon: <span class="custom-down">DOWN</span>,
        },
      },
    });
    expect(customControls.find('.custom-up').exists()).toBe(true);
    expect(customControls.find('.custom-down').exists()).toBe(true);
  });

  it('supports focus({ cursor: start | end | all }) and _InternalPanelDoNotUseOrYouWillBeFired', () => {
    const wrapper = mount(InputNumber, {
      props: { defaultValue: 999 },
      attachTo: document.body,
    });
    const inputEl = wrapper.find('input').element;

    wrapper.vm.focus({ cursor: 'start' });
    expect(inputEl.selectionStart).toBe(0);
    expect(inputEl.selectionEnd).toBe(0);

    wrapper.vm.focus({ cursor: 'end' });
    expect(inputEl.selectionStart).toBe(3);
    expect(inputEl.selectionEnd).toBe(3);

    wrapper.vm.focus({ cursor: 'all' });
    expect(inputEl.selectionStart).toBe(0);
    expect(inputEl.selectionEnd).toBe(3);
    expect(wrapper.vm.nativeElement).toBeTruthy();
    wrapper.unmount();

    const PurePanel = InputNumber._InternalPanelDoNotUseOrYouWillBeFired;
    expect(PurePanel).toBeTruthy();
    const panelWrapper = mount(PurePanel, { props: { defaultValue: 5 } });
    expect(panelWrapper.find('.ant-input-number').exists()).toBe(true);
    panelWrapper.unmount();
  });

  it('mounts all 11 new input-number demos cleanly without errors', () => {
    const demos = [
      StyleClassDemo,
      AllowClearDemo,
      VariantDemo,
      SpinnerDemo,
      FocusDemo,
      DisabledHoverDebugDemo,
      FilledDebugDemo,
      BorderlessHeightDebugDemo,
      ControlsDemo,
      RenderPanelDemo,
      DebugTokenDemo,
    ];
    demos.forEach(Demo => {
      const wrapper = mount(Demo, { global: { plugins: demoPlugins } });
      expect(wrapper.html().length).toBeGreaterThan(0);
      wrapper.unmount();
    });
  });
});
