import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Timeline from '..';
import ConfigProvider from '../../config-provider';

const items = [
  { title: '2015-09-01', content: 'Create a services' },
  { title: '2015-09-01 09:12:11', content: 'Solve initial network problems' },
  { content: 'Technical testing' },
];

describe('Timeline.Semantic & v6 features', () => {
  it('supports static object classNames and styles for all 9 semantic slots', () => {
    const wrapper = mount(Timeline, {
      props: {
        items,
        classNames: {
          root: 'custom-root',
          item: 'custom-item',
          itemWrapper: 'custom-wrapper',
          itemIcon: 'custom-icon',
          itemSection: 'custom-section',
          itemHeader: 'custom-header',
          itemTitle: 'custom-title',
          itemContent: 'custom-content',
          itemRail: 'custom-rail',
        },
        styles: {
          root: { color: 'rgb(255, 0, 0)' },
          item: { color: 'rgb(0, 0, 255)' },
          itemWrapper: { color: 'rgb(0, 255, 0)' },
          itemIcon: { borderColor: 'rgb(255, 255, 0)' },
          itemSection: { color: 'rgb(128, 0, 128)' },
          itemHeader: { color: 'rgb(255, 165, 0)' },
          itemTitle: { color: 'rgb(255, 192, 203)' },
          itemContent: { color: 'rgb(255, 0, 255)' },
          itemRail: { borderStyle: 'dashed' },
        },
      },
    });

    const checks = [
      ['.ant-timeline', 'custom-root', 'color: rgb(255, 0, 0)'],
      ['.ant-timeline-item', 'custom-item', 'color: rgb(0, 0, 255)'],
      ['.ant-timeline-item-wrapper', 'custom-wrapper', 'color: rgb(0, 255, 0)'],
      ['.ant-timeline-item-icon', 'custom-icon', 'border-color: rgb(255, 255, 0)'],
      ['.ant-timeline-item-section', 'custom-section', 'color: rgb(128, 0, 128)'],
      ['.ant-timeline-item-header', 'custom-header', 'color: rgb(255, 165, 0)'],
      ['.ant-timeline-item-title', 'custom-title', 'color: rgb(255, 192, 203)'],
      ['.ant-timeline-item-content', 'custom-content', 'color: rgb(255, 0, 255)'],
      ['.ant-timeline-item-rail', 'custom-rail', 'border-style: dashed'],
    ];

    for (const [selector, cls, expectedStyle] of checks) {
      const el = wrapper.find(selector);
      expect(el.exists()).toBe(true);
      expect(el.classes()).toContain(cls);
      expect(el.attributes('style')).toContain(expectedStyle);
    }

    wrapper.unmount();
  });

  it('supports functional classNames/styles and merges ConfigProvider.timeline', async () => {
    const classNamesFn = info => ({
      root: info.props.variant === 'filled' ? 'filled-root' : 'outlined-root',
      item: `item-${info.props.orientation}`,
      itemIcon: `icon-${info.props.variant}`,
    });
    const stylesFn = info => ({
      root: { padding: info.props.orientation === 'vertical' ? '10px' : '4px' },
      itemContent: { fontSize: '14px' },
    });

    const wrapper = mount({
      props: {
        variant: { type: String, default: 'outlined' },
        orientation: { type: String, default: 'vertical' },
      },
      render() {
        return (
          <ConfigProvider
            timeline={{
              className: 'ctx-cls',
              style: { opacity: '0.95' },
              classNames: { root: 'ctx-root', item: 'ctx-item' },
              styles: {
                root: { backgroundColor: 'rgb(1, 2, 3)' },
                itemContent: { color: 'rgb(9, 9, 9)' },
              },
            }}
          >
            <Timeline
              variant={this.variant}
              orientation={this.orientation}
              items={items}
              classNames={classNamesFn}
              styles={stylesFn}
            />
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-timeline');
    const item = wrapper.find('.ant-timeline-item');
    const content = wrapper.find('.ant-timeline-item-content');

    expect(root.classes()).toContain('ctx-cls');
    expect(root.classes()).toContain('ctx-root');
    expect(root.classes()).toContain('outlined-root');
    expect(root.attributes('style')).toContain('opacity: 0.95');
    expect(root.attributes('style')).toContain('background-color: rgb(1, 2, 3)');
    expect(root.attributes('style')).toContain('padding: 10px');
    expect(item.classes()).toContain('ctx-item');
    expect(item.classes()).toContain('item-vertical');
    expect(content.attributes('style')).toContain('color: rgb(9, 9, 9)');
    expect(content.attributes('style')).toContain('font-size: 14px');

    await wrapper.setProps({ variant: 'filled', orientation: 'horizontal' });
    await nextTick();
    expect(wrapper.find('.ant-timeline').classes()).toContain('filled-root');
    expect(wrapper.find('.ant-timeline').attributes('style')).toContain('padding: 4px');
    expect(wrapper.find('.ant-timeline-item').classes()).toContain('item-horizontal');
    expect(wrapper.find('.ant-timeline-item-icon').classes()).toContain('icon-filled');

    wrapper.unmount();
  });

  it('supports per-item classNames and styles on items prop', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: [
          {
            title: 'T1',
            content: 'C1',
            classNames: {
              root: 'per-item-root',
              rail: 'per-item-rail',
              content: 'per-item-content',
            },
            styles: {
              root: { height: '100px' },
              rail: { borderStyle: 'dashed' },
              content: { opacity: '0.45' },
            },
          },
        ],
      },
    });

    const item = wrapper.find('.ant-timeline-item');
    expect(item.classes()).toContain('per-item-root');
    expect(item.attributes('style')).toContain('height: 100px');
    expect(item.find('.ant-timeline-item-rail').classes()).toContain('per-item-rail');
    expect(item.find('.ant-timeline-item-rail').attributes('style')).toContain(
      'border-style: dashed',
    );
    expect(item.find('.ant-timeline-item-content').classes()).toContain('per-item-content');
    expect(item.find('.ant-timeline-item-content').attributes('style')).toContain('opacity: 0.45');

    wrapper.unmount();
  });
});
