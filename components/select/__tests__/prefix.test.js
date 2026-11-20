import { mount } from '@vue/test-utils';
import Select from '..';

describe('Select prefix', () => {
  it('prefix 渲染在选择器内', () => {
    const wrapper = mount(Select, {
      props: { prefix: <span class="sel-prefix">P</span> },
      slots: { default: () => [<Select.Option value="a">A</Select.Option>] },
    });
    expect(wrapper.html()).toContain('sel-prefix');
  });
});
