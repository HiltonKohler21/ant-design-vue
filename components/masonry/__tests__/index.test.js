import { mount } from '@vue/test-utils';
import Masonry from '..';

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

  it('supports classNames/styles/rootClassName', () => {
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
  });
});
