import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import DatePicker from '..';
import ConfigProvider from '../../config-provider';
import enUS from '../locale/en_US';

dayjs.extend(buddhistEra);

jest.mock('../../_util/Portal');

describe('DatePicker v6 semantic classNames/styles, PurePanel & features', () => {
  it('supports object semantic classNames and styles on DatePicker (root, prefix, input, suffix, popup.*)', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        open: true,
        prefix: 'PRE',
        defaultValue: dayjs('2024-05-15'),
        classNames: {
          root: 'sem-root',
          prefix: 'sem-prefix',
          input: 'sem-input',
          suffix: 'sem-suffix',
          popup: {
            root: 'sem-popup-root',
            container: 'sem-popup-container',
            header: 'sem-popup-header',
            body: 'sem-popup-body',
            content: 'sem-popup-content',
            item: 'sem-popup-item',
            footer: 'sem-popup-footer',
          },
        },
        styles: {
          root: { borderColor: 'rgb(114, 46, 209)' },
          prefix: { color: 'rgb(255, 0, 0)' },
          input: { fontStyle: 'italic' },
          suffix: { opacity: 0.85 },
          popup: {
            root: { zIndex: 1234 },
            container: { borderRadius: '8px' },
            header: { padding: '4px' },
            body: { padding: '6px' },
            content: { width: '240px' },
            item: { fontWeight: 600 },
            footer: { textAlign: 'right' },
          },
        },
      },
    });
    await nextTick();
    await nextTick();

    const root = wrapper.find('.ant-picker');
    expect(root.classes()).toContain('sem-root');
    expect(root.attributes('style')).toContain('border-color: rgb(114, 46, 209)');

    const prefix = wrapper.find('.ant-picker-prefix');
    expect(prefix.exists()).toBe(true);
    expect(prefix.classes()).toContain('sem-prefix');
    expect(prefix.attributes('style')).toContain('color: rgb(255, 0, 0)');

    const input = wrapper.find('.ant-picker-input > input');
    expect(input.classes()).toContain('sem-input');
    expect(input.attributes('style')).toContain('font-style: italic');

    const suffix = wrapper.find('.ant-picker-suffix');
    expect(suffix.classes()).toContain('sem-suffix');
    expect(suffix.attributes('style')).toContain('opacity: 0.85');

    const dropdown = wrapper.find('.ant-picker-dropdown');
    expect(dropdown.classes()).toContain('sem-popup-root');
    expect(dropdown.attributes('style')).toContain('z-index: 1234');

    const container = wrapper.find('.ant-picker-panel-container');
    expect(container.classes()).toContain('sem-popup-container');
    expect(container.attributes('style')).toContain('border-radius: 8px');

    expect(wrapper.find('.ant-picker-header').classes()).toContain('sem-popup-header');
    expect(wrapper.find('.ant-picker-body').classes()).toContain('sem-popup-body');
    expect(wrapper.find('.ant-picker-content').classes()).toContain('sem-popup-content');
    expect(wrapper.find('.ant-picker-cell-inner').classes()).toContain('sem-popup-item');
    expect(wrapper.find('.ant-picker-footer').classes()).toContain('sem-popup-footer');

    wrapper.unmount();
  });

  it('supports function semantic classNames/styles and merges ConfigProvider.datePicker', async () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        datePicker: {
          className: 'ctx-dp',
          style: { backgroundColor: 'rgb(240, 240, 240)' },
          classNames: { root: 'ctx-sem-root', popup: { root: 'ctx-popup-root' } },
          styles: { suffix: { color: 'rgb(0, 128, 0)' } },
        },
      },
      slots: {
        default: () => (
          <DatePicker
            size="large"
            open
            classNames={({ props }) => ({
              root: props.size === 'large' ? 'fn-lg-root' : 'fn-sm-root',
              popup: 'fn-popup-shorthand',
            })}
            styles={({ props }) => ({
              root: props.size === 'large' ? { borderColor: 'rgb(114, 46, 209)' } : {},
              popup: { container: { border: '1px solid rgb(114, 46, 209)' } },
            })}
          />
        ),
      },
    });
    await nextTick();
    await nextTick();

    const root = wrapper.find('.ant-picker');
    expect(root.classes()).toContain('ctx-dp');
    expect(root.classes()).toContain('ctx-sem-root');
    expect(root.classes()).toContain('fn-lg-root');
    expect(root.attributes('style')).toContain('background-color: rgb(240, 240, 240)');
    expect(root.attributes('style')).toContain('border-color: rgb(114, 46, 209)');

    const suffix = wrapper.find('.ant-picker-suffix');
    expect(suffix.attributes('style')).toContain('color: rgb(0, 128, 0)');

    const dropdown = wrapper.find('.ant-picker-dropdown');
    expect(dropdown.classes()).toContain('ctx-popup-root');
    expect(dropdown.classes()).toContain('fn-popup-shorthand');

    const container = wrapper.find('.ant-picker-panel-container');
    expect(container.attributes('style')).toContain('border: 1px solid rgb(114, 46, 209)');

    wrapper.unmount();
  });

  it('merges ConfigProvider.datePicker and rangePicker semantics on RangePicker', async () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        datePicker: {
          classNames: { root: 'dp-root' },
        },
        rangePicker: {
          classNames: { root: 'rp-root', popup: { root: 'rp-popup' } },
          styles: { root: { borderWidth: '2px' } },
        },
      },
      slots: {
        default: () => (
          <DatePicker.RangePicker
            open
            prefix="RangePre"
            classNames={({ props }) => ({
              prefix: 'rp-prefix',
              input: props.variant === 'filled' ? 'rp-filled-input' : 'rp-input',
            })}
            styles={{
              popup: { container: { borderRadius: '10px' } },
            }}
          />
        ),
      },
    });
    await nextTick();
    await nextTick();

    const root = wrapper.find('.ant-picker-range');
    expect(root.classes()).toContain('dp-root');
    expect(root.classes()).toContain('rp-root');
    expect(root.attributes('style')).toContain('border-width: 2px');

    const prefix = wrapper.find('.ant-picker-prefix');
    expect(prefix.exists()).toBe(true);
    expect(prefix.text()).toBe('RangePre');
    expect(prefix.classes()).toContain('rp-prefix');

    const inputs = wrapper.findAll('.ant-picker-input > input');
    expect(inputs.length).toBe(2);
    expect(inputs[0].classes()).toContain('rp-input');

    const dropdown = wrapper.find('.ant-picker-dropdown');
    expect(dropdown.classes()).toContain('rp-popup');

    const container = wrapper.find('.ant-picker-panel-container');
    expect(container.attributes('style')).toContain('border-radius: 10px');

    wrapper.unmount();
  });

  it('renders DatePicker._InternalPanelDoNotUseOrYouWillBeFired and _InternalRangePanelDoNotUseOrYouWillBeFired', async () => {
    const PurePanel = DatePicker._InternalPanelDoNotUseOrYouWillBeFired;
    const PureRangePanel = DatePicker._InternalRangePanelDoNotUseOrYouWillBeFired;

    expect(PurePanel).toBeDefined();
    expect(PureRangePanel).toBeDefined();

    const w1 = mount(PurePanel, {
      props: {
        defaultValue: dayjs('2024-05-15'),
      },
    });
    await nextTick();
    expect(w1.find('.ant-picker-dropdown-pure').exists()).toBe(true);
    expect(w1.find('.ant-picker-date-panel').exists()).toBe(true);
    w1.unmount();

    const w2 = mount(PureRangePanel);
    await nextTick();
    expect(w2.find('.ant-picker-dropdown-pure').exists()).toBe(true);
    expect(w2.findAll('.ant-picker-date-panel').length).toBe(2);
    w2.unmount();
  });

  it('supports suffix={false}, suffix={null}, suffix={true}, suffix="123"', () => {
    const wFalse = mount(DatePicker, { props: { suffix: false } });
    expect(wFalse.find('.ant-picker-suffix').exists()).toBe(false);
    wFalse.unmount();

    const wNull = mount(DatePicker, { props: { suffix: null } });
    expect(wNull.find('.ant-picker-suffix').exists()).toBe(false);
    wNull.unmount();

    const wTrue = mount(DatePicker, { props: { suffix: true } });
    expect(wTrue.find('.ant-picker-suffix').exists()).toBe(true);
    wTrue.unmount();

    const wText = mount(DatePicker, { props: { suffix: '123' } });
    expect(wText.find('.ant-picker-suffix').text()).toBe('123');
    wText.unmount();
  });

  it('supports minDate/maxDate, cellRender, mask format, buddhistEra locale & custom components.date', async () => {
    // minDate & maxDate
    const wRange = mount(DatePicker, {
      props: {
        open: true,
        defaultValue: dayjs('2019-09-10'),
        minDate: dayjs('2019-09-05'),
        maxDate: dayjs('2019-09-20'),
      },
    });
    await nextTick();
    expect(wRange.find('td[title="2019-09-04"]').classes()).toContain('ant-picker-cell-disabled');
    expect(wRange.find('td[title="2019-09-05"]').classes()).not.toContain(
      'ant-picker-cell-disabled',
    );
    expect(wRange.find('td[title="2019-09-20"]').classes()).not.toContain(
      'ant-picker-cell-disabled',
    );
    expect(wRange.find('td[title="2019-09-21"]').classes()).toContain('ant-picker-cell-disabled');
    wRange.unmount();

    // cellRender
    const wCell = mount(DatePicker, {
      props: {
        open: true,
        defaultPickerValue: dayjs('2024-05-01'),
        cellRender: (current, info) =>
          info.type === 'date' && current.date() === 1
            ? h('div', { class: 'ant-picker-cell-inner custom-first-day' }, current.date())
            : info.originNode,
      },
    });
    await nextTick();
    expect(wCell.find('.custom-first-day').exists()).toBe(true);
    wCell.unmount();

    // mask format object
    const wMask = mount(DatePicker, {
      props: {
        defaultValue: dayjs('2024-05-15'),
        format: { format: 'YYYY-MM-DD', type: 'mask' },
      },
    });
    await nextTick();
    expect(wMask.find('input').element.value).toBe('2024-05-15');
    wMask.unmount();

    // buddhist era locale
    const buddhistLocale = {
      ...enUS,
      lang: {
        ...enUS.lang,
        fieldDateFormat: 'BBBB-MM-DD',
        yearFormat: 'BBBB',
      },
    };
    const wBuddhist = mount(DatePicker, {
      props: {
        defaultValue: dayjs('2024-01-01'),
        locale: buddhistLocale,
      },
    });
    await nextTick();
    expect(wBuddhist.find('input').element.value).toBe('2567-01-01');
    wBuddhist.unmount();

    // custom components.date
    const onChange = jest.fn();
    const CustomPanel = defineComponent({
      props: { onSelect: Function },
      setup(props) {
        return () =>
          h(
            'button',
            {
              class: 'my-custom-date-btn',
              onClick: () => props.onSelect(dayjs('2024-07-04')),
            },
            'Pick July 4',
          );
      },
    });
    const wComp = mount(DatePicker, {
      props: {
        open: true,
        components: { date: CustomPanel },
        onChange,
      },
    });
    await nextTick();
    expect(wComp.find('.my-custom-date-btn').exists()).toBe(true);
    await wComp.find('.my-custom-date-btn').trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toBe('2024-07-04');
    wComp.unmount();
  });
});
