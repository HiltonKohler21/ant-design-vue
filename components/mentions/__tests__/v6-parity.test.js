import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Mentions from '..';
import ConfigProvider from '../../config-provider';
import Flex from '../../flex';
import Divider from '../../divider';
import { sleep } from '../../../tests/utils';
import StyleClassDemo from '../demo/style-class.vue';
import SizeDemo from '../demo/size.vue';
import PopupRenderDemo from '../demo/popupRender.vue';
import AllowClearDemo from '../demo/allowClear.vue';
import AutoSizeDemo from '../demo/autoSize.vue';
import AutosizeDebugDemo from '../demo/autosize-textarea-debug.vue';
import RenderPanelDemo from '../demo/render-panel.vue';

jest.mock('ant-design-vue', () => ({
  Mentions: require('..').default,
  Divider: require('../../divider').default,
  theme: require('../../theme').default,
}));

const demoPlugins = [Mentions, ConfigProvider, Flex, Divider];

function triggerInput(wrapper, text = '') {
  const lastChar = text[text.length - 1];
  const textarea = wrapper.find('textarea');
  textarea.element.value = text;
  textarea.element.selectionStart = text.length;
  textarea.trigger('keydown');
  textarea.trigger('input');
  textarea.trigger('keyup', { key: lastChar });
}

