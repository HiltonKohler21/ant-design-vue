import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Cascader from '..';
import ConfigProvider from '../../config-provider';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{ value: 'hangzhou', label: 'Hangzhou' }],
  },
];

describe('Cascader v6 functional semantic classNames / styles & suffix / prefix', () => {
  it('supports functional classNames / styles for root, prefix, suffix, popup.root with ConfigProvider merge', async () => {
    document.body.innerHTML = '';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const wrapper = mount(ConfigProvider, {
        props: {
          cascader: {
            classNames: ({ props }) => ({
              root: `ctx-cas-${props.size || 'default'}`,
              prefix: 'ctx-cas-pre',
              suffix: 'ctx-cas-suf',
              popup: { root: 'ctx-cas-popup' },
            }),
            styles: {
              root: { minWidth: '150px' },
              prefix: { fontWeight: '700' },
              suffix: { opacity: '0.7' },
              popup: { root: { padding: '6px', color: 'black' } },
            },
          },
        },
        slots: {
          default: () => (
            <Cascader
              open
              size="large"
              options={options}
              prefix={<span class="cas-pre-el">P</span>}
              suffix={<span class="cas-suf-el">S</span>}
              classNames={({ props }) => ({
                root: `prop-cas-${props.size}`,
                prefix: 'prop-cas-pre',
                suffix: 'prop-cas-suf',
                popup: { root: 'prop-cas-popup' },
              })}
              styles={() => ({
                root: { borderColor: 'green' },
                prefix: { color: 'rgb(10, 20, 30)' },
                suffix: { color: 'rgb(40, 50, 60)' },
                popup: { root: { color: 'red' } },
              })}
            />
          ),
        },
        attachTo: 'body',
      });
      await nextTick();

      const rootEl = wrapper.find('.ant-cascader');
      expect(rootEl.classes()).toContain('ctx-cas-large');
      expect(rootEl.classes()).toContain('prop-cas-large');
      expect(rootEl.attributes('style')).toContain('min-width: 150px');
      expect(rootEl.attributes('style')).toContain('border-color: green');
      expect(rootEl.attributes('suffix')).toBeUndefined();

      const preEl = wrapper.find('.cas-pre-el');
      expect(preEl.classes()).toContain('ctx-cas-pre');
      expect(preEl.classes()).toContain('prop-cas-pre');
      expect(preEl.attributes('style')).toContain('font-weight: 700');
      expect(preEl.attributes('style')).toContain('color: rgb(10, 20, 30)');

      const sufEl = wrapper.find('.cas-suf-el');
      expect(sufEl.classes()).toContain('ctx-cas-suf');
      expect(sufEl.classes()).toContain('prop-cas-suf');
      expect(sufEl.attributes('style')).toContain('opacity: 0.7');
      expect(sufEl.attributes('style')).toContain('color: rgb(40, 50, 60)');

      const dropdown = document.body.querySelector('.ant-cascader-dropdown');
      expect(dropdown?.className).toContain('ctx-cas-popup');
      expect(dropdown?.className).toContain('prop-cas-popup');
      expect(dropdown?.getAttribute('style')).toContain('padding: 6px');
      expect(dropdown?.getAttribute('style')).toContain('color: red');

      const propWarns = warnSpy.mock.calls.filter(args => String(args[0]).includes('Invalid prop'));
      expect(propWarns).toHaveLength(0);
      wrapper.unmount();
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('supports suffix prop, #suffix slot, #prefix slot, and suffixIcon fallback precedence', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const wSlot = mount(Cascader, {
        props: { options },
        slots: {
          prefix: () => <span class="cas-slot-pre">PRE</span>,
          suffix: () => <span class="cas-slot-suf">SUF</span>,
          suffixIcon: () => <span class="cas-slot-legacy">OLD</span>,
        },
      });
      expect(wSlot.find('.cas-slot-pre').exists()).toBe(true);
      expect(wSlot.find('.cas-slot-suf').exists()).toBe(true);
      expect(wSlot.find('.cas-slot-legacy').exists()).toBe(false);

      const wPropWins = mount(Cascader, {
        props: {
          options,
          suffix: <span class="cas-prop-suf">NEW</span>,
          suffixIcon: <span class="cas-prop-legacy">OLD</span>,
        },
      });
      expect(wPropWins.find('.cas-prop-suf').exists()).toBe(true);
      expect(wPropWins.find('.cas-prop-legacy').exists()).toBe(false);

      const wHidden = mount(Cascader, {
        props: { options, suffix: null },
      });
      expect(wHidden.find('.ant-select-arrow').exists()).toBe(false);

      const propWarns = warnSpy.mock.calls.filter(args => String(args[0]).includes('Invalid prop'));
      expect(propWarns).toHaveLength(0);
    } finally {
      warnSpy.mockRestore();
    }
  });
});
