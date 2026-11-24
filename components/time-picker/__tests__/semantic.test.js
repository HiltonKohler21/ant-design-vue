import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import dayjs from 'dayjs';
import TimePicker from '..';
import ConfigProvider from '../../config-provider';

jest.mock('../../_util/Portal');

describe('TimePicker v6 semantic classNames/styles & PurePanel', () => {
  it('supports object and function classNames/styles and merges ConfigProvider.timePicker', async () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        timePicker: {
          className: 'ctx-tp',
          style: { marginTop: '4px' },
          classNames: { root: 'ctx-tp-root', popup: { root: 'ctx-tp-popup' } },
          styles: { suffix: { color: 'rgb(114, 46, 209)' } },
        },
      },
      slots: {
        default: () => (
          <TimePicker
            open
            size="large"
            prefix="TP"
            defaultValue={dayjs('12:30:00', 'HH:mm:ss')}
            classNames={({ props }) => ({
              root: props.size === 'large' ? 'tp-lg-root' : 'tp-sm-root',
              prefix: 'tp-prefix',
              input: 'tp-input',
              suffix: 'tp-suffix',
              popup: {
                root: 'tp-popup-root',
                container: 'tp-popup-container',
                content: 'tp-popup-content',
                item: 'tp-popup-item',
                footer: 'tp-popup-footer',
              },
            })}
            styles={({ props }) => ({
              root: props.size === 'large' ? { borderColor: 'rgb(114, 46, 209)' } : {},
              popup: {
                container: { border: '1px solid rgb(114, 46, 209)', borderRadius: '8px' },
              },
            })}
          />
        ),
      },
    });
    await nextTick();
    await nextTick();

    const root = wrapper.find('.ant-picker');
    expect(root.classes()).toContain('ctx-tp');
    expect(root.classes()).toContain('ctx-tp-root');
    expect(root.classes()).toContain('tp-lg-root');
    expect(root.attributes('style')).toContain('margin-top: 4px');
    expect(root.attributes('style')).toContain('border-color: rgb(114, 46, 209)');

    const prefix = wrapper.find('.ant-picker-prefix');
    expect(prefix.exists()).toBe(true);
    expect(prefix.classes()).toContain('tp-prefix');

    const input = wrapper.find('.ant-picker-input > input');
    expect(input.classes()).toContain('tp-input');

    const suffix = wrapper.find('.ant-picker-suffix');
    expect(suffix.classes()).toContain('tp-suffix');
    expect(suffix.attributes('style')).toContain('color: rgb(114, 46, 209)');

    const dropdown = wrapper.find('.ant-picker-dropdown');
    expect(dropdown.classes()).toContain('ctx-tp-popup');
    expect(dropdown.classes()).toContain('tp-popup-root');

    const container = wrapper.find('.ant-picker-panel-container');
    expect(container.classes()).toContain('tp-popup-container');
    expect(container.attributes('style')).toContain('border: 1px solid rgb(114, 46, 209)');

    expect(wrapper.find('.ant-picker-content').classes()).toContain('tp-popup-content');
    expect(wrapper.find('.ant-picker-time-panel-cell-inner').classes()).toContain('tp-popup-item');
    expect(wrapper.find('.ant-picker-footer').classes()).toContain('tp-popup-footer');

    wrapper.unmount();
  });

  it('supports semantic classNames/styles on TimeRangePicker', async () => {
    const wrapper = mount(TimePicker.RangePicker, {
      props: {
        open: true,
        prefix: 'TR',
        classNames: {
          root: 'trp-root',
          prefix: 'trp-prefix',
          popup: { root: 'trp-popup-root' },
        },
        styles: {
          root: { borderColor: 'rgb(22, 119, 255)' },
        },
      },
    });
    await nextTick();
    await nextTick();

    expect(wrapper.find('.ant-picker-range').classes()).toContain('trp-root');
    expect(wrapper.find('.ant-picker-prefix').classes()).toContain('trp-prefix');
    expect(wrapper.find('.ant-picker-dropdown').classes()).toContain('trp-popup-root');
    wrapper.unmount();
  });

  it('renders TimePicker._InternalPanelDoNotUseOrYouWillBeFired PurePanel', async () => {
    const PurePanel = TimePicker._InternalPanelDoNotUseOrYouWillBeFired;
    expect(PurePanel).toBeDefined();

    const wrapper = mount(PurePanel, {
      props: {
        defaultValue: dayjs('08:15:30', 'HH:mm:ss'),
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-picker-dropdown-pure').exists()).toBe(true);
    expect(wrapper.find('.ant-picker-time-panel').exists()).toBe(true);
    wrapper.unmount();
  });
});
