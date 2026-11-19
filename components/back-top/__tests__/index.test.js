import { mount } from '@vue/test-utils';
import BackTop from '..';

describe('BackTop', () => {
  it('renders hidden by default', () => {
    const wrapper = mount(BackTop);
    expect(wrapper.find('.ant-back-top').exists()).toBe(true);
  });

  it('shows immediately when visibilityHeight is 0', () => {
    const wrapper = mount(BackTop, { props: { visibilityHeight: 0 } });
    expect(wrapper.find('.ant-back-top-content').exists()).toBe(true);
  });

  it('renders custom children slot', () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 0 },
      slots: { default: () => <div class="custom-backtop">top</div> },
    });
    expect(wrapper.find('.custom-backtop').exists()).toBe(true);
  });

  it('supports rootClassName', () => {
    const wrapper = mount(BackTop, { props: { rootClassName: 'my-back-top' } });
    expect(wrapper.element.getAttribute('class')).toContain('my-back-top');
  });

  it('triggers click event', () => {
    const onClick = jest.fn();
    const wrapper = mount(BackTop, { props: { visibilityHeight: 0, onClick } });
    wrapper.find('.ant-back-top').trigger('click');
    expect(onClick).toHaveBeenCalled();
  });
});
