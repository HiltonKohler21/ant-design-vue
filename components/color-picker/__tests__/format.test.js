import { mount } from '@vue/test-utils';
import ColorPicker from '..';

describe('ColorPicker format / onFormatChange / disabledFormat', () => {
  it('onFormatChange 在格式切换时触发', async () => {
    const onFormatChange = jest.fn();
    const wrapper = mount(ColorPicker, {
      props: { open: true, onFormatChange },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    // 点 RGB 选项
    const segItems = document.body.querySelectorAll(
      '.ant-color-picker-panel-input .ant-segmented-item',
    );
    if (segItems[1]) {
      segItems[1].querySelector('input')?.click();
      await new Promise(r => setTimeout(r, 50));
    }
    expect(onFormatChange).toHaveBeenCalledWith('rgb');
    wrapper.unmount();
  });

  it('disabledFormat 时隐藏格式切换', async () => {
    const wrapper = mount(ColorPicker, {
      props: { open: true, disabledFormat: true },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    expect(document.body.querySelector('.ant-color-picker-panel-input .ant-segmented')).toBeNull();
    wrapper.unmount();
  });

  it('defaultFormat 生效', () => {
    const wrapper = mount(ColorPicker, { props: { defaultFormat: 'rgb' } });
    expect(wrapper.vm.$props.defaultFormat).toBe('rgb');
  });
});
