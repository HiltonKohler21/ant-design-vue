import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
import Table from '..';

describe('Table column resize performance & virtual table ERP features', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('does not re-render body cells on non-fixed column width change (in-place and immutable)', async () => {
    const bodyRenderCalls = [];
    const slotRenderCalls = [];

    const Demo = defineComponent({
      components: { ATable: Table },
      setup() {
        const columns = ref([
          {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            fixed: 'left',
            resizable: true,
          },
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 160,
            resizable: true,
            sorter: true,
            sortOrder: null,
            customRender: ({ text, record }) => {
              bodyRenderCalls.push(record.key);
              return text;
            },
          },
          {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
            width: 180,
            resizable: true,
          },
          {
            title: 'Action',
            key: 'action',
            width: 100,
            fixed: 'right',
          },
        ]);
        const scrollX = ref(1200);
        const dataSource = ref(
          Array.from({ length: 30 }, (_, i) => ({
            key: i,
            id: i,
            name: `Item ${i}`,
            sku: `SKU-${i}`,
          })),
        );
        const onSlotRender = key => {
          slotRenderCalls.push(key);
          return `slot-${key}`;
        };
        return { columns, scrollX, dataSource, onSlotRender };
      },
      template: `
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :scroll="{ x: scrollX }"
          :pagination="false"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'sku'">
              <span>{{ onSlotRender(record.key) }}</span>
            </template>
          </template>
        </a-table>
      `,
    });

    const wrapper = mount(Demo, { attachTo: document.body });
    await nextTick();
    await nextTick();

    expect(bodyRenderCalls.length).toBe(30);
    expect(slotRenderCalls.length).toBe(30);

    // 1. In-place width mutation (standard @resize-column handler)
    bodyRenderCalls.length = 0;
    slotRenderCalls.length = 0;
    wrapper.vm.columns[2].width = 260;
    await nextTick();
    await nextTick();

    expect(bodyRenderCalls.length).toBe(0);
    expect(slotRenderCalls.length).toBe(0);
    const cols1 = wrapper.findAll('colgroup col');
    expect(cols1[2].attributes('style')).toContain('width: 260px');

    // 2. Immutable columns array replacement + scroll.x change (s-table pattern)
    bodyRenderCalls.length = 0;
    slotRenderCalls.length = 0;
    wrapper.vm.columns = wrapper.vm.columns.map(col =>
      col.key === 'name' ? { ...col, width: 240 } : { ...col },
    );
    wrapper.vm.scrollX = 1280;
    await nextTick();
    await nextTick();

    expect(bodyRenderCalls.length).toBe(0);
    expect(slotRenderCalls.length).toBe(0);
    const cols2 = wrapper.findAll('colgroup col');
    expect(cols2[1].attributes('style')).toContain('width: 240px');

    // 3. Genuine non-width column change (align / sortOrder) MUST still update body
    bodyRenderCalls.length = 0;
    wrapper.vm.columns = wrapper.vm.columns.map(col =>
      col.key === 'name' ? { ...col, align: 'right', sortOrder: 'ascend' } : { ...col },
    );
    await nextTick();
    await nextTick();

    expect(bodyRenderCalls.length).toBe(30);
    const firstNameCell = wrapper.findAll('tbody tr.ant-table-row')[0].findAll('td')[1];
    expect(firstNameCell.classes()).toContain('ant-table-column-sort');
    expect(firstNameCell.attributes('style')).toContain('text-align: right');

    wrapper.unmount();
  });

  it('keeps rowSelection and expandable functional without re-rendering unrelated body cells on width resize', async () => {
    const customRenderCalls = [];
    const selectedRowKeys = ref(['0']);
    const expandedRowKeys = ref([]);
    const columns = ref([
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        customRender: ({ text, record }) => {
          customRenderCalls.push(record.key);
          return text;
        },
      },
      { title: 'Note', dataIndex: 'note', key: 'note', width: 200 },
    ]);
    const dataSource = ref([
      { key: '0', name: 'Alpha', note: 'N0' },
      { key: '1', name: 'Beta', note: 'N1' },
      { key: '2', name: 'Gamma', note: 'N2' },
    ]);

    const Demo = defineComponent({
      components: { ATable: Table },
      setup() {
        const rowSelection = {
          selectedRowKeys,
          onChange: keys => {
            selectedRowKeys.value = keys;
          },
        };
        const expandedRowRender = ({ record }) => `Expanded: ${record.name}`;
        return {
          columns,
          dataSource,
          rowSelection,
          expandedRowKeys,
          expandedRowRender,
        };
      },
      template: `
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :row-selection="rowSelection"
          :expanded-row-keys="expandedRowKeys"
          :expanded-row-render="expandedRowRender"
          :pagination="false"
        />
      `,
    });

    const wrapper = mount(Demo, { attachTo: document.body });
    await nextTick();
    await nextTick();

    expect(customRenderCalls.length).toBe(3);

    // Resize Note column -> Name cells must not re-render
    customRenderCalls.length = 0;
    columns.value = columns.value.map(c => (c.key === 'note' ? { ...c, width: 320 } : { ...c }));
    await nextTick();
    await nextTick();
    expect(customRenderCalls.length).toBe(0);

    // Toggle row selection -> checkbox state must update
    selectedRowKeys.value = ['0', '1'];
    await nextTick();
    await nextTick();
    const checkboxes = wrapper.findAll('tbody .ant-checkbox-input');
    expect(checkboxes[0].element.checked).toBe(true);
    expect(checkboxes[1].element.checked).toBe(true);
    expect(checkboxes[2].element.checked).toBe(false);

    // Expand row 1 -> expanded row content must appear
    expandedRowKeys.value = ['1'];
    await nextTick();
    await nextTick();
    expect(wrapper.find('.ant-table-expanded-row').text()).toContain('Expanded: Beta');

    wrapper.unmount();
  });

  it('supports horizontal scroll, fixed sticky columns, ellipsis, and exact widths in virtual mode', async () => {
    const columns = ref([
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        width: 120,
        fixed: 'left',
        ellipsis: true,
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: 240,
        ellipsis: true,
      },
      {
        title: 'Desc',
        dataIndex: 'desc',
        key: 'desc',
        width: 400,
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: 100,
        fixed: 'right',
      },
    ]);
    const dataSource = Array.from({ length: 120 }, (_, i) => ({
      key: i,
      code: `CODE-${i}`,
      title: `Long product title ${i}`,
      desc: `Description ${i}`,
      action: 'Detail',
    }));

    const wrapper = mount(Table, {
      props: {
        columns: columns.value,
        dataSource,
        virtual: true,
        pagination: false,
        scroll: { x: 1000, y: 240 },
      },
      attachTo: document.body,
    });
    await nextTick();
    await nextTick();

    const rows = wrapper.findAll('.ant-table-tbody-virtual .ant-table-row');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(120);

    const holder = wrapper.find('.ant-table-tbody-virtual-holder');
    expect(holder.attributes('style')).toContain('overflow-x: auto');

    const firstRowCells = rows[0].findAll('.ant-table-cell');
    expect(firstRowCells.length).toBe(4);

    // Exact fixed widths when scroll.x is set
    expect(firstRowCells[0].attributes('style')).toContain('flex: 0 0 120px');
    expect(firstRowCells[0].attributes('style')).toContain('width: 120px');
    expect(firstRowCells[1].attributes('style')).toContain('flex: 0 0 240px');

    // Fixed left & fixed right classes + sticky offsets
    expect(firstRowCells[0].classes()).toContain('ant-table-cell-fix-left');
    expect(firstRowCells[0].classes()).toContain('ant-table-cell-fix-left-last');
    expect(firstRowCells[0].classes()).toContain('ant-table-cell-ellipsis');
    expect(firstRowCells[0].attributes('style')).toContain('position: sticky');
    expect(firstRowCells[0].attributes('style')).toContain('left: 0px');
    expect(firstRowCells[0].find('.ant-table-cell-content').exists()).toBe(true);

    expect(firstRowCells[1].classes()).toContain('ant-table-cell-ellipsis');
    expect(firstRowCells[1].attributes('title')).toBe('Long product title 0');

    expect(firstRowCells[3].classes()).toContain('ant-table-cell-fix-right');
    expect(firstRowCells[3].classes()).toContain('ant-table-cell-fix-right-first');
    expect(firstRowCells[3].attributes('style')).toContain('position: sticky');
    expect(firstRowCells[3].attributes('style')).toContain('right: 0px');

    wrapper.unmount();
  });

  it('defers #headerCell slot invocation to render phase without Vue slot warnings and keeps resize handle inside header cell', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      const tag = ref('Initial');
      const Demo = defineComponent({
        components: { ATable: Table },
        setup() {
          const columns = ref([
            {
              title: 'Code',
              dataIndex: 'code',
              key: 'code',
              width: 120,
              resizable: true,
              ellipsis: true,
            },
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              width: 180,
              resizable: true,
              ellipsis: true,
            },
          ]);
          const dataSource = ref([{ key: '1', code: 'C1', name: 'Item 1' }]);
          return { columns, dataSource, tag };
        },
        template: `
          <a-table :columns="columns" :data-source="dataSource" :pagination="false">
            <template #headerCell="{ column }">
              <span v-if="column.key === 'name'" class="custom-header-cell">
                {{ column.title }}-{{ tag }}
              </span>
            </template>
          </a-table>
        `,
      });

      const wrapper = mount(Demo, { attachTo: document.body });
      await nextTick();
      await nextTick();

      const customHeader = wrapper.find('.custom-header-cell');
      expect(customHeader.exists()).toBe(true);
      expect(customHeader.text()).toBe('Name-Initial');

      tag.value = 'Updated';
      await nextTick();
      await nextTick();
      expect(wrapper.find('.custom-header-cell').text()).toBe('Name-Updated');

      const vueSlotWarnings = warnSpy.mock.calls
        .map(args => args.join(' '))
        .filter(
          msg => msg.includes('[Vue warn]') || msg.includes('outside of the render function'),
        );
      expect(vueSlotWarnings).toEqual([]);

      const resizeStyles = Array.from(document.head.querySelectorAll('style'))
        .map(s => s.textContent || '')
        .join('\n');
      expect(resizeStyles).toContain('ant-table-resize-handle');
      expect(resizeStyles).toContain('right:0');
      expect(resizeStyles).not.toContain('right:-8px');

      wrapper.unmount();
    } finally {
      warnSpy.mockRestore();
    }
  });
});
