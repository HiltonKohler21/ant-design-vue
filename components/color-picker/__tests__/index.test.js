import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import ColorPicker from '..';
import ConfigProvider from '../../config-provider';

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

  it('supports RTL CSS and ConfigProvider.colorPicker className/style', async () => {
    document.head.innerHTML = '';
    const wrapper = mount(ConfigProvider, {
      props: {
        direction: 'rtl',
        colorPicker: {
          className: 'cp-color-picker',
          style: { padding: '4px' },
        },
      },
      slots: { default: () => <ColorPicker /> },
    });
    await nextTick();
    const root = wrapper.find('.ant-color-picker');
    expect(root.classes()).toContain('ant-color-picker-rtl');
    expect(root.classes()).toContain('cp-color-picker');
    expect(root.attributes('style')).toContain('padding: 4px');

    const css = Array.from(document.querySelectorAll('style'))
      .map(s => s.innerHTML)
      .join('\n');
    expect(css).toContain('ant-color-picker-rtl');
  });
});
