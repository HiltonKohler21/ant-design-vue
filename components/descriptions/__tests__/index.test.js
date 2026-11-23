import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import MockDate from 'mockdate';
import Descriptions from '..';
import ConfigProvider from '../../config-provider';
import { resetWarned } from '../../_util/warning';
import { asyncExpect } from '../../../tests/utils';

describe('Descriptions', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    MockDate.reset();
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it('when typeof column is object', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Descriptions ref="descriptions" column={{ xs: 8, sm: 16, md: 24 }}>
              <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
              <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
              <Descriptions.Item label="time">18:00:00</Descriptions.Item>
              <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
            </Descriptions>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(() => {
      expect(
        wrapper.findAll('td').reduce((total, td) => total + parseInt(td.attributes().colspan), 0),
      ).toBe(8);
    }, 100);
    wrapper.unmount();
  });

  it('column is number', () => {
    // eslint-disable-next-line global-require
    const wrapper = mount({
      render() {
        return (
          <Descriptions column={3}>
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
            <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
            <Descriptions.Item label="time">18:00:00</Descriptions.Item>
            <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('warning if ecceed the row span', () => {
    resetWarned();

    mount({
      render() {
        return (
          <Descriptions column={3}>
            <Descriptions.Item label="Product" span={2}>
              Cloud Database
            </Descriptions.Item>
            <Descriptions.Item label="Billing" span={2}>
              Prepaid
            </Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antdv: Descriptions] Sum of column `span` in a line not match `column` of Descriptions.',
    );
  });

  it('when item is rendered conditionally', () => {
    const hasDiscount = false;
    const wrapper = mount({
      render() {
        return (
          <Descriptions>
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
            <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
            <Descriptions.Item label="time">18:00:00</Descriptions.Item>
            <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
            {hasDiscount && <Descriptions.Item label="Discount">$20.00</Descriptions.Item>}
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('vertical layout', () => {
    // eslint-disable-next-line global-require
    const wrapper = mount({
      render() {
        return (
          <Descriptions layout="vertical">
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
            <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
            <Descriptions.Item label="time">18:00:00</Descriptions.Item>
            <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('Descriptions.Item support className', () => {
    const wrapper = mount({
      render() {
        return (
          <Descriptions>
            <Descriptions.Item label="Product" class="my-class">
              Cloud Database
            </Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('Descriptions support colon', () => {
    const wrapper = mount({
      render() {
        return (
          <Descriptions colon={false}>
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('Descriptions support style', () => {
    const wrapper = mount({
      render() {
        return (
          <Descriptions style={{ backgroundColor: '#e8e8e8' }}>
            <Descriptions.Item>Cloud Database</Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('when max-width: 575px，column=1', async () => {
    // eslint-disable-next-line global-require
    const wrapper = mount(
      {
        render() {
          return (
            <Descriptions>
              <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
              <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
              <Descriptions.Item label="time">18:00:00</Descriptions.Item>
              <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
              <Descriptions.Item>No-Label</Descriptions.Item>
            </Descriptions>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(() => {
      expect(wrapper.findAll('tr')).toHaveLength(5);
      expect(wrapper.findAll('.ant-descriptions-item-label')).toHaveLength(4);
    });

    wrapper.unmount();
  });

  it('when max-width: 575px，column=2', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Descriptions column={{ xs: 2 }}>
              <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
              <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
              <Descriptions.Item label="time">18:00:00</Descriptions.Item>
              <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
            </Descriptions>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(() => {
      expect(wrapper.findAll('tr')).toHaveLength(2);
    });
    wrapper.unmount();
  });

  it('columns 5 with customize', () => {
    const wrapper = mount({
      render() {
        return (
          <Descriptions layout="vertical" column={4}>
            {/* 1 1 1 1 */}
            <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
            <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
            <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
            <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
            {/* 2 2 */}
            <Descriptions.Item label="bamboo" span={2}>
              bamboo
            </Descriptions.Item>
            <Descriptions.Item label="bamboo" span={2}>
              bamboo
            </Descriptions.Item>
            {/* 3 1 */}
            <Descriptions.Item label="bamboo" span={3}>
              bamboo
            </Descriptions.Item>
            <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
          </Descriptions>
        );
      },
    });

    function matchSpan(rowIndex, spans) {
      const tr = wrapper.findAll('tr')[rowIndex];
      const tds = tr.findAll('th');
      expect(tds.length).toEqual(spans.length);
      tds.forEach((td, index) => {
        expect(parseInt(td.attributes().colspan)).toEqual(spans[index]);
      });
    }

    matchSpan(0, [1, 1, 1, 1]);
    matchSpan(2, [2, 2]);
    matchSpan(4, [3, 1]);
  });

  it('number value should render correct', () => {
    const wrapper = mount({
      render() {
        return (
          <Descriptions bordered>
            <Descriptions.Item label={0}>{0}</Descriptions.Item>
          </Descriptions>
        );
      },
    });

    expect(wrapper.find('th').classes()).toContain('ant-descriptions-item-label');
    expect(wrapper.find('td').classes()).toContain('ant-descriptions-item-content');
  });

  it('Descriptions support extra', async () => {
    const wrapper = mount(Descriptions, {
      props: {
        extra: 'Edit',
      },
      slots: {
        default: h(
          Descriptions.Item,
          {
            label: 'UserName',
          },
          'Zhou Maomao',
        ),
      },
    });

    await asyncExpect(() => {
      expect(wrapper.find('.ant-descriptions-extra').exists()).toBe(true);
    });

    wrapper.setProps({ extra: undefined });

    await asyncExpect(() => {
      expect(wrapper.find('.ant-descriptions-extra').exists()).toBe(false);
    });
  });

  it('classNames.label / content and styles.label / content work in non-bordered and bordered layouts', () => {
    const wrapper = mount({
      render() {
        return (
          <Descriptions
            labelStyle={{ fontWeight: 'bold' }}
            contentStyle={{ fontStyle: 'italic' }}
            classNames={{ label: 'sem-label', content: 'sem-content' }}
            styles={{
              label: { color: 'rgb(1, 2, 3)' },
              content: { color: 'rgb(4, 5, 6)' },
            }}
          >
            <Descriptions.Item
              label="UserName"
              classNames={{ label: 'item-label', content: 'item-content' }}
              styles={{ label: { paddingLeft: '2px' }, content: { paddingRight: '3px' } }}
            >
              Zhou Maomao
            </Descriptions.Item>
          </Descriptions>
        );
      },
    });
    const labelEl = wrapper.find('.ant-descriptions-item-label');
    const contentEl = wrapper.find('.ant-descriptions-item-content');
    expect(labelEl.classes()).toContain('sem-label');
    expect(labelEl.classes()).toContain('item-label');
    expect(labelEl.element.style.fontWeight).toBe('bold');
    expect(labelEl.element.style.color).toBe('rgb(1, 2, 3)');
    expect(labelEl.element.style.paddingLeft).toBe('2px');
    expect(contentEl.classes()).toContain('sem-content');
    expect(contentEl.classes()).toContain('item-content');
    expect(contentEl.element.style.fontStyle).toBe('italic');
    expect(contentEl.element.style.color).toBe('rgb(4, 5, 6)');
    expect(contentEl.element.style.paddingRight).toBe('3px');

    const borderedWrapper = mount({
      render() {
        return (
          <Descriptions
            bordered
            classNames={{ label: 'b-label', content: 'b-content' }}
            styles={{
              label: { backgroundColor: 'rgb(10, 20, 30)' },
              content: { backgroundColor: 'rgb(40, 50, 60)' },
            }}
          >
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
          </Descriptions>
        );
      },
    });
    const th = borderedWrapper.find('th.ant-descriptions-item-label');
    const td = borderedWrapper.find('td.ant-descriptions-item-content');
    expect(th.classes()).toContain('b-label');
    expect(th.element.style.backgroundColor).toBe('rgb(10, 20, 30)');
    expect(td.classes()).toContain('b-content');
    expect(td.element.style.backgroundColor).toBe('rgb(40, 50, 60)');

    const verticalBordered = mount({
      render() {
        return (
          <Descriptions
            bordered
            layout="vertical"
            classNames={{ label: 'vb-label', content: 'vb-content' }}
            styles={{
              label: { color: 'rgb(7, 8, 9)' },
              content: { color: 'rgb(10, 11, 12)' },
            }}
          >
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
          </Descriptions>
        );
      },
    });
    const vTh = verticalBordered.find('th.ant-descriptions-item-label');
    const vTd = verticalBordered.find('td.ant-descriptions-item-content');
    expect(vTh.classes()).toContain('vb-label');
    expect(vTh.element.style.color).toBe('rgb(7, 8, 9)');
    expect(vTd.classes()).toContain('vb-content');
    expect(vTd.element.style.color).toBe('rgb(10, 11, 12)');
  });

  it('ConfigProvider.descriptions className / style / classNames / styles', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            descriptions={{
              className: 'cp-desc',
              style: { marginTop: '8px' },
              classNames: { label: 'cp-label', content: 'cp-content', title: 'cp-title' },
              styles: {
                label: { color: 'rgb(100, 0, 0)' },
                content: { color: 'rgb(0, 100, 0)' },
              },
            }}
          >
            <Descriptions title="Info">
              <Descriptions.Item label="Name">Alice</Descriptions.Item>
            </Descriptions>
          </ConfigProvider>
        );
      },
    });
    const root = wrapper.find('.ant-descriptions');
    expect(root.classes()).toContain('cp-desc');
    expect(root.element.style.marginTop).toBe('8px');
    expect(wrapper.find('.ant-descriptions-title').classes()).toContain('cp-title');
    expect(wrapper.find('.ant-descriptions-item-label').classes()).toContain('cp-label');
    expect(wrapper.find('.ant-descriptions-item-label').element.style.color).toBe('rgb(100, 0, 0)');
    expect(wrapper.find('.ant-descriptions-item-content').classes()).toContain('cp-content');
    expect(wrapper.find('.ant-descriptions-item-content').element.style.color).toBe(
      'rgb(0, 100, 0)',
    );
  });

  describe('items prop', () => {
    it('renders config-driven items with label, children, span, class, style, labelStyle, contentStyle', () => {
      const wrapper = mount(Descriptions, {
        props: {
          title: 'User Info',
          column: 3,
          items: [
            {
              key: '1',
              label: 'UserName',
              children: 'Zhou Maomao',
              class: 'user-item',
              style: { backgroundColor: 'rgb(240, 240, 240)' },
              labelStyle: { fontWeight: 'bold' },
              contentStyle: { color: 'rgb(1, 2, 3)' },
            },
            {
              key: '2',
              label: 'Telephone',
              children: '1810000000',
              span: 2,
            },
            {
              key: '3',
              label: 'Address',
              children: 'Hangzhou, Zhejiang',
            },
          ],
        },
      });

      const rows = wrapper.findAll('tr.ant-descriptions-row');
      expect(rows).toHaveLength(2);
      const firstRowCells = rows[0].findAll('td');
      expect(firstRowCells).toHaveLength(2);
      expect(firstRowCells[0].classes()).toContain('user-item');
      expect(firstRowCells[0].attributes('colspan')).toBe('1');
      expect(firstRowCells[0].element.style.backgroundColor).toBe('rgb(240, 240, 240)');
      expect(firstRowCells[0].find('.ant-descriptions-item-label').element.style.fontWeight).toBe(
        'bold',
      );
      expect(firstRowCells[0].find('.ant-descriptions-item-content').element.style.color).toBe(
        'rgb(1, 2, 3)',
      );
      expect(firstRowCells[1].attributes('colspan')).toBe('2');

      const secondRowCells = rows[1].findAll('td');
      expect(secondRowCells).toHaveLength(1);
      expect(secondRowCells[0].attributes('colspan')).toBe('3');
      expect(secondRowCells[0].find('.ant-descriptions-item-content').text()).toBe(
        'Hangzhou, Zhejiang',
      );
    });

    it('supports span="filled" to fill remaining columns of the current row', () => {
      const wrapper = mount(Descriptions, {
        props: {
          column: 3,
          items: [
            { key: '1', label: 'A', children: '1', span: 1 },
            { key: '2', label: 'B', children: '2', span: 'filled' },
            { key: '3', label: 'C', children: '3' },
          ],
        },
      });

      const rows = wrapper.findAll('tr.ant-descriptions-row');
      expect(rows).toHaveLength(2);
      const row0Tds = rows[0].findAll('td');
      expect(row0Tds).toHaveLength(2);
      expect(row0Tds[0].attributes('colspan')).toBe('1');
      expect(row0Tds[1].attributes('colspan')).toBe('2');

      const row1Tds = rows[1].findAll('td');
      expect(row1Tds).toHaveLength(1);
      expect(row1Tds[0].attributes('colspan')).toBe('3');
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it('supports responsive span object on items', async () => {
      const wrapper = mount(Descriptions, {
        props: {
          column: 4,
          items: [
            { key: '1', label: 'A', children: '1', span: { xs: 2, sm: 3, md: 4 } },
            { key: '2', label: 'B', children: '2' },
          ],
        },
        attachTo: 'body',
      });

      await asyncExpect(() => {
        const tds = wrapper.findAll('td');
        expect(tds).toHaveLength(2);
        // In jsdom matchMedia defaults to xs matching
        expect(parseInt(tds[0].attributes('colspan'), 10)).toBe(2);
        expect(parseInt(tds[1].attributes('colspan'), 10)).toBe(2);
      }, 50);

      wrapper.unmount();
    });

    it('supports items with bordered and vertical layouts', () => {
      const wrapper = mount(Descriptions, {
        props: {
          bordered: true,
          layout: 'vertical',
          column: 2,
          items: [
            { key: '1', label: 'Product', children: 'Cloud Database' },
            { key: '2', label: 'Billing', children: 'Prepaid' },
          ],
        },
      });

      const rows = wrapper.findAll('tr.ant-descriptions-row');
      expect(rows).toHaveLength(2);
      expect(rows[0].findAll('th.ant-descriptions-item-label')).toHaveLength(2);
      expect(rows[1].findAll('td.ant-descriptions-item-content')).toHaveLength(2);
    });

    it('generates valid cssVar styles and component tokens without illegal CSS', async () => {
      document.head.innerHTML = '';
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider
              theme={{
                cssVar: true,
                components: {
                  Descriptions: {
                    labelBg: '#fafafa',
                    itemPaddingEnd: 20,
                  },
                },
              }}
            >
              <Descriptions
                bordered
                title="Info"
                extra="More"
                items={[{ key: '1', label: 'L', children: 'C' }]}
              />
            </ConfigProvider>
          );
        },
      });
      await nextTick();
      const css = Array.from(document.querySelectorAll('style'))
        .map(s => s.innerHTML)
        .join('\n');
      expect(css).toContain('--ant-descriptions-label-bg:#fafafa');
      expect(css).toContain('--ant-descriptions-item-padding-end:20px');
      expect(css).not.toMatch(/NaN|undefined|\[object Object\]/);
      expect(css).not.toMatch(/(?<![\w)])-var\(--ant-/);
      expect(css).not.toMatch(/var\(--ant-[a-z0-9-]+\)(?=[A-Za-z0-9.-]+)/);
      wrapper.unmount();
    });
  });
});
