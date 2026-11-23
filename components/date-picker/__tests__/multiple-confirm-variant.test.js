import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import dayjs from 'dayjs';
import DatePicker from '..';
import Form from '../../form';

jest.mock('../../_util/Portal');

describe('DatePicker multiple, needConfirm & variant', () => {
  it('supports variant prop on DatePicker and RangePicker', () => {
    const variants = ['outlined', 'borderless', 'filled', 'underlined'];
    variants.forEach(variant => {
      const single = mount(DatePicker, { props: { variant } });
      expect(single.find(`.ant-picker-${variant}`).exists()).toBe(true);
      single.unmount();

      const range = mount(DatePicker.RangePicker, { props: { variant } });
      expect(range.find(`.ant-picker-${variant}`).exists()).toBe(true);
      range.unmount();
    });
  });

  it('supports multiple date selection with tags, toggle, remove, clear, and maxTagCount', async () => {
    const onChange = jest.fn();
    const d1 = dayjs('2024-05-01');
    const d2 = dayjs('2024-05-03');
    const d3 = dayjs('2024-05-05');

    const wrapper = mount(DatePicker, {
      props: {
        multiple: true,
        defaultValue: [d1, d2, d3],
        maxTagCount: 2,
        open: true,
        onChange,
      },
    });
    await nextTick();

    expect(wrapper.find('.ant-picker-multiple').exists()).toBe(true);
    const items = wrapper.findAll('.ant-picker-selection-item');
    // 2 visible tags + 1 rest tag (+ 1 ...)
    expect(items.length).toBe(3);
    expect(items[0].text()).toContain('2024-05-01');
    expect(items[1].text()).toContain('2024-05-03');
    expect(items[2].text()).toContain('+ 1');

    // Remove first tag via close button
    await wrapper.find('.ant-picker-selection-item-remove').trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toEqual(['2024-05-03', '2024-05-05']);

    // Click an unselected date cell (2024-05-10) to add it
    const cell10 = wrapper.find('td[title="2024-05-10"]');
    expect(cell10.exists()).toBe(true);
    await cell10.trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1][1]).toEqual(['2024-05-03', '2024-05-05', '2024-05-10']);

    // Click already-selected date cell (2024-05-10) to toggle it off
    await cell10.trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange.mock.calls[2][1]).toEqual(['2024-05-03', '2024-05-05']);

    // Clear all dates
    await wrapper.find('.ant-picker-clear').trigger('mouseup');
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(4);
    expect(onChange.mock.calls[3][0]).toEqual([]);
    expect(onChange.mock.calls[3][1]).toEqual([]);

    wrapper.unmount();
  });

  it('supports multiple with valueFormat', async () => {
    const onChange = jest.fn();
    const wrapper = mount(DatePicker, {
      props: {
        multiple: true,
        valueFormat: 'YYYY-MM-DD',
        defaultValue: ['2024-06-01'],
        open: true,
        onChange,
      },
    });
    await nextTick();

    const cell = wrapper.find('td[title="2024-06-02"]');
    await cell.trigger('click');
    await nextTick();

    expect(onChange).toHaveBeenCalledWith(
      ['2024-06-01', '2024-06-02'],
      ['2024-06-01', '2024-06-02'],
    );
    wrapper.unmount();
  });

  it('requires clicking OK when needConfirm is true on DatePicker', async () => {
    const onChange = jest.fn();
    const onOk = jest.fn();
    const wrapper = mount(DatePicker, {
      props: {
        needConfirm: true,
        defaultPickerValue: dayjs('2024-05-01'),
        open: true,
        onChange,
        onOk,
      },
    });
    await nextTick();

    // OK button should exist and be disabled before picking a date
    const okBtn = wrapper.find('.ant-picker-ok button');
    expect(okBtn.exists()).toBe(true);
    expect(okBtn.attributes('disabled')).toBeDefined();

    // Click a date cell: should NOT emit change yet
    await wrapper.find('td[title="2024-05-15"]').trigger('click');
    await nextTick();
    expect(onChange).not.toHaveBeenCalled();
    expect(wrapper.find('.ant-picker-ok button').attributes('disabled')).toBeUndefined();

    // Click OK: emits change and ok
    await wrapper.find('.ant-picker-ok button').trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toBe('2024-05-15');
    expect(onOk).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it('inherits variant from Form context when provided', () => {
    const wrapper = mount({
      render() {
        return (
          <Form variant="filled">
            <DatePicker />
            <DatePicker.RangePicker />
            <DatePicker variant="underlined" />
          </Form>
        );
      },
    });
    const pickers = wrapper.findAll('.ant-picker');
    expect(pickers.length).toBe(3);
    expect(pickers[0].classes()).toContain('ant-picker-filled');
    expect(pickers[1].classes()).toContain('ant-picker-filled');
    expect(pickers[2].classes()).toContain('ant-picker-underlined');
    wrapper.unmount();
  });
});
