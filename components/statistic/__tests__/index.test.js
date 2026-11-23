import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import Statistic, { StatisticTimer } from '..';
import Row from '../../row';
import Col from '../../col';
import ConfigProvider from '../../config-provider';
import { formatTimeStr } from '../utils';
import mountTest from '../../../tests/shared/mountTest';
import TimerDemo from '../demo/timer.vue';

describe('Statistic', () => {
  mountTest(Statistic);
  mountTest(Statistic.Countdown);
  mountTest(Statistic.Timer);

  beforeAll(() => {
    MockDate.set(dayjs('2018-11-28 00:00:00'));
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('customize formatter', () => {
    const formatter = jest.fn(() => 93);
    const props = {
      props: {
        value: 1128,
        formatter,
      },
    };
    const wrapper = mount(Statistic, props);
    expect(formatter).toBeCalledWith(expect.objectContaining({ value: 1128 }));
    expect(wrapper.find('.ant-statistic-content-value').text()).toEqual('93');
  });

  it('groupSeparator', () => {
    const props = {
      props: {
        value: 1128,
        groupSeparator: '__TEST__',
      },
    };
    const wrapper = mount(Statistic, props);
    expect(wrapper.find('.ant-statistic-content-value').text()).toEqual('1__TEST__128');
  });

  it('not a number', () => {
    const props = {
      props: {
        value: 'bamboo',
      },
    };
    const wrapper = mount(Statistic, props);
    expect(wrapper.find('.ant-statistic-content-value').text()).toEqual('bamboo');
  });

  it('support negetive number', () => {
    const props = {
      props: {
        title: 'Account Balance (CNY)',
        value: -112893.12345,
        precision: 2,
      },
    };
    const wrapper = mount(Statistic, props);
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('Countdown', () => {
    it('render correctly', () => {
      const now = dayjs().add(2, 'd').add(11, 'h').add(28, 'm').add(9, 's').add(3, 'ms');

      [
        ['H:m:s', '59:28:9'],
        ['HH:mm:ss', '59:28:09'],
        ['HH:mm:ss:SSS', '59:28:09:003'],
        ['DD-HH:mm:ss', '02-11:28:09'],
      ].forEach(([format, value]) => {
        const props = {
          props: {
            format,
            value: now,
          },
        };
        const wrapper = mount(Statistic.Countdown, props);
        expect(wrapper.find('.ant-statistic-content-value').text()).toEqual(value);
      });
    });
  });
  describe('Timer', () => {
    it('exports Statistic.Timer and StatisticTimer', () => {
      expect(Statistic.Timer).toBe(StatisticTimer);
    });

    it('renders countdown correctly by default and with type="countdown"', () => {
      const target = dayjs().add(2, 'd').add(11, 'h').add(28, 'm').add(9, 's').add(3, 'ms');

      [
        ['H:m:s', '59:28:9'],
        ['HH:mm:ss', '59:28:09'],
        ['HH:mm:ss:SSS', '59:28:09:003'],
        ['DD-HH:mm:ss', '02-11:28:09'],
      ].forEach(([format, expected]) => {
        const wrapper = mount(Statistic.Timer, {
          props: {
            format,
            value: target,
          },
        });
        expect(wrapper.find('.ant-statistic-content-value').text()).toEqual(expected);
        wrapper.unmount();
      });
    });

    it('renders countup correctly with type="countup"', () => {
      const past = dayjs().subtract(1, 'd').subtract(2, 'h').subtract(3, 'm').subtract(4, 's');
      const wrapper = mount(Statistic.Timer, {
        props: {
          type: 'countup',
          format: 'DD-HH:mm:ss',
          value: past,
          title: 'Elapsed',
          valueStyle: { color: 'rgb(20, 30, 40)' },
        },
        slots: {
          prefix: () => <span class="timer-prefix">+</span>,
          suffix: () => <span class="timer-suffix">ago</span>,
        },
      });
      expect(wrapper.find('.ant-statistic-title').text()).toBe('Elapsed');
      expect(wrapper.find('.timer-prefix').text()).toBe('+');
      expect(wrapper.find('.timer-suffix').text()).toBe('ago');
      expect(wrapper.find('.ant-statistic-content').element.style.color).toBe('rgb(20, 30, 40)');
      expect(wrapper.find('.ant-statistic-content-value').text()).toEqual('01-02:03:04');
      wrapper.unmount();
    });

    it('triggers onChange and onFinish for countdown, and only onChange for countup', () => {
      jest.useFakeTimers({ doNotFake: ['Date'] });
      const baseTime = dayjs('2018-11-28 00:00:00').valueOf();
      MockDate.set(baseTime);

      const onCountdownChange = jest.fn();
      const onCountdownFinish = jest.fn();
      const countdownWrapper = mount(Statistic.Timer, {
        props: {
          type: 'countdown',
          value: baseTime + 50,
          onChange: onCountdownChange,
          onFinish: onCountdownFinish,
        },
      });

      MockDate.set(baseTime + 20);
      jest.advanceTimersByTime(40);
      expect(onCountdownChange).toHaveBeenCalled();
      expect(onCountdownFinish).not.toHaveBeenCalled();

      MockDate.set(baseTime + 100);
      jest.advanceTimersByTime(40);
      expect(onCountdownFinish).toHaveBeenCalledTimes(1);

      // Should not fire again after finished
      MockDate.set(baseTime + 200);
      jest.advanceTimersByTime(100);
      expect(onCountdownFinish).toHaveBeenCalledTimes(1);
      countdownWrapper.unmount();

      // Countup should trigger onChange and never onFinish
      MockDate.set(baseTime);
      const onCountupChange = jest.fn();
      const onCountupFinish = jest.fn();
      const countupWrapper = mount(Statistic.Timer, {
        props: {
          type: 'countup',
          value: baseTime - 1000,
          onChange: onCountupChange,
          onFinish: onCountupFinish,
        },
      });

      MockDate.set(baseTime + 100);
      jest.advanceTimersByTime(50);
      expect(onCountupChange).toHaveBeenCalled();
      expect(onCountupFinish).not.toHaveBeenCalled();
      countupWrapper.unmount();

      MockDate.set(dayjs('2018-11-28 00:00:00'));
      jest.useRealTimers();
    });
  });

  describe('utils', () => {
    it('format should support escape', () => {
      expect(formatTimeStr(1000 * 60 * 60 * 24, 'D [Day]')).toBe('1 Day');
    });
  });

  it('generates valid cssVar styles and component tokens without illegal CSS', async () => {
    document.head.innerHTML = '';
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            theme={{
              cssVar: true,
              components: {
                Statistic: {
                  titleFontSize: 16,
                  contentFontSize: 28,
                },
              },
            }}
          >
            <Statistic title="Users" value={100} />
          </ConfigProvider>
        );
      },
    });
    await nextTick();
    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('--ant-statistic-title-font-size:16px');
    expect(css).toContain('--ant-statistic-content-font-size:28px');
    expect(css).not.toMatch(/NaN|undefined|\[object Object\]/);
    expect(css).not.toMatch(/(?<![\w)])-var\(--ant-/);
    expect(css).not.toMatch(/var\(--ant-[a-z0-9-]+\)(?=[A-Za-z0-9.-]+)/);
    wrapper.unmount();
  });

  it('renders timer demo correctly', () => {
    const wrapper = mount(TimerDemo, {
      global: { plugins: [Statistic, Row, Col] },
    });
    expect(wrapper.findAll('.ant-statistic')).toHaveLength(4);
    wrapper.unmount();
  });
});
