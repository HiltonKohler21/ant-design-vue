import { mount } from '@vue/test-utils';
import Listy from '..';

describe('Listy', () => {
  it('renders rows with itemRender', () => {
    const wrapper = mount(Listy, {
      props: {
        data: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }],
        itemRender: item => <span>{item.label}</span>,
      },
    });
    expect(wrapper.findAll('.ant-listy-item').length).toBe(2);
    expect(wrapper.text()).toContain('A');
    expect(wrapper.find('.ant-listy').classes()).toContain('ant-listy-hoverable');
  });

  it('enables virtual list when height + itemHeight provided', () => {
    const wrapper = mount(Listy, {
      props: {
        data: Array.from({ length: 100 }, (_, i) => ({ key: i, label: `R${i}` })),
        height: 200,
        itemHeight: 40,
        itemRender: item => <span>{item.label}</span>,
      },
    });
    // 虚拟列表只渲染可视区域附近的行
    const rows = wrapper.findAll('.ant-listy-item');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(100);
  });

  it('supports semantic classNames/styles and rowHoverable=false', () => {
    const wrapper = mount(Listy, {
      props: {
        data: [{ key: 'a', label: 'A' }],
        rowHoverable: false,
        rootClassName: 'my-list',
        classNames: { root: 'root-cls', item: 'item-cls' },
        styles: { root: { padding: '4px' }, item: { color: 'red' } },
        itemRender: item => <span>{item.label}</span>,
      },
    });
    expect(wrapper.classes()).toContain('my-list');
    expect(wrapper.classes()).toContain('root-cls');
    expect(wrapper.classes()).not.toContain('ant-listy-hoverable');
    expect(wrapper.find('.ant-listy-item').classes()).toContain('item-cls');
  });
});
