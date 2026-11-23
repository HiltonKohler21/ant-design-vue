import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import List from '..';
import ConfigProvider from '../../config-provider';
import mountTest from '../../../tests/shared/mountTest';

describe('List', () => {
  mountTest(List);
  mountTest(List.Item);
  it('locale not passed to internal div', async () => {
    const locale = { emptyText: 'Custom text' };
    const wrapper = mount(
      {
        render() {
          return (
            <List
              dataSource={[]}
              renderItem={({ item }) => <List.Item>{item}</List.Item>}
              locale={locale}
            />
          );
        },
      },
      {
        sync: false,
      },
    );
    await asyncExpect(() => {
      expect(wrapper.props().locale).toBe(undefined);
    });
  });

  it('List.Item classNames.extra & styles.extra in vertical layout', () => {
    const wrapper = mount({
      render() {
        return (
          <List
            itemLayout="vertical"
            dataSource={['item1']}
            renderItem={({ item }) => (
              <List.Item
                extra={<span>ExtraContent</span>}
                actions={[<a key="edit">edit</a>]}
                classNames={{ extra: 'custom-extra', actions: 'custom-actions' }}
                styles={{
                  extra: { color: 'rgb(1, 2, 3)' },
                  actions: { marginTop: '4px' },
                }}
              >
                {item}
              </List.Item>
            )}
          />
        );
      },
    });
    const extraEl = wrapper.find('.ant-list-item-extra');
    expect(extraEl.exists()).toBe(true);
    expect(extraEl.classes()).toContain('custom-extra');
    expect(extraEl.element.style.color).toBe('rgb(1, 2, 3)');
    const actionsEl = wrapper.find('.ant-list-item-action');
    expect(actionsEl.classes()).toContain('custom-actions');
    expect(actionsEl.element.style.marginTop).toBe('4px');
  });

  it('ConfigProvider.list className & style', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            list={{ className: 'cp-list', style: { backgroundColor: 'rgb(240, 240, 240)' } }}
          >
            <List dataSource={['a']} renderItem={({ item }) => <List.Item>{item}</List.Item>} />
          </ConfigProvider>
        );
      },
    });
    const root = wrapper.find('.ant-list');
    expect(root.classes()).toContain('cp-list');
    expect(root.element.style.backgroundColor).toBe('rgb(240, 240, 240)');
  });
});
