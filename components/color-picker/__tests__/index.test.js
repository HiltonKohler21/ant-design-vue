import { mount } from '@vue/test-utils';
import ColorPicker from '..';

describe('ColorPicker', () => {
  it('renders trigger with default color', () => {
    const wrapper = mount(ColorPicker);
    expect(wrapper.find('.ant-color-picker-trigger').exists()).toBe(true);
  });

  it('supports v-model value', () => {
    const wrapper = mount(ColorPicker, { props: { value: '#ff0000' } });
    const colorBlock = wrapper.find('.ant-color-picker-trigger-color');
    expect(colorBlock.element.getAttribute('style')).toContain('rgb(255, 0, 0)');
  });

  it('supports rootClassName', () => {
    const wrapper = mount(ColorPicker, { props: { rootClassName: 'my-color' } });
    expect(wrapper.html()).toContain('my-color');
  });

  it('opens popover with panel on click', async () => {
    const wrapper = mount(ColorPicker);
    await wrapper.find('.ant-color-picker-trigger').trigger('click');
    // popover 挂载在 body
    await new Promise(r => setTimeout(r, 50));
    expect(document.body.innerHTML).toContain('ant-color-picker-panel');
    wrapper.unmount();
  });

  it('renders presets', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        open: true,
        presets: [{ label: '推荐', colors: ['#ff0000', '#00ff00'] }],
      },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    expect(document.body.innerHTML).toContain('ant-color-picker-panel-presets');
    wrapper.unmount();
  });

  it('emits change when clicking preset', async () => {
    const onChange = jest.fn();
    const wrapper = mount(ColorPicker, {
      props: {
        open: true,
        presets: [{ label: '推荐', colors: ['#123456'] }],
        onChange,
      },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    const preset = document.body.querySelector('.ant-color-picker-panel-presets-color');
    preset?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onChange).toHaveBeenCalled();
    wrapper.unmount();
  });
});
