import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TreeSelect from '..';
import VcTreeSelect from '../../vc-tree-select';
import Cascader from '../../cascader';
import AutoComplete from '../../auto-complete';
import RcSelect from '../../vc-select';
import ConfigProvider from '../../config-provider';

describe('upstream popup API: TreeSelect / Cascader / AutoComplete', () => {
  it('TreeSelect popupMatchSelectWidth 映射到 dropdownMatchSelectWidth', () => {
    const wrapper = mount(TreeSelect, { props: { popupMatchSelectWidth: 480, open: false } });
    expect(wrapper.findComponent({ name: 'ATreeSelect' }).exists()).toBe(true);
    expect(wrapper.html()).not.toContain('popupmatchselectwidth');
    expect(wrapper.html()).not.toContain('popupMatchSelectWidth');
  });

  it('TreeSelect onOpenChange 替代 onDropdownVisibleChange 且仅触发一次', async () => {
    const onOpenChange = jest.fn();
    const wrapper = mount(TreeSelect, { props: { onOpenChange } });
    await wrapper.find('.ant-select-selector').trigger('mousedown');
    await nextTick();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it('TreeSelect 保留 styles.popup.root', () => {
    const wrapper = mount(TreeSelect, {
      props: { styles: { popup: { root: { maxHeight: '300px' } } } },
    });
    const vc = wrapper.findComponent(VcTreeSelect);
    expect(vc.props('dropdownStyle')).toEqual({ maxHeight: '300px' });
  });

  it('Cascader onOpenChange 替代 onDropdownVisibleChange 且仅触发一次', async () => {
    const onOpenChange = jest.fn();
    const wrapper = mount(Cascader, {
      props: { onOpenChange, options: [{ value: 'a', label: 'A' }] },
    });
    await wrapper.find('.ant-select-selector').trigger('mousedown');
    await nextTick();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
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

  it('Cascader popupRender (prop & slot) 直接接收 menuNode VNode，并保留 dropdownRender', async () => {
    document.body.innerHTML = '';
    const opts = [{ value: 'a', label: 'OptionA' }];
    const wProp = mount(Cascader, {
      props: {
        open: true,
        options: opts,
        popupRender: menu => (
          <div class="cas-popup-prop">
            {menu}
            <span>cas-foot</span>
          </div>
        ),
      },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.body.innerHTML).toContain('cas-popup-prop');
    expect(document.body.innerHTML).toContain('OptionA');
    expect(document.body.innerHTML).not.toContain('[object Object]');
    wProp.unmount();

    document.body.innerHTML = '';
    const wSlot = mount(Cascader, {
      props: { open: true, options: opts },
      slots: {
        popupRender: menu => <div class="cas-popup-slot">{menu}</div>,
      },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.body.innerHTML).toContain('cas-popup-slot');
    expect(document.body.innerHTML).toContain('OptionA');
    expect(document.body.innerHTML).not.toContain('[object Object]');
    wSlot.unmount();

    document.body.innerHTML = '';
    const wLegacy = mount(Cascader, {
      props: {
        open: true,
        options: opts,
        dropdownRender: ({ menuNode }) => <div class="cas-legacy">{menuNode}</div>,
      },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.body.innerHTML).toContain('cas-legacy');
    expect(document.body.innerHTML).toContain('OptionA');
    expect(document.body.innerHTML).not.toContain('[object Object]');
    wLegacy.unmount();
  });

  it('TreeSelect popupRender (prop & slot) 直接接收 menuNode VNode，并保留 dropdownRender', async () => {
    document.body.innerHTML = '';
    const treeData = [{ value: 't1', title: 'TreeNode1' }];
    const wProp = mount(TreeSelect, {
      props: {
        open: true,
        treeData,
        popupRender: menu => (
          <div class="ts-popup-prop">
            {menu}
            <span>ts-foot</span>
          </div>
        ),
      },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.body.innerHTML).toContain('ts-popup-prop');
    expect(document.body.innerHTML).toContain('TreeNode1');
    expect(document.body.innerHTML).not.toContain('[object Object]');
    wProp.unmount();

    document.body.innerHTML = '';
    const wSlot = mount(TreeSelect, {
      props: { open: true, treeData },
      slots: {
        popupRender: menu => <div class="ts-popup-slot">{menu}</div>,
      },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.body.innerHTML).toContain('ts-popup-slot');
    expect(document.body.innerHTML).toContain('TreeNode1');
    expect(document.body.innerHTML).not.toContain('[object Object]');
    wSlot.unmount();

    document.body.innerHTML = '';
    const wLegacy = mount(TreeSelect, {
      props: {
        open: true,
        treeData,
        dropdownRender: ({ menuNode }) => <div class="ts-legacy">{menuNode}</div>,
      },
      attachTo: 'body',
    });
    await nextTick();
    expect(document.body.innerHTML).toContain('ts-legacy');
    expect(document.body.innerHTML).toContain('TreeNode1');
    expect(document.body.innerHTML).not.toContain('[object Object]');
    wLegacy.unmount();
  });

  it('ConfigProvider.cascader 与 ConfigProvider.treeSelect 透传 className 与 style', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        cascader: { className: 'ctx-cascader', style: { width: '210px' } },
        treeSelect: { className: 'ctx-treeselect', style: { width: '220px' } },
      },
      slots: {
        default: () => (
          <div>
            <Cascader options={[{ value: 'a', label: 'A' }]} />
            <TreeSelect treeData={[{ value: 't1', title: 'T1' }]} />
          </div>
        ),
      },
    });
    const cascaderEl = wrapper.find('.ant-cascader');
    expect(cascaderEl.classes()).toContain('ctx-cascader');
    expect(cascaderEl.element.getAttribute('style')).toContain('width: 210px');

    const tsEl = wrapper.find('.ant-tree-select');
    expect(tsEl.classes()).toContain('ctx-treeselect');
    expect(tsEl.element.getAttribute('style')).toContain('width: 220px');
  });
});
