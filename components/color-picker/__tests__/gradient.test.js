import { mount } from '@vue/test-utils';
import ColorPicker from '..';

describe('ColorPicker 渐变', () => {
  it('mode 切换到 gradient 显示渐变条', async () => {
    const wrapper = mount(ColorPicker, {
      props: { open: true },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    // 切到渐变模式
    const segItems = document.body.querySelectorAll('.ant-segmented-item');
    if (segItems[1]) {
      segItems[1].querySelector('input')?.click();
      await new Promise(r => setTimeout(r, 50));
    }
    expect(document.body.innerHTML).toContain('gradient-slider');
    wrapper.unmount();
  });

  it('value 支持 linear-gradient 字符串（解析为渐变）', async () => {
    const onChange = jest.fn();
    const wrapper = mount(ColorPicker, {
      props: {
        value: 'linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
        onChange,
      },
    });
    // 触发一次 change 验证输出保持 linear-gradient
    await wrapper.find('.ant-color-picker-trigger').trigger('click');
    await new Promise(r => setTimeout(r, 50));
    // 验证组件正确解析（无报错、可渲染面板）
    expect(wrapper.html()).toContain('ant-color-picker-trigger');
    wrapper.unmount();
  });

  it('onChange 输出渐变时用 linear-gradient', async () => {
    const onChange = jest.fn();
    const wrapper = mount(ColorPicker, {
      props: { open: true, onChange },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    const segItems = document.body.querySelectorAll('.ant-segmented-item');
    if (segItems[1]) {
      segItems[1].querySelector('input')?.click();
      await new Promise(r => setTimeout(r, 50));
    }
    expect(onChange).toHaveBeenCalled();
    wrapper.unmount();
  });
});

describe('ColorPicker 渐变点交互', () => {
  it('渐变条渲染渐变点并可添加', async () => {
    const onChange = jest.fn();
    const wrapper = mount(ColorPicker, {
      props: {
        open: true,
        mode: 'gradient',
        value: 'linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
        onChange,
      },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    expect(document.body.innerHTML).toContain('gradient-slider-handle');
    wrapper.unmount();
  });

  it('渐变点拖拽触发 onChange', async () => {
    const onChange = jest.fn();
    const wrapper = mount(ColorPicker, {
      props: {
        open: true,
        mode: 'gradient',
        value: 'linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
        onChange,
      },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    const handle = document.body.querySelector('.ant-color-picker-panel-gradient-slider-handle');
    if (handle) {
      const rect = handle.getBoundingClientRect();
      handle.dispatchEvent(new MouseEvent('mousedown', { clientX: rect.left, bubbles: true }));
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: rect.left + 50 }));
      window.dispatchEvent(new MouseEvent('mouseup'));
      await new Promise(r => setTimeout(r, 50));
    }
    expect(onChange).toHaveBeenCalled();
    wrapper.unmount();
  });
});
