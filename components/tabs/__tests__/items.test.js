import { mount } from '@vue/test-utils';
import Tabs from '..';
import ConfigProvider from '../../config-provider';
import { asyncExpect } from '../../../tests/utils';

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

describe('Tabs indicatorSize & indicator', () => {
  let originGetBoundingClientRect;
  let originOffsetWidth;
  let originOffsetHeight;
  let originOffsetLeft;
  let originOffsetTop;

  beforeEach(() => {
    originGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    originOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
    originOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
    originOffsetLeft = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetLeft');
    originOffsetTop = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetTop');

    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.classList?.contains('ant-tabs-tab')) {
        return { width: 100, height: 40, left: 10, top: 20, x: 10, y: 20, right: 110, bottom: 60 };
      }
      return { width: 300, height: 200, left: 0, top: 0, x: 0, y: 0, right: 300, bottom: 200 };
    };
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return this.classList?.contains('ant-tabs-tab') ? 100 : 300;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return this.classList?.contains('ant-tabs-tab') ? 40 : 200;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
      configurable: true,
      get() {
        return this.classList?.contains('ant-tabs-tab') ? 10 : 0;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
      configurable: true,
      get() {
        return this.classList?.contains('ant-tabs-tab') ? 20 : 0;
      },
    });
  });

  afterEach(() => {
    HTMLElement.prototype.getBoundingClientRect = originGetBoundingClientRect;
    if (originOffsetWidth)
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originOffsetWidth);
    if (originOffsetHeight)
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originOffsetHeight);
    if (originOffsetLeft)
      Object.defineProperty(HTMLElement.prototype, 'offsetLeft', originOffsetLeft);
    if (originOffsetTop) Object.defineProperty(HTMLElement.prototype, 'offsetTop', originOffsetTop);
  });

  it('indicatorSize=small 输出 class', () => {
    const wrapper = mount(Tabs, {
      props: { indicatorSize: 'small', items: [{ key: '1', label: 'A', children: 'a' }] },
    });
    expect(wrapper.element.getAttribute('class')).toContain('ant-tabs-indicator-size-small');
  });

  it('indicatorSize as number sets ink bar width', async () => {
    const wrapper = mount(Tabs, {
      props: { indicatorSize: 20, items: [{ key: '1', label: 'A', children: 'a' }] },
    });
    await asyncExpect(() => {
      const inkBar = wrapper.find('.ant-tabs-ink-bar');
      expect(inkBar.element.style.width).toBe('20px');
    }, 50);
  });

  it('indicatorSize as function computes width from origin', async () => {
    const wrapper = mount(Tabs, {
      props: {
        indicatorSize: origin => origin - 20,
        items: [{ key: '1', label: 'A', children: 'a' }],
      },
    });
    await asyncExpect(() => {
      const inkBar = wrapper.find('.ant-tabs-ink-bar');
      expect(inkBar.element.style.width).toBe('80px');
    }, 50);
  });

  it('indicator object supports size (number/fn) and align (start/center/end)', async () => {
    const startWrapper = mount(Tabs, {
      props: {
        indicator: { size: 20, align: 'start' },
        items: [{ key: '1', label: 'A', children: 'a' }],
      },
    });
    await asyncExpect(() => {
      const inkBar = startWrapper.find('.ant-tabs-ink-bar');
      expect(inkBar.element.style.width).toBe('20px');
      expect(inkBar.element.style.left).toBe('10px');
    }, 50);

    const centerWrapper = mount(Tabs, {
      props: {
        indicator: { size: 20, align: 'center' },
        items: [{ key: '1', label: 'A', children: 'a' }],
      },
    });
    await asyncExpect(() => {
      const inkBar = centerWrapper.find('.ant-tabs-ink-bar');
      expect(inkBar.element.style.width).toBe('20px');
      expect(inkBar.element.style.left).toBe('50px');
    }, 50);

    const endWrapper = mount(Tabs, {
      props: {
        indicator: { size: origin => origin / 2, align: 'end' },
        items: [{ key: '1', label: 'A', children: 'a' }],
      },
    });
    await asyncExpect(() => {
      const inkBar = endWrapper.find('.ant-tabs-ink-bar');
      expect(inkBar.element.style.width).toBe('50px');
      expect(inkBar.element.style.left).toBe('60px');
    }, 50);

    const verticalWrapper = mount(Tabs, {
      props: {
        tabPosition: 'left',
        indicator: { size: 16, align: 'end' },
        items: [{ key: '1', label: 'A', children: 'a' }],
      },
    });
    await asyncExpect(() => {
      const inkBar = verticalWrapper.find('.ant-tabs-ink-bar');
      expect(inkBar.element.style.height).toBe('16px');
      expect(inkBar.element.style.top).toBe('44px');
    }, 50);
  });

  it('ConfigProvider.tabs wires className, style, and indicator', async () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            tabs={{
              className: 'cp-tabs',
              style: { marginTop: '10px' },
              indicator: { size: 12, align: 'start' },
            }}
          >
            <Tabs items={[{ key: '1', label: 'Foo' }]} class="tabs-default" />
            <Tabs
              items={[{ key: '2', label: 'Bar' }]}
              indicator={{ size: 30 }}
              class="tabs-override"
            />
          </ConfigProvider>
        );
      },
    });
    await asyncExpect(() => {
      const t1 = wrapper.find('.tabs-default');
      expect(t1.classes()).toContain('cp-tabs');
      expect(t1.element.style.marginTop).toBe('10px');
      expect(t1.find('.ant-tabs-ink-bar').element.style.width).toBe('12px');
      expect(t1.find('.ant-tabs-ink-bar').element.style.left).toBe('10px');

      const t2 = wrapper.find('.tabs-override');
      expect(t2.find('.ant-tabs-ink-bar').element.style.width).toBe('30px');
    }, 50);
  });
});
