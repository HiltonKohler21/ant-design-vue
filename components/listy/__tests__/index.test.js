import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Button from '../../button';
import Flex from '../../flex';
import InputNumber from '../../input-number';
import Segmented from '../../segmented';
import Select from '../../select';
import Space from '../../space';
import Typography from '../../typography';
import Listy from '..';
import ConfigProvider from '../../config-provider';
import RowHoverableDebugDemo from '../demo/row-hoverable-debug.vue';
import DragSortingDemo from '../demo/drag-sorting.vue';
import ScrollToDemo from '../demo/scroll-to.vue';

const demoPlugins = [Button, Flex, InputNumber, Listy, Segmented, Select, Space, Typography];

describe('Listy', () => {
  it('renders rows with primary items, rowKey, and itemRender', () => {
    const wrapper = mount(Listy, {
      props: {
        items: [
          { id: 'a', label: 'Alpha' },
          { id: 'b', label: 'Beta' },
        ],
        rowKey: 'id',
        itemRender: item => <span>{item.label}</span>,
      },
    });
    const rows = wrapper.findAll('.ant-listy-item');
    expect(rows.length).toBe(2);
    expect(rows[0].text()).toBe('Alpha');
    expect(rows[0].attributes('data-item-key')).toBe('a');
    expect(wrapper.find('.ant-listy').classes()).toContain('ant-listy-hoverable');
  });

  it('supports deprecated data & itemKey aliases with dev warnings', () => {
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const wrapper = mount(Listy, {
      props: {
        data: [
          { code: 'x', label: 'X' },
          { code: 'y', label: 'Y' },
        ],
        itemKey: 'code',
        itemRender: item => <span>{item.label}</span>,
      },
    });
    expect(wrapper.findAll('.ant-listy-item').length).toBe(2);
    expect(wrapper.text()).toContain('X');
    const warnText = warnSpy.mock.calls.map(c => String(c[0])).join('\n');
    expect(warnText).toContain('`data` is deprecated');
    expect(warnText).toContain('`itemKey` is deprecated');
    warnSpy.mockRestore();
  });

  it('auto-computes itemHeight from token in virtual mode without explicit itemHeight', () => {
    const wrapper = mount(Listy, {
      props: {
        items: Array.from({ length: 100 }, (_, i) => ({ id: i, label: `R${i}` })),
        rowKey: 'id',
        height: 200,
        virtual: true,
        itemRender: item => <span>{item.label}</span>,
      },
    });
    expect(wrapper.find('.ant-listy-holder').exists()).toBe(true);
    const rows = wrapper.findAll('.ant-listy-item');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(100);
  });

  it('defaults virtual to false and respects ConfigProvider.virtual', () => {
    const items = Array.from({ length: 30 }, (_, i) => ({ id: i, label: `Row-${i}` }));

    const defaultWrapper = mount(Listy, {
      props: { items, rowKey: 'id', height: 200 },
    });
    expect(defaultWrapper.find('.ant-listy-holder').exists()).toBe(false);
    expect(defaultWrapper.findAll('.ant-listy-item').length).toBe(30);

    const cpVirtualWrapper = mount({
      render() {
        return (
          <ConfigProvider virtual={true}>
            <Listy items={items} rowKey="id" height={200} />
          </ConfigProvider>
        );
      },
    });
    expect(cpVirtualWrapper.find('.ant-listy-holder').exists()).toBe(true);
    expect(cpVirtualWrapper.findAll('.ant-listy-item').length).toBeLessThan(30);

    const overrideWrapper = mount({
      render() {
        return (
          <ConfigProvider virtual={false}>
            <Listy items={items} rowKey="id" height={200} virtual={true} />
          </ConfigProvider>
        );
      },
    });
    expect(overrideWrapper.find('.ant-listy-holder').exists()).toBe(true);
  });

  it('applies height, onScroll, and pixel scrollTo in non-virtual mode', async () => {
    const onScroll = jest.fn();
    const items = Array.from({ length: 20 }, (_, i) => ({ id: i, label: `Item-${i}` }));
    const wrapper = mount(Listy, {
      props: {
        items,
        rowKey: 'id',
        height: 200,
        onScroll,
        itemRender: item => <span>{item.label}</span>,
      },
    });

    const rootEl = wrapper.find('.ant-listy').element;
    expect(rootEl.style.height).toBe('200px');
    expect(rootEl.style.overflowY).toBe('auto');

    await wrapper.find('.ant-listy').trigger('scroll');
    expect(onScroll).toHaveBeenCalledTimes(1);

    // Numeric scrollTo scrolls to pixel scrollTop (aligned with antd 6.7.2)
    wrapper.vm.scrollTo(120);
    expect(rootEl.scrollTop).toBe(120);

    // Absolute { top, left }
    wrapper.vm.scrollTo({ top: 80, left: 40 });
    expect(rootEl.scrollTop).toBe(80);
    expect(rootEl.scrollLeft).toBe(40);

    // { key, align } and scrollToIndex backwards compat
    wrapper.vm.scrollTo({ key: 5, align: 'top' });
    expect(rootEl.scrollTop).toBeGreaterThan(0);
    wrapper.vm.scrollToIndex(0);
    expect(rootEl.scrollTop).toBe(0);
  });

  it('scrollTo(number) scrolls to pixel scrollTop in virtual mode', async () => {
    const items = Array.from({ length: 100 }, (_, i) => ({ id: i, label: `V-${i}` }));
    const wrapper = mount(Listy, {
      props: {
        items,
        rowKey: 'id',
        height: 200,
        itemHeight: 40,
        virtual: true,
        itemRender: item => <span>{item.label}</span>,
      },
    });
    const holderEl = wrapper.find('.ant-listy-holder').element;
    wrapper.vm.scrollTo(120);
    await nextTick();
    expect(holderEl.scrollTop).toBe(120);

    wrapper.vm.scrollTo({ top: 200 });
    await nextTick();
    expect(holderEl.scrollTop).toBe(200);
  });

  it('supports group headers, sticky mode, and scrollTo({ groupKey })', async () => {
    const items = [
      { id: 1, group: 'A', label: 'A1' },
      { id: 2, group: 'A', label: 'A2' },
      { id: 3, group: 'B', label: 'B1' },
      { id: 4, group: 'B', label: 'B2' },
    ];
    const wrapper = mount(Listy, {
      props: {
        items,
        rowKey: 'id',
        height: 150,
        sticky: true,
        group: {
          key: item => item.group,
          title: (groupKey, groupItems) => `${groupKey} (${groupItems.length})`,
        },
        itemRender: item => <span>{item.label}</span>,
      },
    });

    const sections = wrapper.findAll('.ant-listy-group-section');
    expect(sections.length).toBe(2);
    const headers = wrapper.findAll('.ant-listy-group-header');
    expect(headers.length).toBe(2);
    expect(headers[0].text()).toBe('A (2)');
    expect(headers[1].text()).toBe('B (2)');
    expect(headers[0].classes()).toContain('ant-listy-group-header-sticky');

    wrapper.vm.scrollTo({ groupKey: 'B', align: 'top' });
    expect(wrapper.find('.ant-listy').element.scrollTop).toBeGreaterThan(0);

    // Virtual grouped sticky mode
    const virtualWrapper = mount(Listy, {
      props: {
        items: Array.from({ length: 40 }, (_, i) => ({
          id: i,
          group: `G${Math.floor(i / 10)}`,
          label: `Item ${i}`,
        })),
        rowKey: 'id',
        height: 200,
        itemHeight: 40,
        virtual: true,
        sticky: true,
        group: {
          key: 'group',
          title: g => `Header ${g}`,
        },
      },
    });
    expect(virtualWrapper.find('.ant-listy-group-header-fixed').exists()).toBe(true);
    expect(virtualWrapper.find('.ant-listy-group-header-fixed').text()).toBe('Header G0');
  });

  it('supports scrollWidth for horizontal scroll', () => {
    const items = Array.from({ length: 20 }, (_, i) => ({ id: i, label: `Wide-${i}` }));
    const wrapper = mount(Listy, {
      props: {
        items,
        rowKey: 'id',
        height: 200,
        scrollWidth: 1000,
        virtual: true,
      },
    });
    const hScroll = wrapper.find('.ant-listy-horizontal-scroll');
    expect(hScroll.exists()).toBe(true);
    expect(hScroll.element.style.overflowX).toBe('auto');
    expect(hScroll.html()).toContain('width: 1000px');

    wrapper.vm.scrollTo({ left: 250 });
    expect(hScroll.element.scrollLeft).toBe(250);
  });

  it('safely derives keys in virtual mode when items lack a .key field', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(Listy, {
      props: {
        items: Array.from({ length: 50 }, (_, i) => ({ label: `NoKey-${i}` })),
        height: 200,
        itemHeight: 40,
        virtual: true,
        itemRender: item => <span>{item.label}</span>,
      },
    });
    const rows = wrapper.findAll('.ant-listy-item');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].text()).toBe('NoKey-0');
    expect(rows[1].text()).toBe('NoKey-1');
    const dupKeyWarns = warnSpy.mock.calls.filter(args =>
      String(args[0]).includes('Duplicate keys'),
    );
    expect(dupKeyWarns.length).toBe(0);
    warnSpy.mockRestore();
  });

  it('supports static & functional semantic classNames/styles, RTL, and rowHoverable=false', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider direction="rtl">
            <Listy
              items={[{ id: 'a', group: 'G1', label: 'A' }]}
              rowKey="id"
              rowHoverable={false}
              rootClassName="my-list"
              group={{ key: 'group', title: g => g }}
              classNames={({ props }) => ({
                root: props.rowHoverable ? 'hover-on' : 'hover-off',
                item: 'fn-item-cls',
                groupHeader: 'fn-header-cls',
              })}
              styles={({ props }) => ({
                root: { padding: props.rowHoverable ? '0px' : '4px' },
                item: { color: 'red' },
                groupHeader: { fontWeight: '700' },
              })}
              itemRender={item => <span>{item.label}</span>}
            />
          </ConfigProvider>
        );
      },
    });
    const root = wrapper.find('.ant-listy');
    expect(root.classes()).toContain('my-list');
    expect(root.classes()).toContain('hover-off');
    expect(root.classes()).toContain('ant-listy-rtl');
    expect(root.classes()).not.toContain('ant-listy-hoverable');
    expect(root.element.style.padding).toBe('4px');
    expect(wrapper.find('.ant-listy-item').classes()).toContain('fn-item-cls');
    expect(wrapper.find('.ant-listy-group-header').classes()).toContain('fn-header-cls');
  });

  it('mounts new listy demos and verifies scrollTo ref in scroll-to demo', async () => {
    const hoverWrapper = mount(RowHoverableDebugDemo, { global: { plugins: demoPlugins } });
    const hoverLists = hoverWrapper.findAll('.ant-listy');
    expect(hoverLists).toHaveLength(2);
    expect(hoverLists[0].classes()).toContain('ant-listy-hoverable');
    expect(hoverLists[1].classes()).not.toContain('ant-listy-hoverable');
    hoverWrapper.unmount();

    const dragWrapper = mount(DragSortingDemo, { global: { plugins: demoPlugins } });
    expect(dragWrapper.findAll('.ant-listy-item').length).toBe(20);
    dragWrapper.unmount();

    const scrollWrapper = mount(ScrollToDemo, { global: { plugins: demoPlugins } });
    const listRoot = scrollWrapper.find('.ant-listy').element;
    const buttons = scrollWrapper.findAll('button');
    const scrollToItemBtn = buttons.find(b => b.text().includes('Scroll to item'));
    const scrollToGroupBtn = buttons.find(b => b.text().includes('Scroll to group'));
    const backToTopBtn = buttons.find(b => b.text().includes('Back to top'));

    expect(scrollToItemBtn).toBeTruthy();
    expect(scrollToGroupBtn).toBeTruthy();
    expect(backToTopBtn).toBeTruthy();

    await scrollToItemBtn.trigger('click');
    expect(listRoot.scrollTop).toBeGreaterThan(0);

    await scrollToGroupBtn.trigger('click');
    expect(listRoot.scrollTop).toBeGreaterThan(0);

    await backToTopBtn.trigger('click');
    expect(listRoot.scrollTop).toBe(0);
    scrollWrapper.unmount();
  });
});
