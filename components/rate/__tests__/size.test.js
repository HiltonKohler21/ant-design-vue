import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Rate from '..';
import ConfigProvider from '../../config-provider';

describe('Rate size', () => {
  it('applies size classes for small, large, middle, medium and default', async () => {
    const wrapper = mount(Rate);
    expect(wrapper.classes()).toContain('ant-rate');
    expect(wrapper.classes()).not.toContain('ant-rate-small');
    expect(wrapper.classes()).not.toContain('ant-rate-large');

    await wrapper.setProps({ size: 'small' });
    await nextTick();
    expect(wrapper.classes()).toContain('ant-rate-small');
    expect(wrapper.classes()).not.toContain('ant-rate-large');

    await wrapper.setProps({ size: 'large' });
    await nextTick();
    expect(wrapper.classes()).toContain('ant-rate-large');
    expect(wrapper.classes()).not.toContain('ant-rate-small');

    await wrapper.setProps({ size: 'middle' });
    await nextTick();
    expect(wrapper.classes()).not.toContain('ant-rate-small');
    expect(wrapper.classes()).not.toContain('ant-rate-large');

    await wrapper.setProps({ size: 'medium' });
    await nextTick();
    expect(wrapper.classes()).not.toContain('ant-rate-small');
    expect(wrapper.classes()).not.toContain('ant-rate-large');
  });

  it('inherits ConfigProvider componentSize and allows explicit size override', () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'large' },
      slots: {
        default: () => (
          <div>
            <Rate class="inherited-rate" />
            <Rate class="override-small" size="small" />
            <Rate class="override-medium" size="medium" />
          </div>
        ),
      },
    });

    expect(wrapper.find('.inherited-rate').classes()).toContain('ant-rate-large');
    expect(wrapper.find('.override-small').classes()).toContain('ant-rate-small');
    expect(wrapper.find('.override-small').classes()).not.toContain('ant-rate-large');
    expect(wrapper.find('.override-medium').classes()).not.toContain('ant-rate-small');
    expect(wrapper.find('.override-medium').classes()).not.toContain('ant-rate-large');
  });
});
