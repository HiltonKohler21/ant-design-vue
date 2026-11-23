import { mount } from '@vue/test-utils';
import Transfer from '..';
import Button from '../../button';
import ConfigProvider from '../../config-provider';

const mockData = [
  { key: '1', title: 'Item 1' },
  { key: '2', title: 'Item 2' },
  { key: '3', title: 'Item 3' },
];

describe('Transfer v6 APIs & Semantic DOM', () => {
  it('supports actions prop and prioritizes actions over operations', () => {
    const wrapper = mount({
      render() {
        return (
          <Transfer
            dataSource={mockData}
            targetKeys={['3']}
            actions={['To Right', 'To Left']}
            operations={['Old Right', 'Old Left']}
            render={item => item.title}
          />
        );
      },
    });

    const buttons = wrapper.findAll('.ant-transfer-operation .ant-btn');
    expect(buttons[0].text()).toBe('To Right');
    expect(buttons[1].text()).toBe('To Left');

    // Backwards compatibility with operations
    const wLegacy = mount({
      render() {
        return (
          <Transfer
            dataSource={mockData}
            targetKeys={['3']}
            operations={['Legacy Right', 'Legacy Left']}
            render={item => item.title}
          />
        );
      },
    });
    const legacyButtons = wLegacy.findAll('.ant-transfer-operation .ant-btn');
    expect(legacyButtons[0].text()).toBe('Legacy Right');
    expect(legacyButtons[1].text()).toBe('Legacy Left');
  });

  it('supports custom VueNode elements in actions', async () => {
    const onChange = jest.fn();
    const wrapper = mount({
      render() {
        return (
          <Transfer
            dataSource={mockData}
            targetKeys={[]}
            selectedKeys={['1']}
            actions={[
              <Button class="custom-right-btn">Custom Move</Button>,
              <Button class="custom-left-btn">Custom Back</Button>,
            ]}
            onChange={onChange}
            render={item => item.title}
          />
        );
      },
    });

    const rightBtn = wrapper.find('.custom-right-btn');
    expect(rightBtn.exists()).toBe(true);
    await rightBtn.trigger('click');
    expect(onChange).toHaveBeenCalledWith(['1'], 'right', ['1']);
  });

  it('supports all 11 semantic classNames and styles plus source/target overrides', () => {
    const wrapper = mount({
      render() {
        return (
          <Transfer
            dataSource={mockData}
            targetKeys={['3']}
            titles={['Source', 'Target']}
            render={item => item.title}
            classNames={{
              root: 't-root',
              section: 't-section',
              header: 't-header',
              title: 't-title',
              body: 't-body',
              list: 't-list',
              item: 't-item',
              itemIcon: 't-item-icon',
              itemContent: 't-item-content',
              footer: 't-footer',
              actions: 't-actions',
              source: { section: 't-source-section' },
              target: { section: 't-target-section' },
            }}
            styles={{
              root: { backgroundColor: 'rgb(1, 2, 3)' },
              section: { borderColor: 'rgb(4, 5, 6)' },
              header: { padding: '10px' },
              title: { fontWeight: '700' },
              body: { minHeight: '120px' },
              list: { padding: '4px' },
              item: { lineHeight: '24px' },
              itemIcon: { marginRight: '6px' },
              itemContent: { letterSpacing: '1px' },
              footer: { textAlign: 'center' },
              actions: { gap: '8px' },
              source: { header: { color: 'rgb(11, 22, 33)' } },
              target: { header: { color: 'rgb(44, 55, 66)' } },
            }}
            v-slots={{
              footer: () => <span>Footer</span>,
            }}
          />
        );
      },
    });

    const root = wrapper.find('.ant-transfer');
    expect(root.classes()).toContain('t-root');
    expect(root.attributes('style')).toContain('background-color: rgb(1, 2, 3)');

    const sections = wrapper.findAll('.ant-transfer-list');
    expect(sections).toHaveLength(2);
    expect(sections[0].classes()).toContain('t-section');
    expect(sections[0].classes()).toContain('t-source-section');
    expect(sections[0].attributes('style')).toContain('border-color: rgb(4, 5, 6)');
    expect(sections[1].classes()).toContain('t-section');
    expect(sections[1].classes()).toContain('t-target-section');

    const headers = wrapper.findAll('.ant-transfer-list-header');
    expect(headers).toHaveLength(2);
    expect(headers[0].classes()).toContain('t-header');
    expect(headers[0].attributes('style')).toContain('padding: 10px');
    expect(headers[0].attributes('style')).toContain('color: rgb(11, 22, 33)');
    expect(headers[1].attributes('style')).toContain('color: rgb(44, 55, 66)');

    const titles = wrapper.findAll('.ant-transfer-list-header-title');
    expect(titles).toHaveLength(2);
    titles.forEach(el => {
      expect(el.classes()).toContain('t-title');
      expect(el.attributes('style')).toContain('font-weight: 700');
    });

    const bodies = wrapper.findAll('.ant-transfer-list-body');
    expect(bodies).toHaveLength(2);
    bodies.forEach(el => {
      expect(el.classes()).toContain('t-body');
      expect(el.attributes('style')).toContain('min-height: 120px');
    });

    const lists = wrapper.findAll('.ant-transfer-list-content');
    expect(lists).toHaveLength(2);
    lists.forEach(el => {
      expect(el.classes()).toContain('t-list');
      expect(el.attributes('style')).toContain('padding: 4px');
    });

    const items = wrapper.findAll('.ant-transfer-list-content-item');
    expect(items).toHaveLength(3);
    items.forEach(el => {
      expect(el.classes()).toContain('t-item');
      expect(el.attributes('style')).toContain('line-height: 24px');
    });

    const itemIcons = wrapper.findAll('.ant-transfer-list-content-item .t-item-icon');
    expect(itemIcons).toHaveLength(3);
    itemIcons.forEach(el => {
      expect(el.attributes('style')).toContain('margin-right: 6px');
    });

    const itemContents = wrapper.findAll('.ant-transfer-list-content-item-text');
    expect(itemContents).toHaveLength(3);
    itemContents.forEach(el => {
      expect(el.classes()).toContain('t-item-content');
      expect(el.attributes('style')).toContain('letter-spacing: 1px');
    });

    const footers = wrapper.findAll('.ant-transfer-list-footer');
    expect(footers).toHaveLength(2);
    footers.forEach(el => {
      expect(el.classes()).toContain('t-footer');
      expect(el.attributes('style')).toContain('text-align: center');
    });

    const actions = wrapper.find('.ant-transfer-operation');
    expect(actions.classes()).toContain('t-actions');
    expect(actions.attributes('style')).toContain('gap: 8px');
  });

  it('supports functional classNames/styles merged with ConfigProvider.transfer', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            transfer={{
              classNames: {
                root: 'ctx-t-root',
                section: 'ctx-t-section',
                actions: 'ctx-t-actions',
              },
              styles: {
                root: { padding: '6px' },
                actions: { margin: '12px' },
              },
            }}
          >
            <Transfer
              disabled
              dataSource={mockData}
              targetKeys={['3']}
              render={item => item.title}
              classNames={({ props }) => ({
                root: props.disabled ? 'fn-disabled-root' : 'fn-active-root',
                section: 'fn-section',
                actions: 'fn-actions',
              })}
              styles={({ props }) => ({
                root: { opacity: props.disabled ? '0.6' : '1' },
                section: { borderRadius: '10px' },
              })}
            />
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-transfer');
    expect(root.classes()).toContain('ctx-t-root');
    expect(root.classes()).toContain('fn-disabled-root');
    expect(root.attributes('style')).toContain('padding: 6px');
    expect(root.attributes('style')).toContain('opacity: 0.6');

    const section = wrapper.find('.ant-transfer-list');
    expect(section.classes()).toContain('ctx-t-section');
    expect(section.classes()).toContain('fn-section');
    expect(section.attributes('style')).toContain('border-radius: 10px');

    const actions = wrapper.find('.ant-transfer-operation');
    expect(actions.classes()).toContain('ctx-t-actions');
    expect(actions.classes()).toContain('fn-actions');
    expect(actions.attributes('style')).toContain('margin: 12px');
  });
});
