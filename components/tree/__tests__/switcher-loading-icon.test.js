import { mount } from '@vue/test-utils';
import Tree from '..';

describe('Tree switcherLoadingIcon', () => {
  it('声明 switcherLoadingIcon 属性', () => {
    const wrapper = mount(Tree, {
      props: {
        treeData: [],
        switcherLoadingIcon: <span class="loading-icon">loading</span>,
      },
    });
    expect(wrapper.vm.$props.switcherLoadingIcon).toBeDefined();
  });
});
