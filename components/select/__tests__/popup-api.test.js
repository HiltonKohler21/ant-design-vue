import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Select from '..';
import RcSelect from '../../vc-select';

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

  it('popupRender 覆盖默认下拉内容', async () => {
    const wrapper = mount(Select, {
      props: { open: true, popupRender: () => <div class="custom-popup">custom</div> },
      slots: { default: options },
    });
    await nextTick();
    expect(document.body.innerHTML).toContain('custom-popup');
    wrapper.unmount();
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
