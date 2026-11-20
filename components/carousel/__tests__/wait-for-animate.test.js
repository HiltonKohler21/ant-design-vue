import { mount } from '@vue/test-utils';
import Carousel from '..';

describe('Carousel waitForAnimate', () => {
  it('声明 waitForAnimate 属性并透传', () => {
    const wrapper = mount(Carousel, { props: { waitForAnimate: true } });
    expect(wrapper.vm.$props.waitForAnimate).toBe(true);
  });
});
