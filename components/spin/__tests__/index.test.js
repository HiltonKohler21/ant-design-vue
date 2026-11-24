import { mount } from '@vue/test-utils';
import Spin from '..';

describe('Spin', () => {
  it('should apply style to root when set style to a nested <Spin>xx</Spin>', () => {
    const wrapper = mount({
      render() {
        return (
          <Spin style={{ background: 'red' }}>
            <div>content</div>
          </Spin>
        );
      },
    });
    expect(wrapper.find('.ant-spin').attributes('style')).toContain('background: red');
    expect(wrapper.find('.ant-spin-nested-loading').exists()).toBe(true);
    expect(wrapper.find('.ant-spin-container.ant-spin-blur').exists()).toBe(true);
    expect(wrapper.find('.ant-spin-section').exists()).toBe(true);
  });

  it("should render custom indicator when it's set", () => {
    const wrapper = mount({
      render() {
        return <Spin indicator={<div class="custom-indicator" />}></Spin>;
      },
    });
    const indicator = wrapper.find('.custom-indicator');
    expect(indicator.exists()).toBe(true);
    expect(indicator.classes()).toContain('ant-spin-dot');
    expect(wrapper.find('.ant-spin-dot-spin').exists()).toBe(false);
  });

  it('should be controlled by spinning', async () => {
    const wrapper = mount(Spin, {
      props: {
        spinning: false,
      },
    });
    expect(wrapper.props('spinning')).toBe(false);
    expect(wrapper.find('.ant-spin').classes()).not.toContain('ant-spin-spinning');
    await wrapper.setProps({ spinning: true });
    expect(wrapper.props('spinning')).toBe(true);
    expect(wrapper.find('.ant-spin').classes()).toContain('ant-spin-spinning');
  });
});
