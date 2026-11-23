import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Tabs from '..';
import ConfigProvider from '../../config-provider';
import VcDropdown from '../../vc-dropdown';

describe('Tabs tabPlacement & more', () => {
  const sampleItems = [
    { key: '1', label: 'Tab 1', children: 'Content 1' },
    { key: '2', label: 'Tab 2', children: 'Content 2' },
  ];

  describe('tabPlacement', () => {
    it.each(['top', 'right', 'bottom', 'left'])(
      'supports direct tabPlacement="%s"',
      tabPlacement => {
        const wrapper = mount(Tabs, {
          props: {
            tabPlacement,
            items: sampleItems,
          },
        });
        expect(wrapper.classes()).toContain(`ant-tabs-${tabPlacement}`);
      },
    );

    it('maps start/end according to LTR and RTL direction', () => {
      const ltrStart = mount(Tabs, {
        props: { tabPlacement: 'start', items: sampleItems },
      });
      expect(ltrStart.classes()).toContain('ant-tabs-left');

      const ltrEnd = mount(Tabs, {
        props: { tabPlacement: 'end', items: sampleItems },
      });
      expect(ltrEnd.classes()).toContain('ant-tabs-right');

      const rtlStart = mount(Tabs, {
        props: { tabPlacement: 'start', direction: 'rtl', items: sampleItems },
      });
      expect(rtlStart.classes()).toContain('ant-tabs-right');
      expect(rtlStart.classes()).toContain('ant-tabs-rtl');

      const rtlEnd = mount({
        render() {
          return (
            <ConfigProvider direction="rtl">
              <Tabs tabPlacement="end" items={sampleItems} />
            </ConfigProvider>
          );
        },
      });
      expect(rtlEnd.find('.ant-tabs').classes()).toContain('ant-tabs-left');
    });

    it('keeps tabPosition backwards-compatible and prefers tabPlacement when both set', () => {
      const legacy = mount(Tabs, {
        props: { tabPosition: 'bottom', items: sampleItems },
      });
      expect(legacy.classes()).toContain('ant-tabs-bottom');

      const override = mount(Tabs, {
        props: { tabPosition: 'bottom', tabPlacement: 'start', items: sampleItems },
      });
      expect(override.classes()).toContain('ant-tabs-left');
    });
  });

  describe('more prop & legacy moreIcon', () => {
    let originGetBoundingClientRect;
    let originOffsetWidth;
    let originOffsetLeft;

    beforeEach(() => {
      originGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
      originOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
      originOffsetLeft = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetLeft');

      HTMLElement.prototype.getBoundingClientRect = function () {
        if (this.classList?.contains('ant-tabs-tab')) {
          const parent = this.parentElement;
          const idx = parent ? Array.from(parent.children).indexOf(this) : 0;
          return {
            width: 100,
            height: 40,
            left: idx * 100,
            top: 0,
            x: idx * 100,
            y: 0,
            right: (idx + 1) * 100,
            bottom: 40,
          };
        }
        if (this.classList?.contains('ant-tabs-nav-wrap')) {
          return { width: 150, height: 40, left: 0, top: 0, x: 0, y: 0, right: 150, bottom: 40 };
        }
        return { width: 500, height: 40, left: 0, top: 0, x: 0, y: 0, right: 500, bottom: 40 };
      };

      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        get() {
          if (this.classList?.contains('ant-tabs-tab')) return 100;
          if (this.classList?.contains('ant-tabs-nav-wrap')) return 150;
          if (this.classList?.contains('ant-tabs-nav-list')) return 500;
          return 150;
        },
      });
      Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
        configurable: true,
        get() {
          if (this.classList?.contains('ant-tabs-tab')) {
            const parent = this.parentElement;
            const idx = parent ? Array.from(parent.children).indexOf(this) : 0;
            return idx * 100;
          }
          return 0;
        },
      });
    });

    afterEach(() => {
      HTMLElement.prototype.getBoundingClientRect = originGetBoundingClientRect;
      if (originOffsetWidth)
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originOffsetWidth);
      if (originOffsetLeft)
        Object.defineProperty(HTMLElement.prototype, 'offsetLeft', originOffsetLeft);
    });

    const manyItems = Array.from({ length: 5 }, (_, i) => ({
      key: String(i + 1),
      label: `Tab ${i + 1}`,
      children: `Content ${i + 1}`,
    }));

    it('forwards more.icon, more.trigger, more.overlayClassName, more.overlayStyle', async () => {
      const wrapper = mount(Tabs, {
        props: {
          items: manyItems,
          more: {
            icon: <span class="custom-more-icon">MORE</span>,
            trigger: 'click',
            overlayClassName: 'custom-more-overlay',
            overlayStyle: { minWidth: '200px' },
          },
        },
      });
      await new Promise(r => setTimeout(r, 50));
      await nextTick();

      expect(wrapper.find('.custom-more-icon').exists()).toBe(true);
      const dd = wrapper.findComponent(VcDropdown);
      expect(dd.exists()).toBe(true);
      expect(dd.props('trigger')).toEqual(['click']);
      expect(dd.props('overlayClassName')).toContain('custom-more-overlay');
      expect(dd.props('overlayStyle')).toEqual({ minWidth: '200px' });
    });

    it('supports legacy moreIcon prop and slot fallback when more.icon is omitted', async () => {
      const slotWrapper = mount(Tabs, {
        props: {
          items: manyItems,
          more: { trigger: ['click'] },
        },
        slots: {
          moreIcon: () => <span class="slot-more-icon">SLOT</span>,
        },
      });
      await new Promise(r => setTimeout(r, 50));
      await nextTick();

      expect(slotWrapper.find('.slot-more-icon').exists()).toBe(true);
      expect(slotWrapper.findComponent(VcDropdown).props('trigger')).toEqual(['click']);

      const propWrapper = mount(Tabs, {
        props: {
          items: manyItems,
          moreIcon: <span class="prop-more-icon">PROP</span>,
        },
      });
      await new Promise(r => setTimeout(r, 50));
      await nextTick();

      expect(propWrapper.find('.prop-more-icon').exists()).toBe(true);
    });
  });
});
