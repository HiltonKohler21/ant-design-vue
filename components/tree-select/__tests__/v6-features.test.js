import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import TreeSelect from '..';

const treeData = [
  {
    title: 'Parent 1',
    value: 'parent1',
    children: [
      { title: 'Child 1-1', value: 'child1-1' },
      { title: 'Child 1-2', value: 'child1-2' },
    ],
  },
  {
    title: 'Parent 2',
    value: 'parent2',
    children: [
      { title: 'Child 2-1', value: 'child2-1' },
      { title: 'Child 2-2', value: 'child2-2' },
    ],
  },
];

describe('TreeSelect v6 features: PurePanel, maxCount, variant', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('exposes _InternalPanelDoNotUseOrYouWillBeFired (PurePanel) and renders dropdown inside holder', async () => {
    const InternalTreeSelect = TreeSelect._InternalPanelDoNotUseOrYouWillBeFired;
    expect(InternalTreeSelect).toBeTruthy();

    const wrapper = mount(InternalTreeSelect, {
      props: {
        defaultValue: 'child1-1',
        treeData,
      },
      attachTo: document.body,
    });
    await nextTick();
    await nextTick();

    expect(wrapper.find('.ant-tree-select').exists()).toBe(true);
    expect(wrapper.find('.ant-tree-select-dropdown').exists()).toBe(true);
    expect(wrapper.text()).toContain('Parent 1');
    wrapper.unmount();
  });

  it('supports variant prop (outlined, filled, borderless, underlined)', () => {
    const variants = ['outlined', 'filled', 'borderless', 'underlined'];
    variants.forEach(variant => {
      const wrapper = mount(TreeSelect, {
        props: {
          variant,
          treeData,
        },
      });
      if (variant !== 'outlined') {
        expect(wrapper.find(`.ant-select-${variant}`).exists()).toBe(true);
      } else {
        expect(wrapper.find('.ant-tree-select').exists()).toBe(true);
      }
      wrapper.unmount();
    });
  });

  it('supports maxCount in multiple / treeCheckable mode and disables unselected leaves at limit', async () => {
    const onChange = jest.fn();
    const wrapper = mount(TreeSelect, {
      props: {
        treeData,
        multiple: true,
        treeCheckable: true,
        treeDefaultExpandAll: true,
        open: true,
        maxCount: 2,
        defaultValue: ['child1-1', 'child1-2'],
        showCheckedStrategy: TreeSelect.SHOW_CHILD,
        onChange,
      },
      attachTo: document.body,
    });
    await nextTick();

    const disabledCheckboxes = document.body.querySelectorAll('.ant-select-tree-checkbox-disabled');
    expect(disabledCheckboxes.length).toBeGreaterThan(0);

    // Clicking disabled checkbox should not exceed maxCount
    disabledCheckboxes[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();
    expect(onChange).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('ignores maxCount when showCheckedStrategy is SHOW_PARENT', async () => {
    const wrapper = mount(TreeSelect, {
      props: {
        treeData,
        multiple: true,
        treeCheckable: true,
        treeDefaultExpandAll: true,
        open: true,
        maxCount: 1,
        defaultValue: ['parent1'],
        showCheckedStrategy: TreeSelect.SHOW_PARENT,
      },
      attachTo: document.body,
    });
    await nextTick();

    const disabledCheckboxes = document.body.querySelectorAll('.ant-select-tree-checkbox-disabled');
    expect(disabledCheckboxes.length).toBe(0);
    wrapper.unmount();
  });
});
