import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import Pagination from '..';
import ConfigProvider from '../../config-provider';

describe('Pagination.Semantic & v6 features', () => {
  it('supports static object classNames and styles for root and item', () => {
    const wrapper = mount(Pagination, {
      props: {
        defaultCurrent: 1,
        total: 500,
        showSizeChanger: { showSearch: false },
        classNames: {
          root: 'custom-root',
          item: 'custom-item',
        },
        styles: {
          root: { color: 'rgb(255, 0, 0)' },
          item: { color: 'rgb(0, 0, 255)', borderRadius: '999px' },
        },
      },
    });

    const root = wrapper.find('.ant-pagination');
    const item = wrapper.find('.ant-pagination-item');
    const prev = wrapper.find('.ant-pagination-prev');

    expect(root.classes()).toContain('custom-root');
    expect(root.attributes('style')).toContain('color: rgb(255, 0, 0)');
    expect(item.classes()).toContain('custom-item');
    expect(item.attributes('style')).toContain('color: rgb(0, 0, 255)');
    expect(item.attributes('style')).toContain('border-radius: 999px');
    expect(prev.classes()).toContain('custom-item');
    wrapper.unmount();
  });

  it('supports functional classNames/styles and merges ConfigProvider.pagination', async () => {
    const functionClassNames = info => ({
      root: `dynamic-root-${info.props.size || 'default'}`,
      item: info.props.disabled ? 'disabled-item' : 'enabled-item',
    });
    const functionStyles = info => ({
      root: {
        backgroundColor: info.props.size === 'small' ? 'rgb(230, 247, 255)' : 'rgb(246, 255, 237)',
      },
      item: {
        color: info.props.disabled ? 'rgb(217, 217, 217)' : 'rgb(82, 196, 26)',
      },
    });

    const wrapper = mount(
      {
        props: {
          size: { type: String, default: undefined },
          disabled: { type: Boolean, default: false },
        },
        render() {
          return (
            <ConfigProvider
              pagination={{
                className: 'ctx-cls',
                style: { opacity: '0.9' },
                classNames: { root: 'ctx-root', item: 'ctx-item' },
                styles: { root: { padding: '4px' }, item: { marginRight: '4px' } },
              }}
            >
              <Pagination
                defaultCurrent={1}
                total={100}
                size={this.size}
                disabled={this.disabled}
                classNames={functionClassNames}
                styles={functionStyles}
                style={{ marginTop: '2px' }}
              />
            </ConfigProvider>
          );
        },
      },
      {
        props: { size: 'small', disabled: false },
      },
    );

    const root = wrapper.find('.ant-pagination');
    const item = wrapper.find('.ant-pagination-item');

    expect(root.classes()).toContain('ctx-cls');
    expect(root.classes()).toContain('ctx-root');
    expect(root.classes()).toContain('dynamic-root-small');
    expect(root.attributes('style')).toContain('opacity: 0.9');
    expect(root.attributes('style')).toContain('padding: 4px');
    expect(root.attributes('style')).toContain('background-color: rgb(230, 247, 255)');
    expect(root.attributes('style')).toContain('margin-top: 2px');

    expect(item.classes()).toContain('ctx-item');
    expect(item.classes()).toContain('enabled-item');
    expect(item.attributes('style')).toContain('margin-right: 4px');
    expect(item.attributes('style')).toContain('color: rgb(82, 196, 26)');

    await wrapper.setProps({ size: undefined, disabled: true });
    await nextTick();
    const updatedRoot = wrapper.find('.ant-pagination');
    const updatedItem = wrapper.find('.ant-pagination-item');
    expect(updatedRoot.classes()).toContain('dynamic-root-default');
    expect(updatedRoot.attributes('style')).toContain('background-color: rgb(246, 255, 237)');
    expect(updatedItem.classes()).toContain('disabled-item');
    expect(updatedItem.classes()).not.toContain('enabled-item');
    expect(updatedItem.attributes('style')).toContain('color: rgb(217, 217, 217)');

    wrapper.unmount();
  });

  it('supports align, variant, and components.sizeChanger', () => {
    const CustomChanger = defineComponent({
      props: ['value', 'onChange', 'disabled', 'className'],
      setup(props) {
        return () =>
          h(
            'button',
            {
              class: ['custom-size-changer', props.className],
              type: 'button',
              onClick: () => props.onChange?.(20),
            },
            `size:${props.value}`,
          );
      },
    });

    const onShowSizeChange = jest.fn();
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider variant="filled">
            <Pagination
              align="center"
              total={200}
              showSizeChanger
              components={{ sizeChanger: CustomChanger }}
              onShowSizeChange={onShowSizeChange}
            />
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-pagination');
    expect(root.classes()).toContain('ant-pagination-center');
    expect(root.classes()).toContain('ant-pagination-filled');

    const changer = wrapper.find('.custom-size-changer');
    expect(changer.exists()).toBe(true);
    expect(changer.text()).toBe('size:10');
    changer.trigger('click');
    expect(onShowSizeChange).toHaveBeenCalledWith(1, 20);

    wrapper.unmount();
  });
});
