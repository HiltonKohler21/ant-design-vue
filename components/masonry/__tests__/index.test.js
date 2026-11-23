import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Masonry from '..';
import ConfigProvider from '../../config-provider';

describe('Masonry', () => {
  it('renders items distributed into columns', async () => {
    const onLayoutChange = jest.fn();
    const wrapper = mount(Masonry, {
      props: {
        columns: 2,
        gutter: 10,
        items: [
          { key: 'a', height: 100, data: 'A' },
          { key: 'b', height: 60, data: 'B' },
          { key: 'c', height: 40, data: 'C' },
        ],
        itemRender: ({ data }) => <span>{data}</span>,
        onLayoutChange,
      },
    });
    await new Promise(r => setTimeout(r, 20));

    expect(wrapper.find('.ant-masonry').exists()).toBe(true);
    expect(wrapper.findAll('.ant-masonry-column').length).toBe(2);
    expect(wrapper.findAll('.ant-masonry-item').length).toBe(3);
    expect(wrapper.text()).toContain('A');
    expect(onLayoutChange).toHaveBeenCalled();
    const info = onLayoutChange.mock.calls.at(-1)[0];
    expect(info.map(i => i.key).sort()).toEqual(['a', 'b', 'c']);
    // 每项都有列号
    info.forEach(i => expect(typeof i.column).toBe('number'));
  });

  it('exposes nativeElement via MasonryRef', () => {
    const wrapper = mount(Masonry, {
      props: {
        columns: 2,
        items: [{ key: 'a', data: 'A' }],
        itemRender: ({ data }) => <span>{data}</span>,
      },
    });
    expect(wrapper.vm.nativeElement).toBe(wrapper.find('.ant-masonry').element);
  });

  it('respects item.column override', async () => {
    const wrapper = mount(Masonry, {
      props: {
        columns: 2,
        items: [{ key: 'a', column: 1, data: 'A' }],
        itemRender: ({ data }) => <span>{data}</span>,
      },
    });
    await new Promise(r => setTimeout(r, 20));
    const cols = wrapper.findAll('.ant-masonry-column');
    expect(cols[0].findAll('.ant-masonry-item').length).toBe(0);
    expect(cols[1].findAll('.ant-masonry-item').length).toBe(1);
  });

  it('supports static and functional classNames/styles with ConfigProvider merge', () => {
    const wrapper = mount(Masonry, {
      props: {
        rootClassName: 'my-root',
        classNames: { root: 'root-cls', item: 'item-cls' },
        styles: { root: { padding: '8px' }, item: { color: 'red' } },
        items: [{ key: 'a', data: 'A' }],
        itemRender: ({ data }) => <span>{data}</span>,
      },
    });
    expect(wrapper.classes()).toContain('my-root');
    expect(wrapper.classes()).toContain('root-cls');
    expect(wrapper.find('.ant-masonry-item').classes()).toContain('item-cls');
    expect(wrapper.find('.ant-masonry-item').attributes('style')).toContain('color: red');

    const fnClassNames = jest.fn(({ props }) => ({
      root: `fn-root-${props.columns}`,
      item: `fn-item-${props.columns}`,
    }));
    const fnStyles = jest.fn(({ props }) => ({
      root: { padding: `${props.columns * 4}px` },
      item: { borderWidth: '2px' },
    }));

    const fnWrapper = mount({
      render() {
        return (
          <ConfigProvider
            masonry={{
              classNames: { root: 'ctx-root', item: 'ctx-item' },
              styles: { root: { backgroundColor: 'rgb(1, 2, 3)' } },
            }}
          >
            <Masonry
              columns={3}
              classNames={fnClassNames}
              styles={fnStyles}
              items={[{ key: 'a', data: 'A' }]}
              itemRender={({ data }) => <span>{data}</span>}
            />
          </ConfigProvider>
        );
      },
    });

    expect(fnClassNames).toHaveBeenCalled();
    expect(fnStyles).toHaveBeenCalled();
    const rootEl = fnWrapper.find('.ant-masonry');
    const itemEl = fnWrapper.find('.ant-masonry-item');
    expect(rootEl.classes()).toContain('ctx-root');
    expect(rootEl.classes()).toContain('fn-root-3');
    expect(rootEl.attributes('style')).toContain('padding: 12px');
    expect(rootEl.attributes('style')).toContain('background-color: rgb(1, 2, 3)');
    expect(itemEl.classes()).toContain('ctx-item');
    expect(itemEl.classes()).toContain('fn-item-3');
    expect(itemEl.attributes('style')).toContain('border-width: 2px');
  });

  it('rebalances columns on capture load and error events from descendant images', async () => {
    const onLayoutChange = jest.fn();
    const wrapper = mount(Masonry, {
      props: {
        columns: 2,
        gutter: 10,
        fresh: false,
        items: [
          { key: 'a', height: 50, data: 'a.png' },
          { key: 'b', height: 100, data: 'b.png' },
          { key: 'c', height: 40, data: 'c.png' },
        ],
        itemRender: ({ data }) => <img src={data} alt={data} />,
        onLayoutChange,
      },
    });
    await nextTick();

    // Initially: a(50)->col0, b(100)->col1, c(40)->col0 (since col0 height 60 < col1 height 110)
    const initialInfo = onLayoutChange.mock.calls.at(-1)[0];
    expect(initialInfo.find(i => i.key === 'c').column).toBe(0);

    // Simulate image in item 'a' loading with tall real height (300px)
    const itemA = wrapper.find('[data-masonry-key="a"]').element;
    itemA.getBoundingClientRect = jest.fn(() => ({ height: 300 }));
    const imgA = itemA.querySelector('img');
    imgA.dispatchEvent(new Event('load', { bubbles: false }));
    await nextTick();

    // Now col0 has a(300), col1 has b(100), so c should move to col1!
    const afterLoadInfo = onLayoutChange.mock.calls.at(-1)[0];
    expect(afterLoadInfo.find(i => i.key === 'c').column).toBe(1);

    // Simulate image error shrinking item 'a' back to fallback height (20px)
    itemA.getBoundingClientRect = jest.fn(() => ({ height: 20 }));
    imgA.dispatchEvent(new Event('error', { bubbles: false }));
    await nextTick();

    const afterErrorInfo = onLayoutChange.mock.calls.at(-1)[0];
    expect(afterErrorInfo.find(i => i.key === 'c').column).toBe(0);
  });

  it('controls per-item ResizeObserver via fresh prop and unobserves removed items', async () => {
    const observe = jest.fn();
    const unobserve = jest.fn();
    const disconnect = jest.fn();
    const origRO = global.ResizeObserver;
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe,
      unobserve,
      disconnect,
    }));

    try {
      // fresh: false disables per-item ResizeObserver
      const staticWrapper = mount(Masonry, {
        props: {
          columns: 2,
          fresh: false,
          items: [
            { key: 'a', data: 'A' },
            { key: 'b', data: 'B' },
          ],
          itemRender: ({ data }) => <span>{data}</span>,
        },
      });
      await nextTick();
      expect(observe).not.toHaveBeenCalled();

      // Toggling fresh to true enables ResizeObserver
      await staticWrapper.setProps({ fresh: true });
      await nextTick();
      expect(observe).toHaveBeenCalled();
      staticWrapper.unmount();
      expect(disconnect).toHaveBeenCalled();

      observe.mockClear();
      unobserve.mockClear();
      disconnect.mockClear();

      // Default fresh (true) observes items and unobserves removed items
      const wrapper = mount(Masonry, {
        props: {
          columns: 2,
          items: [
            { key: 'a', data: 'A' },
            { key: 'b', data: 'B' },
          ],
          itemRender: ({ data }) => <span>{data}</span>,
        },
      });
      await nextTick();
      expect(observe).toHaveBeenCalled();

      await wrapper.setProps({
        items: [{ key: 'a', data: 'A' }],
      });
      await nextTick();
      expect(unobserve).toHaveBeenCalledTimes(1);

      wrapper.unmount();
      expect(disconnect).toHaveBeenCalled();
    } finally {
      global.ResizeObserver = origRO;
    }
  });
});
