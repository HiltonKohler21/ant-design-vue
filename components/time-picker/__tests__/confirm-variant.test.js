import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import dayjs from 'dayjs';
import TimePicker from '..';
import Form from '../../form';

jest.mock('../../_util/Portal');

describe('TimePicker needConfirm & variant', () => {
  it('supports variant prop on TimePicker and TimeRangePicker', () => {
    const variants = ['outlined', 'borderless', 'filled', 'underlined'];
    variants.forEach(variant => {
      const single = mount(TimePicker, { props: { variant } });
      expect(single.find(`.ant-picker-${variant}`).exists()).toBe(true);
      single.unmount();

      const range = mount(TimePicker.TimeRangePicker, { props: { variant } });
      expect(range.find(`.ant-picker-${variant}`).exists()).toBe(true);
      range.unmount();
    });
  });

  it('shows OK button when needConfirm is true (default) and commits on OK', async () => {
    const onChange = jest.fn();
    const onOk = jest.fn();
    const wrapper = mount(TimePicker, {
      props: {
        needConfirm: true,
        open: true,
        onChange,
        onOk,
      },
    });
    await nextTick();

    const okBtn = wrapper.find('.ant-picker-ok button');
    expect(okBtn.exists()).toBe(true);

    // Click an hour cell (02)
    const hourCells = wrapper.findAll('.ant-picker-time-panel-column')[0].findAll('li');
    await hourCells[2].trigger('click');
    await nextTick();
    expect(onChange).not.toHaveBeenCalled();

    // Confirm with OK
    await wrapper.find('.ant-picker-ok button').trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onOk).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it('commits immediately and hides OK button when needConfirm is false', async () => {
    const onChange = jest.fn();
    const wrapper = mount(TimePicker, {
      props: {
        needConfirm: false,
        defaultValue: dayjs('01:00:00', 'HH:mm:ss'),
        open: true,
        onChange,
      },
    });
    await nextTick();

    expect(wrapper.find('.ant-picker-ok button').exists()).toBe(false);

    // Click hour 03: commits immediately without OK button
    const hourCells = wrapper.findAll('.ant-picker-time-panel-column')[0].findAll('li');
    await hourCells[3].trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toBe('03:00:00');
    wrapper.unmount();
  });

  it('inherits variant from Form context on TimePicker and TimeRangePicker', () => {
    const wrapper = mount({
      render() {
        return (
          <Form variant="filled">
            <TimePicker />
            <TimePicker.TimeRangePicker />
            <TimePicker variant="borderless" />
          </Form>
        );
      },
    });
    const pickers = wrapper.findAll('.ant-picker');
    expect(pickers.length).toBe(3);
    expect(pickers[0].classes()).toContain('ant-picker-filled');
    expect(pickers[1].classes()).toContain('ant-picker-filled');
    expect(pickers[2].classes()).toContain('ant-picker-borderless');
    wrapper.unmount();
  });
});