describe('Mentions v6 parity: semantic classNames/styles, size, popupRender, allowClear, autoSize, PurePanel', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('supports object & functional classNames/styles merging ConfigProvider.mentions across root, textarea, suffix, popup', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const wrapper = mount(
        ConfigProvider,
        {
          props: {
            mentions: {
              className: 'ctx-mentions-cls',
              style: { margin: '4px' },
              classNames: ({ props }) => ({
                root: `ctx-root-${props.variant}`,
                textarea: 'ctx-ta',
                suffix: 'ctx-suffix',
                popup: 'ctx-popup',
              }),
              styles: {
                root: { padding: '2px' },
                textarea: { letterSpacing: '1px' },
                popup: { padding: '6px' },
              },
            },
          },
          slots: {
            default: () => (
              <Mentions
                variant="filled"
                allowClear
                defaultValue="@"
                options={[{ value: 'afc163', label: 'afc163' }]}
                classNames={({ props }) => ({
                  root: `prop-root-${props.variant}`,
                  textarea: 'prop-ta',
                  suffix: 'prop-suffix',
                  popup: 'prop-popup',
                })}
                styles={() => ({
                  root: { borderColor: 'rgb(114, 46, 209)' },
                  textarea: { fontSize: '15px' },
                  suffix: { color: 'rgb(1, 2, 3)' },
                  popup: { borderColor: 'rgb(114, 46, 209)' },
                })}
              />
            ),
          },
        },
        { attachTo: document.body },
      );

      const root = wrapper.find('.ant-mentions');
      expect(root.classes()).toContain('ctx-mentions-cls');
      expect(root.classes()).toContain('ctx-root-filled');
      expect(root.classes()).toContain('prop-root-filled');
      expect(root.attributes('style')).toContain('margin: 4px');
      expect(root.attributes('style')).toContain('border-color: rgb(114, 46, 209)');

      const ta = wrapper.find('textarea');
      expect(ta.classes()).toContain('ctx-ta');
      expect(ta.classes()).toContain('prop-ta');
      expect(ta.attributes('style')).toContain('letter-spacing: 1px');
      expect(ta.attributes('style')).toContain('font-size: 15px');

      const suffix = wrapper.find('.ant-mentions-suffix');
      expect(suffix.classes()).toContain('ctx-suffix');
      expect(suffix.classes()).toContain('prop-suffix');
      expect(suffix.attributes('style')).toContain('color: rgb(1, 2, 3)');

      triggerInput(wrapper, '@');
      await sleep(50);
      const popup = document.body.querySelector('.ant-mentions-dropdown');
      expect(popup).toBeTruthy();
      expect(popup.classList.contains('ctx-popup')).toBe(true);
      expect(popup.classList.contains('prop-popup')).toBe(true);
      expect(popup.getAttribute('style')).toContain('border-color: rgb(114, 46, 209)');

      const propWarns = warnSpy.mock.calls.filter(args => String(args[0]).includes('Invalid prop'));
      expect(propWarns).toHaveLength(0);
      wrapper.unmount();
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('supports size prop (large/small) and ConfigProvider.componentSize', () => {
    const lg = mount(Mentions, { props: { size: 'large' } });
    expect(lg.find('.ant-mentions').classes()).toContain('ant-mentions-lg');

    const sm = mount(Mentions, { props: { size: 'small' } });
    expect(sm.find('.ant-mentions').classes()).toContain('ant-mentions-sm');

    const fromCtx = mount(ConfigProvider, {
      props: { componentSize: 'large' },
      slots: { default: () => <Mentions /> },
    });
    expect(fromCtx.find('.ant-mentions').classes()).toContain('ant-mentions-lg');
  });

  it('supports popupRender prop', async () => {
    const wrapper = mount(
      Mentions,
      {
        props: {
          options: [
            { value: 'afc163', label: 'afc163' },
            { value: 'zombieJ', label: 'zombieJ' },
          ],
          popupRender: menu => (
            <div class="custom-popup-wrapper">
              <div class="custom-header">Custom Header</div>
              {menu}
            </div>
          ),
        },
      },
      { attachTo: document.body },
    );

    triggerInput(wrapper, '@');
    await sleep(50);
    expect(document.body.querySelector('.custom-popup-wrapper')).toBeTruthy();
    expect(document.body.querySelector('.custom-header').textContent).toBe('Custom Header');
    expect(document.body.querySelectorAll('.ant-mentions-dropdown-menu-item').length).toBe(2);
    wrapper.unmount();
  });

  it('supports allowClear boolean/object and clears value with clear event', async () => {
    const onChange = jest.fn();
    const onClear = jest.fn();
    const wrapper = mount(Mentions, {
      props: {
        defaultValue: 'hello world',
        allowClear: { clearIcon: <span class="custom-clear-x">X</span> },
        onChange,
        onClear,
      },
    });

    expect(wrapper.find('.ant-mentions').classes()).toContain('ant-mentions-has-suffix');
    expect(wrapper.find('.custom-clear-x').exists()).toBe(true);
    await wrapper.find('.ant-mentions-clear-icon').trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenLastCalledWith('');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.ant-mentions-clear-icon').classes()).toContain(
      'ant-mentions-clear-icon-hidden',
    );
    wrapper.unmount();
  });

  it('supports autoSize and _InternalPanelDoNotUseOrYouWillBeFired PurePanel', async () => {
    const autoSizeWrapper = mount(Mentions, {
      props: {
        autoSize: { minRows: 2, maxRows: 6 },
        defaultValue: 'line1\nline2',
      },
    });
    await nextTick();
    expect(autoSizeWrapper.find('textarea').exists()).toBe(true);
    autoSizeWrapper.unmount();

    const PurePanel = Mentions._InternalPanelDoNotUseOrYouWillBeFired;
    expect(PurePanel).toBeTruthy();
    const panelWrapper = mount(PurePanel, {
      props: {
        value: '@',
        options: [
          { value: 'afc163', label: 'afc163' },
          { value: 'zombieJ', label: 'zombieJ' },
        ],
      },
    });
    expect(panelWrapper.find('.ant-mentions').exists()).toBe(true);
    expect(panelWrapper.find('.ant-mentions-dropdown-pure').exists()).toBe(true);
    expect(panelWrapper.findAll('.ant-mentions-dropdown-menu-item')).toHaveLength(2);
    panelWrapper.unmount();
  });

  it('mounts all 7 new mentions demos cleanly without errors', () => {
    const demos = [
      StyleClassDemo,
      SizeDemo,
      PopupRenderDemo,
      AllowClearDemo,
      AutoSizeDemo,
      AutosizeDebugDemo,
      RenderPanelDemo,
    ];
    demos.forEach(Demo => {
      const wrapper = mount(Demo, { global: { plugins: demoPlugins } });
      expect(wrapper.html().length).toBeGreaterThan(0);
      wrapper.unmount();
    });
  });
});
