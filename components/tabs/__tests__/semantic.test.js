import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tabs from '..';
import ConfigProvider from '../../config-provider';
import VcDropdown from '../../vc-dropdown';

describe('Tabs.Semantic & v6 features', () => {
  const items = [
    { key: '1', label: 'Tab 1', children: 'Content 1' },
    { key: '2', label: 'Tab 2', children: 'Content 2' },
  ];

  it('supports static object classNames and styles for all semantic slots', () => {
    const wrapper = mount(Tabs, {
      props: {
        defaultActiveKey: '1',
        type: 'editable-card',
        more: { open: true },
        items,
        classNames: {
          root: 'custom-root',
          header: 'custom-header',
          item: 'custom-item',
          remove: 'custom-remove',
          indicator: 'custom-indicator',
          body: 'custom-body',
          content: 'custom-content',
          popup: { root: 'custom-popup' },
        },
        styles: {
          root: { color: 'rgb(255, 0, 0)' },
          header: { color: 'rgb(0, 255, 0)' },
          item: { color: 'rgb(0, 0, 255)' },
          remove: { color: 'rgb(255, 0, 255)' },
          indicator: { color: 'rgb(255, 255, 0)' },
          body: { color: 'rgb(0, 128, 128)' },
          content: { color: 'rgb(128, 0, 128)' },
          popup: { root: { color: 'rgb(0, 255, 255)' } },
        },
      },
    });

    const root = wrapper.find('.ant-tabs');
    const header = wrapper.find('.ant-tabs-nav');
    const item = wrapper.find('.ant-tabs-tab');
    const remove = wrapper.find('.ant-tabs-tab-remove');
    const indicator = wrapper.find('.ant-tabs-ink-bar');
    const body = wrapper.find('.ant-tabs-content');
    const content = wrapper.find('.ant-tabs-tabpane');
    const dd = wrapper.findComponent(VcDropdown);

    expect(root.classes()).toContain('custom-root');
    expect(header.classes()).toContain('custom-header');
    expect(item.classes()).toContain('custom-item');
    expect(remove.classes()).toContain('custom-remove');
    expect(indicator.classes()).toContain('custom-indicator');
    expect(body.classes()).toContain('custom-body');
    expect(content.classes()).toContain('custom-content');
    expect(dd.props('overlayClassName')).toContain('custom-popup');

    expect(root.attributes('style')).toContain('color: rgb(255, 0, 0)');
    expect(header.attributes('style')).toContain('color: rgb(0, 255, 0)');
    expect(item.attributes('style')).toContain('color: rgb(0, 0, 255)');
    expect(remove.attributes('style')).toContain('color: rgb(255, 0, 255)');
    expect(indicator.attributes('style')).toContain('color: rgb(255, 255, 0)');
    expect(body.attributes('style')).toContain('color: rgb(0, 128, 128)');
    expect(content.attributes('style')).toContain('color: rgb(128, 0, 128)');
    expect(dd.props('overlayStyle')).toEqual({ color: 'rgb(0, 255, 255)' });

    wrapper.unmount();
  });

  it('supports functional classNames/styles and merges ConfigProvider.tabs', async () => {
    const classNamesFn = info => ({
      root: info.props.type === 'card' ? 'card-root' : 'line-root',
      item: 'fn-item',
    });
    const stylesFn = info => ({
      root: { padding: info.props.centered ? '12px' : '6px' },
      header: { marginBottom: '8px' },
    });

    const wrapper = mount({
      props: {
        type: { type: String, default: 'line' },
        centered: { type: Boolean, default: false },
      },
      render() {
        return (
          <ConfigProvider
            tabs={{
              className: 'ctx-cls',
              style: { opacity: '0.9' },
              classNames: { root: 'ctx-root', item: 'ctx-item' },
              styles: { root: { backgroundColor: 'rgb(1, 2, 3)' }, header: { paddingLeft: '4px' } },
            }}
          >
            <Tabs
              type={this.type}
              centered={this.centered}
              items={items}
              classNames={classNamesFn}
              styles={stylesFn}
            />
          </ConfigProvider>
        );
      },
    });

    const root = wrapper.find('.ant-tabs');
    const header = wrapper.find('.ant-tabs-nav');
    const item = wrapper.find('.ant-tabs-tab');

    expect(root.classes()).toContain('ctx-cls');
    expect(root.classes()).toContain('ctx-root');
    expect(root.classes()).toContain('line-root');
    expect(root.attributes('style')).toContain('opacity: 0.9');
    expect(root.attributes('style')).toContain('background-color: rgb(1, 2, 3)');
    expect(root.attributes('style')).toContain('padding: 6px');
    expect(header.attributes('style')).toContain('padding-left: 4px');
    expect(header.attributes('style')).toContain('margin-bottom: 8px');
    expect(item.classes()).toContain('ctx-item');
    expect(item.classes()).toContain('fn-item');

    await wrapper.setProps({ type: 'card', centered: true });
    await nextTick();
    expect(wrapper.find('.ant-tabs').classes()).toContain('card-root');
    expect(wrapper.find('.ant-tabs').attributes('style')).toContain('padding: 12px');

    wrapper.unmount();
  });

  it('supports more.popupRender with restTabs and onClose', async () => {
    const popupRender = jest.fn((menu, { restTabs, onClose }) => (
      <div class="custom-popup-render">
        <span class="rest-count">{restTabs.length}</span>
        <button class="close-btn" onClick={onClose}>
          close
        </button>
        {menu}
      </div>
    ));

    const wrapper = mount(Tabs, {
      props: {
        items,
        more: {
          open: true,
          popupRender,
        },
      },
    });

    const dd = wrapper.findComponent(VcDropdown);
    expect(dd.exists()).toBe(true);
    const rendered = dd.vm.$slots.overlay();
    const popupNode = Array.isArray(rendered) ? rendered[0] : rendered;
    expect(popupRender).toHaveBeenCalled();
    expect(popupNode.props.class).toBe('custom-popup-render');

    wrapper.unmount();
  });
});
