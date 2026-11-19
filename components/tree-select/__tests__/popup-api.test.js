import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TreeSelect from '..';
import Cascader from '../../cascader';
import AutoComplete from '../../auto-complete';
import RcSelect from '../../vc-select';

describe('upstream popup API: TreeSelect / Cascader / AutoComplete', () => {
  it('TreeSelect popupMatchSelectWidth 映射到 dropdownMatchSelectWidth', () => {
    const wrapper = mount(TreeSelect, { props: { popupMatchSelectWidth: 480, open: false } });
    expect(wrapper.findComponent({ name: 'ATreeSelect' }).exists()).toBe(true);
    expect(wrapper.html()).not.toContain('popupmatchselectwidth');
    expect(wrapper.html()).not.toContain('popupMatchSelectWidth');
  });

  it('TreeSelect onOpenChange 替代 onDropdownVisibleChange', async () => {
    const onOpenChange = jest.fn();
    const wrapper = mount(TreeSelect, { props: { onOpenChange } });
    await wrapper.find('.ant-select-selector').trigger('mousedown');
    await nextTick();
    expect(onOpenChange).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('Cascader onOpenChange 替代 onDropdownVisibleChange', async () => {
    const onOpenChange = jest.fn();
    const wrapper = mount(Cascader, {
      props: { onOpenChange, options: [{ value: 'a', label: 'A' }] },
    });
    await wrapper.find('.ant-select-selector').trigger('mousedown');
    await nextTick();
    expect(onOpenChange).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('Cascader 不把 onOpenChange 泄漏成 DOM 属性', () => {
    const wrapper = mount(Cascader, { props: { options: [], onOpenChange: () => {} } });
    expect(wrapper.html()).not.toContain('onopenchange');
  });

  it('AutoComplete 继承 Select 的 popup API', () => {
    const wrapper = mount(AutoComplete, {
      props: { popupMatchSelectWidth: 360, options: [] },
    });
    expect(wrapper.findComponent(RcSelect).props('dropdownMatchSelectWidth')).toBe(360);
    expect(wrapper.html()).not.toContain('popupmatchselectwidth');
  });
});
