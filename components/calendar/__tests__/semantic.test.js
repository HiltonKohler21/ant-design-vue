import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import dayjs from 'dayjs';
import Calendar from '..';
import Flex from '../../flex';
import Row from '../../row';
import Col from '../../col';
import Select from '../../select';
import Radio from '../../radio';
import ConfigProvider from '../../config-provider';
import LunarDemo from '../demo/lunar.vue';
import WeekDemo from '../demo/week.vue';
import StyleClassDemo from '../demo/style-class.vue';

describe('Calendar.Semantic & v6 features', () => {
  it('supports static object classNames and styles for root, header, body, content, item, itemContent', () => {
    const wrapper = mount(Calendar, {
      props: {
        value: dayjs('2026-01-15'),
        classNames: {
          root: 'custom-root',
          header: 'custom-header',
          body: 'custom-body',
          content: 'custom-content',
          item: 'custom-item',
          itemContent: 'custom-item-content',
        },
        styles: {
          root: { backgroundColor: 'rgb(1, 2, 3)' },
          header: { paddingTop: '6px' },
          body: { paddingBottom: '8px' },
          content: { borderSpacing: '2px' },
          item: { color: 'rgb(10, 20, 30)' },
          itemContent: { overflow: 'visible' },
        },
      },
    });

    const root = wrapper.find('.ant-picker-calendar');
    const header = wrapper.find('.ant-picker-calendar-header');
    const body = wrapper.find('.ant-picker-body');
    const content = wrapper.find('.ant-picker-content');
    const item = wrapper.find('.ant-picker-cell');
    const itemContent = wrapper.find('.ant-picker-calendar-date-content');

    expect(root.classes()).toContain('custom-root');
    expect(header.classes()).toContain('custom-header');
    expect(body.classes()).toContain('custom-body');
    expect(content.classes()).toContain('custom-content');
    expect(item.classes()).toContain('custom-item');
    expect(itemContent.classes()).toContain('custom-item-content');

    expect(root.attributes('style')).toContain('background-color: rgb(1, 2, 3)');
    expect(header.attributes('style')).toContain('padding-top: 6px');
    expect(body.attributes('style')).toContain('padding-bottom: 8px');
    expect(content.attributes('style')).toContain('border-spacing: 2px');
    expect(item.attributes('style')).toContain('color: rgb(10, 20, 30)');
    expect(itemContent.attributes('style')).toContain('overflow: visible');

    wrapper.unmount();
  });

  it('supports functional classNames/styles and merges ConfigProvider.calendar', async () => {
    const classNamesFn = info => ({
      root: info.props.fullscreen ? 'cal-full' : 'cal-mini',
      header: 'fn-header',
      body: 'fn-body',
      itemContent: 'fn-item-content',
    });
    const stylesFn = info => ({
      root: { borderRadius: info.props.fullscreen ? '10px' : '4px' },
      header: { marginBottom: '4px' },
      body: { paddingLeft: '6px' },
    });

    const wrapper = mount({
      props: {
        fullscreen: { type: Boolean, default: true },
      },
      render() {
        return (
          <ConfigProvider
            calendar={{
              className: 'ctx-cls',
              style: { opacity: '0.95' },
              classNames: { root: 'ctx-root', header: 'ctx-header', body: 'ctx-body' },
              styles: {
                root: { padding: '12px' },
                header: { paddingLeft: '8px' },
                body: { marginTop: '2px' },
              },
            }}
          >
            <Calendar
              value={dayjs('2026-01-15')}
              fullscreen={this.fullscreen}
              classNames={classNamesFn}
              styles={stylesFn}
            />
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-picker-calendar');
    const header = wrapper.find('.ant-picker-calendar-header');
    const body = wrapper.find('.ant-picker-body');

    expect(root.classes()).toContain('ctx-cls');
    expect(root.classes()).toContain('ctx-root');
    expect(root.classes()).toContain('cal-full');
    expect(root.attributes('style')).toContain('opacity: 0.95');
    expect(root.attributes('style')).toContain('padding: 12px');
    expect(root.attributes('style')).toContain('border-radius: 10px');

    expect(header.classes()).toContain('ctx-header');
    expect(header.classes()).toContain('fn-header');
    expect(header.attributes('style')).toContain('padding-left: 8px');
    expect(header.attributes('style')).toContain('margin-bottom: 4px');

    expect(body.classes()).toContain('ctx-body');
    expect(body.classes()).toContain('fn-body');
    expect(body.attributes('style')).toContain('margin-top: 2px');
    expect(body.attributes('style')).toContain('padding-left: 6px');

    await wrapper.setProps({ fullscreen: false });
    await nextTick();
    expect(wrapper.find('.ant-picker-calendar').classes()).toContain('cal-mini');
    expect(wrapper.find('.ant-picker-calendar').classes()).not.toContain('cal-full');
    expect(wrapper.find('.ant-picker-calendar').attributes('style')).toContain(
      'border-radius: 4px',
    );

    wrapper.unmount();
  });

  it('mounts new lunar, week, and style-class demos cleanly', () => {
    const plugins = [Calendar, Flex, Row, Col, Select, Radio];
    const lunarWrapper = mount(LunarDemo, { global: { plugins } });
    expect(lunarWrapper.find('.demo-calendar-lunar-wrapper').exists()).toBe(true);
    expect(lunarWrapper.findAll('.lunar-date-cell').length).toBeGreaterThan(20);
    lunarWrapper.unmount();

    const weekWrapper = mount(WeekDemo, { global: { plugins } });
    expect(weekWrapper.findAll('.ant-picker-cell-week').length).toBeGreaterThan(0);
    weekWrapper.unmount();

    const styleClassWrapper = mount(StyleClassDemo, { global: { plugins } });
    expect(styleClassWrapper.findAll('.demo-calendar-semantic-root')).toHaveLength(2);
    styleClassWrapper.unmount();
  });
});
