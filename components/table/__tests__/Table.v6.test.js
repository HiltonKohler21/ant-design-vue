import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import antd from '../../index';
import Table from '..';
import ConfigProvider from '../../config-provider';

describe('Table v6 parity: semantics, column defaults, expandAll, placement, ConfigProvider', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const baseColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
  ];

  const baseData = [
    { key: '1', name: 'Alice', age: 24, address: 'New York' },
    { key: '2', name: 'Bob', age: 42, address: 'London' },
    { key: '3', name: 'Charlie', age: 32, address: 'Sydney' },
    { key: '4', name: 'Dave', age: 28, address: 'Paris' },
  ];

  it('applies object classNames and styles across all 13 semantic slots', async () => {
    const testClassNames = {
      root: 'test-root',
      section: 'test-section',
      title: 'test-title',
      footer: 'test-footer',
      content: 'test-content',
      header: {
        wrapper: 'test-header-wrapper',
        row: 'test-header-row',
        cell: 'test-header-cell',
      },
      body: {
        wrapper: 'test-body-wrapper',
        row: 'test-body-row',
        cell: 'test-body-cell',
      },
      pagination: {
        root: 'test-pagination-root',
        item: 'test-pagination-item',
      },
    };

    const testStyles = {
      root: { backgroundColor: 'rgb(10, 10, 10)' },
      section: { backgroundColor: 'rgb(20, 20, 20)' },
      title: { backgroundColor: 'rgb(30, 30, 30)' },
      footer: { backgroundColor: 'rgb(40, 40, 40)' },
      content: { backgroundColor: 'rgb(50, 50, 50)' },
      header: {
        wrapper: { backgroundColor: 'rgb(60, 60, 60)' },
        row: { backgroundColor: 'rgb(70, 70, 70)' },
        cell: { backgroundColor: 'rgb(80, 80, 80)' },
      },
      body: {
        wrapper: { backgroundColor: 'rgb(90, 90, 90)' },
        row: { backgroundColor: 'rgb(100, 100, 100)' },
        cell: { backgroundColor: 'rgb(110, 110, 110)' },
      },
      pagination: {
        root: { backgroundColor: 'rgb(120, 120, 120)' },
        item: { backgroundColor: 'rgb(130, 130, 130)' },
      },
    };

    const wrapper = mount(Table, {
      props: {
        columns: baseColumns,
        dataSource: baseData,
        size: 'medium',
        pagination: { pageSize: 2 },
        title: () => 'Table Title',
        footer: () => 'Table Footer',
        classNames: testClassNames,
        styles: testStyles,
      },
    });
    await nextTick();

    const root = wrapper.find('.ant-table-wrapper').element;
    const section = wrapper.find('.ant-table-container').element;
    const title = wrapper.find('.ant-table-title').element;
    const footer = wrapper.find('.ant-table-footer').element;
    const content = wrapper.find('.ant-table-content').element;
    const headerWrapper = wrapper.find('.ant-table-thead').element;
    const headerRow = wrapper.find('.ant-table-thead tr').element;
    const headerCells = wrapper.findAll('.ant-table-thead th.ant-table-cell');
    const bodyWrapper = wrapper.find('.ant-table-tbody').element;
    const bodyRows = wrapper.findAll('.ant-table-tbody tr.ant-table-row');
    const bodyCells = wrapper.findAll('.ant-table-tbody tr.ant-table-row td.ant-table-cell');
    const paginationRoot = wrapper.find('.ant-pagination').element;
    const paginationItem = wrapper.find('.ant-pagination-item').element;

    expect(root.classList.contains('test-root')).toBe(true);
    expect(root.style.backgroundColor).toBe('rgb(10, 10, 10)');
    expect(section.classList.contains('test-section')).toBe(true);
    expect(section.style.backgroundColor).toBe('rgb(20, 20, 20)');
    expect(title.classList.contains('test-title')).toBe(true);
    expect(title.style.backgroundColor).toBe('rgb(30, 30, 30)');
    expect(footer.classList.contains('test-footer')).toBe(true);
    expect(footer.style.backgroundColor).toBe('rgb(40, 40, 40)');
    expect(content.classList.contains('test-content')).toBe(true);
    expect(content.style.backgroundColor).toBe('rgb(50, 50, 50)');

    expect(headerWrapper.classList.contains('test-header-wrapper')).toBe(true);
    expect(headerWrapper.style.backgroundColor).toBe('rgb(60, 60, 60)');
    expect(headerRow.classList.contains('test-header-row')).toBe(true);
    expect(headerRow.style.backgroundColor).toBe('rgb(70, 70, 70)');
    expect(headerCells).toHaveLength(3);
    expect(headerCells[0].element.classList.contains('test-header-cell')).toBe(true);
    expect(headerCells[0].element.style.backgroundColor).toBe('rgb(80, 80, 80)');

    expect(bodyWrapper.classList.contains('test-body-wrapper')).toBe(true);
    expect(bodyWrapper.style.backgroundColor).toBe('rgb(90, 90, 90)');
    expect(bodyRows).toHaveLength(2);
    expect(bodyRows[0].element.classList.contains('test-body-row')).toBe(true);
    expect(bodyRows[0].element.style.backgroundColor).toBe('rgb(100, 100, 100)');
    expect(bodyCells).toHaveLength(6);
    expect(bodyCells[0].element.classList.contains('test-body-cell')).toBe(true);
    expect(bodyCells[0].element.style.backgroundColor).toBe('rgb(110, 110, 110)');

    expect(paginationRoot.classList.contains('test-pagination-root')).toBe(true);
    expect(paginationRoot.style.backgroundColor).toBe('rgb(120, 120, 120)');
    expect(paginationItem.classList.contains('test-pagination-item')).toBe(true);
    expect(paginationItem.style.backgroundColor).toBe('rgb(130, 130, 130)');
  });

  it('supports function classNames/styles and merges ConfigProvider.table semantics', async () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            table={{
              classNames: { root: 'ctx-root', header: 'ctx-header-shorthand' },
              styles: {
                root: { padding: '4px', color: 'rgb(1, 2, 3)' },
                header: { padding: '2px' },
              },
            }}
          >
            <Table
              columns={baseColumns}
              dataSource={baseData}
              bordered
              size="small"
              pagination={{ pageSize: 2 }}
              classNames={info => ({
                root: info.props.bordered ? 'fn-bordered' : 'fn-plain',
                header: { wrapper: info.props.size === 'small' ? 'fn-small-header' : 'fn-lg' },
                body: { wrapper: 'fn-body' },
              })}
              styles={info => ({
                root: { borderWidth: info.props.bordered ? '2px' : '1px' },
                header: { wrapper: { backgroundColor: 'rgb(200, 210, 220)' } },
              })}
            />
          </ConfigProvider>
        );
      },
    });
    await nextTick();

    const root = wrapper.find('.ant-table-wrapper').element;
    const thead = wrapper.find('.ant-table-thead').element;
    const tbody = wrapper.find('.ant-table-tbody').element;

    expect(root.classList.contains('ctx-root')).toBe(true);
    expect(root.classList.contains('fn-bordered')).toBe(true);
    expect(root.style.padding).toBe('4px');
    expect(root.style.borderWidth).toBe('2px');

    expect(thead.classList.contains('ctx-header-shorthand')).toBe(true);
    expect(thead.classList.contains('fn-small-header')).toBe(true);
    expect(thead.style.padding).toBe('2px');
    expect(thead.style.backgroundColor).toBe('rgb(200, 210, 220)');
    expect(tbody.classList.contains('fn-body')).toBe(true);
  });

  it('merges Table pagination semantics with pagination.classNames/styles', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        dataSource: [
          { key: '1', name: 'Bamboo' },
          { key: '2', name: 'Little' },
        ],
        classNames: {
          pagination: {
            root: 'table-pag-root',
            item: 'table-pag-item',
          },
        },
        styles: {
          pagination: {
            root: { backgroundColor: 'rgb(0, 0, 255)', color: 'rgb(0, 0, 0)' },
            item: { backgroundColor: 'rgb(0, 255, 0)', color: 'rgb(0, 0, 0)' },
          },
        },
        pagination: {
          pageSize: 1,
          classNames: {
            root: 'pag-root',
            item: 'pag-item',
          },
          styles: {
            root: { color: 'rgb(255, 0, 0)', borderTopWidth: '1px' },
            item: { color: 'rgb(255, 165, 0)', borderLeftWidth: '2px' },
          },
        },
      },
    });
    await nextTick();

    const pagRoot = wrapper.find('.ant-pagination').element;
    const pagItem = wrapper.find('.ant-pagination-item').element;
    expect(pagRoot.classList.contains('table-pag-root')).toBe(true);
    expect(pagRoot.classList.contains('pag-root')).toBe(true);
    expect(pagRoot.style.backgroundColor).toBe('rgb(0, 0, 255)');
    expect(pagRoot.style.color).toBe('rgb(0, 0, 0)');
    expect(pagRoot.style.borderTopWidth).toBe('1px');

    expect(pagItem.classList.contains('table-pag-item')).toBe(true);
    expect(pagItem.classList.contains('pag-item')).toBe(true);
    expect(pagItem.style.backgroundColor).toBe('rgb(0, 255, 0)');
    expect(pagItem.style.color).toBe('rgb(0, 0, 0)');
    expect(pagItem.style.borderLeftWidth).toBe('2px');
  });

  it('supports shared column defaults with per-column overrides and special columns', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name' },
          Table.EXPAND_COLUMN,
          {
            title: 'Info',
            children: [{ title: 'Age', dataIndex: 'age', align: 'right' }],
          },
          Table.SELECTION_COLUMN,
        ],
        dataSource: [{ key: '1', name: 'Jack', age: 20 }],
        column: { align: 'center', ellipsis: true },
        expandable: { expandedRowRender: () => null },
        rowSelection: {},
        pagination: false,
      },
    });
    await nextTick();

    const cells = wrapper.findAll('tbody tr.ant-table-row td');
    expect(cells).toHaveLength(4);
    expect(cells[0].element.style.textAlign).toBe('center');
    expect(cells[0].classes()).toContain('ant-table-cell-ellipsis');
    expect(cells[1].find('.ant-table-row-expand-icon').exists()).toBe(true);
    expect(cells[2].element.style.textAlign).toBe('right');
    expect(cells[3].find('.ant-checkbox-input').exists()).toBe(true);
  });

  it('supports expandable.showExpandAll and onExpandAll', async () => {
    const onExpandAll = jest.fn();
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        dataSource: [
          { key: '1', name: 'Row 1', desc: 'Desc 1' },
          { key: '2', name: 'Skip', desc: 'Desc 2' },
          { key: '3', name: 'Row 3', desc: 'Desc 3' },
        ],
        pagination: false,
        expandable: {
          showExpandAll: true,
          onExpandAll,
          rowExpandable: record => record.name !== 'Skip',
          expandedRowRender: ({ record }) => <p class="expanded-desc">{record.desc}</p>,
        },
      },
    });
    await nextTick();

    const headerExpandBtn = wrapper.find('thead .ant-table-row-expand-icon');
    expect(headerExpandBtn.exists()).toBe(true);
    expect(wrapper.findAll('.expanded-desc')).toHaveLength(0);

    await headerExpandBtn.trigger('click');
    await nextTick();
    expect(onExpandAll).toHaveBeenCalledWith(true);
    expect(wrapper.findAll('.expanded-desc')).toHaveLength(2);

    await wrapper.find('thead .ant-table-row-expand-icon').trigger('click');
    await nextTick();
    expect(onExpandAll).toHaveBeenCalledWith(false);
    expect(wrapper.findAll('tr.ant-table-expanded-row[style*="display: none"]')).toHaveLength(2);
  });

  it('supports pagination.placement, fixed start/end, ConfigProvider rowKey, and nativeElement ref', async () => {
    const tblRef = ref();
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider table={{ rowKey: 'uid' }}>
            <Table
              ref={tblRef}
              columns={[
                { title: 'Name', dataIndex: 'name', fixed: 'start', width: 100 },
                { title: 'Age', dataIndex: 'age', fixed: 'end', width: 100 },
              ]}
              dataSource={[
                { uid: 'u-1', name: 'Alice', age: 24 },
                { uid: 'u-2', name: 'Bob', age: 30 },
              ]}
              scroll={{ x: 600 }}
              pagination={{ placement: ['topStart', 'bottomEnd'], pageSize: 1 }}
              rowHoverable={false}
            />
          </ConfigProvider>
        );
      },
    });
    await nextTick();

    expect(wrapper.find('.ant-table-row').attributes('data-row-key')).toBe('u-1');
    expect(wrapper.find('.ant-table-pagination-start').exists()).toBe(true);
    expect(wrapper.find('.ant-table-pagination-end').exists()).toBe(true);
    expect(wrapper.find('.ant-table-row-hover-disabled').exists()).toBe(true);
    expect(wrapper.find('.ant-table-cell-fix-left').exists()).toBe(true);
    expect(wrapper.find('.ant-table-cell-fix-right').exists()).toBe(true);
    expect(tblRef.value?.nativeElement).toBe(wrapper.find('.ant-table-wrapper').element);
    expect(typeof tblRef.value?.scrollTo).toBe('function');
  });

  it('does not leak parent semantic cell/row classes into nested child tables', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        dataSource: [{ key: '1', name: 'Parent' }],
        pagination: false,
        defaultExpandAllRows: true,
        classNames: {
          section: 'parent-section',
          header: { cell: 'parent-th' },
          body: { row: 'parent-tr', cell: 'parent-td' },
        },
        expandedRowRender: () => (
          <Table
            columns={[{ title: 'Child', dataIndex: 'name' }]}
            dataSource={[{ key: 'c1', name: 'Child Row' }]}
            pagination={false}
          />
        ),
      },
    });
    await nextTick();

    expect(wrapper.findAll('.parent-section')).toHaveLength(1);
    expect(wrapper.findAll('.parent-th')).toHaveLength(2); // expand col + Name col on parent only
    expect(wrapper.findAll('.parent-tr')).toHaveLength(1);
    expect(wrapper.findAll('.parent-td')).toHaveLength(2);
  });

  it('mounts all 23 newly added demos without errors', async () => {
    const newDemos = [
      'style-class',
      'jsx',
      'expand-all',
      'auto-height',
      'fixed-gapped-columns',
      'drag-sorting',
      'drag-column-sorting',
      'drag-sorting-handler',
      'column-defaults',
      'ellipsis-custom-tooltip',
      'custom-empty',
      'pagination',
      'dynamic-settings',
      'row-selection-debug',
      'narrow',
      'expand-sticky',
      'tree-table-ellipsis',
      'tree-table-preserveSelectedRowKeys',
      'nest-table-border-debug',
      'nested-table-in-tabs-debug',
      'row-selection-custom-debug',
      'selections-debug',
      'measure-row-render',
    ];

    for (const name of newDemos) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require(`../demo/${name}.vue`);
      const DemoComp = mod.default || mod;
      const wrapper = mount(DemoComp, {
        global: { plugins: [antd] },
        attachTo: document.body,
      });
      await nextTick();
      expect(wrapper.find('.ant-table').exists()).toBe(true);
      wrapper.unmount();
      document.body.innerHTML = '';
    }
  });
});
