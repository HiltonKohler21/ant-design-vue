import { mount } from '@vue/test-utils';
import Typography from '..';

describe('Typography italic', () => {
  it('italic 渲染 <i> 标签', () => {
    const wrapper = mount(Typography.Text, {
      props: { italic: true },
      slots: { default: () => 'italic text' },
    });
    expect(wrapper.html()).toContain('<i>');
  });
});
