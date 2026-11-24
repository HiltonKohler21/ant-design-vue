import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TimeLine from '..';
import Radio from '../../radio';
import Flex from '../../flex';
import Divider from '../../divider';
import ConfigProvider from '../../config-provider';
import mountTest from '../../../tests/shared/mountTest';
import VariantDemo from '../demo/variant.vue';
import HorizontalDemo from '../demo/horizontal.vue';

describe('Timeline', () => {
  mountTest(TimeLine);
  mountTest(TimeLine.Item);

  it('supports config-driven items with content/children, title/label, icon/dot, placement/position, class, style', () => {
    const wrapper = mount(TimeLine, {
      props: {
        mode: 'alternate',
        items: [
          {
            key: '1',
            title: '2024-01-01',
            content: 'Step 1',
            color: 'green',
            icon: <span class="custom-icon">*</span>,
            class: 'item-one',
            style: { marginTop: '4px' },
          },
          {
            key: '2',
            label: '2024-01-02',
            children: 'Step 2',
            color: '#ff0000',
            dot: <span class="custom-dot">o</span>,
            placement: 'start',
          },
          {
            key: '3',
            content: 'Step 3',
            position: 'right',
            loading: true,
          },
        ],
      },
    });

    const items = wrapper.findAll('.ant-timeline-item');
    expect(items).toHaveLength(3);
    expect(wrapper.find('.ant-timeline').classes()).toContain('ant-timeline-label');

    expect(items[0].classes()).toContain('item-one');
    expect(items[0].element.style.marginTop).toBe('4px');
    expect(items[0].find('.ant-timeline-item-label').text()).toBe('2024-01-01');
    expect(items[0].find('.ant-timeline-item-content').text()).toBe('Step 1');
    expect(items[0].find('.custom-icon').exists()).toBe(true);
    expect(items[0].find('.ant-timeline-item-head').classes()).toContain(
      'ant-timeline-item-head-green',
    );

    expect(items[1].classes()).toContain('ant-timeline-item-left');
    expect(items[1].find('.ant-timeline-item-label').text()).toBe('2024-01-02');
    expect(items[1].find('.ant-timeline-item-content').text()).toBe('Step 2');
    expect(items[1].find('.custom-dot').exists()).toBe(true);

    expect(items[2].classes()).toContain('ant-timeline-item-right');
    expect(items[2].classes()).toContain('ant-timeline-item-pending');
    expect(items[2].find('.anticon-loading').exists()).toBe(true);
  });

  it('supports orientation="horizontal" and variant="filled" / "outlined"', () => {
    const wrapper = mount(TimeLine, {
      props: {
        orientation: 'horizontal',
        variant: 'filled',
        items: [{ content: 'A' }, { content: 'B' }],
      },
    });

    const root = wrapper.find('.ant-timeline');
    expect(root.classes()).toContain('ant-timeline-horizontal');
    expect(root.classes()).toContain('ant-timeline-filled');
  });

  it('inherits variant from ConfigProvider.timeline', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider timeline={{ variant: 'filled' }}>
            <TimeLine items={[{ content: 'A' }]} />
          </ConfigProvider>
        );
      },
    });
    expect(wrapper.find('.ant-timeline').classes()).toContain('ant-timeline-filled');
  });

  it('supports titleSpan as number and string, and ignores it in alternate mode', () => {
    const numWrapper = mount(TimeLine, {
      props: {
        titleSpan: 6,
        items: [{ title: 'T1', content: 'C1' }],
      },
    });
    const numStyle = numWrapper.find('.ant-timeline').attributes('style') || '';
    expect(numStyle).toContain('--ant-timeline-head-span: 6');
    expect(numStyle).toContain('--ant-timeline-head-span-ptg: calc(6 / 24 * 100%)');

    const strWrapper = mount(TimeLine, {
      props: {
        titleSpan: '120px',
        items: [{ title: 'T1', content: 'C1' }],
      },
    });
    expect(strWrapper.find('.ant-timeline').attributes('style')).toContain(
      '--ant-timeline-head-span-ptg: 120px',
    );

    const altWrapper = mount(TimeLine, {
      props: {
        mode: 'alternate',
        titleSpan: 6,
        items: [{ title: 'T1', content: 'C1' }],
      },
    });
    expect(altWrapper.find('.ant-timeline').attributes('style')).toBeUndefined();
  });

  it('supports mode="start" and mode="end" aliases', () => {
    const startWrapper = mount(TimeLine, {
      props: {
        mode: 'start',
        items: [{ content: 'A' }],
      },
    });
    expect(startWrapper.find('.ant-timeline').classes()).toContain('ant-timeline-left');

    const endWrapper = mount(TimeLine, {
      props: {
        mode: 'end',
        items: [{ content: 'A' }],
      },
    });
    expect(endWrapper.find('.ant-timeline').classes()).toContain('ant-timeline-right');
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
                Timeline: {
                  tailColor: '#cccccc',
                  dotSize: 12,
                },
              },
            }}
          >
            <TimeLine
              orientation="horizontal"
              variant="filled"
              items={[
                { title: '2024-01-01', content: 'A' },
                { title: '2024-01-02', content: 'B' },
              ]}
            />
          </ConfigProvider>
        );
      },
    });
    await nextTick();
    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('--ant-timeline-tail-color:#cccccc');
    expect(css).toContain('--ant-timeline-dot-size:12px');
    expect(css).not.toMatch(/NaN|undefined|\[object Object\]/);
    expect(css).not.toMatch(/(?<![\w)])-var\(--ant-/);
    expect(css).not.toMatch(/var\(--ant-[a-z0-9-]+\)(?=[A-Za-z0-9.-]+)/);
    wrapper.unmount();
  });

  it('renders variant and horizontal demos correctly', () => {
    const variantWrapper = mount(VariantDemo, {
      global: { plugins: [TimeLine, Radio] },
    });
    expect(variantWrapper.find('.ant-timeline-filled').exists()).toBe(true);
    expect(variantWrapper.findAll('.ant-timeline-item')).toHaveLength(4);
    variantWrapper.unmount();

    const horizontalWrapper = mount(HorizontalDemo, {
      global: { plugins: [TimeLine, Flex, Divider] },
    });
    const horizontalTimelines = horizontalWrapper.findAll('.ant-timeline-horizontal');
    expect(horizontalTimelines).toHaveLength(3);
    expect(horizontalTimelines[0].classes()).not.toContain('ant-timeline-layout-alternate');
    expect(horizontalTimelines[1].classes()).not.toContain('ant-timeline-layout-alternate');
    expect(horizontalTimelines[1].findAll('.ant-timeline-item-placement-end')).toHaveLength(4);
    expect(horizontalTimelines[2].classes()).toContain('ant-timeline-layout-alternate');
    expect(horizontalWrapper.findAll('.ant-timeline-item')).toHaveLength(12);
    horizontalWrapper.unmount();
  });

  it('keeps horizontal same-side layout non-alternate even when items have titles', () => {
    const wrapper = mount(TimeLine, {
      props: {
        orientation: 'horizontal',
        items: [
          { title: '2015-09-01', content: 'Create a services site' },
          { title: '2015-09-01 09:12:11', content: 'Solve initial network problems' },
          { content: 'Technical testing' },
        ],
      },
    });
    const root = wrapper.find('.ant-timeline');
    expect(root.classes()).toContain('ant-timeline-horizontal');
    expect(root.classes()).not.toContain('ant-timeline-layout-alternate');
    const items = wrapper.findAll('.ant-timeline-item');
    expect(items).toHaveLength(3);
    // Icon precedes section, rail is sibling of wrapper
    items.forEach(item => {
      const wrapperChildren = item.find('.ant-timeline-item-wrapper').element.children;
      expect(wrapperChildren[0].classList.contains('ant-timeline-item-icon')).toBe(true);
      expect(wrapperChildren[1].classList.contains('ant-timeline-item-section')).toBe(true);
      expect(item.element.children[1].classList.contains('ant-timeline-item-rail')).toBe(true);
    });
    wrapper.unmount();
  });

  it('applies placement-end and layout-alternate cleanly for vertical right/end/label/alternate modes', () => {
    const rightWrapper = mount(TimeLine, {
      props: {
        mode: 'right',
        items: [{ content: 'A' }, { content: 'B' }, { content: 'C' }],
      },
    });
    expect(rightWrapper.find('.ant-timeline').classes()).not.toContain(
      'ant-timeline-layout-alternate',
    );
    expect(rightWrapper.findAll('.ant-timeline-item-placement-end')).toHaveLength(3);
    expect(rightWrapper.findAll('.ant-timeline-item-rail')).toHaveLength(3);
    rightWrapper.unmount();

    const labelWrapper = mount(TimeLine, {
      props: {
        mode: 'start',
        items: [{ title: 'T1', content: 'C1' }, { content: 'C2' }],
      },
    });
    expect(labelWrapper.find('.ant-timeline').classes()).toContain('ant-timeline-layout-alternate');
    // Both items render .ant-timeline-item-header so flexbox columns stay aligned even without title
    expect(labelWrapper.findAll('.ant-timeline-item-header')).toHaveLength(2);
    expect(labelWrapper.findAll('.ant-timeline-item-title')).toHaveLength(1);
    labelWrapper.unmount();
  });

  it('marks dotted rail on item connecting to pending/loading node in normal and reverse order', () => {
    const normalWrapper = mount(TimeLine, {
      props: {
        items: [
          { content: 'Step 1' },
          { content: 'Step 2' },
          { loading: true, content: 'Recording...' },
        ],
      },
    });
    const normalItems = normalWrapper.findAll('.ant-timeline-item');
    expect(normalItems[0].classes()).not.toContain('ant-timeline-item-rail-dotted');
    expect(normalItems[1].classes()).toContain('ant-timeline-item-rail-dotted');
    expect(normalItems[2].classes()).toContain('ant-timeline-item-last');
    normalWrapper.unmount();

    const reverseWrapper = mount(TimeLine, {
      props: {
        reverse: true,
        items: [
          { content: 'Step 1' },
          { content: 'Step 2' },
          { loading: true, content: 'Recording...' },
        ],
      },
    });
    const revItems = reverseWrapper.findAll('.ant-timeline-item');
    expect(revItems[0].classes()).toContain('ant-timeline-item-rail-dotted');
    expect(revItems[1].classes()).not.toContain('ant-timeline-item-rail-dotted');
    expect(revItems[2].classes()).toContain('ant-timeline-item-last');
    reverseWrapper.unmount();
  });

  it('treats non-preset color names containing preset substrings as custom colors', () => {
    const wrapper = mount(TimeLine, {
      props: {
        items: [{ color: 'lightblue', content: 'Custom' }],
      },
    });
    const head = wrapper.find('.ant-timeline-item-head');
    expect(head.classes()).not.toContain('ant-timeline-item-head-lightblue');
    expect(head.attributes('style')).toContain('border-color: lightblue');
    wrapper.unmount();
  });
});
