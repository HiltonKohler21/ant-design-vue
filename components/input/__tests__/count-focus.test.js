import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Input from '..';
import InputNumber from '../../input-number';
import Mentions from '../../mentions';
import ConfigProvider from '../../config-provider';
import Button from '../../button';
import Flex from '../../flex';
import Space from '../../space';
import Switch from '../../switch';
import Typography from '../../typography';
import Select from '../../select';
import Tooltip from '../../tooltip';
import Radio from '../../radio';
import AutoComplete from '../../auto-complete';
import Cascader from '../../cascader';
import DatePicker from '../../date-picker';
import TimePicker from '../../time-picker';
import TreeSelect from '../../tree-select';
import CompactStyleDemo from '../demo/compact-style.vue';
import AdvanceCountDemo from '../demo/advance-count.vue';
import FocusDemo from '../demo/focus.vue';
import SearchVariantDebugDemo from '../demo/search-variant-debug.vue';
import FilledDebugDemo from '../demo/filled-debug.vue';
import BorderlessDebugDemo from '../demo/borderless-debug.vue';
import AlignDemo from '../demo/align.vue';
import TextareaResizeDemo from '../demo/textarea-resize.vue';
import DebugAddonDemo from '../demo/debug-addon.vue';

jest.mock('ant-design-vue', () => ({
  Input: require('..').default,
}));

const demoPlugins = [
  Input,
  InputNumber,
  Mentions,
  ConfigProvider,
  Button,
  Flex,
  Space,
  Switch,
  Typography,
  Select,
  Tooltip,
  Radio,
  AutoComplete,
  Cascader,
  DatePicker,
  TimePicker,
  TreeSelect,
];

const { TextArea, OTP } = Input;

describe('Input v6 parity: count, focus cursor, OTP variant fallback', () => {
  it('supports count.show, count.max (out-of-range without truncating), count.strategy, count.exceedFormatter on Input', async () => {
    const wrapper = mount(Input, {
      props: {
        defaultValue: 'Hello, antd!',
        count: {
          show: true,
          max: 10,
        },
      },
    });
    expect(wrapper.find('.ant-input-show-count-suffix').text()).toBe('12 / 10');
    expect(wrapper.find('.ant-input-affix-wrapper').classes()).toContain('ant-input-out-of-range');

    const emojiWrapper = mount(Input, {
      props: {
        defaultValue: '🔥🔥🔥',
        count: {
          show: true,
          strategy: txt => Array.from(txt).length,
        },
      },
    });
    expect(emojiWrapper.find('.ant-input-show-count-suffix').text()).toBe('3');

    const onUpdate = jest.fn();
    const clipWrapper = mount(Input, {
      props: {
        defaultValue: '🔥 antd',
        'onUpdate:value': onUpdate,
        count: {
          show: true,
          max: 6,
          strategy: txt => Array.from(txt).length,
          exceedFormatter: (txt, { max }) => Array.from(txt).slice(0, max).join(''),
        },
      },
    });
    expect(clipWrapper.find('.ant-input-show-count-suffix').text()).toBe('6 / 6');
    const inputEl = clipWrapper.find('input').element;
    inputEl.value = '🔥 antd extra';
    await clipWrapper.find('input').trigger('input');
    await nextTick();
    expect(inputEl.value).toBe('🔥 antd');
    expect(onUpdate).toHaveBeenLastCalledWith('🔥 antd');
  });

  it('supports count config on TextArea', async () => {
    const wrapper = mount(TextArea, {
      props: {
        defaultValue: 'Hello, antd!',
        count: {
          show: true,
          max: 10,
        },
      },
    });
    expect(wrapper.find('.ant-input-textarea').classes()).toContain('ant-input-out-of-range');
    expect(wrapper.find('.ant-input-textarea').attributes('data-count')).toBe('12 / 10');
  });

  it('supports focus({ cursor: start | end | all }) on Input and TextArea', () => {
    const inputWrapper = mount(Input, {
      props: { defaultValue: 'Ant Design' },
      attachTo: document.body,
    });
    const inputEl = inputWrapper.find('input').element;

    inputWrapper.vm.focus({ cursor: 'start' });
    expect(inputEl.selectionStart).toBe(0);
    expect(inputEl.selectionEnd).toBe(0);

    inputWrapper.vm.focus({ cursor: 'end' });
    expect(inputEl.selectionStart).toBe(10);
    expect(inputEl.selectionEnd).toBe(10);

    inputWrapper.vm.focus({ cursor: 'all' });
    expect(inputEl.selectionStart).toBe(0);
    expect(inputEl.selectionEnd).toBe(10);
    inputWrapper.unmount();

    const taWrapper = mount(TextArea, {
      props: { defaultValue: 'Ant Design' },
      attachTo: document.body,
    });
    const taEl = taWrapper.find('textarea').element;

    taWrapper.vm.focus({ cursor: 'start' });
    expect(taEl.selectionStart).toBe(0);
    expect(taEl.selectionEnd).toBe(0);

    taWrapper.vm.focus({ cursor: 'end' });
    expect(taEl.selectionStart).toBe(10);
    expect(taEl.selectionEnd).toBe(10);

    taWrapper.vm.focus({ cursor: 'all' });
    expect(taEl.selectionStart).toBe(0);
    expect(taEl.selectionEnd).toBe(10);
    taWrapper.unmount();
  });

  it('Input.OTP inherits variant from ConfigProvider.input and overrides with ConfigProvider.otp', () => {
    const fromInput = mount(ConfigProvider, {
      props: { input: { variant: 'filled' } },
      slots: { default: () => <OTP defaultValue="123456" /> },
    });
    expect(fromInput.find('input').classes()).toContain('ant-input-filled');

    const fromOtp = mount(ConfigProvider, {
      props: { input: { variant: 'filled' }, otp: { variant: 'underlined' } },
      slots: { default: () => <OTP defaultValue="123456" /> },
    });
    expect(fromOtp.find('input').classes()).toContain('ant-input-underlined');
  });

  it('mounts all 9 new input demos cleanly without errors', () => {
    const demos = [
      CompactStyleDemo,
      AdvanceCountDemo,
      FocusDemo,
      SearchVariantDebugDemo,
      FilledDebugDemo,
      BorderlessDebugDemo,
      AlignDemo,
      TextareaResizeDemo,
      DebugAddonDemo,
    ];
    demos.forEach(Demo => {
      const wrapper = mount(Demo, { global: { plugins: demoPlugins } });
      expect(wrapper.html().length).toBeGreaterThan(0);
      wrapper.unmount();
    });
  });
});
