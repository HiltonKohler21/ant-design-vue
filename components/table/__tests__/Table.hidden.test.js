import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Table from '..';

describe('Table column.hidden', () => {
  const dataSource = [
    { key: '1', name: 'John', age: 32, address: 'New York', phone: '123456' },
    { key: '2', name: 'Jim', age: 40, address: 'London', phone: '654321' },
  ];

  it('filters out top-level columns with hidden: true from header and body', async () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age', hidden: true },
      { title: 'Address', dataIndex: 'address', key: 'address', hidden: false },
    ];

    const wrapper = mount(Table, {
      props: { columns, dataSource, pagination: false },
    });
    await nextTick();

    const headers = wrapper.findAll('thead th').map(th => th.text());
    expect(headers).toEqual(['Name', 'Address']);

    const firstRowCells = wrapper
      .findAll('tbody tr.ant-table-row')[0]
      .findAll('td')
      .map(td => td.text());
    expect(firstRowCells).toEqual(['John', 'New York']);

    // Dynamically reveal hidden column
    await wrapper.setProps({
      columns: columns.map(col => ({ ...col, hidden: false })),
    });
    await nextTick();
    expect(wrapper.findAll('thead th').map(th => th.text())).toEqual(['Name', 'Age', 'Address']);
  });

  it('filters hidden child columns inside nested column groups and drops empty groups', async () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Personal Info',
        key: 'info',
        children: [
          { title: 'Age', dataIndex: 'age', key: 'age', hidden: true },
          { title: 'Address', dataIndex: 'address', key: 'address' },
        ],
      },
      {
        title: 'Contact Group',
        key: 'contact',
        children: [{ title: 'Phone', dataIndex: 'phone', key: 'phone', hidden: true }],
      },
      {
        title: 'Hidden Group',
        key: 'hiddenGroup',
        hidden: true,
        children: [{ title: 'Extra', dataIndex: 'address', key: 'extra' }],
      },
    ];

    const wrapper = mount(Table, {
      props: { columns, dataSource, pagination: false },
    });
    await nextTick();

    const headerTexts = wrapper.findAll('thead th').map(th => th.text());
    expect(headerTexts).toContain('Name');
    expect(headerTexts).toContain('Personal Info');
    expect(headerTexts).toContain('Address');
    expect(headerTexts).not.toContain('Age');
    expect(headerTexts).not.toContain('Contact Group');
    expect(headerTexts).not.toContain('Phone');
    expect(headerTexts).not.toContain('Hidden Group');
    expect(headerTexts).not.toContain('Extra');

    const firstRowCells = wrapper
      .findAll('tbody tr.ant-table-row')[0]
      .findAll('td')
      .map(td => td.text());
    expect(firstRowCells).toEqual(['John', 'New York']);
  });

  it('supports hidden prop on JSX/template Table.Column and Table.ColumnGroup', async () => {
    const wrapper = mount({
      render() {
        return (
          <Table dataSource={dataSource} pagination={false}>
            <Table.Column title="Name" dataIndex="name" key="name" />
            <Table.Column title="Age" dataIndex="age" key="age" hidden={true} />
            <Table.ColumnGroup title="Details" key="details">
              <Table.Column title="Address" dataIndex="address" key="address" />
              <Table.Column title="Phone" dataIndex="phone" key="phone" hidden={true} />
            </Table.ColumnGroup>
          </Table>
        );
      },
    });
    await nextTick();

    const headerTexts = wrapper.findAll('thead th').map(th => th.text());
    expect(headerTexts).toContain('Name');
    expect(headerTexts).toContain('Details');
    expect(headerTexts).toContain('Address');
    expect(headerTexts).not.toContain('Age');
    expect(headerTexts).not.toContain('Phone');
  });

  it('filters hidden columns in virtual table mode as well', async () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 120 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 80, hidden: true },
      { title: 'Address', dataIndex: 'address', key: 'address', width: 160 },
    ];
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

    expect(wrapper.findAll('thead th').map(th => th.text())).toEqual(['Name', 'Address']);
    const firstRowCells = wrapper
      .findAll('.ant-table-tbody-virtual .ant-table-row')[0]
      .findAll('.ant-table-cell')
      .map(cell => cell.text());
    expect(firstRowCells).toEqual(['John', 'New York']);
  });
});
