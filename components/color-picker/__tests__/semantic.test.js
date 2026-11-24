import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ColorPicker from '..';
import ConfigProvider from '../../config-provider';

describe('ColorPicker v6 semantic classNames/styles, PurePanel & gradient presets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('supports object and function classNames/styles and merges ConfigProvider.colorPicker', async () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        colorPicker: {
          className: 'ctx-cp',
          style: { padding: '2px' },
          classNames: { root: 'ctx-cp-root', popup: { root: 'ctx-cp-popup' } },
          styles: { body: { borderRadius: '6px' } },
        },
      },
      slots: {
        default: () => (
          <ColorPicker
            open
            size="large"
            showText
            defaultValue="#722ed1"
            classNames={({ props }) => ({
              root: props.size === 'large' ? 'fn-cp-lg' : 'fn-cp-sm',
              body: 'fn-cp-body',
              content: 'fn-cp-content',
              description: 'fn-cp-desc',
              popup: {
                root: 'fn-cp-popup-root',
                container: 'fn-cp-popup-container',
              },
            })}
            styles={({ props }) => ({
              root: { borderColor: props.size === 'large' ? 'rgb(114, 46, 209)' : 'rgb(0, 0, 0)' },
              content: { opacity: 0.9 },
              description: { fontWeight: 700 },
              popup: {
                root: { border: '1px solid rgb(114, 46, 209)' },
                container: { padding: '4px' },
              },
            })}
          />
        ),
      },
      attachTo: document.body,
    });
    await nextTick();
    await new Promise(r => setTimeout(r, 50));

    const root = wrapper.find('.ant-color-picker');
    expect(root.classes()).toContain('ctx-cp');
    expect(root.classes()).toContain('ctx-cp-root');
    expect(root.classes()).toContain('fn-cp-lg');
    expect(root.attributes('style')).toContain('padding: 2px');
    expect(root.attributes('style')).toContain('border-color: rgb(114, 46, 209)');

    const body = wrapper.find('.ant-color-picker-color-block');
    expect(body.classes()).toContain('fn-cp-body');
    expect(body.attributes('style')).toContain('border-radius: 6px');

    const content = wrapper.find('.ant-color-picker-color-block-inner');
    expect(content.classes()).toContain('fn-cp-content');
    expect(content.attributes('style')).toContain('opacity: 0.9');

    const desc = wrapper.find('.ant-color-picker-trigger-text');
    expect(desc.classes()).toContain('fn-cp-desc');
    expect(desc.attributes('style')).toContain('font-weight: 700');

    const popoverEl = document.body.querySelector('.ant-color-picker-popover');
    expect(popoverEl).not.toBeNull();
    expect(popoverEl.classList.contains('ctx-cp-popup')).toBe(true);
    expect(popoverEl.classList.contains('fn-cp-popup-root')).toBe(true);

    const innerEl = document.body.querySelector('.ant-popover-inner');
    expect(innerEl).not.toBeNull();
    expect(innerEl.classList.contains('fn-cp-popup-container')).toBe(true);
    expect(innerEl.getAttribute('style')).toContain('padding: 4px');

    wrapper.unmount();
  });

  it('renders ColorPicker._InternalPanelDoNotUseOrYouWillBeFired PurePanel interactively', async () => {
    const PurePanel = ColorPicker._InternalPanelDoNotUseOrYouWillBeFired;
    expect(PurePanel).toBeDefined();

    const onChange = jest.fn();
    const wrapper = mount(PurePanel, {
      props: {
        value: '#1677ff',
        presets: [{ label: 'Quick', colors: ['#52c41a'] }],
        onChange,
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-color-picker-pure').exists()).toBe(true);
    expect(wrapper.find('.ant-color-picker-panel').exists()).toBe(true);

    await wrapper.find('.ant-color-picker-panel-presets-color').trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledWith('#52c41a');
    wrapper.unmount();
  });

  it('supports gradient presets without throwing and selects linear-gradient', async () => {
    const onChange = jest.fn();
    const wrapper = mount(ColorPicker, {
      props: {
        open: true,
        mode: ['single', 'gradient'],
        presets: [
          {
            label: 'Liner',
            colors: [
              [
                { color: 'rgb(42, 188, 191)', percent: 0 },
                { color: 'rgb(56, 54, 221)', percent: 100 },
              ],
            ],
            defaultOpen: true,
          },
        ],
        onChange,
      },
      attachTo: document.body,
    });
    await new Promise(r => setTimeout(r, 50));

    const preset = document.body.querySelector('.ant-color-picker-panel-presets-color');
    expect(preset).not.toBeNull();
    preset.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();
    expect(onChange).toHaveBeenCalledWith(
      'linear-gradient(90deg, rgb(42, 188, 191) 0%, rgb(56, 54, 221) 100%)',
    );
    expect(document.body.querySelector('.ant-color-picker-panel-gradient-slider')).not.toBeNull();

    wrapper.unmount();
  });
});
