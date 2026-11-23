import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Select from '..';
import RcSelect from '../../vc-select';
import ConfigProvider from '../../config-provider';

const { Option } = Select;

const options = () => [<Option value="a">A</Option>, <Option value="b">B</Option>];

describe('upstream popup API: Select（antd 5.25 改名）', () => {
  it('popupMatchSelectWidth maps to dropdownMatchSelectWidth', () => {
    const wrapper = mount(Select, {
      props: { popupMatchSelectWidth: 480 },
      slots: { default: options },
    });
    expect(wrapper.findComponent(RcSelect).props('dropdownMatchSelectWidth')).toBe(480);
  });

  it('keeps legacy dropdownMatchSelectWidth working', () => {
    const wrapper = mount(Select, {
      props: { dropdownMatchSelectWidth: 320 },
      slots: { default: options },
    });
    expect(wrapper.findComponent(RcSelect).props('dropdownMatchSelectWidth')).toBe(320);
  });

  it('popupMatchSelectWidth wins over legacy prop', () => {
    const wrapper = mount(Select, {
      props: { dropdownMatchSelectWidth: 320, popupMatchSelectWidth: 200 },
      slots: { default: options },
    });
    expect(wrapper.findComponent(RcSelect).props('dropdownMatchSelectWidth')).toBe(200);
  });

  it('popupRender 覆盖默认下拉内容并直接接收 menuNode VNode（非对象）', async () => {
    document.body.innerHTML = '';
    const wrapper = mount(Select, {
      props: {
        open: true,
        popupRender: menu => (
          <div class="custom-popup">
            {menu}
            <div class="custom-footer">footer</div>
          </div>
        ),
      },
      slots: { default: options },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.body.innerHTML).toContain('custom-popup');
    expect(document.body.innerHTML).toContain('custom-footer');
    expect(document.body.innerHTML).toContain('ant-select-item-option');
    expect(document.body.innerHTML).not.toContain('[object Object]');
    wrapper.unmount();
  });

  it('popupRender 插槽直接接收 menuNode VNode', async () => {
    document.body.innerHTML = '';
    const wrapper = mount(Select, {
      props: { open: true },
      slots: {
        default: options,
        popupRender: menu => (
          <div class="slot-popup">
            {menu}
            <span class="slot-extra">extra</span>
          </div>
        ),
      },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.body.innerHTML).toContain('slot-popup');
    expect(document.body.innerHTML).toContain('slot-extra');
    expect(document.body.innerHTML).toContain('ant-select-item-option');
    expect(document.body.innerHTML).not.toContain('[object Object]');
    wrapper.unmount();
  });

  it('保留 legacy dropdownRender ({ menuNode, props }) 签名向后兼容', async () => {
    document.body.innerHTML = '';
    const wrapper = mount(Select, {
      props: {
        open: true,
        dropdownRender: ({ menuNode }) => (
          <div class="legacy-dropdown">
            {menuNode}
            <span class="legacy-foot">legacy</span>
          </div>
        ),
      },
      slots: { default: options },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.body.innerHTML).toContain('legacy-dropdown');
    expect(document.body.innerHTML).toContain('legacy-foot');
    expect(document.body.innerHTML).toContain('ant-select-item-option');
    expect(document.body.innerHTML).not.toContain('[object Object]');
    wrapper.unmount();
  });

  it('支持 ConfigProvider.select 的 className 与 style', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        select: { className: 'ctx-select-cls', style: { minWidth: '240px' } },
      },
      slots: {
        default: () => <Select options={[{ value: 'a', label: 'A' }]} />,
      },
    });
    const el = wrapper.find('.ant-select');
    expect(el.classes()).toContain('ctx-select-cls');
    expect(el.element.getAttribute('style')).toContain('min-width: 240px');
  });

  it('onOpenChange 在下拉显隐时触发', async () => {
    const onOpenChange = jest.fn();
    const wrapper = mount(Select, {
      props: { onOpenChange },
      slots: { default: options },
    });
    await wrapper.find('.ant-select-selector').trigger('mousedown');
    await nextTick();
    await nextTick();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
});
