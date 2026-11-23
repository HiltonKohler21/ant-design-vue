import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Table from '..';
import ConfigProvider from '../../config-provider';

describe('Table virtual, filterOnClose, filterDropdownProps, and ConfigProvider.table', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('virtualizes body rows when virtual=true and scroll.y is set', async () => {
    const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
      { title: 'Name', dataIndex: 'name', key: 'name', width: 200 },
    ];
    const dataSource = Array.from({ length: 100 }, (_, i) => ({
      key: i,
      id: i,
      name: `User ${i}`,
    }));
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        virtual: true,
        pagination: false,
        scroll: { y: 200 },
      },
    });
    await nextTick();

    expect(wrapper.find('.ant-table-virtual').exists()).toBe(true);
    expect(wrapper.find('.ant-table-tbody-virtual').exists()).toBe(true);
    const renderedRows = wrapper.findAll('.ant-table-tbody-virtual .ant-table-row');
    expect(renderedRows.length).toBeGreaterThan(0);
    expect(renderedRows.length).toBeLessThan(100);
    expect(renderedRows[0].text()).toContain('User 0');
  });

  it('respects column.filterOnClose=false and spreads column.filterDropdownProps', async () => {
    const handleChange = jest.fn();
    const handleOpenChange = jest.fn();
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: [
          { text: 'Jack', value: 'Jack' },
          { text: 'Lucy', value: 'Lucy' },
        ],
        onFilter: (value, record) => record.name.includes(value),
        filterOnClose: false,
        filterDropdownProps: {
          overlayClassName: 'custom-filter-overlay',
          onOpenChange: handleOpenChange,
        },
      },
    ];
    const dataSource = [
      { key: 0, name: 'Jack' },
      { key: 1, name: 'Lucy' },
    ];

    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        pagination: false,
        onChange: handleChange,
      },
      attachTo: document.body,
    });
    await nextTick();

    // Open filter dropdown
    await wrapper.find('.ant-dropdown-trigger').trigger('click');
    await nextTick();
    expect(handleOpenChange).toHaveBeenCalledWith(true);

    const dropdownEl = document.body.querySelector('.custom-filter-overlay');
    expect(dropdownEl).toBeTruthy();

    // Select a filter item without clicking OK
    const menuItems = document.body.querySelectorAll('.ant-dropdown-menu-item');
    expect(menuItems.length).toBeGreaterThan(0);
    menuItems[0].click();
    await nextTick();

    // Close dropdown by clicking trigger again — filterOnClose=false must NOT confirm!
    await wrapper.find('.ant-dropdown-trigger').trigger('click');
    await nextTick();
    expect(handleOpenChange).toHaveBeenCalledWith(false);
    expect(handleChange).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('applies ConfigProvider.table expandable.expandIcon, className, and style', async () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            table={{
              className: 'cp-table-cls',
              style: { marginTop: '12px' },
              expandable: {
                expandIcon: () => <span class="cp-expand-icon">+</span>,
              },
            }}
          >
            <Table
              columns={[{ title: 'Name', dataIndex: 'name', key: 'name' }]}
              dataSource={[{ key: '1', name: 'Row 1' }]}
              expandedRowRender={record => <p>{record.name}</p>}
              pagination={false}
            />
          </ConfigProvider>
        );
      },
    });
    await nextTick();

    const tableWrapper = wrapper.find('.ant-table-wrapper');
    expect(tableWrapper.classes()).toContain('cp-table-cls');
    expect(tableWrapper.element.style.marginTop).toBe('12px');
    expect(wrapper.find('.cp-expand-icon').exists()).toBe(true);
  });
});
