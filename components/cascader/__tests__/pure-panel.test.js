import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Cascader from '..';

describe('Cascader PurePanel (_InternalPanelDoNotUseOrYouWillBeFired)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders Cascader._InternalPanelDoNotUseOrYouWillBeFired inline inside holder', async () => {
    const InternalCascader = Cascader._InternalPanelDoNotUseOrYouWillBeFired;
    expect(InternalCascader).toBeTruthy();

    const wrapper = mount(InternalCascader, {
      props: {
        options: [
          {
            value: 'zhejiang',
            label: 'Zhejiang',
            children: [{ value: 'hangzhou', label: 'Hangzhou' }],
          },
        ],
        placeholder: 'Please select',
      },
      attachTo: document.body,
    });
    await nextTick();
    await nextTick();

    expect(wrapper.find('.ant-cascader').exists()).toBe(true);
    expect(wrapper.find('.ant-cascader-dropdown').exists()).toBe(true);
    expect(wrapper.text()).toContain('Zhejiang');
    wrapper.unmount();
  });
});
