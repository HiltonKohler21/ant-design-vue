import { mount } from '@vue/test-utils';
import Splitter from '..';

describe('Splitter', () => {
  it('renders panels and split bars', () => {
    const wrapper = mount(Splitter, {
      slots: {
        default: () => [<Splitter.Panel size="30%" />, <Splitter.Panel />],
      },
    });
    expect(wrapper.find('.ant-splitter').exists()).toBe(true);
    expect(wrapper.findAll('.ant-splitter-panel').length).toBe(2);
    expect(wrapper.findAll('.ant-splitter-bar').length).toBe(1);
  });

  it('supports vertical layout', () => {
    const wrapper = mount(Splitter, {
      props: { layout: 'vertical' },
      slots: {
        default: () => [<Splitter.Panel />, <Splitter.Panel />],
      },
    });
    expect(wrapper.element.getAttribute('class')).toContain('ant-splitter-vertical');
  });

  it('supports rootClassName', () => {
    const wrapper = mount(Splitter, {
      props: { rootClassName: 'my-splitter' },
      slots: {
        default: () => [<Splitter.Panel />, <Splitter.Panel />],
      },
    });
    expect(wrapper.element.getAttribute('class')).toContain('my-splitter');
  });

  it('marks panel hidden when size is 0', () => {
    const wrapper = mount(Splitter, {
      slots: {
        default: () => [<Splitter.Panel size={0} />, <Splitter.Panel />],
      },
    });
    expect(wrapper.find('.ant-splitter-panel-hidden').exists()).toBe(true);
  });

  it('exposes Panel as static property', () => {
    expect(Splitter.Panel).toBeDefined();
  });
});
