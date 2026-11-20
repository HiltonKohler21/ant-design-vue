import { mount } from '@vue/test-utils';
import Tabs from '..';

describe('Tabs items（配置式）', () => {
  it('items 数组渲染等价 TabPane', () => {
    const wrapper = mount(Tabs, {
      props: {
        items: [
          { key: '1', label: 'Tab 1', children: 'content-1' },
          { key: '2', label: 'Tab 2', children: 'content-2' },
        ],
      },
    });
    expect(wrapper.html()).toContain('Tab 1');
    expect(wrapper.html()).toContain('Tab 2');
    expect(wrapper.html()).toContain('content-1');
  });

  it('items 支持 disabled', () => {
    const wrapper = mount(Tabs, {
      props: {
        items: [
          { key: '1', label: 'A', children: 'a', disabled: true },
          { key: '2', label: 'B', children: 'b' },
        ],
      },
    });
    expect(wrapper.html()).toContain('ant-tabs-tab-disabled');
  });

  it('items 与 TabPane children 共存时 items 优先', () => {
    const wrapper = mount(Tabs, {
      props: { items: [{ key: '1', label: 'FromItems', children: 'x' }] },
      slots: {
        default: () => (
          <Tabs.TabPane key="2" tab="FromSlot">
            y
          </Tabs.TabPane>
        ),
      },
    });
    expect(wrapper.html()).toContain('FromItems');
    expect(wrapper.html()).not.toContain('FromSlot');
  });
});

describe('Tabs indicatorSize', () => {
  it('indicatorSize=small 输出 class', () => {
    const wrapper = mount(Tabs, {
      props: { indicatorSize: 'small', items: [{ key: '1', label: 'A', children: 'a' }] },
    });
    expect(wrapper.element.getAttribute('class')).toContain('ant-tabs-indicator-size-small');
  });
});
