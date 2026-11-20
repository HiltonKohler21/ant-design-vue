import { mount } from '@vue/test-utils';
import Cascader from '..';

describe('Cascader dropdownMenuColumnStyle/popupMenuColumnStyle', () => {
  it('声明两个列样式属性', () => {
    const wrapper = mount(Cascader, {
      props: {
        options: [{ value: 'a', label: 'A' }],
        dropdownMenuColumnStyle: { width: '200px' },
        popupMenuColumnStyle: { width: '300px' },
      },
    });
    expect(wrapper.vm.$props.dropdownMenuColumnStyle).toEqual({ width: '200px' });
    expect(wrapper.vm.$props.popupMenuColumnStyle).toEqual({ width: '300px' });
  });
});
