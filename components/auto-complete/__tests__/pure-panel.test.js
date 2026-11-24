import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import AutoComplete from '..';

describe('AutoComplete PurePanel, variant, and showSearch object', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('exposes _InternalPanelDoNotUseOrYouWillBeFired (PurePanel) and respects open prop', async () => {
    const InternalAutoComplete = AutoComplete._InternalPanelDoNotUseOrYouWillBeFired;
    expect(InternalAutoComplete).toBeTruthy();

    const wrapper = mount(InternalAutoComplete, {
      props: {
        defaultValue: 'lucy',
        open: true,
        options: [
          { label: 'Jack', value: 'jack' },
          { label: 'Lucy', value: 'lucy' },
        ],
      },
      attachTo: document.body,
    });
    await nextTick();
    await nextTick();

    expect(wrapper.find('.ant-select-auto-complete').exists()).toBe(true);
    expect(wrapper.find('.ant-select-dropdown').exists()).toBe(true);
    expect(wrapper.text()).toContain('Jack');
    wrapper.unmount();
  });

  it('supports variant classes and showSearch object without prop warnings', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const onSearch = jest.fn();
    try {
      const variants = ['outlined', 'filled', 'borderless', 'underlined'];
      for (const variant of variants) {
        const wrapper = mount(AutoComplete, {
          props: {
            variant,
            showSearch: { onSearch },
            options: [{ value: 'a' }],
          },
        });
        if (variant !== 'outlined') {
          expect(wrapper.find(`.ant-select-${variant}`).exists()).toBe(true);
        }
        wrapper.unmount();
      }
      const propWarns = warnSpy.mock.calls.filter(args => String(args[0]).includes('Invalid prop'));
      expect(propWarns).toHaveLength(0);
    } finally {
      warnSpy.mockRestore();
    }
  });
});
