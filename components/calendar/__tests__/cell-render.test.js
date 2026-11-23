import { mount } from '@vue/test-utils';
import Calendar from '..';
import dayjs from 'dayjs';

describe('Calendar cellRender / fullCellRender / showWeek', () => {
  it('cellRender 渲染日期内容并传递 info', () => {
    const receivedInfos = [];
    const wrapper = mount(Calendar, {
      props: {
        value: dayjs('2024-01-01'),
        cellRender: (date, info) => {
          receivedInfos.push(info);
          return <span class="cell-content">{date.format('DD')}</span>;
        },
      },
    });
    expect(wrapper.html()).toContain('cell-content');
    expect(receivedInfos.length).toBeGreaterThan(0);
    expect(receivedInfos[0].type).toBe('date');
    expect(receivedInfos[0].today).toBeDefined();
    expect(receivedInfos[0].originNode).toBeDefined();
  });

  it('fullCellRender 渲染整个 cell 并传递 info', () => {
    const receivedInfos = [];
    const wrapper = mount(Calendar, {
      props: {
        value: dayjs('2024-01-01'),
        fullCellRender: (date, info) => {
          receivedInfos.push(info);
          return <div class="full-cell">{date.format('DD')}</div>;
        },
      },
    });
    expect(wrapper.html()).toContain('full-cell');
    expect(receivedInfos.length).toBeGreaterThan(0);
    expect(receivedInfos[0].type).toBe('date');
    expect(receivedInfos[0].originNode).toBeDefined();
  });

  it('showWeek 输出周数列', () => {
    const wrapper = mount(Calendar, {
      props: { value: dayjs('2024-01-01'), showWeek: true },
    });
    expect(wrapper.html()).toContain('ant-picker-cell-week');
  });
});
