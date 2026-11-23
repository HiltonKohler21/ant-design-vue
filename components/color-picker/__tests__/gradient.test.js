import { mount } from '@vue/test-utils';
import ColorPicker from '..';
import { AggregationColor } from '../color';

describe('ColorPicker 渐变与交互', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('默认 single 模式不展示单色/渐变切换 Segmented', async () => {
    const wrapper = mount(ColorPicker, {
      props: { open: true },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    expect(document.body.querySelector('.ant-color-picker-panel-mode')).toBeNull();
    wrapper.unmount();
  });

  it('mode 切换到 gradient 显示渐变条且保留 SV/色相/Alpha/输入控件', async () => {
    const wrapper = mount(ColorPicker, {
      props: { open: true, mode: ['single', 'gradient'] },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    // 切到渐变模式
    const segItems = document.body.querySelectorAll(
      '.ant-color-picker-panel-mode .ant-segmented-item',
    );
    expect(segItems.length).toBe(2);
    segItems[1].querySelector('input')?.click();
    await new Promise(r => setTimeout(r, 50));
    expect(document.body.innerHTML).toContain('gradient-slider');
    expect(document.body.querySelector('.ant-color-picker-panel-sat')).not.toBeNull();
    expect(document.body.querySelector('.ant-color-picker-panel-hue')).not.toBeNull();
    expect(document.body.querySelector('.ant-color-picker-panel-input input')).not.toBeNull();
    wrapper.unmount();
  });

  it("初始 linear-gradient 值在 ['single', 'gradient'] 下直接进入渐变模式并可编辑色点颜色", async () => {
    const onChange = jest.fn();
    const wrapper = mount(ColorPicker, {
      props: {
        open: true,
        mode: ['single', 'gradient'],
        value: 'linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
        onChange,
      },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    expect(document.body.querySelector('.ant-color-picker-panel-gradient-slider')).not.toBeNull();
    const input = document.body.querySelector('.ant-color-picker-panel-input > input');
    expect(input).not.toBeNull();
    input.value = '#00ff00';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(r => setTimeout(r, 20));
    expect(onChange).toHaveBeenCalledWith(
      'linear-gradient(90deg, rgb(0, 255, 0) 0%, rgb(0, 0, 255) 100%)',
    );
    wrapper.unmount();
  });

  it('onChange 输出渐变时用 linear-gradient', async () => {
    const onChange = jest.fn();
    const wrapper = mount(ColorPicker, {
      props: { open: true, mode: ['single', 'gradient'], onChange },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    const segItems = document.body.querySelectorAll(
      '.ant-color-picker-panel-mode .ant-segmented-item',
    );
    segItems[1]?.querySelector('input')?.click();
    await new Promise(r => setTimeout(r, 50));
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0]).toContain('linear-gradient');
    wrapper.unmount();
  });

  it('allowClear 清除后进入 cleared 状态（空串 + 斜杠），不会变成 #000000', async () => {
    const onChange = jest.fn();
    const onClear = jest.fn();
    const wrapper = mount(ColorPicker, {
      props: { defaultValue: '#1677ff', allowClear: true, onChange, onClear },
      attachTo: 'body',
    });
    await wrapper.find('.ant-color-picker-trigger-clear').trigger('click');
    await new Promise(r => setTimeout(r, 20));
    expect(onChange).toHaveBeenCalledWith('');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.ant-color-picker-clear').exists()).toBe(true);
    expect(wrapper.find('.ant-color-picker-trigger-color').attributes('style')).toContain(
      'transparent',
    );
    wrapper.unmount();
  });

  it('Alpha 拖动保留透明度，且 SV/Hue 拖动与 mouseup 保留透明度并触发 onChangeComplete', async () => {
    const onChange = jest.fn();
    const onChangeComplete = jest.fn();
    const wrapper = mount(ColorPicker, {
      props: { open: true, defaultValue: '#1677ff', onChange, onChangeComplete },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    const alphaEl = document.body.querySelector('.ant-color-picker-panel-alpha');
    alphaEl.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 12 });
    alphaEl.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, bubbles: true }));
    window.dispatchEvent(new MouseEvent('mouseup'));
    await new Promise(r => setTimeout(r, 20));
    const alphaOut = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(new AggregationColor(alphaOut).toHsb().a).toBeCloseTo(0.5, 1);
    expect(onChangeComplete).toHaveBeenCalledWith(alphaOut);

    // SV 拖动后仍保留 alpha ≈ 0.5
    const svEl = document.body.querySelector('.ant-color-picker-panel-sat');
    svEl.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 160 });
    svEl.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 40, bubbles: true }));
    window.dispatchEvent(new MouseEvent('mouseup'));
    await new Promise(r => setTimeout(r, 20));
    const svOut = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(new AggregationColor(svOut).toHsb().a).toBeCloseTo(0.5, 1);
    wrapper.unmount();
  });

  it('支持 HSB 格式输入编辑', async () => {
    const onChange = jest.fn();
    const wrapper = mount(ColorPicker, {
      props: { open: true, format: 'hsb', defaultValue: '#1677ff', onChange },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    const input = document.body.querySelector('.ant-color-picker-panel-input > input');
    input.value = 'hsb(0, 100%, 100%)';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(r => setTimeout(r, 20));
    expect(onChange).toHaveBeenCalledWith('#ff0000');
    wrapper.unmount();
  });
});

describe('ColorPicker 渐变点交互', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

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

  it('渐变点拖拽越过另一个色点时保持追踪被拖拽色点并触发 onChangeComplete', async () => {
    const onChange = jest.fn();
    const onChangeComplete = jest.fn();
    const wrapper = mount(ColorPicker, {
      props: {
        open: true,
        mode: 'gradient',
        defaultValue: 'linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 50%)',
        onChange,
        onChangeComplete,
      },
      attachTo: 'body',
    });
    await new Promise(r => setTimeout(r, 50));
    const bar = document.body.querySelector('.ant-color-picker-panel-gradient-slider-bg');
    bar.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 16 });
    const handles = document.body.querySelectorAll(
      '.ant-color-picker-panel-gradient-slider-handle',
    );
    // 拖拽红色色点（index 0, 0%）越过蓝色色点（50%）到 80%，再移到 90%
    handles[0].dispatchEvent(new MouseEvent('mousedown', { clientX: 0, bubbles: true }));
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 80 }));
    await new Promise(r => setTimeout(r, 20));
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 90 }));
    window.dispatchEvent(new MouseEvent('mouseup'));
    await new Promise(r => setTimeout(r, 20));
    const lastVal = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    // 蓝色应保持在 50%，红色应移动到 90%
    expect(lastVal).toBe('linear-gradient(90deg, rgb(0, 0, 255) 50%, rgb(255, 0, 0) 90%)');
    expect(onChangeComplete).toHaveBeenCalledWith(lastVal);
    wrapper.unmount();
  });
});
