import { mount } from '@vue/test-utils';
import Calendar from '..';
import dayjs from 'dayjs';

describe('Calendar cellRender / fullCellRender / showWeek', () => {
  it('cellRender 渲染日期内容', () => {
    const wrapper = mount(Calendar, {
      props: {
        value: dayjs('2024-01-01'),
        cellRender: date => <span class="cell-content">{date.format('DD')}</span>,
      },
    });
    expect(wrapper.html()).toContain('cell-content');
  });

  it('fullCellRender 渲染整个 cell', () => {
    const wrapper = mount(Calendar, {
      props: {
        value: dayjs('2024-01-01'),
        fullCellRender: date => <div class="full-cell">{date.format('DD')}</div>,
      },
    });
    expect(wrapper.html()).toContain('full-cell');
  });

  it('showWeek 输出周数列', () => {
    const wrapper = mount(Calendar, {
      props: { value: dayjs('2024-01-01'), showWeek: true },
    });
    expect(wrapper.html()).toContain('ant-picker-cell-week');
  });
});
