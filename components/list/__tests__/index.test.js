import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Avatar from '../../avatar/Avatar';
import Button from '../../button';
import Card from '../../card';
import Divider from '../../divider';
import Radio from '../../radio';
import Skeleton from '../../skeleton';
import Space from '../../space';
import List from '..';
import ConfigProvider from '../../config-provider';
import mountTest from '../../../tests/shared/mountTest';

jest.mock('../../tabs', () => ({
  __esModule: true,
  default: {
    name: 'ATabs',
    render() {
      return null;
    },
  },
  TabPane: {
    name: 'ATabPane',
    render() {
      return null;
    },
  },
}));

jest.mock('ant-design-vue', () => ({
  Card: require('../../card').default,
  List: require('..').default,
  message: require('../../message').default,
}));

const demoPlugins = [Button, Card, ConfigProvider, Divider, List, Radio, Skeleton, Space];

import PaginationDemo from '../demo/pagination.vue';
import GridTestDemo from '../demo/grid-test.vue';
import InfiniteLoadDemo from '../demo/infinite-load.vue';
import DragSortingDemo from '../demo/drag-sorting.vue';
import DragSortingHandlerDemo from '../demo/drag-sorting-handler.vue';
import GridDragSortingDemo from '../demo/grid-drag-sorting.vue';
import GridDragSortingHandlerDemo from '../demo/grid-drag-sorting-handler.vue';
import VirtualListDemo from '../demo/virtual-list.vue';
import SpinDebugDemo from '../demo/spin-debug.vue';

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

  it('List.Item supports functional classNames & styles merged with ConfigProvider.list', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider
            list={{
              item: {
                classNames: ({ props }) => ({
                  actions: props.grid ? 'ctx-grid-actions' : 'ctx-list-actions',
                  extra: 'ctx-extra',
                }),
                styles: {
                  actions: { paddingLeft: '6px' },
                  extra: { opacity: '0.8' },
                },
              },
            }}
          >
            <List
              itemLayout="vertical"
              dataSource={['item1']}
              renderItem={({ item }) => (
                <List.Item
                  extra={<span>Extra</span>}
                  actions={[<a key="edit">edit</a>]}
                  classNames={({ props }) => ({
                    actions: props.actions?.length ? 'fn-has-actions' : 'fn-no-actions',
                    extra: 'fn-extra',
                  })}
                  styles={({ props }) => ({
                    actions: { marginTop: props.actions?.length ? '8px' : '0px' },
                    extra: { color: 'rgb(10, 20, 30)' },
                  })}
                >
                  {item}
                </List.Item>
              )}
            />
          </ConfigProvider>
        );
      },
    });

    const actionsEl = wrapper.find('.ant-list-item-action');
    expect(actionsEl.classes()).toContain('ctx-list-actions');
    expect(actionsEl.classes()).toContain('fn-has-actions');
    expect(actionsEl.element.style.paddingLeft).toBe('6px');
    expect(actionsEl.element.style.marginTop).toBe('8px');

    const extraEl = wrapper.find('.ant-list-item-extra');
    expect(extraEl.classes()).toContain('ctx-extra');
    expect(extraEl.classes()).toContain('fn-extra');
    expect(extraEl.element.style.opacity).toBe('0.8');
    expect(extraEl.element.style.color).toBe('rgb(10, 20, 30)');
  });

  it('supports pagination align and position', () => {
    const wrapper = mount({
      render() {
        return (
          <List
            pagination={{ position: 'both', align: 'center' }}
            dataSource={['a', 'b', 'c']}
            renderItem={({ item }) => <List.Item>{item}</List.Item>}
          />
        );
      },
    });
    const paginations = wrapper.findAll('.ant-pagination');
    expect(paginations).toHaveLength(2);
    expect(paginations[0].classes()).toContain('ant-pagination-center');
    expect(paginations[1].classes()).toContain('ant-pagination-center');
  });

  it('mounts all new list demos cleanly', () => {
    const demos = [
      PaginationDemo,
      GridTestDemo,
      InfiniteLoadDemo,
      DragSortingDemo,
      DragSortingHandlerDemo,
      GridDragSortingDemo,
      GridDragSortingHandlerDemo,
      VirtualListDemo,
      SpinDebugDemo,
    ];
    demos.forEach(Demo => {
      const wrapper = mount(Demo, {
        global: {
          components: { AAvatar: Avatar },
          plugins: demoPlugins,
        },
      });
      expect(wrapper.find('.ant-list').exists()).toBe(true);
      wrapper.unmount();
    });
  });
});
