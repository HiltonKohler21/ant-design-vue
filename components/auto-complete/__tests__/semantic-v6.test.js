import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import AutoComplete from '..';
import ConfigProvider from '../../config-provider';

describe('AutoComplete v6 functional semantic classNames / styles & suffix', () => {
  it('supports functional classNames / styles for root, prefix, suffix, popup.root with ConfigProvider merge', async () => {
    document.body.innerHTML = '';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const wrapper = mount(ConfigProvider, {
        props: {
          autoComplete: {
            classNames: ({ props }) => ({
              root: `ctx-ac-${props.variant || 'outlined'}`,
              prefix: 'ctx-ac-pre',
              suffix: 'ctx-ac-suf',
              popup: { root: 'ctx-ac-popup' },
            }),
            styles: {
              root: { width: '200px' },
              prefix: { opacity: '0.9' },
              suffix: { opacity: '0.8' },
              popup: { root: { padding: '4px', color: 'black' } },
            },
          },
        },
        slots: {
          default: () => (
            <AutoComplete
              open
              variant="filled"
              options={[{ value: 'a', label: 'A' }]}
              prefix={<span class="ac-pre-inner">PRE</span>}
              suffix={<span class="ac-suf-inner">SUF</span>}
              classNames={({ props }) => ({
                root: `prop-ac-${props.variant}`,
                prefix: 'prop-ac-pre',
                suffix: 'prop-ac-suf',
                popup: { root: 'prop-ac-popup' },
              })}
              styles={() => ({
                root: { borderColor: 'red' },
                prefix: { color: 'rgb(1, 2, 3)' },
                suffix: { color: 'rgb(4, 5, 6)' },
                popup: { root: { color: 'blue' } },
              })}
            />
          ),
        },
        attachTo: 'body',
      });
      await nextTick();

      const rootEl = wrapper.find('.ant-select-auto-complete');
      expect(rootEl.classes()).toContain('ctx-ac-filled');
      expect(rootEl.classes()).toContain('prop-ac-filled');
      expect(rootEl.attributes('style')).toContain('width: 200px');
      expect(rootEl.attributes('style')).toContain('border-color: red');

      const preEl = wrapper.find('.ac-pre-inner');
      expect(preEl.classes()).toContain('ctx-ac-pre');
      expect(preEl.classes()).toContain('prop-ac-pre');
      expect(preEl.attributes('style')).toContain('opacity: 0.9');
      expect(preEl.attributes('style')).toContain('color: rgb(1, 2, 3)');

      const sufEl = wrapper.find('.ac-suf-inner');
      expect(sufEl.classes()).toContain('ctx-ac-suf');
      expect(sufEl.classes()).toContain('prop-ac-suf');
      expect(sufEl.attributes('style')).toContain('opacity: 0.8');
      expect(sufEl.attributes('style')).toContain('color: rgb(4, 5, 6)');

      const dropdown = document.body.querySelector('.ant-select-dropdown');
      expect(dropdown?.className).toContain('ctx-ac-popup');
      expect(dropdown?.className).toContain('prop-ac-popup');
      expect(dropdown?.getAttribute('style')).toContain('padding: 4px');
      expect(dropdown?.getAttribute('style')).toContain('color: blue');

      const propWarns = warnSpy.mock.calls.filter(args => String(args[0]).includes('Invalid prop'));
      expect(propWarns).toHaveLength(0);
      wrapper.unmount();
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('supports suffix prop, #suffix slot, and suffixIcon fallback precedence', () => {
    const wSlot = mount(AutoComplete, {
      props: { options: [] },
      slots: {
        suffix: () => <span class="ac-slot-suf">SLOT</span>,
        suffixIcon: () => <span class="ac-slot-legacy">LEGACY</span>,
      },
    });
    expect(wSlot.find('.ac-slot-suf').exists()).toBe(true);
    expect(wSlot.find('.ac-slot-legacy').exists()).toBe(false);

    const wPropWins = mount(AutoComplete, {
      props: {
        options: [],
        suffix: <span class="ac-prop-suf">PROP</span>,
        suffixIcon: <span class="ac-prop-legacy">LEGACY</span>,
      },
    });
    expect(wPropWins.find('.ac-prop-suf').exists()).toBe(true);
    expect(wPropWins.find('.ac-prop-legacy').exists()).toBe(false);

    const wLegacy = mount(AutoComplete, {
      props: {
        options: [],
        suffixIcon: <span class="ac-only-legacy">LEGACY</span>,
      },
    });
    expect(wLegacy.find('.ac-only-legacy').exists()).toBe(true);
  });
});
