import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import InputNumber from '..';

describe('InputNumber suffix & changeOnWheel', () => {
  describe('suffix', () => {
    it('supports suffix prop', () => {
      const wrapper = mount(InputNumber, {
        props: {
          defaultValue: 10,
          suffix: 'RMB',
        },
      });
      expect(wrapper.find('.ant-input-number-affix-wrapper').exists()).toBe(true);
      expect(wrapper.find('.ant-input-number-suffix').exists()).toBe(true);
      expect(wrapper.find('.ant-input-number-suffix').text()).toBe('RMB');
      expect(wrapper.find('.ant-input-number-prefix').exists()).toBe(false);
      wrapper.unmount();
    });

    it('supports #suffix slot', () => {
      const wrapper = mount(InputNumber, {
        props: {
          defaultValue: 10,
        },
        slots: {
          suffix: () => <span class="custom-suffix">%</span>,
        },
      });
      expect(wrapper.find('.ant-input-number-affix-wrapper').exists()).toBe(true);
      expect(wrapper.find('.ant-input-number-suffix .custom-suffix').text()).toBe('%');
      wrapper.unmount();
    });

    it('supports prefix and suffix together without duplicating className', () => {
      const wrapper = mount(InputNumber, {
        props: {
          defaultValue: 10,
          prefix: '￥',
          suffix: 'RMB',
          controls: false,
        },
        attrs: {
          class: 'my-custom-input',
        },
      });
      const affixWrapper = wrapper.find('.ant-input-number-affix-wrapper');
      const innerInput = wrapper.find('.ant-input-number');
      expect(affixWrapper.exists()).toBe(true);
      expect(affixWrapper.classes()).toContain('my-custom-input');
      expect(affixWrapper.classes()).toContain('ant-input-number-affix-wrapper-without-controls');
      expect(innerInput.classes()).not.toContain('my-custom-input');
      expect(wrapper.find('.ant-input-number-prefix').text()).toBe('￥');
      expect(wrapper.find('.ant-input-number-suffix').text()).toBe('RMB');
      wrapper.unmount();
    });
  });

  describe('changeOnWheel', () => {
    it('increments and decrements on wheel when focused and changeOnWheel is true', async () => {
      const onChange = jest.fn();
      const onStep = jest.fn();
      const wrapper = mount(InputNumber, {
        props: {
          defaultValue: 3,
          min: 1,
          max: 10,
          step: 2,
          changeOnWheel: true,
          onChange,
          onStep,
        },
      });
      await nextTick();
      const input = wrapper.find('input');
      await input.trigger('focus');

      await input.trigger('wheel', { deltaY: -100 });
      expect(onChange).toHaveBeenLastCalledWith(5);
      expect(onStep).toHaveBeenLastCalledWith(5, { offset: 2, type: 'up' });

      await input.trigger('wheel', { deltaY: 100 });
      expect(onChange).toHaveBeenLastCalledWith(3);
      expect(onStep).toHaveBeenLastCalledWith(3, { offset: 2, type: 'down' });

      wrapper.unmount();
    });

    it('does not change value on wheel when unfocused', async () => {
      const onChange = jest.fn();
      const wrapper = mount(InputNumber, {
        props: {
          defaultValue: 3,
          changeOnWheel: true,
          onChange,
        },
      });
      await nextTick();
      const input = wrapper.find('input');
      await input.trigger('wheel', { deltaY: -100 });
      expect(onChange).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it('does not change value on wheel when changeOnWheel is false (default)', async () => {
      const onChange = jest.fn();
      const wrapper = mount(InputNumber, {
        props: {
          defaultValue: 3,
          changeOnWheel: false,
          onChange,
        },
      });
      await nextTick();
      const input = wrapper.find('input');
      await input.trigger('focus');
      await input.trigger('wheel', { deltaY: -100 });
      expect(onChange).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it('does not change value on wheel when disabled or readonly', async () => {
      const onChange = jest.fn();
      const wrapper = mount(InputNumber, {
        props: {
          defaultValue: 3,
          changeOnWheel: true,
          readonly: true,
          onChange,
        },
      });
      await nextTick();
      const input = wrapper.find('input');
      await input.trigger('focus');
      await input.trigger('wheel', { deltaY: -100 });
      expect(onChange).not.toHaveBeenCalled();

      await wrapper.setProps({ readonly: false, disabled: true });
      await nextTick();
      await input.trigger('wheel', { deltaY: -100 });
      expect(onChange).not.toHaveBeenCalled();
      wrapper.unmount();
    });
  });
});
